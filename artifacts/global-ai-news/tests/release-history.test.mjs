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
    /at least 800 editorial words before it can enter the queue/i,
    `${label} should explain why publication is blocked`,
  );
}

async function cleanupFixture() {
  const cleanupScript = `
    import { eq } from "drizzle-orm";
    import { db, pool, editorialReleaseHistoryTable, editorialReleasesTable } from "@workspace/db";
    (async () => {
      const slug = process.env.RELEASE_HISTORY_FIXTURE_SLUG;
      await db.delete(editorialReleaseHistoryTable).where(eq(editorialReleaseHistoryTable.releaseSlug, slug));
      await db.delete(editorialReleasesTable).where(eq(editorialReleasesTable.slug, slug));
      const [history] = await db.select({ id: editorialReleaseHistoryTable.id }).from(editorialReleaseHistoryTable).where(eq(editorialReleaseHistoryTable.releaseSlug, slug)).limit(1);
      const [release] = await db.select({ id: editorialReleasesTable.id }).from(editorialReleasesTable).where(eq(editorialReleasesTable.slug, slug)).limit(1);
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
      env: { ...process.env, RELEASE_HISTORY_FIXTURE_SLUG: slug },
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
  );
  assert.equal(invalidAction.response.status, 400);
  assert.deepEqual(invalidAction.body, { error: 'Unknown release history action.' });
}

async function assertPublisherFilterContract() {
  const publisherSource = await readFile(
    path.join(root, 'artifacts', 'global-ai-news', 'src', 'pages', 'public.tsx'),
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