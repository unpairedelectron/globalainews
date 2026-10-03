# Global AI News architecture map

**Current as of:** 2026-10-03  
**Source branch:** `main`  
**Current source fingerprint:** `afa6dc1d4787f0a8c36242c93912e8c1c07d66fc+source-sha256:d062f3231815675205e08578860eed8b377c2c8f27605d4f5922451499190d6e`

## Deployment topology

The public app is a Replit Autoscale deployment with path-routed Web and API artifacts. The deployment service reports `https://www.globalainews.in` as the primary URL and `https://global-ai-media.replit.app` as an additional URL. The published build is public and has a successful-build status, but that status alone does not establish artifact parity.

| Service | Artifact path | Local port | Production build | Production start |
| --- | --- | ---: | --- | --- |
| Web | `/` | `19819` | `pnpm --filter @workspace/global-ai-news run build:production` | `node --enable-source-maps artifacts/global-ai-news/dist/server/server.mjs` |
| API | `/api` | `8080` | `pnpm --filter @workspace/api-server run build` | `node --enable-source-maps artifacts/api-server/dist/index.mjs` |

The deployment target is set to `autoscale` in `.replit`. Replit prepares a replacement alongside the running version and switches traffic at promotion. The old API process remains active until that switch. Replit's documented `Unpublish` action shuts down the whole deployment, not only the API; it therefore causes public site and API downtime.

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
- The API combines maintained content with eligible database releases into the public newsroom snapshot. `isPublicEditorialRelease` checks lifecycle state, publication time, and the minimum word count. The simpler static `getPublishedStories` path uses publication time and slug membership only; every public surface must be audited to ensure it cannot bypass the canonical eligibility rule.
- `GET /api/newsroom/content` calls `ensureSeeded`; if the release table is empty, that request inserts the maintained schedule. Avoid using this endpoint for production diagnostics until the database state and side effect are understood.
- Production database migrations are not performed by custom startup scripts. Replit's Publish flow is the managed-schema migration boundary. No production data or schema changes have been made for this delivery.

## Build inputs, assets, and caches

- `scripts/build-fingerprint.mjs` computes a source revision plus distinct Web and API artifact hashes. The Web and API emit these values in `X-GAN-*` response headers.
- `scripts/build-global-ai-news-release.mjs` starts a temporary local metadata API, fetches the newsroom metadata manifest, and builds the Web client and SSR server from that snapshot.
- Web static inputs live under `artifacts/global-ai-news/public`; production output is under `artifacts/global-ai-news/dist/public` and `dist/server`. Report routes are included in the SEO manifest and generated public pages. AMP documents receive the same source records as the report article.
- Root RSS and sitemap are runtime proxies to the API rather than independent static XML files. Social-preview assets have a one-day cache policy; article HTML, AMP, and XML proxies use `no-store` unless the upstream XML endpoint provides a cache policy. Hashed build assets are static.
- The workspace exposes the API through the shared path proxy at `/api`; development Web-to-API requests use the configured local proxy origin, while the production Web artifact uses `NEWSROOM_API_ORIGIN=https://www.globalainews.in`.
- The deployment edge/cache behavior has not yet been fully compared with direct origin responses for both published URLs.

## Environment configuration

Environment variable names referenced by the application/configuration include:

- Web: `PORT`, `BASE_PATH`, `NEWSROOM_API_ORIGIN`, and the three `GAN_BUILD_*_REVISION` values.
- API: `PORT`, `NODE_ENV`, `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEWSLETTER_PROVIDER_URL`, `NEWSLETTER_PROVIDER_TOKEN`, `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `EDITORIAL_DRAFT_MODEL`, `EDITORIAL_VERIFICATION_MODEL`, and `EDITORIAL_AUTOMATION_ENABLED`.
- The pending API production artifact explicitly sets `EDITORIAL_AUTOMATION_ENABLED=false`. The currently deployed API predates that override and still has a process-owned 30-minute automation timer.
- Secret values are not recorded in this document.

## Scheduler ownership and cutover

The API entrypoint calls `startEditorialAutomation()` after listening. The new code gives an explicit `EDITORIAL_AUTOMATION_ENABLED=false` value precedence over the production default, and the pending API artifact supplies that value. The old deployed bundle does not honor the override and may continue running until replaced or the deployment is unpublished.

No production automation has been invoked manually. Publication remains held. Before an unattended cutover can be considered safe, the old timer must be stopped. The only confirmed Replit control that stops the current Autoscale process is **Publishing → Unpublish**, which stops the entire public deployment; this requires a human decision because it takes the site offline. After that external action, the user can publish the current workspace and verify the new runtime headers.

## Current gaps and release gates

- The latest local full smoke run passes 49 public routes at desktop, 8 at mobile, 11 AMP pages, and RSS. The last known production AMP check was 7/10, and production Web/API fingerprint parity remains unverified.
- Publication remains held because the previously deployed API may still run its automation timer. The old process cannot be independently stopped without taking the whole Autoscale site offline; see scheduler ownership and cutover above.
- The report distinguishes GPU targets, shared/onboarded supply, access, availability, and reported GPU-hours. Public evidence does not yet reconcile the dated counts or establish a current schedulable inventory.
- Existing source, entity, timeline, metric, and story data are code-managed and have varying provenance detail; do not present an unverified value as an evidenced fact.
- The dependency audit found a high-severity `braces@3.0.3` advisory through production `http-proxy-middleware` and development `fast-glob`. The published advisory reports no patched upstream release as of this check.
- The main client bundle measures 678.12 kB minified (195.92 kB gzip) in the latest local production build; performance budgets remain unverified.