import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile, spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';
import { once } from 'node:events';

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..', '..', '..');
const apiDist = path.join(root, 'artifacts', 'api-server', 'dist', 'index.mjs');
const actor = 'task-38-restart-check-editor';
const slug = `task-38-release-history-${process.pid}-${Date.now()}`;
const shortSlug = `task-85-short-release-${process.pid}-${Date.now()}`;
const legacySlug = `task-88-legacy-release-${process.pid}-${Date.now()}`;
const publishedSlug = `release-revalidation-${process.pid}-${Date.now()}`;
const sectionBoundarySlugs = [];
const title = 'Restart-safe newsroom history fixture';
const publishAt = '2042-04-05T06:07:08.000Z';
const shortCopy = 'This copy is intentionally too short to enter the newsroom release queue.';
const longCopy = Array(90)
  .fill('Editorial evidence remains visible in the working copy before the release enters the public newsroom.')
  .join(' ');
const port = await findFreePort();
const apiOrigin = `http://127.0.0.1:${port}`;
const testEditorHeader = { 'x-newsroom-test-editor': actor };

let apiProcess;

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

async function stopApi() {
  if (!apiProcess?.pid) return;
  const processHandle = apiProcess;
  apiProcess = undefined;
  terminate(processHandle);
  await Promise.race([
    once(processHandle, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
}

async function waitForHealth() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${apiOrigin}/api/healthz`);
      if (response.ok) return;
    } catch {
      // The API process may still be starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`The API did not become ready at ${apiOrigin}/api/healthz.`);
}

async function startApi() {
  apiProcess = spawn('node', [apiDist], {
    cwd: root,
    detached: true,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      NEWSROOM_TEST_EDITOR_ID: actor,
      PORT: String(port),
    },
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  await waitForHealth();
}

async function requestJson(route, options = {}) {
  const response = await fetch(`${apiOrigin}${route}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...testEditorHeader,
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json();
  assert.ok(response.ok, `${options.method ?? 'GET'} ${route} failed: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function requestJsonAllowingError(route, options = {}) {
  const response = await fetch(`${apiOrigin}${route}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  });
  return { response, body: await response.json() };
}

async function assertShortReleaseRejected(route, options, label) {
  const { response, body } = await requestJsonAllowingError(route, options);
  assert.equal(response.status, 422, `${label} should reject short release copy`);
  assert.match(
    body.error,
    /editorial words before it can enter the queue/i,
    `${label} should explain why publication is blocked`,
  );
}

async function assertSectionWordCountBoundaries() {
  const cases = [
    ['Brief', 119, false], ['Brief', 120, true], ['Brief', 220, true], ['Brief', 221, false],
    ['Research', 799, false], ['Research', 800, true], ['Data', 799, false], ['Data', 800, true],
  ];
  for (const [section, totalWords, expected] of cases) {
    const fixtureSlug = `word-limit-${section.toLowerCase()}-${totalWords}-${process.pid}-${Date.now()}`;
    const { response, body } = await requestJsonAllowingError('/api/newsroom/releases', {
      method: 'POST',
      headers: testEditorHeader,
      body: JSON.stringify({
        slug: fixtureSlug,
        title: `${section} word limit boundary ${totalWords}`,
        dek: 'dek',
        publishAt,
        cadence: 'daily',
        category: 'Field Notes',
        author: 'global-ai-news',
        body: Array(totalWords - 1).fill('copy').join(' '),
        section,
      }),
    });
    if (expected) {
      assert.ok(response.ok, `${section} at ${totalWords} words should be accepted: ${body.error ?? response.status}`);
      assert.equal(body.wordCount, totalWords);
      assert.equal(body.publishable, true);
      sectionBoundarySlugs.push(fixtureSlug);
    } else {
      assert.equal(response.status, 422, `${section} at ${totalWords} words should be rejected`);
    }
  }
}

async function markAsLegacyShortRelease(story) {
  const legacyStory = {
    ...story,
    slug: legacySlug,
    title: 'Legacy short release should stay private',
    dek: shortCopy,
    body: [{ heading: 'The signal', paragraphs: [shortCopy] }],
    bottomLine: longCopy,
    whyItMatters: longCopy,
    keyTakeaways: [longCopy, longCopy, longCopy],
    whatChanges: longCopy,
  };
  delete legacyStory.editorialSource;
  const mutationScript = `
    import { eq } from "drizzle-orm";
    import { db, pool, editorialReleasesTable } from "@workspace/db";
    (async () => {
      await db
        .update(editorialReleasesTable)
        .set({
          publishAt: new Date("2000-01-01T00:00:00.000Z"),
          story: JSON.parse(process.env.LEGACY_STORY_JSON),
        })
        .where(eq(editorialReleasesTable.slug, process.env.LEGACY_RELEASE_SLUG));
      await pool.end();
    })().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  `;
  await execFileAsync(
    'pnpm',
    ['--filter', '@workspace/db', 'exec', 'tsx', '--eval', mutationScript],
    {
      cwd: root,
      env: {
        ...process.env,
        LEGACY_RELEASE_SLUG: legacySlug,
        LEGACY_STORY_JSON: JSON.stringify(legacyStory),
      },
      maxBuffer: 2 * 1024 * 1024,
    },
  );
}

async function assertLegacyReleaseCannotPublish() {
  const releases = await requestJson('/api/newsroom/releases');
  const legacyRelease = releases.find((release) => release.slug === legacySlug);
  assert.ok(legacyRelease, 'the pre-marker legacy release fixture was not returned');
  assert.ok(legacyRelease.wordCount < 800, 'legacy release count must use only standfirst and body copy');
  assert.equal(legacyRelease.publishable, false, 'legacy short release must remain blocked');
  assert.equal(legacyRelease.status, 'scheduled', 'legacy short release must not become published after its due time');

  const maintainedRelease = releases.find((release) => release.slug === 'weekly-deep-dive-cost-of-intelligence');
  assert.ok(maintainedRelease, 'the maintained scheduled snapshot was not returned');
  assert.ok(maintainedRelease.wordCount >= 800, 'maintained snapshot should use its complete story count');
  assert.equal(maintainedRelease.publishable, true, 'maintained scheduled snapshot should remain publishable');

  const content = await requestJson('/api/newsroom/content');
  assert.ok(
    !content.stories.some((story) => story.slug === legacySlug),
    'a due legacy short release must stay out of public content',
  );
}

async function assertPrivateRoutesRequireAuth() {
  const privateRoutes = [
    ['/api/newsroom/releases', 'GET'],
    ['/api/newsroom/releases/history', 'GET'],
    ['/api/newsroom/automation/status', 'GET'],
    ['/api/newsroom/automation/runs', 'GET'],
    ['/api/newsroom/automation/run', 'POST'],
  ];
  for (const [route, method] of privateRoutes) {
    const { response } = await requestJsonAllowingError(route, { method });
    assert.equal(response.status, 401, `unauthenticated ${method} ${route} must return 401`);
  }
}

async function assertPrivateRoutesRemainAvailableToEditors() {
  assert.ok(Array.isArray(await requestJson('/api/newsroom/releases')));
  assert.ok(Array.isArray(await requestJson('/api/newsroom/releases/history')));
  assert.equal(typeof (await requestJson('/api/newsroom/automation/status')).enabled, 'boolean');
  assert.ok(Array.isArray(await requestJson('/api/newsroom/automation/runs')));
}

async function assertPublicContentContract() {
  const response = await fetch(`${apiOrigin}/api/newsroom/content`);
  const content = await response.json();
  assert.ok(response.ok, `public newsroom content failed: ${response.status}`);
  assert.equal(Object.hasOwn(content, 'schedule'), false, 'public content must not include editorial schedule');
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/i);

  const allowedStoryFields = new Set([
    'slug', 'category', 'contentType', 'title', 'dek', 'body', 'date', 'dateModified', 'readTime',
    'author', 'authorType', 'authorName', 'evidence', 'evidenceSummary', 'classification', 'entities', 'timeline',
    'relatedStories', 'imageTreatment', 'topic', 'sources', 'bottomLine', 'whyItMatters',
    'keyTakeaways', 'whatChanges',
  ]);
  for (const story of content.stories) {
    for (const field of Object.keys(story)) {
      assert.ok(allowedStoryFields.has(field), `public story serialized non-public field: ${field}`);
    }
  }

  const metadata = await requestJson('/api/newsroom/metadata');
  const publishedArticlePaths = new Set(
    metadata.routes.filter((route) => route.article).map((route) => route.path),
  );
  assert.ok(
    content.stories.every((story) => publishedArticlePaths.has(`/article/${story.slug}`)),
    'public content must contain only stories represented as published article metadata',
  );
}

async function assertPublishedStoryFlowsThroughLivePublicSurfaces() {
  const title = 'Live release revalidation fixture';
  const publishAt = new Date(Date.now() - 120_000).toISOString();
  const created = await requestJson('/api/newsroom/releases', {
    method: 'POST',
    body: JSON.stringify({
      slug: publishedSlug,
      title,
      dek: 'A temporary test release verifies live reader surfaces without rebuilding the web artifact.',
      publishAt,
      cadence: 'daily',
      category: 'Field Notes',
      author: 'lena-hoff',
      body: longCopy,
    }),
  });
  assert.equal(created.slug, publishedSlug);
  assert.equal(created.publishable, true);

  const contentResponse = await fetch(`${apiOrigin}/api/newsroom/content`);
  const content = await contentResponse.json();
  assert.ok(contentResponse.ok, 'public newsroom content stopped serving after a release was published');
  assert.ok(content.stories.some((story) => story.slug === publishedSlug), 'published story did not appear in live reader content');
  assert.equal(contentResponse.headers.get('cache-control'), 'no-store', 'live reader content should not be cached after publication');

  const metadata = await requestJson('/api/newsroom/metadata');
  assert.ok(metadata.routes.some((route) => route.path === `/article/${publishedSlug}` && route.article), 'published article metadata did not refresh');

  const expectedUrl = `https://globalainews.in/article/${publishedSlug}/`;
  const sitemapResponse = await fetch(`${apiOrigin}/api/newsroom/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200, 'live API sitemap failed after publication');
  assert.ok(sitemap.includes(expectedUrl), 'live API sitemap did not include the new release');
  assert.match(sitemapResponse.headers.get('cache-control') ?? '', /max-age=60/, 'live API sitemap cache exceeds the release freshness interval');

  const feedResponse = await fetch(`${apiOrigin}/api/newsroom/feed.xml`);
  const feed = await feedResponse.text();
  assert.equal(feedResponse.status, 200, 'live API RSS failed after publication');
  assert.ok(feed.includes(expectedUrl), 'live API RSS did not include the new release');
  assert.match(feedResponse.headers.get('cache-control') ?? '', /max-age=60/, 'live API RSS cache exceeds the release freshness interval');
}

async function cleanupFixture() {
  const cleanupScript = `
    import { inArray } from "drizzle-orm";
    import { db, pool, editorialReleaseHistoryTable, editorialReleasesTable } from "@workspace/db";
    (async () => {
      const slugs = JSON.parse(process.env.RELEASE_HISTORY_FIXTURE_SLUGS);
      await db.delete(editorialReleaseHistoryTable).where(inArray(editorialReleaseHistoryTable.releaseSlug, slugs));
      await db.delete(editorialReleasesTable).where(inArray(editorialReleasesTable.slug, slugs));
      const [history] = await db.select({ id: editorialReleaseHistoryTable.id }).from(editorialReleaseHistoryTable).where(inArray(editorialReleaseHistoryTable.releaseSlug, slugs)).limit(1);
      const [release] = await db.select({ id: editorialReleasesTable.id }).from(editorialReleasesTable).where(inArray(editorialReleasesTable.slug, slugs)).limit(1);
      if (history || release) throw new Error("Release history fixture cleanup did not remove all rows.");
      await pool.end();
    })().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  `;
  await execFileAsync(
    'pnpm',
    ['--filter', '@workspace/db', 'exec', 'tsx', '--eval', cleanupScript],
    {
      cwd: root,
      env: {
        ...process.env,
        RELEASE_HISTORY_FIXTURE_SLUGS: JSON.stringify([slug, legacySlug, publishedSlug, ...sectionBoundarySlugs]),
      },
      maxBuffer: 2 * 1024 * 1024,
    },
  );
}

async function assertPersistedHistory(expectedId, startedAt) {
  const history = await requestJson('/api/newsroom/releases/history');
  const entry = history.find((candidate) => candidate.id === expectedId);
  assert.ok(entry, 'the created release history entry was not returned');
  assert.equal(entry.releaseSlug, slug);
  assert.equal(entry.releaseTitle, title);
  assert.equal(entry.actor, actor);
  assert.equal(entry.action, 'created');
  assert.equal(
    entry.summary,
    `Added “${title}” to the release queue for ${publishAt.replace('.000Z', 'Z')}.`,
  );
  const createdAt = Date.parse(entry.createdAt);
  assert.ok(Number.isFinite(createdAt), 'history timestamp is not a valid date');
  assert.ok(createdAt >= startedAt - 5_000, 'history timestamp predates the fixture creation');
  assert.ok(createdAt <= Date.now() + 5_000, 'history timestamp is in the future');
  return entry;
}

async function assertHistoryFilters() {
  const createdHistory = await requestJson(
    `/api/newsroom/releases/history?releaseSlug=${encodeURIComponent(slug)}&action=created`,
  );
  assert.equal(createdHistory.length, 1, 'release and action filters should isolate the created entry');
  assert.equal(createdHistory[0].releaseSlug, slug);
  assert.equal(createdHistory[0].action, 'created');

  const editedHistory = await requestJson(
    `/api/newsroom/releases/history?releaseSlug=${encodeURIComponent(slug)}&action=edited`,
  );
  assert.equal(editedHistory.length, 1, 'combined release and action filters should isolate the edited entry');
  assert.equal(editedHistory[0].releaseSlug, slug);
  assert.equal(editedHistory[0].action, 'edited');

  const releaseHistory = await requestJson(
    `/api/newsroom/releases/history?releaseSlug=${encodeURIComponent(slug)}`,
  );
  assert.ok(releaseHistory.length >= 2, 'release filter should return all matching change types');
  assert.ok(releaseHistory.every((entry) => entry.releaseSlug === slug), 'release filter returned another release');

  const actionHistory = await requestJson('/api/newsroom/releases/history?action=created');
  assert.ok(actionHistory.length >= 1, 'action filter should return created entries');
  assert.ok(actionHistory.every((entry) => entry.action === 'created'), 'action filter returned another change type');

  const unmatchedHistory = await requestJson(
    '/api/newsroom/releases/history?releaseSlug=missing-release-history-fixture',
  );
  assert.deepEqual(unmatchedHistory, [], 'an unmatched release filter should return an empty list');

  const invalidAction = await requestJsonAllowingError(
    '/api/newsroom/releases/history?action=not-a-real-action',
    { headers: testEditorHeader },
  );
  assert.equal(invalidAction.response.status, 400);
  assert.deepEqual(invalidAction.body, { error: 'Unknown release history action.' });
}

async function assertPublisherFilterContract() {
  const publisherSource = await readFile(
    path.join(root, 'artifacts', 'global-ai-news', 'src', 'pages', 'insights.tsx'),
    'utf8',
  );
  assert.match(
    publisherSource,
    /data-testid="select-release-history-release"[\s\S]*value=\{historyReleaseSlug\}[\s\S]*updateHistoryFilter\('releaseSlug', event\.target\.value\)/,
    'publisher workspace is missing the URL-backed release selector binding',
  );
  assert.match(
    publisherSource,
    /data-testid="select-release-history-action"[\s\S]*value=\{historyAction\}[\s\S]*updateHistoryFilter\('action', event\.target\.value\)/,
    'publisher workspace is missing the URL-backed change type selector binding',
  );
  assert.match(
    publisherSource,
    /data-testid="input-release-history-actor"[\s\S]*value=\{historyActor\}[\s\S]*updateHistoryFilter\('actor', event\.target\.value\)/,
    'publisher workspace is missing the URL-backed actor filter binding',
  );
  assert.match(
    publisherSource,
    /getGetNewsroomReleaseHistoryQueryKey\(historyFilters\)/,
    'publisher workspace is not keying history requests by both filters',
  );
  assert.match(
    publisherSource,
    /useGetNewsroomReleaseHistory\(historyFilters,\s*\{\s*query:/,
    'publisher workspace is not passing both filters to the history request',
  );
  assert.match(
    publisherSource,
    /new URLSearchParams\(location\.split\('\?'\)\[1\] \?\? ''\)/,
    'publisher workspace is not hydrating history filters from the URL',
  );
  assert.match(
    publisherSource,
    /setLocation\(`\$\{location\.split\('\?'\)\[0\] \|\| '\/insights'\}\$\{query \? `\?\$\{query\}` : ''\}`, \{ replace: true \}\)/,
    'publisher workspace is not replacing the URL when history filters change',
  );
  assert.match(
    publisherSource,
    /onClick=\{clearHistoryFilters\}/,
    'publisher workspace is missing URL-backed history filter clearing',
  );
  assert.match(
    publisherSource,
    /No matching release change was found for .*Clear a filter or try different values\./,
    'publisher workspace is missing the filtered-empty explanation',
  );
}

try {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for the release history persistence check.');
  }

  await execFileAsync('pnpm', ['--filter', '@workspace/api-server', 'run', 'build'], {
    cwd: root,
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });

  await startApi();
  await assertPrivateRoutesRequireAuth();
  await assertPrivateRoutesRemainAvailableToEditors();
  await assertPublicContentContract();
  await assertPublishedStoryFlowsThroughLivePublicSurfaces();
  await assertSectionWordCountBoundaries();
  await assertShortReleaseRejected(
    '/api/newsroom/releases',
    {
      method: 'POST',
      headers: testEditorHeader,
      body: JSON.stringify({
        slug: shortSlug,
        title: 'Short release should never be scheduled',
        dek: shortCopy,
        publishAt,
        cadence: 'daily',
        category: 'Field Notes',
        author: 'global-ai-news',
        body: shortCopy,
      }),
    },
    'create and schedule',
  );
  const startedAt = Date.now();
  const created = await requestJson('/api/newsroom/releases', {
    method: 'POST',
    headers: testEditorHeader,
    body: JSON.stringify({
      slug,
      title,
      dek: 'A temporary release used to prove audit history survives a process restart.',
      publishAt,
      cadence: 'daily',
      category: 'Field Notes',
      author: 'global-ai-news',
      body: longCopy,
    }),
  });
  assert.equal(created.slug, slug);
  assert.equal(created.publishable, true);
  assert.ok(created.wordCount >= 800);
  const legacyCreated = await requestJson('/api/newsroom/releases', {
    method: 'POST',
    headers: testEditorHeader,
    body: JSON.stringify({
      slug: legacySlug,
      title: 'Legacy short release should stay private',
      dek: 'Temporary copy for the legacy provenance regression fixture.',
      publishAt,
      cadence: 'daily',
      category: 'Field Notes',
      author: 'global-ai-news',
      body: longCopy,
    }),
  });
  await markAsLegacyShortRelease(legacyCreated.story);
  await assertLegacyReleaseCannotPublish();
  await assertShortReleaseRejected(
    `/api/newsroom/releases/${slug}`,
    {
      method: 'PATCH',
      headers: testEditorHeader,
      body: JSON.stringify({ body: shortCopy }),
    },
    'edit',
  );
  await assertShortReleaseRejected(
    `/api/newsroom/releases/${slug}`,
    {
      method: 'PATCH',
      headers: testEditorHeader,
      body: JSON.stringify({ body: shortCopy, publishAt: '2000-01-01T00:00:00.000Z' }),
    },
    'publish',
  );
  const initialHistory = await requestJson('/api/newsroom/releases/history');
  const initialEntry = initialHistory.find((entry) => entry.releaseSlug === slug);
  assert.ok(initialEntry, 'the created release history entry was not returned before restart');
  const beforeRestart = await assertPersistedHistory(initialEntry.id, startedAt);

  await requestJson(`/api/newsroom/releases/${slug}`, {
    method: 'PATCH',
    headers: testEditorHeader,
    body: JSON.stringify({ title: 'Edited restart-safe newsroom history fixture' }),
  });
  await assertHistoryFilters();
  await assertPublisherFilterContract();

  await stopApi();
  await startApi();
  const afterRestart = await assertPersistedHistory(beforeRestart.id, startedAt);
  assert.deepEqual(
    {
      actor: afterRestart.actor,
      action: afterRestart.action,
      summary: afterRestart.summary,
      createdAt: afterRestart.createdAt,
    },
    {
      actor: beforeRestart.actor,
      action: beforeRestart.action,
      summary: beforeRestart.summary,
      createdAt: beforeRestart.createdAt,
    },
  );
  console.log('Release history check confirmed actor, action, summary, and timestamp survive an API restart.');
} finally {
  await stopApi();
  await cleanupFixture();
}