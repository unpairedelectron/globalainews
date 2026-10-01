import { authors, entities, findEntity, findStory, findTimeline, getPublishedStories, stories, timelineEvents, type Author, type NewsroomContentSnapshot, type Story } from './content';

export const SITE_URL = 'https://www.globalainews.in';

export interface SeoMetadata {
  title: string;
  description: string;
  path: string;
  lastmod?: string;
  indexable?: boolean;
  article?: boolean;
  ampPath?: string;
  imagePath?: string;
  imageAlt?: string;
}

export interface SeoMetadataManifest {
  source: 'maintained-editorial-source';
  generatedAt: string;
  routes: SeoMetadata[];
  stories?: Story[];
  contentSnapshot?: NewsroomContentSnapshot;
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
  '/search': {
    title: 'Search — Global AI News',
    description: 'Search published Global AI News stories.',
    path: '/search',
    indexable: false,
  },
  '/reports': {
    title: 'Reports — Global AI News',
    description: 'Editorial input is required before this route is published.',
    path: '/reports',
    indexable: false,
  },
  '/topics': {
    title: 'Topics — Global AI News',
    description: 'Editorial input is required before this route is published.',
    path: '/topics',
    indexable: false,
  },
  '/archive': {
    title: 'Archive — Global AI News',
    description: 'Editorial input is required before this route is published.',
    path: '/archive',
    indexable: false,
  },
  '/about-us': {
    title: 'About us — Global AI News',
    description: 'Editorial input is required before this route is published.',
    path: '/about-us',
    indexable: false,
  },
  '/code-of-ethics': {
    title: 'Code of ethics — Global AI News',
    description: 'Editorial input is required before this route is published.',
    path: '/code-of-ethics',
    indexable: false,
  },
  '/corrections': {
    title: 'Corrections — Global AI News',
    description: 'Editorial input is required before this route is published.',
    path: '/corrections',
    indexable: false,
  },
  '/contact-us': {
    title: 'Contact us — Global AI News',
    description: 'Editorial input is required before this route is published.',
    path: '/contact-us',
    indexable: false,
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
    indexable: false,
  },
  '/sign-in': {
    title: 'Editor sign in — Global AI News',
    description: 'Sign in to the Global AI News editorial workspace.',
    path: '/sign-in',
    indexable: false,
  },
  '/sign-up': {
    title: 'Editor access — Global AI News',
    description: 'Create access to the Global AI News editorial workspace.',
    path: '/sign-up',
    indexable: false,
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
const maintainedArticleSlugs = new Set(stories.map((story) => story.slug));

function cleanRoute(route: string): string {
  if (!route || route === '/') return '/';
  const withoutQuery = route.split(/[?#]/, 1)[0];
  return withoutQuery.length > 1 ? withoutQuery.replace(/\/+$/, '') : '/';
}

export function setSeoMetadataManifest(manifest: SeoMetadataManifest | undefined): void {
  activeManifest = manifest;
}

export function getSeoMetadata(route: string, publishedStories = getPublishedStories()): SeoMetadata {
  const cleanPath = cleanRoute(route);
  const manifestMetadata = activeManifest?.routes.find((metadata) => metadata.path === cleanPath);
  if (manifestMetadata) return manifestMetadata;

  const staticPage = staticMetadata[cleanPath];
  if (staticPage) return staticPage;

  const articleMatch = cleanPath.match(/^\/article\/([^/]+)$/);
  if (articleMatch) {
    const publishedSlugs = new Set(publishedStories.map((candidate) => candidate.slug));
    const candidate = publishedStories.find((item) => item.slug === articleMatch[1]) ?? findStory(articleMatch[1]);
    const story = candidate && publishedSlugs.has(candidate.slug) ? candidate : undefined;
    if (!story) {
      return {
        title: 'Article not found — Global AI News',
        description: 'No published article exists at this URL.',
        path: cleanPath,
        indexable: false,
      };
    }
    const isMaintainedStory = maintainedArticleSlugs.has(story.slug);
    return {
      title: `${story.title} — Global AI News`,
      description: story.dek,
      path: `/article/${story.slug}`,
      lastmod: story.dateModified ?? story.date,
      article: true,
        ...(isMaintainedStory ? { ampPath: '/amp/article/ai-models-antibiotic-discovery/' } : {}),
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
    title: 'Page not found — Global AI News',
    description: 'This URL is not part of the current Global AI News record.',
    path: cleanPath,
    indexable: false,
  };
}

export function getCanonicalUrl(route: string): string {
  const cleanPath = cleanRoute(route);
  const canonicalPath = cleanPath === '/' ? '/' : `${cleanPath}/`;
  return `${SITE_URL}${canonicalPath}`;
}

export function getSeoMetadataManifest(
  publishedStories: Story[] = getPublishedStories(),
  generatedAt = new Date().toISOString(),
): SeoMetadataManifest {
  const dynamicPaths = [
    ...publishedStories.map((story) => `/article/${story.slug}`),
    ...timelineEvents.map((event) => `/timeline/${event.slug}`),
    ...entities.map((entity) => `/${entity.kind}/${entity.slug}`),
    ...authors.map((author) => `/person/${author.slug}`),
  ];
  const generatedDate = generatedAt.slice(0, 10);
  const routes = [...new Set([...Object.keys(staticMetadata), ...dynamicPaths])]
    .map((path) => {
      const metadata = getSeoMetadata(path, publishedStories);
      return {
        ...metadata,
        lastmod: metadata.lastmod ?? generatedDate,
      };
    });

  return {
    source: 'maintained-editorial-source',
    generatedAt,
    routes,
  };
}

export function getStructuredData(
  metadata: SeoMetadata,
  publishedStories = getPublishedStories(),
  authorRecords: Author[] = authors,
): string {
  const canonical = getCanonicalUrl(metadata.path);
  const articleSlug = metadata.path.match(/^\/article\/([^/]+)$/)?.[1];
  const articleStory = articleSlug
    ? publishedStories.find((story) => story.slug === articleSlug)
    : undefined;
  const articleAuthor = articleStory ? authorRecords.find((author) => author.slug === articleStory.author) : undefined;
  const authorSlug = metadata.path.match(/^\/person\/([^/]+)$/)?.[1];
  const profileAuthor = authorSlug
    ? authorRecords.find((author) => author.slug === authorSlug)
    : undefined;
  const publisher = {
    '@type': 'Organization',
    name: 'Global AI News',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.svg`,
    },
  };
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      metadata.article
        ? {
            '@type': 'NewsArticle',
            headline: articleStory?.title ?? metadata.title,
            description: metadata.description,
            url: canonical,
            ...(metadata.imagePath ? { image: `${SITE_URL}${metadata.imagePath}` } : {}),
            ...(articleStory
              ? {
                  articleSection: articleStory.category,
                  datePublished: articleStory.date,
                    dateModified: metadata.lastmod ?? articleStory.dateModified ?? articleStory.date,
                }
              : {}),
            ...(articleAuthor
              ? { author: {
                  '@type': 'Person',
                  name: articleAuthor.name,
                  url: getCanonicalUrl(`/person/${articleAuthor.slug}`),
                } }
              : {}),
            publisher,
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          }
        : profileAuthor
        ? {
            '@type': 'ProfilePage',
            mainEntity: {
              '@type': 'Person',
              name: profileAuthor.name,
              description: profileAuthor.bio,
              jobTitle: profileAuthor.role,
              url: getCanonicalUrl(`/person/${profileAuthor.slug}`),
            },
            url: canonical,
          }
        : {
            '@type': 'WebSite',
            name: 'Global AI News',
            url: SITE_URL,
        potentialAction: {
              '@type': 'SearchAction',
            target: `${SITE_URL}/search?q={search_term_string}`,
            },
          },
      publisher,
      {
        '@type': 'BreadcrumbList',
        itemListElement: articleStory
          ? [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Research', item: getCanonicalUrl('/research') },
              { '@type': 'ListItem', position: 3, name: articleStory.category },
              { '@type': 'ListItem', position: 4, name: articleStory.title, item: canonical },
            ]
          : [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: metadata.title, item: canonical },
            ],
      },
    ],
  });
}
