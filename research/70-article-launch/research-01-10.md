# Research drafts 31–40

**Status:** provisional draft set. Drafts 31–40 are included; none is approved for publication or integrated into newsroom records.
**Research date:** 4 October 2026.
**Citation convention:** Inline `[@key]` references map through `research-source-map.md`; these are research-only keys, not live newsroom source IDs.
**Byline:** unassigned; do not invent a named author or credentials.

## 31. What five AIKosh listings reveal about dataset access

**Slug:** `research-aikosh-listing-field-audit`  
**Topic:** Public dataset access  
**Proposed dek:** Five AIKosh pages show why discoverability, permission and practical access should be checked separately. The sample is small and purposive, not a verdict on the whole catalog.

### The research question is about what a listing lets a user verify

AIKosh presents datasets and other resources through public listing pages. A listing can help a prospective user find an item, but discovery alone does not answer whether it can be reused, whether access is restricted, where the file is hosted, or who supplied it. This review asks a narrower question than “How many datasets does AIKosh contain?”: what access and provenance fields are visible on a record before a user relies on it?

On 4 October 2026, five detail pages were inspected: Geochemical data, bhasha-sft_aya_dataset, PDMC Dataset, Repertory Grant Scheme, and Principal Commodity 2022-23 Import. They were selected purposively to include different sectors and displayed states for license, visibility and hosting. This is a five-record qualitative sample, not a random draw. It cannot estimate how common any field value is across AIKosh. [@aikosh-dataset-page-sample-2026-10-04]

The review codes only information displayed on the pages: license, visibility, hosted or redirected status, coverage, source attribution, dataset type, frequency and the presence of a beta quality score. It does not download the files, reproduce the quality score, test the data, or provide legal advice. The platform terms are read as general conditions, not as a replacement for item-specific permissions. [@aikosh-platform-terms-2026]

### A small record-by-record audit

| Listing | License shown | Visibility | Delivery | Other visible details |
|---|---|---|---|---|
| Geochemical data | `NA` | Open | Hosted | GSI; Rajasthan coverage; unstructured; beta score shown |
| bhasha-sft_aya_dataset | CC BY 4.0 | Open | Hosted | Soket Labs; India coverage; structured speech-to-text data; beta score shown |
| PDMC Dataset | `NA` | Restricted | Hosted | Department of Agriculture & Farmers Welfare; structured, monthly; beta score shown |
| Repertory Grant Scheme | Open Government License, India | Open | Hosted | IndiaAI; structured, annual; no score displayed |
| Principal Commodity 2022-23 Import | Open Government License, India | Open | Redirected | DGCIS is named as author; IndiaAI is listed as source organisation; structured, static |

The table preserves the values printed on the captured pages. The details page for Geochemical data identifies GSI as the author and source organisation, gives Rajasthan coverage, and reports a beta score of 3. The Bhasha record names a commercial source organisation, indicates India-wide coverage, and displays CC BY 4.0. The PDMC page lists the agriculture department, a restricted visibility value and a monthly frequency. The Repertory record shows an Open Government License and annual frequency, while the Principal Commodity page carries the same license but sends the user to a redirected resource. [@aikosh-dataset-page-sample-2026-10-04]

### Visibility and license answer different questions

The clearest contrast is between the two records whose license field says `NA`. Geochemical data is marked `Open`; the PDMC Dataset is marked `Restricted`. The sample therefore shows why a reader should record both fields instead of treating an access label as a reuse permission. “Open” describes the page's visibility setting; it does not, by itself, tell a user which copying, modification or redistribution rights apply. And `NA` is only the value displayed in the license field. This review does not reinterpret it as public domain, permission to reuse, or proof that a separate license does not exist.

The platform's Terms of Use describe artifacts as being made available under specified licenses and end-use terms. That points users toward item-level conditions, not toward one blanket permission for everything listed. A prospective user should open the record, inspect the license and any linked end-use conditions, and contact the contributor if the page leaves an essential term unclear. A visibility flag should not substitute for that check. [@aikosh-platform-terms-2026]

The two records with Open Government License, India labels show another distinction: the license field is visible, but the delivery mode can still differ. Repertory Grant Scheme is marked hosted; Principal Commodity 2022-23 Import is marked redirected. A redirect means a user may need to inspect the destination, its file version, and any source-owner conditions before relying on a download link. The listing's declared license is relevant evidence, but this page audit did not follow every possible link or assess whether a destination copy remains current.

### Provenance and data-quality fields need interpretation

The pages expose useful descriptive fields, but the labels are not uniform in how much they establish. Coverage, sector, author, source organisation and date can help someone identify whether a record fits a project. A source organisation may not be the same entity that hosts the file, and an uploader name does not necessarily establish who created or maintains the underlying data. The Principal Commodity listing, for example, names DGCIS as author, IndiaAI as source organisation, and marks the content as primary data while also showing a redirect. These are clues to follow up, not proof of a complete chain of custody.

Three of the five sampled pages display a numeric beta quality score; two show no score. The details pages expose component categories such as integrity, consistency and documentation on some records. A visible score can help a user decide what questions to ask, but this review does not establish the scoring rubric, the assessors, the data used to calculate the score, or whether the rating was independently validated. The label “beta” is a reason to treat it as provisional platform metadata rather than a general certificate that a dataset is fit for a particular model or policy decision. [@aikosh-dataset-page-sample-2026-10-04]

The same caution applies to a `Structured` or `Unstructured` label. It is a useful high-level description, not a substitute for opening a sample file, checking columns or schema, verifying units, and testing missingness. A monthly frequency says something about the listed update cadence; it does not prove that a new observation is available every month. The 2022-23 import record's `Static` frequency describes the page's stated status, not the accuracy of the underlying trade values.

### A practical check before using a listed dataset

Before downloading or citing a record, a user can work through a short sequence:

1. **Confirm the exact artifact.** Record its title, source, page date, version and destination URL.
2. **Check access and permission separately.** Read both the visibility field and the item-level license or end-use terms. If either is missing or unclear, pause before reuse.
3. **Trace the source.** Distinguish the author, source organisation, uploader and host. Follow a redirect and check whether the destination names the same owner and version.
4. **Inspect the actual material.** Compare the description and metadata with the downloaded file, schema, units, coverage and dates. A listing summary is not a data validation.
5. **Treat quality indicators as leads.** Note whether a score is beta and what components are shown; do not assume that it measures suitability for the intended task.

This process is useful even when a page looks complete. Rights, technical usability and scientific quality are different checks. A dataset can be easy to download yet have a license gap; a well-documented file can still be unsuitable for a task; and a strong quality score cannot answer whether a model-training use is permitted.

### What this sample does not establish

Five purposively selected records cannot support a catalog-wide percentage, a ranking of contributors or a conclusion that AIKosh's metadata is generally complete or incomplete. Pages can change after capture, and different categories may use different field practices. The review does not infer that restricted visibility is caused by a missing license, that a redirected file is less trustworthy, or that a displayed score predicts model performance.

The result is more limited and more useful: AIKosh pages can expose distinct fields for license, visibility and delivery, and users should not collapse them into one yes-or-no judgment about reuse. A larger study could sample records randomly across sectors and compare listing metadata with actual files, licenses and destination pages. Until then, these five records are examples that demonstrate the questions to ask, not a measure of the platform as a whole.

**Bottom line:** Before using an AIKosh dataset, check its license, visibility, source and delivery path as separate fields; this five-page sample is illustrative, not catalog-wide.

**Why it matters:** A record can be discoverable without clearly establishing permission, currentness or fitness for a particular use.

**Key takeaways:**
- `Open` visibility and a reuse license are different pieces of information.
- A `NA` license value is not interpreted here as permission or public-domain status.
- Quality scores are beta page metadata, not independent dataset validation.
- The five records were selected to show different fields and cannot represent the full catalog.

**What changes:** Users should retain a dated copy of the item page and verify the destination file and reuse terms before building on it.

**Evidence note:** Five official AIKosh detail pages and the platform Terms of Use were captured on 4 October 2026. No data files were downloaded or independently tested.

## 32. Seven market rows, two unresolved data-centre sums

**Slug:** `research-cw-seven-market-row-sum-audit`  
**Topic:** Infrastructure data audit  
**Proposed dek:** Cushman & Wakefield’s city-level figures add to less than its top-line operational and upcoming-supply totals. The gaps are measurable; the source does not explain them.

### Audit the rows before reusing the total

Cushman & Wakefield’s 23 September 2026 India Data Centre H1 2026 update gives operational-capacity and upcoming-supply values for seven markets. It also reports 1,789 MW of operational capacity and 3,860 MW of supply expected by 2030. These figures are useful as a dated market snapshot, but the individual rows invite a simple check: do the seven listed market values add to the published totals? [@cw-india-dc-h1-2026]

The reported market rows are:

| Market | Operational capacity (MW) | Upcoming supply (MW) |
|---|---:|---:|
| Mumbai | 890 | 1,726 |
| Hyderabad | 151 | 710 |
| Chennai | 214 | 368 |
| Delhi NCR | 183 | 387 |
| Pune | 133 | 258 |
| Bengaluru | 162 | 100 |
| Kolkata | 22 | 84 |
| **Sum of seven displayed rows** | **1,755** | **3,633** |

The report’s separate top-line figures are 1,789 MW operational and 3,860 MW expected supply. On direct addition, the city values fall short by 34 MW for operational capacity and 227 MW for upcoming supply. The upcoming-supply total is itself broken down as 509 MW under construction and 3,351 MW in the planning stage; those two stage totals add to 3,860 MW. [@cw-india-dc-h1-2026]

### Keep two different questions separate

The first arithmetic check asks whether the market rows reproduce the top-line total. They do not. The second asks whether the total’s own component stages add correctly. The 509 MW under construction plus 3,351 MW in the planning stage equals the reported 3,860 MW. That internal addition does not resolve the gap between the market-specific values and the top-line supply figure.

The two gaps should not be combined into a single “missing capacity” amount. One is an operational-capacity difference; the other concerns upcoming supply, which includes future project stages. Nor does the subtraction show that a particular city or project was omitted. The source does not state whether the difference reflects other markets, a different universe of projects, cut-off dates, rounding, or a reporting adjustment. Without that explanation, assigning the residual to a specific cause would be speculation.

The operational total is introduced as capacity across the country’s top seven markets, while the city-level descriptions name those seven markets. The release also discusses a 3,860 MW supply pipeline and describes upcoming capacity across leading markets. It does not provide a reconciliation table showing how each city row contributes to each aggregate or state explicitly why the two row sums differ. The safest statement is therefore that the report’s displayed values do not fully reconcile arithmetically on the page reviewed. [@cw-india-dc-h1-2026]

### Preserve the source’s stage language

The report uses “operational capacity” for the existing market rows and “upcoming supply” for future development. At the aggregate level, it distinguishes 509 MW under construction from 3,351 MW in the planning stage. Those categories are not interchangeable: construction has begun for one group, while planning describes a less advanced project stage. A reader should not add all 3,860 MW to operational stock or describe it as capacity customers can use now.

The report does not break every city’s upcoming value into under-construction and planning components in the prose captured here. That means the aggregate split cannot be mapped back to the seven city amounts from the source alone. A follow-on data table would need to retain the stage for each project, the geography used, and the reporting cut-off date. This audit does not reclassify any project or infer commissioning schedules.

The H1 2026 release also says that the seven markets added 178 MW during the first half of the year. This is a period flow, while 1,789 MW is an operational-stock figure at the reporting date. A reader should keep the additions and the stock in separate columns. The city values are market-level snapshots, not project-level records, and the page does not supply a list that lets an outside reader independently rebuild each city’s total from facilities.

### What independent reporting can and cannot confirm

News coverage can establish that a market report was published and that its numbers were publicly attributed to Cushman & Wakefield. It does not independently measure the capacity in the report. The project notes identify Economic Times Bureau coverage and The Tribune’s ANI copy as derivative reporting of the same publisher’s update, not separate market inventories. The arithmetic in this article comes from the C&W page itself; the two reports are not counted as independent validation. [@cw-india-dc-h1-2026]

This distinction matters because repetition can look like corroboration. Two outlets repeating the same 1,789 MW total may broaden access to a claim without adding a second measurement. A true independent cross-check would need its own facility list, stage definitions, cut-off date and calculation, not merely a second article citing the same market research.

### How to use the figures responsibly

For a comparison or planning note, keep the seven city values in the form C&W publishes them, attribute the report and state its date. If using the top-line 1,789 MW or 3,860 MW totals, do not imply that the displayed city rows reproduce them. If a derived sum is useful, show the arithmetic and label it as the sum of the seven displayed rows. Do not silently replace the report’s aggregate with the row sum or invent an explanation for the difference.

The next reporting improvement is straightforward: publish a row for every included market, name the same geography and stage in each table, state whether the row universe is exhaustive, and show the calculation from city totals to aggregate. For pipeline supply, include a per-market breakdown by under-construction and planning stage. A date and facility-level inclusion rule would make future updates easier to compare.

The result is not a verdict on the quality of the market report. It is an arithmetic and scope check on the values visible in one public update. It shows which calculation can be reproduced, which top-line totals are stated, and where the source leaves readers without a bridge between them.

**Bottom line:** Seven C&W market rows sum to 1,755 MW operational and 3,633 MW upcoming, below the page’s 1,789 MW and 3,860 MW aggregates; the source does not reconcile either gap.

**Why it matters:** Market totals are easy to repeat, but a reader needs to know whether the rows behind them use the same scope and project stages.

**Key takeaways:**
- The seven displayed operational values sum to 1,755 MW, 34 MW below the reported 1,789 MW.
- The seven upcoming-supply values sum to 3,633 MW, 227 MW below the reported 3,860 MW.
- The 509 MW construction and 3,351 MW planning components do add to 3,860 MW.
- The differences are unresolved in the captured page; they are not assigned to an assumed cause.

**What changes:** Future market updates should publish an explicit reconciliation from city rows to aggregates and preserve project stage for each value.

**Evidence note:** One C&W update provides the figures. Derivative media coverage is not treated as an independent capacity measurement.

## 33. One 13.56-GW projection, two official labels

**Slug:** `research-india-dc-13-56-label-audit`  
**Topic:** Infrastructure measurement  
**Proposed dek:** Two Indian government records repeat a 13.56-GW projection for 2031–32 but describe it differently: one as electricity demand and one as data-centre capacity. The records do not supply a shared definition that resolves the difference.

### The question is what the figure measures

A single power figure can be repeated in many stories and still be difficult to interpret if its category changes along the way. This audit compares two official records from March 2026 that give the same 13.56-gigawatt value and the same 2031–32 horizon. It asks whether their wording shows that they measure the same thing. It does not choose a preferred estimate or claim that either ministry made an error.

The first record is a Press Information Bureau release dated 13 March 2026. It says the expected electricity demand from growth in AI and other large-scale data centres is included in planning and estimates that “electricity demand from data centres” will reach 13.56 GW by 2031–32. The second is a Rajya Sabha answer to Unstarred Question 4151, answered on 30 March 2026. It says total data-centre capacity rose from about 375 MW in 2020 to around 1,500 MW by 2025 and is projected to reach 13.56 GW by 2031–32. [@pib-data-centre-demand-2026-03-13] [@rajya-sabha-data-centre-capacity-2026-03-30]

### The same value appears under different labels

| Record | Date and form | Wording attached to 13.56 GW | Horizon |
|---|---|---|---|
| PIB release, MeitY | 13 March 2026 | Estimated electricity demand from data centres | 2031–32 |
| Rajya Sabha Unstarred Question 4151, Ministry of Power answer | 30 March 2026 | Projected total data-centre capacity | 2031–32 |

The first statement frames the value as demand for electricity. The second places it in a sentence about data-centre capacity. Both use a unit of power, gigawatts, and both use the same future horizon. The Parliament answer later says expected electricity demand from AI and other large-scale data centres is factored into transmission planning, but the 13.56-GW sentence itself calls the figure capacity. [@pib-data-centre-demand-2026-03-13] [@rajya-sabha-data-centre-capacity-2026-03-30]

The repeated value and horizon may indicate that the records draw on a common projection. The reviewed documents do not identify a shared model, cite a technical study for the figure, or state that the labels are interchangeable. Similar numbers in two government documents are therefore not independent confirmation of the underlying method. Without a cited definition or calculation, readers should preserve each record's wording rather than silently convert one label into the other.

### Demand, capacity and energy are not synonyms

Power is a rate or capacity measure. A gigawatt describes power, not the total amount of electricity used over a year. Annual energy use would normally be stated in units such as gigawatt-hours or terawatt-hours and would depend on operating time and load. A reader cannot turn 13.56 GW into an annual consumption value without additional assumptions about utilization and the system boundary.

“Data-centre capacity” also needs a definition. It could refer to IT critical load, total facility power, a planned site connection, or another source-specific measure. The answer does not specify which meaning it intends. Nor does the sentence say whether the number includes only operational or financed projects, what geography and facility universe it covers, or how it treats non-AI workloads. Those omissions do not prove the figure is wrong; they limit what can be inferred from the wording.

By contrast, the PIB release explicitly uses “electricity demand,” but the quoted sentence does not define whether that means peak load, forecast average load, or some other planning quantity. It also groups AI with other large-scale data centres rather than isolating AI electricity use. The label is clearer than the second record's, but the method and denominator are still not provided in that release.

The distinction matters for comparisons. An operational IT-load inventory, a future facility-power projection and a national transmission-planning demand figure might all use gigawatts while describing different boundaries. They should not be summed, compared as like-for-like totals or translated into GPU counts without a common specification. The 13.56-GW number is not, by itself, an inventory of accelerators available to users.

### What the records leave unresolved

The two cited records do not answer several questions a technical reader would need:

- Does the projection represent peak electrical demand, installed IT load, or total facility capacity?
- Does the boundary include power for cooling, backup systems and shared building services?
- Which facilities, regions and project stages are counted?
- Does it cover all data-centre workloads, only large-scale facilities, or a defined AI-related subset?
- Which base-year inventory, growth assumptions and conversion rules produce the 2031–32 value?
- Is the Parliament answer repeating the same demand forecast, or referring to a separate capacity projection?

These questions are not evidence of contradiction in the underlying calculations; they are the missing information required to test whether the words refer to the same quantity. The fact that the parliamentary answer also discusses transmission planning does not resolve the label in its earlier capacity sentence.

### How to report the figure without overstating it

When citing the 13 March PIB release, retain its description as an estimate of data-centre electricity demand and give the 2031–32 horizon. When citing the 30 March answer, retain its wording as projected data-centre capacity and identify the question and ministry. Do not present them as two independent forecasts, average them, or claim that one silently corrects the other.

If a later official document supplies a technical note, use its definition and methodology to reconcile the categories. Until then, a responsible summary can state that both records use 13.56 GW for 2031–32, while one says electricity demand and the other says capacity. That is a verifiable description of the records and keeps the unresolved question visible.

The next useful disclosure would be a dated source table that names the responsible estimation body, baseline year, geographic and project-stage coverage, demand or capacity definition, treatment of IT and facility power, assumptions, and uncertainty range. A revised number without those fields would leave the central ambiguity intact.

**Bottom line:** The same 13.56-GW value appears in two March 2026 records, but one calls it electricity demand and the other data-centre capacity; the documents reviewed do not reconcile those labels.

**Why it matters:** Readers, utilities and operators need to know whether a figure is a forecast of load or a measure of infrastructure before comparing it with other totals.

**Key takeaways:**
- The PIB release dated 13 March calls 13.56 GW projected electricity demand for 2031–32.
- A 30 March Rajya Sabha answer places the same value under projected data-centre capacity.
- Both records are official statements, not independent validation of the projection's method.
- The reviewed text does not define the full boundary, baseline or calculation.

**What changes:** Future releases should identify the forecast owner, boundary, baseline, project stage and whether the measure is demand, IT load or facility capacity.

**Evidence note:** The audit transcribes the two official records. It does not independently reproduce the 13.56-GW forecast or determine which label is technically intended.

## 34. What public data-centre energy figures actually measure

**Slug:** `research-data-centre-energy-attribution-audit`  
**Topic:** Energy measurement  
**Proposed dek:** The IEA’s global growth figure and LBNL’s U.S. estimate answer different questions. Neither is an AI-only electricity total.

### Compare definitions before comparing numbers

Public reporting often places data-centre electricity figures next to discussion of AI. That context can make a reader assume that a reported increase measures AI workloads alone. This source audit compares two widely cited research records to test that assumption: the IEA’s Global Energy Review 2026 and Lawrence Berkeley National Laboratory’s 2024 U.S. data-centre report.

The question is not which source is “right.” They cover different geographies and years, and they report different kinds of quantities. The IEA says electricity consumption by data centres increased by around 17% in 2025, a rise of about 70 terawatt-hours. LBNL estimates U.S. data-centre electricity use at 176 TWh in 2023 and models a 2028 range of about 325–580 TWh. The review codes each figure by geography, period, measure, evidence status and whether AI is isolated. [@iea-global-energy-review-2026] [@lbnl-us-data-centre-energy-2024]

| Source and figure | Geography and period | What the figure represents | AI attribution |
|---|---|---|---|
| IEA: about 70 TWh, around 17% growth | Global, 2025 | Approximate increase in data-centre electricity consumption during the year | The figure is for data centres as a whole, not an isolated AI workload total |
| LBNL: 176 TWh | United States, 2023 | Research estimate of annual data-centre electricity use | The total is broader than AI; it includes servers, storage, networking and infrastructure |
| LBNL: about 325–580 TWh | United States, 2028 | Low-to-high modeled future range | Scenarios include GPU-related assumptions but do not turn the whole total into AI-only use |

### An annual total and an annual increase are not the same metric

The IEA’s 70 TWh is a change during 2025, not a statement that the sector consumed only 70 TWh worldwide that year. The LBNL 176 TWh figure is an estimate of the amount consumed by U.S. data centres over the full year 2023. One is a global year-over-year increase; the other is a national annual level two years earlier. Even though both use TWh, they cannot be compared as if they were matching totals.

That difference is easy to miss when numbers appear in the same story about demand. A 70-TWh increase could be compared with a compatible global baseline if the source provides one and the definitions line up. A U.S. annual estimate would need to be compared with a U.S. figure for the same period and boundary. The 2028 range, meanwhile, is a modelled future, not a measured continuation of the 2023 estimate.

The IEA also compares the data-centre increase with total global electricity-demand growth, but that comparison does not identify how much of the added data-centre load came from AI. It locates the sector within a much larger change in electricity demand; it is not an attribution study of model training, inference or other digital workloads. [@iea-global-energy-review-2026]

### The LBNL range is a scenario, not a forecast interval around one point

LBNL’s 176 TWh estimate is historical, though the report explains that its series uses previous studies and shipment data rather than a complete sum of utility-meter readings from every data centre. The report therefore treats it as a research estimate. The 2028 range answers a different question: what could future electricity use look like under different assumptions about equipment shipments, computational demand, utilization and cooling?

Those endpoints are not a probability interval with a stated likelihood that actual use will fall between them. They are scenario results shaped by assumptions. Quoting 580 TWh alone as the expected outcome, or averaging the endpoints without a method, would hide the reason the report gives a range. The broad total includes data-centre equipment and infrastructure; it should not be re-labelled as AI-only because GPU shipments appear in part of the scenario design. [@lbnl-us-data-centre-energy-2024]

### AI can be a driver without being a separate measured category

Both reports discuss data centres in an environment where AI is an important source of infrastructure demand. But causal context and measured category are different. A source may say AI is contributing to investment or load growth without separately metering AI servers, conventional cloud workloads, storage, network equipment and facility systems.

The IEA’s 2025 growth statement is a sector total. LBNL’s U.S. estimates cover the broader data-centre system, with specific future assumptions for accelerated computing. Neither number should be rewritten as “AI used X TWh” without additional evidence that isolates the workload, assigns shared infrastructure consistently and covers the same year and geography.

The distinction matters for policy debates as well as corporate claims. A data-centre total can indicate pressure on a grid or an infrastructure trend. It cannot, without a separate allocation method, tell a reader what fraction came from AI, how much was training rather than inference, or which individual model caused the demand. Those questions require a different dataset: workload-level electricity measurement, an explicit allocation method for shared systems, and a stated time period.

### A reporting checklist for energy claims

Before comparing two figures, record:

1. **Geography:** global, national, regional or facility-specific?
2. **Period:** an annual total, a year-over-year increment or a future scenario?
3. **Boundary:** IT equipment alone, facility systems, or a broader data-centre category?
4. **Evidence status:** metered observation, historical estimate or modeled scenario?
5. **Attribution:** total data-centre electricity, or a defined AI-only share?
6. **Uncertainty:** does the source provide a range and explain the assumptions?

If a claim cannot answer these, preserve the source’s wording and label the gap. Do not convert a sector-level number into a model-level estimate or combine values with different boundaries simply because they share a unit.

### What the public record can support

These sources support a careful summary: the IEA reports that global data-centre electricity consumption grew by around 17%, or 70 TWh, in 2025; LBNL estimates U.S. data-centre electricity use at 176 TWh in 2023 and models a broad range of possible 2028 outcomes. They also support the conclusion that the public figures reviewed are not directly comparable and do not isolate AI as a standalone electricity category.

They do not establish a single global AI-electricity total, a forecast that will necessarily occur, or a consistent basis for ranking countries. The useful research output is the source-definition crosswalk itself. It shows why the headline numbers need their geography, period, boundary and evidence label whenever they are repeated.

**Bottom line:** IEA and LBNL figures describe different data-centre energy quantities, and neither is a direct measurement of AI-only electricity use.

**Why it matters:** A growth increment, a historical estimate and a future scenario can all use TWh while answering different questions.

**Key takeaways:**
- The IEA’s 70 TWh is global year-over-year growth for 2025, not the sector’s full annual use.
- LBNL’s 176 TWh is a U.S. 2023 historical estimate; its 2028 range is scenario-based.
- Both sources describe data-centre totals, not an independently measured AI-only share.
- Keep geography, period, boundary and evidence status attached to every figure.

**What changes:** Energy reporting should publish an explicit AI-attribution method and distinguish measured totals from estimates and scenarios.

**Evidence note:** The article compares two source definitions and does not produce a new estimate of AI electricity use.

## 35. What six model-release documents disclose—and omit

**Slug:** `research-model-disclosure-document-audit`  
**Topic:** Model documentation  
**Proposed dek:** Six first-party release documents use different formats and levels of detail. Their reported fields are useful evidence, but they are not a common scorecard.

### A document audit is not a model ranking

Model cards and system cards are often treated as if they were standardized forms. A closer look at six 2026 provider documents shows why a reader should first ask what kind of document they are reading. This audit codes visible document features—document type, intended-use and limitations sections, evaluation disclosure, training-data information, and external testing—rather than model capability. It does not compare benchmark scores across products.

The sample includes the Gemma 4 model card, Gemini 3.8 Flash model card, Claude Sonnet 5.5 system card, Grok 4.7 model card, OpenAI’s GPT-6 Sol/Luna launch page, and a captured excerpt of Mistral Small 4’s model card. The documents were selected to cover several providers, not randomly sampled from every model released in 2026. GPT-6 Sol/Luna’s announcement is not labeled a system card, and the saved Mistral excerpt is not a complete copy of the card. Those differences are part of the audit, not details to hide. [@gemma4-model-card] [@gemini38-flash-card] [@claude-sonnet55-system-card] [@grok47-model-card] [@openai-gpt6-sol-luna-release] [@mistral-small4-card-extract]

| Document | What the reviewed page makes visible | Comparison caveat |
|---|---|---|
| Gemma 4 model card | Separate sections for training data, evaluation approach and results, intended use, limitations, and ethics and safety | Section structure is extensive, but the card’s own evaluations remain provider evidence |
| Gemini 3.8 Flash model card | Model information, evaluation, intended use and limitations, content safety, and distribution; some training and evaluation details point to Gemini 3.7 Flash documentation | The release-specific card refers readers to an earlier model card for some underlying details |
| Claude Sonnet 5.5 system card | Pre-deployment evaluations, external testing, safeguards, and domain-specific results | Anthropic says it omits some evaluations that require substantial human time and emphasizes numerical results |
| Grok 4.7 model card | Capability and safety sections across several domains; evaluations generally refer to the final deployed checkpoint unless otherwise stated | A single checkpoint convention does not make the varied tests comparable |
| GPT-6 Sol/Luna launch page | Product availability, task-specific benchmark claims, and an internal factuality evaluation | This is a launch document, not a parallel model-card template |
| Mistral Small 4 card excerpt | Published model specifications, license, and context-window claims | The saved excerpt is limited; unshown fields are not coded as absent |

### The same field name can lead to different evidence

Gemma 4 is organized as a long model card. Its table of contents and body separate training dataset, evaluation approach, evaluation results, intended usage, limitations, and ethical considerations. That structure makes it possible for a reader to locate different kinds of information, but it does not turn the provider’s testing into an independent result. The source still needs to be read for its test setup and caveats. [@gemma4-model-card]

Gemini 3.8 Flash also has dedicated model-information, model-data, evaluation, intended-use, limitation, and safety sections. But it states that the model is based on Gemini 3.7 Flash and directs readers to the earlier card for the training dataset and processing details. A user who reads only the newest page may therefore see a link to inherited information rather than a complete description repeated on the new page. The link is useful, but the chain of documents and versions matters when recording what was evaluated. [@gemini38-flash-card]

Claude Sonnet 5.5 uses a system-card format with extensive pre-deployment evaluation and a distinct external-testing section. Its executive summary also describes editorial decisions about the evidence: some evaluations requiring large amounts of human time are omitted, and the document places more emphasis on numeric outcomes than on detailed prose analysis. That disclosure helps a reader understand the shape of the record, but it also warns against treating the published tables as a complete inventory of every assessment performed. [@claude-sonnet55-system-card]

Grok 4.7 identifies its safety and capability areas and states that evaluations under those sections refer to the final deployed checkpoint unless otherwise noted. This gives a reader a useful version boundary: scores should not be silently attributed to a different checkpoint. The page’s many section headings do not establish a common methodology with Google’s or Anthropic’s reports. [@grok47-model-card]

The OpenAI page for GPT-6 Sol and Luna presents results within a launch narrative. It includes task-specific comparisons and labels its factuality evaluation as internal. Those are relevant disclosures, but the document has a different purpose and structure from a dedicated system card. Mistral’s saved Small 4 excerpt records provider specifications and explicitly cautions that those are not independent measurements of quality, latency, memory use, or hardware fit. Because the excerpt is short, this audit does not treat unshown testing fields as missing from the full card. [@openai-gpt6-sol-luna-release] [@mistral-small4-card-extract]

### Absence from one page is not proof that an evaluation never happened

The codebook distinguishes “present in the reviewed document,” “not visible in the reviewed document,” and “not assessed because the available capture is incomplete.” That distinction matters. A card may link to an earlier version, a policy page, a separate technical report, or a test paper. A launch article may summarize a result without exposing the protocol in the same place. An omitted field is evidence about discoverability in the page reviewed, not proof about a company’s internal evaluation practice.

This audit also separates disclosure from validation. A provider’s statement that a test was conducted is evidence that the provider reports it; it does not independently reproduce the test. Likewise, a benchmark result can be carefully documented and still be incomparable with a competitor’s result if the benchmark version, prompting, tools, sampling, scoring, or checkpoint differs. The unit of comparison here is the document, not a model’s relative quality.

For readers, the practical first step is to record the source document’s title, type, publication date, model version, and links to inherited methods. Then look for intended use, limitations, evaluation setup, and whether the page identifies internal or external testing. If any item is not visible, mark it as unknown from that page instead of inferring that the provider did no work.

### What this sample can support

The six documents show a range of disclosure formats: complete cards, a system card, a launch page, and a limited official excerpt. Several publishers give dedicated sections to evaluation and limitations; some point to earlier materials; and at least one document explicitly labels an evaluation as internal while another describes external testing. These differences are enough to support a modest conclusion: readers cannot assume that a label such as “model card” means the same fields, depth, or evidence status will appear in every release record. [@gemma4-model-card] [@gemini38-flash-card] [@claude-sonnet55-system-card] [@grok47-model-card] [@openai-gpt6-sol-luna-release] [@mistral-small4-card-extract]

The sample cannot establish how complete 2026 model documentation is overall, whether one provider is more transparent across its entire portfolio, or whether a document’s detail predicts model safety or quality. A broader audit would need a dated inventory of documents, a published coding rubric, independent coders, and checks of linked technical reports. Until then, this comparison is a navigation aid for readers, not a transparency ranking.

**Bottom line:** Six provider documents disclose different kinds of information in different formats; the pages are useful evidence, but not a standardized comparison set.

**Why it matters:** Readers need to know whether a fact came from a card, a system evaluation, a launch page, or a limited excerpt before drawing conclusions from it.

**Key takeaways:**
- Document type and version should be recorded before comparing disclosures.
- A linked earlier card can carry training or evaluation details that are not repeated in the newer page.
- Provider-reported tests are not independent validation.
- “Not visible here” is not the same as “not evaluated.”

**What changes:** Keep a document-level disclosure record with the date, version, test ownership, limitations, and links to inherited evidence.

**Evidence note:** Six first-party documents were reviewed as a purposive sample. The OpenAI source is a launch page, and the Mistral source capture is excerpted; neither is treated as a complete system-card record.

## 36. Agent evaluations test different things under the same label

**Slug:** `research-agent-evaluation-taxonomy`  
**Topic:** Evaluation methods  
**Proposed dek:** A survey’s two-part taxonomy separates what an agent test measures from how it measures it. One recent tool-use study shows why the distinction matters.

### Start with the objective and the process

An “agent benchmark” can refer to a test of task completion, tool choice, planning, memory, reliability, or safety. It can also describe a testing process: fixed prompts or interactive tasks, synthetic or real-world data, automated or human scoring, and a controlled simulation or live environment. Collapsing those dimensions into one leaderboard number makes it hard to tell what a result actually covers.

A 2025 survey of LLM-agent evaluation proposes two axes: evaluation objectives and evaluation process. Its objective categories include agent behavior, capabilities, reliability, and safety or alignment. Its process categories include interaction mode, evaluation data, metrics, tooling, and context or environment. The survey notes that agent evaluation differs from static software tests because agents act across dynamic environments, and that enterprise needs such as access control, reliability, auditability, and long-running interaction are not consistently covered by existing work. [@agent-evaluation-survey-2025]

| Evaluation question | Objective dimension | Process dimension to record |
|---|---|---|
| Did the agent complete the user’s task? | Behavior and task completion | Goal definition, environment state, success metric |
| Did it choose and use tools correctly? | Tool-use capability | Tool set, permissions, interaction trace, error handling |
| Did it remain reliable across steps? | Reliability and recovery | Repeated runs, failures, retries, persistent constraints |
| Did it avoid harmful or unauthorized actions? | Safety and alignment | Threat model, policy boundary, human review, scoring |
| Can another team reproduce the result? | Any objective | Dataset, benchmark version, harness, model and tool configuration |

### A benchmark can isolate one slice of an agent workflow

AgentFloor, a 2026 arXiv preprint, illustrates a specific kind of study rather than a universal test of agent quality. The authors describe a deterministic 30-task benchmark organized into six tiers, ranging from instruction following and tool use to multi-step coordination and long-horizon planning under persistent constraints. They report 16 open-weight models, GPT-5, and 16,542 scored runs. Their abstract says the strongest open-weight model matched GPT-5 in aggregate on that benchmark while the long-horizon tasks remained difficult for both groups; the authors also note that the effects of targeted interventions varied by model. These are claims about the benchmark and model set the authors evaluated, not a guarantee about production workflows. [@agentfloor-2026]

The AgentFloor example is easier to interpret when its objective is separated from its process. Its objective is to probe the point at which a workflow may need stronger model capability. Its process includes a fixed task set, tiered difficulty, repeated scored runs, and a particular harness. A reader can ask whether the tasks resemble their own work, whether the available tools match their deployment, and whether the scoring captures recovery and verification. If those conditions differ, the result may still be informative, but it does not directly estimate performance in the new setting.

The survey’s taxonomy helps avoid a common category error: using a task-completion rate as if it measured reliability, safety, or cost as well. A task can be completed after an unsafe attempt; a tool call can be correct while the final answer is wrong; a successful run may hide repeated failures; and a fixed benchmark may not test how an agent behaves when its permissions or environment change. Each is a separate question requiring its own evidence.

### Keep the evidence dimensions attached to the number

For any reported agent result, a reader should record at least the task objective, interaction mode, environment, data or benchmark version, metrics, scoring method, tool access, and model checkpoint. Reliability claims also need to say whether tasks were repeated and how variance was handled. Safety claims need a threat model and an account of whether a human reviewer or an automated judge made the decision. When a result omits one of these fields, the gap limits interpretation; it is not proof that the agent failed that dimension.

This is especially important for enterprise pilots. A benchmark that tests tool selection in a sandbox may not establish that the deployed identity has least privilege, that approval requests reach the right person, or that actions can be audited later. Conversely, a platform’s audit or approval documentation is not evidence that an agent can complete tasks robustly. Evaluation outcomes and deployment controls belong in different rows of an acceptance plan.

The survey is a map of evaluation concepts, not a census of every paper or a current score database. AgentFloor is one preprint example and should not be treated as a representative sample of agent systems. Neither source independently validates the other: the survey organizes evaluation dimensions, while the study reports one designed experiment. A stronger review would code multiple primary benchmarks against the same objective/process rubric and distinguish peer-reviewed evidence from preprints.

**Bottom line:** Agent evaluation is multidimensional; the objective, test process, scoring, and environment must travel with each result.

**Why it matters:** A single benchmark score can hide whether an agent was tested for task success, reliability, safety, or only one capability.

**Key takeaways:**
- The survey separates what is evaluated from how the evaluation is run.
- AgentFloor tests a bounded 30-task ladder, not every production workflow.
- Tool-use capability, long-horizon reliability, and safety are different claims.
- Missing benchmark details narrow what a result can support.

**What changes:** Evaluation reports should publish the objective, environment, tool set, benchmark version, scoring method, and known exclusions alongside the headline result.

**Evidence note:** The taxonomy comes from a 2025 survey; the example is a 2026 arXiv preprint, not an independent replication.

## 37. Public model cards use different frames for safety evaluation

**Slug:** `research-system-card-safety-coverage`  
**Topic:** Model safety documentation  
**Proposed dek:** Four first-party cards describe safety tests by different domains and methods. Their headings do not create a common safety scale.

### Compare the evaluation record, not the provider’s safety label

This audit asks how four public model documents describe safety evaluation: Gemma 4, Gemini 3.8 Flash, Claude Sonnet 5.5, and Grok 4.7. It codes the visible safety domains, evaluation types, ownership cues, and caveats. The goal is to understand what a reader can learn from the documents—not to rank the models or infer that a longer card means a safer system. [@gemma4-model-card] [@gemini38-flash-card] [@claude-sonnet55-system-card] [@grok47-model-card]

Model cards were proposed as a way to document intended use, evaluation conditions, performance characteristics, and limitations for machine-learning systems. That framework helps explain why test conditions and audience matter: an evaluation result is most useful when readers know what was tested, how it was measured, and where the system may fail. It does not establish one mandatory safety rubric for all providers. [@model-cards-paper-2019]

| Document | Safety evidence visible in the reviewed card | Caveat the card makes visible |
|---|---|---|
| Gemma 4 | Separate ethics and safety, evaluation approach/results, use, and limitations sections | The provider’s evaluation remains first-party evidence |
| Gemini 3.8 Flash | Automated policy evaluations, multilingual safety results, specialist red teaming, and a frontier-safety assessment | The card distinguishes automated evaluations from human red teaming |
| Claude Sonnet 5.5 | Responsible-scaling, cyber, harmlessness, child-safety, mental-health, bias, and external-testing sections | Anthropic says some labor-intensive evaluations are omitted and emphasizes numerical results |
| Grok 4.7 | Cyber, biological and chemical, jailbreak, general-output, mental-health, and behavior sections | Results generally concern the final deployed checkpoint unless a section says otherwise |

### “Safety evaluation” can mean very different tests

Gemini 3.8 Flash’s card says that some safety results are automated development-phase evaluations, not human evaluation or red teaming. It separately describes specialist manual red teaming by teams outside the model-development team. Its multilingual safety table uses percentage-point changes against the preceding model and notes that lower is better for the listed metric. Those distinctions matter: automated policy checks, specialist adversarial work, and a comparative score are not interchangeable forms of evidence. [@gemini38-flash-card]

Claude Sonnet 5.5 presents a wide safety record across multiple sections, including cyber, harmful requests, child safety, mental health, bias and integrity, and external testing. The executive summary says that some evaluations requiring significant human time are omitted and that the card concentrates more on numerical results than extended prose analysis. A reader can therefore see both the breadth of the published program and an explicit boundary on what the public document contains. [@claude-sonnet55-system-card]

Grok 4.7 organizes its disclosure by capability and risk domains, including cyber, biological and chemical capabilities, jailbreak resistance, general output safety, and mental health. The card says evaluation results under those sections generally refer to the final deployed checkpoint unless noted otherwise. This is a useful version statement, but the category structure differs from Anthropic’s or Google’s and does not provide a one-to-one translation between their tests. [@grok47-model-card]

Gemma 4 provides sections for ethics and safety, evaluation approach and results, intended use, and limitations. That gives readers signposts for locating the information, but the presence of a section is not itself a measurement of a safety property. To make a cross-provider claim, an analyst would need aligned task definitions, prompt sets, models, thresholds, and scoring procedures, or independent tests using the same protocol. [@gemma4-model-card]

### Thresholds and ownership are not a shared scale

A first-party card can report meaningful detail without enabling a valid cross-model comparison. The cards use different safety domains and disclose evaluation ownership with different specificity. One distinguishes automated testing from external red teaming; another has an external-testing section and states that some tests are omitted; another organizes results around risk areas and a deployed checkpoint. A reader cannot infer that a provider with more headings tested more thoroughly, or that a reported percentage uses the same denominator as another publisher’s percentage.

Thresholds require the same care. A document may describe a named safety threshold for one capability or a comparison against an earlier model. That does not mean another document uses the same threshold, task, or decision rule. This audit therefore records whether a card identifies a method, test owner, model checkpoint, and limitation, while leaving raw scores in their original context. It does not normalize results or calculate a composite “safety score.”

The strongest supported conclusion is about disclosure structure: these four cards expose different slices of the evaluation process. The source set is first-party and selected, so it cannot establish which provider has the safest product or whether unpublished tests exist. An independent comparison would need a common test suite, shared evaluation settings, clear threat boundaries, multiple runs where appropriate, and disclosure of failures as well as successes.

**Bottom line:** Public safety cards describe different domains, test types, and caveats; their results should not be collapsed into a single cross-provider ranking.

**Why it matters:** Safety claims are meaningful only when readers can see the checkpoint, test method, ownership, and limitations behind them.

**Key takeaways:**
- Automated checks, external testing, specialist red teaming, and provider self-report are distinct.
- The cards use different safety categories and do not share a universal threshold.
- A section heading does not prove that a test covers every relevant risk.
- These first-party documents are evidence of disclosure, not independent validation.

**What changes:** Model releases should publish stable evaluation protocols, tested checkpoints, scope, thresholds, limitations, and negative findings in a comparable structure.

**Evidence note:** The sample covers four provider documents plus the model-card proposal paper; it does not conduct new tests or rank products.

## 38. Agent platform documents separate approval, permissions, and audit

**Slug:** `research-agent-oversight-docs`  
**Topic:** Enterprise deployment  
**Proposed dek:** Documentation from three agent platforms describes different control layers. An approval prompt, an access rule, and an audit log solve different problems.

### Treat “human oversight” as several controls

A buyer evaluating an agent platform may see terms such as human approval, permissions, and audit logs presented together. They are related, but not equivalent. Approval can pause a sensitive action for a person; permission rules determine whether a tool or resource is allowed; audit records help reconstruct what happened. This document audit reviews official guidance from OpenAI’s Agents SDK, Google’s Gemini Enterprise Agent Platform, Anthropic’s Claude Code, and LangChain’s LangSmith Fleet, with OWASP’s Agent Control Standard as a project-level reference. It is not a product test. [@openai-agents-hitl-doc] [@google-agent-audit-logging] [@anthropic-claude-code-permissions] [@langsmith-fleet-oversight] [@owasp-agent-control-standard]

| Control layer | Example in the reviewed docs | What the documentation does not establish |
|---|---|---|
| Human approval | OpenAI SDK can pause a run for a tool decision and resume after approve/reject | The SDK guide does not authenticate or authorize the person making the decision |
| Audit | Google documents Admin Activity, Data Access, and System Event logs | Logging records activity; the page does not claim that logs prevent the action |
| Tool permissions | Claude Code provides allow, ask, and deny rules with workspace and sandbox controls | These details apply to Claude Code’s coding-agent environment, not every Anthropic model use |
| Identity and credential scope | LangSmith Fleet describes fixed and user-specific credentials, with role-based and attribute-based access | Product documentation is not a deployment test or proof that an organization configured controls correctly |
| Runtime policy hooks | OWASP’s Agent Control Standard aims to make agent systems inspectable and policy-enforceable | It is project guidance, not a regulation and not evidence of universal implementation |

### Approval is a workflow, not an identity system

The OpenAI Agents SDK documentation describes a human-in-the-loop flow in which a tool can require approval, the run pauses, a pending request is surfaced, and a decision can be applied before the run resumes. Its documentation also covers persisting and resuming run state. But the guide explicitly puts authentication and authorization of the approver outside the SDK flow: a developer must implement those controls. Serialized state also needs server-side integrity and replay protections. A “human approval” feature therefore does not by itself answer who is allowed to approve, whether the decision matches the request, or how it is protected in a web application. [@openai-agents-hitl-doc]

Claude Code’s permission documentation describes a different layer: rule-based decisions about tools and actions. It has modes that prompt, permit limited read-only activity, accept selected edits, or apply broader automation; rules can allow, ask, or deny, with denial taking precedence. Workspace trust, managed settings, and operating-system sandboxing add further boundaries. These are concrete controls for the coding assistant, but readers should not generalize them to all agents built with Anthropic models. [@anthropic-claude-code-permissions]

### Audit records explain activity after or during an action

Google’s Gemini Enterprise Agent Platform audit page describes three log categories. Admin Activity and System Event logs are always enabled and cannot be disabled; Data Access logs include reads and writes of user data and are disabled by default. The page presents logs as a way to answer who did what, where, and when. That is accountability and investigation evidence. The document does not say those records block a tool call or obtain a human decision before execution. [@google-agent-audit-logging]

LangSmith Fleet’s page describes tiered permissions, credential management, human-in-the-loop oversight, and an audit trail. It distinguishes fixed credentials shared by an agent from user credentials that act on behalf of the invoking person, and documents tool access control including role-based and attribute-based permissions. That difference is important for delegated work: shared credentials can simplify a team agent but may obscure which individual’s privileges should apply, while user-scoped credentials depend on each person’s authentication and access. The page describes product options, not a security review of any customer configuration. [@langsmith-fleet-oversight]

OWASP’s Agent Control Standard describes an open foundation for exposing middleware hooks and enforcing safety policies at runtime. Its stated goal is inspectable, traceable, instrumentable agent behavior. The source expressly frames the work as a standard project, not a regulation and not proof that platforms implement it. It can help teams ask about interoperable control points, but a standard’s existence does not show that a deployed agent has those controls enabled. [@owasp-agent-control-standard]

### Build a control map, not a feature checklist

These documents point to different questions for a pilot. Before an action, who can call a tool and with which identity? At the point of execution, what requires approval and can a policy deny it? During the run, what is logged and are data-access logs enabled? After an interruption, how is the state protected and resumed? For a specific product, which settings are defaults, which require an enterprise plan, and which need application code?

A purchase checklist that merely asks “Does the platform have human oversight?” can hide gaps between those steps. An approval gate may not limit what the agent can propose. A permission rule may not record the reason for access. A complete trace may be available only after the event. A project standard may describe hooks without being implemented. Each needs separate evidence and a configuration test in the buyer’s own environment.

The comparison is bounded to public documentation captured for four products and one standard project. It does not inspect source code, test product behavior, confirm current plan availability, or show that a customer’s deployment is configured safely. Documentation can also change. The useful output is a set of questions to verify in a pilot, not a claim that one provider offers stronger security than another.

**Bottom line:** Approval, tool permission, identity, and audit are separate control layers; verify each one in the actual deployment.

**Why it matters:** A visible approval prompt cannot compensate for unclear identity, broad permissions, missing logs, or an unsafe resume path.

**Key takeaways:**
- The OpenAI SDK pauses and resumes runs but leaves approver authentication to the application.
- Google’s audit logs record activity; Data Access logging is disabled by default.
- Claude Code permission modes are product-specific and include distinct allow/ask/deny behavior.
- OWASP ACS is guidance, not a regulation or proof of implementation.

**What changes:** Pilot plans should test identity, action authorization, approvals, log coverage, and interruption recovery as separate requirements.

**Evidence note:** This is an audit of public platform and project documentation, not a penetration test or feature comparison.

## 39. C2PA 2.1 and 2.4 add different provenance capabilities

**Slug:** `research-c2pa-version-diff`  
**Topic:** Standards audit  
**Proposed dek:** The 2.1 and 2.4 specification records describe changes to assertions, formats, validation, and serialization. A version listing is not evidence of adoption.

### Read the change record before describing the standard

C2PA versions are often summarized as if a new number meant a single new capability. The official technical specifications show a broader pattern: updates can change how a manifest is represented, what assertions it can carry, how a validator interprets it, and which asset types can embed credentials. This audit compares selected release records for versions 2.1 and 2.4, using the specifications’ own version notes and change summaries. It is not a complete migration analysis. [@c2pa-spec-21] [@c2pa-spec-24]

The 2.1 specification is dated September 2024. Its change record describes clarifications to manifest and asset states, along with changes to deprecation and versioning. It adds the `ingredients v3` assertion, a new BMFF hash assertion version, a timestamp manifest for establishing an asset’s time of existence, and requirements around validation of ingredients. The specification also records JPEG XL support in its format-embedding section. These examples affect different parts of the system: assertions describe provenance information, timestamps address temporal evidence, validation instructions govern interpretation, and asset-format support concerns embedding. [@c2pa-spec-21]

Version 2.4 is dated April 2026. Its record adds manifest support for HTML and structured-text formats such as YAML and Markdown, and introduces crJSON, a JSON-LD serialization of a C2PA Manifest Store intended for profile evaluation, interoperability testing, and validation reporting. The release also adds assertions for repository receipts, environmental-sustainability information, and machine-readable AI disclosure. Other listed changes include live-video packaging, ingredient metadata, and changes to where `specVersion` is carried. [@c2pa-spec-24]

| Selected version | Date stated by the specification | Examples in the official change record | Why the change matters to an implementer |
|---|---|---|---|
| 2.1 | September 2024 | Manifest and asset-state clarifications; `ingredients v3`; timestamp manifest; validation updates; JPEG XL embedding | Affects assertion handling, validation, time evidence, and supported media formats |
| 2.4 | April 2026 | HTML and structured-text embedding; crJSON; repository-receipt, sustainability, and AI-disclosure assertions; live-video and versioning changes | Broadens document and workflow support and adds new machine-readable claims |

### Version numbers do not tell an implementer what is compatible

The table is a selection of notable changes, not a complete diff. C2PA lists versions 2.2 and 2.3 between 2.1 and 2.4; the specification’s own version history dates those releases to May and December 2025. An implementer who compares only 2.1 and 2.4 can miss features or compatibility changes introduced in those intermediate versions. The comparison therefore answers “what do these two records say?” rather than “what is the entire migration path?” [@c2pa-spec-24]

It is also important to distinguish a new assertion from a verified fact about the content. A specification can define how a machine-readable AI-disclosure assertion or repository receipt is represented and validated. It cannot, by itself, prove that every creator adds the assertion, that every viewer checks it, or that the assertion is truthful. The same boundary applies to format support: a specification describing HTML or Markdown embedding does not demonstrate that a particular publisher’s workflow produces or validates those credentials. [@c2pa-spec-24]

The two versions also illustrate why “provenance” is not a single data field. The 2.1 record includes improved state definitions, ingredient handling, and a timestamp manifest; the 2.4 record extends the set of supported assets and assertions and changes parts of the serialization and versioning model. An implementer needs to know which schema version a tool reads, which assertions it understands, and how it treats unknown or deprecated constructs. The change record is a starting point for that review, not a substitute for testing the actual generator and validator.

### Keep specification capability separate from adoption

This audit does not inspect browser, camera, editing, or publishing products. It cannot estimate how many services implement 2.4, whether older credentials remain valid in a specific tool, or whether a given platform verifies each new assertion. Those questions require implementation documentation, conformance tests, and live interoperability checks. A policy or newsroom article should therefore say “the specification supports” only when describing the normative record, and reserve “the product supports” for a verified implementation source.

The findings are also bounded by the documents selected. The 2.1 specification’s release notes and the 2.4 specification’s change record are primary evidence about their own text, but they are not an independent assessment of whether every change improves security or usability. The article makes no recommendation to upgrade without checking the intervening releases, implementation dependencies, and verifier behavior.

For a practical version review, record the producer and validator versions, the manifest format, assertion names and versions, and the handling of unknown or deprecated items. Then test the same credential through both tools and preserve the validation result. This makes version support observable instead of assuming that a newer specification page guarantees compatible software.

**Bottom line:** C2PA 2.1 and 2.4 document changes across assertions, validation, formats, and serialization; adoption and compatibility require separate evidence.

**Why it matters:** A standards update can change what a credential carries without proving that tools in a publishing workflow implement it.

**Key takeaways:**
- C2PA 2.1 is dated September 2024; 2.4 is dated April 2026.
- 2.1 includes state, ingredient, timestamp, validation, and JPEG XL updates.
- 2.4 adds crJSON, new assertions, and HTML/structured-text support, among other changes.
- Versions 2.2 and 2.3 sit between the selected snapshots and are not fully audited here.

**What changes:** Implementers should test producer and validator behavior against the exact specification version and assertion set they deploy.

**Evidence note:** The comparison uses official C2PA specification records and does not test software adoption or interoperability.

## 40. What model cards disclose about non-English safety tests

**Slug:** `research-model-card-multilingual-safety-audit`  
**Topic:** Multilingual safety evaluation  
**Proposed dek:** Four provider documents use different levels of language detail. A language-support count is not the same as a language-specific safety result.

### Ask what the safety test says about language

A provider may state that a model supports many languages, publish one combined “multilingual” result, or list outcomes for named languages. Those disclosures answer different questions. This audit reviews the language detail visible in four 2026 model documents: Gemini 3.8 Flash, Claude Sonnet 5.5, Gemma 4, and Grok 4.7. It codes whether a page names languages, identifies safety-specific tests, provides a metric, and distinguishes the test from other evaluations. It does not measure model performance in any language. [@gemini38-flash-card] [@claude-sonnet55-system-card] [@gemma4-model-card] [@grok47-model-card]

| Document | Language information visible | Safety-evaluation detail | What cannot be inferred |
|---|---|---|---|
| Claude Sonnet 5.5 system card | Names seven tested languages, including Hindi | Harmful-request evaluations span 16 policy areas and report harmless-response rates | The results do not represent every dialect, language variety, or use context |
| Gemini 3.8 Flash model card | Describes a multilingual safety metric and non-English performance; the displayed result does not name each language | Automated results are separated from manual specialist red teaming | A combined metric cannot identify which language drove a change |
| Gemma 4 model card | Says out-of-the-box support covers 35+ languages and training data covers 140+ | Provides separate safety and evaluation sections | Language support and training-data coverage are not language-specific safety results |
| Grok 4.7 model card | A coding benchmark describes tasks across five languages | Safety sections are organized by domain, including cyber and biological/chemical risk | A multilingual coding task is not a multilingual safety test |

### Named-language testing is more informative than a combined label

Claude Sonnet 5.5’s system card gives the clearest language-specific example in this sample. It reports harmful-request tests across 16 policy areas and names Arabic, English, French, Hindi, Korean, Mandarin, and Spanish. The table describes harmless-response rates, with higher values better. This makes the tested language set and metric visible; it does not show that every relevant prompt, dialect, or real-world interaction was covered, nor does it establish results for languages outside the seven listed. [@claude-sonnet55-system-card]

Gemini 3.8 Flash reports an automated multilingual-safety result as a percentage-point change, with lower better for the metric shown, and describes a slight regression in non-English safety relative to Gemini 3.7 Flash. The card separately says the displayed development results are automated rather than human evaluation or red teaming, then describes manual red teaming by specialist teams outside model development. The distinction helps readers see two testing modes, but the combined multilingual value does not identify a language-by-language breakdown in the reviewed table. [@gemini38-flash-card]

Gemma 4’s card gives broad language coverage statements: it describes out-of-the-box support for 35-plus languages and training data covering more than 140. Those are provider disclosures about language support and corpus coverage. The card also has ethics, safety, evaluation, and limitation sections. The existence of both language claims and a safety section does not establish that safety outcomes were measured separately for each language. [@gemma4-model-card]

Grok 4.7’s card organizes safety evidence into areas such as cyber, biological and chemical capabilities, jailbreaks, general output safety, and mental health. It also reports a coding benchmark involving tasks written across five languages. That establishes a multilingual dimension for that coding benchmark, not for the safety evaluations. A language count in one capability test should not be carried over to a different risk domain without an explicit shared method. [@grok47-model-card]

### Three levels of language disclosure should stay distinct

The records support a practical coding scheme. First, **language availability** states where a provider says the model can be used. Second, **evaluation language coverage** says which languages were included in a specific test. Third, **language-disaggregated outcomes** show how the results differ across the tested languages. A document may provide one level and not the others. The distinction prevents a broad support claim from being mistaken for evidence of equal quality or equal safety across all users.

The sample contains one card with a named seven-language safety evaluation, one with a combined multilingual safety delta, one with broad language-support and training counts, and one with a multilingual coding task but domain-organized safety reporting. These are not four comparable test results. The test populations, task definitions, metrics, and ownership differ, and the documents are first-party. No model is ranked here.

This matters particularly for deployment in multilingual settings. A procurement team can ask whether a language appears in the relevant safety test, whether the model was tested on the intended task, how the score was calculated, and whether a local reviewer examined failure cases. If the documentation provides only a combined score or language count, the next step is a targeted pilot—not an assumption that the model behaves consistently across every language.

### Limits of the audit

The sample is limited to four public provider documents and the pages captured for this launch portfolio. It does not cover every model, every provider’s supplementary reports, or independent multilingual-safety research. “Not visible in the reviewed section” is not proof that a provider never tested that language. The article also does not evaluate translation quality, cultural nuance, dialect coverage, or the prevalence of harmful outputs.

A stronger follow-up study would define a shared set of safety tasks, include named language varieties, use local-language experts, publish prompts and scoring rules, and report outcomes by language with uncertainty. Until such evidence exists, the cards can show what their publishers disclose, but they do not support a general claim that safety is uniform across languages.

**Bottom line:** The four documents disclose different levels of multilingual safety evidence; language support, test coverage, and language-specific outcomes are not interchangeable.

**Why it matters:** Users need language-specific evidence when deploying models for people whose primary language is not English.

**Key takeaways:**
- Claude’s card names seven languages, including Hindi, in a harmful-request evaluation.
- Gemini reports a combined multilingual safety change but does not name every language in the displayed result.
- Gemma’s language-support counts are not safety measurements.
- Grok’s five-language coding benchmark should not be read as a five-language safety test.

**What changes:** Providers should identify tested languages and varieties, task scope, test ownership, metric, and per-language outcomes.

**Evidence note:** This is a text audit of four first-party documents; it does not perform independent multilingual testing.