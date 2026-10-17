import type { Entity, NewsroomContentSnapshot, Story } from './content';
import type { DataProductRecord, ResearchRecord, TopicRecord } from './authority/registry';
import type { Signal } from './content';

export const CONTENT_RULES = {
  sectionMinimumItems: 6,
  railMinimumItems: 3,
  topicMinimumStories: 5,
  maxPrimaryNavigationItems: 6,
} as const;

type ContentSource = {
  stories: Pick<Story, 'slug' | 'category' | 'contentType' | 'classification' | 'topic'>[];
  researchRecords: Pick<ResearchRecord, 'status' | 'storySlug'>[];
  dataProducts: Pick<DataProductRecord, 'status' | 'storySlugs'>[];
  topics: Pick<TopicRecord, 'indexable' | 'storySlugs'>[];
  entities: Pick<Entity, 'recentStories'>[];
  signals: Pick<Signal, 'stories'>[];
};

const navigation = [
  ['Brief', '/brief'],
  ['Research', '/research'],
  ['Data', '/data'],
  ['Reports', '/reports'],
  ['Signals', '/signals'],
  ['Industry', '/industry'],
  ['Models', '/models'],
  ['Policy', '/policy'],
  ['India', '/india'],
  ['Essays', '/essays'],
] as const;

export function getSectionItemCount(path: string, source: ContentSource): number {
  const storySlugs = new Set(source.stories.map((story) => story.slug));
  switch (path) {
    case '/brief':
      return storySlugs.size;
    case '/research':
      return source.researchRecords.filter((record) => record.status === 'published' && storySlugs.has(record.storySlug)).length;
    case '/data':
      return source.dataProducts.filter((record) => record.status === 'published' && record.storySlugs.some((slug) => storySlugs.has(slug))).length;
    case '/reports':
      return source.stories.filter((story) => story.contentType === 'Report').length;
    case '/signals':
      return source.signals.filter((signal) => signal.stories.some((slug) => storySlugs.has(slug))).length;
    case '/industry':
      return source.entities.filter((entity) => entity.recentStories.some((slug) => storySlugs.has(slug))).length;
    case '/models':
      return source.stories.filter((story) => story.topic === 'Models').length;
    case '/policy':
      return source.stories.filter((story) => story.topic === 'Policy' || story.category === 'Policy').length;
    case '/india':
      return source.stories.filter((story) => story.topic === 'India' || story.category === 'India Watch').length;
    case '/essays':
      return source.stories.filter((story) => story.contentType === 'Analysis' || story.classification === 'analysis').length;
    case '/topics':
      return source.topics.filter((topic) => topic.indexable && topic.storySlugs.filter((slug) => storySlugs.has(slug)).length >= CONTENT_RULES.topicMinimumStories).length;
    default:
      return 0;
  }
}

export function getQualifiedSectionNavigation(
  source: NewsroomContentSnapshot,
): (typeof navigation)[number][] {
  return navigation
    .filter(([, path]) => getSectionItemCount(path, source) >= CONTENT_RULES.sectionMinimumItems)
    .slice(0, CONTENT_RULES.maxPrimaryNavigationItems);
}
