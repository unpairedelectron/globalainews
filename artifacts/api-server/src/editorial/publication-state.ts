import { and, asc, eq, lte } from "drizzle-orm";
import {
  db,
  editorialPublishStatesTable,
  editorialReleaseHistoryTable,
  type EditorialPublishState,
} from "@workspace/db";
import { articleRegistry } from "./article-registry.generated";
import { logger } from "../lib/logger";
import { getVisibleRegistryArticles } from "./publication-registry-visibility";

const SCHEDULER_ACTOR = "system:scheduler";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

let stateSnapshot: EditorialPublishState[] | undefined;
let refreshInFlight: Promise<EditorialPublishState[]> | undefined;
let scheduler: NodeJS.Timeout | undefined;
const publicationStateChangeListeners = new Set<() => void>();

const titleBySlug = new Map<string, string>(
  articleRegistry.map((entry) => [entry.slug, entry.title]),
);

export function isKnownArticleSlug(slug: string): boolean {
  return titleBySlug.has(slug);
}

export async function getPublishedArticleRegistry(now = new Date()) {
  const states = await getPublicationStateSnapshot();
  return getVisibleRegistryArticles(articleRegistry, states, now);
}

export function onPublicationStateChanged(listener: () => void): () => void {
  publicationStateChangeListeners.add(listener);
  return () => publicationStateChangeListeners.delete(listener);
}

export function notifyPublicationStateChanged(): void {
  for (const listener of publicationStateChangeListeners) listener();
}

export async function refreshPublicationStateSnapshot(
  now = new Date(),
): Promise<EditorialPublishState[]> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const startedAt = Date.now();
    const due = await db
      .select()
      .from(editorialPublishStatesTable)
      .where(and(
        eq(editorialPublishStatesTable.status, "scheduled"),
        lte(editorialPublishStatesTable.publishAt, now),
      ))
      .orderBy(asc(editorialPublishStatesTable.publishAt));

    let publishedCount = 0;
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
          publishedCount += 1;
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
    if (publishedCount > 0) notifyPublicationStateChanged();
    logger.info({
      event: "publication_state_job_completed",
      checkedCount: due.length,
      publishedCount,
      snapshotRowCount: rows.length,
      elapsedMs: Date.now() - startedAt,
    }, "Publication-state refresh completed");
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
