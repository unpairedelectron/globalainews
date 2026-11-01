import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { isArticlePublishable, makePublishedArticleHtml } from '../src/server/code-native-publication';

test('article routes require published status and an elapsed publication time', () => {
  const now = new Date('2026-11-02T08:00:00.000Z');
  assert.equal(isArticlePublishable(undefined, now), false);
  assert.equal(isArticlePublishable({ status: 'scheduled', publishAt: '2026-11-02T07:00:00Z' }, now), false);
  assert.equal(isArticlePublishable({ status: 'paused', publishAt: '2026-11-02T07:00:00Z' }, now), false);
  assert.equal(isArticlePublishable({ status: 'published', publishAt: '2026-11-02T09:00:00Z' }, now), false);
  assert.equal(isArticlePublishable({ status: 'published', publishAt: '2026-11-02T08:00:00Z' }, now), true);
});

test('published markup changes only the staging robots directives', () => {
  const staged = readFileSync(
    new URL('../public/staging/article/india-ai-consultation-paper-what-is-law/index.html', import.meta.url),
    'utf8',
  );
  const published = makePublishedArticleHtml(staged);
  assert.match(published, /<meta name="robots" content="index,follow">/);
  assert.equal(
    published.replace(/<meta name="robots" content="index,follow">/g, '<meta name="robots" content="noindex,nofollow">')
      .replace(/<meta name="googlebot" content="index,follow">/g, '<meta name="googlebot" content="noindex,nofollow">'),
    staged,
  );
});
