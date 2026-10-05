import assert from 'node:assert/strict';
import test from 'node:test';

import {
  authors,
  MINIMUM_STORY_WORDS,
  getStoryAuthorIdentity,
  getStoryReadTime,
  getStoryWordCount,
  scheduledStories,
  sources,
  stories,
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