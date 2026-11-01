# Lighthouse findings for the strict release pass

## Current complete matrix

`docs/lighthouse-release.md` records the 36-run production matrix. Best Practices scored 100 on all audited routes; the earlier Clarity-related cookie and DevTools findings did not recur after deferring analytics. The mobile scores below 95 were Home (91), Brief (94), and the AI topic hub (94). The ten staged articles scored 100 for Performance, Accessibility, and Best Practices on both devices. Their SEO scores, and the 66/69 scores on explicitly noindex routes, are expected.

The homepage lead image now offers AVIF/WebP sources. The publication-flow fixture selected the 768px AVIF (19,348 encoded bytes) under its mobile network profile. This improves image delivery without changing the image's meaning or removing editorial imagery.

Research Accessibility was 96 in the complete matrix because its index number had insufficient contrast. The text color was corrected in both hydrated and prerendered output; the focused Lighthouse recheck scored 100 Accessibility on mobile and desktop.

## Supplemental route coverage and score variance

The checklist's Methodology route is `/code-of-ethics/`; it was not in the 36-run matrix. A focused run covered that route on mobile and desktop, along with Research after the contrast fix. All four runs scored 100 Accessibility and Best Practices. Desktop Performance was 99 on both routes. The mobile runs scored 71 for Research and 72 for Methodology, substantially below the complete matrix's Research result. These supplemental mobile Performance numbers are recorded in `docs/lighthouse-release.md` but are not treated as directly comparable to the matrix because they used a temporary local static/API proxy and showed much higher blocking time. Re-run with the established release-audit proxy before using them for release decisions.

## Historical audit IDs

The older raw homepage captures recorded the following Lighthouse IDs; they predate the complete matrix and should not be read as current scores or savings estimates:

| Lighthouse audit ID | Historical observation | Current disposition |
| --- | --- | --- |
| `third-party-cookies` | Third-party cookies from Microsoft Clarity | Clarity is deferred to first interaction or four seconds after load; Best Practices now scores 100 in the complete matrix. |
| `inspector-issues` | Browser Issues associated with third-party analytics requests | Recheck the browser Issues detail before attributing any future finding to a vendor. |
| `mainthread-work-breakdown` | Main-thread work from the shared client bundle and route startup | Mobile Performance remains below 95 on several public routes; reduce client work without removing features. |
| `bootup-time` | JavaScript parse/compile/execute cost | Review route-level imports and defer code only where behavior remains intact. |
| `unused-javascript` | Shared entry code on routes that use little client behavior | Keep route splitting as a follow-up; preserve the first-response experience. |
| `image-delivery-insight` | Image transfer-size opportunity | Responsive AVIF/WebP sources are now used for priority editorial images; retain the fixture's selected format and byte checks. |
| `render-blocking-insight` | Stylesheet/font critical-path opportunity | Use resource timing before changing fonts or stylesheet loading. |
| `cache-insight` | Static-resource cache-lifetime opportunity | Confirm production response headers before changing cache policy. |
| `largest-contentful-paint` | High mobile LCP on the homepage | The latest complete matrix reports 3.4 s; the publication-flow fixture measured about 1.9 s in its separate constrained-network run. |
| `total-blocking-time` | High TBT in older raw captures | The complete matrix reports about 80 ms on Home; the supplemental local-proxy mobile runs were materially higher and are not substituted. |

## Limits

The older 28-run table and raw home captures used different runs from the latest matrix. Do not compare their savings estimates with current scores. Preserve Lighthouse JSON and keep the serving proxy, network profile, and browser version constant in future comparisons.
