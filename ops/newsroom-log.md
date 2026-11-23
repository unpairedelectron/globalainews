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

## 2026-11-15 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info. `contentSync` "up to date" at `1a0c900` (= `origin/main`). 14 Nov article live.
- Article: **DEPA for AI Training Explained: India’s Plan to Let AI Learn From Hospital and Bank Data Without Handing It Over** (`depa-ai-training-explained`), scheduled 2026-11-24T07:30:00Z, India category, 3 primary sources (PIB release 31 Oct 2026, the full MeitY handbook PDF, the DPDP Act 2023 text). Volume: 18–24 Nov holds 7 articles.
- Maintenance (thin-article upgrade 4 of 5): `study-finds-word-cues-can-override-game-theory-choices-in-llms` now cites preprint v4 (17 Oct 2026; abstract unchanged from v3), adds authors, game-theory background, Akata et al. on repeated games, logit-lens and activation-steering context, the multi-agent contagion finding, FAQ and internal link; `updated: 2026-11-15` and an `## Update` note. Done. Backlog: DEPA topic marked `[x]`.
- Social copy: `ops/social/depa-ai-training-explained.md`.
- Alerts: none.

## 2026-11-16 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info. `contentSync` "up to date" at `2e051ad` (= `origin/main`). 15 Nov article live.
- Article: **What Is a Token in AI, and Why Do Indian Languages Cost More to Process?** (`what-is-a-token-indian-languages-cost-more`), scheduled 2026-11-25T07:30:00Z, 5 sources (3 primary: Hugging Face tokenizer docs, Petrov et al. arXiv:2305.15425, Mistral model card; plus ZenteiQ and Soket pages). Volume: 19–25 Nov holds 7 articles.
- Maintenance (backlog upkeep): marked the token topic `[x]`; added 3 new well-sourced topics.
- **Thin-article upgrade 5 of 5 not done.** The rewrite of `ai-models-antibiotic-discovery` was stopped mid-write by a safety classifier; the file was restored to its published state (`git checkout`), verified intact, and left unchanged. Do not retry this rewrite. The other 4 upgrades are complete. If this article still needs work, the owner should decide what to do with it.
- Alerts: none.

### Weekly review (Monday)
- No Search Console connector, so no query/CTR data. The search tool available here does not apply `site:` filters, so indexing status is **inconclusive** again this week, not evidence of non-indexing. Owner can check Search Console directly.
- Re-checked the `ainews-olive.vercel.app` look-alike: still HTTP 402, deployment disabled. No action.
- Last 7 days: published 10–16 Nov (capex, AI agent, OpenAI containment, context window, IndiaAI tender, open weights, EKA-1/Dhīr). Scheduled: 19 Nov MCP, 21 Nov AlphaProof Code, 22 Nov Australia regulator, 23 Nov prompt injection, 24 Nov DEPA, 25 Nov tokens. Upgrades: Mistral Small 4, OSWorld, C2PA, word-cues. Alerts: #14 (resolved).
- Hosting: owner is considering moving off Replit. Cloudflare Pages recommended over Vercel (Vercel's free Hobby plan excludes commercial use); no database needed since the site is static. Awaiting the owner's go-ahead before any migration work.
- Coming week: next free slot 26 Nov; weekly mix needs an India piece and a news explainer.

## 2026-11-17 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info. `contentSync` "up to date" at `313d2de` (= `origin/main`). 16 Nov article live.
- Article: **How to Read an AI Model Card: The Eight Things Worth Checking Before You Use a Model** (`how-to-read-an-ai-model-card`), scheduled 2026-11-26T07:30:00Z, 5 primary sources (Mitchell et al. arXiv:1810.03993, Hugging Face model-card docs ×2, Mistral and ZenteiQ cards as worked examples). Volume: 20–26 Nov holds 7 articles.
- Topic choice: no fresh news story had reachable primary sources today (the OpenAI research page is 403 from this environment; the Qwen4-Max and Tencent items were aggregator-only; no MeitY/PIB release this week), so per Step 2 the run took the top evergreen topic instead. Backlog topic marked `[x]`.
- Maintenance (refresh a guide >30 days): `hosted-vs-open-weight-models` (2026-10-06). All three vendor sources re-checked and live. Gemma 4 row now lists the published architectures (2B/4B small, 31B dense, 12B unified, 26B MoE) and context windows (128K/256K); Gemini row adds the March 2026 knowledge cutoff; Mistral row adds per-token pricing. No previously stated fact changed. `updated: 2026-11-17`, review date bumped, `## Update` note added.
- Social copy: `ops/social/how-to-read-an-ai-model-card.md`.
- Still open for the owner: (1) `ai-models-antibiotic-discovery` remains the one un-upgraded thin article — the 16 Nov rewrite attempt was halted by a safety classifier and will not be retried; (2) the Cloudflare migration proposal awaits a go-ahead.
- Alerts: none.

## 2026-11-18 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info. `contentSync` "up to date" at `139ee20` (= `origin/main`). 17 Nov article live. Noted: the lint's primary-domain gap flagged on 13 Nov was fixed on `main` (`42b17e1` added gov.au, gc.ca, canada.ca).
- Article: **Microsoft Built Its New Production Model on Google's Gemma, and Will License Its Own Weights. Why That Matters** (`microsoft-mai-licensed-weights-gemma-base`), scheduled 2026-11-27T07:30:00Z, business category, 4 primary sources (Microsoft Ignite keynote blog, Microsoft Book of News, Gemma 4 overview, Gemma Terms of Use). Volume: 21–27 Nov holds 7 articles.
- Topic selection: the US remote-compute export-control rule was rejected because it is still only scheduled for Federal Register publication (19 Nov), so no final text exists to verify; Federal Register also directs automated clients to its API, which returned no matching published document. NVIDIA Nemotron for Science was a viable alternative but rests almost entirely on vendor-reported figures.
- Maintenance (link health, articles 7–9 by age): 27 source links checked across `weekly-deep-dive-cost-of-intelligence`, `india-ai-compute-access-2026` and `coding-agent-benchmarks-compared`. One real defect found and fixed: the IndiaAI Compute Portal link used the `www.` hostname, which fails TLS certificate validation for any client; repointed to `https://compute.indiaai.gov.in/` (verified 200). `updated: 2026-11-18` and an `## Update` note added. The 403s (IEA, IEEFA, CBRE) are bot blocking and the one earlier 000 (empanelled-gpus.pdf) returned 200 on retry — both inconclusive per the runbook, left unchanged.
- Social copy: `ops/social/microsoft-mai-licensed-weights-gemma-base.md`.
- Still open for the owner: `ai-models-antibiotic-discovery` (un-upgraded thin article; rewrite halted 16 Nov, not retried) and the Cloudflare migration proposal.
- Alerts: none.

## 2026-11-19 newsroom run
- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info. `contentSync` "up to date" at `bc8ead5` (= `origin/main`). 18 Nov article live; today's MCP article still 404 at run time, correct because its 07:30 UTC slot had not passed.
- Article: **NVIDIA's Nemotron for Science Explained: Open Models Aimed at Chemistry Labs, and What the Results Actually Show** (`nvidia-nemotron-for-science-explained`), scheduled 2026-11-28T07:30:00Z, research category, 3 primary sources (NVIDIA press release, Hugging Face model card, Hugging Face dataset). All four reported accuracy figures are attributed to the organisations that produced them; only KTH's 81% had independent verification (by GROMACS), and the article says so.
- Topic selection: the US remote-compute export-control rule is still not verifiable — today's Federal Register issue had not published at run time (around 13:45 UTC), and the API returned no matching document. Added to the backlog as blocked.
- Maintenance (backlog upkeep): marked the AI-watermarking topic `[x]` (covered by the expanded C2PA article); added 3 new topics, one of them flagged blocked pending publication.
- Social copy: `ops/social/nvidia-nemotron-for-science-explained.md`.
- Still open for the owner: `ai-models-antibiotic-discovery` (thin, rewrite halted 16 Nov, not retried) and the Cloudflare migration proposal.
- Alerts: none.

## 2026-11-20 newsroom run

- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info (the `/healthz` 404, expected on Replit). `build-info.json` `contentSync.sha` = `e7455e5` = `origin/main`, result "up to date". Nothing to self-heal.
- Article (scheduled 2026-11-29): *US Export Controls Now Follow the Customer, Not the Country: What That Means for Indian Compute* (`us-remote-compute-export-controls-india`, policy, 2,380 words, 6 sources, 5 of them official texts). Unblocks the backlog topic that was waiting on publication.
- Wire brief (live today, 04:45 UTC): *US Export Rule Now Covers Remote Access to AI Chips, and It Took Effect Immediately* (`bis-remote-access-rule-published`, 588 words, 4 sources). First brief on the site. Written because the rule published 19 Nov and took effect the same day, and the first free article slot was 29 Nov — ten days is too long for a rule with a 90-day compliance clock.
- Volume: 23–29 Nov holds 7 articles by publish date, at the limit and not over. The brief is counted against `maxBriefsPerDay` (1 of 3 used), not against the weekly article limit, on the reading that Step 3b gives briefs their own cap and is explicitly "optional, after the main article". Flagged in the pull request so the owner can overrule.
- Sourcing: the rule's full official text was read from govinfo (91 FR 74970, 22,043 words), not from secondary coverage. India's Country Group status was parsed directly from the eCFR table for Supplement No. 1 to Part 740 — India is in A:5 and absent from Country Group D, which is what makes the "India is not named" claim safe to publish.
- Maintenance (tooling correction): `site/scripts/lint-articles.mjs` had no official US federal publisher on its `PRIMARY` allowlist, so `federalregister.gov`, `govinfo.gov`, `ecfr.gov` and `bis.gov` counted as non-primary. Added those four plus `congress.gov` and `uspto.gov`. **This is a code change and does not reach production until a Replit publish**, so both of today's pieces were written to pass the *deployed* (old) allowlist as well — verified by running the git-HEAD copy of the lint against them. A warning about this local/production divergence was added to `ops/NEWSROOM.md` above Step 3b so future runs don't ship an article that passes locally and fails the live gate.
- Backlog: export-controls topic marked `[x]` with both slugs; 3 new topics added.
- Not done: the link-health rotation (articles 10–12 by age) was skipped in favour of the lint correction above, which was the higher-value maintenance item today.
- Noted, not acted on: `compute.indiaai.gov.in` serves a "Technical / Staging Environment" banner, though its own "Visit Live Website" button points back to itself. The link we use is the correct official hostname and returns 200, so it was left unchanged, but its figures were not cited.
- Gates: `npm ci`, `npm run build` (editorial lint, astro build, SEO checks) and `npm run test:schedule` all passed, including the 2026-11-20T04:46 and 2026-11-29T07:31 build points.

## 2026-11-21 newsroom run

- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info (the `/healthz` 404, expected on Replit). `build-info.json` `contentSync.sha` = `cba7fcc` = `origin/main`, result "up to date". Yesterday's run is confirmed deployed: the site's first wire brief is live at `/wire/bis-remote-access-rule-published/` (200), and `/wire/` returns 200.
- Article (scheduled 2026-11-30): *OpenAI Says GPT-6.2 Astra Is the First Released Model to Cross Its 'High' Self-Improvement Bar* (`openai-high-self-improvement-threshold`, safety, 2,201 words, 4 sources, all OpenAI's own). Volume: 24–30 Nov holds 7 articles by publish date, at the limit and not over.
- Topic choice: a web search for 19–20 Nov news returned only aggregators, none with a primary source. One of them claimed OpenAI's 18 Nov release was its first model to reach a self-improvement threshold, so I went to OpenAI's own post and found the claim is accurate and considerably more significant than the "faster and cheaper" framing the aggregators led with. The piece is built entirely on OpenAI's launch post, its Preparedness Framework (both the summary post and the v2 PDF) and its frontier-risk post. Because every source is the company's own, the article treats each capability designation as OpenAI's assessment rather than established fact, and says so in the text and the methodology note.
- Sourcing note: the framework provides for third-party capability evaluation and safeguard stress-testing, but conditions each on OpenAI deeming a deployment to warrant it, and the Safety Advisory Group "may opt to" seek independent expert opinions. That conditionality is the accurate answer to "who checks this", and is better than the flat "no external verification" I first assumed.
- The GPT-6.2 system card is referenced in OpenAI's post but not cited, because the post's PDF links are opaque UUIDs and I could not resolve a stable URL for it. Recorded rather than guessed.
- Maintenance (link health, articles 9/10/12 by age): 9 source links checked across `indiaai-vs-commercial-cloud`, `provenance-controls-compared` and `ai-assistants-compared`. Article 11 (`hosted-vs-open-weight-models`) was skipped because its links were re-verified during the 17 Nov guide refresh. **One real defect found and fixed:** `indiaai-vs-commercial-cloud` linked the IndiaAI Compute Portal on the `www.compute.indiaai.gov.in` hostname, which fails TLS certificate validation for any client (curl 000, "failed to verify the legitimacy of the server"); the non-www host returns 200. Repointed to `https://compute.indiaai.gov.in/`, `updated: 2026-11-21`, `## Update` note added. This is the same defect fixed in a different article on 18 Nov.
- Swept the whole repo for the same defect. Also fixed 9 occurrences in `research/india-ai-compute-2026.md` (internal evidence notes, not a published route) so a future run doesn't copy the broken URL into a published article. Deliberately left the occurrences in `research/sources/` and `research/sources.json` unchanged: those are archived captures of the page as fetched, and rewriting them would falsify the record. Confirmed `www.meity.gov.in` and `www.pib.gov.in` are fine (200) — only that one host is affected.
- **Alert opened: the Replit workspace cannot be synced or published from here.** The runbook's Step 6.6 sync was attempted twice via `update_app_using_prompt`; the Replit agent reported both times that `site/scripts/replit-sync.sh` did not run, and that the workspace is on commit `4968137eaef83f68de4196c42497d725b2b51d35` — a commit that does not exist in the GitHub repository at all, so the workspace's git state has diverged from `main`. I did not attempt to repair that state: it is production, and fixing it means git surgery the owner should see. The consequence is that yesterday's lint allowlist change is still not deployed.
- Impact checked, not assumed: today's article cites only `openai.com` and `cdn.openai.com`, and `openai.com` has been in the lint's `PRIMARY` list since the commit that created the lint, so the article passes whatever lint version is deployed. Yesterday's two pieces were empirically accepted by the live gate (content sync published `cba7fcc` and the brief is live). The `ops/NEWSROOM.md` divergence warning added yesterday stays accurate and now matters more, since the deployed code is older than I had assumed when I wrote it.
- Gates: `npm ci`, `npm run build` (editorial lint, astro build, SEO checks) and `npm run test:schedule` all passed, including the 2026-11-30T07:31 build point.

## 2026-11-22 newsroom run

- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info (the `/healthz` 404, expected on Replit). `build-info.json` `contentSync.sha` = `9c9459d` = `origin/main`, result "up to date". Yesterday's merge is confirmed deployed and the IndiaAI link fix is serving the corrected non-www host.
- Runbook: byte-identical to the version read in full yesterday (last modified in `cba7fcc`, confirmed by `git diff`). No change to follow.
- Article (scheduled 2026-12-01): *Fine-Tuning vs RAG vs Prompting: How to Choose, and Why OpenAI Is Closing Its Fine-Tuning Door* (`fine-tuning-vs-rag-vs-prompting`, models, 2,326 words, 6 sources). Volume: 25 Nov–1 Dec holds 7 articles by publish date, at the limit and not over.
- Topic choice: searches for 19–22 Nov India/AI policy news returned only secondary coverage, with no primary source and nothing dated this week, so no news explainer was publishable under rule 1. The recent queue is also news-heavy, so I took the top open evergreen in `ops/topics.md` ("fine-tuning vs RAG vs prompting"), which has steady search demand.
- What turned it from an evergreen into a story: while reading OpenAI's own documentation for the comparison, I found **"OpenAI is winding down the fine-tuning platform. The platform is no longer accessible to new users."** Corroborated against the deprecations page, which carries a dated timeline (7 May 2026, 2 July 2026, and job creation ending 6 Jan 2027), and against the supervised-fine-tuning guide, which gives the base-model shutdowns (`gpt-4.1-nano` on 23 Oct 2026, already past; `gpt-4.1` and `gpt-4.1-mini` with their fine-tuned versions on 14 Jan 2027). Also noted: the hosted evals dashboard, API and graders go read-only on 30 Nov 2026, and `/v1/prompts` is deprecated the same day. All quoted from OpenAI's own pages, not from reporting.
- Deliberately not claimed: anything about other vendors' current fine-tuning offerings. Google's Gemini tuning doc URLs both returned 404, so rather than guess I stated in the article and the methodology note that we make no claim about other vendors. The LoRA parameter and memory multiples are attributed to that paper's own experiments, not presented as independently replicated.
- Maintenance (corrections check): today's finding prompted a sweep for live articles whose fine-tuning claims might now be stale. Six articles mention fine-tuning (`how-to-read-an-ai-model-card`, `indiaai-10000-gpu-tender-explained`, `indiaai-eka-1-dhir-models-explained`, `open-weights-vs-open-source-ai`, `small-models-serious-workflows`, plus today's). Every mention concerns fine-tuning open-weight models under permissive licences, or the IndiaAI tender's workload scope. None asserts that OpenAI's hosted fine-tuning is available. **No correction needed** — checked, not assumed.
- Maintenance (backlog upkeep, substantive item): marked the fine-tuning/RAG topic `[x]` with its slug; added 3 new well-sourced topics drawn from today's primary reading (RAG retrieval evaluation, evaluating without a vendor dashboard after the 30 Nov evals change, and LoRA rank/alpha settings).
- Thin-article rotation remains blocked at 4 of 5: `ai-models-antibiotic-discovery` is the only one left, its rewrite was halted by a safety classifier on 16 Nov, and I committed not to retry it. Still with the owner.
- Alert #39 (Replit workspace diverged from `main`, code changes cannot deploy) remains open from yesterday, opened 2026-11-21 ~14:46 UTC. Not yet 24 hours old at the time of this run, so no repeat notification was sent. Today's article is content-only and needs no publish; it cites only `openai.com`, `arxiv.org` and `huggingface.co`, all long-standing entries in the deployed lint's allowlist, verified by running the git-HEAD copy of the lint against it.
- Gates: `npm ci`, `npm run build` (editorial lint, astro build, SEO checks) and `npm run test:schedule` all passed, including the 2026-12-01T07:31 build point. Deployed-allowlist simulation passed.

## 2026-11-23 newsroom run

- Health: `verify-deploy.sh` 98 passed, 0 failed, 1 info (the `/healthz` 404, expected on Replit). `build-info.json` `contentSync.sha` = `0a3723e` = `origin/main`, result "up to date". Runbook byte-identical to yesterday's (confirmed by `git diff`); working tree clean.
- Not a fault: `what-is-prompt-injection` (dated 2026-11-23T07:30Z) returned 404 at run time because its publish time had not yet passed. Checked rather than assumed.
- Article (scheduled 2026-12-02): *What Is a Looped Transformer? Inkling 2 Mini Reuses 24 Layers to Act Like 48* (`what-is-a-looped-transformer-inkling-2-mini`, models, 1,851 words, 4 sources). Volume: 26 Nov–2 Dec holds 7 articles by publish date, at the limit and not over.
- Topic choice and verification: a web search surfaced an aggregator claim that Thinking Machines had released a 26.4B open-weights model. Rather than take that, I verified against Hugging Face's API and the model card itself. The card gives the release date as 20 November 2026 (the HF repo was created 17 November, so the aggregator's "released 20 Nov" matches the card, not the repo creation). The HF API reports `safetensors.total` = 26,388,646,440 parameters, which confirms the 26.4B figure independently of the card's prose, and `license: apache-2.0`.
- The story is the architecture, not the release: 24 layers of which the middle 12 run three times with shared weights, giving "48 layer applications per token from 24 layers of weights". Hugging Face's own engineering post describes the same mechanism, so two independent primary sources cover it. The piece explains why this model reports three different honest parameter counts (26.4B total, 3.4B active, ~5.4B effective active).
- Noted a discrepancy rather than smoothing it over: Hugging Face's blog rounds active parameters to "3B" where the model card says 3.4B. The article follows the card and says why.
- One observation drawn from data rather than the announcement: HF's own repository figures on 23 Nov show the official checkpoint at 23,543 downloads against 805,993 for `unsloth/Inkling-2-Mini-GGUF` and 209,096 for `ggml-org/Inkling-2-Mini-GGUF` — roughly 34x for a single community build. Stated with the caveat that these count repository downloads, not distinct users, and that a GGUF repo holds several variants.
- Declined to assert a causal link between the looped architecture and the card's disclosure that the model "sometimes became stuck in long reasoning loops". The card gives no such link; the article says so explicitly and keeps the practical advice.
- **Weekly growth review (Monday).** Search Console connectors checked via the MCP registry: neither Windsor.ai nor Supermetrics is installed or enabled, so step 1 is unavailable and the runbook's fallback applies. The web check returned no genuine trend data — the results were SEO guides rather than measurements — but the consistent demand signal around our topics is practical "run it yourself" questions: local models, RAM limits, quantisation naming. Recorded that honestly in `ops/topics.md` rather than presenting guides as trend data. No article needed refreshing on that signal: the two matching live pieces, `small-models-serious-workflows` and `hosted-vs-open-weight-models`, were refreshed on 12 and 17 Nov respectively. Added 3 demand-led topics.
- **Week in review (17–23 Nov).** Seven articles scheduled: Microsoft/Gemma licensed weights (27 Nov), Nemotron for Science (28 Nov), US remote-compute export controls (29 Nov), OpenAI's High self-improvement threshold (30 Nov), fine-tuning vs RAG vs prompting (1 Dec), today's looped transformer (2 Dec), plus the site's first wire brief on the BIS rule (live 20 Nov). Fixes: the `www.compute.indiaai.gov.in` TLS defect in two places plus 9 occurrences in research notes; the lint `PRIMARY` allowlist gained the official US federal publishers. Alerts: one, #39, still open. Next week's planned mix leans evergreen and India: the three local-model topics added today, plus the IndiaAI application walkthrough once the portal stops serving a staging banner.
- Alert #39 (Replit workspace on commit `4968137`, which is not in this repository; no code change can deploy) remains open, now ~37 hours old. Today's work is content-only and unaffected. Per the Alerts section a repeat notification is due past 24 hours; sent.
- Gates: `npm ci`, `npm run build` (editorial lint, astro build, SEO checks) and `npm run test:schedule` all passed, including the 2026-12-02T07:31 build point. Deployed-allowlist simulation passed (all four sources are `huggingface.co` or `apache.org`, both long-standing allowlist entries).
