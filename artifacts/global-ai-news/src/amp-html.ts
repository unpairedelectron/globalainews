import { authors, getStoryAuthorIdentity, getStoryReadTime, type Author, type Source, type Story } from './content';
import { getCanonicalUrl, SITE_URL } from './seo-metadata';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formatPublishedDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

function sourceSpecificUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return undefined;
    return parsed.pathname === '/' && !parsed.search && !parsed.hash ? undefined : url;
  } catch {
    return undefined;
  }
}

export function renderAmpArticleDocument(
  story: Story,
  authorRecords: readonly Author[] = authors,
  sourceRecords: readonly Source[] = [],
): string {
  const author = getStoryAuthorIdentity(story, authorRecords);
  const personAuthor = author?.type === 'Person'
    ? authorRecords.find((candidate) => candidate.slug === author.slug)
    : undefined;
  const renderCitedText = (text: string) =>
    escapeHtml(text).replace(/\[@([a-z0-9-]+)\]/g, (_marker, slug: string) => {
      const source = sourceRecords.find((candidate) => candidate.slug === slug);
      const number = story.sources.indexOf(slug) + 1;
      if (!source || number === 0) return '<span class="citation-missing">[source not found]</span>';
      return `<a class="citation" href="#source-${number}" aria-label="Source ${number}: ${escapeHtml(source.name)}, jump to citation details">[${number}]</a>`;
    });
  const sections = story.body.map((section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${renderCitedText(paragraph)}</p>`).join('\n          ')}
          ${section.pullQuote ? `<blockquote>${renderCitedText(section.pullQuote)}</blockquote>` : ''}
          ${section.table ? `<div class="table-scroll"><table>${section.table.caption ? `<caption>${renderCitedText(section.table.caption)}</caption>` : ''}<thead><tr>${section.table.headers.map((header) => `<th scope="col">${renderCitedText(header)}</th>`).join('')}</tr></thead><tbody>${section.table.rows.map((row) => `<tr>${row.cells.map((cell) => `<td>${renderCitedText(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
        </section>`).join('\n');
  const takeaways = story.keyTakeaways.length
    ? `<section><h2>Key takeaways</h2><ul>${story.keyTakeaways.map((item) => `<li>${renderCitedText(item)}</li>`).join('')}</ul></section>`
    : '';
  const sourceList = story.sources.length
    ? `<section class="sources"><h2>Sources</h2><ol>${story.sources.map((slug, index) => {
        const source = sourceRecords.find((candidate) => candidate.slug === slug);
        if (!source) return `<li id="source-${index + 1}">[source record unavailable: ${escapeHtml(slug)}]</li>`;
        const externalUrl = sourceSpecificUrl(source.url);
        const href = externalUrl ?? `/source/${encodeURIComponent(slug)}/`;
        const externalAttributes = externalUrl ? ' target="_blank" rel="noopener noreferrer"' : '';
        const details = [
          source.publisher,
          source.tier ? `Tier ${source.tier}` : undefined,
          source.publicationDate ? `Published ${source.publicationDate}` : undefined,
          source.accessed ? `Accessed ${source.accessed}` : undefined,
        ].filter(Boolean).join(' · ');
        const incompleteNotice = externalUrl ? '' : '<p class="source-warning">This record does not contain a usable source-specific web address. Treat the citation as incomplete until it is corrected.</p>';
        return `<li id="source-${index + 1}"><a href="${escapeHtml(href)}"${externalAttributes}>[${index + 1}] ${escapeHtml(source.name)}</a><p>${escapeHtml(details)}</p>${source.scopeNote ? `<p>${escapeHtml(source.scopeNote)}</p>` : ''}${incompleteNotice}</li>`;
      }).join('')}</ol></section>`
    : '';

  return `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
    <link rel="canonical" href="${escapeHtml(getCanonicalUrl(`/article/${story.slug}`))}" />
    <title>${escapeHtml(story.title)}</title>
    <meta name="description" content="${escapeHtml(story.dek)}" />
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <style amp-boilerplate>
      body { visibility: hidden }
    </style>
    <noscript><style amp-boilerplate>body { visibility: visible }</style></noscript>
    <style amp-custom>
      :root { --ink: #132632; --paper: #f4f1ea; --teal: #1f8584; --coral: #dc654f; }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--paper); color: var(--ink); font-family: Arial, sans-serif; }
      header, main, footer { max-width: 760px; margin: auto; padding: 24px; }
      header { border-bottom: 1px solid rgba(19,38,50,.2); }
      .brand { color: var(--teal); font-size: 12px; letter-spacing: .18em; font-weight: 700; }
      .kicker { color: var(--coral); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; margin-top: 52px; }
      h1 { font-family: Georgia, serif; font-size: clamp(42px, 9vw, 76px); font-weight: 400; line-height: .94; margin: 16px 0; }
      .dek { font-size: 20px; line-height: 1.5; color: rgba(19,38,50,.7); }
      .citation { display: inline-block; min-width: 28px; min-height: 28px; padding: 4px 2px; color: var(--teal); font-size: .7em; text-align: center; vertical-align: super; margin: 0 2px; }
      .citation-missing { color: #9b2c20; font: 12px Arial, sans-serif; }
      .byline { border-block: 1px solid rgba(19,38,50,.2); padding: 16px 0; margin: 24px 0 40px; font-size: 13px; }
      .byline-description { display: block; margin-top: 6px; color: rgba(19,38,50,.68); font: 12px/1.55 Arial, sans-serif; }
      .hero { background: #193b3e; color: white; padding: 42px 24px; border-radius: 16px; font-family: Georgia, serif; font-size: 34px; }
      article { font-family: Georgia, serif; font-size: 20px; line-height: 1.7; }
      article h2 { font-size: 34px; line-height: 1; font-weight: 400; margin-top: 52px; }
      blockquote { border-left: 3px solid var(--coral); padding-left: 20px; margin: 36px 0; font-size: 25px; }
      .table-scroll { overflow-x: auto; margin: 28px 0; font: 14px/1.5 Arial, sans-serif; }
      table { border-collapse: collapse; min-width: 680px; width: 100%; }
      th, td { border: 1px solid rgba(19,38,50,.2); padding: 10px; text-align: left; vertical-align: top; }
      th, caption { font-weight: 700; }
      caption { padding: 12px; text-align: left; }
      .sources { font: 14px/1.55 Arial, sans-serif; }
      .sources li { border-bottom: 1px solid rgba(19,38,50,.2); padding: 14px 0; }
      .sources p { margin: 6px 0 0; font-size: 12px; }
      .sources .source-warning { border-left: 2px solid var(--coral); padding-left: 10px; }
      .ad { border: 1px dashed rgba(19,38,50,.35); padding: 24px; margin: 42px 0; text-align: center; font: 11px Arial, sans-serif; letter-spacing: .15em; }
      footer { border-top: 1px solid rgba(19,38,50,.2); color: rgba(19,38,50,.65); font-size: 12px; }
    </style>
  </head>
  <body>
    <header><div class="brand">GLOBAL AI NEWS</div></header>
    <main>
      <div class="kicker">${escapeHtml(story.contentType ?? story.category)} · ${escapeHtml(getStoryReadTime(story))}</div>
      <h1>${escapeHtml(story.title)}</h1>
      <p class="dek">${escapeHtml(story.dek)}</p>
      <div class="byline">${author ? `<strong>${escapeHtml(author.name)}</strong>${personAuthor ? ` · ${escapeHtml(personAuthor.role)}` : ''}` : '<strong>Byline unavailable</strong>'} · ${formatPublishedDate(story.date)}${author?.type === 'Organization' && author.description ? `<span class="byline-description">${escapeHtml(author.description)}</span>` : ''}</div>
      <div class="hero">${escapeHtml(story.imageTreatment.caption)}</div>
      <article>
        <p><strong>${renderCitedText(story.bottomLine)}</strong></p>
        <p>${renderCitedText(story.whyItMatters)}</p>
        ${takeaways}
        ${sections}
        <p><strong>What changes:</strong> ${renderCitedText(story.whatChanges)}</p>
        ${sourceList}
        <div class="ad">NATIVE AD · CLEARLY LABELED INVENTORY</div>
      </article>
    </main>
    <footer>Independent newsroom · No noise by design · <a href="${SITE_URL}/">Return to Global AI News</a></footer>
  </body>
</html>`;
}