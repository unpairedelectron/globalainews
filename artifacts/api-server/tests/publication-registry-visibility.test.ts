import assert from "node:assert/strict";
import test from "node:test";
import { articleRegistry } from "../src/editorial/article-registry.generated.ts";
import { getVisibleRegistryArticles } from "../src/editorial/publication-registry-visibility.ts";

const now = new Date("2026-11-21T07:30:00.000Z");
const stateFor = (article: (typeof articleRegistry)[number], status: string, publishAt = article.publishAt) => ({
  slug: article.slug,
  status,
  publishAt: new Date(publishAt),
  updatedAt: new Date("2026-11-21T07:31:00.000Z"),
});

test("empty and scheduled state snapshots expose no registry articles", () => {
  assert.deepEqual(getVisibleRegistryArticles(articleRegistry, [], now), []);
  assert.deepEqual(
    getVisibleRegistryArticles(articleRegistry, articleRegistry.map((article) => stateFor(article, "scheduled")), now),
    [],
  );
});

test("published state is hidden until publishAt, then all ten registry articles are visible", () => {
  const future = new Date("2026-11-22T07:30:00.000Z");
  const states = articleRegistry.map((article) => stateFor(article, "published"));
  states[0] = stateFor(articleRegistry[0], "published", future);
  const before = getVisibleRegistryArticles(articleRegistry, states, now);
  assert.equal(before.length, 9);
  assert.equal(before.some((article) => article.slug === articleRegistry[0].slug), false);

  states[0] = stateFor(articleRegistry[0], "published");
  const after = getVisibleRegistryArticles(articleRegistry, states, now);
  assert.equal(after.length, 10);
  assert.deepEqual(new Set(after.map((article) => article.slug)), new Set(articleRegistry.map((article) => article.slug)));
});

test("paused state removes an article from every registry-derived surface", () => {
  const states = articleRegistry.map((article) => stateFor(article, "published"));
  states[0] = stateFor(articleRegistry[0], "paused");
  const visible = getVisibleRegistryArticles(articleRegistry, states, now);
  assert.equal(visible.length, 9);
  assert.equal(visible.some((article) => article.slug === articleRegistry[0].slug), false);
});
