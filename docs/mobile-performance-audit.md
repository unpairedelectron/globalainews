# Global AI News mobile performance audit

**Measured:** 2026-10-05
**Environment:** local production build, in-memory publication fixture, 402 × 874 CSS-pixel viewport, 4× CPU slowdown, 150 ms RTT, 1.6 Mbps down / 0.75 Mbps up. INP was not measured.

## Latest route sample

| Route | TTFB | LCP | CLS | JS transferred | Images transferred | Total transferred |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 158 ms | 2,668 ms | 0 | 509 KiB | 0 KiB | 1,044 KiB |
| `/article/india-ai-compute-access-2026` | 161 ms | 3,452 ms | 0 | 634 KiB | 77 KiB | 1,361 KiB |
| `/reports` | 162 ms | 2,392 ms | 0 | 521 KiB | 0 KiB | 1,008 KiB |
| `/topic/india` | 179 ms | 3,880 ms | 0 | 572 KiB | 152 KiB | 1,222 KiB |
| `/company/openai` | 170 ms | 2,356 ms | 0 | 572 KiB | 0 KiB | 1,057 KiB |
| `/about-us` | 33 ms | 2,236 ms | 0 | 572 KiB | 0 KiB | 1,057 KiB |

The India topic route is slowest at 3,880 ms LCP, followed by the article at 3,452 ms; home is 2,668 ms. CLS was zero on all six routes, and the sample loaded no third-party scripts. INP was not measured because these captures did not include user interaction.

## Changes verified

- DM Sans, DM Mono, and Instrument Serif now load from licensed font files served by the app. DM Sans and Instrument Serif are preloaded.
- Clerk route code is dynamically loaded only on editor sign-in, sign-up, and insights routes. The public entry no longer imports Clerk; the full theme regression still covers public and Clerk routes in light/dark mode, desktop/mobile, keyboard focus, contrast, screenshots, and browser errors.
- The six public-route captures loaded fonts from the app origin and reported no third-party script origins.
- Desktop and mobile previews of the home and reports pages rendered after the web workflow restart.
- The development preview refresh test edits and restores an article title, confirms the social card updates, and asserts that Vite does not restart for `src/content.ts` edits.

## Interpretation and limits

The current public JavaScript entry is 520,440 bytes (160,470 gzip); the shared public-route chunk is 63,580 bytes (14,250 gzip), and the Clerk route chunk is 146,780 bytes (36,890 gzip), requested only on editor/auth routes. CSS is 148,390 bytes (23,330 gzip). The entry still triggers Vite's 500 kB chunk warning. The mobile harness's transferred-byte totals are from a local server without production compression and include the API snapshot, so they are not published wire-payload measurements. This is a controlled navigation sample, not field data; it does not validate CDN compression, cache behavior, or production TTFB.

The deferred Clerk chunk is a measurable public-entry reduction, not a full editor-page split: the `InsightsPage` implementation remains in the shared public module. No article/report route split was attempted because the app replaces its prerendered DOM with `createRoot` after fetching the newsroom snapshot; an additional async boundary there could replace first-response content with a fallback. Keep the first-response article/report and Clerk/editor regression coverage intact before considering that separate change.