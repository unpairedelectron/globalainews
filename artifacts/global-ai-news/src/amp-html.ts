import { authors, type Author, type Story } from './content';
import { getCanonicalUrl } from './seo-metadata';

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

export function renderAmpArticleDocument(
  story: Story,
  authorRecords: readonly Author[] = authors,
): string {
  const author = authorRecords.find((candidate) => candidate.slug === story.author);
  const sections = story.body.map((section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n          ')}
          ${section.pullQuote ? `<blockquote>${escapeHtml(section.pullQuote)}</blockquote>` : ''}
        </section>`).join('\n');

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
      .byline { border-block: 1px solid rgba(19,38,50,.2); padding: 16px 0; margin: 24px 0 40px; font-size: 13px; }
      .hero { background: #193b3e; color: white; padding: 42px 24px; border-radius: 16px; font-family: Georgia, serif; font-size: 34px; }
      article { font-family: Georgia, serif; font-size: 20px; line-height: 1.7; }
      article h2 { font-size: 34px; line-height: 1; font-weight: 400; margin-top: 52px; }
      blockquote { border-left: 3px solid var(--coral); padding-left: 20px; margin: 36px 0; font-size: 25px; }
      .ad { border: 1px dashed rgba(19,38,50,.35); padding: 24px; margin: 42px 0; text-align: center; font: 11px Arial, sans-serif; letter-spacing: .15em; }
      footer { border-top: 1px solid rgba(19,38,50,.2); color: rgba(19,38,50,.65); font-size: 12px; }
    </style>
  </head>
  <body>
    <header><div class="brand">GLOBAL AI NEWS</div></header>
    <main>
      <div class="kicker">${escapeHtml(story.category)} · ${escapeHtml(story.readTime)}</div>
      <h1>${escapeHtml(story.title)}</h1>
      <p class="dek">${escapeHtml(story.dek)}</p>
      <div class="byline">${author ? `<strong>${escapeHtml(author.name)}</strong> · ${escapeHtml(author.role)}` : '<strong>Byline unavailable</strong>'} · ${formatPublishedDate(story.date)}</div>
      <div class="hero">${escapeHtml(story.imageTreatment.caption)}</div>
      <article>
        <p><strong>${escapeHtml(story.bottomLine)}</strong></p>
        ${sections}
        <div class="ad">NATIVE AD · CLEARLY LABELED INVENTORY</div>
      </article>
    </main>
    <footer>Independent newsroom · No noise by design · <a href="https://www.globalainews.in/">Return to Global AI News</a></footer>
  </body>
</html>`;
}