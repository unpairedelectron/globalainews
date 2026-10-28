import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  checkNewsroomApiHealth,
  OperationalAlertManager,
} from '../src/server/operational-alerts';

function createHarness(now = 1_800_000_000_000) {
  const deliveries: Array<{ url: string | URL | Request; body: string }> = [];
  const logs: Array<{ event: string; fields: Record<string, unknown> }> = [];
  const fetcher: typeof fetch = async (input, init) => {
    deliveries.push({ url: input, body: String(init?.body ?? '') });
    return new Response(null, { status: 204 });
  };
  const alerts = new OperationalAlertManager({
    webhookUrl: 'https://alerts.example.test/secret-path',
    fetcher,
    now: () => now,
    log: (event, fields) => logs.push({ event, fields }),
  });
  return { alerts, deliveries, logs };
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
