import assert from "node:assert/strict";
import test from "node:test";
import { articleRegistry } from "../src/editorial/article-registry.generated.ts";
import { getDueScheduledPublications } from "../src/editorial/publication-scheduler-policy.ts";

test("fake clock promotes all ten scheduled slots at—not before—their UTC time", () => {
  const rows = articleRegistry.map((article) => ({
    slug: article.slug,
    publishAt: new Date(article.publishAt),
    status: "scheduled",
  })).sort((left, right) => left.publishAt.getTime() - right.publishAt.getTime());

  assert.equal(rows.length, 10);
  assert.equal(getDueScheduledPublications(rows, new Date(rows[0].publishAt.getTime() - 1)).length, 0);
  rows.forEach((row, index) => {
    const before = new Date(row.publishAt.getTime() - 1);
    const at = row.publishAt;
    assert.equal(getDueScheduledPublications(rows, before).length, index, `${row.slug} before boundary`);
    const visibleAt = getDueScheduledPublications(rows, at);
    assert.equal(visibleAt.length, index + 1, `${row.slug} at boundary`);
    assert.equal(visibleAt.some((due) => due.slug === row.slug), true);
  });

  const afterLast = new Date(rows.at(-1)!.publishAt.getTime() + 1);
  assert.equal(getDueScheduledPublications(rows, afterLast).length, 10);
});

test("paused or already published rows never enter the scheduler due set", () => {
  const now = new Date("2026-11-21T07:30:00.000Z");
  const states = articleRegistry.map((article, index) => ({
    slug: article.slug,
    publishAt: new Date(article.publishAt),
    status: index === 0 ? "paused" : index === 1 ? "published" : "scheduled",
  }));
  const due = getDueScheduledPublications(states, now);
  assert.equal(due.length, 8);
  assert.equal(due.some((row) => row.status !== "scheduled"), false);
});
