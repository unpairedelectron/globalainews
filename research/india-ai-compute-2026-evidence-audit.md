# India AI compute report: final evidence audit

**Audit date:** 2026-10-03  
**Scope:** The quantitative claims and operational-status distinctions in `india-ai-compute-2026.md`, checked against the source records and direct public-source captures.  
**Result:** The central counts retain their source wording and dates. One overbroad statement about programme scale was narrowed, and the conflicting official descriptions of 13.56 GW are now explicit. This audit does not establish current schedulable capacity.

## Quantitative claim checks

| Claim | Exact source and publication date | What the source establishes | Safe interpretation |
| --- | --- | --- | --- |
| ₹10,371.92 crore mission outlay; target above 10,000 GPUs | [PIB Cabinet approval, 2024-03-07](https://pib.gov.in/PressReleasePage.aspx?PRID=2012355), primary | Approved five-year programme outlay and a common-compute target | Policy approval and target, not delivered or installed capacity |
| About 10,000 initial GPUs; 8,693 more to be added | [PIB rollout release, 2025-01-30](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2097709), primary | The release describes an initial facility and a forthcoming additional tranche | Dated rollout statement; does not confirm that the extra tranche was installed, deployed, or schedulable |
| 34,333 GPUs: 18,417 empanelled plus 15,916 additional | [PIB common-compute release, 2025-05-30](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817&lang=1&reg=3), primary | The stated components add to the stated total | Preserve the source’s two statuses; it does not define all units as installed, live, or consumed |
| 38,231 GPUs onboarded from 14 providers; an average rate near ₹65/GPU-hour, except selected high-end GPUs | [PIB release, 2026-03-25](https://pib.gov.in/PressReleasePage.aspx?PRID=2245063), primary | Government-reported onboarding and pricing terms | “Onboarded” is not a provider-level operational inventory or a measure of currently free capacity |
| 45,000+ shared GPUs as of June 2026; 237 projects and 93.18 lakh GPU-hours by August | [PIB factsheet, 2026-08-13](https://www.pib.gov.in/FactsheetDetails.aspx?Id=150860&lang=1&reg=48), primary | A June-dated shared-capacity figure and August programme-activity totals | The factsheet does not provide an exact June day or define GPU-hours as reserved, provisioned, metered, or consumed |
| About 30,000 GPUs accessible against a 45,000 commitment | [ETtech, 2026-10-01](https://m.economictimes.com/tech/technology/indiaai-mission-likely-to-rewire-after-gpu-glitch/amp_articleshow/134600368.cms), secondary | A reported access estimate and commitment comparison | Attribute to ETtech; it is not a government-reconciled, provider-level, or live availability feed |
| Data-centre capacity: about 375 MW in 2020 and around 1,500 MW by 2025 | [PIB release, 2026-03-13](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2239616&lang=1&reg=3), primary | Government-reported aggregate data-centre capacity | All-workload facility capacity, not AI-only capacity or an IndiaAI GPU count |
| 13.56 GW by 2031–32 | [PIB release, 2026-03-13](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2239616&lang=1&reg=3) and [Rajya Sabha answer, 2026-03-30](https://sansad.in/getFile/annex/270/AU4151_DoYAWR.pdf?source=pqars), both primary | PIB calls the value estimated data-centre electricity demand; the parliamentary answer calls the same value projected data-centre capacity | Official descriptions conflict. The report now says so; the value is not GPU supply or present site-level power availability |
| About 1,530 MW operational stock in January–September 2025 | [CBRE, 2025-11-12](https://www.cbre.co.in/insights/reports/india-s-data-centre-market-in-a-new-era), secondary market estimate | CBRE’s estimate of operational stock for its stated period | A dated market estimate; not a government register or AI-only measure |
| 1.6 GW live; 0.32 GW under construction, 2.92 GW committed, 5.41 GW early-stage; 8.33 GW headline | [The Hindu BusinessLine reporting Knight Frank, 2026-06-20](https://www.thehindubusinessline.com/info-tech/indias-data-centre-capacity-pipeline-hits-833-gw-amid-ai-and-cloud-boom/article71125654.ece), secondary | The article states a live-stock figure and three pipeline stages | The stages sum to 8.65 GW, not 8.33 GW. The report preserves both the headline and components without inventing a reconciliation; pipeline stages are not operating supply |
| 1.6 GW current capacity; 322 MW under construction; 8.3 GW long-term pipeline | [Knight Frank, *India Data Centre Market Update 2025*](https://content.knightfrank.com/research/3111/documents/en/india-data-centre-market-update-2025-12895.pdf), secondary | A separate 2025-edition market estimate with differently described stages | It is a year-end 2025 snapshot, not current IndiaAI capacity. The PDF/source registry does not establish an exact publication day |
| Around 0.5% of national electricity use and about 150 billion litres of water in 2024; both projected to more than double by 2030 | [CEEW white paper, February 2026](https://www.ceew.in/sites/default/files/ceew-data-centre-study-web-ready-final.pdf), secondary synthesis | CEEW repeats underlying third-party estimates (Cornell 2025 and Mordor Intelligence 2025) and projections | Not a government meter-based national inventory; retain attribution, source lineage, and projected status |
| Roughly two million litres/day for cooling a 100 MW hyperscale facility | [CEEW white paper, February 2026](https://www.ceew.in/sites/default/files/ceew-data-centre-study-web-ready-final.pdf), secondary estimate | A facility-scale estimate printed in the paper | Not measured site-level consumption; actual use depends on climate, cooling design, water source, and operating profile |
| “No concerns received” on data-centre water consumption | [PIB response, 2026-03-30](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2246886&lang=1&reg=6), primary | A statement about concerns reported to the ministry and cooling approaches | Not evidence of zero use, a national water-use total, or absence of local water stress |

### Provenance gaps noted

- The 2025 Knight Frank PDF and February 2026 CEEW white paper show the edition/month, but the source registry does not contain an exact publication day. The audit preserves that limitation rather than assigning a date.
- The public IndiaAI portal documents eligibility, providers, and allocation steps, but the reviewed pages did not provide a dated provider/facility inventory with accelerator type, live status, and free/schedulable quantity.
- `93.18 lakh GPU-hours` remains “accessed” as written by PIB. No reviewed source defines the metering boundary or establishes consumed hours.
- Programme totals, provider onboarding, “shared” capacity, reported access, and all-workload data-centre capacity are different measures and must not be added or treated as interchangeable.

## Dated observation asset decision

`src/data/indiaai-compute-observations.ts` stores only dated, source-linked public claims. It is a historical observation ledger, **not** a GPU inventory. The record has explicit status, exact or qualified quantity, source kind, report date, stated “as of” date when the source supplies one, and limitations. Facility/provider and accelerator-type fields are not populated where the sources do not identify them.

Every observation currently records schedulable availability as `not-established`. Announced, installed, deployed, accessible, and schedulable states are not inferred from one another. No live-inventory page or current availability estimate was created.

## Report and relationship checks

- The report retains 18 ordered citations. The research-report test checks citation resolution, source order, word-count bounds, and the generated Markdown mirror.
- The report is connected to its India topic, IndiaAI entity, source records, timeline records, and related maintained stories by the typed authority registry.
- The prepared small-models/efficient-AI/serious-workflows cluster has linked existing stories and sources but remains non-indexable; it does not create an empty public page or mass-publish content.
- First-response article rendering, AMP, report metadata, RSS, sitemap, and public DTO projection remain covered by the local smoke suite. This audit did not write production content or invoke automation.