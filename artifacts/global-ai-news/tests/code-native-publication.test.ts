import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { articleRegistry } from '../src/article-registry.generated.ts';
import { isArticlePublishable, makePublishedArticleHtml } from '../src/server/code-native-publication';

test('article routes require published status and an elapsed publication time', () => {
  const now = new Date('2026-11-02T08:00:00.000Z');
  assert.equal(isArticlePublishable(undefined, now), false);
  assert.equal(isArticlePublishable({ status: 'scheduled', publishAt: '2026-11-02T07:00:00Z' }, now), false);
  assert.equal(isArticlePublishable({ status: 'paused', publishAt: '2026-11-02T07:00:00Z' }, now), false);
  assert.equal(isArticlePublishable({ status: 'published', publishAt: '2026-11-02T09:00:00Z' }, now), false);
  assert.equal(isArticlePublishable({ status: 'published', publishAt: '2026-11-02T08:00:00Z' }, now), true);
  assert.equal(articleRegistry.length, 10);
  for (const article of articleRegistry) {
    const publishAt = new Date(article.publishAt);
    assert.equal(
      isArticlePublishable({ status: 'published', publishAt: article.publishAt }, new Date(publishAt.getTime() - 1)),
      false,
      `${article.slug} must remain hidden before its scheduled instant`,
    );
    assert.equal(
      isArticlePublishable({ status: 'published', publishAt: article.publishAt }, publishAt),
      true,
      `${article.slug} must become eligible at its scheduled instant`,
    );
  }
});

test('published HTML round-trips all ten staged articles changing only robots directives', () => {
  for (const article of articleRegistry) {
    const staged = readFileSync(
      new URL(`../public/staging/article/${article.slug}/index.html`, import.meta.url),
      'utf8',
    );
    const published = makePublishedArticleHtml(staged);
    assert.match(staged, /name="robots" content="noindex,nofollow"/, `${article.slug} staging robots`);
    assert.match(published, /<meta name="robots" content="index,follow">/, `${article.slug} published robots`);
    const stagedHeading = staged.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0];
    assert.ok(stagedHeading, `${article.slug} staging heading`);
    assert.equal(
      published.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0],
      stagedHeading,
      `${article.slug} published heading must preserve authored copy`,
    );
    assert.equal(
      published.replace(/<meta name="robots" content="index,follow">/g, '<meta name="robots" content="noindex,nofollow">')
        .replace(/<meta name="googlebot" content="index,follow">/g, '<meta name="googlebot" content="noindex,nofollow">'),
      staged,
      `${article.slug} public render must preserve authored content, citations, links and structured data`,
    );
  }
});
