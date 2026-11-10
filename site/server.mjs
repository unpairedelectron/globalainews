// Zero-dependency production server for the static build in ./dist.
// - 301 redirects for every old URL (see redirects.mjs)
// - apex -> www canonical host redirect
// - trailing-slash normalisation, real 404 status, gzip, cache headers
// - scheduled publishing: rebuilds itself when an article's publish time passes
// - content sync: pulls new articles from GitHub main and publishes them
// - /build-info.json: build time and content-sync status
// Run: PORT=3000 node server.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { redirects, prefixRedirects } from './redirects.mjs';
import { astroBin } from './scripts/astro-bin.mjs';

const SITE_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(SITE_DIR, 'dist');
// The folder being served. Rebuilds switch this to a fresh folder instead of
// renaming `dist`: on Replit deployments `dist` can't be renamed (EXDEV).
let root = ROOT;
const PORT = Number(process.env.PORT || 3000);
const CANONICAL_HOST = process.env.CANONICAL_HOST || 'www.globalainews.in';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
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
  const full = path.join(root, safe);
  if (!full.startsWith(root)) return null;
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
  if (url.pathname === '/build-info.json') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
    return res.end(JSON.stringify({ buildTime: new Date(buildTime() || 0).toISOString(), contentSync: syncStatus }));
  }

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
  send(req, res, path.join(root, '404.html'), 404);
});

// ---------------------------------------------------------------- scheduled publishing
// Articles with a future `date` are left out of the build. When one of those
// times passes, rebuild into dist-next and swap it in, so scheduled articles go
// live without a manual Republish. Disable with AUTO_PUBLISH=false.
const ARTICLES_DIR = path.join(SITE_DIR, 'src', 'content', 'articles');
let building = false;

function buildTime() {
  try { return Date.parse(fs.readFileSync(path.join(root, '.build-time'), 'utf8').trim()) || 0; } catch { return 0; }
}

function scheduledDue(since, now = Date.now()) {
  let due = false;
  for (const f of fs.readdirSync(ARTICLES_DIR)) {
    if (!f.endsWith('.md')) continue;
    const head = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8').slice(0, 2000);
    const m = head.match(/^date:\s*"?([^"\n]+)"?\s*$/m);
    const t = m ? Date.parse(m[1]) : NaN;
    if (t > since && t <= now) due = true;
  }
  return due;
}

function run(cmd, args, env) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: SITE_DIR, env: { ...process.env, ...env }, stdio: 'inherit' });
    p.on('close', (code) => resolve(code === 0));
    p.on('error', () => resolve(false));
  });
}

function sitemapUrls(dir) {
  try { return [...fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]); } catch { return []; }
}

// Tell IndexNow-enabled search engines (Bing, Yandex, Seznam, Naver...) about new URLs.
async function pingIndexNow(urls) {
  if (!urls.length || process.env.INDEXNOW === 'false') return;
  const key = fs.readdirSync(root).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.slice(0, 32);
  if (!key) return;
  urls = [...urls, `https://${CANONICAL_HOST}/`, `https://${CANONICAL_HOST}/latest/`];
  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: CANONICAL_HOST, key, keyLocation: `https://${CANONICAL_HOST}/${key}.txt`, urlList: urls }),
    });
    console.log(`[indexnow] submitted ${urls.length} URL(s): HTTP ${r.status}`);
  } catch (err) {
    console.error('[indexnow] failed', err.message);
  }
}

// Builds into a new folder, runs every gate, and serves it only if all pass.
async function rebuild(reason) {
  const name = `dist-live-${Date.now()}`;
  const next = path.join(SITE_DIR, name);
  console.log(`[publish] ${reason}; rebuilding`);
  const env = { ASTRO_OUT_DIR: name, ASTRO_TELEMETRY_DISABLED: '1' };
  const ok = (await run(process.execPath, ['scripts/lint-articles.mjs'], env))
    && (await run(process.execPath, [astroBin(SITE_DIR), 'build'], env))
    && (await run(process.execPath, ['scripts/check-build.mjs'], env));
  if (!ok) {
    fs.rmSync(next, { recursive: true, force: true });
    console.error('[publish] gates failed; keeping the current build');
    return false;
  }
  const before = sitemapUrls(root);
  const previous = root;
  root = next;
  gzCache.clear();
  if (previous !== ROOT) fs.rmSync(previous, { recursive: true, force: true });
  console.log(`[publish] new build is live from ${name}`);
  pingIndexNow(sitemapUrls(root).filter((u) => !before.includes(u)));
  return true;
}

async function maybeRebuild() {
  if (building || process.env.AUTO_PUBLISH === 'false') return;
  if (!scheduledDue(buildTime())) return;
  building = true;
  try { await rebuild('scheduled article due'); }
  catch (err) { console.error('[publish] error', err); }
  finally { building = false; }
}

// ---------------------------------------------------------------- content sync
// Every 10 minutes, check GitHub `main`. If articles or article images changed,
// pull them, rebuild with every gate, and go live; on any failure, restore the
// previous content and keep serving the current build. Code is never pulled.
// Disable with CONTENT_SYNC=false.
const SHA_FILE = path.join(SITE_DIR, '.content-sha');
let lastSha = (() => { try { return fs.readFileSync(SHA_FILE, 'utf8').trim(); } catch { return ''; } })();
let failedSha = '';
let syncStatus = { lastCheck: null, sha: lastSha || null, result: 'not run' };

function sameAsCurrent(files) {
  let count = 0;
  for (const [rel, data] of files) {
    count++;
    try { if (!fs.readFileSync(path.join(SITE_DIR, rel)).equals(data)) return false; } catch { return false; }
  }
  const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? walk(path.join(d, e.name)) : 1), 0) : 0;
  return count === walk(path.join(SITE_DIR, 'src/content/articles')) + walk(path.join(SITE_DIR, 'public/images/articles'));
}

async function syncContent() {
  if (building || process.env.CONTENT_SYNC === 'false') return;
  building = true;
  syncStatus.lastCheck = new Date().toISOString();
  try {
    const { latestSha, fetchContent, applyContent } = await import('./scripts/content-sync.mjs');
    const sha = await latestSha();
    if (sha === lastSha || sha === failedSha) { syncStatus.result = sha === failedSha ? `skipped ${sha.slice(0, 7)} (failed gates earlier)` : 'up to date'; return; }
    const files = await fetchContent(sha);
    if (sameAsCurrent(files)) {
      lastSha = sha; fs.writeFileSync(SHA_FILE, sha);
      syncStatus = { ...syncStatus, sha, result: 'content unchanged' };
      return;
    }
    const tx = applyContent(SITE_DIR, files);
    if (await rebuild(`content update from GitHub ${sha.slice(0, 7)}`)) {
      tx.commit();
      lastSha = sha; fs.writeFileSync(SHA_FILE, sha);
      syncStatus = { ...syncStatus, sha, result: `published ${sha.slice(0, 7)}` };
    } else {
      tx.restore();
      failedSha = sha;
      syncStatus.result = `gates failed for ${sha.slice(0, 7)}; previous content restored`;
    }
  } catch (err) {
    syncStatus.result = `error: ${err.message}`;
    console.error('[content-sync]', err.message);
  } finally {
    building = false;
  }
}

setTimeout(maybeRebuild, 5_000);
setInterval(maybeRebuild, 5 * 60_000).unref();
setTimeout(syncContent, 20_000);
setInterval(syncContent, 10 * 60_000).unref();

server.listen(PORT, '0.0.0.0', () => console.log(`Global AI News serving ${root} on :${PORT}`));
