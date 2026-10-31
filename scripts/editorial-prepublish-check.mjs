#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const articleDir = path.join(root, "docs/editorial-drafts/articles");
const args = process.argv.slice(2);
const articleArg = args.find((arg) => arg.startsWith("--article="))?.slice(10);
const checkLinks = args.includes("--check-links");
const files = fs.readdirSync(articleDir)
  .filter((file) => file.endsWith(".md"))
  .filter((file) => !articleArg || file.startsWith(`${articleArg}.`))
  .filter((file) => !file.includes(".fact-log."));

const issues = [];
if (!files.length) {
  console.error(`No article draft found${articleArg ? ` for ${articleArg}` : ""}.`);
  process.exit(2);
}
if (!articleArg && files.length !== 10) {
  issues.push(`Expected 10 full article drafts for batch CI; found ${files.length}.`);
}

const countWords = (text) => (text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length;
const countMatches = (text, regex) => [...text.matchAll(regex)].length;
const toLocalPath = (baseDir, target) => path.resolve(baseDir, target);

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(12000) });
    return { url, status: response.status };
  } catch (error) {
    return { url, error: error instanceof Error ? error.message : String(error) };
  }
}

for (const file of files) {
  const stem = file.slice(0, -3);
  const articlePath = path.join(articleDir, file);
  const text = fs.readFileSync(articlePath, "utf8");
  const metaPath = path.join(articleDir, `${stem}.meta.json`);
  const schemaPath = path.join(articleDir, `${stem}.schema.json`);
  const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf8")) : null;

  if (!meta) issues.push(`${stem}: missing metadata JSON.`);
  if (!fs.existsSync(schemaPath)) issues.push(`${stem}: missing schema JSON.`);
  if (meta) {
    if (meta.title.length > 60) issues.push(`${stem}: meta title exceeds 60 characters (${meta.title.length}).`);
    if (meta.description.length < 120 || meta.description.length > 155) {
      issues.push(`${stem}: meta description must be 120–155 characters (${meta.description.length}).`);
    }
    if (!meta.canonical?.startsWith("https://")) issues.push(`${stem}: missing HTTPS canonical URL.`);
    if (!meta.reviewer) issues.push(`${stem}: reviewer line is missing.`);
  }

  const body = text.split("## The bottom line\n")[1]?.split("\n## FAQ")[0] ?? "";
  const wordCount = countWords(body.replace(/<img\b[^>]*>/g, ""));
  const explainer = /explainer/i.test(meta?.format ?? "");
  const minWords = explainer ? 1200 : 1800;
  const maxWords = explainer ? 1800 : 3000;
  if (wordCount < minWords || wordCount > maxWords) {
    issues.push(`${stem}: body word count ${wordCount}; expected ${minWords}–${maxWords}.`);
  }

  const sourceSection = text.split("## Sources\n")[1]?.split("\n## Methodology note")[0] ?? "";
  const tier1Section = sourceSection.split("**Tier 1")[1]?.split("**Tier 2")[0] ?? "";
  const tier2Section = sourceSection.split("**Tier 2")[1] ?? "";
  const tier1 = countMatches(tier1Section, /^\d+\.\s/gm);
  const tier2 = countMatches(tier2Section, /^\d+\.\s/gm);
  if (tier1 + tier2 < 8) issues.push(`${stem}: only ${tier1 + tier2} tiered sources; requires at least 8.`);
  if (tier1 < 4) issues.push(`${stem}: only ${tier1} Tier 1 sources; requires at least 4.`);

  const images = [...text.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  if (images.length < 3) issues.push(`${stem}: requires at least 3 visual images.`);
  for (const image of images) {
    if (!/\balt="[^"]{8,}"/.test(image)) issues.push(`${stem}: visual has missing or short alt text.`);
    const src = image.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src) continue;
    const svgPath = toLocalPath(articleDir, src);
    if (!fs.existsSync(svgPath)) {
      issues.push(`${stem}: visual file missing: ${src}`);
    } else {
      const svg = fs.readFileSync(svgPath, "utf8");
      if (!/<title\b/.test(svg) || !/<desc\b/.test(svg)) issues.push(`${stem}: SVG lacks title or description: ${src}`);
    }
  }
  if (countMatches(text, /<details><summary>View data<\/summary>/g) < 3) {
    issues.push(`${stem}: each of the 3 visuals needs a View data table.`);
  }
  if (countMatches(text, /^### .+\?$/gm) < 4) issues.push(`${stem}: FAQ needs at least 4 questions.`);
  const faqSection = text.split("## FAQ\n")[1]?.split("\n## Sources")[0] ?? "";
  const faqBlocks = faqSection.split(/(?=^### )/m).filter((block) => block.startsWith("### "));
  if (faqBlocks.length < 4 || faqBlocks.length > 6) issues.push(`${stem}: FAQ needs 4–6 questions.`);
  for (const block of faqBlocks) {
    const answerWords = countWords(block.split("\n").slice(1).join(" "));
    if (answerWords < 40 || answerWords > 70) issues.push(`${stem}: FAQ answer outside 40–70 words (${answerWords}): ${block.split("\n")[0]}`);
  }
  for (const heading of ["What we don’t know yet", "What to watch next", "What this means for"]) {
    if (!text.toLowerCase().includes(heading.toLowerCase())) issues.push(`${stem}: missing section: ${heading}.`);
  }
  if (!/## Methodology note[\s\S]{0,500}AI-assisted/i.test(text)) issues.push(`${stem}: AI assistance is not disclosed in the methodology note.`);
  if (!/## Corrections log/.test(text)) issues.push(`${stem}: corrections log is missing.`);
  if (!/Editorial Desk/.test(text) || !/Aman Mishra/.test(text)) issues.push(`${stem}: author or reviewer is missing.`);

  if (meta?.socialImages) {
    for (const item of meta.socialImages) {
      for (const format of ["webp", "avif"]) {
        const asset = toLocalPath(path.dirname(metaPath), item[format]);
        if (!fs.existsSync(asset)) {
          issues.push(`${stem}: missing ${format.toUpperCase()} social image ${item[format]}.`);
          continue;
        }
        if (fs.statSync(asset).size > 200 * 1024) issues.push(`${stem}: ${path.basename(asset)} exceeds 200 KB.`);
        const probe = spawnSync("magick", ["identify", "-format", "%w %h", asset], { encoding: "utf8" });
        if (probe.status !== 0 || probe.stdout.trim() !== `${item.width} ${item.height}`) {
          issues.push(`${stem}: ${path.basename(asset)} has unexpected dimensions.`);
        }
      }
    }
  } else {
    issues.push(`${stem}: social image variants are missing from metadata.`);
  }

  if (fs.existsSync(schemaPath)) {
    try {
      const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
      const types = (schema["@graph"] ?? []).flatMap((node) => Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]]);
      for (const requiredType of ["NewsArticle", "FAQPage", "BreadcrumbList"]) {
        if (!types.includes(requiredType)) issues.push(`${stem}: schema is missing ${requiredType}.`);
      }
    } catch {
      issues.push(`${stem}: schema JSON is invalid.`);
    }
  }

  if (checkLinks) {
    const urls = [...new Set([...text.matchAll(/https:\/\/www\.globalainews\.in\/[^)\s"]+/g)].map((match) => match[0]))];
    const results = await Promise.all(urls.map(checkUrl));
    for (const result of results) {
      if (result.status !== 200) issues.push(`${stem}: internal link check failed for ${result.url}: ${result.status ?? result.error}`);
    }
  }

  console.log(`${stem}: ${wordCount} body words, ${tier1 + tier2} sources (${tier1} Tier 1), ${images.length} visuals.`);
}

if (issues.length) {
  console.error("\nPRE-PUBLISH CHECK FAILED");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("\nStatic editorial checks passed. Lighthouse, accessibility, and production-route checks remain separate gates.");
