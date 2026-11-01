import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const apiRoutes = readFileSync(new URL("../src/routes/newsroom.ts", import.meta.url), "utf8");
const publicPages = readFileSync(new URL("../../global-ai-news/src/pages/public.tsx", import.meta.url), "utf8");
const authorityPages = readFileSync(new URL("../../global-ai-news/src/pages/authority-pages.tsx", import.meta.url), "utf8");
const reportsPage = readFileSync(new URL("../../global-ai-news/src/pages/reports-index.tsx", import.meta.url), "utf8");

test("all API XML and RSS surfaces use the publication-state-filtered registry", () => {
  assert.match(apiRoutes, /export async function serveNewsroomSitemap[\s\S]*?getPublishedArticleRegistry/);
  assert.match(apiRoutes, /router\.get\("\/newsroom\/news-sitemap\.xml"[\s\S]*?getPublishedArticleRegistry/);
  assert.match(apiRoutes, /export async function serveNewsroomFeed[\s\S]*?getPublishedArticleRegistry/);
  assert.match(apiRoutes, /router\.get\("\/newsroom\/feed\.json"[\s\S]*?getPublishedArticleRegistry/);
  assert.match(apiRoutes, /router\.get\("\/newsroom\/topic\/:slug\/feed\.xml"[\s\S]*?getPublishedArticleRegistry/);
});

test("Reports, Brief, Signals, topic hubs and topic index use the fail-closed publication-state hook", () => {
  assert.match(reportsPage, /usePublishedRegistryArticles/);
  assert.match(publicPages, /export function BriefPage[\s\S]*?usePublishedRegistryArticles/);
  assert.match(publicPages, /export function SignalsPage[\s\S]*?usePublishedRegistryArticles/);
  assert.match(publicPages, /export function TopicPage[\s\S]*?usePublishedRegistryArticles/);
  assert.match(authorityPages, /export function TopicsIndexPage[\s\S]*?usePublishedRegistryArticles/);
});
