import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
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
const missingAuthorTitle = 'A published story with no author record';
const longCopy = Array(120)
  .fill('The temporary newsroom article contains enough editorial copy to pass publication readiness and verify complete server-rendered article content.')
  .join(' ');
const testEditorHeader = { 'x-newsroom-test-editor': actor };
const storyPayload = {
  dek: publishedDek,
  cadence: 'daily',
  category: 'Field Notes',
  author: 'lena-hoff',
  body: longCopy,
};

let apiProcess;
let webProcess;
let apiOrigin;
let webOrigin;

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
  terminate(processHandle);
  await Promise.race([
    once(processHandle, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
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
  const port = await findFreePort();
  webOrigin = `http://127.0.0.1:${port}`;
  webProcess = spawn('node', [webServer], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      NEWSROOM_API_ORIGIN: apiOrigin,
      PORT: String(port),
    },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  await waitForHttp(`${webOrigin}/`, webProcess);
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

async function createRelease(slug, title, publishAt, author = 'lena-hoff') {
  const created = await requestApi('/api/newsroom/releases', {
    method: 'POST',
    body: JSON.stringify({
      ...storyPayload,
      slug,
      title,
      author,
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
  return fetch(`${webOrigin}/article/${slug}`, {
    headers: { 'user-agent': userAgent },
  });
}

async function assertNotPublic(slug, label) {
  const response = await getArticle(slug);
  const html = await response.text();
  assert.equal(response.status, 404, `${label} must return HTTP 404`);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  assert.match(html, /name="robots" content="noindex,follow"/i);
  assert.match(html, /<title>Article not found — Global AI News<\/title>/);
  assert.doesNotMatch(html, /<h1[^>]*>.*(?:draft|scheduled).*<\/h1>/i);
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
  assert.equal(response.status, 308, '/contact must redirect to the approved pending route');
  assert.equal(response.headers.get('location'), '/contact-us');

  for (const route of ['/about-us', '/code-of-ethics', '/corrections', '/contact-us']) {
    const destination = await fetch(`${webOrigin}${route}`);
    const html = await destination.text();
    assert.equal(destination.status, 200, `${route} must resolve to its pending page`);
    assert.equal(destination.headers.get('x-robots-tag'), 'noindex');
    assert.match(html, /name="robots" content="noindex,follow"/i);
    assert.match(html, /data-testid="editorial-input-required"/);
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
    ].sort(),
  );
  assert.equal(Object.hasOwn(publicContent, 'schedule'), false);
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
      assert.equal(forbiddenFields.has(key), false, `private newsroom field leaked at ${path}/${key}`);
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
  const citedSourceSlugs = new Set(publicContent.stories.flatMap((story) => story.sources));
  const returnedSourceSlugs = new Set(publicContent.sources.map((source) => source.slug));
  assert.deepEqual(
    [...returnedSourceSlugs].sort(),
    [...citedSourceSlugs].sort(),
    'public sources must be limited to sources cited by published articles',
  );
  for (const source of publicContent.sources) {
    assert.deepEqual(
      Object.keys(source).sort(),
      ['accessed', 'kind', 'name', 'publisher', 'slug', 'url'].sort(),
      'public source records must contain only citation fields',
    );
  }

  const existingStories = publicContent.stories.filter(
    (story) => !Object.values(slugs).includes(story.slug),
  );
  const authorStory = existingStories.find((story) =>
    publicContent.authors.some((author) => author.slug === story.author),
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
  assert.ok(authorStory, 'public snapshot needs a published article with an author for the route matrix');
  assert.ok(oneSourceStory, 'public snapshot needs a published article with one source');
  assert.ok(multiSourceStory, 'public snapshot needs a published article with multiple sources');
  assert.ok(relatedStory, 'public snapshot needs a published article with a related story');

  const canonical = `https://www.globalainews.in/article/${slugs.published}/`;
  const response = await getArticle(slugs.published);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(html, /<h1[^>]*>A live article renders before browser scripts run<\/h1>/);
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
  assert.equal(
    metaValue(html, 'og:image'),
    'https://www.globalainews.in/social/global-ai-news-default.png',
  );
  assert.equal(metaValue(html, 'twitter:card', 'name'), 'summary_large_image');
  assert.equal(metaValue(html, 'twitter:title', 'name'), `${publishedTitle} — Global AI News`);
  assert.equal(metaValue(html, 'twitter:description', 'name'), publishedDek);
  assert.equal(
    metaValue(html, 'twitter:image', 'name'),
    'https://www.globalainews.in/social/global-ai-news-default.png',
  );
  assert.ok(existsSync(path.join(webDist, 'public', 'social', 'global-ai-news-default.png')));

  const story = publicContent.stories.find((candidate) => candidate.slug === slugs.published);
  assert.ok(story, 'newly published release is missing from the public newsroom snapshot');
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

  assert.match(
    html,
    new RegExp(`<a href="/person/${escapeRegExp(story.author)}/"[^>]*>`),
  );
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
  assert.equal(articleSchema.author.name, publicContent.authors.find((author) => author.slug === story.author).name);
  assert.equal(articleSchema.author.url, `https://www.globalainews.in/person/${story.author}/`);
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
  assert.match(missingAuthorHtml, /Byline unavailable/);
  assert.doesNotMatch(missingAuthorHtml, new RegExp(escapeRegExp('unlisted-fixture-author')));
  const missingAuthorSchema = articleJsonLd(missingAuthorHtml)['@graph']
    .find((item) => item['@type'] === 'NewsArticle');
  assert.equal(Object.hasOwn(missingAuthorSchema, 'author'), false);

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

  await assertNotPublic(slugs.scheduled, 'future scheduled article');
  await assertNotPublic(slugs.draft, 'draft article');
  await assertNotPublic(slugs.canceled, 'canceled/unpublished article');
  await assertNotPublic(slugs.unpublished, 'unpublished article');
  await assertNotPublic(slugs.archived, 'archived article');
  await assertNotPublic(`missing-article-${fixtureToken}`, 'missing article');
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
    await createRelease(slugs.missingAuthor, missingAuthorTitle, publishedAt, 'unlisted-fixture-author');
    await createRelease(slugs.scheduled, 'A scheduled article fixture', futureAt);
    await createRelease(slugs.draft, 'A draft article fixture', publishedAt);
    await createRelease(slugs.canceled, 'A canceled article fixture', publishedAt);
    await createRelease(slugs.unpublished, 'An unpublished article fixture', publishedAt);
    await createRelease(slugs.archived, 'An archived article fixture', publishedAt);
    await setReleaseStates();

    await startWeb();
    await testRawArticleResponses();
    await assertContactAlias();
    process.stdout.write('PASS: article first-response raw HTML, publication gates, and crawler parity\n');
  } finally {
    await stopProcess(webProcess);
    await stopProcess(apiProcess);
    await cleanupFixtures();
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});