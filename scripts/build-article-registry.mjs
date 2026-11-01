import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schedule = JSON.parse(readFileSync(path.join(root, "release/schedule.json"), "utf8"));
if (schedule.schemaVersion !== 1 || !Array.isArray(schedule.entries)) {
  throw new Error("Unsupported article schedule schema.");
}

const entries = schedule.entries.map((scheduled) => {
  const metadataPath = path.join(
    root,
    "docs/editorial-drafts/articles",
    `${scheduled.slug}.meta.json`,
  );
  const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
  if (metadata.status !== "private-draft" || metadata.published !== null) {
    throw new Error(`${scheduled.slug}: registry accepts only private, unpublished drafts.`);
  }
  if (!Number.isInteger(scheduled.scheduleSlot) || scheduled.scheduleSlot < 1) {
    throw new Error(`${scheduled.slug}: scheduleSlot must be a positive integer.`);
  }
  const publishAt = new Date(scheduled.publishAt);
  const canonicalUtc = Number.isFinite(publishAt.getTime())
    ? publishAt.toISOString().replace(".000Z", "Z")
    : "";
  if (!canonicalUtc || canonicalUtc !== scheduled.publishAt) {
    throw new Error(`${scheduled.slug}: publishAt must be a canonical UTC timestamp.`);
  }
  return {
    slug: scheduled.slug,
    title: metadata.title,
    description: metadata.description,
    topic: metadata.topic,
    scheduleSlot: scheduled.scheduleSlot,
    publishAt: scheduled.publishAt,
    status: "scheduled",
  };
});

if (new Set(entries.map(({ slug }) => slug)).size !== entries.length) {
  throw new Error("Article schedule contains duplicate slugs.");
}
if (new Set(entries.map(({ scheduleSlot }) => scheduleSlot)).size !== entries.length) {
  throw new Error("Article schedule contains duplicate slots.");
}

const registry = {
  schemaVersion: 1,
  generatedFrom: "release/schedule.json and private-draft metadata",
  entries: entries.sort((left, right) => left.publishAt.localeCompare(right.publishAt)),
};
writeFileSync(
  path.join(root, "release/article-registry.json"),
  `${JSON.stringify(registry, null, 2)}\n`,
);
