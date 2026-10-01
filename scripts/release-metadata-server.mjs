import { createServer } from 'node:http';

import { db, editorialReleasesTable } from '../lib/db/src/index.ts';
import {
  getPublishedStories,
  getReleaseWordCount,
  getStoryWordCount,
  MINIMUM_STORY_WORDS,
  scheduledStories,
} from '../artifacts/global-ai-news/src/content.ts';
import { getSeoMetadataManifest } from '../artifacts/global-ai-news/src/seo-metadata.ts';

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
    if (row.status === 'canceled') return [];
    const story = row.story ?? {};
    const scheduledStory = {
      ...story,
      slug: row.slug,
      title: row.title,
      publishAt: row.publishAt.toISOString(),
      date: row.publishAt.toISOString().slice(0, 10),
      updatedAt: row.updatedAt.toISOString(),
    };
    const maintainedStory = scheduledStories.find((candidate) => candidate.slug === row.slug);
    const wordCount =
      story.editorialSource === 'editor' || !maintainedStory
        ? getReleaseWordCount(story.dek, story.body)
        : getStoryWordCount(maintainedStory);
    return wordCount >= MINIMUM_STORY_WORDS ? [scheduledStory] : [];
  });
  return getPublishedStories(now, schedule);
}

const server = createServer(async (request, response) => {
  if (request.url !== '/api/newsroom/metadata') {
    response.statusCode = 404;
    response.end('Not found');
    return;
  }

  try {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    const stories = await getPublishedStoriesForBuild();
    response.end(
      JSON.stringify({
        ...getSeoMetadataManifest(stories),
        stories,
      }),
    );
  } catch (error) {
    response.statusCode = 500;
    response.end(`Metadata generation failed: ${String(error)}`);
  }
});

server.listen(port, '127.0.0.1');

function shutdown() {
  server.close(() => process.exit(0));
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);