// Google News sitemap: only articles published in the last 48 hours.
import { SITE } from '../site.config';
import { getArticles, articlePath, absolute } from '../lib/articles';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function GET() {
  const cutoff = Date.now() - 48 * 3600 * 1000;
  const recent = (await getArticles()).filter((a) => a.data.type === 'article' && a.data.date.getTime() >= cutoff);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recent.map((a) => `  <url><loc>${esc(absolute(articlePath(a)))}</loc><news:news><news:publication><news:name>${esc(SITE.name)}</news:name><news:language>en</news:language></news:publication><news:publication_date>${a.data.date.toISOString()}</news:publication_date><news:title>${esc(a.data.title)}</news:title></news:news></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
