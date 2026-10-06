import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import test from 'node:test';

import {
  authors,
  askGlobalAnswers,
  entities,
  essays,
  evidenceSummaries,
  industryMap,
  indiaIndex,
  signals,
  sources,
  stories,
  timelineEvents,
  type NewsroomContentSnapshot,
} from '../src/content.ts';
import {
  NewsroomSnapshotFetchError,
  fetchNewsroomContentSnapshot,
} from '../src/server/article-html.tsx';
import {
  dataProductRecords,
  researchRecords,
  topicRecords,
} from '../src/authority/registry.ts';

const article = stories[0];
if (!article) throw new Error('A maintained story is required for snapshot resilience tests.');

const snapshot: NewsroomContentSnapshot & {
  generatedAt: string;
  source: string;
  stale: boolean;
} = {
  generatedAt: new Date().toISOString(),
  source: 'maintained-editorial-source',
  stale: false,
  authors,
  sources,
  evidenceSummaries,
  entities,
  timelineEvents,
  stories: [article],
  researchRecords,
  dataProducts: dataProductRecords,
  topics: topicRecords,
  authorityEdges: [],
  signals,
  industryMap,
  indiaIndex,
  essays,
  askGlobalAnswers,
};

async function startSnapshotServer(
  responder: (
    request: import('node:http').IncomingMessage,
    response: import('node:http').ServerResponse,
  ) => void,
): Promise<{ server: Server; origin: string }> {
  const server = createServer((request, response) => responder(request, response));
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('The test newsroom server did not receive a TCP address.');
  }
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test('fresh public snapshots are cached and a timed-out refresh serves the last known good copy', async (context) => {
  let requestCount = 0;
  let slow = false;
  const { server, origin } = await startSnapshotServer((_request, response) => {
    requestCount += 1;
    if (slow) {
      setTimeout(() => {
        if (response.destroyed) return;
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify(snapshot));
      }, 250);
      return;
    }
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(snapshot));
  });
  context.after(() => closeServer(server));

  const events: Array<Record<string, unknown>> = [];
  const first = await fetchNewsroomContentSnapshot(origin, {
    requestId: '0d7db26b-690d-4ee5-805a-98e4e1fa63ac',
    timeoutMs: 500,
    onEvent: (event) => events.push(event),
  });
  const fresh = await fetchNewsroomContentSnapshot(origin, {
    requestId: '9df47364-7411-4c28-b211-526143a8ed74',
    timeoutMs: 500,
    onEvent: (event) => events.push(event),
  });

  assert.equal(first.stories[0]?.slug, article.slug);
  assert.equal(fresh.stories[0]?.slug, article.slug);
  assert.equal(requestCount, 1, 'a fresh public snapshot should avoid another API call');
  assert.ok(events.some((event) => event.phase === 'snapshot_cache_hit'));

  await new Promise((resolve) => setTimeout(resolve, 1_050));
  slow = true;
  const stale = await fetchNewsroomContentSnapshot(origin, {
    requestId: '70f6ce2e-13b3-4585-bbab-8038f8ea80a5',
    timeoutMs: 40,
    onEvent: (event) => events.push(event),
  });

  assert.equal(stale.stories[0]?.slug, article.slug);
  assert.ok(
    events.some((event) => event.phase === 'snapshot_fetch_failed' && event.failureCode === 'timeout'),
  );
  assert.ok(
    events.some((event) => event.phase === 'snapshot_last_known_good_fallback'),
  );
  assert.ok(
    events.every((event) => !('bodyBytes' in event) && !('storyCount' in event)),
    'snapshot diagnostics must not expose payload size or editorial record counts',
  );
});

test('request correlation IDs are forwarded to the public content API', async (context) => {
  const requestIds: string[] = [];
  const requestId = 'f8d39123-4800-4f79-ae01-1f0f5c27d8e4';
  const { server, origin } = await startSnapshotServer((request, response) => {
    const forwardedId = request.headers['x-gan-request-id'];
    if (typeof forwardedId === 'string') requestIds.push(forwardedId);
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(snapshot));
  });
  context.after(() => closeServer(server));

  await fetchNewsroomContentSnapshot(origin, { requestId, timeoutMs: 500 });

  assert.deepEqual(requestIds, [requestId]);
});

test('a cold renderer fails explicitly when no safe public snapshot exists', async (context) => {
  const { server, origin } = await startSnapshotServer((_request, response) => {
    setTimeout(() => {
      if (response.destroyed) return;
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify(snapshot));
    }, 250);
  });
  context.after(() => closeServer(server));

  await assert.rejects(
    fetchNewsroomContentSnapshot(origin, { timeoutMs: 40 }),
    (error: unknown) =>
      error instanceof NewsroomSnapshotFetchError && error.code === 'timeout',
  );
});

test('a delayed response below the timeout is accepted and measured', async (context) => {
  const { server, origin } = await startSnapshotServer((_request, response) => {
    setTimeout(() => {
      if (response.destroyed) return;
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify(snapshot));
    }, 80);
  });
  context.after(() => closeServer(server));

  const events: Array<Record<string, unknown>> = [];
  const result = await fetchNewsroomContentSnapshot(origin, {
    requestId: '42daaf56-3988-47eb-9461-63e40244fe2f',
    timeoutMs: 1_000,
    onEvent: (event) => events.push(event),
  });

  assert.equal(result.stories[0]?.slug, article.slug);
  assert.ok(
    events.some(
      (event) => event.phase === 'snapshot_fetch_headers' && event.statusCode === 200,
    ),
  );
  assert.ok(
    events.some(
      (event) => event.phase === 'snapshot_validated' && typeof event.jsonParseMs === 'number',
    ),
  );
});

test('upstream HTTP failures are classified and never treated as a valid snapshot', async (context) => {
  const { server, origin } = await startSnapshotServer((_request, response) => {
    response.writeHead(503, { 'content-type': 'application/json' });
    response.end('{"error":"temporarily unavailable"}');
  });
  context.after(() => closeServer(server));

  await assert.rejects(
    fetchNewsroomContentSnapshot(origin, { timeoutMs: 500 }),
    (error: unknown) =>
      error instanceof NewsroomSnapshotFetchError &&
      error.code === 'http_status' &&
      error.upstreamStatus === 503,
  );
});

test('a network-unavailable API fails explicitly without a safe cached snapshot', async () => {
  const { server, origin } = await startSnapshotServer(() => {});
  await closeServer(server);

  await assert.rejects(
    fetchNewsroomContentSnapshot(origin, { timeoutMs: 500 }),
    (error: unknown) =>
      error instanceof NewsroomSnapshotFetchError && error.code === 'fetch_failed',
  );
});

test('malformed and structurally invalid API snapshots are rejected before caching', async (context) => {
  const invalidPayloads = [
    { body: '{"stories":', expectedCode: 'invalid_json' },
    { body: JSON.stringify({ ...snapshot, stories: 'not-an-array' }), expectedCode: 'invalid_snapshot' },
  ];

  for (const [index, payload] of invalidPayloads.entries()) {
    const { server, origin } = await startSnapshotServer((_request, response) => {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(payload.body);
    });
    context.after(() => closeServer(server));

    await assert.rejects(
      fetchNewsroomContentSnapshot(origin, { timeoutMs: 500 }),
      (error: unknown) =>
        error instanceof NewsroomSnapshotFetchError && error.code === payload.expectedCode,
      `payload ${index + 1} should fail with ${payload.expectedCode}`,
    );
  }
});
