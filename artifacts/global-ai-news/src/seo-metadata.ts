import { authors, entities, findEntity, findStory, findTimeline, getPublicDateModified, getPublishedStories, getStoryAuthorIdentity, getStoryWordCount, indiaIndex, signals, sources, timelineEvents, type Author, type NewsroomContentSnapshot, type Source, type Story } from './content';
import { dataProductRecords, researchRecords, topicRecords } from './authority/registry';
import { CONTENT_RULES, getSectionItemCount } from './content-rules';

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

const seoTitleOverrides: Record<string, string> = {
  '/article/india-ai-compute-access-2026': 'India AI compute gap: a measurement problem — Global AI News',
  '/article/weekly-deep-dive-cost-of-intelligence': 'AI power demand constrains product design — Global AI News',
  '/article/reliability-is-the-new-ai-moat': 'OSWorld tests AI agent reliability — Global AI News',
  '/article/study-finds-word-cues-can-override-game-theory-choices-in-llms': 'Preprint: action labels shift LLM choices — Global AI News',
  '/article/ai-models-antibiotic-discovery': 'ProteoGPT study reports peptide candidates — Global AI News',
  '/article/quiet-race-watermark-everything-ai-makes': 'C2PA provenance cannot prove content truth — Global AI News',
  '/article/small-models-serious-workflows': 'Mistral Small 4: active vs full footprint — Global AI News',
  '/timeline/indiaai-compute-target-2024': 'IndiaAI sets common-compute target — Global AI News',
  '/timeline/indiaai-compute-initial-capacity-2025': 'IndiaAI outlines initial compute capacity — Global AI News',
  '/timeline/indiaai-compute-34333-2025': 'Government reports 34,333 shared GPUs — Global AI News',
  '/timeline/indiaai-compute-installed-reported-2025': 'ET reports IndiaAI GPU installations — Global AI News',
  '/timeline/indiaai-compute-shared-capacity-2026': 'Factsheet: 45,000+ shared GPUs — Global AI News',
  '/timeline/indiaai-compute-access-reported-2026': 'Reports put access near 30,000 GPUs — Global AI News',
  '/timeline/antibiotic-candidates': 'ProteoGPT preclinical results — Global AI News',
  '/timeline/watermarking-code': 'EU AI Act transparency duties begin — Global AI News',
};

const staticMetadata: Record<string, SeoMetadata> = {
  '/': {
    title: 'Global AI News — Intelligence for the AI economy',
    description: 'Evidence-led reporting, research and data on what changed in the AI economy and what the public record supports.',
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
    description: 'Maintained reports on the AI industry, with transparent sourcing and connected context.',
    path: '/reports',
  },
  '/reports/ai-assistants-compared': {
    title: 'AI Assistants Compared — Global AI News',
    description: 'Compare documented workflows in ChatGPT, Claude, Gemini and Microsoft Copilot with source dates and limitations.',
    path: '/reports/ai-assistants-compared',
  },
  '/reports/ai-image-tools-compared': {
    title: 'AI Image Tools Compared — Global AI News',
    description: 'Compare documented image-generation and editing workflows with current vendor sources and stated limitations.',
    path: '/reports/ai-image-tools-compared',
  },
  '/reports/coding-agent-benchmarks-compared': {
    title: 'SWE-bench Verified vs Terminal-Bench — Global AI News',
    description: 'Compare coding-agent benchmark task designs, environments, graders and limits without treating scores as interchangeable.',
    path: '/reports/coding-agent-benchmarks-compared',
  },
  '/reports/hosted-vs-open-weight-models': {
    title: 'Hosted APIs vs Open-Weight Models — Global AI News',
    description: 'Compare documented model access, deployment responsibilities, terms and evidence limits for hosted and open-weight systems.',
    path: '/reports/hosted-vs-open-weight-models',
  },
  '/reports/indiaai-vs-commercial-cloud': {
    title: 'IndiaAI Shared Compute vs Commercial Cloud — Global AI News',
    description: 'Compare documented eligibility, allocation and billing without implying equivalent prices or available capacity.',
    path: '/reports/indiaai-vs-commercial-cloud',
  },
  '/reports/provenance-controls-compared': {
    title: 'C2PA, Watermarks and AI-Image Detectors — Global AI News',
    description: 'Compare provenance credentials, watermarks and image classifiers by the signals and limitations each establishes.',
    path: '/reports/provenance-controls-compared',
  },
  '/topics': {
    title: 'Topics — Global AI News',
    description: 'Explore connected topic records linking published reporting, research, data, sources and timelines.',
    path: '/topics',
  },
  '/archive': {
    title: 'Archive — Global AI News',
    description: 'Browse published Global AI News stories by publication date. Draft and scheduled records are excluded.',
    path: '/archive',
  },
  '/about-us': {
    title: 'About us — Global AI News',
    description: 'What Global AI News covers and how its reporting connects to sources, research and data.',
    path: '/about-us',
  },
  '/code-of-ethics': {
    title: 'Code of ethics — Global AI News',
    description: 'Global AI News standards for sourcing, attribution, evidence labels and transparent limitations.',
    path: '/code-of-ethics',
  },
  '/corrections': {
    title: 'Corrections — Global AI News',
    description: 'How Global AI News distinguishes publication dates, material updates and correction records.',
    path: '/corrections',
  },
  '/contact-us': {
    title: 'Contact us — Global AI News',
    description: 'How to find publication information and what contact, corrections and newsletter channels are currently available.',
    path: '/contact-us',
  },
  '/privacy': {
    title: 'Privacy notice — Global AI News',
    description: 'Interim disclosure of what the Daily Brief signup collects and which privacy-policy details still need publisher confirmation.',
    path: '/privacy',
    indexable: false,
  },
  '/glucosmart-privacy': {
    title: 'GlucoSmart Privacy Policy — Global AI News',
    description: 'Privacy Policy for GlucoSmart, covering locally stored wellness data, app features, sharing, permissions, export, and deletion.',
    path: '/glucosmart-privacy',
  },
  '/terms': {
    title: 'Terms of use — Global AI News',
    description: 'Interim notice that publisher-approved terms of use have not yet been supplied.',
    path: '/terms',
    indexable: false,
  },
  '/authors': {
    title: 'Authors — Global AI News',
    description: 'Current Global AI News bylines and the status of verified individual contributor profiles.',
    path: '/authors',
    indexable: false,
  },
  '/signals': {
    title: 'Signals on file — Global AI News',
    description: 'Dated editorial summaries linked to published reporting; not a live market feed or measurement series.',
    path: '/signals',
  },
  '/data': {
    title: 'Data products — Global AI News',
    description: 'Published datasets and dated observations with methods, limitations and source trails.',
    path: '/data',
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
    title: 'Invitation-only editor access — Global AI News',
    description: 'Newsroom account creation is restricted to approved editors.',
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

function cleanRoute(route: string): string {
  if (!route || route === '/') return '/';
  const withoutQuery = route.split(/[?#]/, 1)[0];
  return withoutQuery.length > 1 ? withoutQuery.replace(/\/+$/, '') : '/';
}

export function setSeoMetadataManifest(manifest: SeoMetadataManifest | undefined): void {
  activeManifest = manifest;
}

export function getResearchSeoTitle(title: string): string {
  const prefix = 'Research record: ';
  const suffix = ' — Global AI News';
  const maximumHeadlineLength = 60 - prefix.length - suffix.length;
  const cleanTitle = title.replace(/\s+/g, ' ').trim();
  const boundedHeadline = Array.from(cleanTitle).slice(0, maximumHeadlineLength).join('').replace(/[\s,.;:—-]+$/u, '');
  return `${prefix}${boundedHeadline}${suffix}`;
}

function articleTitle(headline: string): string {
  const cleanHeadline = headline
    .trim()
    .replace(/\s*(?:—|\|)\s*Global AI News$/i, '')
    .trim();
  return `${cleanHeadline || headline.trim()} — Global AI News`;
}

/**
 * The public story contract currently has no separate SEO-description or summary
 * field, so use its editorial dek and never infer article claims from the body.
 */
export function getArticleDescription(story: Pick<Story, 'dek'>): string {
  const description = story.dek.replace(/\s+/g, ' ').trim();
  if (!description) return staticMetadata['/'].description;

  const characters = Array.from(description);
  if (characters.length <= 160) return description;

  const truncated = characters.slice(0, 159).join('');
  const wordBoundary = truncated.lastIndexOf(' ');
  const safePrefix = (wordBoundary > 0 ? truncated.slice(0, wordBoundary) : truncated).trim();
  return `${safePrefix.replace(/[\s,.;:—-]+$/u, '')}…`;
}

function normalizeSeoDescription(title: string, description: string): string {
  const clean = description.replace(/\s+/gu, ' ').trim();
  const length = (value: string) => Array.from(value).length;
  if (
    length(clean) >= 120 &&
    length(clean) <= 155 &&
    /[.!?]$/u.test(clean) &&
    !/[.…]{2,}|…$/u.test(clean)
  ) {
    return clean;
  }

  const completeText = clean.split('…', 1)[0].trim();
  const sentences = completeText
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  let base = sentences.find((sentence) => length(sentence) >= 120 && length(sentence) <= 155)
    ?? sentences.find((sentence) => length(sentence) < 120);

  if (!base) {
    const titleSeed = title.replace(/\s*—\s*Global AI News$/u, '').trim();
    const compactSeed = length(titleSeed) > 50
      ? `${Array.from(titleSeed).slice(0, 47).join('').replace(/\s+\S*$/u, '').trim()}`
      : titleSeed;
    base = `Read ${compactSeed || 'this page'} in context.`;
  }
  if (length(base) >= 120 && length(base) <= 155 && /[.!?]$/u.test(base)) return base;

  const suffixes = [
    ' Sources and limits are noted.',
    ' Read the dated sources and evidence limits.',
    ' The cited record, context and limits are linked.',
    ' Explore related reporting, dated evidence and stated limits.',
    ' Read the source trail, reporting context and stated limitations here.',
    ' Explore related coverage, sources, dates and evidence limits in context.',
  ];
  for (const suffix of suffixes) {
    const candidate = `${base.replace(/[.!?]$/u, '')}.${suffix}`;
    if (length(candidate) >= 120 && length(candidate) <= 155) return candidate;
  }

  const titleSeed = title.replace(/\s*—\s*Global AI News$/u, '').trim();
  const compactSeed = Array.from(titleSeed).slice(0, 40).join('').replace(/\s+\S*$/u, '').trim();
  return `Explore ${compactSeed || 'this topic'} with dated sources, context and evidence limits from Global AI News. Supporting reporting and context are linked.`;
}

export function getArticleSeoMetadata(
  story: Story,
  imagePath = `/social/articles/${story.slug}.png`,
  imageAlt = `${story.title} — Global AI News editorial preview`,
): SeoMetadata {
  return {
    title: articleTitle(story.title),
    description: getArticleDescription(story),
    path: `/article/${story.slug}`,
    lastmod: getPublicDateModified(story),
    article: true,
    ampPath: `/amp/article/${story.slug}/`,
    imagePath,
    imageAlt,
  };
}

function getRawSeoMetadata(
  route: string,
  publishedStories = getPublishedStories(),
  sourceRecords: Source[] = sources,
  authoritySnapshot?: NewsroomContentSnapshot,
): SeoMetadata {
  const cleanPath = cleanRoute(route);
  const manifestMetadata = activeManifest?.routes.find((metadata) => metadata.path === cleanPath);
  if (manifestMetadata) return manifestMetadata;
  const authorRecords = authoritySnapshot?.authors ?? authors;
  const entityRecords = authoritySnapshot?.entities ?? entities;
  const timelineRecords = authoritySnapshot?.timelineEvents ?? timelineEvents;
  const researchRecordList = authoritySnapshot?.researchRecords ?? researchRecords;
  const dataProductList = authoritySnapshot?.dataProducts ?? dataProductRecords;
  const topicRecordList = authoritySnapshot?.topics ?? topicRecords;
  const publishedStorySlugs = new Set(publishedStories.map((story) => story.slug));
  const sectionSource = {
    stories: publishedStories,
    researchRecords: researchRecordList,
    dataProducts: dataProductList,
    topics: topicRecordList,
    entities: entityRecords,
    signals: authoritySnapshot?.signals ?? signals,
  };

  if (cleanPath === '/research') {
    return {
      ...staticMetadata['/research'],
      indexable: getSectionItemCount('/research', sectionSource) >= CONTENT_RULES.sectionMinimumItems,
    };
  }

  if (cleanPath === '/data') {
    return {
      ...staticMetadata['/data'],
      indexable: getSectionItemCount('/data', sectionSource) >= CONTENT_RULES.sectionMinimumItems,
    };
  }

  const researchMatch = cleanPath.match(/^\/research\/([^/]+)$/);
  if (researchMatch) {
    const record = researchRecordList.find(
      (candidate) =>
        candidate.slug === researchMatch[1] &&
        candidate.status === 'published' &&
        publishedStorySlugs.has(candidate.storySlug),
    );
    if (record) {
      return {
        title: getResearchSeoTitle(record.title),
        description: getArticleDescription({ dek: record.researchQuestion }),
        path: `/research/${record.slug}`,
        lastmod: record.updatedAt,
      };
    }
    return {
      title: 'Research record not found — Global AI News',
      description: 'No published research record exists at this URL.',
      path: cleanPath,
      indexable: false,
    };
  }

  const dataMatch = cleanPath.match(/^\/data\/([^/]+)$/);
  if (dataMatch) {
    const product = dataProductList.find(
      (candidate) =>
        candidate.slug === dataMatch[1] &&
        candidate.status === 'published' &&
        candidate.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
    );
    if (product) {
      return {
        title: articleTitle(product.title),
        description: getArticleDescription({ dek: product.description }),
        path: `/data/${product.slug}`,
        lastmod: product.updatedAt,
      };
    }
    return {
      title: 'Data product not found — Global AI News',
      description: 'No published data product exists at this URL.',
      path: cleanPath,
      indexable: false,
    };
  }

  const sourceMatch = cleanPath.match(/^\/source\/([^/]+)$/);
  if (sourceMatch) {
    const source = sourceRecords.find((candidate) => candidate.slug === sourceMatch[1]);
    if (source) {
      return {
        title: `${source.name} — Citation record — Global AI News`,
        description: getArticleDescription({
          dek: source.relevance ?? source.scopeNote ?? `Citation details for ${source.name}.`,
        }),
        path: `/source/${source.slug}`,
        lastmod: source.accessed,
        indexable: false,
      };
    }
    return {
      title: 'Source record not found — Global AI News',
      description: 'No cited source record exists at this URL.',
      path: cleanPath,
      indexable: false,
    };
  }

  const topicMatch = cleanPath.match(/^\/topic\/([^/]+)$/);
  if (topicMatch) {
    const topic = topicRecordList.find((candidate) => candidate.slug === topicMatch[1]);
    if (topic) {
      const visibleStorySlugs = topic.storySlugs.filter((slug) => publishedStorySlugs.has(slug));
      const label = topic.slug === 'india'
        ? 'India Watch'
        : topic.slug === 'ai'
          ? 'Artificial intelligence'
          : topic.label;
      return {
        title: `${label} — Global AI News`,
        description: getArticleDescription({ dek: topic.description }),
        path: topic.route,
        indexable: topic.indexable && visibleStorySlugs.length >= CONTENT_RULES.topicMinimumStories,
      };
    }
  }

  const articleMatch = cleanPath.match(/^\/article\/([^/]+)$/);
  if (articleMatch) {
    const story = publishedStories.find((candidate) => candidate.slug === articleMatch[1]);
    if (!story) {
      return {
        title: 'Article not found — Global AI News',
        description: 'No published article exists at this URL.',
        path: cleanPath,
        indexable: false,
      };
    }
    return getArticleSeoMetadata(story);
  }

  const staticPage = staticMetadata[cleanPath];
  if (staticPage) {
    // The Daily Brief is a primary newsroom landing page and remains indexable
    // even when its current edition has fewer stories than other section indexes.
    const sectionPaths = ['/reports', '/signals', '/industry', '/models', '/policy', '/india', '/essays', '/topics'];
    if (sectionPaths.includes(cleanPath)) {
      return {
        ...staticPage,
        indexable: getSectionItemCount(cleanPath, sectionSource) >= CONTENT_RULES.sectionMinimumItems,
      };
    }
    return staticPage;
  }

  const timelineMatch = cleanPath.match(/^\/timeline\/([^/]+)$/);
  if (timelineMatch) {
    const event = timelineRecords.find((candidate) => candidate.slug === timelineMatch[1]);
    if (event) {
      return {
        title: `${event.title} — Global AI News`,
        description: event.description,
        path: `/timeline/${event.slug}`,
      };
    }
  }

  const entityMatch = cleanPath.match(/^\/(company|lab|model|technology|institution|policy|dataset|infrastructure|person)\/([^/]+)$/);
  if (entityMatch) {
    const [, kind, slug] = entityMatch;
    const authorRecord = kind === 'person' ? authorRecords.find((author) => author.slug === slug) : undefined;
    if (authorRecord && authorRecord.verifiedForPublication !== true) {
      return {
        title: 'Contributor profile unavailable — Global AI News',
        description: 'No verified public contributor profile exists at this URL.',
        path: cleanPath,
        indexable: false,
      };
    }
    const person = authorRecord?.verifiedForPublication === true ? authorRecord : undefined;
    const entity = person ? undefined : entityRecords.find((candidate) => candidate.slug === slug && candidate.kind === kind);
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

export function getSeoMetadata(
  route: string,
  publishedStories = getPublishedStories(),
  sourceRecords: Source[] = sources,
  authoritySnapshot?: NewsroomContentSnapshot,
): SeoMetadata {
  const metadata = getRawSeoMetadata(route, publishedStories, sourceRecords, authoritySnapshot);
  return {
    ...metadata,
    title: seoTitleOverrides[metadata.path] ?? metadata.title,
    description: normalizeSeoDescription(metadata.title, metadata.description),
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
  sourceRecords: Source[] = sources,
): SeoMetadataManifest {
  const publishedStorySlugs = new Set(publishedStories.map((story) => story.slug));
  const visibleResearch = researchRecords.filter(
    (record) => record.status === 'published' && publishedStorySlugs.has(record.storySlug),
  );
  const visibleDataProducts = dataProductRecords.filter(
    (record) =>
      record.status === 'published' &&
      record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
  );
  const citedSourceSlugs = new Set([
    ...publishedStories.flatMap((story) => story.sources),
    ...indiaIndex.map((metric) => metric.source),
    ...visibleResearch.flatMap((record) => record.sourceSlugs),
    ...visibleDataProducts.flatMap((record) => record.sourceSlugs),
    ...topicRecords
      .filter((topic) => topic.indexable && topic.storySlugs.some((slug) => publishedStorySlugs.has(slug)))
      .flatMap((topic) => topic.sourceSlugs),
  ]);
  const visibleSources = sourceRecords.filter((source) => citedSourceSlugs.has(source.slug));
  const dynamicPaths = [
    ...publishedStories.map((story) => `/article/${story.slug}`),
    ...timelineEvents.map((event) => `/timeline/${event.slug}`),
    ...entities
      .filter((entity) => entity.kind !== 'person' || !authors.some((author) => author.slug === entity.slug && author.verifiedForPublication !== true))
      .map((entity) => `/${entity.kind}/${entity.slug}`),
    ...authors.filter((author) => author.verifiedForPublication === true).map((author) => `/person/${author.slug}`),
    ...visibleResearch.map((record) => `/research/${record.slug}`),
    ...visibleDataProducts.map((product) => `/data/${product.slug}`),
    ...visibleSources.map((source) => `/source/${source.slug}`),
    ...topicRecords
      .filter((topic) => topic.indexable && topic.storySlugs.some((slug) => publishedStorySlugs.has(slug)))
      .map((topic) => topic.route),
  ];
  const routes = [...new Set([...Object.keys(staticMetadata), ...dynamicPaths])]
    .map((path) => {
      const metadata = getSeoMetadata(path, publishedStories, visibleSources);
      return {
        ...metadata,
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
  authoritySnapshot?: Pick<NewsroomContentSnapshot, 'researchRecords' | 'dataProducts' | 'topics' | 'sources'>,
): string {
  const canonical = getCanonicalUrl(metadata.path);
  const articleSlug = metadata.path.match(/^\/article\/([^/]+)$/)?.[1];
  const articleStory = articleSlug
    ? publishedStories.find((story) => story.slug === articleSlug)
    : undefined;
  const articleAuthor = articleStory ? getStoryAuthorIdentity(articleStory, authorRecords) : undefined;
  const authorSlug = metadata.path.match(/^\/person\/([^/]+)$/)?.[1];
  const profileAuthor = authorSlug
    ? authorRecords.find((author) => author.slug === authorSlug && author.verifiedForPublication === true)
    : undefined;
  const researchSlug = metadata.path.match(/^\/research\/([^/]+)$/)?.[1];
  const researchRecord = researchSlug
    ? (authoritySnapshot?.researchRecords ?? researchRecords).find(
        (record) => record.slug === researchSlug && record.status === 'published',
      )
    : undefined;
  const productSlug = metadata.path.match(/^\/data\/([^/]+)$/)?.[1];
  const dataProduct = productSlug
    ? (authoritySnapshot?.dataProducts ?? dataProductRecords).find(
        (product) => product.slug === productSlug && product.status === 'published',
      )
    : undefined;
  const topicSlug = metadata.path.match(/^\/topic\/([^/]+)$/)?.[1];
  const topic = topicSlug
    ? (authoritySnapshot?.topics ?? topicRecords).find((item) => item.slug === topicSlug)
    : undefined;
  const sourceSlug = metadata.path.match(/^\/source\/([^/]+)$/)?.[1];
  const source = sourceSlug
    ? (authoritySnapshot?.sources ?? sources).find((item) => item.slug === sourceSlug)
    : undefined;
  const researchStory = researchRecord
    ? publishedStories.find((story) => story.slug === researchRecord.storySlug)
    : undefined;
  const researchAuthor = researchRecord && researchStory
    ? getStoryAuthorIdentity(researchStory, authorRecords)
    : { type: 'Organization' as const, name: 'Global AI News Editorial Desk' };
  const articleDateModified = articleStory ? getPublicDateModified(articleStory) : undefined;
  const publisher = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Global AI News',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.svg`,
    },
  };
  const webSite = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Global AI News',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getCanonicalUrl('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  const primaryEntity = metadata.article
    ? {
        '@type': articleStory?.contentType === 'Report' ? 'Article' : 'NewsArticle',
        headline: articleStory?.title ?? metadata.title,
        description: metadata.description,
        url: canonical,
        ...(metadata.imagePath ? { image: [`${SITE_URL}${metadata.imagePath}`] } : {}),
        ...(articleStory
          ? {
              articleSection: articleStory.category,
              isAccessibleForFree: true,
              wordCount: getStoryWordCount(articleStory),
              citation: (authoritySnapshot?.sources ?? sources)
                .filter((sourceRecord) => articleStory.sources.includes(sourceRecord.slug))
                .map((sourceRecord) => sourceRecord.url),
              datePublished: articleStory.date,
              ...(articleDateModified ? { dateModified: articleDateModified } : {}),
            }
          : {}),
        ...(articleAuthor
          ? {
              author: {
                '@type': articleAuthor.type,
                name: articleAuthor.name,
                url: articleAuthor.type === 'Person' && articleAuthor.slug
                  ? getCanonicalUrl(`/person/${articleAuthor.slug}`)
                  : getCanonicalUrl('/authors'),
              },
            }
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
      : researchRecord
        ? {
            '@type': 'Report',
            name: researchRecord.title,
            description: metadata.description,
            url: canonical,
            datePublished: researchRecord.date,
            dateModified: researchRecord.updatedAt,
            author: {
              '@type': researchAuthor.type,
              name: researchAuthor.name,
              url: researchAuthor.type === 'Person' && researchAuthor.slug
                ? getCanonicalUrl(`/person/${researchAuthor.slug}`)
                : SITE_URL,
            },
            publisher,
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
          }
        : dataProduct
          ? {
              '@type': 'Dataset',
              name: dataProduct.title,
              description: dataProduct.description,
              url: canonical,
              dateModified: dataProduct.updatedAt,
              measurementTechnique: dataProduct.methodology,
              variableMeasured: dataProduct.unit,
              citation: (authoritySnapshot?.sources ?? sources)
                .filter((item) => dataProduct.sourceSlugs.includes(item.slug))
                .map((item) => item.url),
              publisher,
            }
          : topic
            ? {
                '@type': 'CollectionPage',
                name: topic.label,
                description: topic.description,
                url: canonical,
                mainEntity: {
                  '@type': 'ItemList',
                  itemListElement: topic.storySlugs
                    .map((slug) => publishedStories.find((story) => story.slug === slug))
                    .filter((story): story is Story => Boolean(story))
                    .map((story, index) => ({
                      '@type': 'ListItem',
                      position: index + 1,
                      url: getCanonicalUrl(`/article/${story.slug}`),
                      name: story.title,
                    })),
                },
              }
            : source
              ? {
                  '@type': 'WebPage',
                  name: source.name,
                  description: metadata.description,
                  url: canonical,
                  isPartOf: { '@type': 'WebSite', name: 'Global AI News', url: SITE_URL },
                }
              : {
                  '@type': 'WebSite',
                  name: 'Global AI News',
                  url: SITE_URL,
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${SITE_URL}/search?q={search_term_string}`,
                  },
                };
  const breadcrumbItems = articleStory
    ? [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: articleStory.contentType === 'Report' ? 'Reports' : 'Research',
          item: getCanonicalUrl(articleStory.contentType === 'Report' ? '/reports' : '/research'),
        },
        { '@type': 'ListItem', position: 3, name: articleStory.category },
        { '@type': 'ListItem', position: 4, name: articleStory.title, item: canonical },
      ]
    : researchRecord
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Research', item: getCanonicalUrl('/research') },
          { '@type': 'ListItem', position: 3, name: researchRecord.title, item: canonical },
        ]
      : dataProduct
        ? [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Research', item: getCanonicalUrl('/research') },
            { '@type': 'ListItem', position: 3, name: 'Data product' },
            { '@type': 'ListItem', position: 4, name: dataProduct.title, item: canonical },
          ]
        : topic
          ? [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Topics' },
              { '@type': 'ListItem', position: 3, name: topic.label, item: canonical },
            ]
          : source
            ? [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Citation record', item: canonical },
              ]
            : [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: metadata.title, item: canonical },
              ];
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      publisher,
      webSite,
      primaryEntity,
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    ],
  });
}
