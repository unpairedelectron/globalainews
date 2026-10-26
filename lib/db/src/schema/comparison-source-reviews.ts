import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const comparisonSourceReviewsTable = pgTable("comparison_source_reviews", {
  reportSlug: text("report_slug").primaryKey(),
  checkedOn: text("checked_on").notNull(),
  nextDue: text("next_due").notNull(),
  updatedBy: text("updated_by").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
