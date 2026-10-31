# October 2026 article batch — execution checklist

Scope: the owner has authorized staging, site wiring, scheduled release, and publication on the dates listed below. Do not alter existing article claims/citations or URLs, DNS/domains, paid services, or personal-data collection.

## Stage 1 — staging

- [ ] 1.1 Make all 10 articles reachable on a noindex staging/preview target.
- [ ] 1.2 Check all 10 staging routes: HTTP, canonical/H1/title/description, OG/Twitter, JSON-LD, images/srcset, disclosure tables, console/mixed content, and links.
- [ ] 1.3 Run mobile and desktop Lighthouse on all 10 articles, home, Brief, Reports, and each topic hub; save results to `docs/lighthouse-release.md`.
- [ ] 1.4 Fix failures without lowering targets; log blockers after three attempts on one item.
- [ ] 1.5 Check keyboard access, `<details>`, menu, TOC, image alt text, 4.5:1 contrast, 360px width, and dark mode.

## Stage 2 — final content gate

- [ ] 2.1 Run the full pre-publish script and cross-article consistency pass.
- [ ] 2.2 Resolve every `[S]` claim by omission or explicit “reported, not independently confirmed” labeling.
- [ ] 2.3 Confirm reviewer/disclosures/dates/corrections/methodology/advice disclaimers on all required articles.
- [ ] 2.4 Preserve Article 7 tender, Article 8 legal-date, Article 9 workforce-causation, and Article 10 bank-warning distinctions.

## Stage 3 — site wiring

- [ ] 3.1 Add dated article entries to topic hubs and Reports index, hidden until live.
- [ ] 3.2 Create one dated Daily Brief per release date with the article and 2–3 verified fact-log items.
- [ ] 3.3 Add filterable Signals datapoints with value, date, source, tier, and confidence.
- [ ] 3.4 Add glossary routes and article links; back-fill the lead article and About/Methodology links.
- [ ] 3.5 Update sitemap/news sitemap/RSS/per-topic RSS with date-gated entries and real `lastmod`.

## Stage 4 — scheduled release

- [ ] 4.1 Schedule article and Brief releases: Nov 2 (#6), Nov 3 (#5), Nov 5 (#4), Nov 7 (#1), Nov 9 (#3), Nov 11 (#2), Nov 13 (#7), Nov 16 (#8), Nov 18 (#9), Nov 20 (#10).
- [ ] 4.2 Simulate every date; prove pre-date exclusion and date-of release behavior; record output in `docs/PROGRESS.md`.
- [ ] 4.3 Add `npm run verify:live <slug>` and document it.
- [ ] 4.4 Write `docs/RELEASE-RUNBOOK.md` for early release, pause, rollback, corrections, and Article 6/7 update triggers.

## Stage 5 — final report

- [ ] 5.1 Report staging, Lighthouse, scheduled dates, flip tests, blockers, and omitted/qualified claims.

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
