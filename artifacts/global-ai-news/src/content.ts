/**
 * The editorial content model. The API serves these maintained records and the
 * client hydrates them at runtime so every public page uses the same snapshot.
 */
import { indiaAiComputeReport } from './reports/india-ai-compute-2026';

export type StoryCategory =
  | 'Breakthroughs'
  | 'Signals'
  | 'India Watch'
  | 'The Edge'
  | 'Field Notes'
  | 'Infrastructure'
  | 'Policy';
export type EditorialContentType =
  | 'Brief'
  | 'Analysis'
  | 'Explainer'
  | 'Research'
  | 'Report'
  | 'Comparison'
  | 'Essay';
export type EditorialSection = 'Brief' | 'Research' | 'Data';
export type EntityKind =
  | 'company'
  | 'lab'
  | 'model'
  | 'person'
  | 'technology'
  | 'institution'
  | 'policy'
  | 'dataset'
  | 'infrastructure';
export type EvidenceQuality = 'high' | 'medium' | 'developing';
export type SignalDirection = 'up' | 'down' | 'steady';
export type SignalImpact = 'low' | 'medium' | 'high';
export type SourceType =
  | 'government-record'
  | 'government-portal'
  | 'parliamentary-record'
  | 'news-report'
  | 'industry-report'
  | 'research-report'
  | 'academic-paper'
  | 'dataset'
  | 'filing'
  | 'interview'
  | 'technical-document'
  | 'other';
export type SourceClassification = 'primary' | 'secondary';

/**
 * Resolve older editorial relationship keys at the public boundary. Canonical
 * article slugs remain the stored route identifiers and production records are
 * not rewritten by this mapping.
 */
export const storySlugAliases: Record<string, string> = {
  antibiotic: 'ai-models-antibiotic-discovery',
  founders: 'founders-first-million-model-calls',
  'small-models': 'small-models-serious-workflows',
  'india-stack': 'indias-public-ai-stack',
  infrastructure: 'new-geography-of-compute',
  watermarking: 'quiet-race-watermark-everything-ai-makes',
};

export function canonicalStorySlug(slug: string): string {
  return storySlugAliases[slug] ?? slug;
}

/**
 * Maintained records withdrawn during the editorial rescue. Keep the records
 * in source history, but never include them in public story collections.
 */
export const withdrawnStorySlugs = new Set([
  'indias-public-ai-stack',
  'founders-first-million-model-calls',
  'new-geography-of-compute',
  'public-compute-needs-public-metrics',
]);

export const editorialContentTypePurposes: Record<EditorialContentType, string> = {
  Brief: 'A concise, source-led account of a material development.',
  Analysis: 'An interpretation of evidence that explains implications without claiming new empirical research.',
  Explainer: 'A durable guide that defines a system, process, or contested term.',
  Research: 'A documented investigation with an explicit question, method, findings, and limitations.',
  Report: 'A substantial, maintained reference asset that synthesizes evidence across a topic.',
  Comparison: 'A like-for-like evaluation that discloses criteria, evidence, and non-comparable measures.',
  Essay: 'A clearly attributed argument or reflection, distinct from reported fact and research findings.',
};

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  initials: string;
  verifiedForPublication?: boolean;
}
export interface Source {
  slug: string;
  name: string;
  title?: string;
  publisher: string;
  kind: 'primary' | 'independent' | 'dataset' | 'filing' | 'interview';
  sourceType?: SourceType;
  classification?: SourceClassification;
  url: string;
  accessed: string;
  publicationDate?: string;
  tier?: 1 | 2 | 3;
  evidenceType?: 'full-page' | 'portal-capture' | 'snippet-only';
  scopeNote?: string;
  relevance?: string;
  notes?: string[];
}
export interface EvidenceSummary {
  primarySources: number;
  independentConfirmations: number;
  confidence: 'HIGH' | 'MEDIUM' | 'DEVELOPING';
  note: string;
}
export interface BodySection {
  heading: string;
  paragraphs: string[];
  pullQuote?: string;
  table?: {
    caption?: string;
    headers: string[];
    rows: { cells: string[] }[];
  };
}
export interface ImageTreatment {
  type: 'editorial-abstract' | 'field-photograph' | 'data-graphic' | 'portrait';
  alt: string;
  palette: string;
  caption: string;
}
export interface TimelineEvent {
  slug: string;
  date: string;
  title: string;
  description: string;
  entities: string[];
  story?: string;
  sourceSlugs?: string[];
  topicSlugs?: string[];
  researchSlugs?: string[];
  reportSlugs?: string[];
  dataProductSlugs?: string[];
}
export interface Entity {
  slug: string;
  name: string;
  kind: EntityKind;
  strapline: string;
  overview: string;
  profileSections?: { heading: string; paragraphs: string[] }[];
  primaryReferences?: { label: string; url: string }[];
  profileReviewedAt?: string;
  profileStatus?: 'maintained' | 'historical';
  profileReviewHistory?: {
    reviewedAt: string;
    triggeringUpdate: string;
    referencesChecked: {
      label: string;
      url: string;
      captureStatus: 'snapshot' | 'fingerprinted' | 'not-captured' | 'failed';
      capturedAt?: string;
      contentHash?: string;
      snapshotUrl?: string;
      captureNote?: string;
    }[];
    claimChangeSummary: string;
    claimComparison?: {
      status: 'compared' | 'no-prior-version';
      changes: {
        section: string;
        status: 'added' | 'revised' | 'removed';
        previousText: string | null;
        currentText: string | null;
      }[];
    };
  }[];
  headquarters?: string;
  founded?: string;
  relatedOrganizations: string[];
  keyMetrics: { label: string; value: string; context: string }[];
  latestDevelopments: string[];
  timeline: string[];
  signals: string[];
  recentStories: string[];
}

export interface EntityProfileClaim {
  section: string;
  text: string;
}

export interface EntityProfileClaimChange {
  section: string;
  status: 'added' | 'revised' | 'removed';
  previousText: string | null;
  currentText: string | null;
}

export interface EntityProfileClaimComparison {
  status: 'compared' | 'no-prior-version';
  changes: EntityProfileClaimChange[];
}

export function getEntityProfileClaims(
  profile: Pick<Entity, 'strapline' | 'overview' | 'profileSections' | 'headquarters' | 'founded' | 'keyMetrics' | 'latestDevelopments'>,
): EntityProfileClaim[] {
  return [
    { section: 'Profile summary', text: profile.strapline },
    { section: 'Overview', text: profile.overview },
    ...(profile.headquarters ? [{ section: 'Headquarters', text: profile.headquarters }] : []),
    ...(profile.founded ? [{ section: 'Founded', text: profile.founded }] : []),
    ...(profile.profileSections ?? []).flatMap((section) =>
      section.paragraphs.map((text) => ({ section: section.heading, text })),
    ),
    ...profile.keyMetrics.map((metric) => ({
      section: `Key metric: ${metric.label}`,
      text: `${metric.value} — ${metric.context}`,
    })),
    ...profile.latestDevelopments.map((text) => ({ section: 'Latest developments', text })),
  ];
}

export function compareEntityProfileClaims(
  previousClaims: EntityProfileClaim[] | undefined,
  currentClaims: EntityProfileClaim[],
): EntityProfileClaimComparison {
  if (!previousClaims) return { status: 'no-prior-version', changes: [] };

  const sectionOrder = [...new Set([
    ...currentClaims.map((claim) => claim.section),
    ...previousClaims.map((claim) => claim.section),
  ])];
  const changes: EntityProfileClaimChange[] = [];

  for (const section of sectionOrder) {
    const previous = previousClaims.filter((claim) => claim.section === section).map((claim) => claim.text);
    const current = currentClaims.filter((claim) => claim.section === section).map((claim) => claim.text);
    const lcs = Array.from({ length: previous.length + 1 }, () =>
      Array<number>(current.length + 1).fill(0),
    );
    for (let oldIndex = previous.length - 1; oldIndex >= 0; oldIndex -= 1) {
      for (let newIndex = current.length - 1; newIndex >= 0; newIndex -= 1) {
        lcs[oldIndex][newIndex] = previous[oldIndex] === current[newIndex]
          ? lcs[oldIndex + 1][newIndex + 1] + 1
          : Math.max(lcs[oldIndex + 1][newIndex], lcs[oldIndex][newIndex + 1]);
      }
    }

    const matches: Array<[number, number]> = [];
    let oldIndex = 0;
    let newIndex = 0;
    while (oldIndex < previous.length && newIndex < current.length) {
      if (previous[oldIndex] === current[newIndex]) {
        matches.push([oldIndex, newIndex]);
        oldIndex += 1;
        newIndex += 1;
      } else if (lcs[oldIndex + 1][newIndex] >= lcs[oldIndex][newIndex + 1]) {
        oldIndex += 1;
      } else {
        newIndex += 1;
      }
    }

    let oldCursor = 0;
    let newCursor = 0;
    for (let matchIndex = 0; matchIndex <= matches.length; matchIndex += 1) {
      const [nextOld, nextNew] = matches[matchIndex] ?? [previous.length, current.length];
      const removed = previous.slice(oldCursor, nextOld);
      const added = current.slice(newCursor, nextNew);
      const revisedCount = Math.min(removed.length, added.length);
      for (let index = 0; index < revisedCount; index += 1) {
        changes.push({
          section,
          status: 'revised',
          previousText: removed[index],
          currentText: added[index],
        });
      }
      for (const text of removed.slice(revisedCount)) {
        changes.push({ section, status: 'removed', previousText: text, currentText: null });
      }
      for (const text of added.slice(revisedCount)) {
        changes.push({ section, status: 'added', previousText: null, currentText: text });
      }
      oldCursor = nextOld + 1;
      newCursor = nextNew + 1;
    }
  }

  return { status: 'compared', changes };
}

export function summarizeEntityProfileClaimComparison(
  comparison: EntityProfileClaimComparison,
): string {
  if (comparison.status === 'no-prior-version') {
    return 'No earlier saved profile version is available for comparison.';
  }
  if (comparison.changes.length === 0) {
    return 'No claim text changed since the previous saved review.';
  }
  const counts = {
    added: comparison.changes.filter((change) => change.status === 'added').length,
    revised: comparison.changes.filter((change) => change.status === 'revised').length,
    removed: comparison.changes.filter((change) => change.status === 'removed').length,
  };
  const parts = (['added', 'revised', 'removed'] as const)
    .filter((status) => counts[status] > 0)
    .map((status) => `${counts[status]} ${status}`);
  return `Compared with the previous saved review: ${parts.join(', ')} ${comparison.changes.length === 1 ? 'claim' : 'claims'} changed.`;
}

export function normalizeEntityProfileReviews(entity: Entity): Entity {
  if (!entity.profileSections?.length) return entity;
  const profileReviewHistory = entity.profileReviewHistory?.length
    ? entity.profileReviewHistory
    : entity.profileReviewedAt && entity.primaryReferences?.length
      ? [{
        reviewedAt: entity.profileReviewedAt,
        triggeringUpdate: 'Baseline review; no specific timeline update was recorded.',
        referencesChecked: entity.primaryReferences.map((reference) => ({
          label: reference.label,
          url: reference.url,
          captureStatus: 'not-captured' as const,
          captureNote: 'The original review did not retain a dated copy or content fingerprint.',
        })),
        claimChangeSummary: 'First recorded review. No earlier profile snapshot is retained to verify claim-by-claim changes.',
      }]
      : [];
  if (!profileReviewHistory.length) return entity;
  const latestReview = profileReviewHistory.reduce((latest, review) =>
    review.reviewedAt.slice(0, 10) > latest.reviewedAt.slice(0, 10) ? review : latest,
  );
  return {
    ...entity,
    profileReviewedAt: latestReview.reviewedAt,
    profileReviewHistory,
  };
}

export const ENTITY_PROFILE_REVIEW_INTERVAL_DAYS = 90;
export const ENTITY_PROFILE_REVIEW_UPCOMING_DAYS = 21;

export type EntityProfileReviewReason = 'linked-update' | 'interval' | 'invalid-date';
export type EntityProfileReviewQueueReason = EntityProfileReviewReason | 'upcoming';

export interface EntityProfileReviewQueueState {
  reason: EntityProfileReviewQueueReason;
  dueAt: string | null;
  daysUntilDue: number | null;
}

export function getEntityProfileReviewReason(
  profile: Pick<Entity, 'profileReviewedAt' | 'timeline'>,
  now = new Date(),
  events: readonly TimelineEvent[] = timelineEvents,
): EntityProfileReviewReason | undefined {
  const reviewedAt = profile.profileReviewedAt;
  const reviewedDayText = reviewedAt?.slice(0, 10);
  if (
    !reviewedAt
    || !reviewedDayText
    || !/^\d{4}-\d{2}-\d{2}$/u.test(reviewedDayText)
    || (reviewedAt.length > 10 && !Number.isFinite(Date.parse(reviewedAt)))
  ) return 'invalid-date';

  const reviewedDate = new Date(`${reviewedDayText}T00:00:00.000Z`);
  if (!Number.isFinite(reviewedDate.getTime()) || reviewedDate.toISOString().slice(0, 10) !== reviewedDayText) {
    return 'invalid-date';
  }

  const linkedUpdateAfterReview = events.some((event) =>
    profile.timeline.includes(event.slug) && event.date.slice(0, 10) > reviewedDayText,
  );
  if (linkedUpdateAfterReview) return 'linked-update';

  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const reviewedDay = Date.UTC(reviewedDate.getUTCFullYear(), reviewedDate.getUTCMonth(), reviewedDate.getUTCDate());
  const daysSinceReview = Math.floor((today - reviewedDay) / 86_400_000);
  return daysSinceReview < 0 || daysSinceReview >= ENTITY_PROFILE_REVIEW_INTERVAL_DAYS
    ? 'interval'
    : undefined;
}

export function isEntityProfileReviewDue(
  profile: Pick<Entity, 'profileReviewedAt' | 'timeline'>,
  now = new Date(),
  events: readonly TimelineEvent[] = timelineEvents,
): boolean {
  return getEntityProfileReviewReason(profile, now, events) !== undefined;
}

export function getEntityProfileReviewQueueState(
  profile: Pick<Entity, 'profileReviewedAt' | 'timeline'>,
  now = new Date(),
  events: readonly TimelineEvent[] = timelineEvents,
): EntityProfileReviewQueueState | undefined {
  const reviewReason = getEntityProfileReviewReason(profile, now, events);
  const reviewedDay = profile.profileReviewedAt?.slice(0, 10);
  if (reviewReason === 'invalid-date' || !reviewedDay) {
    return { reason: 'invalid-date', dueAt: null, daysUntilDue: null };
  }

  const dueDate = new Date(`${reviewedDay}T00:00:00.000Z`);
  dueDate.setUTCDate(dueDate.getUTCDate() + ENTITY_PROFILE_REVIEW_INTERVAL_DAYS);
  const dueAt = dueDate.toISOString().slice(0, 10);
  const dueDay = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysUntilDue = Math.round((dueDay - today) / 86_400_000);
  const reason = reviewReason
    ?? (daysUntilDue >= 0 && daysUntilDue <= ENTITY_PROFILE_REVIEW_UPCOMING_DAYS
      ? 'upcoming'
      : undefined);
  return reason ? { reason, dueAt, daysUntilDue } : undefined;
}
export interface Story {
  slug: string;
  category: StoryCategory;
  title: string;
  dek: string;
  body: BodySection[];
  date: string;
  dateModified?: string;
  updatedAt?: string;
  readTime: string;
  author: string;
  authorType?: 'person' | 'organization';
  authorName?: string;
  evidence: string;
  evidenceSummary: EvidenceSummary;
  classification: 'reported' | 'analysis' | 'opinion' | 'synthesis';
  contentType?: EditorialContentType;
  section?: EditorialSection;
  entities: string[];
  timeline: string[];
  relatedStories: string[];
  imageTreatment: ImageTreatment;
  topic: string;
  sources: string[];
  bottomLine: string;
  whyItMatters: string;
  keyTakeaways: string[];
  whatChanges: string;
}

const genericIndiaWatchDek =
  'relevant for professionals tracking industry developments';

export function getPublicStoryDek(
  story: Pick<Story, 'category' | 'dek'>,
): string | undefined {
  const dek = story.dek.trim();
  if (!dek) return undefined;
  if (
    story.category === 'India Watch'
    && dek.toLocaleLowerCase().replace(/[.!?]+$/u, '') === genericIndiaWatchDek
  ) {
    return undefined;
  }
  return dek;
}

/**
 * Collapse duplicate public story records by their canonical article route.
 * When duplicate snapshots disagree, retain the newest editorial date and
 * prefer the canonical record over an alias on a same-date tie.
 */
export function uniqueStoriesByCanonicalSlug<T extends Pick<Story, 'slug' | 'date'>>(
  storyRecords: readonly T[],
): T[] {
  const byCanonicalSlug = new Map<string, T>();
  for (const story of storyRecords) {
    const canonicalSlug = canonicalStorySlug(story.slug);
    const previous = byCanonicalSlug.get(canonicalSlug);
    if (
      !previous
      || story.date > previous.date
      || (story.date === previous.date && story.slug === canonicalSlug && previous.slug !== canonicalSlug)
    ) {
      byCanonicalSlug.set(canonicalSlug, story);
    }
  }
  return [...byCanonicalSlug.values()].sort((left, right) =>
    right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug),
  );
}

export function getStoryReadTime(
  story: Pick<Story, 'title' | 'dek' | 'body' | 'bottomLine' | 'whyItMatters' | 'keyTakeaways' | 'whatChanges'>,
): string {
  const bodyText = story.body.flatMap((section) => [
    section.heading,
    ...section.paragraphs,
    section.pullQuote ?? '',
    section.table?.caption ?? '',
    ...(section.table?.rows.flatMap((row) => row.cells) ?? []),
  ]);
  const wordCount = [
    story.title,
    story.dek,
    story.bottomLine,
    story.whyItMatters,
    ...story.keyTakeaways,
    story.whatChanges,
    ...bodyText,
  ].join(' ').trim().split(/\s+/u).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 250));
  return `${minutes} min read`;
}

const readerFacingContentTypes: Record<Story['classification'], string> = {
  reported: 'Reporting',
  analysis: 'Analysis',
  opinion: 'Opinion',
  synthesis: 'Synthesis',
};

export function getReaderFacingContentType(classification: Story['classification']): string {
  return readerFacingContentTypes[classification];
}

export const MINIMUM_STORY_WORDS = 800;
export const MINIMUM_BRIEF_WORDS = 120;
export const MAXIMUM_BRIEF_WORDS = 220;

export function getEditorialWordCountBounds(section?: string): {
  minimum: number;
  maximum?: number;
} {
  return section === 'Brief'
    ? { minimum: MINIMUM_BRIEF_WORDS, maximum: MAXIMUM_BRIEF_WORDS }
    : { minimum: MINIMUM_STORY_WORDS };
}

export function getPublicDateModified(
  story: Pick<Story, 'date' | 'dateModified'>,
): string | undefined {
  if (!story.dateModified) return undefined;
  const publishedDate = story.date.slice(0, 10);
  const modifiedDate = story.dateModified.slice(0, 10);
  const isValidDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  };
  if (
    !isValidDate(publishedDate) ||
    !isValidDate(modifiedDate) ||
    !Number.isFinite(Date.parse(story.dateModified)) ||
    modifiedDate < publishedDate
  ) {
    return undefined;
  }
  return modifiedDate;
}

export interface PublicArticleEligibilityInput {
  status?: string;
  publishAt?: string | Date;
  wordCount?: number;
  section?: EditorialSection;
  date?: string | Date;
}

export function isPublicArticle(article: PublicArticleEligibilityInput, now = new Date()): boolean {
  const hasReleaseLifecycle = article.status !== undefined
    || article.publishAt !== undefined
    || article.wordCount !== undefined;

  if (hasReleaseLifecycle) {
    if (
      article.status !== 'scheduled' && article.status !== 'published'
      || article.publishAt === undefined
      || typeof article.wordCount !== 'number'
    ) {
      return false;
    }
    const publishTime = article.publishAt instanceof Date
      ? article.publishAt.getTime()
      : Date.parse(article.publishAt);
    const bounds = getEditorialWordCountBounds(article.section);
    return Number.isFinite(publishTime)
      && publishTime <= now.getTime()
      && article.wordCount >= bounds.minimum
      && (bounds.maximum === undefined || article.wordCount <= bounds.maximum);
  }

  const publicationTime = article.date instanceof Date
    ? article.date.getTime()
    : Date.parse(article.date ?? '');
  return Number.isFinite(publicationTime) && publicationTime <= now.getTime();
}

export function isPublicEditorialRelease(
  status: string,
  publishAt: string | Date,
  wordCount: number,
  now = new Date(),
): boolean {
  return isPublicArticle({ status, publishAt, wordCount }, now);
}

export function getEditorialLifecycleStatus(
  status: string,
  publishAt: string | Date,
  wordCount: number,
  now = new Date(),
  section?: EditorialSection,
): EditorialLifecycleStatus {
  if (status === 'draft' || status === 'unpublished' || status === 'archived' || status === 'canceled') {
    return status;
  }
  if (status !== 'scheduled' && status !== 'published') return 'unpublished';
  return isPublicArticle({ status, publishAt, wordCount, section }, now)
    ? 'published'
    : 'scheduled';
}

export function countEditorialWords(copy: string): number {
  return copy.trim().split(/\s+/).filter(Boolean).length;
}

export function getReleaseDraftWordCount(dek: string, body: string): number {
  return countEditorialWords(`${dek} ${body}`);
}

export function getReleaseWordCount(dek: string, body: string | BodySection[]): number {
  const bodyCopy =
    typeof body === 'string'
      ? body
      : body
          .flatMap((section) => section.paragraphs)
          .join(' ');
  return countEditorialWords([dek, bodyCopy].join(' '));
}

export function getStoryWordCount(story: Story): number {
  const visibleCopy = [
    story.dek,
    ...story.body.flatMap((section) => section.paragraphs),
    story.bottomLine,
    story.whyItMatters,
    ...story.keyTakeaways,
    story.whatChanges,
  ].join(' ');
  return countEditorialWords(visibleCopy);
}

export type EditorialCadence = 'daily' | 'weekly';
export type EditorialLifecycleStatus =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'unpublished'
  | 'archived'
  | 'canceled';
export interface ScheduledStory extends Story {
  publishAt: string;
  cadence: EditorialCadence;
}
export interface EditorialScheduleItem {
  slug: string;
  title: string;
  dek: string;
  publishAt: string;
  cadence: EditorialCadence;
  status: EditorialLifecycleStatus;
  position: number;
  story?: Story;
}
export interface Signal {
  slug: string;
  label: string;
  topic: string;
  direction: SignalDirection;
  impact: SignalImpact;
  change: string;
  summary: string;
  entities: string[];
  stories: string[];
  updated: string;
}
export interface IndustryMapNode {
  slug: string;
  name: string;
  layer: 'Frontier Labs' | 'Infrastructure' | 'Models' | 'Agents' | 'Applications' | 'Capital' | 'Policy';
  description: string;
  entities: string[];
  pressure: string;
  x: number;
  y: number;
}
export interface IndiaIndexMetric {
  slug: string;
  label: string;
  value: string;
  change: string;
  context: string;
  source: string;
}
export interface Essay {
  slug: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  readTime: string;
  themes: string[];
  body: BodySection[];
}
export interface AskGlobalAnswer {
  slug: string;
  question: string;
  answer: string;
  citedStories: string[];
  citedSources: string[];
  citedTimeline: string[];
  citedEntities: string[];
  asOf: string;
}

export let authors: Author[] = [
  { slug: 'mira-patel', name: 'Mira Patel', role: 'Science & systems editor', bio: 'Mira covers the point where machine intelligence meets physical science, medicine and the laboratory.', location: 'London', initials: 'MP' },
  { slug: 'jonas-rhee', name: 'Jonas Rhee', role: 'Policy correspondent', bio: 'Jonas reports on standards, provenance and the policy infrastructure of the AI economy.', location: 'Brussels', initials: 'JR' },
  { slug: 'ananya-rao', name: 'Ananya Rao', role: 'India editor', bio: 'Ananya writes about Indian technology, public digital infrastructure and the companies building for its next billion users.', location: 'Bengaluru', initials: 'AR' },
  { slug: 'ishaan-mehta', name: 'Ishaan Mehta', role: 'Models editor', bio: 'Ishaan follows model releases, evaluation and the economics of running intelligence at the edge.', location: 'Singapore', initials: 'IM' },
  { slug: 'lena-hoff', name: 'Lena Hoff', role: 'Enterprise correspondent', bio: 'Lena studies how AI becomes an operating capability inside ambitious organizations.', location: 'Berlin', initials: 'LH' },
  { slug: 'david-okafor', name: 'David Okafor', role: 'Infrastructure editor', bio: 'David covers energy, chips, data centres and the physical geography behind computation.', location: 'Lagos', initials: 'DO' },
];

export type StoryAuthorIdentity = {
  type: 'Person' | 'Organization';
  name: string;
  slug?: string;
  description?: string;
};

const editorialDeskIdentity: StoryAuthorIdentity = {
  type: 'Organization',
  name: 'Global AI News Editorial Desk',
  description:
    'The Global AI News Editorial Desk publishes source-linked reporting, analysis, research and reference material on AI systems, infrastructure, policy and their economic effects.',
};

export function getStoryAuthorIdentity(
  story: Pick<Story, 'author' | 'authorType' | 'authorName'>,
  authorRecords: readonly Author[] = authors,
): StoryAuthorIdentity {
  const person = authorRecords.find(
    (author) => author.slug === story.author && author.verifiedForPublication === true,
  );
  return person
    ? { type: 'Person', name: person.name, slug: person.slug }
    : { ...editorialDeskIdentity };
}

export let sources: Source[] = [
  { slug: 'nature-antibiotic-study', name: 'A generative artificial intelligence approach for the discovery of antimicrobial peptides against multidrug-resistant bacteria', publisher: 'Nature Microbiology', kind: 'primary', sourceType: 'academic-paper', classification: 'primary', url: 'https://www.nature.com/articles/s41564-025-02114-4', accessed: '2026-10-06', publicationDate: '2025-10-03', tier: 1, evidenceType: 'full-page', scopeNote: 'ProteoGPT and specialized protein-language-model pipeline; findings are reported for in-vitro assays and mouse infection models, not human treatment.' },
  { slug: 'open-a7f1c833c9a1e5c0', name: 'How a Cooperative-Override Circuit Suppresses Nash Play in Large Language Models (version 3)', publisher: 'arXiv', kind: 'primary', sourceType: 'academic-paper', classification: 'primary', url: 'https://arxiv.org/abs/2604.27167v3', accessed: '2026-10-06', publicationDate: '2026-09-18', tier: 1, evidenceType: 'full-page', scopeNote: 'Version 3 is a major revision; its claims concern the tested models, prompts, and game protocols and remain a preprint.' },
  { slug: 'uspto-ai-inventorship', name: 'Guidance on AI-assisted inventions', publisher: 'United States Patent and Trademark Office', kind: 'primary', url: 'https://www.uspto.gov/sites/default/files/documents/ai-inventorship-memo.pdf', accessed: '2026-10-02' },
  { slug: 'indiaai-mission', name: 'IndiaAI Mission', publisher: 'Ministry of Electronics and Information Technology', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://indiaai.gov.in/', accessed: '2026-09-08' },
  { slug: 'stanford-ai-index-2026', name: 'AI Index Report 2026', publisher: 'Stanford Institute for Human-Centered AI', kind: 'independent', sourceType: 'research-report', classification: 'secondary', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report', accessed: '2026-10-05', tier: 2, evidenceType: 'full-page', scopeNote: 'The report documents OSWorld task accuracy, its reported human baseline, and remaining agent failures; these benchmark results do not establish success rates for a specific production workflow.' },
  { slug: 'iea-data-centres', name: 'Energy and AI: data centre demand', publisher: 'International Energy Agency', kind: 'dataset', url: 'https://www.iea.org/reports/energy-and-ai', accessed: '2026-10-01' },
  { slug: 'iea-energy-ai-executive-summary', name: 'Energy and AI: Executive Summary', publisher: 'International Energy Agency', kind: 'primary', sourceType: 'research-report', classification: 'primary', url: 'https://www.iea.org/reports/energy-and-ai/executive-summary', accessed: '2026-10-05', tier: 1, evidenceType: 'full-page', scopeNote: 'Reports global data-centre electricity use of 415 TWh in 2024 and projects about 945 TWh by 2030; AI is a leading growth driver alongside other digital services. These totals are not per-request energy measures or an AI-only inventory.' },
  { slug: 'eu-ai-act-code', name: 'Code of practice for general-purpose AI', publisher: 'European Commission', kind: 'primary', url: 'https://digital-strategy.ec.europa.eu/en/policies/ai-code-practice', accessed: '2026-10-02' },
  { slug: 'eu-ai-act-content-transparency', name: 'Code of Practice on Transparency of AI-generated Content', publisher: 'European Commission', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content', accessed: '2026-10-05', publicationDate: '2026-06-10', tier: 1, evidenceType: 'full-page', scopeNote: 'The Code is a voluntary compliance tool; the Commission states that in-scope Article 50 transparency obligations apply from 2 August 2026.' },
  { slug: 'c2pa-specification-v2-4', name: 'C2PA Technical Specifications, version 2.4', publisher: 'Coalition for Content Provenance and Authenticity', kind: 'primary', sourceType: 'technical-document', classification: 'primary', url: 'https://spec.c2pa.org/specifications/specifications/2.4/index.html', accessed: '2026-10-05', tier: 1, evidenceType: 'full-page', scopeNote: 'Technical standard for signed provenance assertions and asset history; it is not a determination that depicted content is true.' },
  { slug: 'c2pa-deployment-guidance-2026', name: 'Content Credentials: Deployment Guidance', publisher: 'Coalition for Content Provenance and Authenticity', kind: 'primary', sourceType: 'technical-document', classification: 'primary', url: 'https://c2pa.org/wp-content/uploads/sites/33/2026/07/Content-Credentials-Deployment-Guidance.pdf', accessed: '2026-10-05', publicationDate: '2026-07-08', tier: 1, evidenceType: 'full-page', scopeNote: 'C2PA-authored implementation guidance; supports vendor and workflow questions, not independent proof of adoption or end-to-end preservation.' },
  { slug: 'c2pa-independent-security-preprint', name: 'Verifying Provenance of Digital Media: Why the C2PA Specifications Fall Short', publisher: 'arXiv', kind: 'independent', sourceType: 'academic-paper', classification: 'secondary', url: 'https://arxiv.org/abs/2604.24890v1', accessed: '2026-10-05', publicationDate: '2026-04-27', tier: 2, evidenceType: 'full-page', scopeNote: 'Single arXiv security preprint analyzing C2PA versions 2.2–2.4; attribute its reported findings and do not present them as settled consensus.' },
  { slug: 'mistral-model-card', name: 'Mistral Small 4 model card', publisher: 'Mistral AI', kind: 'primary', sourceType: 'technical-document', classification: 'primary', url: 'https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03', accessed: '2026-10-06', publicationDate: '2026-03-16', tier: 1, evidenceType: 'full-page', scopeNote: 'Provider-authored specifications dated 16 March 2026 and license; the card does not independently benchmark performance or establish hardware fit.' },
  { slug: 'indiaai-cabinet-approval-2024', name: 'Cabinet approves the IndiaAI Mission', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2012355', accessed: '2026-10-03', publicationDate: '2024-03-07', tier: 1, evidenceType: 'full-page', scopeNote: 'Programme authorization and target; not proof of delivered capacity.' },
  { slug: 'pib-initial-compute-2025', name: 'With robust and high-end common computing facility in place, India all set to launch its own AI model', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2097709', accessed: '2026-10-03', publicationDate: '2025-01-30', tier: 1, evidenceType: 'full-page', scopeNote: 'Describes an initial facility and further GPUs to be added; does not establish that all planned GPUs were live.' },
  { slug: 'pib-common-compute-34000-2025', name: 'India’s Common Compute Capacity Crosses 34,000 GPUs', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817&lang=1&reg=3', accessed: '2026-10-03', publicationDate: '2025-05-30', tier: 1, evidenceType: 'full-page', scopeNote: 'Reports 34,333 GPUs, including empanelled and additional capacity; status is not defined as installed or live.' },
  { slug: 'pib-compute-onboarded-2026', name: 'Government supporting organisations and consortia to develop sovereign foundational models', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2245063', accessed: '2026-10-03', publicationDate: '2026-03-25', tier: 1, evidenceType: 'full-page', scopeNote: 'Reports 38,231 GPUs onboarded from 14 providers; retain the government’s “onboarded” wording.' },
  { slug: 'pib-onboarded-nearly-38000-2026', name: 'Innovation, Startups, MSMEs and Quality Manufacturing are Pillars of India’s Future Growth', publisher: 'Press Information Bureau, Ministry of Commerce and Industry', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2291450&lang=1&reg=3', accessed: '2026-10-04', publicationDate: '2026-07-29', tier: 1, evidenceType: 'full-page', scopeNote: 'Repeats a rounded “nearly 38,000 onboarded” figure without an exact count, provider inventory, or crosswalk to shared capacity.' },
  { slug: 'pib-data-centre-capacity-2026', name: 'Data centre capacity in the country has increased from about 375 MW in 2020 to around 1,500 MW by 2025', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2239616&lang=1&reg=3', accessed: '2026-10-03', publicationDate: '2026-03-13', tier: 1, evidenceType: 'full-page', scopeNote: 'This release labels 13.56 GW as projected data-centre electricity demand; a 2026-03-30 Rajya Sabha answer labels the same figure projected data-centre capacity. Official definitions conflict; neither is GPU supply.' },
  { slug: 'pib-capacity-and-use-factsheet-2026', name: 'Semiconductor and AI Revolution', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://www.pib.gov.in/FactsheetDetails.aspx?Id=150860&lang=1&reg=48', accessed: '2026-10-03', publicationDate: '2026-08-13', tier: 1, evidenceType: 'full-page', scopeNote: 'Reports 45,000+ shared GPUs and 93.18 lakh GPU-hours; the hours are not defined as metered consumption.' },
  { slug: 'indiaai-portal-eligibility', name: 'IndiaAI Compute Portal: eligibility criteria', publisher: 'IndiaAI Compute Portal', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://compute.indiaai.gov.in/eligibilitycriteria', accessed: '2026-10-03', tier: 1, evidenceType: 'portal-capture', scopeNote: 'Live programme guidance; recheck before treating criteria as current.' },
  { slug: 'indiaai-compute-portal', name: 'IndiaAI Compute Portal', publisher: 'IndiaAI Compute Portal', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://www.compute.indiaai.gov.in/', accessed: '2026-10-03', tier: 1, evidenceType: 'portal-capture', scopeNote: 'Shows application, provider and allocation process; not a dated utilization ledger.' },
  { slug: 'indiaai-compute-allocation-register-2026', name: 'IndiaAI Compute Capacity: GPU Compute Allocation', publisher: 'IndiaAI Portal', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://indiaai.gov.in/hub/indiaai-compute-capacity', accessed: '2026-10-04', tier: 1, evidenceType: 'portal-capture', scopeNote: 'Dated project-level allocation rows identify GPU count/type, provider and project dates; they are not a hardware inventory or evidence of current schedulability.' },
  { slug: 'indiaai-provider-accelerator-table-2026', name: 'IndiaAI Compute Portal: provider and accelerator-category table', publisher: 'IndiaAI Compute Portal', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://compute.indiaai.gov.in/files/empanelled-gpus.pdf', accessed: '2026-10-04', tier: 1, evidenceType: 'full-page', scopeNote: 'The PDF file metadata records creation on 2026-09-02; the document prints no publication or snapshot date. Its 45,081 total sums 14 bidder/consortium rows across NVIDIA/AMD GPU and Intel, AWS and Google accelerator categories. The document does not define the count status or denominator, so this is not a GPU-only, live, or schedulable inventory.' },
  { slug: 'indiaai-compute-price-calculator', name: 'IndiaAI Compute Portal price calculator', publisher: 'IndiaAI Compute Portal', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://compute.indiaai.gov.in/indiaaipricecalculator', accessed: '2026-10-03', tier: 1, evidenceType: 'portal-capture', scopeNote: 'Portal rate-card capture has no explicit update date and is not directly comparable with the PIB programme-wide average.' },
  { slug: 'sansad-power-data-centres-2026', name: 'Data Centres Power and Water Infrastructure Crisis, Rajya Sabha Unstarred Question No. 4151', publisher: 'Rajya Sabha, Ministry of Power', kind: 'primary', sourceType: 'parliamentary-record', classification: 'primary', url: 'https://sansad.in/getFile/annex/270/AU4151_DoYAWR.pdf?source=pqars', accessed: '2026-10-03', publicationDate: '2026-03-30', tier: 1, evidenceType: 'full-page', scopeNote: 'National generation adequacy does not measure local grid connections or facility-level draw.' },
  { slug: 'ceew-data-centre-footprint', name: 'Land, water, and energy footprint of India’s data centres', publisher: 'Council on Energy, Environment and Water', kind: 'independent', sourceType: 'research-report', classification: 'secondary', url: 'https://www.ceew.in/sites/default/files/ceew-data-centre-study-web-ready-final.pdf', accessed: '2026-10-03', tier: 2, evidenceType: 'full-page', scopeNote: 'National energy and water estimates rely on underlying third-party sources, not a government meter-based inventory.' },
  { slug: 'jll-india-data-centres-2026', name: 'India data centre 2026 mid-year report', publisher: 'JLL', kind: 'independent', sourceType: 'industry-report', classification: 'secondary', url: 'https://www.jll.com/en-in/insights/market-dynamics/india-data-centers', accessed: '2026-10-03', publicationDate: '2026-08-31', tier: 2, evidenceType: 'full-page', scopeNote: 'Industry estimates distinguish delivered stock, absorption, pre-commitments and projected pipeline.' },
  { slug: 'hbl-knight-frank-data-centre-pipeline-2026', name: 'India’s data centre pipeline reaches 8.33 GW on AI and cloud demand surge', publisher: 'The Hindu BusinessLine, reporting Knight Frank India', kind: 'independent', sourceType: 'news-report', classification: 'secondary', url: 'https://www.thehindubusinessline.com/info-tech/indias-data-centre-capacity-pipeline-hits-833-gw-amid-ai-and-cloud-boom/article71125654.ece', accessed: '2026-10-03', publicationDate: '2026-06-20', tier: 2, evidenceType: 'full-page', scopeNote: 'Reports live, under-construction, committed and early-stage capacity as different stages.' },
  { slug: 'knight-frank-india-data-centre-market-2025', name: 'India Data Centre Market Update 2025', publisher: 'Knight Frank Research', kind: 'independent', sourceType: 'industry-report', classification: 'secondary', url: 'https://content.knightfrank.com/research/3111/documents/en/india-data-centre-market-update-2025-12895.pdf', accessed: '2026-10-03', tier: 2, evidenceType: 'full-page', scopeNote: 'Year-end 2025 market estimates; under-construction, committed and early-stage pipeline are not operating stock.' },
  { slug: 'ettech-indiaai-recalibration-2026', name: 'IndiaAI Mission likely to rewire after GPU glitch', publisher: 'ETtech, The Economic Times', kind: 'independent', sourceType: 'news-report', classification: 'secondary', url: 'https://m.economictimes.com/tech/technology/indiaai-mission-likely-to-rewire-after-gpu-glitch/amp_articleshow/134600368.cms', accessed: '2026-10-03', publicationDate: '2026-10-01', tier: 2, evidenceType: 'full-page', scopeNote: 'Reports access to about 30,000 GPUs against a commitment of 45,000; this is not a government-reconciled inventory.' },
  { slug: 'ettech-indiaai-installed-2025', name: 'IndiaAI plan moves forward with over 17,000 GPUs successfully installed', publisher: 'ETtech, The Economic Times', kind: 'independent', sourceType: 'news-report', classification: 'secondary', url: 'https://m.economictimes.com/tech/artificial-intelligence/indiaai-plan-moves-forward-with-over-17000-gpus-successfully-installed/articleshow/122031788.cms', accessed: '2026-10-04', publicationDate: '2025-06-24', tier: 2, evidenceType: 'full-page', scopeNote: 'Reports a little over 17,300 GPUs installed as of a June 2025 provider review; this is an attributed, historical figure, not a current inventory.' },
  { slug: 'pib-ai-models-datasets-2026', name: 'AI models developed under IndiaAI Mission represent important progress in building India’s own AI capabilities', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2239614&lang=1&reg=3', accessed: '2026-10-03', publicationDate: '2026-03-13', tier: 1, evidenceType: 'full-page', scopeNote: 'Government programme-output claims do not independently establish model quality, adoption or public-service impact.' },
  { slug: 'cbre-india-data-centre-market-2025', name: 'India’s Data Centre Market in a New Era', publisher: 'CBRE India Research', kind: 'independent', sourceType: 'industry-report', classification: 'secondary', url: 'https://www.cbre.co.in/insights/reports/india-s-data-centre-market-in-a-new-era', accessed: '2026-10-03', publicationDate: '2025-11-12', tier: 2, evidenceType: 'full-page', scopeNote: 'Estimates 1,530 MW of operational stock in January–September 2025.' },
  { slug: 'ieefa-india-data-centre-power', name: 'India’s power-hungry data centre sector at a crossroads', publisher: 'Institute for Energy Economics and Financial Analysis', kind: 'independent', sourceType: 'research-report', classification: 'secondary', url: 'https://ieefa.org/resources/indias-power-hungry-data-centre-sector-crossroads', accessed: '2026-10-03', tier: 2, evidenceType: 'full-page', scopeNote: 'Attribute current and projected values to IEEFA; projections are not measured official totals.' },
  { slug: 'pib-data-centre-water-response-2026', name: 'Government response on data-centre water consumption and cooling', publisher: 'Press Information Bureau, Government of India', kind: 'primary', sourceType: 'government-record', classification: 'primary', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2246886&lang=1&reg=6', accessed: '2026-10-03', publicationDate: '2026-03-30', tier: 1, evidenceType: 'full-page', scopeNote: '“No concerns received” is not a measured national water-use inventory.' },
];

export const evidenceSummaries: Record<string, EvidenceSummary> = {
  antibiotic: { primarySources: 1, independentConfirmations: 0, confidence: 'DEVELOPING', note: 'One peer-reviewed primary study reports in-vitro and mouse-model findings; no independent replication is included in this source set.' },
  watermarking: { primarySources: 3, independentConfirmations: 0, confidence: 'MEDIUM', note: 'EU policy and C2PA capabilities are supported by official records; security criticisms come from one attributed arXiv preprint.' },
  'india-stack': { primarySources: 4, independentConfirmations: 3, confidence: 'HIGH', note: 'Government programme documents are supported by procurement and company disclosures.' },
  'small-models': { primarySources: 1, independentConfirmations: 0, confidence: 'DEVELOPING', note: 'One provider-authored model card supplies specifications; this source set contains no independent performance or hardware-fit measurements.' },
  founders: { primarySources: 2, independentConfirmations: 6, confidence: 'MEDIUM', note: 'The operating pattern recurs across interviews, but the sample is self-selecting.' },
  infrastructure: { primarySources: 4, independentConfirmations: 5, confidence: 'HIGH', note: 'Grid data, permitting records and operator announcements show regional concentration.' },
};

export let entities: Entity[] = ([
  {
    slug: 'openai', name: 'OpenAI', kind: 'company', strapline: 'A model developer and product company whose research reaches consumers, developers and organizations.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'OpenAI builds foundation models and products including ChatGPT and developer APIs. Its public record spans model releases, deployment, safety evaluations and a corporate structure that combines a nonprofit foundation with a public benefit corporation.',
    profileSections: [
      { heading: 'What the company does', paragraphs: ['OpenAI develops general-purpose AI models and makes them available through consumer products, business offerings and developer interfaces. Those are different deployment contexts: a capability shown in a model announcement is not automatically present in every ChatGPT plan or API endpoint.', 'The company describes its mission as ensuring that artificial general intelligence benefits all of humanity. Its October 2025 restructuring made the nonprofit OpenAI Foundation the controlling organization of OpenAI Group PBC. This is the company’s stated structure; it does not by itself establish how any specific product decision will be governed.'] },
      { heading: 'How to read its model announcements', paragraphs: ['GPT-5 launched in August 2025 as a unified system with fast and reasoning modes. OpenAI later announced GPT-5.5 in April 2026, so GPT-5 should be read as a dated model-family record—not assumed to be the company’s newest model. Model names, product availability, API identifiers and benchmark results change over time.', 'OpenAI publishes system cards and evaluation summaries alongside some releases. These are valuable first-party evidence about intended capabilities and the company’s own testing, but they are not independent evaluations. For procurement or research, compare the exact model, version, interface, date and task conditions rather than treating a family name as a complete specification.'] },
      { heading: 'What matters to users and organizations', paragraphs: ['For users, the practical questions are which features are available in their plan, how data is handled, what controls exist and what limitations apply. For developers, the relevant details are API-specific model identifiers, context and modality support, tool behavior, rate limits, pricing and deprecation dates; these should be checked in the live documentation before implementation.', 'Safety claims also need their evidence attached. A system card can describe internal testing and mitigations, but real-world risk depends on the product configuration, tools, access permissions and the way people use it. OpenAI’s safety work is therefore best assessed release by release, alongside independent research and observed deployment evidence.'] }
    ],
    primaryReferences: [{ label: 'OpenAI — Our structure', url: 'https://openai.com/our-structure/' }, { label: 'OpenAI — GPT-5.5 announcement', url: 'https://openai.com/index/introducing-gpt-5-5/' }, { label: 'OpenAI — GPT-5 system card', url: 'https://openai.com/index/gpt-5-system-card/' }, { label: 'OpenAI — Safety and responsibility', url: 'https://openai.com/safety' }],
    headquarters: 'San Francisco', founded: '2015', relatedOrganizations: ['microsoft', 'gpt-5'], keyMetrics: [{ label: 'Product lines', value: 'ChatGPT · API · business', context: 'Availability and model access vary by product and plan' }, { label: 'Organization', value: 'Foundation + PBC', context: 'OpenAI Foundation controls OpenAI Group PBC' }], latestDevelopments: ['OpenAI announced GPT-5.5 in April 2026; GPT-5 is not its newest release.', 'OpenAI’s 2025 restructuring made the nonprofit Foundation the controlling organization of OpenAI Group PBC.'], timeline: ['openai-agent-platform', 'gpt-5-release'], signals: ['frontier-model-race'], recentStories: ['small-models', 'founders']
  },
  {
    slug: 'anthropic', name: 'Anthropic', kind: 'company', strapline: 'A public-benefit AI company building Claude products and conducting frontier-model research.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'Anthropic develops the Claude model family and related tools for individuals, developers and organizations. The company says it focuses on reliable, interpretable and steerable AI, and publishes research on model behavior and safety.',
    profileSections: [
      { heading: 'Products and research', paragraphs: ['Anthropic’s public products include Claude for direct use, the Claude API and developer tools such as Claude Code. Model releases, product features and API access are related but not interchangeable: an announcement about one Claude model does not establish the features or limits of every Claude product.', 'Anthropic describes itself as a public benefit corporation. Its research program includes interpretability, alignment and evaluations of model behavior. Company-authored papers and system cards document its methods and findings, but should be identified as provider evidence rather than independent confirmation.'] },
      { heading: 'Claude 4 is a dated model family', paragraphs: ['Anthropic introduced Claude Opus 4 and Claude Sonnet 4 in May 2025, highlighting coding, reasoning and agent workflows. The launch page is useful for understanding what Anthropic claimed at release; current availability, successors and exact capabilities should be checked against Anthropic’s live model documentation.', 'For a real task, compare the exact model identifier and API or product surface. Long-running coding or computer-use demonstrations do not guarantee reliability on a different codebase, permission model or workflow. Independent task-specific tests remain necessary.'] },
      { heading: 'How to assess safety claims', paragraphs: ['Anthropic publishes a constitution describing intended Claude values and behavior, plus safety and interpretability research. These documents explain the company’s approach; they are not proof that a deployed system always follows the stated principles.', 'Readers should distinguish design intent, pre-deployment evaluations, product safeguards and independently observed outcomes. Each addresses a different question, and none alone establishes safety across all users and contexts.'] }
    ],
    primaryReferences: [{ label: 'Anthropic — Company', url: 'https://www.anthropic.com/company' }, { label: 'Anthropic — Introducing Claude 4', url: 'https://www.anthropic.com/news/claude-4' }, { label: 'Anthropic — Claude constitution', url: 'https://www.anthropic.com/constitution' }],
    headquarters: 'San Francisco', founded: '2021', relatedOrganizations: ['amazon', 'claude-4'], keyMetrics: [{ label: 'Product family', value: 'Claude', context: 'Consumer, developer and enterprise offerings' }, { label: 'Corporate form', value: 'Public benefit corporation', context: 'Company-stated legal structure' }], latestDevelopments: ['Claude 4 Opus and Sonnet were introduced in May 2025; check Anthropic’s current catalog for newer versions and availability.'], timeline: ['claude-4-release'], signals: ['frontier-model-race', 'enterprise-adoption'], recentStories: ['small-models', 'founders']
  },
  {
    slug: 'microsoft', name: 'Microsoft', kind: 'company', strapline: 'A software, cloud and AI platform company bringing models into widely used work products.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'Microsoft’s AI activity spans Azure infrastructure and services, developer tools, Microsoft 365 Copilot and other products. Its role is not only model development: distribution, cloud hosting, enterprise identity, security and software integration shape how AI reaches organizations.',
    profileSections: [
      { heading: 'The layers of Microsoft AI', paragraphs: ['Microsoft offers cloud infrastructure and AI services through Azure, developer experiences such as GitHub Copilot, and assistants embedded in Microsoft products. These surfaces have different model choices, data flows, controls and pricing. “Microsoft AI” is therefore not one model or one product.', 'The company’s product documentation describes how particular services handle prompts, organizational data and permissions. Those commitments are service-specific; customers should review the current terms and configuration for the exact product and region they use.'] },
      { heading: 'Distribution is a strategic advantage—and a responsibility', paragraphs: ['Embedding assistants in familiar software can reduce the work required to adopt AI. It also makes permissions, source attribution and human review central product questions: an assistant is useful only when it accesses the right information and makes clear what it did with that access.', 'For enterprise buyers, evaluate the task-level benefit against licensing, security, data governance, availability and the cost of review. Product claims and demonstrations should be tested against the organization’s own documents and workflows before rollout.'] },
      { heading: 'Partnerships and model choice', paragraphs: ['Microsoft has a long-running commercial relationship with OpenAI while also building and offering a broader AI platform. A partnership should not be mistaken for exclusive model dependence across every product; the model and hosting arrangement can vary by service and change over time.', 'The useful question is the actual stack behind a particular feature: model provider, deployment boundary, retrieval sources, data retention, access control and fallback behavior. These details—not a company-level partnership headline—determine what a customer is buying.'] }
    ],
    primaryReferences: [{ label: 'Microsoft 365 Copilot', url: 'https://www.microsoft.com/en-us/microsoft-365-copilot' }, { label: 'Microsoft Learn — Azure OpenAI data handling', url: 'https://learn.microsoft.com/en-us/dynamics365/business-central/azure-openai-data' }, { label: 'Microsoft AI', url: 'https://www.microsoft.com/en-us/ai' }],
    headquarters: 'Redmond', relatedOrganizations: ['openai', 'azure'], keyMetrics: [{ label: 'Main layers', value: 'Azure · Copilot · developer tools', context: 'Infrastructure, workplace products and software development' }], latestDevelopments: ['Product model, data handling and availability differ by Microsoft service; use the linked service documentation for current terms.'], timeline: ['azure-inference-expansion'], signals: ['compute-geography', 'enterprise-adoption'], recentStories: ['infrastructure']
  },
  {
    slug: 'google-deepmind', name: 'Google DeepMind', kind: 'lab', strapline: 'Google’s AI research organization working across foundation models, science and embodied systems.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'Google DeepMind brings together Google Brain and DeepMind research teams. Its work connects research models such as Gemini with Google products and scientific or robotics projects; not every research result is a generally available product.',
    profileSections: [
      { heading: 'Research and product are related, not identical', paragraphs: ['Google DeepMind publishes work across machine learning, science, robotics and other disciplines. The research portfolio includes both general-purpose systems and specialized tools. A research demonstration or paper should not be read as evidence that a capability is available in a consumer product or can be reproduced outside the reported setup.', 'Gemini is Google’s family of multimodal models and products. Model variants, APIs and consumer experiences can differ; technical documentation and model cards are the right place to confirm limits, modalities and access for a specific version.'] },
      { heading: 'Why the organization matters', paragraphs: ['The lab operates inside Google, giving its research a path to large-scale products, infrastructure and distribution. That creates a feedback loop between research and deployment, but it also means the organization’s work should be assessed at multiple levels: scientific contribution, product implementation and measured user impact.', 'Independent replication and transparent evaluation remain important, especially where a result is framed as a scientific discovery or a broad capability advance. The strength of evidence depends on the study design and external validation, not the prominence of the institution.'] },
      { heading: 'Science applications need domain validation', paragraphs: ['AI systems can help search, model or prioritize scientific hypotheses, but they do not replace experimental or domain-specific verification. For biology and medicine, a computational prediction is an early step: experiments must establish whether it works, and clinical studies are needed for claims about patient treatment.', 'This distinction is relevant to AI-assisted antibiotic discovery. The ProteoGPT study linked on this site is a separate academic research effort; it should not be attributed to Google DeepMind merely because the company has a broad science program.'] }
    ],
    primaryReferences: [{ label: 'Google DeepMind — About', url: 'https://deepmind.google/about/' }, { label: 'Google DeepMind — Research', url: 'https://deepmind.google/research/' }, { label: 'Google AI — Gemini models', url: 'https://ai.google.dev/gemini-api/docs/models' }],
    headquarters: 'London', relatedOrganizations: ['gemini', 'google'], keyMetrics: [{ label: 'Research areas', value: 'Models · science · robotics', context: 'Work spans research systems and deployed products' }], latestDevelopments: ['Google DeepMind’s research portfolio includes science and robotics; research demonstrations are not automatically product features.'], timeline: ['gemini-science-release'], signals: ['frontier-model-race'], recentStories: ['antibiotic']
  },
  {
    slug: 'gpt-5', name: 'GPT-5', kind: 'model', strapline: 'OpenAI’s August 2025 model release: a unified system with fast and reasoning modes.',
    profileReviewedAt: '2026-10-06', profileStatus: 'historical',
    overview: 'GPT-5 is a specific OpenAI model generation, introduced in August 2025. OpenAI described a system that routes between a fast model and deeper reasoning for harder prompts. The GPT-5 name covers product and API variants; it is not a single universal specification.',
    profileSections: [
      { heading: 'What OpenAI announced', paragraphs: ['OpenAI’s launch described GPT-5 as a unified system combining a fast model with a deeper reasoning model, selected according to task difficulty. The system card documents the model configurations and evaluations used for the release. This is provider-reported documentation, not an independent benchmark audit.', 'GPT-5 was later followed by additional GPT-5-series releases, including GPT-5.5 in April 2026. This page preserves GPT-5 as a historical model record. Check current OpenAI documentation before choosing a model for a new product or comparing it with a current competitor.'] },
      { heading: 'Capabilities are endpoint-specific', paragraphs: ['The API and ChatGPT product can expose different model variants, tools, limits and availability. Do not transfer context-window, modality, reasoning or pricing claims from one variant or interface to another. The old “1M tokens” claim previously attached to this profile was not supported as a universal GPT-5 specification and has been removed.', 'OpenAI’s system card describes evaluations in areas such as capability and safety. Scores depend on task selection, prompting, tools and test conditions; benchmark performance alone does not predict reliability on a user’s workflow.'] },
      { heading: 'What to check before using it', paragraphs: ['Confirm the exact API model identifier, supported input/output modalities, context and output limits, tool support, latency, pricing and any retirement schedule in the live docs. Then test representative tasks, including failure cases and tool errors, using the same settings intended for production.', 'For high-impact work, use independent evaluation, human review and controls appropriate to the consequences. A model’s reasoning mode is not a guarantee that its answer is correct or that it has verified its sources.'] }
    ],
    primaryReferences: [{ label: 'OpenAI — Introducing GPT-5', url: 'https://openai.com/index/introducing-gpt-5/' }, { label: 'OpenAI — GPT-5 system card', url: 'https://openai.com/index/gpt-5-system-card/' }, { label: 'OpenAI — Introducing GPT-5.5', url: 'https://openai.com/index/introducing-gpt-5-5/' }, { label: 'OpenAI API — Models', url: 'https://platform.openai.com/docs/models' }],
    relatedOrganizations: ['openai', 'microsoft'], keyMetrics: [{ label: 'Release', value: 'August 2025', context: 'OpenAI’s published launch date' }, { label: 'System design', value: 'Fast + reasoning', context: 'Release description; variant behavior differs by surface' }, { label: 'Status', value: 'Historical model record', context: 'Check current docs for the latest supported model' }], latestDevelopments: ['OpenAI announced GPT-5.5 in April 2026; specifications previously shown here were removed because they were not universal GPT-5 limits.'], timeline: ['gpt-5-release'], signals: ['frontier-model-race'], recentStories: ['small-models']
  },
  {
    slug: 'claude-4', name: 'Claude 4', kind: 'model', strapline: 'Anthropic’s May 2025 Claude Opus 4 and Sonnet 4 release family.',
    profileReviewedAt: '2026-10-06', profileStatus: 'historical',
    overview: 'Claude 4 refers to Anthropic’s Opus 4 and Sonnet 4 models announced in May 2025. Anthropic emphasized coding, advanced reasoning and agent workflows. This page describes that release generation, not every current Claude model or product.',
    profileSections: [
      { heading: 'The release family', paragraphs: ['Anthropic introduced Claude Opus 4 and Claude Sonnet 4 together. The company positioned Opus for complex, long-running tasks and Sonnet as a faster model with improved coding and reasoning relative to its predecessor. These are launch claims and should be read alongside the model’s exact system card and current documentation.', 'Anthropic also announced Claude Code as generally available at the time of the release. Product access, model aliases and feature availability can change; current Anthropic documentation takes precedence over an older launch article.'] },
      { heading: 'Agents and long-running work', paragraphs: ['A model used in an agent workflow may call tools, read files or take actions over multiple steps. Longer execution creates more opportunities for useful work, but also for compounding errors, incorrect assumptions and unsafe actions. Benchmarks or demonstrations do not establish that an agent can safely operate with unrestricted access.', 'Teams should test on representative tasks, limit tool permissions, require confirmation for consequential actions, preserve an audit trail and measure how often a person must intervene. These are deployment controls, not capabilities guaranteed by the model name.'] },
      { heading: 'A dated reference, not a current ranking', paragraphs: ['Claude 4 is retained here as an identifiable model generation because it has a release record and relationships to Anthropic’s products. It should not be treated as Anthropic’s newest model or as a stable leaderboard position. Check the current model list, API documentation and pricing before relying on any specification.', 'Independent, reproducible evaluation is needed for claims about comparative quality. Results should identify the exact model version, prompting, tools, task set and scoring method; otherwise a comparison may not be useful for a real purchasing or engineering decision.'] }
    ],
    primaryReferences: [{ label: 'Anthropic — Introducing Claude 4', url: 'https://www.anthropic.com/news/claude-4' }, { label: 'Anthropic — Claude models and documentation', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview' }, { label: 'Anthropic — Claude Code', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' }],
    relatedOrganizations: ['anthropic', 'amazon'], keyMetrics: [{ label: 'Release', value: 'May 2025', context: 'Opus 4 and Sonnet 4 launch' }, { label: 'Positioning', value: 'Coding · reasoning · agents', context: 'Provider-stated launch focus' }, { label: 'Status', value: 'Historical model record', context: 'Verify current supported versions in Anthropic docs' }], latestDevelopments: ['This is a dated model-family record, not a claim that Claude 4 is Anthropic’s newest supported generation.'], timeline: ['claude-4-release'], signals: ['frontier-model-race'], recentStories: ['small-models']
  },
  {
    slug: 'indiaai-mission', name: 'IndiaAI Mission', kind: 'policy', strapline: 'India’s multi-year public programme for compute, datasets, skills, innovation and responsible AI.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'The Union Cabinet approved the IndiaAI Mission on 7 March 2024 with an outlay of ₹10,371.92 crore over five years. The programme is organized around seven pillars. Announced targets and reported capacity figures are not, by themselves, evidence of installed or currently schedulable infrastructure.',
    profileSections: [
      { heading: 'Seven pillars, not just GPUs', paragraphs: ['The approved mission covers IndiaAI Compute Capacity, the IndiaAI Innovation Centre, datasets and platforms, application development, FutureSkills, startup financing and Safe & Trusted AI. This wider scope matters: the mission is an ecosystem programme, not simply a procurement contract for accelerators.', 'The original Cabinet announcement described a target of 10,000 or more GPUs through a public-private partnership. Later government releases report larger pool, onboarding or shared-capacity counts. Those terms describe different stages and must not be treated as one continuous installed-hardware inventory.'] },
      { heading: 'How to interpret the compute figures', paragraphs: ['The public record includes targets, planned additions, empanelled or onboarded capacity, reported shared capacity and independent reporting about practical access. Each figure has its own source, date, unit and definition. The current source-linked register on this site preserves those differences rather than adding unlike quantities.', 'As of the reviewed source set, the evidence does not establish how many GPUs are installed, deployed, accessible at a given moment or schedulable by a user today. The reported 45,000-plus shared-capacity figure is a dated government snapshot, not a live service inventory.'] },
      { heading: 'What to look for in delivery', paragraphs: ['For applicants and researchers, the practical questions are eligibility, application process, pricing, supported hardware, queue time, uptime, allocation rules and the available support. A national target cannot answer these user-level questions; they require current operational data from the service.', 'For the broader mission, assess each pillar against published milestones, actual allocations, participation, use and outcomes. Announced budgets or selected proposals are inputs. They do not prove that a service is operational or that intended public benefits have been achieved.'] }
    ],
    primaryReferences: [{ label: 'PIB — Cabinet approval of IndiaAI Mission, 7 March 2024', url: 'https://pib.gov.in/PressReleaseIframePage.aspx?PRID=2012355' }, { label: 'PIB — IndiaAI Mission updates, 6 August 2026', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2295477&lang=1&reg=48' }, { label: 'IndiaAI portal', url: 'https://indiaai.gov.in/' }],
    headquarters: 'New Delhi', relatedOrganizations: ['sarvam-ai', 'india-semiconductor-mission'], keyMetrics: [{ label: 'Approved outlay', value: '₹10,371.92 crore', context: 'Five-year programme announced in March 2024' }, { label: 'Programme design', value: 'Seven pillars', context: 'Compute, models, data, applications, skills, finance and safe AI' }], latestDevelopments: ['PIB’s August 2026 update names selected indigenous foundation-model proposals; selection does not establish completed, production-scale deployment.'], timeline: ['indiaai-compute-tender'], signals: ['india-public-stack'], recentStories: ['india-stack']
  },
  {
    slug: 'sarvam-ai', name: 'Sarvam AI', kind: 'company', strapline: 'An Indian AI company building language, speech and multimodal systems for Indian users and developers.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'Sarvam AI develops models and products with a focus on Indian languages, speech and document understanding. The company’s own catalog describes multiple model types and product surfaces; availability and technical specifications vary by release.',
    profileSections: [
      { heading: 'What Sarvam builds', paragraphs: ['Sarvam’s published catalog includes language, speech, vision and translation systems, alongside products for developers and end users. The company positions its work around Indian languages and use cases. That positioning is a product focus, not independent evidence that every language or task has equivalent quality.', 'A model catalog is a starting point for evaluation. For a particular release, check supported languages, input/output formats, license, deployment method, throughput, latency and whether the model is generally available or marked as upcoming.'] },
      { heading: 'IndiaAI Mission connection', paragraphs: ['In April 2025, Sarvam announced that it had been selected under the IndiaAI Mission to build an indigenous large language model. The government’s later programme updates list Sarvam proposals among selected sovereign-model efforts. Selection and dedicated compute support are meaningful programme milestones, but are not proof that a model has been completed, deployed at population scale or validated for every proposed use.', 'Keep the company’s announcement and government status reports distinct: they come from interested parties and describe programme plans or milestones. Independent testing and operational evidence are needed to assess performance, safety, cost and adoption.'] },
      { heading: 'Questions for buyers and public services', paragraphs: ['For language products, evaluate speech recognition and generation across accents, code-switching, noisy recordings and the specific dialects users speak. For document models, test tables, forms, handwriting and low-quality scans using representative documents.', 'For public-facing deployments, assess consent, data handling, error escalation and human review. A model’s Indian-language focus does not by itself guarantee accessibility, privacy or dependable service in every local context.'] }
    ],
    primaryReferences: [{ label: 'Sarvam AI — Models', url: 'https://www.sarvam.ai/models' }, { label: 'Sarvam AI — India sovereign LLM announcement', url: 'https://www.sarvam.ai/blogs/indias-sovereign-llm' }, { label: 'PIB — IndiaAI Mission model updates, 6 August 2026', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2295477&lang=1&reg=48' }],
    headquarters: 'Bengaluru', founded: '2023', relatedOrganizations: ['indiaai-mission'], keyMetrics: [{ label: 'Product focus', value: 'Indian languages', context: 'Language, speech, vision and translation' }, { label: 'Mission milestone', value: 'Selected proposal', context: 'Announced under IndiaAI; selection is not equivalent to completed deployment' }], latestDevelopments: ['Sarvam’s published model catalog spans language, speech, vision and translation; check each model’s live availability and specification.'], timeline: ['sarvam-public-model'], signals: ['india-public-stack'], recentStories: ['india-stack', 'small-models']
  },
  {
    slug: 'antibiotic-discovery', name: 'AI antibiotic discovery', kind: 'technology', strapline: 'Using machine learning to prioritize antimicrobial candidates for laboratory testing.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'AI-assisted antibiotic discovery can search chemical or biological sequence spaces, estimate candidate properties and prioritize experiments. A model output is a hypothesis: a candidate must be synthesized or produced, tested in relevant assays and validated through further preclinical and clinical work.',
    profileSections: [
      { heading: 'The evidence ladder', paragraphs: ['A typical research pipeline moves from computational proposal or screening to synthesis, in-vitro assays, animal models, toxicology and—if justified—human trials. Each stage answers different questions. A candidate that inhibits bacteria in a laboratory assay is not yet a medicine, and animal efficacy does not establish human safety or benefit.', 'The linked ProteoGPT paper studies antimicrobial peptides, not conventional small-molecule antibiotics. It describes model-assisted mining and generation followed by experiments against specified resistant bacteria. Keeping the molecule class and evidence stage explicit prevents a broad “AI discovered a cure” claim from outrunning the study.'] },
      { heading: 'What the ProteoGPT study reports', paragraphs: ['The 2025 Nature Microbiology paper reports that selected peptides showed activity in laboratory tests and were evaluated in mouse infection models. The authors describe a pipeline that narrows a very large sequence space to candidates for experimental follow-up. The number of sequences considered is not the number of validated treatments.', 'The study is preclinical. It does not report a human trial, an approved medicine or independent replication in the source set reviewed here. These limits do not erase the result; they define what the result supports.'] },
      { heading: 'What would strengthen the evidence', paragraphs: ['Follow-up work should report reproducibility across laboratories, additional bacterial isolates, dose and exposure effects, toxicity, resistance development and the relationship between predicted properties and measured outcomes. A transparent account should track how many proposals are synthesized, tested and advanced at each stage.', 'Any claim about treatment should wait for properly designed clinical evidence and regulatory review. Until then, the responsible description is an AI-assisted research pipeline with promising preclinical findings—not a new therapy available to patients.'] }
    ],
    primaryReferences: [{ label: 'Nature Microbiology — ProteoGPT antimicrobial peptide study', url: 'https://www.nature.com/articles/s41564-025-02114-4' }],
    relatedOrganizations: ['google-deepmind'], keyMetrics: [{ label: 'Evidence stage', value: 'Preclinical', context: 'In-vitro assays and mouse infection models; no human trial in the cited paper' }, { label: 'Study', value: 'ProteoGPT', context: 'AI-assisted antimicrobial peptide mining and generation' }], latestDevelopments: ['The cited ProteoGPT paper reports preclinical peptide results; it does not report a human treatment trial.'], timeline: ['antibiotic-candidates'], signals: ['ai-in-science'], recentStories: ['antibiotic']
  },
  {
    slug: 'content-credentials', name: 'Content Credentials', kind: 'technology', strapline: 'A technical standard for recording signed provenance and edit history for digital media.',
    profileReviewedAt: '2026-10-06', profileStatus: 'maintained',
    overview: 'Content Credentials are built on the C2PA standard. A credential can carry signed assertions about an asset’s origin and edits. It does not prove that the depicted scene is true, and a missing credential does not prove that an asset is fake.',
    profileSections: [
      { heading: 'What the technology records', paragraphs: ['C2PA manifests can contain assertions about how digital content was created or changed, with cryptographic signatures that allow a compatible verifier to check whether the manifest has been altered and whether the signing credential chains to a trust source. The exact information depends on the tools and workflow that create the credential.', 'Provenance is not truth verification. A credential can help answer “what does this file’s recorded history say?” It cannot independently establish that a depicted event happened, that a source statement is accurate or that every edit was disclosed.'] },
      { heading: 'Why credentials may be missing', paragraphs: ['Credentials can be lost when media is transformed, copied or stripped of metadata; deployment guidance also describes durable or soft-binding approaches to help rediscover records. A file without a credential may be genuine, while a valid credential only supports the claims and trust model it contains.', 'For publishers and platforms, evaluate the full chain: capture, editing, export, upload, transformation, storage and verification. A standard on paper does not ensure that every participating service preserves the record or that audiences understand its limits.'] },
      { heading: 'Policy is related, but not the same thing', paragraphs: ['The EU AI Act’s Article 50 sets transparency duties for specified providers and deployers, including requirements related to marking certain synthetic outputs and disclosure in specified contexts. The European Commission’s Code of Practice is a voluntary tool to help demonstrate compliance; it is not itself the law.', 'There is no single universal watermark required on every image online. The legal obligation depends on the provision, actor, system and content involved. C2PA is one provenance technology, not a substitute for the full legal analysis or for fact-checking.'] }
    ],
    primaryReferences: [{ label: 'C2PA — Technical Specifications 2.4', url: 'https://spec.c2pa.org/specifications/specifications/2.4/index.html' }, { label: 'C2PA — Deployment guidance', url: 'https://c2pa.org/wp-content/uploads/sites/33/2026/07/Content-Credentials-Deployment-Guidance.pdf' }, { label: 'European Commission — AI transparency guidelines', url: 'https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations' }, { label: 'EU AI Act — Article 50', url: 'https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50' }],
    relatedOrganizations: [], keyMetrics: [{ label: 'Primary function', value: 'Media provenance', context: 'Signed assertions about origin and editing history' }, { label: 'Not a function', value: 'Truth certification', context: 'Credentials do not prove the depicted event is authentic' }], latestDevelopments: ['EU AI Act Article 50 duties apply to specified actors and contexts; the Commission’s Code of Practice is voluntary.'], timeline: ['watermarking-code'], signals: ['provenance-rules'], recentStories: ['watermarking']
  },
] satisfies Entity[]).map(normalizeEntityProfileReviews);

export let timelineEvents: TimelineEvent[] = [
  { slug: 'indiaai-compute-target-2024', date: '2024-03-07', title: 'IndiaAI Mission sets a common-compute target', description: 'The Cabinet approval sets a target of more than 10,000 GPUs; it is a programme target, not evidence of delivered capacity.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['indiaai-cabinet-approval-2024'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-initial-capacity-2025', date: '2025-01-30', title: 'IndiaAI describes initial compute and a planned addition', description: 'A government release describes about 10,000 initial GPUs and 8,693 more to be added; the planned addition is not confirmed as live capacity.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-initial-compute-2025'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-34333-2025', date: '2025-05-30', title: 'Government reports 34,333 GPUs in the common-compute pool', description: 'The reported total combines empanelled and additional capacity; the release does not define it as installed or schedulable.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-common-compute-34000-2025'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-installed-reported-2025', date: '2025-06-24', title: 'ET reports early IndiaAI GPU installation progress', description: 'ET attributed a little over 17,300 installed GPUs to a 16 June provider review; the report does not establish current schedulable supply.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['ettech-indiaai-installed-2025'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-onboarded-2026', date: '2026-03-25', title: 'Government reports 38,231 GPUs onboarded', description: 'The release attributes the reported count to 14 providers. It does not supply a provider-level live inventory.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-compute-onboarded-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-onboarded-nearly-38000-2026', date: '2026-07-29', title: 'PIB repeats a rounded onboarded figure', description: 'A PIB release says nearly 38,000 GPUs were onboarded but supplies no exact count or definition connecting onboarding to shared capacity.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-onboarded-nearly-38000-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-shared-capacity-2026', date: '2026-08-13', title: 'Factsheet reports more than 45,000 shared GPUs', description: 'The published factsheet says shared capacity exceeded 45,000 GPUs as of June 2026; it does not reconcile that figure with earlier snapshots.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-capacity-and-use-factsheet-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-access-reported-2026', date: '2026-10-01', title: 'Independent reporting puts access near 30,000 GPUs', description: 'ETtech reports access to about 30,000 GPUs against a 45,000 commitment. The report is not a reconciled government inventory.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['ettech-indiaai-recalibration-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'antibiotic-candidates', date: '2025-10-03', title: 'Nature Microbiology paper reports ProteoGPT preclinical results', description: 'A peer-reviewed study describes antimicrobial-peptide testing in laboratory assays and mouse infection models; it does not report human treatment results.', entities: ['antibiotic-discovery'], story: 'ai-models-antibiotic-discovery', sourceSlugs: ['nature-antibiotic-study'] },
  { slug: 'watermarking-code', date: '2026-08-02', title: 'EU AI Act content-transparency obligations begin to apply', description: 'The Commission says applicable Article 50 duties apply from this date; its transparency Code of Practice remains voluntary.', entities: ['content-credentials'], story: 'quiet-race-watermark-everything-ai-makes', sourceSlugs: ['eu-ai-act-content-transparency'] },
];

const storyBodies: Record<string, BodySection[]> = {
  antibiotic: [
    {
      heading: 'A protein model searches a vast sequence space',
      paragraphs: [
        'A 2025 Nature Microbiology paper describes ProteoGPT, a protein language model with more than 124 million parameters, alongside specialized models in a sequential pipeline for mining and generating antimicrobial peptides. The authors say their pipeline screens hundreds of millions of peptide sequences while filtering for antimicrobial activity and cytotoxic risk. This is a specific research system, not evidence that general-purpose chat models can discover antibiotics on their own. [@nature-antibiotic-study]',
        'The paper’s target is antimicrobial peptides (AMPs), short chains of amino acids that can act against bacteria. The authors report testing both mined and generated candidates against ICU-derived carbapenem-resistant Acinetobacter baumannii and methicillin-resistant Staphylococcus aureus. Their study describes laboratory assays and animal experiments; it does not report a human treatment trial. [@nature-antibiotic-study]',
      ],
      pullQuote: 'The reported result is a research pipeline with experimental checks, not a finished medicine.',
    },
    {
      heading: 'The first result is in the laboratory',
      paragraphs: [
        'In vitro, the authors report that both mined and generated AMPs showed activity against the two resistant bacteria and reduced susceptibility to resistance development under the study’s test conditions. Those words matter: a result in a defined assay is evidence about that assay, not proof that a candidate will work in a patient or remain effective in every clinical setting. [@nature-antibiotic-study]',
        'The research also compares selected peptides in mouse thigh-infection models. The paper reports therapeutic efficacy comparable to or greater than clinical antibiotics in those experiments, and reports no organ damage or disruption of gut microbiota in the studied animals. These are the authors’ preclinical findings, not a clinical safety or efficacy result. [@nature-antibiotic-study]',
      ],
    },
    {
      heading: 'A mouse result is not a human treatment',
      paragraphs: [
        'A drug candidate must pass many steps beyond an animal model, including reproducible testing, safety assessment and appropriately designed clinical studies. The Nature paper supports a narrower statement: its pipeline produced peptides that the authors tested in vitro and in mouse infection models. It does not establish a human dose, a clinical benefit, or approval for use. [@nature-antibiotic-study]',
        'That boundary is not a reason to dismiss the result. It is how preclinical evidence should be described. The paper adds experimental evidence to a model-assisted search, while leaving the distance between a candidate and a usable medicine unresolved. Readers should not interpret “against multidrug-resistant bacteria” as meaning that a treatment is available for people with those infections. [@nature-antibiotic-study]',
      ],
    },
    {
      heading: 'What the pipeline changes—and what it does not',
      paragraphs: [
        'The study’s contribution is a coordinated sequence of mining, generation and experimental testing. That can help researchers decide which peptide candidates merit laboratory attention. It does not remove the need to synthesize or test the candidates, and the paper does not show that the same pipeline will generalize to every pathogen or clinical problem. [@nature-antibiotic-study]',
        'The central evaluation question is therefore not how many sequences a model can score. It is whether candidates selected by the pipeline reproduce across relevant assays, remain safe in further testing and justify the next research step. Those are questions for additional experiments, not conclusions supplied by the model’s scale or architecture. [@nature-antibiotic-study]',
      ],
    },
    {
      heading: 'The evidence boundary is the story',
      paragraphs: [
        'The work is worth following because it connects a computational search with experiments against clinically important resistant bacteria. Its present status is still preclinical. The article describes one peer-reviewed primary study, and the source set used here contains no independent replication of its findings. [@nature-antibiotic-study]',
        'A careful account can recognize both points at once: the authors report promising activity in specified laboratory and mouse models, and no one should treat that as proof of a new antibiotic for patients. Further validation is what would move the claim forward. Until then, the useful lesson is about a model-assisted research process, not a medicine ready for the clinic. [@nature-antibiotic-study]',
      ],
    },
    {
      heading: 'Follow each candidate through the evidence ladder',
      paragraphs: [
        'The paper says seven leading peptides were selected for the mouse experiments after earlier screening and laboratory tests. That funnel matters: the number of sequences a pipeline can examine is not the number of candidates that reach an animal model, and neither number is a count of treatments ready for patients. The stages describe different evidence and should not be collapsed into one headline about “AI-discovered antibiotics.” [@nature-antibiotic-study]',
        'Useful follow-up work would make the path from selection to validation easy to inspect: which candidates were synthesized, which assays they passed, and which results were reproduced. Independent teams could test additional isolates and report how changes in dose and exposure affect the measured outcome. These are proposed checks, not findings reported by this paper.',
        'Before a patient-level claim could be considered, further studies would also need to address the safety and clinical questions that laboratory and mouse experiments cannot answer. The current paper gives readers a defined preclinical result to evaluate; it does not supply those later results. Keeping the stages separate lets the work be taken seriously without describing a research candidate as a medicine.',
      ],
    },
  ],
  watermarking: [
    {
      heading: 'A legal obligation and a voluntary code are different',
      paragraphs: [
        'The European Commission says the AI Act transparency obligations for in-scope providers and deployers apply from 2 August 2026. The accompanying Code of Practice helps organizations demonstrate compliance, but adherence to the code itself is voluntary; the underlying Article 50 obligations are legal requirements. That distinction matters more than calling every disclosure tool a new law. [@eu-ai-act-content-transparency]',
        'The Code addresses marking and detection of AI-generated or manipulated content, plus labels for deepfakes and certain AI-generated text. It does not require every image on the internet to carry one universal watermark. Its scope and duties depend on the relevant AI Act provisions and the role of the provider or deployer. [@eu-ai-act-content-transparency]',
      ],
    },
    {
      heading: 'Provenance describes a file history, not the truth',
      paragraphs: [
        'C2PA Content Credentials are signed assertions about an asset’s origin and edits. The specification describes a technical way for participating tools to attach and validate that history; it does not determine whether the scene in a photograph happened as shown. A valid provenance chain is evidence about handling, not a certificate that the content is authentic or true. [@c2pa-specification-v2-4]',
        'That boundary also shapes the meaning of a missing credential. The C2PA deployment guide warns that transformations such as screenshots or exports can remove embedded credentials. An unsigned file therefore cannot be treated as false, just as a signed file cannot replace ordinary verification of its claims. [@c2pa-deployment-guidance-2026] [@c2pa-specification-v2-4]',
      ],
    },
    {
      heading: 'One security preprint challenges current deployments',
      paragraphs: [
        'A security paper posted to arXiv in April 2026 reports weaknesses in C2PA specifications versions 2.2–2.4, including cases where timestamps could be altered and validators disagreed about a credential. These are the authors’ findings from one preprint; they should be reported as a challenge to test, not as a settled verdict on every C2PA implementation. [@c2pa-independent-security-preprint]',
        'The paper also makes the same important conceptual distinction: provenance is not authenticity. Its criticism is that users may over-trust a provenance signal when the standards or validators do not establish the guarantees they expect. Because this source set contains no independent replication of the reported exploits, the article attributes these claims rather than presenting them as consensus. [@c2pa-independent-security-preprint]',
      ],
    },
    {
      heading: 'Procurement should test the whole workflow',
      paragraphs: [
        'C2PA’s deployment guidance asks buyers to test whether credentials are attached by default, survive the real editing and publishing path, and can be inspected by the tools downstream teams use. Those are more useful questions than whether a vendor can show a successful demo on a clean sample file. The guide is written by C2PA, so it explains implementation practice rather than independently measuring adoption. [@c2pa-deployment-guidance-2026]',
        'A contract should also state what happens when the chain is missing or a validator reports a problem. The interface needs to distinguish “no credential found,” “credential present but not validated,” and “validated provenance” without turning any of those states into a verdict on the image’s truth. That is a product and editorial requirement, not just a cryptographic one. [@c2pa-deployment-guidance-2026] [@c2pa-independent-security-preprint]',
      ],
    },
    {
      heading: 'Keep provenance inside a broader verification process',
      paragraphs: [
        'For publishers, credentials can add a useful record to ordinary verification: who supplied the file, what edits were made, and whether the provenance signature validates in the chosen tool. Editors still need to check the source, caption and depicted event. Neither the C2PA specification nor the European Commission’s transparency code turns a metadata record into evidence that an underlying claim is true. [@c2pa-specification-v2-4] [@eu-ai-act-content-transparency]',
        'The strongest policy and product language states exactly what a signal can establish and where it stops. A provenance record can narrow uncertainty about a file’s handling. It cannot eliminate uncertainty about the scene, and a missing record does not settle the question in the opposite direction. [@c2pa-specification-v2-4] [@c2pa-independent-security-preprint]',
      ],
    },
    {
      heading: 'What readers should be told',
      paragraphs: [
        'A reader-facing credential panel should name the signer, describe the recorded edits, and say whether the chosen verifier accepts the signature. If the record cannot be checked, the page should say that plainly. These design choices follow from the C2PA guide’s emphasis on verification and from the security preprint’s reported validator inconsistencies; they are not a guarantee that every deployment already handles them well. [@c2pa-deployment-guidance-2026] [@c2pa-independent-security-preprint]',
        'The practical race is not to watermark everything. It is to make disclosure, provenance and verification useful in the situations where they apply—while keeping the limits visible. That lets law, standards and newsroom checks do distinct jobs instead of asking one technical mark to provide certainty it was not designed to supply. [@eu-ai-act-content-transparency] [@c2pa-specification-v2-4]',
      ],
    },
  ],
  'india-stack': [
    {
      heading: 'The public layer is becoming the competitive layer',
      paragraphs: [
        'India’s AI strategy is taking shape as shared infrastructure: language data, subsidised compute and public procurement that lowers the cost of building for Indian users. The important shift is from treating AI capability as a product that each company must buy to treating parts of the stack as a public layer that many companies can use.',
        'That layer will not be judged by the size of its announcements alone. It will be judged by whether a researcher outside the largest firms can find relevant data, access enough compute, understand the rules and deploy a system that works for people who speak, listen and work in more than one language.',
      ],
    },
    {
      heading: 'Language changes the infrastructure problem',
      paragraphs: [
        'A language model built around English-first assumptions can look capable in a demonstration and still fail in daily use. Indian users switch languages, mix scripts, speak over imperfect connections and use local terms that do not map neatly to a translated benchmark. Speech, transliteration and code-switching are not edge cases; they are part of the product environment.',
        'Shared language datasets can lower the cost of handling those realities, but only if their quality is visible. Builders need to know who contributed the data, which regions and dialects it represents, how consent and licensing were handled and where the gaps remain. A larger corpus is not automatically a more useful public asset.',
      ],
    },
    {
      heading: 'Compute access has to be legible',
      paragraphs: [
        'The opportunity is not merely a domestic chatbot. A common language and identity layer can let startups build products for health, agriculture and government without each team recreating the basic substrate. But access to compute determines whether the opportunity is available beyond a small group of well-connected teams.',
        'A public programme becomes useful when a builder can answer basic questions: who qualifies, how long approval takes, what kinds of workloads are supported, how usage is measured and what happens when demand is higher than capacity. Transparent allocation matters because a headline count of accelerators says little about how many teams can actually train, fine-tune or serve a model.',
      ],
    },
    {
      heading: 'Procurement turns capability into use',
      paragraphs: [
        'Public procurement is the bridge between infrastructure and outcomes. A government department can become an early customer for translation, document processing, agricultural advice or public-service search, giving local teams a real environment in which to improve. That demand can make a language dataset or a small model valuable in ways a benchmark cannot capture.',
        'Procurement can also narrow the market if requirements favour a single vendor or reward demonstrations over maintenance. The stronger approach is to specify outcomes, interoperability and auditability. Systems should be able to show where an answer came from, when a human must review it and how a service behaves when the model is uncertain or a language is underrepresented.',
      ],
    },
    {
      heading: 'Build once, adapt widely',
      paragraphs: [
        'The public stack should be understood as a set of reusable interfaces rather than a single national model. Data catalogues, evaluation suites, compute access, speech tools and deployment guidance can reinforce one another while remaining open to different commercial and research models.',
        'If that foundation works, startups can spend more effort on products and less on recreating basic AI infrastructure. The measure of success will be ordinary and demanding: more useful services in more languages, more independent teams able to test ideas, and public users who can tell when a system is reliable enough to help and when a person should take over.',
        'That outcome requires patience because infrastructure compounds slowly. The first benefit may be a lower barrier to experimentation; the larger benefit arrives when the lessons, tools and datasets from one project make the next project faster and more accountable.',
        'That compounding is the strategic case for keeping the interfaces open and the metrics public. It lets success travel beyond the first team that receives access.',
        'It also gives institutions a way to learn from one another instead of rebuilding the same foundation in isolation.',
      ],
    },
    {
      heading: 'The test is distribution',
      paragraphs: [
        'A public layer succeeds only when it reaches places that private infrastructure tends to overlook. That includes smaller cities, public universities, local-language publishers and organisations that do not have a dedicated machine-learning team. Distribution means documentation, support and predictable access as much as it means hardware.',
        'The long-term question is whether the stack creates more independent capability. If every useful application still depends on a small group of gatekeepers, the public layer has lowered a cost without changing the structure of the market. If builders can combine shared data, compute and evaluation with their own domain knowledge, the infrastructure begins to compound across sectors.',
      ],
    },
  ],
  'small-models': [
    {
      heading: 'What “Small 4” means in the model card',
      paragraphs: [
        'Mistral AI’s model card lists Small 4 as an open-weights model under Apache 2.0, with 119 billion total parameters, 6.5 billion active parameters and a 256K context window. Those are provider-published specifications. They do not, on their own, show that the model fits on a laptop or that it is faster, cheaper or more accurate than another model. [@mistral-model-card]',
        'The difference between total and active parameters matters. The active count describes a portion of the model used for a given inference path; it is not the complete stored weight set. Buyers should not use “6.5B active” as a substitute for checking the model’s full weights, runtime requirements and deployment configuration. [@mistral-model-card]',
      ],
    },
    {
      heading: 'Open weights do not prove local hardware fit',
      paragraphs: [
        '“Open weights” describes access to model weights, not the amount of memory or infrastructure needed to use them. The model card’s total-parameter figure is more relevant to storage than the active-parameter figure alone, but an exact deployment budget also depends on implementation choices that this captured card excerpt does not specify. We therefore cannot infer a minimum device, memory requirement or local cost from these three headline numbers. [@mistral-model-card]',
        'The same caution applies to privacy and latency. A team can evaluate a private or local deployment, but the model card does not provide independent measurements showing that Small 4 improves either outcome. Those are workload-level properties that should be tested in the actual serving setup, with the model, quantization, hardware and network path documented.',
      ],
    },
    {
      heading: 'A long context window is a specification, not a result',
      paragraphs: [
        'The 256K context window is a model-card specification, not proof that every application can use the full window economically or with reliable results. Long-context behavior should be checked against representative documents, retrieval accuracy, truncation behavior, latency and the cost of processing the complete input. The provider’s stated limit is a useful starting point, not a workflow evaluation. [@mistral-model-card]',
        'A comparison should keep the task and serving conditions constant. Measure whether the system finds the right passage, follows permissions, returns a usable answer and exposes uncertainty. Without those task-specific checks, a large context figure or a parameter count cannot establish product quality.',
      ],
    },
    {
      heading: 'Read the license and the product boundary separately',
      paragraphs: [
        'The card identifies the weights as Apache 2.0 and open-weight. That makes the published license an important source for use and redistribution terms, but it does not establish that a particular hosted service, derivative, data pipeline or product integration has the same terms. A buyer should review the actual license and the components included in the intended deployment. [@mistral-model-card]',
        'Likewise, the name “Small” does not answer whether this model is small for a particular team. An evaluation should list the full model artifact, required serving stack, hardware, throughput, latency, quality thresholds and operational responsibilities. Those are deployment questions; the model card’s headline specifications cannot answer them by themselves.',
      ],
    },
    {
      heading: 'The evaluation checklist is more useful than the label',
      paragraphs: [
        'Before selecting Small 4 for a workflow, teams can ask the vendor or deployment provider to identify the complete weight artifact and serving configuration, then measure memory, throughput, latency and cost on representative tasks. They should also test quality and failure behavior against a baseline that matters to users. These are recommended evaluation steps, not performance results claimed by the model card.',
        'Mistral’s card makes the model’s published size, active-parameter count, context limit and license easier to inspect. It does not support the broader claim that small models are already winning serious workflows or that this model is a local-laptop model. The honest conclusion is narrower: its specifications justify a deployment evaluation, and that evaluation must measure the full system rather than rely on its name. [@mistral-model-card]',
      ],
    },
    {
      heading: 'Write down the conditions behind a deployment claim',
      paragraphs: [
        'A useful evaluation record should name the exact model artifact, weight format, precision, runtime, hardware and serving mode. It should state the input and output lengths, batch size and expected concurrency, then report memory use, throughput, latency and cost for the same workload. This is a proposed measurement plan, not a claim that the model card provides those results.',
        'For a long-context task, teams should test both retrieval quality and operational behavior as input length grows. A 256K limit is a published maximum, not a promise that every deployment can serve that context at its chosen speed, memory budget or concurrency. Results should identify the conditions that were actually measured rather than attach a general “fits locally” label to the model.',
        'The comparison should include a smaller or hosted alternative when that is a real option for the team, but it should not mix measurements taken under different prompts, hardware or quantization. That discipline turns “small” into a question with a workload-specific answer and keeps provider specifications separate from independent deployment evidence. [@mistral-model-card]',
      ],
    },
  ],
  founders: [
    {
      heading: 'The bottleneck is the operating system',
      paragraphs: [
        'After the first million model calls, founders tend to discover that prompts are not a product strategy. A demo can hide slow queues, duplicate requests, missing permissions and the human work required to rescue a wrong answer. At scale, those details become the product that customers experience.',
        'The operating layer includes routing, retries, budgets, access control, evaluation and a record of what the system did. It determines whether a team can explain an incident, reproduce a failure and improve the next version without guessing. The model remains important, but the surrounding system decides whether capability becomes dependable.',
      ],
    },
    {
      heading: 'Reliability is a compound feature',
      paragraphs: [
        'A single correct answer is not a reliable workflow. A customer wants the system to behave acceptably across thousands of requests, including the requests that are incomplete, adversarial or simply outside the training distribution. That requires a definition of failure that is specific enough to measure: wrong retrieval, unsafe action, missing citation, bad formatting or an escalation that arrived too late.',
        'Founders who write those failure modes down early gain a better roadmap. They can decide which errors need a model change, which need a product constraint and which should be handed to a person. Without that classification, every problem looks like a prompt problem and the team spends its energy adjusting instructions that cannot solve a missing permission or a weak source.',
      ],
    },
    {
      heading: 'Queues and permissions become visible',
      paragraphs: [
        'At low volume, a queue is an implementation detail. At high volume, it becomes a promise about when work will finish. A system that accepts more requests than it can process needs backpressure, priority rules and a clear way to tell users what is happening. Otherwise a product can appear intelligent while quietly building a backlog that destroys trust.',
        'Permissions create a similar boundary. An agent that can read, write and send is not just a model with tools; it is an actor inside an organisation. Founders have to decide which actions need confirmation, which records are visible to which roles and how an audit trail will distinguish a human decision from an automated one. These choices are difficult to bolt on after adoption.',
      ],
    },
    {
      heading: 'Feedback is an operating asset',
      paragraphs: [
        'The best teams build feedback into every interaction, turning exceptions into training data and making the system more dependable without pretending that uncertainty has disappeared. A correction should be captured with enough context to explain why the original result failed, not merely stored as a thumbs-down that no one can interpret later.',
        'That feedback loop should include successful work too. If a person edits a draft, approves a recommendation or overrides a route, the product can learn what “good enough” looks like in the real workflow. The goal is not to automate every judgement. It is to make repeated judgement cheaper and to make the important exceptions easier to see.',
      ],
    },
    {
      heading: 'A quieter kind of scale',
      paragraphs: [
        'The first million calls can make a company look like it has solved demand. The next million reveal whether it has solved operations. Costs move with retries and context length, support moves with wrong answers, and the most valuable customers ask for controls rather than another impressive demo.',
        'The next generation of AI companies will be built around operational discipline. They will know which work should remain automated, where a human must enter the loop and how to prove that a system improved. That is a quieter kind of scale, but it is the kind that survives contact with a budget, a compliance review and a real customer.',
      ],
    },
    {
      heading: 'The customer feels the handoffs',
      paragraphs: [
        'Customers rarely see the model name, but they feel every handoff around it. They notice when a request disappears into a queue, when an answer cites the wrong document, when a reviewer asks for information the product already collected or when a correction does not change the next result. These moments are where an AI company earns or loses trust.',
        'That makes operational detail a user experience problem. A clear status, a useful explanation and a fast route to a person can turn an uncertain answer into a manageable interaction. A silent retry or an unexplained refusal does the opposite. Founders who treat these moments as part of the product build a system customers can work with, not just a model they can try.',
        'The strongest operating systems make the path visible without burdening the user with implementation detail. People do not need to see every log line; they do need to know what happened, what will happen next and how to correct the record.',
        'That is how an AI feature becomes an operating relationship rather than a novelty: the user can predict its behaviour, recover from its limits and see that feedback changes the system.',
      ],
    },
  ],
  infrastructure: [
    {
      heading: 'Power is now a product constraint',
      paragraphs: [
        'Compute is moving toward places with reliable power, fibre and permits. The geography of intelligence is being redrawn by the physical conditions that software used to ignore. A model can be copied instantly, but the electricity, cooling, land and transmission capacity required to serve it cannot.',
        'That difference is changing infrastructure decisions. Operators have to balance access to customers against access to power, and a new facility can be delayed by a grid connection long after the software plan is complete. For AI products, the physical map is no longer background context. It sets the limits of response time, capacity and cost.',
      ],
    },
    {
      heading: 'The grid joins the stack',
      paragraphs: [
        'A data centre’s usefulness depends on more than the number of accelerators installed inside it. It needs a stable supply, a cooling design that works in local conditions, network paths that can move data and a permitting process that communities and regulators will accept. Each layer creates a different kind of bottleneck.',
        'The result is a wider definition of infrastructure strategy. Companies are negotiating for power, building redundancy across regions and looking for workloads that can shift in time or location. Those choices affect which model services can promise low latency and which jobs must wait for a more constrained supply of capacity.',
      ],
    },
    {
      heading: 'Regional does not mean isolated',
      paragraphs: [
        'Inference closer to customers can improve latency and resilience, while training remains concentrated. The resulting map is a network of specialised corridors rather than one universal cloud. A region may host inference because it has customers and fibre, while another hosts training because it has the power and cooling to support long runs.',
        'That division can make systems more resilient if the handoffs are designed well. A product can keep routine work near a user, send a larger job to a specialised facility and fail over to a smaller model when capacity is constrained. It can also create new dependencies if a supposedly distributed system still relies on one vendor, one interconnect or one permission to expand.',
      ],
    },
    {
      heading: 'The economics follow the physical map',
      paragraphs: [
        'Power availability is now a strategic differentiator because it shapes both operating cost and speed to market. A cheap site without a grid connection may be less useful than a more expensive site that can expand predictably. Customers will feel those differences through pricing, quotas, latency and the number of regions a provider can support.',
        'The same pressure reaches product teams. A feature that calls a large model for every small task carries an infrastructure cost even when the user sees only a button. Routing, caching and smaller local models are not merely software optimisations; they are ways to fit useful intelligence into the capacity the physical network can actually provide.',
      ],
    },
    {
      heading: 'Planning starts to look like telecom',
      paragraphs: [
        'AI infrastructure planning will look increasingly like energy and telecom planning. It will involve long lead times, shared assets, regional policy and a negotiation between public benefit and private demand. The companies that understand this early can make more credible commitments because they know which part of the promise depends on a permit or a transformer.',
        'The winning map will not be the one with the largest single cluster. It will be the one that connects power, fibre, compute and customers with enough redundancy to keep a service useful. Regional capacity is not a retreat from a global cloud; it is the foundation that makes a global service dependable.',
      ],
    },
    {
      heading: 'Infrastructure is also policy',
      paragraphs: [
        'Where compute is built affects more than latency and price. It affects which communities carry the burden of new energy demand, which regions attract technical jobs and which governments can influence the rules around data and access. Infrastructure choices therefore become policy choices even when they are presented as private procurement.',
        'A credible expansion plan should make those tradeoffs visible. Operators need to explain expected power use, cooling requirements, network resilience and the conditions under which capacity will grow. Customers and regulators will increasingly ask not only whether a system is fast, but whether the physical and institutional path behind it is durable enough to support the promise.',
        'The companies that answer those questions early will be easier to trust because their growth assumptions can be examined. In an infrastructure market, credibility is part of capacity: it determines who can secure partners, permits and long-term demand.',
        'The map of intelligence is therefore also a map of commitments. Each new corridor should be judged by the service it enables and the resilience it adds, not only by the size of the facility.',
        'That standard keeps expansion connected to the users and communities the infrastructure is meant to serve.',
      ],
    },
  ],
};

const maintainedStudyStory: Story = {
  slug: 'study-finds-word-cues-can-override-game-theory-choices-in-llms',
  category: 'The Edge',
  title: 'Preprint links cooperative game choices to familiar action labels',
  dek: 'A revised arXiv preprint reports a label-sensitive circuit in tested models; its findings remain limited to specific prompts and game protocols.',
  body: [
    {
      heading: 'A late intervention in the network',
      paragraphs: [
        'Version 3 of an arXiv preprint examines instruction-tuned language models on a directly prompted Prisoner’s Dilemma. The authors report that Llama-3-70B, Qwen2.5-32B and Qwen2.5-72B selected full cooperation under the named prompt, while Llama-3-8B played near the Nash action. These findings describe the tested models and prompt, not a general cooperative preference in language models. [@open-a7f1c833c9a1e5c0]',
        'The authors use logit-lens analysis to report that intermediate readouts lean toward the Nash action through much of the network, followed by a late shift toward cooperation. They call this pattern a distributed cooperative override. That is their interpretation of internal measurements from this experiment; it should not be treated as a universal explanation of model decisions. [@open-a7f1c833c9a1e5c0]',
      ],
    },
    {
      heading: 'A controllable but narrow signal',
      paragraphs: [
        'For Llama-3-8B, the authors report identifying a residual-stream direction associated with the override. Steering it changed the decision, and clamping its component at one layer and position moved the choice monotonically in their tests while generation remained fluent. The intervention makes the proposed mechanism probeable, but it concerns one model and a defined experimental setup. [@open-a7f1c833c9a1e5c0]',
        'The preprint also reports that the effect disengaged when “Cooperate” and “Defect” were replaced with neutral labels. That result narrows the interpretation: wording appears to matter in the tested games. It does not establish how a model would act in a richer strategic environment or in a deployed workflow. [@open-a7f1c833c9a1e5c0]',
      ],
    },
    {
      heading: 'Neutral labels changed the result',
      paragraphs: [
        'The authors report that the effect survived removing player names and rescaling payoffs, but weakened when the action labels became neutral. They interpret that as evidence of a lexical trigger rather than a stable response to the payoff structure. The practical caution is that a benchmark can test familiar wording as well as strategic reasoning. [@open-a7f1c833c9a1e5c0]',
        'In 48 payoff-random games with neutral surfaces, the preprint reports that no tested model consistently chose cooperation on every dilemma or demonstrated general equilibrium competence. This is evidence about those protocols, not a broad score for every kind of strategic reasoning. Evaluation designers can use the finding as a reason to vary labels and presentation before assigning meaning to a repeated output. [@open-a7f1c833c9a1e5c0]',
      ],
    },
    {
      heading: 'What the mechanism does not prove',
      paragraphs: [
        'The study does not show that language models understand cooperation in the human sense, or that they are unable to identify a Nash action. It reports behavior in a defined set of prompted games and interventions. A controllable internal direction is useful evidence about those tests, but it is not a single universal cause of behavior. [@open-a7f1c833c9a1e5c0]',
        'The preprint leaves questions about other model families, training mixtures and strategic tasks. Its results do not establish whether the same effect would persist in repeated interactions or changing payoff structures. Those are open research questions, not conclusions that can be filled in from the current experiment. [@open-a7f1c833c9a1e5c0]',
      ],
    },
    {
      heading: 'A better test for strategic behaviour',
      paragraphs: [
        'A useful evaluation should vary task wording, include neutral labels and separate a model’s explanation from its action. Researchers should report not only where an effect appears but also the conditions where it disappears. Those are methodological recommendations drawn from the preprint’s label-sensitive result, not a claim that one test settles strategic competence. [@open-a7f1c833c9a1e5c0]',
        'Version 3 is a major revision of the earlier preprint and adds a randomized-payoff experiment. It remains a single arXiv paper with no independent confirmation in this source set. The most defensible reading is therefore narrow: familiar action words changed choices in the reported tests, and label-robust evaluation is needed before broader claims are made. [@open-a7f1c833c9a1e5c0]',
      ],
    },
    {
      heading: 'Separate the observed choice from its explanation',
      paragraphs: [
        'The behavioral result and the proposed internal mechanism are different claims. The paper reports choices in prompted games, then uses intermediate readouts and interventions to examine a possible explanation in Llama-3-8B. A steering effect is evidence about that model and setup; it does not show that the same circuit explains choices in every tested family or that one measured direction is the sole cause. [@open-a7f1c833c9a1e5c0]',
        'Replication could hold the payoff structure constant while changing action labels, prompt wording and model checkpoints, then report variation across runs. The 48 payoff-random games broaden the paper’s own test, but they do not independently confirm the findings or cover every strategic task. These are next-step evaluation questions, not additional results attributed to version 3. [@open-a7f1c833c9a1e5c0]',
      ],
    },
  ],
  date: '2026-09-21',
  dateModified: '2026-10-06',
  readTime: '4 min read',
  author: 'ishaan-mehta',
  evidence: 'Developing evidence · 1 preprint · 0 independent confirmations',
  evidenceSummary: {
    primarySources: 1,
    independentConfirmations: 0,
    confidence: 'DEVELOPING',
    note: 'A single, substantially revised arXiv preprint supports the account; no independent replication is included in this source set.',
  },
  classification: 'synthesis',
  contentType: 'Brief',
  entities: [],
  timeline: [],
  relatedStories: [],
  imageTreatment: {
    type: 'editorial-abstract',
    alt: 'Abstract editorial visual for the edge reporting',
    palette: 'warm ivory, cobalt, graphite',
    caption: 'The signal is becoming visible in the systems around the model.',
  },
  topic: 'LLM interpretability and decision-making',
  sources: ['open-a7f1c833c9a1e5c0'],
  bottomLine: 'One preprint reports that familiar game-action labels changed choices in its tested models; the result is not evidence of a general cooperative preference.',
  whyItMatters: 'The study is a reason to vary task wording before interpreting a prompted choice as evidence of broad strategic competence.',
  keyTakeaways: [
    'The preprint reports full cooperation under a named Prisoner’s Dilemma prompt for three larger tested models.',
    'The authors report a late-layer shift and a steerable residual-stream direction in Llama-3-8B.',
    'Neutral labels changed the result; the paper does not establish a general model trait.',
  ],
  whatChanges: 'Treat the result as a prompt- and protocol-specific preprint finding, and test strategic behavior under neutral labels before making broader claims.',
};

export let stories: Story[] = [
  maintainedStudyStory,
  {
    slug: 'ai-models-antibiotic-discovery',
    category: 'Breakthroughs',
    title: 'ProteoGPT study reports peptide candidates for resistant bacteria',
    dek: 'One protein-language-model pipeline reports in-vitro and mouse-model results; the findings remain preclinical.',
    body: storyBodies.antibiotic,
    date: '2026-09-11',
    dateModified: '2026-10-06',
    readTime: '4 min read',
    author: 'mira-patel',
    evidence: 'Developing evidence · 1 peer-reviewed primary study · 0 independent confirmations',
    evidenceSummary: evidenceSummaries.antibiotic,
    classification: 'synthesis',
    contentType: 'Brief',
    entities: [],
    timeline: [],
    relatedStories: [],
    imageTreatment: {
      type: 'editorial-abstract',
      alt: 'Abstract map of peptide sequences and a laboratory assay',
      palette: 'deep teal, chalk white, antibiotic amber',
      caption: 'A model-assisted search still depends on experiments.',
    },
    topic: 'AI in science',
    sources: ['nature-antibiotic-study'],
    bottomLine: 'A 2025 Nature Microbiology paper reports AMP activity in laboratory and mouse models; it does not establish a human treatment.',
    whyItMatters: 'The case shows why model-assisted drug discovery should be described through its experiments and evidence boundary, not the novelty of a prediction alone.',
    keyTakeaways: [
      'ProteoGPT is a specialized protein-language-model pipeline.',
      'The reported evidence covers in-vitro assays and mouse infection models.',
      'No human treatment result is reported in this study.',
    ],
    whatChanges: 'Track which candidates reproduce in further preclinical work before making claims about clinical benefit.',
  },
  { slug: 'quiet-race-watermark-everything-ai-makes', category: 'Policy', title: 'C2PA provenance records do not prove content is true', dek: 'EU disclosure obligations, a voluntary code and a contested provenance standard do different jobs.', body: storyBodies.watermarking, date: '2026-09-10', dateModified: '2026-10-05', readTime: '5 min read', author: 'jonas-rhee', evidence: 'Medium confidence · 3 official records · 1 attributed security preprint', evidenceSummary: evidenceSummaries.watermarking, classification: 'analysis', contentType: 'Analysis', entities: ['content-credentials'], timeline: ['watermarking-code'], relatedStories: [], imageTreatment: { type: 'data-graphic', alt: 'A signed provenance record shown beside an image, with its limits made explicit', palette: 'warm white, cobalt, graphite', caption: 'Provenance describes a file history, not whether the content is true.' }, topic: 'Policy', sources: ['eu-ai-act-content-transparency', 'c2pa-specification-v2-4', 'c2pa-deployment-guidance-2026', 'c2pa-independent-security-preprint'], bottomLine: 'C2PA can record signed provenance, but it cannot establish that an image is true; one unreviewed preprint reports security limitations that should be investigated.', whyItMatters: 'A reader or buyer needs to distinguish legal disclosure, file provenance and verification of the underlying claim.', keyTakeaways: ['The EU Code of Practice is voluntary; applicable Article 50 obligations are legal requirements.', 'A valid provenance record is not proof of authenticity.', 'A single arXiv security study reports validator and specification weaknesses that remain to be independently tested.'], whatChanges: 'Procurement and newsroom workflows should test how credentials are attached, preserved, validated and explained when absent.' },
  { slug: 'indias-public-ai-stack', category: 'India Watch', title: 'India’s public AI stack is being built in the open', dek: 'From language data to compute, a sovereign layer is becoming visible.', body: storyBodies['india-stack'], date: '2026-09-09', readTime: '6 min read', author: 'ananya-rao', evidence: 'High confidence · 4 primary sources · 3 independent confirmations', evidenceSummary: evidenceSummaries['india-stack'], classification: 'reported', entities: ['indiaai-mission', 'sarvam-ai'], timeline: ['indiaai-compute-tender', 'sarvam-public-model'], relatedStories: ['small-models', 'infrastructure'], imageTreatment: { type: 'field-photograph', alt: 'Bengaluru technology district at dusk', palette: 'saffron, indigo, concrete grey', caption: 'India is treating shared infrastructure as a competitive advantage.' }, topic: 'India', sources: ['indiaai-mission', 'stanford-ai-index-2026'], bottomLine: 'India is building a shared layer for language, compute and public-interest deployment.', whyItMatters: 'A public substrate could lower the cost of building products for hundreds of millions of users.', keyTakeaways: ['Compute access is moving beyond the largest companies.', 'Indic-language data is a strategic asset.', 'Procurement will determine whether infrastructure becomes useful.'], whatChanges: 'Startups can spend more effort on products and less on recreating basic AI infrastructure.' },
  {
    slug: 'small-models-serious-workflows',
    category: 'The Edge',
    title: 'Mistral Small 4’s active parameter count is not its full footprint',
    dek: 'Mistral lists 119 billion total parameters and 6.5 billion active parameters; its model card does not establish hardware fit or runtime performance.',
    body: storyBodies['small-models'],
    date: '2026-09-08',
    dateModified: '2026-10-06',
    readTime: '4 min read',
    author: 'ishaan-mehta',
    evidence: 'Developing evidence · 1 provider-authored model card · no independent deployment tests',
    evidenceSummary: evidenceSummaries['small-models'],
    classification: 'analysis',
    contentType: 'Analysis',
    entities: [],
    timeline: [],
    relatedStories: [],
    imageTreatment: {
      type: 'editorial-abstract',
      alt: 'Model specifications displayed beside a system deployment checklist',
      palette: 'slate, electric blue, paper white',
      caption: 'A model label is not a deployment measurement.',
    },
    topic: 'Models',
    sources: ['mistral-model-card'],
    bottomLine: 'Mistral’s model card lists 119B total and 6.5B active parameters; active count alone does not establish storage, hardware fit or performance.',
    whyItMatters: 'Teams need the full model artifact and a workload test before treating a parameter label as a deployment claim.',
    keyTakeaways: [
      'The model card states 119B total parameters and 6.5B active parameters.',
      'The 256K context window and Apache 2.0 label are provider specifications.',
      'The source set has no independent hardware, latency or quality measurements.',
    ],
    whatChanges: 'Evaluate the full serving configuration on representative tasks rather than infer deployment properties from the model name.',
  },
  { slug: 'founders-first-million-model-calls', category: 'Field Notes', title: 'What founders notice after their first million model calls', dek: 'The bottleneck is rarely the model. It is the operating system around it.', body: storyBodies.founders, date: '2026-09-07', readTime: '8 min read', author: 'lena-hoff', evidence: 'Medium confidence · 2 primary sources · 6 independent confirmations', evidenceSummary: evidenceSummaries.founders, classification: 'analysis', entities: ['openai', 'anthropic'], timeline: ['openai-agent-platform'], relatedStories: ['small-models', 'infrastructure'], imageTreatment: { type: 'portrait', alt: 'Founder reviewing an AI operations dashboard in a quiet office', palette: 'ink, copper, soft green', caption: 'Scale exposes the system around the model.' }, topic: 'Founders', sources: ['stanford-ai-index-2026'], bottomLine: 'At scale, reliability, permissions and feedback loops matter more than clever prompts.', whyItMatters: 'The next generation of AI companies will be built around operational discipline.', keyTakeaways: ['Exceptions are product feedback.', 'Human escalation is a feature, not a failure.', 'Unit economics include monitoring and wrong answers.'], whatChanges: 'Founders will treat evaluation and governance as core product infrastructure.' },
  { slug: 'new-geography-of-compute', category: 'Infrastructure', title: 'The new geography of compute is surprisingly regional', dek: 'Power, permits and proximity are redrawing the map of intelligence.', body: storyBodies.infrastructure, date: '2026-09-06', readTime: '9 min read', author: 'david-okafor', evidence: 'High confidence · 4 primary sources · 5 independent confirmations', evidenceSummary: evidenceSummaries.infrastructure, classification: 'analysis', entities: ['microsoft'], timeline: ['azure-inference-expansion'], relatedStories: ['indias-public-ai-stack', 'small-models'], imageTreatment: { type: 'data-graphic', alt: 'Map showing regional compute corridors and energy connections', palette: 'night blue, grid green, signal orange', caption: 'The infrastructure map follows power, fibre and permission.' }, topic: 'Technology', sources: ['iea-data-centres', 'stanford-ai-index-2026'], bottomLine: 'The AI cloud is becoming a network of regional corridors shaped by physical constraints.', whyItMatters: 'Energy and permitting will influence who can offer fast, affordable intelligence.', keyTakeaways: ['Inference is moving closer to users.', 'Training remains more concentrated than deployment.', 'Power availability is now a strategic differentiator.'], whatChanges: 'AI infrastructure planning will look increasingly like energy and telecom planning.' },
  indiaAiComputeReport,
];

export const scheduledStories: ScheduledStory[] = [
  {
    slug: 'reliability-is-the-new-ai-moat',
    category: 'Field Notes',
    title: 'AI agents improved on OSWorld; reliability remains the test',
    dek: 'Stanford’s 2026 AI Index puts computer-task performance at 66.3%—a sharp gain, but still below its reported human baseline.',
    date: '2026-09-21',
    dateModified: '2026-10-05',
    publishAt: '2026-09-21T07:30:00Z',
    cadence: 'daily',
    readTime: '5 min read',
    author: 'lena-hoff',
    evidence: 'Medium confidence · 1 independent research source · benchmark scope disclosed',
    evidenceSummary: { primarySources: 0, independentConfirmations: 1, confidence: 'MEDIUM', note: 'Stanford’s OSWorld score and human baseline support a benchmark-specific conclusion, not a production reliability estimate.' },
    classification: 'analysis',
    contentType: 'Analysis',
    entities: [],
    timeline: [],
    relatedStories: ['small-models-serious-workflows'],
    imageTreatment: { type: 'editorial-abstract', alt: 'An abstract computer-task benchmark score beside its human comparison', palette: 'cobalt, graphite, warm paper', caption: 'Benchmark progress is evidence of capability, not a guarantee of workplace reliability.' },
    topic: 'AI',
    sources: ['stanford-ai-index-2026'],
    body: [
      {
        heading: 'A benchmark moved, but the comparison has a scope',
        paragraphs: [
          'Stanford HAI’s 2026 AI Index reports OSWorld task accuracy rising from about 12% to 66.3% across the evaluation period. OSWorld tests agents on computer tasks in operating-system environments, so the result captures a specific kind of tool-using capability rather than general knowledge or conversational fluency. The climb is important evidence of progress on this benchmark, but it is not a measure of end-to-end customer work. [@stanford-ai-index-2026]',
          'The same report gives a 72.35% human baseline. That leaves a 6.05 percentage-point gap between the reported agent result and the benchmark’s human comparison. The figures should stay attached to OSWorld’s task set, scoring rule and observation period: they do not show that a production agent succeeds on 66.3% of every task a business might assign. [@stanford-ai-index-2026]',
        ],
      },
      {
        heading: 'The remaining gap is operational',
        paragraphs: [
          'At 66.3%, roughly one in three measured attempts still did not meet the benchmark’s success criterion. That is a plain-language restatement of the score, not a separate failure-rate study. The distinction matters: a remaining miss can be costly even while aggregate performance improves, especially when an error affects a customer, employee or public service. [@stanford-ai-index-2026]',
          'An aggregate percentage also hides the task mix. A benchmark can combine operations with different difficulty, prerequisites and costs of error. Buyers therefore need task definitions and results, not only a headline score. The published percentage indicates progress under the test protocol; it cannot establish whether one particular organisation should delegate work without review. That judgement requires a local evaluation on representative tasks.',
        ],
      },
      {
        heading: 'Computer use is not a workplace guarantee',
        paragraphs: [
          'OSWorld is useful because an agent must interact with software rather than merely predict the next word. That makes it a more demanding proxy for action than a text-only question-and-answer test. Still, a benchmark environment cannot reproduce every company interface, identity system, policy restriction, shifting record format, outage, private-data boundary or exception path. Those differences can change both the chance of success and the impact of a mistake. [@stanford-ai-index-2026]',
          'The result is best read as a capability indicator: agents can complete more of the tested computer tasks than earlier versions. It does not certify safe autonomy, reliable record changes or the ability to work in an untested application. A team that treats it as a production probability is changing the question from “How did the system score here?” to “Will it work for us?” The benchmark does not answer the second question.',
        ],
      },
      {
        heading: 'Reliability includes recovery',
        paragraphs: [
          'Reliability in a deployed workflow includes more than finishing the first attempt. A system must recognize missing context, show when a tool call failed, avoid acting beyond the user’s permission and recover without duplicating a change. These are operational requirements inferred from deployment design, not outcomes measured by the OSWorld score. Keeping that boundary clear prevents a benchmark gain from standing in for an unreported service record.',
          'A local test should follow a task from request to confirmed outcome. Record completion, correctness, elapsed time, human intervention, retries, tool errors, reversals and the severity of a wrong action. Each denominator matters: completion without error cost can reward unsafe behavior, while intervention without quality can penalise a system that correctly asks for help. [@stanford-ai-index-2026]',
        ],
      },
      {
        heading: 'Human comparisons need context',
        paragraphs: [
          'The human baseline provides useful context, but it is not a universal limit or proof that people and agents faced identical working conditions. The AI Index reports a benchmark comparison, not a controlled audit of staff productivity in a workplace. A careful reading keeps the score, benchmark and date together, then asks whether a local team can reproduce representative tasks using the same success criteria. [@stanford-ai-index-2026]',
          'Prompts, models, browser state, authentication and network conditions can affect a result. A buyer should record the agent version, tool configuration, permitted actions and evaluation date, then rerun the same tasks after updates. This turns a public benchmark into a reference point rather than a substitute for monitoring. It also makes declines visible before a tool is trusted with a higher-consequence action.',
        ],
      },
      {
        heading: 'Make the score useful to buyers',
        paragraphs: [
          'Benchmark announcements become more useful when publishers disclose per-task performance, run counts, uncertainty and how often a person had to recover a task. They should separate “task completed” from “task completed correctly,” and explain whether retries count as successes. These are measurement recommendations; the AI Index headline figure does not provide all of those workflow-level details. [@stanford-ai-index-2026]',
          'Teams should also set different thresholds for reversible and consequential actions. A draft that needs editing, a file moved to the wrong folder and an unauthorised customer-record change are not equivalent failures. Risk-based review makes the score operational: it clarifies which tasks can be delegated, which need confirmation and which should remain outside the agent’s authority.',
          'The public number cannot choose those thresholds for a buyer. It can help teams decide what to test first, and it can provide a consistent reference when new systems are evaluated. The next evidence should come from task-level results in the environment where people will actually use the agent, with failure categories that distinguish model errors from tools, permissions and missing context.',
          'The defensible conclusion is narrow but meaningful: OSWorld agent accuracy reached 66.3%, up from about 12%, and remained below the reported 72.35% human baseline. The trend shows rapid improvement on structured computer tasks; roughly one in three attempts still missed the benchmark target. Test agents in the actual workflow rather than treating the benchmark as proof that general workplace reliability has arrived. [@stanford-ai-index-2026]',
        ],
      },
    ],
    bottomLine: 'OSWorld agent accuracy reached 66.3%, but remained below the reported 72.35% human baseline; the score is not a production reliability estimate. [@stanford-ai-index-2026]',
    whyItMatters: 'A large benchmark gain can coexist with frequent misses, so buyers still need task-level evaluation and safe recovery paths.',
    keyTakeaways: ['OSWorld accuracy rose from about 12% to 66.3%. [@stanford-ai-index-2026]', 'The report’s human baseline is 72.35%. [@stanford-ai-index-2026]', 'Benchmark results do not establish success rates for a specific workplace workflow.'],
    whatChanges: 'Teams should test representative tasks locally and report completion, correctness, intervention and recovery separately.',
  },
  {
    slug: 'public-compute-needs-public-metrics',
    category: 'India Watch',
    title: 'IndiaAI’s GPU claims need a public status crosswalk',
    dek: 'Official figures describe 34,333 GPUs in common capacity, 38,231 onboarded and 45,000-plus shared. The records do not reconcile those stages into live, schedulable supply.',
    date: '2026-09-23',
    dateModified: '2026-10-05',
    publishAt: '2026-09-23T07:30:00Z',
    cadence: 'daily',
    readTime: '5 min read',
    author: 'ananya-rao',
    evidence: 'Medium confidence · 9 primary records · no published status crosswalk',
    evidenceSummary: { primarySources: 9, independentConfirmations: 0, confidence: 'MEDIUM', note: 'Official records provide dated counts and project allocations but do not reconcile status labels, installed hardware, current schedulability or GPU-hour metering.' },
    classification: 'analysis',
    contentType: 'Analysis',
    entities: ['indiaai-mission'],
    timeline: ['indiaai-compute-shared-capacity-2026'],
    relatedStories: ['indias-public-ai-stack', 'new-geography-of-compute'],
    imageTreatment: { type: 'editorial-abstract', alt: 'An abstract ledger separating announced, onboarded, shared, allocated and measured-use claims', palette: 'indigo, saffron, paper white', caption: 'Different status labels cannot be combined without a published crosswalk.' },
    topic: 'India',
    sources: ['indiaai-cabinet-approval-2024', 'pib-initial-compute-2025', 'pib-common-compute-34000-2025', 'pib-compute-onboarded-2026', 'pib-onboarded-nearly-38000-2026', 'pib-capacity-and-use-factsheet-2026', 'indiaai-compute-allocation-register-2026', 'indiaai-compute-portal', 'indiaai-portal-eligibility'],
    body: [
      {
        heading: 'Three counts, three labels',
        paragraphs: [
          'Government statements provide several dated numbers for India’s common-compute programme, but each uses its own wording. In May 2025, PIB reported 34,333 GPUs—18,417 empanelled and 15,916 additional. In March 2026, a separate release said 38,231 GPUs were onboarded from 14 providers. The August 2026 factsheet reported 45,000-plus “shared” GPUs. These are not interchangeable labels or one reconciled inventory. [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-capacity-and-use-factsheet-2026]',
          'The distinctions begin with the programme target. The 2024 Cabinet approval set a goal of more than 10,000 GPUs; the January 2025 release described an initial facility and further GPUs to be added. A target and a planned addition explain policy intent, not delivery, installation or present availability. The source wording should remain attached to each figure rather than being simplified into “GPUs online.” [@indiaai-cabinet-approval-2024] [@pib-initial-compute-2025]',
        ],
      },
      {
        heading: 'The dates do not make a comparable series',
        paragraphs: [
          'PIB’s May 2025 total combines two named components: 18,417 empanelled GPUs and 15,916 additional GPUs. The release does not define the full 34,333 as installed devices or as capacity that was simultaneously free to schedule. Preserving the components matters because empanelment, addition, installation and availability answer different operational questions. [@pib-common-compute-34000-2025] [@pib-initial-compute-2025]',
          'A later date does not automatically make a figure the next point in a growth series. The March 2026 release reports 38,231 onboarded GPUs from 14 providers; a July release repeats a rounded “nearly 38,000” onboarded figure without an exact count or provider breakdown. The reviewed releases do not supply a definition that maps “onboarded” to “shared.” [@pib-compute-onboarded-2026] [@pib-onboarded-nearly-38000-2026]',
        ],
      },
      {
        heading: 'The shared-capacity claim has its own boundary',
        paragraphs: [
          'The August 2026 factsheet reports more than 45,000 shared GPUs and 93.18 lakh GPU-hours. It does not provide a crosswalk connecting “shared” with the earlier “onboarded” count, and the reported hours are not defined as metered runtime or completed work. These are useful programme disclosures, but neither number establishes current free capacity. [@pib-capacity-and-use-factsheet-2026] [@pib-compute-onboarded-2026]',
          'The records reviewed here therefore establish dated government claims, not a reconciled count of hardware users can book now. No arithmetic should combine the target, empanelled/additional pool, onboarded total and shared-capacity claim as though they describe the same state. A public status table with definitions and dates would make the relationship testable. [@indiaai-cabinet-approval-2024] [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-capacity-and-use-factsheet-2026]',
        ],
      },
      {
        heading: 'Project allocations are not a hardware inventory',
        paragraphs: [
          'The IndiaAI portal describes an application, review and provider-allocation path, while a separate hub page lists dated project-level allocations with GPU count and type, provider and project dates. Those rows are useful evidence of named assignments. They do not say whether hardware was installed, a project started a job, an allocation remains active or a device is available to a new applicant. [@indiaai-compute-portal] [@indiaai-portal-eligibility] [@indiaai-compute-allocation-register-2026]',
          'A project count cannot be turned into an active-user count without lifecycle definitions. A project may be selected but not started, may use several accelerators, or may finish before its stated end date. The allocation register does not provide a current provider-level hardware total, active-reservation count or number of devices free to schedule. Those limits should appear beside the rows, not be inferred away. [@indiaai-compute-allocation-register-2026]',
        ],
      },
      {
        heading: 'GPU-hours need a data dictionary',
        paragraphs: [
          'The same factsheet says projects accessed subsidised AI computing across 93.18 lakh GPU-hours. It does not define whether the count means approved hours, reserved time, provisioned capacity, metered runtime or completed jobs. Each definition answers a different question, and the total cannot be called “consumed” energy or compute unless the source establishes that boundary. [@pib-capacity-and-use-factsheet-2026]',
          'A public data dictionary should state the period, accelerator unit, treatment of failed or cancelled jobs, and whether hours are allocated, provisioned or metered. Without those fields, analysts cannot calculate utilisation or compare access across providers. The portal’s project rows do not supply the missing aggregate event data, so a precise usage rate would be unsupported. [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-allocation-register-2026] [@indiaai-compute-portal]',
        ],
      },
      {
        heading: 'Publish measures that follow the applicant',
        paragraphs: [
          'A useful public dashboard would connect capacity stages to applicant experience without exposing sensitive project details. It could report requests, approvals, rejections and reasons; median and 90th-percentile time to first allocation; queue length; active reservations; and available hours by accelerator family. The portal already documents how applications reach providers, but the reviewed pages do not publish that complete operating picture. [@indiaai-compute-portal] [@indiaai-portal-eligibility]',
          'Outcome measures should be reported separately from supply. A count of projects, completed jobs or reproducible outputs would help explain what allocated resources enabled, while language, sector and organisation-size breakdowns could show who benefited. These are recommendations for future reporting, not claims that the current programme publishes those measurements.',
          'The careful conclusion is that IndiaAI has published several significant capacity and activity claims, including 34,333 GPUs in a 2025 common-compute release, 38,231 onboarded in a 2026 release, and 45,000-plus shared in a later factsheet. The reviewed sources do not reconcile those labels or establish a current count of installed, schedulable GPUs. [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-capacity-and-use-factsheet-2026]',
          'For applicants, that distinction is practical: a programme-wide headline cannot tell a team which accelerator it can request, when a slot may open or whether the reported hour metric reflects completed work. Publishing status definitions, dates and access measures together would let researchers, startups and policymakers evaluate the programme without treating unlike claims as one inventory.',
          'Public compute becomes easier to assess when supply, allocation, active use and outcomes are reported as separate stages. Each number should retain its source wording and denominator, with a visible note when the next operational state has not been established.',
          'The point is not to discount a capacity announcement. It is to make the announcement useful by showing what it measures and what an applicant can reasonably infer from it.',
        ],
      },
    ],
    bottomLine: 'PIB reports 34,333 GPUs in common capacity, 38,231 onboarded and 45,000-plus shared in separate releases; the records do not reconcile these into live supply. [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-capacity-and-use-factsheet-2026]',
    whyItMatters: 'Applicants need to know what they can request now, not only how many GPUs a programme has announced under different labels.',
    keyTakeaways: ['Targets, empanelled capacity, onboarding and shared-capacity claims are distinct stages. [@indiaai-cabinet-approval-2024] [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-capacity-and-use-factsheet-2026]', 'Dated project allocations do not establish current schedulability. [@indiaai-compute-allocation-register-2026]', 'The reported GPU-hours are not defined as metered consumption. [@pib-capacity-and-use-factsheet-2026]'],
    whatChanges: 'A public status crosswalk and access dashboard could make capacity stages, applicant waits, active reservations and metered use distinguishable.',
  },
  {
    slug: 'weekly-deep-dive-cost-of-intelligence',
    category: 'Infrastructure',
    title: 'AI’s electricity demand is becoming a product-design constraint',
    dek: 'The IEA projects data-centre electricity use to rise from 415 TWh in 2024 to about 945 TWh by 2030. Those system-wide figures do not measure energy per AI request.',
    date: '2026-09-28',
    dateModified: '2026-10-05',
    publishAt: '2026-09-28T07:30:00Z',
    cadence: 'weekly',
    readTime: '5 min read',
    author: 'david-okafor',
    evidence: 'Medium confidence · 1 primary research source · 1 independent research source',
    evidenceSummary: { primarySources: 1, independentConfirmations: 1, confidence: 'MEDIUM', note: 'The IEA’s global data-centre forecast and Stanford’s analysis of competition on cost and reliability support a system-level design argument, not per-request energy estimates.' },
    classification: 'analysis',
    contentType: 'Analysis',
    entities: [],
    timeline: [],
    relatedStories: ['new-geography-of-compute', 'small-models-serious-workflows'],
    imageTreatment: { type: 'editorial-abstract', alt: 'An abstract balance between data-centre demand and product constraints', palette: 'night blue, signal green, copper', caption: 'A global electricity forecast sets context; product-level energy still needs direct measurement.' },
    topic: 'Technology',
    sources: ['iea-energy-ai-executive-summary', 'stanford-ai-index-2026'],
    body: [
      {
        heading: 'A material signal, with a clear boundary',
        paragraphs: [
          'The International Energy Agency’s Energy and AI report says data centres used 415 TWh of electricity in 2024, around 1.5% of global electricity use, and projects roughly 945 TWh by 2030. It identifies AI as the leading driver of growth alongside other digital services. These are global data-centre figures, not an AI-only inventory or a measurement of one model call. [@iea-energy-ai-executive-summary]',
          'The forecast matters because electricity, cooling and grid access place physical limits around digital services. But it cannot be divided into a product’s requests to produce an energy-per-query estimate: the source does not supply that denominator. Keep the projection, its horizon and its system boundary together when using it to explain the design challenge. [@iea-energy-ai-executive-summary]',
        ],
      },
      {
        heading: 'A global total cannot price a feature',
        paragraphs: [
          'The IEA forecast describes electricity demand across data centres, which host AI and non-AI workloads. It is evidence of infrastructure scale, not a direct measure of the energy used by a particular chatbot, model, application or request. Regional mix, hardware, utilisation, cooling and workload all affect what a product consumes, and the executive summary does not resolve those factors for individual services. [@iea-energy-ai-executive-summary]',
          'A product team still needs a local cost model. It can measure energy or provider-reported usage where available, alongside latency, retries, successful outcomes and human review. A token price alone leaves out the system around the model; a global TWh projection leaves out the product denominator. Neither number should be substituted for telemetry the team has not collected.',
        ],
      },
      {
        heading: 'Measure the complete service path',
        paragraphs: [
          'A user-visible feature may trigger retrieval, model inference, tool calls, validation, retries and a human correction. Product economics should follow that whole path to a successful outcome, not just the first model response. Teams can compare routes by cost and energy where measured, latency, task quality, exception rate and review time, then state which outcomes are counted.',
          'This is why product constraints must be explicit. A fast, inexpensive response that fails the task may be worse value than a slower route that works; an expensive model may be justified for one high-value decision and wasteful for routine extraction. The comparison needs a shared task set and a documented success criterion rather than a provider name or benchmark score alone.',
        ],
      },
      {
        heading: 'Route capability to the job',
        paragraphs: [
          'Routing work to a smaller model, a cached result or a specialised service can reduce unnecessary computation when those paths meet the same quality bar. More capable systems may be reserved for tasks where the difference is visible and valuable. This is an engineering hypothesis to test for each workload, not a universal claim that small models always use less energy or deliver equal results.',
          'A route should also have a safe fallback when a provider is unavailable or a result is uncertain. Teams need to record how often work escalates, whether escalation improves the outcome, and what additional delay or review it creates. That evidence makes routing a product decision that can be revisited, rather than an optimisation assumed to be permanent.',
        ],
      },
      {
        heading: 'Infrastructure conditions reach the interface',
        paragraphs: [
          'Electricity supply, cooling and grid connections affect where data centres can expand, while network distance and regional capacity influence latency and resilience. The IEA’s global projection does not say which facility will serve a given request, so it should not be used to claim a specific product is power-constrained. It does show why infrastructure planning belongs in product and service conversations. [@iea-energy-ai-executive-summary]',
          'A product that promises quick responses during peaks needs a plan for capacity variation, retries and regional failure. That plan can include queued work, smaller fallback models, cached results or clear user messaging. The choice depends on the task and user expectation; the global energy forecast is context, not a substitute for service measurements.',
        ],
      },
      {
        heading: 'Compete on cost and reliability, not only capability',
        paragraphs: [
          'Stanford HAI’s 2026 AI Index describes competitive pressure moving beyond headline model capability toward cost, reliability and domain-specific performance. That framing supports a product-level question: how much capability does this task need, and what does the whole route cost to deliver a correct result? It does not supply a universal cost curve or energy figure for specific products. [@stanford-ai-index-2026]',
          'For a product owner, the useful unit is a successful outcome at an acceptable service level. Track the model and tool configuration, task quality, retries, latency, cost and human interventions. Where energy is measured, document the measurement boundary and include failed work. Where energy is unavailable, say so rather than converting global data-centre demand into a per-request estimate.',
          'A budget does not require teams to choose the weakest model. It helps reserve higher-cost capability for tasks where evaluation shows a meaningful quality improvement. If the added capability does not change success, risk or user experience, a simpler route may be more appropriate. If it does, the team can document why the cost is justified and how exceptions are handled.',
          'The defensible conclusion is that data-centre electricity demand is forecast to more than double between 2024 and 2030, while AI is a leading contributor to that growth. That system-wide outlook raises the importance of efficiency and infrastructure planning, but it does not quantify the energy of an individual AI feature. Product teams still need measured workload data. [@iea-energy-ai-executive-summary]',
          'Treat the energy forecast as a reason to ask better design questions, not as a product-level answer. Measure successful work, compare routes under a consistent test, and disclose what the system cannot currently report. That keeps claims proportional to evidence while leaving room to improve the service.',
          'Intelligence becomes a design constraint when capability, energy, latency and reliability are measured together. The measurements should be specific to the workload and should distinguish global forecasts from observed product behaviour.',
          'That evidence can help a team decide where to spend compute, when to ask a person for help and which features need a different service design before they scale.',
          'The practical goal is not simply to use less compute; it is to make the relationship between resources and useful outcomes visible.',
        ],
      },
    ],
    bottomLine: 'The IEA projects data-centre electricity demand to rise from 415 TWh in 2024 to about 945 TWh by 2030; that is not an energy-per-request estimate. [@iea-energy-ai-executive-summary]',
    whyItMatters: 'Global infrastructure forecasts explain the scale of the constraint, while product teams still need local measurements of successful work, latency, cost and energy.',
    keyTakeaways: ['The IEA’s figures describe global data-centre electricity use, not an AI-only or per-request total. [@iea-energy-ai-executive-summary]', 'Routing and model choice should be tested against task quality and service cost.', 'Measure the complete path to a successful outcome rather than inferring product energy from a global forecast.'],
    whatChanges: 'Product teams should report task-level quality, retries, latency and cost, and state clearly where energy is not measured.',
  },
];

/**
 * Combine maintained articles with release records whose lifecycle and word
 * count were already checked by the caller using isPublicArticle.
 */
for (const story of stories) {
  story.readTime = getStoryReadTime(story);
}
for (const story of scheduledStories) {
  story.readTime = getStoryReadTime(story);
}

export function resolveMaintainedReleaseStory(
  storedStory: Story,
  maintainedStory: ScheduledStory | undefined,
): Story {
  if (!maintainedStory) return storedStory;
  if ((storedStory as Story & { editorialSource?: string }).editorialSource === 'editor') {
    return storedStory;
  }
  return { ...storedStory, ...maintainedStory };
}

export function mergeEligiblePublishedStories(now = new Date(), schedule: Story[] = []): Story[] {
  const publishedStories = stories.filter(
    (story) => !withdrawnStorySlugs.has(story.slug)
      && isPublicArticle({ date: story.date }, now),
  );
  const publishedSlugs = new Set(publishedStories.map((story) => story.slug));
  const eligibleReleases = schedule.filter(
    (story) => !withdrawnStorySlugs.has(story.slug) && !publishedSlugs.has(story.slug),
  );
  const eligibleStories = [...publishedStories, ...eligibleReleases];
  const eligibleSlugs = new Set(eligibleStories.map((story) => story.slug));
  const normalizedStories = eligibleStories
    .map((story) => {
      const dek = getPublicStoryDek(story) ?? '';
      const publicStory = { ...story, dek };
      return {
        ...publicStory,
        readTime: getStoryReadTime(publicStory),
        relatedStories: story.relatedStories
          .map(canonicalStorySlug)
          .filter((slug) => eligibleSlugs.has(slug)),
      };
    })
    .sort((left, right) => right.date.localeCompare(left.date) || left.slug.localeCompare(right.slug));
  return uniqueStoriesByCanonicalSlug(normalizedStories);
}

export function getPublishedStories(now = new Date(), schedule = scheduledStories): Story[] {
  const publishedStories = stories.filter(
    (story) => !withdrawnStorySlugs.has(story.slug)
      && isPublicArticle({ date: story.date }, now),
  );
  const publishedSlugs = new Set(publishedStories.map((story) => story.slug));
  const newlyPublished = schedule.filter(
    (story) => !publishedSlugs.has(story.slug)
      && isPublicArticle({
        status: 'scheduled',
        publishAt: story.publishAt,
        wordCount: getStoryWordCount(story),
        section: story.section,
      }, now),
  );
  return mergeEligiblePublishedStories(now, newlyPublished);
}

export function getEditorialSchedule(now = new Date(), schedule = scheduledStories): EditorialScheduleItem[] {
  return schedule.map((story, position) => ({
    slug: story.slug,
    title: story.title,
    dek: story.dek,
    publishAt: story.publishAt,
    cadence: story.cadence,
    status: Date.parse(story.publishAt) <= now.getTime() ? 'published' : 'scheduled',
    position,
    story,
  }));
}

export let signals: Signal[] = [
  { slug: 'ai-in-science', label: 'AI in science', topic: 'Research', direction: 'steady', impact: 'medium', change: 'Preclinical study', summary: 'A Nature Microbiology paper reports antimicrobial-peptide activity in in-vitro assays and mouse models; it does not report human treatment results.', entities: ['antibiotic-discovery'], stories: ['ai-models-antibiotic-discovery'], updated: '2026-10-05' },
  { slug: 'provenance-rules', label: 'EU content-transparency duties', topic: 'Policy', direction: 'steady', impact: 'medium', change: 'Applicable from 2 Aug 2026', summary: 'The European Commission distinguishes binding Article 50 obligations from its voluntary Code of Practice; neither makes provenance proof of truth.', entities: ['content-credentials'], stories: ['quiet-race-watermark-everything-ai-makes'], updated: '2026-10-05' },
  { slug: 'india-public-compute', label: 'India public compute', topic: 'India', direction: 'steady', impact: 'medium', change: '45,000+ shared GPUs · June 2026', summary: 'A PIB factsheet reports more than 45,000 shared GPUs as of June 2026; the figure is not a live or schedulable hardware inventory.', entities: ['indiaai-mission'], stories: ['india-ai-compute-access-2026'], updated: '2026-10-05' },
  { slug: 'data-centre-electricity', label: 'Data-centre electricity', topic: 'Infrastructure', direction: 'up', impact: 'high', change: '415 → ~945 TWh', summary: 'The IEA reports 415 TWh of global data-centre electricity use in 2024 and projects about 945 TWh by 2030; this is not an AI-only or per-request measure.', entities: [], stories: ['weekly-deep-dive-cost-of-intelligence'], updated: '2026-10-05' },
  { slug: 'agent-benchmark-evidence', label: 'Agent benchmark evidence', topic: 'Applications', direction: 'steady', impact: 'medium', change: 'Benchmark-specific', summary: 'The AI Index documents OSWorld task accuracy and remaining failures; the benchmark does not establish success rates for a particular production workflow.', entities: [], stories: ['reliability-is-the-new-ai-moat'], updated: '2026-10-05' },
  { slug: 'model-card-specifications', label: 'Model-card specifications', topic: 'Models', direction: 'steady', impact: 'low', change: 'One provider model card', summary: 'Mistral lists Small 4 at 119B total and 6.5B active parameters; this single model card does not establish hardware fit or a broader deployment trend.', entities: [], stories: ['small-models-serious-workflows'], updated: '2026-10-05' },
];

export let industryMap: IndustryMapNode[] = [
  { slug: 'frontier-labs', name: 'Frontier labs', layer: 'Frontier Labs', description: 'General-purpose model research and deployment.', entities: ['openai', 'anthropic', 'google-deepmind'], pressure: 'Compute and dependable post-training', x: 18, y: 18 },
  { slug: 'cloud-infrastructure', name: 'Cloud infrastructure', layer: 'Infrastructure', description: 'Accelerators, data centres, power and network.', entities: ['microsoft'], pressure: 'Grid access and regional demand', x: 48, y: 16 },
  { slug: 'open-models', name: 'Open models', layer: 'Models', description: 'Portable models that can run close to data.', entities: ['gpt-5', 'claude-4', 'sarvam-ai'], pressure: 'Evaluation and distribution', x: 77, y: 24 },
  { slug: 'agent-systems', name: 'Agent systems', layer: 'Agents', description: 'Software that plans, acts and returns evidence.', entities: ['openai', 'anthropic'], pressure: 'Permissions and failure recovery', x: 30, y: 55 },
  { slug: 'enterprise-applications', name: 'Enterprise applications', layer: 'Applications', description: 'Workflows where intelligence becomes a budget line.', entities: ['microsoft'], pressure: 'Change management and trust', x: 65, y: 54 },
  { slug: 'ai-capital', name: 'Capital', layer: 'Capital', description: 'Funding the infrastructure and application layers.', entities: ['openai', 'anthropic'], pressure: 'Proof of durable margins', x: 87, y: 72 },
  { slug: 'policy-provenance', name: 'Policy', layer: 'Policy', description: 'Rules governing safety, origin and access.', entities: ['indiaai-mission'], pressure: 'Interoperability and enforcement', x: 14, y: 82 },
];

export let indiaIndex: IndiaIndexMetric[] = [
  { slug: 'compute-allocation', label: 'Public shared compute capacity', value: '45,000+ GPUs', change: 'Government snapshot · June 2026', context: 'Source: PIB factsheet, published 13 Aug 2026. Reported as shared capacity; not a count of installed, live, available or consumed GPUs.', source: 'pib-capacity-and-use-factsheet-2026' },
  { slug: 'data-centre-capacity', label: 'Operational data-centre capacity', value: '1.6 GW', change: 'Knight Frank estimate · year-end 2025', context: 'Reported by The Hindu BusinessLine on 20 Jun 2026 as operating stock. Excludes pipeline and measures all-workload data-centre capacity, not IndiaAI GPU supply.', source: 'hbl-knight-frank-data-centre-pipeline-2026' },
];

export let essays: Essay[] = [
  { slug: 'intelligence-without-theatre', title: 'Intelligence without the theatre', dek: 'What changes when we measure AI by the systems it makes possible rather than the demos it produces.', author: 'lena-hoff', date: '2026-09-05', readTime: '12 min read', themes: ['systems', 'enterprise', 'trust'], body: [{ heading: 'The demo is not the product', paragraphs: ['The AI economy is learning to separate an impressive answer from a dependable capability. That distinction is quiet, operational and increasingly valuable.'] }, { heading: 'A new editorial subject', paragraphs: ['The institutions around models — labs, clouds, buyers and regulators — now deserve as much attention as the models themselves.'] }] },
  { slug: 'india-builds-in-public', title: 'India builds in public', dek: 'A public AI layer can be both infrastructure policy and industrial strategy.', author: 'ananya-rao', date: '2026-08-29', readTime: '10 min read', themes: ['India', 'policy', 'infrastructure'], body: [{ heading: 'The shared substrate', paragraphs: ['India’s most consequential AI bet may be the layer no single startup owns: language data, compute access and public demand.'] }, { heading: 'The test is use', paragraphs: ['A public stack matters only when it helps a health worker, teacher or small company do something previously out of reach.'] }] },
  { slug: 'the-cost-of-intelligence', title: 'The cost of intelligence', dek: 'Every AI product is also an argument about energy, latency, margin and what deserves to be automated.', author: 'david-okafor', date: '2026-08-22', readTime: '11 min read', themes: ['infrastructure', 'economics', 'design'], body: [{ heading: 'Capability has a carrying cost', paragraphs: ['The most capable model is not automatically the right model. A useful system has to fit the speed, budget and consequence of the work around it.'] }, { heading: 'The design question', paragraphs: ['Choosing where to spend intelligence is becoming part of product design. Small models, local inference and careful routing can make ambition affordable.'] }] },
];

export let askGlobalAnswers: AskGlobalAnswer[] = [
  { slug: 'indiaai-compute-status', question: 'What does the latest IndiaAI GPU figure measure?', answer: 'The PIB factsheet published on 13 August 2026 reports more than 45,000 shared GPUs as of June 2026. Other government records use labels such as onboarded, and the sources do not reconcile those categories into installed, live or currently schedulable capacity. The figure is a dated government snapshot, not a live inventory.', citedStories: ['india-ai-compute-access-2026'], citedSources: ['pib-capacity-and-use-factsheet-2026', 'pib-compute-onboarded-2026'], citedTimeline: ['indiaai-compute-shared-capacity-2026'], citedEntities: ['indiaai-mission'], asOf: '2026-10-05' },
  { slug: 'c2pa-truth-boundary', question: 'Does C2PA prove an AI image is true?', answer: 'No. C2PA credentials can record signed assertions about an asset’s origin and edits. They do not verify that the depicted event happened as described. One 2026 arXiv preprint reports security weaknesses in tested versions; those findings remain a single study and have not been independently confirmed in this source set.', citedStories: ['quiet-race-watermark-everything-ai-makes'], citedSources: ['c2pa-specification-v2-4', 'c2pa-independent-security-preprint'], citedTimeline: ['watermarking-code'], citedEntities: ['content-credentials'], asOf: '2026-10-05' },
  { slug: 'proteogpt-evidence', question: 'What has the ProteoGPT study shown so far?', answer: 'A 2025 Nature Microbiology paper reports that an AI-assisted peptide pipeline produced candidates tested against two resistant bacteria in laboratory assays and mouse infection models. The paper does not report a human treatment trial, so its results are preclinical rather than evidence of an available medicine.', citedStories: ['ai-models-antibiotic-discovery'], citedSources: ['nature-antibiotic-study'], citedTimeline: ['antibiotic-candidates'], citedEntities: ['antibiotic-discovery'], asOf: '2026-10-05' },
  { slug: 'mistral-small4-deployment', question: 'Does Mistral Small 4’s 6.5B active count mean it fits on a laptop?', answer: 'The model card does not establish that. It lists 119 billion total parameters and 6.5 billion active parameters, plus a 256K context window and Apache 2.0 open weights. Hardware fit, memory use, speed and quality need to be measured with the complete model artifact and serving setup.', citedStories: ['small-models-serious-workflows'], citedSources: ['mistral-model-card'], citedTimeline: [], citedEntities: [], asOf: '2026-10-05' },
  { slug: 'data-centre-electricity-outlook', question: 'What does the IEA say about data-centre electricity?', answer: 'The IEA reports global data-centre electricity use of 415 TWh in 2024 and projects about 945 TWh by 2030, with AI a leading growth driver alongside other digital services. These figures are not an AI-only total or an estimate of energy per model request.', citedStories: ['weekly-deep-dive-cost-of-intelligence'], citedSources: ['iea-energy-ai-executive-summary'], citedTimeline: [], citedEntities: [], asOf: '2026-10-05' },
  { slug: 'osworld-agent-evidence', question: 'What does the OSWorld benchmark tell us about AI agents?', answer: 'The Stanford AI Index documents OSWorld task accuracy and a reported human baseline, while also noting remaining agent failures. That benchmark result is specific to its tasks and evaluation conditions; it does not establish success rates for a particular production workflow.', citedStories: ['reliability-is-the-new-ai-moat'], citedSources: ['stanford-ai-index-2026'], citedTimeline: [], citedEntities: [], asOf: '2026-10-05' },
];

export interface NewsroomContentSnapshot {
  authors: Author[];
  sources: Source[];
  evidenceSummaries: Record<string, EvidenceSummary>;
  entities: Entity[];
  timelineEvents: TimelineEvent[];
  stories: Story[];
  researchRecords: import('./authority/registry').ResearchRecord[];
  dataProducts: import('./authority/registry').DataProductRecord[];
  topics: import('./authority/registry').TopicRecord[];
  authorityEdges: import('./authority/registry').AuthorityEdge[];
  signals: Signal[];
  industryMap: IndustryMapNode[];
  indiaIndex: IndiaIndexMetric[];
  essays: Essay[];
  askGlobalAnswers: AskGlobalAnswer[];
}

export function hydrateContent(snapshot: NewsroomContentSnapshot): void {
  authors = snapshot.authors;
  sources = snapshot.sources;
  entities = snapshot.entities;
  timelineEvents = snapshot.timelineEvents;
  stories = snapshot.stories;
  signals = snapshot.signals;
  industryMap = snapshot.industryMap;
  indiaIndex = snapshot.indiaIndex;
  essays = snapshot.essays;
  askGlobalAnswers = snapshot.askGlobalAnswers;
}

export const findStory = (slug: string): Story | undefined =>
  getPublishedStories().find((story) => story.slug === canonicalStorySlug(slug));

export const findEntity = (slug: string): Entity | undefined => {
  const entity = entities.find((candidate) => candidate.slug === slug);
  if (!entity) return undefined;

  const publicStorySlugs = new Set(getPublishedStories().map((story) => story.slug));
  const publicTimelineSlugs = new Set(timelineEvents.map((event) => event.slug));
  const publicSignalSlugs = new Set(signals.map((signal) => signal.slug));

  return {
    ...entity,
    timeline: entity.timeline.filter((timelineSlug) => publicTimelineSlugs.has(timelineSlug)),
    signals: entity.signals.filter((signalSlug) => publicSignalSlugs.has(signalSlug)),
    recentStories: entity.recentStories
      .map(canonicalStorySlug)
      .filter((storySlug) => publicStorySlugs.has(storySlug)),
  };
};
export const findTimeline = (slug: string): TimelineEvent | undefined => timelineEvents.find((event) => event.slug === slug);
export const filterSignals = (topic?: string): Signal[] =>
  topic ? signals.filter((signal) => signal.topic.toLowerCase() === topic.toLowerCase() || signal.slug === topic) : signals;
