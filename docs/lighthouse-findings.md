# Lighthouse findings for the strict release pass

## Current recorded run

The most recent checked-in 28-run summary is `docs/lighthouse-release.md` (1 November 2026). The homepage scored 82 on mobile with LCP 3,439 ms and TBT 390 ms. Public Best Practices scored 77; the report attributes the failures to Clarity-related third-party-cookie and DevTools Issues-panel findings. Lighthouse identified image delivery, unused JavaScript, main-thread work, and render-blocking requests as performance areas. The summary did not retain per-audit JSON for those 28 runs.

## Exact audit IDs recovered from available raw home captures

These IDs and causes are present in the raw home Lighthouse exports available during this pass. Their numerical values differ from the checked-in 28-run summary, so the figures below are historical capture values, not current scores or savings estimates.

| Lighthouse audit ID | Lighthouse title | Observed result | Cause / disposition |
| --- | --- | --- | --- |
| `third-party-cookies` | Uses third-party cookies | 8 cookies in the raw home captures; score 0 | Microsoft Clarity's third-party requests. Clarity is now deferred until interaction or four seconds; collection and public-route eligibility are preserved. Recheck the audit in the next raw run. |
| `inspector-issues` | Issues were logged in the Issues panel in Chrome DevTools | Score 0 | Lighthouse surfaced browser Issues associated with third-party analytics requests. Inspect the live Issues detail before attributing every issue to the vendor. |
| `mainthread-work-breakdown` | Minimize main-thread work | 5.7–6.2 s | The shared client bundle and route startup work occupy the main thread. Reduce unnecessary route code and client work without removing features. |
| `bootup-time` | Reduce JavaScript execution time | 2.0 s in one raw capture | JavaScript parse/compile/execute cost; likely reducible through smaller/deferred route chunks. |
| `unused-javascript` | Reduce unused JavaScript | 42–69 KiB estimated savings across captures | Shared entry code is shipped to routes that do not use it. Audit route-level imports and split only where behavior remains intact. |
| `image-delivery-insight` | Improve image delivery | 116–132 KiB estimated savings across captures | Homepage artwork and responsive variants still have transfer-size opportunity. Preserve visual fidelity and correct `srcset` selection. |
| `render-blocking-insight` | Render-blocking requests | Failed insight in the raw home capture | Critical-path requests delay first paint; inspect resource timing before changing font or stylesheet loading. |
| `cache-insight` | Use efficient cache lifetimes | 65–73 KiB estimated savings across captures | Some static resources have shorter cache lifetimes than Lighthouse recommends; confirm current response headers before changing them. |
| `largest-contentful-paint` | Largest Contentful Paint | 2.5–2.7 s in raw captures; 3,439 ms in the checked-in run | The large homepage lead image and client-side startup are the likely candidates; pair the next LCP element with resource timing before changing the lead. |
| `total-blocking-time` | Total Blocking Time | 1,260–1,370 ms in raw captures; 390 ms in the checked-in run | Long JavaScript tasks; defer third-party analytics and reduce startup work, then remeasure. |

## Limits and next verification

The raw exports were not the same run as the checked-in 28-route summary. Do not compare their savings estimates directly to the 1 November report. Retain JSON output for the next Lighthouse pass so each route's audit IDs, diagnostics, and opportunity details can be reviewed and compared.
