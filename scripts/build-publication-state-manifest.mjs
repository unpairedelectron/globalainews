import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(root, "release/article-registry.json");
const outputPath = path.join(root, "release/manifest.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

if (!Array.isArray(registry.entries) || registry.entries.length !== 10) {
  throw new Error("The publication-state manifest requires exactly ten registry entries.");
}

const states = registry.entries.map(({ slug, publishAt, status }) => {
  if (
    typeof slug !== "string" ||
    typeof publishAt !== "string" ||
    !Number.isFinite(Date.parse(publishAt)) ||
    status !== "scheduled"
  ) {
    throw new Error(`Invalid publication-state registry entry: ${slug ?? "unknown"}`);
  }
  return { slug, publishAt, status };
});

if (new Set(states.map(({ slug }) => slug)).size !== states.length) {
  throw new Error("The publication-state manifest contains duplicate article slugs.");
}

fs.writeFileSync(outputPath, `${JSON.stringify({ states }, null, 2)}\n`);
console.log(`Generated a state-only manifest for ${states.length} scheduled articles.`);
