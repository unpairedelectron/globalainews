import { createHash } from "node:crypto";
import { asc, desc, eq, gte, lt } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  db,
  editorialAutomationRunsTable,
  editorialReleasesTable,
  editorialSourceItemsTable,
} from "@workspace/db";
import {
  authors,
  stories,
  type EditorialCadence,
  type Story,
  type StoryCategory,
} from "../../../global-ai-news/src/content";
import {
  deterministicGate,
  normalizeDraft,
  normalizeVerification,
  replaySavedEditorialRuns,
  type EditorialReplayReport,
  type DraftPayload,
  type VerificationPayload,
} from "./automation-contract";

const DAILY_UTC_HOUR = 7;
const DAILY_UTC_MINUTE = 30;
const AUTOMATION_INTERVAL_MS = 30 * 60 * 1000;
const SOURCE_LOOKBACK_MS = 14 * 24 * 60 * 60 * 1000;
const DRAFT_MODEL = process.env.EDITORIAL_DRAFT_MODEL ?? "gpt-5-mini";
const VERIFICATION_MODEL = process.env.EDITORIAL_VERIFICATION_MODEL ?? "gpt-5.6-terra";

export const editorialModelConfiguration = Object.freeze({
  draftModel: DRAFT_MODEL,
  verificationModel: VERIFICATION_MODEL,
});

const openSourceFeeds = [
  { publisher: "OpenAI", feedUrl: "https://openai.com/news/rss.xml" },
  { publisher: "Google AI", feedUrl: "https://blog.google/technology/ai/rss/" },
  { publisher: "Microsoft Research", feedUrl: "https://www.microsoft.com/en-us/research/feed/" },
  { publisher: "Anthropic", feedUrl: "https://www.anthropic.com/news/rss.xml" },
  { publisher: "arXiv AI", feedUrl: "https://export.arxiv.org/rss/cs.AI" },
] as const;

type FeedItem = {
  publisher: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: Date | null;
};

type EditorialSourceItem = typeof editorialSourceItemsTable.$inferSelect;

export {
  deterministicGate,
  normalizeDraft,
  normalizeVerification,
  replaySavedEditorialRuns,
} from "./automation-contract";
export type { EditorialReplayReport } from "./automation-contract";
export type { DraftPayload, VerificationPayload } from "./automation-contract";

type AutomationResult = {
  status: "completed" | "skipped" | "failed";
  cadence: EditorialCadence;
  runKey?: string;
  published: number;
  rejected: number;
  candidates: number;
  detail: Record<string, unknown>;
};

let scheduler: NodeJS.Timeout | undefined;
let activeRun: Promise<AutomationResult[]> | undefined;

function log(event: string, detail: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ service: "editorial-automation", event, ...detail }));
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function atomLink(block: string): string {
  const match = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  return match?.[1]?.trim() ?? "";
}

function parseFeed(xml: string, publisher: string): FeedItem[] {
  const blocks = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((match) => match[0]);
  return blocks
    .map((block) => {
      const title = tagValue(block, "title");
      const url = tagValue(block, "link") || atomLink(block);
      const summary = tagValue(block, "description") || tagValue(block, "summary") || tagValue(block, "content");
      const published = tagValue(block, "pubDate") || tagValue(block, "published") || tagValue(block, "updated");
      const parsedDate = published ? new Date(published) : null;
      return {
        publisher,
        title,
        url,
        summary,
        publishedAt: parsedDate && Number.isFinite(parsedDate.getTime()) ? parsedDate : null,
      };
    })
    .filter((item) => item.title.length >= 20 && /^https?:\/\//.test(item.url));
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html",
        "user-agent": "GlobalAI News editorial monitor/1.0",
        ...init.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function discoverOpenSources(): Promise<FeedItem[]> {
  const cutoff = Date.now() - SOURCE_LOOKBACK_MS;
  const results = await Promise.all(
    openSourceFeeds.map(async (source) => {
      try {
        const response = await fetchWithTimeout(source.feedUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const items = parseFeed(await response.text(), source.publisher).filter(
          (item) => !item.publishedAt || item.publishedAt.getTime() >= cutoff,
        );
        log("source_feed_read", { publisher: source.publisher, candidates: items.length });
        return items;
      } catch (error) {
        log("source_feed_failed", { publisher: source.publisher, error: String(error) });
        return [];
      }
    }),
  );
  return results
    .flat()
    .sort((left, right) => (right.publishedAt?.getTime() ?? 0) - (left.publishedAt?.getTime() ?? 0))
    .filter((item, index, items) => items.findIndex((candidate) => candidate.url === item.url) === index);
}

function sourceSlug(url: string): string {
  return `open-${createHash("sha1").update(url).digest("hex").slice(0, 16)}`;
}

async function saveSourceItems(items: FeedItem[]): Promise<void> {
  if (items.length === 0) return;
  await db
    .insert(editorialSourceItemsTable)
    .values(
      items.map((item) => ({
        sourceSlug: sourceSlug(item.url),
        url: item.url,
        title: item.title,
        publisher: item.publisher,
        summary: item.summary.slice(0, 4000),
        publishedAt: item.publishedAt,
        metadata: { feedPublisher: item.publisher },
      })),
    )
    .onConflictDoNothing({ target: editorialSourceItemsTable.url });
  await db
    .delete(editorialSourceItemsTable)
    .where(lt(editorialSourceItemsTable.fetchedAt, new Date(Date.now() - SOURCE_LOOKBACK_MS)));
}

async function recentSourceItems(): Promise<EditorialSourceItem[]> {
  return db
    .select()
    .from(editorialSourceItemsTable)
    .where(gte(editorialSourceItemsTable.fetchedAt, new Date(Date.now() - SOURCE_LOOKBACK_MS)))
    .orderBy(desc(editorialSourceItemsTable.publishedAt), desc(editorialSourceItemsTable.fetchedAt));
}

function parseJson<T>(value: string): T {
  const normalized = value.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  return JSON.parse(normalized) as T;
}

async function askEditorialModel<T>(model: string, system: string, input: unknown): Promise<T> {
  const response = await openai.chat.completions.create({
    model,
    max_completion_tokens: 8192,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(input) },
    ],
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Editorial model returned an empty response.");
  return parseJson<T>(content);
}

async function createDraft(items: EditorialSourceItem[]): Promise<DraftPayload> {
  return normalizeDraft(await askEditorialModel<unknown>(
    DRAFT_MODEL,
    `You are the autonomous editor for Global AI News. Create one original, concise article from the supplied open-source reporting records.

Rules:
- Never copy source wording. Synthesize and attribute.
- Use only facts supported by the supplied records. If evidence is insufficient, return a draft with an empty sourceUrls array.
- Do not invent people, figures, quotes, dates, launches, or causes.
- Reject hype, vague futurism, SEO stuffing, generic AI filler, and unsupported certainty.
- Choose sourceUrls only from URLs that directly support the claims you wrote. Prefer two closely related publishers when available, but use one authoritative first-party source rather than adding an unrelated citation.
- Return JSON only with title, dek, category, topic, classification, bottomLine, whyItMatters, keyTakeaways, whatChanges, body, sourceUrls.
- title: 30-100 characters; dek: 40-280 characters; exactly 3 keyTakeaways; exactly 3 body sections with 2 paragraphs each.
- category must be one of Breakthroughs, Signals, India Watch, The Edge, Field Notes, Infrastructure, Policy.
- classification must be reported, analysis, or synthesis.`,
    {
      sourceRecords: items.map((item) => ({
        title: item.title,
        publisher: item.publisher,
        url: item.url,
        summary: item.summary,
        publishedAt: item.publishedAt?.toISOString() ?? null,
      })),
    },
  ));
}

async function verifyDraft(draft: DraftPayload, items: EditorialSourceItem[]): Promise<VerificationPayload> {
  return normalizeVerification(await askEditorialModel<unknown>(
    VERIFICATION_MODEL,
    `You are the fact-checking and anti-slop desk for Global AI News. Audit the proposed article only against the supplied source records.

Return JSON only with pass, score, unsupportedClaims, slopFlags, notes.
- pass is true only when every material claim is supported by at least one source and the draft adds clear analysis rather than filler.
- score is a number from 0 to 1.
- Reject copied phrasing, invented specifics, unsupported causal claims, generic AI language, clickbait, and low-information writing.
- Any unsupported material claim, missing source, or obvious AI slop makes pass false.
- A pass requires every material claim to be supported by the cited sourceUrls. One authoritative first-party source can pass when no corroborating report is supplied, but unrelated citations or uncited claims must fail.`,
    {
      draft,
      sourceRecords: items.map((item) => ({
        title: item.title,
        publisher: item.publisher,
        url: item.url,
        summary: item.summary,
      })),
    },
  ));
}

async function reviseDraft(
  draft: DraftPayload,
  verification: VerificationPayload,
  items: EditorialSourceItem[],
): Promise<DraftPayload> {
  return normalizeDraft(await askEditorialModel<unknown>(
    DRAFT_MODEL,
    `You are revising a Global AI News draft after a strict fact-check.

Return JSON only with the same fields as the draft. Keep only claims supported by the supplied records. Rewrite every source-derived sentence in your own wording; do not preserve distinctive phrases from the records. Remove any claim about what a source did not say unless the record explicitly supports that absence. Keep exactly three body sections with two paragraphs each, exactly three key takeaways, and cite only URLs that directly support the claims. Prefer two related publishers, but do not add an unrelated URL just to increase the citation count. Do not add facts, names, numbers, outcomes, or context that are not present in the records.`,
    {
      draft,
      rejectedFor: verification,
      sourceRecords: items.map((item) => ({
        title: item.title,
        publisher: item.publisher,
        url: item.url,
        summary: item.summary,
      })),
    },
  ));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 92);
}

function nextPublishAt(now: Date): Date {
  return new Date(now.getTime() + 5 * 60 * 1000);
}

function authorForCategory(category: StoryCategory): string {
  const mapping: Partial<Record<StoryCategory, string>> = {
    "India Watch": "ananya-rao",
    Infrastructure: "david-okafor",
    Policy: "jonas-rhee",
    Breakthroughs: "mira-patel",
    "The Edge": "ishaan-mehta",
    "Field Notes": "lena-hoff",
    Signals: "ishaan-mehta",
  };
  return mapping[category] ?? authors[0]?.slug ?? "global-ai-news";
}

function imageForCategory(category: StoryCategory): Story["imageTreatment"] {
  const treatment =
    category === "Infrastructure"
      ? "data-graphic"
      : category === "India Watch"
        ? "field-photograph"
        : category === "Policy"
          ? "data-graphic"
          : "editorial-abstract";
  return {
    type: treatment,
    alt: `Abstract editorial visual for ${category.toLowerCase()} reporting`,
    palette: "warm ivory, cobalt, graphite",
    caption: "The signal is becoming visible in the systems around the model.",
  };
}

function buildStory(
  draft: DraftPayload,
  verification: VerificationPayload,
  items: EditorialSourceItem[],
  publishAt: Date,
  cadence: EditorialCadence,
): Story & { publishAt: string; cadence: EditorialCadence } {
  const sourceRecords = draft.sourceUrls
    .map((url) => items.find((item) => item.url === url))
    .filter((item): item is EditorialSourceItem => Boolean(item));
  const primarySources = new Set(sourceRecords.map((item) => item.publisher)).size;
  const confidence = verification.score >= 0.92 ? "HIGH" : "MEDIUM";
  const bodyCharacters = draft.body.reduce(
    (total, section) => total + section.paragraphs.join(" ").length,
    0,
  );
  return {
    slug: slugify(draft.title),
    category: draft.category,
    title: draft.title.trim(),
    dek: draft.dek.trim(),
    body: draft.body.map((section) => ({
      heading: section.heading.trim(),
      paragraphs: section.paragraphs.map((paragraph) => paragraph.trim()),
    })),
    date: publishAt.toISOString().slice(0, 10),
    publishAt: publishAt.toISOString(),
    cadence,
    readTime: `${Math.max(4, Math.min(12, Math.round(bodyCharacters / 900)))} min read`,
    author: authorForCategory(draft.category),
    evidence: `${confidence === "HIGH" ? "High" : "Medium"} confidence · ${primarySources} primary sources · ${Math.max(0, primarySources - 1)} independent confirmations`,
    evidenceSummary: {
      primarySources,
      independentConfirmations: Math.max(0, primarySources - 1),
      confidence,
      note: `Autonomous desk verification score ${verification.score.toFixed(2)} across ${primarySources} open-source publishers.`,
    },
    classification: draft.classification,
    entities: [],
    timeline: [],
    relatedStories: [],
    imageTreatment: imageForCategory(draft.category),
    topic: draft.topic.trim(),
    sources: sourceRecords.map((item) => item.sourceSlug),
    bottomLine: draft.bottomLine.trim(),
    whyItMatters: draft.whyItMatters.trim(),
    keyTakeaways: draft.keyTakeaways.map((item) => item.trim()),
    whatChanges: draft.whatChanges.trim(),
  };
}

function weekKey(date: Date): string {
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + (4 - (date.getUTCDay() || 7)));
  const yearStart = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${thursday.getUTCFullYear()}-${String(week).padStart(2, "0")}`;
}

function dueCadences(now: Date): Array<{ cadence: EditorialCadence; runKey: string }> {
  const minute = now.getUTCHours() * 60 + now.getUTCMinutes();
  const afterDailySlot = minute >= DAILY_UTC_HOUR * 60 + DAILY_UTC_MINUTE;
  const results: Array<{ cadence: EditorialCadence; runKey: string }> = [];
  if (afterDailySlot) results.push({ cadence: "daily", runKey: `daily-${now.toISOString().slice(0, 10)}` });
  if (afterDailySlot && now.getUTCDay() === 0) results.push({ cadence: "weekly", runKey: `weekly-${weekKey(now)}` });
  return results;
}

async function runCadence(cadence: EditorialCadence, runKey: string, trigger: string): Promise<AutomationResult> {
  const existing = await db
    .select({ id: editorialAutomationRunsTable.id })
    .from(editorialAutomationRunsTable)
    .where(eq(editorialAutomationRunsTable.runKey, runKey))
    .limit(1);
  if (existing.length > 0) {
    return { status: "skipped", cadence, runKey, published: 0, rejected: 0, candidates: 0, detail: { reason: "already_ran" } };
  }

  const [run] = await db
    .insert(editorialAutomationRunsTable)
    .values({ runKey, cadence, trigger, status: "running" })
    .returning();
  log("run_started", { runId: run.id, cadence, runKey, trigger });

  try {
    const discovered = await discoverOpenSources();
    await saveSourceItems(discovered);
    const items = await recentSourceItems();
    const candidates = items.filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index);
    const selected = [
      ...new Map(candidates.map((item) => [item.publisher, item])).values(),
      ...candidates,
    ]
      .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index)
      .slice(0, 10);
    if (selected.length < 2 || new Set(selected.map((item) => item.publisher)).size < 2) {
      const detail = {
        ...editorialModelConfiguration,
        reason: "insufficient_open_source_evidence",
        feeds: openSourceFeeds.map((source) => source.publisher),
      };
      await db.update(editorialAutomationRunsTable).set({ status: "skipped", candidates: selected.length, rejected: 1, detail, finishedAt: new Date() }).where(eq(editorialAutomationRunsTable.id, run.id));
      log("run_skipped", { runId: run.id, ...detail });
      return { status: "skipped", cadence, runKey, published: 0, rejected: 1, candidates: selected.length, detail };
    }

    let draft = await createDraft(selected);
    let verification = await verifyDraft(draft, selected);
    let errors = deterministicGate(draft, verification, selected);
    if (errors.some((error) => ["body_structure", "fact_check_failed", "unsupported_claims", "slop_detected"].includes(error))) {
      const revisedDraft = await reviseDraft(draft, verification, selected);
      const revisedVerification = await verifyDraft(revisedDraft, selected);
      draft = revisedDraft;
      verification = revisedVerification;
      errors = deterministicGate(draft, verification, selected);
      log("draft_revised", { runId: run.id, errors, verification });
    }
    if (errors.length > 0) {
      const detail = {
        ...editorialModelConfiguration,
        reason: "quality_gate_rejected",
        errors,
        draft,
        verification,
        validationSources: selected.map((item) => ({ url: item.url, publisher: item.publisher })),
      };
      await db.update(editorialAutomationRunsTable).set({ status: "completed", candidates: 1, rejected: 1, detail, finishedAt: new Date() }).where(eq(editorialAutomationRunsTable.id, run.id));
      log("draft_rejected", { runId: run.id, ...detail });
      return { status: "completed", cadence, runKey, published: 0, rejected: 1, candidates: 1, detail };
    }

    const publishAt = nextPublishAt(new Date());
    const story = buildStory(draft, verification, selected, publishAt, cadence);
    const [duplicate] = await db
      .select({ id: editorialReleasesTable.id })
      .from(editorialReleasesTable)
      .where(eq(editorialReleasesTable.slug, story.slug))
      .limit(1);
    if (duplicate || stories.some((item) => item.slug === story.slug)) {
      const detail = { ...editorialModelConfiguration, reason: "duplicate_slug", slug: story.slug, draft, verification };
      await db.update(editorialAutomationRunsTable).set({ status: "completed", candidates: 1, rejected: 1, detail, finishedAt: new Date() }).where(eq(editorialAutomationRunsTable.id, run.id));
      log("draft_rejected", { runId: run.id, ...detail });
      return { status: "completed", cadence, runKey, published: 0, rejected: 1, candidates: 1, detail };
    }

    const [{ maxPosition }] = await db
      .select({ maxPosition: editorialReleasesTable.position })
      .from(editorialReleasesTable)
      .orderBy(desc(editorialReleasesTable.position))
      .limit(1);
    await db.insert(editorialReleasesTable).values({
      slug: story.slug,
      title: story.title,
      publishAt,
      cadence,
      status: "scheduled",
      position: (maxPosition ?? -1) + 1,
      story: story as unknown as Record<string, unknown>,
    });
    const detail = {
      ...editorialModelConfiguration,
      title: story.title,
      slug: story.slug,
      publishAt: publishAt.toISOString(),
      sources: story.sources,
      draft,
      verification,
      validationSources: selected.map((item) => ({ url: item.url, publisher: item.publisher })),
    };
    await db.update(editorialAutomationRunsTable).set({ status: "completed", candidates: 1, published: 1, detail, finishedAt: new Date() }).where(eq(editorialAutomationRunsTable.id, run.id));
    log("article_scheduled", { runId: run.id, ...detail });
    return { status: "completed", cadence, runKey, published: 1, rejected: 0, candidates: 1, detail };
  } catch (error) {
    const detail = { ...editorialModelConfiguration, error: String(error) };
    await db.update(editorialAutomationRunsTable).set({ status: "failed", detail, finishedAt: new Date() }).where(eq(editorialAutomationRunsTable.id, run.id));
    log("run_failed", { runId: run.id, ...detail });
    return { status: "failed", cadence, runKey, published: 0, rejected: 0, candidates: 0, detail };
  }
}

export async function replayEditorialAutomationRuns(): Promise<EditorialReplayReport> {
  const [runs, sourceRows] = await Promise.all([
    db
      .select({
        id: editorialAutomationRunsTable.id,
        runKey: editorialAutomationRunsTable.runKey,
        status: editorialAutomationRunsTable.status,
        published: editorialAutomationRunsTable.published,
        rejected: editorialAutomationRunsTable.rejected,
        detail: editorialAutomationRunsTable.detail,
      })
      .from(editorialAutomationRunsTable)
      .orderBy(asc(editorialAutomationRunsTable.id)),
    db
      .select({
        url: editorialSourceItemsTable.url,
        publisher: editorialSourceItemsTable.publisher,
      })
      .from(editorialSourceItemsTable),
  ]);
  const sourcesByUrl = new Map(sourceRows.map((source) => [source.url, source]));
  const replayRuns = runs.map((run) => {
    const detail = run.detail && typeof run.detail === "object" && !Array.isArray(run.detail)
      ? run.detail
      : {};
    if (Array.isArray(detail.validationSources)) return run;
    const draft = detail.draft;
    const draftRecord =
      draft && typeof draft === "object" && !Array.isArray(draft)
        ? (draft as Record<string, unknown>)
        : null;
    const sourceUrls =
      draftRecord && Array.isArray(draftRecord.sourceUrls)
        ? draftRecord.sourceUrls.filter((url): url is string => typeof url === "string")
        : [];
    return {
      ...run,
      detail: {
        ...detail,
        validationSources: sourceUrls
          .map((url) => sourcesByUrl.get(url))
          .filter((source): source is { url: string; publisher: string } => Boolean(source)),
      },
    };
  });
  return replaySavedEditorialRuns(replayRuns);
}

export async function runEditorialAutomation(trigger = "manual"): Promise<AutomationResult[]> {
  if (activeRun) return activeRun;
  activeRun = (async () => {
    const now = new Date();
    const due = dueCadences(now);
    const requested =
      trigger === "manual"
        ? [{ cadence: "daily" as const, runKey: `manual-daily-${now.toISOString()}` }]
        : due;
    const results: AutomationResult[] = [];
    for (const item of requested) results.push(await runCadence(item.cadence, item.runKey, trigger));
    return results;
  })().finally(() => {
    activeRun = undefined;
  });
  return activeRun;
}

export async function getAutomationStatus(): Promise<Record<string, unknown>> {
  const [latest] = await db
    .select()
    .from(editorialAutomationRunsTable)
    .orderBy(desc(editorialAutomationRunsTable.startedAt))
    .limit(1);
  return {
    enabled: process.env.NODE_ENV === "production" || process.env.EDITORIAL_AUTOMATION_ENABLED === "true",
    intervalMinutes: AUTOMATION_INTERVAL_MS / 60_000,
    dailySlotUtc: `${String(DAILY_UTC_HOUR).padStart(2, "0")}:${String(DAILY_UTC_MINUTE).padStart(2, "0")}`,
    ...editorialModelConfiguration,
    openSourceFeeds: openSourceFeeds.map((source) => source.publisher),
    latestRun: latest ?? null,
  };
}

function stringValue(value: unknown, maxLength = 240): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim().slice(0, maxLength) : null;
}

function stringValues(value: unknown, maxItems = 12, maxLength = 500): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().slice(0, maxLength))
        .filter(Boolean)
        .slice(0, maxItems)
    : [];
}

export async function getAutomationRuns(limit = 50) {
  const rows = await db
    .select()
    .from(editorialAutomationRunsTable)
    .orderBy(desc(editorialAutomationRunsTable.startedAt), desc(editorialAutomationRunsTable.id))
    .limit(Math.min(Math.max(limit, 1), 100));

  return rows.map((row) => {
    const detail = row.detail ?? {};
    const verification = detail.verification && typeof detail.verification === "object" && !Array.isArray(detail.verification)
      ? detail.verification as Record<string, unknown>
      : {};
    const qualityGateReasons = stringValues(detail.errors);
    const outcome =
      row.published > 0
        ? "scheduled"
        : row.status === "failed"
          ? "failed"
          : row.status === "running"
            ? "running"
            : row.rejected > 0
              ? "rejected"
              : row.status === "skipped"
                ? "skipped"
                : "completed";

    return {
      id: row.id,
      runKey: row.runKey,
      cadence: row.cadence as EditorialCadence,
      trigger: row.trigger,
      status: row.status,
      outcome,
      candidates: row.candidates,
      published: row.published,
      rejected: row.rejected,
      title: stringValue(detail.title, 240),
      slug: stringValue(detail.slug, 120),
      publishAt: stringValue(detail.publishAt, 40),
      draftModel: stringValue(detail.draftModel, 120) ?? "configured draft model",
      verificationModel: stringValue(detail.verificationModel, 120) ?? "configured verification model",
      qualityGateReasons,
      verification: {
        pass: verification.pass === true,
        score: typeof verification.score === "number" && Number.isFinite(verification.score) ? verification.score : 0,
        unsupportedClaims: stringValues(verification.unsupportedClaims),
        slopFlags: stringValues(verification.slopFlags),
        notes: stringValue(verification.notes, 2000) ?? "",
      },
      startedAt: row.startedAt.toISOString(),
      finishedAt: row.finishedAt?.toISOString() ?? null,
    };
  });
}

export function startEditorialAutomation(): void {
  const enabled = process.env.NODE_ENV === "production" || process.env.EDITORIAL_AUTOMATION_ENABLED === "true";
  if (!enabled || scheduler) return;
  scheduler = setInterval(() => {
    void runEditorialAutomation("scheduled");
  }, AUTOMATION_INTERVAL_MS);
  scheduler.unref();
  setTimeout(() => void runEditorialAutomation("startup"), 10_000).unref();
  log("scheduler_started", { intervalMinutes: AUTOMATION_INTERVAL_MS / 60_000 });
}

export async function getDynamicSourceRecords() {
  const rows = await db
    .select()
    .from(editorialSourceItemsTable)
    .orderBy(desc(editorialSourceItemsTable.fetchedAt))
    .limit(200);
  return rows.map((row) => ({
    slug: row.sourceSlug,
    name: row.title,
    publisher: row.publisher,
    kind: "primary" as const,
    url: row.url,
    accessed: row.fetchedAt.toISOString().slice(0, 10),
  }));
}
