import path from 'path';
import { execFileSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type ViteDevServer } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { authors, findStory, getPublishedStories, stories, type NewsroomContentSnapshot, type Story } from './src/content';
import {
  getCanonicalUrl,
  getSeoMetadata,
  getStructuredData,
  setSeoMetadataManifest,
  type SeoMetadataManifest,
} from './src/seo-metadata';
import { SeoPrerender } from './src/seo-prerender';
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
const ampArticlePath = '/amp/article/ai-models-antibiotic-discovery/';

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
function formatPublishedDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

function renderAmpArticleDocument() {
  const story = findStory('ai-models-antibiotic-discovery');
  if (!story) throw new Error('AMP article source story is missing: ai-models-antibiotic-discovery');
  const metadata = getSeoMetadata(`/article/${story.slug}`);
  const author = authors.find((candidate) => candidate.slug === story.author);
  const sections = story.body.map((section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n          ')}
          ${section.pullQuote ? `<blockquote>${escapeHtml(section.pullQuote)}</blockquote>` : ''}
        </section>`).join('\n');

  return `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
    <link rel="canonical" href="${escapeHtml(getCanonicalUrl(metadata.path))}" />
    <title>${escapeHtml(story.title)}</title>
    <meta name="description" content="${escapeHtml(story.dek)}" />
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <style amp-boilerplate>
      body { visibility: hidden }
    </style>
    <noscript><style amp-boilerplate>body { visibility: visible }</style></noscript>
    <style amp-custom>
      :root { --ink: #132632; --paper: #f4f1ea; --teal: #1f8584; --coral: #dc654f; }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); color: var(--ink); font-family: Arial, sans-serif; }
      header, main, footer { max-width: 760px; margin: auto; padding: 24px; }
      header { border-bottom: 1px solid rgba(19,38,50,.2); }
      .brand { color: var(--teal); font-size: 12px; letter-spacing: .18em; font-weight: 700; }
      .kicker { color: var(--coral); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; margin-top: 52px; }
      h1 { font-family: Georgia, serif; font-size: clamp(42px, 9vw, 76px); font-weight: 400; line-height: .94; margin: 16px 0; }
      .dek { font-size: 20px; line-height: 1.5; color: rgba(19,38,50,.7); }
      .byline { border-block: 1px solid rgba(19,38,50,.2); padding: 16px 0; margin: 24px 0 40px; font-size: 13px; }
      .hero { background: #193b3e; color: white; padding: 42px 24px; border-radius: 16px; font-family: Georgia, serif; font-size: 34px; }
      article { font-family: Georgia, serif; font-size: 20px; line-height: 1.7; }
      article h2 { font-size: 34px; line-height: 1; font-weight: 400; margin-top: 52px; }
      blockquote { border-left: 3px solid var(--coral); padding-left: 20px; margin: 36px 0; font-size: 25px; }
      .ad { border: 1px dashed rgba(19,38,50,.35); padding: 24px; margin: 42px 0; text-align: center; font: 11px Arial, sans-serif; letter-spacing: .15em; }
      footer { border-top: 1px solid rgba(19,38,50,.2); color: rgba(19,38,50,.65); font-size: 12px; }
    </style>
  </head>
  <body>
    <header><div class="brand">GLOBAL AI NEWS</div></header>
    <main>
      <div class="kicker">${escapeHtml(story.category)} · ${escapeHtml(story.readTime)}</div>
      <h1>${escapeHtml(story.title)}</h1>
      <p class="dek">${escapeHtml(story.dek)}</p>
      <div class="byline">${author ? `<strong>${escapeHtml(author.name)}</strong> · ${escapeHtml(author.role)}` : '<strong>Byline unavailable</strong>'} · ${formatPublishedDate(story.date)}</div>
      <div class="hero">${escapeHtml(story.imageTreatment.caption)}</div>
      <article>
        <p><strong>${escapeHtml(story.bottomLine)}</strong></p>
        ${sections}
        <div class="ad">NATIVE AD · CLEARLY LABELED INVENTORY</div>
      </article>
    </main>
    <footer>Independent newsroom · No noise by design · <a href="https://www.globalainews.in/">Return to Global AI News</a></footer>
  </body>
</html>`;
}

function writeAmpArticleDocument(outputDir: string) {
  const outputPath = path.join(outputDir, ampArticlePath.replace(/^\/+/, ''), 'index.html');
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderAmpArticleDocument());
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
  sourceStories: readonly typeof stories = getPublishedStories(),
  metadataManifest?: SeoMetadataManifest,
) {
  const outputSocialDir = path.join(outputDir, 'social', 'articles');
  mkdirSync(outputSocialDir, { recursive: true });
  const generatedSlugs = new Set<string>();
  for (const story of sourceStories) {
    const route = `/article/${story.slug}`;
    const title = `${story.title} — Global AI News`;
    const outputPath = path.join(outputDir, 'social', 'articles', `${story.slug}.png`);
    const svg = renderSocialPreviewSvg(title, story.category, story.slug);
    execFileSync('magick', ['svg:-', '-set', 'comment', title, outputPath], {
      input: svg,
      stdio: ['pipe', 'ignore', 'inherit'],
    });
    validatePreviewAsset(outputPath, route, svg, title);
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

  for (const route of routePathsFromPublishingFiles(projectRoot)) {
    if (!routeMetadata.has(route)) {
      throw new Error(
        `Newsroom metadata manifest from ${manifestUrl} is missing published route "${route}".`,
      );
    }
  }
  setSeoMetadataManifest(manifest);
  return manifest;
}

function socialPreviewAssetsPlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-social-preview-assets',
    configureServer(server: ViteDevServer) {
      writeSocialPreviewAssets(path.join(projectRoot, 'public'));
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
        writeSocialPreviewAssets(path.join(projectRoot, 'public'), refreshedContent.stories);
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
        if (requestPath !== ampArticlePath) {
          next();
          return;
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(renderAmpArticleDocument());
      });
    },
    handleHotUpdate({ file }: { file: string }) {
      if (file === path.join(projectRoot, 'src', 'content.ts')) {
        writeAmpArticleDocument(path.join(projectRoot, 'public'));
      }
    },
  };
}

function routePathsFromPublishingFiles(
  projectRoot: string,
  metadataManifest?: SeoMetadataManifest,
): string[] {
  const sitemap = readFileSync(path.join(projectRoot, 'public', 'sitemap.xml'), 'utf8');
  const feed = readFileSync(path.join(projectRoot, 'public', 'feed.xml'), 'utf8');
  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const feedPaths = [...feed.matchAll(/<link>([^<]+)<\/link>/g)].map((match) => new URL(match[1]).pathname);
  const manifestPaths = metadataManifest?.routes.map((metadata) => metadata.path) ?? [];
  return [
    ...new Set(
      ['/', ...sitemapPaths, ...feedPaths, ...manifestPaths].map((route) => {
        const trimmed = route.trim() || '/';
        return trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : '/';
      }),
    ),
  ];
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function writeSitemap(outputDir: string, metadataManifest: SeoMetadataManifest): void {
  const routes = metadataManifest.routes.filter((metadata) => metadata.indexable !== false);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${routes
    .map((metadata) => {
      const lastmod = metadata.lastmod
        ? `<lastmod>${escapeXml(metadata.lastmod)}</lastmod>`
        : '';
      const image = metadata.imagePath
        ? `<image:image><image:loc>${escapeXml(`https://www.globalainews.in${metadata.imagePath}`)}</image:loc><image:title>${escapeXml(metadata.title)}</image:title></image:image>`
        : '';
      return `  <url><loc>${escapeXml(getCanonicalUrl(metadata.path))}</loc>${lastmod}${image}</url>`;
    })
    .join('\n')}\n</urlset>`;
  writeFileSync(path.join(outputDir, 'sitemap.xml'), body);
}

function withRouteMetadata(
  baseHtml: string,
  route: string,
  metadataManifest: SeoMetadataManifest,
): string {
  const metadata = metadataManifest.routes.find((candidate) => candidate.path === route) ??
    getSeoMetadata(route, metadataManifest.stories);
  const canonical = getCanonicalUrl(metadata.path);
  const contentSnapshot = metadataManifest.contentSnapshot;
  if (!contentSnapshot) {
    throw new Error('Cannot prerender publication routes without the API newsroom content snapshot.');
  }
  const publishedStories = metadataManifest.stories ?? contentSnapshot.stories ?? getPublishedStories();
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonicalUrl = escapeHtml(canonical);
  const socialType = metadata.article ? 'article' : 'website';
  const imageTags = metadata.imagePath
    ? `
    <meta property="og:image" content="${escapeHtml(`https://www.globalainews.in${metadata.imagePath}`)}" />
    <meta property="og:image:alt" content="${escapeHtml(metadata.imageAlt ?? metadata.title)}" />
    <meta property="og:image:type" content="image/png" />
    <meta name="twitter:image" content="${escapeHtml(`https://www.globalainews.in${metadata.imagePath}`)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(metadata.imageAlt ?? metadata.title)}" />`
    : '';
  const existingHeadMetadata = [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta\b[^>]*name=["']robots["'][^>]*>\s*/gi,
    /<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|og:url|og:type|og:image|og:image:alt|og:image:type|twitter:title|twitter:description|twitter:card|twitter:image|twitter:image:alt)["'][^>]*>\s*/gi,
    /<link\b[^>]*rel=["'](?:canonical|amphtml)["'][^>]*>\s*/gi,
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi,
  ];
  let html = baseHtml;
  for (const pattern of existingHeadMetadata) html = html.replace(pattern, '');

  const ampLink = metadata.ampPath
    ? `\n    <link rel="amphtml" href="${escapeHtml(`https://www.globalainews.in${metadata.ampPath}`)}" />`
    : '';
  const headMetadata = `    <title>${title}</title>
    <meta name="description" content="${description}" />
    ${metadata.indexable === false ? '<meta name="robots" content="noindex,follow" />' : ''}
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${socialType}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />${imageTags}${ampLink}
    <script type="application/ld+json" data-global-ai-ld>${getStructuredData(metadata, publishedStories, contentSnapshot.authors)}</script>
`;
  html = html.replace('</head>', `${headMetadata}  </head>`);
  const prerenderPublicNoindexRoutes = new Set([
    '/search',
    '/reports',
    '/topics',
    '/archive',
    '/about-us',
    '/code-of-ethics',
    '/corrections',
    '/contact-us',
  ]);
  const shouldPrerender = metadata.indexable !== false || prerenderPublicNoindexRoutes.has(route);
  const prerenderedBody = shouldPrerender
    ? renderToStaticMarkup(
        createElement(SeoPrerender, {
          route,
          metadata,
          snapshot: contentSnapshot,
        }),
      )
    : '';
  const bootstrapMarker = shouldPrerender
    ? '<script id="global-ai-prerender" type="application/json">{}</script>'
    : '';
  return html.replace(
    /<div\s+id=["']root["']>\s*<\/div>/,
    `<div id="root">${prerenderedBody}</div>${bootstrapMarker}`,
  );
}

function routeMetadataPlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-route-metadata',
    apply: 'build' as const,
    async closeBundle() {
      const outputDir = buildOutputDir(projectRoot);
      const metadataManifest = await loadBuildMetadataManifest(projectRoot);
      const baseHtml = readFileSync(path.join(outputDir, 'index.html'), 'utf8');
      writeSitemap(outputDir, metadataManifest);
      writeSocialPreviewAssets(
        outputDir,
        metadataManifest.stories ?? getPublishedStories(),
        metadataManifest,
      );
      writeAmpArticleDocument(outputDir);
      for (const route of routePathsFromPublishingFiles(projectRoot, metadataManifest)) {
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

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
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
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});

function isSocialPreviewPath(url: string | undefined): boolean {
  if (!url) return false;
  return socialPreviewPathPattern.test(
    new URL(url, 'http://127.0.0.1').pathname,
  );
}
