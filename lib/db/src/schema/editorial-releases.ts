import { integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const editorialReleasesTable = pgTable(
  "editorial_releases",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    publishAt: timestamp("publish_at", { withTimezone: true }).notNull(),
    cadence: text("cadence").notNull().default("daily"),
    status: text("status").notNull().default("scheduled"),
    position: integer("position").notNull().default(0),
    story: jsonb("story").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIndex: uniqueIndex("editorial_releases_slug_idx").on(table.slug),
  }),
);