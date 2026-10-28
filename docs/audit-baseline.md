# Global AI News — Phase 0 Audit Baseline

Captured 28 October 2026 from the published site at `https://www.globalainews.in/` and the current workspace. This is a measurement snapshot, not a content rewrite.

## Platform and content sources

- **Application:** React + Vite web artifact with a production Node/Express rendering server; a separate API artifact serves the public newsroom snapshot.
- **Hosting / edge:** Replit deployment is configured for autoscale. Live responses identify `Google Frontend`; the artifact configuration does not declare a separate CDN product.
- **Analytics:** Microsoft Clarity is loaded for eligible public routes. The client can call Umami if a global `umami` client exists, but an active Umami provider was not confirmed. Private routes and URLs with query/hash data are excluded from Clarity.
- **Newsletter:** Subscribers are first stored in PostgreSQL. Delivery can use an environment-configured webhook or Resend; without either, the app reports the durable database queue. The configured production provider was not established from source.
- **Editorial source:** Public content is supplied by the maintained newsroom API snapshot, backed by editorial data and release records. The live API returned 7 stories; newest published date was 3 October 2026.
- **Response/cache evidence:** `Server: Google Frontend`; HSTS is present (`max-age=63072000; includeSubDomains`). The homepage currently sends `Cache-Control: private, max-age=0`; the sitemap uses a short shared cache policy.

## Crawl summary

- Fetched the live XML sitemap and crawled all **45 listed URLs**. All returned **200**, had one H1, and used a self-canonical. **15 titles exceeded 60 characters**.
- **22 of 45** descriptions fell outside the prompt’s 120–155-character target. The lead India compute article is 157 characters and visibly ends with an ellipsis.
- A sitemap-to-sitemap internal-link graph found several low-content company, model, topic, and timeline pages with no incoming link from another sitemap URL. Counts below are unique page-to-page links within the sitemap corpus; they do not claim that a route is a true orphan outside this crawl.
- `/robots.txt` is valid plain text, allows public crawling, blocks `/api/`, `/insights/`, `/sign-in/`, and `/sign-up/`, and references the sitemap.
- `/sitemap.xml` returns XML. `/feed.xml` returns RSS. `/news-sitemap.xml`, `/feed.json`, and `/brief/feed.xml` returned 404.
- `/brief/` and `/signals/` each link to the same 7 article URLs. Their current headline lists therefore duplicate one another.
- The live snapshot has 7 stories and the newest date is 3 October, so “Daily Brief” currently promises a cadence the published archive does not demonstrate.
- `/source/indiaai-compute-portal/` returns a rendered page, but the page says it has no usable source-specific web address and asks editors to treat the citation as incomplete. This is a trust/content issue, not an HTTP 404.
- A live article’s `article:author` points to the homepage. The article has published/modified timestamps, but no named author page is linked from the sitemap.
- Canonical HTTPS `www` is served consistently. `http://globalainews.in/` takes two redirects (HTTP apex → HTTPS apex → HTTPS `www`); HTTPS apex and HTTP `www` each take one. The apex HTTP path does not yet meet the requested single-hop target.
- A production link audit already recorded in `docs/SEO_RESULTS.md` found zero issues in its earlier build snapshot (99 built routes, 412 references). The current smoke suite has since audited 106 routes and 444 internal references; that is build evidence, not a substitute for the live crawl above.

## Lighthouse baseline

Lighthouse 12.8.2 was run against the live site in a headless Chromium browser. Performance / accessibility / best practices / SEO are scores from 0–100. TBT is used here as a lab responsiveness indicator; Lighthouse did not supply an INP lab value. Image transfer and request counts are page totals reported by Lighthouse.

| Page | Device | Perf. | Access. | Best practices | SEO | LCP | TBT | CLS | Transfer | Requests |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Home | Mobile | 83 | 100 | 79 | 100 | 2.5 s | 530 ms | 0.001 | 933 KiB | 24 |
| Home | Desktop | 96 | 100 | 78 | 100 | 1.2 s | 40 ms | 0 | 932 KiB | 24 |
| Brief | Mobile | 61 | 100 | 79 | 100 | 6.1 s | 670 ms | 0.001 | 1,638 KiB | 32 |
| Brief | Desktop | 96 | 100 | 78 | 100 | 1.4 s | 10 ms | 0.002 | 1,433 KiB | 30 |
| Signals | Mobile | 32 | 100 | 79 | 100 | 7.1 s | 3,060 ms | 0.001 | 953 KiB | 26 |
| Signals | Desktop | 95 | 100 | 78 | 100 | 1.5 s | 60 ms | 0.002 | 952 KiB | 25 |
| Lead article | Mobile | 70 | 100 | 79 | 100 | 2.8 s | 1,180 ms | 0 | 482 KiB | 21 |
| Lead article | Desktop | 95 | 100 | 78 | 100 | 1.4 s | 50 ms | 0 | 482 KiB | 21 |
| Short article | Mobile | 77 | 100 | 79 | 100 | 2.7 s | 770 ms | 0.001 | 472 KiB | 20 |
| Short article | Desktop | 97 | 100 | 78 | 100 | 1.3 s | 40 ms | 0 | 472 KiB | 19 |

The requested mobile performance target is not met on any sampled page; the clearest outlier is `/signals/` at 32, 7.1 s LCP, and 3,060 ms TBT. Desktop performance is 95–97. Best Practices is 78–79 for every sample. Accessibility and SEO scored 100 in this run. The two binary Best Practices findings were third-party cookies and DevTools inspector issues; inspect their Lighthouse details during remediation. Search Console / CrUX field data was not available, so real-user INP and indexing coverage remain unmeasured.

## Unique live image assets

Fourteen same-origin image URLs were found in the sitemap pages. All 14 HEAD requests returned 200 with a known content length; total unique bytes were 1,291,108. The six editorial images are JPEGs; the article social previews are PNGs. The largest observed file was 135,982 bytes. The sampled page HTML used `<img src>` and did not expose `srcset`.

| Path | Type | Bytes |
|---|---|---:|
| `/images/editorial/india-ai-compute-access-2026.jpg` | JPEG | 78,124 |
| `/images/editorial/ai-models-antibiotic-discovery.jpg` | JPEG | 102,854 |
| `/images/editorial/quiet-race-watermark-everything-ai-makes.jpg` | JPEG | 76,865 |
| `/images/editorial/reliability-is-the-new-ai-moat.jpg` | JPEG | 72,007 |
| `/images/editorial/small-models-serious-workflows.jpg` | JPEG | 132,347 |
| `/images/editorial/study-finds-word-cues-can-override-game-theory-choices-in-llms.jpg` | JPEG | 102,993 |
| `/images/editorial/weekly-deep-dive-cost-of-intelligence.jpg` | JPEG | 135,982 |
| `/social/articles/india-ai-compute-access-2026.png` | PNG | 78,665 |
| `/social/articles/ai-models-antibiotic-discovery.png` | PNG | 90,217 |
| `/social/articles/quiet-race-watermark-everything-ai-makes.png` | PNG | 79,836 |
| `/social/articles/reliability-is-the-new-ai-moat.png` | PNG | 85,058 |
| `/social/articles/small-models-serious-workflows.png` | PNG | 80,649 |
| `/social/articles/study-finds-word-cues-can-override-game-theory-choices-in-llms.png` | PNG | 85,387 |
| `/social/articles/weekly-deep-dive-cost-of-intelligence.png` | PNG | 90,124 |

## Sitemap URL inventory

Base URL: `https://www.globalainews.in`. “Self” means the canonical exactly matches that row’s URL. In/out values are unique internal links from/to the 45 sitemap URLs.

| URL path | HTTP | Title | Description chars | Canonical | H1 | Words | Images | In / out |
|---|---:|---|---:|---|---:|---:|---:|---:|
| `/` | 200 | Global AI News — Intelligence for the AI economy | 112 | Self | 1 | 291 | 6 | 45 / 10 |
| `/about-us/` | 200 | About us — Global AI News | 88 | Self | 1 | 383 | 0 | 10 / 5 |
| `/archive/` | 200 | Archive — Global AI News | 102 | Self | 1 | 343 | 7 | 0 / 9 |
| `/article/ai-models-antibiotic-discovery/` | 200 | ProteoGPT study reports peptide candidates for resistant bacteria — Global AI News | 110 | Self | 1 | 1,072 | 1 | 6 / 10 |
| `/article/india-ai-compute-access-2026/` | 200 | India’s AI compute gap is now a measurement problem — Global AI News | 157 | Self | 1 | 6,322 | 1 | 15 / 11 |
| `/article/quiet-race-watermark-everything-ai-makes/` | 200 | C2PA provenance records do not prove content is true — Global AI News | 98 | Self | 1 | 1,131 | 1 | 6 / 10 |
| `/article/reliability-is-the-new-ai-moat/` | 200 | AI agents improved on OSWorld; reliability remains the test — Global AI News | 123 | Self | 1 | 1,218 | 1 | 5 / 11 |
| `/article/small-models-serious-workflows/` | 200 | Mistral Small 4’s active parameter count is not its full footprint — Global AI News | 148 | Self | 1 | 1,079 | 1 | 6 / 10 |
| `/article/study-finds-word-cues-can-override-game-theory-choices-in-llms/` | 200 | Preprint links cooperative game choices to familiar action labels — Global AI News | 144 | Self | 1 | 1,014 | 1 | 5 / 10 |
| `/article/weekly-deep-dive-cost-of-intelligence/` | 200 | AI’s electricity demand is becoming a product-design constraint — Global AI News | 155 | Self | 1 | 1,398 | 1 | 5 / 11 |
| `/ask/` | 200 | Ask Global — Global AI News | 50 | Self | 1 | 336 | 7 | 0 / 9 |
| `/brief/` | 200 | The Daily Brief — Global AI News | 72 | Self | 1 | 357 | 7 | 39 / 9 |
| `/code-of-ethics/` | 200 | Code of ethics — Global AI News | 96 | Self | 1 | 472 | 0 | 10 / 5 |
| `/company/anthropic/` | 200 | Anthropic — Global AI News | 140 | Self | 1 | 75 | 0 | 0 / 2 |
| `/company/microsoft/` | 200 | Microsoft — Global AI News | 145 | Self | 1 | 66 | 0 | 0 / 2 |
| `/company/openai/` | 200 | OpenAI — Global AI News | 140 | Self | 1 | 76 | 0 | 0 / 2 |
| `/company/sarvam-ai/` | 200 | Sarvam AI — Global AI News | 127 | Self | 1 | 65 | 0 | 0 / 2 |
| `/contact-us/` | 200 | Contact us — Global AI News | 114 | Self | 1 | 292 | 0 | 10 / 5 |
| `/corrections/` | 200 | Corrections — Global AI News | 92 | Self | 1 | 357 | 0 | 10 / 5 |
| `/data/india-ai-compute-snapshots/` | 200 | IndiaAI compute: dated public snapshots — Global AI News | 153 | Self | 1 | 1,753 | 0 | 1 / 25 |
| `/glucosmart-privacy/` | 200 | GlucoSmart Privacy Policy — Global AI News | 127 | Self | 1 | 672 | 0 | 0 / 2 |
| `/lab/google-deepmind/` | 200 | Google DeepMind — Global AI News | 111 | Self | 1 | 59 | 0 | 0 / 2 |
| `/model/claude-4/` | 200 | Claude 4 — Global AI News | 101 | Self | 1 | 57 | 0 | 0 / 2 |
| `/model/gpt-5/` | 200 | GPT-5 — Global AI News | 119 | Self | 1 | 68 | 0 | 0 / 2 |
| `/policy/indiaai-mission/` | 200 | IndiaAI Mission — Global AI News | 114 | Self | 1 | 72 | 0 | 2 / 2 |
| `/reports/ai-assistants-compared/` | 200 | AI Assistants Compared — Global AI News | 112 | Self | 1 | 1,412 | 0 | 0 / 2 |
| `/reports/ai-image-tools-compared/` | 200 | AI Image Tools Compared — Global AI News | 109 | Self | 1 | 1,306 | 0 | 0 / 2 |
| `/reports/coding-agent-benchmarks-compared/` | 200 | SWE-bench Verified vs Terminal-Bench — Global AI News | 121 | Self | 1 | 1,145 | 0 | 0 / 2 |
| `/reports/hosted-vs-open-weight-models/` | 200 | Hosted APIs vs Open-Weight Models — Global AI News | 123 | Self | 1 | 1,117 | 0 | 0 / 2 |
| `/reports/indiaai-vs-commercial-cloud/` | 200 | IndiaAI Shared Compute vs Commercial Cloud — Global AI News | 112 | Self | 1 | 1,132 | 0 | 0 / 2 |
| `/reports/provenance-controls-compared/` | 200 | C2PA, Watermarks and AI-Image Detectors — Global AI News | 113 | Self | 1 | 1,149 | 0 | 0 / 2 |
| `/research/india-ai-compute-2026/` | 200 | Research record: India’s AI compute gap is — Global AI News | 129 | Self | 1 | 950 | 1 | 1 / 37 |
| `/signals/` | 200 | Signals on file — Global AI News | 102 | Self | 1 | 346 | 7 | 8 / 9 |
| `/technology/antibiotic-discovery/` | 200 | AI antibiotic discovery — Global AI News | 149 | Self | 1 | 69 | 0 | 0 / 2 |
| `/technology/content-credentials/` | 200 | Content credentials — Global AI News | 162 | Self | 1 | 71 | 0 | 0 / 2 |
| `/timeline/antibiotic-candidates/` | 200 | Nature Microbiology paper reports ProteoGPT preclinical results — Global AI News | 154 | Self | 1 | 87 | 1 | 0 / 3 |
| `/timeline/indiaai-compute-34333-2025/` | 200 | Government reports 34,333 GPUs in the common-compute pool — Global AI News | 123 | Self | 1 | 105 | 1 | 2 / 3 |
| `/timeline/indiaai-compute-access-reported-2026/` | 200 | Independent reporting puts access near 30,000 GPUs — Global AI News | 124 | Self | 1 | 104 | 1 | 2 / 3 |
| `/timeline/indiaai-compute-initial-capacity-2025/` | 200 | IndiaAI describes initial compute and a planned addition — Global AI News | 140 | Self | 1 | 110 | 1 | 2 / 3 |
| `/timeline/indiaai-compute-installed-reported-2025/` | 200 | ET reports early IndiaAI GPU installation progress — Global AI News | 137 | Self | 1 | 107 | 1 | 2 / 3 |
| `/timeline/indiaai-compute-onboarded-2026/` | 200 | Government reports 38,231 GPUs onboarded — Global AI News | 110 | Self | 1 | 98 | 1 | 2 / 3 |
| `/timeline/indiaai-compute-onboarded-nearly-38000-2026/` | 200 | PIB repeats a rounded onboarded figure — Global AI News | 136 | Self | 1 | 104 | 1 | 2 / 3 |
| `/timeline/indiaai-compute-shared-capacity-2026/` | 200 | Factsheet reports more than 45,000 shared GPUs — Global AI News | 140 | Self | 1 | 107 | 1 | 2 / 3 |
| `/timeline/indiaai-compute-target-2024/` | 200 | IndiaAI Mission sets a common-compute target — Global AI News | 122 | Self | 1 | 104 | 1 | 2 / 3 |
| `/timeline/watermarking-code/` | 200 | EU AI Act content-transparency obligations begin to apply — Global AI News | 123 | Self | 1 | 90 | 1 | 0 / 3 |

## Phase 0 files and constraints

- This report is the requested baseline artifact. No article claims, citations, URLs, or production settings were changed in Phase 0.
- Search Console coverage and indexed-page counts were not accessible from the workspace. Lighthouse is a lab baseline; CrUX/real-user Core Web Vitals need Search Console or field data access.
- Next in the prompt’s order is Phase 1. Several requirements are already present (canonical sitemap, RSS, robots rules, public-route rendering, and HSTS); remediation should preserve these verified behaviors and avoid changing article facts.
