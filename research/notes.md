# Research Notes: AI Compute in India

**Status:** drafting  
**Depth:** Standard  
**Research date:** 2026-10-04
**Audience:** Readers who need to distinguish public commitments, enrolled capacity, and compute that people can actually use.  
**Deliverable:** A 3,500–5,000 word flagship report for Global AI News, with verified inline citations, transparent definitions, and an explicit limitations section.

## Plan

- **Question:** How much AI compute is actually accessible in India, what is being built, and which constraints determine whether public policy becomes reliable capacity through 2026?
- **Scope:** IndiaAI Mission compute access, physical data-centre capacity, power and network constraints, public datasets/models, and evidence of real use. Keep target, empanelled, onboarded, installed, schedulable, reserved, and metered use distinct. Do not present estimates as measured facts.
- **Out of scope:** Unverified forecasts, unsupported rankings, and claims about national AI “sovereignty” that cannot be tied to observable capacity or access.
- **Evidence rule:** Each major claim needs three supporting sources, including at least two Tier 1 or Tier 2 sources. Company and government promotional statements must be identified as such and cross-checked.

## Focus Areas

| # | Area | Status | Sources |
|---|---|---|---|
| 1 | IndiaAI policy, funding, procurement, and programme definitions | done | 6 |
| 2 | Compute Portal supply, eligibility, pricing, applications, and actual usage | done | 5 |
| 3 | Data-centre capacity, construction pipeline, and geographic distribution | done | 7 |
| 4 | Electricity, grid access, energy use, cooling, and network constraints | done | 5 |
| 5 | Domestic models, language data, research, and evidence of user outcomes | done | 3 |

## Coverage Checklist

- [x] What did the IndiaAI Mission authorize, fund, and procure, and over what period? The Cabinet approved ₹10,371.92 crore over five years and a compute infrastructure target of 10,000+ GPUs; this is programme design, not proof of delivery. [@indiaai-cabinet-approval-2024]
- [x] What do GPU counts measure: target, empanelment, onboarding, installation, portal allocations, or usable service? A primary IndiaAI page lists dated project allocations and an official provider/category PDF lists 45,081 combined entries, but the latter has no printed as-of date, count definition, or status crosswalk and includes non-GPU accelerator categories. A June 2025 secondary report gives an early installed count; PIB later reports 38,231 and “nearly 38,000” onboarded, then 45,000+ shared. No reviewed source is a complete current hardware inventory. [@indiaai-compute-allocation-register-2026] [@indiaai-provider-accelerator-table-2026] [@ettech-indiaai-installed-2025] [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-onboarded-nearly-38000-2026] [@pib-capacity-and-use-factsheet-2026]
- [x] What does the public record establish about allocations and metered use? The August 2026 factsheet reports 237 projects and 93.18 lakh GPU-hours; neither “accessed” nor “covering” is defined as reserved or metered consumption, and the dated allocation rows do not say whether users started. [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-allocation-register-2026]
- [x] Who is eligible, what published rates apply, and what evidence exists about application approval, wait times, and utilization? The portal describes user categories and review steps, but the captured pages do not publish wait-time or utilization metrics. [@indiaai-portal-eligibility] [@indiaai-compute-portal] [@indiaai-compute-price-calculator]
- [x] What is operational data-centre capacity versus announced or under-construction capacity, and how are these figures defined? Government and market sources put live stock around 1.5–1.6 GW; Knight Frank separates 0.32 GW under construction from 2.92 GW committed and 5.41 GW early-stage pipeline. [@pib-data-centre-capacity-2026] [@cbre-india-data-centre-market-2025] [@hbl-knight-frank-data-centre-pipeline-2026] [@knight-frank-india-data-centre-market-2025]
- [x] Which power, grid, cooling, and location constraints are documented rather than inferred? National generation adequacy is not local interconnection evidence; independent work describes clustered loads and cooling/water exposure, while public site-level demand remains undisclosed. [@sansad-power-data-centres-2026] [@ceew-data-centre-footprint] [@ieefa-india-data-centre-power] [@pib-data-centre-water-response-2026]
- [x] What verified evidence links public compute and language-data programmes to research, models, startups, or public-service outcomes? Government reports proposal, dataset, prototype and deployment counts, but the reviewed documents do not independently evaluate model quality or resulting user outcomes. [@pib-ai-models-datasets-2026] [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-portal]
- [x] Which conclusions remain unmeasurable because public utilisation or performance data is not disclosed? Current schedulable GPUs by model/provider, active reservations, metered consumption, queue times, approvals/rejections, service reliability, site-level power/water use and independent outcomes move to Limitations. [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-allocation-register-2026] [@indiaai-compute-portal]

## Findings Log

_[@key] markers reference the source registry in `research/sources.json`; they will be rendered as numbered citations in the report._

### IndiaAI policy and capacity record

- The March 2024 Cabinet release authorized ₹10,371.92 crore over five years and compute infrastructure of 10,000+ GPUs; neither figure is a delivery measure. [@indiaai-cabinet-approval-2024]
- January 2025 PIB described roughly 10,000 GPUs in the initial facility and 8,693 additional GPUs to be added; May 2025 PIB then described 34,333 GPUs, including empanelled and additional capacity. The terms are not directly comparable. [@pib-initial-compute-2025] [@pib-common-compute-34000-2025]
- The IndiaAI hub page exposes dated user-allocation rows (visible dates span 23 April–30 May 2025) with GPU count/type, provider, project duration and a required start-by date. It does not state whether jobs started or whether allocated GPUs remain active, and it is not a complete installed or schedulable inventory. [@indiaai-compute-allocation-register-2026]
- ET reported a little over 17,300 GPUs successfully installed at a 16 June 2025 review, citing people aware of the meeting and provider progress. This is secondary reporting on an earlier rollout, not an official or current status count. [@ettech-indiaai-installed-2025]
- A 2026 PIB release reports 38,231 GPUs onboarded from 14 empanelled providers and an average rate near ₹65 per GPU-hour, excluding selected high-end GPUs. [@pib-compute-onboarded-2026]
- A 29 July 2026 PIB release again says “nearly 38,000” GPUs had been onboarded; it provides no exact update or definition connecting onboarded devices to the factsheet’s separate “shared capacity” stage. [@pib-onboarded-nearly-38000-2026] [@pib-capacity-and-use-factsheet-2026]
- The PIB factsheet says shared compute capacity exceeded 45,000 GPUs as of June 2026; by August it reports 237 projects and 93.18 lakh GPU-hours. “Accessed” does not establish metered consumption. [@pib-capacity-and-use-factsheet-2026]
- ETtech reported access to about 30,000 GPUs against a 45,000 commitment and possible recalibration on 1 October 2026. This is an attributed report, not a government-reconciled count. [@ettech-indiaai-recalibration-2026]
- **Dated-source search (4 October 2026):** The official IndiaAI Compute Portal hosts a provider/category PDF whose file metadata records creation and modification on 2 September 2026. It has 14 numbered bidder or consortium rows and a displayed total of 45,081, but no printed publication/as-of date or definition of what the counts measure. NVIDIA and AMD columns add to 38,085; Intel Gaudi, AWS Trainium/Inferentia, and Google Trillium columns add to 6,996. These are category-column sums, not a source-defined GPU-only or operational denominator. The PDF does not connect these counts to empanelled, onboarded, installed, shared, accessed, reserved, or schedulable stages. It therefore does not reconcile 34,333, 38,231/nearly 38,000, 45,000+, or about 30,000. [@indiaai-provider-accelerator-table-2026] [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-onboarded-nearly-38000-2026] [@pib-capacity-and-use-factsheet-2026] [@ettech-indiaai-recalibration-2026]

### Access and use

- The portal describes eligibility groups, application review, allocation and empanelled providers; the reviewed material does not give public queue-time, rejection, utilization or reliability series. [@indiaai-portal-eligibility] [@indiaai-compute-portal]
- The portal calculator lists accelerator-specific rates and reservation durations; its capture has no explicit update date or general subsidy rule, so it is not the same measure as PIB’s programme-wide average. [@indiaai-compute-price-calculator] [@pib-compute-onboarded-2026]

### Data-centre capacity and constraints

- Government reported about 1.5 GW of Indian data-centre capacity by 2025; CBRE estimated 1,530 MW of operational stock for January–September 2025. [@pib-data-centre-capacity-2026] [@cbre-india-data-centre-market-2025]
- The 13.56 GW figure is inconsistent across official sources: PIB (13 March 2026) calls it projected data-centre electricity demand for 2031–32; the Rajya Sabha answer (30 March 2026) calls it projected data-centre capacity. Do not treat the definitions as reconciled. [@pib-data-centre-capacity-2026] [@sansad-power-data-centres-2026]
- Knight Frank reporting puts live stock at 1.6 GW in mid-2026 and separates a further 0.32 GW under construction, 2.92 GW committed, and 5.41 GW early-stage; those June components sum to 8.65 GW, not the article’s 8.33 GW headline. The year-end 2025 report separately cites 322 MW under construction and an 8.3 GW long-term pipeline, with different stage definitions. [@hbl-knight-frank-data-centre-pipeline-2026] [@knight-frank-india-data-centre-market-2025] [@jll-india-data-centres-2026]
- A parliamentary answer says national power availability is adequate and gives 524 GW of installed generation as of February 2026; it does not establish local connection capacity for individual data-centre projects. [@sansad-power-data-centres-2026]
- CEEW and IEEFA describe energy, water and location pressures; CEEW’s national electricity/water values depend on underlying third-party estimates, while IEEFA’s future values are projections. [@ceew-data-centre-footprint] [@ieefa-india-data-centre-power]
- A government statement that no water-consumption concerns had been received is a statement about reported concerns, not a measured national footprint. [@pib-data-centre-water-response-2026]

### Models, datasets and reported outcomes

- PIB reports 20 selected foundation-model proposals from 506 applications, including 12 multimodal and eight small-language-model proposals; its factsheet also reports 14,000+ AI Kosh datasets and 331 models as of July 2026. These are programme outputs, not independent capability or impact evaluations. [@pib-capacity-and-use-factsheet-2026] [@pib-ai-models-datasets-2026]

## Conflicts & Open Questions

- Public counts include 34,333 empanelled-plus-additional, 17,300+ reportedly installed in June 2025, 38,231 onboarded in March 2026, nearly 38,000 onboarded in a July 2026 PIB release, and 45,000+ shared as of June 2026. The September-metadata IndiaAI provider/category table adds a displayed total of 45,081 but has no stated inventory date, status definition, or comparable denominator. These sources do not form a verified installed/live series or a crosswalk. [@pib-common-compute-34000-2025] [@ettech-indiaai-installed-2025] [@pib-compute-onboarded-2026] [@pib-onboarded-nearly-38000-2026] [@pib-capacity-and-use-factsheet-2026] [@indiaai-provider-accelerator-table-2026]
- The primary portal allocation register establishes dated project-level allocation records but does not bridge them to hardware delivery, installation, current active reservations, or currently schedulable supply. [@indiaai-compute-allocation-register-2026]
- ETtech’s reported access to about 30,000 GPUs against a 45,000 commitment does not reconcile with the government’s “shared capacity” or “onboarded” statements; present all with attribution and stage labels. [@ettech-indiaai-recalibration-2026] [@pib-capacity-and-use-factsheet-2026] [@pib-onboarded-nearly-38000-2026]
- Knight Frank’s June 2026 article gives an 8.33 GW pipeline headline, but its listed 0.32, 2.92 and 5.41 GW stages sum to 8.65 GW. Do not silently reconcile the source’s arithmetic; preserve the headline and components with a caveat. [@hbl-knight-frank-data-centre-pipeline-2026]
- “93.18 lakh GPU-hours” is reported for 237 projects, but no reviewed source defines the hours as reserved, provisioned, approved, metered, or consumed. The allocation table is project-level GPU assignment evidence, not a time-use ledger. [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-allocation-register-2026] [@indiaai-compute-portal]
- Operational data-centre estimates cluster around 1.5–1.6 GW, but source dates and definitions differ; future pipeline totals include projects that are not operating. These are all-workload totals, not IndiaAI GPU capacity. [@pib-data-centre-capacity-2026] [@cbre-india-data-centre-market-2025] [@hbl-knight-frank-data-centre-pipeline-2026] [@knight-frank-india-data-centre-market-2025]

## Gaps

- **Moved to Limitations after targeted checks:** current live/schedulable GPU count by provider and accelerator; the relationship among empanelled, onboarded, installed and shared totals; active reserved capacity; whether reported GPU-hours are metered consumption; queue times, approvals/rejections, service reliability; site-level grid, power and water use; independent model or public-service outcome evaluations. The 2 September PDF metadata is not an inventory-as-of date, and its aggregate does not define a status or denominator; it cannot close the availability gap. Do not infer these from targets, allocations, or aggregate project counts.