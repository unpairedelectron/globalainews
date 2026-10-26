import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const EXPECTED_RECORD_COUNT = 60;
export const EXPECTED_SECTION_COUNT = 6;
export const EXPECTED_SECTIONS = [
  "Brief",
  "Research",
  "Data",
  "Reports",
  "Signals",
  "Industry",
  "Models",
  "Policy",
  "India",
  "Essays",
];

const REQUIRED_STARTER_FIELDS = [
  "section",
  "title",
  "slug",
  "status",
  "seo_keywords",
  "meta_description",
  "story_draft",
  "replit_expansion_brief",
  "factual_guardrails",
  "sources",
];

const DEFAULT_INPUT = fileURLToPath(
  new URL(
    "../docs/editorial-imports/global-ai-news-60-starter-drafts-2026-10-18.json",
    import.meta.url,
  ),
);

function hasContent(value) {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null;
}

function normalizedIdentity(value) {
  return typeof value === "string" ? value.trim().toLocaleLowerCase() : "";
}

function findDuplicates(articles, field) {
  const indexesByValue = new Map();
  articles.forEach((article, index) => {
    const value = normalizedIdentity(article?.starter?.[field]);
    if (!value) return;
    const indexes = indexesByValue.get(value) ?? [];
    indexes.push(index + 1);
    indexesByValue.set(value, indexes);
  });

  return [...indexesByValue.entries()]
    .filter(([, indexes]) => indexes.length > 1)
    .map(([value, indexes]) => `${field} "${value}" appears in records ${indexes.join(", ")}`);
}

export function validateStarterImport(data) {
  const errors = [];
  const blockedReviews = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { errors: ["The JSON document must be an object."], blockedReviews };
  }

  if (!Array.isArray(data.articles)) {
    return { errors: ["The document must contain an articles array."], blockedReviews };
  }

  const articles = data.articles;
  if (articles.length !== EXPECTED_RECORD_COUNT) {
    errors.push(
      `Expected ${EXPECTED_RECORD_COUNT} article records; found ${articles.length}.`,
    );
  }

  const sectionCounts = new Map(EXPECTED_SECTIONS.map((section) => [section, 0]));
  articles.forEach((article, index) => {
    const recordNumber = index + 1;
    if (!article || typeof article !== "object" || Array.isArray(article)) {
      errors.push(`Record ${recordNumber} must be an object.`);
      return;
    }

    const starter = article.starter;
    if (!starter || typeof starter !== "object" || Array.isArray(starter)) {
      errors.push(`Record ${recordNumber} is missing its starter object.`);
    } else {
      for (const field of REQUIRED_STARTER_FIELDS) {
        if (!hasContent(starter[field])) {
          errors.push(`Record ${recordNumber} is missing required starter field "${field}".`);
        }
      }

      if (typeof starter.section === "string") {
        if (!sectionCounts.has(starter.section)) {
          errors.push(
            `Record ${recordNumber} has unknown section "${starter.section}".`,
          );
        } else {
          sectionCounts.set(starter.section, sectionCounts.get(starter.section) + 1);
        }
      }

      if (typeof starter.title !== "string" || !starter.title.trim()) {
        errors.push(`Record ${recordNumber} must have a non-empty starter title.`);
      }
      if (typeof starter.slug !== "string" || !starter.slug.trim()) {
        errors.push(`Record ${recordNumber} must have a non-empty starter slug.`);
      }
      if (!Array.isArray(starter.seo_keywords)) {
        errors.push(`Record ${recordNumber} starter seo_keywords must be an array.`);
      }
      if (!Array.isArray(starter.sources) || !starter.sources.every((source) => typeof source === "string" && source.trim())) {
        errors.push(`Record ${recordNumber} starter sources must be a non-empty array of strings.`);
      }
    }

    const publicationStatuses = [
      ["publication_status", article.publication_status],
      ...(article.expanded_draft
        ? [["expanded_draft.publication_status", article.expanded_draft.publication_status]]
        : []),
    ];
    for (const [field, status] of publicationStatuses) {
      if (typeof status !== "string" || !/^draft(?:_|$)/i.test(status)) {
        errors.push(
          `Record ${recordNumber} must have a draft-only ${field}; found "${String(status)}".`,
        );
      }
    }

    if (
      article.source_review?.blocked === true ||
      /^blocked_/i.test(article.staging_status ?? "") ||
      /^draft_hold_/i.test(article.expanded_draft?.publication_status ?? "")
    ) {
      blockedReviews.push({
        recordNumber,
        title: starter?.title ?? "(missing title)",
        status:
          article.staging_status ??
          article.expanded_draft?.publication_status ??
          "source review blocked",
      });
    }
  });

  for (const section of EXPECTED_SECTIONS) {
    const count = sectionCounts.get(section);
    if (count !== EXPECTED_SECTION_COUNT) {
      errors.push(
        `Section "${section}" must contain ${EXPECTED_SECTION_COUNT} records; found ${count}.`,
      );
    }
  }

  errors.push(...findDuplicates(articles, "slug").map((message) => `Duplicate ${message}.`));
  errors.push(...findDuplicates(articles, "title").map((message) => `Duplicate ${message}.`));

  return { errors, blockedReviews };
}

function main() {
  const inputPath = path.resolve(process.argv[2] ?? DEFAULT_INPUT);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  } catch (error) {
    console.error(`Could not read valid JSON from ${inputPath}: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const { errors, blockedReviews } = validateStarterImport(data);
  if (errors.length) {
    console.error(`Starter import validation failed (${errors.length} issue${errors.length === 1 ? "" : "s"}):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Starter import validation passed: ${data.articles.length} records, ${EXPECTED_SECTIONS.length} sections, ${EXPECTED_SECTION_COUNT} per section; all publication statuses are draft-only.`,
    );
  }

  if (blockedReviews.length) {
    console.warn(`Blocked source reviews requiring editorial attention: ${blockedReviews.length}`);
    for (const review of blockedReviews) {
      console.warn(`- Record ${review.recordNumber}: ${review.title} (${review.status})`);
    }
  } else {
    console.log("Blocked source reviews: none.");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
