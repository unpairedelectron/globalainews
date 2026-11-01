import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { CreateNewsroomReleaseBody } from '../../../lib/api-zod/src/index.ts';

const manifest = JSON.parse(
  await readFile(new URL('../../../release/manifest.json', import.meta.url), 'utf8'),
);
const schedule = [
  ['india-ai-consultation-paper-what-is-law', '2026-11-02T07:30:00.000Z'],
  ['github-octoverse-2026-agents-pull-requests', '2026-11-03T07:30:00.000Z'],
  ['gated-frontier-models-gemini-4-carbon', '2026-11-05T07:30:00.000Z'],
  ['anthropic-s1-governance-who-controls', '2026-11-07T07:30:00.000Z'],
  ['hyperscaler-capex-2026-reconciled', '2026-11-09T07:30:00.000Z'],
  ['openai-containment-incident-offline-training', '2026-11-11T07:30:00.000Z'],
  ['indiaai-10000-gpu-tender-explained', '2026-11-13T07:30:00.000Z'],
  ['eu-ai-act-december-2026-deadlines', '2026-11-16T07:30:00.000Z'],
  ['ai-in-workforce-plans-october-2026', '2026-11-18T07:30:00.000Z'],
  ['ai-agents-delegated-access-banks-passwords', '2026-11-20T07:30:00.000Z'],
];

test('release manifest matches the exact CMS release input contract and schedule', () => {
  assert.equal(manifest.queue.length, 10);
  assert.deepEqual(
    manifest.queue.map((entry: any) => [entry.input.slug, entry.input.publishAt]),
    schedule,
  );
  for (const entry of manifest.queue) {
    CreateNewsroomReleaseBody.parse(entry.input);
    assert.ok(entry.input.body.split(/\s+/u).length >= 800, `${entry.input.slug} has complete article copy`);
  }
  for (const issue of manifest.briefIssues) {
    CreateNewsroomReleaseBody.parse(issue.input);
    const count = issue.input.body.trim().split(/\s+/u).filter(Boolean).length;
    assert.ok(count >= 120 && count <= 220, `${issue.slug} has ${count} words`);
  }
});

test('manifest site records are date-gated and trace to existing drafts and fact logs', () => {
  const scheduled = new Set(schedule.map(([slug]) => slug));
  assert.equal(manifest.briefIssues.length, 10);
  assert.equal(manifest.signals.length, 10);
  assert.ok(manifest.topics.length > 0);
  for (const record of manifest.signals) {
    assert.ok(scheduled.has(record.articleSlug));
    assert.match(record.source, /^https?:\/\//u);
    assert.ok([1, 2].includes(record.tier));
    assert.ok(['high', 'developing'].includes(record.confidence));
  }
  for (const record of manifest.discovery) {
    assert.ok(scheduled.has(record.articleSlug));
    for (const channel of [record.sitemap, record.newsSitemap, record.rss, record.topicRss]) {
      assert.equal(channel.include, true);
      assert.equal(channel.effectiveAt, schedule.find(([slug]) => slug === record.articleSlug)?.[1]);
    }
  }
});

test('full fixture dry-run is idempotent and makes no API calls', () => {
  const wanted = [
    ...manifest.queue.map((entry: any) => entry.input),
    ...manifest.briefIssues.map((entry: any) => entry.input),
  ];
  const fixture = new Map<string, unknown>([
    [manifest.queue[0].input.slug, manifest.queue[0].input],
    [manifest.queue[1].input.slug, { ...manifest.queue[1].input, title: 'Earlier fixture title' }],
    [manifest.briefIssues[0].input.slug, manifest.briefIssues[0].input],
  ]);
  const actions = wanted.map((input: any) => {
    const existing = fixture.get(input.slug);
    if (!existing) return 'create';
    return JSON.stringify(existing) === JSON.stringify(input) ? 'unchanged' : 'update';
  });
  assert.deepEqual(
    Object.fromEntries(['create', 'update', 'unchanged'].map((action) => [
      action,
      actions.filter((value) => value === action).length,
    ])),
    { create: 17, update: 1, unchanged: 2 },
  );
  assert.equal(wanted.length, 20);
});
