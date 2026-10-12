# Production newsroom data source finding

Audit date: 2026-10-12

## Finding

The deployed API uses the production database for editorial-release records, but its public story snapshot is not built from database rows alone. It merges qualifying release rows with the maintained story collection in the web artifact, then de-duplicates by slug. The live API returned eight stories before the current SEO changes; those eight match the maintained baseline collection. The production database had no rows with `status = 'published'`, so the count difference is not evidence that the API is reading the development database.

## Evidence

- `lib/db/src/index.ts` creates the database client from `process.env.DATABASE_URL`; it does not hard-code a development database.
- Replit's deployment information identifies `https://www.globalainews.in` as the deployed Autoscale app. Replit documentation states that published apps use a separate production database and production environment variables.
- A read-only production query returned database `neondb`: 4 `scheduled` rows and 0 `published` rows.
- A read-only development query returned database `heliumdb`: 84 `canceled` rows, 4 `scheduled` rows and 0 `published` rows. These development rows are not the live API's production data.
- The production `GET /api/newsroom/content` response reported `source: maintained-editorial-source`, eight stories, and the maintained story slugs recorded in the public response.
- In `artifacts/api-server/src/routes/newsroom.ts`, `getPublishedStoriesFromDatabase()` reads the release table and passes eligible rows to `mergeEligiblePublishedStories()`. That function includes date-eligible maintained stories from `artifacts/global-ai-news/src/content.ts`, excludes withdrawn slugs, and de-duplicates release rows whose slug already exists in the maintained set.

## Limits

The production release rows remain scheduled; no production rows were changed. Their database statuses do not independently explain the public baseline. The public API count is explained by the maintained source plus the release merge/filter rules. No historical UUID-to-current-slug mapping was present in the inspected release table or supplied audit evidence, so UUID URLs are not redirected to invented destinations.

## Follow-up

After publishing, fetch `/api/newsroom/content` and `/sitemap.xml` again. If editorial releases are intended to become the sole public source, that is a separate product/data migration decision and should not be inferred from this count comparison.
