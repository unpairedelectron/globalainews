import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, SITE } from '../site.config';

export type Article = CollectionEntry<'articles'>;

// Articles dated in the future are scheduled: they are left out of the
// build until a rebuild happens on or after their date. Set
// PUBLISH_SCHEDULED=true to preview everything locally.
export function isPublished(a: Article, now = new Date()): boolean {
  if (a.data.draft) return false;
  if (process.env.PUBLISH_SCHEDULED === 'true') return true;
  return a.data.date.getTime() <= now.getTime();
}

export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles');
  return all
    .filter((a) => isPublished(a))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function articlePath(a: Article): string {
  return a.data.type === 'guide' ? `/reports/${a.id}/` : `/article/${a.id}/`;
}

export function absolute(path: string): string {
  return new URL(path, SITE.url).toString();
}

export function category(a: Article) {
  return CATEGORIES[a.data.category];
}

export function wordCount(a: Article): number {
  return (a.body ?? '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

export function readingTime(a: Article): number {
  return Math.max(2, Math.round(wordCount(a) / 230));
}

export function lastModified(a: Article): Date {
  return a.data.updated ?? a.data.date;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function related(a: Article, all: Article[], n = 4): Article[] {
  const others = all.filter((x) => x.id !== a.id);
  const tagSet = new Set(a.data.tags.map((t) => t.toLowerCase()));
  const score = (x: Article) =>
    (x.data.category === a.data.category ? 3 : 0) +
    x.data.tags.filter((t) => tagSet.has(t.toLowerCase())).length;
  return others
    .map((x) => ({ x, s: score(x) }))
    .sort((p, q) => q.s - p.s || q.x.data.date.getTime() - p.x.data.date.getTime())
    .slice(0, n)
    .map(({ x }) => x);
}

export function ogImage(a: Article): string {
  const img = a.data.image ?? '/og-default.png';
  // Prefer the dedicated 1200x630 social card when the migration produced one.
  if (img.includes('/hero-1200x675.webp')) return img.replace('hero-1200x675.webp', 'og-1200x630.webp');
  if (img.includes('/hero-1024.webp')) return img.replace('hero-1024.webp', 'og.jpg');
  return img;
}
