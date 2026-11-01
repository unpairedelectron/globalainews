import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { realpathSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createServer as createHttpServer, request as httpRequest } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import { once } from 'node:events';
import { request as httpsRequest } from 'node:https';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const artifactRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stagingArticlesRoot = path.join(artifactRoot, 'public/staging/article');
const serverEntrypoint = path.join(artifactRoot, 'dist/server/server.mjs');
let baseUrl = (process.env.PREVIEW_AUDIT_URL ?? '').replace(/\/+$/, '');
let productionServer;
let previewProxyServer;
const chromiumPath = process.env.CHROMIUM_BIN ?? '/repl/tools/bin/chromium';
const publicRoutes = ['/', '/brief/', '/reports/', '/topic/india/'];
const expectedPublicHeadings = new Map([
  ['/', 'Know what changed.'],
  ['/brief/', 'The Daily Brief.'],
  ['/reports/', 'Reports.'],
  ['/topic/india/', 'India Watch.'],
]);
const hydratedPublicRoutes = new Set(['/', '/brief/', '/topic/india/']);
const normalizeHeading = (heading) => heading.replace(/\s+/g, '').toLowerCase();
const lighthouseCategories = ['performance', 'accessibility', 'best-practices'];
const lighthouseMinimums = {
  mobile: { performance: 80, accessibility: 95, 'best-practices': 70 },
  desktop: { performance: 95, accessibility: 95, 'best-practices': 70 },
};
const failures = [];
const results = [];
const lighthouseRequire = createRequire(realpathSync(fileURLToPath(import.meta.resolve('lighthouse'))));
const { launch: launchChrome } = lighthouseRequire('chrome-launcher');

function record(route, check, passed, detail) {
  results.push({ route, check, status: passed ? 'PASS' : 'FAIL', detail });
  if (!passed) failures.push(`${route} [${check}]: ${detail}`);
}

function getApiOrigin() {
  return process.env.PREVIEW_AUDIT_API_URL
    ?? process.env.NEWSROOM_API_ORIGIN
    ?? 'http://127.0.0.1:8080';
}

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createNetServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Could not select a port for the production preview.')));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

async function startProductionPreview() {
  const appPort = await findFreePort();
  const proxyPort = await findFreePort();
  const appOrigin = `http://127.0.0.1:${appPort}`;
  baseUrl = appOrigin;
  const apiOrigin = getApiOrigin();
  productionServer = spawn(process.execPath, ['--enable-source-maps', serverEntrypoint], {
    cwd: path.resolve(artifactRoot, '..', '..'),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(appPort),
      NEWSROOM_API_ORIGIN: apiOrigin,
    },
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  const deadline = Date.now() + 30_000;
  let lastError = 'no response';
  while (Date.now() < deadline) {
    if (productionServer.exitCode !== null) {
      throw new Error(`Production preview exited before becoming ready (status ${productionServer.exitCode}).`);
    }
    try {
      const response = await fetch(`${appOrigin}/healthz`);
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Production preview did not become ready: ${lastError}.`);
}

async function startPreviewProxy() {
  const appOrigin = new URL(baseUrl);
  const apiOrigin = new URL(getApiOrigin());
  previewProxyServer = createHttpServer((request, response) => {
    const requestPath = request.url ?? '/';
    const upstreamOrigin = requestPath === '/api'
      || requestPath.startsWith('/api/')
      ? apiOrigin
      : appOrigin;
    const upstreamUrl = new URL(requestPath, upstreamOrigin);
    const headers = { ...request.headers };
    for (const header of ['host', 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade']) {
      delete headers[header];
    }
    const method = request.method ?? 'GET';
    const upstreamRequest = (upstreamUrl.protocol === 'https:' ? httpsRequest : httpRequest)(upstreamUrl, {
      method,
      headers,
    }, (upstreamResponse) => {
      const responseHeaders = { ...upstreamResponse.headers };
      for (const header of ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade']) {
        delete responseHeaders[header];
      }
      response.writeHead(upstreamResponse.statusCode ?? 502, responseHeaders);
      upstreamResponse.pipe(response);
    });
    upstreamRequest.setTimeout(30_000, () => upstreamRequest.destroy(new Error('Upstream request timed out.')));
    upstreamRequest.once('error', (error) => {
      if (response.headersSent) {
        response.destroy(error);
        return;
      }
      response.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Preview audit proxy could not reach an upstream service.');
      process.stderr.write(`Preview audit proxy request failed: ${error.message}\n`);
    });
    request.once('aborted', () => upstreamRequest.destroy());
    request.pipe(upstreamRequest);
  });

  const proxyPort = await findFreePort();
  await new Promise((resolve, reject) => {
    previewProxyServer.once('error', reject);
    previewProxyServer.listen(proxyPort, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${proxyPort}`;
}

async function stopProductionPreview() {
  if (previewProxyServer?.listening) {
    await new Promise((resolve) => previewProxyServer.close(resolve));
  }
  if (!productionServer || productionServer.exitCode !== null) return;
  const exited = once(productionServer, 'exit').catch(() => {});
  productionServer.kill('SIGTERM');
  await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 5_000))]);
  if (productionServer.exitCode === null) {
    productionServer.kill('SIGKILL');
    await exited;
  }
}

async function getPreviewRoutes() {
  const entries = await readdir(stagingArticlesRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => `/staging/article/${encodeURIComponent(entry.name)}/`)
    .sort();
}

async function checkRoutesReachable(routes) {
  const unreachable = [];
  for (const route of routes) {
    try {
      const response = await fetch(new URL(route, `${baseUrl}/`), { redirect: 'follow' });
      if (!response.ok) unreachable.push(`${route} returned HTTP ${response.status}`);
    } catch (error) {
      unreachable.push(`${route} could not be reached (${error.message})`);
    }
  }
  if (unreachable.length) {
    throw new Error(`Preview target ${baseUrl} is not ready:\n${unreachable.join('\n')}`);
  }
}

async function auditBrowserRoutes(routes) {
  const browser = await chromium.launch({
    executablePath: chromiumPath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 360, height: 800 },
      colorScheme: 'dark',
      reducedMotion: 'reduce',
    });

    for (const route of routes) {
      const page = await context.newPage();
      page.setDefaultTimeout(10_000);
      try {
        await page.goto(new URL(route, `${baseUrl}/`).toString(), { waitUntil: 'domcontentloaded' });
        const expectedHeading = expectedPublicHeadings.get(route);
        await page.waitForFunction(
          ({ expected, requiresHydration }) => {
            const heading = document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim();
            if (!heading || document.querySelector('vite-error-overlay')) return false;
            const normalize = (value) => value.replace(/\s+/g, '').toLowerCase();
            if (expected && normalize(heading) !== normalize(expected)) return false;
            return !requiresHydration || Boolean(document.querySelector('[data-testid="button-theme-toggle"]'));
          },
          { expected: expectedHeading ?? null, requiresHydration: hydratedPublicRoutes.has(route) },
          { timeout: 15_000 },
        ).catch(() => {});
        await page.evaluate(() => Promise.race([
          document.fonts?.ready ?? Promise.resolve(),
          new Promise((resolve) => setTimeout(resolve, 2_000)),
        ]));

        const pageContent = await page.evaluate(() => ({
          heading: document.querySelector('h1')?.textContent?.trim() ?? '',
          title: document.title,
          bodyText: document.body?.innerText?.slice(0, 500) ?? '',
          viteError: Boolean(document.querySelector('vite-error-overlay')),
          themeToggle: Boolean(document.querySelector('[data-testid="button-theme-toggle"]')),
        }));
        const hasContent = Boolean(pageContent.heading && pageContent.title && !pageContent.viteError)
          && (!hydratedPublicRoutes.has(route) || pageContent.themeToggle)
          && !pageContent.bodyText.includes("Cannot read properties of undefined");
        record(
          route,
          'page readiness',
          hasContent && (!expectedHeading || normalizeHeading(pageContent.heading) === normalizeHeading(expectedHeading)),
          hasContent
            ? `title and heading loaded: "${pageContent.heading.slice(0, 80)}"`
            : `expected page content missing or runtime error present (title="${pageContent.title}", h1="${pageContent.heading}", body="${pageContent.bodyText.replace(/\s+/g, ' ').slice(0, 120)}", viteError=${pageContent.viteError})`,
        );
        if (!hasContent || (expectedHeading && normalizeHeading(pageContent.heading) !== normalizeHeading(expectedHeading))) continue;

        const viewport = await page.evaluate(() => ({
          width: document.documentElement.clientWidth,
          scrollWidth: Math.max(
            document.documentElement.scrollWidth,
            document.body?.scrollWidth ?? 0,
          ),
          darkPreference: matchMedia('(prefers-color-scheme: dark)').matches,
        }));
        record(
          route,
          '360px dark-mode layout',
          viewport.darkPreference && viewport.scrollWidth <= viewport.width + 1,
          `viewport=${viewport.width}px, document=${viewport.scrollWidth}px, dark=${viewport.darkPreference}`,
        );

        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const criticalViolations = axe.violations.filter(
          (violation) => violation.impact === 'critical' || violation.impact === 'serious',
        );
        const violationSummary = criticalViolations
          .map((violation) => `${violation.id} (${violation.impact})`)
          .join(', ');
        record(
          route,
          'dark-mode accessibility',
          criticalViolations.length === 0,
          criticalViolations.length ? violationSummary : `0 serious/critical axe violations (${axe.violations.length} lower-impact)`,
        );

        await page.evaluate(() => {
          document.activeElement instanceof HTMLElement && document.activeElement.blur();
          window.scrollTo(0, 0);
        });
        await page.keyboard.press('Tab');
        const focus = await page.evaluate(() => {
          const element = document.activeElement;
          if (!(element instanceof HTMLElement) || element === document.body) return null;
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const visible = rect.width > 0 && rect.height > 0
            && rect.bottom > 0 && rect.top < innerHeight
            && rect.right > 0 && rect.left < innerWidth
            && style.visibility !== 'hidden' && style.display !== 'none';
          const hasFocusCue = style.outlineStyle !== 'none'
            && Number.parseFloat(style.outlineWidth) > 0;
          return {
            tag: element.tagName.toLowerCase(),
            label: (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 60),
            visible,
            hasFocusCue,
          };
        });
        record(
          route,
          'keyboard focus',
          Boolean(focus?.visible && focus.hasFocusCue),
          focus
            ? `first Tab: <${focus.tag}> "${focus.label}", visible=${focus.visible}, focus cue=${focus.hasFocusCue}`
            : 'first Tab did not focus an element',
        );

        const summary = page.locator('details > summary').first();
        if (await summary.count()) {
          const disclosure = page.locator('details').first();
          const wasOpen = await disclosure.evaluate((element) => element.hasAttribute('open'));
          await summary.focus();
          await page.keyboard.press('Enter');
          const toggled = await disclosure.evaluate((element) => element.hasAttribute('open')) !== wasOpen;
          record(route, 'keyboard disclosure', toggled, toggled ? 'Enter toggled the first disclosure' : 'Enter did not toggle the first disclosure');
        } else {
          record(route, 'keyboard disclosure', true, 'no disclosure controls on this route');
        }
      } catch (error) {
        record(route, 'browser checks', false, error.message);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

async function auditLighthouseRoutes(routes) {
  const { default: lighthouse } = await import('lighthouse');
  const chrome = await launchChrome({
    chromePath: chromiumPath,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    for (const route of routes) {
      for (const device of ['mobile', 'desktop']) {
        try {
          const url = new URL(route, `${baseUrl}/`).toString();
          const result = await lighthouse(url, {
            port: chrome.port,
            logLevel: 'error',
            output: 'json',
            onlyCategories: lighthouseCategories,
            formFactor: device,
            screenEmulation: device === 'mobile'
              ? { mobile: true, width: 360, height: 800, deviceScaleFactor: 1, disabled: false }
              : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: true },
          });
          assert.ok(result?.lhr, `${route} ${device}: Lighthouse returned no report`);
          const categories = result.lhr.categories;
          const scores = Object.fromEntries(lighthouseCategories.map((category) => [
            category,
            Math.round((categories[category]?.score ?? 0) * 100),
          ]));
          const limits = lighthouseMinimums[device];
          const webVitals = {
            fcp: Math.round(result.lhr.audits['first-contentful-paint']?.numericValue ?? 0),
            lcp: Math.round(result.lhr.audits['largest-contentful-paint']?.numericValue ?? 0),
            tbt: Math.round(result.lhr.audits['total-blocking-time']?.numericValue ?? 0),
            cls: Number((result.lhr.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
            speedIndex: Math.round(result.lhr.audits['speed-index']?.numericValue ?? 0),
          };
          const regressions = lighthouseCategories
            .filter((category) => scores[category] < limits[category])
            .map((category) => `${category} ${scores[category]} < ${limits[category]}`);
          const failedPerformanceAudits = regressions.some((regression) => regression.startsWith('performance '))
            ? categories.performance.auditRefs
              .filter((audit) => audit.weight > 0 && result.lhr.audits[audit.id]?.score !== null && result.lhr.audits[audit.id]?.score < 1)
              .sort((left, right) => right.weight - left.weight)
              .slice(0, 4)
              .map((audit) => {
                const failedAudit = result.lhr.audits[audit.id];
                return failedAudit?.displayValue
                  ? `${failedAudit.title} (${failedAudit.displayValue})`
                  : failedAudit?.title;
              })
              .filter(Boolean)
            : [];
          const timingDetails = `FCP=${webVitals.fcp}ms LCP=${webVitals.lcp}ms TBT=${webVitals.tbt}ms CLS=${webVitals.cls} SI=${webVitals.speedIndex}ms`;
          record(
            route,
            `Lighthouse ${device}`,
            regressions.length === 0,
            `${lighthouseCategories.map((category) => `${category}=${scores[category]} (min ${limits[category]})`).join(', ')}, ${timingDetails}${regressions.length ? `; regressions: ${regressions.join(', ')}${failedPerformanceAudits.length ? `; performance audits: ${failedPerformanceAudits.join(', ')}` : ''}` : ''}`,
          );
        } catch (error) {
          record(route, `Lighthouse ${device}`, false, error.message);
        }
        console.log(`Audited ${route} (${device}).`);
      }
    }
  } finally {
    await chrome.kill();
  }
}

function printReport() {
  console.log('\nPreview regression audit');
  console.log(`Target: ${baseUrl}`);
  console.log('Route | Check | Result | Details');
  for (const result of results) {
    console.log(`${result.route} | ${result.check} | ${result.status} | ${result.detail}`);
  }
  console.log(`\n${results.length - failures.length} passed; ${failures.length} failed.`);
  if (failures.length) {
    console.error('\nCritical regressions:');
    for (const failure of failures) console.error(`- ${failure}`);
  }
}

async function main() {
  try {
    if (!baseUrl) {
      await startProductionPreview();
      await startPreviewProxy();
    }
    const previewRoutes = await getPreviewRoutes();
    if (previewRoutes.length === 0) {
      throw new Error(`No generated staging articles found under ${stagingArticlesRoot}. Run build:staging first.`);
    }
    const routes = [...previewRoutes, ...publicRoutes];
    await checkRoutesReachable(routes);
    console.log(`Auditing ${previewRoutes.length} staging articles and ${publicRoutes.length} public routes at ${baseUrl}.`);
    await auditBrowserRoutes(routes);
    await auditLighthouseRoutes(routes);
    printReport();
    if (failures.length) process.exitCode = 1;
  } finally {
    await stopProductionPreview();
  }
}

main().catch((error) => {
  console.error(`Preview regression audit could not run: ${error.message}`);
  process.exitCode = 1;
});
