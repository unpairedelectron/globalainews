# Research Notes: Global AI News 70-Article Authority Launch

**Status:** source audit in progress
**Depth:** deep portfolio audit
**Research date:** 2026-10-04
**Audience:** Intelligent non-specialists, technical practitioners, enterprise decision-makers, and readers following AI policy and infrastructure.
**Deliverable:** 70 distinct, source-verified articles (10 each: Brief, Analysis, Explainer, Research, Report, Comparison, Essay) integrated with the maintained newsroom content and authority graph. If every evidence and quality gate passes, public entries will be staged in maintained source for a human Publish; no production database writes or automation runs.

## Plan

- **Question:** Which 70 additional articles can make Global AI News more useful and authoritative without repeating its current coverage or overstating the available evidence?
- **Scope:** The 12 priority clusters in the launch brief, with AI Compute in India and Small Models / Efficient AI as the flagship clusters. Existing articles and research are reference material, not content to rewrite.
- **Out of scope:** Unsupported forecasts, invented authors or credentials, fabricated measurements, unverified current events, production editorial writes, and legacy automation.
- **Evidence rule:** Verify exact source URLs and publication dates. Cite claims at the sentence or table-row level where the format supports it; distinguish primary records, independent reporting, analysis, and uncertainty. Replace topics that cannot meet the evidence gate.

## Current corpus to avoid duplicating

The public maintained corpus currently has 11 stories, including the India AI compute report. Three additional stories appear in the maintained schedule. Existing work covers IndiaAI compute access and metrics, India’s public AI stack, regional compute geography, small-model workflows, inference economics, reliability, provenance, AI in science, an LLM game-theory study, and founder model-call economics.

## Focus Areas

| # | Area | Status | Sources |
|---|---|---|---|
| 1 | India compute, public infrastructure, and AI policy | cross-checking | Dated PIB and C&W records; allocation details remain incomplete |
| 2 | Small models, inference economics, and hardware | cross-checking | Multiple current model cards; vendor results are not independent tests |
| 3 | Agents, enterprise deployment, and reliability | cross-checking | Survey, evaluation and platform records; adoption evidence is limited |
| 4 | Data centres, energy, and AI economics | cross-checking | Dated IEA and C&W pages; definitions and scope must remain explicit |
| 5 | Research methods, safety, provenance, and model releases | cross-checking | Dated official evaluations, model cards and policy records |

## Coverage Checklist

- [ ] Select 10 Briefs with verified, dated developments and no overlap with current coverage.
- [ ] Select 10 Analyses with distinct evidence-backed questions and explicit separation of fact from interpretation.
- [ ] Select 10 Explainers that satisfy durable informational intent for non-specialists.
- [ ] Select 10 original research or original-analysis pieces with explicit questions, methods, findings, limitations, and update metadata.
- [ ] Select 10 updateable Reports that add durable reference value beyond the existing India compute flagship.
- [ ] Select 10 Comparisons using like-for-like evidence and disclosed criteria; no invented benchmark results.
- [ ] Select 10 Essays that clearly distinguish sourced facts from argument and avoid sensationalism.
- [ ] Connect every article to appropriate sources, entities, topics, research/data/report records, timelines, related stories, and SEO metadata; omit links that would be artificial.
- [ ] Verify word counts, citation resolution, first-response content, AMP, indexability, mobile layout, internal links, and publication state before calling the portfolio ready.

## Findings Log

The 70 items are additional to the current public corpus. Full-page records now confirm the 23 September 2026 Cushman & Wakefield India data-centre update; 2026 IEA electricity-demand figures; September model records from Google, OpenAI, xAI and Anthropic; and an 18 September EU KIDS Act proposal that is not law. The UK AISI evaluation, IndiaAI counts and agent-evaluation sources remain candidate evidence, not approval to publish. Vendor-reported model results will be labeled as such.

The 4 October Brief audit added full-page checks for the Cushman & Wakefield coverage, July AIKosh snapshot, Gemini 3.8 Audio card, Gemini Live coverage, Sonnet 5.5 coverage, the Commission’s AI Act enforcement notice, the AISI evaluation coverage, and GPT-6.1 reporting. These checks establish article dates and attributed claims; they do not independently validate vendor performance claims.

- The 1,789 MW operational and 3,860 MW pipeline figures appear in an Economic Times Bureau report and The Tribune’s ANI wire copy, both attributed to Cushman & Wakefield. This corroborates the report’s publication and reported figures, not the underlying market measurement independently.
- PIB reports AIKosh at over 14,000 datasets and 331 models as of July 2026; DD News reported 7,541 datasets and 273 models as of February. The public pages do not define record units, status, deduplication, or usability, so these remain dated institutional snapshots rather than a comparable growth series.
- The Commission’s EU KIDS Act text is a proposal dated 17 September 2026; the Council document is dated 18 September. Euractiv describes it as proposed, not enacted. Keep those dates and legal stages distinct.
- Reuters’ 22 September report and OpenAI’s release page confirm the GPT-6 Sol/Luna launch. Prices and performance numbers remain OpenAI-attributed; OpenAI’s own system disclosures describe evaluation caveats.
- Google DeepMind’s 15 September Gemini 3.8 Audio card lists four audio variants, availability surfaces, and stated limitations. TechTarget’s 16 September report corroborates the launch, but not the vendor’s capability claims.
- xAI’s Grok 4.7 card and release page are first-party evidence. AWS announced Bedrock availability on 28 September; that is a hosting/deployment record, not independent performance validation.
- Reuters and TechCrunch reported Anthropic’s 28 September Sonnet 5.5 release. Anthropic’s system card and speed/cost comparisons remain first-party claims.
- OpenAI’s GPT-6.1 Sol page and 29 September announcement align with The Hindu’s report, updated 30 September. Performance comparisons in the OpenAI page are vendor-reported.
- The European Commission’s enforcement notice is dated 31 July and says the relevant rules apply from 2 August. Check enacted text before describing scope, exceptions, or who is directly obligated.
- AISI’s 30 April GPT-5.5 evaluation and Ars Technica’s May coverage support a bounded benchmark brief. Describe the tasks and attempt counts, not a general forecast of real-world cyber risk.
- Economic Times’ 16 September report is an ET Bureau article; The Tribune’s version is identified as ANI wire copy. Treat these as separate reporting products, but neither independently measures the underlying market.
- Bloomberg’s 19 April coverage of the IEA’s Global Energy Review 2026 supports a distinct energy brief: data-centre electricity use rose about 17% (70 TWh) in 2025, while total global demand rose about 800 TWh. Do not describe all data-centre load as AI load.
- Independent reporting on Grok 4.7 confirms the launch and distribution context, but available benchmark claims remain xAI-reported; AWS availability is not an independent evaluation.
- The 2 August 2026 AI Act date must be described narrowly. Official Commission guidance says GPAI-provider obligations entered application on 2 August 2025, Commission enforcement powers begin 2 August 2026, and pre-existing GPAI models have until 2 August 2027 to comply. Article 113 separately sets staged dates for transparency and other provisions; do not collapse them into one start date.
- The GPT-5.5 cyber-range record is internally inconsistent across public documents: AISI’s 30 April post reports two successful “The Last Ones” attempts out of ten, while OpenAI’s 23 April system-card section reports one out of ten. The attempt budget is 100 million tokens in AISI’s post. The public documents reviewed do not explain the difference; preserve both figures with their source dates rather than selecting one.
- Ten provisional Brief bodies are drafted at 641–766 words each. Their 32 unique citation keys map to 33 source-file rows in `brief-source-map.md`, and every mapped path exists. The app’s release word counter also includes the dek and visible summary fields, which must bring each integrated story to at least 800 words. The TechCrunch Sonnet page capture failed and is excluded; the AISI/OpenAI count discrepancy is explicit.
- Analysis drafts 11–20 are now in `analysis-01-10.md`, with citation keys in `analysis-source-map.md`. Draft 11 uses the IndiaAI portal’s application rules, visible 2025 allocation records, and PIB’s claim that 237 projects accessed subsidised compute covering 93.18 lakh GPU-hours by August 2026; the factsheet does not define whether those hours were allocated, metered, or consumed. Draft 12 compares dated February and July AIKosh totals without calculating a growth rate. All ten Analysis drafts remain provisional and research-only.
- Drafts 13–20 add source-bounded work on AWS Capacity Block pricing, long-context evaluation, agent evaluation and security, Indian data-centre water, LBNL energy scenarios, model-card benchmark disclosures, and India capacity definitions. Caveats remain explicit: recheck AWS’s 7 October 2026 schedule; older long-context studies are not tests of 2026 products; AgentFloor is a preprint; OWASP ACS is project guidance rather than regulation; CEEW water figures are attributed estimates; LBNL’s 2028 figures are scenarios; model-card results are first-party; and India’s national/top-seven capacity figures remain unreconciled.
- The overlap review rejected the EU KIDS Act candidate as a duplicate of Brief 3 and broad data-centre electricity attribution as a duplicate of Brief 2. Replacements are a bounded India water-evidence analysis and an LBNL U.S. demand-scenario analysis. The original generic model-efficiency angle also overlapped existing inference-economics coverage, so Analysis 13 now focuses narrowly on a dated AWS reservation-price change.
- Ten provisional Explainer drafts 21–30 are in `explainers-01-10.md`, with citation keys in `explainer-source-map.md`; body plus visible summary word counts range from 830 to 949, and all mapped paths exist. Candidate 28 is narrowed to AI-text detector limitations because the combined provenance angle overlapped the published watermarking story. The sole quantitative detector example is the bounded 2023 Patterns study. ISO PUE/WUE sources, the OSI AI definition and current model-card examples are captured with their edition, provenance and scope caveats.
- The Research candidate audit avoids duplicating Analysis 12 by replacing the AIKosh count series with a five-record, explicitly purposive audit of visible listing fields. It also narrows the duplicate India capacity-scope candidate to the 13.56-GW label difference: the 13 March PIB release calls it electricity demand, while the 30 March Rajya Sabha answer calls it data-centre capacity. Drafts 31–34 and their source crosswalk are provisional; the five AIKosh listings are not a representative catalog sample, and the two official records do not establish a common methodology.
- Research 32 finds that the seven city values in C&W’s 23 September update sum to 1,755 MW operational and 3,633 MW upcoming, versus top-line values of 1,789 MW and 3,860 MW; the update does not reconcile the row gaps. The 509 MW under-construction plus 3,351 MW planning split does add to 3,860 MW. Research 34 is recast from the duplicate IEA brief into a source-definition comparison of IEA global 2025 growth and LBNL U.S. historical/scenario figures, explicitly not an AI-only estimate.
- Research candidate 40’s September release ledger was rejected because Report 50 and Briefs 4–8 already track the same announcement, card and availability dates. The replacement is a bounded audit of language-specific safety disclosure, distinct from Research 37’s broader safety-domain review. Research 35–40 remain provisional and do not establish independent model performance.
- Research 35–40 are now drafted. Research 35 compares six first-party model-release documents by document type and visible fields; its Mistral source is only an excerpt, so unseen fields remain unknown. Research 36 uses the 2025 agent-evaluation survey taxonomy and treats AgentFloor as one bounded 2026 preprint, not a general ranking.
- Research 37 separates automated safety metrics, red teaming, external testing and domain-specific disclosures across four provider cards. Research 38 distinguishes human approval, tool permissions, identity and audit documentation; it does not test platform behavior. Research 39 compares selected C2PA 2.1 and 2.4 change records and excludes adoption claims. Research 40 codes multilingual-safety disclosure separately from general model-card coverage; Claude’s named seven-language test includes Hindi, while language-support counts and multilingual coding results are not treated as safety outcomes.
- Research drafts 31–40 all exceed 800 words. Body citation keys resolve through `research-source-map.md`, and every mapped source path exists. The full segment remains provisional; no newsroom records or production content were changed.
- Report drafts 41–44 add dated India data-centre capacity, an AIKosh catalog-use guide, an enterprise agent-evaluation checklist, and a threat-to-control reference. They stay separate from the underlying research audits and do not assert independent platform testing.
- Report drafts 45–46 distinguish model-card, system-card, and launch-page records, then map EU AI Act application dates separately from Commission guidance and the proposed EU KIDS Act. The Annex I high-risk transition is 2 August 2028 in the consolidated Article 113 text; do not shorten it to 2027.
- Report 47 broadens the two-source energy comparison in Research 34 into a multi-region evidence register covering IEA, LBNL, CEEW, and IEEFA. CEEW’s 2024 India figures are attributed secondary estimates; IEEFA’s “last year” capacity baseline remains relative because the captured page does not establish that sentence’s publication date.
- Reports 41–50 remain provisional. Each exceeds 800 words; citation keys resolve through `report-source-map.md`, and mapped source paths exist. Report 48 uses weight-only memory estimates rather than performance benchmarks; Report 49 does not treat provenance as factual truth; Report 50 separates announcement, card, and hosting dates. No maintained newsroom records or production content were changed.
- Comparison drafts 51–60 are in `comparisons-01-10.md`, with their provisional citation crosswalk in `comparison-source-map.md`. All ten exceed 800 words and their keys resolve to saved evidence. Replacements avoid overlaps: #52 compares coding-agent benchmark designs; #57 contrasts binding EU AI Act duties with NIST risk guidance; #59 compares xAI and Bedrock distribution of the same named model. #51 preserves the mismatch between OpenAI’s 50% price-reduction headline and the Luna output-price arithmetic. These drafts do not rank model quality, compare unlike GPU prices, or claim provenance proves truth. No newsroom records, production data, app code, or workflows were changed.
- Essay drafts 61–70 are in `essays-01-10.md`, with provisional citations in `essay-source-map.md`. All ten exceed 800 words (849–1,131); every cited key resolves to a captured source. Essay 62 keeps catalog counts separate from quality and treats the five-record AIKosh audit as purposive. Essay 68 distinguishes the proposed EU KIDS Act from enacted DSA Article 28 and uses the Common Sense teen survey only as self-reported U.S. evidence. Essay 67 uses IEA/LBNL scopes rather than claiming an AI-only electricity total. The failed scoping-review capture is excluded. Drafts remain research-only; no newsroom records, production data, app code, or workflows were changed.

## Conflicts & Open Questions

- Initial searches surfaced 40 source mentions across five areas; duplicate URLs and snippet-only records still need deduplication and evidence review.
- A surfaced AWS rate-card figure takes effect after the research date (7 October 2026) and is excluded from current-price claims.
- IndiaAI dataset/model totals differ across dated government reporting; the counts need scope/date reconciliation or must remain explicitly unresolved.
- PIB’s “current” 1,575-MW data-centre capacity line and Cushman & Wakefield’s H1 2026 1,789-MW top-seven-market figure use scopes or definitions not yet reconciled; do not present them as like-for-like national totals or assert one is wrong without a shared method.
- A Google Cloud release-note search snippet gives 15 September for AlphaGenome platform availability, while the fetched release-notes entry identifies 6 July; resolve the exact entry before using it as a dated Brief.
- C2PA’s current site lists specification 2.4 (April 2026); the 1.4 page is not evidence of a new September release.
- OpenAI, xAI and Anthropic model cards are first-party evaluation records. Their benchmark results are not independent cross-vendor comparisons.
- Vendor model specifications and preprint benchmark findings are not independent performance validation; deployment and capability claims must retain that distinction.
- Agent-adoption survey figures lack enough visible sampling detail to support population-level conclusions.
- News briefs and rapidly changing figures need a current-date source check immediately before drafting.
- Public content is selected for the next human Publish; the API’s controlled release queue is separate. No authenticated release-queue mutation or production database write is authorized by this staging choice.

## Gaps

- Deduplicate and register source records; fetch or replace snippet-only evidence before use.
- Cross-check the September model announcements and the EU KIDS Act proposal with independent reporting and their exact official records.
- Reconcile India data-centre scopes and the AlphaGenome release-note date conflict.
- Create the 70-candidate editorial inventory and reject duplicate or weak intents.
- Compare proposed angles with established AI-news coverage to keep the portfolio differentiated.
- Complete article drafts, authority/data integrations, source audits, and technical tests.
- Keep AIKosh in Analysis 12 rather than duplicating it as a Brief; the draft must remain a dated count-method analysis and distinguish itself from the existing India public-stack story.
- Do not count wire republications or cloud-hosting announcements as independent validation of source-reported figures or model performance.
- Resolve or explicitly disclose the AISI/OpenAI GPT-5.5 attempt-count discrepancy in any article using the cyber range.