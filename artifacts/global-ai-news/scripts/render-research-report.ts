import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sources, type BodySection } from '../src/content';
import { indiaAiComputeReport as report } from '../src/reports/india-ai-compute-2026';

function textsInSection(section: BodySection): string[] {
  return [
    section.heading,
    ...section.paragraphs,
    ...(section.pullQuote ? [section.pullQuote] : []),
    ...(section.table
      ? [
          ...(section.table.caption ? [section.table.caption] : []),
          ...section.table.headers,
          ...section.table.rows.flatMap((row) => row.cells),
        ]
      : []),
  ];
}

const editorialTexts = [
  report.title,
  report.dek,
  report.bottomLine,
  report.whyItMatters,
  ...report.keyTakeaways,
  ...report.body.flatMap(textsInSection),
  report.whatChanges,
];
const citationKeys: string[] = [];
const citationPattern = /\[@([a-z0-9-]+)\]/g;
for (const text of editorialTexts) {
  for (const match of text.matchAll(citationPattern)) {
    if (!citationKeys.includes(match[1])) citationKeys.push(match[1]);
  }
}

const sourceBySlug = new Map(sources.map((source) => [source.slug, source]));
const unknownCitationKeys = citationKeys.filter((slug) => !sourceBySlug.has(slug));
const omittedCitationKeys = citationKeys.filter((slug) => !report.sources.includes(slug));
const unusedStorySources = report.sources.filter((slug) => !citationKeys.includes(slug));
const orderMismatches = report.sources.flatMap((slug, index) =>
  slug === citationKeys[index] ? [] : [`${index + 1}: declared ${slug}; first cited ${citationKeys[index] ?? '(none)'}`],
);
if (unknownCitationKeys.length || omittedCitationKeys.length || unusedStorySources.length || orderMismatches.length) {
  throw new Error(
    `Citation integrity failed. Unknown: ${unknownCitationKeys.join(', ') || 'none'}; ` +
      `not in story source order: ${omittedCitationKeys.join(', ') || 'none'}; ` +
      `unused: ${unusedStorySources.join(', ') || 'none'}; order mismatches: ${orderMismatches.join('; ') || 'none'}.`,
  );
}

function citationNumber(slug: string): number {
  const index = report.sources.indexOf(slug);
  if (index < 0) throw new Error(`Citation ${slug} is missing from the ordered source list.`);
  return index + 1;
}

function renderCitations(text: string): string {
  return text.replace(citationPattern, (_marker, slug: string) => {
    const source = sourceBySlug.get(slug);
    if (!source) throw new Error(`Citation source ${slug} does not exist.`);
    return `[[${citationNumber(slug)}](${source.url})]`;
  });
}

function tableCell(value: string): string {
  return renderCitations(value).replaceAll('|', '\\|').replace(/\s+/g, ' ').trim();
}

const wordCountText = editorialTexts
  .join(' ')
  .replace(citationPattern, ' ')
  .replace(/https?:\/\/\S+/g, ' ')
  .trim();
const wordCount = wordCountText ? wordCountText.split(/\s+/).length : 0;
if (wordCount < 3500 || wordCount > 5000) {
  throw new Error(`Flagship report prose must be 3,500–5,000 words; current count is ${wordCount}.`);
}
if (citationKeys.length < 15) {
  throw new Error(`Flagship report needs at least 15 distinct cited sources; current count is ${citationKeys.length}.`);
}

const sections = report.body.map((section) => {
  const paragraphs = section.paragraphs.map(renderCitations).join('\n\n');
  const quote = section.pullQuote ? `\n\n> ${renderCitations(section.pullQuote)}` : '';
  const table = section.table
    ? [
        '',
        ...(section.table.caption ? [`_${renderCitations(section.table.caption)}_`, ''] : []),
        `| ${section.table.headers.map(tableCell).join(' | ')} |`,
        `| ${section.table.headers.map(() => '---').join(' | ')} |`,
        ...section.table.rows.map((row) => `| ${row.cells.map(tableCell).join(' | ')} |`),
      ].join('\n')
    : '';
  return `## ${section.heading}\n\n${paragraphs}${quote}${table}`;
});

const citedSources = report.sources.map((slug) => {
  const source = sourceBySlug.get(slug)!;
  const metadata = [
    source.publisher,
    source.tier ? `Tier ${source.tier}` : undefined,
    source.publicationDate ? `published ${source.publicationDate}` : undefined,
    `accessed ${source.accessed}`,
  ].filter(Boolean).join(' · ');
  return `${citationNumber(slug)}. [${source.name}](${source.url}). ${metadata}.${source.scopeNote ? ` ${source.scopeNote}` : ''}`;
});

const markdown = [
  `# ${report.title}`,
  '',
  `_${report.dek}_`,
  '',
  `**Research date:** ${report.date}  `,
  `**By:** ${report.author}  `,
  `**Reading time:** ${report.readTime}  `,
  `**Evidence:** ${report.evidence}`,
  '',
  '## Bottom line',
  '',
  renderCitations(report.bottomLine),
  '',
  '## Why this matters',
  '',
  renderCitations(report.whyItMatters),
  '',
  '## Key takeaways',
  '',
  ...report.keyTakeaways.map((item) => `- ${renderCitations(item)}`),
  '',
  ...sections,
  '',
  '## What changes',
  '',
  renderCitations(report.whatChanges),
  '',
  `## Sources (${citationKeys.length})`,
  '',
  ...citedSources,
  '',
  `---\n\n**Report word count:** ${wordCount} (excluding citation markers, URLs and source list)`,
  '',
].join('\n');

const outputPath = resolve(process.cwd(), '../../research/india-ai-compute-2026.md');
await writeFile(outputPath, markdown, 'utf8');
console.log(`Wrote ${outputPath}`);
console.log(`Word count: ${wordCount}; distinct cited sources: ${citationKeys.length}`);