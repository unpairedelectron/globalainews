import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const adminRoutes = readFileSync(new URL("../src/routes/publication-admin.ts", import.meta.url), "utf8");
const appRoutes = readFileSync(new URL("../src/routes/index.ts", import.meta.url), "utf8");
const webRoutes = readFileSync(new URL("../../global-ai-news/src/App.tsx", import.meta.url), "utf8");
const adminPage = readFileSync(new URL("../../global-ai-news/src/pages/release-admin.tsx", import.meta.url), "utf8");

test("all publication-state admin endpoints require the existing verified-editor middleware", () => {
  assert.match(adminRoutes, /router\.get\("\/newsroom\/publication-state\/manifest", requireEditorAuth/);
  assert.match(adminRoutes, /router\.post\("\/newsroom\/publication-state\/import", requireEditorAuth/);
  assert.match(adminRoutes, /router\.post\("\/newsroom\/publication-state\/:slug\/actions", requireEditorAuth/);
  assert.match(appRoutes, /router\.use\(publicationAdminRouter\)/);
  assert.doesNotMatch(adminRoutes, /x-test-editor|debug-auth|test-only-auth/i);
});

test("admin page is Clerk-wrapped, dry-run-first, and exposes explicit state actions", () => {
  assert.match(webRoutes, /pathname === '\/admin\/release'/);
  assert.match(webRoutes, /<Route path="\/admin\/release" component={ReleaseAdminPage}/);
  assert.match(adminPage, /apply: false/);
  assert.match(adminPage, /Apply changes/);
  assert.match(adminPage, /Publish now[\s\S]*Pause[\s\S]*Roll back/);
  assert.match(adminPage, /useGetNewsroomReleaseHistory/);
  assert.match(adminPage, /indexable=\{false\}/);
  assert.match(adminPage, /formatAuditSummary/);
});
