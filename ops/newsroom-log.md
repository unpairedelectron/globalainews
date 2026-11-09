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
- Alerts: none.

### Weekly review (Monday)
- No Search Console connector is available, so no query/CTR data was reviewed. Trending check via web search surfaced India items (MeitY DEPA for AI Training, IndiaAI EKA-1/Dhīr, Google's Vizag AI hub); 3 topics added to the backlog.
- Last 7 days: published 2 Nov (India AI rules), 3 Nov (GitHub Octoverse), 5 Nov (Gemini 4 Carbon), 7 Nov (Anthropic S-1 governance). Fixes: `package-lock.json` now uses the public npm registry (PR #9). Alerts: none.
- Coming week (already queued): 9 hyperscaler capex, 10 what is an AI agent, 11 OpenAI containment incident, 12 context window vs memory vs RAG, 13 IndiaAI GPU tender, 14 open weights vs open source, 15 EKA-1 and Dhīr. Next free slots: 19 Nov, then 21 Nov onwards.
