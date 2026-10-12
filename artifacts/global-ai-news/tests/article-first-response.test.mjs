import assert from 'node:assert/strict';
import { createServer, request as httpRequest } from 'node:http';
import { execFile, spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { promisify } from 'node:util';
import path from 'node:path';
import { once } from 'node:events';

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..', '..', '..');
const apiDist = path.join(root, 'artifacts', 'api-server', 'dist', 'index.mjs');
const webDist = path.join(root, 'artifacts', 'global-ai-news', 'dist');
const webServer = path.join(webDist, 'server', 'server.mjs');
const fixtureToken = `${process.pid}-${Date.now()}`;
const actor = `article-html-test-${fixtureToken}`;
const slugs = {
  published: `first-response-${fixtureToken}`,
  missingAuthor: `first-response-no-author-${fixtureToken}`,
  scheduled: `first-response-scheduled-${fixtureToken}`,
  draft: `first-response-draft-${fixtureToken}`,
  canceled: `first-response-canceled-${fixtureToken}`,
  unpublished: `first-response-unpublished-${fixtureToken}`,
  archived: `first-response-archived-${fixtureToken}`,
};
const publishedTitle = 'A live article renders before browser scripts run';
const publishedDek = 'A temporary publication fixture verifies first-response article metadata and visible content.';
const publishedBodyMarker = `FIRST_RESPONSE_BODY_${fixtureToken}`;
const missingAuthorTitle = 'A published story with no author record';
const longCopy = Array(120)
  .fill('The temporary newsroom article contains enough editorial copy to pass publication readiness and verify complete server-rendered article content.')
  .join(' ');
const privateStoryFixtures = [
  {
    slug: slugs.scheduled,
    title: 'A scheduled article fixture',
  },
  {
    slug: slugs.draft,
    title: 'A draft article fixture',
  },
  {
    slug: slugs.canceled,
    title: 'A canceled article fixture',
  },
  {
    slug: slugs.unpublished,
    title: 'An unpublished article fixture',
  },
  {
    slug: slugs.archived,
    title: 'An archived article fixture',
  },
].map((fixture) => {
  const privateBodyMarker = `PRIVATE_ARTICLE_BODY_${fixture.slug}`;
  return {
    ...fixture,
    privateBodyMarker,
    body: `${longCopy} ${privateBodyMarker}`,
  };
});
const testEditorHeader = { 'x-newsroom-test-editor': actor };
const storyPayload = {
  dek: publishedDek,
  cadence: 'daily',
  category: 'Field Notes',
  author: 'lena-hoff',
  body: `${longCopy} ${publishedBodyMarker}`,
};

let apiProcess;
let webProcess;
let devWebProcess;
let failureApiServer;
let failureWebProcess;
let failureDevWebProcess;
let apiOrigin;
let webOrigin;
let devWebOrigin;
let failureApiOrigin;
let failureWebOrigin;
let failureDevWebOrigin;
let failureApiRequests = [];
let failureApiUnavailable = false;

async function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Could not determine a free port.')));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

function terminate(processHandle) {
  if (!processHandle?.pid) return;
  try {
    process.kill(-processHandle.pid, 'SIGTERM');
  } catch {
    processHandle.kill('SIGTERM');
  }
}

async function stopProcess(processHandle) {
  if (!processHandle?.pid) return;
  if (processHandle.exitCode !== null || processHandle.signalCode !== null) return;
  const exited = once(processHandle, 'exit').catch(() => {});
  terminate(processHandle);
  await Promise.race([
    exited,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (processHandle.exitCode === null && processHandle.signalCode === null) {
    try {
      process.kill(-processHandle.pid, 'SIGKILL');
    } catch {
      processHandle.kill('SIGKILL');
    }
    await exited;
  }
}

async function waitForHttp(url, processHandle) {
  const deadline = Date.now() + 30_000;
  let lastError = 'no response';
  while (Date.now() < deadline) {
    if (processHandle?.exitCode !== null && processHandle?.exitCode !== undefined) {
      throw new Error(`Server exited before becoming ready with status ${processHandle.exitCode}.`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Server did not become ready at ${url}: ${lastError}.`);
}

async function startApi() {
  const port = await findFreePort();
  apiOrigin = `http://127.0.0.1:${port}`;
  apiProcess = spawn('node', [apiDist], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      NEWSROOM_TEST_EDITOR_ID: actor,
      PORT: String(port),
    },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  await waitForHttp(`${apiOrigin}/api/healthz`, apiProcess);
}

async function startWeb() {
  const started = await startWebAtApi(apiOrigin);
  webOrigin = started.origin;
  webProcess = started.processHandle;
}

async function startWebAtApi(newsroomApiOrigin) {
  const port = await findFreePort();
  const origin = `http://127.0.0.1:${port}`;
  const processHandle = spawn('node', [webServer], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      NEWSROOM_API_ORIGIN: newsroomApiOrigin,
      PORT: String(port),
    },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  try {
    await waitForHttp(`${origin}/`, processHandle);
  } catch (error) {
    await stopProcess(processHandle);
    throw error;
  }
  return { origin, processHandle };
}

async function startDevWeb() {
  const started = await startDevWebAtApi(apiOrigin);
  devWebOrigin = started.origin;
  devWebProcess = started.processHandle;
}

async function startDevWebAtApi(newsroomApiOrigin) {
  const port = await findFreePort();
  const origin = `http://127.0.0.1:${port}`;
  const processHandle = spawn(
    'pnpm',
    [
      '--filter',
      '@workspace/global-ai-news',
      'run',
      'dev',
      '--',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: root,
      detached: true,
      env: {
        ...process.env,
        BASE_PATH: process.env.BASE_PATH ?? '/',
        NODE_ENV: 'development',
        NEWSROOM_API_ORIGIN: newsroomApiOrigin,
        PORT: String(port),
      },
      stdio: ['ignore', 'ignore', 'inherit'],
    },
  );
  try {
    await waitForHttp(`${origin}/`, processHandle);
  } catch (error) {
    await stopProcess(processHandle);
    throw error;
  }
  return { origin, processHandle };
}

async function startApiFailureFixture() {
  const port = await findFreePort();
  failureApiOrigin = `http://127.0.0.1:${port}`;
  failureApiRequests = [];
  failureApiUnavailable = false;
  failureApiServer = createServer((request, response) => {
    failureApiRequests.push({
      route: new URL(request.url ?? '/', failureApiOrigin).pathname,
      unavailable: failureApiUnavailable,
    });
    if (!failureApiUnavailable) {
      void fetch(`${apiOrigin}${request.url ?? '/'}`)
        .then(async (upstream) => {
          response.writeHead(upstream.status, {
            'content-type': upstream.headers.get('content-type') ?? 'application/json',
          });
          response.end(Buffer.from(await upstream.arrayBuffer()));
        })
        .catch(() => {
          response.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
          response.end('CONTROLLED_NEWSROOM_API_PROXY_FAILURE');
        });
      return;
    }
    response.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('CONTROLLED_NEWSROOM_API_FAILURE_FIXTURE');
  });
  await new Promise((resolve, reject) => {
    failureApiServer.once('error', reject);
    failureApiServer.listen(port, '127.0.0.1', resolve);
  });
}

async function stopApiFailureFixture() {
  if (!failureApiServer?.listening) return;
  await new Promise((resolve, reject) => {
    failureApiServer.close((error) => (error ? reject(error) : resolve()));
  });
  failureApiServer = undefined;
}

async function assertTemporaryArticleUnavailable(origin, environment) {
  const response = await getArticleFrom(origin, slugs.published);
  const html = await response.text();
  assert.equal(response.status, 503, `${environment} must return HTTP 503 when the newsroom API is unavailable`);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex', `${environment} must send a noindex header`);
  assert.equal(response.headers.get('cache-control'), 'no-store', `${environment} must not cache the outage response`);
  assert.match(html, /name="robots" content="noindex,follow"/i, `${environment} HTML must be noindex`);
  assert.equal(
    html.match(/<title>([\s\S]*?)<\/title>/i)?.[1],
    'Article temporarily unavailable — Global AI News',
    `${environment} must render the temporary-unavailable title`,
  );
  assert.match(html, /<h1>Article temporarily unavailable<\/h1>/i);
  assert.doesNotMatch(html, /<link\b[^>]*rel=["']canonical["']/i, `${environment} must not expose a stale canonical`);
  assert.doesNotMatch(html, /<meta\b[^>]*(?:property=["']og:url["']|name=["']twitter:url["'])/i);
  for (const staleStoryValue of [
    publishedTitle,
    publishedDek,
    publishedBodyMarker,
    `/article/${slugs.published}`,
    'CONTROLLED_NEWSROOM_API_FAILURE_FIXTURE',
    'CONTROLLED_NEWSROOM_API_PROXY_FAILURE',
  ]) {
    assert.ok(
      !html.includes(staleStoryValue),
      `${environment} outage response must not include ${staleStoryValue}`,
    );
  }
}

async function assertArticleFailureResponses() {
  await startApiFailureFixture();
  const production = await startWebAtApi(failureApiOrigin);
  failureWebOrigin = production.origin;
  failureWebProcess = production.processHandle;
  const development = await startDevWebAtApi(failureApiOrigin);
  failureDevWebOrigin = development.origin;
  failureDevWebProcess = development.processHandle;

  const builtArticlePath = path.join(webDist, 'public', 'article', slugs.published, 'index.html');
  assert.equal(
    existsSync(builtArticlePath),
    false,
    'outage fixture article must not have a prerendered file that bypasses the newsroom API',
  );
  for (const [origin, environment] of [
    [failureWebOrigin, 'production'],
    [failureDevWebOrigin, 'Vite development'],
  ]) {
    const warmResponse = await getArticleFrom(origin, slugs.published);
    const warmHtml = await warmResponse.text();
    assert.equal(warmResponse.status, 200, `${environment} should render the article before the outage`);
    assert.match(warmHtml, new RegExp(escapeRegExp(publishedTitle)));
    assert.match(warmHtml, new RegExp(escapeRegExp(publishedBodyMarker)));
  }

  failureApiUnavailable = true;
  await new Promise((resolve) => setTimeout(resolve, 1_100));
  await assertTemporaryArticleUnavailable(failureWebOrigin, 'production');
  await assertTemporaryArticleUnavailable(failureDevWebOrigin, 'Vite development');
  assert.ok(
    failureApiRequests.filter(
      ({ route, unavailable }) => route === '/api/newsroom/content' && unavailable,
    ).length >= 2,
    'both web servers must retry the snapshot after the outage begins',
  );
  assert.ok(
    failureApiRequests.every(({ route }) => route === '/api/newsroom/content'),
    'the API outage fixture should receive only public snapshot requests',
  );
}

async function requestApi(route, options = {}) {
  const response = await fetch(`${apiOrigin}${route}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...testEditorHeader,
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json();
  assert.ok(
    response.ok,
    `${options.method ?? 'GET'} ${route} failed: ${response.status} ${JSON.stringify(body)}`,
  );
  return body;
}

async function createRelease(
  slug,
  title,
  publishAt,
  author = 'lena-hoff',
  authorType,
  body = storyPayload.body,
) {
  const created = await requestApi('/api/newsroom/releases', {
    method: 'POST',
    body: JSON.stringify({
      ...storyPayload,
      slug,
      title,
      body,
      author,
      ...(authorType ? { authorType } : {}),
      publishAt,
    }),
  });
  assert.equal(created.slug, slug);
  assert.equal(created.publishable, true);
  return created;
}

async function setReleaseStates() {
  const script = `
    import { eq } from "drizzle-orm";
    import { db, pool, editorialReleasesTable } from "@workspace/db";
    (async () => {
      await db.update(editorialReleasesTable).set({ status: "draft" }).where(eq(editorialReleasesTable.slug, process.env.DRAFT_SLUG));
      await db.update(editorialReleasesTable).set({ status: "canceled" }).where(eq(editorialReleasesTable.slug, process.env.CANCELED_SLUG));
      await db.update(editorialReleasesTable).set({ status: "unpublished" }).where(eq(editorialReleasesTable.slug, process.env.UNPUBLISHED_SLUG));
      await db.update(editorialReleasesTable).set({ status: "archived" }).where(eq(editorialReleasesTable.slug, process.env.ARCHIVED_SLUG));
      await pool.end();
    })().catch(async (error) => {
      console.error(error);
      await pool.end();
      process.exitCode = 1;
    });
  `;
  await execFileAsync(
    'pnpm',
    ['--filter', '@workspace/db', 'exec', 'tsx', '--eval', script],
    {
      cwd: root,
      env: {
        ...process.env,
        DRAFT_SLUG: slugs.draft,
        CANCELED_SLUG: slugs.canceled,
        UNPUBLISHED_SLUG: slugs.unpublished,
        ARCHIVED_SLUG: slugs.archived,
      },
      maxBuffer: 2 * 1024 * 1024,
    },
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function htmlAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'));
  return match?.[1]
    ?.replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function metaValue(html, key, attribute = 'property') {
  const pattern = new RegExp(
    `<meta\\b[^>]*\\b${attribute}=["']${escapeRegExp(key)}["'][^>]*>`,
    'i',
  );
  const tag = html.match(pattern)?.[0];
  return tag ? htmlAttribute(tag, 'content') : undefined;
}

function articleJsonLd(html) {
  const script = html.match(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*data-global-ai-ld[^>]*>([\s\S]*?)<\/script>/i,
  )?.[1];
  assert.ok(script, 'raw HTML is missing the first-response JSON-LD script');
  return JSON.parse(script);
}

function seoFingerprint(html) {
  return {
    title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1],
    description: metaValue(html, 'description', 'name'),
    canonical: html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0],
    ogTitle: metaValue(html, 'og:title'),
    ogDescription: metaValue(html, 'og:description'),
    ogUrl: metaValue(html, 'og:url'),
    ogImage: metaValue(html, 'og:image'),
    twitterTitle: metaValue(html, 'twitter:title', 'name'),
    twitterDescription: metaValue(html, 'twitter:description', 'name'),
    twitterImage: metaValue(html, 'twitter:image', 'name'),
    articleJsonLd: articleJsonLd(html),
  };
}

async function getArticle(slug, userAgent = 'Mozilla/5.0 (compatible; FirstResponseTest/1.0)') {
  return getArticleFrom(webOrigin, slug, userAgent);
}

async function getArticleFrom(
  origin,
  slug,
  userAgent = 'Mozilla/5.0 (compatible; FirstResponseTest/1.0)',
) {
  return fetch(`${origin}/article/${slug}`, {
    headers: { 'user-agent': userAgent },
  });
}

async function getArticleFromRawPath(origin, rawPath) {
  const url = new URL(origin);
  return new Promise((resolve, reject) => {
    const request = httpRequest({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      method: 'GET',
      path: rawPath,
    }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve({
        status: response.statusCode,
        headers: response.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      }));
    });
    request.once('error', reject);
    request.end();
  });
}

async function assertMalformedArticleResponses(origin, environment) {
  const malformedPaths = [
    '/article/encoded%2Fseparator',
    '/article/encoded%5Cseparator',
    `/article/%2e%2e%2f${slugs.published}`,
    '/article/%2e%2e',
    '/article/bad%ZZ',
  ];

  for (const rawPath of malformedPaths) {
    const response = await getArticleFromRawPath(origin, rawPath);
    assert.equal(response.status, 404, `${environment} ${rawPath} must return HTTP 404`);
    assert.equal(response.headers['x-robots-tag'], 'noindex', `${environment} ${rawPath} must send noindex`);
    assert.match(response.headers['content-type'] ?? '', /text\/html/i);
    assert.match(response.body, /<title>Article not found — Global AI News<\/title>/);
    assert.match(response.body, /<meta name="robots" content="noindex,follow">/i);
    assert.doesNotMatch(response.body, /id=["']root["']/i, `${environment} ${rawPath} must not return the SPA root`);
    assert.doesNotMatch(response.body, /type=["']module["']/i, `${environment} ${rawPath} must not return app scripts`);
    assert.doesNotMatch(response.body, new RegExp(escapeRegExp(publishedTitle)));
    assert.doesNotMatch(response.body, /PRIVATE_ARTICLE_BODY_/);
  }
}

async function assertHiddenArticleResponses(origin, environment) {
  const cases = [
    ...privateStoryFixtures.map(({ slug, title }) => ({
      slug,
      label: `${title} (${environment})`,
    })),
    {
      slug: `missing-article-${fixtureToken}`,
      label: `unknown article (${environment})`,
    },
  ];

  for (const { slug, label } of cases) {
    const response = await getArticleFrom(origin, slug);
    const html = await response.text();
    assert.equal(response.status, 404, `${label} must return HTTP 404`);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex', `${label} must send noindex`);
    assert.match(html, /name="robots" content="noindex,follow"/i, `${label} HTML must be noindex`);
    assert.match(html, /<title>Article not found — Global AI News<\/title>/, `${label} must not render the SPA shell`);
    for (const fixture of privateStoryFixtures) {
      assert.doesNotMatch(
        html,
        new RegExp(escapeRegExp(fixture.title)),
        `${label} response must not contain private title ${fixture.title}`,
      );
      assert.doesNotMatch(
        html,
        new RegExp(escapeRegExp(fixture.privateBodyMarker)),
        `${label} response must not contain private body for ${fixture.slug}`,
      );
    }
  }
}

async function assertPublishedOnlyFeeds() {
  const [
    contentResponse,
    metadataResponse,
    sitemapResponse,
    feedResponse,
    apiRootSitemapResponse,
    apiRootFeedResponse,
    webSitemapResponse,
    webFeedResponse,
  ] = await Promise.all([
    fetch(`${apiOrigin}/api/newsroom/content`),
    fetch(`${apiOrigin}/api/newsroom/metadata`),
    fetch(`${apiOrigin}/api/newsroom/sitemap.xml`),
    fetch(`${apiOrigin}/api/newsroom/feed.xml`),
    fetch(`${apiOrigin}/sitemap.xml`),
    fetch(`${apiOrigin}/feed.xml`),
    fetch(`${webOrigin}/sitemap.xml`),
    fetch(`${webOrigin}/feed.xml`),
  ]);
  for (const response of [
    contentResponse,
    metadataResponse,
    sitemapResponse,
    feedResponse,
    webSitemapResponse,
    webFeedResponse,
  ]) {
    assert.equal(response.status, 200);
  }
  assert.equal(apiRootSitemapResponse.status, 404, 'API artifact must not own the root sitemap route');
  assert.equal(apiRootFeedResponse.status, 404, 'API artifact must not own the root RSS route');

  const editorReadResponses = await Promise.all([
    '/api/newsroom/releases',
    '/api/newsroom/releases/history',
    '/api/newsroom/automation/status',
    '/api/newsroom/automation/runs',
  ].map((route) => fetch(`${apiOrigin}${route}`)));
  for (const response of editorReadResponses) {
    assert.equal(response.status, 401, 'editor-only read endpoint must reject anonymous requests');
  }

  const content = await contentResponse.json();
  const metadata = await metadataResponse.json();
  const [sitemap, feed, webSitemap, webFeed] = await Promise.all([
    sitemapResponse.text(),
    feedResponse.text(),
    webSitemapResponse.text(),
    webFeedResponse.text(),
  ]);
  assert.match(webSitemapResponse.headers.get('content-type') ?? '', /application\/xml/i);
  assert.match(webFeedResponse.headers.get('content-type') ?? '', /application\/rss\+xml/i);
  assert.equal(webSitemap, sitemap, 'web sitemap must proxy the current API sitemap');
  assert.equal(webFeed, feed, 'web RSS must proxy the current API feed');
  const publishedSlugs = new Set(content.stories.map((story) => story.slug));
  const flagshipReport = content.stories.find((story) => story.slug === 'india-ai-compute-access-2026');
  assert.equal(flagshipReport?.contentType, 'Report', 'API-backed snapshot must preserve the maintained report type');
  assert.ok(flagshipReport?.body.some((section) => section.table?.headers.length), 'API-backed snapshot must preserve report tables');
  assert.ok(
    content.sources.find((source) => source.slug === 'pib-capacity-and-use-factsheet-2026')?.tier === 1,
    'API-backed snapshot must preserve report source provenance metadata',
  );
  const articlePaths = new Set(
    metadata.routes.filter((route) => route.article).map((route) => route.path),
  );
  assert.equal(
    articlePaths.size,
    content.stories.length,
    'article metadata must include every published story and no unpublished story',
  );
  for (const story of content.stories) {
    assert.ok(
      !story.dateModified || story.dateModified >= story.date,
      `${story.slug} exposes dateModified before datePublished`,
    );
    const route = metadata.routes.find((candidate) => candidate.path === `/article/${story.slug}`);
    assert.ok(route, `${story.slug} is missing public SEO metadata`);
    assert.equal(route.lastmod, story.dateModified);
  }
  const forbiddenSlugs = [
    slugs.scheduled,
    slugs.draft,
    slugs.canceled,
    slugs.unpublished,
    slugs.archived,
  ];

  assert.ok(publishedSlugs.has(slugs.published), 'published fixture is absent from public content');
  assert.ok(articlePaths.has(`/article/${slugs.published}`), 'published fixture is absent from metadata');
  assert.ok(sitemap.includes(`https://www.globalainews.in/article/${slugs.published}/`));
  assert.ok(feed.includes(`https://www.globalainews.in/article/${slugs.published}/`));

  for (const slug of forbiddenSlugs) {
    assert.equal(publishedSlugs.has(slug), false, `${slug} leaked into public content`);
    assert.equal(articlePaths.has(`/article/${slug}`), false, `${slug} leaked into public metadata`);
    assert.equal(sitemap.includes(`/article/${slug}/`), false, `${slug} leaked into sitemap`);
    assert.equal(feed.includes(`/article/${slug}/`), false, `${slug} leaked into root RSS`);
    assert.equal(webSitemap.includes(`/article/${slug}/`), false, `${slug} leaked into web sitemap`);
    assert.equal(webFeed.includes(`/article/${slug}/`), false, `${slug} leaked into web RSS`);
  }
}

async function assertContactAlias() {
  const response = await fetch(`${webOrigin}/contact`, { redirect: 'manual' });
  assert.equal(response.status, 301, '/contact must permanently redirect to the canonical placeholder route');
  assert.equal(response.headers.get('location'), '/contact-us/');

  for (const [route, destination] of [
    ['/about', '/about-us/'],
    ['/ethics', '/code-of-ethics/'],
  ]) {
    const alias = await fetch(`${webOrigin}${route}?source=test`, { redirect: 'manual' });
    assert.equal(alias.status, 301, `${route} must permanently redirect`);
    assert.equal(alias.headers.get('location'), `${destination}?source=test`);
  }
  const canonicalHost = await fetch(`${webOrigin}/contact?from=apex`, {
    headers: { 'x-forwarded-host': 'globalainews.in', 'x-forwarded-proto': 'http' },
    redirect: 'manual',
  });
  assert.equal(canonicalHost.status, 301);
  assert.equal(
    canonicalHost.headers.get('location'),
    'https://www.globalainews.in/contact-us/?from=apex',
    'host and known-route redirects must be combined and preserve the query',
  );

  for (const route of [
    '/about-us/',
    '/code-of-ethics/',
    '/corrections/',
    '/contact-us/',
    '/privacy/',
    '/terms/',
    '/authors/',
  ]) {
    const placeholder = await fetch(`${webOrigin}${route}`);
    const html = await placeholder.text();
    assert.equal(placeholder.status, 200, `${route} must remain reachable`);
    assert.equal(placeholder.headers.get('x-robots-tag'), 'noindex');
    assert.match(html, /name="robots" content="noindex,follow"/i);
  }

  const mergedStory = await fetch(
    `${webOrigin}/article/public-compute-needs-public-metrics?campaign=legacy`,
    { redirect: 'manual' },
  );
  assert.equal(mergedStory.status, 301);
  assert.equal(
    mergedStory.headers.get('location'),
    '/article/india-ai-compute-access-2026/?campaign=legacy',
  );
  const mergedAmp = await fetch(
    `${webOrigin}/amp/article/public-compute-needs-public-metrics/?campaign=legacy`,
    { redirect: 'manual' },
  );
  assert.equal(mergedAmp.status, 301);
  assert.equal(
    mergedAmp.headers.get('location'),
    '/article/india-ai-compute-access-2026/?campaign=legacy',
  );
  for (const legacyUuidPath of [
    '/article/123e4567-e89b-42d3-a456-426614174000',
    '/article/123e4567-e89b-42d3-a456-426614174000/old-title',
  ]) {
    const gone = await fetch(`${webOrigin}${legacyUuidPath}`, { redirect: 'manual' });
    assert.equal(gone.status, 410, `${legacyUuidPath} must be permanently gone without a verified mapping`);
    assert.equal(gone.headers.get('x-robots-tag'), 'noindex');
  }

  const expectedCopy = {
    '/about-us': /Who speaks for the publication/,
    '/code-of-ethics': /AI-assisted work/,
    '/corrections': /No approved public corrections or contact channel is available/i,
    '/contact-us': /No approved public contact address or working contact form has been verified/i,
  };
  for (const [route, copy] of Object.entries(expectedCopy)) {
    const destination = await fetch(`${webOrigin}${route}`);
    const html = await destination.text();
    assert.equal(destination.status, 200, `${route} must resolve to its pending page`);
    assert.equal(destination.headers.get('x-robots-tag'), 'noindex', `${route} must send a noindex header`);
    assert.match(html, /name="robots" content="noindex,follow"/i, `${route} must remain noindex`);
    assert.match(html, copy, `${route} must render its shared editorial copy`);
  }
}

async function cleanupFixtures() {
  const script = `
    import { inArray } from "drizzle-orm";
    import { db, pool, editorialReleaseHistoryTable, editorialReleasesTable } from "@workspace/db";
    (async () => {
      const slugs = JSON.parse(process.env.ARTICLE_HTML_FIXTURE_SLUGS);
      await db.delete(editorialReleaseHistoryTable).where(inArray(editorialReleaseHistoryTable.releaseSlug, slugs));
      await db.delete(editorialReleasesTable).where(inArray(editorialReleasesTable.slug, slugs));
      const [history] = await db.select({ id: editorialReleaseHistoryTable.id }).from(editorialReleaseHistoryTable).where(inArray(editorialReleaseHistoryTable.releaseSlug, slugs)).limit(1);
      const [release] = await db.select({ id: editorialReleasesTable.id }).from(editorialReleasesTable).where(inArray(editorialReleasesTable.slug, slugs)).limit(1);
      if (history || release) throw new Error("First-response fixture cleanup did not remove all rows.");
      await pool.end();
    })().catch(async (error) => {
      console.error(error);
      await pool.end();
      process.exitCode = 1;
    });
  `;
  await execFileAsync(
    'pnpm',
    ['--filter', '@workspace/db', 'exec', 'tsx', '--eval', script],
    {
      cwd: root,
      env: {
        ...process.env,
        ARTICLE_HTML_FIXTURE_SLUGS: JSON.stringify(Object.values(slugs)),
      },
      maxBuffer: 2 * 1024 * 1024,
    },
  );
}

async function testRawArticleResponses() {
  const publicContentResponse = await fetch(`${apiOrigin}/api/newsroom/content`);
  assert.equal(publicContentResponse.status, 200);
  const publicContent = await publicContentResponse.json();
  assert.deepEqual(
    Object.keys(publicContent).sort(),
    [
      'generatedAt',
      'source',
      'stale',
      'authors',
      'sources',
      'evidenceSummaries',
      'entities',
      'timelineEvents',
      'stories',
      'signals',
      'industryMap',
      'indiaIndex',
      'essays',
      'askGlobalAnswers',
      'researchRecords',
      'dataProducts',
      'topics',
      'authorityEdges',
    ].sort(),
  );
  assert.equal(Object.hasOwn(publicContent, 'schedule'), false);
  assert.ok(
    publicContent.authors.every((author) => author.verifiedForPublication === true),
    'public author records must include only contributors verified for publication',
  );
  const publicAuthorsBySlug = new Map(publicContent.authors.map((author) => [author.slug, author]));
  for (const story of publicContent.stories) {
    const verifiedAuthor = publicAuthorsBySlug.get(story.author);
    if (verifiedAuthor) {
      assert.equal(story.authorType, 'person', `${story.slug} should use its verified person byline`);
      assert.equal(story.authorName, verifiedAuthor.name, `${story.slug} byline name should match its verified author record`);
    } else {
      assert.equal(story.author, 'global-ai-news-editorial-desk', `${story.slug} should not expose an unverified author slug`);
      assert.equal(story.authorType, 'organization', `${story.slug} should use an organization byline`);
      assert.equal(story.authorName, 'Global AI News Editorial Desk', `${story.slug} should use the publication desk byline`);
    }
  }
  assert.equal(
    publicContent.researchRecords.find((record) => record.slug === 'india-ai-compute-2026')?.authorSlug,
    'global-ai-news-editorial-desk',
    'the public research record should not expose an unverified personal author slug',
  );
  const forbiddenFields = new Set([
    'schedule',
    'publishAt',
    'cadence',
    'editorialSource',
    'updatedAt',
    'position',
    'editorialStatus',
    'status',
    'releaseStatus',
    'releaseState',
    'draftState',
    'isDraft',
    'isPublished',
    'workflow',
    'automation',
  ]);
  const assertNoEditorialFields = (value, path = '') => {
    if (!value || typeof value !== 'object') return;
    for (const [key, nested] of Object.entries(value)) {
      const publicAuthorityField =
        (key === 'updatedAt' && /^\/(?:researchRecords|dataProducts)\/\d+$/.test(path)) ||
        (key === 'status' &&
          (/^\/researchRecords\/\d+$/.test(path) ||
            /^\/dataProducts\/\d+$/.test(path) ||
            /^\/dataProducts\/\d+\/observations\/\d+$/.test(path)));
      assert.equal(
        forbiddenFields.has(key) && !publicAuthorityField,
        false,
        `private newsroom field leaked at ${path}/${key}`,
      );
      assertNoEditorialFields(nested, `${path}/${key}`);
    }
  };
  assertNoEditorialFields(publicContent);
  for (const story of publicContent.stories) {
    assert.ok(
      !story.dateModified || story.dateModified >= story.date,
      `${story.slug} exposes dateModified before datePublished`,
    );
  }
  const citedSourceSlugs = new Set([
    ...publicContent.stories.flatMap((story) => story.sources),
    ...publicContent.researchRecords.flatMap((record) => record.sourceSlugs),
    ...publicContent.dataProducts.flatMap((product) => product.sourceSlugs),
    ...publicContent.topics.flatMap((topic) => topic.sourceSlugs),
  ]);
  const returnedSourceSlugs = new Set(publicContent.sources.map((source) => source.slug));
  assert.deepEqual(
    [...returnedSourceSlugs].sort(),
    [...citedSourceSlugs].sort(),
    'public sources must be limited to sources cited by published articles',
  );
  const allowedSourceFields = new Set([
    'accessed', 'classification', 'evidenceType', 'kind', 'name', 'publicationDate',
    'publisher', 'relevance', 'scopeNote', 'slug', 'sourceType', 'tier', 'title', 'url',
  ]);
  for (const source of publicContent.sources) {
    for (const field of Object.keys(source)) {
      assert.ok(allowedSourceFields.has(field), `public source serialized non-citation field: ${field}`);
    }
  }
  const factsheetSource = publicContent.sources.find((source) => source.slug === 'pib-capacity-and-use-factsheet-2026');
  assert.equal(factsheetSource?.publicationDate, '2026-08-13', 'flagship source publication date must survive the public API');
  assert.equal(factsheetSource?.tier, 1, 'flagship source tier must survive the public API');
  assert.equal(factsheetSource?.evidenceType, 'full-page', 'flagship evidence type must survive the public API');
  assert.ok(factsheetSource?.scopeNote, 'flagship source scope note must survive the public API');

  const existingStories = publicContent.stories.filter(
    (story) => !Object.values(slugs).includes(story.slug),
  );
  const authorStory = existingStories.find((story) =>
    (story.authorType === 'person' && publicContent.authors.some((author) => author.slug === story.author)) ||
    (story.authorType === 'organization' && story.author === 'global-ai-news-editorial-desk'),
  );
  const oneSourceStory = existingStories.find(
    (story) => story.sources.filter((slug) =>
      publicContent.sources.some((source) => source.slug === slug),
    ).length === 1,
  );
  const multiSourceStory = existingStories.find(
    (story) => story.sources.filter((slug) =>
      publicContent.sources.some((source) => source.slug === slug),
    ).length >= 2,
  );
  const relatedStory = existingStories.find((story) =>
    story.relatedStories.some((slug) =>
      existingStories.some((candidate) => candidate.slug === slug),
    ),
  );
  assert.ok(authorStory, 'public snapshot needs a published article with a verified-person or desk byline for the route matrix');
  assert.ok(oneSourceStory, 'public snapshot needs a published article with one source');
  assert.ok(multiSourceStory, 'public snapshot needs a published article with multiple sources');
  assert.ok(relatedStory, 'public snapshot needs a published article with a related story');

  const preRenderedStory = existingStories.find((candidate) =>
    existsSync(path.join(webDist, 'public', 'article', candidate.slug, 'index.html')),
  );
  assert.ok(preRenderedStory, 'publication build must include at least one pre-rendered article fixture');
  const preRenderedPath = path.join(
    webDist,
    'public',
    'article',
    preRenderedStory.slug,
    'index.html',
  );
  const preRenderedHtml = readFileSync(preRenderedPath, 'utf8');
  const preRenderedResponse = await getArticle(preRenderedStory.slug);
  assert.equal(preRenderedResponse.status, 200);
  assert.equal(
    metaValue(preRenderedHtml, 'og:image'),
    `https://www.globalainews.in/social/articles/${preRenderedStory.slug}.png`,
    'existing pre-rendered article image URLs must remain unchanged',
  );
  assert.ok(
    existsSync(path.join(webDist, 'public', 'social', 'articles', `${preRenderedStory.slug}.png`)),
    'existing pre-rendered article image must remain available',
  );
  assert.equal(
    await preRenderedResponse.text(),
    preRenderedHtml,
    'existing pre-rendered article metadata and content must remain unchanged',
  );
  const devPreRenderedResponse = await getArticleFrom(devWebOrigin, preRenderedStory.slug);
  assert.equal(devPreRenderedResponse.status, 200);
  assert.equal(
    await devPreRenderedResponse.text(),
    preRenderedHtml,
    'Vite development must preserve existing pre-rendered article metadata and content unchanged',
  );

  const canonical = `https://www.globalainews.in/article/${slugs.published}/`;
  const response = await getArticle(slugs.published);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(html, /<h1[^>]*>A live article renders before browser scripts run<\/h1>/);
  assert.match(html, /By <strong class="font-semibold">Global AI News Editorial Desk<\/strong>/);
  assert.match(html, /The Global AI News Editorial Desk publishes source-linked reporting, analysis, research and reference material/);
  assert.match(html, /The temporary newsroom article contains enough editorial copy/);
  assert.match(html, /id="global-ai-prerender"/);
  assert.equal(
    html.match(/<title>([\s\S]*?)<\/title>/i)?.[1],
    `${publishedTitle} — Global AI News`,
  );
  assert.doesNotMatch(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '', /Global AI News\s+[—|]\s+Global AI News/i);
  assert.equal(metaValue(html, 'description', 'name'), publishedDek);
  assert.equal(
    html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0],
    `<link rel="canonical" href="${canonical}" />`,
  );
  assert.equal(metaValue(html, 'og:title'), `${publishedTitle} — Global AI News`);
  assert.equal(metaValue(html, 'og:description'), publishedDek);
  assert.equal(metaValue(html, 'og:url'), canonical);
  assert.equal(metaValue(html, 'og:type'), 'article');
  assert.equal(metaValue(html, 'og:site_name'), 'Global AI News');
  const dynamicImagePath = `/api/newsroom/social/articles/${slugs.published}.png`;
  assert.equal(
    metaValue(html, 'og:image'),
    `https://www.globalainews.in${dynamicImagePath}`,
  );
  assert.equal(metaValue(html, 'twitter:card', 'name'), 'summary_large_image');
  assert.equal(metaValue(html, 'twitter:title', 'name'), `${publishedTitle} — Global AI News`);
  assert.equal(metaValue(html, 'twitter:description', 'name'), publishedDek);
  assert.equal(
    metaValue(html, 'twitter:image', 'name'),
    `https://www.globalainews.in${dynamicImagePath}`,
  );
  assert.ok(existsSync(path.join(webDist, 'public', 'social', 'global-ai-news-default.png')));

  const devResponse = await getArticleFrom(devWebOrigin, slugs.published);
  const devHtml = await devResponse.text();
  assert.equal(devResponse.status, 200, 'Vite development must render the post-build article');
  assert.equal(devResponse.headers.get('cache-control'), 'no-store');
  assert.equal(
    devHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1],
    `${publishedTitle} — Global AI News`,
    'Vite development article title must come from the live API snapshot',
  );
  assert.equal(metaValue(devHtml, 'description', 'name'), publishedDek);
  assert.equal(
    devHtml.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0],
    `<link rel="canonical" href="${canonical}" />`,
  );
  assert.equal(metaValue(devHtml, 'og:title'), `${publishedTitle} — Global AI News`);
  assert.equal(metaValue(devHtml, 'og:description'), publishedDek);
  assert.equal(metaValue(devHtml, 'og:url'), canonical);
  assert.equal(metaValue(devHtml, 'og:type'), 'article');
  const devArticleSchema = articleJsonLd(devHtml)['@graph']
    .find((item) => item['@type'] === 'NewsArticle');
  assert.ok(devArticleSchema, 'Vite development first-response JSON-LD must contain a NewsArticle');
  assert.equal(devArticleSchema.headline, publishedTitle);
  assert.equal(devArticleSchema.description, publishedDek);
  assert.match(devHtml, new RegExp(`<h1[^>]*>${escapeRegExp(publishedTitle)}<\\/h1>`));
  assert.match(devHtml, /The temporary newsroom article contains enough editorial copy/);

  const story = publicContent.stories.find((candidate) => candidate.slug === slugs.published);
  assert.ok(story, 'newly published release is missing from the public newsroom snapshot');
  const socialImageResponse = await fetch(`${apiOrigin}${dynamicImagePath}`);
  assert.equal(socialImageResponse.status, 200, 'newly published story image must be publicly fetchable');
  assert.match(socialImageResponse.headers.get('content-type') ?? '', /^image\/png\b/i);
  assert.match(socialImageResponse.headers.get('cache-control') ?? '', /public/);
  const socialImage = Buffer.from(await socialImageResponse.arrayBuffer());
  assert.deepEqual(
    [...socialImage.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    'social preview endpoint must return a PNG image',
  );
  assert.equal(socialImage.readUInt32BE(16), 1200, 'social preview width must be 1200px');
  assert.equal(socialImage.readUInt32BE(20), 630, 'social preview height must be 630px');
  assert.ok(
    socialImage.includes(Buffer.from(`${publishedTitle} — Global AI News`)),
    'social preview PNG must include its story-specific title metadata',
  );
  const unpublishedSocialImageResponse = await fetch(
    `${apiOrigin}/api/newsroom/social/articles/${slugs.scheduled}.png`,
  );
  assert.equal(unpublishedSocialImageResponse.status, 404, 'scheduled story image must not be public');
  const ampLinkTag = html.match(/<link\b[^>]*\brel=["']amphtml["'][^>]*>/i)?.[0];
  assert.ok(ampLinkTag, 'newly published article is missing its AMP link');
  const ampHref = htmlAttribute(ampLinkTag, 'href');
  assert.ok(ampHref, 'newly published article AMP link has no href');
  const ampPath = new URL(ampHref, 'https://www.globalainews.in').pathname;
  assert.equal(ampPath, `/amp/article/${story.slug}/`, 'new article AMP link must be derived from its own slug');
  const ampResponse = await fetch(`${webOrigin}${ampPath}`);
  const ampHtml = await ampResponse.text();
  assert.equal(ampResponse.status, 200, 'newly published article AMP route must resolve after the build snapshot');
  const ampCanonicalTag = ampHtml.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  assert.equal(
    htmlAttribute(ampCanonicalTag, 'href'),
    `https://www.globalainews.in/article/${story.slug}/`,
  );
  assert.equal(ampHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1], story.title);
  assert.equal(ampHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1], story.title);

  const publicAuthor = publicContent.authors.find((author) => author.slug === story.author);
  const hasVerifiedPublicAuthor = publicAuthor?.verifiedForPublication === true;
  if (hasVerifiedPublicAuthor) {
    assert.match(
      html,
      new RegExp(`<a href="/person/${escapeRegExp(story.author)}/"[^>]*>`),
    );
  } else {
    assert.equal(story.author, 'global-ai-news-editorial-desk');
    assert.equal(story.authorType, 'organization');
    assert.equal(story.authorName, 'Global AI News Editorial Desk');
    assert.match(html, /By <strong class="font-semibold">Global AI News Editorial Desk<\/strong>/);
    assert.match(html, /The Global AI News Editorial Desk publishes source-linked reporting, analysis, research and reference material/);
    assert.doesNotMatch(html, new RegExp(`href="/person/${escapeRegExp(story.author)}/"`));
    assert.match(ampHtml, /<div class="byline"><strong>Global AI News Editorial Desk<\/strong>/);
    assert.match(ampHtml, /<span class="byline-description">The Global AI News Editorial Desk publishes source-linked reporting/);
  }
  assert.match(html, /Published <time\b/i);
  const publishedTime = html.match(/<time\b[^>]*datetime=["']([^"']+)["'][^>]*>([\s\S]*?)<\/time>/i);
  assert.equal(publishedTime?.[1], story.date);
  assert.ok(publishedTime?.[2]?.trim(), 'publication date must be visible in human-readable form');
  assert.notEqual(publishedTime?.[2]?.trim(), story.date);
  assert.equal(metaValue(html, 'article:published_time'), story.date);

  const structuredData = articleJsonLd(html);
  const graph = structuredData['@graph'];
  const articleSchema = graph.find((item) => item['@type'] === 'NewsArticle');
  assert.ok(articleSchema, 'first-response JSON-LD must contain a NewsArticle');
  assert.equal(articleSchema.headline, story.title);
  assert.equal(articleSchema.description, publishedDek);
  assert.equal(articleSchema.datePublished, story.date);
  assert.equal(articleSchema.mainEntityOfPage['@id'], canonical);
  assert.equal(
    articleSchema.author.name,
    hasVerifiedPublicAuthor ? publicAuthor.name : 'Global AI News Editorial Desk',
  );
  assert.equal(
    articleSchema.author.url,
    hasVerifiedPublicAuthor
      ? `https://www.globalainews.in/person/${story.author}/`
      : 'https://www.globalainews.in',
  );
  assert.equal(articleSchema.publisher.name, 'Global AI News');
  assert.equal(Object.hasOwn(articleSchema, 'dateModified'), false);
  assert.doesNotMatch(html, /property="article:modified_time"/);
  assert.ok(graph.some((item) => item['@type'] === 'BreadcrumbList'));

  const crawlerResponse = await getArticle(
    slugs.published,
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  );
  const crawlerHtml = await crawlerResponse.text();
  assert.equal(crawlerResponse.status, 200);
  assert.deepEqual(seoFingerprint(crawlerHtml), seoFingerprint(html));

  const missingAuthor = await getArticle(slugs.missingAuthor);
  const missingAuthorHtml = await missingAuthor.text();
  assert.equal(missingAuthor.status, 200);
  assert.equal(
    publicContent.authors.some((author) => author.slug === 'unlisted-fixture-author'),
    false,
  );
  assert.match(
    missingAuthorHtml,
    /By <strong class="font-semibold">Global AI News Editorial Desk<\/strong>/,
  );
  assert.doesNotMatch(missingAuthorHtml, /href="\/person\/unlisted-fixture-author\//);
  assert.doesNotMatch(missingAuthorHtml, new RegExp(escapeRegExp('unlisted-fixture-author')));
  const missingAuthorSchema = articleJsonLd(missingAuthorHtml)['@graph']
    .find((item) => item['@type'] === 'NewsArticle');
  assert.equal(missingAuthorSchema.author['@type'], 'Organization');
  assert.equal(missingAuthorSchema.author.name, 'Global AI News Editorial Desk');

  for (const candidate of [authorStory, oneSourceStory, multiSourceStory, relatedStory]) {
    const articleResponse = await getArticle(candidate.slug);
    const articleHtml = await articleResponse.text();
    assert.equal(articleResponse.status, 200, `${candidate.slug} should be publicly rendered`);
    assert.match(articleHtml, /<h1[^>]*>/, `${candidate.slug} must have a visible first-response H1`);
    assert.match(articleHtml, /Published <time\b/i, `${candidate.slug} must have a visible publication date`);
    const articleSchema = articleJsonLd(articleHtml)['@graph']
      .find((item) => item['@type'] === 'NewsArticle');
    assert.equal(articleSchema.headline, candidate.title);
    assert.equal(articleSchema.datePublished, candidate.date);
  }

  const oneSourceResponse = await getArticle(oneSourceStory.slug);
  const oneSourceHtml = await oneSourceResponse.text();
  const oneSourceSection = oneSourceHtml.match(/<section[^>]*data-testid="article-sources"[\s\S]*?<\/section>/i)?.[0];
  assert.ok(oneSourceSection);
  assert.equal((oneSourceSection.match(/<li\b/g) ?? []).length, 1);

  const multiSourceResponse = await getArticle(multiSourceStory.slug);
  const multiSourceHtml = await multiSourceResponse.text();
  const multiSourceSection = multiSourceHtml.match(/<section[^>]*data-testid="article-sources"[\s\S]*?<\/section>/i)?.[0];
  assert.ok(multiSourceSection);
  assert.ok((multiSourceSection.match(/<li\b/g) ?? []).length >= 2);

  const relatedResponse = await getArticle(relatedStory.slug);
  const relatedHtml = await relatedResponse.text();
  assert.match(relatedHtml, /<h2[^>]*>Next stories<\/h2>/);

  await assertHiddenArticleResponses(webOrigin, 'production');
  await assertHiddenArticleResponses(devWebOrigin, 'Vite development');
  await assertMalformedArticleResponses(webOrigin, 'production');
  await assertMalformedArticleResponses(devWebOrigin, 'Vite development');
  const unknownAmpResponse = await fetch(`${webOrigin}/amp/article/missing-article-${fixtureToken}/`);
  const unknownAmpHtml = await unknownAmpResponse.text();
  assert.equal(unknownAmpResponse.status, 404, 'unknown AMP article must return HTTP 404');
  assert.equal(unknownAmpResponse.headers.get('x-robots-tag'), 'noindex');
  assert.doesNotMatch(unknownAmpHtml, new RegExp(`<h1[^>]*>${escapeRegExp(story.title)}</h1>`));
  await assertPublishedOnlyFeeds();
}

async function main() {
  if (!existsSync(apiDist)) throw new Error(`API server build is missing: ${apiDist}`);
  if (!existsSync(webServer)) throw new Error(`Web server build is missing: ${webServer}`);
  if (!existsSync(path.join(webDist, 'public', 'social', 'global-ai-news-default.png'))) {
    throw new Error('Default social image is missing; run build:production first.');
  }

  try {
    await startApi();
    const publishedAt = new Date(Date.now() - 120_000).toISOString();
    const futureAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await createRelease(slugs.published, publishedTitle, publishedAt);
    await createRelease(
      slugs.missingAuthor,
      missingAuthorTitle,
      publishedAt,
      'unlisted-fixture-author',
      'person',
    );
    for (const fixture of privateStoryFixtures) {
      const publishAt = fixture.slug === slugs.scheduled ? futureAt : publishedAt;
      await createRelease(
        fixture.slug,
        fixture.title,
        publishAt,
        'lena-hoff',
        undefined,
        fixture.body,
      );
    }
    await setReleaseStates();

    await startWeb();
    await startDevWeb();
    await testRawArticleResponses();
    await assertArticleFailureResponses();
    await assertContactAlias();
    process.stdout.write('PASS: article first-response raw HTML in production and Vite development, publication gates, and crawler parity\n');
  } finally {
    await Promise.all([
      stopProcess(failureDevWebProcess),
      stopProcess(failureWebProcess),
      stopProcess(devWebProcess),
      stopProcess(webProcess),
      stopProcess(apiProcess),
    ]);
    await stopApiFailureFixture();
    await cleanupFixtures();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});