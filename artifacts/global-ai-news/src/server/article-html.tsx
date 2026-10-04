import { existsSync } from 'node:fs';
import path from 'node:path';

import type { NewsroomContentSnapshot } from '../content';
import {
  getArticleSeoMetadata,
  getSeoMetadata,
  type SeoMetadata,
} from '../seo-metadata';
import { renderSeoRouteHtml } from '../seo-html';

export interface ArticleHtmlResponse {
  status: 200 | 404;
  html: string;
  metadata: SeoMetadata;
}

export function hasPrerenderedArticleHtml(
  pathname: string,
  publicDir: string,
): boolean {
  const route = pathname.replace(/\/+$/, '') || '/';
  const match = route.match(/^\/article\/([^/]+)$/);
  if (!match) return false;

  let slug: string;
  try {
    slug = decodeURIComponent(match[1]);
  } catch {
    return false;
  }
  if (!slug || slug.includes('/') || slug.includes('\\')) return false;

  const articleRoot = path.resolve(publicDir, 'article');
  const articleHtml = path.resolve(articleRoot, slug, 'index.html');
  const relativePath = path.relative(articleRoot, articleHtml);
  if (
    relativePath.startsWith('..') ||
    path.isAbsolute(relativePath)
  ) {
    return false;
  }
  return existsSync(articleHtml);
}

function articleImageMetadata(
  story: NewsroomContentSnapshot['stories'][number],
  publicDir: string,
): Pick<SeoMetadata, 'imagePath' | 'imageAlt'> {
  const generatedMetadata = getArticleSeoMetadata(story);
  const generatedImagePath = generatedMetadata.imagePath;
  const generatedImageFile = generatedImagePath
    ? path.resolve(publicDir, `.${generatedImagePath}`)
    : undefined;
  const publicRoot = path.resolve(publicDir);
  const imageRelativePath = generatedImageFile
    ? path.relative(publicRoot, generatedImageFile)
    : undefined;
  const imageIsSafe =
    imageRelativePath !== undefined &&
    imageRelativePath !== '' &&
    !imageRelativePath.startsWith('..') &&
    !path.isAbsolute(imageRelativePath);

  if (generatedImageFile && imageIsSafe && existsSync(generatedImageFile)) {
    return {
      imagePath: generatedImagePath,
      imageAlt: generatedMetadata.imageAlt,
    };
  }

  return {
    imagePath: `/api/newsroom/social/articles/${story.slug}.png`,
    imageAlt: `${story.title} — Global AI News editorial preview`,
  };
}

export function renderArticleHtml(
  baseHtml: string,
  pathname: string,
  publicDir: string,
  snapshot: NewsroomContentSnapshot,
): ArticleHtmlResponse {
  const route = pathname.replace(/\/+$/, '') || '/';
  const match = route.match(/^\/article\/([^/]+)$/);
  let slug: string | undefined;
  if (match) {
    try {
      slug = decodeURIComponent(match[1]);
    } catch {
      slug = undefined;
    }
  }
  const story = slug && !slug.includes('/') && !slug.includes('\\')
    ? snapshot.stories.find((candidate) => candidate.slug === slug)
    : undefined;

  if (!story) {
    const metadata = getSeoMetadata(route, snapshot.stories);
    return {
      status: 404,
      metadata: { ...metadata, indexable: false },
      html: renderSeoRouteHtml(
        baseHtml,
        route,
        { ...metadata, indexable: false },
        snapshot,
      ),
    };
  }

  const image = articleImageMetadata(story, publicDir);
  const metadata = getArticleSeoMetadata(story, image.imagePath, image.imageAlt);
  return {
    status: 200,
    metadata,
    html: renderSeoRouteHtml(baseHtml, route, metadata, snapshot),
  };
}

export async function fetchNewsroomContentSnapshot(
  apiOrigin: string | undefined,
): Promise<NewsroomContentSnapshot> {
  if (!apiOrigin) {
    throw new Error('NEWSROOM_API_ORIGIN must be configured for article rendering.');
  }

  let contentUrl: URL;
  try {
    const origin = new URL(apiOrigin);
    if (!['http:', 'https:'].includes(origin.protocol)) {
      throw new Error('unsupported protocol');
    }
    contentUrl = new URL('/api/newsroom/content', origin);
  } catch {
    throw new Error('NEWSROOM_API_ORIGIN must be a valid HTTP(S) service origin.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch(contentUrl, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`The public newsroom API returned HTTP ${response.status}.`);
    }
    const snapshot: unknown = await response.json();
    if (
      !snapshot ||
      typeof snapshot !== 'object' ||
      !('stories' in snapshot) ||
      !Array.isArray(snapshot.stories) ||
      !('authors' in snapshot) ||
      !Array.isArray(snapshot.authors) ||
      !('sources' in snapshot) ||
      !Array.isArray(snapshot.sources) ||
      !('entities' in snapshot) ||
      !Array.isArray(snapshot.entities) ||
      !('timelineEvents' in snapshot) ||
      !Array.isArray(snapshot.timelineEvents)
    ) {
      throw new Error('The public newsroom API returned an invalid content snapshot.');
    }
    return snapshot as NewsroomContentSnapshot;
  } finally {
    clearTimeout(timeout);
  }
}