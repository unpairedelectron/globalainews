import path from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import { getSeoMetadata, getStructuredData } from './src/seo-metadata';

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
  const existingHeadMetadata = [
    /<title>[\s\S]*?<\/title>\s*/gi,
    /<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|og:url|og:type|twitter:title|twitter:description|twitter:card)["'][^>]*>\s*/gi,
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
    <meta name="twitter:description" content="${description}" />${ampLink}
    <script type="application/ld+json" data-global-ai-ld>${getStructuredData(metadata)}</script>
`;
  return html.replace('</head>', `${headMetadata}  </head>`);
}

function routeMetadataPlugin() {
  const projectRoot = path.resolve(import.meta.dirname);
  return {
    name: 'global-ai-news-route-metadata',
    apply: 'build' as const,
    closeBundle() {
      const outputDir = path.join(projectRoot, 'dist', 'public');
      const baseHtml = readFileSync(path.join(outputDir, 'index.html'), 'utf8');
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
