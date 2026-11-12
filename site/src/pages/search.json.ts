// Search index for the on-site command palette, built at build time.
import { CATEGORIES } from '../site.config';
import { TERMS } from '../glossary';
import { getArticles, articlePath, category } from '../lib/articles';

export async function GET() {
  const all = await getArticles();
  const kindOf = (t: string) => (t === 'guide' ? 'Guide' : t === 'brief' ? 'Wire' : 'Article');
  const items = [
    ...all.map((a) => ({ t: a.data.title, d: a.data.description, u: articlePath(a), k: kindOf(a.data.type), c: category(a).name, g: a.data.tags.join(' ') })),
    ...TERMS.map((t) => ({ t: t.term, d: t.definition, u: `/glossary/#${t.id}`, k: 'Glossary', c: t.aka ?? '', g: '' })),
    ...Object.values(CATEGORIES).map((c) => ({ t: c.name, d: c.description, u: c.path, k: 'Section', c: '', g: '' })),
    { t: 'India AI tracker', d: 'India’s AI rules, IndiaAI GPU figures and Indian foundation models, with sources.', u: '/trackers/india-ai/', k: 'Tracker', c: '', g: 'IndiaAI GPUs rules EKA Dhir' },
    { t: 'Big Tech AI capex tracker', d: '2026 capital-spending guidance from Alphabet, Amazon, Meta and Microsoft.', u: '/trackers/ai-capex/', k: 'Tracker', c: '', g: 'capex Meta Google Microsoft Amazon spending' },
    { t: 'AI glossary', d: 'Plain-English definitions of AI terms.', u: '/glossary/', k: 'Page', c: '', g: '' },
    { t: 'About us', d: 'Who runs Global AI News and how we work.', u: '/about-us/', k: 'Page', c: '', g: '' },
    { t: 'Editorial policy', d: 'How we source, verify and correct our reporting.', u: '/editorial-policy/', k: 'Page', c: '', g: 'corrections' },
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
