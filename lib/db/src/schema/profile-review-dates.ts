import { date, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export type ProfileReviewClaimSnapshot = { section: string; text: string };
export type ProfileReviewClaimChange = {
  section: string;
  status: "added" | "revised" | "removed";
  previousText: string | null;
  currentText: string | null;
};
export type ProfileReviewVersion = {
  reviewedAt: string;
  triggeringUpdate?: string;
  claims: ProfileReviewClaimSnapshot[];
  claimComparison: {
    status: "compared" | "no-prior-version";
    changes: ProfileReviewClaimChange[];
  };
};

export const profileReviewDatesTable = pgTable("profile_review_dates", {
  profileSlug: text("profile_slug").primaryKey(),
  reviewedAt: date("reviewed_at", { mode: "string" }).notNull(),
  reviewHistory: jsonb("review_history").$type<ProfileReviewVersion[]>().notNull().default([]),
  updatedBy: text("updated_by").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
