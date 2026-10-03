import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express, { type Request, type Response } from 'express';

import { renderAmpArticleDocument } from './amp-html';
import { fetchNewsroomContentSnapshot, renderArticleHtml } from './server/article-html';
import { getSeoMetadata } from './seo-metadata';
import { renderSeoRouteHtml } from './seo-html';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const distributionDirectory = path.resolve(serverDirectory, '..');
const publicDirectory = path.join(distributionDirectory, 'public');
const templatePath = path.join(serverDirectory, 'index.template.html');
const baseHtml = readFileSync(templatePath, 'utf8');
const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error('PORT environment variable is required for the Global AI News web server.');
}

const port = Number(rawPort);
if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
  throw new Error(`Invalid PORT value: "${rawPort}".`);
}

const app = express();
app.disable('x-powered-by');

app.use((_request, response, next) => {
  response.setHeader(
    'X-GAN-Source-Revision',
    process.env.GAN_BUILD_SOURCE_REVISION ?? 'unavailable',
  );
  response.setHeader(
    'X-GAN-Web-Artifact-Revision',
    process.env.GAN_BUILD_WEB_ARTIFACT_REVISION ?? 'unavailable',
  );
  response.setHeader(
    'X-GAN-API-Artifact-Revision',
    process.env.GAN_BUILD_API_ARTIFACT_REVISION ?? 'unavailable',
  );
  next();
});

function proxyNewsroomXmlDocument(apiPath: string, defaultContentType: string) {
  return async (_request: Request, response: Response): Promise<void> => {
    const configuredOrigin = process.env.NEWSROOM_API_ORIGIN;
    if (!configuredOrigin) {
      response.status(503).type('text/plain').send('Newsroom document temporarily unavailable.');
      return;
    }

    let endpoint: URL;
    try {
      const configuredUrl = new URL(configuredOrigin);
      if (configuredUrl.protocol !== 'http:' && configuredUrl.protocol !== 'https:') {
        throw new Error('Unsupported newsroom API protocol.');
      }
      endpoint = new URL(apiPath, configuredUrl.origin);
    } catch {
      response.status(503).type('text/plain').send('Newsroom document temporarily unavailable.');
      return;
    }

    try {
      const upstream = await fetch(endpoint, {
        headers: { accept: defaultContentType },
        signal: AbortSignal.timeout(10_000),
      });
      const body = await upstream.text();
      response
        .status(upstream.status)
        .set('Content-Type', upstream.headers.get('content-type') ?? defaultContentType)
        .set('Cache-Control', upstream.headers.get('cache-control') ?? 'no-store')
        .send(body);
    } catch (error) {
      process.stderr.write(
        `Newsroom XML proxy failed: ${error instanceof Error ? error.message : 'unknown error'}\n`,
      );
      response.status(503).type('text/plain').send('Newsroom document temporarily unavailable.');
    }
  };
}

app.get('/feed.xml', proxyNewsroomXmlDocument('/api/newsroom/feed.xml', 'application/rss+xml'));
app.get('/sitemap.xml', proxyNewsroomXmlDocument('/api/newsroom/sitemap.xml', 'application/xml'));
app.get('/contact', (_request, response) => {
  response.redirect(308, '/contact-us');
});

app.use((request, response, next) => {
  const requestUrl = new URL(request.originalUrl, 'http://localhost');
  const pathname = requestUrl.pathname;
  if (pathname !== '/article' && !pathname.startsWith('/article/')) {
    next();
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.status(405).end();
    return;
  }

  void (async () => {
    const snapshot = await fetchNewsroomContentSnapshot(process.env.NEWSROOM_API_ORIGIN);
    const result = renderArticleHtml(
      baseHtml,
      pathname,
      publicDirectory,
      snapshot,
    );
    response.status(result.status);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    if (result.status === 404) response.setHeader('X-Robots-Tag', 'noindex');
    response.send(result.html);
  })().catch((error: unknown) => {
    process.stderr.write(
      `Article first-response rendering failed: ${error instanceof Error ? error.message : 'unknown error'}\n`,
    );
    if (response.headersSent) {
      response.destroy();
      return;
    }
    response.status(503);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Robots-Tag', 'noindex');
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Article temporarily unavailable — Global AI News</title></head><body><main><h1>Article temporarily unavailable</h1></main></body></html>',
    );
  });
});

const pendingEditorialRoutes = [
  '/about-us',
  '/code-of-ethics',
  '/corrections',
  '/contact-us',
];

app.get(pendingEditorialRoutes, async (request, response): Promise<void> => {
  const route = new URL(request.originalUrl, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
  try {
    const snapshot = await fetchNewsroomContentSnapshot(process.env.NEWSROOM_API_ORIGIN);
    const metadata = { ...getSeoMetadata(route, snapshot.stories), indexable: false };
    response.status(200);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Robots-Tag', 'noindex');
    response.send(renderSeoRouteHtml(baseHtml, route, metadata, snapshot));
  } catch (error) {
    process.stderr.write(
      `Editorial placeholder rendering failed: ${error instanceof Error ? error.message : 'unknown error'}\n`,
    );
    response.status(503);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Robots-Tag', 'noindex');
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page temporarily unavailable — Global AI News</title></head><body><main><h1>Page temporarily unavailable</h1></main></body></html>',
    );
  }
});

app.use(express.static(publicDirectory, { fallthrough: true }));

app.get('/amp/article/:slug', (request, response) => {
  const slug = request.params.slug;
  if (!slug || slug.includes('/') || slug.includes('\\')) {
    response.status(404);
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Robots-Tag', 'noindex');
    response.type('html').send(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page not found — Global AI News</title></head><body><main><h1>Page not found</h1></main></body></html>',
    );
    return;
  }

  void (async () => {
    const snapshot = await fetchNewsroomContentSnapshot(process.env.NEWSROOM_API_ORIGIN);
    const story = snapshot.stories.find((candidate) => candidate.slug === slug);
    if (!story) {
      response.status(404);
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('X-Robots-Tag', 'noindex');
      response.type('html').send(
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page not found — Global AI News</title></head><body><main><h1>Page not found</h1></main></body></html>',
      );
      return;
    }

    response.status(200);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.send(renderAmpArticleDocument(story, snapshot.authors, snapshot.sources));
  })().catch((error: unknown) => {
    process.stderr.write(
      `AMP article rendering failed: ${error instanceof Error ? error.message : 'unknown error'}\n`,
    );
    if (response.headersSent) {
      response.destroy();
      return;
    }
    response.status(503);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Robots-Tag', 'noindex');
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>AMP article temporarily unavailable — Global AI News</title></head><body><main><h1>AMP article temporarily unavailable</h1></main></body></html>',
    );
  });
});

app.use((request, response) => {
  const pathname = new URL(request.originalUrl, 'http://localhost').pathname;
  const authRoute = pathname.match(/^\/(sign-in|sign-up)(?:\/.*)?$/);
  if (authRoute) {
    response.sendFile(path.join(publicDirectory, authRoute[1], 'index.html'), (error) => {
      if (!error || response.headersSent) return;
      response.status(404);
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('X-Robots-Tag', 'noindex');
      response.type('html').send(
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page not found — Global AI News</title></head><body><main><h1>Page not found</h1></main></body></html>',
      );
    });
    return;
  }

  response.status(404);
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Robots-Tag', 'noindex');
  response.type('html').send(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page not found — Global AI News</title></head><body><main><h1>Page not found</h1></main></body></html>',
  );
});

app.listen(port, '0.0.0.0');