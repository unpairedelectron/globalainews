import { CATEGORIES } from '../site.config';
import { getArticles, articlePath, absolute, lastModified } from '../lib/articles';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export async function GET() {
  const all = await getArticles();
  const newest = all[0] ? lastModified(all[0]) : new Date();
  const latestIn = (key: string) => {
    const a = all.filter((x) => x.data.category === key);
    return a.length ? new Date(Math.max(...a.map((x) => lastModified(x).getTime()))) : newest;
  };
  const briefCount = all.filter((a) => a.data.type === 'brief').length;
  const urls: { loc: string; lastmod: Date }[] = [
    ...(briefCount >= 3 ? [{ loc: '/wire/', lastmod: newest }] : []),
    ...(all.filter((a) => a.data.date.getTime() >= Date.now() - 7 * 864e5).length >= 3 ? [{ loc: '/this-week/', lastmod: newest }] : []),
    { loc: '/', lastmod: newest },
    { loc: '/latest/', lastmod: newest },
    { loc: '/glossary/', lastmod: new Date('2026-11-11') },
    ...['/trackers/', '/trackers/india-ai/', '/trackers/ai-capex/', '/authors/', '/authors/aman-mishra/', '/authors/shiv-shakti-mishra/'].map((loc) => ({ loc, lastmod: new Date('2026-11-11') })),
    ...Object.entries(CATEGORIES).map(([key, c]) => ({ loc: c.path, lastmod: latestIn(key) })),
    ...all.map((a) => ({ loc: articlePath(a), lastmod: lastModified(a) })),
    ...['/about-us/', '/editorial-policy/', '/contact-us/', '/privacy/', '/terms/', '/disclaimer/'].map((loc) => ({ loc, lastmod: new Date('2026-11-08') })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(absolute(u.loc))}</loc><lastmod>${u.lastmod.toISOString().slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
