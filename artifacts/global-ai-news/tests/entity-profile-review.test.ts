import assert from 'node:assert/strict';
import test from 'node:test';
import {
  entities,
  compareEntityProfileClaims,
  ENTITY_PROFILE_REVIEW_INTERVAL_DAYS,
  getEntityProfileClaims,
  getEntityProfileReviewReason,
  isEntityProfileReviewDue,
  normalizeEntityProfileReviews,
  getEntityProfileReviewQueueState,
} from '../src/content';

test('every expanded profile records its review date, status, and supporting primary references', () => {
  const profiles = entities.filter((entity) => entity.profileSections?.length);

  assert.equal(profiles.length, 10);
  assert.equal(ENTITY_PROFILE_REVIEW_INTERVAL_DAYS, 90);

  for (const profile of profiles) {
    assert.match(profile.profileReviewedAt ?? '', /^\d{4}-\d{2}-\d{2}$/u, profile.slug);
    assert.ok(profile.profileStatus === 'maintained' || profile.profileStatus === 'historical', profile.slug);
    assert.ok((profile.primaryReferences?.length ?? 0) > 0, profile.slug);
    assert.ok(profile.primaryReferences?.every((reference) => /^https:\/\//u.test(reference.url)), profile.slug);
    assert.equal(profile.profileReviewHistory?.length, 1, profile.slug);
    const [initialReview] = profile.profileReviewHistory ?? [];
    assert.equal(initialReview.reviewedAt, profile.profileReviewedAt, profile.slug);
    assert.deepEqual(initialReview.referencesChecked.map((reference) => reference.url), profile.primaryReferences?.map((reference) => reference.url), profile.slug);
    assert.ok(initialReview.referencesChecked.every((reference) =>
      reference.captureStatus === 'not-captured'
      && !reference.capturedAt
      && !reference.contentHash
      && /did not retain/u.test(reference.captureNote ?? ''),
    ), profile.slug);
    assert.match(initialReview.triggeringUpdate, /baseline review/i, profile.slug);
    assert.match(initialReview.claimChangeSummary, /no earlier profile snapshot/i, profile.slug);
  }

  assert.equal(entities.find((entity) => entity.slug === 'gpt-5')?.profileStatus, 'historical');
  assert.equal(entities.find((entity) => entity.slug === 'claude-4')?.profileStatus, 'historical');
});

test('a profile becomes due after 90 days without a linked update', () => {
  const profile = { profileReviewedAt: '2026-10-06', timeline: [] };
  const apiDateProfile = { profileReviewedAt: '2026-10-06T00:00:00.000Z', timeline: [] };

  assert.equal(isEntityProfileReviewDue(profile, new Date('2027-01-03T12:00:00Z'), []), false);
  assert.equal(isEntityProfileReviewDue(profile, new Date('2027-01-04T00:00:00Z'), []), true);
  assert.equal(getEntityProfileReviewReason(profile, new Date('2027-01-04T00:00:00Z'), []), 'interval');
  assert.equal(isEntityProfileReviewDue(apiDateProfile, new Date('2026-12-31T23:59:00Z'), []), false);
  assert.equal(isEntityProfileReviewDue({ profileReviewedAt: 'not-a-date', timeline: [] }, new Date(), []), true);
  assert.equal(getEntityProfileReviewReason({ profileReviewedAt: 'not-a-date', timeline: [] }, new Date(), []), 'invalid-date');
});

test('a newer linked timeline record flags a profile for immediate editorial review', () => {
  const profile = { profileReviewedAt: '2026-10-06', timeline: ['provider-model-update'] };
  const events = [{
    slug: 'provider-model-update',
    date: '2026-10-07',
    title: 'Provider announces a new model',
    description: 'A newer linked record may supersede profile details.',
    entities: ['openai'],
  }];

  assert.equal(isEntityProfileReviewDue(profile, new Date('2026-10-26T00:00:00Z'), events), true);
  assert.equal(getEntityProfileReviewReason(profile, new Date('2026-10-26T00:00:00Z'), events), 'linked-update');
});

test('the editorial queue includes profiles due within 21 days and excludes later reviews', () => {
  const profile = { profileReviewedAt: '2026-10-01', timeline: [] };

  assert.deepEqual(
    getEntityProfileReviewQueueState(profile, new Date('2026-12-09T00:00:00Z'), []),
    { reason: 'upcoming', dueAt: '2026-12-30', daysUntilDue: 21 },
  );
  assert.equal(
    getEntityProfileReviewQueueState(profile, new Date('2026-12-08T00:00:00Z'), []),
    undefined,
  );
  assert.deepEqual(
    getEntityProfileReviewQueueState(profile, new Date('2026-12-30T00:00:00Z'), []),
    { reason: 'interval', dueAt: '2026-12-30', daysUntilDue: 0 },
  );
});

test('the newest review remains current while earlier review records are retained', () => {
  const profile = entities.find((entity) => entity.slug === 'openai');
  assert.ok(profile?.profileReviewHistory);

  const updated = normalizeEntityProfileReviews({
    ...profile,
    profileReviewHistory: [
      ...profile.profileReviewHistory,
      {
        reviewedAt: '2026-10-15',
        triggeringUpdate: 'OpenAI announces GPT-5.5',
        referencesChecked: [{
          label: 'OpenAI — Introducing GPT-5.5',
          url: 'https://openai.com/index/introducing-gpt-5-5/',
          captureStatus: 'fingerprinted',
          capturedAt: '2026-10-15T12:00:00.000Z',
          contentHash: 'a'.repeat(64),
        }],
        claimChangeSummary: 'Updated the current-model context after the newer release.',
      },
    ],
  });

  assert.equal(updated.profileReviewedAt, '2026-10-15');
  assert.equal(updated.profileReviewHistory?.length, 2);
  assert.equal(updated.profileReviewHistory?.[0].reviewedAt, '2026-10-06');
  assert.equal(updated.profileReviewHistory?.[1].reviewedAt, '2026-10-15');
  assert.equal(updated.profileReviewHistory?.[1].triggeringUpdate, 'OpenAI announces GPT-5.5');
  assert.equal(updated.profileReviewHistory?.[1].referencesChecked[0].captureStatus, 'fingerprinted');
  assert.equal(updated.profileReviewHistory?.[1].referencesChecked[0].contentHash, 'a'.repeat(64));
});

test('profile claim comparison identifies additions, revisions, and removals', () => {
  const baseProfile = {
    strapline: 'Summary.',
    overview: 'Opening overview.',
    keyMetrics: [],
    latestDevelopments: [],
  };
  const previous = getEntityProfileClaims({
    ...baseProfile,
    profileSections: [
      { heading: 'Overview', paragraphs: ['First claim.', 'Claim to revise.', 'Claim to remove.'] },
      { heading: 'Work', paragraphs: ['Unchanged claim.'] },
    ],
  });
  const current = getEntityProfileClaims({
    ...baseProfile,
    profileSections: [
      { heading: 'Overview', paragraphs: ['First claim.', 'Revised claim.', 'New claim.'] },
      { heading: 'Work', paragraphs: ['Unchanged claim.'] },
    ],
  });
  const comparison = compareEntityProfileClaims(previous, current);

  assert.equal(comparison.status, 'compared');
  assert.deepEqual(comparison.changes, [
    {
      section: 'Overview',
      status: 'revised',
      previousText: 'Claim to revise.',
      currentText: 'Revised claim.',
    },
    {
      section: 'Overview',
      status: 'revised',
      previousText: 'Claim to remove.',
      currentText: 'New claim.',
    },
  ]);
});

test('profile comparison preserves unchanged claims and labels missing prior versions', () => {
  const baseProfile = {
    strapline: 'Summary.',
    overview: 'Opening overview.',
    keyMetrics: [],
    latestDevelopments: [],
  };
  const previous = getEntityProfileClaims({
    ...baseProfile,
    profileSections: [{ heading: 'Overview', paragraphs: ['Keep.', 'Remove.'] }],
  });
  const withAddition = getEntityProfileClaims({
    ...baseProfile,
    profileSections: [{ heading: 'Overview', paragraphs: ['Keep.', 'Remove.', 'Add.'] }],
  });
  const withRemoval = getEntityProfileClaims({
    ...baseProfile,
    profileSections: [{ heading: 'Overview', paragraphs: ['Keep.'] }],
  });
  const unchanged = compareEntityProfileClaims(previous, getEntityProfileClaims({
    ...baseProfile,
    profileSections: [{ heading: 'Overview', paragraphs: ['Keep.', 'Remove.'] }],
  }));

  assert.deepEqual(compareEntityProfileClaims(undefined, withAddition), {
    status: 'no-prior-version',
    changes: [],
  });
  assert.deepEqual(compareEntityProfileClaims(previous, withAddition).changes, [
    { section: 'Overview', status: 'added', previousText: null, currentText: 'Add.' },
  ]);
  assert.deepEqual(compareEntityProfileClaims(previous, withRemoval).changes, [
    { section: 'Overview', status: 'removed', previousText: 'Remove.', currentText: null },
  ]);
  assert.deepEqual(unchanged, { status: 'compared', changes: [] });
});
