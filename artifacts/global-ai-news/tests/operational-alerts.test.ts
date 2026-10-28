import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  checkNewsroomApiHealth,
  OperationalAlertManager,
} from '../src/server/operational-alerts';

function createHarness(
  now = 1_800_000_000_000,
  options: { fetcher?: typeof fetch } = {},
) {
  const deliveries: Array<{ url: string | URL | Request; body: string }> = [];
  const logs: Array<{ event: string; fields: Record<string, unknown> }> = [];
  const backoffDelays: number[] = [];
  let currentNow = now;
  const fetcher: typeof fetch = async (input, init) => {
    deliveries.push({ url: input, body: String(init?.body ?? '') });
    if (options.fetcher) return options.fetcher(input, init);
    return new Response(null, { status: 204 });
  };
  const alerts = new OperationalAlertManager({
    webhookUrl: 'https://alerts.example.test/secret-path',
    fetcher,
    now: () => currentNow,
    sleep: async (milliseconds) => {
      backoffDelays.push(milliseconds);
    },
    log: (event, fields) => logs.push({ event, fields }),
  });
  return {
    alerts,
    deliveries,
    logs,
    backoffDelays,
    setNow: (value: number) => {
      currentNow = value;
    },
  };
}

test('API health alerts only after three consecutive failures and resets on recovery', async () => {
  const { alerts, deliveries } = createHarness();
  await alerts.recordApiHealthFailure('health-check-1');
  await alerts.recordApiHealthFailure('health-check-2');
  assert.equal(deliveries.length, 0);
  await alerts.recordApiHealthFailure('health-check-3');
  assert.equal(deliveries.length, 1);

  const first = JSON.parse(deliveries[0].body);
  assert.equal(first.alert.event, 'api_health_degraded');
  assert.equal(first.alert.route, '/api/healthz');
  assert.equal(first.alert.requestId, 'health-check-3');

  alerts.recordApiHealthSuccess();
  await alerts.recordApiHealthFailure('health-check-4');
  await alerts.recordApiHealthFailure('health-check-5');
  assert.equal(deliveries.length, 1, 'cooldown suppresses duplicate outage notifications');
});

test('article failures alert at threshold with route reference and no private content', async () => {
  const { alerts, deliveries } = createHarness();
  for (let index = 1; index <= 4; index += 1) {
    await alerts.recordArticleRenderFailure(`/article/story-${index}`, `render-${index}`);
  }
  assert.equal(deliveries.length, 0);
  await alerts.recordArticleRenderFailure('/article/story-5', 'render-5');
  assert.equal(deliveries.length, 1);

  const encoded = deliveries[0].body;
  const payload = JSON.parse(encoded);
  assert.equal(payload.alert.event, 'article_render_failures');
  assert.equal(payload.alert.route, '/article/story-5');
  assert.equal(payload.alert.requestId, 'render-5');
  assert.equal(payload.alert.failuresInWindow, 5);
  assert.doesNotMatch(encoded, /story body|private editor|user input|password|secret/i);
  assert.equal(Object.hasOwn(payload.alert, 'error'), false);
  assert.equal(Object.hasOwn(payload.alert, 'body'), false);

  const unsafeHarness = createHarness();
  for (let index = 0; index < 5; index += 1) {
    await unsafeHarness.alerts.recordArticleRenderFailure(
      '/article/story?token=user-input',
      `safe-reference-${index}`,
    );
  }
  assert.equal(JSON.parse(unsafeHarness.deliveries[0].body).alert.route, '/unknown');
  assert.doesNotMatch(unsafeHarness.deliveries[0].body, /token=user-input/);
});

test('health probe alerts on unhealthy API responses without forwarding response content', async () => {
  let calls = 0;
  const { alerts, deliveries } = createHarness();
  const fetcher: typeof fetch = async () => {
    calls += 1;
    return new Response(JSON.stringify({ status: 'down', private: 'not for alert' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  };
  await Promise.all([
    checkNewsroomApiHealth('https://news.example.test', alerts, fetcher),
    checkNewsroomApiHealth('https://news.example.test', alerts, fetcher),
    checkNewsroomApiHealth('https://news.example.test', alerts, fetcher),
  ]);
  assert.equal(calls, 3);
  assert.equal(deliveries.length, 1);
  assert.doesNotMatch(deliveries[0].body, /not for alert|private/);
  assert.match(deliveries[0].body, /health-check|api_health_degraded/);
});

test('temporary webhook failures retry with bounded backoff and sanitized logs', async () => {
  let calls = 0;
  const { alerts, deliveries, logs, backoffDelays } = createHarness(undefined, {
    fetcher: async () => {
      calls += 1;
      if (calls === 1) return new Response(null, { status: 503 });
      if (calls === 2) throw new Error('private payload and secret-path details');
      return new Response(null, { status: 204 });
    },
  });

  for (let index = 0; index < 3; index += 1) {
    await alerts.recordApiHealthFailure(`health-retry-${index}`);
  }

  assert.equal(calls, 3);
  assert.deepEqual(backoffDelays, [100, 300]);
  assert.equal(deliveries.length, 3);
  assert.equal(new Set(deliveries.map(({ body }) => body)).size, 1);
  assert.equal(logs.length, 2);
  assert.deepEqual(
    logs.map(({ fields }) => ({
      attempt: fields.attempt,
      maxAttempts: fields.maxAttempts,
      statusCode: fields.statusCode,
      willRetry: fields.willRetry,
    })),
    [
      { attempt: 1, maxAttempts: 3, statusCode: 503, willRetry: true },
      { attempt: 2, maxAttempts: 3, statusCode: undefined, willRetry: true },
    ],
  );
  assert.doesNotMatch(JSON.stringify(logs), /private payload|secret-path|alerts\.example\.test/i);
  assert.deepEqual(
    deliveries.map(({ url }) => String(url)),
    Array(3).fill('https://alerts.example.test/secret-path'),
  );
  assert.doesNotMatch(
    JSON.stringify(deliveries.map(({ body }) => body)),
    /private payload|secret-path|alerts\.example\.test/i,
  );
});

test('permanent webhook failures stop immediately and stay in cooldown', async () => {
  let calls = 0;
  const { alerts, deliveries, logs, backoffDelays, setNow } = createHarness(undefined, {
    fetcher: async () => {
      calls += 1;
      return new Response(null, { status: 400 });
    },
  });
  for (let index = 0; index < 3; index += 1) {
    await alerts.recordApiHealthFailure(`health-permanent-${index}`);
  }

  assert.equal(calls, 1);
  assert.equal(deliveries.length, 1);
  assert.deepEqual(backoffDelays, []);
  assert.deepEqual(logs.map(({ fields }) => ({
    attempt: fields.attempt,
    statusCode: fields.statusCode,
    willRetry: fields.willRetry,
  })), [{ attempt: 1, statusCode: 400, willRetry: false }]);

  setNow(1_800_000_000_000 + 15 * 60_000);
  await alerts.recordApiHealthFailure('health-permanent-4');
  assert.equal(calls, 2, 'a new alert can be delivered after cooldown expires');
});

test('network failures stop after the maximum attempts without logging exception content', async () => {
  let calls = 0;
  const { alerts, deliveries, logs, backoffDelays } = createHarness(undefined, {
    fetcher: async () => {
      calls += 1;
      throw new Error('sensitive request body must never be logged');
    },
  });
  for (let index = 0; index < 3; index += 1) {
    await alerts.recordApiHealthFailure(`health-network-${index}`);
  }

  assert.equal(calls, 3);
  assert.equal(deliveries.length, 3);
  assert.deepEqual(backoffDelays, [100, 300]);
  assert.equal(logs.length, 3);
  assert.equal(logs.at(-1)?.fields.willRetry, false);
  assert.equal(logs.at(-1)?.fields.attempt, 3);
  assert.doesNotMatch(JSON.stringify(logs), /sensitive request body/i);
  assert.doesNotMatch(JSON.stringify(deliveries), /sensitive request body/i);
});
