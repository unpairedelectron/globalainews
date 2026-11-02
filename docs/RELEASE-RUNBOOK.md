# November 2026 article release runbook

## CLI apply-token decision

No `release:apply` CLI command is provided. Replit's documented External Access Tokens are scoped to a deployment environment; they do not identify an editor or replace the app's verified-primary-email Clerk authorization. Do not use one as a substitute for an editor session or add a second release-auth path. Use the Clerk-protected newsroom editor instead.

References: [External Access Tokens](https://docs.replit.com/features/deployment-customization/external-access-tokens) and [Secrets](https://docs.replit.com/core-concepts/project-editor/app-setup/secrets).

## Release window

The ten articles are intended to publish at 07:30 UTC (13:00 Asia/Kolkata). Use `/admin/release` and preserve its audit history; do not write release rows directly to the database. `release/manifest.json` is state-only: each row contains only `slug`, `publishAt`, and `status`. Article and Brief copy remains repository-authored; Brief visibility follows its article's state.

| Date (UTC) | Article | Slug |
|---|---:|---|
| 2026-11-02 | 6 | `india-ai-consultation-paper-what-is-law` |
| 2026-11-03 | 5 | `github-octoverse-2026-agents-pull-requests` |
| 2026-11-05 | 4 | `gated-frontier-models-gemini-4-carbon` |
| 2026-11-07 | 1 | `anthropic-s1-governance-who-controls` |
| 2026-11-09 | 3 | `hyperscaler-capex-2026-reconciled` |
| 2026-11-11 | 2 | `openai-containment-incident-offline-training` |
| 2026-11-13 | 7 | `indiaai-10000-gpu-tender-explained` |
| 2026-11-16 | 8 | `eu-ai-act-december-2026-deadlines` |
| 2026-11-18 | 9 | `ai-in-workforce-plans-october-2026` |
| 2026-11-20 | 10 | `ai-agents-delegated-access-banks-passwords` |

## Before a release

1. Confirm the article remains approved, its sources still support the claims, and its editorial disclosure and update date are current.
2. Confirm the corresponding Daily Brief uses the article and only verified fact-log items.
3. Upload the state-only manifest, run a dry run, and verify the editor shows the intended UTC release time. Apply only after explicit owner approval; confirm the change appears in release history.
4. Keep the public canonical article URL unchanged; staging URLs are for QA only.

## Move a release earlier or pause it

- **Early release:** after owner approval and a fresh content/source check, use **Publish now** in `/admin/release`. Run the live verification command and confirm the public surfaces update.
- **Temporary pause:** use **Pause** in `/admin/release`. Confirm the article, Brief, topic, sitemap, and feeds are no longer presented as live. To resume, restore an approved scheduled state through the state-only manifest and verify the due time before applying.
- **Rollback:** use **Roll back** in `/admin/release` to restore the previous audited publication state. Confirm the resulting article response and sitemap/feed visibility. Do not edit publication rows directly.

## Rollback and corrections

- **Before publication:** pause or adjust the approved schedule through the state-only admin flow, then confirm the manifest and history show the change.
- **After publication:** preserve the canonical URL. Make factual corrections in the repository-authored article and source record; retain citations, update the editorial modification date, and rerun content/SEO checks. Use the admin page only for publication state.
- **Urgent legal or safety issue:** the owner decides whether to pause or roll back. Record the action in release history, then verify the article, sitemap, and feeds no longer present it as live. Do not delete rows or rewrite article content through the state manifest.
- After any correction, run `pnpm --filter @workspace/global-ai-news run verify:live -- <slug>` and check the release history entry.

## Article-specific update triggers

- **Article 6 — India consultation and IT Rules:** recheck the Official Gazette, MeitY, PIB, and relevant court orders before publication. Update promptly if an official amendment, clarification, court order, or consultation deadline changes the legal status or timetable. Keep binding rules separate from attributed proposals and expectations.
- **Article 7 — IndiaAI compute tender:** recheck the C-DAC RFE and corrigenda and the IndiaAI end-user process. Update only on an official change to tender terms, deadline, award, or deployment. Do not infer an award, installed GPU inventory, budget, or usage from the 10,000-unit target.

## Live verification

From the workspace root, run:

```sh
npm run verify:live <article-slug>
```

The check uses the approved canonical route in the article metadata and requires a successful, indexable response with the expected canonical URL, one H1, and valid `NewsArticle` structured data. It is expected to fail before the article is live.

## Current readiness note

The staging previews are not release records. The generated state manifest is not itself a database change; creating or changing publication state requires an authenticated editor action. No state rows were applied as part of this work.

## Verification status — 2026-11-02

The final local verification passed the smoke suite, root typecheck, ten-slot fake-clock scheduler tests, state-only publication manifest checks, release-manifest dry-run/idempotency checks, and the built-route link audit. The schedule remains 07:30 UTC / 13:00 IST on the dates above. Future or unpublished articles remain absent from public article routes.

The owner-confirmed commercial input remains `NO`; Reports and India Watch remain `noindex`. This verification did not publish or deploy content, write publication-state rows, change production schema, or alter analytics collection. Lighthouse results retain a documented performance gap on seven of ten retested route/device pairs; see [`lighthouse-final.md`](./lighthouse-final.md). This note records QA status and is not authorization to publish.
