import assert from 'node:assert/strict';
import test from 'node:test';
import {
  entities,
  ENTITY_PROFILE_REVIEW_INTERVAL_DAYS,
  getEntityProfileReviewReason,
  isEntityProfileReviewDue,
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
