import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPublishedStories } from '../src/content.ts';
import { getSeoMetadataManifest, getStructuredData } from '../src/seo-metadata.ts';

const explicitArticleDates = {
  'reliability-is-the-new-ai-moat': '2026-09-21',
  'public-compute-needs-public-metrics': '2026-09-21',
  'weekly-deep-dive-cost-of-intelligence': '2026-09-21',
};

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

    assert.ok(story, `${slug}: maintained story is missing`);
    assert.equal(story.dateModified, expectedDate, `${slug}: editorial modification date changed`);
    assert.equal(metadata?.lastmod, expectedDate, `${slug}: manifest lastmod drifted`);

    const articleData = JSON.parse(getStructuredData(metadata, stories))
      ['@graph']
      .find((entry) => entry['@type'] === 'NewsArticle');
    assert.equal(articleData.dateModified, expectedDate, `${slug}: JSON-LD dateModified drifted`);
  }
});