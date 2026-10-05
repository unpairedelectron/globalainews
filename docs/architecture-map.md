# Global AI News architecture map

**Current as of:** 2026-10-05
**Source branch:** `main`  
**Current source fingerprint:** `27b87f17ccfc18dd1a9258c2c6c3f63b64dbbb49+source-sha256:ef63fe0bcf3bffb215109ccf2a5c57a510c4b4f23e3b9ca9a58177577d62360a`

## Deployment topology

The Web and API artifacts are configured for Replit Autoscale with path routing. Deployment metadata observed at `2026-10-05T12:49Z` reports an active deployment and successful build at `https://www.globalainews.in`. Read-only requests to both public hosts and both `/` and `/api/healthz` confirm an older deployed source commit and Web/API fingerprints than current `main`; see `docs/production-cutover-checklist.md`. The active scheduler configuration remains unverified.

| Service | Artifact path | Local port | Production build | Production start |
| --- | --- | ---: | --- | --- |
| Web | `/` | `19819` | `pnpm --filter @workspace/global-ai-news run build:production` | `node --enable-source-maps artifacts/global-ai-news/dist/server/server.mjs` |
| API | `/api` | `8080` | `pnpm --filter @workspace/api-server run build` | `node --enable-source-maps artifacts/api-server/dist/index.mjs` |

The deployment target is set to `autoscale` in `.replit`. Replit prepares a replacement alongside the running version and switches traffic at promotion. Replit's documented `Unpublish` action shuts down the whole deployment, not only the API. The deployment is currently reported active; this remediation did not publish, unpublish, or otherwise change production.

## Route ownership

| Public route | Owner | Behavior |
| --- | --- | --- |
| `/` and client-side public routes | Web artifact | Built static shell; React routes render public pages. |
| `/reports` | Web artifact | Indexable React report index reads published report records from the API-backed newsroom snapshot; included in metadata, sitemap, and prerender support. |
| `/article/:slug` | Web artifact | Express first-response renderer fetches the API newsroom snapshot and returns article-specific HTML and SEO metadata; article misses return 404/noindex. |
| `/amp/article/:slug` | Web artifact | Built AMP documents and the request-time handler use the published story, author, and source records; citations, tables, and source lists are rendered from that snapshot. Unknown slugs return 404/noindex. |
| `/feed.xml` | Web artifact, proxying API | Proxies to `/api/newsroom/feed.xml`; no checked-in root XML should own this route. |
| `/sitemap.xml` | Web artifact, proxying API | Proxies to `/api/newsroom/sitemap.xml`; no checked-in root XML should own this route. |
| `/about-us`, `/code-of-ethics`, `/corrections`, `/contact-us` | Web artifact | Verified editorial-policy copy with `200` and `noindex`; no unapproved contact or corrections channel is presented. |
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
- At `2026-10-05T12:49:04Z`, read-only root and `/api/healthz` requests on both production hosts returned HTTP 200 and identical stale artifact headers. The current deployment's robots behavior and edge/cache behavior were not checked in this remediation. Do not probe newsroom, feed, or sitemap routes; those GETs may seed schedule rows. Production/local parity is known to be mismatched.

## Environment configuration

Environment variable names referenced by the application/configuration include:

- Web: `PORT`, `BASE_PATH`, `NEWSROOM_API_ORIGIN`, and the three `GAN_BUILD_*_REVISION` values.
- API: `PORT`, `NODE_ENV`, `DATABASE_URL`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEWSLETTER_PROVIDER_URL`, `NEWSLETTER_PROVIDER_TOKEN`, `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `EDITORIAL_DRAFT_MODEL`, `EDITORIAL_VERIFICATION_MODEL`, and `EDITORIAL_AUTOMATION_ENABLED`.
- The current workspace API artifact explicitly sets `EDITORIAL_AUTOMATION_ENABLED=false`. The active deployed API revision is an older main-branch ancestor, and its automation setting has not been established; do not infer its scheduler state or invoke production automation.
- Secret values are not recorded in this document.

## Scheduler ownership and cutover

The API entrypoint calls `startEditorialAutomation()` after listening. The current workspace code gives an explicit `EDITORIAL_AUTOMATION_ENABLED=false` value precedence over the production default, and the API artifact supplies that value. The active deployed revision is identified as stale, but its automation behavior is unknown. No production automation was invoked for this remediation.

No production automation has been invoked. Local fingerprints are verified and differ from the active deployment's observed fingerprints. Do not Publish without explicit owner authorization or run production automation; use only the safe checks in `docs/production-cutover-checklist.md` after any authorized publish.

## Current gaps and release gates

- The local full smoke suite covers public routes, mobile routes, AMP pages, RSS, release-history recovery, themes, and the internal-link audit. The last production AMP observation was 7/10 on 2026-10-03; 2026-10-05 root and health probes confirm stale revisions but do not verify AMP or other production route behavior.
- No deployment or production automation was performed for this remediation. The active deployed scheduler state is unknown; the workspace API keeps automation disabled. If an owner authorizes a later publish, use only the safe health, authentication, robots, and fingerprint checks in the cutover checklist.
- The report distinguishes GPU targets, shared/onboarded supply, access, availability, and reported GPU-hours. Public evidence does not yet reconcile the dated counts or establish a current schedulable inventory.
- Existing source, entity, timeline, metric, and story data are code-managed and have varying provenance detail; do not present an unverified value as an evidenced fact.
- The workspace audit still reports high-severity `braces@3.0.3`. The API chain is development-only (`http-proxy-middleware@4.2.0` → `micromatch@4.0.8` → `braces@3.0.3`); its production dependency view is empty, the production Clerk proxy uses `httpxy`, and tests confirm the API production bundle excludes this chain. A separate development test path is `fast-glob` → `micromatch` → `braces`. The local `pnpm` patch bounds input and recursive AST depth, and ten API/security tests cover the dependency paths and production exclusion. Scanner visibility remains, but this finding is not evidence of a braces dependency in the production API runtime. No broad dependency replacement was made.
- The public client entry measures 520,440 bytes (160,470 gzip); the shared public-route chunk is 63,580 bytes (14,250 gzip), and the deferred Clerk route chunk measures 146,780 bytes (36,890 gzip). CSS is 148,390 bytes (23,330 gzip). The entry still exceeds Vite's 500 kB warning threshold. Local mobile measurements and their limits are recorded in `docs/mobile-performance-audit.md`; the latest six-route sample's slowest route was `/topic/india` at 3,880 ms LCP.