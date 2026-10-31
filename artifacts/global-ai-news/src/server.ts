import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import express, { type Request, type Response } from 'express';

import { renderAmpArticleDocument } from './amp-html';
import {
  ARTICLE_NOT_FOUND_HTML,
  fetchNewsroomContentSnapshot,
  hasPrerenderedArticleHtml,
  NewsroomSnapshotFetchError,
  parseArticleRoutePath,
  renderArticleHtml,
} from './server/article-html';
import { getSeoMetadata, SITE_URL } from './seo-metadata';
import { renderSeoRouteHtml } from './seo-html';
import { gzipResponseMiddleware } from './server/gzipResponseMiddleware';
import { checkNewsroomApiHealth, OperationalAlertManager } from './server/operational-alerts';

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
const operationalAlerts = new OperationalAlertManager({
  webhookUrl: process.env.OPS_ALERT_WEBHOOK_URL,
});
const publicDocumentCacheControl =
  'public, max-age=0, s-maxage=60, stale-while-revalidate=300';

function getRequestHost(request: Request): string {
  const forwardedHost = request.get('x-forwarded-host')?.split(',')[0]?.trim();
  return (forwardedHost ?? request.get('host') ?? '').toLowerCase().replace(/:\d+$/, '');
}

function setRobotsTag(response: Response, value = 'noindex'): void {
  response.setHeader(
    'X-Robots-Tag',
    response.locals.isPreviewHost === true ? 'noindex, nofollow' : value,
  );
}

function renderRestrictedSignupDocument(): string {
  const canonical = new URL('/sign-up/', SITE_URL).toString();
  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,follow">
    <title>Editor access — Global AI News</title>
    <link rel="canonical" href="${canonical}">
    <style>
      :root{color-scheme:light;--paper:#f7f6f2;--ink:#17232b;--blue:#1555a6;--muted:#4b5962;--rule:#d6d3ca}
      *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:var(--paper);color:var(--ink);font:16px/1.6 system-ui,sans-serif}
      main{width:min(100%,500px);border:1px solid var(--rule);background:#fffefa;padding:clamp(28px,7vw,48px)}
      p{margin:0} .eyebrow{color:var(--blue);font:600 12px/1.5 ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase}
      h1{margin:24px 0 16px;font:400 clamp(34px,8vw,48px)/1 Georgia,serif;letter-spacing:-.03em}
      .detail{color:var(--muted)}a{display:inline-flex;min-height:44px;align-items:center;margin-top:28px;padding:10px 18px;background:var(--blue);color:#fff;text-decoration:none;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase}
      a:focus-visible{outline:3px solid #17232b;outline-offset:3px}
    </style>
  </head>
  <body>
    <main aria-labelledby="editor-signup-title">
      <p class="eyebrow">Global AI News · Editor access</p>
      <h1 id="editor-signup-title">Accounts are invitation-only.</h1>
      <p class="detail">Self-service account creation is disabled. Newsroom access is limited to approved editors with a verified primary email. If you are an approved editor and cannot sign in, contact the newsroom administrator.</p>
      <a href="/sign-in/">Return to editor sign-in</a>
    </main>
  </body>
</html>`;
}

app.use((request, response, next) => {
  response.locals.isPreviewHost = getRequestHost(request) === 'global-ai-media.replit.app';
  if (response.locals.isPreviewHost) setRobotsTag(response, 'noindex, nofollow');
  if (new URL(request.originalUrl, SITE_URL).pathname.startsWith('/staging/')) {
    setRobotsTag(response, 'noindex, nofollow');
  }
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
app.use(gzipResponseMiddleware());

app.get('/healthz', (_request, response) => {
  response
    .status(200)
    .set('Cache-Control', 'no-store')
    .type('json')
    .send({ status: 'ok' });
});

const permanentRouteAliases = new Map([
  ['/about', '/about-us/'],
  ['/ethics', '/code-of-ethics/'],
  ['/contact', '/contact-us/'],
]);
const retiredStoryRedirects = new Map([
  ['/article/public-compute-needs-public-metrics', '/article/india-ai-compute-access-2026/'],
  ['/amp/article/public-compute-needs-public-metrics', '/article/india-ai-compute-access-2026/'],
]);
const uuidArticlePath = /^\/article\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?:\/[^/]+)?\/?$/i;

app.use((request, response, next) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    next();
    return;
  }

  const requestedUrl = new URL(request.originalUrl, SITE_URL);
  const pathname = requestedUrl.pathname;
  if (uuidArticlePath.test(pathname)) {
    response
      .status(410)
      .set('X-Robots-Tag', response.locals.isPreviewHost === true ? 'noindex, nofollow' : 'noindex')
      .type('text/plain')
      .send('This legacy article URL is no longer available.');
    return;
  }

  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const routeAlias = retiredStoryRedirects.get(cleanPath) ?? permanentRouteAliases.get(cleanPath);
  const host = getRequestHost(request);
  const forwardedProtocol = request.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  const protocol = forwardedProtocol ?? (request.secure ? 'https' : 'http');
  const canonicalOrigin = SITE_URL;
  const managedHost = host === 'globalainews.in' || host === 'www.globalainews.in';
  const isCanonicalHost = host === 'www.globalainews.in' && protocol === 'https';
  const canonicalArticlePath = managedHost
    && /^\/article\/[^/]+$/.test(cleanPath)
    && pathname !== `${cleanPath}/`
    ? `${cleanPath}/`
    : undefined;

  if (routeAlias || canonicalArticlePath || (managedHost && !isCanonicalHost)) {
    const destinationPath = routeAlias ?? canonicalArticlePath ?? pathname;
    const destination = managedHost
      ? `${canonicalOrigin}${destinationPath}${requestedUrl.search}`
      : `${destinationPath}${requestedUrl.search}`;
    response.redirect(301, destination);
    return;
  }
  next();
});

app.use((request, response, next) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    next();
    return;
  }
  const pathname = new URL(request.originalUrl, SITE_URL).pathname;
  if (!/^\/sign-up(?:\/.*)?$/.test(pathname)) {
    next();
    return;
  }
  response.status(200).setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  setRobotsTag(response, 'noindex,follow');
  response.send(renderRestrictedSignupDocument());
});

const adsTxtBody = readFileSync(path.join(publicDirectory, 'ads.txt'), 'utf8');
app.get('/ads.txt', (_request, response) => {
  response.status(200).type('text/plain').send(adsTxtBody);
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
app.get('/feed.json', proxyNewsroomXmlDocument('/api/newsroom/feed.json', 'application/feed+json'));
app.get('/sitemap.xml', proxyNewsroomXmlDocument('/api/newsroom/sitemap-index.xml', 'application/xml'));
app.get('/sitemap-articles.xml', proxyNewsroomXmlDocument('/api/newsroom/sitemap-articles.xml', 'application/xml'));
app.get('/sitemap-topics.xml', proxyNewsroomXmlDocument('/api/newsroom/sitemap-topics.xml', 'application/xml'));
app.get('/sitemap-authors.xml', proxyNewsroomXmlDocument('/api/newsroom/sitemap-authors.xml', 'application/xml'));
app.get('/sitemap-static.xml', proxyNewsroomXmlDocument('/api/newsroom/sitemap-static.xml', 'application/xml'));
app.get('/news-sitemap.xml', proxyNewsroomXmlDocument('/api/newsroom/news-sitemap.xml', 'application/xml'));
app.get('/topic/:slug/feed.xml', (request, response) => {
  const slug = encodeURIComponent(request.params.slug);
  return proxyNewsroomXmlDocument(`/api/newsroom/topic/${slug}/feed.xml`, 'application/rss+xml')(request, response);
});

function writeStructuredRenderLog(event: string, fields: Record<string, unknown>): void {
  process.stderr.write(
    `${JSON.stringify({ timestamp: new Date().toISOString(), event, ...fields })}\n`,
  );
}

app.use((request, response, next) => {
  const rawPathname = request.originalUrl.split(/[?#]/, 1)[0] || '/';
  const articlePath = parseArticleRoutePath(rawPathname);
  if (!articlePath.matched) {
    next();
    return;
  }
  if (!articlePath.slug) {
    response.status(404);
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    setRobotsTag(response);
    response.send(request.method === 'HEAD' ? undefined : ARTICLE_NOT_FOUND_HTML);
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    response.status(405).end();
    return;
  }

  const pathname = new URL(request.originalUrl, 'http://localhost').pathname;

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
    writeStructuredRenderLog(event, {
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

  if (hasPrerenderedArticleHtml(pathname, publicDirectory)) {
    next();
    return;
  }

  void (async () => {
    const snapshotStartedAt = performance.now();
    const snapshot = await fetchNewsroomContentSnapshot(
      process.env.NEWSROOM_API_ORIGIN,
      {
        requestId,
        route: pathname,
        allowLastKnownGood: false,
        onEvent: (diagnostic) =>
          writeStructuredRenderLog('article_snapshot_lookup', {
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
      publicDirectory,
      snapshot,
    );
    serverRenderMs = Math.round(performance.now() - renderStartedAt);
    routeStatus = result.status;
    response.status(result.status);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    const cacheablePublicArticle =
      result.status === 200 &&
      request.method === 'GET' &&
      !request.originalUrl.includes('?') &&
      response.locals.isPreviewHost !== true;
    response.setHeader(
      'Cache-Control',
      cacheablePublicArticle ? publicDocumentCacheControl : 'no-store',
    );
    if (result.status === 404) setRobotsTag(response);
    response.send(result.html);
  })().catch((error: unknown) => {
    routeStatus = 503;
    writeStructuredRenderLog('article_render_failed', {
      requestId,
      route: pathname,
      statusCode: 503,
      totalRenderMs: Math.round(performance.now() - startedAt),
      snapshotLookupMs,
      serverRenderMs,
      failureCode:
        error instanceof NewsroomSnapshotFetchError ? error.code : 'render_error',
    });
    void operationalAlerts.recordArticleRenderFailure(pathname, requestId);
    if (response.headersSent) {
      response.destroy();
      return;
    }
    response.status(503);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    setRobotsTag(response);
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
  '/privacy',
  '/terms',
  '/authors',
];

app.get(pendingEditorialRoutes, async (request, response): Promise<void> => {
  const route = new URL(request.originalUrl, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
  try {
    const snapshot = await fetchNewsroomContentSnapshot(process.env.NEWSROOM_API_ORIGIN);
    const metadata = getSeoMetadata(route, snapshot.stories);
    response.status(200);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    if (metadata.indexable === false) setRobotsTag(response);
    response.send(renderSeoRouteHtml(baseHtml, route, metadata, snapshot));
  } catch (error) {
    process.stderr.write(
      `Editorial placeholder rendering failed: ${error instanceof Error ? error.message : 'unknown error'}\n`,
    );
    response.status(503);
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    setRobotsTag(response);
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Page temporarily unavailable — Global AI News</title></head><body><main><h1>Page temporarily unavailable</h1></main></body></html>',
    );
  }
});

app.use((request, response, next) => {
  const route = new URL(request.originalUrl, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
  if (getSeoMetadata(route).indexable === false) setRobotsTag(response);
  next();
});

app.use(express.static(publicDirectory, {
  fallthrough: true,
  setHeaders(response, filePath) {
    const relativePath = path.relative(publicDirectory, filePath).split(path.sep).join('/');
    if (relativePath.endsWith('.avif')) response.setHeader('Content-Type', 'image/avif');
    if (relativePath.endsWith('.webp')) response.setHeader('Content-Type', 'image/webp');
    if (/^assets\/.+-[A-Za-z0-9_-]{8,}\.(?:css|js)$/.test(relativePath)) {
      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/^images\/editorial\/.+-(?:480|768|1024)\.(?:avif|webp)$/.test(relativePath)) {
      response.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }
  },
}));

app.get('/amp/article/:slug', (request, response) => {
  const slug = request.params.slug;
  if (!slug || slug.includes('/') || slug.includes('\\')) {
    response.status(404);
    response.setHeader('Cache-Control', 'no-store');
    setRobotsTag(response);
    response.type('html').send(
      ARTICLE_NOT_FOUND_HTML,
    );
    return;
  }

  void (async () => {
    const snapshot = await fetchNewsroomContentSnapshot(process.env.NEWSROOM_API_ORIGIN);
    const story = snapshot.stories.find((candidate) => candidate.slug === slug);
    if (!story) {
      response.status(404);
      response.setHeader('Cache-Control', 'no-store');
      setRobotsTag(response);
      response.type('html').send(
        ARTICLE_NOT_FOUND_HTML,
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
    setRobotsTag(response);
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
      setRobotsTag(response);
      response.type('html').send(
        ARTICLE_NOT_FOUND_HTML,
      );
    });
    return;
  }

  response.status(404);
  response.setHeader('Cache-Control', 'no-store');
  setRobotsTag(response);
  response.type('html').send(
    ARTICLE_NOT_FOUND_HTML,
  );
});

app.listen(port, '0.0.0.0', () => {
  if (process.env.NODE_ENV === 'production') {
    const healthCheck = () =>
      void checkNewsroomApiHealth(process.env.NEWSROOM_API_ORIGIN, operationalAlerts);
    healthCheck();
    const healthCheckTimer = setInterval(healthCheck, 30_000);
    healthCheckTimer.unref();
  }
  const requestId = randomUUID();
  const startedAt = performance.now();
  const route = '<startup-snapshot-warmup>';
  void fetchNewsroomContentSnapshot(process.env.NEWSROOM_API_ORIGIN, {
    requestId,
    route,
    onEvent: (diagnostic) =>
      writeStructuredRenderLog('article_snapshot_lookup', {
        requestId,
        route,
        ...diagnostic,
      }),
  })
    .then((snapshot) => {
      writeStructuredRenderLog('article_snapshot_warmup_complete', {
        requestId,
        route,
        elapsedMs: Math.round(performance.now() - startedAt),
      });
    })
    .catch((error: unknown) => {
      writeStructuredRenderLog('article_snapshot_warmup_failed', {
        requestId,
        route,
        elapsedMs: Math.round(performance.now() - startedAt),
        failureCode:
          error instanceof NewsroomSnapshotFetchError ? error.code : 'render_error',
      });
    });
});