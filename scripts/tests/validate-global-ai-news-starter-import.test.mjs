import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateStarterImport } from "../validate-global-ai-news-starter-import.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const handoffPath = path.join(
  projectRoot,
  "docs/editorial-imports/global-ai-news-60-starter-drafts-2026-10-18.json",
);
const handoff = JSON.parse(fs.readFileSync(handoffPath, "utf8"));
const clone = () => structuredClone(handoff);

test("accepts the 60-record handoff and surfaces blocked source reviews", () => {
  const result = validateStarterImport(handoff);
  assert.deepEqual(result.errors, []);
  assert.equal(result.blockedReviews.length, 4);
  assert.ok(result.blockedReviews.every((review) => review.title));
});

test("rejects missing starter fields and duplicate starter titles or slugs", () => {
  const data = clone();
  delete data.articles[0].starter.meta_description;
  data.articles[1].starter.title = data.articles[0].starter.title;
  data.articles[2].starter.slug = data.articles[0].starter.slug;

  const { errors } = validateStarterImport(data);
  assert.ok(errors.some((error) => error.includes('missing required starter field "meta_description"')));
  assert.ok(errors.some((error) => error.includes('Duplicate title')));
  assert.ok(errors.some((error) => error.includes('Duplicate slug')));
});

test("rejects incorrect record and section counts", () => {
  const data = clone();
  data.articles.pop();
  data.articles[0].starter.section = "Unknown";

  const { errors } = validateStarterImport(data);
  assert.ok(errors.some((error) => error.includes("Expected 60 article records")));
  assert.ok(errors.some((error) => error.includes('unknown section "Unknown"')));
  assert.ok(errors.some((error) => error.includes('Section "Brief" must contain 6 records')));
});

test("rejects records marked as ready to publish", () => {
  const data = clone();
  data.articles[0].publication_status = "published";
  data.articles[1].expanded_draft.publication_status = "ready_for_publication";

  const { errors } = validateStarterImport(data);
  assert.ok(errors.some((error) => error.includes('draft-only publication_status; found "published"')));
  assert.ok(errors.some((error) => error.includes('draft-only expanded_draft.publication_status; found "ready_for_publication"')));
});
