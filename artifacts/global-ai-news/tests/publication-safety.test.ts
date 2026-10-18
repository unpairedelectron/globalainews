import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPublishedStories,
  getEditorialWordCountBounds,
  getReleaseDraftWordCount,
  getStoryWordCount,
  isPublicArticle,
  resolveMaintainedReleaseStory,
  scheduledStories,
  type ScheduledStory,
} from '../src/content.ts';
import { shouldSeedDefaultSchedule } from '../../api-server/src/editorial/release-seeding.ts';

test('public reads never seed a default schedule in production or an unset environment', () => {
  assert.equal(shouldSeedDefaultSchedule('production', 'true'), false);
  assert.equal(shouldSeedDefaultSchedule('production', undefined), false);
  assert.equal(shouldSeedDefaultSchedule(undefined, 'true'), false);
  assert.equal(shouldSeedDefaultSchedule('development', undefined), false);
});

test('default schedule seeding is limited to tests and explicit development opt-in', () => {
  assert.equal(shouldSeedDefaultSchedule('test', undefined), true);
  assert.equal(shouldSeedDefaultSchedule('development', 'true'), true);
  assert.equal(shouldSeedDefaultSchedule('development', 'false'), false);
});

test('CMS release word limits enforce Brief 120–220 and Research/Data 800-word minimums', () => {
  const now = new Date('2026-10-18T00:00:00.000Z');
  const publishAt = '2026-10-17T00:00:00.000Z';
  const eligible = (section: 'Brief' | 'Research' | 'Data', wordCount: number) =>
    isPublicArticle({ status: 'scheduled', publishAt, wordCount, section }, now);

  assert.equal(getEditorialWordCountBounds('Brief').minimum, 120);
  assert.equal(getEditorialWordCountBounds('Brief').maximum, 220);
  assert.equal(eligible('Brief', 119), false);
  assert.equal(eligible('Brief', 120), true);
  assert.equal(eligible('Brief', 220), true);
  assert.equal(eligible('Brief', 221), false);
  assert.equal(eligible('Research', 799), false);
  assert.equal(eligible('Research', 800), true);
  assert.equal(eligible('Data', 799), false);
  assert.equal(eligible('Data', 800), true);

  const body120 = Array(120).fill('copy').join(' ');
  assert.equal(getReleaseDraftWordCount('', body120), 120);
  assert.equal(getReleaseDraftWordCount('dek', Array(119).fill('copy').join(' ')), 120);
});

test('public projections use revised maintained content without overwriting editor-authored releases', () => {
  assert.ok(scheduledStories.length > 0, 'maintained release candidates are required');

  for (const maintainedStory of scheduledStories) {
    const storedStory = {
      ...maintainedStory,
      title: `Stale title for ${maintainedStory.slug}`,
      dek: 'Stale release dek',
      body: [{ heading: 'Old draft', paragraphs: ['A short legacy record.'] }],
    };
    const projected = resolveMaintainedReleaseStory(storedStory, maintainedStory);
    assert.equal(projected.title, maintainedStory.title);
    assert.equal(projected.dek, maintainedStory.dek);
    assert.deepEqual(projected.body, maintainedStory.body);

    const editorAuthoredStory = {
      ...storedStory,
      editorialSource: 'editor',
    } as ScheduledStory & { editorialSource: 'editor' };
    const editorProjection = resolveMaintainedReleaseStory(
      editorAuthoredStory,
      maintainedStory,
    );
    assert.equal(editorProjection.title, storedStory.title);
    assert.equal(editorProjection.dek, storedStory.dek);
    assert.deepEqual(editorProjection.body, storedStory.body);
  }
});

test('the three old newsroom release records project the maintained decision without changing editorial overrides', () => {
  const reviewedSlugs = [
    'weekly-deep-dive-cost-of-intelligence',
    'public-compute-needs-public-metrics',
    'reliability-is-the-new-ai-moat',
  ];
  const publicSlugs = new Set(
    getPublishedStories(new Date('2026-10-14T23:59:59.999Z')).map((story) => story.slug),
  );

  for (const slug of reviewedSlugs) {
    const maintainedStory = scheduledStories.find((candidate) => candidate.slug === slug);
    assert.ok(maintainedStory, `missing authoritative maintained story ${slug}`);

    const staleDatabaseRecord = {
      ...maintainedStory,
      title: `Stale production title for ${slug}`,
      dek: 'A short legacy release dek.',
      body: [{ heading: 'Old draft', paragraphs: ['A short legacy record.'] }],
    };
    const projected = resolveMaintainedReleaseStory(staleDatabaseRecord, maintainedStory);
    assert.equal(projected.title, maintainedStory.title);
    assert.equal(projected.dek, maintainedStory.dek);
    assert.deepEqual(projected.body, maintainedStory.body);
    assert.ok(getStoryWordCount(projected) >= 800);
    assert.equal(
      publicSlugs.has(slug),
      slug !== 'public-compute-needs-public-metrics',
      `${slug} public state must match the maintained editorial decision`,
    );

    const editorAuthoredRecord = {
      ...staleDatabaseRecord,
      editorialSource: 'editor',
    } as ScheduledStory & { editorialSource: 'editor' };
    const editorProjection = resolveMaintainedReleaseStory(editorAuthoredRecord, maintainedStory);
    assert.equal(editorProjection.title, staleDatabaseRecord.title);
    assert.equal(editorProjection.dek, staleDatabaseRecord.dek);
    assert.deepEqual(editorProjection.body, staleDatabaseRecord.body);
  }
});
