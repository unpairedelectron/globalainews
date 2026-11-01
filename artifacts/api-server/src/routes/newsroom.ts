import { and, asc, desc, eq, sql } from "drizzle-orm";
import { gzipSync } from "node:zlib";
import {
  Router,
  type IRouter,
  type Request,
  type Response as ExpressResponse,
} from "express";
import { requireEditorAuth } from "../middlewares/requireEditorAuth";
import { shouldSeedDefaultSchedule } from "../editorial/release-seeding";
import {
  getPublishedArticleRegistry,
  onPublicationStateChanged,
} from "../editorial/publication-state";
import {
  db,
  editorialAutomationRunsTable,
  editorialReleaseHistoryTable,
  editorialReleasesTable,
  comparisonSourceReviewsTable,
  profileReviewDatesTable,
} from "@workspace/db";
import {
  CancelNewsroomReleaseResponse,
  CreateNewsroomReleaseBody,
  CreateNewsroomReleaseResponse,
  GetNewsroomContentResponse,
  GetNewsroomReleaseHistoryResponse,
  EditorialReleaseHistoryAction,
  GetNewsroomMetadataResponse,
  GetNewsroomAutomationRunsResponse,
  GetNewsroomReleasesResponse,
  ReorderNewsroomReleasesBody,
  ReorderNewsroomReleasesResponse,
  UpdateNewsroomReleaseBody,
  UpdateNewsroomReleaseParams,
  UpdateNewsroomReleaseResponse,
  GetNewsroomProfileReviewsResponse,
  UpdateNewsroomProfileReviewBody,
  UpdateNewsroomProfileReviewParams,
  UpdateNewsroomProfileReviewResponse,
} from "@workspace/api-zod";
import {
  askGlobalAnswers,
  authors,
  canonicalStorySlug,
  entities,
  essays,
  evidenceSummaries,
  getEditorialLifecycleStatus,
  getPublicDateModified,
  getStoryAuthorIdentity,
  getStoryReadTime,
  getReleaseDraftWordCount,
  getReleaseWordCount,
  getEditorialWordCountBounds,
  getEntityProfileReviewQueueState,
  getEntityProfileClaims,
  compareEntityProfileClaims,
  summarizeEntityProfileClaimComparison,
  getPublicStoryDek,
  getPublishedStories,
  mergeEligiblePublishedStories,
  isPublicArticle,
  resolveMaintainedReleaseStory,
  getStoryWordCount,
  indiaIndex,
  industryMap,
  scheduledStories,
  signals,
  sources as maintainedSources,
  stories,
  timelineEvents,
  type EditorialCadence,
  type EditorialSection,
  type Source,
  type ScheduledStory,
  type Story,
  type StoryCategory,
} from "../../../global-ai-news/src/content";
import {
  buildAuthorityGraph,
  dataProductRecords,
  researchRecords,
  topicRecords,
} from "../../../global-ai-news/src/authority/registry";
import {
  getCanonicalUrl,
  getSeoMetadataManifest,
  SITE_URL,
} from "../../../global-ai-news/src/seo-metadata";
import { renderSocialPreviewSvg } from "../../../global-ai-news/src/social-preview";
import { renderSocialPreviewPng } from "../lib/social-preview-png";
import {
  isPublicNewsroomCacheFresh,
  publicNewsroomCacheControl,
  publicNewsroomSnapshotExpiresAt,
} from "../lib/public-newsroom-cache";
import {
  getAutomationStatus,
  getAutomationRuns,
  runEditorialAutomation,
  type AutomationRunFilters,
  type AutomationRunOutcome,
} from "../editorial/automation";
import {
  addOneCalendarMonth,
  isMonitoredComparisonSlug,
  monitoredComparisonSlugs,
  type MonitoredComparisonSlug,
} from "../editorial/comparison-source-reviews";

const router: IRouter = Router();

type ReleaseRow = typeof editorialReleasesTable.$inferSelect;
type ReleaseHistoryInsert = typeof editorialReleaseHistoryTable.$inferInsert;
type PublicNewsroomContentSnapshot = ReturnType<typeof GetNewsroomContentResponse.parse>;
let publishedReleaseSnapshot: EditorialReleaseStory[] = [];
let publicNewsroomContentCache:
  | { snapshot: PublicNewsroomContentSnapshot; cachedAt: number; expiresAt: number }
  | undefined;
let publicNewsroomContentRefresh: Promise<void> | undefined;

function isValidProfileReviewDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function invalidatePublicNewsroomContentCache(): void {
  publicNewsroomContentCache = undefined;
}

onPublicationStateChanged(invalidatePublicNewsroomContentCache);

type ReleaseInput = {
  slug: string;
  title: string;
  dek: string;
  publishAt: Date;
  cadence: EditorialCadence;
  category: string;
  author: string;
  body: string;
  section?: EditorialSection;
};
type ReleaseUpdate = Partial<Omit<ReleaseInput, "slug">>;
type EditorialReleaseStory = ScheduledStory & {
  editorialSource?: "editor";
};

function toPublicStory(
  story: Story,
  publicStorySlugs: ReadonlySet<string>,
): Omit<Story, "updatedAt"> {
  const dek = getPublicStoryDek(story) ?? "";
  const dateModified = getPublicDateModified(story);
  const author = getStoryAuthorIdentity(story, authors);
  const isVerifiedPerson = author.type === "Person" && Boolean(author.slug);
  return {
    slug: story.slug,
    category: story.category,
    title: story.title,
    dek,
    body: story.body,
    date: story.date,
    ...(dateModified ? { dateModified } : {}),
    readTime: getStoryReadTime({ ...story, dek }),
    author: author.slug ?? "global-ai-news-editorial-desk",
    authorType: isVerifiedPerson ? "person" : "organization",
    authorName: author.name,
    evidence: story.evidence,
    evidenceSummary: story.evidenceSummary,
    classification: story.classification,
    ...(story.contentType ? { contentType: story.contentType } : {}),
    entities: story.entities,
    timeline: story.timeline,
    relatedStories: story.relatedStories
      .map(canonicalStorySlug)
      .filter((slug) => publicStorySlugs.has(slug)),
    imageTreatment: story.imageTreatment,
    topic: story.topic,
    sources: story.sources,
    bottomLine: story.bottomLine,
    whyItMatters: story.whyItMatters,
    keyTakeaways: story.keyTakeaways,
    whatChanges: story.whatChanges,
  };
}

let seedPromise: Promise<void> | undefined;

function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function actorFromRequest(req: Request): string {
  const actor = req.res?.locals?.editorUserId;
  return typeof actor === "string" && actor.trim().length > 0 ? actor.trim().slice(0, 120) : "Editorial desk";
}

function historyEntry(
  req: Request,
  entry: Omit<ReleaseHistoryInsert, "actor">,
): ReleaseHistoryInsert {
  return { ...entry, actor: actorFromRequest(req) };
}

function formatReleaseDate(date: Date): string {
  return date.toISOString().replace(".000Z", "Z");
}

function storyFromInput(
  input: ReleaseInput | ReleaseUpdate,
  existing?: EditorialReleaseStory,
): EditorialReleaseStory {
  const publishAt = input.publishAt ?? (existing ? new Date(existing.publishAt) : new Date());
  const title = input.title ?? existing?.title ?? "Untitled release";
  const dek = input.dek ?? existing?.dek ?? "";
  const bodyText = input.body ?? existing?.body.map((section) => section.paragraphs.join("\n\n")).join("\n\n") ?? dek;
  const paragraphs = bodyText.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const base = existing ?? scheduledStories[0];

  return {
    ...base,
    slug: ("slug" in input ? input.slug : undefined) ?? base.slug,
    title,
    dek,
    date: dateOnly(publishAt),
    dateModified: existing?.dateModified,
    publishAt: publishAt.toISOString(),
    cadence: input.cadence ?? existing?.cadence ?? "daily",
    category: (input.category ?? existing?.category ?? "Field Notes") as StoryCategory,
    author: input.author ?? existing?.author ?? authors[0]?.slug ?? "global-ai-news",
    body: paragraphs.map((paragraph, index) => ({
      heading: index === 0 ? "The signal" : "What changes",
      paragraphs: [paragraph],
    })),
    ...(input.section ? { section: input.section } : {}),
    editorialSource: "editor",
  };
}

function storyBodyText(story: ScheduledStory): string {
  return story.body.flatMap((section) => section.paragraphs).join("\n\n");
}

async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [existing] = await db
        .select({ id: editorialReleasesTable.id })
        .from(editorialReleasesTable)
        .limit(1);
      if (existing) return;

      await db.insert(editorialReleasesTable).values(
        scheduledStories.map((story, position) => ({
          slug: story.slug,
          title: story.title,
          publishAt: new Date(story.publishAt),
          cadence: story.cadence,
          status: "scheduled",
          position,
          story: story as unknown as Record<string, unknown>,
        })),
      );
    })().catch((error) => {
      seedPromise = undefined;
      throw error;
    });
  }
  await seedPromise;
}

async function getReleaseRows(): Promise<ReleaseRow[]> {
  if (shouldSeedDefaultSchedule()) await ensureSeeded();
  const rows = await db
    .select()
    .from(editorialReleasesTable)
    .orderBy(asc(editorialReleasesTable.position), asc(editorialReleasesTable.publishAt));
  const now = new Date();
  publishedReleaseSnapshot = rows.flatMap((row) => {
    const story = toScheduledStory(row);
    const wordCount = releaseWordCount(story, row.slug);
    const bounds = getEditorialWordCountBounds(releaseSection(story));
    const publishAt = Date.parse(story.publishAt);
    return (
      (row.status === "scheduled" || row.status === "published") &&
      Number.isFinite(publishAt) &&
      wordCount >= bounds.minimum &&
      (bounds.maximum === undefined || wordCount <= bounds.maximum)
    ) ? [story] : [];
  });
  invalidatePublicNewsroomContentCache();
  return rows;
}

function toScheduledStory(row: ReleaseRow): EditorialReleaseStory {
  const storedStory = row.story as unknown as EditorialReleaseStory;
  const maintainedStory = scheduledStories.find((candidate) => candidate.slug === row.slug);
  const useMaintainedStory =
    Boolean(maintainedStory) && storedStory.editorialSource !== "editor";
  const story = resolveMaintainedReleaseStory(
    storedStory,
    maintainedStory,
  ) as EditorialReleaseStory;
  return {
    ...story,
    slug: row.slug,
    title: useMaintainedStory ? story.title : row.title,
    readTime: getStoryReadTime({
      ...story,
      title: useMaintainedStory ? story.title : row.title,
    }),
    publishAt: row.publishAt.toISOString(),
    cadence: row.cadence as EditorialCadence,
    date: dateOnly(row.publishAt),
    dateModified: useMaintainedStory
      ? maintainedStory?.dateModified ?? storedStory.dateModified
      : storedStory.dateModified,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function releaseWordCount(story: EditorialReleaseStory, slug = story.slug): number {
  const maintainedStory = scheduledStories.find((candidate) => candidate.slug === slug);
  if (story.editorialSource === "editor" || !maintainedStory) {
    return getReleaseWordCount(story.dek, story.body);
  }
  return getStoryWordCount(maintainedStory);
}

function releaseSection(story: EditorialReleaseStory): EditorialSection | undefined {
  return story.section === "Brief" || story.section === "Research" || story.section === "Data"
    ? story.section
    : undefined;
}

function toReleaseResponse(row: ReleaseRow, now = new Date()) {
  const story = toScheduledStory(row);
  const wordCount = releaseWordCount(story, row.slug);
  const section = releaseSection(story);
  const bounds = getEditorialWordCountBounds(section);
  const publishable = wordCount >= bounds.minimum
    && (bounds.maximum === undefined || wordCount <= bounds.maximum);
  const status = getEditorialLifecycleStatus(
    row.status,
    story.publishAt,
    wordCount,
    now,
    section,
  );
  return {
    id: row.id,
    slug: row.slug,
    title: story.title,
    dek: story.dek,
    publishAt: row.publishAt,
    cadence: row.cadence as EditorialCadence,
    status,
    position: row.position,
    story: story as unknown as Record<string, unknown>,
    wordCount,
    minimumWordCount: bounds.minimum,
    ...(bounds.maximum === undefined ? {} : { maximumWordCount: bounds.maximum }),
    ...(section ? { section } : {}),
    remainingWords: Math.max(0, bounds.minimum - wordCount),
    publishable,
    updatedAt: row.updatedAt,
  };
}

function newsroomPublicationNow(): Date {
  const fixedNow = process.env.NODE_ENV === "test"
    ? process.env.NEWSROOM_TEST_PUBLICATION_NOW
    : undefined;
  if (!fixedNow) return new Date();
  const parsed = new Date(fixedNow);
  if (!Number.isFinite(parsed.getTime())) {
    throw new Error("NEWSROOM_TEST_PUBLICATION_NOW must be a valid date.");
  }
  return parsed;
}

async function getPublishedStoriesFromSnapshot(): Promise<Story[]> {
  const now = newsroomPublicationNow();
  const maintainedPublishedStories = getPublishedStories(now);
  const eligibleReleases = publishedReleaseSnapshot.filter((story) =>
    isPublicArticle({
      status: "scheduled",
      publishAt: story.publishAt,
      wordCount: releaseWordCount(story, story.slug),
      section: releaseSection(story),
    }, now),
  );
  return mergeEligiblePublishedStories(now, [
    ...maintainedPublishedStories,
    ...eligibleReleases,
  ]);
}

function nextScheduledPublicationAt(now: number): number | undefined {
  const upcoming = publishedReleaseSnapshot
    .map((story) => Date.parse(story.publishAt))
    .filter((publishAt) => Number.isFinite(publishAt) && publishAt > now);
  return upcoming.length > 0 ? Math.min(...upcoming) : undefined;
}

function setPublicNewsroomContentHeaders(
  res: ExpressResponse,
  expiresAt: number,
  now: number,
): void {
  res.setHeader("X-Robots-Tag", "noindex");
  res.setHeader("Cache-Control", publicNewsroomCacheControl(expiresAt, now));
}

function rejectShortRelease(
  res: ExpressResponse,
  section: EditorialSection | undefined,
  dek: string,
  body: string,
): boolean {
  const wordCount = getReleaseDraftWordCount(dek, body);
  const bounds = getEditorialWordCountBounds(section);
  if (wordCount >= bounds.minimum && (bounds.maximum === undefined || wordCount <= bounds.maximum)) return false;
  const reason = wordCount < bounds.minimum
    ? `A ${section ?? "Research"} release needs at least ${bounds.minimum} editorial words`
    : `A Brief release must not exceed ${bounds.maximum} editorial words`;
  res.status(422).json({
    error: `${reason} before it can enter the queue. This draft has ${wordCount}.`,
    wordCount,
    minimumWordCount: bounds.minimum,
    maximumWordCount: bounds.maximum,
  });
  return true;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

router.get("/newsroom/automation/status", requireEditorAuth, async (_req, res): Promise<void> => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.json(await getAutomationStatus());
  } catch (error) {
    res.status(500).json({ error: "Automation status unavailable." });
  }
});

router.get("/newsroom/automation/runs", requireEditorAuth, async (req, res): Promise<void> => {
  try {
    const outcome = typeof req.query.outcome === "string" ? req.query.outcome : undefined;
    const cadence = typeof req.query.cadence === "string" ? req.query.cadence : undefined;
    const outcomes = new Set<AutomationRunOutcome>(["scheduled", "completed", "rejected", "skipped", "failed", "running"]);
    const cadences = new Set(["daily", "weekly"]);
    if ((outcome && !outcomes.has(outcome as AutomationRunOutcome)) || (cadence && !cadences.has(cadence))) {
      res.status(400).json({ error: "Invalid automation run filter." });
      return;
    }
    const filters: AutomationRunFilters = {
      outcome: outcome as AutomationRunOutcome | undefined,
      cadence: cadence as EditorialCadence | undefined,
    };
    res.setHeader("Cache-Control", "no-store");
    res.json(GetNewsroomAutomationRunsResponse.parse(await getAutomationRuns(50, filters)));
  } catch (error) {
    req.log.error({ err: error }, "Automation audit read failed");
    res.status(500).json({ error: "Automation audit unavailable." });
  }
});

router.post("/newsroom/automation/run", requireEditorAuth, async (_req, res): Promise<void> => {
  try {
    res.status(202).json({ accepted: true, results: await runEditorialAutomation("manual") });
  } catch (error) {
    res.status(500).json({ error: "Automation run failed." });
  }
});

if (process.env.NODE_ENV === "test") {
  router.post("/newsroom/automation/runs/smoke-fixture", requireEditorAuth, async (_req, res): Promise<void> => {
    const slug = "smoke-automation-audit-release";
    const title = "Smoke test scheduled automation release";
    const publishAt = new Date(Date.now() + 60 * 60 * 1000);
    const baseStory = scheduledStories[0];
    const story = {
      ...baseStory,
      slug,
      title,
      publishAt: publishAt.toISOString(),
      date: dateOnly(publishAt),
    };
    const detail = {
      title,
      slug,
      publishAt: publishAt.toISOString(),
      draftModel: "smoke fixture",
      verificationModel: "smoke fixture",
      verification: {
        pass: true,
        score: 1,
        unsupportedClaims: [],
        slopFlags: [],
        notes: "Deterministic smoke fixture.",
      },
    };

    await db.transaction(async (tx) => {
      const [existingRelease] = await tx
        .select()
        .from(editorialReleasesTable)
        .where(eq(editorialReleasesTable.slug, slug))
        .limit(1);
      if (existingRelease) {
        await tx
          .update(editorialReleasesTable)
          .set({ title, publishAt, status: "scheduled", story, updatedAt: new Date() })
          .where(eq(editorialReleasesTable.id, existingRelease.id));
      } else {
        const [{ maxPosition }] = await tx
          .select({ maxPosition: editorialReleasesTable.position })
          .from(editorialReleasesTable)
          .orderBy(desc(editorialReleasesTable.position))
          .limit(1);
        await tx.insert(editorialReleasesTable).values({
          slug,
          title,
          publishAt,
          cadence: "daily",
          status: "scheduled",
          position: (maxPosition ?? -1) + 1,
          story,
        });
      }

      const [existingRun] = await tx
        .select({ id: editorialAutomationRunsTable.id })
        .from(editorialAutomationRunsTable)
        .where(eq(editorialAutomationRunsTable.runKey, "smoke-automation-audit"))
        .limit(1);
      if (existingRun) {
        await tx
          .update(editorialAutomationRunsTable)
          .set({
            cadence: "daily",
            trigger: "smoke",
            status: "completed",
            candidates: 1,
            published: 1,
            rejected: 0,
            detail,
            finishedAt: new Date(),
          })
          .where(eq(editorialAutomationRunsTable.id, existingRun.id));
      } else {
        await tx.insert(editorialAutomationRunsTable).values({
          runKey: "smoke-automation-audit",
          cadence: "daily",
          trigger: "smoke",
          status: "completed",
          candidates: 1,
          published: 1,
          rejected: 0,
          detail,
          finishedAt: new Date(),
        });
      }
    });

    res.status(201).json({ slug, title });
  });

  router.delete("/newsroom/automation/runs/smoke-fixture", requireEditorAuth, async (_req, res): Promise<void> => {
    await db
      .delete(editorialAutomationRunsTable)
      .where(eq(editorialAutomationRunsTable.runKey, "smoke-automation-audit"));
    res.status(204).end();
  });
}

type NewsroomSitemapGroup = "all" | "articles" | "topics" | "authors" | "static";

function isSitemapRouteInGroup(path: string, group: NewsroomSitemapGroup): boolean {
  if (group === "all") return true;
  if (group === "articles") return path.startsWith("/article/");
  if (group === "topics") return path.startsWith("/topic/");
  if (group === "authors") return path.startsWith("/person/");
  return !path.startsWith("/article/") && !path.startsWith("/topic/") && !path.startsWith("/person/");
}

function sendSitemapBody(req: Request, res: ExpressResponse, body: string): void {
  res
    .status(200)
    .type("application/xml")
    .set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300")
    .vary("Accept-Encoding");
  if (req.acceptsEncodings("gzip") === "gzip") {
    res.setHeader("Content-Encoding", "gzip");
    res.send(gzipSync(body));
    return;
  }
  res.send(body);
}

export async function serveNewsroomSitemapIndex(
  req: Request,
  res: ExpressResponse,
): Promise<void> {
  const groups: NewsroomSitemapGroup[] = ["articles", "topics", "authors", "static"];
  const entries = groups.map((group) =>
    `  <sitemap><loc>${escapeXml(`${SITE_URL}/sitemap-${group}.xml`)}</loc></sitemap>`,
  );
  entries.push(`  <sitemap><loc>${escapeXml(`${SITE_URL}/news-sitemap.xml`)}</loc></sitemap>`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>`;
  sendSitemapBody(req, res, body);
}

export async function serveNewsroomSitemap(
  req: Request,
  res: ExpressResponse,
  group: NewsroomSitemapGroup,
): Promise<void> {
  try {
    const publishedStories = await getPublishedStoriesFromSnapshot();
    const metadataManifest = getSeoMetadataManifest(publishedStories);
    const routes = metadataManifest.routes.filter(
      (metadata) => metadata.indexable !== false && isSitemapRouteInGroup(metadata.path, group),
    );
    const registryArticles = group === "all" || group === "articles"
      ? await getPublishedArticleRegistry(newsroomPublicationNow())
      : [];
    const routeEntries = routes
      .map((metadata) => {
        const lastmod = metadata.lastmod
          ? `<lastmod>${escapeXml(metadata.lastmod)}</lastmod>`
          : "";
        const image = metadata.imagePath
          ? `<image:image><image:loc>${escapeXml(`${SITE_URL}${metadata.imagePath}`)}</image:loc><image:title>${escapeXml(metadata.title)}</image:title></image:image>`
          : "";
        return `  <url><loc>${escapeXml(getCanonicalUrl(metadata.path))}</loc>${lastmod}${image}</url>`;
      });
    const registryEntries = registryArticles.map((article) =>
      `  <url><loc>${escapeXml(getCanonicalUrl(`/article/${article.slug}`))}</loc><lastmod>${escapeXml(article.lastmod.toISOString())}</lastmod></url>`,
    );
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${[...routeEntries, ...registryEntries].join("\n")}\n</urlset>`;
    sendSitemapBody(req, res, body);
  } catch (error) {
    req.log.error({ err: error }, "Newsroom sitemap failed");
    res.status(500).type("text/plain").send("Sitemap unavailable.");
  }
}

router.get("/newsroom/sitemap.xml", (req, res) => serveNewsroomSitemap(req, res, "all"));
router.get("/newsroom/sitemap-index.xml", serveNewsroomSitemapIndex);
router.get("/newsroom/sitemap-articles.xml", (req, res) => serveNewsroomSitemap(req, res, "articles"));
router.get("/newsroom/sitemap-topics.xml", (req, res) => serveNewsroomSitemap(req, res, "topics"));
router.get("/newsroom/sitemap-authors.xml", (req, res) => serveNewsroomSitemap(req, res, "authors"));
router.get("/newsroom/sitemap-static.xml", (req, res) => serveNewsroomSitemap(req, res, "static"));

router.get("/newsroom/news-sitemap.xml", async (req, res): Promise<void> => {
  try {
    const recentCutoff = Date.now() - 48 * 60 * 60 * 1000;
    const recentStories = (await getPublishedStoriesFromSnapshot())
      .filter((story) => Date.parse(`${story.date}T00:00:00Z`) >= recentCutoff)
      .map((story) => `  <url><loc>${escapeXml(getCanonicalUrl(`/article/${story.slug}`))}</loc><news:news><news:publication><news:name>Global AI News</news:name><news:language>en</news:language></news:publication><news:publication_date>${escapeXml(`${story.date}T00:00:00Z`)}</news:publication_date><news:title>${escapeXml(story.title)}</news:title></news:news></url>`);
    const registryStories = (await getPublishedArticleRegistry(newsroomPublicationNow()))
      .filter((story) => story.publishAt.getTime() >= recentCutoff)
      .map((story) => `  <url><loc>${escapeXml(getCanonicalUrl(`/article/${story.slug}`))}</loc><news:news><news:publication><news:name>Global AI News</news:name><news:language>en</news:language></news:publication><news:publication_date>${escapeXml(story.publishAt.toISOString())}</news:publication_date><news:title>${escapeXml(story.title)}</news:title></news:news></url>`);
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${[...recentStories, ...registryStories].join("\n")}\n</urlset>`;
    sendSitemapBody(req, res, body);
  } catch (error) {
    req.log.error({ err: error }, "News sitemap failed");
    res.status(500).type("text/plain").send("News sitemap unavailable.");
  }
});

type PublicRegistryArticle = Awaited<ReturnType<typeof getPublishedArticleRegistry>>[number];

function renderRssFeed(
  title: string,
  feedUrl: string,
  stories: Story[],
  registryArticles: PublicRegistryArticle[] = [],
): string {
  const items = stories.map((story) => {
    const url = escapeXml(getCanonicalUrl(`/article/${story.slug}`));
    return `    <item><title>${escapeXml(story.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${story.date}T07:30:00Z`).toUTCString()}</pubDate><description>${escapeXml(story.dek)}</description></item>`;
  }).concat(registryArticles.map((story) => {
    const url = escapeXml(getCanonicalUrl(`/article/${story.slug}`));
    return `    <item><title>${escapeXml(story.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${story.publishAt.toUTCString()}</pubDate><description>${escapeXml(story.description)}</description></item>`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(title)}</title><link>${escapeXml(feedUrl)}</link><description>Evidence-led reporting, research and context from Global AI News.</description><language>en-IN</language>\n${items.join("\n")}\n</channel></rss>`;
}

export async function serveNewsroomFeed(_req: Request, res: ExpressResponse): Promise<void> {
  try {
    const publishedStories = await getPublishedStoriesFromSnapshot();
    const registryArticles = await getPublishedArticleRegistry(newsroomPublicationNow());
    const body = renderRssFeed("Global AI News", `${SITE_URL}/`, publishedStories, registryArticles);
    res
      .type("application/rss+xml")
      .set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300")
      .send(body);
  } catch (error) {
    res.status(500).type("text/plain").send("Feed unavailable.");
  }
}

router.get("/newsroom/feed.xml", serveNewsroomFeed);
router.get("/newsroom/feed.json", async (_req, res): Promise<void> => {
  try {
    const stories = await getPublishedStoriesFromSnapshot();
    const registryArticles = await getPublishedArticleRegistry(newsroomPublicationNow());
    res
      .type("application/feed+json")
      .set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300")
      .json({
        version: "https://jsonfeed.org/version/1.1",
        title: "Global AI News",
        home_page_url: `${SITE_URL}/`,
        feed_url: `${SITE_URL}/feed.json`,
        description: "Evidence-led reporting, research and context from Global AI News.",
        language: "en-IN",
        items: [
          ...stories.map((story) => ({
            id: getCanonicalUrl(`/article/${story.slug}`),
            url: getCanonicalUrl(`/article/${story.slug}`),
            title: story.title,
            content_text: story.dek,
            summary: story.dek,
            date_published: new Date(`${story.date}T07:30:00Z`).toISOString(),
            ...(getPublicDateModified(story)
              ? { date_modified: new Date(`${getPublicDateModified(story)}T07:30:00Z`).toISOString() }
              : {}),
          })),
          ...registryArticles.map((story) => ({
            id: getCanonicalUrl(`/article/${story.slug}`),
            url: getCanonicalUrl(`/article/${story.slug}`),
            title: story.title,
            content_text: story.description,
            summary: story.description,
            date_published: story.publishAt.toISOString(),
            date_modified: story.lastmod.toISOString(),
          })),
        ],
      });
  } catch (error) {
    _req.log.error({ err: error }, "Newsroom JSON feed failed");
    res.status(500).type("text/plain").send("Feed unavailable.");
  }
});
router.get("/newsroom/topic/:slug/feed.xml", async (req, res): Promise<void> => {
  const topic = topicRecords.find((candidate) => candidate.slug === req.params.slug);
  if (!topic) {
    res.status(404).type("text/plain").send("Topic feed not found.");
    return;
  }
  try {
    const publishedStories = await getPublishedStoriesFromSnapshot();
    const topicStories = topic.storySlugs
      .map((slug) => publishedStories.find((story) => story.slug === slug))
      .filter((story): story is Story => Boolean(story));
    const registryArticles = (await getPublishedArticleRegistry(newsroomPublicationNow()))
      .filter((story) => topic.slug === "india"
        ? /india/i.test(story.topic)
        : topic.slug === "ai" && !/india/i.test(story.topic));
    const body = renderRssFeed(topic.label, getCanonicalUrl(topic.route), topicStories, registryArticles);
    res
      .type("application/rss+xml")
      .set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300")
      .send(body);
  } catch (error) {
    req.log.error({ err: error }, "Topic feed failed");
    res.status(500).type("text/plain").send("Feed unavailable.");
  }
});

router.get("/newsroom/social/articles/:slug.svg", async (req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromSnapshot();
    const story = publishedStories.find((candidate) => candidate.slug === req.params.slug);
    if (!story) {
      res.status(404).type("text/plain").send("Social preview not found.");
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=300");
    res.type("image/svg+xml").send(renderSocialPreviewSvg(story.title, story.category, story.slug));
  } catch (error) {
    res.status(500).type("text/plain").send("Social preview unavailable.");
  }
});

router.get("/newsroom/social/articles/:slug.png", async (req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromSnapshot();
    const story = publishedStories.find((candidate) => candidate.slug === req.params.slug);
    if (!story) {
      res.status(404).type("text/plain").send("Social preview not found.");
      return;
    }
    const png = await renderSocialPreviewPng(story.title, story.category, story.slug);
    res
      .set("Cache-Control", "public, max-age=300")
      .type("image/png")
      .send(png);
  } catch (error) {
    req.log.error({ err: error, slug: req.params.slug }, "Social preview rendering failed");
    res.status(500).type("text/plain").send("Social preview unavailable.");
  }
});

router.get("/newsroom/content", async (req, res): Promise<void> => {
  const startedAt = Date.now();
  const requestIdHeader = req.get("X-GAN-Request-ID");
  const safeWebRequestId =
    requestIdHeader &&
    /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(
      requestIdHeader,
    )
      ? requestIdHeader
      : undefined;
  const cachedSnapshot = publicNewsroomContentCache;
  const cacheAgeMs = cachedSnapshot ? startedAt - cachedSnapshot.cachedAt : undefined;
  if (
    cachedSnapshot &&
    isPublicNewsroomCacheFresh(cachedSnapshot, startedAt)
  ) {
    req.log.info(
      {
        event: "newsroom_content_snapshot_cache_hit",
        route: "/api/newsroom/content",
        webRequestId: safeWebRequestId,
        elapsedMs: Date.now() - startedAt,
        cacheAgeMs,
        storyCount: cachedSnapshot.snapshot.stories.length,
      },
      "Served cached public newsroom snapshot",
    );
    setPublicNewsroomContentHeaders(res, cachedSnapshot.expiresAt, startedAt);
    res.json(cachedSnapshot.snapshot);
    return;
  }

  if (publicNewsroomContentRefresh) {
    await publicNewsroomContentRefresh;
    const refreshedSnapshot = publicNewsroomContentCache;
    const resumedAt = Date.now();
    if (refreshedSnapshot && isPublicNewsroomCacheFresh(refreshedSnapshot, resumedAt)) {
      req.log.info(
        {
          event: "newsroom_content_snapshot_cache_hit",
          route: "/api/newsroom/content",
          webRequestId: safeWebRequestId,
          elapsedMs: resumedAt - startedAt,
          cacheAgeMs: resumedAt - refreshedSnapshot.cachedAt,
          storyCount: refreshedSnapshot.snapshot.stories.length,
          joinedRefresh: true,
        },
        "Served newsroom snapshot from a concurrent refresh",
      );
      setPublicNewsroomContentHeaders(res, refreshedSnapshot.expiresAt, resumedAt);
      res.json(refreshedSnapshot.snapshot);
      return;
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(500).json({ error: "Newsroom content source unavailable." });
    return;
  }

  let completeRefresh!: () => void;
  const refreshPromise = new Promise<void>((resolve) => {
    completeRefresh = resolve;
  });
  publicNewsroomContentRefresh = refreshPromise;
  let phase = "published_stories";
  let publishedStoriesMs = 0;
  let dynamicSourcesMs = 0;
  let snapshotValidationMs = 0;
  try {
    const publishedStoriesStartedAt = Date.now();
    const publishedStories = await getPublishedStoriesFromSnapshot();
    publishedStoriesMs = Date.now() - publishedStoriesStartedAt;
    const publishedStorySlugs = new Set(publishedStories.map((story) => story.slug));
    const publicTimelineEvents = timelineEvents.filter(
      (event) => !event.story || publishedStorySlugs.has(canonicalStorySlug(event.story)),
    );
    const publicTimelineSlugs = new Set(publicTimelineEvents.map((event) => event.slug));
    const publicEntitySlugs = new Set(entities.map((entity) => entity.slug));
    const publicResearchRecords = researchRecords.filter(
      (record) => record.status === "published" && publishedStorySlugs.has(record.storySlug),
    ).map((record) => ({
      ...record,
      relatedStorySlugs: record.relatedStorySlugs
        .map(canonicalStorySlug)
        .filter((slug) => publishedStorySlugs.has(slug)),
      timelineSlugs: record.timelineSlugs.filter((slug) => publicTimelineSlugs.has(slug)),
    }));
    const publicDataProducts = dataProductRecords.filter(
      (record) => record.status === "published" && record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
    ).map((record) => ({
      ...record,
      storySlugs: record.storySlugs
        .map(canonicalStorySlug)
        .filter((slug) => publishedStorySlugs.has(slug)),
    }));
    const publicTopics = topicRecords.filter(
      (record) => record.indexable && record.storySlugs.some((slug) => publishedStorySlugs.has(slug)),
    ).map((record) => ({
      ...record,
      storySlugs: record.storySlugs
        .map(canonicalStorySlug)
        .filter((slug) => publishedStorySlugs.has(slug)),
      timelineSlugs: record.timelineSlugs.filter((slug) => publicTimelineSlugs.has(slug)),
    }));
    const citedSourceSlugs = new Set([
      ...publishedStories.flatMap((story) => story.sources),
      ...indiaIndex.map((metric) => metric.source),
      ...publicTimelineEvents.flatMap((event) => event.sourceSlugs ?? []),
      ...publicResearchRecords.flatMap((record) => record.sourceSlugs),
      ...publicDataProducts.flatMap((record) => record.sourceSlugs),
      ...publicTopics.flatMap((record) => record.sourceSlugs),
    ]);
    phase = "source_index";
    const sourceRecords: Source[] = maintainedSources.filter((source) =>
      citedSourceSlugs.has(source.slug),
    );
    const publicSources = sourceRecords.map((source) => ({
      ...source,
      title: source.title ?? source.name,
      ...(source.classification
        ? { classification: source.classification }
        : source.kind === "primary"
          ? { classification: "primary" as const }
          : source.kind === "independent"
            ? { classification: "secondary" as const }
            : {}),
      ...((source.relevance ?? source.scopeNote)
        ? { relevance: source.relevance ?? source.scopeNote }
        : {}),
    }));
    const resolvedSourceSlugs = new Set(publicSources.map((source) => source.slug));
    const unresolvedSourceSlugs = [...citedSourceSlugs].filter(
      (slug) => !resolvedSourceSlugs.has(slug),
    );
    if (unresolvedSourceSlugs.length > 0) {
      throw new Error(
        `Published newsroom stories reference unavailable sources: ${unresolvedSourceSlugs.join(", ")}`,
      );
    }
    const latestPublishedAt = publishedStories.reduce(
      (latest, story) => (story.date > latest ? story.date : latest),
      "",
    );
    const stale =
      latestPublishedAt.length > 0 &&
      Date.now() - Date.parse(`${latestPublishedAt}T23:59:59Z`) > 36 * 60 * 60 * 1000;
    phase = "snapshot_validation";
    const snapshotValidationStartedAt = Date.now();
    const savedProfileReviews = await db
      .select({
        profileSlug: profileReviewDatesTable.profileSlug,
        reviewedAt: profileReviewDatesTable.reviewedAt,
        reviewHistory: profileReviewDatesTable.reviewHistory,
      })
      .from(profileReviewDatesTable);
    const profileReviewDatesBySlug = new Map(
      savedProfileReviews.map((review) => [review.profileSlug, review.reviewedAt]),
    );
    const profileReviewHistoryBySlug = new Map(
      savedProfileReviews.map((review) => [review.profileSlug, review.reviewHistory]),
    );
    const snapshot = GetNewsroomContentResponse.parse({
      generatedAt: new Date().toISOString(),
      source: "maintained-editorial-source",
      stale,
      authors: authors.filter((author) => author.verifiedForPublication === true),
      sources: publicSources,
      evidenceSummaries,
      entities: entities.map((entity) => ({
        ...entity,
        ...(profileReviewDatesBySlug.has(entity.slug)
          ? { profileReviewedAt: profileReviewDatesBySlug.get(entity.slug) }
          : {}),
        ...(profileReviewHistoryBySlug.has(entity.slug)
          ? {
              profileReviewHistory: [
                ...(entity.profileReviewHistory ?? []),
                ...(profileReviewHistoryBySlug.get(entity.slug) ?? []).map((review) => ({
                  reviewedAt: review.reviewedAt,
                  triggeringUpdate: review.triggeringUpdate ?? "Editorial review recorded from the newsroom queue.",
                  referencesChecked: [],
                  claimChangeSummary: summarizeEntityProfileClaimComparison(review.claimComparison),
                  claimComparison: review.claimComparison,
                })),
              ],
            }
          : {}),
        timeline: entity.timeline.filter((slug) => publicTimelineSlugs.has(slug)),
        signals: entity.signals.filter((slug) => signals.some((signal) => signal.slug === slug)),
        recentStories: entity.recentStories
          .map(canonicalStorySlug)
          .filter((slug) => publishedStorySlugs.has(slug)),
      })),
      timelineEvents: publicTimelineEvents.map((event) => ({
          ...event,
          ...(event.story ? { story: canonicalStorySlug(event.story) } : {}),
        })),
      stories: publishedStories.map((story) => toPublicStory(story, publishedStorySlugs)),
      researchRecords: publicResearchRecords,
      dataProducts: publicDataProducts,
      topics: publicTopics,
      authorityEdges: buildAuthorityGraph(publishedStories),
      signals,
      industryMap,
      indiaIndex,
      essays,
      askGlobalAnswers: askGlobalAnswers
        .map((answer) => ({
          ...answer,
          citedStories: answer.citedStories
            .map(canonicalStorySlug)
            .filter((slug) => publishedStorySlugs.has(slug)),
          citedSources: answer.citedSources.filter((slug) => resolvedSourceSlugs.has(slug)),
          citedTimeline: answer.citedTimeline.filter((slug) => publicTimelineSlugs.has(slug)),
          citedEntities: answer.citedEntities.filter((slug) => publicEntitySlugs.has(slug)),
        }))
        .filter((answer) => answer.citedStories.length > 0),
    });
    snapshotValidationMs = Date.now() - snapshotValidationStartedAt;
    const cachedAt = Date.now();
    const expiresAt = publicNewsroomSnapshotExpiresAt(
      cachedAt,
      nextScheduledPublicationAt(cachedAt),
    );
    publicNewsroomContentCache = { snapshot, cachedAt, expiresAt };

    setPublicNewsroomContentHeaders(res, expiresAt, cachedAt);
    res.json(snapshot);
    req.log.info(
      {
        event: "newsroom_content_snapshot_generated",
        route: "/api/newsroom/content",
        webRequestId: safeWebRequestId,
        statusCode: 200,
        elapsedMs: Date.now() - startedAt,
        publishedStoriesMs,
        dynamicSourcesMs,
        snapshotValidationMs,
        storyCount: snapshot.stories.length,
        sourceCount: snapshot.sources.length,
        researchCount: snapshot.researchRecords.length,
        dataProductCount: snapshot.dataProducts.length,
        topicCount: snapshot.topics.length,
      },
      "Generated public newsroom snapshot",
    );
  } catch (error) {
    req.log.error(
      {
        event: "newsroom_content_snapshot_failed",
        route: "/api/newsroom/content",
        webRequestId: safeWebRequestId,
        statusCode: 500,
        phase,
        elapsedMs: Date.now() - startedAt,
        publishedStoriesMs,
        dynamicSourcesMs,
        snapshotValidationMs,
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
      "Failed to generate public newsroom snapshot",
    );
    res.setHeader("Cache-Control", "no-store");
    res.status(500).json({ error: "Newsroom content source unavailable." });
  } finally {
    completeRefresh();
    if (publicNewsroomContentRefresh === refreshPromise) {
      publicNewsroomContentRefresh = undefined;
    }
  }
});

router.get("/newsroom/metadata", async (req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromSnapshot();
    const sourceRecords: Source[] = maintainedSources;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex");
    res.json(
      GetNewsroomMetadataResponse.parse(
        getSeoMetadataManifest(publishedStories, new Date().toISOString(), sourceRecords),
      ),
    );
  } catch (error) {
    req.log.error({ err: error }, "Newsroom metadata failed");
    res.status(500).json({ error: "Newsroom metadata source unavailable." });
  }
});

router.get(
  "/newsroom/profile-reviews",
  requireEditorAuth,
  async (req, res): Promise<void> => {
    try {
      const savedReviewDates = await db
        .select({
          profileSlug: profileReviewDatesTable.profileSlug,
          reviewedAt: profileReviewDatesTable.reviewedAt,
        })
        .from(profileReviewDatesTable);
      const savedBySlug = new Map(savedReviewDates.map((item) => [item.profileSlug, item.reviewedAt]));
      const now = new Date();
      const profiles = entities.flatMap((entity) => {
        if (!entity.profileStatus) return [];
        const reviewedAt = savedBySlug.get(entity.slug) ?? entity.profileReviewedAt ?? null;
        const reviewState = getEntityProfileReviewQueueState(
          { profileReviewedAt: reviewedAt ?? undefined, timeline: entity.timeline },
          now,
          timelineEvents,
        );
        if (!reviewState) return [];
        const newerTimelineEvents = reviewedAt && isValidProfileReviewDate(reviewedAt)
          ? entity.timeline.flatMap((slug) => {
            const event = timelineEvents.find((candidate) =>
              candidate.slug === slug && candidate.date.slice(0, 10) > reviewedAt,
            );
            if (!event) return [];
            return [{
              slug: event.slug,
              title: event.title,
              date: event.date.slice(0, 10),
              url: `/timeline/${event.slug}`,
              references: (event.sourceSlugs ?? []).flatMap((sourceSlug) => {
                const source = maintainedSources.find((candidate) => candidate.slug === sourceSlug);
                return source ? [{ label: source.title ?? source.name, url: source.url }] : [];
              }),
            }];
          })
          : [];
        return [{
          slug: entity.slug,
          name: entity.name,
          kind: entity.kind,
          url: `/${entity.kind}/${entity.slug}`,
          reviewedAt,
          dueAt: reviewState.dueAt,
          daysUntilDue: reviewState.daysUntilDue,
          reason: reviewState.reason,
          primaryReferences: entity.primaryReferences ?? [],
          newerTimelineEvents,
        }];
      }).sort((left, right) => {
        const leftDays = left.daysUntilDue ?? Number.NEGATIVE_INFINITY;
        const rightDays = right.daysUntilDue ?? Number.NEGATIVE_INFINITY;
        return leftDays - rightDays || left.name.localeCompare(right.name);
      });

      res.setHeader("Cache-Control", "no-store");
      res.json(GetNewsroomProfileReviewsResponse.parse({ profiles }));
    } catch (error) {
      req.log.error({ err: error }, "Profile review queue unavailable");
      res.status(500).json({ error: "Profile review queue unavailable." });
    }
  },
);

router.patch(
  "/newsroom/profile-reviews/:slug",
  requireEditorAuth,
  async (req, res): Promise<void> => {
    const params = UpdateNewsroomProfileReviewParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const body = UpdateNewsroomProfileReviewBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: body.error.message });
      return;
    }
    const entity = entities.find((item) => item.slug === params.data.slug && item.profileStatus);
    if (!entity) {
      res.status(404).json({ error: "Profile not found." });
      return;
    }
    const reviewedAt = body.data.reviewedAt;
    const triggeringUpdate = body.data.triggeringUpdate.trim();
    const today = new Date().toISOString().slice(0, 10);
    if (!isValidProfileReviewDate(reviewedAt) || reviewedAt > today) {
      res.status(400).json({ error: "Enter a valid review date that is not in the future." });
      return;
    }
    if (!triggeringUpdate) {
      res.status(400).json({ error: "Enter the event or reason that prompted this review." });
      return;
    }

    try {
      await db.transaction(async (transaction) => {
        await transaction.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${entity.slug}, 0))`);
        const [savedProfile] = await transaction
          .select({ reviewHistory: profileReviewDatesTable.reviewHistory })
          .from(profileReviewDatesTable)
          .where(eq(profileReviewDatesTable.profileSlug, entity.slug))
          .limit(1);
        const currentClaims = getEntityProfileClaims(entity);
        const reviewVersions = (savedProfile?.reviewHistory ?? [])
          .filter((review) => review.reviewedAt !== reviewedAt)
          .concat({ reviewedAt, triggeringUpdate, claims: currentClaims, claimComparison: { status: "no-prior-version", changes: [] } })
          .sort((left, right) => left.reviewedAt.localeCompare(right.reviewedAt))
          .map((review, index, reviews) => ({
            ...review,
            claimComparison: compareEntityProfileClaims(
              index > 0 ? reviews[index - 1].claims : undefined,
              review.claims,
            ),
          }));
        await transaction
          .insert(profileReviewDatesTable)
          .values({
            profileSlug: entity.slug,
            reviewedAt,
            reviewHistory: reviewVersions,
            updatedBy: String(res.locals.editorUserId),
          })
          .onConflictDoUpdate({
            target: profileReviewDatesTable.profileSlug,
            set: {
              reviewedAt,
              reviewHistory: reviewVersions,
              updatedBy: String(res.locals.editorUserId),
              updatedAt: new Date(),
            },
          });
      });
      invalidatePublicNewsroomContentCache();
      res.setHeader("Cache-Control", "no-store");
      res.json(UpdateNewsroomProfileReviewResponse.parse({ slug: entity.slug, reviewedAt }));
    } catch (error) {
      req.log.error({ err: error, profileSlug: entity.slug }, "Profile review date could not be saved");
      res.status(500).json({ error: "The profile review date could not be saved." });
    }
  },
);

router.get("/newsroom/comparison-reviews", async (req, res): Promise<void> => {
  try {
    const savedReviews = await db
      .select({
        reportSlug: comparisonSourceReviewsTable.reportSlug,
        checkedOn: comparisonSourceReviewsTable.checkedOn,
        nextDue: comparisonSourceReviewsTable.nextDue,
      })
      .from(comparisonSourceReviewsTable);
    const reports = savedReviews.filter((review) =>
      isMonitoredComparisonSlug(review.reportSlug),
    );
    res.setHeader("Cache-Control", "no-store");
    res.json({ reports });
  } catch (error) {
    req.log.error({ err: error }, "Comparison source review dates unavailable");
    res.status(500).json({ error: "Comparison review dates are unavailable." });
  }
});

router.post(
  "/newsroom/comparison-reviews/:reportSlug/complete",
  requireEditorAuth,
  async (req, res): Promise<void> => {
    const requestedSlug = Array.isArray(req.params.reportSlug)
      ? req.params.reportSlug[0]
      : req.params.reportSlug;
    if (!isMonitoredComparisonSlug(requestedSlug)) {
      res.status(404).json({ error: "Comparison report not found." });
      return;
    }
    const reportSlug: MonitoredComparisonSlug = requestedSlug;

    const now = new Date();
    const checkedOn = now.toISOString().slice(0, 10);
    const nextDue = addOneCalendarMonth(now);
    try {
      await db
        .insert(comparisonSourceReviewsTable)
        .values({
          reportSlug,
          checkedOn,
          nextDue,
          updatedBy: String(res.locals.editorUserId),
        })
        .onConflictDoUpdate({
          target: comparisonSourceReviewsTable.reportSlug,
          set: {
            checkedOn,
            nextDue,
            updatedBy: String(res.locals.editorUserId),
            updatedAt: now,
          },
        });
      res.setHeader("Cache-Control", "no-store");
      res.json({ reportSlug, checkedOn, nextDue });
    } catch (error) {
      req.log.error({ err: error, reportSlug }, "Comparison source review could not be saved");
      res.status(500).json({ error: "The comparison review could not be saved." });
    }
  },
);

router.get("/newsroom/releases", requireEditorAuth, async (req, res): Promise<void> => {
  try {
    const releases = (await getReleaseRows()).map((row) => toReleaseResponse(row));
    res.setHeader("Cache-Control", "no-store");
    res.json(GetNewsroomReleasesResponse.parse(releases));
  } catch (error) {
    req.log.error({ err: error }, "Release queue read failed");
    res.status(500).json({ error: "Release queue unavailable." });
  }
});

router.get("/newsroom/releases/history", requireEditorAuth, async (req, res): Promise<void> => {
  try {
    const releaseSlug =
      typeof req.query.releaseSlug === "string" && req.query.releaseSlug.trim().length > 0
        ? req.query.releaseSlug.trim()
        : undefined;
    const requestedAction =
      typeof req.query.action === "string" && req.query.action.trim().length > 0
        ? req.query.action.trim()
        : undefined;
    const actor =
      typeof req.query.actor === "string" && req.query.actor.trim().length > 0
        ? req.query.actor.trim()
        : undefined;
    const action = requestedAction as EditorialReleaseHistoryAction | undefined;
    if (action && !Object.values(EditorialReleaseHistoryAction).includes(action)) {
      res.status(400).json({ error: "Unknown release history action." });
      return;
    }
    const filters = [
      releaseSlug ? eq(editorialReleaseHistoryTable.releaseSlug, releaseSlug) : undefined,
      action ? eq(editorialReleaseHistoryTable.action, action) : undefined,
      actor ? eq(editorialReleaseHistoryTable.actor, actor) : undefined,
    ].filter((filter): filter is NonNullable<typeof filter> => Boolean(filter));
    const history = await db
      .select()
      .from(editorialReleaseHistoryTable)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(desc(editorialReleaseHistoryTable.createdAt), desc(editorialReleaseHistoryTable.id))
      .limit(50);
    res.setHeader("Cache-Control", "no-store");
    res.json(
      GetNewsroomReleaseHistoryResponse.parse(
        history.map((entry) => ({
          id: entry.id,
          releaseId: entry.releaseId,
          releaseSlug: entry.releaseSlug,
          releaseTitle: entry.releaseTitle,
          actor: entry.actor,
          action: entry.action,
          summary: entry.summary,
          createdAt: entry.createdAt,
        })),
      ),
    );
  } catch (error) {
    req.log.error({ err: error }, "Release history read failed");
    res.status(500).json({ error: "Release history unavailable." });
  }
});

router.post("/newsroom/releases", requireEditorAuth, async (req, res): Promise<void> => {
  const parsed = CreateNewsroomReleaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const rows = await getReleaseRows();
    if (rows.some((row) => row.slug === parsed.data.slug) || stories.some((story) => story.slug === parsed.data.slug)) {
      res.status(409).json({ error: "A release with that slug already exists." });
      return;
    }
    const story = storyFromInput(parsed.data as ReleaseInput);
    if (rejectShortRelease(res, story.section, story.dek, storyBodyText(story))) return;
    const created = await db.transaction(async (tx) => {
      const [release] = await tx
        .insert(editorialReleasesTable)
        .values({
          slug: story.slug,
          title: story.title,
          publishAt: new Date(story.publishAt),
          cadence: story.cadence,
          status: "scheduled",
          position: rows.length,
          story: story as unknown as Record<string, unknown>,
        })
        .returning();
      await tx.insert(editorialReleaseHistoryTable).values(
        historyEntry(req, {
          releaseId: release.id,
          releaseSlug: release.slug,
          releaseTitle: release.title,
          action: "created",
          summary: `Added “${release.title}” to the release queue for ${formatReleaseDate(release.publishAt)}.`,
        }),
      );
      return release;
    });
    await getReleaseRows();
    invalidatePublicNewsroomContentCache();
    res.status(201).json(CreateNewsroomReleaseResponse.parse(toReleaseResponse(created)));
  } catch (error: unknown) {
    req.log.error({ err: error }, "Release creation failed");
    res.status(500).json({ error: "Release could not be created." });
  }
});

router.post("/newsroom/releases/reorder", requireEditorAuth, async (req, res): Promise<void> => {
  const parsed = ReorderNewsroomReleasesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const rows = await getReleaseRows();
    const activeRows = rows.filter((row) => row.status === "scheduled");
    const activeSlugs = activeRows.map((row) => row.slug);
    const requestedSlugs = parsed.data.slugs;
    if (
      requestedSlugs.length !== activeSlugs.length ||
      new Set(requestedSlugs).size !== requestedSlugs.length ||
      requestedSlugs.some((slug) => !activeSlugs.includes(slug))
    ) {
      res.status(400).json({ error: "Reorder must include every active release exactly once." });
      return;
    }
    const positions = activeRows.map((row) => row.position).sort((left, right) => left - right);
    const titleBySlug = new Map(activeRows.map((row) => [row.slug, row.title]));
    const orderSummary = requestedSlugs.map((slug) => titleBySlug.get(slug) ?? slug).join(" → ");
    await db.transaction(async (tx) => {
      await Promise.all(
        requestedSlugs.map((slug, index) =>
          tx
            .update(editorialReleasesTable)
            .set({ position: positions[index] ?? index, updatedAt: new Date() })
            .where(eq(editorialReleasesTable.slug, slug)),
        ),
      );
      await tx.insert(editorialReleaseHistoryTable).values(
        historyEntry(req, {
          releaseId: null,
          releaseSlug: "queue",
          releaseTitle: "Release queue",
          action: "reordered",
          summary: `Reordered the prepared queue: ${orderSummary}.`,
        }),
      );
    });
    const updated = (await getReleaseRows()).map((row) => toReleaseResponse(row));
    res.json(ReorderNewsroomReleasesResponse.parse(updated));
  } catch (error) {
    req.log.error({ err: error }, "Release reorder failed");
    res.status(500).json({ error: "Release order could not be saved." });
  }
});

router.patch("/newsroom/releases/:slug", requireEditorAuth, async (req, res): Promise<void> => {
  const params = UpdateNewsroomReleaseParams.safeParse(req.params);
  const parsed = UpdateNewsroomReleaseBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [existing] = await db
      .select()
      .from(editorialReleasesTable)
      .where(eq(editorialReleasesTable.slug, params.data.slug))
      .limit(1);
    if (!existing) {
      res.status(404).json({ error: "Release not found." });
      return;
    }

    const currentStory = toScheduledStory(existing);
    const story = storyFromInput({ ...parsed.data, slug: existing.slug } as ReleaseUpdate, currentStory);
    const nextStory = { ...currentStory, ...story, slug: existing.slug };
    const nextPublishAt = new Date(nextStory.publishAt);
    if (rejectShortRelease(res, nextStory.section, nextStory.dek, storyBodyText(nextStory))) return;
    const changedFields = [
      existing.title !== nextStory.title ? "title" : null,
      (existing.story as Partial<ScheduledStory>).dek !== nextStory.dek ? "dek" : null,
      existing.cadence !== nextStory.cadence ? "cadence" : null,
      (existing.story as Partial<ScheduledStory>).category !== nextStory.category ? "desk" : null,
      (existing.story as Partial<ScheduledStory>).author !== nextStory.author ? "author" : null,
      JSON.stringify((existing.story as Partial<ScheduledStory>).body) !== JSON.stringify(nextStory.body) ? "working copy" : null,
    ].filter((field): field is string => Boolean(field));
    if (changedFields.some((field) => field !== "cadence")) {
      nextStory.dateModified = dateOnly(new Date());
    }
    const wasRescheduled = existing.publishAt.getTime() !== nextPublishAt.getTime();
    const updated = await db.transaction(async (tx) => {
      const [release] = await tx
        .update(editorialReleasesTable)
        .set({
          title: nextStory.title,
          publishAt: nextPublishAt,
          cadence: nextStory.cadence,
          story: nextStory as unknown as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .where(eq(editorialReleasesTable.slug, existing.slug))
        .returning();
      const history = [];
      if (changedFields.length > 0) {
        history.push(
          historyEntry(req, {
            releaseId: release.id,
            releaseSlug: release.slug,
            releaseTitle: release.title,
            action: "edited",
            summary: `Updated ${changedFields.join(", ")} on “${release.title}”.`,
          }),
        );
      }
      if (wasRescheduled) {
        history.push(
          historyEntry(req, {
            releaseId: release.id,
            releaseSlug: release.slug,
            releaseTitle: release.title,
            action: "rescheduled",
            summary: `Moved “${release.title}” from ${formatReleaseDate(existing.publishAt)} to ${formatReleaseDate(nextPublishAt)}.`,
          }),
        );
      }
      if (history.length > 0) {
        await tx.insert(editorialReleaseHistoryTable).values(history);
      }
      return release;
    });
    await getReleaseRows();
    invalidatePublicNewsroomContentCache();
    res.json(UpdateNewsroomReleaseResponse.parse(toReleaseResponse(updated)));
  } catch (error) {
    req.log.error({ err: error }, "Release update failed");
    res.status(500).json({ error: "Release could not be updated." });
  }
});

router.delete("/newsroom/releases/:slug", requireEditorAuth, async (req, res): Promise<void> => {
  const params = UpdateNewsroomReleaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const updated = await db.transaction(async (tx) => {
      const [release] = await tx
        .update(editorialReleasesTable)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(editorialReleasesTable.slug, params.data.slug))
        .returning();
      if (release) {
        await tx.insert(editorialReleaseHistoryTable).values(
          historyEntry(req, {
            releaseId: release.id,
            releaseSlug: release.slug,
            releaseTitle: release.title,
            action: "canceled",
            summary: `Canceled “${release.title}” from the release queue.`,
          }),
        );
      }
      return release;
    });
    if (!updated) {
      res.status(404).json({ error: "Release not found." });
      return;
    }
    await getReleaseRows();
    invalidatePublicNewsroomContentCache();
    res.json(CancelNewsroomReleaseResponse.parse(toReleaseResponse(updated)));
  } catch (error) {
    req.log.error({ err: error }, "Release cancellation failed");
    res.status(500).json({ error: "Release could not be canceled." });
  }
});

export default router;
