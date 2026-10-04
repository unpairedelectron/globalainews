import {
  canonicalStorySlug,
  entities,
  sources,
  stories,
  timelineEvents,
  type Entity,
  type Source,
  type Story,
  type TimelineEvent,
} from '../content';
import { indiaAiComputeObservations, type IndiaAiComputeObservation } from '../data/indiaai-compute-observations';

export interface TopicRecord {
  slug: string;
  label: string;
  route: string;
  description: string;
  importantDevelopments: string[];
  storySlugs: string[];
  entitySlugs: string[];
  sourceSlugs: string[];
  timelineSlugs: string[];
  researchSlugs: string[];
  reportSlugs: string[];
  dataProductSlugs: string[];
  indexable: boolean;
}

export type ResearchProvenance = 'external-reporting' | 'original-analysis' | 'original-research';
export type ResearchStatus = 'published' | 'in-progress' | 'superseded';

export interface ResearchRecord {
  slug: string;
  title: string;
  date: string;
  updatedAt: string;
  status: ResearchStatus;
  provenance: ResearchProvenance;
  researchQuestion: string;
  authorSlug: string;
  storySlug: string;
  topicSlugs: string[];
  entitySlugs: string[];
  timelineSlugs: string[];
  sourceSlugs: string[];
  dataProductSlugs: string[];
  relatedStorySlugs: string[];
  methodology: string;
  datasetDescription: string;
  findings: string[];
  limitations: string[];
  updateHistory: { date: string; summary: string }[];
}

export interface DataProductRecord {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  status: 'published' | 'in-progress';
  evidenceType: 'dated-public-source-claims';
  unit: string;
  topicSlugs: string[];
  entitySlugs: string[];
  storySlugs: string[];
  researchSlugs: string[];
  timelineSlugs: string[];
  sourceSlugs: string[];
  methodology: string;
  limitations: string[];
  updateHistory: { date: string; summary: string }[];
  observations: IndiaAiComputeObservation[];
}

export interface AuthorityCluster {
  slug: string;
  title: string;
  status: 'active' | 'prepared';
  indexable: boolean;
  topicSlugs: string[];
  researchSlugs: string[];
  dataProductSlugs: string[];
  storySlugs: string[];
  entitySlugs: string[];
  sourceSlugs: string[];
}

export type AuthorityNodeType = 'article' | 'report' | 'source' | 'entity' | 'topic' | 'research' | 'data-product' | 'timeline';

export interface AuthorityEdge {
  fromType: AuthorityNodeType;
  fromSlug: string;
  toType: AuthorityNodeType;
  toSlug: string;
  relationship: 'cites' | 'covers' | 'about' | 'chronicles' | 'related';
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
): Pick<TopicRecord, 'slug' | 'label' | 'route' | 'description' | 'storySlugs' | 'entitySlugs' | 'sourceSlugs'> {
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

export const dataProductRecords: DataProductRecord[] = [
  {
    slug: 'india-ai-compute-snapshots',
    title: 'IndiaAI compute: dated public snapshots',
    description: 'A source-linked record of IndiaAI compute quantities and dated project allocations, preserving the status language and dates used by each source.',
    updatedAt: reportStory.dateModified ?? reportStory.date,
    status: 'published',
    evidenceType: 'dated-public-source-claims',
    unit: 'GPUs',
    topicSlugs: ['india'],
    entitySlugs: ['indiaai-mission'],
    storySlugs: [reportStory.slug],
    researchSlugs: ['india-ai-compute-2026'],
    timelineSlugs: reportStory.timeline,
    sourceSlugs: unique([...indiaAiComputeObservations.map((observation) => observation.sourceSlug), 'indiaai-compute-allocation-register-2026']),
    methodology: 'One observation per dated public GPU-count claim. Preserve source wording, report date and as-of date separately; cite portal allocation rows as project-level records, not programme-wide hardware totals. Do not add unlike stages or reinterpret claims as installed, deployed, accessible, or schedulable supply.',
    limitations: [
      'This is not a provider- or facility-level hardware inventory.',
      'The portal allocation register records project-level assignments but does not establish delivery, installation, active reservation, or current availability.',
      'The reviewed sources do not establish a current count of installed, deployed, or schedulable GPUs.',
      'The reported GPU-hours are not defined by the source as metered consumption.',
      'Accelerator models and geographic distribution are not supplied consistently.',
    ],
    updateHistory: [
      { date: reportStory.date, summary: 'Initial publication from seven dated public claims; unresolved hardware states remain explicitly unestablished.' },
      { date: reportStory.dateModified ?? reportStory.date, summary: 'Added a reported installation-stage snapshot, a later PIB onboarded statement, and a dated primary project-allocation register; no live capacity crosswalk was found.' },
    ],
    observations: indiaAiComputeObservations,
  },
];

export const researchRecords: ResearchRecord[] = [
  {
    slug: 'india-ai-compute-2026',
    title: reportStory.title,
    date: reportStory.date,
    updatedAt: reportStory.dateModified ?? reportStory.date,
    status: 'published',
    provenance: 'original-analysis',
    researchQuestion: 'What does the public record establish about IndiaAI compute supply, practical access, and use—and where do its measurements stop?',
    authorSlug: reportStory.author,
    storySlug: reportStory.slug,
    topicSlugs: ['india'],
    entitySlugs: reportStory.entities,
    timelineSlugs: reportStory.timeline,
    sourceSlugs: reportStory.sources,
    dataProductSlugs: ['india-ai-compute-snapshots'],
    relatedStorySlugs: reportStory.relatedStories,
    methodology: 'A dated synthesis of government records, the public compute portal, parliamentary material, and independent market reporting. Each quantity remains attached to its source and the stage the source names; portal allocation rows are separate from hardware counts and unlike-for-like counts are not combined.',
    datasetDescription: 'Nine dated public claims covering the mission target, planned additions, reported empanelled/additional pool, an independently reported installation figure, onboarding, shared capacity, and an independently reported access figure. A separate primary portal register lists dated project allocations. None is a live inventory.',
    findings: [
      'Official publications describe growth from a 10,000+ GPU mission target to a 45,000+ shared-capacity claim, but do not reconcile the stages into one operational inventory.',
      'A June 2025 secondary report gives an early installation-stage figure; the IndiaAI portal separately lists dated project allocations, neither of which establishes current schedulable supply.',
      'A July 2026 PIB statement again says nearly 38,000 GPUs were onboarded, but does not explain how that stage relates to the 45,000+ shared-capacity figure.',
      'An independent report describes about 30,000 GPUs as accessible against a 45,000 commitment; this is not a provider-level or live availability feed.',
      'The public evidence reviewed does not establish the number of GPUs a user can schedule today.',
      'The reported 93.18 lakh GPU-hours are not defined as metered consumption in the source.',
    ],
    limitations: [
      'The reviewed sources do not establish a current count of schedulable GPUs.',
      'No reviewed source gives an aggregate of currently active reservations or a stage-by-stage crosswalk from target and empanelment through installation and service.',
      'Reported GPU-hours are not labelled as metered consumption by the source.',
      'Data-centre capacity covers mixed workloads and is not an AI-only inventory.',
    ],
    updateHistory: [
      { date: reportStory.date, summary: 'Initial publication; reviewed 18 primary and independent sources and recorded seven dated compute snapshots.' },
      { date: reportStory.dateModified ?? reportStory.date, summary: 'Added dated installation and onboarding evidence plus the project-level allocation register; schedulable supply and metered use remain unresolved.' },
    ],
  },
];

const topicSeeds = [
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

export const topicRecords: TopicRecord[] = topicSeeds.map((topic) => {
  const topicStories = stories.filter((story) => topic.storySlugs.includes(story.slug));
  const topicResearch = researchRecords.filter((record) => record.topicSlugs.includes(topic.slug));
  const topicDataProducts = dataProductRecords.filter((product) => product.topicSlugs.includes(topic.slug));
  const topicTimeline = timelineEvents
    .filter((event) => event.topicSlugs?.includes(topic.slug) || (event.story && topic.storySlugs.includes(event.story)))
    .map((event) => event.slug);
  const reportSlugs = topicStories
    .filter((story) => story.contentType === 'Report')
    .map((story) => story.slug);

  return {
    ...topic,
    importantDevelopments: topicStories.slice(0, 4).map((story) => story.title),
    timelineSlugs: unique(topicTimeline),
    researchSlugs: topicResearch.map((record) => record.slug),
    reportSlugs,
    dataProductSlugs: topicDataProducts.map((product) => product.slug),
    indexable: topicStories.length > 0,
  };
});

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
    dataProductSlugs: ['india-ai-compute-snapshots'],
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
    dataProductSlugs: [],
    storySlugs: preparedStories.map((story) => story.slug),
    entitySlugs: unique(preparedStories.flatMap((story) => story.entities)),
    sourceSlugs: unique(preparedStories.flatMap((story) => story.sources)),
  },
];

export function buildAuthorityGraph(storyRecords: Story[] = stories): AuthorityEdge[] {
  const edges: AuthorityEdge[] = [];
  const seen = new Set<string>();
  const visibleStories = new Map(storyRecords.map((story) => [story.slug, story]));
  const visibleResearch = researchRecords.filter((record) => visibleStories.has(record.storySlug));
  const visibleData = dataProductRecords.filter((record) =>
    record.storySlugs.some((slug) => visibleStories.has(slug)),
  );
  const add = (
    fromType: AuthorityNodeType,
    fromSlug: string,
    toType: AuthorityNodeType,
    toSlug: string,
    relationship: AuthorityEdge['relationship'],
  ) => {
    const pairs: AuthorityEdge[] = [
      { fromType, fromSlug, toType, toSlug, relationship },
      { fromType: toType, fromSlug: toSlug, toType: fromType, toSlug: fromSlug, relationship },
    ];
    for (const edge of pairs) {
      const key = `${edge.fromType}:${edge.fromSlug}:${edge.relationship}:${edge.toType}:${edge.toSlug}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(edge);
      }
    }
  };
  const storyType = (story: Story): AuthorityNodeType => story.contentType === 'Report' ? 'report' : 'article';

  for (const story of storyRecords) {
    const type = storyType(story);
    const topic = topicRecords.find((item) => item.label.toLowerCase() === story.topic.toLowerCase());
    if (topic) add(type, story.slug, 'topic', topic.slug, 'covers');
    for (const slug of story.entities) {
      if (entities.some((entity) => entity.slug === slug)) add(type, story.slug, 'entity', slug, 'about');
    }
    for (const slug of story.sources) {
      if (sources.some((source) => source.slug === slug)) add(type, story.slug, 'source', slug, 'cites');
    }
    for (const slug of story.timeline) {
      if (timelineEvents.some((event) => event.slug === slug)) add(type, story.slug, 'timeline', slug, 'chronicles');
    }
    for (const slug of story.relatedStories.map(canonicalStorySlug)) {
      const related = visibleStories.get(slug);
      if (related) add(type, story.slug, storyType(related), slug, 'related');
    }
  }

  for (const topic of topicRecords) {
    for (const slug of topic.storySlugs) {
      const story = visibleStories.get(slug);
      if (story) add('topic', topic.slug, storyType(story), slug, 'covers');
    }
    for (const slug of topic.entitySlugs) {
      if (entities.some((entity) => entity.slug === slug)) add('topic', topic.slug, 'entity', slug, 'about');
    }
    for (const slug of topic.sourceSlugs) {
      if (sources.some((source) => source.slug === slug)) add('topic', topic.slug, 'source', slug, 'cites');
    }
    for (const slug of topic.timelineSlugs) {
      if (timelineEvents.some((event) => event.slug === slug)) add('topic', topic.slug, 'timeline', slug, 'chronicles');
    }
    for (const slug of topic.researchSlugs) {
      if (visibleResearch.some((record) => record.slug === slug)) add('topic', topic.slug, 'research', slug, 'covers');
    }
    for (const slug of topic.reportSlugs) {
      const report = visibleStories.get(slug);
      if (report?.contentType === 'Report') add('topic', topic.slug, 'report', slug, 'covers');
    }
    for (const slug of topic.dataProductSlugs) {
      if (visibleData.some((record) => record.slug === slug)) add('topic', topic.slug, 'data-product', slug, 'covers');
    }
  }

  for (const record of visibleResearch) {
    add('research', record.slug, 'report', record.storySlug, 'about');
    for (const slug of record.topicSlugs) add('research', record.slug, 'topic', slug, 'covers');
    for (const slug of record.entitySlugs) add('research', record.slug, 'entity', slug, 'about');
    for (const slug of record.timelineSlugs) add('research', record.slug, 'timeline', slug, 'chronicles');
    for (const slug of record.sourceSlugs) add('research', record.slug, 'source', slug, 'cites');
    for (const slug of record.dataProductSlugs) {
      if (visibleData.some((item) => item.slug === slug)) add('research', record.slug, 'data-product', slug, 'related');
    }
    for (const slug of record.relatedStorySlugs) {
      const story = visibleStories.get(slug);
      if (story) add('research', record.slug, storyType(story), slug, 'related');
    }
  }

  for (const product of visibleData) {
    for (const slug of product.topicSlugs) add('data-product', product.slug, 'topic', slug, 'covers');
    for (const slug of product.entitySlugs) add('data-product', product.slug, 'entity', slug, 'about');
    for (const slug of product.storySlugs) {
      const story = visibleStories.get(slug);
      if (story) add('data-product', product.slug, storyType(story), slug, 'related');
    }
    for (const slug of product.researchSlugs) {
      if (visibleResearch.some((record) => record.slug === slug)) add('data-product', product.slug, 'research', slug, 'related');
    }
    for (const slug of product.timelineSlugs) add('data-product', product.slug, 'timeline', slug, 'chronicles');
    for (const slug of product.sourceSlugs) add('data-product', product.slug, 'source', slug, 'cites');
  }

  for (const event of timelineEvents) {
    if (event.story) {
      const story = visibleStories.get(canonicalStorySlug(event.story));
      if (story) add('timeline', event.slug, storyType(story), story.slug, 'chronicles');
    }
    for (const slug of event.entities) {
      if (entities.some((entity) => entity.slug === slug)) add('timeline', event.slug, 'entity', slug, 'about');
    }
    for (const slug of event.sourceSlugs ?? []) add('timeline', event.slug, 'source', slug, 'cites');
    for (const slug of event.topicSlugs ?? []) add('timeline', event.slug, 'topic', slug, 'covers');
    for (const slug of event.researchSlugs ?? []) {
      if (visibleResearch.some((record) => record.slug === slug)) add('timeline', event.slug, 'research', slug, 'related');
    }
    for (const slug of event.reportSlugs ?? []) {
      const report = visibleStories.get(slug);
      if (report?.contentType === 'Report') add('timeline', event.slug, 'report', slug, 'related');
    }
    for (const slug of event.dataProductSlugs ?? []) {
      if (visibleData.some((record) => record.slug === slug)) add('timeline', event.slug, 'data-product', slug, 'related');
    }
  }

  for (const entity of entities) {
    for (const slug of entity.recentStories.map(canonicalStorySlug)) {
      const story = visibleStories.get(slug);
      if (story) add('entity', entity.slug, storyType(story), slug, 'about');
    }
    for (const slug of entity.timeline) {
      if (timelineEvents.some((event) => event.slug === slug)) add('entity', entity.slug, 'timeline', slug, 'chronicles');
    }
    for (const slug of entity.relatedOrganizations) {
      if (entities.some((candidate) => candidate.slug === slug)) add('entity', entity.slug, 'entity', slug, 'related');
    }
  }

  return edges;
}

export function validateAuthorityRegistry(): string[] {
  const errors: string[] = [];
  const storyBySlug = new Map(stories.map((story) => [story.slug, story]));
  const storySlugs = new Set(storyBySlug.keys());
  const entitySlugs = new Set(entities.map((entity: Entity) => entity.slug));
  const sourceBySlug = new Map(sources.map((source) => [source.slug, source]));
  const sourceSlugs = new Set(sourceBySlug.keys());
  const timelineBySlug = new Map(timelineEvents.map((event: TimelineEvent) => [event.slug, event]));
  const timelineSlugs = new Set(timelineBySlug.keys());
  const topicSlugs = new Set(topicRecords.map((topic) => topic.slug));
  const researchBySlug = new Map(researchRecords.map((record) => [record.slug, record]));
  const researchSlugs = new Set(researchBySlug.keys());
  const dataBySlug = new Map(dataProductRecords.map((record) => [record.slug, record]));
  const dataSlugs = new Set(dataBySlug.keys());

  for (const source of sources) {
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') errors.push(`Source ${source.slug} has a non-web URL.`);
      if (!source.name.trim() || !source.publisher.trim()) errors.push(`Source ${source.slug} is missing a title or publisher.`);
    } catch {
      errors.push(`Source ${source.slug} has an invalid URL.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.accessed)) errors.push(`Source ${source.slug} has an invalid accessed date.`);
    if (source.publicationDate && !/^\d{4}-\d{2}-\d{2}$/.test(source.publicationDate)) {
      errors.push(`Source ${source.slug} has an invalid publication date.`);
    }
  }

  for (const topic of topicRecords) {
    if (topic.indexable && topic.storySlugs.length === 0) errors.push(`Indexable topic ${topic.slug} has no maintained stories.`);
    for (const slug of topic.storySlugs) {
      if (!storySlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing story ${slug}.`);
    }
    for (const slug of topic.entitySlugs) {
      if (!entitySlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing entity ${slug}.`);
    }
    for (const slug of topic.sourceSlugs) {
      if (!sourceSlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing source ${slug}.`);
    }
    for (const slug of topic.timelineSlugs) {
      if (!timelineSlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing timeline event ${slug}.`);
    }
    for (const slug of topic.researchSlugs) {
      if (!researchSlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing research ${slug}.`);
    }
    for (const slug of topic.reportSlugs) {
      if (storyBySlug.get(slug)?.contentType !== 'Report') errors.push(`Topic ${topic.slug} references missing report ${slug}.`);
    }
    for (const slug of topic.dataProductSlugs) {
      if (!dataSlugs.has(slug)) errors.push(`Topic ${topic.slug} references missing data product ${slug}.`);
    }
  }

  for (const story of stories) {
    for (const slug of story.relatedStories.map(canonicalStorySlug)) {
      if (!storySlugs.has(slug)) errors.push(`Story ${story.slug} references missing related story ${slug}.`);
    }
  }

  for (const entity of entities) {
    for (const slug of entity.recentStories.map(canonicalStorySlug)) {
      if (!storySlugs.has(slug)) errors.push(`Entity ${entity.slug} references missing story ${slug}.`);
    }
  }

  for (const record of researchRecords) {
    if (!storySlugs.has(record.storySlug)) errors.push(`Research ${record.slug} references missing report ${record.storySlug}.`);
    if (!record.researchQuestion.trim() || !record.methodology.trim() || record.findings.length === 0) {
      errors.push(`Research ${record.slug} is missing its question, methodology, or findings.`);
    }
    if (record.status === 'published' && !record.authorSlug) errors.push(`Published research ${record.slug} has no analyst.`);
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
    for (const slug of record.dataProductSlugs) {
      if (!dataSlugs.has(slug)) errors.push(`Research ${record.slug} references missing data product ${slug}.`);
    }
    for (const slug of record.relatedStorySlugs) {
      if (!storySlugs.has(slug)) errors.push(`Research ${record.slug} references missing related story ${slug}.`);
    }
  }

  for (const product of dataProductRecords) {
    if (!product.observations.length) errors.push(`Data product ${product.slug} has no observations.`);
    for (const slug of product.sourceSlugs) {
      if (!sourceSlugs.has(slug)) errors.push(`Data product ${product.slug} references missing source ${slug}.`);
    }
    for (const observation of product.observations) {
      if (!sourceSlugs.has(observation.sourceSlug)) errors.push(`Observation ${observation.id} references missing source ${observation.sourceSlug}.`);
    }
    for (const slug of product.storySlugs) {
      if (!storySlugs.has(slug)) errors.push(`Data product ${product.slug} references missing story ${slug}.`);
    }
    for (const slug of product.researchSlugs) {
      if (!researchSlugs.has(slug)) errors.push(`Data product ${product.slug} references missing research ${slug}.`);
    }
    for (const slug of product.topicSlugs) {
      if (!topicSlugs.has(slug)) errors.push(`Data product ${product.slug} references missing topic ${slug}.`);
    }
    for (const slug of product.entitySlugs) {
      if (!entitySlugs.has(slug)) errors.push(`Data product ${product.slug} references missing entity ${slug}.`);
    }
    for (const slug of product.timelineSlugs) {
      if (!timelineSlugs.has(slug)) errors.push(`Data product ${product.slug} references missing timeline event ${slug}.`);
    }
  }

  for (const event of timelineEvents) {
    if (event.story && !storySlugs.has(canonicalStorySlug(event.story))) {
      errors.push(`Timeline ${event.slug} references missing story ${event.story}.`);
    }
    for (const slug of event.entities) {
      if (!entitySlugs.has(slug)) errors.push(`Timeline ${event.slug} references missing entity ${slug}.`);
    }
    for (const slug of event.sourceSlugs ?? []) {
      if (!sourceSlugs.has(slug)) errors.push(`Timeline ${event.slug} references missing source ${slug}.`);
    }
    for (const slug of event.topicSlugs ?? []) {
      if (!topicSlugs.has(slug)) errors.push(`Timeline ${event.slug} references missing topic ${slug}.`);
    }
    for (const slug of event.researchSlugs ?? []) {
      if (!researchSlugs.has(slug)) errors.push(`Timeline ${event.slug} references missing research ${slug}.`);
    }
    for (const slug of event.reportSlugs ?? []) {
      if (storyBySlug.get(slug)?.contentType !== 'Report') errors.push(`Timeline ${event.slug} references missing report ${slug}.`);
    }
    for (const slug of event.dataProductSlugs ?? []) {
      if (!dataSlugs.has(slug)) errors.push(`Timeline ${event.slug} references missing data product ${slug}.`);
    }
  }

  for (const cluster of authorityClusters) {
    if (cluster.storySlugs.length === 0) errors.push(`Cluster ${cluster.slug} has no maintained stories.`);
    if (cluster.status === 'prepared' && cluster.indexable) errors.push(`Prepared cluster ${cluster.slug} must not be indexable.`);
    for (const slug of cluster.topicSlugs) {
      if (!topicSlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing topic ${slug}.`);
    }
    for (const slug of cluster.researchSlugs) {
      if (!researchSlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing research ${slug}.`);
    }
    for (const slug of cluster.dataProductSlugs) {
      if (!dataSlugs.has(slug)) errors.push(`Cluster ${cluster.slug} references missing data product ${slug}.`);
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