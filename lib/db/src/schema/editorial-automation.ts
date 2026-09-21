import { integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const editorialSourceItemsTable = pgTable(
  "editorial_source_items",
  {
    id: serial("id").primaryKey(),
    sourceSlug: text("source_slug").notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    publisher: text("publisher").notNull(),
    summary: text("summary").notNull().default(""),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow().notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  },
  (table) => ({
    urlIndex: uniqueIndex("editorial_source_items_url_idx").on(table.url),
    sourceSlugIndex: uniqueIndex("editorial_source_items_source_slug_idx").on(table.sourceSlug),
  }),
);

export const editorialAutomationRunsTable = pgTable(
  "editorial_automation_runs",
  {
    id: serial("id").primaryKey(),
    runKey: text("run_key").notNull(),
    cadence: text("cadence").notNull(),
    trigger: text("trigger").notNull(),
    status: text("status").notNull(),
    candidates: integer("candidates").notNull().default(0),
    published: integer("published").notNull().default(0),
    rejected: integer("rejected").notNull().default(0),
    detail: jsonb("detail").$type<Record<string, unknown>>().notNull().default({}),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (table) => ({
    runKeyIndex: uniqueIndex("editorial_automation_runs_key_idx").on(table.runKey),
  }),
);