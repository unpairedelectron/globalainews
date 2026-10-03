# Global AI News mobile performance audit

**Measured:** 2026-10-03  
**Environment:** local production build, in-memory publication fixture, 402 × 874 CSS-pixel viewport, 4× CPU slowdown, 150 ms RTT, 1.6 Mbps down / 0.75 Mbps up.

## Latest route sample

| Route | TTFB | LCP | CLS | Transferred bytes in local harness |
| --- | ---: | ---: | ---: | ---: |
| `/` | 400 ms | 3,068 ms | 0.0006 | 1,419,387 |
| `/article/india-ai-compute-2026` | 36 ms | 7,056 ms | 0 | 1,291,083 |
| `/reports` | 164 ms | 2,328 ms | 0 | 1,073,303 |
| `/topic/india` | 165 ms | 4,416 ms | 0.001 | 1,417,948 |
| `/company/openai` | 174 ms | 2,404 ms | 0 | 1,073,293 |
| `/person/lena-hoff` | 161 ms | 3,572 ms | 0 | 1,227,699 |

The reports index improved from 6,540 ms to 2,328 ms LCP in the local run. Other routes were broadly flat against the earlier sample; the article remains slow at about seven seconds. Current CLS is at or below 0.001 on all six routes. INP was not measured because these captures did not include user interaction.

## Changes verified

- DM Sans, DM Mono, and Instrument Serif now load from licensed font files served by the app. DM Sans and Instrument Serif are preloaded.
- The Clerk provider is mounted only on editor sign-in, sign-up, and insights routes. The full theme regression still covers public and Clerk routes in light/dark mode, desktop/mobile, keyboard focus, contrast, screenshots, and browser errors.
- The six public-route captures loaded fonts from the app origin and reported no third-party script origins.
- Desktop and mobile previews of the home and reports pages rendered after the web workflow restart.

## Interpretation and limits

The local production bundle is 678.49 kB minified (196.03 kB gzip); CSS is 145.55 kB (22.96 kB gzip). The mobile harness's transferred-byte totals are from a local server without production compression, so they are not a measure of published wire payload. The run is a controlled navigation sample, not field data, and does not validate CDN compression, cache behavior, or production TTFB.

The report-route improvement is material in this harness, but the broadly unchanged home, article, topic, company, and author results do not justify a broad bundle rewrite on their own. Keep the first-response article and Clerk/editor regression coverage intact. Reconsider route-level splitting only after comparing a production-equivalent compressed build and confirming its impact on the remaining article LCP.