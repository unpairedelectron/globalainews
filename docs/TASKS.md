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
- [ ] A2. **Blocked:** build an editor-only `/admin/release-import` page using existing Clerk editor authorization; upload, dry-run by default, explicit Apply, idempotency, audit log, and last-apply rollback. The current API cannot preserve authored story structure and citation metadata.
- [x] A3. Check whether the platform can mint a scoped `RELEASE_API_TOKEN`; implement `release:apply` only if supported, otherwise document the omission.
- [x] A4. Add mocked-auth unit/integration coverage, including unauthenticated 401 and assertions that production has no bypass, test header, or debug-auth flag.
- [x] A5. Validate the exact manifest schema and capture a full staging dry-run using test fixtures in `docs/PROGRESS.md`.
- [x] A6. Write `docs/OWNER-RELEASE-CARD.md` with five or fewer owner steps and the Reports/India Watch indexing reminder.

### B. Homepage and public-page performance

- [x] B1. Record exact failing Lighthouse audits and causes in `docs/lighthouse-findings.md`.
- [x] B2. Defer Clarity and other existing third-party analytics until first interaction or four seconds after load, whichever comes first; respect consent where required and preserve collection.
- [ ] B3. Reduce remaining mobile load cost without lowering targets. Research contrast, Clarity loading, and responsive editorial images were addressed; Home, Brief, and AI topic mobile Performance remain below 95, and supplemental mobile scores need a comparable proxy recheck.
- [x] B4. Re-run mobile/desktop Lighthouse for home, Brief, Reports, each topic hub, About, Methodology (`/code-of-ethics/`), Corrections, and ten staged articles; record the 36-run matrix and supplemental route coverage in `docs/lighthouse-release.md`.
- [x] B5. Keep Reports and India Watch noindex until they are substantive index pages; include `OWNER: flip to index when ready` in the release card.

### C. Disclosure wording

- [x] C1. Apply the all-company no-commercial-relationship statement only if the owner input is YES.
- [x] C2. With current owner input NO, retain the confirmed statement only on Articles 1, 2, and 4; use the neutral conflict-of-interest line on other company-naming articles.
- [x] C3. Verify rendered disclosure text, unchanged schema descriptions, and empty corrections log.

### D. Final verification

- [x] D1. Re-run pre-publish, cross-article, link, and accessibility checks on all ten articles; fix regressions.
- [x] D2. Re-run `global-ai-news-smoke` and schedule simulations; verify pre-date exclusion from public pages, sitemaps, and RSS. No live queue writes were made.
- [x] D3. Update `docs/RELEASE-RUNBOOK.md`, `docs/PROGRESS.md`, and the Lighthouse reports.

## Strict continuation — code-native release state and mobile performance

### A. Release without flattening content (A2)

- [x] A1. Build `release/article-registry.json` from the ten private draft metadata files and one source-controlled schedule, including slug, title, description, topic, schedule slot, UTC `publishAt`, and scheduled status. Staging builds consume the same registry.
- [x] A2. Add an additive publish-state table containing slug, `publishAt`, status, `updatedAt`, and `updatedBy`; document the reversible rollback.
- [x] A3. Gate `/article/<slug>/` on published state and elapsed publish time: pre-publication returns a true 404; published pages preserve staging content and allowed canonical/robots/banner differences. Staging remains noindex.
- [ ] A4. Gate topic hubs, Reports, Briefs, Signals, sitemap index/children, news sitemap, RSS, and topic RSS on published state only.
- [ ] A5. Keep Briefs, Signals, topic entries, and glossary data structured in the repo and gate them through publish state unless an existing CMS round-trip proves safe.
- [ ] A6. Add Clerk editor-only `/admin/release` with state-only manifest dry run, explicit idempotent Apply, per-item Publish now/Pause/Roll back, and durable audit history.
- [ ] A7. Add a logged, restart-safe five-minute server-side job that publishes due rows and refreshes public snapshots/caches.
- [ ] A8. Verify auth, production no-bypass source, ten-article staging/public HTML round trips, every-slot pre/post date simulation and Pause, JSON-LD, sitemap/RSS validity, and link integrity.
- [ ] A9. Regenerate the publish-state manifest and update the owner card/runbook for the new admin flow.

### B. Mobile performance (never blocks A)

- [ ] B1. Establish one Lighthouse 13.6.0 harness: simulated Slow 4G and 4× CPU, median of five runs, production-like local and deployed URL; document it in `docs/lighthouse-method.md`.
- [ ] B2. Cover Home, Brief, Reports, India Watch, AI topic, About, Methodology, Corrections, Research, and all ten staged articles in `docs/lighthouse-final.md`.
- [ ] B3. For each mobile route below 95, record LCP element, TBT, JS bytes, hydration cost, and long tasks; fix the top route-specific causes without lowering targets.
- [ ] B4. Retest after each fix cycle, at most three cycles per route; document residual causes and continue.
- [ ] B5. Verify/report LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 on every route.
- [ ] B6. Recheck Research with the standard harness; the prior focused run was non-comparable.

### C. Final verification

- [ ] C1. Re-run pre-publish, cross-article consistency, link, and accessibility checks on all ten articles.
- [ ] C2. Re-run smoke, root typecheck, and all schedule simulations; verify future content stays absent from public surfaces.
- [ ] C3. Preserve commercial input `NO` and Reports/India Watch noindex.
- [ ] C4. Update `docs/PROGRESS.md` and the runbook after verification.

## Owner-ordered strict release continuation

Current scope: A4 through C4. Keep repo-defined article structure and citations; database stores publish state only. Do not publish, deploy, or change production schema.

### Group 1 — Derived-surface gating

- [ ] A4. Gate topic hubs, Reports, Daily Brief links, Signals links, sitemap with real `lastmod`, 2-day news sitemap, RSS, and per-topic RSS on published state and elapsed publish time. Test empty/scheduled exclusion and post-promotion inclusion for all ten articles.
- [ ] A5. Gate Briefs, Signals, topic entries, and glossary links consistently; preserve structured code-native data. Add one dated Brief per publish day with that day's article and 2–3 verified fact-log items. Run the A4 leak test.

### Group 2 — Admin and scheduler

- [ ] A6. Build Clerk-protected `/admin/release` for publish-state-only manifest import, dry-run by default, explicit idempotent Apply, per-article Publish now/Pause/Roll back, and audit history. Test unauthenticated protection and mocked-auth flows.
- [ ] A7. Finish the restart-safe scheduler; promote only due rows with conditional updates, audit, cache/sitemap/RSS refresh. Test all ten slots with a fake clock.

### Group 3 — Verification and owner handoff

- [ ] A8. Run and record auth/no-bypass checks, ten-article staging/public HTML round trips, fake-clock before/after/Pause checks across all surfaces, JSON-LD/sitemap/RSS validation, and link audit.
- [ ] A9. Generate the state-only `/release/manifest.json`; write the five-step `docs/OWNER-RELEASE-CARD.md`; update `docs/RELEASE-RUNBOOK.md` for early publish, pause, rollback, corrections, and Article 6/7 update triggers.

### Group 4 — Mobile performance (never blocks Groups 1–3)

- [ ] B1. Document one Lighthouse harness: same version/preset, simulated Slow 4G and 4× CPU, median of five, local production-like build and deployed URL.
- [ ] B2. Measure Home, Brief, Reports, India Watch, AI topic hub, About, Methodology, Corrections, Research, and all ten articles.
- [ ] B3. For each route below 95, record LCP element, TBT, JS bytes, hydration cost, and long tasks; fix the top causes without lowering targets.
- [ ] B4. Limit each route to three fix cycles; record residual causes and continue.
- [ ] B5. Report whether each route meets LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
- [ ] B6. Re-verify Research on the standard harness.

### Group 5 — Final checks

- [ ] C1. Re-run pre-publish, cross-article consistency, link, and accessibility checks on all ten articles.
- [ ] C2. Re-run smoke, root typecheck, and schedule simulation; confirm future content is absent from every public surface.
- [ ] C3. Confirm disclosure input `NO`, Reports/India Watch `noindex`, reviewer lines, and empty corrections logs.
- [ ] C4. Update `docs/PROGRESS.md` and the runbook after verification.
