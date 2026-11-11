import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(20).max(120),
    // <title> tag; keep under ~60 characters. Falls back to title.
    seoTitle: z.string().max(65).optional(),
    description: z.string().min(70).max(240),
    category: z.enum(['models', 'policy', 'india', 'infrastructure', 'safety', 'business', 'research', 'guides']),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    reviewer: z.string().optional(),
    // Slug of a real person in src/data/people.ts who wrote the article.
    author: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    takeaways: z.array(z.string()).min(2).max(6),
    type: z.enum(['article', 'guide', 'brief']).default('article'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
