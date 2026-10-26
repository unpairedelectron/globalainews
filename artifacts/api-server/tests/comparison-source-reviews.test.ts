import assert from "node:assert/strict";
import test from "node:test";
import {
  addOneCalendarMonth,
  isMonitoredComparisonSlug,
  monitoredComparisonSlugs,
} from "../src/editorial/comparison-source-reviews.ts";

test("only the two AI-tool comparison reports are on the monthly review schedule", () => {
  assert.deepEqual(monitoredComparisonSlugs, [
    "ai-assistants-compared",
    "ai-image-tools-compared",
  ]);
  assert.equal(isMonitoredComparisonSlug("ai-assistants-compared"), true);
  assert.equal(isMonitoredComparisonSlug("indiaai-vs-commercial-cloud"), false);
});

test("monthly review due dates advance one calendar month and clamp month-end days", () => {
  assert.equal(addOneCalendarMonth(new Date("2026-10-14T17:30:00.000Z")), "2026-11-14");
  assert.equal(addOneCalendarMonth(new Date("2024-01-31T23:59:00.000Z")), "2024-02-29");
  assert.equal(addOneCalendarMonth(new Date("2026-12-31T12:00:00.000Z")), "2027-01-31");
});
