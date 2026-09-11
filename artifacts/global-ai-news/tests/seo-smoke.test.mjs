import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';
import { after, before, test } from 'node:test';

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist', 'public');
const publicDir = path.join(root, 'public');
const site = 'https://www.globalainews.in';
const chromium = process.env.CHROMIUM_BIN || '/repl/tools/bin/chromium';
const port = 0;

let server;
let baseUrl;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
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

function sitemapRoutes(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => routeFromUrl(match[1]));
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
  createReadStream(filePath).pipe(response);
}

async function startStaticServer() {
  server = createServer(async (request, response) => {
    try {
      const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
      if (requestPath === '/api/newsroom/content') {
        response.statusCode = 503;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify({ error: 'Smoke server does not provide newsroom data' }));
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

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

async function fetchText(route) {
  const response = await fetch(`${baseUrl}${route}`);
  return { response, body: await response.text() };
}

async function renderRoute(route, width, height) {
  const userDataDir = await stat(os.tmpdir()).then(() => `${os.tmpdir()}/gan-smoke-${process.pid}-${width}-${route.replace(/[^a-z0-9]/gi, '-')}`);
  const url = `${baseUrl}${route}`;
  const args = [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--no-first-run',
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    '--virtual-time-budget=2500',
    '--dump-dom',
    url,
  ];
  try {
    const result = await execFileAsync(chromium, args, { maxBuffer: 8 * 1024 * 1024, timeout: 30_000 });
    return result.stdout;
  } catch (error) {
    const details = [error.stdout, error.stderr].filter(Boolean).join('\n');
    throw new Error(`Chromium failed for ${route} at ${width}px:\n${details}`, { cause: error });
  }
}

function assertSeoDocument(document, route, { article = false } = {}) {
  const title = htmlText(tagContent(document, 'title'));
  const description = metaContent(document, 'name', 'description');
  const canonical = linkHref(document, 'canonical');
  const expectedCanonical = `${site}${route === '/' ? '/' : route}`;

  assert.ok(title.length >= 20, `${route}: title is missing or too short`);
  assert.ok(description.length >= 20, `${route}: description is missing or too short`);
  assert.equal(canonical, expectedCanonical, `${route}: canonical does not match the requested route`);
  assert.equal(metaContent(document, 'property', 'og:title'), title, `${route}: og:title mismatch`);
  assert.equal(metaContent(document, 'property', 'og:description'), description, `${route}: og:description mismatch`);
  assert.equal(metaContent(document, 'property', 'og:url'), canonical, `${route}: og:url mismatch`);
  assert.equal(metaContent(document, 'name', 'twitter:card'), 'summary_large_image', `${route}: Twitter card missing`);
  assert.equal((document.match(/<main\b/gi) ?? []).length, 1, `${route}: expected one main landmark`);
  assert.equal((document.match(/<h1\b/gi) ?? []).length, 1, `${route}: expected one h1`);

  const structuredDataText = tagContent(document, 'script', '[^>]*data-global-ai-ld');
  assert.ok(structuredDataText, `${route}: JSON-LD is missing`);
  const structuredData = JSON.parse(structuredDataText);
  assert.equal(structuredData['@context'], 'https://schema.org', `${route}: JSON-LD context is invalid`);
  assert.ok(Array.isArray(structuredData['@graph']), `${route}: JSON-LD graph is missing`);
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === (article ? 'NewsArticle' : 'WebSite')), `${route}: expected primary JSON-LD type is missing`);
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === 'BreadcrumbList'), `${route}: breadcrumb JSON-LD is missing`);

  if (article) {
    assert.equal(linkHref(document, 'amphtml'), `${site}/amp/article/ai-models-antibiotic-discovery/`, `${route}: AMP relationship is missing`);
  } else {
    assert.equal(linkHref(document, 'amphtml'), '', `${route}: non-article page unexpectedly exposes AMP`);
  }
}

function assertInitialSeoDocument(document, route, { article = false } = {}) {
  const title = htmlText(tagContent(document, 'title'));
  const description = metaContent(document, 'name', 'description');
  const canonical = linkHref(document, 'canonical');
  const expectedCanonical = `${site}${route === '/' ? '/' : route}`;

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
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === (article ? 'NewsArticle' : 'WebSite')), `${route}: initial primary JSON-LD type is missing`);
  assert.ok(structuredData['@graph'].some((entry) => entry['@type'] === 'BreadcrumbList'), `${route}: initial breadcrumb JSON-LD is missing`);

  if (article) {
    assert.equal(linkHref(document, 'amphtml'), `${site}/amp/article/ai-models-antibiotic-discovery/`, `${route}: initial AMP relationship is missing`);
  } else {
    assert.equal(linkHref(document, 'amphtml'), '', `${route}: non-article initial HTML unexpectedly exposes AMP`);
  }
}

before(async () => {
  await stat(path.join(distDir, 'index.html'));
  await startStaticServer();
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

test('public routes, metadata, structured data, AMP, RSS, and responsive pages pass', async () => {
  const [{ response: sitemapResponse, body: sitemap }, { response: feedResponse, body: feed }] = await Promise.all([
    fetchText('/sitemap.xml'),
    fetchText('/feed.xml'),
  ]);
  assert.equal(sitemapResponse.status, 200, 'sitemap.xml is not reachable');
  assert.equal(feedResponse.status, 200, 'feed.xml is not reachable');

  const routes = sitemapRoutes(sitemap);
  assert.ok(routes.length >= 15, 'sitemap unexpectedly contains too few public routes');
  assert.equal(new Set(routes).size, routes.length, 'sitemap contains duplicate routes');
  assert.equal(routes[0], '/', 'sitemap should start with the homepage');

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
    assert.match(body, /<div id="root"><\/div>/, `${route}: direct request did not receive the SPA shell`);
    assertInitialSeoDocument(body, route, { article: route.startsWith('/article/') });
  }

  const titles = new Map();
  for (const route of new Set(staticRoutes)) {
    const document = await renderRoute(route, 1440, 900);
    assertSeoDocument(document, route, { article: route.startsWith('/article/') });
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
    assertSeoDocument(document, route, { article: route.startsWith('/article/') });
    assert.match(document, /<body[\s\S]*<main\b/, `${route}: mobile render did not produce page content`);
  }

  const ampPath = '/amp/article/ai-models-antibiotic-discovery/';
  const { response: ampResponse, body: ampDocument } = await fetchText(ampPath);
  assert.equal(ampResponse.status, 200, 'AMP document is not reachable');
  assert.match(ampDocument, /<html[^>]*\bamp\b/i, 'AMP document is missing the amp attribute');
  assert.equal(linkHref(ampDocument, 'canonical'), `${site}/article/ai-models-antibiotic-discovery`, 'AMP canonical is incorrect');
  assert.ok(tagContent(ampDocument, 'title'), 'AMP document is missing a title');
  assert.ok(metaContent(ampDocument, 'name', 'description'), 'AMP document is missing a description');
  assert.match(ampDocument, /<script[^>]+src="https:\/\/cdn\.ampproject\.org\/v0\.js"/i, 'AMP runtime is missing');
  assert.match(ampDocument, /<style amp-custom>/i, 'AMP custom CSS is missing');
  assert.ok(!/<script(?![^>]+cdn\.ampproject\.org\/v0\.js)/i.test(ampDocument), 'AMP document contains a non-runtime script');
  assert.ok(Buffer.byteLength(ampDocument) < 75_000, 'AMP document exceeds the 75 KB document limit');

  console.log(`Smoke checked ${new Set(staticRoutes).size} public routes at desktop, ${mobileRoutes.length} at mobile, plus AMP and RSS.`);
});