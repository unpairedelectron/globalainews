# Global AI News architecture map

**Current as of:** 2026-10-04
**Source branch:** `main`  
**Current source fingerprint:** `69283d30a906b48ba210fe2e96dff92d6b678301+source-sha256:75730aa7fb4e854b0568077ed015ae0a2bee0a7b6596bfda5c80bd1c84edf729`

## Deployment topology

The Web and API artifacts are configured for Replit Autoscale with path routing. The latest available deployment metadata reports no active deployment, no successful published build, and no deployment URLs. The previous Autoscale deployment is offline, so its process-owned scheduler is stopped. Earlier public URL and health observations are historical and do not establish parity for the current workspace.

| Service | Artifact path | Local port | Production build | Production start |
| --- | --- | ---: | --- | --- |
| Web | `/` | `19819` | `pnpm --filter @workspace/global-ai-news run build:production` | `node --enable-source-maps artifacts/global-ai-news/dist/server/server.mjs` |
| API | `/api` | `8080` | `pnpm --filter @workspace/api-server run build` | `node --enable-source-maps artifacts/api-server/dist/index.mjs` |

The deployment target is set to `autoscale` in `.replit`. Replit prepares a replacement alongside the running version and switches traffic at promotion. Replit's documented `Unpublish` action shuts down the whole deployment, not only the API. The current deployment is already offline; publishing will restore both the public site and API.

## Route ownership

| Public route | Owner | Behavior |
| --- | --- | --- |
| `/` and client-side public routes | Web artifact | Built static shell; React routes render public pages. |
| `/reports` | Web artifact | Indexable React report index reads published report records from the API-backed newsroom snapshot; included in metadata, sitemap, and prerender support. |
| `/article/:slug` | Web artifact | Express first-response renderer fetches the API newsroom snapshot and returns article-specific HTML and SEO metadata; article misses return 404/noindex. |
| `/amp/article/:slug` | Web artifact | Built AMP documents and the request-time handler use the published story, author, and source records; citations, tables, and source lists are rendered from that snapshot. Unknown slugs return 404/noindex. |
| `/feed.xml` | Web artifact, proxying API | Proxies to `/api/newsroom/feed.xml`; no checked-in root XML should own this route. |
| `/sitemap.xml` | Web artifact, proxying API | Proxies to `/api/newsroom/sitemap.xml`; no checked-in root XML should own this route. |
| `/about-us`, `/code-of-ethics`, `/corrections`, `/contact-us` | Web artifact | Request-time HTML placeholders with `200` and `noindex` pending approved editorial content. |
| `/contact` | Web artifact | Permanent `308` redirect to `/contact-us`. |
| `/privacy`, `/terms` | Web artifact | Intentionally unavailable until authoritative, owner-approved legal text exists. |
| Unknown Web routes | Web artifact | HTML `404`, `noindex`. |
| `/api/*` | API artifact | Express router owns health, newsroom, and newsletter endpoints. |

The API mounts its routers under `/api`. Public newsroom content and metadata are GET endpoints; editor release, history, and automation endpoints use Clerk-backed editor authorization. The public projection is built explicitly in `toPublicStory`, including report content type and source records needed by article and AMP rendering.

## Data and persistence

- `lib/db` uses Drizzle/PostgreSQL through `DATABASE_URL`.
- PostgreSQL tables currently cover newsletter subscribers, editorial releases, release history, automation source items, and automation runs.
- The maintained editorial catalog is also represented in `artifacts/global-ai-news/src/content.ts`: authors, sources, evidence summaries, entities, timeline events, stories, scheduled stories, signals, essays, and related lists.
- The India AI compute report is a maintained Story with ordered source citations and evidence notes. Its Markdown research brief is generated from that Story at `research/india-ai-compute-2026.md`; API content, the public report index, article SEO, and AMP use the same published snapshot.
- The API combines maintained content with eligible database releases into the public newsroom snapshot. The canonical eligibility helper checks lifecycle state, publication time, and the minimum word count before releases enter the public snapshot; date-stability, release metadata, first-response, publication-fixture, and public-route tests cover that boundary.
- `GET /api/newsroom/content` calls `ensureSeeded`; if the release table is empty, that request inserts the maintained schedule. Avoid using this endpoint for production diagnostics until the database state and side effect are understood.
- Production database migrations are not performed by custom startup scripts. Replit's Publish flow is the managed-schema migration boundary. No production data or schema changes have been made for this delivery.

## Build inputs, assets, and caches

- `scripts/build-fingerprint.mjs` computes a source revision plus distinct Web and API artifact hashes. The Web and API emit these values in `X-GAN-*` response headers.
- `scripts/build-global-ai-news-release.mjs` starts a temporary local metadata API, fetches the newsroom metadata manifest, and builds the Web client and SSR server from that snapshot.
- Web static inputs live under `artifacts/global-ai-news/public`; production output is under `artifacts/global-ai-news/dist/public` and `dist/server`. Report routes are included in the SEO manifest and generated public pages. AMP documents receive the same source records as the report article.
- Root RSS and sitemap are runtime proxies to the API rather than independent static XML files. Social-preview assets have a one-day cache policy; article HTML, AMP, and XML proxies use `no-store` unless the upstream XML endpoint provides a cache policy. Hashed build assets are static.
- The workspace exposes the API through the shared path proxy at `/api`; development Web-to-API requests use the configured local proxy origin, while the production Web artifact uses `NEWSROOM_API_ORIGIN=https://www.globalainews.in`.
- DM Sans, DM Mono, and Instrument Serif are served from licensed app-local font files; DM Sans and Instrument Serif are preloaded. Clerk provider/auth modules are dynamically loaded only for sign-in, sign-up, and insights routes. The `InsightsPage` implementation itself remains in the shared public module.
- Historical read-only checks on 2026-10-03 returned a crawlable `robots.txt` on `www.globalainews.in` and `Disallow: /` on `global-ai-media.replit.app`. The checked-in robots file is host-independent; the layer adding the alias response is not identified, so do not change the file to address it.
- Production health, robots, edge/cache behavior, and artifact headers have not been rechecked since the deployment went offline. Do not probe newsroom, feed, or sitemap routes; those GETs may seed schedule rows.

## Environment configuration

Environment variable names referenced by the application/configuration include:

- Web: `PORT`, `BASE_PATH`, `NEWSROOM_API_ORIGIN`, and the three `GAN_BUILD_*_REVISION` values.
- API: `PORT`, `NODE_ENV`, `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEWSLETTER_PROVIDER_URL`, `NEWSLETTER_PROVIDER_TOKEN`, `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `EDITORIAL_DRAFT_MODEL`, `EDITORIAL_VERIFICATION_MODEL`, and `EDITORIAL_AUTOMATION_ENABLED`.
- The API production artifact explicitly sets `EDITORIAL_AUTOMATION_ENABLED=false`. The prior deployed API predated that override and had a process-owned 30-minute timer; the deployment is now offline, so that timer is stopped.
- Secret values are not recorded in this document.

## Scheduler ownership and cutover

The API entrypoint calls `startEditorialAutomation()` after listening. The new code gives an explicit `EDITORIAL_AUTOMATION_ENABLED=false` value precedence over the production default, and the API artifact supplies that value. The previous bundle did not honor the override; its deployment is now offline and the old timer is stopped.

No production automation has been invoked manually. The current workspace is locally verified and awaits the human Publish action. After publishing, verify the new runtime headers using the safe checks in `docs/production-cutover-checklist.md`.

## Current gaps and release gates

- The latest local full smoke run passes 58 public routes at desktop, 8 at mobile, 11 AMP pages, RSS, release-history recovery, theme checks, and the internal-link audit. It audited 104 built routes and 465 internal references with 0 issues. Public route captures show no third-party script origins. The last known production AMP check was 7/10 before the deployment went offline; current production parity is unverified.
- The prior deployment is offline, so the old scheduler is stopped. The workspace awaits the human Publish action; after publishing, only safe health, authentication, robots, and fingerprint checks should be used.
- The report distinguishes GPU targets, shared/onboarded supply, access, availability, and reported GPU-hours. Public evidence does not yet reconcile the dated counts or establish a current schedulable inventory.
- Existing source, entity, timeline, metric, and story data are code-managed and have varying provenance detail; do not present an unverified value as an evidenced fact.
- The dependency audit found a high-severity `braces@3.0.3` advisory through production `http-proxy-middleware` and development `fast-glob`. The published advisory reports no patched upstream release as of this check.
- The public client entry measures 588,045 bytes (171,280 gzip); the deferred Clerk route chunk measures 146,770 bytes (36,890 gzip). CSS is 147,507 bytes (23,190 gzip). The entry still exceeds Vite's 500 kB warning threshold. Local mobile measurements and their limits are recorded in `docs/mobile-performance-audit.md`; the slowest route in the latest sample was `/topic/india` at 3,984 ms LCP.