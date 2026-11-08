import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getArticles, articlePath, category } from '../lib/articles';

export async function GET(context: APIContext) {
  const items = (await getArticles()).slice(0, 50);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    items: items.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      link: articlePath(a),
      pubDate: a.data.date,
      categories: [category(a).name, ...a.data.tags],
      author: SITE.desk,
    })),
    customData: `<language>${SITE.lang.toLowerCase()}</language>`,
  });
}
