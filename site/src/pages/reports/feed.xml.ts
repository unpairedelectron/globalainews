import type { APIContext } from 'astro';
import { sectionFeed } from '../[category]/feed.xml';
export const GET = (context: APIContext) => sectionFeed(context, 'guides');
