import { createServer } from 'node:http';

import { db, editorialReleasesTable } from '../lib/db/src/index.ts';
import {
  askGlobalAnswers,
  authors,
  entities,
  essays,
  evidenceSummaries,
  getEditorialSchedule,
  getPublishedStories,
  getReleaseWordCount,
  getStoryWordCount,
  isPublicEditorialRelease,
  indiaIndex,
  industryMap,
  scheduledStories,
  signals,
  sources as maintainedSources,
  timelineEvents,
} from '../artifacts/global-ai-news/src/content.ts';
import {
  buildAuthorityGraph,
  dataProductRecords,
  researchRecords,
  topicRecords,
} from '../artifacts/global-ai-news/src/authority/registry.ts';
import { getSeoMetadataManifest } from '../artifacts/global-ai-news/src/seo-metadata.ts';
import { getDynamicSourceRecords } from '../artifacts/api-server/src/editorial/automation.ts';

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid metadata server port: "${process.env.PORT ?? ''}"`);
}

async function getPublishedStoriesForBuild() {
  const rows = await db
    .select()
    .from(editorialReleasesTable);
  const now = new Date();
  const schedule = rows.flatMap((row) => {
    const story = row.story ?? {};
    const maintainedStory = scheduledStories.find((candidate) => candidate.slug === row.slug);
    const scheduledStory = {
      ...story,
      slug: row.slug,
      title: row.title,
      publishAt: row.publishAt.toISOString(),
      date: row.publishAt.toISOString().slice(0, 10),
      dateModified: story.dateModified ?? maintainedStory?.dateModified,
      updatedAt: row.updatedAt.toISOString(),
    };
    const wordCount =
      story.editorialSource === 'editor' || !maintainedStory
        ? getReleaseWordCount(story.dek, story.body)
        : getStoryWordCount(maintainedStory);
    return isPublicEditorialRelease(row.status, row.publishAt, wordCount, now)
      ? [scheduledStory]
      : [];
  });
  return {
    stories: getPublishedStories(now, schedule),
    schedule: getEditorialSchedule(now, schedule),
    now,
  };
}

async function getNewsroomContentForBuild() {
  const [{ stories, schedule, now }, dynamicSources] = await Promise.all([
    getPublishedStoriesForBuild(),
    getDynamicSourceRecords(),
  ]);
  const publishedStorySlugs = new Set(stories.map((story) => story.slug));
  const publicResearchRecords = researchRecords.filter(
    (record) => record.status === 'published' && publishedStorySlugs.has(record.storySlug),
  );
  const publicDataProducts = dataProductRecords.filter(
    (record) =>
      record.status === 'published' &&
      record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
  );
  const publicTopics = topicRecords.filter(
    (record) => record.indexable && record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
  );
  const citedSourceSlugs = new Set([
    ...stories.flatMap((story) => story.sources),
    ...publicResearchRecords.flatMap((record) => record.sourceSlugs),
    ...publicDataProducts.flatMap((record) => record.sourceSlugs),
    ...publicTopics.flatMap((record) => record.sourceSlugs),
  ]);
  const sourceRecords = [
    ...maintainedSources.filter((source) => citedSourceSlugs.has(source.slug)),
    ...dynamicSources.filter(
      (source) =>
        citedSourceSlugs.has(source.slug) &&
        !maintainedSources.some((existing) => existing.slug === source.slug),
    ),
  ].map((source) => ({
    ...source,
    title: source.title ?? source.name,
    ...(source.classification
      ? { classification: source.classification }
      : source.kind === 'primary'
        ? { classification: 'primary' }
        : source.kind === 'independent'
          ? { classification: 'secondary' }
          : {}),
    ...((source.relevance ?? source.scopeNote)
      ? { relevance: source.relevance ?? source.scopeNote }
      : {}),
  }));
  const latestPublishedAt = stories.reduce(
    (latest, story) => (story.date > latest ? story.date : latest),
    '',
  );
  const stale =
    latestPublishedAt.length > 0 &&
    Date.now() - Date.parse(`${latestPublishedAt}T23:59:59Z`) > 36 * 60 * 60 * 1000;

  return {
    generatedAt: new Date().toISOString(),
    source: 'maintained-editorial-source',
    stale,
    authors,
    sources: sourceRecords,
    evidenceSummaries,
    entities,
    timelineEvents,
    stories,
    researchRecords: publicResearchRecords,
    dataProducts: publicDataProducts,
    topics: publicTopics,
    authorityEdges: buildAuthorityGraph(stories),
    signals,
    industryMap,
    indiaIndex,
    essays,
    askGlobalAnswers,
    schedule,
  };
}

const server = createServer(async (request, response) => {
  if (
    request.url !== '/api/newsroom/metadata' &&
    request.url !== '/api/newsroom/content'
  ) {
    response.statusCode = 404;
    response.end('Not found');
    return;
  }

  try {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    const content = await getNewsroomContentForBuild();
    if (request.url === '/api/newsroom/content') {
      response.end(JSON.stringify(content));
      return;
    }
    response.end(JSON.stringify({
      ...getSeoMetadataManifest(content.stories, content.generatedAt, content.sources),
      stories: content.stories,
    }));
  } catch (error) {
    response.statusCode = 500;
    response.end(`Newsroom release source failed: ${String(error)}`);
  }
});

server.listen(port, '127.0.0.1');

function shutdown() {
  server.close(() => process.exit(0));
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);