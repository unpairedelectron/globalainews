import assert from 'node:assert/strict';
import test from 'node:test';
import {
  authorityClusters,
  buildAuthorityGraph,
  dataProductRecords,
  researchRecords,
  topicRecords,
  validateAuthorityRegistry,
} from '../src/authority/registry';
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
  assert.deepEqual(cluster.storySlugs, [report.slug], 'the merged compute hub must not retain a duplicate story route');
  assert.deepEqual(research.sourceSlugs, report.sources);
  assert.equal(research.sourceSlugs.length, 22);
  assert.ok(research.sourceSlugs.every((slug) => sources.some((source) => source.slug === slug)));
  assert.ok(research.entitySlugs.every((slug) => report.entities.includes(slug)));
  assert.ok(research.timelineSlugs.every((slug) => report.timeline.includes(slug)));
  assert.equal(research.provenance, 'original-analysis');
  assert.equal(research.status, 'published');
  assert.ok(research.researchQuestion.length > 40);
  assert.ok(research.methodology.length > 40);
  assert.ok(research.findings.length >= 3);
  assert.ok(research.limitations.length >= 3);
  assert.equal(research.updatedAt, report.dateModified);
  assert.ok(research.updateHistory.some((entry) => entry.date === report.date));
});

test('the next authority cluster has reusable structure but is not an indexable empty page', () => {
  const cluster = authorityClusters.find((item) => item.slug === 'small-models-efficient-ai-serious-workflows');
  assert.ok(cluster);
  assert.equal(cluster.status, 'prepared');
  assert.equal(cluster.indexable, false);
  assert.ok(cluster.storySlugs.length >= 2);
  assert.ok(cluster.sourceSlugs.length > 0);
  assert.deepEqual(cluster.dataProductSlugs, []);
});

test('compute observations preserve dated source wording without inventing schedulable capacity', () => {
  assert.equal(indiaAiComputeObservations.length, 9);
  assert.ok(indiaAiComputeObservations.every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.reportedOn)));
  assert.ok(indiaAiComputeObservations.every((item) => sources.some((source) => source.slug === item.sourceSlug)));
  assert.ok(indiaAiComputeObservations.every((item) => item.schedulable === 'not-established'));

  const shared = indiaAiComputeObservations.find((item) => item.status === 'shared-capacity-reported');
  const access = indiaAiComputeObservations.find((item) => item.status === 'access-reported');
  const installed = indiaAiComputeObservations.find((item) => item.status === 'installed-reported');
  const julyOnboarded = indiaAiComputeObservations.find((item) => item.id === 'onboarded-nearly-38000-july-2026');
  assert.equal(shared?.accessible, 'not-established');
  assert.equal(shared?.asOf, '2026-06');
  assert.equal(shared?.qualifier, 'more-than');
  assert.equal(access?.accessible, 'reported');
  assert.equal(access?.asOf, null);
  assert.equal(access?.qualifier, 'about');
  assert.equal(access?.sourceKind, 'independent');
  assert.equal(installed?.installed, 'reported');
  assert.equal(installed?.schedulable, 'not-established');
  assert.equal(installed?.asOf, '2025-06-16');
  assert.equal(julyOnboarded?.quantityLabel, 'nearly 38,000 onboarded');
  assert.equal(julyOnboarded?.qualifier, 'nearly');
  assert.equal(julyOnboarded?.schedulable, 'not-established');
  assert.ok(indiaAiComputeObservations.every((item) =>
    item.acceleratorType === 'not specified by source' &&
    item.installed !== 'established' &&
    item.deployed !== 'established'));
});

test('sources expose reusable provenance metadata without guessing missing publication dates', () => {
  const official = sources.find((source) => source.slug === 'pib-capacity-and-use-factsheet-2026');
  const secondary = sources.find((source) => source.slug === 'ettech-indiaai-recalibration-2026');
  const portal = sources.find((source) => source.slug === 'indiaai-compute-portal');
  const allocations = sources.find((source) => source.slug === 'indiaai-compute-allocation-register-2026');

  assert.ok(official && secondary && portal && allocations);
  assert.equal(official.sourceType, 'government-record');
  assert.equal(official.classification, 'primary');
  assert.equal(official.publicationDate, '2026-08-13');
  assert.equal(secondary.sourceType, 'news-report');
  assert.equal(secondary.classification, 'secondary');
  assert.equal(portal.sourceType, 'government-portal');
  assert.equal(portal.publicationDate, undefined);
  assert.equal(allocations.publicationDate, undefined);
  assert.match(allocations.scopeNote ?? '', /project-level/i);
  assert.ok(official.scopeNote);
  assert.ok([official, secondary, portal, allocations].every((source) => /^https?:\/\//.test(source.url)));
});

test('data product keeps dated observations, provenance, limitations, and updates together', () => {
  const dataProduct = dataProductRecords.find((record) => record.slug === 'india-ai-compute-snapshots');
  const india = topicRecords.find((topic) => topic.slug === 'india');
  assert.ok(dataProduct && india);
  assert.equal(dataProduct.evidenceType, 'dated-public-source-claims');
  assert.equal(dataProduct.observations.length, 9);
  assert.equal(dataProduct.updatedAt, '2026-10-04');
  assert.ok(dataProduct.sourceSlugs.length >= 6);
  assert.ok(dataProduct.methodology.length > 40);
  assert.ok(dataProduct.limitations.length >= 3);
  assert.ok(dataProduct.updateHistory.length > 0);
  assert.ok(india.researchSlugs.includes('india-ai-compute-2026'));
  assert.ok(india.reportSlugs.includes('india-ai-compute-access-2026'));
  assert.ok(india.dataProductSlugs.includes(dataProduct.slug));
});

test('authority graph is reciprocal and connects the report through research, data, sources, entities, topics, and history', () => {
  const graph = buildAuthorityGraph();
  const hasEdge = (fromType: string, fromSlug: string, toType: string, toSlug: string) =>
    graph.some((edge) => edge.fromType === fromType && edge.fromSlug === fromSlug && edge.toType === toType && edge.toSlug === toSlug);

  assert.ok(hasEdge('report', 'india-ai-compute-access-2026', 'research', 'india-ai-compute-2026'));
  assert.ok(hasEdge('report', 'india-ai-compute-access-2026', 'data-product', 'india-ai-compute-snapshots'));
  assert.ok(hasEdge('research', 'india-ai-compute-2026', 'source', 'pib-capacity-and-use-factsheet-2026'));
  assert.ok(hasEdge('report', 'india-ai-compute-access-2026', 'entity', 'indiaai-mission'));
  assert.ok(hasEdge('report', 'india-ai-compute-access-2026', 'topic', 'india'));
  assert.ok(hasEdge('report', 'india-ai-compute-access-2026', 'timeline', 'indiaai-compute-shared-capacity-2026'));
  assert.ok(graph.every((edge) => hasEdge(edge.toType, edge.toSlug, edge.fromType, edge.fromSlug)));
});