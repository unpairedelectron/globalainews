import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

import { sources } from '../src/content.ts';
import { indiaAiComputeReport as report } from '../src/reports/india-ai-compute-2026.ts';

function editorialTexts() {
  return [
    report.title,
    report.dek,
    report.bottomLine,
    report.whyItMatters,
    ...report.keyTakeaways,
    ...report.body.flatMap((section) => [
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
    ]),
    report.whatChanges,
  ];
}

test('India AI compute flagship report meets the word-count and source-trail requirements', async () => {
  assert.equal(report.contentType, 'Report');
  const texts = editorialTexts();
  const prose = texts.join(' ').replace(/\[@[a-z0-9-]+\]/g, ' ').replace(/https?:\/\/\S+/g, ' ').trim();
  const wordCount = prose ? prose.split(/\s+/).length : 0;
  assert.ok(wordCount >= 3500 && wordCount <= 5000, `report has ${wordCount} words`);

  const citedKeys = [];
  const markers = /\[@([a-z0-9-]+)\]/g;
  for (const text of texts) {
    for (const match of text.matchAll(markers)) {
      if (!citedKeys.includes(match[1])) citedKeys.push(match[1]);
    }
  }
  assert.ok(citedKeys.length >= 15, `report cites only ${citedKeys.length} distinct sources`);
  assert.deepEqual(report.sources, citedKeys, 'source numbers must follow first appearance in the report');
  const sourceBySlug = new Map(sources.map((source) => [source.slug, source]));
  for (const slug of citedKeys) {
    const source = sourceBySlug.get(slug);
    assert.ok(source, `citation ${slug} has no maintained source record`);
    assert.ok(source.url.startsWith('https://'), `${slug} must have a public HTTPS URL`);
  }

  for (const section of report.body) {
    for (const paragraph of section.paragraphs) {
      assert.match(paragraph, /\[@[a-z0-9-]+\]/, `paragraph under "${section.heading}" lacks an inline source marker`);
    }
  }

  const markdown = await readFile(resolve(process.cwd(), '../../research/india-ai-compute-2026.md'), 'utf8');
  assert.ok(markdown.includes(`# ${report.title}`), 'generated research report is missing the maintained headline');
  assert.ok(markdown.includes(`## Sources (${citedKeys.length})`), 'generated research report source list is out of date');
  assert.ok(markdown.includes(`**Report word count:** ${wordCount}`), 'generated report word count is out of date');
});