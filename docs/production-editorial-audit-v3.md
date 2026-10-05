# Global AI News — production editorial audit

**Audit date:** 5 October 2026  
**Production site:** https://www.globalainews.in/  
**Purpose:** Record the production baseline and the later workspace-only editorial remediation.

**Deployment boundary:** The active deployment is public, successful, and Autoscale, but read-only runtime fingerprint checks on both public hosts confirm that it serves a stale main-branch ancestor rather than the current workspace. No editorial data, publishing automation, or deployment was changed.

## Method and limits

The audit used the live desktop homepage screenshot, the public newsroom content and metadata endpoints, direct HTTP checks, the RSS feed, sitemap, robots file, AMP page, and representative public routes. Mobile checks used Chromium at 402 × 874 CSS pixels with 4× CPU throttling and a simulated 150 ms / 200 KB/s downlink. These are controlled lab measurements, not field Core Web Vitals.

Ten mobile routes were checked: home, the India compute article, reports, the research record, the India compute data product, the India topic, an entity profile, an author profile, About, and search. The route-level crawl was representative, not a link-by-link crawl of every production URL. AMP returned a canonical article page, but an AMP validator was not run. No Lighthouse or axe accessibility report was run during this baseline.

## Production inventory and freshness

The live content endpoint returned HTTP 200 at `2026-10-05T09:49Z`, marked `stale:false`, with 11 published stories, 30 sources, 6 author profiles, 8 signal records, 2 topics, 10 entities, 17 timeline events, 1 published research record, 1 published data product, and 558 authority edges. The 70-article portfolio in `research/70-article-launch/` is a separate workspace-only draft set; its manifest has 70 records with `publishedAt:null`. It is not a 70-story production publication.

The latest public story is “India’s AI compute gap is now a measurement problem,” published 3 October and updated 4 October. The previous listed stories are dated 28, 23, and 21 September. The research record was updated 4 October. The signal records’ most recent update is 11 September, so the homepage’s “current” signals are older than the latest reporting.

## Route and crawler checks

| Surface | Production result |
| --- | --- |
| Homepage | HTTP 200; current API-backed edition date and story count render. |
| Reports | HTTP 200; flagship report links to its research record, data product, India topic, and IndiaAI entity. |
| Research | HTTP 200; one published research record. The record has a question, methodology, findings, 22 source links, four limitations, and update history. |
| Data | HTTP 200; one published data product with dated observations and source links. |
| Topics | HTTP 200; two topic records. |
| Entity | HTTP 200; representative company profile loads. |
| Timeline | HTTP 200; representative event loads with a source-linked description. |
| Author | HTTP 200; representative profile exposes a name, role, location, and biography that are not independently verified against the publication. |
| Trust/editorial input routes | `/archive`, `/about-us`, `/code-of-ethics`, `/corrections`, and `/contact-us` return placeholder content with `noindex`. |
| RSS | `/feed.xml` returns HTTP 200 and 11 items. |
| Sitemap | `/sitemap.xml` returns HTTP 200, 60 `<loc>` entries and 51 `<lastmod>` values. |
| Robots | `/robots.txt` returns HTTP 200, allows crawling, and references the sitemap. |
| AMP | Representative AMP URL returns HTTP 200 and points its canonical to the standard article. |
| Not found | Unknown route returns HTTP 404 with `noindex,follow`. |
| Search | `/search/` loads; the public UI searches published stories. |

The metadata endpoint reports 99 known routes: 60 indexable and 39 non-indexable. The sitemap’s 60 entries match the indexable-route count. One article and its research record share the same document title. The guessed legacy path `/reports/ai-compute-india/` returned 404; it is not treated as a broken production link because it is not in the live route manifest.

## Article and source quality

Word counts below are from live story-body headings, paragraphs, and table cells; supporting summaries and takeaways are not counted as body text. “Read time” is the live value.

| Story | Body words | Sources | Live read time | Audit finding |
| --- | ---: | ---: | --- | --- |
| India’s AI compute gap is now a measurement problem | 4,478 | 22 | 19 min | Strongest authority asset: ten sections, explicit limitations, dated source comparisons, research and data links. The read-time estimate is lower than a plain 220-words/minute calculation, partly because tables and source material are not linear prose. |
| The cost of intelligence is becoming a design constraint | 60 | 2 | 10 min | Thin for the displayed format and read time; mostly general framing. |
| Public compute needs public metrics | 52 | 2 | 7 min | Thin and overlaps the flagship report’s subject without equivalent evidence depth. |
| Reliability is becoming the new AI moat | 66 | 1 | 6 min | Thin, broad analysis with no concrete case or measured evidence. |
| Study finds word cues can override game-theory choices in LLMs | 714 | 1 | 4 min | Primary-source-led but has no entity or related-story links despite being a research item. |
| AI models are accelerating the hunt for new antibiotics | 750 | 2 | 7 min | Useful research angle, but one source record points only to the Nature homepage rather than the cited paper. |
| The quiet race to watermark everything AI makes | 772 | 2 | 5 min | Useful policy analysis; source and date distinctions should remain explicit. |
| India’s public AI stack is being built in the open | 764 | 2 | 6 min | Relevant India coverage; overlaps with the compute report and needs clearly differentiated scope. |
| Small models are finding their way into serious workflows | 770 | 2 | 4 min | Stronger reported explainer, but the desk’s assertions should be tied to direct examples. |
| What founders notice after their first million model calls | 789 | 1 | 8 min | Broad analysis; title implies reported founder experience while the single listed source is a general index. |
| The new geography of compute is surprisingly regional | 771 | 2 | 9 min | Relevant infrastructure analysis; distinguish measured source claims from editorial inference. |

Three short pieces are presented as 6–10 minute reads despite having only 52–66 words in their bodies. Their full rendered pages remain short even after summaries and takeaways are included. One article has no mapped entities or related stories; several reports have thin evidence sets. The source registry is used by the stories, but source count alone does not establish that a cited page supports a particular claim.

The Nature source record for the antibiotic article uses `https://www.nature.com/`, not the study URL. This is a concrete source-link defect. Public search results for several byline names returned unrelated people with the same names and no public evidence tying the named profiles to Global AI News. That is not proof the people are fictitious, but the roles, locations, biographies, and Person schema are not verified by the available evidence.

## Homepage, navigation, and authority use

The desktop first screen uses a warm editorial palette and a large serif headline. The right-hand “Editorial snapshot / global” panel is a decorative pair of lines and dots with generic copy; it does not visualize the lead report or its evidence. The actual latest story begins below the hero. The page then gives similar prominence to generic signal cards, a broad “Top stories” list, a timeline, a static industry map, India metrics, and essays.

The top navigation exposes Brief, Signals, Research, Reports, Industry, Models, Policy, India, and Essays. Data, a major live authority asset, is not a top-level destination. The report/research/data cluster is visible on the reports page but is not prominent in the homepage first screen.

The homepage shows `+18%`, `+12%`, `0.4x`, and similar signal values. The live signal records have summaries, story slugs, and update dates, but no metric definition, baseline, period, methodology, or source list. The numbers therefore cannot be interpreted and should not be presented as measured intelligence. The live record counts (11 stories, 8 signals, 10 entities) are accurate snapshot counts, but the signal/entity totals add little editorial value to the hero.

The authority graph is substantial in count, yet its usefulness is uneven: the flagship compute report is well connected to its research record, data product, topic, and entity; the game-theory story has zero mapped entities and zero next-story links. The single research record duplicates the article title in metadata, which obscures the difference between reporting and the research asset.

## Mobile and performance baseline

No horizontal overflow was detected on the ten tested routes at 402 CSS pixels. Images present in those routes had `alt` attributes. The article’s many inline citation links are smaller than 24 px in at least one dimension; they are inline links, but their density warrants a focused accessibility review.

| Route | TTFB | LCP | CLS | JS transfer | Image transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 357 ms | 3,056 ms | 0.0006 | 586 KiB | 303 KiB |
| India compute article | 94 ms | 3,512 ms | 0.0000 | 586 KiB | 77 KiB |
| Reports | 81 ms | 2,216 ms | 0.0000 | 586 KiB | 0 KiB |
| Research record | 84 ms | 2,316 ms | 0.0000 | 586 KiB | 0 KiB |
| Data product | 99 ms | 2,392 ms | 0.0000 | 586 KiB | 0 KiB |
| India topic | 98 ms | 3,828 ms | 0.0000 | 586 KiB | 151 KiB |
| Company profile | 101 ms | 2,428 ms | 0.0000 | 586 KiB | 0 KiB |
| Author profile | 122 ms | 3,964 ms | 0.0000 | 586 KiB | 222 KiB |
| About placeholder | 160 ms | 2,436 ms | 0.0000 | 586 KiB | 0 KiB |
| Search | 116 ms | 2,332 ms | 0.0000 | 586 KiB | 0 KiB |

The shared public JavaScript payload is approximately 586 KiB by Resource Timing on every tested route. The homepage adds approximately 303 KiB of image transfers. Under the simulated mobile profile, LCP ranges from 2.2 to 4.0 seconds; the homepage, article, topic, and author profile are the slowest. CLS is negligible in this run. The large shared JavaScript payload and homepage artwork are the clearest measurable performance opportunities.

## Prioritized workspace remediation

1. Completed locally: make the evidence-rich India compute report the homepage lead and use source-labelled evidence rather than decorative hero copy.
2. Completed locally: remove unsupported signal numbers and stale signal freshness claims.
3. Implemented locally: expose only verified people as Person bylines and profiles; use the descriptive Global AI News Editorial Desk attribution otherwise.
4. Completed for the three scheduled workspace candidates: replace thin copy with evidence-supported analysis and derived five-minute read times. The production records remain unchanged.
5. Improved locally: link the India compute candidate to its maintained research record and data product. Broader homepage discovery and taxonomy work remains.
6. Updated locally: make About, Ethics, Corrections, and Contact copy truthful and mutually linked. No approved public contact route exists, so Corrections and Contact remain noindex and no submission channel is claimed.
7. Not addressed in this editorial remediation: reduce shared client JavaScript, improve image transfer size, and run a dedicated Lighthouse or axe audit.

## Post-remediation workspace results

The Global AI News workspace now uses the evidence-rich India compute report as the homepage lead, with dated claims, source labels, and links to its report, research record, and data product. The top-level navigation exposes Data and Reports. Unsupported signal values were removed from the homepage evidence surface, and the publication's shared content snapshot remains the source for public routes and metadata.

The published archive is indexable. About, Code of Ethics, Corrections, and Contact remain explicitly `noindex` until their public operating details are verified. Unverified contributor names are not exposed as Person bylines or indexable profiles; affected stories use organization attribution. Source links that resolve only to a publisher's general homepage are treated as source records, not as direct evidence for a specific claim.

### Workspace-only editorial remediation

The three production entries below remain as observed at the 09:49 UTC baseline. Their scheduled source records were expanded locally; no production editorial record was changed. Body-word counts use headings and paragraphs only, so the workspace and production figures are directly comparable in scope.

| Story | Production baseline body words / sources / read time | Workspace scheduled candidate body words / sources / read time | Local change |
| --- | --- | --- | --- |
| Cost of intelligence | 60 / 2 / 10 min | 997 / 2 / 5 min | Renamed around the IEA’s global data-centre forecast; distinguishes system demand from energy per AI request. |
| Public compute | 52 / 2 / 7 min | 920 / 9 / 5 min | Separates targets, empanelment, onboarding, shared capacity, allocations, and undefined GPU-hours; links to research record `india-ai-compute-2026` and data product `india-ai-compute-snapshots`. |
| AI reliability | 66 / 1 / 6 min | 905 / 1 / 5 min | Adds the OSWorld score and human baseline, with an explicit limit that benchmark accuracy is not a production success rate. |

The workspace candidates are classified as Analysis, dated `2026-10-05`, and have citations checked against their source lists and maintained source registry. Their derived editorial word counts are 1,101, 1,007, and 972 respectively; the separate body-only counts above exclude deks, summaries, and takeaways. See `docs/content-quality-matrix-v3.json` for the complete comparison and counting rules.

The public API projection now includes only contributors marked verified for publication. Unverified story identities resolve to the Global AI News Editorial Desk, whose description appears in article first-response HTML, the hydrated article page, AMP, and the linked research record. The India compute research record also uses the desk identity rather than an unverified author slug.

About, Code of Ethics, Corrections, and Contact now have truthful copy and links to related trust pages. No approved public corrections/contact channel was found: the pages do not invent an inbox, form, response time, or investigation service; newsletter signup is identified as subscription-only. Corrections and Contact remain noindex until an approved route exists.

### Local verification

All checks below ran against workspace builds and isolated test fixtures, not production data:

- TypeScript checks passed. The production API and web builds completed.
- API security, release metadata/history, theme, content-quality, research-report, authority-registry, and SEO date-stability tests passed.
- The publication-flow fixture passed without rebuilding between its simulated release and public-feed checks.
- SEO smoke passed for 56 public routes at desktop, 8 at mobile, 11 AMP pages, and RSS. The link audit covered 105 built routes and 458 internal-link/publication references, with 0 issues.
- Theme regression passed on 5 public routes and 2 Clerk routes in light and dark modes at desktop and mobile sizes. Updated light/dark visual baselines were retained for the homepage, article, industry map, Daily Brief, and newsroom.
- First-response, route, metadata, structured-data, image-description, keyboard-focus, contrast, and responsive-layout assertions passed.

### Post-remediation mobile lab sample

The local production build was measured at 402 × 874 CSS pixels, 4× CPU throttling, 150 ms RTT, and 1.6 Mbps down / 0.75 Mbps up. These are navigation-only lab samples from an in-memory publication fixture; INP was not measured.

| Route | TTFB | LCP | CLS | JS transfer | Image transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home (`/`) | 158 ms | 2,668 ms | 0.000 | 509 KiB | 0 KiB |
| India compute article | 161 ms | 3,452 ms | 0.000 | 634 KiB | 77 KiB |
| Reports | 162 ms | 2,392 ms | 0.000 | 521 KiB | 0 KiB |
| India topic | 179 ms | 3,880 ms | 0.000 | 572 KiB | 152 KiB |
| Company profile | 170 ms | 2,356 ms | 0.000 | 572 KiB | 0 KiB |
| About us (`/about-us`) | 33 ms | 2,236 ms | 0.000 | 572 KiB | 0 KiB |

The home, article, and India topic LCP samples remain above 2.5 seconds; Reports, company, and About us are below that threshold. CLS was zero on all six routes, and no third-party scripts were loaded. Treat these local navigation measurements as route-specific diagnostics, not field or production performance results. The production build still reports a main JavaScript chunk above Vite's 500 kB warning threshold.

The route smoke includes AMP pages and confirms their canonical links, but an independent AMP validator was not run. Contrast, focus, semantics, and responsive behavior have regression checks; a dedicated Lighthouse or axe audit was not run.

## Verification boundary

No production editorial records, publication status, or deployment were changed, and no live publishing automation was run. The production inventory, route results, and original short-story measurements above describe the live baseline observed at `2026-10-05T09:49:00Z`; workspace remediation results and local checks describe the current local source/build. Read-only requests at `2026-10-05T12:49:04Z` to `/` and `/api/healthz` on both `www.globalainews.in` and `global-ai-media.replit.app` returned HTTP 200 with the same stale source revision `49575ba878da393ed503f337793d3837ffd7fa29+source-sha256:cc2b6fef44c5575e413a63eff05d40de9d445d1ba8d9460cd673d06dbca24c8d`, Web revision `web-sha256:6de535690965318fb8e13a4090ba370878d122d98b32b21d25f6f8e482c58340`, and API revision `api-sha256:6d687de00eb58a4e9d2e0ca777049990d49d70ef1741a45194267a6830530219`. That Git commit exists locally and is six commits behind current `main`; the deployed source, Web, and API fingerprints all differ from the current local values. A targeted log search later found one article first-response abort at `2026-10-05T12:57:11.635Z`; the log has no article path or response status, and no other match appeared in the queried interval. The matching handler has a five-second snapshot timeout and returns 503 on fetch failure, so cause and user impact are unconfirmed. Full production parity and post-remediation route verification remain pending an owner-authorized publish.
