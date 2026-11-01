import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const registry = JSON.parse(readFileSync(new URL("../../../release/article-registry.json", import.meta.url)));
const schedule = JSON.parse(readFileSync(new URL("../../../release/schedule.json", import.meta.url)));

test("article registry contains every scheduled draft without editorial body or citation payloads", () => {
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.entries.length, 10);
  assert.equal(registry.entries.length, schedule.entries.length);
  assert.deepEqual(
    registry.entries.map(({ slug, scheduleSlot, publishAt, status }) => ({ slug, scheduleSlot, publishAt, status })),
    [...schedule.entries]
      .sort((left, right) => left.publishAt.localeCompare(right.publishAt))
      .map((entry) => ({ ...entry, status: "scheduled" })),
  );

  for (const entry of registry.entries) {
    assert.ok(entry.title);
    assert.ok(entry.description);
    assert.ok(entry.topic);
    assert.equal(Number.isInteger(entry.scheduleSlot), true);
    assert.equal(entry.status, "scheduled");
    assert.equal(Object.hasOwn(entry, "body"), false);
    assert.equal(Object.hasOwn(entry, "sources"), false);
    assert.equal(Object.hasOwn(entry, "story"), false);
  }
});
