import path from 'path';
import { execFileSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type ViteDevServer } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { authors, findStory, getPublishedStories, stories } from './src/content';
import {
  getSeoMetadata,
  getStructuredData,
  setSeoMetadataManifest,
  type SeoMetadataManifest,
} from './src/seo-metadata';
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
    <link rel="canonical" href="${escapeHtml(`https://www.globalainews.in${metadata.path}`)}" />
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
      <div class="byline"><strong>${escapeHtml(author?.name ?? story.author)}</strong> · ${escapeHtml(author?.role ?? 'Global AI News editor')} · ${formatPublishedDate(story.date)}</div>
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
) {
  const outputSocialDir = path.join(outputDir, 'social', 'articles');
  mkdirSync(outputSocialDir, { recursive: true });
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

async function loadBuildMetadataManifest(projectRoot: string): Promise<void> {
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
      routeMetadata.has(metadata.path)
    ) {
      throw new Error(
        `Newsroom metadata manifest from ${manifestUrl} has an invalid or duplicate route entry.`,
      );
    }
    routeMetadata.set(metadata.path, metadata);
  }

  for (const route of routePathsFromPublishingFiles(projectRoot)) {
    if (!routeMetadata.has(route)) {
      throw new Error(
        `Newsroom metadata manifest from ${manifestUrl} is missing published route "${route}".`,
      );
    }
  }
  setSeoMetadataManifest(manifest);
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

function routePathsFromPublishingFiles(projectRoot: string): string[] {
  const sitemap = readFileSync(path.join(projectRoot, 'public', 'sitemap.xml'), 'utf8');
  const feed = readFileSync(path.join(projectRoot, 'public', 'feed.xml'), 'utf8');
  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const feedPaths = [...feed.matchAll(/<link>([^<]+)<\/link>/g)].map((match) => new URL(match[1]).pathname);
  return [...new Set(['/', ...sitemapPaths, ...feedPaths].map((route) => route.trim() || '/'))];
}

function withRouteMetadata(baseHtml: string, route: string): string {
  const metadata = getSeoMetadata(route);
  const canonical = `https://www.globalainews.in${metadata.path}`;
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
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${socialType}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />${imageTags}${ampLink}
    <script type="application/ld+json" data-global-ai-ld>${getStructuredData(metadata)}</script>
`;
  return html.replace('</head>', `${headMetadata}  </head>`);
}

function routeMetadataPlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-route-metadata',
    apply: 'build' as const,
    async closeBundle() {
      const outputDir = buildOutputDir(projectRoot);
      await loadBuildMetadataManifest(projectRoot);
      const baseHtml = readFileSync(path.join(outputDir, 'index.html'), 'utf8');
      writeSocialPreviewAssets(outputDir);
      writeAmpArticleDocument(outputDir);
      for (const route of routePathsFromPublishingFiles(projectRoot)) {
        const routeDirectory = route === '/' ? outputDir : path.join(outputDir, route.replace(/^\/|\/$/g, ''));
        mkdirSync(routeDirectory, { recursive: true });
        writeFileSync(path.join(routeDirectory, 'index.html'), withRouteMetadata(baseHtml, route));
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
