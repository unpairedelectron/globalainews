# Lighthouse release matrix

## Method

Measured with the fixed profile in [`lighthouse-method.md`](./lighthouse-method.md): Lighthouse 13.6.0, Chromium 152, five navigations per route and device, and median results. The local column is the production build before B3 performance changes. Performance target is 95; Accessibility target is 95; Best Practices target is 70.

## Local production-like baseline

This matrix covers ten staging article routes and nine public routes. Scores are Lighthouse category scores; timings are milliseconds. Accessibility and Best Practices both scored 100 in all 38 route/device results. CLS was 0–0.007 across the matrix.

| Route | Mobile score / LCP / TBT | Desktop score / LCP / TBT |
| --- | ---: | ---: |
| `/staging/article/ai-agents-delegated-access-banks-passwords/` | 100 / 1,080 / 3 | 98 / 1,076 / 2 |
| `/staging/article/ai-in-workforce-plans-october-2026/` | 100 / 700 / 0 | 98 / 1,081 / 0 |
| `/staging/article/anthropic-s1-governance-who-controls/` | 100 / 722 / 11 | 97 / 1,232 / 0 |
| `/staging/article/eu-ai-act-december-2026-deadlines/` | 100 / 686 / 0 | 98 / 1,075 / 3 |
| `/staging/article/gated-frontier-models-gemini-4-carbon/` | 100 / 697 / 0 | 97 / 1,221 / 0 |
| `/staging/article/github-octoverse-2026-agents-pull-requests/` | 100 / 1,232 / 0 | 97 / 1,219 / 0 |
| `/staging/article/hyperscaler-capex-2026-reconciled/` | 100 / 693 / 0 | 97 / 1,214 / 0 |
| `/staging/article/india-ai-consultation-paper-what-is-law/` | 100 / 1,084 / 0 | 98 / 1,072 / 0 |
| `/staging/article/indiaai-10000-gpu-tender-explained/` | 100 / 689 / 0 | 97 / 1,228 / 1 |
| `/staging/article/openai-containment-incident-offline-training/` | 100 / 703 / 0 | 97 / 1,224 / 4 |
| `/` | 93 / 3,162 / 66 | 77 / 4,435 / 47 |
| `/brief/` | 88 / 3,988 / 49 | 78 / 4,066 / 50 |
| `/reports/` | 100 / 919 / 0 | 98 / 919 / 0 |
| `/topic/india/` | 100 / 922 / 2 | 80 / 3,438 / 18 |
| `/topic/ai/` | 91 / 3,510 / 21 | 80 / 3,554 / 47 |
| `/about-us/` | 100 / 923 / 0 | 98 / 925 / 0 |
| `/code-of-ethics/` | 100 / 925 / 74 | 98 / 928 / 52 |
| `/corrections/` | 99 / 929 / 88 | 98 / 924 / 26 |
| `/research/` | 92 / 3,285 / 96 | 98 / 926 / 45 |

The eight threshold failures are Home mobile/desktop, Brief mobile/desktop, India Watch desktop, AI topic mobile/desktop, and Research mobile. The mobile failures are LCP-led; TBT remains below 100 ms. The route-level LCP element, transferred JavaScript, bootup time, and long-task evidence will be collected with the extended runner before B3 remediation.

## Deployed baseline

The deployed five-run matrix covers the nine public routes on mobile and desktop. The ten local staging routes return 404 on the deployed site, so they are covered only by the local matrix above. Accessibility scored 100 except Research (96); Best Practices scored 77 throughout. The deployed snapshot has substantial route-specific performance and layout-shift failures; it is not the current local build and is recorded as a baseline only. No production code or data was changed.

| Route | Mobile score / LCP / TBT / CLS | Desktop score / LCP / TBT / CLS |
| --- | ---: | ---: |
| `/` | 79 / 2,754 / 856 / 0.001 | 71 / 4,682 / 184 / 0.004 |
| `/brief/` | 91 / 2,944 / 202 / 0.001 | 74 / 4,292 / 160 / 0.007 |
| `/reports/` | 100 / 1,036 / 53 / 0 | 96 / 1,035 / 75 / 0 |
| `/topic/india/` | 100 / 1,020 / 74 / 0.001 | 73 / 4,059 / 141 / 0.007 |
| `/topic/ai/` | 85 / 4,038 / 69 / 0.001 | 73 / 4,110 / 81 / 0.007 |
| `/about-us/` | 100 / 1,025 / 90 / 0 | 96 / 1,081 / 31 / 0 |
| `/code-of-ethics/` | 66 / 2,696 / 53 / 0.724 | 95 / 1,068 / 71 / 0 |
| `/corrections/` | 68 / 2,768 / 59 / 0.001 | 48 / 2,673 / 59 / 0.573 |
| `/research/` | 60 / 4,351 / 89 / 0.538 | 47 / 2,663 / 49 / 0.736 |

There were 12 threshold failures across the 18 deployed route/device results. Several low scores are driven by first-contentful-paint delay and large CLS on the deployed ethics, corrections, and research pages; those route behaviors do not match the current local production-like build. Do not use this older deployed snapshot to decide local remediation, and do not deploy to make the staging-only routes available.

## Local post-remediation retest

On 2026-11-02, the same five-run profile was repeated for the five routes targeted by B3: Home, Brief, India Watch, AI topic, and Research. The earlier full local matrix remains the coverage source for the other public and staging routes. Scores below are medians across five runs per device. Lighthouse navigation runs do not include real user interaction, so INP is unavailable; TBT is reported separately and is not an INP substitute.

| Route | Device | Performance / Accessibility / Best Practices | FCP / LCP / TBT / CLS | JS transfer / bootup / long tasks |
| --- | --- | ---: | ---: | ---: |
| `/` | Mobile | 92 / 100 / 100 | 947 / 2,805 / 101 / 0.001 | 203,394 B / 497 ms / 8 tasks, 895 ms |
| `/` | Desktop | 79 / 100 / 100 | 938 / 3,688 / 62 / 0.004 | 203,394 B / 437 ms / 6 tasks, 474 ms |
| `/brief/` | Mobile | 97 / 100 / 100 | 940 / 2,686 / 90 / 0.001 | 203,394 B / 476 ms / 3 tasks, 351 ms |
| `/brief/` | Desktop | 79 / 100 / 100 | 935 / 3,815 / 49 / 0.007 | 203,394 B / 445 ms / 5 tasks, 408 ms |
| `/topic/india/` | Mobile | 100 / 100 / 100 | 931 / 932 / 21 / 0.001 | 203,394 B / 430 ms / 5 tasks, 313 ms |
| `/topic/india/` | Desktop | 80 / 100 / 100 | 926 / 3,547 / 48 / 0.007 | 203,394 B / 328 ms / 4 tasks, 254 ms |
| `/topic/ai/` | Mobile | 91 / 100 / 100 | 926 / 3,463 / 9 / 0.001 | 203,394 B / 340 ms / 4 tasks, 269 ms |
| `/topic/ai/` | Desktop | 80 / 100 / 100 | 925 / 3,453 / 13 / 0.007 | 203,394 B / 275 ms / 2 tasks, 114 ms |
| `/research/` | Mobile | 94 / 100 / 100 | 926 / 2,963 / 79 / 0 | 185,090 B / 271 ms / 3 tasks, 216 ms |
| `/research/` | Desktop | 98 / 100 / 100 | 926 / 926 / 39 / 0 | 185,090 B / 251 ms / 2 tasks, 154 ms |

All ten route/device results meet Accessibility and Best Practices targets, and all have CLS below 0.1. Seven of ten Performance scores remain below 95; eight of ten LCP values exceed 2.5 seconds. INP cannot be determined from this navigation-only lab harness. The LCP element was a page heading on desktop Home, Brief, India Watch, and AI topic, and on AI topic for both devices plus mobile Research; the insight selector was not reported for some mobile runs. The relevant client pages use `createRoot`, not React SSR hydration. Recorded LCP render delays for the heading-led failures were about 514–552 ms, while TTFB was 7–15 ms on the desktop routes. The remaining delay is therefore client rendering/replacement rather than a slow server response.

The completed B3 cycle added responsive priority-image preloads and eager/fetch-priority hints for the lead images, plus build-generated preloads for the app and applicable lazy route chunks. The custom publication-flow fixture subsequently measured Home mobile LCP at 2,020, 1,376, and 1,268 ms, but that fixture is not a substitute for the five-run Lighthouse medians above. The cycle limit was not exceeded and score thresholds were not changed. Further changes to app startup were not made because the prerender and client shells differ and require markup-parity and interaction checks before a hydration or mount-strategy change.
