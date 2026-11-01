import { createInsertSchema } from "drizzle-zod";
import { check, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { z } from "zod/v4";

export const editorialPublishStatesTable = pgTable(
  "editorial_publish_states",
  {
    slug: text("slug").primaryKey(),
    publishAt: timestamp("publish_at", { withTimezone: true }).notNull(),
    status: text("status").notNull().default("scheduled"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    updatedBy: text("updated_by").notNull(),
  },
  (table) => ({
    validStatus: check(
      "editorial_publish_states_status_check",
      sql`${table.status} in ('staged', 'scheduled', 'published', 'paused')`,
    ),
    publishSchedule: index("editorial_publish_states_publish_at_idx").on(table.publishAt),
  }),
);

export const insertEditorialPublishStateSchema = createInsertSchema(editorialPublishStatesTable).omit({
  updatedAt: true,
});

export type InsertEditorialPublishState = z.infer<typeof insertEditorialPublishStateSchema>;
export type EditorialPublishState = typeof editorialPublishStatesTable.$inferSelect;
