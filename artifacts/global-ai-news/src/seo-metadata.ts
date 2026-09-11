import { authors, entities, findEntity, findStory, findTimeline, stories, timelineEvents } from './content';

export const SITE_URL = 'https://www.globalainews.in';

export interface SeoMetadata {
  title: string;
  description: string;
  path: string;
  article?: boolean;
  ampPath?: string;
  imagePath?: string;
  imageAlt?: string;
}

export interface SeoMetadataManifest {
  source: 'maintained-editorial-source';
  generatedAt: string;
  routes: SeoMetadata[];
}

const staticMetadata: Record<string, SeoMetadata> = {
  '/': {
    title: 'Global AI News — Intelligence for the AI economy',
    description: 'Stories, signals and context for understanding the AI industry.',
    path: '/',
  },
  '/brief': {
    title: 'The Daily Brief — Global AI News',
    description: 'A three-minute editorial briefing on what changed across the AI economy.',
    path: '/brief',
  },
  '/signals': {
    title: 'Signals — Global AI News',
    description: 'Directional intelligence across the AI economy.',
    path: '/signals',
  },
  '/research': {
    title: 'Research & context — Global AI News',
    description: 'Context for the AI economy.',
    path: '/research',
  },
  '/essays': {
    title: 'Essays — Global AI News',
    description: 'Context for the AI economy.',
    path: '/essays',
  },
  '/industry': {
    title: 'AI Industry Map — Global AI News',
    description: 'A structured view of the AI ecosystem.',
    path: '/industry',
  },
  '/models': {
    title: 'Models intelligence — Global AI News',
    description: 'Focused models intelligence.',
    path: '/models',
  },
  '/policy': {
    title: 'Policy intelligence — Global AI News',
    description: 'Focused policy intelligence.',
    path: '/policy',
  },
  '/india': {
    title: 'India AI Index — Global AI News',
    description: 'India’s startups, funding, talent, research, policy and public AI infrastructure.',
    path: '/india',
  },
  '/ask': {
    title: 'Ask Global — Global AI News',
    description: 'An intelligence interface for asking what changed.',
    path: '/ask',
  },
  '/insights': {
    title: 'Publisher workspace — Global AI News',
    description: 'Internal editorial intelligence workspace.',
    path: '/insights',
  },
  '/topic/ai': {
    title: 'Artificial intelligence — Global AI News',
    description: 'A focused Global AI News desk.',
    path: '/topic/ai',
  },
  '/topic/india': {
    title: 'India Watch — Global AI News',
    description: 'A focused Global AI News desk.',
    path: '/topic/india',
  },
};

let activeManifest: SeoMetadataManifest | undefined;

function cleanRoute(route: string): string {
  if (!route || route === '/') return '/';
  const withoutQuery = route.split(/[?#]/, 1)[0];
  return withoutQuery.length > 1 ? withoutQuery.replace(/\/+$/, '') : '/';
}

export function setSeoMetadataManifest(manifest: SeoMetadataManifest | undefined): void {
  activeManifest = manifest;
}

export function getSeoMetadata(route: string): SeoMetadata {
  const cleanPath = cleanRoute(route);
  const manifestMetadata = activeManifest?.routes.find((metadata) => metadata.path === cleanPath);
  if (manifestMetadata) return manifestMetadata;

  const staticPage = staticMetadata[cleanPath];
  if (staticPage) return staticPage;

  const articleMatch = cleanPath.match(/^\/article\/([^/]+)$/);
  if (articleMatch) {
    const story = findStory(articleMatch[1]) ?? findStory('ai-models-antibiotic-discovery')!;
    return {
      title: `${story.title} — Global AI News`,
      description: story.dek,
      path: `/article/${story.slug}`,
      article: true,
      ampPath: '/amp/article/ai-models-antibiotic-discovery/',
      imagePath: `/social/articles/${story.slug}.png`,
      imageAlt: `${story.title} — Global AI News editorial preview`,
    };
  }

  const timelineMatch = cleanPath.match(/^\/timeline\/([^/]+)$/);
  if (timelineMatch) {
    const event = findTimeline(timelineMatch[1]);
    if (event) {
      return {
        title: `${event.title} — Global AI News`,
        description: event.description,
        path: `/timeline/${event.slug}`,
      };
    }
  }

  const entityMatch = cleanPath.match(/^\/(company|lab|model|technology|policy|person)\/([^/]+)$/);
  if (entityMatch) {
    const [, kind, slug] = entityMatch;
    const person = kind === 'person' ? authors.find((author) => author.slug === slug) : undefined;
    const entity = person ? undefined : findEntity(slug);
    if (person) {
      return {
        title: `${person.name} — Global AI News`,
        description: person.bio,
        path: `/${kind}/${slug}`,
      };
    }
    if (entity) {
      return {
        title: `${entity.name} — Global AI News`,
        description: entity.overview,
        path: `/${kind}/${slug}`,
      };
    }
  }

  return {
    title: 'Global AI News — Intelligence for the AI economy',
    description: 'Stories, signals and context for understanding the AI industry.',
    path: cleanPath,
  };
}

export function getSeoMetadataManifest(): SeoMetadataManifest {
  const dynamicPaths = [
    ...stories.map((story) => `/article/${story.slug}`),
    ...timelineEvents.map((event) => `/timeline/${event.slug}`),
    ...entities.map((entity) => `/${entity.kind}/${entity.slug}`),
    ...authors.map((author) => `/person/${author.slug}`),
  ];
  const routes = [...new Set([...Object.keys(staticMetadata), ...dynamicPaths])]
    .map((path) => getSeoMetadata(path));

  return {
    source: 'maintained-editorial-source',
    generatedAt: new Date().toISOString(),
    routes,
  };
}

export function getStructuredData(metadata: SeoMetadata): string {
  const canonical = `${SITE_URL}${metadata.path}`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      metadata.article
        ? {
            '@type': 'NewsArticle',
            headline: metadata.title,
            description: metadata.description,
            url: canonical,
            ...(metadata.imagePath ? { image: `${SITE_URL}${metadata.imagePath}` } : {}),
            author: { '@type': 'Organization', name: 'Global AI News' },
            publisher: { '@type': 'Organization', name: 'Global AI News' },
            datePublished: '2026-09-11',
          }
        : {
            '@type': 'WebSite',
            name: 'Global AI News',
            url: SITE_URL,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_URL}/brief?q={search_term_string}`,
            },
          },
      { '@type': 'Organization', name: 'Global AI News', url: SITE_URL },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: metadata.title, item: canonical },
        ],
      },
    ],
  });
}
