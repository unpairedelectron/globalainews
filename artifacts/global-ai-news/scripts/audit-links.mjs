import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.resolve(
  projectRoot,
  process.env.PUBLICATION_OUTPUT_DIR ?? 'dist/public',
);
const siteUrl = new URL('https://globalainews.in');
const showAll = process.argv.includes('--all');

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function cleanPathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

function canonicalForPath(pathname) {
  const normalized = cleanPathname(pathname);
  return `${siteUrl.origin}${normalized === '/' ? '/' : `${normalized}/`}`;
}

function safeFileForPath(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return undefined;
  }
  const resolved = path.resolve(outputDir, `.${decodedPath}`);
  if (resolved !== outputDir && !resolved.startsWith(`${outputDir}${path.sep}`)) {
    return undefined;
  }
  if (!existsSync(resolved)) return undefined;
  const stat = statSync(resolved);
  if (stat.isDirectory()) {
    const indexPath = path.join(resolved, 'index.html');
    return existsSync(indexPath) && statSync(indexPath).isFile() ? indexPath : undefined;
  }
  return stat.isFile() ? resolved : undefined;
}

function readPageMetadata(filePath) {
  if (!filePath || !filePath.endsWith('.html')) {
    return { canonical: 'N/A', indexability: 'asset', html: undefined };
  }
  const html = readFileSync(filePath, 'utf8');
  const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  const canonical = canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? 'Not set';
  const robotsTag = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i)?.[0];
  const robots = robotsTag?.match(/\bcontent=["']([^"']+)["']/i)?.[1] ?? '';
  return {
    canonical: decodeHtml(canonical),
    indexability: /noindex/i.test(robots) ? 'noindex' : 'indexable',
    html,
  };
}

function routeFromIndexFile(filePath) {
  const relativeDirectory = path.relative(outputDir, path.dirname(filePath));
  if (!relativeDirectory || relativeDirectory === '.') return '/';
  return `/${relativeDirectory.split(path.sep).join('/')}/`;
}

function listIndexFiles(directory) {
  const found = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...listIndexFiles(fullPath));
    else if (entry.isFile() && entry.name === 'index.html') found.push(fullPath);
  }
  return found;
}

function extractAnchors(html) {
  const links = [];
  const expression = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of html.matchAll(expression)) {
    const href = decodeHtml(match[1] ?? match[2] ?? match[3] ?? '').trim();
    if (href) links.push(href);
  }
  return links;
}

if (!existsSync(outputDir)) {
  console.error(`Build output not found at ${outputDir}. Run build:release before audit:links.`);
  process.exit(1);
}

for (const documentName of ['sitemap.xml', 'feed.xml']) {
  if (existsSync(path.join(outputDir, documentName))) {
    console.error(`The release output must not contain static ${documentName}; the web service proxies it to the live newsroom API.`);
    process.exit(1);
  }
}

const routeFiles = listIndexFiles(outputDir);
const routeRecords = routeFiles.map((filePath) => {
  const route = cleanPathname(routeFromIndexFile(filePath));
  const metadata = readPageMetadata(filePath);
  return { route, filePath, ...metadata };
});
const routeByPath = new Map(routeRecords.map((record) => [cleanPathname(record.route), record]));
const rows = [];
const checkedLinks = new Set();

function addRow({ url, status, canonical, indexability, linkSource, issue = '' }) {
  rows.push({ url, status, canonical, indexability, linkSource, issue });
}

function checkInternalUrl(rawUrl, linkSource, expectedCanonical = false) {
  let target;
  try {
    const sourceBase = new URL(canonicalForPath(linkSource.startsWith('/') ? linkSource : '/'));
    target = new URL(rawUrl, sourceBase);
  } catch {
    addRow({
      url: rawUrl,
      status: 'invalid',
      canonical: 'Not set',
      indexability: 'unknown',
      linkSource,
      issue: 'Malformed URL.',
    });
    return;
  }

  const sameDomain = target.hostname.replace(/^www\./, '') === siteUrl.hostname.replace(/^www\./, '');
  if (!sameDomain || !['http:', 'https:'].includes(target.protocol)) return;

  const pathname = target.pathname || '/';
  const key = `${linkSource}|${target.href}`;
  if (checkedLinks.has(key)) return;
  checkedLinks.add(key);
  const filePath = safeFileForPath(pathname);
  const targetMetadata = readPageMetadata(filePath);
  const expected = canonicalForPath(pathname);
  let issue = '';
  if (!filePath) issue = 'No built file exists for this internal URL.';
  else if (
    expectedCanonical &&
    targetMetadata.canonical !== expected
  ) issue = `Canonical mismatch; expected ${expected}.`;
  else if (expectedCanonical && targetMetadata.indexability === 'noindex') {
    issue = 'A noindex route is included in an indexable publication file.';
  }
  else if (target.hash && targetMetadata.html) {
    let fragment = target.hash.slice(1);
    try {
      fragment = decodeURIComponent(fragment);
    } catch {
      // Keep the literal fragment and report it as missing below.
    }
    const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`\\b(?:id|name)=["']${escaped}["']`, 'i').test(targetMetadata.html)) {
      issue = `Fragment #${fragment} does not exist in the built page.`;
    }
  }

  addRow({
    url: target.href,
    status: filePath ? '200' : '404',
    canonical: targetMetadata.canonical,
    indexability: targetMetadata.indexability,
    linkSource,
    issue,
  });
}

for (const record of routeRecords) {
  const expectedCanonical = record.route.startsWith('/amp/')
    ? canonicalForPath(record.route.replace(/^\/amp(?=\/)/, ''))
    : canonicalForPath(record.route);
  const canonicalIssue = record.canonical === expectedCanonical
    ? ''
    : `Canonical mismatch; expected ${expectedCanonical}.`;
  addRow({
    url: `${siteUrl.origin}${record.route}`,
    status: '200',
    canonical: record.canonical,
    indexability: record.indexability,
    linkSource: 'built route',
    issue: canonicalIssue,
  });

  for (const href of extractAnchors(record.html ?? '')) {
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    checkInternalUrl(href, record.route);
  }
}

const reportDirectory = path.join(projectRoot, 'reports');
mkdirSync(reportDirectory, { recursive: true });
const reportPath = path.join(reportDirectory, 'link-audit.json');
writeFileSync(reportPath, `${JSON.stringify(rows, null, 2)}\n`);

const failures = rows.filter((row) => row.issue);
const internalLinks = rows.filter((row) => row.linkSource !== 'built route');
console.log(`Audited ${routeRecords.length} built routes and ${internalLinks.length} internal link/publication references.`);
console.log(`Found ${failures.length} issue(s). Full report: ${path.relative(projectRoot, reportPath)}`);
console.log('URL\tStatus\tCanonical\tIndexability\tLink Source\tIssue');
for (const row of showAll ? rows : failures) {
  console.log([
    row.url,
    row.status,
    row.canonical,
    row.indexability,
    row.linkSource,
    row.issue,
  ].join('\t'));
}

if (failures.length > 0) process.exitCode = 1;