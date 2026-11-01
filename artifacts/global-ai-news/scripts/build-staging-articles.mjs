import { copyFileSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const artifactRoot = path.resolve(workspaceRoot, 'artifacts/global-ai-news');
const draftsRoot = path.resolve(workspaceRoot, 'docs/editorial-drafts');
const registryPath = path.join(workspaceRoot, 'release/article-registry.json');
const outputRoot = path.join(artifactRoot, 'public/staging');
const markdown = new MarkdownIt({ html: true, linkify: true, typographer: false });
const releases = JSON.parse(readFileSync(registryPath, 'utf8')).entries;
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const dateLabel = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'long',
  timeZone: 'Asia/Kolkata',
}).format(new Date(`${value}T07:30:00Z`));
const atomicWrite = (filePath, content) => {
  const temporaryPath = `${filePath}.tmp-${process.pid}`;
  writeFileSync(temporaryPath, content);
  renameSync(temporaryPath, filePath);
};
const atomicCopy = (sourcePath, outputPath) => {
  const temporaryPath = `${outputPath}.tmp-${process.pid}`;
  copyFileSync(sourcePath, temporaryPath);
  renameSync(temporaryPath, outputPath);
};

markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const href = token.attrGet('href') ?? '';
  if (/^https?:\/\//i.test(href)) {
    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noopener noreferrer');
  }
  return self.renderToken(tokens, index, options);
};
markdown.renderer.rules.image = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const src = token.attrGet('src') ?? '';
  const alt = token.content || 'Editorial visual';
  const rewritten = src.replace(/^\.\.\/visuals\/(article\d+\/)/, '/staging/visuals/$1');
  token.attrSet('src', rewritten);
  token.attrSet('width', '1200');
  token.attrSet('height', '700');
  token.attrSet('loading', 'lazy');
  token.attrSet('decoding', 'async');
  token.attrSet('alt', alt);
  return self.renderToken(tokens, index, options);
};
markdown.renderer.rules.table_open = () => '<div class="table-scroll" role="region" aria-label="Scrollable article data table" tabindex="0"><table>\n';
markdown.renderer.rules.table_close = () => '</table></div>\n';

mkdirSync(outputRoot, { recursive: true });

const cards = [];
for (const { slug, scheduleSlot: number, publishAt } of releases) {
  const filename = slug;
  const publishDate = publishAt.slice(0, 10);
  const articlePath = path.join(draftsRoot, 'articles', `${filename}.md`);
  const metaPath = path.join(draftsRoot, 'articles', `${filename}.meta.json`);
  const schemaPath = path.join(draftsRoot, 'articles', `${filename}.schema.json`);
  const source = readFileSync(articlePath, 'utf8');
  const metadata = JSON.parse(readFileSync(metaPath, 'utf8'));
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  if (metadata.status !== 'private-draft' || metadata.published !== null) {
    throw new Error(`${filename}: staging accepts only unpublished private drafts.`);
  }
  const articleSchema = schema['@graph']?.find((item) => item['@type'] === 'NewsArticle');
  if (!articleSchema) throw new Error(`${filename}: NewsArticle schema is missing.`);
  articleSchema.datePublished = `${publishDate}T07:30:00Z`;
  articleSchema.dateModified = `${metadata.updated}T07:30:00Z`;
  articleSchema.image = [
    `/staging/social/article${number}/1200x630.webp`,
    `/staging/social/article${number}/1200x675.webp`,
    `/staging/social/article${number}/1200x1200.webp`,
  ].map((asset) => new URL(asset, metadata.canonical).toString());

  const visualSource = path.join(draftsRoot, 'visuals', `article${number}`);
  const visualOutput = path.join(outputRoot, 'visuals', `article${number}`);
  mkdirSync(visualOutput, { recursive: true });
  for (const asset of readdirSync(visualSource).filter((name) => name.endsWith('.svg'))) {
    atomicCopy(path.join(visualSource, asset), path.join(visualOutput, asset));
  }

  const socialSource = path.join(draftsRoot, 'social', `article${number}`);
  const socialOutput = path.join(outputRoot, 'social', `article${number}`);
  mkdirSync(socialOutput, { recursive: true });
  for (const extension of ['webp', 'avif']) {
    atomicCopy(path.join(socialSource, `1200x630.${extension}`), path.join(socialOutput, `1200x630.${extension}`));
    atomicCopy(path.join(socialSource, `1200x675.${extension}`), path.join(socialOutput, `1200x675.${extension}`));
    atomicCopy(path.join(socialSource, `1200x1200.${extension}`), path.join(socialOutput, `1200x1200.${extension}`));
  }

  const title = `${metadata.title} — Global AI News`;
  const description = metadata.description;
  const canonical = metadata.canonical;
  const image = new URL(`/staging/social/article${number}/1200x630.webp`, canonical).toString();
  const body = markdown.render(
    source
      .replace(/^\uFEFF/, '')
      .replace(/(["'])\.\.\/visuals\/(article\d+\/)/g, '$1/staging/visuals/$2')
      .replaceAll('(../glossary.md)', '(/staging/glossary/)'),
  );
  const schemaMarkup = JSON.stringify(schema).replaceAll('<', '\\u003c');
  const html = `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="robots" content="noindex,nofollow"><meta name="googlebot" content="noindex,nofollow">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(canonical)}"><meta property="og:type" content="article">
<meta property="og:site_name" content="Global AI News"><meta property="og:locale" content="en_IN">
<meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:alt" content="${escapeHtml(`Article artwork for ${metadata.title}`)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(image)}">
<script type="application/ld+json">${schemaMarkup}</script>
<style>
:root{color-scheme:light dark;--paper:#f7f6f2;--ink:#17232b;--muted:#52616b;--blue:#1555a6;--rule:#d8d5cc;--surface:#fffefa}
@media(prefers-color-scheme:dark){:root{--paper:#111820;--ink:#edf2f4;--muted:#b7c2ca;--blue:#8fbcff;--rule:#394650;--surface:#18232b}}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.72 system-ui,sans-serif}
a{color:var(--blue);text-decoration-thickness:.08em;text-underline-offset:.18em;overflow-wrap:anywhere;word-break:break-word}a:focus-visible,summary:focus-visible,.table-scroll:focus-visible{outline:3px solid var(--blue);outline-offset:3px}
.skip{position:absolute;left:-10000px;top:auto}.skip:focus{left:1rem;top:1rem;z-index:5;background:var(--surface);padding:.75rem}
header,main,footer{width:min(100% - 2rem,1060px);margin-inline:auto}header{padding:1.25rem 0;border-bottom:1px solid var(--rule);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase}
main{padding:2rem 0 4rem}article{max-width:820px;margin-inline:auto}h1,h2,h3{font-family:Georgia,serif;line-height:1.08;letter-spacing:-.025em}h1{font-size:clamp(2.5rem,7vw,5.3rem);margin:.7em 0 .45em}h2{margin-top:2em;font-size:clamp(1.8rem,4vw,2.8rem)}h3{font-size:1.45rem}
img{display:block;max-width:100%;height:auto}picture{display:block;margin:1.5rem auto}p,li{max-width:78ch}blockquote{margin:1.5rem 0;padding:1rem 1.25rem;border-left:3px solid var(--blue);background:var(--surface)}
table{border-collapse:collapse;width:100%;min-width:42rem;background:var(--surface);font-size:.9rem}th,td{border:1px solid var(--rule);padding:.7rem;text-align:left;vertical-align:top}th{font-weight:700;background:color-mix(in srgb,var(--blue) 10%,var(--surface))}
.table-scroll{overflow:auto;max-width:100%;margin:1.25rem 0}details{border:1px solid var(--rule);padding:.7rem 1rem;margin:1rem 0;background:var(--surface)}summary{cursor:pointer;min-height:2.75rem;display:flex;align-items:center;font-weight:700}
.staging{background:#f0c75e;color:#17232b;padding:.2rem .5rem;font-weight:700}.schedule{color:var(--muted);font-size:.85rem}footer{border-top:1px solid var(--rule);padding:1.5rem 0 3rem;color:var(--muted);font-size:.8rem}
</style>
</head>
<body><a class="skip" href="#main">Skip to article</a><header><a href="/staging/articles/">Global AI News</a> · <span class="staging">Staging preview · noindex</span></header>
<main id="main"><article><p class="schedule">Scheduled preview · ${escapeHtml(dateLabel(publishDate))} · Article ${number}</p>
<picture><source type="image/avif" srcset="/staging/social/article${number}/1200x630.avif 1200w" sizes="(max-width: 1200px) 100vw, 1200px"><img src="/staging/social/article${number}/1200x630.webp" srcset="/staging/social/article${number}/1200x630.webp 1200w" sizes="(max-width: 1200px) 100vw, 1200px" width="1200" height="630" alt="${escapeHtml(`Article artwork for ${metadata.title}`)}" fetchpriority="high"></picture>
${body}</article></main><footer>Staging copy for editorial QA. This page is noindex and is not the scheduled public article route.</footer></body></html>`;
  const routeDirectory = path.join(outputRoot, 'article', slug);
  mkdirSync(routeDirectory, { recursive: true });
  atomicWrite(path.join(routeDirectory, 'index.html'), html);
  cards.push(`<li><a href="/staging/article/${encodeURIComponent(slug)}/">${escapeHtml(metadata.title)}</a><time datetime="${publishDate}">${dateLabel(publishDate)}</time></li>`);
}

const glossarySource = readFileSync(path.join(draftsRoot, 'glossary.md'), 'utf8');
const glossaryHtml = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="robots" content="noindex,nofollow"><title>Glossary — Global AI News</title><link rel="canonical" href="https://www.globalainews.in/glossary/"></head><body><header><a href="/staging/articles/">Global AI News</a> · Staging preview · noindex</header><main><h1>Glossary</h1>${markdown.render(glossarySource)}</main></body></html>`;
mkdirSync(path.join(outputRoot, 'glossary'), { recursive: true });
atomicWrite(path.join(outputRoot, 'glossary', 'index.html'), glossaryHtml);
mkdirSync(path.join(outputRoot, 'articles'), { recursive: true });
atomicWrite(path.join(outputRoot, 'articles', 'index.html'), `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="robots" content="noindex,nofollow"><link rel="canonical" href="https://www.globalainews.in/staging/articles/"><title>Staging articles — Global AI News</title><style>body{max-width:900px;margin:3rem auto;padding:0 1rem;font:17px/1.6 system-ui}li{padding:1rem;border-bottom:1px solid #ccc}time{display:block;color:#52616b;font-size:.85rem}</style></head><body><p>Global AI News · noindex staging</p><h1>November article staging</h1><ol>${cards.join('')}</ol></body></html>`);
console.log(`Built ${releases.length} noindex staging article routes under public/staging/article.`);
