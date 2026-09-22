import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MINIMUM_STORY_WORDS,
  getStoryWordCount,
  scheduledStories,
  stories,
} from '../src/content.ts';

test('all maintained and scheduled stories meet the minimum word count', () => {
  const allStories = [...stories, ...scheduledStories];
  const underMinimum = allStories
    .map((story) => ({ slug: story.slug, words: getStoryWordCount(story) }))
    .filter(({ words }) => words < MINIMUM_STORY_WORDS);

  assert.deepEqual(
    underMinimum,
    [],
    `Stories below ${MINIMUM_STORY_WORDS} words: ${JSON.stringify(underMinimum)}`,
  );
});