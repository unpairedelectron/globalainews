import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  ActOnPublicationStateBody,
  ActOnPublicationStateResponse,
  GetPublicationStateManifestResponse,
  ImportPublicationStateManifestBody,
  ImportPublicationStateManifestResponse,
} from "@workspace/api-zod";
import {
  db,
  editorialPublishStatesTable,
  editorialReleaseHistoryTable,
} from "@workspace/db";
import { articleRegistry } from "../editorial/article-registry.generated";
import { getPreviousPublicationState, planPublicationStateImport } from "../editorial/publication-admin-logic";
import { notifyPublicationStateChanged, refreshPublicationStateSnapshot } from "../editorial/publication-state";
import { requireEditorAuth } from "../middlewares/requireEditorAuth";

const router: IRouter = Router();
const entriesBySlug = new Map<string, (typeof articleRegistry)[number]>(
  articleRegistry.map((entry) => [entry.slug, entry]),
);

function actorFromResponse(response: { locals: Record<string, unknown> }): string {
  const editorUserId = response.locals.editorUserId;
  if (typeof editorUserId !== "string" || editorUserId.length === 0) {
    throw new Error("Verified editor identity was not attached to the request.");
  }
  return editorUserId;
}

function hasOnlyStateFields(body: unknown): boolean {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return false;
  const record = body as Record<string, unknown>;
  if (Object.keys(record).some((key) => !["states", "apply"].includes(key))) return false;
  if (!Array.isArray(record.states)) return false;
  return record.states.every((entry) =>
    typeof entry === "object" &&
    entry !== null &&
    !Array.isArray(entry) &&
    Object.keys(entry).every((key) => ["slug", "publishAt", "status"].includes(key)) &&
    Object.keys(entry).length === 3,
  );
}

router.get("/newsroom/publication-state/manifest", requireEditorAuth, async (req, res): Promise<void> => {
  try {
    const rows = await db.select().from(editorialPublishStatesTable);
    const bySlug = new Map(rows.map((row) => [row.slug, row]));
    const manifest = articleRegistry.map((article) => {
      const current = bySlug.get(article.slug);
      return {
        slug: article.slug,
        publishAt: current?.publishAt ?? new Date(article.publishAt),
        status: current?.status ?? "scheduled",
      };
    });
    res.setHeader("Cache-Control", "no-store");
    res.json(GetPublicationStateManifestResponse.parse({ states: manifest }));
  } catch (error) {
    req.log.error({ err: error }, "Publication-state manifest read failed");
    res.status(500).json({ error: "Publication-state manifest unavailable." });
  }
});

router.post("/newsroom/publication-state/import", requireEditorAuth, async (req, res): Promise<void> => {
  if (!hasOnlyStateFields(req.body)) {
    res.status(400).json({ error: "Import accepts only slug, publishAt, and status state fields." });
    return;
  }
  const parsed = ImportPublicationStateManifestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const submitted = parsed.data.states;
  const slugs = new Set(submitted.map((entry) => entry.slug));
  if (
    submitted.length !== articleRegistry.length ||
    slugs.size !== articleRegistry.length ||
    articleRegistry.some((article) => !slugs.has(article.slug)) ||
    submitted.some((entry) => {
      const article = entriesBySlug.get(entry.slug);
      return !article || new Date(article.publishAt).getTime() !== entry.publishAt.getTime();
    })
  ) {
    res.status(400).json({ error: "Manifest must contain each known article exactly once with its scheduled UTC time." });
    return;
  }

  try {
    const currentRows = await db.select().from(editorialPublishStatesTable);
    const changes = planPublicationStateImport(submitted, currentRows);
    if (!parsed.data.apply) {
      res.setHeader("Cache-Control", "no-store");
      res.json(ImportPublicationStateManifestResponse.parse({
        dryRun: true,
        applied: false,
        changes: changes.map(({ slug, disposition, previousStatus, nextStatus }) => ({ slug, disposition, previousStatus, nextStatus })),
      }));
      return;
    }

    const actor = actorFromResponse(res);
    const appliedAt = new Date();
    await db.transaction(async (tx) => {
      for (const change of changes) {
        if (change.disposition === "unchanged") continue;
        const article = entriesBySlug.get(change.slug)!;
        await tx.insert(editorialPublishStatesTable).values({
          slug: change.slug,
          publishAt: change.entry.publishAt,
          status: change.entry.status,
          updatedAt: appliedAt,
          updatedBy: actor,
        }).onConflictDoUpdate({
          target: editorialPublishStatesTable.slug,
          set: {
            publishAt: change.entry.publishAt,
            status: change.entry.status,
            updatedAt: appliedAt,
            updatedBy: actor,
          },
        });
        await tx.insert(editorialReleaseHistoryTable).values({
          releaseSlug: change.slug,
          releaseTitle: article.title,
          actor,
          action: "edited",
          summary: JSON.stringify({
            source: "publish-state-admin",
            operation: "manifest-import",
            previous: change.previous,
            current: { publishAt: change.entry.publishAt.toISOString(), status: change.entry.status },
          }),
        });
      }
    });
    await refreshPublicationStateSnapshot();
    notifyPublicationStateChanged();
    res.setHeader("Cache-Control", "no-store");
    res.json(ImportPublicationStateManifestResponse.parse({
      dryRun: false,
      applied: true,
      changes: changes.map(({ slug, disposition, previousStatus, nextStatus }) => ({ slug, disposition, previousStatus, nextStatus })),
    }));
  } catch (error) {
    req.log.error({ err: error }, "Publication-state manifest import failed");
    res.status(500).json({ error: "Publication-state manifest could not be applied." });
  }
});

router.post("/newsroom/publication-state/:slug/actions", requireEditorAuth, async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const article = entriesBySlug.get(slug);
  if (!article) {
    res.status(404).json({ error: "Article not found." });
    return;
  }
  const parsed = ActOnPublicationStateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const actor = actorFromResponse(res);
  const now = new Date();
  try {
    const result = await db.transaction(async (tx) => {
      const [current] = await tx.select().from(editorialPublishStatesTable)
        .where(eq(editorialPublishStatesTable.slug, slug)).limit(1);
      let next: { publishAt: Date; status: string } | null;
      let changed = true;
      const action = parsed.data.action;

      if (action === "rollback") {
        const history = await tx.select().from(editorialReleaseHistoryTable)
          .where(and(eq(editorialReleaseHistoryTable.releaseSlug, slug), eq(editorialReleaseHistoryTable.action, "edited")))
          .orderBy(desc(editorialReleaseHistoryTable.createdAt), desc(editorialReleaseHistoryTable.id));
        const reversible = history.map((row) => ({ row, previous: getPreviousPublicationState(row.summary) }))
          .find((item) => item.previous !== undefined);
        if (!reversible || reversible.previous === undefined) {
          throw Object.assign(new Error("There is no publication-state change to roll back."), { statusCode: 409 });
        }
        next = reversible.previous;
        if (!next) {
          if (!current) { changed = false; }
          else await tx.delete(editorialPublishStatesTable).where(eq(editorialPublishStatesTable.slug, slug));
        } else if (current?.publishAt.getTime() === next.publishAt.getTime() && current.status === next.status) {
          changed = false;
        } else {
          await tx.insert(editorialPublishStatesTable).values({
            slug, publishAt: next.publishAt, status: next.status, updatedAt: now, updatedBy: actor,
          }).onConflictDoUpdate({
            target: editorialPublishStatesTable.slug,
            set: { publishAt: next.publishAt, status: next.status, updatedAt: now, updatedBy: actor },
          });
        }
      } else {
        const baseline = current ?? {
          slug,
          publishAt: new Date(article.publishAt),
          status: "scheduled",
          updatedAt: now,
          updatedBy: actor,
        };
        next = action === "publish-now" && current?.status === "published"
          ? { publishAt: current.publishAt, status: current.status }
          : action === "publish-now"
            ? { publishAt: now, status: "published" }
            : { publishAt: baseline.publishAt, status: "paused" };
        changed = current?.status !== next.status || current?.publishAt.getTime() !== next.publishAt.getTime();
        if (changed) {
          await tx.insert(editorialPublishStatesTable).values({
            slug, publishAt: next.publishAt, status: next.status, updatedAt: now, updatedBy: actor,
          }).onConflictDoUpdate({
            target: editorialPublishStatesTable.slug,
            set: { publishAt: next.publishAt, status: next.status, updatedAt: now, updatedBy: actor },
          });
        }
      }

      if (changed) {
        await tx.insert(editorialReleaseHistoryTable).values({
          releaseSlug: slug,
          releaseTitle: article.title,
          actor,
          action: "edited",
          summary: JSON.stringify({
            source: "publish-state-admin",
            operation: action,
            previous: current ? { publishAt: current.publishAt.toISOString(), status: current.status } : null,
            current: next ? { publishAt: next.publishAt.toISOString(), status: next.status } : null,
          }),
        });
      }
      return { action, changed, state: next ? { slug, ...next } : null };
    });
    if (result.changed) {
      await refreshPublicationStateSnapshot();
      notifyPublicationStateChanged();
    }
    res.setHeader("Cache-Control", "no-store");
    res.json(ActOnPublicationStateResponse.parse(result));
  } catch (error) {
    const statusCode = typeof error === "object" && error !== null && "statusCode" in error
      ? Number(error.statusCode)
      : 500;
    if (statusCode === 409) {
      res.status(409).json({ error: error instanceof Error ? error.message : "No rollback is available." });
      return;
    }
    req.log.error({ err: error, slug }, "Publication-state action failed");
    res.status(500).json({ error: "Publication-state action failed." });
  }
});

export default router;
