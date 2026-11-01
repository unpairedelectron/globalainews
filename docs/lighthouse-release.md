# Lighthouse release audit — 1 November 2026

## Method

Audited 14 routes in mobile and desktop configurations (28 runs) with Lighthouse 13.6.0 and Chromium 152. The app was built for production and served locally behind a test proxy that forwards `/api` requests to the running API artifact. Mobile used Lighthouse's default simulated mobile profile; desktop used the desktop preset. Categories: Performance, Accessibility, Best Practices, and SEO. Scores are out of 100; Web Vitals are milliseconds except CLS.

The ten staging routes were re-audited after fixing long citation URLs that caused horizontal overflow at narrow widths. Staging article routes intentionally send `noindex,nofollow`; their lower SEO scores are expected. `/reports/` and `/topic/india/` currently send `noindex,follow`; this existing indexability policy was recorded, not changed.

## Results

| Route | Device | Perf | A11y | Best practices | SEO | LCP ms | FCP ms | TBT ms | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| / | desktop | 100 | 100 | 77 | 100 | 619 | 299 | 0 | 0.000 |
| / | mobile | 82 | 100 | 77 | 100 | 3439 | 938 | 390 | 0.001 |
| /brief/ | desktop | 98 | 100 | 77 | 100 | 1189 | 271 | 0 | 0.002 |
| /brief/ | mobile | 96 | 100 | 77 | 100 | 2496 | 940 | 160 | 0.001 |
| /reports/ | desktop | 100 | 100 | 77 | 66 | 253 | 253 | 0 | 0.000 |
| /reports/ | mobile | 100 | 100 | 77 | 66 | 917 | 917 | 85 | 0.000 |
| /staging/article/ai-agents-delegated-access-banks-passwords/ | desktop | 100 | 100 | 100 | 69 | 262 | 203 | 0 | 0.000 |
| /staging/article/ai-agents-delegated-access-banks-passwords/ | mobile | 100 | 100 | 100 | 69 | 1072 | 699 | 0 | 0.000 |
| /staging/article/ai-in-workforce-plans-october-2026/ | desktop | 100 | 100 | 100 | 69 | 253 | 193 | 0 | 0.000 |
| /staging/article/ai-in-workforce-plans-october-2026/ | mobile | 100 | 100 | 100 | 69 | 1075 | 743 | 3 | 0.000 |
| /staging/article/anthropic-s1-governance-who-controls/ | desktop | 100 | 100 | 100 | 69 | 335 | 241 | 0 | 0.000 |
| /staging/article/anthropic-s1-governance-who-controls/ | mobile | 100 | 100 | 100 | 69 | 1227 | 743 | 0 | 0.000 |
| /staging/article/eu-ai-act-december-2026-deadlines/ | desktop | 100 | 100 | 100 | 69 | 263 | 191 | 0 | 0.000 |
| /staging/article/eu-ai-act-december-2026-deadlines/ | mobile | 100 | 100 | 100 | 69 | 1077 | 705 | 0 | 0.000 |
| /staging/article/gated-frontier-models-gemini-4-carbon/ | desktop | 100 | 100 | 100 | 69 | 314 | 214 | 0 | 0.000 |
| /staging/article/gated-frontier-models-gemini-4-carbon/ | mobile | 100 | 100 | 100 | 69 | 1226 | 728 | 15 | 0.000 |
| /staging/article/github-octoverse-2026-agents-pull-requests/ | desktop | 100 | 100 | 100 | 69 | 301 | 201 | 0 | 0.000 |
| /staging/article/github-octoverse-2026-agents-pull-requests/ | mobile | 100 | 100 | 100 | 69 | 1236 | 711 | 0 | 0.000 |
| /staging/article/hyperscaler-capex-2026-reconciled/ | desktop | 100 | 100 | 100 | 69 | 256 | 194 | 0 | 0.000 |
| /staging/article/hyperscaler-capex-2026-reconciled/ | mobile | 100 | 100 | 100 | 69 | 1212 | 696 | 0 | 0.000 |
| /staging/article/india-ai-consultation-paper-what-is-law/ | desktop | 100 | 100 | 100 | 69 | 264 | 233 | 0 | 0.000 |
| /staging/article/india-ai-consultation-paper-what-is-law/ | mobile | 100 | 100 | 100 | 69 | 1077 | 788 | 57 | 0.000 |
| /staging/article/indiaai-10000-gpu-tender-explained/ | desktop | 100 | 100 | 100 | 69 | 260 | 194 | 0 | 0.000 |
| /staging/article/indiaai-10000-gpu-tender-explained/ | mobile | 100 | 100 | 100 | 69 | 1075 | 724 | 0 | 0.000 |
| /staging/article/openai-containment-incident-offline-training/ | desktop | 100 | 100 | 100 | 69 | 309 | 199 | 0 | 0.000 |
| /staging/article/openai-containment-incident-offline-training/ | mobile | 100 | 100 | 100 | 69 | 1233 | 710 | 12 | 0.000 |
| /topic/india/ | desktop | 99 | 100 | 77 | 69 | 920 | 257 | 0 | 0.002 |
| /topic/india/ | mobile | 90 | 100 | 77 | 69 | 3633 | 916 | 17 | 0.001 |

## Findings and disposition

- All 10 noindex staging articles scored 100 for Performance, Accessibility, and Best Practices on desktop and mobile. Mobile LCP ranged from 1072 to 1236 ms; TBT was at most 57 ms and CLS was 0.000. SEO score 69 is expected for noindex previews.
- The four audited public routes scored 100 for Accessibility. Public Best Practices scores were 77; Lighthouse reported third-party-cookie and DevTools inspector findings associated with Microsoft Clarity. Analytics collection was not removed or altered.
- The broader smoke suite separately found a 3.55:1 dark-mode contrast issue on `/industry/` map labels, a route outside these 14 Lighthouse targets. The labels now use an explicit theme-aware text/background pair, and the full smoke rerun passed.
- Public Performance scores ranged from 82 to 100. The homepage's mobile score was 82, with LCP 3439 ms and TBT 390 ms. Image delivery, unused JavaScript, main-thread work and render-blocking audits identify follow-up optimization areas; no targets were lowered.
- Reports (SEO 66) and India Watch (SEO 69) are explicitly `noindex,follow` in their first response. Revisit this during authorized site wiring if these pages are meant to be search-indexable.
- Playwright checks on all 10 staging routes at 360px in dark mode found no document horizontal overflow after the citation-wrap fix. Body and link contrast exceeded 4.5:1; image alt text was present; data tables stayed in contained scroll regions; all article disclosure summaries toggled with Enter.
- A first Lighthouse pass against Vite development was discarded because HMR and API routing produced invalid 404 and simulated-LCP results. This report uses the production build and API proxy.

## Verification

The 10-route static preview, metadata, schema, disclosure and image checks passed. The live route verifier was tested against an isolated fixture for an indexable response and a noindex rejection. No production release record was created during this audit.

## Repeatable preview regression gate

Run `pnpm --filter @workspace/global-ai-news run audit:preview`. The command builds the production app, starts an isolated production server on a free local port, discovers every generated noindex staging article route, and checks those pages plus `/`, `/brief/`, `/reports/`, and `/topic/india/`. Its temporary proxy forwards `/api` to the workspace API at `http://127.0.0.1:8080` by default while preserving production response compression. The temporary servers are stopped after the report. Set `PREVIEW_AUDIT_URL` to audit an already-running production-built preview instead; set `PREVIEW_AUDIT_API_URL` or `NEWSROOM_API_ORIGIN` to override the API origin.

Every route is checked at 360px with dark color preference for document overflow, WCAG-tagged axe serious/critical violations, first-Tab visible focus, and Enter-operated disclosures where present. Lighthouse runs mobile and desktop on every route and reports Performance, Accessibility, and Best Practices scores with the route and device.

The fixed failure limits are mobile Performance 80, desktop Performance 95, Accessibility 95 on both devices, and Best Practices 70 on both devices. The latest production run passed 95 of 98 checks; its three failures were desktop Performance on `/` (75, LCP 4,377 ms), `/brief/` (78, LCP 4,027 ms), and `/topic/india/` (79, LCP 3,635 ms). All staging-article desktop scores and all mobile scores passed; all routes passed the Accessibility and Best Practices limits. The gate remains red for those three desktop routes, with limits unchanged. Public Best Practices is 77 because of known third-party-cookie/DevTools findings. SEO is reported in the existing release audit but is not a failure threshold here because noindex preview and section routes intentionally score lower. The command does not accept threshold overrides.
