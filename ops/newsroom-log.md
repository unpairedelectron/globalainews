# Newsroom log

The daily newsroom run appends one entry per day: health result, what was published or scheduled, what was skipped and why, and any alerts.

## 2026-11-08 (setup)
- Pipeline live: GitHub `main` → Replit sync script → publish → live verification (97/97).
- Scheduled queue: 9, 10, 11, 12, 13, 14, 16, 17, 18, 20 Nov.
- Newsroom enabled in `auto` mode, max 1 new article a day.

## 2026-11-08 newsroom run
- Health: `verify-deploy.sh` 97 passed, 0 failed, 2 info (`/healthz` 404 is expected). `build-info.json` `contentSync.sha` matched `origin/main` (`ef516fb`), result "up to date".
- Article: none. Next free slot is 15 Nov 07:30 UTC, but 9–14 Nov already holds 6 articles, so a 15 Nov article would exceed `maxNewArticlesPerWeek` (6) in that rolling window (counted by publish date). Queue runs to 20 Nov, above `minQueueDays`.
- Maintenance (link health): all 6 source links in the 3 oldest articles (`small-models-serious-workflows`, `quiet-race-watermark-everything-ai-makes`, `ai-models-antibiotic-discovery`) return 200. Nothing to fix.
- Fix: `npm ci` failed in the cloud session because `site/package-lock.json` resolved 216 packages from Replit's internal mirror. PR #9 points them at `registry.npmjs.org` (versions and integrity hashes unchanged); gates passed (`npm ci`, `npm run build`, `npm run test:schedule`); owner merged it. Replit sync and publish run afterwards because it touches `site/`.
- Environment: network access changed to unrestricted (owner approved) so sources and links can be fetched.
- Alerts: none.

## 2026-11-09 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info (`/healthz` 404 is expected). `build-info.json` `contentSync.sha` matched `origin/main` (`14a0040`), result "up to date". Today's 9 Nov article is not yet past its 07:30 UTC publish time.
- Article: **EKA-1 and Dhīr Explained: What India’s New IndiaAI Models Can Do, and Which You Can Download** (`indiaai-eka-1-dhir-models-explained`), scheduled 2026-11-15T07:30:00Z, India category, 6 sources (5 primary: PIB ×2, ZenteiQ, Soket, Soket Hugging Face; plus the Apache 2.0 licence text). Volume check: 9–15 Nov now holds 7 articles, at the limit of 7.
- Note: AIKosh (aikosh.indiaai.gov.in) timed out from this environment, so EKA-1's AIKosh listing could not be checked; the article says so.
- Maintenance (backlog upkeep): annotated the "Indian LLMs compared" topic; added 3 new topics to `ops/topics.md`.
- Social copy: `ops/social/indiaai-eka-1-dhir-models-explained.md`.
- Alerts: none at merge time. After the merge, the live content sync failed (`EXDEV` renaming the articles folder). Fixed in PR #13 and synced to Replit (`9b395c2`), but the Replit publish was blocked by a session permission check, so issue #14 asks the owner to publish. Until then the 15 Nov article can't reach the server; already-deployed scheduled articles are unaffected.

### Weekly review (Monday)
- No Search Console connector is available, so no query/CTR data was reviewed. Trending check via web search surfaced India items (MeitY DEPA for AI Training, IndiaAI EKA-1/Dhīr, Google's Vizag AI hub); 3 topics added to the backlog.
- Last 7 days: published 2 Nov (India AI rules), 3 Nov (GitHub Octoverse), 5 Nov (Gemini 4 Carbon), 7 Nov (Anthropic S-1 governance). Fixes: `package-lock.json` now uses the public npm registry (PR #9). Alerts: none.
- Coming week (already queued): 9 hyperscaler capex, 10 what is an AI agent, 11 OpenAI containment incident, 12 context window vs memory vs RAG, 13 IndiaAI GPU tender, 14 open weights vs open source, 15 EKA-1 and Dhīr. Next free slots: 19 Nov, then 21 Nov onwards.

## 2026-11-10 (interrupted run, recorded 2026-11-11)
- Health: `verify-deploy.sh` 97 passed, 0 failed, 2 info. `hyperscaler-capex-2026-reconciled` (due 9 Nov) still 404: scheduled rebuilds were failing on Replit with the same EXDEV-class rename error as the content sync.
- Fix: PR #16 (merged) makes scheduled publishing switch to a fresh build folder instead of renaming `dist`; tested locally with `dist` on its own filesystem (old code failed, new code went live). Needs the Replit publish already requested in #14.
- Article: the Australian AI-regulator story was dropped because its primary source (minister.industry.gov.au) was unreachable from this environment. The MCP explainer was drafted but the run was interrupted before shipping; it ships in the 2026-11-11 run.
- Maintenance (link health, articles 4–6 by age): 4 of 5 source links return 200; `iea.org/reports/energy-and-ai/executive-summary` returns 403 (bot blocking, inconclusive, left unchanged).

## 2026-11-11 newsroom run
- Health: `verify-deploy.sh` 97 passed, 0 failed, 2 info. Live server still on old code: content sync reports EXDEV and `hyperscaler-capex-2026-reconciled` (due 9 Nov) and `what-is-an-ai-agent` (due 10 Nov) return 404. Fixes #13 and #16 are merged and await the Replit publish requested in issue #14.
- Article: **What Is MCP (Model Context Protocol)? A Plain-English Guide for 2026** (`what-is-mcp-model-context-protocol`), scheduled 2026-11-19T07:30:00Z, 8 primary sources (Anthropic launch post; MCP spec, docs, changelog and security guide), all re-fetched and checked on 11 Nov. Volume: every 7-day window up to 19 Nov holds at most 7 articles.
- Maintenance: none beyond the 10 Nov link check above.
- Social copy: `ops/social/what-is-mcp-model-context-protocol.md`.
- Alerts: issue #14 updated with the scheduled-publishing fix.

## 2026-11-11 owner update (recorded by the setup session)
- Done by the owner: Google Search Console sitemaps submitted and indexing requested; Bing Webmaster Tools set up (imported from Search Console).
- Confirmed: the 10 articles carrying "Reviewed by Aman Mishra" were reviewed by him; keep the byline.
- Done by the owner (later on 11 Nov): AdSense European consent message turned on.
- Still open for the owner: posting the copy in `ops/social/`; optionally connecting Windsor.ai or Supermetrics for Search Console data.
- Checked: ainews-olive.vercel.app (shows a "Global AI News" logo) is not the owner's; its Vercel deployment is disabled (HTTP 402). No action needed; if it reappears copying our articles, report it to Vercel.
- For the Monday review: as of 11 Nov, a `site:globalainews.in` web search returned no pages from the domain. Re-check each week and log when pages start appearing.

## 2026-11-12 newsroom run
- Health: owner published on Replit; both fixes (#13, #16) are live. `build-info.json` `buildTime` 2026-11-12T03:17Z, `contentSync` "up to date" at `8762ac5` (= `origin/main`). The 9, 10 and 11 Nov articles now return 200. Alert #14 resolved.
- Article: **AlphaProof Code Explained: How Google DeepMind’s AI Proved Signal’s Encryption Code Secure, and What It Didn’t Prove** (`alphaproof-code-signal-formal-verification-explained`), scheduled 2026-11-21T07:30:00Z, 3 primary sources (DeepMind post, DeepMind technical paper, Signal blog). DeepMind’s page summary says “three million” lines while the post body and paper say about 6.5 million; the article uses the paper and notes the difference.
- Maintenance (thin-article upgrade 1 of 5): `small-models-serious-workflows` rewritten from 4 primary sources (Mistral model card, launch post, Hugging Face card and file listings); added hardware minimums, weight sizes, features, FAQ and internal links; `updated: 2026-11-12` and an `## Update` note. Done.
- Social copy: `ops/social/alphaproof-code-signal-formal-verification-explained.md`.
- Alerts: none new.

## 2026-11-13 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info. `contentSync` "up to date" at `2f07027` (= `origin/main`). Today's 13 Nov article not yet past 07:30 UTC.
- Article: **Australia’s New Frontier AI Regulator Explained: What AI Companies Will Have to Do After the OpenAI Medicare Incident** (`australia-frontier-ai-regulator-explained`), scheduled 2026-11-22T07:30:00Z, 5 primary sources (2 Australian PM releases, 2 OpenAI alignment reports, the Paris call declaration on pm.gc.ca). OpenAI’s own Australia statement returned 403, so details reported only by news outlets were left out. Note: the editorial lint’s primary-domain list does not include `gov.au` or `gc.ca`; worth adding with the next code release (not changed today, because the live server runs the lint during content sync).
- Maintenance (thin-article upgrade 2 of 5): `reliability-is-the-new-ai-moat` rewritten from 4 primary sources (full AI Index 2026 report, OSWorld paper, τ-bench paper, Anthropic Opus 4.5 post); added which model scored 66.3%, the 2024 baseline, human time, pass^k reliability, a testing checklist, FAQ and internal links; `updated: 2026-11-13` and an `## Update` note. Done.
- Other: a peer session relayed a request to expand three archive articles in one batch; not acted on without the owner’s direct instruction. Those articles are in the thin-upgrade rotation (3 remaining).
- Social copy: `ops/social/australia-frontier-ai-regulator-explained.md`.
- Alerts: none.

## 2026-11-14 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info. `contentSync` "up to date" at `5fc7cb2` (= `origin/main`). 13 Nov article live.
- Article: **What Is Prompt Injection? Why AI Assistants Can Be Hijacked, and How to Limit the Damage** (`what-is-prompt-injection`), scheduled 2026-11-23T07:30:00Z, 4 primary sources (OWASP LLM01:2025, UK NCSC, Greshake et al. arXiv paper, MCP specification). Volume: 17–23 Nov holds 7 articles.
- Maintenance (thin-article upgrade 3 of 5): `quiet-race-watermark-everything-ai-makes` (C2PA) rewritten from 6 primary sources (EU Code of Practice page, C2PA spec and deployment guidance, UMBC security paper full text, Google SynthID, India IT Rules as updated 10 Feb 2026); added watermark/fingerprint comparison, EU and India obligations, specific security findings, FAQ and internal links; `updated: 2026-11-14` and an `## Update` note. Done. Backlog: marked the MCP and prompt-injection topics `[x]`.
- Social copy: `ops/social/what-is-prompt-injection.md`.
- Alerts: none.
