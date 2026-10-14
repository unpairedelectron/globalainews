import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { createServer, request as httpRequest, type Server } from 'node:http';
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import test from 'node:test';
import {
  authors,
  entities,
  essays,
  evidenceSummaries,
  getPublishedStories,
  indiaIndex,
  industryMap,
  isPublicEditorialRelease,
  MINIMUM_STORY_WORDS,
  signals,
  sources,
  timelineEvents,
  askGlobalAnswers,
  type Author,
  type BodySection,
  type EditorialContentType,
  type Source,
  type Story,
} from '../src/content';
import {
  buildAuthorityGraph,
  dataProductRecords,
  researchRecords,
  topicRecords,
  type TopicRecord,
} from '../src/authority/registry';
import {
  getArticleDescription,
  getCanonicalUrl,
  getSeoMetadataManifest,
  type SeoMetadata,
} from '../src/seo-metadata';

const root = path.resolve(import.meta.dirname, '..', '..', '..');
const portfolioRoot = path.join(root, 'research', '70-article-launch');
const viteConfigPath = path.join(root, 'artifacts/global-ai-news/vite.config.ts');
const publicPath = path.join(root, 'artifacts/global-ai-news/dist/public');
const chromium = process.env.CHROMIUM_BIN || '/repl/tools/bin/chromium';
const UNKNOWN = 'UNKNOWN / NOT AVAILABLE';
const FIXTURE_NOW = new Date('2026-10-05T00:00:00.000Z');
const FIXTURE_DATE = FIXTURE_NOW.toISOString().slice(0, 10);
const persistWorkspaceDraftStage = process.env.DISPOSABLE_70_ARTICLE_PERSIST_STAGE === '1';
const HOUSE_AUTHOR = {
  slug: 'global-ai-news-editorial-desk',
  name: 'Global AI News Editorial Desk',
  authorType: 'organization' as const,
};
const stagingManifestFile = path.join(portfolioRoot, 'staged-articles.json');

const families: Array<{
  file: string;
  sourceMap: string;
  contentType: EditorialContentType;
  category: Story['category'];
  classification: Story['classification'];
}> = [
  { file: 'briefs-01-05.md', sourceMap: 'brief-source-map.md', contentType: 'Brief', category: 'Signals', classification: 'reported' },
  { file: 'briefs-06-10.md', sourceMap: 'brief-source-map.md', contentType: 'Brief', category: 'Signals', classification: 'reported' },
  { file: 'analysis-01-10.md', sourceMap: 'analysis-source-map.md', contentType: 'Analysis', category: 'The Edge', classification: 'analysis' },
  { file: 'explainers-01-10.md', sourceMap: 'explainer-source-map.md', contentType: 'Explainer', category: 'Field Notes', classification: 'synthesis' },
  { file: 'research-01-10.md', sourceMap: 'research-source-map.md', contentType: 'Research', category: 'Field Notes', classification: 'synthesis' },
  { file: 'reports-01-10.md', sourceMap: 'report-source-map.md', contentType: 'Report', category: 'Field Notes', classification: 'synthesis' },
  { file: 'comparisons-01-10.md', sourceMap: 'comparison-source-map.md', contentType: 'Comparison', category: 'The Edge', classification: 'analysis' },
  { file: 'essays-01-10.md', sourceMap: 'essay-source-map.md', contentType: 'Essay', category: 'The Edge', classification: 'opinion' },
];

interface CrosswalkRow {
  key: string;
  capturePath: string;
  role: string;
  family: string;
}

interface NormalizedCapture {
  capturePath: string;
  exactUrl: string;
  title: string;
  titleEvidence: string;
  titleEvidenceSource: string;
  publisher: string;
  publicationDate: string;
  publicationDateEvidence: { label: string; value: string }[];
  fetchedDate: string;
  fetchedDateEvidence: string;
  sourceType: string;
  primarySecondary: string;
  evidenceClass: string;
  relevanceContext: string[];
  crosswalkRoles: string[];
  citationKeys: string[];
}

interface PortfolioDraft {
  number: number;
  file: string;
  contentType: EditorialContentType;
  familySourceMap: string;
  category: Story['category'];
  classification: Story['classification'];
  title: string;
  slug: string;
  topic: string;
  dek: string;
  byline: string;
  actualPublicationDate: null;
  evidenceNote: string;
  relatedCoverage: string;
  relatedSlugs: string[];
  citationKeys: string[];
  citationCount: number;
  wordCount: number;
  bodyRaw: string;
  bodySections: BodySection[];
  plainBody: string;
  firstBodySnippet: string;
  conclusion: string;
  tableCount: number;
  fileAuthorStatus: string;
  typeFit: { status: string; cues: string[] };
  mentionedEntities: string[];
  sourceRows: NormalizedCapture[];
  rawBlock: string;
  eligible: boolean;
  story: Story;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getField(text: string, label: string): string {
  const match = text.match(
    new RegExp(`^\\s*\\*\\*${escapeRegExp(label)}:\\*\\*\\s*(.*?)\\s*$`, 'im'),
  );
  return match?.[1]?.trim() ?? '';
}

function allFields(text: string, label: string): string[] {
  const pattern = new RegExp(
    `^\\s*\\*\\*${escapeRegExp(label)}:\\*\\*\\s*(.*?)\\s*$`,
    'gim',
  );
  return Array.from(text.matchAll(pattern), (match) => match[1].trim());
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[@([a-z0-9-]+)\]/gi, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/^\s*>+\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_`~]/g, '')
    .replace(/[()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleMarkdownText(text: string): string {
  return text
    .replace(/\[@([a-z0-9-]+)\]/gi, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleHtmlText(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([\da-f]+);|&#(\d+);/gi, (_match, hex, decimal) =>
      String.fromCodePoint(Number.parseInt(hex ?? decimal, hex ? 16 : 10)),
    )
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function parseTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function parseMarkdownSections(body: string): { sections: BodySection[]; tableCount: number } {
  const sections: Array<BodySection & { tableCount: number }> = [];
  let current: BodySection & { tableCount: number } = {
    heading: 'Article',
    paragraphs: [],
    tableCount: 0,
  };
  let paragraph: string[] = [];
  let tableLines: string[] = [];
  let sawHeading = false;

  const ensureSection = () => {
    if (!sections.length && !current.heading) current.heading = 'Article';
  };
  const flushParagraph = () => {
    const value = paragraph.join(' ').trim();
    if (value) current.paragraphs.push(value);
    paragraph = [];
  };
  const flushTable = () => {
    if (tableLines.length < 2) {
      paragraph.push(...tableLines);
      tableLines = [];
      return;
    }
    flushParagraph();
    const rows = tableLines
      .filter((line) => !/^\s*\|?\s*:?-{2,}/.test(line))
      .map(parseTableRow);
    if (rows.length >= 2) {
      const [headers, ...dataRows] = rows;
      const table = {
        headers,
        rows: dataRows.map((cells) => ({ cells })),
      };
      if (!current.table) current.table = table;
      else {
        current.tableCount += 1;
        sections.push(current);
        current = {
          heading: `${current.heading} — additional table`,
          paragraphs: [],
          table,
          tableCount: 0,
        };
      }
    }
    tableLines = [];
  };
  const flushSection = () => {
    flushParagraph();
    flushTable();
    if (current.heading !== 'Article' || current.paragraphs.length || current.table) {
      sections.push(current);
    }
    current = { heading: '', paragraphs: [], tableCount: 0 };
  };

  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^###\s+(.+?)\s*$/);
    if (heading) {
      if (current.heading || current.paragraphs.length || current.table || paragraph.length || tableLines.length) {
        flushSection();
      }
      current.heading = heading[1].trim();
      sawHeading = true;
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushParagraph();
      tableLines.push(line.trim());
      continue;
    }
    if (tableLines.length) flushTable();
    if (!line.trim()) {
      flushParagraph();
      continue;
    }
    paragraph.push(line.trim().replace(/^\s*(?:[-*+]|\d+[.)])\s+/, ''));
  }
  flushSection();
  if (!sections.length) {
    const plain = stripMarkdown(body);
    sections.push({ heading: 'Article', paragraphs: plain ? [plain] : [], tableCount: 0 });
  }
  if (!sawHeading && sections.length === 1 && sections[0].heading === '') {
    sections[0].heading = 'Article';
  }
  const tableCount = sections.reduce((total, section) => total + (section.table ? 1 : 0) + section.tableCount, 0);
  return { sections: sections.map(({ tableCount: _tableCount, ...section }) => section), tableCount };
}

function parseCrosswalks(): { rows: CrosswalkRow[]; byFamilyAndKey: Map<string, CrosswalkRow>; byPath: Map<string, CrosswalkRow[]> } {
  const rows: CrosswalkRow[] = [];
  for (const family of families) {
    if (rows.some((row) => row.family === family.sourceMap)) continue;
    const mapPath = path.join(portfolioRoot, family.sourceMap);
    const content = readFileSync(mapPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\|\s*`([^`]+)`\s*\|\s*`([^`]+\.md)`\s*\|\s*(.*?)\s*\|\s*$/);
      if (!match) continue;
      rows.push({
        key: match[1].trim(),
        capturePath: match[2].trim(),
        role: match[3].trim(),
        family: family.sourceMap,
      });
    }
  }
  const byFamilyAndKey = new Map<string, CrosswalkRow>();
  for (const row of rows) {
    const key = `${row.family}:${row.key}`;
    const prior = byFamilyAndKey.get(key);
    if (prior && prior.capturePath !== row.capturePath) {
      throw new Error(`Conflicting source mapping for ${key}: ${prior.capturePath} and ${row.capturePath}`);
    }
    byFamilyAndKey.set(key, row);
  }
  const byPath = new Map<string, CrosswalkRow[]>();
  for (const row of rows) byPath.set(row.capturePath, [...(byPath.get(row.capturePath) ?? []), row]);
  return { rows, byFamilyAndKey, byPath };
}

function fieldValue(text: string, label: string): string {
  const line = text.split(/\r?\n/).find((candidate) =>
    new RegExp(`^\\s*(?:\\*\\*)?${escapeRegExp(label)}(?:\\*\\*)?\\s*:`, 'i').test(candidate),
  );
  if (!line) return '';
  return line.replace(
    new RegExp(`^\\s*(?:\\*\\*)?${escapeRegExp(label)}(?:\\*\\*)?\\s*:\\s*`, 'i'),
    '',
  ).trim();
}

function normalizeCaptureTitle(text: string): { value: string; evidence: string; source: string } {
  const title = fieldValue(text, 'Title');
  if (title) return { value: title, evidence: title, source: 'Title field' };

  const pageTitle = fieldValue(text, 'Page title');
  if (pageTitle) return { value: pageTitle, evidence: pageTitle, source: 'Page title field' };

  const lines = text.split(/\r?\n/);
  const heading = lines
    .slice(0, 60)
    .map((line) => line.match(/^\s{0,3}#{1,2}\s+(.+?)\s*$/)?.[1]?.trim())
    .find((candidate) => candidate && !/^(abstract|introduction|overview|summary)$/i.test(candidate));
  if (heading) return { value: heading, evidence: heading, source: 'Captured document heading' };

  const reportCoverTitle = text.match(
    /(Scaling India’s Data\s*\r?\nCentre Ecosystem\s*\r?\nStakeholder Perspectives on Infrastructure,\s*\r?\nEnergy, and Resilience)/i,
  )?.[1];
  if (reportCoverTitle) {
    return {
      value: reportCoverTitle.replace(/\s+/g, ' ').trim(),
      evidence: reportCoverTitle,
      source: 'Captured multi-line report-cover title',
    };
  }

  const emptyTitleIndex = lines.findIndex((line) => /^\s*Title\s*:\s*$/.test(line));
  if (emptyTitleIndex >= 0) {
    const capturedPageTitle = lines[emptyTitleIndex + 1] ?? '';
    if (
      /^\s{1,}\S/.test(capturedPageTitle) &&
      !/^\s*(?:Fetched|Publisher|Publication date|Source type|Evidence class)\s*:/i.test(capturedPageTitle)
    ) {
      return {
        value: capturedPageTitle.trim(),
        evidence: capturedPageTitle.trim(),
        source: 'Captured page-title line following an empty Title field',
      };
    }
  }

  return { value: UNKNOWN, evidence: UNKNOWN, source: UNKNOWN };
}

function isConcreteDate(value: string): string {
  const match = value.match(/^(\d{4}-\d{2}-\d{2})(?=$|[Tt\s(])/);
  if (!match) return UNKNOWN;
  const parsed = new Date(`${match[1]}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === match[1]
    ? match[1]
    : UNKNOWN;
}

function normalizeExplicitPublicationDate(
  evidence: { label: string; value: string }[],
): string {
  const months = new Map([
    ['jan', 1], ['january', 1], ['feb', 2], ['february', 2],
    ['mar', 3], ['march', 3], ['apr', 4], ['april', 4],
    ['may', 5], ['jun', 6], ['june', 6], ['jul', 7], ['july', 7],
    ['aug', 8], ['august', 8], ['sep', 9], ['sept', 9], ['september', 9],
    ['oct', 10], ['october', 10], ['nov', 11], ['november', 11],
    ['dec', 12], ['december', 12],
  ]);
  const validate = (year: string, month: number, day: number): string => {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const parsed = new Date(`${iso}T00:00:00.000Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === iso
      ? iso
      : UNKNOWN;
  };

  for (const item of evidence) {
    const value = item.value.trim();
    if (/^(?:not stated|not separately stated|not visible|unknown|ambiguous)\b/i.test(value)) continue;
    const iso = isConcreteDate(value);
    if (iso !== UNKNOWN) return iso;

    const dayFirst = value.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})(?=$|[\s,(])/);
    const monthFirst = value.match(/^([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})(?=$|[\s,(])/);
    if (dayFirst) {
      const month = months.get(dayFirst[2].toLowerCase());
      if (month) {
        const date = validate(dayFirst[3], month, Number(dayFirst[1]));
        if (date !== UNKNOWN) return date;
      }
    }
    if (monthFirst) {
      const month = months.get(monthFirst[1].toLowerCase());
      if (month) {
        const date = validate(monthFirst[3], month, Number(monthFirst[2]));
        if (date !== UNKNOWN) return date;
      }
    }
  }
  return UNKNOWN;
}

function normalizeSourceCaptures(
  crosswalk: ReturnType<typeof parseCrosswalks>,
): NormalizedCapture[] {
  return [...crosswalk.byPath.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([capturePath, rows]) => {
    const text = readFileSync(path.join(root, capturePath), 'utf8');
    const sourceUrl = fieldValue(text, 'Source');
    const normalizedTitle = normalizeCaptureTitle(text);
    const publisher = fieldValue(text, 'Publisher');
    const publicationDateEvidence = ['Publication date', 'Published']
      .map((label) => ({ label, value: fieldValue(text, label) }))
      .filter((item) => item.value);
    const fetchedDateEvidence = fieldValue(text, 'Fetched');
    const sourceType = fieldValue(text, 'Source type');
    const evidenceClass = fieldValue(text, 'Evidence class');
    const claimRelevance = fieldValue(text, 'Claim relevance');
    const roles = [...new Set(rows.map((row) => row.role).filter(Boolean))].sort();
    const classificationText = `${evidenceClass} ${roles.join(' ')}`.toLowerCase();
    const primarySecondary = /\bprimary\b|first.party/i.test(classificationText)
      ? 'PRIMARY'
      : /\bsecondary\b|independent confirmation|independent reporting/i.test(classificationText)
        ? 'SECONDARY'
        : UNKNOWN;

    return {
      capturePath,
      exactUrl: sourceUrl || UNKNOWN,
      title: normalizedTitle.value,
      titleEvidence: normalizedTitle.evidence,
      titleEvidenceSource: normalizedTitle.source,
      publisher: publisher || UNKNOWN,
      publicationDate: normalizeExplicitPublicationDate(publicationDateEvidence),
      publicationDateEvidence,
      fetchedDate: isConcreteDate(fetchedDateEvidence),
      fetchedDateEvidence: fetchedDateEvidence || UNKNOWN,
      sourceType: sourceType || UNKNOWN,
      primarySecondary,
      evidenceClass: evidenceClass || UNKNOWN,
      relevanceContext: claimRelevance ? [claimRelevance] : [],
      crosswalkRoles: roles,
      citationKeys: [...new Set(rows.map((row) => row.key))].sort(),
    };
  });
}

function relatedReferences(value: string, draftsByNumber: Map<number, PortfolioDraft>): {
  slugs: string[];
  unresolved: string[];
} {
  const output = new Set<string>();
  const unresolved: string[] = [];
  const familyPattern =
    /\b(briefs?|analysis|analyses|explainers?|research|reports?|comparisons?|essays?)\s+((?:\d+\s*(?:[-–—]\s*\d+)?)(?:\s*(?:,|and)\s*\d+\s*(?:[-–—]\s*\d+)?)*)/gi;
  const familyName = (value: string) => {
    const word = value.toLowerCase().replace(/s$/, '');
    return word === 'analysi' || value.toLowerCase() === 'analyses' ? 'analysis' : word;
  };
  for (const match of value.matchAll(familyPattern)) {
    const sourceFamily = familyName(match[1]);
    for (const numberPart of match[2].matchAll(/(\d+)(?:\s*[-–—]\s*(\d+))?/g)) {
      const start = Number(numberPart[1]);
      const end = Number(numberPart[2] ?? numberPart[1]);
      for (let number = start; number <= end; number += 1) {
        const target = draftsByNumber.get(number);
        if (!target || target.contentType.toLowerCase() !== sourceFamily) {
          unresolved.push(`${match[1]} ${number}`);
        } else {
          output.add(target.slug);
        }
      }
    }
  }
  return { slugs: [...output], unresolved };
}

function typeFitStatus(
  contentType: EditorialContentType,
  title: string,
  dek: string,
  body: string,
  sourceCount: number,
  sectionCount: number,
  evidenceNote: string,
): { status: string; cues: string[] } {
  const text = `${title} ${dek} ${body}`.toLowerCase();
  const cues: string[] = [];
  const hasEvidenceNote = Boolean(evidenceNote.trim());
  if (hasEvidenceNote) cues.push('evidence note present');
  if (sourceCount > 0) cues.push(`${sourceCount} mapped source keys`);
  if (sectionCount >= 2) cues.push(`${sectionCount} body sections`);

  const fit = (() => {
    switch (contentType) {
      case 'Brief':
        return sourceCount > 0 && /\b(202[4-9]|reported|announc|releas|launch|says|published|update)\b/i.test(text);
      case 'Analysis':
        return hasEvidenceNote && /\b(implication|means|matters|because|trade-?off|constraint|risk|suggests|shows)\b/i.test(text);
      case 'Explainer':
        return sectionCount >= 2 && /\b(what (?:is|are|does)|how to|means|defined|definition|explains?)\b/i.test(`${title} ${dek} ${body}`);
      case 'Research':
        return sourceCount >= 2 && sectionCount >= 2 && /\b(method|sample|records|audit|findings|limitation|dataset|scope|question)\b/i.test(text);
      case 'Report':
        return sourceCount >= 3 && sectionCount >= 3 && hasEvidenceNote;
      case 'Comparison':
        return sourceCount >= 2 && /\b(compare|comparison|versus|vs\.?|criteria|criterion|like-for-like|compared)\b/i.test(text);
      case 'Essay':
        return sectionCount >= 2 && sourceCount > 0 && dek.length >= 60;
    }
  })();
  return {
    status: fit ? 'PASS_STATIC_SIGNALS' : 'REVIEW_CONTENT_TYPE_FIT',
    cues,
  };
}

function extractFieldAfterLabel(block: string, label: string): string {
  return getField(block, label);
}

function parseDrafts(
  crosswalk: ReturnType<typeof parseCrosswalks>,
  captures: NormalizedCapture[],
): PortfolioDraft[] {
  const captureByPath = new Map(captures.map((capture) => [capture.capturePath, capture]));
  const drafts: PortfolioDraft[] = [];
  const pending = families.flatMap((family) => {
    const content = readFileSync(path.join(portfolioRoot, family.file), 'utf8');
    const matches = [...content.matchAll(/^##\s+(\d+)\.\s+(.+?)\s*$/gm)];
    const fileAuthorStatus = getField(content.slice(0, matches[0]?.index ?? content.length), 'Byline') || UNKNOWN;
    return matches.map((heading, index) => {
      const start = heading.index ?? 0;
      const end = matches[index + 1]?.index ?? content.length;
      const block = content.slice(start, end);
      const bodyStart = block.search(/^###\s+/m);
      const evidenceStart = block.search(/^\*\*Evidence note:\*\*/m);
      const bodyEnd = evidenceStart >= 0 ? evidenceStart : block.length;
      const bodyRaw = bodyStart >= 0
        ? block.slice(bodyStart, bodyEnd).trim()
        : '';
      const number = Number(heading[1]);
      const title = heading[2].trim();
      const slug = getField(block, 'Slug').replace(/^`|`$/g, '').trim();
      const topic = getField(block, 'Topic');
      const dek = getField(block, 'Proposed dek');
      const evidenceNote = getField(block, 'Evidence note');
      const relatedCoverage = getField(block, 'Related coverage');
      const citationMatches = [...bodyRaw.matchAll(/\[@([a-z0-9-]+)\]/gi)];
      const citationKeys = [...new Set(citationMatches.map((match) => match[1]))];
      const sourceRows = citationKeys.map((key) => {
        const row = crosswalk.byFamilyAndKey.get(`${family.sourceMap}:${key}`);
        if (!row) return undefined;
        return captureByPath.get(row.capturePath);
      }).filter((capture): capture is NormalizedCapture => Boolean(capture));
      const bodyPlain = stripMarkdown(bodyRaw);
      const parsed = parseMarkdownSections(bodyRaw);
      const wordCountValue = wordCount(`${dek} ${bodyPlain}`);
      const bottomLine = extractFieldAfterLabel(block, 'Bottom line');
      const whyItMatters = extractFieldAfterLabel(block, 'Why it matters');
      const whatChanges = extractFieldAfterLabel(block, 'What changes');
      const takeaways = allFields(block, 'Key takeaway')
        .flatMap((value) => value.split(/\s*(?:;|•)\s*/))
        .map((value) => value.trim())
        .filter(Boolean);
      const summaryText = [title, dek].join(' ').toLowerCase();
      const mentionedEntities = entities
        .filter((entity) => entity.name && summaryText.includes(entity.name.toLowerCase()))
        .map((entity) => entity.slug);
      const firstParagraph = parsed.sections.flatMap((section) => section.paragraphs)[0] ?? '';
      const plainSnippet = visibleMarkdownText(firstParagraph).slice(0, 100);
      const lastSection = parsed.sections.at(-1);
      const conclusion = lastSection
        ? stripMarkdown([lastSection.heading, ...lastSection.paragraphs].join(' '))
        : '';

      return {
        number,
        file: family.file,
        familySourceMap: family.sourceMap,
        contentType: family.contentType,
        category: family.category,
        classification: family.classification,
        title,
        slug,
        topic,
        dek,
        byline: HOUSE_AUTHOR.name,
        actualPublicationDate: null,
        evidenceNote,
        relatedCoverage,
        relatedSlugs: [],
        citationKeys,
        citationCount: citationMatches.length,
        wordCount: wordCountValue,
        bodyRaw,
        bodySections: parsed.sections,
        plainBody: bodyPlain,
        firstBodySnippet: plainSnippet,
        conclusion,
        tableCount: parsed.tableCount,
        fileAuthorStatus,
        typeFit: typeFitStatus(family.contentType, title, dek, bodyRaw, citationKeys.length, parsed.sections.length, evidenceNote),
        mentionedEntities,
        sourceRows,
        rawBlock: block,
        eligible: false,
        story: undefined as unknown as Story,
      } satisfies PortfolioDraft;
    });
  });

  const draftsByNumber = new Map(pending.map((draft) => [draft.number, draft]));
  for (const draft of pending) {
    const related = relatedReferences(draft.relatedCoverage, draftsByNumber);
    draft.relatedSlugs = related.slugs;
    const sourcesForDraft = draft.citationKeys.map((key) => {
      const row = crosswalk.byFamilyAndKey.get(`${draft.familySourceMap}:${key}`);
      return row ? captureByPath.get(row.capturePath) : undefined;
    }).filter((capture): capture is NormalizedCapture => Boolean(capture));
    const primaryCount = sourcesForDraft.filter((source) => source.primarySecondary === 'PRIMARY').length;
    const independentCount = sourcesForDraft.filter((source) => source.primarySecondary === 'SECONDARY').length;
    const sourceObjects: Source[] = sourcesForDraft.map((source, index) => ({
      slug: draft.citationKeys[index] ?? source.citationKeys[0] ?? `unmapped-source-${index}`,
      name: source.title,
      publisher: source.publisher,
      kind: source.primarySecondary === 'PRIMARY' ? 'primary' : 'independent',
      url: source.exactUrl,
      accessed: source.fetchedDate,
      ...(source.publicationDate !== UNKNOWN ? { publicationDate: source.publicationDate } : {}),
      evidenceType: 'full-page',
      scopeNote: source.relevanceContext.join(' | ') || UNKNOWN,
      relevance: source.relevanceContext.join(' | ') || UNKNOWN,
      notes: [`Fixture-only source record; classification=${source.primarySecondary}.`],
    }));
    const sourceBySlug = new Map<string, Source>();
    sourceObjects.forEach((source) => sourceBySlug.set(source.slug, source));
    const bodySections = draft.bodySections.length
      ? draft.bodySections
      : [{ heading: draft.title, paragraphs: draft.plainBody ? [draft.plainBody] : [] }];
    const date = FIXTURE_DATE;
    const story: Story = {
      slug: draft.slug,
      category: draft.category,
      title: draft.title,
      dek: draft.dek,
      body: bodySections,
      date,
      readTime: `${Math.max(1, Math.ceil(draft.wordCount / 220))} min read`,
      author: HOUSE_AUTHOR.slug,
      authorType: HOUSE_AUTHOR.authorType,
      authorName: HOUSE_AUTHOR.name,
      evidence: draft.evidenceNote || UNKNOWN,
      evidenceSummary: {
        primarySources: primaryCount,
        independentConfirmations: independentCount,
        confidence: 'DEVELOPING',
        note: 'Fixture-only counts from explicit crosswalk evidence labels; not an editorial confidence assessment.',
      },
      classification: draft.classification,
      contentType: draft.contentType,
      entities: [],
      timeline: [],
      relatedStories: draft.relatedSlugs,
      imageTreatment: {
        type: 'editorial-abstract',
        alt: `${draft.title} — temporary test fixture`,
        palette: 'fixture-only neutral palette',
        caption: 'Temporary in-memory validation art; not approved for publication.',
      },
      topic: draft.topic,
      sources: draft.citationKeys,
      bottomLine: getField(draft.rawBlock, 'Bottom line'),
      whyItMatters: getField(draft.rawBlock, 'Why it matters'),
      keyTakeaways: getField(draft.rawBlock, 'Key takeaways')
        .split(/\s*(?:;|•)\s*/)
        .map((value) => value.trim())
        .filter(Boolean),
      whatChanges: getField(draft.rawBlock, 'What changes'),
    };
    draft.story = story;
    draft.eligible = isPublicEditorialRelease(
      'scheduled',
      FIXTURE_NOW,
      draft.wordCount,
      FIXTURE_NOW,
    );
    // `sourceBySlug` is intentionally checked here so duplicate-key collisions cannot silently
    // replace one captured record with another in the test-only snapshot.
    assert.equal(sourceBySlug.size, sourceObjects.length, `duplicate citation keys in ${draft.slug}`);
  }
  return pending;
}

function readMetadataValue(html: string, attribute: 'name' | 'property', value: string): string | undefined {
  const tag = html.match(/<meta\b[^>]*>/gi)?.find((candidate) => {
    const attr = candidate.match(new RegExp(`${attribute}=["']([^"']+)["']`, 'i'))?.[1];
    return attr === value;
  });
  return tag?.match(/content=["']([^"']*)["']/i)?.[1];
}

function getJsonLd(html: string): unknown {
  const raw = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function flattenObjects(value: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(value)) return value.flatMap(flattenObjects);
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  return [record, ...Object.values(record).flatMap(flattenObjects)];
}

function hashTree(directory: string): string {
  const hash = createHash('sha256');
  const walk = (current: string) => {
    for (const name of readdirSync(current).sort()) {
      const file = path.join(current, name);
      const stat = statSync(file);
      const relative = path.relative(directory, file);
      if (stat.isDirectory()) walk(file);
      else {
        hash.update(relative);
        hash.update(readFileSync(file));
      }
    }
  };
  walk(directory);
  return hash.digest('hex');
}

function listen(server: Server): Promise<number> {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') return reject(new Error('No local port assigned.'));
      resolve(address.port);
    });
  });
}

function close(server?: Server): Promise<void> {
  if (!server?.listening) return Promise.resolve();
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function stopProcess(child?: ChildProcess): Promise<void> {
  if (!child?.pid) return;
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    child.kill('SIGTERM');
  }
  await Promise.race([
    once(child, 'exit').then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, 4000)),
  ]);
}

async function waitFor(url: string, child?: ChildProcess): Promise<void> {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child?.exitCode !== null && child?.exitCode !== undefined) {
      throw new Error(`In-memory web server exited before ready: ${child.exitCode}`);
    }
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Continue while the isolated server starts.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for the isolated web server at ${url}`);
}

function sourceRecordFromCapture(key: string, capture: NormalizedCapture): Source {
  return {
    slug: key,
    name: capture.title,
    publisher: capture.publisher,
    kind: capture.primarySecondary === 'PRIMARY' ? 'primary' : 'independent',
    url: capture.exactUrl,
    accessed: capture.fetchedDate,
    ...(capture.publicationDate !== UNKNOWN ? { publicationDate: capture.publicationDate } : {}),
    evidenceType: 'full-page',
    scopeNote: capture.relevanceContext.join(' | ') || UNKNOWN,
    relevance: capture.relevanceContext.join(' | ') || UNKNOWN,
    notes: [`Disposable test fixture; source classification=${capture.primarySecondary}.`],
  };
}

function makeSnapshot(publicStories: Story[], fixtureSources: Source[]) {
  const publishedStorySlugs = new Set(publicStories.map((story) => story.slug));
  const publicResearchRecords = researchRecords.filter(
    (record) => record.status === 'published' && publishedStorySlugs.has(record.storySlug),
  );
  const publicDataProducts = dataProductRecords.filter(
    (record) => record.status === 'published' && record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
  );
  const publicTopics = topicRecords.filter(
    (record) => record.indexable && record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
  );
  const citedSources = new Set([
    ...publicStories.flatMap((story) => story.sources),
    ...publicResearchRecords.flatMap((record) => record.sourceSlugs),
    ...publicDataProducts.flatMap((record) => record.sourceSlugs),
    ...publicTopics.flatMap((record) => record.sourceSlugs),
  ]);
  return {
    source: 'disposable-in-memory-test-fixture',
    generatedAt: FIXTURE_NOW.toISOString(),
    stale: false,
    authors: [...authors] as Author[],
    sources: fixtureSources.filter((source) => citedSources.has(source.slug)),
    evidenceSummaries,
    entities,
    timelineEvents,
    stories: publicStories.map(({ updatedAt: _updatedAt, ...story }) => story),
    researchRecords: publicResearchRecords,
    dataProducts: publicDataProducts,
    topics: publicTopics,
    authorityEdges: buildAuthorityGraph(publicStories),
    signals,
    industryMap,
    indiaIndex,
    essays,
    askGlobalAnswers,
  };
}

function createInMemoryApi(getStories: () => Story[], getSources: () => Source[]): Server {
  return createServer((request, response) => {
    const route = request.url ?? '/';
    const publicStories = getStories();
    const snapshot = makeSnapshot(publicStories, getSources());
    const metadata = getSeoMetadataManifest(publicStories, snapshot.generatedAt, snapshot.sources);
    if (route === '/api/healthz') {
      response.writeHead(200, { 'content-type': 'application/json' }).end('{"ok":true}');
    } else if (route === '/api/newsroom/content') {
      response.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
        .end(JSON.stringify(snapshot));
    } else if (route === '/api/newsroom/metadata') {
      response.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
        .end(JSON.stringify(metadata));
    } else if (route === '/api/newsroom/feed.xml') {
      const entries = publicStories.map((story) =>
        `<item><title>${xmlEscape(story.title)}</title><link>${getCanonicalUrl(`/article/${story.slug}`)}</link><guid>${getCanonicalUrl(`/article/${story.slug}`)}</guid><description>${xmlEscape(story.dek)}</description><pubDate>${new Date(`${story.date}T00:00:00Z`).toUTCString()}</pubDate></item>`,
      ).join('');
      response.writeHead(200, { 'content-type': 'application/rss+xml; charset=utf-8' })
        .end(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Global AI News</title>${entries}</channel></rss>`);
    } else if (route === '/api/newsroom/sitemap.xml') {
      const urls = metadata.routes
        .filter((entry: SeoMetadata) => entry.indexable !== false)
        .map((entry: SeoMetadata) => `<url><loc>${getCanonicalUrl(entry.path)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}</url>`)
        .join('');
      response.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' })
        .end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
    } else {
      response.writeHead(404).end('not found');
    }
  });
}

interface CdpBrowser {
  cdp: (method: string, params?: Record<string, unknown>) => Promise<any>;
  close: () => Promise<void>;
  capturesDirectory: string;
  navigate: (url: string) => Promise<void>;
  evaluate: (expression: string) => Promise<any>;
  capture: (name: string) => Promise<void>;
}

async function launchMobileBrowser(): Promise<CdpBrowser> {
  assert.ok(existsSync(chromium), `Chromium is required for 70-page mobile checks: ${chromium}`);
  const profile = mkdtempSync(path.join(tmpdir(), 'gan-70-mobile-profile-'));
  const capturesDirectory = mkdtempSync(path.join(tmpdir(), 'gan-70-mobile-captures-'));
  const child = spawn(chromium, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--remote-debugging-address=127.0.0.1',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { detached: true, stdio: 'ignore' });

  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    const deadline = Date.now() + 30_000;
    let port = 0;
    while (Date.now() < deadline) {
      if (existsSync(portFile)) {
        port = Number(readFileSync(portFile, 'utf8').split(/\r?\n/)[0]);
        if (port) break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!port) throw new Error('Chromium did not create a DevTools port.');
    const targetDeadline = Date.now() + 15_000;
    let target: any;
    while (Date.now() < targetDeadline) {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`).catch(() => undefined);
      if (response?.ok) {
        const targets = await response.json() as any[];
        target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
        if (target) break;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!target) throw new Error('Chromium did not expose a page target.');

    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>((resolve, reject) => {
      socket.addEventListener('open', () => resolve(), { once: true });
      socket.addEventListener('error', () => reject(new Error('Could not connect to the local Chromium page.')), { once: true });
    });
    let commandId = 0;
    let loadResolve: (() => void) | undefined;
    const pending = new Map<number, {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
      timeout: ReturnType<typeof setTimeout>;
    }>();
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const waiter = pending.get(message.id);
        if (!waiter) return;
        pending.delete(message.id);
        clearTimeout(waiter.timeout);
        if (message.error) waiter.reject(new Error(message.error.message));
        else waiter.resolve(message.result);
      } else if (message.method === 'Page.loadEventFired') {
        loadResolve?.();
        loadResolve = undefined;
      }
    });
    const cdp = (method: string, params: Record<string, unknown> = {}) =>
      new Promise<any>((resolve, reject) => {
        const id = ++commandId;
        const timeout = setTimeout(() => {
          if (!pending.has(id)) return;
          pending.delete(id);
          reject(new Error(`Timed out waiting for Chromium command ${method}`));
        }, 20_000);
        pending.set(id, { resolve, reject, timeout });
        socket.send(JSON.stringify({ id, method, params }));
      });

    await cdp('Page.enable');
    await cdp('Runtime.enable');
    await cdp('Network.enable');
    await cdp('Emulation.setDeviceMetricsOverride', {
      width: 402,
      height: 874,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp('Page.addScriptToEvaluateOnNewDocument', {
      source: `(() => {
        window.__ganPortfolioAudit = { cls: 0, lcp: null };
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              window.__ganPortfolioAudit.lcp = entry.startTime;
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) window.__ganPortfolioAudit.cls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
        } catch {}
      })();`,
    });

    const closeBrowser = async () => {
      try { socket.close(); } catch {}
      try { process.kill(-child.pid!, 'SIGTERM'); } catch { child.kill('SIGTERM'); }
      await Promise.race([
        once(child, 'exit').then(() => undefined),
        new Promise<void>((resolve) => setTimeout(resolve, 2500)),
      ]);
      rmSync(profile, { recursive: true, force: true });
    };

    const navigate = async (url: string) => {
      const loaded = new Promise<void>((resolve) => { loadResolve = resolve; });
      const result = await cdp('Page.navigate', { url });
      if (result.errorText) throw new Error(result.errorText);
      await loaded;
      await new Promise((resolve) => setTimeout(resolve, 120));
    };
    const evaluate = async (expression: string) => {
      const response = await cdp('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (response.exceptionDetails) {
        throw new Error(response.exceptionDetails.text ?? 'Chromium evaluation failed.');
      }
      return response.result?.value;
    };
    const capture = async (name: string) => {
      const result = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
      writeFileSync(path.join(capturesDirectory, `${name}.jpg`), Buffer.from(result.data, 'base64'));
    };

    return {
      cdp,
      capturesDirectory,
      close: closeBrowser,
      navigate,
      evaluate,
      capture,
    };
  } catch (error) {
    try { process.kill(-child.pid!, 'SIGTERM'); } catch { child.kill('SIGTERM'); }
    rmSync(profile, { recursive: true, force: true });
    throw error;
  }
}

function tokenize(text: string): string[] {
  const stopwords = new Set([
    'about', 'after', 'against', 'among', 'also', 'and', 'are', 'been', 'before', 'being',
    'between', 'but', 'can', 'could', 'does', 'each', 'for', 'from', 'has', 'have', 'into',
    'its', 'more', 'most', 'not', 'only', 'other', 'over', 'same', 'some', 'than', 'that',
    'the', 'their', 'there', 'these', 'they', 'this', 'those', 'through', 'under', 'using',
    'was', 'were', 'what', 'when', 'where', 'which', 'while', 'will', 'with', 'would',
  ]);
  return stripMarkdown(text).toLowerCase().match(/[a-z0-9]{3,}/g)?.filter((word) => !stopwords.has(word)) ?? [];
}

function buildTfidfSimilarity(drafts: PortfolioDraft[], maintained: Story[]) {
  const documents = [
    ...drafts.map((draft) => ({
      type: 'candidate',
      slug: draft.slug,
      title: draft.title,
      text: `${draft.title} ${draft.dek} ${draft.bodyRaw}`,
    })),
    ...maintained.map((story) => ({
      type: 'maintained',
      slug: story.slug,
      title: story.title,
      text: `${story.title} ${story.dek} ${story.body.flatMap((section) => [section.heading, ...section.paragraphs]).join(' ')}`,
    })),
  ];
  const terms = documents.map((document) => {
    const count = new Map<string, number>();
    for (const token of tokenize(document.text)) count.set(token, (count.get(token) ?? 0) + 1);
    return count;
  });
  const documentFrequency = new Map<string, number>();
  for (const counts of terms) for (const term of counts.keys()) {
    documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
  }
  const vectors = terms.map((counts) => {
    const vector = new Map<string, number>();
    for (const [term, count] of counts) {
      const idf = Math.log((documents.length + 1) / ((documentFrequency.get(term) ?? 0) + 1)) + 1;
      vector.set(term, (1 + Math.log(count)) * idf);
    }
    return vector;
  });
  const cosine = (left: Map<string, number>, right: Map<string, number>) => {
    let dot = 0;
    let leftNorm = 0;
    let rightNorm = 0;
    for (const value of left.values()) leftNorm += value * value;
    for (const value of right.values()) rightNorm += value * value;
    for (const [term, value] of left) dot += value * (right.get(term) ?? 0);
    return leftNorm && rightNorm ? dot / Math.sqrt(leftNorm * rightNorm) : 0;
  };
  const alerts: Array<{
    leftSlug: string;
    rightSlug: string;
    rightType: string;
    cosineSimilarity: number;
    titleTokenJaccard: number;
  }> = [];
  for (let left = 0; left < drafts.length; left += 1) {
    const leftTokens = new Set(tokenize(documents[left].title));
    for (let right = 0; right < documents.length; right += 1) {
      if (right === left || (right < drafts.length && right < left)) continue;
      const similarity = cosine(vectors[left], vectors[right]);
      const rightTokens = new Set(tokenize(documents[right].title));
      const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
      const union = new Set([...leftTokens, ...rightTokens]).size;
      const titleTokenJaccard = union ? intersection / union : 0;
      if (similarity >= 0.2 || titleTokenJaccard >= 0.45) {
        alerts.push({
          leftSlug: documents[left].slug,
          rightSlug: documents[right].slug,
          rightType: documents[right].type,
          cosineSimilarity: Number(similarity.toFixed(3)),
          titleTokenJaccard: Number(titleTokenJaccard.toFixed(3)),
        });
      }
    }
  }
  return alerts.sort((a, b) => b.cosineSimilarity - a.cosineSimilarity || b.titleTokenJaccard - a.titleTokenJaccard);
}

test('candidate-specific 70-article validation runs against a disposable in-memory snapshot', { timeout: 300_000 }, async () => {
  assert.equal(process.env.DATABASE_URL, undefined, 'run this fixture with DATABASE_URL removed');
  assert.ok(existsSync(viteConfigPath), 'the source-based fixture requires the Global AI News Vite config');
  assert.ok(existsSync(publicPath), 'the production public directory must already exist');

  const crosswalk = parseCrosswalks();
  const captures = normalizeSourceCaptures(crosswalk);
  const drafts = parseDrafts(crosswalk, captures);
  const draftNumbers = new Set(drafts.map((draft) => draft.number));
  const draftSlugs = new Set(drafts.map((draft) => draft.slug));
  const citationKeys = new Set(drafts.flatMap((draft) => draft.citationKeys));
  const maintainedStories = getPublishedStories();
  const maintainedSlugs = new Set(maintainedStories.map((story) => story.slug));
  const overlayPath = path.join(portfolioRoot, 'candidate-authority-link-overlay.json');
  const linkOverlay = JSON.parse(readFileSync(overlayPath, 'utf8')) as {
    counts: Record<string, number>;
    edges: Array<{
      fromSlug: string;
      fromTitle: string;
      fromContentType: string;
      cluster: string;
      toSlug: string;
      toTitle: string;
      toKind: string;
      toContentType: string | null;
      href: string;
      targetState: string;
      linkReason: string;
      [key: string]: unknown;
    }>;
  };
  const overlayEdges = linkOverlay.edges;
  const draftsBySlug = new Map(drafts.map((draft) => [draft.slug, draft]));
  assert.equal(overlayEdges.length, 63, 'all curated authority overlay edges must be present');
  const overlayCounts = overlayEdges.reduce<Record<string, number>>((counts, edge) => {
    const key = edge.toKind === 'candidate' ? 'toUnpublishedCandidates'
      : edge.toKind === 'story' ? 'toMaintainedStories'
        : edge.toKind === 'research' ? 'toMaintainedResearchRecords'
          : edge.toKind === 'topic' ? 'toMaintainedTopics'
            : `unexpected:${edge.toKind}`;
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
  assert.equal(linkOverlay.counts.totalDraftOnlyLinks, overlayEdges.length);
  for (const key of ['toUnpublishedCandidates', 'toMaintainedStories', 'toMaintainedResearchRecords', 'toMaintainedTopics']) {
    assert.equal(linkOverlay.counts[key], overlayCounts[key] ?? 0, `overlay count must match ${key}`);
  }
  assert.ok(overlayEdges.every((edge) => draftsBySlug.has(edge.fromSlug)), 'every overlay edge must start at a candidate');
  for (const edge of overlayEdges) {
    if (edge.toKind === 'candidate') {
      assert.ok(draftsBySlug.has(edge.toSlug), `overlay target candidate must exist: ${edge.toSlug}`);
    } else if (edge.toKind === 'story') {
      assert.ok(maintainedSlugs.has(edge.toSlug), `overlay maintained story must resolve: ${edge.toSlug}`);
    } else if (edge.toKind === 'research') {
      assert.ok(researchRecords.some((record) => record.slug === edge.toSlug), `overlay research record must resolve: ${edge.toSlug}`);
    } else if (edge.toKind === 'topic') {
      const topic = topicRecords.find((record) => record.slug === edge.toSlug);
      assert.ok(topic, `overlay topic must resolve: ${edge.toSlug}`);
      assert.equal(topic.route, edge.href, `overlay topic href must use its maintained route: ${edge.toSlug}`);
    } else {
      assert.fail(`unexpected overlay target kind: ${edge.toKind}`);
    }
  }
  const reciprocalCandidateEdges = overlayEdges.flatMap((edge) => {
    if (edge.toKind !== 'candidate') return [];
    const reverseExists = overlayEdges.some((candidate) =>
      candidate.fromSlug === edge.toSlug && candidate.toSlug === edge.fromSlug && candidate.toKind === 'candidate',
    );
    if (reverseExists) return [];
    const sourceDraft = draftsBySlug.get(edge.fromSlug);
    const targetDraft = draftsBySlug.get(edge.toSlug);
    assert.ok(sourceDraft && targetDraft, `reciprocal target pair must resolve for ${edge.fromSlug}`);
    return [{
      ...edge,
      fromSlug: edge.toSlug,
      fromTitle: targetDraft.title,
      fromContentType: targetDraft.contentType,
      toSlug: edge.fromSlug,
      toTitle: sourceDraft.title,
      toKind: 'candidate',
      toContentType: sourceDraft.contentType,
      href: `/article/${sourceDraft.slug}`,
      targetState: 'unpublished-candidate; reciprocal link staged only',
      linkReason: `Reciprocal related-candidate link for curated ${edge.cluster} overlay edge.`,
      reciprocalOf: `${edge.fromSlug}->${edge.toSlug}`,
    }];
  });
  const stagingLinkEdges = [...overlayEdges, ...reciprocalCandidateEdges];
  for (const draft of drafts) {
    const curatedRelated = stagingLinkEdges
      .filter((edge) => edge.fromSlug === draft.slug && edge.toKind === 'candidate')
      .map((edge) => edge.toSlug);
    draft.story.relatedStories = [...new Set([...draft.story.relatedStories, ...curatedRelated])];
  }

  assert.equal(drafts.length, 70, 'all actual draft records must load');
  assert.deepEqual(
    Object.fromEntries([...new Set(drafts.map((draft) => draft.contentType))].map((type) => [
      type,
      drafts.filter((draft) => draft.contentType === type).length,
    ])),
    { Brief: 10, Analysis: 10, Explainer: 10, Research: 10, Report: 10, Comparison: 10, Essay: 10 },
  );
  assert.equal(draftNumbers.size, 70);
  assert.equal(draftSlugs.size, 70);
  assert.equal(crosswalk.rows.length, 253);
  assert.equal(citationKeys.size, 133);
  assert.equal(drafts.reduce((sum, draft) => sum + draft.citationCount, 0), 640);
  assert.equal(captures.length, 101);
  assert.ok(drafts.every((draft) => !maintainedSlugs.has(draft.slug)), 'no draft slug may collide with maintained content');
  assert.ok(captures.every((capture) => existsSync(path.join(root, capture.capturePath))));
  assert.ok(captures.every((capture) => capture.exactUrl !== UNKNOWN), 'all 101 captures must preserve their exact source URL');
  assert.ok(drafts.every((draft) => draft.sourceRows.length === draft.citationKeys.length), 'each cited key must map to one captured source');

  const unresolvedRelated = drafts.flatMap((draft) => {
    const { unresolved } = relatedReferences(draft.relatedCoverage, new Map(drafts.map((entry) => [entry.number, entry])));
    return unresolved.map((reference) => ({ slug: draft.slug, reference }));
  });
  const eligibleDrafts = drafts.filter((draft) => draft.eligible);
  const publicStories = [...eligibleDrafts.map((draft) => draft.story), ...maintainedStories];
  const sourceRecordsByKey = new Map<string, Source>();
  const captureByKey = new Map<string, NormalizedCapture>();
  for (const row of crosswalk.rows) {
    const capture = captures.find((item) => item.capturePath === row.capturePath);
    assert.ok(capture, `missing normalized source capture for ${row.key}`);
    const existingCapture = captureByKey.get(row.key);
    if (existingCapture) {
      assert.equal(existingCapture.capturePath, capture.capturePath, `globally conflicting key ${row.key}`);
    } else {
      captureByKey.set(row.key, capture);
      sourceRecordsByKey.set(row.key, sourceRecordFromCapture(row.key, capture));
    }
  }
  const extraSources = [...sourceRecordsByKey.values()];
  for (const source of extraSources) {
    const existing = sources.find((candidate) => candidate.slug === source.slug);
    if (existing) {
      assert.equal(existing.url, source.url, `candidate source key collides with maintained source ${source.slug}`);
    }
  }
  const sourceLengthBefore = sources.length;
  const topicLengthBefore = topicRecords.length;
  const newSources = extraSources.filter((source) => !sources.some((candidate) => candidate.slug === source.slug));
  sources.push(...newSources);
  const fixtureTopics: TopicRecord[] = [];
  const knownTopicLabels = new Set(topicRecords.map((topic) => topic.label.toLowerCase()));
  for (const label of [...new Set(drafts.map((draft) => draft.topic).filter(Boolean))]) {
    if (knownTopicLabels.has(label.toLowerCase())) continue;
    const slug = `draft-validation-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
    fixtureTopics.push({
      slug,
      label,
      route: `/topics/${slug}`,
      description: `Disposable validation topic: ${label}`,
      importantDevelopments: [],
      storySlugs: drafts.filter((draft) => draft.topic === label).map((draft) => draft.slug),
      entitySlugs: [],
      sourceSlugs: [],
      timelineSlugs: [],
      researchSlugs: [],
      reportSlugs: [],
      dataProductSlugs: [],
      indexable: false,
    });
  }
  topicRecords.push(...fixtureTopics);

  let apiServer: Server | undefined;
  let proxyServer: Server | undefined;
  let webProcess: ChildProcess | undefined;
  let webOrigin = '';
  let apiOrigin = '';
  let proxyOrigin = '';
  let mobileBrowser: (CdpBrowser & {
    navigate: (url: string) => Promise<void>;
    evaluate: (expression: string) => Promise<any>;
    capture: (name: string) => Promise<void>;
  }) | undefined;
  const candidateResults = new Map<string, Record<string, any>>();
  const technicalFailures: string[] = [];
  const publicAssetHash = hashTree(publicPath);

  try {
    apiServer = createInMemoryApi(() => publicStories, () => [...sources]);
    const apiPort = await listen(apiServer);
    apiOrigin = `http://127.0.0.1:${apiPort}`;
    const portProbe = createServer();
    const webPort = await listen(portProbe);
    await close(portProbe);
    webOrigin = `http://127.0.0.1:${webPort}`;
    const childEnv = Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key !== 'DATABASE_URL' && key !== 'REPL_ID'),
    ) as NodeJS.ProcessEnv;
    webProcess = spawn('pnpm', ['--filter', '@workspace/global-ai-news', 'run', 'dev'], {
      cwd: root,
      detached: true,
      env: {
        ...childEnv,
        NODE_ENV: 'test',
        PORT: String(webPort),
        BASE_PATH: '/',
        NEWSROOM_API_ORIGIN: apiOrigin,
      },
      stdio: 'ignore',
    });
    await waitFor(`${webOrigin}/`, webProcess);
    proxyServer = createServer((incoming, outgoing) => {
      const destination = incoming.url?.startsWith('/api/') ? apiOrigin : webOrigin;
      const upstream = httpRequest(new URL(incoming.url ?? '/', destination), {
        method: incoming.method,
        headers: { ...incoming.headers, host: new URL(destination).host },
      }, (response) => {
        outgoing.writeHead(response.statusCode ?? 502, response.headers);
        response.pipe(outgoing);
      });
      upstream.on('error', () => {
        if (!outgoing.headersSent) outgoing.writeHead(502);
        outgoing.end();
      });
      incoming.pipe(upstream);
    });
    const proxyPort = await listen(proxyServer);
    proxyOrigin = `http://127.0.0.1:${proxyPort}`;

    const [snapshotResponse, manifestResponse, apiFeedResponse, rootFeedResponse, apiSitemapResponse, rootSitemapResponse, homeResponse] = await Promise.all([
      fetch(`${apiOrigin}/api/newsroom/content`),
      fetch(`${apiOrigin}/api/newsroom/metadata`),
      fetch(`${apiOrigin}/api/newsroom/feed.xml`),
      fetch(`${webOrigin}/feed.xml`),
      fetch(`${apiOrigin}/api/newsroom/sitemap.xml`),
      fetch(`${webOrigin}/sitemap.xml`),
      fetch(`${webOrigin}/`),
    ]);
    const snapshot = await snapshotResponse.json() as any;
    const manifest = await manifestResponse.json() as { routes: SeoMetadata[] };
    const apiFeed = await apiFeedResponse.text();
    const rootFeed = await rootFeedResponse.text();
    const apiSitemap = await apiSitemapResponse.text();
    const rootSitemap = await rootSitemapResponse.text();
    assert.equal(snapshotResponse.status, 200);
    assert.equal(manifestResponse.status, 200);
    assert.equal(rootFeed, apiFeed, 'root RSS must reflect request-time API content');
    assert.equal(rootSitemap, apiSitemap, 'root sitemap must reflect request-time API content');
    assert.equal(snapshot.stories.filter((story: Story) => draftSlugs.has(story.slug)).length, eligibleDrafts.length);
    assert.ok(eligibleDrafts.length > 0, 'at least one candidate should enter the deterministic eligible fixture');
    assert.equal(homeResponse.status, 200);
    assert.equal(publicStories.length - maintainedStories.length, eligibleDrafts.length);

    const batchSize = 8;
    for (let start = 0; start < drafts.length; start += batchSize) {
      await Promise.all(drafts.slice(start, start + batchSize).map(async (draft) => {
        const metadata = manifest.routes.find((route) => route.path === `/article/${draft.slug}`);
        const eligible = draft.eligible;
        const result: Record<string, any> = {
          eligibleInTestFixture: eligible,
          simulatedPublicationTime: FIXTURE_NOW.toISOString(),
          actualPublicationDate: draft.actualPublicationDate,
          actualAuthor: UNKNOWN,
          title: false,
          description: false,
          canonical: false,
          openGraph: false,
          socialMetadata: false,
          jsonLd: false,
          jsonLdAuthor: false,
          jsonLdPublicationDate: false,
          breadcrumbs: false,
          amp: false,
          ampCanonicalRelationship: false,
          indexability: false,
          sitemap: false,
          rss: false,
          firstResponseBody: false,
          mobile: 'NOT RUN',
          internalLinkCount: 0,
          fixtureInternalLinkCount: draft.relatedSlugs.length + draft.citationKeys.length,
          topic: draft.topic || UNKNOWN,
          entities: [],
          entityMentions: draft.mentionedEntities,
          entityRelationshipStatus: 'NOT STRUCTURED IN SOURCE DRAFT',
          relatedStorySlugs: draft.relatedSlugs,
          sourceCount: draft.citationKeys.length,
          citationCount: draft.citationCount,
          typeFitStatus: draft.typeFit.status,
          typeFitCues: draft.typeFit.cues,
          unresolvedRelatedReferences: [],
          technicalIssues: [],
        };

        if (!eligible) {
          const articleResponse = await fetch(`${webOrigin}/article/${draft.slug}`);
          const ampResponse = await fetch(`${webOrigin}/amp/article/${draft.slug}`);
          const articleHtml = await articleResponse.text();
          const ampHtml = await ampResponse.text();
          result.indexability = articleResponse.status === 404 && articleHtml.includes('noindex');
          result.amp = ampResponse.status === 404 && /noindex/i.test(ampHtml);
          result.technicalIssues.push(...(
            result.indexability ? [] : [`ineligible draft route did not remain 404/noindex (${articleResponse.status})`]
          ));
          result.technicalIssues.push(...(
            result.amp ? [] : [`ineligible AMP route did not remain 404/noindex (${ampResponse.status})`]
          ));
          result.seoStatus = 'NOT PUBLIC: below publication eligibility threshold in test fixture';
          result.ampStatus = 'NOT PUBLIC: AMP route remains 404/noindex';
          result.indexabilityStatus = result.indexability ? 'PASS — excluded from public index' : 'FAIL';
          result.firstResponseStatus = 'NOT PUBLIC';
          result.mobile = 'NOT PUBLIC';
          result.qualityStatus = `BLOCKED — ${draft.typeFit.status}; under ${MINIMUM_STORY_WORDS} words`;
          result.stagingStatus = 'NOT STAGED';
          candidateResults.set(draft.slug, result);
          return;
        }

        const [articleResponse, ampResponse] = await Promise.all([
          fetch(`${webOrigin}/article/${draft.slug}`),
          fetch(`${webOrigin}/amp/article/${draft.slug}`),
        ]);
        const articleHtml = await articleResponse.text();
        const ampHtml = await ampResponse.text();
        const canonical = getCanonicalUrl(`/article/${draft.slug}`);
        const expectedTitle = `${draft.title} — Global AI News`;
        const expectedDescription = getArticleDescription(draft.story);
        const jsonLd = getJsonLd(articleHtml);
        const jsonLdNodes = flattenObjects(jsonLd);
        const titleTag = articleHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
        const description = readMetadataValue(articleHtml, 'name', 'description');
        const canonicalCount = (articleHtml.match(/<link\b[^>]*rel=["']canonical["']/gi) ?? []).length;
        const canonicalPass = canonicalCount === 1 && articleHtml.includes(`rel="canonical" href="${canonical}"`);
        const h1Pass = new RegExp(`<h1[^>]*>${escapeRegExp(escapeHtml(draft.title))}</h1>`, 'i').test(articleHtml);
        const bodySnippet = draft.firstBodySnippet.slice(0, 80);
        const articleText = visibleHtmlText(articleHtml);
        const bodyPass = Boolean(bodySnippet) && articleText.includes(bodySnippet);
        const ampLink = articleHtml.includes(`rel="amphtml" href="${getCanonicalUrl(`/amp/article/${draft.slug}/`)}`);
        const ampCanonical = ampHtml.includes(`rel="canonical" href="${canonical}"`);
        const ampTitle = ampHtml.includes(`<title>${escapeHtml(draft.title)}</title>`);
        const ampH1 = new RegExp(`<h1[^>]*>${escapeRegExp(escapeHtml(draft.title))}</h1>`, 'i').test(ampHtml);
        const ogTitle = readMetadataValue(articleHtml, 'property', 'og:title');
        const ogDescription = readMetadataValue(articleHtml, 'property', 'og:description');
        const ogUrl = readMetadataValue(articleHtml, 'property', 'og:url');
        const ogImage = readMetadataValue(articleHtml, 'property', 'og:image');
        const twitterTitle = readMetadataValue(articleHtml, 'name', 'twitter:title');
        const twitterCard = readMetadataValue(articleHtml, 'name', 'twitter:card');
        const breadcrumbPresent = jsonLdNodes.some((node) => node['@type'] === 'BreadcrumbList');
        const jsonLdTitlePass = jsonLdNodes.some((node) => node.headline === draft.title || node.name === draft.title);
        const articleJsonLd = jsonLdNodes.find((node) => node.headline === draft.title);
        const articleAuthor = articleJsonLd?.author as { '@type'?: string; name?: string } | undefined;
        const jsonLdAuthorPresent = Boolean(articleAuthor);
        const jsonLdOrganizationAuthor = articleAuthor?.['@type'] === 'Organization'
          && articleAuthor.name === HOUSE_AUTHOR.name;
        const bylinePresentInFirstResponse = articleHtml.includes(HOUSE_AUTHOR.name);
        const jsonLdDatePresent = jsonLdNodes.some((node) => Boolean(node.datePublished));
        const robotsNoindex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(articleHtml);
        const sitemapPass = apiSitemap.includes(`<loc>${canonical}</loc>`);
        const feedPass = apiFeed.includes(`<link>${canonical}</link>`) && apiFeed.includes(`<title>${xmlEscape(draft.title)}</title>`);
        const metadataPass = metadata?.path === `/article/${draft.slug}` && metadata.ampPath === `/amp/article/${draft.slug}/`;
        const sourceLinkCount = (articleHtml.match(/href=["']\/source\/[^"']+["']/g) ?? []).length;
        const relatedLinkCount = draft.relatedSlugs.filter((slug) => articleHtml.includes(`/article/${slug}`)).length;
        const topicLinkCount = topicRecords.some((topic) =>
          topic.label.toLowerCase() === draft.topic.toLowerCase() && articleHtml.includes(topic.route),
        ) ? 1 : 0;
        result.title = titleTag === expectedTitle && h1Pass;
        result.description = Boolean(description) && description === escapeHtml(expectedDescription);
        result.canonical = canonicalPass;
        result.openGraph = ogTitle === escapeHtml(expectedTitle)
          && ogDescription === escapeHtml(expectedDescription)
          && ogUrl === escapeHtml(canonical)
          && Boolean(ogImage);
        result.socialMetadata = twitterTitle === escapeHtml(expectedTitle)
          && twitterCard === 'summary_large_image'
          && Boolean(readMetadataValue(articleHtml, 'name', 'twitter:image'));
        result.jsonLd = Boolean(jsonLd) && jsonLdTitlePass;
        result.jsonLdAuthor = jsonLdOrganizationAuthor;
        result.jsonLdPublicationDate = jsonLdDatePresent;
        result.breadcrumbs = breadcrumbPresent;
        result.amp = articleResponse.status === 200
          && ampResponse.status === 200
          && ampLink
          && metadataPass
          && ampTitle
          && ampH1
          && ampCanonical;
        result.ampCanonicalRelationship = ampLink && ampCanonical;
        result.indexability = !robotsNoindex && sitemapPass;
        result.sitemap = sitemapPass;
        result.rss = feedPass;
        result.firstResponseBody = bodyPass;
        result.internalLinkCount = 0;
        result.fixtureInternalLinkCount = relatedLinkCount + sourceLinkCount + topicLinkCount;
        result.liveMaintainedRouteCount = 0;
        result.bylinePresentInFirstResponse = bylinePresentInFirstResponse;
        result.fixturePublicationDatePresent = jsonLdDatePresent;
        result.actualAuthorStatus = HOUSE_AUTHOR.name;
        result.seoStatus = 'PASS IN DISPOSABLE PUBLISHED-ROUTE FIXTURE; candidate remains private and unpublished';
        result.ampStatus = result.amp
          ? 'PASS — candidate-specific article-to-AMP relationship in disposable fixture'
          : 'FAIL — AMP route contract';
        result.indexabilityStatus = result.indexability
          ? 'PASS IN FIXTURE; DRAFT REMAINS PRIVATE OUTSIDE FIXTURE'
          : 'FAIL — indexability/sitemap';
        result.firstResponseStatus = bodyPass && result.jsonLd && result.canonical && result.bylinePresentInFirstResponse
          ? 'PASS — first response carries the organization byline; fixture publication date is test-only'
          : 'FAIL — first-response structural contract';
        result.qualityStatus = `PASS — reviewed sources, ${draft.typeFit.status}, distinct organization byline, draft publication metadata`;
        result.stagingStatus = persistWorkspaceDraftStage
          ? 'STAGED — workspace-only draft; publishedAt remains null'
          : 'NOT STAGED — private in-memory validation only; publishedAt remains null';
        result.unresolvedRelatedReferences = unresolvedRelated
          .filter((item) => item.slug === draft.slug)
          .map((item) => item.reference);

        const routeChecks: Array<[string, boolean]> = [
          ['article HTTP status 200', articleResponse.status === 200],
          ['AMP HTTP status 200', ampResponse.status === 200],
          ['article title/H1', result.title],
          ['meta description', result.description],
          ['single canonical', result.canonical],
          ['Open Graph metadata', result.openGraph],
          ['social metadata', result.socialMetadata],
          ['JSON-LD headline', result.jsonLd],
          ['JSON-LD organization author', result.jsonLdAuthor],
          ['organization byline in first response', result.bylinePresentInFirstResponse],
          ['AMP article relationship', result.amp],
          ['indexability/sitemap', result.indexability],
          ['RSS entry', result.rss],
          ['first-response article body', result.firstResponseBody],
        ];
        result.technicalIssues.push(...routeChecks.filter(([, passed]) => !passed).map(([name]) => name));
        result.titleTag = titleTag ?? UNKNOWN;
        result.descriptionLength = expectedDescription.length;
        result.responseBytes = Buffer.byteLength(articleHtml);
        candidateResults.set(draft.slug, result);
      }));
    }

    const unknownArticle = await fetch(`${webOrigin}/article/disposable-unknown-slug`);
    const unknownAmp = await fetch(`${webOrigin}/amp/article/disposable-unknown-slug`);
    const unknownArticleHtml = await unknownArticle.text();
    assert.equal(unknownArticle.status, 404);
    assert.ok(/noindex/i.test(unknownArticleHtml));
    assert.equal(unknownAmp.status, 404);
    assert.match(unknownAmp.headers.get('x-robots-tag') ?? '', /noindex/i);

    const eligibleCandidate = eligibleDrafts[0];
    const page = await fetch(`${webOrigin}/article/${eligibleCandidate.slug}`);
    assert.equal(page.status, 200);
    const beforeMobile = hashTree(publicPath);
    assert.equal(beforeMobile, publicAssetHash, 'request-time publication must not rebuild static assets');

    // Mobile-render every eligible candidate at 402px; a screenshot is kept for one route per segment.
    mobileBrowser = await launchMobileBrowser();
    const typedBrowser = mobileBrowser;
    await typedBrowser.navigate(`${proxyOrigin}/`);
    const expectedHomeStoryTitle = snapshot.stories[0]?.title;
    assert.ok(expectedHomeStoryTitle, 'the fixture snapshot must include a published story for the homepage');
    const expectedHomeStoryTitleJson = JSON.stringify(expectedHomeStoryTitle);
    const homepageState = await typedBrowser.evaluate(`new Promise((resolve) => {
      let attempts = 0;
      const expectedTitle = ${expectedHomeStoryTitleJson};
      const inspect = () => {
        const text = document.body?.innerText ?? "";
        if (text.includes(expectedTitle) || attempts >= 100) {
          resolve({ text, excerpt: text.slice(0, 600) });
          return;
        }
        attempts += 1;
        setTimeout(inspect, 50);
      };
      inspect();
    })`);
    assert.ok(
      homepageState.text.includes(expectedHomeStoryTitle),
      `the hydrated homepage should show the first story in the fixture snapshot (${expectedHomeStoryTitle}); visible text: ${homepageState.excerpt}`,
    );
    const firstByType = new Set<EditorialContentType>();
    for (const draft of eligibleDrafts) {
      const result = candidateResults.get(draft.slug)!;
      try {
        await typedBrowser.navigate(`${proxyOrigin}/article/${draft.slug}`);
        const expectedTitleJson = JSON.stringify(draft.title);
        const expectedSnippetJson = JSON.stringify(draft.firstBodySnippet.slice(0, 50));
        const articleReady = await typedBrowser.evaluate(`new Promise((resolve) => {
          let attempts = 0;
          let stableSince = null;
          const expectedTitle = ${expectedTitleJson};
          const expectedSnippet = ${expectedSnippetJson};
          const inspect = () => {
            const h1 = document.querySelector('h1');
            const main = document.querySelector('main');
            const ready = h1?.innerText?.trim() === expectedTitle
              && parseFloat(getComputedStyle(h1).fontSize) > 0
              && (main?.innerText ?? "").includes(expectedSnippet);
            if (ready) {
              stableSince ??= Date.now();
            } else {
              stableSince = null;
            }
            if ((stableSince !== null && Date.now() - stableSince >= 400) || attempts >= 100) {
              resolve(stableSince !== null);
              return;
            }
            attempts += 1;
            setTimeout(inspect, 50);
          };
          inspect();
        })`);
        assert.equal(articleReady, true, `article route did not hydrate for ${draft.slug}`);
        const metrics = await typedBrowser.evaluate(`(() => {
          const h1 = document.querySelector('h1');
          const main = document.querySelector('main');
          const tables = [...document.querySelectorAll('table')];
          const tableScrollSafe = tables.every((table) => {
            let node = table.parentElement;
            while (node && node !== document.body) {
              const overflow = getComputedStyle(node).overflowX;
              if (overflow === 'auto' || overflow === 'scroll') return true;
              node = node.parentElement;
            }
            return false;
          });
          const resources = performance.getEntriesByType('resource');
          const navigation = performance.getEntriesByType('navigation')[0];
          return {
            width: innerWidth,
            layoutViewportWidth: document.documentElement.clientWidth,
            visualViewportWidth: window.visualViewport?.width ?? null,
            visualViewportScale: window.visualViewport?.scale ?? null,
            outerWidth,
            screenWidth: screen.width,
            devicePixelRatio,
            viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? null,
            documentWidth: document.documentElement.scrollWidth,
            bodyWidth: document.body.scrollWidth,
            h1: h1?.innerText?.trim() ?? '',
            h1FontSize: h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0,
            mainText: main?.innerText ?? '',
            tableCount: tables.length,
            tableScrollSafe,
            sourceLinks: [...document.querySelectorAll('a[href^="/source/"]')].length,
            relatedLinks: [...document.querySelectorAll('a[href^="/article/"]')].length,
            ttfbMs: navigation?.responseStart ?? null,
            transferBytes: resources.reduce((total, resource) => total + (resource.transferSize ?? 0), navigation?.transferSize ?? 0),
            lcpMs: window.__ganPortfolioAudit?.lcp ?? null,
            cls: window.__ganPortfolioAudit?.cls ?? null,
          };
        })()`);
        const snippet = draft.firstBodySnippet.slice(0, 50);
        const passed = metrics.width === 402
          && metrics.documentWidth <= metrics.width + 1
          && metrics.bodyWidth <= metrics.width + 1
          && metrics.h1 === draft.title
          && metrics.h1FontSize > 0
          && metrics.mainText.includes(snippet)
          && metrics.tableScrollSafe;
        result.mobile = passed ? 'PASS — 402px structure, typography, body, overflow' : 'FAIL — mobile structure/overflow';
        result.mobileMetrics = {
          viewport: metrics.width,
          layoutViewportWidth: metrics.layoutViewportWidth,
          visualViewportWidth: metrics.visualViewportWidth,
          visualViewportScale: metrics.visualViewportScale,
          outerWidth: metrics.outerWidth,
          screenWidth: metrics.screenWidth,
          devicePixelRatio: metrics.devicePixelRatio,
          viewportMeta: metrics.viewportMeta,
          documentWidth: metrics.documentWidth,
          bodyWidth: metrics.bodyWidth,
          h1FontSize: metrics.h1FontSize,
          tableCount: metrics.tableCount,
          tableScrollSafe: metrics.tableScrollSafe,
          sourceLinks: metrics.sourceLinks,
          relatedLinks: metrics.relatedLinks,
          ttfbMs: metrics.ttfbMs,
          transferBytes: metrics.transferBytes,
          lcpMs: metrics.lcpMs,
          cls: metrics.cls,
        };
        if (!passed) result.technicalIssues.push('mobile width/content/table assertion');
        if (!firstByType.has(draft.contentType)) {
          firstByType.add(draft.contentType);
          await typedBrowser.evaluate(
            'Promise.race([document.fonts?.ready.then(() => true), new Promise((resolve) => setTimeout(() => resolve(false), 5000))])',
          );
          await typedBrowser.capture(draft.contentType.toLowerCase());
        }
      } catch (error) {
        result.mobile = `FAIL — ${error instanceof Error ? error.message : 'mobile rendering failed'}`;
        result.technicalIssues.push(String(result.mobile));
      }
    }

    const graph = buildAuthorityGraph(publicStories);
    const graphSet = new Set(graph.map((edge) => `${edge.fromType}:${edge.fromSlug}:${edge.relationship}:${edge.toType}:${edge.toSlug}`));
    const graphIssues: string[] = [];
    for (const draft of eligibleDrafts) {
      const expectedTopic = topicRecords.find((topic) => topic.label.toLowerCase() === draft.topic.toLowerCase());
      const sourceEdges = draft.citationKeys.filter((key) =>
        graphSet.has(`report:${draft.slug}:cites:source:${key}`)
        || graphSet.has(`article:${draft.slug}:cites:source:${key}`),
      );
      const targetType = draft.contentType === 'Report' ? 'report' : 'article';
      const relatedEdges = draft.story.relatedStories.filter((slug) =>
        graphSet.has(`${targetType}:${draft.slug}:related:article:${slug}`)
        || graphSet.has(`${targetType}:${draft.slug}:related:report:${slug}`),
      );
      const hasTopicEdge = Boolean(expectedTopic && (
        graphSet.has(`${targetType}:${draft.slug}:covers:topic:${expectedTopic.slug}`)
      ));
      if (!hasTopicEdge) graphIssues.push(`${draft.slug}: missing fixture topic edge`);
      if (sourceEdges.length !== draft.citationKeys.length) graphIssues.push(`${draft.slug}: missing one or more fixture source edges`);
      if (relatedEdges.length !== draft.story.relatedStories.length) graphIssues.push(`${draft.slug}: missing one or more reciprocal related-story edges`);
      const result = candidateResults.get(draft.slug)!;
      result.fixtureAuthorityGraph = {
        topic: expectedTopic?.slug ?? UNKNOWN,
        topicEdge: hasTopicEdge,
        sourceEdges: sourceEdges.length,
        relatedEdges: relatedEdges.length,
        entityEdges: 0,
        timelineEdges: 0,
        researchReportRecordEdges: 0,
      };
      result.actualAuthorityRegistryStatus = 'NOT REGISTERED — drafts are not maintained public records';
    }

    const duplicateAlerts = buildTfidfSimilarity(drafts, maintainedStories);
    const duplicateBySlug = new Map<string, typeof duplicateAlerts>();
    for (const alert of duplicateAlerts) {
      duplicateBySlug.set(alert.leftSlug, [...(duplicateBySlug.get(alert.leftSlug) ?? []), alert]);
    }
    const semanticReview = JSON.parse(readFileSync(
      path.join(portfolioRoot, 'semantic-pair-review.json'),
      'utf8',
    )) as {
      classificationCounts: Record<string, number>;
      unresolvedAClassCount: number;
      pairReviews: Array<{ leftSlug: string; rightSlug: string; classification: string; rationale: string; differentiation?: string }>;
    };
    const semanticPairsBySlug = new Map<string, typeof semanticReview.pairReviews>();
    for (const review of semanticReview.pairReviews) {
      semanticPairsBySlug.set(review.leftSlug, [...(semanticPairsBySlug.get(review.leftSlug) ?? []), review]);
      semanticPairsBySlug.set(review.rightSlug, [...(semanticPairsBySlug.get(review.rightSlug) ?? []), review]);
    }
    const contentTypeReview = JSON.parse(readFileSync(
      path.join(portfolioRoot, 'content-type-review.json'),
      'utf8',
    )) as {
      status: string;
      count: number;
      manualFitCount: number;
      contentTypeReviews: Array<{ slug: string; finalStatus: string; manualDecision: string; rationale: string }>;
    };
    const sourceDateReview = JSON.parse(readFileSync(
      path.join(portfolioRoot, 'source-date-review.json'),
      'utf8',
    )) as {
      coverage: { normalizedPublicationDates: number; unresolvedOrUnnormalizedEvidence: number; manufacturedDates: number };
      unresolvedEvidence: unknown[];
    };
    const sourceMetadataFile = path.join(portfolioRoot, 'source-metadata-normalized.json');
    const securityScanSummaryFile = path.join(portfolioRoot, 'security-scan-summary.json');
    const bracesSecurityReviewFile = path.join(portfolioRoot, 'braces-security-review.json');
    const matrixFile = path.join(portfolioRoot, 'final-validation-matrix.json');
    const securityScanSummary = existsSync(securityScanSummaryFile)
      ? JSON.parse(readFileSync(securityScanSummaryFile, 'utf8'))
      : { status: 'NOT RUN', file: path.basename(securityScanSummaryFile) };
    const bracesSecurityReview = existsSync(bracesSecurityReviewFile)
      ? JSON.parse(readFileSync(bracesSecurityReviewFile, 'utf8'))
      : { status: 'NOT RUN', file: path.basename(bracesSecurityReviewFile) };
    const apiServerPackageFile = path.join(root, 'artifacts', 'api-server', 'package.json');
    const apiServerPackage = JSON.parse(readFileSync(apiServerPackageFile, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const apiProductionDependencyTree = execFileSync(
      'pnpm',
      ['--filter', '@workspace/api-server', 'list', '--prod', '--depth', 'Infinity', '--parseable'],
      { cwd: root, encoding: 'utf8' },
    );
    const apiProductionBundles = [
      path.join(root, 'artifacts', 'api-server', 'dist', 'index.mjs'),
      path.join(root, 'artifacts', 'api-server', 'dist', 'editorial', 'replay-command.mjs'),
    ];
    const apiProductionBundleEvidence = apiProductionBundles.map((file) => {
      if (!existsSync(file)) {
        return { file: path.relative(root, file), exists: false, forbiddenMarkers: ['bundle missing'] };
      }
      const bundle = readFileSync(file, 'utf8');
      return {
        file: path.relative(root, file),
        exists: true,
        forbiddenMarkers: [
          ...(bundle.includes('http-proxy-middleware') ? ['http-proxy-middleware'] : []),
          ...(bundle.includes('micromatch') ? ['micromatch'] : []),
          ...(bundle.includes('braces@3.0.3') ? ['braces@3.0.3'] : []),
          ...(bundle.includes('require_braces') ? ['require_braces'] : []),
        ],
      };
    });
    const apiProductionDirectDependencies = Object.keys(apiServerPackage.dependencies ?? {});
    const apiProductionDependencyTreeClean =
      apiProductionDependencyTree.includes('httpxy@0.5.5') &&
      !/(?:braces@3\.0\.3|micromatch@|http-proxy-middleware@)/.test(apiProductionDependencyTree);
    const apiProductionPackageManifestClean =
      apiServerPackage.dependencies?.httpxy === '0.5.5' &&
      !['braces', 'micromatch', 'http-proxy-middleware'].some((name) =>
        apiProductionDirectDependencies.includes(name),
      );
    const apiProductionBundlesClean = apiProductionBundleEvidence.every((bundle) =>
      bundle.exists && bundle.forbiddenMarkers.length === 0,
    );
    const dependencyHighFindings =
      securityScanSummary.scanners?.dependencyAudit?.criticalHighFindings ?? [];
    const onlyExpectedBracesFinding =
      dependencyHighFindings.length === 1 &&
      dependencyHighFindings[0].package === 'braces' &&
      dependencyHighFindings[0].version === '3.0.3' &&
      dependencyHighFindings[0].severity === 'high' &&
      dependencyHighFindings[0].id === 'GHSA-vfj7-8cjw-p6xm@braces-3.0.3';
    const allScannersCompletedAndOtherFindingsAbsent =
      securityScanSummary.scanners?.dependencyAudit?.status === 'ok' &&
      securityScanSummary.scanners?.sast?.status === 'ok' &&
      securityScanSummary.scanners?.sast?.findingCount === 0 &&
      securityScanSummary.scanners?.houndDog?.status === 'ok' &&
      securityScanSummary.scanners?.houndDog?.findingCount === 0;
    const narrowExceptionRecorded =
      securityScanSummary.releaseGate?.status === 'PASS_WITH_NARROW_NON_RUNTIME_EXCEPTION' &&
      securityScanSummary.releaseGate?.findingId === 'GHSA-vfj7-8cjw-p6xm@braces-3.0.3' &&
      securityScanSummary.releaseGate?.scannerFindingRetained === true &&
      bracesSecurityReview.status === 'PASS_WITH_NARROW_NON_RUNTIME_EXCEPTION' &&
      bracesSecurityReview.advisory?.package === 'braces@3.0.3' &&
      bracesSecurityReview.advisory?.id === 'GHSA-vfj7-8cjw-p6xm' &&
      bracesSecurityReview.mitigation?.regressionTests?.passed === 6;
    const runtimeExposureAbsent =
      bracesSecurityReview.runtimeExposureAssessment?.productionPackageSetContainsBraces === false &&
      bracesSecurityReview.runtimeExposureAssessment?.productionBundlesContainBraces === false &&
      apiProductionDependencyTreeClean &&
      apiProductionPackageManifestClean &&
      apiProductionBundlesClean;
    const documentedNonRuntimeExceptionPasses =
      securityScanSummary.status === 'BLOCKED' &&
      securityScanSummary.criticalHighCount === 1 &&
      onlyExpectedBracesFinding &&
      allScannersCompletedAndOtherFindingsAbsent &&
      narrowExceptionRecorded &&
      runtimeExposureAbsent;
    const rawScannerGatePasses =
      securityScanSummary.status === 'PASS' &&
      securityScanSummary.criticalHighCount === 0 &&
      allScannersCompletedAndOtherFindingsAbsent;
    const securityReleaseStatus = rawScannerGatePasses
      ? 'PASS'
      : documentedNonRuntimeExceptionPasses
        ? 'PASS_WITH_NARROW_NON_RUNTIME_EXCEPTION'
        : 'BLOCKED';
    const securityReleaseGatePassed = securityReleaseStatus !== 'BLOCKED';
    const securityRuntimeAssessment = {
      rawScannerStatus: securityScanSummary.status ?? 'NOT RUN',
      releaseDisposition: securityReleaseStatus,
      rawHighFindingCount: securityScanSummary.criticalHighCount ?? null,
      onlyHighFindingIsExpectedBracesAdvisory: onlyExpectedBracesFinding,
      unexceptedCriticalOrHighFindings: onlyExpectedBracesFinding ? 0 : dependencyHighFindings.length,
      allScannersCompletedAndOtherFindingsAbsent,
      productionDependencyTree: {
        checked: true,
        includesHttpxy055: apiProductionDependencyTree.includes('httpxy@0.5.5'),
        excludesBracesMicromatchAndHpm: apiProductionDependencyTreeClean,
        relevantEntries: apiProductionDependencyTree
          .split('\n')
          .filter((entry) => /httpxy|braces|micromatch|http-proxy-middleware/.test(entry)),
      },
      productionPackageManifest: {
        checked: true,
        directDependencies: apiProductionDirectDependencies,
        excludesBracesMicromatchAndHpm: apiProductionPackageManifestClean,
      },
      productionBundles: apiProductionBundleEvidence,
      evidenceBasedExceptionRecorded: narrowExceptionRecorded,
    };
    const normalizedFieldCoverage = {
      totalMappedCaptureFiles: captures.length,
      sourceUrlAvailable: captures.filter((capture) => capture.exactUrl !== UNKNOWN).length,
      titleAvailable: captures.filter((capture) => capture.title !== UNKNOWN).length,
      explicitTitleFieldAvailable: captures.filter((capture) => capture.titleEvidenceSource === 'Title field').length,
      pageTitleFieldAvailable: captures.filter((capture) => capture.titleEvidenceSource === 'Page title field').length,
      capturedTitleFallbackAvailable: captures.filter((capture) =>
        capture.titleEvidenceSource !== UNKNOWN &&
        capture.titleEvidenceSource !== 'Title field' &&
        capture.titleEvidenceSource !== 'Page title field',
      ).length,
      titleUnavailable: captures.filter((capture) => capture.title === UNKNOWN).length,
      publisherAvailable: captures.filter((capture) => capture.publisher !== UNKNOWN).length,
      publicationDateEvidenceAvailable: captures.filter((capture) => capture.publicationDateEvidence.length > 0).length,
      publicationDateAvailable: captures.filter((capture) => capture.publicationDate !== UNKNOWN).length,
      publicationDateEvidenceUnnormalized: captures.filter((capture) =>
        capture.publicationDateEvidence.length > 0 && capture.publicationDate === UNKNOWN,
      ).length,
      fetchDateEvidenceAvailable: captures.filter((capture) => capture.fetchedDateEvidence !== UNKNOWN).length,
      fetchDateAvailable: captures.filter((capture) => capture.fetchedDate !== UNKNOWN).length,
      sourceTypeAvailable: captures.filter((capture) => capture.sourceType !== UNKNOWN).length,
      evidenceClassAvailable: captures.filter((capture) => capture.evidenceClass !== UNKNOWN).length,
      primarySecondaryClassified: captures.filter((capture) => capture.primarySecondary !== UNKNOWN).length,
      relevanceAvailable: captures.filter((capture) => capture.relevanceContext.length > 0).length,
      crosswalkRolesAvailable: captures.filter((capture) => capture.crosswalkRoles.length > 0).length,
    };
    writeFileSync(sourceMetadataFile, `${JSON.stringify({
      generatedAt: FIXTURE_NOW.toISOString(),
      source: '101 capture files referenced by the 253 draft source-map rows',
      unknownValue: UNKNOWN,
      coverage: normalizedFieldCoverage,
      captures,
    }, null, 2)}\n`);

    const matrixRows = drafts.map((draft) => {
      const result = candidateResults.get(draft.slug) ?? {
        eligibleInTestFixture: false,
        seoStatus: 'NOT RUN',
        ampStatus: 'NOT RUN',
        indexabilityStatus: 'NOT RUN',
        mobile: 'NOT RUN',
        firstResponseStatus: 'NOT RUN',
        technicalIssues: ['candidate route was not exercised'],
      };
      const alerts = duplicateBySlug.get(draft.slug) ?? [];
      const classifiedPrimary = draft.sourceRows.filter((source) => source.primarySecondary === 'PRIMARY').length;
      const classifiedSecondary = draft.sourceRows.filter((source) => source.primarySecondary === 'SECONDARY').length;
      const unknownPrimary = draft.sourceRows.filter((source) => source.primarySecondary === UNKNOWN).length;
      const internalLinks = stagingLinkEdges.filter((edge) => edge.fromSlug === draft.slug);
      const researchLinks = internalLinks.filter((edge) => edge.toKind === 'research');
      const reportLinks = internalLinks.filter((edge) =>
        edge.toKind === 'report' || edge.toContentType === 'Report',
      );
      const reviewedPairs = semanticPairsBySlug.get(draft.slug) ?? [];
      const reviewedClassCounts = reviewedPairs.reduce<Record<string, number>>((counts, pair) => {
        counts[pair.classification] = (counts[pair.classification] ?? 0) + 1;
        return counts;
      }, {});
      const unresolvedSimilarities = reviewedPairs.filter((pair) => pair.classification === 'A');
      const contentTypeAdjudication = contentTypeReview.contentTypeReviews.find((item) => item.slug === draft.slug);
      const sourceDateCounts = {
        normalized: draft.sourceRows.filter((source) => source.publicationDate !== UNKNOWN).length,
        ambiguousEvidencePreserved: draft.sourceRows.filter((source) =>
          source.publicationDate === UNKNOWN && source.publicationDateEvidence.length > 0,
        ).length,
        unavailableWithoutDateEvidence: draft.sourceRows.filter((source) =>
          source.publicationDate === UNKNOWN && source.publicationDateEvidence.length === 0,
        ).length,
      };
      const rowSecurityStatus = securityReleaseStatus === 'PASS'
        ? 'PASS — workspace security scans completed with no unresolved critical/high findings'
        : securityReleaseGatePassed
          ? 'PASS WITH NARROW NON-RUNTIME EXCEPTION — raw audit still reports High braces@3.0.3 only in development dependencies; API production dependency tree and bundles verified clear'
          : `NOT CLEARED — security scan status ${securityScanSummary.status ?? 'unknown'}`;
      return {
        slug: draft.slug,
        segment: draft.contentType,
        title: draft.title,
        author: HOUSE_AUTHOR.name,
        author_type: HOUSE_AUTHOR.authorType,
        publication_state: 'draft',
        publishedAt: null,
        source_count: draft.sourceRows.length,
        citation_count: draft.citationCount,
        source_date_status: {
          ...sourceDateCounts,
          status: sourceDateCounts.ambiguousEvidencePreserved > 0
            ? 'AMBIGUOUS SOURCE DATE EVIDENCE PRESERVED; not an article publication-date blocker'
            : 'SOURCE DATES PRESERVED; not article publication metadata',
        },
        similarity_status: {
          status: unresolvedSimilarities.length === 0
            ? 'REVIEWED — no unresolved true duplicates'
            : `BLOCKED — ${unresolvedSimilarities.length} unresolved A-class pairs`,
          reviewedPairCount: reviewedPairs.length,
          classificationCounts: reviewedClassCounts,
          unresolvedPairCount: unresolvedSimilarities.length,
        },
        content_type_status: contentTypeAdjudication
          ? {
              status: contentTypeAdjudication.finalStatus,
              manualDecision: contentTypeAdjudication.manualDecision,
              rationale: contentTypeAdjudication.rationale,
            }
          : {
              status: draft.typeFit.status,
              manualDecision: 'No warning; assigned type retained',
              rationale: 'Structural signals were checked against the completed draft and its evidence profile.',
            },
        topic: draft.topic || UNKNOWN,
        entities: {
          linked: [],
          titleDekMentions: draft.mentionedEntities,
          status: 'No structured entity relationships defined in the source draft.',
        },
        searchIntent: `Informational: ${draft.dek}`,
        searchIntentBasis: 'Derived from the actual proposed dek; not a keyword-volume claim.',
        sourceCount: draft.citationKeys.length,
        citationCount: draft.citationCount,
        primarySourceStatus: `PRIMARY ${classifiedPrimary}; SECONDARY ${classifiedSecondary}; UNKNOWN ${unknownPrimary}`,
        researchReportRelationships: {
          explicitRelatedCoverage: draft.relatedCoverage || UNKNOWN,
          resolvedCandidateSlugs: draft.relatedSlugs,
          unresolvedReferences: result.unresolvedRelatedReferences ?? [],
          maintainedResearchOrReportRecords: [],
        },
        research: researchLinks,
        report: reportLinks,
        timeline: {
          links: [],
          status: 'No timeline relationship asserted; no unsupported event was added.',
        },
        internal_links: internalLinks,
        internalLinkCount: 0,
        fixtureInternalLinkCount: result.fixtureInternalLinkCount ?? 0,
        mobileMetrics: result.mobileMetrics ?? null,
        SEO: {
          status: result.seoStatus ?? 'NOT RUN',
          title: result.title ?? false,
          description: result.description ?? false,
          canonical: result.canonical ?? false,
          openGraph: result.openGraph ?? false,
          socialMetadata: result.socialMetadata ?? false,
          jsonLd: result.jsonLd ?? false,
          organizationAuthor: result.jsonLdAuthor ?? false,
        },
        AMP: {
          status: result.ampStatus ?? 'NOT RUN',
          articleRelationship: result.amp ?? false,
          canonicalRelationship: result.ampCanonicalRelationship ?? false,
        },
        indexability: {
          status: result.indexabilityStatus ?? 'NOT RUN',
          stagingPolicy: 'The 70 records remain drafts and are not publicly indexed; fixture sitemap checks are disposable only.',
        },
        mobile: {
          status: result.mobile ?? 'NOT RUN',
          metrics: result.mobileMetrics ?? null,
        },
        first_response: {
          status: result.firstResponseStatus ?? 'NOT RUN',
          organizationByline: result.bylinePresentInFirstResponse ?? false,
          fixturePublicationDateOnly: result.fixturePublicationDatePresent ?? false,
        },
        jsonLdAuthor: result.jsonLdAuthor ?? false,
        security: {
          status: rowSecurityStatus,
          rawScannerStatus: securityScanSummary.status ?? 'NOT RUN',
          releaseDisposition: securityReleaseStatus,
          scanners: securityScanSummary.scanners ?? {},
          runtimeAssessment: securityRuntimeAssessment,
        },
        staging: {
          status: result.stagingStatus ?? 'NOT RUN',
          publicationState: 'draft',
          publishedAt: null,
          productionEditorialDataChanged: false,
        },
        seoStatus: result.seoStatus ?? 'NOT RUN',
        ampStatus: result.ampStatus ?? 'NOT RUN',
        indexability: result.indexabilityStatus ?? 'NOT RUN',
        mobileStatus: result.mobile ?? 'NOT RUN',
        firstResponseStatus: result.firstResponseStatus ?? 'NOT RUN',
        qualityStatus: `${draft.typeFit.status}; reviewed source evidence; organization byline assigned; draft publication date correctly remains null`,
        contentTypeFit: {
          status: draft.typeFit.status,
          staticCues: draft.typeFit.cues,
          method: 'deterministic structural signals; not a replacement for the completed claim/source review',
        },
        duplicateSearchIntentStatus: alerts.length
          ? 'REVIEW — lexical similarity alert; manual intent review needed'
          : 'NO HIGH LEXICAL MATCH; semantic review is not inferred',
        duplicateAlerts: alerts,
        authorityGraphStatus: result.fixtureAuthorityGraph
          ? 'FIXTURE EDGES VERIFIED; actual Authority Registry remains unmodified'
          : 'NOT REGISTERED — draft remains outside maintained content',
        fixtureAuthorityGraph: result.fixtureAuthorityGraph ?? {
          topic: UNKNOWN,
          topicEdge: false,
          sourceEdges: 0,
          relatedEdges: 0,
          entityEdges: 0,
          timelineEdges: 0,
          researchReportRecordEdges: 0,
        },
        aiComputeIndiaCluster: /indiaai|india ai|compute access|gpu-hour|ai compute/i.test(`${draft.title} ${draft.dek} ${draft.topic}`)
          ? 'RELEVANT BY TITLE/DEK; candidate-only link not published'
          : 'NOT FLAGGED — no direct title/dek evidence',
        smallModelsCluster: /small model|compact model|efficient ai|local inference|on-device|serious workflow/i.test(`${draft.title} ${draft.dek} ${draft.topic}`)
          ? 'RELEVANT BY TITLE/DEK; candidate-only link not published'
          : 'NOT FLAGGED — no direct title/dek evidence',
        publicationEligibility: persistWorkspaceDraftStage
          ? 'DRAFT — workspace staging only; awaiting a human Publish action'
          : 'PRIVATE — in-memory validation only; not staged or published',
        actualAuthor: HOUSE_AUTHOR.name,
        authorType: HOUSE_AUTHOR.authorType,
        actualPublicationDate: draft.actualPublicationDate,
        actualPublicationDateStatus: draft.actualPublicationDate === null
          ? 'UNKNOWN / NOT AVAILABLE — no approved article publication date'
          : 'CONFIRMED',
        wordCount: draft.wordCount,
        sourceFile: draft.file,
        evidenceNote: draft.evidenceNote || UNKNOWN,
        stagingStatus: persistWorkspaceDraftStage
          ? 'STAGED — workspace-only draft; publishedAt:null'
          : 'NOT STAGED — private in-memory validation only; publishedAt:null',
        technicalIssues: result.technicalIssues ?? [],
      };
    });
    const stagedArticles = drafts.map((draft) => {
      const result = candidateResults.get(draft.slug)!;
      const internalLinks = stagingLinkEdges.filter((edge) => edge.fromSlug === draft.slug);
      const sourceDateStatus = {
        normalized: draft.sourceRows.filter((source) => source.publicationDate !== UNKNOWN).length,
        ambiguousEvidencePreserved: draft.sourceRows.filter((source) =>
          source.publicationDate === UNKNOWN && source.publicationDateEvidence.length > 0,
        ).length,
        unavailableWithoutDateEvidence: draft.sourceRows.filter((source) =>
          source.publicationDate === UNKNOWN && source.publicationDateEvidence.length === 0,
        ).length,
      };
      const reviewedPairs = semanticPairsBySlug.get(draft.slug) ?? [];
      const reviewClasses = reviewedPairs.reduce<Record<string, number>>((counts, pair) => {
        counts[pair.classification] = (counts[pair.classification] ?? 0) + 1;
        return counts;
      }, {});
      const contentTypeAdjudication = contentTypeReview.contentTypeReviews.find((item) => item.slug === draft.slug);
      const rowsForResearch = internalLinks.filter((edge) => edge.toKind === 'research');
      const rowsForReports = internalLinks.filter((edge) =>
        edge.toKind === 'report' || edge.toContentType === 'Report',
      );
      return {
        slug: draft.slug,
        segment: draft.contentType,
        title: draft.title,
        author: HOUSE_AUTHOR.name,
        authorSlug: HOUSE_AUTHOR.slug,
        author_type: HOUSE_AUTHOR.authorType,
        publication_state: 'draft',
        draftCreatedAt: FIXTURE_NOW.toISOString(),
        updatedAt: FIXTURE_NOW.toISOString(),
        publishedAt: null,
        source_count: draft.sourceRows.length,
        citation_count: draft.citationCount,
        source_date_status: sourceDateStatus,
        similarity_status: {
          status: reviewedPairs.every((pair) => pair.classification !== 'A')
            ? 'REVIEWED — no unresolved true duplicates'
            : 'BLOCKED — unresolved A-class duplicate pair',
          reviewedPairCount: reviewedPairs.length,
          classificationCounts: reviewClasses,
          unresolvedPairCount: reviewedPairs.filter((pair) => pair.classification === 'A').length,
        },
        content_type_status: contentTypeAdjudication
          ? {
              status: contentTypeAdjudication.finalStatus,
              manualDecision: contentTypeAdjudication.manualDecision,
              rationale: contentTypeAdjudication.rationale,
            }
          : {
              status: draft.typeFit.status,
              manualDecision: 'No warning; assigned type retained',
              rationale: 'The completed draft was checked against the assigned editorial form.',
            },
        topic: draft.topic || UNKNOWN,
        entities: {
          linked: [],
          titleDekMentions: draft.mentionedEntities,
          status: 'No unsupported entity edge added.',
        },
        research: rowsForResearch,
        report: rowsForReports,
        timeline: [],
        internal_links: internalLinks,
        content: {
          category: draft.category,
          classification: draft.classification,
          dek: draft.dek,
          body: draft.bodySections,
          citations: draft.citationKeys,
          sources: draft.sourceRows.map((source, index) => ({
            citationKey: draft.citationKeys[index] ?? source.citationKeys[0] ?? UNKNOWN,
            capturePath: source.capturePath,
            url: source.exactUrl,
            title: source.title,
            publisher: source.publisher,
            publicationDate: source.publicationDate,
            publicationDateEvidence: source.publicationDateEvidence,
            fetchedDate: source.fetchedDate,
            evidenceClass: source.evidenceClass,
            primarySecondary: source.primarySecondary,
            relevanceContext: source.relevanceContext,
          })),
          explicitRelatedCoverage: draft.relatedCoverage || UNKNOWN,
          relatedCandidateSlugs: draft.story.relatedStories,
          entityMentions: draft.mentionedEntities,
          timelineSlugs: [],
        },
        SEO: {
          status: result.seoStatus ?? 'NOT RUN',
          canonical: getCanonicalUrl(`/article/${draft.slug}`),
          ampPath: `/amp/article/${draft.slug}/`,
          firstResponseMetadataPass: Boolean(result.title && result.description && result.canonical && result.jsonLd),
        },
        AMP: {
          status: result.ampStatus ?? 'NOT RUN',
          route: `/amp/article/${draft.slug}/`,
          relationshipPass: Boolean(result.ampCanonicalRelationship),
        },
        indexability: {
          status: 'NO PUBLIC INDEX ENTRY WHILE DRAFT',
          fixtureRouteStatus: result.indexabilityStatus ?? 'NOT RUN',
        },
        mobile: {
          status: result.mobile ?? 'NOT RUN',
          metrics: result.mobileMetrics ?? null,
        },
        first_response: {
          status: result.firstResponseStatus ?? 'NOT RUN',
          organizationByline: result.bylinePresentInFirstResponse ?? false,
          fixtureOnlyDate: result.fixturePublicationDatePresent ?? false,
        },
        security: {
          status: securityReleaseStatus,
          rawScannerStatus: securityScanSummary.status ?? 'NOT RUN',
          scanners: securityScanSummary.scanners ?? {},
          runtimeAssessment: securityRuntimeAssessment,
        },
        staging: {
          status: 'DRAFT — workspace-only; not sent to editorial API or release database',
          productionEditorialDataChanged: false,
          publicationAutomationTriggered: false,
          relatedOverlayEdgeCount: internalLinks.length,
          similarityReviewClasses: reviewClasses,
        },
      };
    });
    assert.equal(stagedArticles.length, 70);
    assert.ok(stagedArticles.every((article) => article.publication_state === 'draft'));
    assert.ok(stagedArticles.every((article) => article.publishedAt === null));
    assert.ok(stagedArticles.every((article) => !Object.hasOwn(article, 'publishAt') && !Object.hasOwn(article, 'date')));
    assert.ok(stagedArticles.every((article) =>
      article.author_type === 'organization' && article.author === HOUSE_AUTHOR.name,
    ));
    const stagedManifest = {
      format: 'global-ai-news-editorial-draft-stage/v1',
      generatedAt: FIXTURE_NOW.toISOString(),
      status: 'WORKSPACE-ONLY DRAFT STAGING — AWAITING HUMAN PUBLISH',
      bylinePolicy: {
        type: 'organization',
        name: HOUSE_AUTHOR.name,
        slug: HOUSE_AUTHOR.slug,
        personalProfileCreated: false,
      },
      publicationPolicy: {
        publicationState: 'draft',
        publishedAt: null,
        publishAtIncluded: false,
        draftCreatedAtAndUpdatedAtStoredSeparately: true,
        humanPublishRequired: true,
        automaticPublicationTriggered: false,
      },
      authorityLinks: {
        curatedOverlayFile: path.basename(overlayPath),
        curatedOverlayEdges: overlayEdges.length,
        reciprocalCandidateEdgesAdded: reciprocalCandidateEdges.length,
        totalStagedLinks: stagingLinkEdges.length,
        publicLinksAdded: 0,
        authorityRegistryChanged: false,
      },
      sourceDatePolicy: 'Source publication-date evidence stays on source records; it is never copied into article publication metadata.',
      productionEditorialDataChanged: false,
      articles: stagedArticles,
    };
    if (persistWorkspaceDraftStage) {
      writeFileSync(stagingManifestFile, `${JSON.stringify(stagedManifest, null, 2)}\n`);
    }
    const fullSmokeStatus = process.env.RELEASE_FULL_SMOKE_STATUS ?? 'NOT RUN';
    const stagedDraftCount = stagedArticles.filter((article) =>
      article.publication_state === 'draft' && article.publishedAt === null,
    ).length;
    const releaseReady = persistWorkspaceDraftStage
      && stagedDraftCount === 70
      && drafts.every((draft) => draft.actualPublicationDate !== null)
      && fullSmokeStatus === 'PASS'
      && securityReleaseGatePassed
      && semanticReview.unresolvedAClassCount === 0
      && contentTypeReview.count === contentTypeReview.manualFitCount
      && graphIssues.length === 0
      && unresolvedRelated.length === 0
      && matrixRows.every((row) => row.technicalIssues.length === 0 && row.jsonLdAuthor === true);
    const report = {
      generatedAt: FIXTURE_NOW.toISOString(),
      overallStatus: releaseReady ? 'READY FOR HUMAN PUBLISH' : 'BLOCKED — release gates remain',
      fixture: {
      isolation: 'disposable in-memory API snapshot + isolated Vite dev web process; DATABASE_URL and REPL_ID removed',
        databaseUrlAvailableToTestProcess: false,
        databaseOrReleaseTablesUsed: false,
        editorialAutomationTriggered: false,
        productionWrites: false,
        staticAssetTreeUnchanged: hashTree(publicPath) === publicAssetHash,
        fixtureRenderDate: FIXTURE_NOW.toISOString(),
        simulationWarning: 'The fixture date exists only to exercise private route rendering and is not used as a draft publication date; all candidate publishedAt values are null.',
        eligibleCandidateCount: eligibleDrafts.length,
        totalCandidateCount: drafts.length,
      },
      totals: {
        articles: drafts.length,
        bySegment: Object.fromEntries(families.map((family) => [
          family.contentType,
          drafts.filter((draft) => draft.contentType === family.contentType).length,
        ])),
        citations: drafts.reduce((sum, draft) => sum + draft.citationCount, 0),
        citedKeys: citationKeys.size,
        sourceMapRows: crosswalk.rows.length,
        sourceCaptureFiles: captures.length,
        unresolvedRelatedReferences: unresolvedRelated,
        duplicateAlerts: duplicateAlerts.length,
        authorityGraphIssues: graphIssues,
        technicalRouteIssues: matrixRows.flatMap((row) => row.technicalIssues.map((issue) => `${row.slug}: ${issue}`)),
        unavailableAuthors: 0,
        unavailablePublicationDates: drafts.filter((draft) => draft.actualPublicationDate === null).length,
        stagedDrafts: persistWorkspaceDraftStage ? stagedDraftCount : 0,
        nullPublishedAtDrafts: stagedArticles.filter((article) => article.publishedAt === null).length,
      },
      sourceMetadata: {
        file: path.basename(sourceMetadataFile),
        coverage: normalizedFieldCoverage,
        note: 'Raw publication/fetch evidence is preserved separately; only unambiguous full publication dates are normalized, and fetch dates are never substituted for publication dates.',
      },
      linkValidation: {
        sourceMapRows: crosswalk.rows.length,
        citedKeys: citationKeys.size,
        citationMarkers: drafts.reduce((sum, draft) => sum + draft.citationCount, 0),
        capturePathsResolvable: captures.every((capture) => existsSync(path.join(root, capture.capturePath))),
        unresolvedRelatedReferences: unresolvedRelated,
        actualPublicCandidateInternalLinks: 0,
        curatedDraftOnlyOverlayEdges: overlayEdges.length,
        reciprocalCandidateLinks: reciprocalCandidateEdges.length,
        totalWorkspaceStagedInternalLinks: stagingLinkEdges.length,
        fixtureOnlyInternalAnchorCount: matrixRows.reduce((sum, row) => sum + (row.fixtureInternalLinkCount ?? 0), 0),
        interpretation: 'All curated overlay edges and reciprocal candidate links are stored in the workspace-only draft manifest. Candidate links remain absent from maintained content and production.',
      },
      securityAndRegression: {
        fullSmoke: fullSmokeStatus,
        candidateSpecificValidation: 'Fresh disposable in-memory snapshot and isolated Vite route fixture.',
        releaseSecurityDisposition: securityReleaseStatus,
        runtimeExposureAssessment: securityRuntimeAssessment,
        externalSecurityScans: securityScanSummary,
      },
      performance: {
        measurementContext: '402px Chromium mobile emulation against an isolated Vite dev server and disposable API; transfer, TTFB, and LCP are not production performance estimates.',
        representativeMobileMetrics: matrixRows
          .filter((row) => families.find((family) => family.contentType === row.segment) && row.mobileMetrics)
          .slice(0, 7)
          .map((row) => ({ slug: row.slug, ...row.mobileMetrics })),
        mobileCaptureDirectory: mobileBrowser?.capturesDirectory ?? UNKNOWN,
      },
      articles: matrixRows,
      releaseDecision: {
        status: releaseReady ? 'READY FOR HUMAN PUBLISH' : 'BLOCKED — one or more validation/security gates did not pass',
        blockers: [
          ...(persistWorkspaceDraftStage ? [] : ['Workspace staging is disabled; all candidates remain private fixture data.']),
          ...(drafts.every((draft) => draft.actualPublicationDate !== null)
            ? []
            : ['Approved article publication dates are unavailable for one or more drafts.']),
          ...(fullSmokeStatus === 'PASS' ? [] : ['Full regression smoke suite has not passed in the current validation run.']),
          ...(securityReleaseGatePassed ? [] : ['Security scanners have unresolved findings and no validated non-runtime exception.']),
          ...(stagedDraftCount === 70 ? [] : [`Only ${stagedDraftCount}/70 records are staged as drafts.`]),
          ...(semanticReview.unresolvedAClassCount === 0 ? [] : ['Unresolved true-duplicate alerts remain.']),
          ...(contentTypeReview.count === contentTypeReview.manualFitCount ? [] : ['Content-type warning reviews are incomplete.']),
          ...(graphIssues.length === 0 && unresolvedRelated.length === 0 ? [] : ['Staged authority or related-story links are unresolved.']),
          ...(matrixRows.every((row) => row.technicalIssues.length === 0 && row.jsonLdAuthor === true)
            ? []
            : ['One or more candidate routes failed first-response, author, or technical checks.']),
        ],
        byline: { name: HOUSE_AUTHOR.name, type: 'organization', policy: 'batch editorial-desk byline; no person/profile invented' },
        publicationMetadata: {
          state: 'draft',
          publishedAt: null,
          publishAt: null,
          publicationDateManufactured: false,
          humanPublishRequired: true,
        },
        workspaceOnlyManifest: persistWorkspaceDraftStage ? path.basename(stagingManifestFile) : null,
        productionEditorialDataChanged: false,
        automationTriggered: false,
      },
      sourceDateReview: {
        file: path.basename(path.join(portfolioRoot, 'source-date-review.json')),
        normalizedPublicationDates: normalizedFieldCoverage.publicationDateAvailable,
        ambiguousOrUnnormalizedEvidence: normalizedFieldCoverage.publicationDateEvidenceUnnormalized,
        unresolvedEvidenceRows: sourceDateReview.unresolvedEvidence.length,
        status: 'RECONCILED — source-date ambiguity is preserved and is not article-publication metadata.',
      },
      contentTypeReview: {
        file: path.basename(path.join(portfolioRoot, 'content-type-review.json')),
        warningsReviewed: contentTypeReview.count,
        manualFit: contentTypeReview.manualFitCount,
        unresolvedWarnings: contentTypeReview.count - contentTypeReview.manualFitCount,
        status: contentTypeReview.status,
      },
      semanticSimilarityReview: {
        file: path.basename(path.join(portfolioRoot, 'semantic-pair-review.json')),
        alerts: duplicateAlerts.length,
        classificationCounts: semanticReview.classificationCounts,
        unresolvedAClassCount: semanticReview.unresolvedAClassCount,
        status: semanticReview.unresolvedAClassCount === 0
          ? 'PASS — all pairs adjudicated; lexical/topic overlap is not a true duplicate blocker'
          : 'BLOCKED — unresolved A-class pairs remain',
      },
      draftOnlyLinkOverlay: {
        file: path.basename(overlayPath),
        status: 'STAGED — workspace-only; not served publicly',
        edgeCount: overlayEdges.length,
        targetCounts: overlayCounts,
        reciprocalCandidateEdges: reciprocalCandidateEdges.length,
        totalStagedLinks: stagingLinkEdges.length,
        publicLinksAdded: 0,
        authorityRegistryModified: false,
      },
      authorityGraphIntegration: {
        fixtureExistingEdges: {
          source: graph.filter((edge) => edge.relationship === 'cites').length,
          related: graph.filter((edge) => edge.relationship === 'related').length,
          entity: graph.filter((edge) => edge.relationship === 'mentions').length,
          timeline: graph.filter((edge) => edge.relationship === 'timeline').length,
          researchReportRecord: 0,
        },
        workspaceStagedOverlayEdges: stagingLinkEdges.length,
        actualAuthorityRegistryModified: false,
        actualPublicCandidateInternalLinks: 0,
      },
    };
    writeFileSync(matrixFile, `${JSON.stringify(report, null, 2)}\n`);

    const unexpectedTechnicalIssues = report.totals.technicalRouteIssues;
    assert.deepEqual(unexpectedTechnicalIssues, [], `technical route failures were recorded in ${matrixFile}`);
    assert.deepEqual(graphIssues, [], `candidate fixture authority edges were recorded in ${matrixFile}`);
    assert.deepEqual(unresolvedRelated, [], `broken explicit related-coverage references were recorded in ${matrixFile}`);
    assert.ok(hashTree(publicPath) === publicAssetHash, 'the in-memory publication flow must not change built files');
    process.stdout.write(`70-ARTICLE MATRIX: ${matrixFile}\n`);
    process.stdout.write(`SOURCE NORMALIZATION: ${sourceMetadataFile}\n`);
    process.stdout.write(`MOBILE CAPTURES: ${mobileBrowser?.capturesDirectory ?? UNKNOWN}\n`);
    process.stdout.write(`ELIGIBLE IN TEST: ${eligibleDrafts.length}/70; SOURCE FIELDS: ${JSON.stringify(normalizedFieldCoverage)}\n`);
    process.stdout.write(`DUPLICATE ALERTS: ${duplicateAlerts.length}; AUTHORITY EDGES: ${graph.length}; resolved relation errors: ${unresolvedRelated.length}\n`);
  } finally {
    await mobileBrowser?.close();
    await stopProcess(webProcess);
    await close(proxyServer);
    await close(apiServer);
    sources.splice(sourceLengthBefore);
    topicRecords.splice(topicLengthBefore);
  }
});