import { createServer } from 'node:http';

import {
  askGlobalAnswers,
  authors,
  entities,
  essays,
  evidenceSummaries,
  getPublishedStories,
  indiaIndex,
  industryMap,
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

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid metadata server port: "${process.env.PORT ?? ''}"`);
}

async function getPublishedStoriesForBuild() {
  const now = new Date();
  const stories = getPublishedStories(now);
  return {
    stories,
    now,
  };
}

async function getNewsroomContentForBuild() {
  const [{ stories, now }] = await Promise.all([
    getPublishedStoriesForBuild(),
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