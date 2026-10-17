# Production database cost remediation log

## Scope and safety

- Target: reduce recurring production PostgreSQL compute without changing production rows, public content, SEO routes, redirects, ads.txt, or sitemap content.
- No production deployment or production environment change was made.
- The selected backup approach is a Replit-managed production recovery point. The workspace cannot verify its schedule or latest recovery timestamp; no full database dump was placed in the repository.
- Replit documentation states that production PostgreSQL suspends after five idle minutes. A production request interval shorter than that can keep compute active, but the reported compute hours alone do not identify the responsible caller.

## Audit findings

- `GET /api/newsroom/content` previously used a one-second in-process cache and read release and dynamic-source records on cache misses.
- Public metadata, sitemap, feed, and social-preview handlers shared the DB-backed story helper. The browser refresh interval was already 12 hours, but each cold visitor or crawler could still request the API.
- The release metadata build server queried the database while constructing public metadata.
- Production explicitly set `EDITORIAL_AUTOMATION_ENABLED=false`, but the code defaulted automation on in production if the flag was absent. When enabled it ran every 30 minutes plus an immediate startup run.
- Newsletter storage occurred only after signup POST validation; the endpoint had no in-process request limit or honeypot.
- Authenticated editor routes and valid newsletter submissions remain database-backed by design. The health endpoint is not a database keepalive.

## Changes made

- Public story/metadata/sitemap/feed/social handlers now build from the maintained static story and source records instead of querying release/source tables.
- Release metadata generation no longer imports or queries the database.
- The release build emits a static search index; public search uses it, with the existing in-memory snapshot as the development fallback. Existing sitemap/feed cache headers remain unchanged.
- Authenticated release reads and writes refresh a process-local published-release snapshot; subsequent public GETs use that snapshot without querying the database.
- PostgreSQL pool sizing is capped at two clients, with zero minimum clients and a 10-second idle timeout.
- Editorial automation is now opt-in and, when explicitly enabled, schedules at most one run per 24-hour interval. It no longer runs immediately at startup.
- Newsletter POST now has an in-memory per-IP hourly limit and a honeypot field; accepted honeypot submissions do not touch the database.

## Verification state

Production compute after these changes is not measurable until the app is published. No production URL, database activity log, or 15-minute production idle observation was collected in this workspace. See `COST_FIX_RESULTS.md` for the remaining owner-run verification steps.
