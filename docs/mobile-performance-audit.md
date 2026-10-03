# Global AI News mobile performance audit

**Measured:** 2026-10-03  
**Environment:** local production build, in-memory publication fixture, 402 × 874 CSS-pixel viewport, 4× CPU slowdown, 150 ms RTT, 1.6 Mbps down / 0.75 Mbps up.

## Latest route sample

| Route | TTFB | LCP | CLS | Transferred bytes in local harness |
| --- | ---: | ---: | ---: | ---: |
| `/` | 285 ms | 2,984 ms | 0.0006 | 1,316,003 |
| `/article/india-ai-compute-2026` | 37 ms | 6,604 ms | 0 | 1,187,699 |
| `/reports` | 159 ms | 2,324 ms | 0 | 969,919 |
| `/topic/india` | 167 ms | 4,392 ms | 0.001 | 1,314,564 |
| `/company/openai` | 165 ms | 2,176 ms | 0 | 969,909 |
| `/person/lena-hoff` | 188 ms | 3,748 ms | 0 | 1,124,315 |

The article remains the slowest route at 6,604 ms LCP in this sample. Current CLS is at or below 0.001 on all six routes. INP was not measured because these captures did not include user interaction.

## Changes verified

- DM Sans, DM Mono, and Instrument Serif now load from licensed font files served by the app. DM Sans and Instrument Serif are preloaded.
- Clerk route code is dynamically loaded only on editor sign-in, sign-up, and insights routes. The public entry no longer imports Clerk; the full theme regression still covers public and Clerk routes in light/dark mode, desktop/mobile, keyboard focus, contrast, screenshots, and browser errors.
- The six public-route captures loaded fonts from the app origin and reported no third-party script origins.
- Desktop and mobile previews of the home and reports pages rendered after the web workflow restart.

## Interpretation and limits

The current public JavaScript entry is 575,108 bytes (170,551 gzip); the Clerk route chunk is 105,294 bytes (26,575 gzip) and is requested only on the three editor/auth routes. The initial public entry is down from 678,492 bytes (196,028 gzip). CSS remains 145.55 kB (22.96 kB gzip), and the entry still triggers Vite's 500 kB chunk warning. The mobile harness's transferred-byte totals are from a local server without production compression, so they are not a measure of published wire payload. The run is a controlled navigation sample, not field data, and does not validate CDN compression, cache behavior, or production TTFB.

The deferred Clerk chunk is a measurable public-entry reduction, not a full editor-page split: the `InsightsPage` implementation remains in the shared public module. No article/report route split was attempted because the app replaces its prerendered DOM with `createRoot` after fetching the newsroom snapshot; an additional async boundary there could replace first-response content with a fallback. Keep the first-response article/report and Clerk/editor regression coverage intact before considering that separate change.