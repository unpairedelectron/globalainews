import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const manifest = JSON.parse(
  await readFile(new URL("../../../release/manifest.json", import.meta.url), "utf8"),
);
const registry = JSON.parse(
  await readFile(new URL("../../../release/article-registry.json", import.meta.url), "utf8"),
);

test("release upload manifest contains only the ten publication-state records", () => {
  assert.deepEqual(Object.keys(manifest), ["states"]);
  assert.equal(manifest.states.length, 10);
  assert.deepEqual(
    manifest.states.map(({ slug, publishAt, status }: { slug: string; publishAt: string; status: string }) => [
      slug,
      publishAt,
      status,
    ]),
    registry.entries.map(({ slug, publishAt, status }: { slug: string; publishAt: string; status: string }) => [
      slug,
      publishAt,
      status,
    ]),
  );
  for (const entry of manifest.states) {
    assert.deepEqual(Object.keys(entry), ["slug", "publishAt", "status"]);
    assert.equal(entry.status, "scheduled");
  }
});
