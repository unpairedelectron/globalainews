// /llms.txt: a plain-text map of the site for AI assistants and crawlers (llmstxt.org).
import { SITE, CATEGORIES } from '../site.config';
import { getArticles, articlePath, absolute, category } from '../lib/articles';

export async function GET() {
  const all = await getArticles();
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'Every article cites its primary sources in a numbered list at the end. Editorial standards: ' + absolute('/editorial-policy/'),
    '',
  ];
  for (const [key, c] of Object.entries(CATEGORIES)) {
    const items = all.filter((a) => a.data.category === key);
    if (!items.length) continue;
    lines.push(`## ${c.name}`, '');
    for (const a of items) lines.push(`- [${a.data.title}](${absolute(articlePath(a))}): ${a.data.description}`);
    lines.push('');
  }
  lines.push('## About', '', `- [AI glossary](${absolute('/glossary/')})`, `- [About us](${absolute('/about-us/')})`, `- [Editorial policy](${absolute('/editorial-policy/')})`, `- [Contact](${absolute('/contact-us/')})`, '');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
