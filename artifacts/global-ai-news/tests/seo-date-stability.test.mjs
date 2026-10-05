import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  authors,
  getStoryWordCount,
  getPublishedStories,
  getPublicDateModified,
  isPublicArticle,
  MINIMUM_STORY_WORDS,
  scheduledStories,
  sources,
  stories as maintainedStories,
} from '../src/content.ts';
import { getSeoMetadata, getSeoMetadataManifest, getStructuredData } from '../src/seo-metadata.ts';
import { SeoPrerender } from '../src/seo-prerender.tsx';

const explicitArticleDates = {
  'reliability-is-the-new-ai-moat': '2026-09-21',
  'public-compute-needs-public-metrics': '2026-09-21',
  'weekly-deep-dive-cost-of-intelligence': '2026-09-21',
};

test('one public eligibility rule governs dated articles and prepared releases', () => {
  const now = new Date('2026-10-03T12:00:00.000Z');
  const publishAt = '2026-10-03T12:00:00.000Z';

  assert.equal(isPublicArticle({ date: '2026-10-03' }, now), true);
  assert.equal(isPublicArticle({ date: '2026-10-04' }, now), false);
  assert.equal(isPublicArticle({ date: 'not-a-date' }, now), false);
  assert.equal(isPublicArticle({ status: 'draft', publishAt, wordCount: MINIMUM_STORY_WORDS }, now), false);
  assert.equal(isPublicArticle({ status: 'canceled', publishAt, wordCount: MINIMUM_STORY_WORDS }, now), false);
  assert.equal(isPublicArticle({ status: 'scheduled', publishAt, wordCount: MINIMUM_STORY_WORDS }, now), true);
  assert.equal(isPublicArticle({ status: 'published', publishAt, wordCount: MINIMUM_STORY_WORDS }, now), true);
  assert.equal(isPublicArticle({ status: 'scheduled', publishAt, wordCount: MINIMUM_STORY_WORDS - 1 }, now), false);
  assert.equal(isPublicArticle({ status: 'scheduled', publishAt: '2026-10-03T12:00:01.000Z', wordCount: MINIMUM_STORY_WORDS }, now), false);
  assert.equal(isPublicArticle({ status: 'scheduled', publishAt, wordCount: MINIMUM_STORY_WORDS }, new Date('invalid')), false);

  const publishedScheduledSlugs = getPublishedStories(now, scheduledStories)
    .filter((story) => !maintainedStories.some((maintained) => maintained.slug === story.slug))
    .map((story) => story.slug);
  const expectedScheduledSlugs = scheduledStories
    .filter((story) => !maintainedStories.some((maintained) => maintained.slug === story.slug))
    .filter((story) => isPublicArticle({
      status: 'scheduled',
      publishAt: story.publishAt,
      wordCount: getStoryWordCount(story),
    }, now))
    .map((story) => story.slug)
    .sort();
  assert.deepEqual(publishedScheduledSlugs.sort(), expectedScheduledSlugs);
});

test('article dates stay editorial when identical content is built on different days', () => {
  const stories = getPublishedStories(new Date('2026-10-01T00:00:00.000Z'));
  const firstManifest = getSeoMetadataManifest(stories, '2026-10-01T00:00:00.000Z');
  const laterManifest = getSeoMetadataManifest(stories, '2026-10-02T00:00:00.000Z');
  const articleDates = (manifest) =>
    manifest.routes
      .filter((metadata) => metadata.article)
      .map(({ path, lastmod }) => [path, lastmod]);

  assert.deepEqual(
    articleDates(firstManifest),
    articleDates(laterManifest),
    'article lastmod values changed when only the manifest build time changed',
  );

  for (const [slug, expectedDate] of Object.entries(explicitArticleDates)) {
    const story = stories.find((candidate) => candidate.slug === slug);
    const route = `/article/${slug}`;
    const metadata = firstManifest.routes.find((candidate) => candidate.path === route);
    const publicModifiedDate =
      story?.dateModified && story.dateModified >= story.date
        ? story.dateModified
        : undefined;

    assert.ok(story, `${slug}: maintained story is missing`);
    assert.equal(story.dateModified, expectedDate, `${slug}: editorial modification date changed`);
    assert.equal(metadata?.lastmod, publicModifiedDate, `${slug}: manifest lastmod is not publication-safe`);

    const articleData = JSON.parse(getStructuredData(metadata, stories))
      ['@graph']
      .find((entry) => entry['@type'] === 'NewsArticle');
    assert.equal(articleData.dateModified, publicModifiedDate, `${slug}: JSON-LD dateModified is not publication-safe`);
    assert.equal(
      getPublicDateModified(story),
      publicModifiedDate,
      `${slug}: shared public date helper is not publication-safe`,
    );

    if (story.dateModified && !publicModifiedDate) {
      const snapshot = {
        authors,
        sources,
        evidenceSummaries: {},
        entities: [],
        timelineEvents: [],
        stories,
        signals: [],
        industryMap: [],
        indiaIndex: [],
        essays: [],
        askGlobalAnswers: [],
      };
      const html = renderToStaticMarkup(createElement(SeoPrerender, {
        route,
        metadata,
        snapshot,
      }));
      assert.doesNotMatch(
        html,
        /\bUpdated\s*<time\b/i,
        `${slug}: first-response article markup showed a pre-publication updated date`,
      );
    }
  }

  for (const story of stories.filter((candidate) => !candidate.dateModified)) {
    const metadata = firstManifest.routes.find(
      (candidate) => candidate.path === `/article/${story.slug}`,
    );
    const articleData = JSON.parse(getStructuredData(metadata, stories))
      ['@graph']
      .find((entry) => entry['@type'] === 'NewsArticle');

    assert.equal(metadata?.lastmod, undefined, `${story.slug}: manifest invented a modification date`);
    assert.equal(articleData.dateModified, undefined, `${story.slug}: JSON-LD invented a modification date`);
  }
});

test('unknown article URLs are noindex instead of inheriting an unrelated story', () => {
  const stories = getPublishedStories(new Date('2026-10-01T00:00:00.000Z'));
  const metadata = getSeoMetadata('/article/not-a-published-story', stories);

  assert.equal(metadata.title, 'Article not found — Global AI News');
  assert.equal(metadata.indexable, false);
  assert.equal(metadata.article, undefined);
});

test('author profile routes emit ProfilePage structured data from maintained author records', () => {
  const author = authors[0];
  const authorRecords = authors.map((candidate) => candidate.slug === author.slug
    ? { ...candidate, verifiedForPublication: true }
    : candidate);
  const stories = getPublishedStories(new Date('2026-10-01T00:00:00.000Z'));
  const metadata = getSeoMetadata(`/person/${author.slug}`, stories, sources, { authors: authorRecords });
  const profilePage = JSON.parse(getStructuredData(metadata, stories, authorRecords))
    ['@graph']
    .find((entry) => entry['@type'] === 'ProfilePage');

  assert.ok(profilePage, 'author page is missing ProfilePage structured data');
  assert.equal(profilePage.mainEntity.name, author.name);
  assert.equal(profilePage.mainEntity.description, author.bio);
});