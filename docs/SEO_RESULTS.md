# Global AI News SEO audit results

Audit date: 2026-10-12  
Canonical host: `https://www.globalainews.in`  
Status: workspace changes verified locally; not published.

## Evidence-based changes

- Confirmed the live API uses the maintained newsroom source plus qualifying production release rows; see [DATA_SOURCE_FINDING.md](./DATA_SOURCE_FINDING.md). The live API returned 8 stories before the current changes; production contained 4 scheduled and 0 published release rows.
- Merged the one documented `MERGE_CANDIDATE`, `public-compute-needs-public-metrics`, into the maintained India compute report. Its article and AMP paths get reversible 301s, and the old slug is excluded from public content, feeds, metadata and sitemap generation. The production database row was not deleted or edited.
- No off-topic or syndicated story was marked retired: the supplied audit evidence did not establish either condition.
- UUID-shaped legacy article routes without a verified mapping return 410 with `X-Robots-Tag: noindex`; neither a destination nor a keep decision was fabricated.
- Configured app-level 301s from apex HTTP/HTTPS and `www` HTTP to HTTPS `www`, preserving path and query. Known `/about`, `/ethics`, and `/contact` aliases are collapsed into the same redirect when combined with a noncanonical host. Replit preview/local hosts are not canonicalized.
- Placeholder publisher pages (`/privacy`, `/terms`, `/authors`, `/about-us`, `/code-of-ethics`, `/corrections`, `/contact-us`) now return `noindex,follow` while remaining reachable and linked from the footer. The `/about`, `/ethics`, and `/contact` aliases permanently redirect to those canonical placeholder routes.
- Sitemap generation excludes non-indexable routes and only emits `lastmod` values backed by editorial or source-record dates; it no longer assigns a generated-at date to otherwise unchanged static pages.
- `robots.txt` already had one sitemap directive, pointing to `https://www.globalainews.in/sitemap.xml`; no second sitemap was added. `ads.txt` already contained the requested seller line and was not changed.

## Production evidence before these workspace changes

- 45 sitemap URLs were observed returning 200 with self-canonicals.
- `http://www.globalainews.in` redirected to HTTPS.
- Apex DNS did not resolve from the audit environment, so the apex redirect could not be verified against production.
- Search Console coverage and canonical-selection reports were not available to this audit.

## Workspace checks

- The revised local API snapshot contains 7 public stories; the release-flow fixture adds one eligible story and confirms article, homepage, RSS, and sitemap consistency without rebuilding assets.
- The local sitemap contains 44 URLs and 9 date-backed `lastmod` entries; the merged slug is absent.
- `ads.txt` responds as `text/plain` with the requested seller line. `robots.txt` contains exactly one sitemap directive.
- The merged article and AMP URLs return 301, unknown UUID-shaped article routes return 410/noindex, and publisher placeholders return noindex while remaining available.
- The full `test:smoke` suite passes. The SEO smoke check covered 44 public routes at desktop, 8 at mobile, 7 AMP articles, RSS, and the editorial-release browser flows; the link audit found 0 issues across 99 built routes and 412 internal references.

## Search Console steps after publishing

1. In Search Console, select the verified `globalainews.in` Domain property (or add and verify it if absent).
2. Open **Sitemaps**, submit `https://www.globalainews.in/sitemap.xml`, and confirm the fetched sitemap succeeds. Check that excluded placeholder routes and the merged story do not appear.
3. Use **URL Inspection** on the homepage, each current canonical article URL, and the India compute report. Run **Test live URL** and confirm crawling is allowed, the canonical matches the HTTPS `www` URL, and the rendered response is current. Request indexing for those canonical URLs only.
4. Inspect the placeholder routes and confirm Google sees `noindex`; do not request indexing for them. Inspect the retired story URL and a sampled UUID-shaped legacy URL to confirm the 301 and 410, respectively.
5. Review **Page indexing** for duplicate canonical, redirect, soft-404, 404/410, and robots/noindex states. Compare the reported canonical with the sitemap after Google recrawls.
6. Review **Core Web Vitals** and **HTTPS** reports. Recheck the apex redirect from a network where apex DNS resolves; Search Console cannot resolve the audit environment's DNS limitation.
7. Check sitemap processing and indexing reports again after recrawl; record any remaining canonical or coverage exceptions before making further URL changes.

## Publish boundary

These are local workspace changes only. The owner must use Replit's **Publish** action. Do not change deployment type, compute size, production database rows, or the live site outside that action.
