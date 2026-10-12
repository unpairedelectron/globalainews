# Production SEO and trust evidence

Audit date: 2026-10-12  
Production domain checked: `https://www.globalainews.in`  
Scope: public HTTP responses and sitemap, plus a read-only production database inventory. Workspace changes are not published.

## Production facts

| Check | Evidence | Finding |
|---|---|---|
| Main page | HTTPS `www` homepage returned 200; sampled TTFB was about 636 ms | Meets the requested 800 ms single-sample check; this is not a p75 or field-performance measurement. |
| Mobile viewport | Initial HTML used `width=device-width, initial-scale=1.0, maximum-scale=1` | Changed locally to remove the zoom restriction. |
| Sitemap | Valid XML with 45 URLs, including 8 article URLs; all 45 returned 200, had matching self-canonicals, and none carried `noindex` | No sitemap removals or redirects were justified by this check. |
| Article response | All 8 live article routes returned 200 with article content and self-canonicals in the first response | Live routes and editorial source records are not the same as database-published release rows. |
| Production DB | `editorial_releases` contained 4 `scheduled` rows and 0 `published` rows on audit date | Snapshot preserved at `docs/snapshot/production-articles-2026-10-12.csv`. Do not treat these four rows as the full live article inventory. |
| Publisher facts/settings | Read-only schema inspection found no settings, author, or contact tables; the only related table was `newsletter_subscribers` | No verified legal-policy text, author bios, or public contact channel can be derived from production settings. No subscriber values were queried. |
| Public article source | Newsroom API returned 8 public stories maintained outside those four published DB rows | This explains the count difference at the API boundary; exact ownership/history of older UUIDs remains unverified. |
| Robots | `robots.txt` returned 200, allowed all paths, and declared the sitemap | Workspace update now blocks `/api/`, `/insights/`, `/sign-in/`, and `/sign-up/`; public routes remain allowed. |
| Ads | `ads.txt` returned 200 with `google.com, pub-3766621537317806, DIRECT, f08c47fec0942fa0` | Exact requested seller line was present. |
| Trust pages | `/about-us`, `/code-of-ethics`, `/corrections`, `/contact-us` returned 200 with `noindex` | Workspace HTML now makes these public trust pages indexable. Contact/corrections copy still states that no approved submission route exists; no contact details were invented. |
| Missing pages | `/privacy`, `/terms`, `/authors`, and an unknown path returned 404/noindex | Workspace now serves indexable, clearly marked interim privacy and terms notices plus an author directory that lists the organizational byline without inventing individual bios. Unknown paths remain 404. Production stays unchanged until the owner publishes. |
| Host redirects | `http://www.globalainews.in/` redirected to HTTPS with `:443` in the `Location`; apex-host DNS did not resolve from the audit environment | HTTPS `www` canonical behavior was observed. Apex redirection cannot be verified or fixed at app level without DNS/edge access. |
| Search Console | No Search Console connection or index-coverage export was available | Index coverage, manual actions, and Google-selected canonicals remain unverified. |

## Content inventory and editorial decisions

Production exposes these eight public stories through the newsroom API; source counts below are the maintained record's `sources` count, not an independent claim-quality score.

| Slug | Date | Source records | Decision |
|---|---:|---:|---|
| `india-ai-compute-access-2026` | 2026-10-03 | 22 | Keep as the current India AI compute report; retain dated quantities and stage qualifiers. |
| `weekly-deep-dive-cost-of-intelligence` | 2026-09-28 | 2 | Keep; preserve the dated, bounded framing. |
| `public-compute-needs-public-metrics` | 2026-09-23 | 9 | Merge candidate into the India compute report/data record; overlap is topical, but no historical slug-to-ID mapping is established. No redirect applied yet. |
| `reliability-is-the-new-ai-moat` | 2026-09-21 | 1 | Upgrade source diversity before broad reliability claims; one source record is not enough to infer independent confirmation. |
| `study-finds-word-cues-can-override-game-theory-choices-in-llms` | 2026-09-21 | 1 | Keep the preprint status prominent and avoid implying peer review or generalization beyond the reported study. |
| `ai-models-antibiotic-discovery` | 2026-09-11 | 1 | Keep; preserve the study's stated model, assay, and preclinical limits. |
| `quiet-race-watermark-everything-ai-makes` | 2026-09-10 | 4 | Keep; distinguish provenance metadata from proof that content is authentic or true. |
| `small-models-serious-workflows` | 2026-09-08 | 1 | Keep; preserve the distinction between active parameters and total model footprint. |

No story was removed, unpublished, or redirected. These recommendations are based on live story metadata and existing evidence labels, not an unverified review of source-body support. See `docs/CONTENT_DECISIONS.csv`.

## Workspace changes in this audit

- Removed `maximum-scale=1` from the base viewport so users can zoom.
- Added crawler exclusions for API and editor-only routes while leaving the public site crawlable.
- Replaced the homepage's large evidence panel with the current lead story, date, summary, and a direct story link in both first-response and hydrated HTML.
- Made About, Ethics, Corrections, and Contact indexable; added explicit interim Privacy and Terms notices and an organization-byline author directory, with internal links.
- Logged the URL-level changes in `docs/seo-changes.csv`.
- `pnpm --filter @workspace/global-ai-news run test:smoke` passes after refreshing the homepage visual baselines. It checked 52 public routes on desktop, 8 on mobile, 8 AMP pages, RSS, metadata/structured data, links, images, responsive layouts, and newsroom release workflows.

## Verification limits and next evidence needed

- The production `editorial_releases` table has no published rows, so database-published article slugs and legacy IDs cannot be audited as requested. The preserved snapshot is read-only evidence; no production rows were changed.
- The apex domain did not resolve from the workspace. Confirm apex/www redirects and DNS at the registrar or edge provider.
- Obtain Search Console coverage, sitemap processing, and Core Web Vitals field data before claiming indexing or performance outcomes.
- Publisher-approved privacy/terms language, named contributors (if any), public corrections route, and contact details are absent. The workspace pages disclose those gaps; complete legal text and an approved reader contact route still need publisher input.
- Local changes have not been published. Re-run the production checks after the owner publishes.
