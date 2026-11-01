# November 2026 article release runbook

## Release window

The ten articles are intended to publish at 07:30 UTC (13:00 Asia/Kolkata). Use the editor release queue and preserve its audit history; do not write release rows directly to the database.

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
3. Verify the editor queue shows the intended UTC release time and the saved change appears in release history.
4. Keep the public canonical article URL unchanged; staging URLs are for QA only.

## Move a release earlier or pause it

- **Early release:** an authorized editor reschedules the release to the approved earlier UTC time. Recheck the content gate first, then run the live verification command after publication.
- **Temporary pause:** reschedule the release to a later, explicitly approved UTC time. Do not use Cancel for a temporary hold; canceled rows are not restored through the current editor controls.
- **Permanent cancellation:** use the editor's Cancel action only after the owner approves it. The API records cancellation in release history; do not delete rows directly.

## Rollback and corrections

- **Before publication:** reschedule or cancel as above, then confirm the queue and history show the change.
- **After publication:** preserve the canonical URL. For a factual correction, edit the release through the editor so the correction is audited and the article's modification date updates. Do not silently replace a file or remove citations.
- **Urgent legal or safety issue:** the owner decides whether to cancel/unpublish. Record the reason and action in release history, then verify the article, sitemap, and feeds no longer present it as live. If the editor controls cannot restore a canceled item, create a separately reviewed replacement rather than editing the database.
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

The staging previews are not release records. Creating or changing queue entries requires an authenticated editor session. Do not treat this runbook or a passing staging check as proof that a release is scheduled.
