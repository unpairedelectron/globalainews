import assert from 'node:assert/strict';
import test from 'node:test';
import { articleRegistry } from '../src/article-registry.generated.ts';
import { getVisibleReleaseArticles } from '../src/publication-state.ts';

const now = Date.parse('2026-11-21T07:30:00.000Z');
const stateFor = (article: (typeof articleRegistry)[number], status: string, publishAt = article.publishAt) => ({
  slug: article.slug,
  status,
  publishAt,
});

test('empty and scheduled snapshots keep all registry links out of public UI', () => {
  assert.deepEqual(getVisibleReleaseArticles([], now), []);
  assert.deepEqual(
    getVisibleReleaseArticles(articleRegistry.map((article) => stateFor(article, 'scheduled')), now),
    [],
  );
});

test('the public UI exposes all ten links only after each publication time', () => {
  const states = articleRegistry.map((article) => stateFor(article, 'published'));
  states[0] = stateFor(articleRegistry[0], 'published', '2026-11-22T07:30:00.000Z');
  assert.equal(getVisibleReleaseArticles(states, now).length, 9);
  states[0] = stateFor(articleRegistry[0], 'published');
  const visible = getVisibleReleaseArticles(states, now);
  assert.equal(visible.length, 10);
  assert.deepEqual(new Set(visible.map((article) => article.slug)), new Set(articleRegistry.map((article) => article.slug)));
});

test('paused articles are removed from public UI links', () => {
  const states = articleRegistry.map((article) => stateFor(article, 'published'));
  states[0] = stateFor(articleRegistry[0], 'paused');
  assert.equal(getVisibleReleaseArticles(states, now).length, 9);
});
