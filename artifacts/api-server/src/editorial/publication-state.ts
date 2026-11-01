import { and, asc, eq, lte } from "drizzle-orm";
import {
  db,
  editorialPublishStatesTable,
  editorialReleaseHistoryTable,
  type EditorialPublishState,
} from "@workspace/db";
import { articleRegistry } from "./article-registry.generated";
import { logger } from "../lib/logger";

const SCHEDULER_ACTOR = "system:scheduler";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

let stateSnapshot: EditorialPublishState[] | undefined;
let refreshInFlight: Promise<EditorialPublishState[]> | undefined;
let scheduler: NodeJS.Timeout | undefined;

const titleBySlug = new Map<string, string>(
  articleRegistry.map((entry) => [entry.slug, entry.title]),
);

export function isKnownArticleSlug(slug: string): boolean {
  return titleBySlug.has(slug);
}

export async function refreshPublicationStateSnapshot(
  now = new Date(),
): Promise<EditorialPublishState[]> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const due = await db
      .select()
      .from(editorialPublishStatesTable)
      .where(and(
        eq(editorialPublishStatesTable.status, "scheduled"),
        lte(editorialPublishStatesTable.publishAt, now),
      ))
      .orderBy(asc(editorialPublishStatesTable.publishAt));

    if (due.length) {
      await db.transaction(async (tx) => {
        for (const row of due) {
          const [updated] = await tx
            .update(editorialPublishStatesTable)
            .set({ status: "published", updatedBy: SCHEDULER_ACTOR, updatedAt: now })
            .where(and(
              eq(editorialPublishStatesTable.slug, row.slug),
              eq(editorialPublishStatesTable.status, "scheduled"),
              lte(editorialPublishStatesTable.publishAt, now),
            ))
            .returning();
          if (!updated) continue;
          await tx.insert(editorialReleaseHistoryTable).values({
            releaseSlug: row.slug,
            releaseTitle: titleBySlug.get(row.slug) ?? row.slug,
            actor: SCHEDULER_ACTOR,
            action: "publish",
            summary: JSON.stringify({
              source: "scheduled-job",
              previous: { status: row.status, publishAt: row.publishAt.toISOString() },
              current: { status: updated.status, publishAt: updated.publishAt.toISOString() },
            }),
          });
        }
      });
    }

    const rows = await db.select().from(editorialPublishStatesTable)
      .orderBy(asc(editorialPublishStatesTable.publishAt), asc(editorialPublishStatesTable.slug));
    stateSnapshot = rows;
    return rows;
  })().finally(() => {
    refreshInFlight = undefined;
  });
  return refreshInFlight;
}

export async function getPublicationStateSnapshot(): Promise<EditorialPublishState[]> {
  return stateSnapshot ?? refreshPublicationStateSnapshot();
}

export async function getPublishedArticleState(slug: string, now = new Date()): Promise<EditorialPublishState | undefined> {
  const rows = await getPublicationStateSnapshot();
  return rows.find((row) =>
    row.slug === slug &&
    row.status === "published" &&
    row.publishAt.getTime() <= now.getTime(),
  );
}

export function startPublicationStateScheduler(): void {
  if (scheduler) return;
  void refreshPublicationStateSnapshot().catch((error: unknown) => {
    logger.error({ err: error }, "Initial publication-state refresh failed");
  });
  scheduler = setInterval(() => {
    void refreshPublicationStateSnapshot().catch((error: unknown) => {
      logger.error({ err: error }, "Scheduled publication-state refresh failed");
    });
  }, REFRESH_INTERVAL_MS);
  scheduler.unref();
}
