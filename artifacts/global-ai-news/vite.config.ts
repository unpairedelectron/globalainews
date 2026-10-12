import path from 'path';
import { randomUUID } from 'crypto';
import { execFileSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { performance } from 'perf_hooks';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type ViteDevServer } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import type { NewsroomContentSnapshot, Story } from './src/content';
import { renderAmpArticleDocument } from './src/amp-html';
import {
  getCanonicalUrl,
  getSeoMetadata,
  getStructuredData,
  setSeoMetadataManifest,
  type SeoMetadataManifest,
} from './src/seo-metadata';
import {
  NewsroomSnapshotFetchError,
  getPrerenderedArticleHtmlPath,
  fetchNewsroomContentSnapshot,
  hasPrerenderedArticleHtml,
  renderArticleHtml,
} from './src/server/article-html';
import { renderSeoRouteHtml } from './src/seo-html';
import {
  layoutPreviewTitle,
  previewTitleColor,
  previewTitleContrastLumaMax,
  previewTitleMaskFuzz,
  previewTitlePixelRegion,
  renderSocialPreviewSvg,
  socialPreviewAccent,
  socialPreviewHeight,
  socialPreviewTitleMaxWidth,
  socialPreviewWidth,
} from './src/social-preview';
const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;
const newsroomXmlProxy = {
  '/feed.xml': {
    target: process.env.NEWSROOM_API_ORIGIN ?? 'http://localhost:80',
    changeOrigin: true,
    rewrite: () => '/api/newsroom/feed.xml',
  },
  '/sitemap.xml': {
    target: process.env.NEWSROOM_API_ORIGIN ?? 'http://localhost:80',
    changeOrigin: true,
    rewrite: () => '/api/newsroom/sitemap.xml',
  },
};

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

function writeAmpArticleDocument(
  outputDir: string,
  story: Story,
  authorRecords: NewsroomContentSnapshot['authors'],
  sourceRecords: NewsroomContentSnapshot['sources'],
) {
  const outputPath = path.join(outputDir, 'amp', 'article', story.slug, 'index.html');
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderAmpArticleDocument(story, authorRecords, sourceRecords));
}

function writeAmpArticleDocuments(
  outputDir: string,
  publishedStories: Story[],
  authorRecords: NewsroomContentSnapshot['authors'],
  sourceRecords: NewsroomContentSnapshot['sources'],
) {
  for (const story of publishedStories) {
    if (!getSeoMetadata(`/article/${story.slug}`, publishedStories).ampPath) continue;
    writeAmpArticleDocument(outputDir, story, authorRecords, sourceRecords);
  }
}
function escapeSvg(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
function previewAccent(slug: string): string {
  return socialPreviewAccent(slug);
}

function hexToRgb(hex: string): string {
  return `${Number.parseInt(hex.slice(1, 3), 16)},${Number.parseInt(hex.slice(3, 5), 16)},${Number.parseInt(hex.slice(5, 7), 16)}`;
}

function validatePreviewAsset(outputPath: string, route: string, svg: string, title: string) {
  const layout = layoutPreviewTitle(title, route);
  const renderedTitle = layout.lines.join(' ');
  if (renderedTitle !== title.trim().replace(/\s+/g, ' ')) {
    throw new Error(`${route}: preview card headline was truncated before publishing.`);
  }
  if (layout.lines.some((line) => line.length > layout.maxCharacters)) {
    throw new Error(`${route}: preview card headline line exceeds its wrapping limit.`);
  }
  if (!svg.includes(`<title id="title">${escapeSvg(title)}</title>`)) {
    throw new Error(`${route}: preview card title treatment is missing from the generated artwork.`);
  }

  const pixels = execFileSync(
    'magick',
    [outputPath, '-format', '%wx%h %[pixel:p{0,0}] %[pixel:p{100,520}] %[fx:mean]', 'info:'],
    { encoding: 'utf8' },
  ).trim().split(/\s+/);
  const [dimensions, background, accent, mean] = pixels;
  if (dimensions !== `${socialPreviewWidth}x${socialPreviewHeight}`) {
    throw new Error(`${route}: preview card dimensions are ${dimensions || 'unknown'}, expected ${socialPreviewWidth}x${socialPreviewHeight}.`);
  }
  if (!background.includes('244,241,234')) {
    throw new Error(`${route}: preview card is missing the warm-ivory background.`);
  }
  const expectedAccent = hexToRgb(previewAccent(route.split('/').pop() ?? route));
  if (!accent.includes(expectedAccent)) {
    throw new Error(`${route}: preview card accent rule is missing.`);
  }
  if (layout.lines.some((line) => line.length * layout.fontSize * 0.56 > socialPreviewTitleMaxWidth)) {
    throw new Error(`${route}: preview card headline overflows its readable title area.`);
  }
  if (Number(mean) >= 0.93) {
    throw new Error(`${route}: preview card title treatment is blank or unreadable.`);
  }

  const region = previewTitlePixelRegion(layout);
  const regionGeometry = `${region.width}x${region.height}+${region.x}+${region.y}`;
  const contrastLuma = Number(
    execFileSync(
      'magick',
      [
        outputPath,
        '-crop',
        `720x${region.height}+${region.x}+${region.y}`,
        '+repage',
        '-colorspace',
        'gray',
        '-format',
        '%[fx:minima]',
        'info:',
      ],
      { encoding: 'utf8' },
    ).trim(),
  );
  if (!Number.isFinite(contrastLuma) || contrastLuma > previewTitleContrastLumaMax) {
    throw new Error(
      `${route}: preview card headline contrast is too low in the rendered headline region ` +
        `(minimum luma ${Number.isFinite(contrastLuma) ? contrastLuma.toFixed(3) : 'unknown'}, ` +
        `maximum ${previewTitleContrastLumaMax.toFixed(2)}).`,
    );
  }

  const inkBounds = execFileSync(
    'magick',
    [
      outputPath,
      '-crop',
      regionGeometry,
      '+repage',
      '-fuzz',
      previewTitleMaskFuzz,
      '-fill',
      'black',
      '-opaque',
      previewTitleColor,
      '-fill',
      'white',
      '+opaque',
      'black',
      '-trim',
      '-format',
      '%@',
      'info:',
    ],
    { encoding: 'utf8' },
  ).trim();
  const inkBoundsMatch = inkBounds.match(/^(\d+)x(\d+)\+(-?\d+)\+(-?\d+)$/);
  if (!inkBoundsMatch) {
    throw new Error(`${route}: preview card headline pixels are missing from the rendered headline region.`);
  }
  const [, inkWidth, inkHeight, inkX, inkY] = inkBoundsMatch;
  if (Number(inkX) + Number(inkWidth) >= region.width || Number(inkY) + Number(inkHeight) >= region.height) {
    throw new Error(
      `${route}: preview card headline pixels are clipped at the rendered headline region edge ` +
        `(bounds ${inkBounds}, region ${regionGeometry}).`,
    );
  }
}

function writeSocialPreviewAssets(
  outputDir: string,
  sourceStories: readonly Story[],
  metadataManifest?: SeoMetadataManifest,
) {
  mkdirSync(path.join(outputDir, 'social'), { recursive: true });
  const outputSocialDir = path.join(outputDir, 'social', 'articles');
  mkdirSync(outputSocialDir, { recursive: true });
  const generatedSlugs = new Set<string>();
  for (const story of sourceStories) {
    writeSocialPreviewAsset(outputDir, story);
    generatedSlugs.add(story.slug);
  }

  for (const metadata of metadataManifest?.routes ?? []) {
    const match = metadata.path.match(/^\/article\/([^/]+)$/);
    if (!match || generatedSlugs.has(match[1])) continue;
    const slug = match[1];
    const outputPath = path.join(outputDir, 'social', 'articles', `${slug}.png`);
    const svg = renderSocialPreviewSvg(metadata.title, 'Field Notes', slug);
    execFileSync('magick', ['svg:-', '-set', 'comment', metadata.title, outputPath], {
      input: svg,
      stdio: ['pipe', 'ignore', 'inherit'],
    });
    validatePreviewAsset(outputPath, metadata.path, svg, metadata.title);
  }

  const defaultTitle = getSeoMetadata('/').description;
  const defaultDescription = getSeoMetadata('/').title;
  const defaultSlug = 'global-ai-news-default';
  const defaultSvg = renderSocialPreviewSvg(defaultTitle, defaultDescription, defaultSlug);
  const defaultImagePath = path.join(outputDir, 'social', `${defaultSlug}.png`);
  execFileSync('magick', ['svg:-', '-set', 'comment', defaultTitle, defaultImagePath], {
    input: defaultSvg,
    stdio: ['pipe', 'ignore', 'inherit'],
  });
  validatePreviewAsset(
    defaultImagePath,
    `/social/${defaultSlug}`,
    defaultSvg,
    defaultTitle,
  );
}

function writeSocialPreviewAsset(outputDir: string, story: Story) {
  const route = `/article/${story.slug}`;
  const title = `${story.title} — Global AI News`;
  const outputPath = path.join(outputDir, 'social', 'articles', `${story.slug}.png`);
  mkdirSync(path.dirname(outputPath), { recursive: true });
  const svg = renderSocialPreviewSvg(title, story.category, story.slug);
  execFileSync('magick', ['svg:-', '-set', 'comment', title, outputPath], {
    input: svg,
    stdio: ['pipe', 'ignore', 'inherit'],
  });
  validatePreviewAsset(outputPath, route, svg, title);
}

const socialPreviewPathPattern = /^\/social\/articles\/[^/]+\.png(?:\?.*)?$/;
const metadataManifestMaxAgeMs = 15 * 60 * 1000;

function buildOutputDir(projectRoot: string): string {
  return path.resolve(
    projectRoot,
    process.env.PUBLICATION_OUTPUT_DIR ?? 'dist/public',
  );
}

async function loadBuildMetadataManifest(projectRoot: string): Promise<SeoMetadataManifest> {
  const manifestUrl = process.env.NEWSROOM_METADATA_URL;
  if (!manifestUrl) {
    throw new Error(
      'NEWSROOM_METADATA_URL is required for production publication builds. ' +
        'Set it to the current /api/newsroom/metadata endpoint.',
    );
  }

  let parsedManifestUrl: URL;
  try {
    parsedManifestUrl = new URL(manifestUrl);
  } catch {
    throw new Error(
      `NEWSROOM_METADATA_URL is not a valid URL: "${manifestUrl}".`,
    );
  }
  if (!['http:', 'https:'].includes(parsedManifestUrl.protocol)) {
    throw new Error(
      `NEWSROOM_METADATA_URL must use http or https: "${manifestUrl}".`,
    );
  }

  let response: Response;
  try {
    response = await fetch(parsedManifestUrl);
  } catch (error) {
    throw new Error(
      `Could not fetch newsroom metadata manifest from ${manifestUrl}: ${String(error)}`,
    );
  }
  if (!response.ok) {
    throw new Error(
      `Newsroom metadata manifest returned HTTP ${response.status} from ${manifestUrl}`,
    );
  }

  let manifest: SeoMetadataManifest;
  try {
    manifest = (await response.json()) as SeoMetadataManifest;
  } catch (error) {
    throw new Error(
      `Newsroom metadata manifest from ${manifestUrl} was not valid JSON: ${String(error)}`,
    );
  }
  if (!manifest || typeof manifest !== 'object') {
    throw new Error(
      `Newsroom metadata manifest from ${manifestUrl} has an invalid shape.`,
    );
  }

  const generatedAt = Date.parse(manifest.generatedAt);
  if (!Number.isFinite(generatedAt)) {
    throw new Error(
      `Newsroom metadata manifest from ${manifestUrl} has an invalid generatedAt timestamp.`,
    );
  }
  const manifestAge = Date.now() - generatedAt;
  if (manifestAge > metadataManifestMaxAgeMs) {
    throw new Error(
      `Newsroom metadata manifest from ${manifestUrl} is stale: ` +
        `generated ${Math.round(manifestAge / 60_000)} minutes ago; ` +
        `maximum age is ${metadataManifestMaxAgeMs / 60_000} minutes.`,
    );
  }
  if (manifestAge < -metadataManifestMaxAgeMs) {
    throw new Error(
      `Newsroom metadata manifest from ${manifestUrl} has a generatedAt timestamp too far in the future.`,
    );
  }
  if (
    manifest.source !== 'maintained-editorial-source' ||
    !Array.isArray(manifest.routes) ||
    manifest.routes.length === 0
  ) {
    throw new Error(
      `Newsroom metadata manifest from ${manifestUrl} has an invalid shape.`,
    );
  }

  const contentUrl = new URL(parsedManifestUrl);
  if (!/\/newsroom\/metadata\/?$/.test(contentUrl.pathname)) {
    throw new Error(
      `Newsroom metadata URL must end in /newsroom/metadata so its matching content snapshot can be loaded: ${manifestUrl}`,
    );
  }
  contentUrl.pathname = contentUrl.pathname.replace(/\/metadata\/?$/, '/content');
  contentUrl.search = '';
  let contentResponse: Response;
  try {
    contentResponse = await fetch(contentUrl);
  } catch (error) {
    throw new Error(
      `Could not fetch newsroom content snapshot from ${contentUrl}: ${String(error)}`,
    );
  }
  if (!contentResponse.ok) {
    throw new Error(
      `Newsroom content snapshot returned HTTP ${contentResponse.status} from ${contentUrl}`,
    );
  }

  let contentSnapshot: NewsroomContentSnapshot & { generatedAt?: string };
  try {
    contentSnapshot = (await contentResponse.json()) as NewsroomContentSnapshot & {
      generatedAt?: string;
    };
  } catch (error) {
    throw new Error(
      `Newsroom content snapshot from ${contentUrl} was not valid JSON: ${String(error)}`,
    );
  }
  if (!contentSnapshot || typeof contentSnapshot !== 'object') {
    throw new Error(
      `Newsroom content snapshot from ${contentUrl} has an invalid shape.`,
    );
  }
  const contentGeneratedAt = Date.parse(contentSnapshot.generatedAt ?? '');
  if (!Number.isFinite(contentGeneratedAt)) {
    throw new Error(
      `Newsroom content snapshot from ${contentUrl} has an invalid generatedAt timestamp.`,
    );
  }
  const contentAge = Date.now() - contentGeneratedAt;
  if (contentAge > metadataManifestMaxAgeMs) {
    throw new Error(
      `Newsroom content snapshot from ${contentUrl} is stale: ` +
        `generated ${Math.round(contentAge / 60_000)} minutes ago; ` +
        `maximum age is ${metadataManifestMaxAgeMs / 60_000} minutes.`,
    );
  }
  if (contentAge < -metadataManifestMaxAgeMs) {
    throw new Error(
      `Newsroom content snapshot from ${contentUrl} has a generatedAt timestamp too far in the future.`,
    );
  }
  const requiredSnapshotArrays: (keyof NewsroomContentSnapshot)[] = [
    'authors',
    'sources',
    'entities',
    'timelineEvents',
    'stories',
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
  if (requiredSnapshotArrays.some((key) => !Array.isArray(contentSnapshot[key]))) {
    throw new Error(
      `Newsroom content snapshot from ${contentUrl} is missing required content arrays.`,
    );
  }
  if (
    contentSnapshot.stories.some(
      (story) =>
        !story ||
        typeof story.slug !== 'string' ||
        typeof story.title !== 'string' ||
        typeof story.date !== 'string' ||
        !Array.isArray(story.body) ||
        !Array.isArray(story.sources),
    )
  ) {
    throw new Error(
      `Newsroom content snapshot from ${contentUrl} contains an invalid story record.`,
    );
  }
  manifest.contentSnapshot = contentSnapshot;
  manifest.stories = contentSnapshot.stories;

  if (manifest.stories !== undefined && !Array.isArray(manifest.stories)) {
    throw new Error(
      `Newsroom metadata manifest from ${manifestUrl} has an invalid article snapshot.`,
    );
  }

  const routeMetadata = new Map<string, SeoMetadataManifest['routes'][number]>();
  for (const metadata of manifest.routes) {
    if (
      !metadata ||
      typeof metadata.path !== 'string' ||
      !metadata.path.startsWith('/') ||
      typeof metadata.title !== 'string' ||
      metadata.title.trim().length === 0 ||
      typeof metadata.description !== 'string' ||
      metadata.description.trim().length === 0 ||
        (metadata.indexable !== undefined && typeof metadata.indexable !== 'boolean') ||
        (metadata.lastmod !== undefined &&
          (typeof metadata.lastmod !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(metadata.lastmod))) ||
      routeMetadata.has(metadata.path)
    ) {
      throw new Error(
        `Newsroom metadata manifest from ${manifestUrl} has an invalid or duplicate route entry.`,
      );
    }
    routeMetadata.set(metadata.path, metadata);
  }

  if (manifest.stories) {
    const storySlugs = new Set(manifest.stories.map((story) => story.slug));
    const missingStories = manifest.routes
      .map((metadata) => metadata.path.match(/^\/article\/([^/]+)$/)?.[1])
      .filter((slug): slug is string => Boolean(slug && !storySlugs.has(slug)));
    if (missingStories.length > 0) {
      throw new Error(
        `Newsroom article snapshot is missing published stories: ${missingStories.join(', ')}.`,
      );
    }
  }

  for (const route of routePathsFromPublishedContent(manifest)) {
    if (!routeMetadata.has(route)) {
      throw new Error(
        `Newsroom metadata manifest from ${manifestUrl} is missing published route "${route}".`,
      );
    }
  }
  setSeoMetadataManifest(manifest);
  return manifest;
}

function socialPreviewStorySignature(story: Story): string {
  return JSON.stringify([story.title, story.category]);
}

function socialPreviewAssetsPlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  let previewSignatures = new Map<string, string>();
  return {
    name: 'global-ai-news-social-preview-assets',
    async configureServer(server: ViteDevServer) {
      // Content is also a transitive Vite-config dependency through SEO and AMP
      // renderers. Keep it watched by the module graph for HMR, but don't restart
      // the whole dev server and regenerate every preview when an editor changes it.
      const contentPath = path.resolve(projectRoot, 'src', 'content.ts');
      server.config.configFileDependencies = server.config.configFileDependencies.filter(
        (dependency) => path.resolve(dependency) !== contentPath,
      );
      const content = await server.ssrLoadModule('/src/content.ts');
      const currentStories = content.stories as Story[];
      writeSocialPreviewAssets(
        path.join(projectRoot, 'public'),
        content.getPublishedStories() as Story[],
      );
      previewSignatures = new Map(
        currentStories.map(
          (story) => [story.slug, socialPreviewStorySignature(story)] as const,
        ),
      );
      server.middlewares.use((request, response, next) => {
        if (isSocialPreviewPath(request.url)) {
          response.setHeader('Cache-Control', 'no-cache');
        }
        next();
      });
    },
    async handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
      if (file === path.join(projectRoot, 'src', 'content.ts')) {
        const refreshedContent = await server.ssrLoadModule('/src/content.ts');
        const refreshedStories = refreshedContent.stories as Story[];
        for (const story of refreshedStories) {
          if (previewSignatures.get(story.slug) !== socialPreviewStorySignature(story)) {
            writeSocialPreviewAsset(path.join(projectRoot, 'public'), story);
          }
        }
        previewSignatures = new Map(
          refreshedStories.map(
            (story) => [story.slug, socialPreviewStorySignature(story)] as const,
          ),
        );
      }
    },
  };
}

function ampArticlePlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-amp-article',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((request, response, next) => {
        const requestPath = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
        if (!requestPath.startsWith('/amp/article/')) {
          next();
          return;
        }
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          response.statusCode = 405;
          response.setHeader('Allow', 'GET, HEAD');
          response.end();
          return;
        }
        const match = requestPath.match(/^\/amp\/article\/([^/]+)\/?$/);
        if (!match) {
          response.statusCode = 404;
          response.setHeader('Cache-Control', 'no-store');
          response.setHeader('X-Robots-Tag', 'noindex');
          response.end('Not found');
          return;
        }
        let slug: string;
        try {
          slug = decodeURIComponent(match[1]);
        } catch {
          response.statusCode = 404;
          response.setHeader('Cache-Control', 'no-store');
          response.setHeader('X-Robots-Tag', 'noindex');
          response.end('Not found');
          return;
        }
        if (slug.includes('/') || slug.includes('\\')) {
          response.statusCode = 404;
          response.setHeader('Cache-Control', 'no-store');
          response.setHeader('X-Robots-Tag', 'noindex');
          response.end('Not found');
          return;
        }
        void (async () => {
          const snapshot = await fetchNewsroomContentSnapshot(process.env.NEWSROOM_API_ORIGIN);
          const story = snapshot.stories.find((candidate) => candidate.slug === slug);
          if (!story) {
            response.statusCode = 404;
            response.setHeader('Cache-Control', 'no-store');
            response.setHeader('X-Robots-Tag', 'noindex');
            response.end('Not found');
            return;
          }
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.end(
            request.method === 'HEAD'
              ? undefined
              : renderAmpArticleDocument(story, snapshot.authors, snapshot.sources),
          );
        })().catch((error: unknown) => {
          process.stderr.write(
            `AMP article rendering failed: ${error instanceof Error ? error.message : 'unknown error'}\n`,
          );
          if (response.headersSent) {
            response.destroy();
            return;
          }
          response.statusCode = 503;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.setHeader('X-Robots-Tag', 'noindex');
          response.end(
            '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>AMP article temporarily unavailable — Global AI News</title></head><body><main><h1>AMP article temporarily unavailable</h1></main></body></html>',
          );
        });
      });
    },
    async handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
      if (file === path.join(projectRoot, 'src', 'content.ts')) {
        const content = await server.ssrLoadModule('/src/content.ts');
        writeAmpArticleDocuments(
          path.join(projectRoot, 'public'),
          content.getPublishedStories() as Story[],
          content.authors,
          content.sources,
        );
      }
    },
  };
}

function routePathsFromPublishedContent(
  metadataManifest: SeoMetadataManifest,
): string[] {
  const sourceStoryPaths = (metadataManifest.stories ?? []).map(
    (story) => `/article/${story.slug}`,
  );
  const manifestPaths = metadataManifest.routes.map((metadata) => metadata.path);
  return [
    ...new Set(
      ['/', ...sourceStoryPaths, ...manifestPaths].map((route) => {
        const trimmed = route.trim() || '/';
        return trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : '/';
      }),
    ),
  ];
}

function withRouteMetadata(
  baseHtml: string,
  route: string,
  metadataManifest: SeoMetadataManifest,
): string {
  const metadata = metadataManifest.routes.find((candidate) => candidate.path === route) ??
    getSeoMetadata(route, metadataManifest.stories);
  const contentSnapshot = metadataManifest.contentSnapshot;
  if (!contentSnapshot) {
    throw new Error('Cannot prerender publication routes without the API newsroom content snapshot.');
  }
  return renderSeoRouteHtml(baseHtml, route, metadata, contentSnapshot);
}

function routeMetadataPlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-route-metadata',
    apply: 'build' as const,
    async writeBundle() {
      const outputDir = buildOutputDir(projectRoot);
      const metadataManifest = await loadBuildMetadataManifest(projectRoot);
      const contentSnapshot = metadataManifest.contentSnapshot;
      const publishedStories = metadataManifest.stories;
      if (!contentSnapshot || !publishedStories) {
        throw new Error('Cannot generate publication assets without the API newsroom content snapshot.');
      }
      const baseHtml = readFileSync(path.join(outputDir, 'index.html'), 'utf8');
      const serverOutputDir = path.resolve(outputDir, '..', 'server');
      mkdirSync(serverOutputDir, { recursive: true });
      writeFileSync(path.join(serverOutputDir, 'index.template.html'), baseHtml);
      writeSocialPreviewAssets(
        outputDir,
        publishedStories,
        metadataManifest,
      );
      writeAmpArticleDocuments(
        outputDir,
        publishedStories,
        contentSnapshot.authors,
        contentSnapshot.sources,
      );
      for (const route of routePathsFromPublishedContent(metadataManifest)) {
        const routeDirectory = route === '/' ? outputDir : path.join(outputDir, route.replace(/^\/|\/$/g, ''));
        mkdirSync(routeDirectory, { recursive: true });
        writeFileSync(
          path.join(routeDirectory, 'index.html'),
          withRouteMetadata(baseHtml, route, metadataManifest),
        );
      }
    },
  };
}

function writeStructuredArticleLog(event: string, fields: Record<string, unknown>): void {
  process.stderr.write(
    `${JSON.stringify({ timestamp: new Date().toISOString(), event, ...fields })}\n`,
  );
}

function articleResponsePlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-article-first-response',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((request, response, next) => {
        const requestUrl = request.url ?? '/';
        const pathname = new URL(requestUrl, 'http://localhost').pathname;
        const cleanPath = pathname.replace(/\/+$/, '') || '/';
        const query = requestUrl.includes('?') ? requestUrl.slice(requestUrl.indexOf('?')) : '';
        if (request.method === 'GET' || request.method === 'HEAD') {
          const aliases: Record<string, string> = {
            '/about': '/about-us/',
            '/ethics': '/code-of-ethics/',
            '/contact': '/contact-us/',
            '/article/public-compute-needs-public-metrics': '/article/india-ai-compute-access-2026/',
            '/amp/article/public-compute-needs-public-metrics': '/article/india-ai-compute-access-2026/',
          };
          const alias = aliases[cleanPath];
          if (alias) {
            response.statusCode = 301;
            response.setHeader('Location', `${alias}${query}`);
            response.end();
            return;
          }
        }
        if (pathname !== '/article' && !pathname.startsWith('/article/')) {
          next();
          return;
        }
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          next();
          return;
        }

        if (/^\/article\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?:\/[^/]+)?\/?$/i.test(pathname)) {
          response.statusCode = 410;
          response.setHeader('X-Robots-Tag', 'noindex');
          response.setHeader('Content-Type', 'text/plain; charset=utf-8');
          response.end('This legacy article URL is no longer available.');
          return;
        }

        const requestId = randomUUID();
        const startedAt = performance.now();
        response.setHeader('X-GAN-Request-ID', requestId);
        let snapshotLookupMs = 0;
        let serverRenderMs = 0;
        let routeStatus: number | undefined;
        let completionLogged = false;
        const logCompletion = (event: string): void => {
          if (completionLogged) return;
          completionLogged = true;
          writeStructuredArticleLog(event, {
            requestId,
            route: pathname,
            statusCode: routeStatus ?? response.statusCode,
            totalRenderMs: Math.round(performance.now() - startedAt),
            snapshotLookupMs,
            serverRenderMs,
          });
        };
        response.once('finish', () => logCompletion('article_render_complete'));
        response.once('close', () => {
          if (!response.writableFinished) logCompletion('article_render_connection_closed');
        });

        if (hasPrerenderedArticleHtml(pathname, path.join(projectRoot, 'public'))) {
          next();
          return;
        }
        const prerenderedArticlePath = getPrerenderedArticleHtmlPath(
          pathname,
          buildOutputDir(projectRoot),
        );
        if (prerenderedArticlePath) {
          routeStatus = 200;
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(
            request.method === 'HEAD' ? undefined : readFileSync(prerenderedArticlePath),
          );
          return;
        }

        void (async () => {
          const rawTemplate = readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
          const baseHtml = await server.transformIndexHtml(requestUrl, rawTemplate);
          const snapshotStartedAt = performance.now();
          const snapshot = await fetchNewsroomContentSnapshot(
            process.env.NEWSROOM_API_ORIGIN,
            {
              requestId,
              route: pathname,
              onEvent: (diagnostic) =>
                writeStructuredArticleLog('article_snapshot_lookup', {
                  requestId,
                  route: pathname,
                  ...diagnostic,
                }),
            },
          );
          snapshotLookupMs = Math.round(performance.now() - snapshotStartedAt);
          const renderStartedAt = performance.now();
          const result = renderArticleHtml(
            baseHtml,
            pathname,
            path.join(projectRoot, 'public'),
            snapshot,
          );
          serverRenderMs = Math.round(performance.now() - renderStartedAt);
          routeStatus = result.status;
          response.statusCode = result.status;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          if (result.status === 404) response.setHeader('X-Robots-Tag', 'noindex');
          response.end(result.html);
        })().catch((error: unknown) => {
          routeStatus = 503;
          writeStructuredArticleLog('article_render_failed', {
            requestId,
            route: pathname,
            statusCode: routeStatus,
            totalRenderMs: Math.round(performance.now() - startedAt),
            snapshotLookupMs,
            serverRenderMs,
            failureCode:
              error instanceof NewsroomSnapshotFetchError ? error.code : 'render_error',
          });
          if (response.headersSent) {
            response.destroy();
            return;
          }
          response.statusCode = 503;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.setHeader('X-Robots-Tag', 'noindex');
          response.end(
            '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Article temporarily unavailable — Global AI News</title></head><body><main><h1>Article temporarily unavailable</h1></main></body></html>',
          );
        });
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    articleResponsePlugin(),
    socialPreviewAssetsPlugin(),
    ampArticlePlugin(),
    routeMetadataPlugin(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: buildOutputDir(path.resolve(import.meta.dirname)),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: newsroomXmlProxy,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: newsroomXmlProxy,
  },
});

function isSocialPreviewPath(url: string | undefined): boolean {
  if (!url) return false;
  return socialPreviewPathPattern.test(
    new URL(url, 'http://127.0.0.1').pathname,
  );
}
