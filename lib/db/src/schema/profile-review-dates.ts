import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const profileReviewDatesTable = pgTable("profile_review_dates", {
  profileSlug: text("profile_slug").primaryKey(),
  reviewedAt: date("reviewed_at", { mode: "string" }).notNull(),
  updatedBy: text("updated_by").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
