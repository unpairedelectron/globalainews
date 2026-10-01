import { and, asc, desc, eq } from "drizzle-orm";
import { gzipSync } from "node:zlib";
import {
  Router,
  type IRouter,
  type Request,
  type Response as ExpressResponse,
} from "express";
import { requireEditorAuth } from "../middlewares/requireEditorAuth";
import {
  db,
  editorialAutomationRunsTable,
  editorialReleaseHistoryTable,
  editorialReleasesTable,
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
} from "@workspace/api-zod";
import {
  askGlobalAnswers,
  authors,
  entities,
  essays,
  evidenceSummaries,
  getEditorialLifecycleStatus,
  getPublicDateModified,
  getReleaseDraftWordCount,
  getReleaseWordCount,
  getPublishedStories,
  isPublicEditorialRelease,
  getStoryWordCount,
  MINIMUM_STORY_WORDS,
  indiaIndex,
  industryMap,
  scheduledStories,
  signals,
  sources as maintainedSources,
  stories,
  timelineEvents,
  type EditorialCadence,
  type ScheduledStory,
  type Story,
  type StoryCategory,
} from "../../../global-ai-news/src/content";
import {
  getCanonicalUrl,
  getSeoMetadataManifest,
} from "../../../global-ai-news/src/seo-metadata";
import { renderSocialPreviewSvg } from "../../../global-ai-news/src/social-preview";
import {
  getAutomationStatus,
  getAutomationRuns,
  getDynamicSourceRecords,
  runEditorialAutomation,
  type AutomationRunFilters,
  type AutomationRunOutcome,
} from "../editorial/automation";

const router: IRouter = Router();

type ReleaseRow = typeof editorialReleasesTable.$inferSelect;
type ReleaseHistoryInsert = typeof editorialReleaseHistoryTable.$inferInsert;
type ReleaseInput = {
  slug: string;
  title: string;
  dek: string;
  publishAt: Date;
  cadence: EditorialCadence;
  category: string;
  author: string;
  body: string;
};
type ReleaseUpdate = Partial<Omit<ReleaseInput, "slug">>;
type EditorialReleaseStory = ScheduledStory & {
  editorialSource?: "editor";
};

function toPublicStory(story: Story): Omit<Story, "updatedAt"> {
  const dateModified = getPublicDateModified(story);
  return {
    slug: story.slug,
    category: story.category,
    title: story.title,
    dek: story.dek,
    body: story.body,
    date: story.date,
    ...(dateModified ? { dateModified } : {}),
    readTime: story.readTime,
    author: story.author,
    evidence: story.evidence,
    evidenceSummary: story.evidenceSummary,
    classification: story.classification,
    entities: story.entities,
    timeline: story.timeline,
    relatedStories: story.relatedStories,
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
  await ensureSeeded();
  return db
    .select()
    .from(editorialReleasesTable)
    .orderBy(asc(editorialReleasesTable.position), asc(editorialReleasesTable.publishAt));
}

function toScheduledStory(row: ReleaseRow): EditorialReleaseStory {
  const story = row.story as unknown as EditorialReleaseStory;
  const maintainedStory = scheduledStories.find((candidate) => candidate.slug === row.slug);
  return {
    ...story,
    slug: row.slug,
    title: row.title,
    publishAt: row.publishAt.toISOString(),
    cadence: row.cadence as EditorialCadence,
    date: dateOnly(row.publishAt),
    dateModified: story.dateModified ?? maintainedStory?.dateModified,
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

function toReleaseResponse(row: ReleaseRow, now = new Date()) {
  const story = toScheduledStory(row);
  const wordCount = releaseWordCount(story, row.slug);
  const publishable = wordCount >= MINIMUM_STORY_WORDS;
  const status = getEditorialLifecycleStatus(
    row.status,
    story.publishAt,
    wordCount,
    now,
  );
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: story.dek,
    publishAt: row.publishAt,
    cadence: row.cadence as EditorialCadence,
    status,
    position: row.position,
    story: story as unknown as Record<string, unknown>,
    wordCount,
    remainingWords: Math.max(0, MINIMUM_STORY_WORDS - wordCount),
    publishable,
    updatedAt: row.updatedAt,
  };
}

async function getPublishedStoriesFromDatabase(): Promise<Story[]> {
  const rows = await getReleaseRows();
  const now = new Date();
  const schedule = rows.flatMap((row) => {
    const story = toScheduledStory(row);
    return isPublicEditorialRelease(
      row.status,
      story.publishAt,
      releaseWordCount(story, row.slug),
      now,
    )
      ? [story]
      : [];
  });
  return getPublishedStories(now, schedule);
}

function rejectShortRelease(
  res: ExpressResponse,
  dek: string,
  body: string,
): boolean {
  const wordCount = getReleaseDraftWordCount(dek, body);
  if (wordCount >= MINIMUM_STORY_WORDS) return false;
  res.status(422).json({
    error: `A release needs at least ${MINIMUM_STORY_WORDS} editorial words before it can enter the queue. This draft has ${wordCount}.`,
    wordCount,
    minimumWordCount: MINIMUM_STORY_WORDS,
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

export async function serveNewsroomSitemap(
  req: Request,
  res: ExpressResponse,
): Promise<void> {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
    const metadataManifest = getSeoMetadataManifest(publishedStories);
    const routes = metadataManifest.routes.filter(
      (metadata) => metadata.indexable !== false,
    );
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${routes
      .map((metadata) => {
        const lastmod = metadata.lastmod
          ? `<lastmod>${escapeXml(metadata.lastmod)}</lastmod>`
          : "";
        const image = metadata.imagePath
          ? `<image:image><image:loc>${escapeXml(`https://www.globalainews.in${metadata.imagePath}`)}</image:loc><image:title>${escapeXml(metadata.title)}</image:title></image:image>`
          : "";
        return `  <url><loc>${escapeXml(getCanonicalUrl(metadata.path))}</loc>${lastmod}${image}</url>`;
      })
      .join("\n")}\n</urlset>`;
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
  } catch (error) {
    req.log.error({ err: error }, "Newsroom sitemap failed");
    res.status(500).type("text/plain").send("Sitemap unavailable.");
  }
}

router.get("/newsroom/sitemap.xml", serveNewsroomSitemap);

export async function serveNewsroomFeed(_req: Request, res: ExpressResponse): Promise<void> {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
    const items = publishedStories.slice(0, 30).map((story) => {
      const url = escapeXml(getCanonicalUrl(`/article/${story.slug}`));
      return `    <item><title>${escapeXml(story.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${story.date}T07:30:00Z`).toUTCString()}</pubDate><description>${escapeXml(story.dek)}</description></item>`;
    });
    const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Global AI News</title><link>https://www.globalainews.in/</link><description>Intelligence for the AI economy.</description><language>en-us</language>\n${items.join("\n")}\n</channel></rss>`;
    res
      .type("application/rss+xml")
      .set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300")
      .send(body);
  } catch (error) {
    res.status(500).type("text/plain").send("Feed unavailable.");
  }
}

router.get("/newsroom/feed.xml", serveNewsroomFeed);

router.get("/newsroom/social/articles/:slug.svg", async (req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
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

router.get("/newsroom/content", async (_req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
    const citedSourceSlugs = new Set(
      publishedStories.flatMap((story) => story.sources),
    );
    const dynamicSources = (await getDynamicSourceRecords()).filter((source) =>
      citedSourceSlugs.has(source.slug),
    );
    const publicSources = [
      ...maintainedSources.filter((source) => citedSourceSlugs.has(source.slug)),
      ...dynamicSources.filter(
        (source) => !maintainedSources.some((existing) => existing.slug === source.slug),
      ),
    ];
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
    const snapshot = GetNewsroomContentResponse.parse({
      generatedAt: new Date().toISOString(),
      source: "maintained-editorial-source",
      stale,
      authors,
      sources: publicSources,
      evidenceSummaries,
      entities,
      timelineEvents,
      stories: publishedStories.map(toPublicStory),
      signals,
      industryMap,
      indiaIndex,
      essays,
      askGlobalAnswers,
    });

    res.setHeader("X-Robots-Tag", "noindex");
    res.setHeader("Cache-Control", "no-store");
    res.json(snapshot);
  } catch (error) {
    res.status(500).json({ error: "Newsroom content source unavailable." });
  }
});

router.get("/newsroom/metadata", async (req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex");
    res.json(
      GetNewsroomMetadataResponse.parse(
        getSeoMetadataManifest(publishedStories),
      ),
    );
  } catch (error) {
    req.log.error({ err: error }, "Newsroom metadata failed");
    res.status(500).json({ error: "Newsroom metadata source unavailable." });
  }
});

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
    if (rejectShortRelease(res, story.dek, storyBodyText(story))) return;
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
    if (rejectShortRelease(res, nextStory.dek, storyBodyText(nextStory))) return;
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
    res.json(CancelNewsroomReleaseResponse.parse(toReleaseResponse(updated)));
  } catch (error) {
    req.log.error({ err: error }, "Release cancellation failed");
    res.status(500).json({ error: "Release could not be canceled." });
  }
});

export default router;