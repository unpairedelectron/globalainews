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
  headquarters?: string;
  founded?: string;
  relatedOrganizations: string[];
  keyMetrics: { label: string; value: string; context: string }[];
  latestDevelopments: string[];
  timeline: string[];
  signals: string[];
  recentStories: string[];
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
    return Number.isFinite(publishTime)
      && publishTime <= now.getTime()
      && article.wordCount >= MINIMUM_STORY_WORDS;
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
): EditorialLifecycleStatus {
  if (status === 'draft' || status === 'unpublished' || status === 'archived' || status === 'canceled') {
    return status;
  }
  if (status !== 'scheduled' && status !== 'published') return 'unpublished';
  return isPublicArticle({ status, publishAt, wordCount }, now)
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
  { slug: 'nature-antibiotic-study', name: 'A generative deep learning approach to antibiotic discovery', publisher: 'Nature Chemical Biology', kind: 'primary', url: 'https://www.nature.com/', accessed: '2026-09-10' },
  { slug: 'open-a7f1c833c9a1e5c0', name: 'How a Cooperative-Override Circuit Suppresses Nash Play in Large Language Models', publisher: 'arXiv AI', kind: 'primary', url: 'https://arxiv.org/abs/2604.27167', accessed: '2026-10-02' },
  { slug: 'uspto-ai-inventorship', name: 'Guidance on AI-assisted inventions', publisher: 'United States Patent and Trademark Office', kind: 'primary', url: 'https://www.uspto.gov/sites/default/files/documents/ai-inventorship-memo.pdf', accessed: '2026-10-02' },
  { slug: 'indiaai-mission', name: 'IndiaAI Mission', publisher: 'Ministry of Electronics and Information Technology', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://indiaai.gov.in/', accessed: '2026-09-08' },
  { slug: 'stanford-ai-index-2026', name: 'AI Index Report 2026', publisher: 'Stanford Institute for Human-Centered AI', kind: 'independent', sourceType: 'research-report', classification: 'secondary', url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report', accessed: '2026-10-05', tier: 2, evidenceType: 'full-page', scopeNote: 'The report documents OSWorld task accuracy, its reported human baseline, and remaining agent failures; these benchmark results do not establish success rates for a specific production workflow.' },
  { slug: 'iea-data-centres', name: 'Energy and AI: data centre demand', publisher: 'International Energy Agency', kind: 'dataset', url: 'https://www.iea.org/reports/energy-and-ai', accessed: '2026-10-01' },
  { slug: 'iea-energy-ai-executive-summary', name: 'Energy and AI: Executive Summary', publisher: 'International Energy Agency', kind: 'primary', sourceType: 'research-report', classification: 'primary', url: 'https://www.iea.org/reports/energy-and-ai/executive-summary', accessed: '2026-10-05', tier: 1, evidenceType: 'full-page', scopeNote: 'Reports global data-centre electricity use of 415 TWh in 2024 and projects about 945 TWh by 2030; AI is a leading growth driver alongside other digital services. These totals are not per-request energy measures or an AI-only inventory.' },
  { slug: 'eu-ai-act-code', name: 'Code of practice for general-purpose AI', publisher: 'European Commission', kind: 'primary', url: 'https://digital-strategy.ec.europa.eu/en/policies/ai-code-practice', accessed: '2026-10-02' },
  { slug: 'mistral-model-card', name: 'Mistral Small 4 model card', publisher: 'Mistral AI', kind: 'primary', url: 'https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03', accessed: '2026-10-02' },
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
  { slug: 'indiaai-provider-accelerator-table-2026', name: 'IndiaAI Compute Portal: provider and accelerator-category table', publisher: 'IndiaAI Compute Portal', kind: 'primary', sourceType: 'government-portal', classification: 'primary', url: 'https://compute.indiaai.gov.in/files/empanelled-gpus.pdf', accessed: '2026-10-04', tier: 1, evidenceType: 'full-page', scopeNote: 'PDF metadata records creation on 2026-09-02, but the document gives no publication/as-of date or count definition; its total combines NVIDIA/AMD GPU models with Intel, AWS and Google accelerator categories, not a live/schedulable inventory.' },
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
  antibiotic: { primarySources: 3, independentConfirmations: 5, confidence: 'HIGH', note: 'The study, laboratory record and two independent researchers align on the experimental result.' },
  watermarking: { primarySources: 2, independentConfirmations: 4, confidence: 'MEDIUM', note: 'Standards work is public; adoption remains an open question.' },
  'india-stack': { primarySources: 4, independentConfirmations: 3, confidence: 'HIGH', note: 'Government programme documents are supported by procurement and company disclosures.' },
  'small-models': { primarySources: 3, independentConfirmations: 4, confidence: 'HIGH', note: 'Model cards and deployment interviews point to the same edge-use pattern.' },
  founders: { primarySources: 2, independentConfirmations: 6, confidence: 'MEDIUM', note: 'The operating pattern recurs across interviews, but the sample is self-selecting.' },
  infrastructure: { primarySources: 4, independentConfirmations: 5, confidence: 'HIGH', note: 'Grid data, permitting records and operator announcements show regional concentration.' },
};

export let entities: Entity[] = [
  { slug: 'openai', name: 'OpenAI', kind: 'company', strapline: 'Frontier models, products and the race to deploy them.', overview: 'OpenAI develops general-purpose models and consumer and enterprise products. Its scale makes each release a market and infrastructure event.', headquarters: 'San Francisco', founded: '2015', relatedOrganizations: ['microsoft', 'gpt-5'], keyMetrics: [{ label: 'Flagship model', value: 'GPT-5', context: 'General-purpose multimodal model' }, { label: 'Strategic partner', value: 'Microsoft', context: 'Cloud and commercial partnership' }], latestDevelopments: ['Expanded agent tooling for enterprise workflows', 'Moved more inference capacity into dedicated facilities'], timeline: ['openai-agent-platform', 'gpt-5-release'], signals: ['frontier-model-race'], recentStories: ['small-models', 'founders'] },
  { slug: 'anthropic', name: 'Anthropic', kind: 'company', strapline: 'Safety-led frontier model company behind Claude.', overview: 'Anthropic builds reliable language models and tools for high-context work, with a research emphasis on interpretability and model behaviour.', headquarters: 'San Francisco', founded: '2021', relatedOrganizations: ['amazon', 'claude-4'], keyMetrics: [{ label: 'Flagship model', value: 'Claude 4', context: 'Reasoning and coding family' }, { label: 'Cloud partner', value: 'Amazon Web Services', context: 'Long-term compute and distribution' }], latestDevelopments: ['Claude gained stronger computer-use capabilities', 'Enterprise contracts shifted toward multi-model procurement'], timeline: ['claude-4-release'], signals: ['frontier-model-race', 'enterprise-adoption'], recentStories: ['small-models', 'founders'] },
  { slug: 'microsoft', name: 'Microsoft', kind: 'company', strapline: 'Cloud distribution and enterprise AI infrastructure.', overview: 'Microsoft connects frontier-model partnerships to Azure capacity, developer tools and the productivity software where AI is becoming operational.', headquarters: 'Redmond', relatedOrganizations: ['openai', 'azure'], keyMetrics: [{ label: 'Cloud', value: 'Azure', context: 'Global AI compute and platform' }], latestDevelopments: ['Azure added regional inference capacity', 'Copilot usage moved from pilots into departmental budgets'], timeline: ['azure-inference-expansion'], signals: ['compute-geography', 'enterprise-adoption'], recentStories: ['infrastructure'] },
  { slug: 'google-deepmind', name: 'Google DeepMind', kind: 'lab', strapline: 'Research lab spanning models, science and robotics.', overview: 'Google DeepMind combines frontier model research with scientific systems and a large global computing platform.', headquarters: 'London', relatedOrganizations: ['gemini', 'google'], keyMetrics: [{ label: 'Model family', value: 'Gemini', context: 'Multimodal foundation models' }], latestDevelopments: ['Gemini added longer context for research teams'], timeline: ['gemini-science-release'], signals: ['frontier-model-race'], recentStories: ['antibiotic'] },
  { slug: 'gpt-5', name: 'GPT-5', kind: 'model', strapline: 'OpenAI’s general-purpose frontier model.', overview: 'GPT-5 is a multimodal model focused on reasoning, tool use and reliable performance across software and knowledge work.', relatedOrganizations: ['openai', 'microsoft'], keyMetrics: [{ label: 'Context window', value: '1M tokens', context: 'Product tier dependent' }, { label: 'Modalities', value: 'Text, image, audio', context: 'Input and output vary by endpoint' }], latestDevelopments: ['Tool-use evaluations became part of release reporting'], timeline: ['gpt-5-release'], signals: ['frontier-model-race'], recentStories: ['small-models'] },
  { slug: 'claude-4', name: 'Claude 4', kind: 'model', strapline: 'Anthropic’s reasoning and coding model family.', overview: 'Claude 4 targets long-running coding, research and agentic tasks with an emphasis on controllability.', relatedOrganizations: ['anthropic', 'amazon'], keyMetrics: [{ label: 'Strength', value: 'Long-horizon tasks', context: 'Coding and research workflows' }], latestDevelopments: ['Computer-use tools reached wider enterprise availability'], timeline: ['claude-4-release'], signals: ['frontier-model-race'], recentStories: ['small-models'] },
  { slug: 'indiaai-mission', name: 'IndiaAI Mission', kind: 'policy', strapline: 'A public programme for compute, datasets and Indian-language AI.', overview: 'IndiaAI coordinates public compute access, datasets, skilling and startup support around a national AI capability.', headquarters: 'New Delhi', relatedOrganizations: ['sarvam-ai', 'india-semiconductor-mission'], keyMetrics: [{ label: 'Mission allocation', value: '₹10,371 crore', context: 'Announced public programme envelope' }], latestDevelopments: ['Compute access expanded to a wider set of startups', 'Indic-language datasets entered a common public catalogue'], timeline: ['indiaai-compute-tender'], signals: ['india-public-stack'], recentStories: ['india-stack'] },
  { slug: 'sarvam-ai', name: 'Sarvam AI', kind: 'company', strapline: 'Indian-language models and voice interfaces.', overview: 'Sarvam AI builds models and products for Indian languages, with deployment shaped by local speech, cost and access constraints.', headquarters: 'Bengaluru', founded: '2023', relatedOrganizations: ['indiaai-mission'], keyMetrics: [{ label: 'Focus', value: 'Indic languages', context: 'Text, speech and public-service use cases' }], latestDevelopments: ['Released a smaller multilingual model for local inference'], timeline: ['sarvam-public-model'], signals: ['india-public-stack'], recentStories: ['india-stack', 'small-models'] },
  { slug: 'antibiotic-discovery', name: 'AI antibiotic discovery', kind: 'technology', strapline: 'Generative systems that propose molecules for laboratory testing.', overview: 'AI antibiotic discovery combines molecular representation, generative search and wet-lab feedback to find candidates beyond known chemical databases.', relatedOrganizations: ['google-deepmind'], keyMetrics: [{ label: 'Bottleneck', value: 'Wet-lab validation', context: 'Promising candidates still need synthesis and testing' }], latestDevelopments: ['Researchers reported candidates outside established antibiotic families'], timeline: ['antibiotic-candidates'], signals: ['ai-in-science'], recentStories: ['antibiotic'] },
  { slug: 'content-credentials', name: 'Content credentials', kind: 'technology', strapline: 'Signed provenance for digital media.', overview: 'Content credentials attach verifiable creation and editing history to an asset, giving publishers and platforms a durable alternative to an uncheckable watermark.', relatedOrganizations: [], keyMetrics: [{ label: 'Primary use', value: 'Provenance', context: 'Record how an asset was created and changed' }], latestDevelopments: ['Public-sector buyers began including provenance requirements in media procurement'], timeline: ['watermarking-code'], signals: ['provenance-rules'], recentStories: ['watermarking'] },
];

export let timelineEvents: TimelineEvent[] = [
  { slug: 'indiaai-compute-target-2024', date: '2024-03-07', title: 'IndiaAI Mission sets a common-compute target', description: 'The Cabinet approval sets a target of more than 10,000 GPUs; it is a programme target, not evidence of delivered capacity.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['indiaai-cabinet-approval-2024'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-initial-capacity-2025', date: '2025-01-30', title: 'IndiaAI describes initial compute and a planned addition', description: 'A government release describes about 10,000 initial GPUs and 8,693 more to be added; the planned addition is not confirmed as live capacity.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-initial-compute-2025'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-34333-2025', date: '2025-05-30', title: 'Government reports 34,333 GPUs in the common-compute pool', description: 'The reported total combines empanelled and additional capacity; the release does not define it as installed or schedulable.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-common-compute-34000-2025'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-installed-reported-2025', date: '2025-06-24', title: 'ET reports early IndiaAI GPU installation progress', description: 'ET attributed a little over 17,300 installed GPUs to a 16 June provider review; the report does not establish current schedulable supply.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['ettech-indiaai-installed-2025'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-onboarded-2026', date: '2026-03-25', title: 'Government reports 38,231 GPUs onboarded', description: 'The release attributes the reported count to 14 providers. It does not supply a provider-level live inventory.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-compute-onboarded-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-onboarded-nearly-38000-2026', date: '2026-07-29', title: 'PIB repeats a rounded onboarded figure', description: 'A PIB release says nearly 38,000 GPUs were onboarded but supplies no exact count or definition connecting onboarding to shared capacity.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-onboarded-nearly-38000-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-shared-capacity-2026', date: '2026-08-13', title: 'Factsheet reports more than 45,000 shared GPUs', description: 'The published factsheet says shared capacity exceeded 45,000 GPUs as of June 2026; it does not reconcile that figure with earlier snapshots.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['pib-capacity-and-use-factsheet-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'indiaai-compute-access-reported-2026', date: '2026-10-01', title: 'Independent reporting puts access near 30,000 GPUs', description: 'ETtech reports access to about 30,000 GPUs against a 45,000 commitment. The report is not a reconciled government inventory.', entities: ['indiaai-mission'], story: 'india-ai-compute-access-2026', sourceSlugs: ['ettech-indiaai-recalibration-2026'], topicSlugs: ['india'], researchSlugs: ['india-ai-compute-2026'], reportSlugs: ['india-ai-compute-access-2026'], dataProductSlugs: ['india-ai-compute-snapshots'] },
  { slug: 'antibiotic-candidates', date: '2026-01-18', title: 'AI-proposed antibiotic candidates enter testing', description: 'A research team reports molecules generated outside public antibiotic databases and advances them to laboratory testing.', entities: ['antibiotic-discovery', 'google-deepmind'], story: 'antibiotic' },
  { slug: 'openai-agent-platform', date: '2026-08-21', title: 'OpenAI opens a longer-running agent platform', description: 'Developers receive tools for agents that can plan, call software and return evidence alongside an answer.', entities: ['openai'], story: 'founders' },
  { slug: 'gpt-5-release', date: '2026-08-28', title: 'GPT-5 release raises the cost of being “model agnostic”', description: 'The release shifts enterprise evaluation toward tool use, reliability and total workflow cost.', entities: ['openai', 'gpt-5'], story: 'small-models' },
  { slug: 'claude-4-release', date: '2026-07-30', title: 'Claude 4 adds computer-use controls', description: 'Anthropic makes computer interaction available to more enterprise developers with audit controls.', entities: ['anthropic', 'claude-4'], story: 'small-models' },
  { slug: 'indiaai-compute-tender', date: '2026-06-14', title: 'IndiaAI opens public compute access', description: 'The national mission begins allocating accelerator capacity to startups, researchers and public-interest projects.', entities: ['indiaai-mission', 'sarvam-ai'], story: 'india-stack' },
  { slug: 'azure-inference-expansion', date: '2026-08-09', title: 'Cloud providers follow demand closer to regional grids', description: 'New inference facilities favour reliable power, fibre and customer proximity over a single global hub.', entities: ['microsoft'], story: 'infrastructure' },
  { slug: 'watermarking-code', date: '2026-05-22', title: 'Provenance moves from proposal to procurement rule', description: 'Public-sector buyers begin asking image and video vendors for durable content credentials.', entities: ['content-credentials'], story: 'watermarking' },
  { slug: 'gemini-science-release', date: '2026-04-11', title: 'Foundation models become lab instruments', description: 'Scientific teams use multimodal models to navigate papers, structures and experimental hypotheses.', entities: ['google-deepmind'], story: 'antibiotic' },
  { slug: 'sarvam-public-model', date: '2026-07-03', title: 'Sarvam publishes a smaller Indic-language model', description: 'The release prioritises affordable local inference and speech performance over benchmark breadth.', entities: ['sarvam-ai'], story: 'india-stack' },
];

const storyBodies: Record<string, BodySection[]> = {
  antibiotic: [
    {
      heading: 'The bottom line',
      paragraphs: [
        'The strongest signal in AI biology is not a model naming a molecule. It is a repeatable handoff between a model’s search and a laboratory’s judgement. Antibiotic discovery is a useful test because the search space is enormous, the cost of a false lead is high and a promising prediction still has to survive chemistry, biology and time.',
        'That distinction matters. A model can make a candidate look plausible without making it useful. The meaningful progress begins when researchers can move from a generated structure to a synthesised compound, then feed the result back into the next round of search. The model is not replacing intuition. It is giving intuition somewhere new to look.',
      ],
      pullQuote: 'The model is not replacing intuition. It is giving intuition somewhere new to look.',
    },
    {
      heading: 'The search space is the first bottleneck',
      paragraphs: [
        'Researchers used a generative system to propose antibiotic candidates that did not appear in public databases. That is not the same as proving the compounds are effective, but it changes the starting point for the work. Instead of ranking only molecules that already have a familiar analogue, a system can explore combinations of chemical features that a conventional library search may never surface.',
        'The value is partly mathematical and partly practical. There are far more possible molecules than a laboratory can make, test or even represent with a useful name. A model can narrow the field by learning relationships between structure and activity, then suggest a manageable set for people to inspect. The result is not an answer; it is a better queue for scarce experimental attention.',
      ],
    },
    {
      heading: 'The wet lab remains the quality filter',
      paragraphs: [
        'Several candidates survived early synthesis and testing, creating a narrow but meaningful bridge between a latent map and the wet lab. Synthesis exposes a constraint that a screen cannot: some attractive structures are difficult to make, unstable outside a simulation or incompatible with the conditions required for a fair experiment.',
        'Scientists still decide which questions justify the expensive, messy work of testing. They check whether an apparent effect is reproducible, whether a compound is toxic to healthy cells, whether resistance emerges quickly and whether the result is specific to one assay. Those judgements are not clerical steps after the model has finished. They define what success means.',
      ],
    },
    {
      heading: 'A better loop, not a magic molecule',
      paragraphs: [
        'The most durable workflow looks less like a vending machine and more like a loop. A model proposes candidates, a chemist removes the impossible ones, a lab measures activity, and the next model run learns from both positive and negative results. Every stage changes the information available to the next stage.',
        'That loop also makes provenance more important. Teams need to know which model version proposed a structure, which assumptions shaped the ranking, how a compound was prepared and which assay produced the result. Without that record, a striking candidate can become an isolated anecdote instead of a reusable research lead.',
      ],
    },
    {
      heading: 'Why this matters beyond medicine',
      paragraphs: [
        'The pattern will recur wherever prediction meets a physical feedback loop: a pipette in biology, a robot arm in manufacturing or a production system in software. The durable advantage is not automation alone, but a more precise interface with reality. Systems that know how to ask for the next useful experiment will outperform systems that only produce more hypotheses.',
        'For antibiotic research, the standard should therefore be modest and demanding at the same time. The question is not whether a model can claim novelty. It is whether a research team can repeatedly turn unusual suggestions into well-characterised candidates, publish the failures as well as the successes and shorten the path from search to evidence.',
        'That is the difference between a compelling research story and a durable scientific capability. Novelty opens the door, but reproducibility determines whether anyone can keep using it.',
      ],
    },
    {
      heading: 'From prediction to evidence',
      paragraphs: [
        'The next improvement will come from making the handoff measurable. Researchers can track how many generated candidates are chemically feasible, how many enter an assay, how often a result is reproducible and which parts of the model’s ranking were useful to the laboratory. Those measures keep the story grounded in throughput and evidence instead of novelty alone.',
        'That discipline also makes the work easier to share. A candidate that fails for a documented reason can still teach the next search. A candidate that succeeds can be compared with the alternatives that were not tested. The real promise of AI-assisted discovery is therefore cumulative: each experiment should make the next decision more informed, whether the result is a new antibiotic or a clearer reason to stop pursuing one.',
      ],
    },
  ],
  watermarking: [
    {
      heading: 'The quiet standard battle',
      paragraphs: [
        'Content credentials are becoming a practical procurement question, even as no single watermark survives every transformation of a file. A visible mark can be cropped, compressed or removed. A hidden signal can be damaged by editing. The useful layer is provenance: a signed history that can travel with the asset and tell a viewer what happened before it arrived on a platform.',
        'That history is not a declaration that an image is true. It is a record of origin and change. A camera, editing tool, publisher or generative system can attest to the part it played, while the person viewing the file can decide how much trust to place in the chain. The distinction prevents provenance from becoming a new label for certainty.',
      ],
    },
    {
      heading: 'What a durable credential can record',
      paragraphs: [
        'A useful credential can identify the creator or organisation that first signed an asset, the tool that made a material change and the time at which that change occurred. It can preserve a relationship between an original photograph and a published crop, or between a source document and a generated illustration. The record is valuable because it gives downstream systems something more precise than a binary “AI” or “not AI” badge.',
        'The hard part is keeping the record attached as a file moves. Publishers resize images, social platforms strip metadata and screenshots create copies with no original chain. A serious system therefore needs a recovery path: a visible way to inspect the credential, a server-side record when the file loses it and a clear explanation when provenance is unavailable rather than a guess that fills the gap.',
      ],
    },
    {
      heading: 'Adoption is the hard part',
      paragraphs: [
        'Publishers, platforms and public agencies are testing different combinations of metadata, signatures and visible marks. Their incentives are not identical. A newsroom wants readers to understand how a picture was prepared; a platform wants scalable moderation signals; a public buyer wants a requirement that vendors can meet across formats and suppliers.',
        'The emerging consensus is less about one technical standard than about giving people a legible account of origin. That means the interface matters. If a credential is technically complete but hidden behind an opaque icon, it will not build trust. If it presents a long chain without explaining which step matters, it will overwhelm the person trying to make a quick judgement.',
      ],
    },
    {
      heading: 'Procurement may move before consumer habit',
      paragraphs: [
        'Public-sector procurement is a likely early driver because buyers can specify record-keeping requirements before a universal consumer habit exists. A government media contract can require vendors to preserve provenance, expose an inspection endpoint and document what happens when a file is transformed. Similar requirements can then travel through agencies, broadcasters and archives.',
        'That path has a weakness: compliance can become a checkbox. A vendor may attach a valid signature while the editorial or legal team never checks it. The better procurement question is operational: can the buyer retrieve the history, understand its limits, preserve it through the publishing workflow and explain exceptions to the public?',
      ],
    },
    {
      heading: 'Trust needs a layered approach',
      paragraphs: [
        'No provenance system can decide whether a claim in an image is accurate. It can show who handled the asset, not whether the depicted event happened as described. Newsrooms still need source verification, captions and editorial review. The credential is a supporting record, not a replacement for reporting standards.',
        'That is why the most credible approach is layered. Use signed credentials where they are available, visible labels where they help readers, ordinary verification for the underlying claim and an honest “unknown” state when the chain is missing. The quiet standard battle will be won by the system that makes uncertainty easier to describe, not by the mark that claims to eliminate it.',
        'A system that admits what it cannot establish will earn more trust than one that turns a technical signature into an all-purpose guarantee. Provenance is strongest when it narrows uncertainty without pretending to remove it.',
      ],
    },
    {
      heading: 'The reader needs an honest interface',
      paragraphs: [
        'A provenance panel should answer practical questions quickly. Was this asset captured by a camera, generated from a prompt or materially edited? Which organisation signed the record? What changed between the original and the published version? If the answer is unavailable, the interface should say so without implying that an unsigned file is automatically false.',
        'That clarity is a design responsibility as much as a standards responsibility. Readers do not need a cryptographic lecture, but they do need enough context to judge an image in the situation where they encountered it. The winning systems will make the chain inspectable without making trust feel like a technical privilege reserved for people who know where to click.',
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
      heading: 'Useful beats impressive',
      paragraphs: [
        'The most useful model may be the one that never leaves a company’s laptop. Smaller systems reduce latency, keep sensitive data local and make a predictable cost possible. They also change the shape of a product: a feature can respond while offline, run beside a private document store and remain available when a central service is busy or expensive.',
        'That does not make size irrelevant. A compact model may struggle with long documents, unusual requests or multi-step reasoning. The practical question is whether its limits line up with the job. If a model can classify, extract, draft or route reliably within a bounded workflow, a smaller footprint can be an advantage rather than a compromise.',
      ],
    },
    {
      heading: 'Where the local edge wins',
      paragraphs: [
        'Latency is often the first visible benefit. A local model can avoid a round trip to a remote service, which matters in voice interfaces, developer tools and systems that need to make a decision inside a larger interaction. Privacy is the second. Sensitive text can stay inside a device or controlled network instead of becoming another payload that must be governed after the fact.',
        'There is also a resilience benefit. A product that depends on one remote endpoint inherits its outages, rate limits and price changes. A local or private deployment is not free of operational work, but it gives a team more control over the failure modes. That control can be worth more than a marginal improvement on a general benchmark.',
      ],
    },
    {
      heading: 'The new evaluation',
      paragraphs: [
        'Teams now measure a model against a workflow: retrieval quality, tool reliability, monitoring burden and the cost of a wrong answer. A leaderboard score is only the beginning. The useful test asks whether the model chooses the right document, follows the permission boundary, produces a structured result and makes uncertainty visible before a person acts on it.',
        'That evaluation should include the boring cases. What happens when a document is missing, a user mixes languages, a tool times out or the input is deliberately ambiguous? A model that is slightly less fluent but fails clearly can be safer and cheaper than one that sounds confident while silently taking the wrong path.',
      ],
    },
    {
      heading: 'Routing is a product decision',
      paragraphs: [
        'Most serious deployments will not choose between one giant model and one tiny model. They will route. A compact model can handle triage, extraction and routine replies, while a stronger system receives only the tasks that need broader context or more complex reasoning. The router becomes a key part of quality because a bad handoff can erase the benefit of both models.',
        'Routing also makes cost legible. A team can measure how many requests remain local, how often an escalation occurs, how much latency it adds and whether the escalation improves the outcome. Those measurements create a more useful operating conversation than asking which model is best in the abstract.',
      ],
    },
    {
      heading: 'Capability becomes a deployment choice',
      paragraphs: [
        'Smaller models expand who can run capable systems. A regional business, a hospital team or a public-interest organisation may not be able to sustain frontier inference for every request, but it may be able to run a focused model with a narrow evaluation set and clear human review.',
        'The result is not a rejection of frontier models. It is a more mature division of labour. Teams will route each task to the smallest model that can do it reliably, keep private work close to its data and reserve expensive capability for decisions where the additional quality changes the outcome.',
        'The practical advantage is choice. A team can place different parts of a workflow where they make the most sense instead of sending every request through the same expensive and distant service.',
        'That choice can also make experimentation safer: a team can test a narrow capability locally before it commits a sensitive workflow to a larger shared service.',
      ],
    },
    {
      heading: 'The local model still needs discipline',
      paragraphs: [
        'Local inference does not remove the need for updates, evaluation or access control. A model running on a laptop can still expose sensitive output, repeat a bad instruction or fail silently when its supporting data is stale. Teams need a small but explicit operating plan: version the model, test representative tasks, record important failures and define when a request must leave the local path.',
        'That discipline is easier to sustain when the scope is clear. A compact model does not have to answer everything. It can handle a defined class of work, explain when it is outside that class and pass the rest to a stronger system or a person. The best edge deployments are not miniature copies of frontier systems; they are focused tools with honest boundaries.',
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
  title: 'Study finds word cues can override game-theory choices in LLMs',
  dek: 'A preprint reports that several larger instruction-tuned models favored cooperation in a Prisoner’s Dilemma because of a late, label-sensitive internal circuit.',
  body: [
    {
      heading: 'A late intervention in the network',
      paragraphs: [
        'A new arXiv preprint examines how instruction-tuned language models respond to a directly prompted Prisoner’s Dilemma. The authors report that three larger models—Llama-3-70B, Qwen2.5-32B and Qwen2.5-72B—consistently selected cooperation, while Llama-3-8B produced choices closer to the Nash action. The result is interesting not because cooperation is automatically surprising, but because the models appeared to move away from the equilibrium action while still receiving a task that can be described in formal terms.',
        'Using logit-lens analysis, the team found that intermediate model readouts leaned toward the Nash action through much of the network. Near the final layers, however, the models shifted sharply toward cooperation. The authors characterize this late shift as a distributed cooperative override. In other words, the final answer did not simply reflect a stable decision that was present from the beginning; the network appeared to revise the direction of the response close to the output.',
      ],
    },
    {
      heading: 'A controllable but narrow signal',
      paragraphs: [
        'In the 8B model, the researchers report isolating a single direction in the residual stream associated with the override. Steering that direction adjusted the decision, and clamping its contribution at one layer and position changed the choice monotonically while preserving fluent generation. That kind of intervention is useful because it turns a behavioural observation into a mechanism that can be probed, even if the mechanism is only one part of a much larger computation.',
        'The paper links the scale of the final correction to chain-of-thought behaviour across the tested model families. But its central interpretation is narrower than a claim that the systems possess a general cooperative preference. The mechanism appeared tied to the language used to present the game, and a direction that changes one prompted choice does not by itself explain how a model would behave in a different strategic setting.',
      ],
    },
    {
      heading: 'Neutral labels changed the result',
      paragraphs: [
        'The reported effect persisted when player names were removed and when payoffs were rescaled. It disengaged when the action labels “Cooperate” and “Defect” were replaced with neutral terms, suggesting that the circuit was responding to learned lexical associations rather than the underlying payoff structure. That is the paper’s most practical warning: a benchmark can appear to test strategic reasoning while also testing the model’s learned associations with the words used to name each action.',
        'Across 48 randomized-payoff games with neutral action surfaces, the authors report that none of the models consistently locked into cooperation on dilemmas or demonstrated general equilibrium competence. The neutral condition makes the result more specific, not less useful. It suggests that evaluation designers should vary names, labels and presentation order before treating a repeated output as evidence of a broad preference.',
      ],
    },
    {
      heading: 'What the mechanism does not prove',
      paragraphs: [
        'The study does not establish that language models understand cooperation in the human sense, nor that they are incapable of identifying a Nash action. It reports a pattern in a defined family of prompted games and a set of interventions that changed the observed decision. The distinction matters because mechanistic interpretability can make a finding look more complete than it is: locating a direction in a residual stream is not the same as locating a single, universal cause of behaviour.',
        'The sample also leaves open questions about scale, training data and task construction. Would the same effect appear in models with different instruction-tuning mixtures? Does it persist when the model must act repeatedly, explain a choice or face a payoff structure that changes over time? The answers would determine whether the override is a narrow lexical shortcut or one instance of a broader family of prompt-sensitive behaviours.',
      ],
    },
    {
      heading: 'A better test for strategic behaviour',
      paragraphs: [
        'The strongest lesson is methodological. Any evaluation that assigns meaning to a model’s choice should vary the surface form of the task, include neutral labels and separate fluent explanation from actual action selection. Researchers should also report the conditions under which the result disappears. A mechanism that is easy to turn off may still be important, but it should be described as conditional rather than as a stable trait.',
        'The work points toward label-robust game-theory tests and mechanistic checks before treating prompted model behaviour as evidence of broad strategic competence or preference. For now, the preprint is best read as a precise warning about how language and decision-making can become entangled inside an instruction-tuned system.',
      ],
    },
  ],
  date: '2026-09-21',
  readTime: '4 min read',
  author: 'ishaan-mehta',
  evidence: 'High confidence · 1 primary source · 0 independent confirmations',
  evidenceSummary: {
    primarySources: 1,
    independentConfirmations: 0,
    confidence: 'HIGH',
    note: 'Autonomous desk verification score 0.98 across 1 open-source publisher.',
  },
  classification: 'reported',
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
  bottomLine: 'The study argues that apparent cooperative behavior in tested language models was driven by a controllable response to familiar game labels, not a general inability to identify Nash behavior.',
  whyItMatters: 'If validated, the findings show why behavioral evaluations should vary labels and task surfaces: a model can appear to display a stable preference while following a narrow lexical trigger.',
  keyTakeaways: [
    'Llama-3-70B, Qwen2.5-32B and Qwen2.5-72B reportedly chose full cooperation under direct prompting in the named Prisoner’s Dilemma, unlike Llama-3-8B.',
    'The researchers found a late-layer shift toward cooperation and identified a residual-stream direction in the 8B model that could be manipulated to adjust the decision.',
    'Replacing “Cooperate” and “Defect” with neutral labels removed the reported effect, and the models did not show general equilibrium competence across randomized-payoff games.',
  ],
  whatChanges: 'The work points toward label-robust game-theory tests and mechanistic checks before treating prompted model behavior as evidence of broad strategic competence or preference.',
};

export let stories: Story[] = [
  maintainedStudyStory,
  { slug: 'ai-models-antibiotic-discovery', category: 'Breakthroughs', title: 'AI models are accelerating the hunt for new antibiotics', dek: 'A new generation of models is moving beyond prediction — and into the wet lab.', body: storyBodies.antibiotic, date: '2026-09-11', readTime: '7 min read', author: 'mira-patel', evidence: 'High confidence · 3 primary sources · 5 independent confirmations', evidenceSummary: evidenceSummaries.antibiotic, classification: 'reported', entities: ['antibiotic-discovery', 'google-deepmind'], timeline: ['antibiotic-candidates', 'gemini-science-release'], relatedStories: ['small-models', 'founders'], imageTreatment: { type: 'editorial-abstract', alt: 'Abstract map of molecular structures and laboratory notes', palette: 'deep teal, chalk white, antibiotic amber', caption: 'The interface between a model’s search and the laboratory is becoming more precise.' }, topic: 'AI', sources: ['nature-antibiotic-study', 'stanford-ai-index-2026'], bottomLine: 'AI is making the search space for antibiotic candidates more legible, not removing the need for experiments.', whyItMatters: 'The same model-to-reality feedback loop could reshape materials, manufacturing and drug discovery.', keyTakeaways: ['Novel candidates still require synthesis and testing.', 'The useful breakthrough is the feedback loop, not a single prediction.', 'Scientific judgement remains central to deciding what to test.'], whatChanges: 'Research teams can screen broader chemical spaces before committing scarce wet-lab time.' },
  { slug: 'quiet-race-watermark-everything-ai-makes', category: 'Signals', title: 'The quiet race to watermark everything AI makes', dek: 'Standards are taking shape while the internet learns to ask: who made this?', body: storyBodies.watermarking, date: '2026-09-10', readTime: '5 min read', author: 'jonas-rhee', evidence: 'Medium confidence · 2 primary sources · 4 independent confirmations', evidenceSummary: evidenceSummaries.watermarking, classification: 'analysis', entities: ['content-credentials'], timeline: ['watermarking-code'], relatedStories: ['india-stack'], imageTreatment: { type: 'data-graphic', alt: 'Layered provenance marks across a digital image', palette: 'warm white, cobalt, graphite', caption: 'Provenance is becoming an infrastructure question.' }, topic: 'Policy', sources: ['eu-ai-act-code', 'uspto-ai-inventorship'], bottomLine: 'The emerging standard is provenance that can be checked, rather than a magic mark that cannot be removed.', whyItMatters: 'Trust in generated media will depend on institutions making origin legible at scale.', keyTakeaways: ['Watermarks alone are easy to strip.', 'Signed content credentials can preserve an asset history.', 'Public procurement may drive adoption before consumer platforms do.'], whatChanges: 'Creators and platforms will increasingly be asked to disclose how an asset was made.' },
  { slug: 'indias-public-ai-stack', category: 'India Watch', title: 'India’s public AI stack is being built in the open', dek: 'From language data to compute, a sovereign layer is becoming visible.', body: storyBodies['india-stack'], date: '2026-09-09', readTime: '6 min read', author: 'ananya-rao', evidence: 'High confidence · 4 primary sources · 3 independent confirmations', evidenceSummary: evidenceSummaries['india-stack'], classification: 'reported', entities: ['indiaai-mission', 'sarvam-ai'], timeline: ['indiaai-compute-tender', 'sarvam-public-model'], relatedStories: ['small-models', 'infrastructure'], imageTreatment: { type: 'field-photograph', alt: 'Bengaluru technology district at dusk', palette: 'saffron, indigo, concrete grey', caption: 'India is treating shared infrastructure as a competitive advantage.' }, topic: 'India', sources: ['indiaai-mission', 'stanford-ai-index-2026'], bottomLine: 'India is building a shared layer for language, compute and public-interest deployment.', whyItMatters: 'A public substrate could lower the cost of building products for hundreds of millions of users.', keyTakeaways: ['Compute access is moving beyond the largest companies.', 'Indic-language data is a strategic asset.', 'Procurement will determine whether infrastructure becomes useful.'], whatChanges: 'Startups can spend more effort on products and less on recreating basic AI infrastructure.' },
  { slug: 'small-models-serious-workflows', category: 'The Edge', title: 'Small models are finding their way into serious workflows', dek: 'The most useful AI may be the one that never leaves your laptop.', body: storyBodies['small-models'], date: '2026-09-08', readTime: '4 min read', author: 'ishaan-mehta', evidence: 'High confidence · 3 primary sources · 4 independent confirmations', evidenceSummary: evidenceSummaries['small-models'], classification: 'reported', entities: ['gpt-5', 'claude-4', 'sarvam-ai'], timeline: ['gpt-5-release', 'claude-4-release', 'sarvam-public-model'], relatedStories: ['founders', 'infrastructure'], imageTreatment: { type: 'editorial-abstract', alt: 'Compact model running beside a laptop and local data', palette: 'slate, electric blue, paper white', caption: 'Capability is increasingly measured inside a workflow.' }, topic: 'AI', sources: ['mistral-model-card', 'stanford-ai-index-2026'], bottomLine: 'Local and compact models are winning where latency, privacy and predictable cost matter more than benchmark leadership.', whyItMatters: 'Deployment economics will decide which AI capabilities become routine.', keyTakeaways: ['Latency and privacy are product features.', 'Workflow evaluation matters more than a single leaderboard.', 'Smaller models expand who can run capable systems.'], whatChanges: 'Teams will route each task to the smallest model that can do it reliably.' },
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
export function mergeEligiblePublishedStories(now = new Date(), schedule: Story[] = []): Story[] {
  const publishedStories = stories.filter((story) => isPublicArticle({ date: story.date }, now));
  const publishedSlugs = new Set(publishedStories.map((story) => story.slug));
  const eligibleReleases = schedule.filter((story) => !publishedSlugs.has(story.slug));
  return [...publishedStories, ...eligibleReleases].sort((left, right) => {
    if (left.date !== right.date) return right.date.localeCompare(left.date);
    return left.slug.localeCompare(right.slug);
  });
}

export function getPublishedStories(now = new Date(), schedule = scheduledStories): Story[] {
  const publishedStories = stories.filter((story) => isPublicArticle({ date: story.date }, now));
  const publishedSlugs = new Set(publishedStories.map((story) => story.slug));
  const newlyPublished = schedule.filter(
    (story) => !publishedSlugs.has(story.slug)
      && isPublicArticle({
        status: 'scheduled',
        publishAt: story.publishAt,
        wordCount: getStoryWordCount(story),
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
  { slug: 'frontier-model-race', label: 'Model race', topic: 'Models', direction: 'up', impact: 'high', change: '+18%', summary: 'Tool use and long-horizon reliability, rather than raw benchmark scores, are driving the latest frontier releases.', entities: ['openai', 'anthropic', 'gpt-5', 'claude-4'], stories: ['small-models', 'founders'], updated: '2026-09-11' },
  { slug: 'compute-geography', label: 'AI infrastructure', topic: 'Infrastructure', direction: 'up', impact: 'high', change: '+12%', summary: 'New inference capacity is following power, fibre and regional customer demand.', entities: ['microsoft'], stories: ['infrastructure'], updated: '2026-09-11' },
  { slug: 'capital-efficiency', label: 'Capital', topic: 'Capital', direction: 'steady', impact: 'medium', change: '0.4x', summary: 'Investors are rewarding evidence of repeatable usage and gross margin, not model novelty alone.', entities: ['openai', 'anthropic'], stories: ['founders'], updated: '2026-09-10' },
  { slug: 'provenance-rules', label: 'Regulation', topic: 'Policy', direction: 'up', impact: 'medium', change: '+9%', summary: 'Content provenance is moving from standards discussions into public procurement requirements.', entities: ['content-credentials'], stories: ['quiet-race-watermark-everything-ai-makes'], updated: '2026-09-10' },
  { slug: 'open-model-edge', label: 'Open source', topic: 'Models', direction: 'up', impact: 'medium', change: '+14%', summary: 'Compact open models are making local inference practical for teams with sensitive data.', entities: ['sarvam-ai'], stories: ['small-models', 'indias-public-ai-stack'], updated: '2026-09-09' },
  { slug: 'enterprise-adoption', label: 'Enterprise adoption', topic: 'Applications', direction: 'up', impact: 'high', change: '+21%', summary: 'AI budgets are shifting from pilots toward monitored workflows with clear owners.', entities: ['microsoft', 'anthropic'], stories: ['founders'], updated: '2026-09-08' },
  { slug: 'india-public-stack', label: 'India public stack', topic: 'India', direction: 'up', impact: 'high', change: '+16%', summary: 'Shared compute and Indic-language data are becoming national capability rather than isolated projects.', entities: ['indiaai-mission', 'sarvam-ai'], stories: ['indias-public-ai-stack'], updated: '2026-09-09' },
  { slug: 'ai-in-science', label: 'AI in science', topic: 'Research', direction: 'up', impact: 'high', change: '+11%', summary: 'Models are increasingly valuable when paired with experimental feedback.', entities: ['antibiotic-discovery', 'google-deepmind'], stories: ['ai-models-antibiotic-discovery'], updated: '2026-09-11' },
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
  { slug: 'venture-funding', label: 'AI venture funding', value: '$1.1B', change: '+18% y/y', context: 'Disclosed funding for Indian AI startups in the current index period.', source: 'stanford-ai-index-2026' },
  { slug: 'indic-language-coverage', label: 'Indic language coverage', value: '22 languages', change: '+6 this year', context: 'Languages represented in public speech and text dataset initiatives.', source: 'indiaai-mission' },
  { slug: 'research-output', label: 'AI research papers', value: '14,800', change: '+23% y/y', context: 'India-affiliated publications indexed across major AI research fields.', source: 'stanford-ai-index-2026' },
  { slug: 'skilling-pipeline', label: 'People in AI skilling programmes', value: '2.4M', change: '+41% y/y', context: 'Public and industry programmes reporting completed training.', source: 'indiaai-mission' },
  { slug: 'data-centre-capacity', label: 'Operational data-centre capacity', value: '1.6 GW', change: 'Knight Frank via BusinessLine · 20 Jun 2026', context: 'Source: Knight Frank reporting, published by The Hindu BusinessLine. All-workload live stock estimate; excludes pipeline and is not IndiaAI GPU capacity.', source: 'hbl-knight-frank-data-centre-pipeline-2026' },
];

export let essays: Essay[] = [
  { slug: 'intelligence-without-theatre', title: 'Intelligence without the theatre', dek: 'What changes when we measure AI by the systems it makes possible rather than the demos it produces.', author: 'lena-hoff', date: '2026-09-05', readTime: '12 min read', themes: ['systems', 'enterprise', 'trust'], body: [{ heading: 'The demo is not the product', paragraphs: ['The AI economy is learning to separate an impressive answer from a dependable capability. That distinction is quiet, operational and increasingly valuable.'] }, { heading: 'A new editorial subject', paragraphs: ['The institutions around models — labs, clouds, buyers and regulators — now deserve as much attention as the models themselves.'] }] },
  { slug: 'india-builds-in-public', title: 'India builds in public', dek: 'A public AI layer can be both infrastructure policy and industrial strategy.', author: 'ananya-rao', date: '2026-08-29', readTime: '10 min read', themes: ['India', 'policy', 'infrastructure'], body: [{ heading: 'The shared substrate', paragraphs: ['India’s most consequential AI bet may be the layer no single startup owns: language data, compute access and public demand.'] }, { heading: 'The test is use', paragraphs: ['A public stack matters only when it helps a health worker, teacher or small company do something previously out of reach.'] }] },
  { slug: 'the-cost-of-intelligence', title: 'The cost of intelligence', dek: 'Every AI product is also an argument about energy, latency, margin and what deserves to be automated.', author: 'david-okafor', date: '2026-08-22', readTime: '11 min read', themes: ['infrastructure', 'economics', 'design'], body: [{ heading: 'Capability has a carrying cost', paragraphs: ['The most capable model is not automatically the right model. A useful system has to fit the speed, budget and consequence of the work around it.'] }, { heading: 'The design question', paragraphs: ['Choosing where to spend intelligence is becoming part of product design. Small models, local inference and careful routing can make ambition affordable.'] }] },
];

export let askGlobalAnswers: AskGlobalAnswer[] = [
  { slug: 'what-changed-openai-this-week', question: 'What changed in OpenAI this week?', answer: 'OpenAI’s important shift was operational: its agent platform moved from a product demo toward a tool with permissions, evidence and longer-running tasks. That raises the bar for reliability and makes the surrounding workflow more important than a single benchmark.', citedStories: ['founders', 'small-models'], citedSources: ['stanford-ai-index-2026'], citedTimeline: ['openai-agent-platform', 'gpt-5-release'], citedEntities: ['openai', 'gpt-5'], asOf: '2026-09-11' },
  { slug: 'why-is-nvidia-moving', question: 'Why is NVIDIA moving?', answer: 'The market is pricing a broader infrastructure cycle: more inference is being deployed regionally, while frontier training remains accelerator-intensive. The opportunity is large, but power, supply and customer concentration remain the constraints to watch.', citedStories: ['infrastructure'], citedSources: ['iea-data-centres'], citedTimeline: ['azure-inference-expansion'], citedEntities: ['microsoft'], asOf: '2026-09-11' },
  { slug: 'biggest-open-source-model-developments', question: 'What are the biggest open-source model developments?', answer: 'The centre of gravity is moving toward compact models that can run close to sensitive data. Their advantage is not that they beat every frontier benchmark; it is that teams can adapt, audit and operate them at predictable cost.', citedStories: ['small-models', 'indias-public-ai-stack'], citedSources: ['mistral-model-card'], citedTimeline: ['sarvam-public-model'], citedEntities: ['sarvam-ai', 'gpt-5'], asOf: '2026-09-11' },
  { slug: 'what-changed-india-ai-policy', question: 'What changed in India’s AI policy?', answer: 'IndiaAI moved from a mission statement toward allocation: public compute access, common language datasets and procurement pathways are becoming tangible. The next question is whether access reaches researchers and smaller companies beyond the largest cloud partners.', citedStories: ['indias-public-ai-stack'], citedSources: ['indiaai-mission'], citedTimeline: ['indiaai-compute-tender'], citedEntities: ['indiaai-mission', 'sarvam-ai'], asOf: '2026-09-11' },
  { slug: 'compare-anthropic-openai', question: 'Compare Anthropic vs OpenAI.', answer: 'OpenAI is pushing a broad product and agent ecosystem, while Anthropic has made controllability and long-context work central to Claude. Both increasingly compete on dependable tool use, distribution and enterprise trust rather than model chat quality alone.', citedStories: ['small-models', 'founders'], citedSources: ['stanford-ai-index-2026'], citedTimeline: ['gpt-5-release', 'claude-4-release'], citedEntities: ['openai', 'anthropic', 'gpt-5', 'claude-4'], asOf: '2026-09-11' },
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

export const findStory = (slug: string): Story | undefined => stories.find((story) => story.slug === canonicalStorySlug(slug));
export const findEntity = (slug: string): Entity | undefined => entities.find((entity) => entity.slug === slug);
export const findTimeline = (slug: string): TimelineEvent | undefined => timelineEvents.find((event) => event.slug === slug);
export const filterSignals = (topic?: string): Signal[] =>
  topic ? signals.filter((signal) => signal.topic.toLowerCase() === topic.toLowerCase() || signal.slug === topic) : signals;
