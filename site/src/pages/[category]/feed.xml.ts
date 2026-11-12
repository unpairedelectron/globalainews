// Per-section RSS feed, e.g. /india/feed.xml (guides live at /reports/feed.xml).
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, CATEGORIES, type CategoryKey } from '../../site.config';
import { getArticles, articlePath } from '../../lib/articles';

export function getStaticPaths() {
  return (Object.keys(CATEGORIES) as CategoryKey[])
    .filter((k) => k !== 'guides')
    .map((key) => ({ params: { category: CATEGORIES[key].path.replaceAll('/', '') }, props: { key } }));
}

export async function GET(context: APIContext) {
  const key = (context.props as { key: CategoryKey }).key;
  return sectionFeed(context, key);
}

export async function sectionFeed(context: APIContext, key: CategoryKey) {
  const cat = CATEGORIES[key];
  const items = (await getArticles()).filter((a) => a.data.category === key).slice(0, 40);
  return rss({
    title: `${SITE.name}: ${cat.name}`,
    description: cat.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    items: items.map((a) => ({ title: a.data.title, description: a.data.description, link: articlePath(a), pubDate: a.data.date, categories: [cat.name, ...a.data.tags], author: SITE.desk })),
    customData: `<language>${SITE.lang.toLowerCase()}</language>`,
  });
}
