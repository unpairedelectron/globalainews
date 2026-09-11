import path from 'path';
import { execFileSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { stories } from './src/content';
import {
  getSeoMetadata,
  getStructuredData,
  setSeoMetadataManifest,
  type SeoMetadataManifest,
} from './src/seo-metadata';

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

function escapeSvg(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function wrapPreviewTitle(title: string, maxCharacters = 34): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && candidate.length > maxCharacters) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function previewSvg(title: string, category: string, slug: string): string {
  const lines = wrapPreviewTitle(title);
  const hash = [...slug].reduce((total, character) => total + character.charCodeAt(0), 0);
  const accent = ['#006cff', '#b2472d', '#55704f', '#8b5e34'][hash % 4];
  const titleMarkup = lines
    .map((line, index) => `<text x="80" y="${268 + index * 66}" fill="#101820" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="700">${escapeSvg(line)}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">${escapeSvg(title)}</title>
  <desc id="desc">Global AI News editorial preview for ${escapeSvg(title)}</desc>
  <rect width="1200" height="630" fill="#f4f1ea"/>
  <circle cx="1000" cy="150" r="184" fill="none" stroke="${accent}" stroke-width="2"/>
  <circle cx="1000" cy="150" r="122" fill="none" stroke="${accent}" stroke-opacity=".42" stroke-width="2"/>
  <path d="M80 520H1120" stroke="${accent}" stroke-width="3"/>
  <path d="M80 532H420" stroke="#101820" stroke-opacity=".24"/>
  <text x="80" y="92" fill="${accent}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="3">GLOBAL AI NEWS</text>
  <text x="80" y="142" fill="#56616b" font-family="Arial, Helvetica, sans-serif" font-size="20" letter-spacing="1.5">${escapeSvg(category.toUpperCase())} / FIELD NOTE</text>
  ${titleMarkup}
  <text x="80" y="578" fill="#56616b" font-family="Arial, Helvetica, sans-serif" font-size="18">globalainews.in</text>
</svg>`;
}

function writeSocialPreviewAssets(outputDir: string) {
  const outputSocialDir = path.join(outputDir, 'social', 'articles');
  mkdirSync(outputSocialDir, { recursive: true });
  for (const story of stories) {
    const metadata = getSeoMetadata(`/article/${story.slug}`);
    if (!metadata.imagePath) continue;
    const outputPath = path.join(outputDir, metadata.imagePath.replace(/^\/+/, ''));
    execFileSync('magick', ['svg:-', outputPath], {
      input: previewSvg(metadata.title, story.category, story.slug),
      stdio: ['pipe', 'ignore', 'inherit'],
    });
  }
}

async function loadBuildMetadataManifest(): Promise<void> {
  const manifestUrl = process.env.NEWSROOM_METADATA_URL;
  if (!manifestUrl) {
    setSeoMetadataManifest(undefined);
    return;
  }

  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error(
      `Newsroom metadata manifest returned HTTP ${response.status} from ${manifestUrl}`,
    );
  }
  const manifest = (await response.json()) as SeoMetadataManifest;
  if (
    manifest.source !== 'maintained-editorial-source' ||
    !Array.isArray(manifest.routes)
  ) {
    throw new Error('Newsroom metadata manifest has an invalid shape.');
  }
  setSeoMetadataManifest(manifest);
}

function socialPreviewAssetsPlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-social-preview-assets',
    configureServer() {
      writeSocialPreviewAssets(path.join(projectRoot, 'public'));
    },
    handleHotUpdate({ file }: { file: string }) {
      if (file === path.join(projectRoot, 'src', 'content.ts')) {
        writeSocialPreviewAssets(path.join(projectRoot, 'public'));
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
      const outputDir = path.join(projectRoot, 'dist', 'public');
      await loadBuildMetadataManifest();
      const baseHtml = readFileSync(path.join(outputDir, 'index.html'), 'utf8');
      writeSocialPreviewAssets(outputDir);
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
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
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
