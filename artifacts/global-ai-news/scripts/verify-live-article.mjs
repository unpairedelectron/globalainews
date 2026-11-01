import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const articlesRoot = path.join(workspaceRoot, 'docs/editorial-drafts/articles');
const slug = process.argv.slice(2).find((argument) => argument !== '--')?.trim();

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run verify:live -- <article-slug>');
  process.exit(2);
}

const metadataPath = path.join(articlesRoot, `${slug}.meta.json`);
if (!existsSync(metadataPath)) {
  console.error(`No approved article metadata found for "${slug}".`);
  process.exit(2);
}

const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
const canonical = new URL(metadata.canonical);
const override = process.env.LIVE_VERIFY_BASE_URL?.trim();
const target = override ? new URL(canonical.pathname, override) : canonical;

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function readAttribute(tag, name) {
  return tag?.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] ?? '';
}

try {
  const response = await fetch(target, { redirect: 'follow' });
  const html = await response.text();
  const failures = [];
  if (!response.ok) failures.push(`HTTP ${response.status}`);

  const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  const liveCanonical = decodeHtml(readAttribute(canonicalTag, 'href'));
  if (liveCanonical !== metadata.canonical) failures.push('canonical URL does not match the approved article route');

  const robotsTag = html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i)?.[0];
  const robots = readAttribute(robotsTag, 'content');
  const headerRobots = response.headers.get('x-robots-tag') ?? '';
  if (/noindex/i.test(`${robots} ${headerRobots}`)) failures.push('the live route is still marked noindex');

  const title = decodeHtml(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim();
  if (!title.includes(metadata.title)) failures.push('page title does not match approved metadata');
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) failures.push('page does not contain exactly one H1');

  const jsonLd = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  if (!jsonLd) {
    failures.push('NewsArticle structured data is missing');
  } else {
    try {
      const schema = JSON.parse(jsonLd);
      const graph = Array.isArray(schema['@graph']) ? schema['@graph'] : [schema];
      const article = graph.find((item) => item['@type'] === 'NewsArticle');
      if (!article) failures.push('NewsArticle schema node is missing');
      else {
        if (!String(article.datePublished ?? '').trim()) failures.push('datePublished is missing');
        if (article.url !== metadata.canonical) failures.push('structured-data URL does not match the approved article route');
      }
    } catch {
      failures.push('NewsArticle structured data is not valid JSON');
    }
  }

  if (failures.length) {
    console.error(`Live verification failed for ${slug} at ${response.url}:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS ${slug}: HTTP ${response.status}, indexable, canonical and NewsArticle metadata verified.`);
  }
} catch (error) {
  console.error(`Live verification could not reach ${target}: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
