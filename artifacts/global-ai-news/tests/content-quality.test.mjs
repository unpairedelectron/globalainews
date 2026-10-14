import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  askGlobalAnswers,
  authors,
  canonicalStorySlug,
  entities,
  findEntity,
  findStory,
  getPublishedStories,
  MINIMUM_STORY_WORDS,
  getStoryAuthorIdentity,
  getStoryReadTime,
  getStoryWordCount,
  scheduledStories,
  sources,
  stories,
  timelineEvents,
  withdrawnStorySlugs,
} from '../src/content.ts';
import { editorialPageCopy } from '../src/editorial-pages.ts';

test('all maintained and scheduled stories meet the minimum word count', () => {
  const allStories = [...stories, ...scheduledStories];
  const underMinimum = allStories
    .map((story) => ({ slug: story.slug, words: getStoryWordCount(story) }))
    .filter(({ words }) => words < MINIMUM_STORY_WORDS);

  assert.deepEqual(
    underMinimum,
    [],
    `Stories below ${MINIMUM_STORY_WORDS} words: ${JSON.stringify(underMinimum)}`,
  );
});

test('the three revised scheduled stories are sourced, classified, and correctly dated', () => {
  const reviewedSlugs = [
    'reliability-is-the-new-ai-moat',
    'public-compute-needs-public-metrics',
    'weekly-deep-dive-cost-of-intelligence',
  ];

  for (const slug of reviewedSlugs) {
    const story = scheduledStories.find((candidate) => candidate.slug === slug);
    assert.ok(story, `missing reviewed scheduled story ${slug}`);
    assert.equal(story.contentType, 'Analysis');
    assert.equal(story.classification, 'analysis');
    assert.equal(story.dateModified, '2026-10-05');
    assert.equal(story.readTime, getStoryReadTime(story));
    assert.ok(getStoryWordCount(story) >= MINIMUM_STORY_WORDS);

    const citedText = [
      story.bottomLine,
      story.whyItMatters,
      story.whatChanges,
      ...story.keyTakeaways,
      ...story.body.flatMap((section) => section.paragraphs),
    ].join(' ');
    const citationSlugs = [...citedText.matchAll(/\[@([a-z0-9-]+)\]/g)].map((match) => match[1]);
    assert.ok(citationSlugs.length > 0, `${slug} has no inline source citations`);
    assert.ok(
      citationSlugs.every((sourceSlug) => story.sources.includes(sourceSlug)),
      `${slug} cites a source missing from its source list`,
    );
    assert.ok(
      story.sources.every((sourceSlug) => sources.some((source) => source.slug === sourceSlug)),
      `${slug} references a source missing from the source registry`,
    );
  }
});

test('every public story has complete, registered inline citations and a derived read time', () => {
  const publicStories = getPublishedStories(new Date('2026-10-12T23:59:59.999Z'));
  const publicStorySlugs = new Set(publicStories.map((story) => story.slug));
  const sourceSlugs = new Set(sources.map((source) => source.slug));

  for (const slug of withdrawnStorySlugs) {
    assert.equal(publicStorySlugs.has(slug), false, `${slug} must remain outside public stories`);
    assert.equal(findStory(slug), undefined, `${slug} must not resolve as a public article`);
  }

  for (const story of publicStories) {
    assert.ok(getStoryWordCount(story) >= MINIMUM_STORY_WORDS, `${story.slug} is below the editorial minimum`);
    assert.equal(story.readTime, getStoryReadTime(story), `${story.slug} has a stale read time`);

    const visibleCopy = [
      story.title,
      story.dek,
      story.bottomLine,
      story.whyItMatters,
      story.whatChanges,
      ...story.keyTakeaways,
      ...story.body.flatMap((section) => [
        section.heading,
        ...section.paragraphs,
        section.pullQuote ?? '',
        section.table?.caption ?? '',
        ...(section.table?.rows.flatMap((row) => row.cells) ?? []),
      ]),
    ].join(' ');
    const citations = [...new Set(
      [...visibleCopy.matchAll(/\[@([a-z0-9-]+)\]/g)].map((match) => match[1]),
    )];

    assert.ok(citations.length > 0, `${story.slug} has no inline citations`);
    assert.ok(
      citations.every((slug) => story.sources.includes(slug)),
      `${story.slug} cites a source missing from its source list`,
    );
    assert.ok(
      story.sources.every((slug) => sourceSlugs.has(slug)),
      `${story.slug} references a source missing from the registry`,
    );
    assert.ok(
      story.sources.every((slug) => citations.includes(slug)),
      `${story.slug} lists a source that is not cited in its visible copy`,
    );
    assert.ok(
      story.relatedStories.every((slug) => publicStorySlugs.has(canonicalStorySlug(slug))),
      `${story.slug} links to a withdrawn or unpublished story`,
    );
  }
});

test('public-facing answer and entity relationships do not point at withdrawn stories', () => {
  const publicStorySlugs = new Set(
    getPublishedStories(new Date('2026-10-06T23:59:59.999Z')).map((story) => story.slug),
  );
  const sourceSlugs = new Set(sources.map((source) => source.slug));
  const timelineSlugs = new Set(timelineEvents.map((event) => event.slug));
  const entitySlugs = new Set(entities.map((entity) => entity.slug));

  for (const answer of askGlobalAnswers) {
    assert.ok(answer.citedStories.length > 0, `${answer.slug} has no story citation`);
    assert.ok(answer.citedStories.every((slug) => publicStorySlugs.has(canonicalStorySlug(slug))));
    assert.ok(answer.citedSources.every((slug) => sourceSlugs.has(slug)));
    assert.ok(answer.citedTimeline.every((slug) => timelineSlugs.has(slug)));
    assert.ok(answer.citedEntities.every((slug) => entitySlugs.has(slug)));
  }

  for (const entity of entities) {
    const publicEntity = findEntity(entity.slug);
    assert.ok(publicEntity);
    assert.ok(
      publicEntity.recentStories.every((slug) => publicStorySlugs.has(canonicalStorySlug(slug))),
      `${entity.slug} links to a withdrawn or unpublished story`,
    );
  }
});

test('the all-story audit matrix matches the local snapshot without asserting production parity', () => {
  const matrix = JSON.parse(
    readFileSync(new URL('../../../docs/content-quality-matrix-v4.json', import.meta.url), 'utf8'),
  );
  const publicStories = getPublishedStories(new Date('2026-10-06T23:59:59.999Z'));
  const rowsBySlug = new Map(matrix.rows.map((row) => [row.slug, row]));

  assert.equal(matrix.auditDate, '2026-10-12');
  assert.equal(matrix.publicationQualityGate.publicStoriesAudited, publicStories.length);
  assert.equal(matrix.publicationQualityGate.storiesMeetingEditorialMinimum, publicStories.length);
  assert.equal(matrix.publicationQualityGate.productionEditorialRecordsChanged, false);
  assert.equal(matrix.publicationQualityGate.productionParityClaimed, false);
  assert.equal(rowsBySlug.size, publicStories.length, 'matrix rows must not duplicate or omit stories');

  for (const story of publicStories) {
    const row = rowsBySlug.get(story.slug);
    assert.ok(row, `matrix is missing ${story.slug}`);
    assert.equal(row.workspaceState, 'public in local snapshot');
    assert.equal(row.title, story.title);
    assert.equal(row.date, story.date);
    assert.equal(row.dateModified, story.dateModified ?? null);
    assert.equal(row.editorialWordCount, getStoryWordCount(story));
    assert.equal(row.bodyWords, story.body
      .flatMap((section) => [section.heading, ...section.paragraphs])
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length);
    assert.equal(row.readTime, story.readTime);
    assert.deepEqual(row.sourceSlugs, story.sources);
    assert.ok(row.editorialWordCount >= MINIMUM_STORY_WORDS);
  }
});

test('unverified contributors resolve to the described publication desk', () => {
  const deskIdentity = getStoryAuthorIdentity({
    author: 'unverified-contributor',
    authorType: 'organization',
    authorName: 'Unverified Contributor Name',
  }, []);
  assert.equal(deskIdentity.type, 'Organization');
  assert.equal(deskIdentity.name, 'Global AI News Editorial Desk');
  assert.match(deskIdentity.description, /source-linked reporting, analysis, research and reference material/);

  const verifiedPerson = {
    slug: 'verified-contributor',
    name: 'Verified Contributor',
    role: 'Editor',
    bio: 'Verified publication biography.',
    location: 'London',
    initials: 'VC',
    verifiedForPublication: true,
  };
  const personIdentity = getStoryAuthorIdentity({
    author: 'verified-contributor',
    authorType: 'organization',
    authorName: 'A conflicting unverified byline',
  }, [verifiedPerson]);
  assert.deepEqual(personIdentity, {
    type: 'Person',
    name: 'Verified Contributor',
    slug: 'verified-contributor',
  });
});

test('trust pages link to one another and do not invent a contact or corrections channel', () => {
  const trustPaths = ['/about-us', '/code-of-ethics', '/corrections', '/contact-us'];
  for (const path of trustPaths) {
    const page = editorialPageCopy[path];
    assert.ok(page.relatedLinks?.length, `${path} has no related trust-page links`);
    for (const link of page.relatedLinks) {
      assert.ok(trustPaths.includes(link.href), `${path} links to an unknown trust route`);
    }
  }

  const correctionsCopy = editorialPageCopy['/corrections'];
  const correctionsText = [correctionsCopy.intro, ...correctionsCopy.sections.map((section) => section.body)].join(' ');
  assert.match(correctionsText, /No approved public corrections or contact channel is available/);
  assert.match(correctionsText, /does not accept submissions/);
  assert.match(correctionsText, /not a way to report an issue/);

  const contactCopy = editorialPageCopy['/contact-us'];
  const contactText = [contactCopy.description, contactCopy.intro, ...contactCopy.sections.map((section) => section.body)].join(' ');
  assert.match(contactText, /cannot accept messages/);
  assert.match(contactText, /only for newsletter delivery/);
  assert.doesNotMatch(contactText, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
});