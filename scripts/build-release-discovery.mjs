import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "release/editorial-manifest.json"), "utf8"));
const output = path.join(root, "artifacts/api-server/src/editorial/release-discovery.generated.ts");
const topicByArticle = new Map(manifest.topics.flatMap((topic) =>
  topic.storySlugs.map((slug) => [slug, topic.label]),
));
const discovery = {
  briefs: manifest.briefIssues.map(({ slug, articleSlug, publishAt, input, facts }) => ({
    slug,
    articleSlug,
    publishAt,
    title: input.title,
    dek: input.dek,
    body: input.body,
    facts,
  })),
  signals: manifest.signals.map((signal) => ({
    ...signal,
    topic: topicByArticle.get(signal.articleSlug) ?? "Other",
  })),
  topics: manifest.topics,
  glossaryLinks: manifest.glossaryLinks.map(({ articleSlug, publishAt, terms }) => ({
    articleSlug,
    publishAt,
    route: "/glossary/",
    terms,
  })),
};
fs.writeFileSync(output, `export const releaseDiscovery = ${JSON.stringify(discovery, null, 2)} as const;\n`);
console.log(`Generated ${discovery.briefs.length} Briefs, ${discovery.signals.length} Signals, ${discovery.topics.length} topics, and ${discovery.glossaryLinks.length} glossary links.`);
