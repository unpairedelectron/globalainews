import { asc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, editorialReleasesTable } from "@workspace/db";
import {
  CancelNewsroomReleaseResponse,
  CreateNewsroomReleaseBody,
  CreateNewsroomReleaseResponse,
  GetNewsroomContentResponse,
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
  sources,
  stories,
  timelineEvents,
  type EditorialCadence,
  type ScheduledStory,
  type Story,
  type StoryCategory,
} from "../../../global-ai-news/src/content";
import { getSeoMetadataManifest } from "../../../global-ai-news/src/seo-metadata";

const router: IRouter = Router();

type ReleaseRow = typeof editorialReleasesTable.$inferSelect;
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

router.get("/newsroom/content", async (_req, res): Promise<void> => {
  try {
    const publishedStories = await getPublishedStoriesFromDatabase();
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
      sources,
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

router.post("/newsroom/releases", async (req, res): Promise<void> => {
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
    const [created] = await db
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
    res.status(201).json(CreateNewsroomReleaseResponse.parse(toReleaseResponse(created)));
  } catch (error: unknown) {
    req.log.error({ err: error }, "Release creation failed");
    res.status(500).json({ error: "Release could not be created." });
  }
});

router.post("/newsroom/releases/reorder", async (req, res): Promise<void> => {
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
    await Promise.all(
      requestedSlugs.map((slug, index) =>
        db
          .update(editorialReleasesTable)
          .set({ position: positions[index] ?? index, updatedAt: new Date() })
          .where(eq(editorialReleasesTable.slug, slug)),
      ),
    );
    const updated = (await getReleaseRows()).map((row) => toReleaseResponse(row));
    res.json(ReorderNewsroomReleasesResponse.parse(updated));
  } catch (error) {
    req.log.error({ err: error }, "Release reorder failed");
    res.status(500).json({ error: "Release order could not be saved." });
  }
});

router.patch("/newsroom/releases/:slug", async (req, res): Promise<void> => {
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
    const [updated] = await db
      .update(editorialReleasesTable)
      .set({
        title: nextStory.title,
        publishAt: new Date(nextStory.publishAt),
        cadence: nextStory.cadence,
        story: nextStory as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      })
      .where(eq(editorialReleasesTable.slug, existing.slug))
      .returning();
    res.json(UpdateNewsroomReleaseResponse.parse(toReleaseResponse(updated)));
  } catch (error) {
    req.log.error({ err: error }, "Release update failed");
    res.status(500).json({ error: "Release could not be updated." });
  }
});

router.delete("/newsroom/releases/:slug", async (req, res): Promise<void> => {
  const params = UpdateNewsroomReleaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  try {
    const [updated] = await db
      .update(editorialReleasesTable)
      .set({ status: "canceled", updatedAt: new Date() })
      .where(eq(editorialReleasesTable.slug, params.data.slug))
      .returning();
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