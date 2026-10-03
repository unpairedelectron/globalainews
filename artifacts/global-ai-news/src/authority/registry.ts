import {
  entities,
  sources,
  stories,
  timelineEvents,
  type Entity,
  type Source,
  type Story,
  type TimelineEvent,
} from '../content';

export interface TopicRecord {
  slug: string;
  label: string;
  route: string;
  description: string;
  storySlugs: string[];
  entitySlugs: string[];
  sourceSlugs: string[];
}

export interface ResearchRecord {
  slug: string;
  title: string;
  date: string;
  storySlug: string;
  topicSlugs: string[];
  entitySlugs: string[];
  timelineSlugs: string[];
  sourceSlugs: string[];
  relatedStorySlugs: string[];
  methodology: string;
  limitations: string[];
}

export interface AuthorityCluster {
  slug: string;
  title: string;
  status: 'active' | 'prepared';
  indexable: boolean;
  topicSlugs: string[];
  researchSlugs: string[];
  storySlugs: string[];
  entitySlugs: string[];
  sourceSlugs: string[];
}

const unique = (values: string[]) => [...new Set(values)];
const reportStory = stories.find((story) => story.slug === 'india-ai-compute-access-2026');

if (!reportStory) {
  throw new Error('The India AI compute report is missing from the maintained story registry.');
}

function storiesForTopic(label: string): Story[] {
  return stories.filter((story) => story.topic.toLowerCase() === label.toLowerCase());
}

function topicFromStories(
  slug: string,
  label: string,
  route: string,
  description: string,
): TopicRecord {
  const topicStories = storiesForTopic(label);
  return {
    slug,
    label,
    route,
    description,
    storySlugs: topicStories.map((story) => story.slug),
    entitySlugs: unique(topicStories.flatMap((story) => story.entities)),
    sourceSlugs: unique(topicStories.flatMap((story) => story.sources)),
  };
}

export const topicRecords: TopicRecord[] = [
  topicFromStories(
    'india',
    'India',
    '/topic/india',
    'AI policy, compute infrastructure and research connected to India.',
  ),
  topicFromStories(
    'ai',
    'AI',
    '/topic/ai',
    'Model capability, deployment economics and practical AI workflows.',
  ),
];

export const researchRecords: ResearchRecord[] = [
  {
    slug: 'india-ai-compute-2026',
    title: reportStory.title,
    date: reportStory.date,
    storySlug: reportStory.slug,
    topicSlugs: ['india'],
    entitySlugs: reportStory.entities,
    timelineSlugs: reportStory.timeline,
    sourceSlugs: reportStory.sources,
    relatedStorySlugs: reportStory.relatedStories,
    methodology: 'A dated synthesis of government records, the public compute portal and independent market reporting; unlike-for-like status labels remain separate.',
    limitations: [
      'The reviewed sources do not establish a current count of schedulable GPUs.',
      'Reported GPU-hours are not labelled as metered consumption by the source.',
      'Data-centre capacity covers mixed workloads and is not an AI-only inventory.',
    ],
  },
];

const efficientWorkflowStories = [
  'small-models-serious-workflows',
  'founders-first-million-model-calls',
];
const efficientWorkflowRecords = efficientWorkflowStories.map((slug) =>
  stories.find((story) => story.slug === slug),
);

if (efficientWorkflowRecords.some((story) => !story)) {
  throw new Error('The prepared efficient-AI cluster references a missing maintained story.');
}

const preparedStories = efficientWorkflowRecords as Story[];

export const authorityClusters: AuthorityCluster[] = [
  {
    slug: 'india-ai-compute',
    title: 'India AI compute',
    status: 'active',
    indexable: true,
    topicSlugs: ['india'],
    researchSlugs: ['india-ai-compute-2026'],
    storySlugs: unique([reportStory.slug, ...reportStory.relatedStories]),
    entitySlugs: reportStory.entities,
    sourceSlugs: reportStory.sources,
  },
  {
    slug: 'small-models-efficient-ai-serious-workflows',
    title: 'Small models / efficient AI / serious workflows',
    status: 'prepared',
    indexable: false,
    topicSlugs: ['ai'],
    researchSlugs: [],
    storySlugs: preparedStories.map((story) => story.slug),
    entitySlugs: unique(preparedStories.flatMap((story) => story.entities)),
    sourceSlugs: unique(preparedStories.flatMap((story) => story.sources)),
  },
];

export function validateAuthorityRegistry(): string[] {
  const errors: string[] = [];
  const storySlugs = new Set(stories.map((story) => story.slug));
  const entitySlugs = new Set(entities.map((entity: Entity) => entity.slug));
  const sourceSlugs = new Set(sources.map((source: Source) => source.slug));
  const timelineSlugs = new Set(timelineEvents.map((event: TimelineEvent) => event.slug));
  const topicSlugs = new Set(topicRecords.map((topic) => topic.slug));
  const researchSlugs = new Set(researchRecords.map((record) => record.slug));

  for (const topic of topicRecords) {
    if (topic.storySlugs.length === 0) errors.push(`Topic ${topic.slug} has no maintained stories.`);
    for (const slug of topic.storySlugs) {
      if (!storySlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing story ${slug}.`);
    }
    for (const slug of topic.entitySlugs) {
      if (!entitySlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing entity ${slug}.`);
    }
    for (const slug of topic.sourceSlugs) {
      if (!sourceSlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing source ${slug}.`);
    }
  }

  for (const record of researchRecords) {
    if (!storySlugs.has(record.storySlug)) errors.push(`Research ${record.slug} references missing report ${record.storySlug}.`);
    for (const slug of record.topicSlugs) {
      if (!topicSlugs.has(slug)) errors.push(`Research ${record.slug} references missing topic ${slug}.`);
    }
    for (const slug of record.entitySlugs) {
      if (!entitySlugs.has(slug)) errors.push(`Research ${record.slug} references missing entity ${slug}.`);
    }
    for (const slug of record.timelineSlugs) {
      if (!timelineSlugs.has(slug)) errors.push(`Research ${record.slug} references missing timeline event ${slug}.`);
    }
    for (const slug of record.sourceSlugs) {
      if (!sourceSlugs.has(slug)) errors.push(`Research ${record.slug} references missing source ${slug}.`);
    }
    for (const slug of record.relatedStorySlugs) {
      if (!storySlugs.has(slug)) errors.push(`Research ${record.slug} references missing related story ${slug}.`);
    }
  }

  for (const cluster of authorityClusters) {
    if (cluster.storySlugs.length === 0) errors.push(`Cluster ${cluster.slug} has no maintained stories.`);
    if (cluster.status === 'prepared' && cluster.indexable) {
      errors.push(`Prepared cluster ${cluster.slug} must not be indexable.`);
    }
    for (const slug of cluster.topicSlugs) {
      if (!topicSlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing topic ${slug}.`);
    }
    for (const slug of cluster.researchSlugs) {
      if (!researchSlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing research ${slug}.`);
    }
    for (const slug of cluster.storySlugs) {
      if (!storySlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing story ${slug}.`);
    }
    for (const slug of cluster.entitySlugs) {
      if (!entitySlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing entity ${slug}.`);
    }
    for (const slug of cluster.sourceSlugs) {
      if (!sourceSlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing source ${slug}.`);
    }
  }

  return errors;
}