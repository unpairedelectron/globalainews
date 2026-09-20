import { integer, pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const editorialReleaseHistoryTable = pgTable(
  "editorial_release_history",
  {
    id: serial("id").primaryKey(),
    releaseId: integer("release_id"),
    releaseSlug: text("release_slug").notNull(),
    releaseTitle: text("release_title").notNull(),
    actor: text("actor").notNull().default("Editorial desk"),
    action: text("action").notNull(),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    createdAtIndex: index("editorial_release_history_created_at_idx").on(table.createdAt),
    releaseSlugIndex: index("editorial_release_history_release_slug_idx").on(table.releaseSlug),
  }),
);

export const insertEditorialReleaseHistorySchema = createInsertSchema(editorialReleaseHistoryTable).omit({
  id: true,
  createdAt: true,
});

export type InsertEditorialReleaseHistory = z.infer<typeof insertEditorialReleaseHistorySchema>;
export type EditorialReleaseHistory = typeof editorialReleaseHistoryTable.$inferSelect;