import assert from "node:assert/strict";
import test from "node:test";
import { articleRegistry } from "../src/editorial/article-registry.generated.ts";
import { releaseDiscovery } from "../src/editorial/release-discovery.generated.ts";
import { getVisibleReleaseDiscovery } from "../src/editorial/release-discovery-visibility.ts";

const now = new Date("2026-11-21T07:30:00.000Z");

test("empty and scheduled publication states expose no Briefs, Signals, topic entries, or glossary links", () => {
  assert.deepEqual(getVisibleReleaseDiscovery(releaseDiscovery, new Set(), now), {
    briefs: [],
    signals: [],
    topics: [],
    glossaryLinks: [],
  });
});

test("all ten dated discovery records appear only for published articles", () => {
  const allSlugs = new Set(articleRegistry.map((article) => article.slug));
  const visible = getVisibleReleaseDiscovery(releaseDiscovery, allSlugs, now);
  assert.equal(visible.briefs.length, 10);
  assert.equal(visible.signals.length, 10);
  assert.equal(visible.topics.length, 10);
  assert.equal(visible.glossaryLinks.length, 10);
  assert.ok(visible.briefs.every((brief) => allSlugs.has(brief.articleSlug)));
  assert.equal(new Set(visible.briefs.map((brief) => brief.publishAt.slice(0, 10))).size, 10);
  assert.ok(visible.briefs.every((brief) =>
    brief.facts.length === 3 &&
    brief.facts.every((fact) => fact.claim && fact.source && fact.tier && fact.limitation),
  ));

  allSlugs.delete(articleRegistry[0].slug);
  const paused = getVisibleReleaseDiscovery(releaseDiscovery, allSlugs, now);
  assert.equal(paused.briefs.length, 9);
  assert.equal(paused.signals.length, 9);
  assert.equal(paused.glossaryLinks.length, 9);
  assert.ok(paused.topics.every((topic) => !topic.storySlugs.includes(articleRegistry[0].slug)));
});

test("a publication date in the future remains absent from every discovery surface", () => {
  const future = new Date("2026-11-22T07:30:00.000Z").toISOString();
  const futureDiscovery = {
    ...releaseDiscovery,
    briefs: releaseDiscovery.briefs.map((brief) => ({ ...brief, publishAt: future })),
    signals: releaseDiscovery.signals.map((signal) => ({ ...signal, publishAt: future })),
    glossaryLinks: releaseDiscovery.glossaryLinks.map((link) => ({ ...link, publishAt: future })),
  };
  const visible = getVisibleReleaseDiscovery(futureDiscovery, new Set(articleRegistry.map((article) => article.slug)), now);
  assert.equal(visible.briefs.length, 0);
  assert.equal(visible.signals.length, 0);
  assert.equal(visible.glossaryLinks.length, 0);
});
