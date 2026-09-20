import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { once } from 'node:events';

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..', '..', '..');
const apiDist = path.join(root, 'artifacts', 'api-server', 'dist', 'index.mjs');
const actor = 'task-38-restart-check-editor';
const slug = `task-38-release-history-${process.pid}-${Date.now()}`;
const title = 'Restart-safe newsroom history fixture';
const publishAt = '2042-04-05T06:07:08.000Z';
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
      body: 'This fixture exists only for the restart persistence check.',
    }),
  });
  assert.equal(created.slug, slug);
  const initialHistory = await requestJson('/api/newsroom/releases/history');
  const initialEntry = initialHistory.find((entry) => entry.releaseSlug === slug);
  assert.ok(initialEntry, 'the created release history entry was not returned before restart');
  const beforeRestart = await assertPersistedHistory(initialEntry.id, startedAt);

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