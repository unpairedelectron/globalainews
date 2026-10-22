import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { copyFileSync, createReadStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { after, before, test } from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist', 'public');
const publicDir = path.join(root, 'public');
const site = 'https://globalainews.in';
const siteOrigin = new URL(site).origin;
let apiOrigin = process.env.SMOKE_API_ORIGIN ?? 'http://127.0.0.1:19820';
const chromium = process.env.CHROMIUM_BIN || '/repl/tools/bin/chromium';
const port = 0;
const devPort = 19821;
const socialPreviewCacheControl = 'public, max-age=86400, must-revalidate';
const previewTitleColor = '#101820';
const previewTitleContrastLumaMax = 0.3;
const previewTitleMaskFuzz = '12%';
const previewTitleX = 80;
const previewTitleBaselineY = 268;
const previewTitleWidth = 1040;
const intentional404Routes = new Set(['/sign-in', '/sign-up']);
const ampPath = '/amp/article/ai-models-antibiotic-discovery/';
const tsx = path.join(root, 'node_modules', '.bin', 'tsx');
const smokeEditorId = 'mobile-history-smoke-editor';
const screenshotDir = path.join(root, 'screenshots');
const screenshotFailureDir = path.join(screenshotDir, 'failures');
const visualBaselineFuzz = '2%';
const visualBaselineMaxDiffPixels = 28_800;
const updateVisualBaselines = process.env.UPDATE_VISUAL_BASELINES === '1';

let server;
let apiProcess;
let devProcess;
let baseUrl;
let devBaseUrl;
let devServerOutput = '';
let routeBrowserProcess;
let routeBrowserCdp;
let routeBrowserPromise;
let routeBrowserStderr = '';
let newsroomContentFixture;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
};

function htmlText(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function tagContent(document, tagName, attributes = '') {
  const expression = new RegExp(`<${tagName}\\b${attributes}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  return document.match(expression)?.[1]?.trim() ?? '';
}

function metaContent(document, attribute, value) {
  const expression = new RegExp(
    `<meta\\b[^>]*${attribute}=["']${value}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    'i',
  );
  const reverseExpression = new RegExp(
    `<meta\\b[^>]*content=["']([^"']*)["'][^>]*${attribute}=["']${value}["'][^>]*>`,
    'i',
  );
  return htmlText(document.match(expression)?.[1] ?? document.match(reverseExpression)?.[1] ?? '');
}

function linkHref(document, relation) {
  const expression = new RegExp(
    `<link\\b[^>]*rel=["']${relation}["'][^>]*href=["']([^"']+)["'][^>]*>`,
    'i',
  );
  const reverseExpression = new RegExp(
    `<link\\b[^>]*href=["']([^"']+)["'][^>]*rel=["']${relation}["'][^>]*>`,
    'i',
  );
  return htmlText(document.match(expression)?.[1] ?? document.match(reverseExpression)?.[1] ?? '');
}

function routeFromUrl(value) {
  const pathname = new URL(value).pathname;
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '');
}

function assertSocialPreviewMetadata(document, route) {
  const image = metaContent(document, 'property', 'og:image');
  const twitterImage = metaContent(document, 'name', 'twitter:image');
  const imageAlt = metaContent(document, 'property', 'og:image:alt');
  const twitterImageAlt = metaContent(document, 'name', 'twitter:image:alt');
  const imageType = metaContent(document, 'property', 'og:image:type');
  assert.ok(image, `${route}: article is missing og:image`);
  assert.ok(image.startsWith(`${site}/social/articles/`) && image.endsWith('.png'), `${route}: og:image is not a stable article PNG`);
  assert.equal(new URL(image).origin, site, `${route}: og:image is not an absolute site URL`);
  assert.equal(twitterImage, image, `${route}: twitter:image does not match og:image`);
  assert.ok(imageAlt.length >= 20, `${route}: og:image:alt is missing or too short`);
  assert.equal(twitterImageAlt, imageAlt, `${route}: twitter:image:alt does not match og:image:alt`);
  assert.equal(imageType, 'image/png', `${route}: og:image:type is incorrect`);
}

function previewAccentRgb(route) {
  const slug = route.split('/').pop() ?? route;
  const hash = [...slug].reduce((total, character) => total + character.charCodeAt(0), 0);
  return ['0,108,255', '178,71,45', '85,112,79', '139,94,52'][hash % 4];
}

function previewTitlePixelRegion(layout) {
  return {
    x: previewTitleX,
    y: previewTitleBaselineY - layout.fontSize,
    width: previewTitleWidth,
    height: (layout.lines.length - 1) * layout.lineHeight + layout.fontSize + 16,
  };
}

function previewLayout(title, route) {
  return JSON.parse(execFileSync(
    tsx,
    [
      '-e',
      `import { layoutPreviewTitle } from ${JSON.stringify(path.join(root, 'src', 'social-preview.ts'))}; console.log(JSON.stringify(layoutPreviewTitle(${JSON.stringify(title)}, ${JSON.stringify(route)})));`,
    ],
    { encoding: 'utf8' },
  ).trim());
}

function renderPreviewSvg(title, category, slug) {
  return execFileSync(
    tsx,
    [
      '-e',
      `import { renderSocialPreviewSvg } from ${JSON.stringify(path.join(root, 'src', 'social-preview.ts'))}; process.stdout.write(renderSocialPreviewSvg(${JSON.stringify(title)}, ${JSON.stringify(category)}, ${JSON.stringify(slug)}));`,
    ],
    { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 },
  );
}

function assertHeadlinePixels(filePath, route, title) {
  const layout = previewLayout(title, route);
  const region = previewTitlePixelRegion(layout);
  const regionGeometry = `${region.width}x${region.height}+${region.x}+${region.y}`;
  const contrastLuma = Number(execFileSync(
    'magick',
    [
      filePath,
      '-crop',
      `720x${region.height}+${region.x}+${region.y}`,
      '+repage',
      '-colorspace',
      'gray',
      '-format',
      '%[fx:minima]',
      'info:',
    ],
    { encoding: 'utf8' },
  ).trim());
  assert.ok(
    Number.isFinite(contrastLuma) && contrastLuma <= previewTitleContrastLumaMax,
    `${route}: preview card headline contrast is too low in the rendered headline region (minimum luma ${Number.isFinite(contrastLuma) ? contrastLuma.toFixed(3) : 'unknown'}, maximum ${previewTitleContrastLumaMax.toFixed(2)})`,
  );

  const inkBounds = execFileSync(
    'magick',
    [
      filePath,
      '-crop',
      regionGeometry,
      '+repage',
      '-fuzz',
      previewTitleMaskFuzz,
      '-fill',
      'black',
      '-opaque',
      previewTitleColor,
      '-fill',
      'white',
      '+opaque',
      'black',
      '-trim',
      '-format',
      '%@',
      'info:',
    ],
    { encoding: 'utf8' },
  ).trim();
  const inkBoundsMatch = inkBounds.match(/^(\d+)x(\d+)\+(-?\d+)\+(-?\d+)$/);
  assert.ok(
    inkBoundsMatch,
    `${route}: preview card headline pixels are missing from the rendered headline region`,
  );
  const [, inkWidth, inkHeight, inkX, inkY] = inkBoundsMatch;
  assert.ok(
    Number(inkX) + Number(inkWidth) < region.width && Number(inkY) + Number(inkHeight) < region.height,
    `${route}: preview card headline pixels are clipped at the rendered headline region edge (bounds ${inkBounds}, region ${regionGeometry})`,
  );
}

function assertVisualPreviewAsset(filePath, route, title) {
  const [dimensions, background, accent, mean] = execFileSync(
    'magick',
    [filePath, '-format', '%wx%h %[pixel:p{0,0}] %[pixel:p{100,520}] %[fx:mean]', 'info:'],
    { encoding: 'utf8' },
  ).trim().split(/\s+/);
  assert.equal(dimensions, '1200x630', `${route}: preview card dimensions are ${dimensions || 'unknown'}, expected 1200x630`);
  assert.match(background, /244,241,234/, `${route}: preview card is missing the warm-ivory background`);
  assert.match(accent, new RegExp(previewAccentRgb(route)), `${route}: preview card accent rule is missing`);
  assert.ok(Number(mean) < 0.93, `${route}: preview card title treatment is blank or unreadable`);
  if (title) assertHeadlinePixels(filePath, route, title);
}

function previewSourceTitle(filePath, route) {
  const title = execFileSync('identify', ['-format', '%[comment]', filePath], { encoding: 'utf8' }).trim();
  assert.ok(title, `${route}: preview card is missing its source-title marker`);
  return title;
}

async function waitForDevelopmentPreviewTitle(title, route) {
  const filePath = path.join(os.tmpdir(), `gan-refresh-preview-${process.pid}.png`);
  const deadline = Date.now() + 20_000;
  let observedTitle = '';
  try {
    while (Date.now() < deadline) {
      try {
        const response = await fetch(`${devBaseUrl}/social/articles/ai-models-antibiotic-discovery.png?refresh=${encodeURIComponent(title)}`);
        if (response.ok) {
          writeFileSync(filePath, Buffer.from(await response.arrayBuffer()));
          observedTitle = previewSourceTitle(filePath, route);
          if (observedTitle === title) return;
        }
      } catch {
        // Vite briefly closes the port while restarting after the content edit.
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    assert.fail(
      `${route}: development preview did not refresh to "${title}" within 20 seconds.` +
        ` Last rendered title: "${observedTitle || 'unavailable'}".` +
        (devServerOutput ? `\nVite output:\n${devServerOutput}` : ''),
    );
  } finally {
    try {
      unlinkSync(filePath);
    } catch {
      // The temporary preview may not exist if the dev server was unavailable.
    }
  }
}

function sitemapRoutes(xml) {
  return sitemapEntries(xml).map((entry) => entry.route);
}

function sitemapEntries(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
    const entry = match[1];
    const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
    return {
      location,
      route: routeFromUrl(location),
      lastmod: entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? null,
      images: [...entry.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((image) => image[1]),
    };
  });
}

function canonicalPathname(pathname) {
  return pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
}

function assertCanonicalSiteUrl(value, message) {
  const parsed = new URL(value);
  assert.equal(parsed.hostname, new URL(site).hostname, `${message}: URL uses another host`);
  assert.equal(parsed.protocol, 'https:', `${message}: URL is not HTTPS`);
  assert.equal(parsed.pathname, canonicalPathname(parsed.pathname), `${message}: URL omits its trailing slash`);
  assert.equal(
    value,
    `${site}${parsed.pathname}${parsed.search}${parsed.hash}`,
    `${message}: URL is not the direct canonical URL`,
  );
}

function assertCanonicalSitemapUrls(xml, label) {
  for (const entry of sitemapEntries(xml)) {
    assertCanonicalSiteUrl(entry.location, `${label} ${entry.route}`);
    for (const image of entry.images) {
      const parsed = new URL(image);
      assert.equal(parsed.hostname, new URL(site).hostname, `${label} ${entry.route}: image URL uses another host`);
      assert.equal(parsed.protocol, 'https:', `${label} ${entry.route}: image URL is not HTTPS`);
    }
  }
}

function assertRssCanonicalUrls(xml, label) {
  assert.match(
    xml,
    /<channel>[\s\S]*?<link>https:\/\/globalainews\.in\/<\/link>/,
    `${label}: channel link does not use the apex canonical host`,
  );
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  assert.ok(items.length > 0, `${label}: no RSS items were found`);
  for (const [index, match] of items.entries()) {
    const link = match[1].match(/<link>([^<]+)<\/link>/)?.[1] ?? '';
    const guid = match[1].match(/<guid(?:\s[^>]*)?>([^<]+)<\/guid>/)?.[1] ?? '';
    assertCanonicalSiteUrl(link, `${label} item ${index + 1} link`);
    assert.equal(guid, link, `${label} item ${index + 1} GUID differs from its canonical link`);
    assertCanonicalSiteUrl(guid, `${label} item ${index + 1} GUID`);
  }
}

function assertRouteSetsMatch(expectedRoutes, actualRoutes, message) {
  const expected = [...new Set(expectedRoutes)].sort();
  const actual = [...new Set(actualRoutes)].sort();
  const missing = expected.filter((route) => !actual.includes(route));
  const unexpected = actual.filter((route) => !expected.includes(route));
  assert.deepEqual(
    { missing, unexpected },
    { missing: [], unexpected: [] },
    `${message}: missing routes [${missing.join(', ') || 'none'}]; unexpected routes [${unexpected.join(', ') || 'none'}]`,
  );
}

function assertSitemapDatesMatch(expectedXml, actualXml, message) {
  const expected = new Map(sitemapEntries(expectedXml).map((entry) => [entry.route, entry.lastmod]));
  const actual = new Map(sitemapEntries(actualXml).map((entry) => [entry.route, entry.lastmod]));
  const mismatches = [...expected.entries()]
    .filter(([route, lastmod]) => actual.has(route) && actual.get(route) !== lastmod)
    .map(([route, lastmod]) => `${route} (expected ${lastmod ?? 'none'}, received ${actual.get(route) ?? 'none'})`);
  assert.deepEqual(
    mismatches,
    [],
    `${message}: ${mismatches.join('; ') || 'no mismatches'}`,
  );
}

function openingTags(document, tagName) {
  return [...document.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function attributeValue(tag, attribute) {
  return htmlText(tag.match(new RegExp(`\\b${attribute}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? '');
}

function sameSiteRoute(href) {
  const value = htmlText(href).trim();
  if (!value || value.startsWith('#') || /^(?:mailto|tel|javascript|data):/i.test(value)) return null;
  let url;
  try {
    url = new URL(value, `${site}/`);
  } catch {
    return null;
  }
  return url.origin === siteOrigin ? routeFromUrl(url.href) : null;
}

function assertMeaningfulDescription(description, message) {
  assert.ok(description, `${message}: description is missing`);
  assert.doesNotMatch(description, /^(?:image|photo|picture|graphic|icon|placeholder)$/i, `${message}: description is generic`);
}

async function assertRenderedPageIntegrity(
  document,
  route,
  allowedRoutes,
  responseCache,
  nonIndexableRoutes,
) {
  for (const anchor of openingTags(document, 'a')) {
    const href = attributeValue(anchor, 'href');
    if (!href || href.startsWith('#') || href.startsWith('?')) continue;

    let target;
    try {
      target = new URL(href, site);
    } catch {
      continue;
    }
    if (target.hostname !== new URL(site).hostname || /\.[a-z0-9]{1,8}$/i.test(target.pathname)) continue;

    assert.equal(target.protocol, 'https:', `${route}: internal link "${href}" is not HTTPS`);
    assert.equal(
      target.pathname,
      canonicalPathname(target.pathname),
      `${route}: internal link "${href}" omits its trailing slash`,
    );
  }

  for (const anchor of openingTags(document, 'a')) {
    const href = attributeValue(anchor, 'href');
    const targetRoute = sameSiteRoute(href);
    if (!targetRoute) continue;

    assert.ok(
      allowedRoutes.has(targetRoute)
        || intentional404Routes.has(targetRoute)
        || nonIndexableRoutes.has(targetRoute),
      `${route}: internal link "${href}" points to ${targetRoute}, which is not in sitemap.xml or a known non-indexable route`,
    );

    if (intentional404Routes.has(targetRoute)) continue;
    if (!responseCache.has(targetRoute)) responseCache.set(targetRoute, fetchText(targetRoute));
    let target;
    try {
      target = await responseCache.get(targetRoute);
    } catch (error) {
      assert.fail(`${route}: internal link "${href}" could not be fetched (${error.message})`);
    }
    assert.equal(target.response.status, 200, `${route}: internal link "${href}" returned HTTP ${target.response.status}`);
    if (nonIndexableRoutes.has(targetRoute)) {
      assert.equal(
        metaContent(target.body, 'name', 'robots'),
        'noindex,follow',
        `${route}: internal link "${href}" does not lead to an explicitly non-indexable page`,
      );
      continue;
    }
    assert.match(target.body, /<div id="root">[\s\S]*<main\b/, `${route}: internal link "${href}" did not return prerendered content`);
  }

  for (const image of openingTags(document, 'img')) {
    const source = attributeValue(image, 'src') || '<inline image>';
    assertMeaningfulDescription(attributeValue(image, 'alt'), `${route}: image "${source}"`);
    assert.ok(attributeValue(image, 'width'), `${route}: image "${source}" is missing an explicit width`);
    assert.ok(attributeValue(image, 'height'), `${route}: image "${source}" is missing an explicit height`);
  }

  const roleImages = [...document.matchAll(/<[a-z][^>]*\brole=["']img["'][^>]*>/gi)].map((match) => match[0]);
  for (const image of roleImages) {
    assertMeaningfulDescription(attributeValue(image, 'aria-label'), `${route}: labelled visual`);
  }
}

function feedItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const item = match[1];
    const read = (name) => htmlText(item.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] ?? '');
    return {
      title: read('title'),
      link: read('link'),
      guid: read('guid'),
      pubDate: read('pubDate'),
      description: read('description'),
    };
  });
}

async function serveFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  response.statusCode = 200;
  response.setHeader('Content-Type', mimeTypes[extension] ?? 'application/octet-stream');
  if (
    extension === '.html' &&
    /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["']noindex(?:,follow)?["'])[^>]*>/i.test(
      await readFile(filePath, 'utf8'),
    )
  ) {
    response.setHeader('X-Robots-Tag', 'noindex');
  }
  const socialDirectory = path.join(distDir, 'social', 'articles');
  if (
    extension === '.png' &&
    filePath.startsWith(`${socialDirectory}${path.sep}`)
  ) {
    response.setHeader('Cache-Control', socialPreviewCacheControl);
  }
  const stream = createReadStream(filePath);
  stream.once('error', (error) => {
    if (response.destroyed) return;
    if (response.headersSent) {
      response.destroy(error);
      return;
    }
    response.statusCode = 500;
    response.end(`Could not read ${filePath}: ${error.message}`);
  });
  stream.pipe(response);
}

async function startStaticServer() {
  server = createServer(async (request, response) => {
    try {
      const parsedUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
      const requestPath = decodeURIComponent(parsedUrl.pathname);
      const apiPath = requestPath.startsWith('/api/')
        ? requestPath
        : requestPath === '/feed.xml'
          ? '/api/newsroom/feed.xml'
          : requestPath === '/sitemap.xml'
            ? '/api/newsroom/sitemap.xml'
            : undefined;
      if (apiPath) {
        try {
          if (requestPath === '/api/newsroom/content' && newsroomContentFixture) {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.setHeader('Cache-Control', 'no-store');
            response.end(JSON.stringify(newsroomContentFixture));
            return;
          }
          const isEditorApiRequest = requestPath.startsWith('/api/');
          const apiResponse = await fetch(`${apiOrigin}${apiPath}${parsedUrl.search}`, {
            headers: isEditorApiRequest
              ? { 'x-newsroom-test-editor': smokeEditorId }
              : { accept: requestPath === '/feed.xml' ? 'application/rss+xml' : 'application/xml' },
          });
          response.statusCode = apiResponse.status;
          for (const [sourceName, targetName] of [
            ['content-type', 'Content-Type'],
            ['cache-control', 'Cache-Control'],
          ]) {
            const header = apiResponse.headers.get(sourceName);
            if (header) response.setHeader(targetName, header);
          }
          response.end(await apiResponse.text());
        } catch (error) {
          response.statusCode = 502;
          response.end(`API proxy failed: ${error.message}`);
        }
        return;
      }
      const candidate = path.resolve(distDir, `.${requestPath}`);
      const insideDist = candidate === distDir || candidate.startsWith(`${distDir}${path.sep}`);
      if (!insideDist) {
        response.statusCode = 400;
        response.end('Bad request');
        return;
      }

      let filePath = candidate;
      try {
        const fileStats = await stat(filePath);
        if (fileStats.isDirectory()) filePath = path.join(filePath, 'index.html');
        await stat(filePath);
      } catch {
        filePath = path.join(distDir, 'index.html');
      }
      await serveFile(response, filePath);
    } catch (error) {
      response.statusCode = 500;
      response.end(String(error));
    }
  });

  // ImageMagick assertions leave idle gaps between local page requests; keep
  // Node's pooled fetch connections alive long enough to avoid stale-socket resets.
  server.keepAliveTimeout = 120_000;
  server.headersTimeout = 121_000;
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

async function startDevServer() {
  devServerOutput = '';
  devProcess = spawn(
    'pnpm',
    ['exec', 'vite', '--config', 'vite.config.ts', '--mode', 'test', '--host', '127.0.0.1', '--port', String(devPort), '--strictPort'],
    {
      cwd: root,
      env: {
        ...process.env,
        BASE_PATH: '/',
        NEWSROOM_API_ORIGIN: apiOrigin,
        NODE_ENV: 'development',
        PORT: String(devPort),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  const captureOutput = (chunk) => {
    devServerOutput = `${devServerOutput}${chunk.toString()}`.slice(-12_000);
  };
  devProcess.stdout?.on('data', captureOutput);
  devProcess.stderr?.on('data', captureOutput);

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (devProcess.exitCode !== null || devProcess.signalCode !== null) break;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2_000);
    try {
      // Check the server itself; requesting a generated PNG can block on ImageMagick.
      const response = await fetch(`http://127.0.0.1:${devPort}/`, { signal: controller.signal });
      if (response.ok) {
        devBaseUrl = `http://127.0.0.1:${devPort}`;
        return;
      }
    } catch {
      // The Vite dev server may still be starting.
    } finally {
      clearTimeout(timeout);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(
    `The Vite dev server did not become ready within 60 seconds (exit code ${devProcess.exitCode ?? 'pending'}, signal ${devProcess.signalCode ?? 'none'}).${devServerOutput ? `\n${devServerOutput}` : ''}`,
  );
}

async function fetchText(route) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      return { response, body: await response.text() };
    } catch (error) {
      if (attempt === 0 && error?.cause?.code === 'ECONNRESET') {
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }
      throw new Error(
        `Could not fetch ${route} from the smoke server: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  }
  throw new Error(`Could not fetch ${route} from the smoke server after retry.`);
}

async function getRouteBrowser() {
  if (!routeBrowserPromise) {
    routeBrowserPromise = (async () => {
      const debugPort = await findFreePort();
      const userDataDir = `${os.tmpdir()}/gan-smoke-${process.pid}-${debugPort}`;
      routeBrowserProcess = spawn(chromium, [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--no-first-run',
        `--user-data-dir=${userDataDir}`,
        `--remote-debugging-port=${debugPort}`,
        'about:blank',
      ], { stdio: ['ignore', 'ignore', 'pipe'] });
      routeBrowserStderr = '';
      routeBrowserProcess.stderr?.on('data', (chunk) => {
        routeBrowserStderr += chunk.toString();
      });

      const debugDeadline = Date.now() + 60_000;
      let target;
      while (Date.now() < debugDeadline) {
        if (routeBrowserProcess.exitCode !== null || routeBrowserProcess.signalCode !== null) break;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 500);
        try {
          const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`, {
            signal: controller.signal,
          });
          if (response.ok) {
            const targets = await response.json();
            target = targets.find((item) => item.type === 'page');
            if (target?.webSocketDebuggerUrl) break;
          }
        } catch {
          // Chromium may still be starting its debugging endpoint.
        } finally {
          clearTimeout(timeout);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!target?.webSocketDebuggerUrl) {
        const processState = `exit code ${routeBrowserProcess.exitCode ?? 'pending'}, signal ${routeBrowserProcess.signalCode ?? 'none'}`;
        throw new Error(
          `Chromium did not expose a debuggable page (${processState}).${routeBrowserStderr ? `\n${routeBrowserStderr.slice(-4000)}` : ''}`,
        );
      }

      routeBrowserCdp = await connectToChromium(target.webSocketDebuggerUrl);
      await routeBrowserCdp.send('Page.enable');
      await routeBrowserCdp.send('Runtime.enable');
      return routeBrowserCdp;
    })().catch(async (error) => {
      routeBrowserCdp?.close();
      routeBrowserCdp = undefined;
      await stopBrowserProcess(routeBrowserProcess);
      routeBrowserProcess = undefined;
      routeBrowserPromise = undefined;
      throw error;
    });
  }
  return routeBrowserPromise;
}

async function renderRoute(route, width, height) {
  const cdp = await getRouteBrowser();
  const url = `${baseUrl}${route}`;
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send('Page.navigate', { url });
  const expectedPath = new URL(url).pathname;
  const canonicalPath = expectedPath === '/' ? '/' : `${expectedPath.replace(/\/+$/, '')}/`;
  const expectedCanonical = route.startsWith('/amp/') ? null : `${site}${canonicalPath}`;
  const canonicalReady = expectedCanonical
    ? `document.querySelector('link[rel="canonical"]')?.href === ${JSON.stringify(expectedCanonical)}`
    : 'true';
  const newsroomRequestReady = route.startsWith('/amp/') || route === '/reports' || ['/about-us', '/code-of-ethics', '/corrections', '/contact-us', '/privacy', '/terms', '/authors'].includes(route)
    ? 'true'
    : `performance.getEntriesByType('resource').some((entry) => new URL(entry.name, location.href).pathname.endsWith('/api/newsroom/content') && entry.responseEnd > 0)`;
  await waitForBrowserCondition(
    cdp,
    `location.pathname === ${JSON.stringify(expectedPath)} && document.readyState !== 'loading' && ${canonicalReady} && ${newsroomRequestReady} && !document.querySelector('main')?.textContent?.includes('Loading page…') && Boolean(document.querySelector('main h1')?.textContent?.trim())`,
    `${route}: route-specific page content did not finish rendering in Chromium.`,
    { stableSamples: 3 },
  );
  return await evaluateBrowser(cdp, 'document.documentElement.outerHTML');
}

async function findFreePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const address = probe.address();
  await new Promise((resolve, reject) => probe.close((error) => (error ? reject(error) : resolve())));
  if (!address || typeof address === 'string') throw new Error('Could not determine a free browser debugging port.');
  return address.port;
}

async function connectToChromium(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  const events = [];
  let nextId = 0;
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) {
      events.push(message);
      return;
    }
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });
  return {
    send(method, params = {}) {
      const id = ++nextId;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() {
      socket.close();
    },
    events,
  };
}

function waitForChildExit(child, timeoutMs) {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null || child.signalCode !== null) {
      resolve(true);
      return;
    }
    const onExit = () => {
      clearTimeout(timer);
      resolve(true);
    };
    const timer = setTimeout(() => {
      child.removeListener('exit', onExit);
      resolve(false);
    }, timeoutMs);
    child.once('exit', onExit);
  });
}

async function stopBrowserProcess(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const gracefulExit = waitForChildExit(child, 3000);
  child.kill('SIGTERM');
  if (await gracefulExit) return;

  const forcedExit = waitForChildExit(child, 3000);
  child.kill('SIGKILL');
  await forcedExit;
}

async function evaluateBrowser(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description
        || result.exceptionDetails.text
        || 'Chromium evaluation failed.',
    );
  }
  return result.result?.value;
}

async function waitForBrowserCondition(cdp, expression, message, { stableSamples = 1 } = {}) {
  const deadline = Date.now() + 20_000;
  let consecutiveMatches = 0;
  while (Date.now() < deadline) {
    if (await evaluateBrowser(cdp, expression)) {
      consecutiveMatches += 1;
      if (consecutiveMatches >= stableSamples) return;
    } else {
      consecutiveMatches = 0;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.fail(message);
}

async function waitForThemeBrowserCondition(cdp, expression, message) {
  try {
    await waitForBrowserCondition(cdp, expression, message);
  } catch (error) {
    let pageState;
    try {
      pageState = await evaluateBrowser(cdp, `(() => ({
        url: location.href,
        readyState: document.readyState,
        theme: document.documentElement.dataset.theme,
        hasMain: !!document.querySelector('main'),
        hasThemeToggle: !!document.querySelector('[data-testid="button-theme-toggle"]'),
        bodyText: (document.body?.innerText ?? '').slice(0, 500),
        inputCount: document.querySelectorAll('input:not([type="hidden"])').length,
        buttonCount: document.querySelectorAll('button').length,
      }))()`);
    } catch {
      pageState = { unavailable: true };
    }
    const browserErrors = cdp.events
      .filter((event) => (
        (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error')
        || event.method === 'Runtime.exceptionThrown'
      ))
      .map((event) => event.method === 'Runtime.exceptionThrown'
        ? event.params.exceptionDetails?.text ?? 'Unhandled browser exception'
        : event.params.args?.map((argument) => argument.value ?? argument.description ?? '').join(' '))
      .map((message) => String(message).replace(/\b(?:pk|sk)_(?:test|live)_[A-Za-z0-9_-]+\b/g, '[redacted-key]'))
      .slice(-6);
    const failedRequests = cdp.events
      .filter((event) => event.method === 'Network.loadingFailed' && event.params.errorText !== 'net::ERR_ABORTED')
      .map((event) => event.params.errorText)
      .slice(-6);
    const failedResponses = cdp.events
      .filter((event) => event.method === 'Network.responseReceived' && event.params.response.status >= 400)
      .map((event) => event.params.response.status)
      .slice(-6);
    throw new Error(
      `${error instanceof Error ? error.message : String(error)} ` +
        `Diagnostics: ${JSON.stringify({ pageState, browserErrors, failedRequests, failedResponses })}.`,
      { cause: error },
    );
  }
}

async function getAutomationRunsForSmoke() {
  const response = await fetch(`${apiOrigin}/api/newsroom/automation/runs`, {
    headers: { 'x-newsroom-test-editor': smokeEditorId },
  });
  assert.equal(response.status, 200, 'The automation audit endpoint did not respond for the smoke editor.');
  return response.json();
}

async function getReleaseQueueForSmoke() {
  const response = await fetch(`${apiOrigin}/api/newsroom/releases`, {
    headers: { 'x-newsroom-test-editor': smokeEditorId },
  });
  assert.equal(response.status, 200, 'The release queue endpoint did not respond for the smoke editor.');
  return response.json();
}

async function ensureScheduledAutomationRunForSmoke() {
  let runs = await getAutomationRunsForSmoke();
  let releases = await getReleaseQueueForSmoke();
  let scheduledRun = runs.find(
    (run) => run.outcome === 'scheduled'
      && run.slug
      && releases.some((release) => release.slug === run.slug && release.status === 'scheduled'),
  );
  if (scheduledRun) return { runs, releases, scheduledRun, createdRun: false };

  const response = await fetch(`${apiOrigin}/api/newsroom/automation/runs/smoke-fixture`, {
    method: 'POST',
    headers: { 'x-newsroom-test-editor': smokeEditorId },
  });
  assert.equal(response.status, 201, `The smoke test could not create an automation run fixture (${response.status}).`);
  runs = await getAutomationRunsForSmoke();
  releases = await getReleaseQueueForSmoke();
  scheduledRun = runs.find(
    (run) => run.outcome === 'scheduled'
      && run.slug
      && releases.some((release) => release.slug === run.slug && release.status === 'scheduled'),
  );
  assert.ok(
    scheduledRun,
    `The automation run did not produce a scheduled release: ${JSON.stringify(runs.slice(0, 3))}`,
  );
  return { runs, releases, scheduledRun, createdRun: true };
}

async function checkAutomationAuditReleaseLink() {
  const { runs, releases, scheduledRun, createdRun } = await ensureScheduledAutomationRunForSmoke();
  const scheduledRelease = releases.find((release) => release.slug === scheduledRun.slug);
  assert.ok(scheduledRelease, `The scheduled release ${scheduledRun.slug} was not returned by the queue endpoint.`);
  const debugPort = await findFreePort();
  const userDataDir = `${os.tmpdir()}/gan-automation-audit-${process.pid}`;
  const browserProcess = spawn(chromium, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--no-first-run',
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${debugPort}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });
  let cdp;
  try {
    const debugDeadline = Date.now() + 10_000;
    let target;
    while (Date.now() < debugDeadline) {
      try {
        const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
        target = targets.find((item) => item.type === 'page');
        if (target?.webSocketDebuggerUrl) break;
      } catch {
        // Chromium may still be starting its debugging endpoint.
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(target?.webSocketDebuggerUrl, 'Chromium did not expose a debuggable page for the automation audit check.');
    cdp = await connectToChromium(target.webSocketDebuggerUrl);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `${baseUrl}/insights?smoke-editor=1` });
    const runTestId = `automation-run-${scheduledRun.id}`;
    await waitForBrowserCondition(
      cdp,
      `Boolean(document.querySelector('[data-testid="${runTestId}"] a'))`,
      `The scheduled automation audit run ${scheduledRun.id} did not render its release link.`,
    );

    await evaluateBrowser(cdp, `(() => {
      const link = document.querySelector('[data-testid="${runTestId}"] a');
      if (!link) throw new Error('The scheduled automation audit release link is missing.');
      link.click();
      return true;
    })()`);
    await waitForBrowserCondition(
      cdp,
      `window.location.hash === '#editorial-queue-${scheduledRun.slug}'`,
      `The scheduled automation audit link did not navigate to #editorial-queue-${scheduledRun.slug}.`,
    );
    // The smoke editor session is query-string based; restore it only for the
    // destination render because the production link intentionally omits it.
    await cdp.send('Page.navigate', {
      url: `${baseUrl}/insights?smoke-editor=1#editorial-queue-${scheduledRun.slug}`,
    });
    await waitForBrowserCondition(
      cdp,
      `Boolean(document.querySelector('#editorial-queue-${scheduledRun.slug}'))`,
      `The editor workspace did not render the release card for #editorial-queue-${scheduledRun.slug}.`,
    );
    const scheduledCard = await evaluateBrowser(cdp, `(() => {
      const card = document.querySelector('#editorial-queue-${scheduledRun.slug}');
      const rect = card?.getBoundingClientRect();
      return {
        testId: card?.getAttribute('data-testid') ?? null,
        title: card?.querySelector('h3')?.textContent?.trim() ?? null,
        status: card?.querySelector('[data-testid^="release-status-"]')?.textContent?.trim() ?? null,
        readiness: card?.querySelector('[data-testid^="release-readiness-"]')?.textContent?.trim() ?? null,
        visible: Boolean(rect && rect.width > 0 && rect.height > 0),
      };
    })()`);
    assert.deepEqual(
      scheduledCard,
      {
        testId: `editorial-queue-${scheduledRun.slug}`,
        title: scheduledRun.title,
        status: scheduledRelease.publishable ? scheduledRelease.status : 'blocked',
        readiness: `${scheduledRelease.wordCount} / 800+ words · ${scheduledRelease.remainingWords} remaining${scheduledRelease.publishable ? 'Minimum copy met · ready for publication.' : `Blocked · ${scheduledRelease.remainingWords} more ${scheduledRelease.remainingWords === 1 ? 'word' : 'words'} needed before publishing.`}`,
        visible: true,
      },
      `The scheduled automation audit link did not open the matching release card: ${JSON.stringify(scheduledCard)}`,
    );

    const rejectedRuns = runs.filter((run) => run.outcome === 'rejected');
    for (const rejectedRun of rejectedRuns) {
      const rejectedCard = await evaluateBrowser(cdp, `(() => {
        const card = document.querySelector('[data-testid="automation-run-${rejectedRun.id}"]');
        return {
          rendered: Boolean(card),
          hasScheduledReleaseLink: Boolean(card?.querySelector('a[href*="editorial-queue-"]')),
        };
      })()`);
      assert.equal(rejectedCard.rendered, true, `Rejected automation run ${rejectedRun.id} did not render in the audit list.`);
      assert.equal(
        rejectedCard.hasScheduledReleaseLink,
        false,
        `Rejected automation run ${rejectedRun.id} rendered a misleading scheduled-release link.`,
      );
    }
  } finally {
    cdp?.close();
    await stopBrowserProcess(browserProcess);
    if (createdRun) {
      const cleanupResponse = await fetch(`${apiOrigin}/api/newsroom/releases/${encodeURIComponent(scheduledRun.slug)}`, {
        method: 'DELETE',
        headers: { 'x-newsroom-test-editor': smokeEditorId },
      });
      assert.equal(
        cleanupResponse.status,
        200,
        `The smoke test could not clean up its scheduled release fixture (${cleanupResponse.status}).`,
      );
      const auditCleanupResponse = await fetch(`${apiOrigin}/api/newsroom/automation/runs/smoke-fixture`, {
        method: 'DELETE',
        headers: { 'x-newsroom-test-editor': smokeEditorId },
      });
      assert.equal(
        auditCleanupResponse.status,
        204,
        `The smoke test could not clean up its automation audit fixture (${auditCleanupResponse.status}).`,
      );
    }
  }
}

async function checkMobileEditorHistory() {
  const debugPort = await findFreePort();
  const userDataDir = `${os.tmpdir()}/gan-mobile-history-${process.pid}`;
  const browserProcess = spawn(chromium, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--no-first-run',
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${debugPort}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore'] });
  let cdp;
  try {
    const debugDeadline = Date.now() + 10_000;
    let target;
    while (Date.now() < debugDeadline) {
      try {
        const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
        target = targets.find((item) => item.type === 'page');
        if (target?.webSocketDebuggerUrl) break;
      } catch {
        // Chromium may still be starting its debugging endpoint.
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(target?.webSocketDebuggerUrl, 'Chromium did not expose a debuggable page for the mobile editor check.');
    cdp = await connectToChromium(target.webSocketDebuggerUrl);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 402,
      height: 874,
      deviceScaleFactor: 1,
      mobile: true,
    });
     await cdp.send('Network.enable');
     await cdp.send('Network.setBlockedURLs', {
       urls: ['*://*/*newsroom/releases/history*'],
     });
    await cdp.send('Page.navigate', { url: `${baseUrl}/insights?smoke-editor=1` });
    await waitForBrowserCondition(
      cdp,
      `document.readyState === 'complete' && !!document.querySelector('[data-testid="select-release-history-release"]')`,
      'The signed-in publisher workspace did not render release history on mobile.',
    );
     await waitForBrowserCondition(
       cdp,
       `!!document.querySelector('[data-testid="release-history-error"]')`,
       'A failed release history request did not show the mobile outage state.',
     );

     await cdp.send('DOM.enable');
     const errorDocumentNode = await cdp.send('DOM.getDocument', { depth: -1 });
     const errorNode = await cdp.send('DOM.querySelector', {
       nodeId: errorDocumentNode.root.nodeId,
       selector: '[data-testid="release-history-error"]',
     });
     const retryNode = await cdp.send('DOM.querySelector', {
       nodeId: errorDocumentNode.root.nodeId,
       selector: '[data-testid="button-retry-release-history"]',
     });
     assert.ok(errorNode.nodeId, 'The mobile release history outage message could not be located in the DOM.');
     assert.ok(retryNode.nodeId, 'The mobile release history retry action could not be located in the DOM.');
     await cdp.send('DOM.scrollIntoViewIfNeeded', { nodeId: errorNode.nodeId });
     const errorLayout = await evaluateBrowser(cdp, `(() => {
       const error = document.querySelector('[data-testid="release-history-error"]');
       const message = document.querySelector('[data-testid="release-history-error-message"]');
       const retry = document.querySelector('[data-testid="button-retry-release-history"]');
       const rect = (element) => element?.getBoundingClientRect();
       const isVisible = (elementRect) => Boolean(
         elementRect
         && elementRect.width > 0
         && elementRect.left >= 0
         && elementRect.right <= window.innerWidth
         && elementRect.top >= 0
         && elementRect.bottom <= window.innerHeight,
       );
       return {
         documentWidth: document.documentElement.scrollWidth,
         errorVisible: isVisible(rect(error)),
         messageVisible: isVisible(rect(message)),
         retryVisible: isVisible(rect(retry)),
         message: message?.textContent?.trim() ?? '',
         retry: retry?.textContent?.trim() ?? '',
       };
     })()`);
     assert.ok(errorLayout.documentWidth <= 402, `The mobile release history outage state introduces horizontal overflow (${errorLayout.documentWidth}px).`);
     assert.equal(errorLayout.errorVisible, true, `The mobile release history outage message is not visible: ${JSON.stringify(errorLayout)}`);
     assert.equal(errorLayout.messageVisible, true, `The mobile release history outage explanation is not readable: ${JSON.stringify(errorLayout)}`);
     assert.equal(errorLayout.retryVisible, true, `The mobile release history retry action is not visible: ${JSON.stringify(errorLayout)}`);
     assert.match(errorLayout.message, /temporarily unavailable/i, 'The mobile release history outage explanation is missing.');
     assert.equal(errorLayout.retry, 'Try again', 'The mobile release history retry action has the wrong label.');

     await cdp.send('Network.setBlockedURLs', { urls: [] });
     await evaluateBrowser(cdp, `(() => {
       const retry = document.querySelector('[data-testid="button-retry-release-history"]');
       if (!retry) throw new Error('Release history retry action is missing.');
       retry.click();
       return true;
     })()`);
     await waitForBrowserCondition(
       cdp,
       `(() => {
         const error = document.querySelector('[data-testid="release-history-error"]');
         const loading = [...document.querySelectorAll('p')].some((element) => element.textContent?.includes('Loading release history'));
         const settledEmpty = document.body.innerText.includes('No release changes have been recorded yet.');
         const settledWithEntries = document.querySelectorAll('article[data-testid^="release-history-"]').length > 0;
         return !error && !loading && (settledEmpty || settledWithEntries);
       })()`,
       'Retrying after the release history API recovered did not return to the history view.',
     );
     assert.ok(
       await evaluateBrowser(cdp, `Boolean(document.querySelector('[data-testid="release-history"]'))`),
       'The recovered release history view is missing on mobile.',
     );

    const initialLayout = await evaluateBrowser(cdp, `(() => {
      const selectors = [
        ['[data-testid="select-release-history-release"]', 'Release'],
        ['[data-testid="select-release-history-action"]', 'Change type'],
      ];
      const viewport = window.innerWidth;
      return {
        documentWidth: document.documentElement.scrollWidth,
        controls: selectors.map(([selector, label]) => {
          const element = document.querySelector(selector);
          const rect = element?.getBoundingClientRect();
          return {
            label,
            visible: Boolean(rect && rect.width > 0 && rect.left >= 0 && rect.right <= viewport),
            width: rect?.width ?? 0,
            right: rect?.right ?? 0,
            labelText: element?.parentElement?.querySelector('span')?.textContent?.trim() ?? '',
          };
        }),
      };
    })()`);
    assert.ok(initialLayout.documentWidth <= 402, `Mobile release history overflows horizontally (${initialLayout.documentWidth}px).`);
    assert.deepEqual(
      initialLayout.controls.map((control) => ({ label: control.label, visible: control.visible, labelText: control.labelText })),
      [
        { label: 'Release', visible: true, labelText: 'Release' },
        { label: 'Change type', visible: true, labelText: 'Change type' },
      ],
      'Mobile release history controls are not both visible with their labels.',
    );

    await evaluateBrowser(cdp, `(() => {
      const release = document.querySelector('[data-testid="select-release-history-release"]');
      if (!release) throw new Error('Release history release filter is missing.');
      release.value = 'queue';
      release.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
    await waitForBrowserCondition(
      cdp,
      `new URLSearchParams(window.location.search).get('releaseSlug') === 'queue'`,
      'Selecting the release history filter did not update the URL on mobile.',
    );
    await evaluateBrowser(cdp, `(() => {
      const action = document.querySelector('[data-testid="select-release-history-action"]');
      if (!action) throw new Error('Release history change type filter is missing.');
      action.value = 'edited';
      action.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
    await waitForBrowserCondition(
      cdp,
      `new URLSearchParams(window.location.search).get('action') === 'edited'`,
      'Selecting the release history change type did not update the URL on mobile.',
    );
    await evaluateBrowser(cdp, `(() => {
      const actor = document.querySelector('[data-testid="input-release-history-actor"]');
      if (!actor) throw new Error('Release history actor filter is missing.');
      actor.focus();
      return true;
    })()`);
    await cdp.send('Input.insertText', { text: 'mobile-history-smoke-no-match' });
    await waitForBrowserCondition(
      cdp,
      `new URLSearchParams(window.location.search).get('actor') === 'mobile-history-smoke-no-match'`,
      'Entering an actor filter did not update the URL on mobile.',
    );
    const emptyDeadline = Date.now() + 20_000;
    let historyState;
    while (Date.now() < emptyDeadline) {
      historyState = await evaluateBrowser(cdp, `(() => ({
        empty: document.body.innerText.includes('No matching release change was found for'),
        url: window.location.href,
        release: document.querySelector('[data-testid="select-release-history-release"]')?.value ?? null,
        action: document.querySelector('[data-testid="select-release-history-action"]')?.value ?? null,
        actor: document.querySelector('[data-testid="input-release-history-actor"]')?.value ?? null,
        loading: [...document.querySelectorAll('p')].some((element) => element.textContent?.includes('Loading release history')),
        error: [...document.querySelectorAll('p')].some((element) => element.textContent?.includes('History unavailable')),
        historyParagraphs: [...document.querySelectorAll('p')].filter((element) => element.closest('[data-testid="release-history"]') || element.textContent?.includes('release change')).map((element) => element.textContent?.trim()),
      }))()`);
      if (historyState.empty) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.equal(
      historyState?.empty,
      true,
      `Selecting a release history filter did not show the filtered-empty explanation on mobile: ${JSON.stringify(historyState)}`,
    );
    const emptyMessage = await evaluateBrowser(cdp, `document.querySelector('[data-testid="release-history"]')?.innerText ?? ''`);
    assert.match(emptyMessage, /release “Queue-level changes”/);
    assert.match(emptyMessage, /change type “edited”/);
    assert.match(emptyMessage, /actor “mobile-history-smoke-no-match”/);
    assert.match(emptyMessage, /Clear a filter or try different values\./);

    await evaluateBrowser(cdp, `(() => {
      const actor = document.querySelector('[data-testid="input-release-history-actor"]');
      if (!actor) throw new Error('Release history actor filter is missing.');
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setValue?.call(actor, 'mobile-history-smoke-changed');
      actor.dispatchEvent(new Event('input', { bubbles: true }));
      actor.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
    await waitForBrowserCondition(
      cdp,
      `new URLSearchParams(window.location.search).get('actor') === 'mobile-history-smoke-changed'`,
      'Changing the release history actor filter did not update the URL on mobile.',
    );
    await waitForBrowserCondition(
      cdp,
      `document.querySelector('[data-testid="release-history"]')?.innerText.includes('actor “mobile-history-smoke-changed”')`,
      'Changing the release history actor filter did not update the filtered-empty explanation on mobile.',
    );

    await evaluateBrowser(cdp, `(() => {
      const emptyState = [...document.querySelectorAll('p')].find((element) => element.textContent?.includes('No matching release change was found for'));
      emptyState?.setAttribute('data-testid', 'mobile-history-empty-state');
      return Boolean(emptyState);
    })()`);
    const documentNode = await cdp.send('DOM.getDocument', { depth: -1 });
    const emptyStateNode = await cdp.send('DOM.querySelector', {
      nodeId: documentNode.root.nodeId,
      selector: '[data-testid="mobile-history-empty-state"]',
    });
    assert.ok(emptyStateNode.nodeId, 'The filtered-empty release history message could not be located in the mobile DOM.');
    await cdp.send('DOM.scrollIntoViewIfNeeded', { nodeId: emptyStateNode.nodeId });
    const emptyStateLayout = await evaluateBrowser(cdp, `(() => {
      const emptyState = [...document.querySelectorAll('p')].find((element) => element.textContent?.includes('No matching release change was found for'));
      const rect = emptyState?.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportHeight: window.innerHeight,
        visible: Boolean(rect && rect.top >= 0 && rect.bottom <= window.innerHeight && rect.width > 0 && rect.right <= window.innerWidth),
      };
    })()`);
    assert.ok(emptyStateLayout.documentWidth <= 402, 'The filtered-empty release history state introduces mobile horizontal overflow.');
    assert.equal(
      emptyStateLayout.visible,
      true,
      `The filtered-empty release history explanation is not readable within the mobile viewport: ${JSON.stringify(emptyStateLayout)}`,
    );
  } finally {
    cdp?.close();
    await stopBrowserProcess(browserProcess);
  }
}

async function checkReleaseReadinessRecovery() {
  const slug = `readiness-recovery-${process.pid}-${Date.now()}`;
  const dek = 'Signal';
  const bodyForWordCount = (count) => Array(count).fill('signal').join(' ');
  const editorHeaders = {
    'content-type': 'application/json',
    'x-newsroom-test-editor': smokeEditorId,
  };
  let fixtureCreated = false;
  const createResponse = await fetch(`${apiOrigin}/api/newsroom/releases`, {
    method: 'POST',
    headers: editorHeaders,
    body: JSON.stringify({
      slug,
      title: 'Readiness recovery smoke fixture',
      dek,
      publishAt: '2099-04-05T06:07:08.000Z',
      cadence: 'daily',
      category: 'Field Notes',
      author: 'global-ai-news',
      body: bodyForWordCount(799),
    }),
  });
  const createdRelease = await createResponse.json();
  fixtureCreated = createResponse.status === 201;
  assert.equal(
    createResponse.status,
    201,
    `The readiness recovery fixture could not be created (${createResponse.status}): ${JSON.stringify(createdRelease)}`,
  );

  const debugPort = await findFreePort();
  const userDataDir = `${os.tmpdir()}/gan-readiness-recovery-${process.pid}`;
  let browserProcess;
  let cdp;
  try {
    assert.equal(createdRelease.wordCount, 800, 'The readiness recovery fixture should start at the minimum copy threshold.');
    browserProcess = spawn(chromium, [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--no-first-run',
      `--user-data-dir=${userDataDir}`,
      `--remote-debugging-port=${debugPort}`,
      'about:blank',
    ], { stdio: ['ignore', 'ignore', 'ignore'] });
    const debugDeadline = Date.now() + 10_000;
    let target;
    while (Date.now() < debugDeadline) {
      try {
        const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
        target = targets.find((item) => item.type === 'page');
        if (target?.webSocketDebuggerUrl) break;
      } catch {
        // Chromium may still be starting its debugging endpoint.
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(target?.webSocketDebuggerUrl, 'Chromium did not expose a debuggable page for release readiness recovery.');
    cdp = await connectToChromium(target.webSocketDebuggerUrl);
    await cdp.send('Network.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Page.navigate', { url: `${baseUrl}/insights?smoke-editor=1` });
    await waitForBrowserCondition(
      cdp,
      `Boolean(document.querySelector('[data-testid="editorial-queue-${slug}"] [data-testid="release-readiness-${slug}"]'))`,
      'The release readiness fixture did not render in the newsroom queue.',
    );

    const initialCards = await evaluateBrowser(cdp, `(() => [...document.querySelectorAll('[data-testid^="editorial-queue-"]')].map((card) => ({
      testId: card.getAttribute('data-testid'),
      readiness: card.querySelector('[data-testid^="release-readiness-"]')?.textContent?.trim() ?? '',
    })))()`);
    const initialFixtureCard = initialCards.find((card) => card.testId === `editorial-queue-${slug}`);
    assert.ok(initialFixtureCard, 'The initial release cards did not include the readiness fixture.');
    assert.match(initialFixtureCard.readiness, /800 \/ 800\+ words/, 'The initial fixture readiness should show the minimum word count.');

    await cdp.send('Network.setBlockedURLs', { urls: ['*://*/*newsroom/releases'] });
    await evaluateBrowser(cdp, `(() => {
      const refresh = document.querySelector('[data-testid="button-refresh-releases"]');
      if (!refresh) throw new Error('The release queue refresh button is missing.');
      refresh.click();
      return true;
    })()`);
    await waitForBrowserCondition(
      cdp,
      `Boolean(document.querySelector('[data-testid="release-queue-refresh-error"]'))`,
      'A failed readiness refresh did not show the queue outage notice.',
    );
    const failedRefreshState = await evaluateBrowser(cdp, `(() => ({
      message: document.querySelector('[data-testid="release-queue-refresh-error"]')?.textContent?.trim() ?? '',
      cards: [...document.querySelectorAll('[data-testid^="editorial-queue-"]')].map((card) => ({
        testId: card.getAttribute('data-testid'),
        readiness: card.querySelector('[data-testid^="release-readiness-"]')?.textContent?.trim() ?? '',
      })),
    }))()`);
    assert.match(failedRefreshState.message, /Readiness refresh failed\..*Showing the last known queue state\./, 'The failed refresh notice should explain that the last known queue remains visible.');
    assert.deepEqual(
      failedRefreshState.cards,
      initialCards,
      'The failed readiness refresh should preserve all previously visible release cards and readiness values.',
    );

    const updateResponse = await fetch(`${apiOrigin}/api/newsroom/releases/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      headers: editorHeaders,
      body: JSON.stringify({ body: bodyForWordCount(819) }),
    });
    const updatedRelease = await updateResponse.json();
    assert.equal(
      updateResponse.status,
      200,
      `The readiness recovery fixture could not be updated (${updateResponse.status}): ${JSON.stringify(updatedRelease)}`,
    );
    assert.equal(updatedRelease.wordCount, 820, 'The recovered fixture should expose the updated word count.');

    await cdp.send('Network.setBlockedURLs', { urls: [] });
    await evaluateBrowser(cdp, `(() => {
      const retry = document.querySelector('[data-testid="release-queue-refresh-error"] button');
      if (!retry) throw new Error('The release queue recovery action is missing.');
      retry.click();
      return true;
    })()`);
    await waitForBrowserCondition(
      cdp,
      `(() => {
        const card = document.querySelector('[data-testid="editorial-queue-${slug}"] [data-testid="release-readiness-${slug}"]');
        return !document.querySelector('[data-testid="release-queue-refresh-error"]')
          && card?.textContent?.includes('820 / 800+ words')
          && card?.textContent?.includes('Length met · ready for publication.');
      })()`,
      'The successful readiness retry did not clear the outage notice and render fresh queue data.',
    );
    const recoveredReadiness = await evaluateBrowser(cdp, `document.querySelector('[data-testid="editorial-queue-${slug}"] [data-testid="release-readiness-${slug}"]')?.textContent?.trim() ?? ''`);
    assert.match(recoveredReadiness, /820 \/ 800\+ words/, 'The recovered card did not replace its stale word count.');
    assert.match(recoveredReadiness, /Length met · ready for publication\./, 'The recovered card did not show the updated publishable state.');
  } finally {
    cdp?.close();
    browserProcess?.kill('SIGTERM');
    if (fixtureCreated) {
      const cleanupResponse = await fetch(`${apiOrigin}/api/newsroom/releases/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: { 'x-newsroom-test-editor': smokeEditorId },
      });
      assert.equal(
        cleanupResponse.status,
        200,
        `The readiness recovery fixture could not be cleaned up (${cleanupResponse.status}).`,
      );
    }
  }
}

function parseCssRgb(value) {
  const match = value.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return null;
  return match.slice(1, 4).map(Number);
}

function relativeLuminance(rgb) {
  if (!rgb) return null;
  const channels = rgb.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrastRatio(first, second) {
  const firstLuma = relativeLuminance(parseCssRgb(first));
  const secondLuma = relativeLuminance(parseCssRgb(second));
  if (firstLuma === null || secondLuma === null) return null;
  const [lighter, darker] = [firstLuma, secondLuma].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function visualBaselinePath(name, theme) {
  // The homepage/Brief latest-story strip is intentionally freshness-gated.
  // Refresh affected baselines when a maintained lead ages out; do not weaken
  // the freshness rule just to preserve pixels from an older edition.
  return path.join(screenshotDir, `${name}-${theme}.png`);
}

function visualFailurePath(name, theme) {
  return path.join(screenshotFailureDir, `${name}-${theme}.png`);
}

function compareVisualBaseline({ actualPath, baselinePath, route, theme }) {
  const [dimensions] = execFileSync(
    'magick',
    [actualPath, '-format', '%wx%h', 'info:'],
    { encoding: 'utf8' },
  ).trim().split(/\s+/);
  assert.equal(dimensions, '1440x1000', `${route}: ${theme} screenshot has unstable dimensions (${dimensions || 'unknown'}).`);

  if (updateVisualBaselines) {
    copyFileSync(actualPath, baselinePath);
    console.log(`Updated visual baseline for ${route} (${theme}): ${baselinePath}`);
    return;
  }

  assert.ok(
    existsSync(baselinePath),
    `${route}: ${theme} visual baseline is missing at ${baselinePath}. Run UPDATE_VISUAL_BASELINES=1 pnpm run test:visual to create it.`,
  );

  const comparison = spawnSync(
    'magick',
    [
      'compare',
      '-metric',
      'AE',
      '-fuzz',
      visualBaselineFuzz,
      baselinePath,
      actualPath,
      'null:',
    ],
    { encoding: 'utf8' },
  );
  const comparisonOutput = `${comparison.stdout ?? ''}${comparison.stderr ?? ''}`;

  const differingPixels = Number.parseInt(comparisonOutput.trim().split(/\s+/)[0] ?? '', 10);
  assert.ok(
    Number.isFinite(differingPixels),
    `${route}: ${theme} visual comparison did not return a pixel count. Output: ${comparisonOutput.trim() || 'none'}`,
  );
  assert.ok(
    differingPixels <= visualBaselineMaxDiffPixels,
    `${route}: ${theme} visual baseline differs by ${differingPixels} pixels; ` +
      `allowed ${visualBaselineMaxDiffPixels} pixels after ${visualBaselineFuzz} fuzz. ` +
      `Captured artifact: ${actualPath}`,
  );
}

async function checkThemeRegression() {
  const debugPort = await findFreePort();
  const userDataDir = `${os.tmpdir()}/gan-theme-regression-${process.pid}`;
  const browserProcess = spawn(chromium, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--no-first-run',
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${debugPort}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let browserStderr = '';
  browserProcess.stderr?.on('data', (chunk) => {
    browserStderr = `${browserStderr}${chunk.toString()}`.slice(-4_000);
  });
  let cdp;
  try {
    const debugDeadline = Date.now() + 60_000;
    let target;
    while (Date.now() < debugDeadline) {
      if (browserProcess.exitCode !== null || browserProcess.signalCode !== null) break;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 500);
      try {
        const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`, {
          signal: controller.signal,
        });
        if (response.ok) {
          const targets = await response.json();
          target = targets.find((item) => item.type === 'page');
          if (target?.webSocketDebuggerUrl) break;
        }
      } catch {
        // Chromium may still be starting its debugging endpoint.
      } finally {
        clearTimeout(timeout);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(
      target?.webSocketDebuggerUrl,
      `Chromium did not expose a debuggable page for theme regression checks ` +
        `(exit code ${browserProcess.exitCode ?? 'pending'}, signal ${browserProcess.signalCode ?? 'none'}).` +
        `${browserStderr ? `\n${browserStderr}` : ''}`,
    );
    cdp = await connectToChromium(target.webSocketDebuggerUrl);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Network.enable');

    const routes = [
      { route: '/', name: 'homepage' },
      { route: '/article/ai-models-antibiotic-discovery', name: 'article-ai-models-antibiotic-discovery' },
      { route: '/industry', name: 'industry-map' },
      { route: '/brief', name: 'brief' },
      { route: '/insights?smoke-editor=1', name: 'newsroom' },
    ];
    const snapshots = new Map();

    await cdp.send('Page.navigate', { url: `${baseUrl}/` });
    await waitForThemeBrowserCondition(
      cdp,
      `!!document.querySelector('[data-testid="button-theme-toggle"]')`,
      'The homepage did not render the theme toggle.',
    );

    for (const theme of ['light', 'dark']) {
      for (const { route, name } of routes) {
        cdp.events.length = 0;
        await evaluateBrowser(cdp, `localStorage.setItem('global-ai-news-theme', '${theme}')`);
        await cdp.send('Page.navigate', { url: `${baseUrl}${route}` });
        await waitForThemeBrowserCondition(
          cdp,
          `!!document.querySelector('[data-testid="button-theme-toggle"]') && !!document.querySelector('main')`,
          `${route}: ${theme} mode did not render its main content and theme toggle.`,
        );
        await waitForThemeBrowserCondition(
          cdp,
          `!document.fonts || document.fonts.status === 'loaded'`,
          `${route}: ${theme} web fonts did not finish loading before the visual capture.`,
        );
        await new Promise((resolve) => setTimeout(resolve, 150));
        // Exclude this time-dependent editorial health notice from stable theme baselines.
        await evaluateBrowser(cdp, `document.querySelector('[data-testid="status-content-stale"]')?.remove()`);

        const visualState = await evaluateBrowser(cdp, `(() => {
          const root = getComputedStyle(document.documentElement);
          const body = getComputedStyle(document.body);
          const toggle = document.querySelector('[data-testid="button-theme-toggle"]');
          const surface = document.querySelector('[class~="bg-surface-muted"]');
          return {
            theme: document.documentElement.dataset.theme,
            rootBackground: root.getPropertyValue('--background').trim(),
            bodyBackground: body.backgroundColor,
            bodyColor: body.color,
            surfaceBackground: surface ? getComputedStyle(surface).backgroundColor : null,
            togglePressed: toggle?.getAttribute('aria-pressed'),
            themeToggleCount: document.querySelectorAll('[data-testid="button-theme-toggle"]').length,
            mainCount: document.querySelectorAll('main').length,
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
          };
        })()`);

        assert.equal(visualState.theme, theme, `${route}: persisted ${theme} mode was not applied to the document root.`);
        assert.equal(
          visualState.rootBackground,
          theme === 'dark' ? '204 21% 8%' : '45 30% 95%',
          `${route}: ${theme} mode activated the wrong background token.`,
        );
        assert.equal(visualState.togglePressed, String(theme === 'dark'), `${route}: theme toggle state is wrong in ${theme} mode.`);
        assert.equal(visualState.themeToggleCount, 1, `${route}: expected exactly one theme toggle in ${theme} mode.`);
        assert.equal(visualState.mainCount, 1, `${route}: expected exactly one main landmark in ${theme} mode.`);
        assert.ok(
          visualState.documentWidth <= visualState.viewportWidth,
          `${route}: ${theme} mode introduces horizontal overflow (${visualState.documentWidth}px > ${visualState.viewportWidth}px).`,
        );
        const bodyContrast = contrastRatio(visualState.bodyBackground, visualState.bodyColor);
        assert.ok(
          bodyContrast !== null && bodyContrast >= 4.5,
          `${route}: ${theme} mode body text contrast is too low (${bodyContrast?.toFixed(2) ?? 'unknown'}:1).`,
        );

        const screenshot = await cdp.send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: true,
        });
        const screenshotPath = path.join(
          os.tmpdir(),
          `gan-theme-regression-${process.pid}-${theme}-${route.replace(/[^a-z0-9]/gi, '-')}.png`,
        );
        const baselinePath = visualBaselinePath(name, theme);
        try {
          writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
          const [dimensions, mean] = execFileSync(
            'magick',
            [screenshotPath, '-format', '%wx%h %[fx:mean]', 'info:'],
            { encoding: 'utf8' },
          ).trim().split(/\s+/);
          assert.equal(dimensions, '1440x1000', `${route}: ${theme} screenshot has unstable dimensions (${dimensions}).`);
          assert.ok(Number(mean) > 0.02 && Number(mean) < 0.98, `${route}: ${theme} screenshot appears blank or overexposed.`);
          compareVisualBaseline({ actualPath: screenshotPath, baselinePath, route, theme });
        } catch (error) {
          mkdirSync(screenshotFailureDir, { recursive: true });
          const retainedFailurePath = visualFailurePath(name, theme);
          copyFileSync(screenshotPath, retainedFailurePath);
          const message = error instanceof Error ? error.message : String(error);
          assert.fail(`${route}: ${theme} visual review failed. Captured artifact: ${retainedFailurePath}. ${message}`);
        } finally {
          unlinkSync(screenshotPath);
        }

        const browserErrors = cdp.events
          .filter((event) => (
            (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error')
            || event.method === 'Runtime.exceptionThrown'
          ))
          .map((event) => event.method === 'Runtime.exceptionThrown'
            ? event.params.exceptionDetails?.text ?? 'Unhandled browser exception'
            : event.params.args?.map((argument) => argument.value ?? argument.description ?? '').join(' ') ?? 'Browser console error');
        assert.deepEqual(browserErrors, [], `${route}: ${theme} mode emitted browser errors: ${browserErrors.join(' | ')}`);

        const key = `${route}::${theme}`;
        snapshots.set(key, visualState);
      }
    }

    for (const { route } of routes) {
      const light = snapshots.get(`${route}::light`);
      const dark = snapshots.get(`${route}::dark`);
      assert.notEqual(light.bodyBackground, dark.bodyBackground, `${route}: light and dark body backgrounds are indistinguishable.`);
      assert.notEqual(light.bodyColor, dark.bodyColor, `${route}: light and dark body text colors are indistinguishable.`);
      if (light.surfaceBackground && dark.surfaceBackground) {
        assert.notEqual(light.surfaceBackground, dark.surfaceBackground, `${route}: themed surface background did not change between modes.`);
      }
    }

    const authRoutes = ['/sign-in'];
    for (const theme of ['light', 'dark']) {
      for (const route of authRoutes) {
        cdp.events.length = 0;
        await evaluateBrowser(cdp, `localStorage.setItem('global-ai-news-theme', '${theme}')`);
        await cdp.send('Page.navigate', { url: `${baseUrl}${route}` });
        await waitForThemeBrowserCondition(
          cdp,
          `!!document.querySelector('input:not([type="hidden"])') && !!document.querySelector('button')`,
          `${route}: ${theme} mode did not render the Clerk form controls.`,
        );
        await new Promise((resolve) => setTimeout(resolve, 250));

        const authState = await evaluateBrowser(cdp, `(() => {
          const root = getComputedStyle(document.documentElement);
          const body = getComputedStyle(document.body);
          const input = document.querySelector('input:not([type="hidden"])');
          const isVisible = (element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          };
          const submit = [...document.querySelectorAll('button.cl-formButtonPrimary')].find(isVisible)
            ?? [...document.querySelectorAll('button[type="submit"]')].find(isVisible)
            ?? [...document.querySelectorAll('button')].find(isVisible);
          const visibleBackground = (element) => {
            let current = element;
            while (current) {
              const background = getComputedStyle(current).backgroundColor;
              const translucent = background === 'transparent'
                || background.startsWith('rgba(')
                || background.startsWith('hsla(')
                || background.includes('/');
              if (!translucent) return background;
              current = current.parentElement;
            }
            return body.backgroundColor;
          };
          const inputRect = input?.getBoundingClientRect();
          const submitRect = submit?.getBoundingClientRect();
          const inputStyle = input ? getComputedStyle(input) : null;
          const submitStyle = submit ? getComputedStyle(submit) : null;
          return {
            theme: document.documentElement.dataset.theme,
            rootBackground: root.getPropertyValue('--background').trim(),
            bodyBackground: body.backgroundColor,
            bodyColor: body.color,
            inputBackground: input ? visibleBackground(input) : null,
            inputColor: inputStyle?.color ?? null,
            inputVisible: Boolean(inputRect && inputRect.width > 0 && inputRect.height > 0),
            submitBackground: submit ? visibleBackground(submit) : null,
            submitColor: submitStyle?.color ?? null,
            submitVisible: Boolean(submitRect && submitRect.width > 0 && submitRect.height > 0),
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
          };
        })()`);

        await evaluateBrowser(cdp, 'document.activeElement?.blur()');
        for (let tab = 0; tab < 8; tab += 1) {
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab' });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
          if (await evaluateBrowser(cdp, `document.activeElement?.matches('input:not([type="hidden"])')`)) break;
        }
        const focusState = await evaluateBrowser(cdp, `(() => {
          const input = document.querySelector('input:not([type="hidden"])');
          const baseStyle = input ? getComputedStyle(input) : null;
          const focusedStyle = input && document.activeElement === input ? getComputedStyle(input) : null;
          return {
            focusVisible: Boolean(input && input.matches(':focus-visible')),
            hasFocusIndicator: Boolean(
              focusedStyle
              && (
                (focusedStyle.outlineStyle !== 'none' && focusedStyle.outlineWidth !== '0px')
                || focusedStyle.boxShadow !== 'none'
                || focusedStyle.borderColor !== baseStyle?.borderColor
              ),
            ),
          };
        })()`);
        Object.assign(authState, focusState);

        assert.equal(authState.theme, theme, `${route}: persisted ${theme} mode was not applied on the Clerk route.`);
        assert.equal(
          authState.rootBackground,
          theme === 'dark' ? '204 21% 8%' : '45 30% 95%',
          `${route}: ${theme} mode activated the wrong background token.`,
        );
        assert.equal(authState.inputVisible, true, `${route}: ${theme} mode email/input control is not visible: ${JSON.stringify(authState)}`);
        assert.equal(authState.submitVisible, true, `${route}: ${theme} mode primary form button is not visible: ${JSON.stringify(authState)}`);
        assert.ok(
          contrastRatio(authState.inputBackground, authState.inputColor) >= 4.5,
          `${route}: ${theme} mode input contrast is too low.`,
        );
        assert.ok(
          contrastRatio(authState.submitBackground, authState.submitColor) >= 4.5,
          `${route}: ${theme} mode primary button contrast is too low.`,
        );
        assert.equal(authState.focusVisible, true, `${route}: ${theme} mode input did not receive keyboard-visible focus.`);
        assert.equal(authState.hasFocusIndicator, true, `${route}: ${theme} mode input has no visible focus treatment.`);
        assert.ok(
          authState.documentWidth <= authState.viewportWidth,
          `${route}: ${theme} mode introduces horizontal overflow (${authState.documentWidth}px > ${authState.viewportWidth}px).`,
        );

        await evaluateBrowser(cdp, `(() => {
          const fields = [...document.querySelectorAll('input:not([type="hidden"])')];
          for (const field of fields) {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
            setter?.call(field, '');
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
          }
          fields[0]?.focus();
          return fields.length;
        })()`);
        if (route === '/sign-up') {
          await cdp.send('Input.insertText', { text: 'editor@example.com' });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab' });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
          await cdp.send('Input.insertText', { text: 'x' });
          for (let tab = 0; tab < 2; tab += 1) {
            await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab' });
            await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
          }
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter' });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter' });
        } else {
          const primaryButton = await evaluateBrowser(cdp, `(() => {
            const button = [...document.querySelectorAll('button.cl-formButtonPrimary')]
              .find((element) => {
                const rect = element.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
              });
            if (!button) return null;
            const rect = button.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          })()`);
          assert.ok(primaryButton, `${route}: ${theme} mode primary button disappeared before validation.`);
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            x: primaryButton.x,
            y: primaryButton.y,
            button: 'left',
            clickCount: 1,
          });
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            x: primaryButton.x,
            y: primaryButton.y,
            button: 'left',
            clickCount: 1,
          });
        }
        await waitForBrowserCondition(
          cdp,
          route === '/sign-up'
            ? `!!document.querySelector('input[aria-invalid="true"]') && !!document.querySelector('.cl-formFieldErrorText')`
            : `([...document.querySelectorAll('.cl-alert, [role="alert"], [aria-live]')].some((element) => (element.textContent ?? '').trim().length > 0))`,
          `${route}: ${theme} mode did not render Clerk validation feedback after the safe auth-form submit.`,
        );

        const validationState = await evaluateBrowser(cdp, `(() => {
          const invalidInput = document.querySelector('input[aria-invalid="true"]');
          const isVisible = (element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          };
          const error = [...document.querySelectorAll('.cl-formFieldErrorText')]
            .find((element) => (element.textContent ?? '').trim().length > 0 && isVisible(element))
            ?? [...document.querySelectorAll('.cl-alert, [role="alert"], [aria-live]')]
              .find((element) => (element.textContent ?? '').trim().length > 0 && isVisible(element));
          const body = getComputedStyle(document.body);
          const visibleBackground = (element) => {
            let current = element;
            while (current) {
              const background = getComputedStyle(current).backgroundColor;
              const translucent = background === 'transparent'
                || background.startsWith('rgba(')
                || background.startsWith('hsla(')
                || background.includes('/');
              if (!translucent) return background;
              current = current.parentElement;
            }
            return body.backgroundColor;
          };
          const liveMessages = [...document.querySelectorAll('[aria-live], [role="alert"]')]
            .map((element) => element.textContent?.trim() ?? '')
            .filter(Boolean);
          const style = error ? getComputedStyle(error) : null;
          const rect = error?.getBoundingClientRect();
          return {
            invalidField: invalidInput?.getAttribute('aria-describedby') ?? null,
            errorText: error?.textContent?.trim() ?? '',
            errorVisible: Boolean(rect && rect.width > 0 && rect.height > 0),
            errorColor: style?.color ?? null,
            errorBackground: error ? visibleBackground(error) : null,
            liveMessages,
          };
        })()`);
        if (route === '/sign-up') {
          assert.ok(validationState.invalidField, `${route}: ${theme} mode validation did not mark a field invalid.`);
          assert.match(validationState.errorText, /password/i, `${route}: ${theme} mode validation message is missing password guidance.`);
        } else {
          assert.ok(validationState.errorText, `${route}: ${theme} mode rejected sign-in without an error message.`);
        }
        assert.equal(validationState.errorVisible, true, `${route}: ${theme} mode validation message is not visible.`);
        assert.ok(
          contrastRatio(validationState.errorBackground, validationState.errorColor) >= 4.5,
          `${route}: ${theme} mode validation message contrast is too low.`,
        );
        assert.ok(
          validationState.liveMessages.some((message) => /password/i.test(message)),
          `${route}: ${theme} mode validation message was not announced through a live region.`,
        );

        const browserErrors = cdp.events
          .filter((event) => (
            (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error')
            || event.method === 'Runtime.exceptionThrown'
          ))
          .map((event) => event.method === 'Runtime.exceptionThrown'
            ? event.params.exceptionDetails?.text ?? 'Unhandled browser exception'
            : event.params.args?.map((argument) => argument.value ?? argument.description ?? '').join(' ') ?? 'Browser console error');
        assert.deepEqual(browserErrors, [], `${route}: ${theme} mode emitted browser errors: ${browserErrors.join(' | ')}`);
      }
    }

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 402,
      height: 874,
      deviceScaleFactor: 1,
      mobile: true,
    });

    for (const theme of ['light', 'dark']) {
      for (const route of authRoutes) {
        cdp.events.length = 0;
        await evaluateBrowser(cdp, `localStorage.setItem('global-ai-news-theme', '${theme}')`);
        await cdp.send('Page.navigate', { url: `${baseUrl}${route}` });
        await waitForBrowserCondition(
          cdp,
          `document.readyState === 'complete' && !!document.querySelector('input:not([type="hidden"])') && !!document.querySelector('button')`,
          `${route}: ${theme} mode did not render the Clerk form controls at the mobile smoke viewport.`,
        );
        await new Promise((resolve) => setTimeout(resolve, 250));

        const mobileAuthState = await evaluateBrowser(cdp, `(() => {
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const isVisible = (element) => {
            const rect = element?.getBoundingClientRect();
            return Boolean(rect && rect.width > 0 && rect.height > 0);
          };
          const isInsideViewport = (element) => {
            const rect = element?.getBoundingClientRect();
            return Boolean(
              rect
              && rect.width > 0
              && rect.height > 0
              && rect.left >= 0
              && rect.right <= viewportWidth
              && rect.top >= 0
              && rect.bottom <= viewportHeight,
            );
          };
          const fields = [...document.querySelectorAll('input:not([type="hidden"])')];
          const labels = fields.map((field) => {
            const fieldContainer = field.closest('.cl-formField');
            const label = fieldContainer?.querySelector('label')
              ?? (field.id ? document.querySelector('label[for="' + field.id + '"]') : null);
            return {
              text: label?.textContent?.trim() ?? '',
              visible: isVisible(label),
              insideViewport: isInsideViewport(label),
            };
          });
          const primaryButton = [...document.querySelectorAll('button.cl-formButtonPrimary')]
            .find(isVisible)
            ?? [...document.querySelectorAll('button[type="submit"]')].find(isVisible);
          return {
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth,
            fields: fields.map((field) => ({
              visible: isVisible(field),
              insideViewport: isInsideViewport(field),
              width: field.getBoundingClientRect().width,
            })),
            labels,
            primaryButton: {
              visible: isVisible(primaryButton),
              insideViewport: isInsideViewport(primaryButton),
              width: primaryButton?.getBoundingClientRect().width ?? 0,
            },
          };
        })()`);

        assert.ok(
          mobileAuthState.documentWidth <= mobileAuthState.viewportWidth,
          `${route}: ${theme} mode introduces horizontal overflow at the mobile smoke viewport (${mobileAuthState.documentWidth}px > ${mobileAuthState.viewportWidth}px).`,
        );
        assert.ok(
          mobileAuthState.fields.length > 0 && mobileAuthState.fields.every((field) => field.visible && field.insideViewport && field.width >= 200),
          `${route}: ${theme} mode has a clipped or compressed primary input at the mobile smoke viewport: ${JSON.stringify(mobileAuthState)}`,
        );
        assert.ok(
          mobileAuthState.labels.length > 0
            && mobileAuthState.labels.every((label) => label.text && label.visible && label.insideViewport),
          `${route}: ${theme} mode has a clipped or unreadable field label at the mobile smoke viewport: ${JSON.stringify(mobileAuthState)}`,
        );
        assert.ok(
          mobileAuthState.primaryButton.visible
            && mobileAuthState.primaryButton.insideViewport
            && mobileAuthState.primaryButton.width >= 240,
          `${route}: ${theme} mode primary button is clipped or compressed at the mobile smoke viewport: ${JSON.stringify(mobileAuthState)}`,
        );

        await evaluateBrowser(cdp, 'document.activeElement?.blur()');
        for (let tab = 0; tab < 8; tab += 1) {
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab' });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
          if (await evaluateBrowser(cdp, `document.activeElement?.matches('input:not([type="hidden"])')`)) break;
        }
        const mobileFocusState = await evaluateBrowser(cdp, `(() => {
          const input = document.querySelector('input:not([type="hidden"])');
          const baseStyle = input ? getComputedStyle(input) : null;
          const focusedStyle = input && document.activeElement === input ? getComputedStyle(input) : null;
          const rect = input?.getBoundingClientRect();
          return {
            focusVisible: Boolean(input && input.matches(':focus-visible')),
            hasFocusIndicator: Boolean(
              focusedStyle
              && (
                (focusedStyle.outlineStyle !== 'none' && focusedStyle.outlineWidth !== '0px')
                || focusedStyle.boxShadow !== 'none'
                || focusedStyle.borderColor !== baseStyle?.borderColor
              ),
            ),
            insideViewport: Boolean(rect && rect.left >= 0 && rect.right <= window.innerWidth),
          };
        })()`);
        assert.equal(
          mobileFocusState.focusVisible,
          true,
          `${route}: ${theme} mode mobile input did not receive keyboard-visible focus.`,
        );
        assert.equal(
          mobileFocusState.hasFocusIndicator,
          true,
          `${route}: ${theme} mode mobile input has no visible focus treatment.`,
        );
        assert.equal(
          mobileFocusState.insideViewport,
          true,
          `${route}: ${theme} mode focused mobile input is clipped horizontally.`,
        );

        const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
        const screenshotPath = path.join(
          os.tmpdir(),
          `gan-auth-mobile-${process.pid}-${theme}-${route.replace(/[^a-z0-9]/gi, '-')}.png`,
        );
        try {
          writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
          const [dimensions, mean] = execFileSync(
            'magick',
            [screenshotPath, '-format', '%wx%h %[fx:mean]', 'info:'],
            { encoding: 'utf8' },
          ).trim().split(/\s+/);
          assert.equal(dimensions, '402x874', `${route}: ${theme} mobile screenshot has unstable dimensions (${dimensions}).`);
          assert.ok(Number(mean) > 0.02 && Number(mean) < 0.98, `${route}: ${theme} mobile screenshot appears blank or overexposed.`);
        } finally {
          unlinkSync(screenshotPath);
        }

        const browserErrors = cdp.events
          .filter((event) => (
            (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error')
            || event.method === 'Runtime.exceptionThrown'
          ))
          .map((event) => event.method === 'Runtime.exceptionThrown'
            ? event.params.exceptionDetails?.text ?? 'Unhandled browser exception'
            : event.params.args?.map((argument) => argument.value ?? argument.description ?? '').join(' ') ?? 'Browser console error');
        assert.deepEqual(
          browserErrors,
          [],
          `${route}: ${theme} mobile mode emitted browser errors: ${browserErrors.join(' | ')}`,
        );

        if (route === '/sign-in') {
          const recoveryTrigger = await evaluateBrowser(cdp, `(() => {
            const button = document.querySelector('[data-testid="button-forgot-password"]');
            const rect = button?.getBoundingClientRect();
            return rect && rect.width > 0 && rect.height > 0
              ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
              : null;
          })()`);
          assert.ok(
            recoveryTrigger,
            `${route}: ${theme} mode did not expose a visible password recovery action at the mobile smoke viewport.`,
          );
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            x: recoveryTrigger.x,
            y: recoveryTrigger.y,
            button: 'left',
            clickCount: 1,
          });
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            x: recoveryTrigger.x,
            y: recoveryTrigger.y,
            button: 'left',
            clickCount: 1,
          });
          await waitForBrowserCondition(
            cdp,
            `!!document.querySelector('[data-testid="auth-password-recovery"]') && !!document.querySelector('[data-testid="input-password-recovery-email"]')`,
            `${route}: ${theme} mode did not open the password recovery step.`,
          );

          const recoveryState = await evaluateBrowser(cdp, `(() => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const isVisible = (element) => {
              const rect = element?.getBoundingClientRect();
              return Boolean(rect && rect.width > 0 && rect.height > 0);
            };
            const isInsideViewport = (element) => {
              const rect = element?.getBoundingClientRect();
              return Boolean(
                rect
                && rect.width > 0
                && rect.height > 0
                && rect.left >= 0
                && rect.right <= viewportWidth
                && rect.top >= 0
                && rect.bottom <= viewportHeight,
              );
            };
            const recovery = document.querySelector('[data-testid="auth-password-recovery"]');
            const input = document.querySelector('[data-testid="input-password-recovery-email"]');
            const label = document.querySelector('label[for="password-recovery-email"]');
            const primary = document.querySelector('[data-testid="button-password-recovery-submit"]');
            const heading = document.querySelector('#password-recovery-title');
            return {
              documentWidth: document.documentElement.scrollWidth,
              viewportWidth,
              viewportHeight,
              recoveryVisible: isVisible(recovery),
              recoveryInsideViewport: isInsideViewport(recovery),
              inputVisible: isVisible(input),
              inputInsideViewport: isInsideViewport(input),
              inputWidth: input?.getBoundingClientRect().width ?? 0,
              labelText: label?.textContent?.trim() ?? '',
              labelVisible: isVisible(label),
              labelInsideViewport: isInsideViewport(label),
              primaryVisible: isVisible(primary),
              primaryInsideViewport: isInsideViewport(primary),
              primaryWidth: primary?.getBoundingClientRect().width ?? 0,
              headingVisible: isVisible(heading),
              headingInsideViewport: isInsideViewport(heading),
            };
          })()`);

          assert.ok(
            recoveryState.documentWidth <= recoveryState.viewportWidth,
            `${route}: ${theme} mode password recovery introduces horizontal overflow (${recoveryState.documentWidth}px > ${recoveryState.viewportWidth}px).`,
          );
          assert.ok(
            recoveryState.recoveryVisible && recoveryState.recoveryInsideViewport,
            `${route}: ${theme} mode password recovery card is clipped at the mobile smoke viewport: ${JSON.stringify(recoveryState)}`,
          );
          assert.ok(
            recoveryState.inputVisible
              && recoveryState.inputInsideViewport
              && recoveryState.inputWidth >= 200,
            `${route}: ${theme} mode password recovery input is clipped or compressed: ${JSON.stringify(recoveryState)}`,
          );
          assert.ok(
            recoveryState.labelText
              && recoveryState.labelVisible
              && recoveryState.labelInsideViewport,
            `${route}: ${theme} mode password recovery label is missing or clipped: ${JSON.stringify(recoveryState)}`,
          );
          assert.ok(
            recoveryState.primaryVisible
              && recoveryState.primaryInsideViewport
              && recoveryState.primaryWidth >= 240,
            `${route}: ${theme} mode password recovery primary action is clipped or compressed: ${JSON.stringify(recoveryState)}`,
          );
          assert.ok(
            recoveryState.headingVisible && recoveryState.headingInsideViewport,
            `${route}: ${theme} mode password recovery heading is clipped: ${JSON.stringify(recoveryState)}`,
          );

          const recoverySubmit = await evaluateBrowser(cdp, `(() => {
            const button = document.querySelector('[data-testid="button-password-recovery-submit"]');
            const rect = button?.getBoundingClientRect();
            return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
          })()`);
          assert.ok(recoverySubmit, `${route}: ${theme} mode password recovery submit action disappeared.`);
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            x: recoverySubmit.x,
            y: recoverySubmit.y,
            button: 'left',
            clickCount: 1,
          });
          await cdp.send('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            x: recoverySubmit.x,
            y: recoverySubmit.y,
            button: 'left',
            clickCount: 1,
          });
          await waitForBrowserCondition(
            cdp,
            `!!document.querySelector('[data-testid="password-recovery-error"]')`,
            `${route}: ${theme} mode password recovery did not render safe empty-email feedback.`,
          );

          const recoveryErrorState = await evaluateBrowser(cdp, `(() => {
            const error = document.querySelector('[data-testid="password-recovery-error"]');
            const body = getComputedStyle(document.body);
            const visibleBackground = (element) => {
              let current = element;
              while (current) {
                const background = getComputedStyle(current).backgroundColor;
                const translucent = background === 'transparent'
                  || background.startsWith('rgba(')
                  || background.startsWith('hsla(')
                  || background.includes('/');
                if (!translucent) return background;
                current = current.parentElement;
              }
              return body.backgroundColor;
            };
            const rect = error?.getBoundingClientRect();
            const style = error ? getComputedStyle(error) : null;
            return {
              text: error?.textContent?.trim() ?? '',
              visible: Boolean(rect && rect.width > 0 && rect.height > 0),
              insideViewport: Boolean(
                rect
                && rect.left >= 0
                && rect.right <= window.innerWidth
                && rect.top >= 0
                && rect.bottom <= window.innerHeight,
              ),
              color: style?.color ?? null,
              background: error ? visibleBackground(error) : null,
              live: error?.getAttribute('aria-live') ?? null,
            };
          })()`);
          assert.match(
            recoveryErrorState.text,
            /email address/i,
            `${route}: ${theme} mode password recovery feedback is missing email guidance.`,
          );
          assert.ok(
            recoveryErrorState.visible && recoveryErrorState.insideViewport,
            `${route}: ${theme} mode password recovery feedback is clipped: ${JSON.stringify(recoveryErrorState)}`,
          );
          assert.ok(
            contrastRatio(recoveryErrorState.background, recoveryErrorState.color) >= 4.5,
            `${route}: ${theme} mode password recovery feedback contrast is too low.`,
          );
          assert.equal(
            recoveryErrorState.live,
            'assertive',
            `${route}: ${theme} mode password recovery feedback is not announced as a live region.`,
          );

          const recoveryBrowserErrors = cdp.events
            .filter((event) => (
              (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error')
              || event.method === 'Runtime.exceptionThrown'
            ))
            .map((event) => event.method === 'Runtime.exceptionThrown'
              ? event.params.exceptionDetails?.text ?? 'Unhandled browser exception'
              : event.params.args?.map((argument) => argument.value ?? argument.description ?? '').join(' ') ?? 'Browser console error');
          assert.deepEqual(
            recoveryBrowserErrors,
            [],
            `${route}: ${theme} mode password recovery emitted browser errors: ${recoveryBrowserErrors.join(' | ')}`,
          );
        }
      }
    }

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 402,
      height: 874,
      deviceScaleFactor: 1,
      mobile: true,
    });

    for (const theme of ['light', 'dark']) {
      for (const route of authRoutes) {
        cdp.events.length = 0;
        await evaluateBrowser(cdp, `localStorage.setItem('global-ai-news-theme', '${theme}')`);
        await cdp.send('Page.navigate', { url: `${baseUrl}${route}` });
        await waitForBrowserCondition(
          cdp,
          `document.readyState === 'complete' && !!document.querySelector('input:not([type="hidden"])') && !!document.querySelector('button')`,
          `${route}: ${theme} mode did not render the Clerk form controls for the enlarged-text smoke check.`,
        );
        await new Promise((resolve) => setTimeout(resolve, 250));
        await evaluateBrowser(cdp, `document.documentElement.style.fontSize = '125%'`);
        await new Promise((resolve) => setTimeout(resolve, 100));

        const enlargedTextState = await evaluateBrowser(cdp, `(() => {
          const viewportWidth = window.innerWidth;
          const isVisible = (element) => {
            const rect = element?.getBoundingClientRect();
            return Boolean(rect && rect.width > 0 && rect.height > 0);
          };
          const fitsHorizontally = (element) => {
            const rect = element?.getBoundingClientRect();
            return Boolean(rect && rect.left >= 0 && rect.right <= viewportWidth);
          };
          const fields = [...document.querySelectorAll('input:not([type="hidden"])')];
          const labels = fields.map((field) => {
            const fieldContainer = field.closest('.cl-formField');
            const label = fieldContainer?.querySelector('label')
              ?? (field.id ? document.querySelector('label[for="' + field.id + '"]') : null);
            return {
              text: label?.textContent?.trim() ?? '',
              visible: isVisible(label),
              fitsHorizontally: fitsHorizontally(label),
            };
          });
          const primaryButton = [...document.querySelectorAll('button.cl-formButtonPrimary')]
            .find(isVisible)
            ?? [...document.querySelectorAll('button[type="submit"]')].find(isVisible);
          return {
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth,
            fields: fields.map((field) => ({
              visible: isVisible(field),
              fitsHorizontally: fitsHorizontally(field),
            })),
            labels,
            primaryButton: {
              visible: isVisible(primaryButton),
              fitsHorizontally: fitsHorizontally(primaryButton),
            },
          };
        })()`);

        assert.ok(
          enlargedTextState.documentWidth <= enlargedTextState.viewportWidth,
          `${route}: ${theme} mode introduces horizontal overflow with 125% browser text sizing (${enlargedTextState.documentWidth}px > ${enlargedTextState.viewportWidth}px).`,
        );
        assert.ok(
          enlargedTextState.fields.length > 0
            && enlargedTextState.fields.every((field) => field.visible && field.fitsHorizontally),
          `${route}: ${theme} mode has a clipped input with 125% browser text sizing: ${JSON.stringify(enlargedTextState)}`,
        );
        assert.ok(
          enlargedTextState.labels.length > 0
            && enlargedTextState.labels.every((label) => label.text && label.visible && label.fitsHorizontally),
          `${route}: ${theme} mode has a clipped field label with 125% browser text sizing: ${JSON.stringify(enlargedTextState)}`,
        );
        assert.ok(
          enlargedTextState.primaryButton.visible && enlargedTextState.primaryButton.fitsHorizontally,
          `${route}: ${theme} mode primary button is clipped with 125% browser text sizing: ${JSON.stringify(enlargedTextState)}`,
        );

        await evaluateBrowser(cdp, 'document.activeElement?.blur()');
        for (let tab = 0; tab < 8; tab += 1) {
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab' });
          await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
          if (await evaluateBrowser(cdp, `document.activeElement?.matches('input:not([type="hidden"])')`)) break;
        }
        const enlargedTextFocusState = await evaluateBrowser(cdp, `(() => {
          const input = document.querySelector('input:not([type="hidden"])');
          const baseStyle = input ? getComputedStyle(input) : null;
          const focusedStyle = input && document.activeElement === input ? getComputedStyle(input) : null;
          const rect = input?.getBoundingClientRect();
          return {
            focusVisible: Boolean(input && input.matches(':focus-visible')),
            hasFocusIndicator: Boolean(
              focusedStyle
              && (
                (focusedStyle.outlineStyle !== 'none' && focusedStyle.outlineWidth !== '0px')
                || focusedStyle.boxShadow !== 'none'
                || focusedStyle.borderColor !== baseStyle?.borderColor
              ),
            ),
            fitsHorizontally: Boolean(rect && rect.left >= 0 && rect.right <= window.innerWidth),
          };
        })()`);
        assert.equal(
          enlargedTextFocusState.focusVisible,
          true,
          `${route}: ${theme} mode input did not receive keyboard-visible focus with 125% browser text sizing.`,
        );
        assert.equal(
          enlargedTextFocusState.hasFocusIndicator,
          true,
          `${route}: ${theme} mode input has no visible focus treatment with 125% browser text sizing.`,
        );
        assert.equal(
          enlargedTextFocusState.fitsHorizontally,
          true,
          `${route}: ${theme} mode focused input is clipped horizontally with 125% browser text sizing.`,
        );

        const browserErrors = cdp.events
          .filter((event) => (
            (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error')
            || event.method === 'Runtime.exceptionThrown'
          ))
          .map((event) => event.method === 'Runtime.exceptionThrown'
            ? event.params.exceptionDetails?.text ?? 'Unhandled browser exception'
            : event.params.args?.map((argument) => argument.value ?? argument.description ?? '').join(' ') ?? 'Browser console error');
        assert.deepEqual(
          browserErrors,
          [],
          `${route}: ${theme} enlarged-text mode emitted browser errors: ${browserErrors.join(' | ')}`,
        );
      }
    }

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluateBrowser(cdp, `localStorage.setItem('global-ai-news-theme', 'light')`);
    await cdp.send('Page.navigate', { url: `${baseUrl}/` });
    await waitForBrowserCondition(
      cdp,
      `document.documentElement?.dataset.theme === 'light' && document.querySelector('[data-testid="button-theme-toggle"]')?.getAttribute('aria-pressed') === 'false'`,
      'The persisted light theme did not restore after a full navigation.',
    );
    await evaluateBrowser(cdp, `document.querySelector('[data-testid="button-theme-toggle"]').click()`);
    await waitForBrowserCondition(
      cdp,
      `document.documentElement.dataset.theme === 'dark' && localStorage.getItem('global-ai-news-theme') === 'dark' && document.querySelector('[data-testid="button-theme-toggle"]')?.getAttribute('aria-pressed') === 'true'`,
      'Clicking the theme toggle did not persist and apply dark mode.',
    );
    console.log(
      `Theme regression checked ${routes.length} public routes plus ${authRoutes.length} Clerk routes ` +
      `in light and dark mode at desktop and mobile viewports with contrast, focus, retained baselines, screenshots, and browser-error assertions.`,
    );
  } finally {
    cdp?.close();
    await stopBrowserProcess(browserProcess);
  }
}

async function startApiServer() {
  if (process.env.SMOKE_API_ORIGIN) return;

  apiProcess = spawn('pnpm', ['--filter', '@workspace/api-server', 'run', 'dev'], {
    cwd: path.resolve(root, '..', '..'),
    env: {
      ...process.env,
      NODE_ENV: 'test',
      NEWSROOM_TEST_EDITOR_ID: smokeEditorId,
      NEWSROOM_TEST_PUBLICATION_NOW: new Date(Date.now() + 5 * 60_000).toISOString(),
      PORT: '19820',
    },
    stdio: ['ignore', 'ignore', 'pipe'],
    detached: true,
  });
  apiOrigin = 'http://127.0.0.1:19820';

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${apiOrigin}/api/healthz`);
      if (response.ok) return;
    } catch {
      // The API build may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error('The smoke test API server did not become ready within 60 seconds.');
}

function expectedPrimaryType(route, article) {
  if (route.startsWith('/person/')) return 'ProfilePage';
  if (article) return 'NewsArticle';
  if (route.startsWith('/research/')) return 'Report';
  if (route.startsWith('/data/')) return 'Dataset';
  if (route.startsWith('/topic/')) return 'CollectionPage';
  return 'WebSite';
}

function assertSeoDocument(document, route, { article = false, stories = [], authors = [], ampPath = '' } = {}) {
  const title = htmlText(tagContent(document, 'title'));
  const description = metaContent(document, 'name', 'description');
  const canonical = linkHref(document, 'canonical');
  const expectedCanonical = `${site}${route === '/' ? '/' : `${route}/`}`;

  assert.ok(title.length >= 20, `${route}: title is missing or too short`);
  assert.ok(description.length >= 20, `${route}: description is missing or too short`);
  assert.equal(canonical, expectedCanonical, `${route}: canonical does not match the requested route`);
  assert.equal(metaContent(document, 'property', 'og:title'), title, `${route}: og:title mismatch`);
  assert.equal(metaContent(document, 'property', 'og:description'), description, `${route}: og:description mismatch`);
  assert.equal(metaContent(document, 'property', 'og:url'), canonical, `${route}: og:url mismatch`);
  assert.equal(metaContent(document, 'name', 'twitter:card'), 'summary_large_image', `${route}: Twitter card missing`);
  assert.equal((document.match(/<main\b/gi) ?? []).length, 1, `${route}: expected one main landmark`);
  const h1Count = (document.match(/<h1\b/gi) ?? []).length;
  assert.equal(
    h1Count,
    1,
    `${route}: expected one h1 (found ${h1Count}); main excerpt: ${tagContent(document, 'main').slice(0, 500)}`,
  );

  const structuredDataText = tagContent(document, 'script', '[^>]*data-global-ai-ld');
  assert.ok(structuredDataText, `${route}: JSON-LD is missing`);
  const structuredData = JSON.parse(structuredDataText);
  assert.equal(structuredData['@context'], 'https://schema.org', `${route}: JSON-LD context is invalid`);
  assert.ok(Array.isArray(structuredData['@graph']), `${route}: JSON-LD graph is missing`);
  const primaryType = expectedPrimaryType(route, article);
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === primaryType), `${route}: expected primary JSON-LD type is missing`);
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === 'BreadcrumbList'), `${route}: breadcrumb JSON-LD is missing`);

  if (article) {
    assertSocialPreviewMetadata(document, route);
    const articleData = structuredData['@graph'].find((entry) => entry['@type'] === 'NewsArticle');
    const slug = route.split('/')[2];
    const expectedStory = stories.find((story) => story.slug === slug);
    const expectedAuthor = expectedStory && authors.find(
      (author) => author.slug === expectedStory.author && author.verifiedForPublication === true,
    );
    const expectedOrganizationByline = expectedStory?.authorType === 'organization'
      ? expectedStory.authorName?.trim() || 'Global AI News Editorial Desk'
      : 'Global AI News Editorial Desk';
    const expectedModifiedDate =
      expectedStory?.dateModified &&
      expectedStory.dateModified >= expectedStory.date
        ? expectedStory.dateModified
        : undefined;
    assert.equal(articleData.image, metaContent(document, 'property', 'og:image'), `${route}: JSON-LD image does not match social preview`);
    assert.equal(articleData.url, expectedCanonical, `${route}: NewsArticle URL does not match the canonical URL`);
    assert.equal(articleData.mainEntityOfPage['@id'], expectedCanonical, `${route}: NewsArticle main entity does not match the canonical URL`);
    assert.ok(expectedStory, `${route}: maintained story record is missing for JSON-LD verification`);
    assert.equal(
      articleData.author['@type'],
      expectedAuthor ? 'Person' : 'Organization',
      `${route}: JSON-LD author must match the verified-person or organization fallback policy`,
    );
    assert.equal(
      articleData.author.name,
      expectedAuthor?.name ?? expectedOrganizationByline,
      `${route}: JSON-LD author drifted from the maintained story record`,
    );
    assert.equal(
      articleData.author.url,
      expectedAuthor ? `${site}/person/${expectedAuthor.slug}/` : site,
      `${route}: JSON-LD author URL does not match its public attribution`,
    );
    assert.equal(articleData.datePublished, expectedStory.date, `${route}: JSON-LD publication date drifted from the maintained story record`);
    assert.equal(articleData.dateModified, expectedModifiedDate, `${route}: JSON-LD modification date is not publication-safe`);
    const expectedVisibleUpdatedDate =
      expectedModifiedDate && expectedModifiedDate !== expectedStory.date
        ? expectedModifiedDate
        : undefined;
    const visibleUpdatedDate = document.match(
      /\bUpdated\s*<time\b[^>]*datetime=["']([^"']+)["']/i,
    )?.[1];
    assert.equal(
      visibleUpdatedDate,
      expectedVisibleUpdatedDate,
      `${route}: visible updated date is not publication-safe`,
    );
    assert.equal(
      metaContent(document, 'property', 'article:modified_time'),
      expectedModifiedDate ?? '',
      `${route}: article modified-time metadata is not publication-safe`,
    );
    assert.equal(articleData.articleSection, expectedStory.category, `${route}: JSON-LD article section drifted from the maintained story record`);
    assert.equal(articleData.mainEntityOfPage['@id'], `${site}${route}/`, `${route}: JSON-LD main entity does not match the canonical article URL`);
    assert.equal(articleData.publisher.logo.url, `${site}/logo.svg`, `${route}: JSON-LD publisher logo is missing`);
     assert.equal(
       linkHref(document, 'amphtml'),
       ampPath ? `${site}${ampPath}` : '',
       ampPath
         ? `${route}: AMP relationship is missing`
         : `${route}: article exposes an AMP relationship without a matching AMP document`,
     );
  } else {
    assert.equal(metaContent(document, 'property', 'og:image'), '', `${route}: non-article page unexpectedly exposes og:image`);
    assert.equal(linkHref(document, 'amphtml'), '', `${route}: non-article page unexpectedly exposes AMP`);
  }
}

function assertInitialSeoDocument(document, route, { article = false, ampPath = '' } = {}) {
  const title = htmlText(tagContent(document, 'title'));
  const description = metaContent(document, 'name', 'description');
  const canonical = linkHref(document, 'canonical');
  const expectedCanonical = `${site}${route === '/' ? '/' : `${route}/`}`;

  assert.ok(title.length >= 20, `${route}: initial title is missing or too short`);
  assert.ok(description.length >= 20, `${route}: initial description is missing or too short`);
  assert.equal(canonical, expectedCanonical, `${route}: initial canonical does not match the requested route`);
  assert.equal(metaContent(document, 'property', 'og:title'), title, `${route}: initial og:title mismatch`);
  assert.equal(metaContent(document, 'property', 'og:description'), description, `${route}: initial og:description mismatch`);
  assert.equal(metaContent(document, 'property', 'og:url'), canonical, `${route}: initial og:url mismatch`);
  assert.equal(metaContent(document, 'name', 'twitter:card'), 'summary_large_image', `${route}: initial Twitter card missing`);

  const structuredDataText = tagContent(document, 'script', '[^>]*data-global-ai-ld');
  assert.ok(structuredDataText, `${route}: initial JSON-LD is missing`);
  const structuredData = JSON.parse(structuredDataText);
  assert.equal(structuredData['@context'], 'https://schema.org', `${route}: initial JSON-LD context is invalid`);
  const primaryType = expectedPrimaryType(route, article);
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === primaryType), `${route}: initial primary JSON-LD type is missing`);
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === 'BreadcrumbList'), `${route}: initial breadcrumb JSON-LD is missing`);

  if (article) {
    assertSocialPreviewMetadata(document, route);
     assert.equal(
       linkHref(document, 'amphtml'),
       ampPath ? `${site}${ampPath}` : '',
       ampPath
         ? `${route}: initial AMP relationship is missing`
         : `${route}: initial HTML exposes an AMP relationship without a matching AMP document`,
     );
  } else {
    assert.equal(metaContent(document, 'property', 'og:image'), '', `${route}: non-article initial HTML unexpectedly exposes og:image`);
    assert.equal(linkHref(document, 'amphtml'), '', `${route}: non-article initial HTML unexpectedly exposes AMP`);
  }
}

function assertMetadataMatchesManifest(document, route, manifest) {
  const expected = manifest.routes.find((metadata) => metadata.path === route);
  assert.ok(expected, `${route}: API metadata manifest is missing this route`);
  assert.equal(htmlText(tagContent(document, 'title')), expected.title, `${route}: initial title drifted from the API metadata manifest`);
  assert.equal(metaContent(document, 'name', 'description'), expected.description, `${route}: initial description drifted from the API metadata manifest`);
  assert.equal(
    metaContent(document, 'name', 'robots'),
    expected.indexable === false ? 'noindex,follow' : '',
    `${route}: initial robots directive drifted from the API metadata manifest`,
  );
}

before(async () => {
  await startApiServer();
  execFileSync('pnpm', ['run', 'build:release'], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEWSROOM_METADATA_URL: `${apiOrigin}/api/newsroom/metadata`,
    },
    stdio: 'inherit',
  });
  await stat(path.join(distDir, 'index.html'));
  await startStaticServer();
  await startDevServer();
});

after(async () => {
  routeBrowserCdp?.close();
  await stopBrowserProcess(routeBrowserProcess);
  routeBrowserCdp = undefined;
  routeBrowserProcess = undefined;
  routeBrowserPromise = undefined;
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  if (apiProcess?.pid) {
    try {
      process.kill(-apiProcess.pid, 'SIGTERM');
    } catch {
      apiProcess.kill('SIGTERM');
    }
    await new Promise((resolve) => {
      if (apiProcess.killed || apiProcess.exitCode !== null) {
        resolve();
      } else {
        apiProcess.once('exit', resolve);
      }
    });
  }
  if (devProcess) devProcess.kill('SIGTERM');
});

test('Clarity loads once on public pages, stays out of query URLs, and cannot block rendering', { concurrency: false }, async () => {
  const cdp = await getRouteBrowser();
  await cdp.send('Network.enable');
  await cdp.send('Network.setBlockedURLs', {
    urls: ['*://www.clarity.ms/tag/*', '*://www.clarity.ms/collect*'],
  });

  // The shared smoke browser may have just visited an editor URL. Visit a
  // clean public route first so that the eligible page has a safe referrer.
  await cdp.send('Page.navigate', { url: `${baseUrl}/` });
  await waitForBrowserCondition(cdp, `!!document.querySelector('main h1')`, 'The public home page did not render.');
  await cdp.send('Page.navigate', { url: `${baseUrl}/about-us` });
  await waitForBrowserCondition(
    cdp,
    `!!document.querySelector('main h1') && document.querySelectorAll('script[data-clarity-project="x8gfztdtd7"]').length === 1`,
    'The public page did not render with one asynchronously loaded Clarity script when the provider was blocked.',
  );
  const publicPageClarity = await evaluateBrowser(cdp, `(() => {
    const scripts = [...document.querySelectorAll('script[data-clarity-project="x8gfztdtd7"]')];
    return { count: scripts.length, async: scripts[0]?.async, src: scripts[0]?.src };
  })()`);
  assert.deepEqual(publicPageClarity, {
    count: 1,
    async: true,
    src: 'https://www.clarity.ms/tag/x8gfztdtd7',
  });

  await cdp.send('Page.navigate', {
    url: `${baseUrl}/search?q=${encodeURIComponent('private search phrase')}`,
  });
  await waitForBrowserCondition(
    cdp,
    `!!document.querySelector('main h1')`,
    'The search page did not remain usable when entered directly with a query string.',
  );
  const queryPageClarity = await evaluateBrowser(cdp, `document.querySelectorAll('script[data-clarity-project="x8gfztdtd7"]').length`);
  assert.equal(queryPageClarity, 0, 'A page with user-controlled query text must not load Clarity.');
});

test('public routes, metadata, structured data, links, images, AMP, RSS, and responsive pages pass', async () => {
  const [
    { response: sitemapResponse, body: sitemap },
    { response: apiSitemapResponse, body: apiSitemap },
    rootApiSitemapResult,
    { response: feedResponse, body: feed },
    { response: apiFeedResponse, body: apiFeed },
    rootApiFeedResult,
  ] = await Promise.all([
    fetchText('/sitemap.xml'),
    fetch(`${apiOrigin}/api/newsroom/sitemap.xml`).then(async (response) => ({
      response,
      body: await response.text(),
    })),
    fetch(`${apiOrigin}/sitemap.xml`).then(async (response) => ({
      response,
      body: await response.text(),
    })),
    fetchText('/feed.xml'),
    fetch(`${apiOrigin}/api/newsroom/feed.xml`).then(async (response) => ({
      response,
      body: await response.text(),
    })),
    fetch(`${apiOrigin}/feed.xml`).then(async (response) => ({
      response,
      body: await response.text(),
    })),
  ]);
  assert.equal(sitemapResponse.status, 200, 'sitemap.xml is not reachable');
  assert.equal(apiSitemapResponse.status, 200, 'API newsroom sitemap.xml is not reachable');
  assert.equal(rootApiSitemapResult.response.status, 404, 'API artifact must not own the root sitemap route');
  assert.equal(feedResponse.status, 200, 'feed.xml is not reachable');
  assert.equal(apiFeedResponse.status, 200, 'API newsroom RSS feed is not reachable');
  assert.equal(rootApiFeedResult.response.status, 404, 'API artifact must not own the root RSS route');
  assertCanonicalSitemapUrls(sitemap, 'root sitemap');
  assertCanonicalSitemapUrls(apiSitemap, 'API newsroom sitemap');
  assertRssCanonicalUrls(feed, 'root RSS feed');
  assertRssCanonicalUrls(apiFeed, 'API newsroom RSS feed');
  assert.equal(sitemap, apiSitemap, 'root sitemap drifted from the API newsroom sitemap');
  assert.deepEqual(
    feedItems(feed).map((item) => item.guid),
    feedItems(apiFeed).map((item) => item.guid),
    'root RSS feed drifted from the newsroom RSS endpoint',
  );
  const [devSitemapResult, devFeedResult] = await Promise.all(
    ['/sitemap.xml', '/feed.xml'].map(async (route) => {
      const response = await fetch(`${devBaseUrl}${route}`);
      return { route, response, body: await response.text() };
    }),
  );
  for (const result of [devSitemapResult, devFeedResult]) {
    assert.equal(result.response.status, 200, `Vite development proxy failed for ${result.route}`);
    assert.equal(result.body, result.route === '/sitemap.xml' ? apiSitemap : apiFeed, `Vite development proxy drifted for ${result.route}`);
  }

  const { response: metadataResponse, body: metadataBody } = await fetchText('/api/newsroom/metadata');
  assert.equal(metadataResponse.status, 200, 'newsroom metadata manifest is not reachable');
  assert.doesNotMatch(
    metadataResponse.headers.get('cache-control') ?? '',
    /public|immutable|max-age=[1-9]/i,
    'newsroom metadata must not receive a long-lived public cache policy',
  );
  const metadataManifest = JSON.parse(metadataBody);
  assert.equal(metadataManifest.source, 'maintained-editorial-source', 'newsroom metadata manifest has an unexpected source');
  assert.ok(Array.isArray(metadataManifest.routes), 'newsroom metadata manifest is missing routes');
  const signalsMetadata = metadataManifest.routes.find((metadata) => metadata.path === '/signals');
  assert.ok(signalsMetadata, 'Signals index is missing public SEO metadata');
  const { response: signalsResponse, body: signalsBody } = await fetchText('/signals');
  assert.equal(signalsResponse.status, 200, 'Signals index is not reachable');
  assert.match(signalsBody, /<h1\b/, 'Signals index is missing its prerendered heading');
  assertMetadataMatchesManifest(signalsBody, '/signals', metadataManifest);
  const { response: contentResponse, body: contentBody } = await fetchText('/api/newsroom/content');
  assert.equal(contentResponse.status, 200, 'newsroom content snapshot is not reachable');
  const newsroomContent = JSON.parse(contentBody);

  const routes = sitemapRoutes(sitemap);
  assert.ok(routes.length >= 15, 'sitemap unexpectedly contains too few public routes');
  assert.equal(new Set(routes).size, routes.length, 'sitemap contains duplicate routes');
  assert.equal(routes[0], '/', 'sitemap should start with the homepage');
  const apiRoutes = sitemapRoutes(apiSitemap);
  assert.ok(apiRoutes.length >= 15, 'API sitemap unexpectedly contains too few public routes');
  assert.equal(new Set(apiRoutes).size, apiRoutes.length, 'API sitemap contains duplicate routes');
  assertRouteSetsMatch(
    routes,
    apiRoutes,
    'API sitemap routes drifted from the built static sitemap',
  );
  assertSitemapDatesMatch(
    apiSitemap,
    sitemap,
    'Sitemap last-modified dates drifted between the API and static documents',
  );
  assert.deepEqual(
    [...routes].sort(),
    metadataManifest.routes.filter((metadata) => metadata.indexable !== false).map((metadata) => metadata.path).sort(),
    'static sitemap routes drifted from the API-backed metadata manifest',
  );
  for (const route of ['/insights', '/sign-in', '/sign-up']) {
    assert.equal(
      metadataManifest.routes.find((metadata) => metadata.path === route)?.indexable,
      false,
      `${route}: editor-only route must be explicitly non-indexable in the metadata manifest`,
    );
    const { response, body } = await fetchText(route);
    assert.equal(response.status, 200, `${route}: direct non-indexable route failed`);
    const robotsTags = openingTags(body, 'meta')
      .filter((tag) => attributeValue(tag, 'name').toLowerCase() === 'robots');
    assert.equal(robotsTags.length, 1, `${route}: initial HTML must contain exactly one robots directive`);
    assert.equal(
      attributeValue(robotsTags[0], 'content'),
      'noindex,follow',
      `${route}: initial HTML must explicitly prevent indexing before JavaScript runs`,
    );
  }
  const publicNoindexRoutes = ['/search'];
  for (const route of publicNoindexRoutes) {
    assert.equal(
      metadataManifest.routes.find((metadata) => metadata.path === route)?.indexable,
      false,
      `${route}: utility route must be non-indexable`,
    );
    const { response, body } = await fetchText(route);
    assert.equal(response.status, 200, `${route}: direct non-indexable route failed`);
    assert.match(body, /<meta name="robots" content="noindex,follow"/, `${route}: initial HTML must explicitly prevent indexing`);
    assert.match(body, /<main\b/, `${route}: initial HTML is missing page content`);
    assert.match(body, /id="global-ai-prerender"/, `${route}: initial HTML is missing the newsroom bootstrap marker`);
    if (route === '/search') {
      assert.match(body, /name="q"/, 'search route is missing a usable initial HTML search form');
    }
  }
  const placeholderRoutes = [
    '/about-us',
    '/code-of-ethics',
    '/corrections',
    '/contact-us',
  ];
  const editorialPageCopy = {
    '/about-us': /Who speaks for the publication/,
    '/code-of-ethics': /AI-assisted work/,
    '/corrections': /No approved public corrections or contact channel is available/i,
    '/contact-us': /No approved public contact address or working contact form has been verified/i,
  };
  for (const route of placeholderRoutes) {
    assert.notEqual(
      metadataManifest.routes.find((metadata) => metadata.path === route)?.indexable,
      false,
      `${route}: factual trust disclosure should be indexable`,
    );
    const { response, body } = await fetchText(route);
    assert.equal(response.status, 200, `${route}: direct public route failed`);
    assert.equal(response.headers.get('x-robots-tag'), null, `${route}: factual trust disclosure must not send noindex`);
    assert.doesNotMatch(body, /<meta name="robots" content="noindex,follow"/, `${route}: factual trust disclosure must be indexable`);
    assert.match(body, /<main\b/, `${route}: initial HTML is missing page content`);
    assert.match(body, /id="global-ai-prerender"/, `${route}: initial HTML is missing the newsroom bootstrap marker`);
    assert.match(body, editorialPageCopy[route], `${route}: shared editorial copy is missing`);
    assert.doesNotMatch(body, /Latest stories/, `${route}: editorial-information placeholder must not present unrelated stories`);
    assert.ok(routes.includes(route), `${route}: factual trust disclosure should be included in the sitemap`);
  }
  const publicTrustRoutes = ['/privacy', '/terms', '/authors'];
  for (const route of publicTrustRoutes) {
    const routeMetadata = metadataManifest.routes.find((metadata) => metadata.path === route);
    assert.ok(routeMetadata, `${route}: route metadata is missing`);
    assert.equal(routeMetadata.indexable, false, `${route}: incomplete legal or author placeholder must be noindex`);
    assert.ok(!routes.includes(route), `${route}: noindex placeholder must not appear in sitemap.xml`);
    const { response, body } = await fetchText(route);
    assert.equal(response.status, 200, `${route}: direct trust page failed`);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex', `${route}: placeholder must send noindex header`);
    assert.match(body, /<meta name="robots" content="noindex,follow"/, `${route}: placeholder must emit noindex metadata`);
    assert.match(body, /<main\b/, `${route}: initial HTML is missing page content`);
    assert.match(body, /id="global-ai-prerender"/, `${route}: initial HTML is missing the newsroom bootstrap marker`);
  }
  const privacyPage = (await fetchText('/privacy')).body;
  assert.match(privacyPage, /provisional disclosure, not a complete privacy policy/i);
  assert.match(privacyPage, /asks for an email address/i);
  assert.match(privacyPage, /retention period/i);
  assert.match(privacyPage, /Microsoft Clarity on eligible public pages/i);
  assert.match(privacyPage, /No custom signup or conversion event is sent to Clarity/i);
  assert.match(privacyPage, /has not supplied approved details about consent, retention, data transfers/i);
  const termsPage = (await fetchText('/terms')).body;
  assert.match(termsPage, /placeholder, not a complete agreement/i);
  assert.match(termsPage, /No approved terms covering permitted use, intellectual property, attribution, warranties, liability, governing law, or dispute handling/i);

  const authorsPage = (await fetchText('/authors')).body;
  assert.match(authorsPage, /data-testid="author-directory"/);
  assert.match(authorsPage, /Global AI News Editorial Desk/);
  assert.ok(authorsPage.includes('href="/archive/"'), 'author directory must link to the published story archive');
  assert.ok(authorsPage.includes('href="/about-us/"'), 'author directory must link to the publication information page');
  for (const author of newsroomContent.authors) {
    if (author.verifiedForPublication === true) continue;
    assert.ok(!authorsPage.includes(author.name), `unverified author ${author.slug} must not appear in the public directory`);
    assert.ok(!authorsPage.includes(author.bio), `unverified bio for ${author.slug} must not appear in the public directory`);
  }
  const archiveMetadata = metadataManifest.routes.find((metadata) => metadata.path === '/archive');
  assert.ok(archiveMetadata, 'published archive is missing public SEO metadata');
  assert.notEqual(archiveMetadata.indexable, false, 'published archive must remain indexable');
  assert.ok(routes.includes('/archive'), 'published archive is missing from the sitemap');
  const { response: archiveResponse, body: archiveBody } = await fetchText('/archive');
  assert.equal(archiveResponse.status, 200, 'published archive is not reachable');
  assert.match(archiveBody, /data-testid="published-archive"/, 'archive does not render its published-story index');
  assert.ok(
    archiveBody.includes(`href="/article/${newsroomContent.stories[0].slug}/`),
    'archive is missing the first story from the published newsroom snapshot',
  );
  assert.doesNotMatch(archiveBody, /name="robots" content="noindex,follow"/);
  const topicsMetadata = metadataManifest.routes.find((metadata) => metadata.path === '/topics');
  assert.ok(topicsMetadata, 'Topics index is missing public SEO metadata');
  assert.equal(topicsMetadata.indexable, false, 'Topics index must remain noindex until a topic meets the five-story threshold');
  assert.ok(!routes.includes('/topics'), 'unqualified Topics index must be removed from the sitemap');
  const { response: topicsResponse, body: topicsBody } = await fetchText('/topics');
  assert.equal(topicsResponse.status, 200, 'Topics index is not reachable');
  assert.match(topicsBody, /<h1[^>]*>Topics that/, 'Topics index is missing its prerendered heading');
  assert.match(topicsBody, /data-testid="topics-index"/, 'Topics index is missing connected topic records');
  assert.match(topicsBody, /href="\/topic\/(?:ai|india)\//, 'Topics index is missing links to topic detail pages');
  assert.match(topicsBody, /name="robots" content="noindex,follow"/, 'under-threshold Topics index must be noindex');
  const reportsMetadata = metadataManifest.routes.find((metadata) => metadata.path === '/reports');
  assert.ok(reportsMetadata, 'Reports index is missing public SEO metadata');
  assert.equal(reportsMetadata.indexable, false, 'Reports index must remain noindex until six published reports are available');
  assert.ok(!routes.includes('/reports'), 'under-threshold Reports index must be removed from the sitemap');
  const { response: reportsResponse, body: reportsBody } = await fetchText('/reports');
  assert.equal(reportsResponse.status, 200, 'Reports index is not reachable');
  assert.match(reportsBody, /<h1[^>]*>Reports/, 'Reports index is missing its prerendered heading');
  assert.match(reportsBody, /india-ai-compute-access-2026/, 'Reports index does not link to the maintained flagship report');
  assert.match(reportsBody, /data-testid="reports-authority-network"/, 'Reports index is missing its research/data/topic/entity connections');
  assert.match(reportsBody, /Published research records|Research/, 'Reports index is missing its research context');
  assert.match(reportsBody, /name="robots" content="noindex,follow"/, 'under-threshold Reports index must ship with a noindex directive');
  const publishedResearch = newsroomContent.researchRecords.find((record) => record.status === 'published');
  const publishedDataProduct = newsroomContent.dataProducts.find((product) => product.status === 'published');
  assert.ok(publishedResearch, 'newsroom snapshot is missing its published research record');
  assert.ok(publishedDataProduct, 'newsroom snapshot is missing its published data product');
  for (const route of [`/research/${publishedResearch.slug}`, `/data/${publishedDataProduct.slug}`]) {
    assert.notEqual(metadataManifest.routes.find((metadata) => metadata.path === route)?.indexable, false);
    assert.ok(routes.includes(route), `${route}: published authority record is missing from the sitemap`);
    const { response, body } = await fetchText(route);
    assert.equal(response.status, 200, `${route}: direct first response is not reachable`);
    assert.match(body, /<h1\b/, `${route}: first response is missing its prerendered heading`);
    assert.match(body, /id="global-ai-prerender"/, `${route}: first response is missing the hydration marker`);
    assert.doesNotMatch(body, /name="robots" content="noindex,follow"/, `${route}: published authority record must not be noindex`);
  }
  for (const route of ['/research', '/data']) {
    assert.equal(metadataManifest.routes.find((metadata) => metadata.path === route)?.indexable, false);
    assert.ok(!routes.includes(route), `${route}: under-threshold section must be removed from the sitemap`);
    const { response, body } = await fetchText(route);
    assert.equal(response.status, 200, `${route}: section must remain directly reachable`);
    assert.match(body, /name="robots" content="noindex,follow"/);
  }
  const researchBody = (await fetchText(`/research/${publishedResearch.slug}`)).body;
  assert.match(researchBody, /Research record/, 'research detail first response is missing its record context');
  assert.match(researchBody, /Methodology/, 'research detail first response is missing methodology');
  assert.match(researchBody, /"@type":"Report"/, 'research detail first response is missing Report structured data');
  const dataBody = (await fetchText(`/data/${publishedDataProduct.slug}`)).body;
  assert.match(dataBody, /Dated public-source claims/, 'data product first response is missing its evidence framing');
  assert.match(dataBody, /Schedulable/, 'data product first response is missing the separate operational status fields');
  assert.match(dataBody, /"@type":"Dataset"/, 'data product first response is missing Dataset structured data');
  const citedSourceSlug = publishedResearch.sourceSlugs.find((slug) =>
    newsroomContent.sources.some((source) => source.slug === slug),
  );
  assert.ok(citedSourceSlug, 'published research is missing a public source record');
  const sourceRoute = `/source/${citedSourceSlug}`;
  assert.equal(
    metadataManifest.routes.find((metadata) => metadata.path === sourceRoute)?.indexable,
    false,
    `${sourceRoute}: citation records must be non-indexable`,
  );
  assert.ok(!routes.includes(sourceRoute), `${sourceRoute}: citation record must not appear in the sitemap`);
  const { response: sourceResponse, body: sourceBody } = await fetchText(sourceRoute);
  assert.equal(sourceResponse.status, 200, `${sourceRoute}: direct citation record route is not reachable`);
  assert.match(sourceBody, /<meta name="robots" content="noindex,follow"/, `${sourceRoute}: first response must explicitly prevent indexing`);
  const articleRoutes = newsroomContent.stories.map((story) => `/article/${story.slug}`);
  assert.equal(
    articleRoutes.length,
    newsroomContent.stories.length,
    'article metadata and AMP coverage must include every currently public article',
  );
  const entries = sitemapEntries(sitemap);
  for (const articleRoute of articleRoutes) {
    const entry = entries.find((candidate) => candidate.route === articleRoute);
    const slug = articleRoute.split('/')[2];
    const story = newsroomContent.stories.find((candidate) => candidate.slug === slug);
    const metadata = metadataManifest.routes.find((candidate) => candidate.path === articleRoute);
    assert.ok(story, `${articleRoute}: published story is missing from the newsroom snapshot`);
    assert.equal(
      metadata?.ampPath,
      `/amp/article/${story.slug}/`,
      `${articleRoute}: metadata must point to this story's own AMP route`,
    );
    const expectedLastmod =
      story?.dateModified && story.dateModified >= story.date
        ? story.dateModified
        : undefined;
    assert.ok(entry.images.length > 0, `${articleRoute}: sitemap is missing its article image`);
    assert.equal(metadata?.lastmod, expectedLastmod, `${articleRoute}: fresh metadata manifest has an invalid lastmod`);
    assert.equal(
      entry.lastmod ?? undefined,
      metadata?.lastmod,
      `${articleRoute}: static sitemap differs from the fresh metadata manifest`,
    );
  }
  assert.ok(!routes.includes('/insights'), 'internal editor workspace must not appear in the sitemap');

  const items = feedItems(feed);
  assert.ok(items.length >= 3, 'RSS feed unexpectedly contains too few items');
  assert.equal(new Set(items.map((item) => item.guid)).size, items.length, 'RSS feed contains duplicate GUIDs');
  for (const item of items) {
    assert.ok(item.title, 'RSS item is missing a title');
    assert.ok(item.description, `${item.title}: RSS item is missing a description`);
    assert.ok(item.link.startsWith(`${site}/article/`), `${item.title}: RSS link is not an article URL`);
    assert.equal(item.guid, item.link, `${item.title}: RSS GUID should match its canonical link`);
    assert.ok(Number.isFinite(Date.parse(item.pubDate)), `${item.title}: RSS pubDate is invalid`);
  }

  const staticRoutes = [...routes, ...items.map((item) => routeFromUrl(item.link))];
  for (const route of new Set(staticRoutes)) {
    const { response, body } = await fetchText(route);
    assert.equal(response.status, 200, `${route}: direct request failed`);
      assert.match(body, /<div id="root">[\s\S]*<main\b/, `${route}: initial HTML is missing prerendered page content`);
      assert.match(body, /<h1\b/, `${route}: initial HTML is missing a prerendered page heading`);
      assert.match(body, /id="global-ai-prerender"/, `${route}: initial HTML is missing its newsroom bootstrap marker`);
      if (route.startsWith('/article/')) {
        const slug = route.split('/')[2];
        const story = newsroomContent.stories.find((candidate) => candidate.slug === slug);
        const author = newsroomContent.authors.find(
          (candidate) => candidate.slug === story?.author && candidate.verifiedForPublication === true,
        );
        assert.ok(story, `${route}: published story is missing from the newsroom content snapshot`);
        assert.equal(
          linkHref(body, 'amphtml'),
          `${site}/amp/article/${story.slug}/`,
          `${route}: initial HTML must link to its own AMP page`,
        );
        assert.ok(body.includes(story.title.replaceAll('&', '&amp;')), `${route}: initial HTML is missing the article headline`);
        assert.ok(body.includes(story.body[0].paragraphs[0].slice(0, 40)), `${route}: initial HTML is missing article body copy`);
        assert.match(body, /aria-label="Breadcrumb"/, `${route}: visible breadcrumb is missing`);
        assert.doesNotMatch(body, /Metrics in context/, `${route}: unsupported generic metrics panel is present`);
        assert.ok(!new RegExp(`<time[^>]*>${story.date}</time>`).test(body), `${route}: visible publication date is still ISO-formatted`);
        const contentTypeLabel = story.contentType ?? {
          reported: 'Reporting',
          analysis: 'Analysis',
          opinion: 'Opinion',
          synthesis: 'Synthesis',
        }[story.classification];
        assert.ok(body.includes(`${story.category} · ${contentTypeLabel}`), `${route}: reader-facing content type label is missing`);
        if (story.slug === 'india-ai-compute-access-2026') {
          assert.match(body, /45,000\+ shared/, 'report first response is missing the source-stated shared-capacity stage');
          assert.match(body, /2026-06/, 'report first response is missing the source-stated capacity snapshot month');
          assert.match(body, /components sum to 8\.65 GW, not 8\.33 GW/, 'report first response is missing the pipeline reconciliation caveat');
          assert.match(body, /<table\b/, 'report first response is missing the capacity comparison table');
          assert.match(body, /Source 1:/, 'report first response is missing numbered source citations');
          assert.match(body, /Tier 1/, 'report first response is missing source-tier provenance');
        }
        if (author) {
          assert.ok(body.includes(`href="/person/${author.slug}/"`), `${route}: verified author byline is not linked to the profile`);
          assert.ok(body.includes(author.name), `${route}: verified author name is missing from the byline`);
        } else {
          const organizationByline = story.authorType === 'organization'
            ? story.authorName?.trim() || 'Global AI News Editorial Desk'
            : 'Global AI News Editorial Desk';
          assert.ok(body.includes(organizationByline), `${route}: organization attribution is missing for an unverified author`);
          assert.ok(!body.includes(`href="/person/${story.author}/"`), `${route}: unverified author is linked to a public profile`);
          assert.ok(!body.includes(story.author), `${route}: raw author slug was displayed`);
        }
        for (const sourceSlug of story.sources) {
          const source = newsroomContent.sources.find((candidate) => candidate.slug === sourceSlug);
          if (source) {
            assert.ok(body.includes(source.name), `${route}: verified source name is missing`);
            const parsedSourceUrl = new URL(source.url);
            const expectedSourceHref = parsedSourceUrl.pathname === '/' && !parsedSourceUrl.search && !parsedSourceUrl.hash
              ? `/source/${source.slug}/`
              : source.url.replaceAll('&', '&amp;');
            assert.ok(body.includes(`href="${expectedSourceHref}"`), `${route}: specific source link or citation record is missing`);
          } else {
            assert.ok(!body.includes(sourceSlug), `${route}: unresolved source slug was displayed as a citation`);
          }
        }
      }
     assertInitialSeoDocument(body, route, {
       article: route.startsWith('/article/'),
       ampPath: metadataManifest.routes.find((metadata) => metadata.path === route)?.ampPath ?? '',
     });
    assertMetadataMatchesManifest(body, route, metadataManifest);
    assert.doesNotMatch(
      response.headers.get('cache-control') ?? '',
      /public|immutable|max-age=[1-9]/i,
      `${route}: route HTML must not receive a long-lived public cache policy`,
    );
    if (route.startsWith('/article/')) {
      const imagePath = new URL(metaContent(body, 'property', 'og:image')).pathname;
      const { response: imageResponse, body: imageBody } = await fetchText(imagePath);
      assert.equal(imageResponse.status, 200, `${route}: social preview image is not reachable`);
      assert.match(imageResponse.headers.get('content-type') ?? '', /^image\/png\b/, `${route}: social preview image is not a PNG`);
      assert.equal(
        imageResponse.headers.get('cache-control'),
        socialPreviewCacheControl,
        `${route}: social preview image is missing its production cache policy`,
      );
      assert.ok(imageBody.length > 1000, `${route}: social preview image is unexpectedly small`);
      const previewPath = path.join(distDir, imagePath.replace(/^\/+/, ''));
      assertVisualPreviewAsset(previewPath, route, previewSourceTitle(previewPath, route));
    }
  }

  const webArtifactConfig = await readFile(path.join(root, '.replit-artifact', 'artifact.toml'), 'utf8');
  assert.match(webArtifactConfig, /dist\/server\/server\.mjs/, 'production article routes are not served by the request-time Express renderer');
  assert.doesNotMatch(webArtifactConfig, /from = "\/article\/\*"/, 'production article routes must not bypass request-time rendering through the SPA shell');
  const apiArtifactConfig = await readFile(path.resolve(root, '..', 'api-server', '.replit-artifact', 'artifact.toml'), 'utf8');
  assert.match(apiArtifactConfig, /paths = \["\/api"\]/, 'production API artifact must own only the /api route prefix');
  assert.doesNotMatch(apiArtifactConfig, /paths = \[[^\]]*\/(?:sitemap|feed)\.xml/, 'root RSS and sitemap routes must not be owned by the API artifact');

  const devImageResponse = await fetch(
    `${devBaseUrl}/social/articles/ai-models-antibiotic-discovery.png`,
  );
  assert.equal(devImageResponse.status, 200, 'development social preview image is not reachable');
  assert.equal(
    devImageResponse.headers.get('cache-control'),
    'no-cache',
    'development social preview images must remain uncached',
  );

  const titles = new Map();
  const allowedRoutes = new Set(routes);
  const nonIndexableRoutes = new Set(
    metadataManifest.routes
      .filter((metadata) => metadata.indexable === false)
      .map((metadata) => metadata.path),
  );
  const responseCache = new Map();
  for (const route of new Set([...staticRoutes, ampPath])) {
    const document = await renderRoute(route, 1440, 900);
    if (route !== ampPath) {
      assertSeoDocument(document, route, {
        article: route.startsWith('/article/'),
        stories: newsroomContent.stories,
        authors: newsroomContent.authors,
       ampPath: metadataManifest.routes.find((metadata) => metadata.path === route)?.ampPath ?? '',
      });
      assertMetadataMatchesManifest(document, route, metadataManifest);
    }
    await assertRenderedPageIntegrity(
      document,
      route,
      allowedRoutes,
      responseCache,
      nonIndexableRoutes,
    );
    if (route === '/insights') {
      assert.match(document, /data-testid="social-preview-card"/, 'Insights is missing the social preview card');
      assert.match(document, /data-testid="social-preview-dimensions"[^>]*>1200 × 630 PNG/, 'Insights is missing the 1200 × 630 card dimensions');
      assert.match(document, /data-testid="social-preview-scale-status"/, 'Insights is missing the headline scale status');
      assert.match(document, /data-testid="social-preview-line-1"/, 'Insights is missing the rendered headline line breaks');
      assert.match(document, /data-testid="select-social-preview-story"/, 'Insights is missing the article selector');
    }
    const title = htmlText(tagContent(document, 'title'));
    titles.set(route, title);
  }
  assert.ok(new Set(titles.values()).size >= 10, 'public routes are not producing sufficiently unique titles');

  const mobileRoutes = [
    '/',
    '/brief',
    '/signals',
    '/india',
    '/ask',
    '/company/openai',
    '/timeline/antibiotic-candidates',
    '/article/ai-models-antibiotic-discovery',
  ];
  for (const route of mobileRoutes) {
    const document = await renderRoute(route, 402, 874);
    assertSeoDocument(document, route, {
      article: route.startsWith('/article/'),
      stories: newsroomContent.stories,
      authors: newsroomContent.authors,
      ampPath: metadataManifest.routes.find((metadata) => metadata.path === route)?.ampPath ?? '',
    });
    assert.match(document, /<body[\s\S]*<main\b/, `${route}: mobile render did not produce page content`);
  }

  const { response: ampResponse, body: ampDocument } = await fetchText(ampPath);
  const newsroomResponse = await fetch(`${apiOrigin}/api/newsroom/content`);
  assert.equal(newsroomResponse.status, 200, 'newsroom content is not reachable for AMP alignment');
  const newsroomSnapshot = await newsroomResponse.json();
  const ampStory = newsroomSnapshot.stories.find((story) => story.slug === 'ai-models-antibiotic-discovery');
  assert.ok(ampStory, 'AMP source story is missing from the newsroom snapshot');
  assert.equal(ampResponse.status, 200, 'AMP document is not reachable');
  assert.match(ampDocument, /<html[^>]*\bamp\b/i, 'AMP document is missing the amp attribute');
  assert.equal(linkHref(ampDocument, 'canonical'), `${site}/article/ai-models-antibiotic-discovery/`, 'AMP canonical is incorrect');
  assert.equal(tagContent(ampDocument, 'title'), ampStory.title, 'AMP title drifted from the newsroom snapshot');
  assert.equal(metaContent(ampDocument, 'name', 'description'), ampStory.dek, 'AMP description drifted from the newsroom snapshot');
  assert.equal(tagContent(ampDocument, 'h1'), ampStory.title, 'AMP visible headline drifted from the newsroom snapshot');
  assert.ok(ampDocument.includes(ampStory.bottomLine), 'AMP visible bottom line drifted from the newsroom snapshot');
  for (const section of ampStory.body) {
    assert.ok(ampDocument.includes(section.heading), `AMP is missing the edited section heading "${section.heading}"`);
    const visibleCopy = section.paragraphs[0].replace(/\s*\[@[a-z0-9-]+\]/gi, '');
    assert.ok(ampDocument.includes(visibleCopy), `AMP is missing the edited copy for "${section.heading}"`);
  }
  assert.match(ampDocument, /<script[^>]+src="https:\/\/cdn\.ampproject\.org\/v0\.js"/i, 'AMP runtime is missing');
  assert.match(ampDocument, /<style amp-custom>/i, 'AMP custom CSS is missing');
  assert.ok(!/<script(?![^>]+cdn\.ampproject\.org\/v0\.js)/i.test(ampDocument), 'AMP document contains a non-runtime script');
  assert.ok(Buffer.byteLength(ampDocument) < 75_000, 'AMP document exceeds the 75 KB document limit');

  const { response: devAmpResponse, body: devAmpDocument } = await fetch(`${devBaseUrl}${ampPath}`).then(async (response) => ({
    response,
    body: await response.text(),
  }));
  assert.equal(devAmpResponse.status, 200, 'development AMP document is not reachable');
  assert.equal(tagContent(devAmpDocument, 'title'), ampStory.title, 'development AMP title drifted from the newsroom snapshot');
  assert.equal(metaContent(devAmpDocument, 'name', 'description'), ampStory.dek, 'development AMP description drifted from the newsroom snapshot');
  assert.equal(tagContent(devAmpDocument, 'h1'), ampStory.title, 'development AMP headline drifted from the newsroom snapshot');

  const ampStories = newsroomSnapshot.stories;
  assert.equal(
    ampStories.length,
    articleRoutes.length,
    'AMP regression coverage must include every public article',
  );
  const ampTargets = ampStories.map((story) => {
    const metadata = metadataManifest.routes.find((candidate) => candidate.path === `/article/${story.slug}`);
    assert.equal(metadata?.ampPath, `/amp/article/${story.slug}/`, `${story.slug}: AMP URL must derive from its slug`);
    return `/amp/article/${story.slug}/`;
  });
  assert.equal(new Set(ampTargets).size, ampTargets.length, 'published article AMP targets must be unique');
  for (const [index, story] of ampStories.entries()) {
    const storyAmpPath = ampTargets[index];
    const { response, body } = await fetchText(storyAmpPath);
    assert.equal(response.status, 200, `${story.slug}: AMP target is not reachable`);
    assert.equal(linkHref(body, 'canonical'), `${site}/article/${story.slug}/`, `${story.slug}: AMP canonical is incorrect`);
    assert.equal(tagContent(body, 'title'), story.title, `${story.slug}: AMP title does not match its article`);
    assert.equal(metaContent(body, 'name', 'description'), story.dek, `${story.slug}: AMP description does not match its article`);
    assert.equal(tagContent(body, 'h1'), story.title, `${story.slug}: AMP heading does not match its article`);
    if (story.slug === 'india-ai-compute-access-2026') {
      assert.match(body, /<table\b/, 'flagship report AMP page is missing the comparison table');
      assert.match(body, /Source 1:/, 'flagship report AMP page is missing numbered source links');
    }
    const { response: devResponse, body: devBody } = await fetch(`${devBaseUrl}${storyAmpPath}`).then(async (response) => ({
      response,
      body: await response.text(),
    }));
    assert.equal(devResponse.status, 200, `${story.slug}: development AMP target is not reachable`);
    assert.equal(linkHref(devBody, 'canonical'), `${site}/article/${story.slug}/`, `${story.slug}: development AMP canonical is incorrect`);
    assert.equal(tagContent(devBody, 'title'), story.title, `${story.slug}: development AMP title does not match its article`);
    assert.equal(tagContent(devBody, 'h1'), story.title, `${story.slug}: development AMP heading does not match its article`);
  }
  const unknownAmpPath = '/amp/article/unknown-amp-story-for-regression/';
  const unknownDevAmpResponse = await fetch(`${devBaseUrl}${unknownAmpPath}`);
  assert.equal(unknownDevAmpResponse.status, 404, 'unknown AMP slug must not resolve to a published article');
  assert.equal(unknownDevAmpResponse.headers.get('x-robots-tag'), 'noindex');

  console.log(`Smoke checked ${new Set(staticRoutes).size} public routes at desktop, ${mobileRoutes.length} at mobile, plus ${ampStories.length} AMP pages and RSS.`);
});

test('hydrated Daily Brief and India Watch use a duplicate-free updated snapshot', { concurrency: false }, async () => {
  const response = await fetch(`${apiOrigin}/api/newsroom/content`);
  assert.equal(response.status, 200, 'the newsroom snapshot fixture source is unavailable');
  const snapshot = await response.json();
  const indiaStory = snapshot.stories.find((story) => story.category === 'India Watch');
  assert.ok(indiaStory, 'the newsroom snapshot is missing its India Watch story');
  const updatedStory = {
    ...indiaStory,
    title: 'Updated India Watch snapshot story',
    date: '2026-10-21',
    dek: 'Relevant for professionals tracking industry developments.',
  };
  newsroomContentFixture = {
    ...snapshot,
    stories: [...snapshot.stories, updatedStory, updatedStory],
  };

  try {
    const briefHtml = await renderRoute('/brief', 1440, 1000);
    assert.match(briefHtml, /data-testid="brief-edition-metadata"[^>]*>Latest edition · <time dateTime="2026-10-21">21 Oct 2026<\/time>/i);
    assert.equal(
      (briefHtml.match(new RegExp(`data-testid="card-story-${indiaStory.slug}"`, 'g')) ?? []).length,
      1,
      'hydrated Daily Brief rendered the duplicate story card more than once',
    );
    const briefStoryTitle = await evaluateBrowser(
      await getRouteBrowser(),
      `document.querySelector('[data-testid="link-story-${indiaStory.slug}"]')?.textContent?.trim() ?? ''`,
    );
    assert.equal(briefStoryTitle, updatedStory.title, 'hydrated Daily Brief did not use the latest duplicate record');

    const indiaHtml = await renderRoute('/topic/india', 1440, 1000);
    assert.equal(
      (indiaHtml.match(new RegExp(`data-testid="card-story-${indiaStory.slug}"`, 'g')) ?? []).length,
      1,
      'hydrated India Watch rendered the duplicate story card more than once',
    );
    assert.doesNotMatch(
      indiaHtml,
      /Relevant for professionals tracking industry developments/i,
      'hydrated India Watch exposed generic placeholder copy',
    );
  } finally {
    newsroomContentFixture = undefined;
  }
});

test('Insights renders with Clerk context whether or not the URL has a trailing slash', { concurrency: false }, async () => {
  const cdp = await getRouteBrowser();
  for (const route of ['/insights', '/insights/']) {
    await cdp.send('Page.navigate', {
      url: `${baseUrl}${route}?smoke-editor=1`,
    });
    await waitForBrowserCondition(
      cdp,
      `location.pathname === '${route}' && Boolean(document.querySelector('[data-testid="editorial-queue"]'))`,
      `${route}: editor workspace did not render; check that ClerkProvider wraps the Insights route.`,
    );
    const pageState = await evaluateBrowser(cdp, `({
      path: location.pathname,
      hasQueue: Boolean(document.querySelector('[data-testid="editorial-queue"]')),
      hasClerkProviderError: (document.body?.innerText ?? '').includes('useAuth can only be used within the <ClerkProvider'),
    })`);
    assert.equal(pageState.path, route, `${route}: browser navigation changed the requested path`);
    assert.equal(pageState.hasQueue, true, `${route}: editor queue is missing`);
    assert.equal(pageState.hasClerkProviderError, false, `${route}: Clerk hooks rendered outside ClerkProvider`);
  }
});

test('public sign-up route explains that newsroom account creation is restricted', { concurrency: false }, async () => {
  const cdp = await getRouteBrowser();
  await cdp.send('Page.navigate', { url: `${baseUrl}/sign-up` });
  await waitForBrowserCondition(
    cdp,
    `Boolean(document.querySelector('#editor-signup-title'))`,
    'The sign-up route did not render its account restriction notice.',
  );
  const state = await evaluateBrowser(cdp, `(() => ({
    title: document.querySelector('#editor-signup-title')?.textContent?.trim() ?? '',
    body: document.body?.innerText ?? '',
    formCount: document.querySelectorAll('form').length,
    inputCount: document.querySelectorAll('input').length,
    signInHref: document.querySelector('a[href$="/sign-in"]')?.getAttribute('href') ?? '',
  }))()`);
  assert.equal(state.title, 'Accounts are invitation-only.');
  assert.match(state.body, /Self-service account creation is disabled/i);
  assert.match(state.body, /approved editors with a verified primary email/i);
  assert.equal(state.formCount, 0, 'restricted sign-up route must not expose a registration form');
  assert.equal(state.inputCount, 0, 'restricted sign-up route must not accept account details');
  assert.equal(state.signInHref, '/sign-in', 'restricted sign-up route should offer a clear sign-in path');
});

test('signed-in release history filters remain usable at a mobile viewport', { concurrency: false }, async () => {
  await checkMobileEditorHistory();
});

test('release readiness recovers after a temporary API outage', { concurrency: false }, async () => {
  await checkReleaseReadinessRecovery();
});

test('automation audit links open the matching scheduled release and rejected runs stay unlinked', { concurrency: false }, async () => {
  await checkAutomationAuditReleaseLink();
});

test('light and dark themes stay readable across key public and newsroom routes', { concurrency: false }, async () => {
  await checkThemeRegression();
});

test('visual preview contract rejects an empty article card with a route-specific error', () => {
  const route = '/article/empty-preview-card';
  const emptyPath = path.join(os.tmpdir(), `gan-empty-preview-${process.pid}.png`);
  try {
    execFileSync('magick', ['-size', '1200x630', 'xc:#f4f1ea', emptyPath]);
    assert.throws(
      () => assertVisualPreviewAsset(emptyPath, route),
      new RegExp(`${route}: preview card accent rule is missing`),
    );
  } finally {
    unlinkSync(emptyPath);
  }
});

test('development preview cards refresh when an editor changes a story title', async () => {
  const route = '/article/ai-models-antibiotic-discovery';
  const contentPath = path.join(root, 'src', 'content.ts');
  const originalContent = await readFile(contentPath, 'utf8');
  const storyMarker = "slug: 'ai-models-antibiotic-discovery'";
  const storyStart = originalContent.indexOf(storyMarker);
  assert.notEqual(storyStart, -1, `${route}: fixture story is missing from content.ts`);
  const titleStart = originalContent.indexOf("title: '", storyStart);
  const titleEnd = originalContent.indexOf("',", titleStart + 8);
  assert.ok(titleStart > storyStart && titleEnd > titleStart, `${route}: fixture story title is missing from content.ts`);
  const originalTitle = originalContent.slice(titleStart + 8, titleEnd);

  const editedTitle = 'Smoke refresh reaches the shared preview card';
  const editedContent = `${originalContent.slice(0, titleStart + 8)}${editedTitle}${originalContent.slice(titleEnd)}`;
  writeFileSync(contentPath, editedContent);
  try {
    await waitForDevelopmentPreviewTitle(`${editedTitle} — Global AI News`, route);
  } finally {
    writeFileSync(contentPath, originalContent);
    await waitForDevelopmentPreviewTitle(`${originalTitle} — Global AI News`, route);
  }
  assert.doesNotMatch(
    devServerOutput,
    /src\/content\.ts changed, restarting server/,
    `${route}: editing a story restarted Vite instead of refreshing only the changed preview.`,
  );
});

test('long article headlines scale without dropping words, while impossible titles fail by route', () => {
  const route = '/article/long-headline-preview';
  const longTitle = 'A remarkably long newsroom headline about how artificial intelligence infrastructure is reshaping regional energy markets and enterprise deployment decisions — Global AI News';
  const runLayout = (title) => JSON.stringify(previewLayout(title, route));

  const layout = JSON.parse(runLayout(longTitle));
  assert.equal(layout.lines.join(' '), longTitle, `${route}: long headline lost words during wrapping`);
  assert.ok(layout.lines.length > 3, `${route}: long headline did not wrap beyond the legacy three-line limit`);
  assert.ok(layout.fontSize < 54, `${route}: long headline did not scale down predictably`);

  const standardLayout = JSON.parse(runLayout('AI models are accelerating the hunt for new antibiotics — Global AI News'));
  assert.equal(standardLayout.fontSize, 54, `${route}: short or medium headline lost the current editorial hierarchy`);

  const impossibleTitle = `${'A '.repeat(220)}Global AI News`;
  assert.throws(
    () => previewLayout(impossibleTitle, route),
    new RegExp(`${route}: preview title does not fit the available card area without clipping`),
  );
});

test('headline pixels stay readable and inside the card at every supported title size', () => {
  const fixtureCounts = new Map([
    [54, 7],
    [46, 13],
    [40, 17],
    [34, 21],
    [30, 31],
  ]);
  for (const [fontSize, wordCount] of fixtureCounts) {
    const route = `/article/preview-title-size-${fontSize}`;
    const slug = `preview-title-size-${fontSize}`;
    const title = Array(wordCount).fill('Editorial').join(' ');
    const layout = previewLayout(title, route);
    assert.equal(layout.fontSize, fontSize, `${route}: fixture did not select the supported ${fontSize}px title size`);
    const outputPath = path.join(os.tmpdir(), `gan-preview-size-${process.pid}-${fontSize}.png`);
    try {
      execFileSync(
        'magick',
        ['svg:-', '-set', 'comment', title, outputPath],
        { input: renderPreviewSvg(title, 'Field Notes', slug), stdio: ['pipe', 'ignore', 'inherit'] },
      );
      assertVisualPreviewAsset(outputPath, route, title);
    } finally {
      unlinkSync(outputPath);
    }
  }
});

test('homepage and article body serve local editorial images with a working fallback', async () => {
  const home = await fetchText('/');
  assert.equal(home.response.status, 200);
  const homeImage = openingTags(home.body, 'img')
    .find((tag) => (attributeValue(tag, 'src') ?? '').startsWith('/images/editorial/'));
  assert.ok(homeImage, 'homepage lead story is missing its local editorial image');
  assert.ok(attributeValue(homeImage, 'alt'), 'homepage editorial image is missing alt text');
  assert.ok(attributeValue(homeImage, 'width'), 'homepage editorial image is missing width');
  assert.ok(attributeValue(homeImage, 'height'), 'homepage editorial image is missing height');

  const article = await fetchText('/article/india-ai-compute-access-2026/');
  assert.equal(article.response.status, 200);
  const articleImage = openingTags(article.body, 'img')
    .find((tag) => (attributeValue(tag, 'src') ?? '').startsWith('/images/editorial/'));
  assert.ok(articleImage, 'article body is missing its local editorial image');

  const storySlugs = [
    'india-ai-compute-access-2026',
    'weekly-deep-dive-cost-of-intelligence',
    'reliability-is-the-new-ai-moat',
    'study-finds-word-cues-can-override-game-theory-choices-in-llms',
    'ai-models-antibiotic-discovery',
    'quiet-race-watermark-everything-ai-makes',
    'small-models-serious-workflows',
  ];
  const imagePaths = new Set([
    attributeValue(homeImage, 'src'),
    attributeValue(articleImage, 'src'),
    '/images/editorial/fallback.jpg',
    ...storySlugs.map((slug) => `/images/editorial/${slug}.jpg`),
  ]);
  for (const imagePath of imagePaths) {
    const response = await fetch(`${baseUrl}${imagePath}`);
    assert.equal(response.status, 200, `${imagePath}: image did not load`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.ok(bytes.length > 10_000, `${imagePath}: image is unexpectedly small`);
    assert.deepEqual([...bytes.slice(0, 3)], [0xff, 0xd8, 0xff], `${imagePath}: response is not a valid JPEG`);
  }
});
