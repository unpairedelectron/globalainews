import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFile, spawn, type ChildProcess } from 'node:child_process';
import { createServer, request as httpRequest, type Server } from 'node:http';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { promisify } from 'node:util';
import test from 'node:test';
import { GetNewsroomContentResponse } from '../../../lib/api-zod/src/generated/api';
import {
  authors,
  entities,
  essays,
  evidenceSummaries,
  getPublishedStories,
  getStoryWordCount,
  indiaIndex,
  industryMap,
  isPublicEditorialRelease,
  MINIMUM_STORY_WORDS,
  signals,
  sources,
  stories,
  timelineEvents,
  askGlobalAnswers,
  type Story,
} from '../src/content';
import {
  buildAuthorityGraph,
  dataProductRecords,
  researchRecords,
  topicRecords,
} from '../src/authority/registry';
import { getCanonicalUrl, getSeoMetadataManifest } from '../src/seo-metadata';

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..', '..', '..');
const webServerPath = path.join(root, 'artifacts/global-ai-news/dist/server/server.mjs');
const publicPath = path.join(root, 'artifacts/global-ai-news/dist/public');
const chromium = process.env.CHROMIUM_BIN || '/repl/tools/bin/chromium';
const longCopy = Array(100).fill(
  'This isolated publication fixture verifies that eligible content moves through the live request path without writing editorial data to any database.',
).join(' ');

function listen(server: Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') return reject(new Error('No local port assigned.'));
      resolve(address.port);
    });
  });
}

function close(server?: Server): Promise<void> {
  if (!server?.listening) return Promise.resolve();
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

function stopProcess(child?: ChildProcess): Promise<void> {
  if (!child?.pid) return Promise.resolve();
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    child.kill('SIGTERM');
  }
  return Promise.race([
    once(child, 'exit').then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, 5000)),
  ]);
}

async function waitFor(url: string, child?: ChildProcess): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child?.exitCode !== null && child?.exitCode !== undefined) {
      throw new Error(`Web server exited before ready: ${child.exitCode}`);
    }
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Keep polling until the local process is ready.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function runMobilePerformanceAudit(origin: string) {
  const profile = mkdtempSync(path.join(tmpdir(), 'gan-mobile-audit-'));
  const browser = spawn(chromium, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-cache',
    '--remote-allow-origins=*',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--window-size=402,874',
    '--force-device-scale-factor=2',
    'about:blank',
  ], { detached: true, stdio: ['ignore', 'ignore', 'pipe'] });

  let socket: WebSocket | undefined;
  let spawnError: string | undefined;
  let exitDetails: string | undefined;
  let startupStderr = '';
  browser.stderr?.on('data', (chunk: Buffer) => {
    startupStderr = `${startupStderr}${chunk.toString('utf8')}`.slice(-8_000);
  });
  browser.once('error', (error) => {
    spawnError = error.message;
  });
  browser.once('exit', (code, signal) => {
    exitDetails = `exit code=${String(code)}, signal=${String(signal)}`;
  });

  const browserDiagnostics = () => [
    spawnError ? `spawn error: ${spawnError}` : '',
    exitDetails ? `process: ${exitDetails}` : '',
    startupStderr.trim() ? `stderr: ${startupStderr.trim()}` : '',
  ].filter(Boolean).join('\n');

  try {
    const activePortFile = path.join(profile, 'DevToolsActivePort');
    const deadline = Date.now() + 60_000;
    while (!existsSync(activePortFile) && Date.now() < deadline) {
      if (spawnError || browser.exitCode !== null || browser.signalCode !== null) {
        throw new Error(`Performance browser exited before exposing DevTools.\n${browserDiagnostics()}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!existsSync(activePortFile)) {
      throw new Error(`Chrome did not publish its DevTools port within 60 seconds.\n${browserDiagnostics()}`);
    }
    const debugPort = Number(readFileSync(activePortFile, 'utf8').split('\n')[0]);
    assert.ok(Number.isInteger(debugPort) && debugPort > 0, 'Chrome published an invalid DevTools port');
    const targetDeadline = Date.now() + 10_000;
    let targets: Array<{ type: string; webSocketDebuggerUrl?: string }> = [];
    let lastProbeError = '';
    while (Date.now() < targetDeadline) {
      if (spawnError || browser.exitCode !== null || browser.signalCode !== null) {
        throw new Error(`Performance browser exited before exposing a page target.\n${browserDiagnostics()}`);
      }
      try {
        const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`, {
          signal: AbortSignal.timeout(1_000),
        });
        if (response.ok) {
          targets = await response.json() as Array<{ type: string; webSocketDebuggerUrl?: string }>;
          break;
        }
        lastProbeError = `DevTools returned HTTP ${response.status}`;
      } catch (error) {
        lastProbeError = error instanceof Error ? error.message : String(error);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const target = targets.find((item: { type: string }) => item.type === 'page');
    assert.ok(
      target?.webSocketDebuggerUrl,
      `Chrome page target is unavailable${lastProbeError ? `: ${lastProbeError}` : ''}\n${browserDiagnostics()}`,
    );
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timed out connecting to Chrome DevTools.')), 10_000);
      socket!.addEventListener('open', () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
      socket!.addEventListener('error', () => {
        clearTimeout(timeout);
        reject(new Error(`Could not connect to Chrome DevTools.\n${browserDiagnostics()}`));
      }, { once: true });
    });

    let commandId = 0;
    let currentRoute = 'browser setup';
    let currentLoad: (() => void) | undefined;
    const pending = new Map<number, {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
      timeout: ReturnType<typeof setTimeout>;
    }>();
    let requestInfo = new Map<string, { url: string; type: string; origin: string; loaderId?: string }>();
    let completedResources: Array<{ url: string; type: string; origin: string; bytes: number; loaderId?: string }> = [];
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const waiter = pending.get(message.id);
        if (waiter) {
          pending.delete(message.id);
          clearTimeout(waiter.timeout);
          if (message.error) waiter.reject(new Error(message.error.message));
          else waiter.resolve(message.result);
        }
      } else if (message.method === 'Page.loadEventFired') {
        currentLoad?.();
        currentLoad = undefined;
      } else if (message.method === 'Network.responseReceived') {
        const { requestId, response, type, loaderId } = message.params;
        requestInfo.set(requestId, {
          url: response.url,
          type: type ?? response.mimeType,
          origin: new URL(response.url).origin,
          loaderId,
        });
      } else if (message.method === 'Network.loadingFinished') {
        const resource = requestInfo.get(message.params.requestId);
        if (resource) completedResources.push({ ...resource, bytes: message.params.encodedDataLength });
        requestInfo.delete(message.params.requestId);
      } else if (message.method === 'Network.loadingFailed') {
        requestInfo.delete(message.params.requestId);
      }
    });

    const cdp = (method: string, params: Record<string, unknown> = {}) => new Promise<any>((resolve, reject) => {
      const id = ++commandId;
      const timeoutMs = method === 'Runtime.evaluate' ? 45_000 : 20_000;
      const timeout = setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error(
            `Timed out waiting for Chrome DevTools command ${method} on ${currentRoute} after ${timeoutMs}ms.\n${browserDiagnostics()}`,
          ));
        }
      }, timeoutMs);
      pending.set(id, { resolve, reject, timeout });
      socket!.send(JSON.stringify({ id, method, params }));
    });

    await cdp('Page.enable');
    await cdp('Runtime.enable');
    await cdp('Network.enable');
    await cdp('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp('Emulation.setDeviceMetricsOverride', {
      width: 402, height: 874, deviceScaleFactor: 2, mobile: true,
    });
    await cdp('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 200 * 1024,
      uploadThroughput: 93_750,
      connectionType: 'cellular4g',
    });
    await cdp('Page.addScriptToEvaluateOnNewDocument', {
      source: `(() => {
        window.__ganMobileAudit = { lcp: null, lcpElement: null, cls: 0 };
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const element = entry.element;
              window.__ganMobileAudit.lcp = entry.startTime;
              window.__ganMobileAudit.lcpElement = {
                tag: element?.tagName?.toLowerCase() ?? null,
                id: element?.id ?? null,
                text: element?.textContent?.trim().slice(0, 80) ?? null,
                url: entry.url || element?.currentSrc || null,
              };
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__ganMobileAudit.cls += entry.value;
          }).observe({ type: 'layout-shift', buffered: true });
        } catch {}
      })();`,
    });

    const routes = [
      '/',
      '/article/india-ai-compute-access-2026',
      '/reports',
      '/topic/india',
      '/company/openai',
      '/about-us',
    ];
    const measurements = [];
    for (const route of routes) {
      currentRoute = route;
      requestInfo = new Map();
      completedResources = [];
      const loaded = new Promise<void>((resolve) => { currentLoad = resolve; });
      const { loaderId } = await cdp('Page.navigate', { url: `${origin}${route}` });
      assert.ok(loaderId, `Chrome did not return a navigation loader ID for ${route}`);
      let loadTimeout: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          loaded,
          new Promise((_, reject) => {
            loadTimeout = setTimeout(() => reject(new Error(`Page load timed out for ${route}`)), 35_000);
          }),
        ]);
      } finally {
        if (loadTimeout) clearTimeout(loadTimeout);
      }
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      const pageMetrics = await cdp('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const resources = performance.getEntriesByType('resource');
          const js = resources.filter((r) => r.initiatorType === 'script' || /\\.m?js(?:[?#]|$)/i.test(r.name));
          const images = resources.filter((r) => r.initiatorType === 'img' || /\\.(?:png|jpe?g|webp|avif|gif|svg)(?:[?#]|$)/i.test(r.name));
          const bytes = (entries) => entries.reduce((sum, r) => sum + (r.transferSize || r.encodedBodySize || 0), 0);
          const thirdPartyScripts = [...new Set(js.map((r) => new URL(r.name).origin).filter((host) => host !== location.origin))];
          return {
            ttfbMs: nav ? Math.round(nav.responseStart) : null,
            lcpMs: window.__ganMobileAudit?.lcp == null ? null : Math.round(window.__ganMobileAudit.lcp),
            lcpElement: window.__ganMobileAudit?.lcpElement ?? null,
            cls: Number((window.__ganMobileAudit?.cls ?? 0).toFixed(4)),
            rootText: document.querySelector('#root')?.textContent ?? '',
            moduleScriptCount: document.querySelectorAll('script[type="module"]').length,
            prerenderMarkerPresent: Boolean(document.getElementById('global-ai-prerender')),
            jsResourceCount: js.length,
            jsBytesFromTiming: bytes(js),
            imageResourceCount: images.length,
            imageBytesFromTiming: bytes(images),
            resourceTimingCount: resources.length,
            thirdPartyScripts
          };
        })()`,
      });
      const cdpBytes = completedResources.reduce((sum, resource) => sum + resource.bytes, 0);
      // A request from the previous route can finish after navigation starts.
      // Attribute resources by Chromium's loader ID, not by event completion time.
      const routeResources = completedResources.filter((resource) => resource.loaderId === loaderId);
      const jsResources = routeResources.filter((resource) => resource.type === 'Script');
      const imageResources = routeResources.filter((resource) => resource.type === 'Image');
      const thirdPartyScripts = [...new Set(jsResources
        .filter((resource) => resource.origin !== origin)
        .map((resource) => resource.origin))];
      const { rootText, ...measuredPageMetrics } = pageMetrics.result.value;
      if (route === '/reports') {
        assert.match(rootText, /Reports\./, 'Reports first-response content was replaced or lost');
      } else if (route === '/about-us') {
        assert.match(rootText, /Who speaks for the publication/, 'About first-response content was replaced or lost');
      }
      if (['/reports', '/about-us'].includes(route)) {
        assert.equal(pageMetrics.result.value.moduleScriptCount, 0, `${route}: static first response must not boot the mismatched SPA shell`);
        assert.equal(pageMetrics.result.value.prerenderMarkerPresent, true, `${route}: static first response lost its prerender marker`);
        const unexpectedScripts = jsResources.filter((resource) => {
          const scriptUrl = new URL(resource.url);
          const isClarityTag = scriptUrl.origin === 'https://www.clarity.ms'
            && scriptUrl.pathname === '/tag/x8gfztdtd7';
          const isClaritySdk = scriptUrl.origin === 'https://scripts.clarity.ms'
            && scriptUrl.pathname.endsWith('/clarity.js');
          return !isClarityTag && !isClaritySdk;
        });
        assert.equal(
          unexpectedScripts.length,
          0,
          `${route}: static first response unexpectedly downloaded application JavaScript: ${unexpectedScripts.map((resource) => resource.url).join(', ')}`,
        );
        assert.ok(
          measuredPageMetrics.lcpMs !== null && measuredPageMetrics.lcpMs <= 2_200,
          `${route}: static first-response LCP exceeded the 2.2 s mobile budget (${measuredPageMetrics.lcpMs} ms)`,
        );
        assert.ok(
          measuredPageMetrics.cls <= 0.02,
          `${route}: static first-response CLS exceeded the 0.02 budget (${measuredPageMetrics.cls})`,
        );
        assert.equal(
          completedResources.some((resource) => resource.url.endsWith('/api/newsroom/content')),
          false,
          `${route}: static first response unexpectedly fetched the full newsroom snapshot`,
        );
      }
      if (route === '/' || route.startsWith('/article/')) {
        assert.ok(
          measuredPageMetrics.lcpMs !== null && measuredPageMetrics.lcpMs <= 2_700,
          `${route}: homepage/article LCP exceeded the no-regression budget (${measuredPageMetrics.lcpMs} ms)`,
        );
        assert.ok(
          measuredPageMetrics.cls <= 0.05,
          `${route}: homepage/article CLS exceeded the no-regression budget (${measuredPageMetrics.cls})`,
        );
      }
      measurements.push({
        route,
        ...measuredPageMetrics,
        inpMs: null,
        inpNote: 'Not measured: this navigation-only run does not include real user interaction.',
        totalTransferredBytes: cdpBytes,
        jsBytesTransferred: jsResources.reduce((sum, resource) => sum + resource.bytes, 0),
        imageBytesTransferred: imageResources.reduce((sum, resource) => sum + resource.bytes, 0),
        thirdPartyScriptOrigins: thirdPartyScripts,
        topTransferredResources: [...completedResources]
          .sort((a, b) => b.bytes - a.bytes)
          .slice(0, 8)
          .map((resource) => ({
            type: resource.type,
            bytes: resource.bytes,
            url: resource.url.split('?')[0],
          })),
        fontResources: completedResources
          .filter((resource) => resource.type === 'Font' || /\.(?:woff2?|ttf|otf)(?:[?#]|$)/i.test(resource.url))
          .map((resource) => ({ bytes: resource.bytes, url: resource.url.split('?')[0] })),
        networkProfile: 'mobile emulation: 402×874 CSS px, 4× CPU, 150 ms RTT, 1.6 Mbps down / 0.75 Mbps up',
      });
    }
    return measurements;
  } finally {
    socket?.close();
    await stopProcess(browser);
    rmSync(profile, { recursive: true, force: true });
  }
}

function xmlEscape(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function treeHash(directory: string): string {
  const hash = createHash('sha256');
  const visit = (current: string) => {
    for (const name of readdirSync(current).sort()) {
      const file = path.join(current, name);
      const relative = path.relative(directory, file);
      if (statSync(file).isDirectory()) visit(file);
      else {
        hash.update(relative);
        hash.update(readFileSync(file));
      }
    }
  };
  visit(directory);
  return hash.digest('hex');
}

function newFixtureStory(slug: string, now: Date): Story {
  const template = stories.find((story) => story.slug === 'indias-public-ai-stack');
  assert.ok(template, 'maintained article template must exist');
  return {
    ...template,
    slug,
    title: 'An isolated publication appears without a rebuild',
    dek: 'A local in-memory fixture checks request-time publication across every public feed.',
    body: [{ heading: 'Request-time publication', paragraphs: [longCopy] }],
    date: now.toISOString().slice(0, 10),
    dateModified: undefined,
    readTime: '4 min read',
    relatedStories: [],
    bottomLine: 'The fixture is eligible and exists only in process memory.',
    whyItMatters: 'It verifies that public surfaces can reflect a new release without replacing built assets.',
    keyTakeaways: ['The API snapshot is request-time.', 'The first response includes article metadata.'],
    whatChanges: 'No production database or automation is involved.',
  };
}

function makeSnapshot(publicStories: Story[]) {
  const publishedStorySlugs = new Set(publicStories.map((story) => story.slug));
  const publicResearchRecords = researchRecords.filter(
    (record) => record.status === 'published' && publishedStorySlugs.has(record.storySlug),
  );
  const publicDataProducts = dataProductRecords.filter(
    (record) =>
      record.status === 'published' &&
      record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
  );
  const publicTopics = topicRecords.filter(
    (record) => record.indexable && record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
  );
  const citedSources = new Set([
    ...publicStories.flatMap((story) => story.sources),
    ...publicResearchRecords.flatMap((record) => record.sourceSlugs),
    ...publicDataProducts.flatMap((record) => record.sourceSlugs),
    ...publicTopics.flatMap((record) => record.sourceSlugs),
  ]);
  return GetNewsroomContentResponse.parse({
    generatedAt: new Date().toISOString(),
    source: 'maintained-editorial-source',
    stale: false,
    authors,
    sources: sources.filter((source) => citedSources.has(source.slug)),
    evidenceSummaries,
    entities,
    timelineEvents,
    stories: publicStories.map(({ updatedAt: _updatedAt, ...story }) => story),
    researchRecords: publicResearchRecords,
    dataProducts: publicDataProducts,
    topics: publicTopics,
    authorityEdges: buildAuthorityGraph(publicStories),
    signals,
    industryMap,
    indiaIndex,
    essays,
    askGlobalAnswers,
  });
}

function createInMemoryApi(getStories: () => Story[]): Server {
  return createServer((request, response) => {
    const route = request.url ?? '/';
    const publicStories = getStories();
    const snapshot = makeSnapshot(publicStories);
    const metadata = getSeoMetadataManifest(publicStories, snapshot.generatedAt, snapshot.sources);
    if (route === '/api/healthz') {
      response.writeHead(200, { 'content-type': 'application/json' }).end('{"ok":true}');
    } else if (route === '/api/newsroom/content') {
      response.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
        .end(JSON.stringify(snapshot));
    } else if (route === '/api/newsroom/metadata') {
      response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(metadata));
    } else if (route === '/api/newsroom/feed.xml') {
      const entries = publicStories.map((story) =>
        `<item><title>${xmlEscape(story.title)}</title><link>${getCanonicalUrl(`/article/${story.slug}`)}</link><guid>${getCanonicalUrl(`/article/${story.slug}`)}</guid><description>${xmlEscape(story.dek)}</description><pubDate>${new Date(`${story.date}T00:00:00Z`).toUTCString()}</pubDate></item>`,
      ).join('');
      response.writeHead(200, { 'content-type': 'application/rss+xml; charset=utf-8' })
        .end(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Global AI News</title>${entries}</channel></rss>`);
    } else if (route === '/api/newsroom/sitemap-index.xml') {
      const links = ['articles', 'topics', 'authors', 'static']
        .map((group) => `<sitemap><loc>${SITE_URL}/sitemap-${group}.xml</loc></sitemap>`).join('');
      response.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' })
        .end(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${links}</sitemapindex>`);
    } else if (route === '/api/newsroom/sitemap-articles.xml') {
      const urls = metadata.routes.filter((entry) => entry.indexable !== false && entry.path.startsWith('/article/'))
        .map((entry) => `<url><loc>${getCanonicalUrl(entry.path)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}</url>`).join('');
      response.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' })
        .end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
    } else if (route === '/api/newsroom/sitemap-topics.xml' || route === '/api/newsroom/sitemap-authors.xml' || route === '/api/newsroom/sitemap-static.xml') {
      response.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' })
        .end('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    } else if (route === '/api/newsroom/sitemap.xml') {
      const urls = metadata.routes.filter((entry) => entry.indexable !== false)
        .map((entry) => `<url><loc>${getCanonicalUrl(entry.path)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}</url>`).join('');
      response.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' })
        .end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
    } else {
      response.writeHead(404).end('not found');
    }
  });
}

test('isolated publication reaches article, homepage, RSS, and sitemap without a rebuild', { timeout: 240_000 }, async () => {
  assert.ok(existsSync(webServerPath), 'run build:production before the isolated publication fixture');
  assert.ok(existsSync(chromium), `Chromium is required for homepage verification: ${chromium}`);
  const originalStories = getPublishedStories();
  let publicStories = [...originalStories];
  const apiServer = createInMemoryApi(() => publicStories);
  let webProcess: ChildProcess | undefined;
  let webPort: number | undefined;
  let proxyServer: Server | undefined;

  try {
    const apiPort = await listen(apiServer);
    const apiOrigin = `http://127.0.0.1:${apiPort}`;
    const fixtureDate = new Date();
    const story = newFixtureStory(`isolated-release-${process.pid}`, fixtureDate);
    assert.ok(getStoryWordCount(story) >= MINIMUM_STORY_WORDS);
    assert.ok(isPublicEditorialRelease('published', fixtureDate, getStoryWordCount(story), fixtureDate));
    publicStories.unshift(story);

    webPort = await new Promise<number>((resolve, reject) => {
      const probe = createServer();
      probe.once('error', reject);
      probe.listen(0, '127.0.0.1', () => {
        const address = probe.address();
        if (!address || typeof address === 'string') return reject(new Error('No web port assigned.'));
        probe.close((error) => error ? reject(error) : resolve(address.port));
      });
    });
    const webOrigin = `http://127.0.0.1:${webPort}`;
    webProcess = spawn('node', [webServerPath], {
      cwd: root,
      detached: true,
      env: { ...process.env, NODE_ENV: 'test', PORT: String(webPort), NEWSROOM_API_ORIGIN: apiOrigin },
      stdio: 'ignore',
    });
    await waitFor(`${webOrigin}/`, webProcess);

    proxyServer = createServer((incoming, outgoing) => {
      const destination = incoming.url?.startsWith('/api/') ? apiOrigin : webOrigin;
      const upstream = httpRequest(new URL(incoming.url ?? '/', destination), {
        method: incoming.method,
        headers: { ...incoming.headers, host: new URL(destination).host },
      }, (response) => {
        outgoing.writeHead(response.statusCode ?? 502, response.headers);
        response.pipe(outgoing);
      });
      upstream.on('error', () => {
        if (!outgoing.headersSent) outgoing.writeHead(502);
        outgoing.end();
      });
      incoming.pipe(upstream);
    });
    const proxyPort = await listen(proxyServer);
    const proxyOrigin = `http://127.0.0.1:${proxyPort}`;

    const beforeAssets = treeHash(publicPath);
    const articleResponse = await fetch(`${webOrigin}/article/${story.slug}`);
    const articleHtml = await articleResponse.text();
    assert.equal(articleResponse.status, 200);
    assert.match(articleHtml, new RegExp(`<h1[^>]*>${story.title}</h1>`));
    assert.match(articleHtml, /name="description"/);
    assert.match(articleHtml, new RegExp(`<link rel="canonical" href="${getCanonicalUrl(`/article/${story.slug}`)}" \\/>`));
    for (const [route, expectedContent] of [
      ['/reports', /<h1[^>]*>Reports/],
      ['/about-us', /Who speaks for the publication/],
    ] as const) {
      const response = await fetch(`${webOrigin}${route}`);
      const html = await response.text();
      assert.equal(response.status, 200, `${route}: static first response is not reachable`);
      assert.match(html, expectedContent, `${route}: prerendered page content is missing`);
      assert.match(html, /id="global-ai-prerender"/, `${route}: prerender marker is missing`);
      assert.match(html, /data-static-prerender-theme/, `${route}: theme preference bootstrap is missing`);
      assert.match(html, /data-static-prerender-vitals/, `${route}: web-vitals tracking bootstrap is missing`);
      assert.doesNotMatch(html, /<script\b[^>]*\btype=["']module["']/i, `${route}: should not load the mismatched SPA shell`);
      assert.doesNotMatch(html, /<link\b[^>]*\brel=["']modulepreload["']/i, `${route}: should not preload unused application modules`);
    }

    const [apiFeed, rootFeed, apiSitemap, rootSitemap, apiArticleSitemap, rootArticleSitemap] = await Promise.all([
      fetch(`${apiOrigin}/api/newsroom/feed.xml`).then((response) => response.text()),
      fetch(`${webOrigin}/feed.xml`).then((response) => response.text()),
      fetch(`${apiOrigin}/api/newsroom/sitemap-index.xml`).then((response) => response.text()),
      fetch(`${webOrigin}/sitemap.xml`).then((response) => response.text()),
      fetch(`${apiOrigin}/api/newsroom/sitemap-articles.xml`).then((response) => response.text()),
      fetch(`${webOrigin}/sitemap-articles.xml`).then((response) => response.text()),
    ]);
    assert.equal(rootFeed, apiFeed);
    assert.equal(rootSitemap, apiSitemap);
    assert.equal(rootArticleSitemap, apiArticleSitemap);
    assert.ok(apiFeed.includes(getCanonicalUrl(`/article/${story.slug}`)));
    assert.ok(apiArticleSitemap.includes(getCanonicalUrl(`/article/${story.slug}`)));

    const { stdout: homepageHtml } = await execFileAsync(chromium, [
      '--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage',
      '--virtual-time-budget=10000', '--dump-dom', `${proxyOrigin}/`,
    ], { timeout: 60_000, maxBuffer: 8 * 1024 * 1024 });
    assert.ok(homepageHtml.includes(story.title), 'the hydrated homepage must show the new publication');
    assert.equal(treeHash(publicPath), beforeAssets, 'publication must not rebuild or mutate static assets');
    const mobilePerformance = await runMobilePerformanceAudit(proxyOrigin);
    process.stdout.write(`MOBILE PERFORMANCE (local production build): ${JSON.stringify(mobilePerformance)}\n`);

    const snapshot = await fetch(`${apiOrigin}/api/newsroom/content`).then((response) => response.json());
    assert.ok(snapshot.stories.some((candidate: { slug: string }) => candidate.slug === story.slug));
    assert.equal(snapshot.stories.length, originalStories.length + 1);
    process.stdout.write('PASS: in-memory publication -> first-response article -> homepage -> RSS/sitemap API and roots; built assets unchanged\n');
  } finally {
    await stopProcess(webProcess);
    await close(proxyServer);
    await close(apiServer);
    publicStories = originalStories;
  }
});