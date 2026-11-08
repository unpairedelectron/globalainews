// Zero-dependency production server for the static build in ./dist.
// - 301 redirects for every old URL (see redirects.mjs)
// - apex -> www canonical host redirect
// - trailing-slash normalisation, real 404 status, gzip, cache headers
// Run: PORT=3000 node server.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { redirects, prefixRedirects } from './redirects.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.env.PORT || 3000);
const CANONICAL_HOST = process.env.CANONICAL_HOST || 'www.globalainews.in';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.xml', '.txt', '.json', '.svg']);
const gzCache = new Map();

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function redirect(res, location, code = 301) {
  res.writeHead(code, { Location: location, 'Cache-Control': 'public, max-age=3600', ...SECURITY_HEADERS });
  res.end();
}

function resolveFile(pathname) {
  const safe = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(ROOT, safe);
  if (!full.startsWith(ROOT)) return null;
  try {
    const stat = fs.statSync(full);
    if (stat.isFile()) return full;
    if (stat.isDirectory()) {
      const index = path.join(full, 'index.html');
      if (fs.existsSync(index)) return index;
    }
  } catch {}
  return null;
}

function cacheControl(file) {
  if (file.includes(`${path.sep}_astro${path.sep}`)) return 'public, max-age=31536000, immutable';
  if (/\.(woff2|webp|avif|png|jpe?g|svg|ico)$/.test(file)) return 'public, max-age=2592000';
  if (/\.xml$/.test(file)) return 'public, max-age=900';
  return 'public, max-age=300, must-revalidate';
}

function send(req, res, file, status = 200) {
  const ext = path.extname(file).toLowerCase();
  const headers = {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': status === 200 ? cacheControl(file) : 'no-store',
    ...SECURITY_HEADERS,
  };
  let body = fs.readFileSync(file);
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    let gz = gzCache.get(file);
    if (!gz) { gz = zlib.gzipSync(body, { level: 9 }); gzCache.set(file, gz); }
    body = gz;
    headers['Content-Encoding'] = 'gzip';
    headers.Vary = 'Accept-Encoding';
  }
  headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
  const url = new URL(req.url, `http://${req.headers.host || CANONICAL_HOST}`);
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().split(':')[0];

  if (url.pathname === '/healthz') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }

  // Canonical host (apex -> www). HTTPS is enforced by the hosting proxy.
  if (host === 'globalainews.in') {
    return redirect(res, `https://${CANONICAL_HOST}${url.pathname}${url.search}`);
  }

  let pathname = url.pathname.replace(/\/{2,}/g, '/');
  const withSlash = pathname.endsWith('/') ? pathname : `${pathname}/`;

  // Explicit redirects (checked with and without trailing slash).
  const target = redirects[pathname] || redirects[withSlash];
  if (target) return redirect(res, target + url.search);
  for (const [from, to] of prefixRedirects) {
    if (pathname.startsWith(from)) {
      const rest = pathname.slice(from.length).replace(/\/?$/, '/');
      return redirect(res, to + rest);
    }
  }

  // Add the trailing slash for page routes (not files).
  if (!pathname.endsWith('/') && !path.extname(pathname)) {
    if (resolveFile(withSlash)) return redirect(res, withSlash + url.search);
  }

  const file = resolveFile(pathname);
  if (file) return send(req, res, file);
  send(req, res, path.join(ROOT, '404.html'), 404);
});

server.listen(PORT, '0.0.0.0', () => console.log(`Global AI News serving ${ROOT} on :${PORT}`));
