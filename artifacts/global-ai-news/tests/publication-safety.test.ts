import assert from 'node:assert/strict';
import test from 'node:test';

import {
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
