# Global AI News mobile performance audit

**Measured:** 2026-10-04
**Environment:** local production build, in-memory publication fixture, 402 × 874 CSS-pixel viewport, 4× CPU slowdown, 150 ms RTT, 1.6 Mbps down / 0.75 Mbps up.

## Latest route sample

| Route | TTFB | LCP | CLS | Transferred bytes in local harness |
| --- | ---: | ---: | ---: | ---: |
| `/` | 291 ms | 3,044 ms | 0.0006 | 1,415,210 |
| `/article/india-ai-compute-access-2026` | 113 ms | 3,292 ms | 0 | 1,286,904 |
| `/reports` | 179 ms | 2,496 ms | 0 | 1,071,133 |
| `/topic/india` | 164 ms | 3,984 ms | 0.001 | 1,259,019 |
| `/company/openai` | 220 ms | 2,424 ms | 0 | 1,069,116 |
| `/person/lena-hoff` | 162 ms | 3,636 ms | 0 | 1,223,522 |

The India topic route is slowest at 3,984 ms LCP in this sample; the article measured 3,292 ms. CLS is at or below 0.001 on all six routes. INP was not measured because these captures did not include user interaction.

## Changes verified

- DM Sans, DM Mono, and Instrument Serif now load from licensed font files served by the app. DM Sans and Instrument Serif are preloaded.
- Clerk route code is dynamically loaded only on editor sign-in, sign-up, and insights routes. The public entry no longer imports Clerk; the full theme regression still covers public and Clerk routes in light/dark mode, desktop/mobile, keyboard focus, contrast, screenshots, and browser errors.
- The six public-route captures loaded fonts from the app origin and reported no third-party script origins.
- Desktop and mobile previews of the home and reports pages rendered after the web workflow restart.
- The development preview refresh test edits and restores an article title, confirms the social card updates, and asserts that Vite does not restart for `src/content.ts` edits.

## Interpretation and limits

The current public JavaScript entry is 588,045 bytes (171,280 gzip); the Clerk route chunk is 146,770 bytes (36,890 gzip) and is requested only on the three editor/auth routes. CSS is 147,507 bytes (23,190 gzip). The entry remains below the earlier 678,492-byte public entry but still triggers Vite's 500 kB chunk warning. The mobile harness's transferred-byte totals are from a local server without production compression, so they are not a measure of published wire payload. The run is a controlled navigation sample, not field data, and does not validate CDN compression, cache behavior, or production TTFB.

The deferred Clerk chunk is a measurable public-entry reduction, not a full editor-page split: the `InsightsPage` implementation remains in the shared public module. No article/report route split was attempted because the app replaces its prerendered DOM with `createRoot` after fetching the newsroom snapshot; an additional async boundary there could replace first-response content with a fallback. Keep the first-response article/report and Clerk/editor regression coverage intact before considering that separate change.