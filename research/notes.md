# Research Notes: AI Compute in India

**Status:** drafting  
**Depth:** Standard  
**Research date:** 2026-10-03  
**Audience:** Readers who need to distinguish public commitments, enrolled capacity, and compute that people can actually use.  
**Deliverable:** A 3,500–5,000 word flagship report for Global AI News, with verified inline citations, transparent definitions, and an explicit limitations section.

## Plan

- **Question:** How much AI compute is actually accessible in India, what is being built, and which constraints determine whether public policy becomes reliable capacity through 2026?
- **Scope:** IndiaAI Mission compute access, physical data-centre capacity, power and network constraints, public datasets/models, and evidence of real use. Separate funded targets, empanelled supply, installed capacity, live service, and consumed GPU-hours. Do not present estimates as measured facts.
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
- [x] What do current GPU counts measure: empanelment, contracted supply, installed hardware, portal listings, or usable service? Releases move from an initial facility to empanelled/onboarded GPUs and then “shared capacity”; the labels are not a reconciled inventory. [@pib-initial-compute-2025] [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-capacity-and-use-factsheet-2026]
- [x] How many projects and GPU-hours have actually used subsidized compute, as of a clearly dated official release? The August 2026 factsheet reports 237 projects and 93.18 lakh GPU-hours “accessed” or “covering”; it does not define those hours as consumed. [@pib-capacity-and-use-factsheet-2026]
- [x] Who is eligible, what published rates apply, and what evidence exists about application approval, wait times, and utilization? The portal describes user categories and review steps, but the captured pages do not publish wait-time or utilization metrics. [@indiaai-portal-eligibility] [@indiaai-compute-portal] [@indiaai-compute-price-calculator]
- [x] What is operational data-centre capacity versus announced or under-construction capacity, and how are these figures defined? Government and market sources put live stock around 1.5–1.6 GW; Knight Frank separates 0.32 GW under construction from 2.92 GW committed and 5.41 GW early-stage pipeline. [@pib-data-centre-capacity-2026] [@cbre-india-data-centre-market-2025] [@hbl-knight-frank-data-centre-pipeline-2026] [@knight-frank-india-data-centre-market-2025]
- [x] Which power, grid, cooling, and location constraints are documented rather than inferred? National generation adequacy is not local interconnection evidence; independent work describes clustered loads and cooling/water exposure, while public site-level demand remains undisclosed. [@sansad-power-data-centres-2026] [@ceew-data-centre-footprint] [@ieefa-india-data-centre-power] [@pib-data-centre-water-response-2026]
- [x] What verified evidence links public compute and language-data programmes to research, models, startups, or public-service outcomes? Government reports proposal, dataset, prototype and deployment counts, but the reviewed documents do not independently evaluate model quality or resulting user outcomes. [@pib-ai-models-datasets-2026] [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-portal]
- [x] Which conclusions remain unmeasurable because public utilisation or performance data is not disclosed? Live and schedulable GPUs by model/provider, queue times, approval/rejection rates, metered consumption, service reliability, site-level power/water use and independent outcomes move to Limitations. [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-portal] [@ettech-indiaai-recalibration-2026]

## Findings Log

_[@key] markers reference the source registry in `research/sources.json`; they will be rendered as numbered citations in the report._

### IndiaAI policy and capacity record

- The March 2024 Cabinet release authorized ₹10,371.92 crore over five years and compute infrastructure of 10,000+ GPUs; neither figure is a delivery measure. [@indiaai-cabinet-approval-2024]
- January 2025 PIB described roughly 10,000 GPUs in the initial facility and 8,693 additional GPUs to be added; May 2025 PIB then described 34,333 GPUs, including empanelled and additional capacity. The terms are not directly comparable. [@pib-initial-compute-2025] [@pib-common-compute-34000-2025]
- A 2026 PIB release reports 38,231 GPUs onboarded from 14 empanelled providers and an average rate near ₹65 per GPU-hour, excluding selected high-end GPUs. [@pib-compute-onboarded-2026]
- The PIB factsheet says shared compute capacity exceeded 45,000 GPUs as of June 2026; by August it reports 237 projects and 93.18 lakh GPU-hours. “Accessed” does not establish metered consumption. [@pib-capacity-and-use-factsheet-2026]
- ETtech reported access to about 30,000 GPUs against a 45,000 commitment and possible recalibration on 1 October 2026. This is an attributed report, not a government-reconciled count. [@ettech-indiaai-recalibration-2026]

### Access and use

- The portal describes eligibility groups, application review, allocation and empanelled providers; the reviewed material does not give public queue-time, rejection, utilization or reliability series. [@indiaai-portal-eligibility] [@indiaai-compute-portal]
- The portal calculator lists accelerator-specific rates and reservation durations; its capture has no explicit update date or general subsidy rule, so it is not the same measure as PIB’s programme-wide average. [@indiaai-compute-price-calculator] [@pib-compute-onboarded-2026]

### Data-centre capacity and constraints

- Government reported about 1.5 GW of Indian data-centre capacity by 2025; CBRE estimated 1,530 MW of operational stock for January–September 2025. [@pib-data-centre-capacity-2026] [@cbre-india-data-centre-market-2025]
- Knight Frank reporting puts live stock at 1.6 GW in mid-2026 and separates a further 0.32 GW under construction, 2.92 GW committed, and 5.41 GW early-stage; those June components sum to 8.65 GW, not the article’s 8.33 GW headline. The year-end 2025 report separately cites 322 MW under construction and an 8.3 GW long-term pipeline, with different stage definitions. [@hbl-knight-frank-data-centre-pipeline-2026] [@knight-frank-india-data-centre-market-2025] [@jll-india-data-centres-2026]
- A parliamentary answer says national power availability is adequate and gives 524 GW of installed generation as of February 2026; it does not establish local connection capacity for individual data-centre projects. [@sansad-power-data-centres-2026]
- CEEW and IEEFA describe energy, water and location pressures; CEEW’s national electricity/water values depend on underlying third-party estimates, while IEEFA’s future values are projections. [@ceew-data-centre-footprint] [@ieefa-india-data-centre-power]
- A government statement that no water-consumption concerns had been received is a statement about reported concerns, not a measured national footprint. [@pib-data-centre-water-response-2026]

### Models, datasets and reported outcomes

- PIB reports 20 selected foundation-model proposals from 506 applications, including 12 multimodal and eight small-language-model proposals; its factsheet also reports 14,000+ AI Kosh datasets and 331 models as of July 2026. These are programme outputs, not independent capability or impact evaluations. [@pib-capacity-and-use-factsheet-2026] [@pib-ai-models-datasets-2026]

## Conflicts & Open Questions

- Public counts range from 18,693 in an early rollout description to 34,333, 38,231 onboarded and 45,000+ shared GPUs. They are dated snapshots with different labels, not one verified installed/live series. [@pib-initial-compute-2025] [@pib-common-compute-34000-2025] [@pib-compute-onboarded-2026] [@pib-capacity-and-use-factsheet-2026]
- ETtech’s reported access to about 30,000 GPUs against a 45,000 commitment does not reconcile with the government’s later “shared capacity” phrase; present both with attribution and stage labels. [@ettech-indiaai-recalibration-2026] [@pib-capacity-and-use-factsheet-2026]
- Knight Frank’s June 2026 article gives an 8.33 GW pipeline headline, but its listed 0.32, 2.92 and 5.41 GW stages sum to 8.65 GW. Do not silently reconcile the source’s arithmetic; preserve the headline and components with a caveat. [@hbl-knight-frank-data-centre-pipeline-2026]
- “93.18 lakh GPU-hours” is reported for 237 projects, but neither the factsheet nor portal capture defines whether those hours are reserved, provisioned, approved or consumed. [@pib-capacity-and-use-factsheet-2026] [@indiaai-compute-portal]
- Operational data-centre estimates cluster around 1.5–1.6 GW, but source dates and definitions differ; future pipeline totals include projects that are not operating. These are all-workload totals, not IndiaAI GPU capacity. [@pib-data-centre-capacity-2026] [@cbre-india-data-centre-market-2025] [@hbl-knight-frank-data-centre-pipeline-2026] [@knight-frank-india-data-centre-market-2025]

## Gaps

- **Moved to Limitations after targeted checks:** live/schedulable GPU count by accelerator and provider; queue times, approvals and rejections; whether GPU-hours are metered consumption; service-level reliability; site-level grid, power and water use; independent model or public-service outcome evaluations. Do not infer these from empanelment, portal listings, programme targets, or aggregate project counts.