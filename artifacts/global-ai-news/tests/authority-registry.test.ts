import assert from 'node:assert/strict';
import test from 'node:test';
import { authorityClusters, researchRecords, topicRecords, validateAuthorityRegistry } from '../src/authority/registry';
import { sources, stories } from '../src/content';
import { indiaAiComputeObservations } from '../src/data/indiaai-compute-observations';

test('authority registry resolves the report across topics, entities, sources, timeline, and articles', () => {
  assert.deepEqual(validateAuthorityRegistry(), []);
  const report = stories.find((story) => story.slug === 'india-ai-compute-access-2026');
  const research = researchRecords.find((record) => record.slug === 'india-ai-compute-2026');
  const india = topicRecords.find((topic) => topic.slug === 'india');
  const cluster = authorityClusters.find((item) => item.slug === 'india-ai-compute');

  assert.ok(report && research && india && cluster);
  assert.equal(research.storySlug, report.slug);
  assert.ok(india.storySlugs.includes(report.slug));
  assert.ok(cluster.storySlugs.includes(report.slug));
  assert.ok(cluster.storySlugs.some((slug) => slug !== report.slug));
  assert.deepEqual(research.sourceSlugs, report.sources);
  assert.equal(research.sourceSlugs.length, 18);
  assert.ok(research.sourceSlugs.every((slug) => sources.some((source) => source.slug === slug)));
  assert.ok(research.entitySlugs.every((slug) => report.entities.includes(slug)));
  assert.ok(research.timelineSlugs.every((slug) => report.timeline.includes(slug)));
});

test('the next authority cluster has reusable structure but is not an indexable empty page', () => {
  const cluster = authorityClusters.find((item) => item.slug === 'small-models-efficient-ai-serious-workflows');
  assert.ok(cluster);
  assert.equal(cluster.status, 'prepared');
  assert.equal(cluster.indexable, false);
  assert.ok(cluster.storySlugs.length >= 2);
  assert.ok(cluster.sourceSlugs.length > 0);
});

test('compute observations preserve dated source wording without inventing schedulable capacity', () => {
  assert.equal(indiaAiComputeObservations.length, 7);
  assert.ok(indiaAiComputeObservations.every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.reportedOn)));
  assert.ok(indiaAiComputeObservations.every((item) => sources.some((source) => source.slug === item.sourceSlug)));
  assert.ok(indiaAiComputeObservations.every((item) => item.schedulable === 'not-established'));

  const shared = indiaAiComputeObservations.find((item) => item.status === 'shared-capacity-reported');
  const access = indiaAiComputeObservations.find((item) => item.status === 'access-reported');
  assert.equal(shared?.accessible, 'not-established');
  assert.equal(shared?.asOf, '2026-06');
  assert.equal(shared?.qualifier, 'more-than');
  assert.equal(access?.accessible, 'reported');
  assert.equal(access?.asOf, null);
  assert.equal(access?.qualifier, 'about');
  assert.equal(access?.sourceKind, 'independent');
  assert.ok(indiaAiComputeObservations.every((item) =>
    item.acceleratorType === 'not specified by source' &&
    item.installed !== 'established' &&
    item.deployed !== 'established'));
});