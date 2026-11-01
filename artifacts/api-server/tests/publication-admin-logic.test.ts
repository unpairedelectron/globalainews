import assert from "node:assert/strict";
import test from "node:test";
import { articleRegistry } from "../src/editorial/article-registry.generated.ts";
import {
  getPreviousPublicationState,
  planPublicationStateImport,
} from "../src/editorial/publication-admin-logic.ts";

const entries = articleRegistry.map((article) => ({
  slug: article.slug,
  publishAt: new Date(article.publishAt),
  status: "scheduled",
}));

test("state-only import plans create, update, and unchanged rows without article payloads", () => {
  assert.equal(planPublicationStateImport(entries, []).filter((change) => change.disposition === "create").length, 10);
  const sameRows = entries.map((entry) => ({ ...entry }));
  assert.ok(planPublicationStateImport(entries, sameRows).every((change) => change.disposition === "unchanged"));
  const editedRows = sameRows.map((entry, index) => index === 0 ? { ...entry, status: "paused" } : entry);
  const plan = planPublicationStateImport(entries, editedRows);
  assert.equal(plan.filter((change) => change.disposition === "update").length, 1);
  assert.equal(plan[0].previousStatus, "paused");
  assert.equal(plan[0].nextStatus, "scheduled");
  assert.ok(plan.every((change) => Object.keys(change.entry).sort().join(",") === "publishAt,slug,status"));
});

test("rollback reads only valid structured state-audit snapshots", () => {
  const previous = { publishAt: "2026-11-02T07:30:00.000Z", status: "scheduled" };
  assert.deepEqual(getPreviousPublicationState(JSON.stringify({
    source: "publish-state-admin",
    previous,
  })), { publishAt: new Date(previous.publishAt), status: "scheduled" });
  assert.equal(getPreviousPublicationState(JSON.stringify({ source: "publish-state-admin", previous: null })), null);
  assert.equal(getPreviousPublicationState(JSON.stringify({ source: "other", previous })), undefined);
  assert.equal(getPreviousPublicationState("not-json"), undefined);
});
