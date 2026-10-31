# October 2026 batch — private pre-publish gate report

Status: **not cleared for publication**. The batch remains private and unpublished.

## Article 6 — India AI consultation paper

| Check | Result |
|---|---|
| Body word count | 1,534 words before FAQ, source list and methodology using `scripts/editorial-prepublish-check.mjs`; within the explainer target of 1,200–1,800. |
| Sources | 8 listed: 6 Tier 1 primary/official sources and 2 Tier 2 reports. Secondary consultation-paper claims remain attributed. |
| Fact log | Present at `docs/fact-logs/india-ai-consultation-paper-what-is-law.md`; legal claims distinguish Gazette text, official explanations and reporting. |
| Original visuals | 3 static SVGs; XML parses; each has a title and description, a paired “View data” table, and was reviewed at 360px. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Title 49 characters; description 150 characters; canonical uses the verified production domain. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News research/report routes returned HTTP 200. |
| FAQ | Five questions; the pre-publish script confirms every answer is 40–70 words. |
| Arithmetic / duplicate title | No calculated numeric result; H1 and metadata title differ. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs` passes for this article, including internal-link checks. Batch-wide ten-article mode remains incomplete. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 5 — GitHub Octoverse and agent-started pull requests

| Check | Result |
|---|---|
| Body word count | 2,409 words before FAQ, source list and methodology; within the report target of 1,800–3,000. |
| Sources | 9 listed: 8 Tier 1 official/primary sources and 1 Tier 2 report. |
| Fact log | Present at `docs/fact-logs/github-octoverse-2026-agents-pull-requests.md`; proprietary Octoverse figures remain attributed to GitHub. |
| Original visuals | 4 SVGs parsed and reviewed at 360px: the March/September snapshots, language signal, comparison groups and review path. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. Article 10 cross-link is noted as planned, not inserted as a broken URL. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Worked example | Hypothetical rates checked: 64/80 and 96/120 both equal 80%; clearly labelled as illustration. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=github-octoverse-2026-agents-pull-requests --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 4 — Gemini 4 Carbon and gated access

| Check | Result |
|---|---|
| Body word count | 2,446 words before FAQ, source list and methodology; within the report target of 1,800–3,000. |
| Sources | 9 listed: 9 Tier 1 primary/official or independent-evaluator sources. |
| Fact log | Present at `docs/fact-logs/gated-frontier-models-gemini-4-carbon.md`; benchmark provenance is separated and Argon Fairwind terms are not attributed to Carbon. |
| Original visuals | 4 SVGs parsed and reviewed at 360px: access ladder, benchmark provenance, access/control matrix and Argon-to-Carbon timeline. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | Eight source URLs returned HTTP 200. OpenAI’s source returned 403 to shell `curl`, but its article was retrieved and verified through the research fetcher. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=gated-frontier-models-gemini-4-carbon --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 1 — Anthropic S-1 governance

| Check | Result |
|---|---|
| Body word count | 2,242 words before FAQ, sources and methodology; within the report target of 1,800–3,000. |
| Sources | 8 listed: 6 Tier 1 primary/official and 2 Tier 2 independent reports. |
| Fact log | Present at `docs/fact-logs/anthropic-s1-governance-who-controls.md`; economic rights, general voting power and board-election rights are separated. |
| Original visuals | 4 SVGs parsed and reviewed at 360px: share-class rights, control flow, governance timeline and financial figures. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | Three source URLs returned HTTP 200. Five returned 403 to shell `curl`; their content was retrievable through the research fetcher or search, including the SEC filing, SEC form instructions, CNBC and Fortune. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=anthropic-s1-governance-who-controls --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 3 — Hyperscaler CapEx reconciliation

| Check | Result |
|---|---|
| Body word count | 1,818 words before FAQ, sources and methodology; within the report target of 1,800–3,000. |
| Sources | 8 listed: 5 Tier 1 company sources and 3 Tier 2 reports/transcripts. |
| Fact log | Present at `docs/fact-logs/hyperscaler-capex-2026-reconciled.md`; Amazon’s approximately $220B 2026 cash-CapEx guidance is now verified from its official Q3 release, while the cross-company total remains unreconciled. |
| Original visuals | 3 SVGs parsed and reviewed at 360px: guidance snapshot, reconciliation checks and evidence ladder. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | Official Amazon release, Amazon event page and Microsoft page retrieved through primary sources. Meta, Alphabet and CNBC links returned 403 to shell `curl` but were accessible through the research fetcher; no external link was treated as a dead source solely on the curl response. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=hyperscaler-capex-2026-reconciled --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 2 — OpenAI containment incident and offline training

| Check | Result |
|---|---|
| Body word count | 2,061 words before FAQ, sources and methodology; within the report target of 1,800–3,000. |
| Sources | 8 listed: 8 Tier 1 primary or official security-guidance sources. |
| Fact log | Present at `docs/fact-logs/openai-containment-incident-offline-training.md`; incident claims stay attributed to OpenAI and unavailable details are explicitly marked unknown. |
| Original visuals | 4 SVGs parsed and reviewed at 360px: incident timeline, offline boundary, defense-in-depth layers and claim-boundary table. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | OpenAI and NIST/CISA primary material was retrieved through the research fetcher or official search results. NIST SP 800-190’s official record was confirmed; direct fetch showed an embedded-frame warning. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=openai-containment-incident-offline-training --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 7 — C-DAC AI compute tender

| Check | Result |
|---|---|
| Body word count | 2,048 words before FAQ, sources and methodology; within the report target of 1,800–3,000. |
| Sources | 8 listed: 7 Tier 1 official sources and 1 Tier 2 report. |
| Fact log | Present at `docs/fact-logs/indiaai-10000-gpu-tender-explained.md`; distinguishes request, empanelment, award, provisioning and utilization. |
| Original visuals | 3 SVGs parsed and reviewed at 360px: procurement stages, AICU definition and deployment-measurement ladder. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | C-DAC RFE and both corrigenda, and IndiaAI portal pages, were retrieved from official sources. The Government eProcurement page rejected direct fetch, but its tender-value fields appear in the C-DAC listing. MediaNama was retrieved as secondary context only. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=indiaai-10000-gpu-tender-explained --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 8 — EU AI Act application dates

| Check | Result |
|---|---|
| Body word count | 1,794 words before FAQ, sources and methodology; within the explainer target of 1,200–1,800. |
| Sources | 9 listed: all Tier 1 official legal text or EU guidance. |
| Fact log | Present at `docs/fact-logs/eu-ai-act-december-2026-deadlines.md`; separates Article 5 changes, the Article 50(2) transition and the two high-risk categories. |
| Original visuals | 3 SVGs parsed and reviewed at 360px: overall timeline, December provisions and high-risk classification routes. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | European Commission AI Act Service Desk pages and Commission timeline pages were retrieved. EUR-Lex Official Journal text was confirmed through the official result; its direct fetch returned a brief response. The Official Journal remains the controlling source. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=eu-ai-act-december-2026-deadlines --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 9 — Workforce announcements and AI causation

| Check | Result |
|---|---|
| Body word count | 1,882 words before FAQ, sources and methodology; within the report target of 1,800–3,000. |
| Sources | 8 listed: 4 Tier 1 primary/research sources and 4 Tier 2 reports. |
| Fact log | Present at `docs/fact-logs/ai-in-workforce-plans-october-2026.md`; keeps the Microsoft offer and Dutch FTE target separate and does not infer AI causation. |
| Original visuals | 3 SVGs parsed and reviewed at 360px: announcement matrix, evidence ladder and reporting checklist. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | Microsoft and Dutch Government primary statements, ILO/OECD research and secondary reporting were retrieved. Secondary framing is not treated as primary evidence of causation. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=ai-in-workforce-plans-october-2026 --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 10 — Delegated access for AI agents

| Check | Result |
|---|---|
| Body word count | 1,730 words before FAQ, sources and methodology; within the explainer target of 1,200–3,000. |
| Sources | 8 listed: 7 Tier 1 vendor/standards guidance sources and 1 Tier 2 report. |
| Fact log | Present at `docs/fact-logs/ai-agents-delegated-access-banks-passwords.md`; product capabilities remain attributed and the unsupported bank warning is omitted. |
| Original visuals | 3 SVGs parsed and reviewed at 360px: access patterns, credential flow and control checklist. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. |
| External links | 1Password, Google Cloud, Chrome, Opera, NIST, Google Identity, OWASP and TechCrunch sources were retrieved. Product launch claims are not treated as independent security assessments. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=ai-agents-delegated-access-banks-passwords --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Batch-wide gate

The default ten-article checker passed. All ten packages meet their assigned word-count and source thresholds, include fact logs, three or more original visuals, metadata and parsed schema, and passed article-specific static checks. Cross-article validation confirmed ten unique canonicals, all drafts marked private with `published: null`, all schemas parse, and all 60 social-image variants exist below 200 KB. No public-app paths were changed.

Lighthouse, accessibility testing on live routes, and production-route checks remain separate and were not run: creating or wiring public article routes is outside the authorized draft-only scope.

## Release status

No article was added to the release queue, published or scheduled. Do not publish until the owner changes the current draft-only scope and all gates pass.
