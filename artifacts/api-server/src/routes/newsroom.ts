import { and, asc, desc, eq } from "drizzle-orm";
import {
  Router,
  type IRouter,
  type NextFunction,
  type Request,
  type Response as ExpressResponse,
} from "express";
import { requireEditorAuth } from "../middlewares/requireEditorAuth";
import { db, editorialReleaseHistoryTable, editorialReleasesTable } from "@workspace/db";
import {
  CancelNewsroomReleaseResponse,
  CreateNewsroomReleaseBody,
  CreateNewsroomReleaseResponse,
  GetNewsroomContentResponse,
  GetNewsroomReleaseHistoryResponse,
  EditorialReleaseHistoryAction,
  GetNewsroomMetadataResponse,
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
  getEditorialSchedule,
  getPublishedStories,
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
import { getSeoMetadataManifest } from "../../../global-ai-news/src/seo-metadata";
import { renderSocialPreviewSvg } from "../../../global-ai-news/src/social-preview";
import {
  getAutomationStatus,
  getDynamicSourceRecords,
  runEditorialAutomation,
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
  existing?: ScheduledStory,
): ScheduledStory {
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
    publishAt: publishAt.toISOString(),
    cadence: input.cadence ?? existing?.cadence ?? "daily",
    category: (input.category ?? existing?.category ?? "Field Notes") as StoryCategory,
    author: input.author ?? existing?.author ?? authors[0]?.slug ?? "global-ai-news",
    body: paragraphs.map((paragraph, index) => ({
      heading: index === 0 ? "The signal" : "What changes",
      paragraphs: [paragraph],
    })),
  };
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

function toScheduledStory(row: ReleaseRow): ScheduledStory {
  const story = row.story as unknown as ScheduledStory;
  return {
    ...story,
    slug: row.slug,
    title: row.title,
    publishAt: row.publishAt.toISOString(),
    cadence: row.cadence as EditorialCadence,
    date: dateOnly(row.publishAt),
  };
}

function toReleaseResponse(row: ReleaseRow, now = new Date()) {
  const story = toScheduledStory(row);
  const status =
    row.status === "canceled"
      ? "canceled"
      : Date.parse(story.publishAt) <= now.getTime()
        ? "published"
        : "scheduled";
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
    updatedAt: row.updatedAt,
  };
}

async function getPublishedStoriesFromDatabase(): Promise<Story[]> {
  const rows = await getReleaseRows();
  const schedule = rows
    .filter((row) => row.status !== "canceled")
    .map(toScheduledStory);
  return getPublishedStories(new Date(), schedule);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const staticSitemapRoutes = [
  "/",
  "/brief",
  "/signals",
  "/research",
  "/essays",
  "/industry",
  "/models",
  "/policy",
  "/india",
  "/ask",
  "/insights",
  "/topic/ai",
  "/topic/india",
];

router.get("/newsroom/automation/status", async (_req, res): Promise<void> => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.json(await getAutomationStatus());
  } catch (error) {
    res.status(500).json({ error: "Automation status unavailable." });
  }
});

const automationRunAuth =
  process.env.NODE_ENV === "production"
    ? requireEditorAuth
    : (_req: Request, _res: ExpressResponse, next: NextFunction) => next();

router.post("/newsroom/automation/run", automationRunAuth, async (_req, res): Promise<void> => {
  try {
    res.status(202).json({ accepted: true, results: await runEditorialAutomation("manual") });
  } catch (error) {
    res.status(500).json({ error: "Automation run failed." });
  }
});

router.get("/newsroom/sitemap.xml", async (_req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
    const urls = [
      ...staticSitemapRoutes.map((path) => ({ path, lastmod: undefined })),
      ...publishedStories.map((story) => ({ path: `/article/${story.slug}`, lastmod: story.date })),
    ];
    const unique = [...new Map(urls.map((entry) => [entry.path, entry])).values()];
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique
      .map(
        (entry) =>
          `  <url><loc>https://www.globalainews.in${entry.path}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`,
      )
      .join("\n")}\n</urlset>`;
    res.type("application/xml").send(body);
  } catch (error) {
    res.status(500).type("text/plain").send("Sitemap unavailable.");
  }
});

router.get("/newsroom/feed.xml", async (_req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
    const items = publishedStories.slice(0, 30).map((story) => {
      const url = `https://www.globalainews.in/article/${story.slug}`;
      return `    <item><title>${escapeXml(story.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${story.date}T07:30:00Z`).toUTCString()}</pubDate><description>${escapeXml(story.dek)}</description></item>`;
    });
    const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Global AI News</title><link>https://www.globalainews.in/</link><description>Intelligence for the AI economy.</description><language>en-us</language>\n${items.join("\n")}\n</channel></rss>`;
    res.type("application/rss+xml").send(body);
  } catch (error) {
    res.status(500).type("text/plain").send("Feed unavailable.");
  }
});

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
    const dynamicSources = await getDynamicSourceRecords();
    const latestPublishedAt = publishedStories.reduce(
      (latest, story) => (story.date > latest ? story.date : latest),
      "",
    );
    const stale =
      latestPublishedAt.length > 0 &&
      Date.now() - Date.parse(`${latestPublishedAt}T23:59:59Z`) > 36 * 60 * 60 * 1000;
    const rows = await getReleaseRows();
    const schedule = getEditorialSchedule(
      new Date(),
      rows.filter((row) => row.status !== "canceled").map(toScheduledStory),
    );

    const snapshot = GetNewsroomContentResponse.parse({
      generatedAt: new Date().toISOString(),
      source: "maintained-editorial-source",
      stale,
      authors,
      sources: [
        ...maintainedSources,
        ...dynamicSources.filter(
          (source) => !maintainedSources.some((existing) => existing.slug === source.slug),
        ),
      ],
      evidenceSummaries,
      entities,
      timelineEvents,
      stories: publishedStories,
      signals,
      industryMap,
      indiaIndex,
      essays,
      askGlobalAnswers,
      schedule,
    });

    res.json(snapshot);
  } catch (error) {
    res.status(500).json({ error: "Newsroom content source unavailable." });
  }
});

router.get("/newsroom/metadata", async (req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
    res.setHeader("Cache-Control", "no-store");
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

router.get("/newsroom/releases", async (req, res): Promise<void> => {
  try {
    const releases = (await getReleaseRows()).map((row) => toReleaseResponse(row));
    res.setHeader("Cache-Control", "no-store");
    res.json(GetNewsroomReleasesResponse.parse(releases));
  } catch (error) {
    req.log.error({ err: error }, "Release queue read failed");
    res.status(500).json({ error: "Release queue unavailable." });
  }
});

router.get("/newsroom/releases/history", async (req, res): Promise<void> => {
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
    const changedFields = [
      existing.title !== nextStory.title ? "title" : null,
      (existing.story as Partial<ScheduledStory>).dek !== nextStory.dek ? "dek" : null,
      existing.cadence !== nextStory.cadence ? "cadence" : null,
      (existing.story as Partial<ScheduledStory>).category !== nextStory.category ? "desk" : null,
      (existing.story as Partial<ScheduledStory>).author !== nextStory.author ? "author" : null,
      JSON.stringify((existing.story as Partial<ScheduledStory>).body) !== JSON.stringify(nextStory.body) ? "working copy" : null,
    ].filter((field): field is string => Boolean(field));
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