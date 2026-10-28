import { existsSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

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

export interface NewsroomSnapshotDiagnosticEvent {
  phase: string;
  [key: string]: string | number | boolean | undefined;
}

export interface NewsroomSnapshotFetchOptions {
  requestId?: string;
  route?: string;
  timeoutMs?: number;
  allowLastKnownGood?: boolean;
  onEvent?: (event: NewsroomSnapshotDiagnosticEvent) => void;
}

export class NewsroomSnapshotFetchError extends Error {
  constructor(
    readonly code: string,
    readonly upstreamStatus?: number,
  ) {
    super(`Newsroom snapshot fetch failed: ${code}`);
    this.name = 'NewsroomSnapshotFetchError';
  }
}

export const ARTICLE_NOT_FOUND_HTML =
  '<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page not found — Global AI News</title></head><body><main><h1>Page not found</h1><p>This page is not available. Search published reporting or browse the latest stories.</p><p><a href="/search/">Search Global AI News</a> · <a href="/brief/">Latest stories</a></p></main></body></html>';

export function parseArticleRoutePath(
  pathname: string,
): { matched: false } | { matched: true; slug?: string } {
  if (pathname !== '/article' && !pathname.startsWith('/article/')) {
    return { matched: false };
  }

  const match = pathname.match(/^\/article\/([^/]+)\/?$/);
  if (!match) return { matched: true };

  let slug: string;
  try {
    slug = decodeURIComponent(match[1]);
  } catch {
    return { matched: true };
  }
  if (!slug || slug === '.' || slug === '..' || /[\\/]/.test(slug)) {
    return { matched: true };
  }
  return { matched: true, slug };
}

const PUBLIC_SNAPSHOT_FRESH_MS = 1_000;
const PUBLIC_SNAPSHOT_MAX_STALE_MS = 60_000;
const DEFAULT_NEWSROOM_API_TIMEOUT_MS = 5_000;
const MAX_NEWSROOM_SNAPSHOT_BYTES = 12 * 1024 * 1024;
const MAX_PUBLIC_SNAPSHOT_ORIGINS = 4;

const publicSnapshotCache = new Map<
  string,
  { snapshot: NewsroomContentSnapshot; fetchedAt: number }
>();
const pendingSnapshotRequests = new Map<
  string,
  { promise: Promise<NewsroomContentSnapshot>; requestId?: string }
>();

function cachePublicSnapshot(
  cacheKey: string,
  snapshot: NewsroomContentSnapshot,
): void {
  publicSnapshotCache.delete(cacheKey);
  publicSnapshotCache.set(cacheKey, { snapshot, fetchedAt: Date.now() });
  while (publicSnapshotCache.size > MAX_PUBLIC_SNAPSHOT_ORIGINS) {
    const oldestKey = publicSnapshotCache.keys().next().value;
    if (oldestKey === undefined) break;
    publicSnapshotCache.delete(oldestKey);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNewsroomContentSnapshot(value: unknown): value is NewsroomContentSnapshot {
  if (!isRecord(value)) return false;
  const requiredArrays = [
    'stories',
    'authors',
    'sources',
    'entities',
    'timelineEvents',
    'researchRecords',
    'dataProducts',
    'topics',
    'authorityEdges',
    'signals',
    'industryMap',
    'indiaIndex',
    'essays',
    'askGlobalAnswers',
  ];

  if (
    typeof value.generatedAt !== 'string' ||
    typeof value.source !== 'string' ||
    typeof value.stale !== 'boolean' ||
    !isRecord(value.evidenceSummaries) ||
    requiredArrays.some((key) => !Array.isArray(value[key]))
  ) {
    return false;
  }

  return (value.stories as unknown[]).every((story) => {
    if (!isRecord(story) || typeof story.slug !== 'string' || typeof story.title !== 'string') {
      return false;
    }
    if (!Array.isArray(story.sources) || !Array.isArray(story.body)) return false;
    return story.body.every(
      (section) =>
        isRecord(section) &&
        typeof section.heading === 'string' &&
        Array.isArray(section.paragraphs) &&
        section.paragraphs.every((paragraph) => typeof paragraph === 'string'),
    );
  });
}

export function getPrerenderedArticleHtmlPath(
  pathname: string,
  publicDir: string,
): string | undefined {
  const route = pathname.replace(/\/+$/, '') || '/';
  const match = route.match(/^\/article\/([^/]+)$/);
  if (!match) return undefined;

  let slug: string;
  try {
    slug = decodeURIComponent(match[1]);
  } catch {
    return undefined;
  }
  if (!slug || slug.includes('/') || slug.includes('\\')) return undefined;

  const articleRoot = path.resolve(publicDir, 'article');
  const articleHtml = path.resolve(articleRoot, slug, 'index.html');
  const relativePath = path.relative(articleRoot, articleHtml);
  if (
    relativePath.startsWith('..') ||
    path.isAbsolute(relativePath)
  ) {
    return undefined;
  }
  return existsSync(articleHtml) ? articleHtml : undefined;
}

export function hasPrerenderedArticleHtml(
  pathname: string,
  publicDir: string,
): boolean {
  return getPrerenderedArticleHtmlPath(pathname, publicDir) !== undefined;
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
  options: NewsroomSnapshotFetchOptions = {},
): Promise<NewsroomContentSnapshot> {
  if (!apiOrigin) {
    throw new NewsroomSnapshotFetchError('missing_api_origin');
  }

  let contentUrl: URL;
  try {
    const origin = new URL(apiOrigin);
    if (
      !['http:', 'https:'].includes(origin.protocol) ||
      origin.username ||
      origin.password
    ) {
      throw new Error('unsupported protocol');
    }
    contentUrl = new URL('/api/newsroom/content', origin.origin);
  } catch {
    throw new NewsroomSnapshotFetchError('invalid_api_origin');
  }

  const cacheKey = contentUrl.origin;
  const now = Date.now();
  const cached = publicSnapshotCache.get(cacheKey);
  const cachedAgeMs = cached ? Math.max(0, now - cached.fetchedAt) : undefined;
  if (cached && cachedAgeMs !== undefined && cachedAgeMs <= PUBLIC_SNAPSHOT_FRESH_MS) {
    options.onEvent?.({
      phase: 'snapshot_cache_hit',
      cacheState: 'fresh',
      cacheAgeMs: cachedAgeMs,
    });
    return cached.snapshot;
  }

  const pending = pendingSnapshotRequests.get(cacheKey);
  if (pending) {
    options.onEvent?.({
      phase: 'snapshot_request_joined',
      sharedRequestId: pending.requestId,
    });
    return pending.promise;
  }

  const request = (async (): Promise<NewsroomContentSnapshot> => {
  const controller = new AbortController();
    const timeoutMs = options.timeoutMs ?? DEFAULT_NEWSROOM_API_TIMEOUT_MS;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const upstreamStartedAt = performance.now();
    let responseStatus: number | undefined;
    let bodyReadMs: number | undefined;
    let bodyBytes: number | undefined;
    let jsonParseMs: number | undefined;
    let failureCode = 'fetch_failed';

    options.onEvent?.({ phase: 'snapshot_fetch_start', timeoutMs });

  try {
      const response = await fetch(contentUrl, {
        signal: controller.signal,
        cache: 'no-store',
        headers: {
          accept: 'application/json',
          ...(options.requestId ? { 'X-GAN-Request-ID': options.requestId } : {}),
        },
      });
      responseStatus = response.status;
      options.onEvent?.({
        phase: 'snapshot_fetch_headers',
        statusCode: response.status,
        elapsedMs: Math.round(performance.now() - upstreamStartedAt),
      });
      if (!response.ok) {
        failureCode = 'http_status';
        throw new NewsroomSnapshotFetchError(failureCode, response.status);
      }

      const bodyStartedAt = performance.now();
      const body = await response.text();
      bodyReadMs = Math.round(performance.now() - bodyStartedAt);
      bodyBytes = Buffer.byteLength(body, 'utf8');
      if (bodyBytes > MAX_NEWSROOM_SNAPSHOT_BYTES) {
        failureCode = 'snapshot_too_large';
        throw new NewsroomSnapshotFetchError(failureCode, response.status);
      }
      options.onEvent?.({
        phase: 'snapshot_body_received',
        statusCode: response.status,
        bodyReadMs,
      });

      let parsedSnapshot: unknown;
      const jsonStartedAt = performance.now();
      try {
        parsedSnapshot = JSON.parse(body);
      } catch {
        failureCode = 'invalid_json';
        throw new NewsroomSnapshotFetchError(failureCode, response.status);
      }
      jsonParseMs = Math.round(performance.now() - jsonStartedAt);
      if (!isNewsroomContentSnapshot(parsedSnapshot)) {
        failureCode = 'invalid_snapshot';
        throw new NewsroomSnapshotFetchError(failureCode, response.status);
      }

      cachePublicSnapshot(cacheKey, parsedSnapshot);
      options.onEvent?.({
        phase: 'snapshot_validated',
        statusCode: response.status,
        bodyReadMs,
        jsonParseMs,
        totalFetchMs: Math.round(performance.now() - upstreamStartedAt),
      });
      return parsedSnapshot;
    } catch (error) {
      if (controller.signal.aborted) {
        failureCode = 'timeout';
      } else if (error instanceof NewsroomSnapshotFetchError) {
        failureCode = error.code;
      }

      const failedAt = Date.now();
      options.onEvent?.({
        phase: 'snapshot_fetch_failed',
        failureCode,
        statusCode: responseStatus,
        bodyReadMs,
        jsonParseMs,
        totalFetchMs: Math.round(performance.now() - upstreamStartedAt),
      });

      const lastKnownGood = publicSnapshotCache.get(cacheKey);
      const staleAgeMs = lastKnownGood
        ? Math.max(0, failedAt - lastKnownGood.fetchedAt)
        : undefined;
      if (
        options.allowLastKnownGood !== false &&
        lastKnownGood &&
        staleAgeMs !== undefined &&
        staleAgeMs <= PUBLIC_SNAPSHOT_MAX_STALE_MS
      ) {
        options.onEvent?.({
          phase: 'snapshot_last_known_good_fallback',
          failureCode,
          statusCode: responseStatus,
          cacheAgeMs: staleAgeMs,
        });
        return lastKnownGood.snapshot;
      }

      throw new NewsroomSnapshotFetchError(failureCode, responseStatus);
    } finally {
      clearTimeout(timeout);
    }
  })();

  pendingSnapshotRequests.set(cacheKey, {
    promise: request,
    requestId: options.requestId,
  });
  try {
    return await request;
  } finally {
    if (pendingSnapshotRequests.get(cacheKey)?.promise === request) {
      pendingSnapshotRequests.delete(cacheKey);
    }
  }
}