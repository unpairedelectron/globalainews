import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const stateSource = readFileSync(new URL("../src/editorial/publication-state.ts", import.meta.url), "utf8");
const newsroomSource = readFileSync(new URL("../src/routes/newsroom.ts", import.meta.url), "utf8");

test("scheduler reloads persisted state on startup, conditionally promotes, and audits transitions", () => {
  assert.match(stateSource, /startPublicationStateScheduler[\s\S]*void refreshPublicationStateSnapshot\(\)/);
  assert.match(stateSource, /eq\(editorialPublishStatesTable\.status, "scheduled"\)[\s\S]*lte\(editorialPublishStatesTable\.publishAt, now\)/);
  assert.match(stateSource, /where\(and\([\s\S]*eq\(editorialPublishStatesTable\.status, "scheduled"\)[\s\S]*lte\(editorialPublishStatesTable\.publishAt, now\)/);
  assert.match(stateSource, /editorialReleaseHistoryTable[\s\S]*source: "scheduled-job"/);
  assert.match(stateSource, /stateSnapshot = rows/);
  assert.match(stateSource, /if \(publishedCount > 0\) notifyPublicationStateChanged\(\)/);
});

test("publication changes invalidate newsroom snapshots used by public surfaces", () => {
  assert.match(newsroomSource, /onPublicationStateChanged\(invalidatePublicNewsroomContentCache\)/);
  assert.match(newsroomSource, /getPublishedArticleRegistry\(/);
});
