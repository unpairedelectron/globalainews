import { pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
export * from "./editorial-releases";
export * from "./editorial-release-history";

export const newsletterSubscribersTable = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    status: text("status").notNull().default("queued"),
    provider: text("provider").notNull().default("database-queue"),
    providerId: text("provider_id"),
    source: text("source").notNull().default("global-ai-news"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIndex: uniqueIndex("newsletter_subscribers_email_idx").on(table.email),
  }),
);