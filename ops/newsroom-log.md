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
