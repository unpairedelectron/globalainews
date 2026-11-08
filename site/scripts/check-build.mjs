// Post-build: writes Cloudflare Pages _redirects/_headers and runs SEO checks
// on every generated page. Fails the build on errors.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { redirects, prefixRedirects } from '../redirects.mjs';

const SITE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(SITE_DIR, process.env.ASTRO_OUT_DIR || 'dist');
const SITE = 'https://www.globalainews.in';

// ---- Cloudflare Pages / Netlify config
const lines = [
  'https://globalainews.in/* https://www.globalainews.in/:splat 301!',
  ...Object.entries(redirects).flatMap(([from, to]) =>
    from.endsWith('/') ? [`${from.replace(/\/$/, '')} ${to} 301`, `${from} ${to} 301`] : [`${from} ${to} 301`]),
  ...prefixRedirects.map(([from, to]) => `${from}* ${to}:splat 301`),
];
fs.writeFileSync(path.join(ROOT, '_redirects'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(ROOT, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=2592000
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`);

// ---- SEO checks
const errors = [];
const warnings = [];
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) files.push(p);
  }
})(ROOT);

const titles = new Map();
const descs = new Map();
let pages = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = '/' + path.relative(ROOT, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  if (html.includes('http-equiv="refresh"')) continue; // redirect stub
  pages++;
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (!title) errors.push(`${rel}: missing <title>`);
  else if (title.length > 70 && !noindex) warnings.push(`${rel}: title ${title.length} chars`);
  if (!desc) errors.push(`${rel}: missing meta description`);
  else if ((desc.length < 70 || desc.length > 200) && !noindex) warnings.push(`${rel}: description ${desc.length} chars`);
  if (!canonical) errors.push(`${rel}: missing canonical`);
  if (h1 !== 1) errors.push(`${rel}: ${h1} <h1> elements`);
  if (!noindex) {
    if (titles.has(title)) errors.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
    if (descs.has(desc)) errors.push(`${rel}: duplicate description with ${descs.get(desc)}`);
    descs.set(desc, rel);
  }
  // Internal links and assets must resolve.
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const url = m[1];
    if (url.startsWith('//')) continue;
    const target = path.join(ROOT, decodeURIComponent(url));
    const ok = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
    if (!ok) errors.push(`${rel}: broken link ${url}`);
    else if (!path.extname(url) && !url.endsWith('/')) warnings.push(`${rel}: link without trailing slash ${url}`);
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) errors.push(`${rel}: <img> without alt: ${m[0].slice(0, 80)}`);
  }
}

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const p = m[1].replace(SITE, '');
  if (!fs.existsSync(path.join(ROOT, p, 'index.html'))) errors.push(`sitemap: ${p} does not exist`);
}

console.log(`\nChecked ${pages} pages.`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);
if (errors.length) { console.error(`\n${errors.length} error(s).`); process.exit(1); }
// Build timestamp: the server uses it to know when scheduled articles need a rebuild.
fs.writeFileSync(path.join(ROOT, '.build-time'), new Date().toISOString());
console.log('SEO checks passed.');
