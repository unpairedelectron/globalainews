# October 2026 article batch — execution checklist

Scope: the owner has authorized staging, site wiring, scheduled release, and publication on the dates listed below. Do not alter existing article claims/citations or URLs, DNS/domains, paid services, or personal-data collection.

## Stage 1 — staging

- [x] 1.1 Make all 10 articles reachable on a noindex staging/preview target.
- [x] 1.2 Check all 10 staging routes: HTTP, canonical/H1/title/description, OG/Twitter, JSON-LD, images/srcset, disclosure tables, console/mixed content, and links.
- [x] 1.3 Run mobile and desktop Lighthouse on all 10 articles, home, Brief, Reports, and each topic hub; save results to `docs/lighthouse-release.md`.
- [ ] 1.4 Fix failures without lowering targets; log blockers after three attempts on one item.
- [x] 1.5 Check keyboard access, `<details>`, menu, TOC, image alt text, 4.5:1 contrast, 360px width, and dark mode.
- [x] 1.6 Add `pnpm --filter @workspace/global-ai-news run audit:preview` as a repeatable regression gate for every generated staging article and the home, Brief, Reports, and India topic routes. It reports 360px dark-mode layout, WCAG accessibility, keyboard, and mobile/desktop Lighthouse results per route.

## Stage 2 — final content gate

- [x] 2.1 Run the full pre-publish script and cross-article consistency pass.
- [x] 2.2 Resolve every `[S]` claim by omission or explicit “reported, not independently confirmed” labeling.
- [ ] 2.3 Confirm reviewer/disclosures/dates/corrections/methodology/advice disclaimers on all required articles.
- [x] 2.4 Preserve Article 7 tender, Article 8 legal-date, Article 9 workforce-causation, and Article 10 bank-warning distinctions.

## Stage 3 — site wiring

- [ ] 3.1 Add dated article entries to topic hubs and Reports index, hidden until live.
- [ ] 3.2 Create one dated Daily Brief per release date with the article and 2–3 verified fact-log items.
- [ ] 3.3 Add filterable Signals datapoints with value, date, source, tier, and confidence.
- [ ] 3.4 Add glossary routes and article links; back-fill the lead article and About/Methodology links.
- [ ] 3.5 Update sitemap/news sitemap/RSS/per-topic RSS with date-gated entries and real `lastmod`.

## Stage 4 — scheduled release

- [ ] 4.1 Schedule article and Brief releases: Nov 2 (#6), Nov 3 (#5), Nov 5 (#4), Nov 7 (#1), Nov 9 (#3), Nov 11 (#2), Nov 13 (#7), Nov 16 (#8), Nov 18 (#9), Nov 20 (#10).
- [x] 4.2 Simulate every date; prove pre-date exclusion and date-of release behavior; record output in `docs/PROGRESS.md`.
- [x] 4.3 Add `npm run verify:live <slug>` and document it.
- [x] 4.4 Write `docs/RELEASE-RUNBOOK.md` for early release, pause, rollback, corrections, and Article 6/7 update triggers.

## Stage 5 — final report

- [x] 5.1 Report staging, Lighthouse, scheduled dates, flip tests, blockers, and omitted/qualified claims in `docs/PROGRESS.md`.

## Completed private article packages

- [x] Article 6 — full explainer, fact log, visuals, social variants, metadata/schema.
- [x] Article 5 — full report, fact log, visuals, social variants, metadata/schema.
- [x] Article 4 — full report, fact log, visuals, social variants, metadata/schema.
- [x] Article 1 — full report, fact log, visuals, social variants, metadata/schema.
- [x] Article 3 — full report, fact log, visuals, social variants, metadata/schema.
- [x] Article 2 — full report, fact log, visuals, social variants, metadata/schema.
- [x] Article 7 — full report, fact log, visuals, social variants, metadata/schema.
- [x] Article 8 — full explainer, fact log, visuals, social variants, metadata/schema.
- [x] Article 9 — full report, fact log, visuals, social variants, metadata/schema.
- [x] Article 10 — full explainer/report, fact log, visuals, social variants, metadata/schema.

## Strict finish pass — release tooling, performance, and disclosures

Owner input: `OWNER_CONFIRMED_NO_COMMERCIAL_RELATIONSHIP_ALL = NO`.

### A. Authenticated release tooling

- [x] A1. Inspect editor API/CMS schemas and generate `/release/manifest.json` with ten scheduled articles, dated briefs from existing fact logs, sourced Signals, topic/glossary links, and date-gated sitemap/RSS flags.
- [ ] A2. Build an editor-only `/admin/release-import` page using existing Clerk editor authorization; upload, dry-run by default, explicit Apply, idempotency, audit log, and last-apply rollback.
- [x] A3. Check whether the platform can mint a scoped `RELEASE_API_TOKEN`; implement `release:apply` only if supported, otherwise document the omission.
- [x] A4. Add mocked-auth unit/integration coverage, including unauthenticated 401 and assertions that production has no bypass, test header, or debug-auth flag.
- [x] A5. Validate the exact manifest schema and capture a full staging dry-run using test fixtures in `docs/PROGRESS.md`.
- [x] A6. Write `docs/OWNER-RELEASE-CARD.md` with five or fewer owner steps and the Reports/India Watch indexing reminder.

### B. Homepage and public-page performance

- [x] B1. Record exact failing Lighthouse audits and causes in `docs/lighthouse-findings.md`.
- [x] B2. Defer Clarity and other existing third-party analytics until first interaction or four seconds after load, whichever comes first; respect consent where required and preserve collection.
- [ ] B3. Fix remaining performance, accessibility, best-practices, cache, font, image, CSS/JS, and console findings without lowering targets.
- [ ] B4. Re-run mobile/desktop Lighthouse for home, Brief, Reports, each topic hub, About, Methodology, Corrections, and ten staged articles; meet unchanged targets or document vendor-only residuals and owner options.
- [x] B5. Keep Reports and India Watch noindex until they are substantive index pages; include `OWNER: flip to index when ready` in the release card.

### C. Disclosure wording

- [x] C1. Apply the all-company no-commercial-relationship statement only if the owner input is YES.
- [x] C2. With current owner input NO, retain the confirmed statement only on Articles 1, 2, and 4; use the neutral conflict-of-interest line on other company-naming articles.
- [x] C3. Verify rendered disclosure text, unchanged schema descriptions, and empty corrections log.

### D. Final verification

- [ ] D1. Re-run pre-publish, cross-article, link, and accessibility checks on all ten articles; fix regressions.
- [ ] D2. Re-run `global-ai-news-smoke` and schedule simulations; verify pre-date exclusion from public pages, sitemaps, and RSS.
- [ ] D3. Update `docs/RELEASE-RUNBOOK.md` and `docs/PROGRESS.md`.
