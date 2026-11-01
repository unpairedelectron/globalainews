import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draftDir = path.join(root, 'docs/editorial-drafts/articles');
const factDir = path.join(root, 'docs/fact-logs');
const output = path.join(root, 'release/manifest.json');
const dates = [
  [6, 'india-ai-consultation-paper-what-is-law', '2026-11-02'],
  [5, 'github-octoverse-2026-agents-pull-requests', '2026-11-03'],
  [4, 'gated-frontier-models-gemini-4-carbon', '2026-11-05'],
  [1, 'anthropic-s1-governance-who-controls', '2026-11-07'],
  [3, 'hyperscaler-capex-2026-reconciled', '2026-11-09'],
  [2, 'openai-containment-incident-offline-training', '2026-11-11'],
  [7, 'indiaai-10000-gpu-tender-explained', '2026-11-13'],
  [8, 'eu-ai-act-december-2026-deadlines', '2026-11-16'],
  [9, 'ai-in-workforce-plans-october-2026', '2026-11-18'],
  [10, 'ai-agents-delegated-access-banks-passwords', '2026-11-20'],
];

function plainText(markdown) {
  return markdown
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1 ($2)')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\|[-: |]+\|$/gm, '')
    .replace(/^\|/gm, '')
    .replace(/\|$/gm, '')
    .replace(/\s*\|\s*/g, ' — ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function wordCount(value) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

function readDraft(slug) {
  const file = path.join(draftDir, `${slug}.md`);
  if (!fs.existsSync(file)) throw new Error(`Missing article draft: ${slug}`);
  const markdown = fs.readFileSync(file, 'utf8');
  const meta = JSON.parse(fs.readFileSync(path.join(draftDir, `${slug}.meta.json`), 'utf8'));
  const firstBodyHeading = markdown.search(/^## /m);
  if (firstBodyHeading < 0) throw new Error(`No article body found: ${slug}`);
  const body = plainText(markdown.slice(firstBodyHeading));
  return { markdown, meta, body };
}

function readFacts(slug) {
  const markdown = fs.readFileSync(path.join(factDir, `${slug}.md`), 'utf8');
  const registers = new Map();
  const sourceSection = markdown.split(/^## Source register\s*$/m)[1] ?? '';
  for (const line of sourceSection.split('\n')) {
    const match = line.match(/^\s*\d+\.\s+(.+?)\s+Tier\s+([12])(?:[^:]*):\s*(https?:\/\/\S+)/i);
    if (match) registers.set(match[0].match(/^\s*(\d+)/)?.[1], { description: match[1], tier: Number(match[2]), url: match[3] });
  }
  const rows = [];
  for (const line of markdown.split('\n').filter((candidate) => candidate.startsWith('|'))) {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 4 || /^-+$/.test(cells[0].replace(/:/g, ''))) continue;
    if (cells[0] === 'Claim used in the draft') continue;
    const tag = cells[1].match(/\[([VS])\]/)?.[1];
    const sourceRef = cells[2].match(/\[(\d+)\]/)?.[1];
    const source = sourceRef ? registers.get(sourceRef) : undefined;
    if (tag && source) rows.push({ claim: cells[0], tag, source, limitation: cells[3] });
  }
  return rows;
}

function releaseAt(date) {
  return `${date}T07:30:00.000Z`;
}

function categoryFor(topic) {
  if (/india/i.test(topic)) return 'India Watch';
  if (/infrastructure|markets/i.test(topic)) return 'Infrastructure';
  if (/policy|compliance|governance/i.test(topic)) return 'Policy';
  if (/model/i.test(topic)) return 'Breakthroughs';
  return 'Field Notes';
}

const glossaryMarkdown = fs.readFileSync(path.join(root, 'docs/editorial-drafts/glossary.md'), 'utf8');
const glossaryTerms = [...glossaryMarkdown.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
const queue = [];
const briefIssues = [];
const signals = [];
const topicMap = new Map();
const glossaryLinks = [];
const discovery = [];

for (const [number, slug, date] of dates) {
  const { markdown, meta, body } = readDraft(slug);
  const facts = readFacts(slug);
  const verified = facts.filter((fact) => fact.tag === 'V');
  if (verified.length < 3) throw new Error(`${slug} has fewer than three verified fact-log rows`);
  const publishAt = releaseAt(date);
  const payload = {
    slug,
    title: meta.title,
    dek: meta.description,
    publishAt,
    cadence: 'daily',
    category: categoryFor(meta.topic),
    author: 'global-ai-news-editorial-desk',
    body,
  };
  queue.push({ articleNumber: number, sourceFile: `docs/editorial-drafts/articles/${slug}.md`, input: payload });

  const selectedFacts = verified.slice(0, 3);
  const briefBody = [
    `This dated Daily Brief follows ${meta.title}. It draws only on the checked fact log for this article and keeps each claim within its recorded scope.`,
    ...selectedFacts.map((fact, index) =>
      `${index + 1}. ${fact.claim} Source: ${fact.source.description}, Tier ${fact.source.tier}. Qualification: ${fact.limitation}`,
    ),
    'This issue does not extend those source checks into a broader market, legal, or operational conclusion.',
  ].join('\n\n');
  if (wordCount(briefBody) < 120 || wordCount(briefBody) > 220) {
    throw new Error(`${slug} Daily Brief has ${wordCount(briefBody)} words; expected 120–220`);
  }
  briefIssues.push({
    slug: `brief-${date}`,
    articleSlug: slug,
    publishAt,
    input: {
      slug: `brief-${date}`,
      title: `Daily Brief — ${new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}`,
      dek: `A dated briefing on ${meta.title}, limited to checked claims in the existing fact log.`,
      publishAt,
      cadence: 'daily',
      category: categoryFor(meta.topic),
      author: 'global-ai-news-editorial-desk',
      body: briefBody,
      section: 'Brief',
    },
    facts: selectedFacts.map((fact) => ({ claim: fact.claim, source: fact.source.url, tier: fact.source.tier, limitation: fact.limitation })),
  });
  const fact = verified[0];
  signals.push({
    slug: `${slug}-verified-signal`,
    articleSlug: slug,
    label: meta.title,
    value: fact.claim,
    date,
    publishAt,
    source: fact.source.url,
    tier: fact.source.tier,
    confidence: fact.tag === 'V' ? 'high' : 'developing',
    evidenceTag: fact.tag,
  });
  const topicSlug = meta.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const topic = topicMap.get(topicSlug) ?? {
    slug: topicSlug,
    label: meta.topic,
    route: '/topics',
    description: `Dated reporting filed under ${meta.topic}.`,
    storySlugs: [],
    effectiveAt: publishAt,
    indexable: false,
  };
  topic.storySlugs.push(slug);
  if (publishAt < topic.effectiveAt) topic.effectiveAt = publishAt;
  topicMap.set(topicSlug, topic);

  const matches = glossaryTerms.filter((term) =>
    new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(markdown),
  );
  glossaryLinks.push({ articleSlug: slug, publishAt, route: '/staging/glossary/', terms: matches });
  discovery.push({
    articleSlug: slug,
    publishAt,
    sitemap: { include: true, effectiveAt: publishAt },
    newsSitemap: { include: true, effectiveAt: publishAt },
    rss: { include: true, effectiveAt: publishAt },
    topicRss: { include: true, effectiveAt: publishAt, topicSlug },
  });
}

const manifest = {
  schemaVersion: 'global-ai-news.release-manifest.v1',
  generatedFor: 'editor-only import; applying requires existing Clerk editor authorization',
  ownerCommercialDisclosureInput: 'NO',
  apiContract: {
    queueEndpoint: '/api/newsroom/releases',
    queueInputSchema: 'EditorialReleaseInput',
    requiredFields: ['slug', 'title', 'dek', 'publishAt', 'cadence', 'category', 'author', 'body'],
    publishTimezone: 'UTC',
    publishTime: '07:30:00Z',
  },
  queue,
  briefIssues,
  signals,
  topics: [...topicMap.values()],
  glossaryLinks,
  discovery,
  confidenceMapping: { V: 'high', S: 'developing' },
  correctionsLog: [],
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${queue.length} article inputs, ${briefIssues.length} briefs, ${signals.length} signals, ${topicMap.size} topics.`);
