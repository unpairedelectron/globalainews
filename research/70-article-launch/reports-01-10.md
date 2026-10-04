# Report drafts 41–50

**Status:** provisional draft set. Drafts 41–50 are included; none is approved for publication or integrated into newsroom records.
**Research date:** 4 October 2026.
**Citation convention:** Inline `[@key]` references map through `report-source-map.md`; these are research-only keys, not live newsroom source IDs.
**Byline:** unassigned; do not invent a named author or credentials.

## 41. India data centres: operational capacity, hubs, and announced pipeline

**Slug:** `report-india-data-centre-market-2026`  
**Topic:** Infrastructure reference  
**Proposed dek:** A dated reference to Indian data-centre capacity should keep city rows, aggregate totals, project stages, and national projections in separate fields.

### Start with the source, date, geography, and stage

India data-centre capacity is often summarized with a single megawatt figure. The public records reviewed here describe several different quantities: operational capacity in selected markets, upcoming supply at different development stages, a separate national capacity statement, and a future electricity-demand projection. They are not one continuous series. This reference preserves the source’s date and labels so readers can use each number without converting it into another measure. [@cw-india-dc-h1-2026] [@pib-india-dc-1575-and-demand] [@rajya-sabha-india-dc-capacity]

Cushman & Wakefield’s India Data Centre H1 2026 update, published on 23 September 2026, gives operational-capacity and upcoming-supply values for seven markets. Its top-line figures are 1,789 MW operational and 3,860 MW of supply expected by 2030; the upcoming total is divided into 509 MW under construction and 3,351 MW in planning. These stages describe different points in a project’s development, and planned supply is not capacity that users can access today. Research 32 separately audits the seven displayed market rows and their arithmetic. This report uses the publisher’s top-line values only as one dated, seven-market reference. [@cw-india-dc-h1-2026]

### Keep national records separate from the market report

The Press Information Bureau’s March 2026 release gives a separate current data-centre capacity figure of 1,575 MW and discusses a projected 13.56 GW figure for 2031–32. In the same record, the 13.56-GW number is described as electricity demand from data centres. A Rajya Sabha answer dated 30 March gives a different sentence-level label: it describes capacity as rising from about 375 MW in 2020 to around 1,500 MW by 2025 and reaching 13.56 GW by 2031–32. It later discusses electricity demand in the context of transmission planning. [@pib-india-dc-1575-and-demand] [@rajya-sabha-india-dc-capacity]

| Record | Date and stated scope | Published value | How to preserve it |
|---|---|---:|---|
| Cushman & Wakefield H1 update | 23 September 2026; seven named markets | 1,789 MW operational; 3,860 MW upcoming by 2030 | Attribute to C&W; keep the market scope and project-stage language; see Research 32 for the row audit |
| PIB release | 13 March 2026; national public statement | 1,575 MW described as current capacity; 13.56 GW described as 2031–32 electricity demand | Retain both labels and the release date |
| Rajya Sabha answer | 30 March 2026; answer to Unstarred Question 4151 | About 1,500 MW by 2025; 13.56 GW described as 2031–32 capacity | Identify the question and ministry; do not silently relabel the projection |

The 1,575-MW PIB figure and C&W’s 1,789-MW top-seven-market total cannot be reconciled from the records reviewed. They differ in date, source, stated geography, and potentially in the definition of capacity. The documents do not provide a common facility list, cut-off date, or calculation. The correct reporting choice is to show the figures with their source and scope, not to declare one wrong or treat them as like-for-like national totals. The same caution applies to the 13.56-GW statements: one record calls it electricity demand and another capacity. [@pib-india-dc-1575-and-demand] [@rajya-sabha-india-dc-capacity] [@cw-india-dc-h1-2026]

### What these records do not measure

Megawatts describe power or capacity, not annual electricity consumption. A value in MW cannot be converted directly into terawatt-hours without assumptions about operating time and utilization. It also cannot be translated into a count of GPUs: facilities differ in power allocated to IT equipment, cooling, backup, networking, and other services, while accelerator systems differ in power draw and configuration. None of the records above provides a common method for such conversions. [@cw-india-dc-h1-2026] [@pib-india-dc-1575-and-demand]

“Operational” is different from “under construction” and “planning.” An operational market estimate may still contain capacity that is not available to every customer, while announced or planned supply can change before it is commissioned. For a capacity reference, each entry should carry at least the reporting date, geography, stage, unit, source, and any definition the source provides. When a publisher reports an aggregate plus city rows, the table should also preserve whether the rows reproduce the headline total.

### How to update this reference

For each new market update, record the publication date and source, the geographic universe, operational values, and future supply broken down by project stage. Keep the publisher’s stated scope visible and link to a separate row-level audit when figures are recalculated. Do not merge a national government statement with a private-market estimate merely because both use MW, and do not substitute a recomputed value for a publisher’s total without an explicit method.

For government figures, preserve the exact wording and identify whether the statement refers to current capacity, planned capacity, electricity demand, or another quantity. A later answer that repeats the same number is not independent measurement unless it documents a separate dataset and method. The reviewed official statements do not establish that the C&W market totals and national figures use one shared definition. [@pib-india-dc-1575-and-demand] [@rajya-sabha-india-dc-capacity]

This report is a dated reference, not an industry census. It does not estimate facilities outside the named markets, verify project status, or forecast which planned sites will be commissioned. Future editions should replace the snapshot only after checking the new source’s date, geographic coverage, project stages, and arithmetic. Until then, the safest use is to quote each figure with those boundaries attached.

**Bottom line:** India’s public data-centre figures describe different scopes and stages; keep private-market estimates, national statements, and demand projections separate.

**Why it matters:** Combining incompatible MW figures can produce a false picture of usable capacity or future electricity demand.

**Key takeaways:**
- C&W reports 1,789 MW operational and 3,860 MW upcoming across its H1 2026 update.
- The 509-MW construction and 3,351-MW planning categories are stages of upcoming supply, not current operational capacity.
- PIB and Parliament records use different wording for a 13.56-GW 2031–32 figure.
- MW figures do not, without additional assumptions, establish annual energy use or GPU availability.
- Research 32 contains the separate arithmetic check of C&W’s seven displayed market rows.

**What changes:** Future updates should state their geographic universe, keep project stages distinct, and explain how a market estimate relates to national capacity statements.

**Evidence note:** The reference is built from one dated C&W market update and two official government records. It does not independently measure capacity or translate MW into GPUs.

**Related coverage:** Brief 1; Research 32–33; India compute flagship.

**Methodology:** Compare the scope and wording of one C&W market update and two government records. Research 32 separately audits the market-row arithmetic; this report does not independently count facilities.

## 42. AIKosh catalog totals: what the public counts do—and do not—show

**Slug:** `report-aikosh-catalog`  
**Topic:** Public data reference  
**Proposed dek:** Two public snapshots report sharply different AIKosh catalog totals. Without stable counting rules, they show what was reported—not a measured rate of growth.

### Two dated totals are not a growth series

AIKosh is a public catalog of datasets, models and other resources related to artificial intelligence in India. A July 2026 PIB release reports more than 14,000 datasets and 331 models; a February 2026 DD News report gives 7,541 datasets and 273 models. Those are two dated institutional statements about the catalog, not a verified time series. [@aikosh-pib-july-snapshot] [@aikosh-ddnews-february-snapshot]

It is tempting to subtract the earlier totals from the later ones and describe the difference as growth. The sources reviewed do not provide a shared counting method or say whether they count listings, unique datasets, model versions, duplicate records, withdrawn entries, or resources that remain accessible. The dates and numbers are clear; their comparability is not. This report therefore preserves each figure with its source and date and does not calculate a growth rate.

### The denominator is an editorial decision

“Dataset count” can refer to several different units. One page can describe a dataset, a collection can contain multiple files, and a dataset may have several versions or language variants. A catalog might also include records that are restricted, redirected, outdated, or incomplete. The published totals do not specify which of these cases are included or how duplicates are handled. These are questions for a future counting specification, not claims that any particular category is present in the reported totals.

For a useful public metric, the unit needs to be named before the count is published. Separate totals for catalog records, distinct datasets, model families, and versioned models would answer different questions. A dated count should also state how it treats duplicates, superseded records, private or restricted entries, and resources whose destination is no longer available. Without those rules, a larger number can reflect a broader definition as easily as a change in the underlying catalog.

### Catalog access and catalog scale are different questions

AIKosh’s Terms of Use describe datasets, models, tools and libraries as contributed resources and point users to specified licenses and end-use terms. That establishes a platform-level condition, not the permission or practical usability of every catalog item. A headline count measures neither how many resources a user can access nor how many are suitable for a specific research or deployment task. [@aikosh-terms]

The distinction matters for public infrastructure. Catalog scale can signal the breadth of material listed, while useful access also depends on findability, currentness, documentation, rights and delivery. Those properties need separate evidence. This report addresses the published totals and how they could be compared; Research 31 examines a purposive sample of five item pages and the fields visible to a prospective user. The sample is not used here to estimate catalog-wide quality or access. [@aikosh-terms]

### A reproducible method for future snapshots

Future catalog reports could make their totals comparable by publishing a short methods note with every snapshot. It should name the capture date, the record types included, the unit being counted, the rule for duplicates and versions, and how withdrawn or inaccessible records are treated. A stable record identifier and a public change log would let readers distinguish a new resource from a revised entry.

The calculation should preserve separate dataset and model totals instead of combining them into a single measure of “AI resources.” Where entries have versions, the report could show both the number of model families and the number of versioned records. Where the catalog has multiple visibility or access states, the count could publish those categories separately rather than implying that every listed item is equally available. These are recommendations for a transparent report, not descriptions of fields confirmed in the two count releases.

If a historical snapshot is not available, a future report should say so and avoid reconstructing a growth curve from press-release totals alone. A monthly archive of dated, machine-readable counts would make later changes auditable. It would also let researchers ask whether the catalog is expanding, becoming more accessible, or simply changing how it counts records—three different questions that a single headline total cannot answer.

### Findings, limitations, and open questions

The evidence reviewed supports a bounded finding: public sources reported 7,541 datasets and 273 models in February, and more than 14,000 datasets and 331 models in July. The report compared those statements and checked the platform’s general Terms of Use; it did not query an API, reconstruct historical records, or independently count the catalog. [@aikosh-pib-july-snapshot] [@aikosh-ddnews-february-snapshot] [@aikosh-terms]

The missing information is specific: what entity each source counted, whether both used the same inclusion rules, how they handled model and dataset versions, and whether the totals can be reproduced from archived catalog records. Until those points are answered, the two totals should be quoted separately with their dates and publisher attribution.

### What a useful catalog update should publish

For each release, publish the total by resource type, the precise unit, the counting date, the inclusion and deduplication rules, and links to an archived snapshot or reproducible query. Include a change log for renamed, versioned, withdrawn or newly added entries. Item-level fields such as license and access state remain important to users, but they should not be mistaken for the aggregate counting method. A separate field audit is linked in Research 31.

Until those definitions are available, AIKosh totals should be reported as dated statements from their publishers, not as a verified growth rate or a measure of usable public data.

**Bottom line:** The February and July AIKosh totals are dated snapshots; the public sources reviewed do not establish a comparable growth rate.

**Why it matters:** A catalog count can inform public reporting only when readers know what was counted, which records qualify, and how versions and duplicates were handled.

**Key takeaways:**
- The February 2026 DD News report gives 7,541 datasets and 273 models.
- The July 2026 PIB release reports more than 14,000 datasets and 331 models.
- Neither count passage supplies a shared unit, deduplication rule, or version policy.
- The comparison reviewed published statements; it did not recalculate catalog records.

**What changes:** Future snapshots should publish reproducible counting rules and archived, version-aware records so the totals can be compared over time.

**Methodology:** Compare the two dated count statements and the platform-level Terms of Use. No API query, historical catalog export, or independent item count was available; no growth rate is calculated.

**Evidence note:** This report uses the February DD News and July PIB count statements as dated evidence, and the AIKosh Terms of Use for platform context. The item-level sample and reuse checklist are covered separately in Research 31.

**Related coverage:** Research 31; Analysis 12; Brief 2.

## 43. Agent evaluation field guide for enterprise pilots

**Slug:** `report-agent-evaluation-field-guide`  
**Topic:** Enterprise reference  
**Proposed dek:** Build a pilot around the workflow, tool access, failure modes, and recovery requirements—not a single benchmark score.

### Define what the pilot must prove

An enterprise pilot must answer a local operational question: can this agent complete defined work within its access, approval, reliability, and cost boundaries? The checklist below turns that question into a versioned evaluation plan. Published research can help teams choose measures, but acceptance criteria must reflect the workflow, its users, and the consequences of failure. [@agent-evaluation-survey-2025]

Before testing, write down the workflow, the user’s intended outcome, the tools available to the agent, the data it may access, and the actions it must not take. Convert those into a small, versioned task set. Include routine cases, edge cases, and examples likely to trigger a refusal, handoff, or approval. Preserve a set of tasks for later regression checks rather than tuning every prompt against the same examples.

| Pilot area | Evidence to collect | What it does not establish by itself |
|---|---|---|
| Task completion | Whether the defined goal and acceptance criteria were met | Safe tool use or consistent results across new tasks |
| Output quality | Factuality, completeness, and policy compliance against a rubric | Reliability over repeated runs |
| Tool use | Correct tool, arguments, permissions, and action sequence | That the agent had only the access it needed |
| Reliability | Repeat runs, failure types, retries, and recovery behavior | Safety in a different environment |
| Safety and access | Denied actions, approvals, identity scope, and audit trail | Real-world risk outside the tested threat model |
| Operations | Latency, cost, escalation rate, and human review load | Long-term stability without ongoing monitoring |

### Test the process, not just the final answer

An agent can produce a plausible final answer after using the wrong tool, making an unauthorized attempt, or receiving substantial human correction. Capture the action trace and intermediate decisions where the platform permits. Score the final result, but also inspect tool selection, arguments, permission checks, rejected actions, retries, and handoffs. A trace makes the pilot’s evidence reviewable; it does not replace task scoring or a security review.

Public benchmarks can show how researchers test tasks, but their scores should not become local acceptance thresholds by default. Compare the benchmark’s task shape, tool set, environment, scoring rules, data access, and recovery requirements with the pilot before treating it as relevant. This field guide does not adopt a benchmark score as a target: a local result is meaningful only when the task records and operating conditions are disclosed.

For each metric, specify the denominator and scoring method. “Success rate” needs a definition of success. “Tool accuracy” should identify whether a correct tool call is enough or whether the action must also be authorized and useful. “Reliability” should include repeat runs and failure handling. If human reviewers score outputs, publish the rubric and the process for resolving disagreements. If an automated judge is used, compare it with a sample of human decisions instead of assuming it is unbiased.

### Include controls and recovery in the acceptance test

A pilot should verify that the agent has the correct identity, a limited tool set, and a clear approval path for sensitive actions. The OpenAI Agents SDK documents a flow in which a tool call can pause execution for approval and resume after a decision. Its documentation also says the application must authenticate and authorize the person approving the action. That makes approval a testable integration requirement, not a property guaranteed by adding a prompt to the agent. [@openai-agents-hitl-doc]

Auditability also needs a test. Google’s Gemini Enterprise Agent Platform documentation distinguishes Admin Activity, Data Access, and System Event logs; Data Access logging is disabled by default. A pilot should confirm which events are available, whether the relevant logging is enabled, and whether the organization can retrieve the records it needs. A log that exists but is unavailable to the review team does not meet an operational requirement. [@google-agent-audit-logging]

Test what happens when a tool fails, the model times out, an approval is rejected, or the run is interrupted. The agent should stop or recover in a known way, preserve enough state for review, and avoid repeating an action that may already have succeeded. Include a rollback or manual completion procedure for actions that affect customer records, money, infrastructure, or other high-impact systems.

### Set thresholds before looking at the result

Choose acceptance limits before the pilot starts. Possible thresholds include minimum completion rate on the defined task set, maximum unauthorized-action attempts, maximum escalation load, and required trace completeness. A pilot can also establish a baseline for human review time and operating cost. Thresholds should match business risk: a reversible draft-writing task and an irreversible production action should not share one pass/fail rule.

The test plan should state the model and checkpoint, prompts, tools, permissions, software version, dataset, evaluation period, and any human intervention. Re-run the same suite after a model update or tool change, but keep the prior result so users can see whether a change helped or introduced regressions. Benchmark scores can inform the test design, but they do not replace a local evaluation.

### Limits of this guide

This guide is a planning template, not evidence of product performance. OpenAI and Google documentation describes specific platform capabilities, not how a customer configured them. No benchmark establishes that a local deployment has appropriate permissions, recovery behavior, or operating cost. Those questions require a local test with the actual tools, identity, data, and approval path.

**Bottom line:** An enterprise pilot should evaluate task results, action traces, reliability, safety, permissions, and recovery as separate requirements.

**Why it matters:** A demo can succeed while hiding weak recovery, broad permissions, high human-review costs, or an incomplete audit trail.

**Key takeaways:**
- Define the task and boundary before choosing a benchmark.
- Score the trace and tool actions as well as the final response.
- Test repeatability, interruptions, approval rejection, and tool failure.
- Verify identity and audit settings in the actual deployment.
- Set risk-based acceptance thresholds before running the pilot.

**What changes:** Preserve a versioned evaluation suite and rerun it after model, tool, prompt, or permission changes.

**Evidence note:** The survey informs evaluation categories; official platform documents describe particular capabilities. None of these sources validates a customer deployment or supplies universal acceptance thresholds.

## 44. AI agent security: controls at tools, identity, and approval

**Slug:** `report-agent-security-controls`  
**Topic:** Security reference  
**Proposed dek:** Review an agent’s identity, tool permissions, approvals, runtime boundaries, and audit trail as separate controls.

### Use the register to request evidence

OWASP’s agent-risk guidance identifies categories such as tool misuse and identity or privilege abuse; its Agent Control Standard describes a project direction for runtime policy and observability. Neither source certifies a vendor or deployment. This register translates those topics into evidence a reviewer can request and test, rather than ranking products or prescribing a single architecture. [@owasp-agentic-top10-2025] [@owasp-acs-2026]

| Risk area | Control to review | Evidence to request |
|---|---|---|
| Identity and privilege | Prefer an identity whose access matches the user or service performing the task | Credential owner, scope, expiry, delegation behavior |
| Tool misuse | Allow only required tools and restrict arguments or destinations where possible | Tool list, allow/deny rules, sandbox and network boundaries |
| High-impact action | Pause for a named, authorized reviewer when policy requires approval | Approval event, approver identity, decision binding, rejection behavior |
| Runtime policy | Enforce policy at a control point outside the model’s natural-language instructions | Hook or middleware configuration, deny behavior, failure mode |
| Audit and investigation | Record actor, action, time, target, decision, and result | Log categories, retention, access controls, and retrieval test |
| Recovery | Stop, resume, or roll back safely after interruption or failure | Duplicate-action protection, state integrity, recovery test |

### Verify identity and permission evidence

Ask the owner to identify the service or user principal, credential scope and expiry, delegation behavior, and revocation process. LangSmith Fleet documentation distinguishes fixed credentials from user credentials and describes role- and attribute-based tool access; Claude Code documents allow, ask, and deny rules for tools. These are product-specific capabilities, not proof that they are enabled or correctly configured in the system under review. The audit record should include the actual configuration and a test showing that an out-of-scope request is rejected. [@langsmith-fleet-oversight] [@anthropic-claude-code-permissions]

### Confirm approval evidence

The OpenAI Agents SDK documents a tool call pausing for approval and resuming after a decision; the application must authenticate and authorize the approver. Reviewers should confirm that the recorded decision identifies the approver and applies to the exact operation and arguments, then inspect rejection, timeout, stale-request, and replay behavior. A product’s approval feature does not show that a deployment has connected it to the right identity or policy. [@openai-agents-hitl-doc]

### Record logging configuration and retrieval

Google’s Gemini Enterprise Agent Platform documentation distinguishes Admin Activity and System Event logs, which are always enabled, from Data Access logs, which are disabled by default. Reviewers should record which event classes are enabled, who can retrieve them, their retention period, and whether a representative tool action appears in the expected log. A logging statement in a product guide is not evidence that the organization can retrieve the records it needs. [@google-agent-audit-logging]

### Inspect the runtime enforcement path

Request a map of where each tool call is authorized, which operations bypass that check, and what happens if the policy hook is unavailable. Inspect a denied-action trace and confirm that high-impact operations stop rather than proceed under a fallback permission. The Agent Control Standard describes runtime hooks as a design direction; the reviewer still needs evidence that the deployed control covers the tools and side effects in scope. [@owasp-acs-2026]

### A review sequence for an agent deployment

Before launch, identify the agent’s service and user identities, tools, data scopes, and irreversible actions. Confirm that the minimum required privileges are used. Test approved, denied, and approval-required paths, including malformed inputs and untrusted content. Verify that logs capture the right actor and event, that sensitive data is not accidentally exposed in stored run state, and that interruptions cannot duplicate an action. Finally, document an owner and a rollback route for each high-impact workflow.

This checklist is not a certification standard and does not replace a threat model or penetration test. The cited sources include a community threat list, a project standard, and product documentation. They support control questions, but they do not prove a customer configuration is secure or show comparative product effectiveness.

### Keep an evidence packet for each workflow

For one high-impact workflow, record its owner, requesting principal, data involved, tool set, target resources, and the side effects the agent can create. Attach the deployed permission configuration, approval policy, logging settings, and recovery procedure. Link each control claim to an artifact from the environment under review: a vendor page can show that a feature exists, but not that it is enabled or covers this workflow.

Capture one authorized action, one denied request, one approval-required action, and one interrupted or failed run. For each, preserve the expected and observed result, the identity presented to the tool, the target and arguments, the approval decision, and a trace that a reviewer can retrieve. The failed test must stop at an enforcement point; a model saying “I can’t” does not show that a tool request was blocked. [@openai-agents-hitl-doc] [@google-agent-audit-logging]

Classify each evidence gap as a missing control, a configuration gap, an unavailable trace, or an inconclusive test. Assign an owner and a retest date, and keep failed and remediated results together. This does not certify the workflow; it makes the remaining risk specific enough for an accountable review.

Close a review item only after the retest passes and the trace can be retrieved; a configuration change without a retest leaves the evidence packet incomplete.

**Bottom line:** Secure agent deployment requires separate, testable controls for identity, tools, approvals, runtime policy, audit, and recovery.

**Why it matters:** A well-written instruction cannot compensate for an agent that has broad credentials or can execute sensitive actions without a traceable decision.

**Key takeaways:**
- Threat guidance helps identify risks but is not a universal compliance rule.
- User identity, shared credentials, tool permissions, and approval are distinct decisions.
- Approval workflows need application-level authentication and authorization.
- Logs aid investigation but do not prevent unauthorized actions.
- Verify behavior in the actual environment; documentation alone is not a security test.

**What changes:** Maintain a deployment control register linking each high-impact action to its identity, permission, approval, logging, and recovery requirements.

**Evidence note:** The report synthesizes OWASP guidance and official platform documentation; it does not test products or certify deployments.

## 45. A reader’s archive of 2026 model cards

**Slug:** `report-2026-model-card-archive`  
**Topic:** Model release reference  
**Proposed dek:** Keep a dated index of primary model documentation, label each document type, and preserve the limits its publisher disclosed.

### An archive should preserve evidence, not rewrite the launch

Model documentation is useful only if readers can find the exact record that supports a claim. A model card, system card, and launch page may all contain evaluation information, but they are not interchangeable documents. A card can describe a model’s intended use, limitations, training or evaluation scope. A system card can provide a broader account of deployment risk and testing. A launch page may announce access and selected results without providing a standalone card. This archive keeps those formats distinct. [@gemma4-model-card] [@gemini38-flash-card] [@claude-sonnet55-system-card] [@grok47-model-card] [@openai-gpt6-sol-luna-release]

| Publisher and record | Document type | Date shown in captured record | Archive note |
|---|---|---|---|
| Google AI for Developers — Gemma 4 | Model card | No publication date visible in the captured page; captured 4 October 2026 | The card contains model variants, intended-use and limitation sections, evaluation data, and parameter details. Its fields should not be compared directly with a provider’s system-card rubric. |
| Google DeepMind — Gemini 3.8 Flash | Model card | Published 2 September 2026 | The card says it may be updated as the model changes; it reports provider-run evaluations and lists known limitations, including hallucinations and occasional timeout or slowness. |
| Anthropic — Claude Sonnet 5.5 | System card | 28 September 2026 | The card documents evaluation scope and limitations, including assessments it says are costly or labor-intensive; the listed results remain Anthropic’s own disclosures. |
| xAI — Grok 4.7 | Model card | 21 September 2026 | The card reports benchmark results and says some benchmark versions changed; comparisons across versions may therefore be invalid. |
| OpenAI — GPT-6 Sol and Luna | Release page, not a standalone model card | 22 September 2026 | Keep it in a companion release index so its document type is not mistaken for a model card. Its evaluations and comparisons are OpenAI-reported. |

The dates above describe the date shown in each captured record, not a shared standard for when a model was released or became available. A card may be published after an announcement; a product or API may arrive on a different date. Report 50 tracks those events as a timeline. This archive instead points readers back to the underlying documentation and records what kind of evidence it contains. [@gemini38-flash-card] [@claude-sonnet55-system-card] [@grok47-model-card] [@openai-gpt6-sol-luna-release]

### Keep the fields that make a card findable

An archive record should contain the provider, exact model name, document type, source URL, visible publication or update date, retrieval date, and a short description of disclosed scope. If the publisher updates the page without a clear version label, keep a dated capture and note that the record changed. This prevents a later reader from treating today’s page as proof of what was available when an earlier report was written.

The fields also need boundaries. A provider’s benchmark score should be tagged as provider-reported unless an independent evaluation is cited. A card’s limitation section is evidence of what the publisher chose to disclose; it does not prove that the list is complete. A document’s inclusion in this index is not an endorsement, a ranking, or a safety assessment. [@gemma4-model-card] [@gemini38-flash-card] [@claude-sonnet55-system-card] [@grok47-model-card]

### A compact comparison without a quality ranking

The five records are not a like-for-like benchmark. The Gemma 4 page identifies effective and total parameter counts separately for some variants. Gemini 3.8 Flash’s card describes its own evaluation date and its relationship to earlier model-family testing. Anthropic’s system card includes domain-specific evaluation and external testing disclosures. xAI describes both benchmark performance and a deployed-checkpoint convention. OpenAI’s Sol/Luna page presents launch information and provider-selected results, but it is not a standalone model card. These differences are useful when judging the record’s scope; they do not support a cross-provider performance ranking. [@gemma4-model-card] [@gemini38-flash-card] [@claude-sonnet55-system-card] [@grok47-model-card] [@openai-gpt6-sol-luna-release]

Readers should also avoid assuming that a card’s existence means every relevant field is present. A missing publication date is not evidence that a provider did not publish a card; it means this captured page does not expose a date that can be confidently entered. A short launch page should not be described as a missing safety card unless the provider’s documentation index has been checked. Archive language should report what the page shows, not infer the publisher’s intent.

### How to maintain the archive

When a provider posts a revised card, add a new version entry or a dated update record rather than overwriting the previous capture. Record the URL that was reviewed, the retrieval date, any explicit version string, and the sections changed. Link to the publisher’s current page and retain a prior snapshot when the project’s evidence policy permits it. If the page is removed or replaced, mark that status rather than silently deleting the record.

Separate cards from adjacent records: announcement, API documentation, benchmark post, system card, and third-party test should have distinct types. A source map can then point from a story to the document that actually supports each claim. Independent testing should be listed separately, with its method and model version, rather than folded into the provider’s release materials.

This snapshot contains five first-party records selected because they are relevant to September 2026 coverage. It is not a complete catalogue of all 2026 model documentation. Nor does it evaluate the models themselves. Its purpose is to give readers a stable path to the original evidence and a clear warning about what that evidence can and cannot establish.

When a story cites the archive, its reference should point to the exact document row that supports the claim, not to the index as a general endorsement of the model.

**Bottom line:** Archive primary model documents by exact name, type, date, and version; do not treat launch copy, model cards, system cards, and independent tests as equivalent.

**Why it matters:** When release pages change, the underlying evidence and its disclosed limitations can become difficult to find or mischaracterized.

**Key takeaways:**
- The captured set includes model cards, a system card, and a launch page; they are not the same document type.
- A provider’s evaluation disclosures are not independent validation.
- Publication, announcement, and availability dates should be stored separately.
- A missing date in a captured page should remain unknown, not be inferred.
- Keep dated records when publishers revise or replace a page.

**What changes:** A useful archive should expose stable source links, capture dates, document types, version history, and separate independent tests.

**Evidence note:** Five first-party records from Google, Anthropic, xAI, and OpenAI were captured on 4 October 2026. The set is selective, not a census or comparative evaluation.

**Related coverage:** Research 35 and 37; Report 50; Essay 63.

## 46. EU AI obligations: what is in force and what is proposed

**Slug:** `report-eu-ai-act-status-2026`  
**Topic:** Policy reference  
**Proposed dek:** A dated status table separates the EU AI Act’s staged application, official implementation guidance, and the separate EU KIDS Act proposal.

### A legal status map needs more than one start date

The EU AI Act is a regulation with staged application dates. The consolidated text of Article 113 gives a general application date of 2 August 2026, but it also lists provisions that applied earlier and exceptions that apply later. The European Commission’s public materials separately describe general-purpose AI (GPAI) obligations and its enforcement role. A useful status reference should identify which document supplies each date rather than reducing the whole law to a single “effective from” headline. [@eu-aiact-article-113] [@eu-gpai-obligations] [@eu-commission-enforcement-2026]

| Status item | Date or stage stated in official material | How to describe it |
|---|---|---|
| Chapters I and II, with stated exceptions | 2 February 2025; specified Article 5 provisions have a later 2 December 2026 date | A staged application date, not the start date for every obligation |
| Chapter V and other provisions listed in Article 113 | 2 August 2025, with exceptions including Article 101 | Apply the exact provision and exception when describing GPAI provider obligations |
| General application date | 2 August 2026 | The regulation’s broad application date, subject to Article 113’s earlier and later stages |
| Certain high-risk AI systems under Annex III | 2 December 2027 in the consolidated text reviewed | A later application date for the specified category |
| Certain high-risk systems under Annex I | 2 August 2028 in the consolidated text reviewed | A later date for systems classified under Article 6(1); keep it separate from the Annex III date |
| EU KIDS Act | Proposal presented in September 2026 | Proposed legislation, not an enacted requirement |

The table is a navigation aid rather than a substitute for reading the relevant articles. Article 113 is the controlling source for staged dates; the Commission’s GPAI page explains obligations for providers and distinguishes the application timetable from the Commission’s enforcement function. The Commission said its GPAI enforcement powers begin on 2 August 2026, while providers of models placed on the market before 2 August 2025 have until 2 August 2027 to comply with the relevant GPAI obligations. Those are different transitions: one concerns the Commission’s role, the other a transition for pre-existing models. [@eu-aiact-article-113] [@eu-gpai-obligations] [@eu-commission-enforcement-2026]

### Guidance is not the same as the regulation

Commission guidance, templates, and codes of practice can help organizations understand implementation expectations. They do not change the enacted text by themselves. When a report refers to a specific duty, it should link the regulation article and name the relevant guidance separately. When a page describes a code or template as voluntary, retain that label and avoid describing it as a mandatory legal obligation. [@eu-gpai-guidelines] [@eu-gpai-obligations]

This distinction is particularly important for GPAI providers. The Commission’s materials explain which provider duties apply, the timeline, and the role of the AI Office. A company announcement that it has signed a code or adopted a template is evidence of that company’s stated action; it is not by itself proof that every applicable requirement has been met. The legal question depends on the provider, model, date, and specific provision.

### The EU KIDS Act remains a proposal

The European Commission presented the EU KIDS Act proposal in September 2026. The proposal would address protections for children in digital environments, but the proposed text has not become an enacted regulation. A proposal can change during negotiation, and its obligations cannot be reported as current law. The Commission’s proposal document and legislative metadata establish that it is proposed; the date and legal status should be checked again before publication or reuse. [@eu-kids-act-proposal-2026]

For a side-by-side account, keep the existing AI Act in one column and the proposed KIDS Act in another. Separate the legal instrument, its status, the people or services it would cover, and the obligations described in the text. Avoid saying that the proposal “amends the AI Act” unless the official text confirms the precise legal mechanism. Do not infer a compliance deadline from a proposal’s target date.

### A practical update protocol

For every update to this reference, check the current consolidated regulation, the relevant Commission page, and the legislative record for any proposal discussed. Record the page or document date and the date checked. Copy dates alongside the exact article or transition they govern. If an amendment changes Article 113 or another cited provision, revise the table and state which version of the consolidated text was used.

Organizations should map these public dates to their own role and systems rather than assuming the same requirement applies to every provider, deployer, importer, or distributor. A general-purpose model provider, a deployer of a high-risk system, and an organization using a consumer-facing AI service may face different provisions. This report identifies public legal stages; it does not decide which category an individual organization falls into.

Each internal entry should also preserve the date the source was checked and the exact provision it relies on. That makes it possible to distinguish a later change in official guidance from a change in the enacted regulation, and to revisit the classification without silently rewriting the earlier assessment.

A published summary should show a “checked through” date beside each status, not only the date of the underlying law. If the current consolidated text was not reviewed, mark that limitation and recheck the status before reuse.

**Bottom line:** As of 4 October 2026, the EU AI Act is in staged application, Commission guidance is distinct from the regulation, and the EU KIDS Act is still a proposal.

**Why it matters:** Confusing a proposal, guidance document, and current legal duty can cause teams to misstate their obligations.

**Key takeaways:**
- Article 113 includes earlier and later dates around the general 2 August 2026 application date.
- GPAI obligations and Commission enforcement powers have separate transition dates.
- Commission guidance and codes should be labeled separately from enacted law.
- The EU KIDS Act proposal is not a current legal obligation.
- Recheck the consolidated text and proposal status before each update.

**What changes:** Maintain a dated legal-status table keyed to article, affected actor, application date, and proposal status.

**Evidence note:** The report uses the consolidated Article 113 text and Commission materials captured by 4 October 2026. It is a public-status reference, not legal advice.

## 47. India data-centre resource evidence: energy, water, and grid limits

**Slug:** `report-data-centre-energy-evidence`  
**Topic:** Energy and infrastructure reference  
**Proposed dek:** India’s data-centre power, water, capacity, and grid claims come from different sources and evidence types. Keep each estimate attached to its attribution, date, and measurement boundary.

### Build an evidence register, not a single forecast

Indian data-centre reporting brings together capacity statements, secondary estimates of electricity and water use, and discussion of grid constraints. These are not one consistent measurement series. This register focuses on the India-specific evidence and preserves each source’s attribution and limitations; it is not a national meter reading or an AI-only inventory. [@ceew-india-data-centre-resource-study] [@ieefa-india-data-centre-grid-analysis]

| Source | Geography and period | Figure in the source | Evidence type and limit |
|---|---|---|---|
| CEEW data-centre study | India, 2024 | About 0.5% of national electricity and about 150 billion litres of water | CEEW cites external estimates for these figures; not direct national metering by CEEW |
| IEEFA India analysis | India, source-relative baseline to 2030 | Cites capacity rising from 1.4 GW (called “last year” in the source) to 9 GW and a 3% electricity-use estimate for 2030 | Figures are attributed to other reports and forecasts; the relative baseline date is not converted into a current-year figure |

The CEEW and IEEFA figures should not be added or treated as one measured series. The electricity share, water estimate, capacity baseline, future capacity, and projected electricity share come from different underlying reports and use different units and dates. Attribution and evidence labels are part of the record, not optional footnotes. [@ceew-india-data-centre-resource-study] [@ieefa-india-data-centre-grid-analysis]

### Separate sector growth from AI attribution

The same discipline is needed for India. CEEW’s report places data-centre growth in the context of power, water, land, and state policy. It says that its 2024 electricity and water figures come from external studies and that both could more than double by 2030. That is an attributed estimate and projection, not a national meter reading or a measurement of AI facilities alone. IEEFA’s page uses the relative phrase “last year” for a 1.4-GW capacity baseline, cites 9 GW for 2030, and points to a forecast that data centres could use around 3% of India’s electricity by then. Because the captured page does not provide a publication date next to that sentence, keep “last year” as the source’s wording rather than converting it into a current-year claim. These numbers describe forecasts with dependencies; they should not be presented as observed outcomes. [@ceew-india-data-centre-resource-study] [@ieefa-india-data-centre-grid-analysis]

Capacity and electricity use are related, but they are not interchangeable. A capacity value in GW describes a power level; annual consumption in TWh depends on load and operating time. A data-centre capacity forecast cannot be turned into annual energy without assumptions about utilization, facility efficiency, and what power boundary the source counts. Likewise, a water-use estimate should state whether it includes on-site cooling, indirect water associated with electricity generation, or both.

For a siting or sourcing decision, keep four evidence tracks separate: reported electricity share, water use, planned capacity, and grid access. They describe different questions, even when they concern the same sector. A value in one track does not validate the others; a national estimate cannot establish that a particular facility has a dependable connection or a measured water balance. Readers should request site-level records before applying sector claims to an operational decision.

### Grid access and resource use need their own evidence

The India sources also show why an energy-only headline may conceal operational constraints. IEEFA describes concentrated demand around major data-centre hubs and discusses renewable supply, storage, grid connections, and local power networks. CEEW reports stakeholder views on grid limitations and dual sourcing, where a facility can maintain a full-capacity grid connection while purchasing part of its energy through non-discom renewable routes. These arrangements may affect how grid capacity and contracted clean energy are interpreted; they do not prove that a data centre receives uninterrupted renewable electricity every hour. [@ieefa-india-data-centre-grid-analysis] [@ceew-india-data-centre-resource-study]

Water is a separate location-specific resource question. CEEW notes that water risks vary by site and that smaller facilities may rely heavily on municipal supplies. The report describes state policy provisions on water governance and cooling, but policy text does not establish actual consumption at a particular facility. A useful operational comparison would need facility-level water withdrawals, recycled water, cooling technology, local basin stress, and a consistent boundary. [@ceew-india-data-centre-resource-study]

### How to update the evidence register

For each new figure, retain the publisher, original data source, publication date, geography, measurement period, unit, denominator, and whether it is an observation, estimate, scenario, or forecast. Record whether AI workloads are isolated, whether the value is facility power or IT load, and whether water includes direct or indirect use. If a report repeats a number from another organization, link the original and identify the attribution.

Do not convert GW to TWh without a stated utilization assumption. Do not convert a national percentage into AI’s share without workload-level allocation. Do not interpret an announced renewable contract as proof of 24/7 carbon-free supply. Do not treat a scenario’s high endpoint as the expected outcome. Where sources disagree, preserve both values and their methods until a comparable boundary is available.

This report is an India-focused reference, not a comprehensive national inventory. It does not provide facility-level measurements, a consistent time series, or an AI-specific electricity total. The figures are dated claims and attributed estimates that retain their underlying scope.

**Bottom line:** Public data-centre energy evidence spans observed increases, estimates, scenarios, and attributed forecasts; each number needs its own source and scope.

**Why it matters:** Combining different geographies and evidence types can make an uncertain forecast appear like a measured, AI-only total.

**Key takeaways:**
- CEEW and IEEFA cite secondary Indian estimates and projections; they are not facility-level measurements.
- Capacity, electricity consumption, renewable procurement, and water use require different units and boundaries.
- Grid connection and water availability vary by site and cannot be inferred from a national total.

**What changes:** A useful annual update should include source provenance, native units, geography, period, evidence type, and any AI-specific allocation method.

**Evidence note:** The register combines CEEW and IEEFA reporting and preserves their attribution to underlying estimates. It does not treat those figures as direct national measurements.

## 48. Small-model deployment: hardware, memory, and workflow fit

**Slug:** `report-small-model-deployment-guide`  
**Topic:** Technical reference  
**Proposed dek:** Estimate weight memory first, then account for context, runtime, concurrency, and task quality before selecting a local model.

### Start with the workload, not the model label

“Small” can describe a product family, an active-parameter count, or a model intended for edge devices. Those labels do not guarantee that the complete model will fit in a particular device’s memory. Google lists Gemma 4 variants at E2B, E4B, 12B, 31B, and 26B A4B, with different context limits and quantization options. Mistral calls one model Small 4, but its documentation lists 119 billion total parameters and 6.5 billion active parameters. A team should check the actual model record rather than assume that the name describes its hardware footprint. [@gemma4-deployment-overview] [@mistral-small4-official-doc]

| Question | What to record | Why it matters |
|---|---|---|
| What model is being loaded? | Exact model, revision, total parameters, active parameters if given, modality, license | Names and active-parameter counts do not define storage requirements |
| Which weights will be used? | Precision, quantization format, file size, source and conversion method | Quantization can reduce weight size and alter quality |
| What is the target device? | GPU/accelerator model, usable memory, system RAM, power and cooling limits | Advertised memory is not all available to the model process |
| What context is required? | Prompt length, output length, concurrent sequences and batch size | KV cache and activations grow with runtime use |
| What does the workflow require? | Task set, tool calls, latency target, privacy boundary, fallback | A model that loads may still be unsuitable for the job |

### Use a weight-only estimate as a first filter

A quick lower-bound estimate for raw weight storage is:

**Total parameters × bits per weight ÷ 8**

Using decimal gigabytes and idealized bit widths, a 31-billion-parameter model at 16-bit precision requires about 62 GB for weights alone; at 4 bits, the arithmetic gives about 15.5 GB. For Mistral Small 4’s 119 billion total parameters, the same 4-bit arithmetic gives about 59.5 GB. These calculations do not include quantization metadata, model-specific packing, runtime buffers, KV cache, activations, operating-system use, or memory fragmentation. They are screening estimates, not measured requirements. [@gemma4-deployment-overview] [@mistral-small4-official-doc] [@llama-cpp-quantization]

NVIDIA specifies 32 GB of GDDR7 memory for the GeForce RTX 5090. The simplified 31B-at-4-bit estimate is below that capacity, but this does not prove that a 31B model will fit at the requested context length or run at an acceptable rate. The 119B-at-4-bit estimate exceeds 32 GB before runtime overhead. That says only that all weights cannot fit in the card’s memory under this simple assumption; offloading, multiple accelerators, a different quantization, or a hosted endpoint change the deployment design. [@nvidia-rtx5090-spec] [@vllm-gpu-memory]

For a mixture-of-experts model, active parameters are relevant to computation but should not be substituted automatically for total weights in the storage calculation. The operator must check how the serving runtime loads or offloads experts. Mistral’s “6.5B active” figure by itself does not establish that its 119B parameter set fits in 6.5B-parameter memory. [@mistral-small4-official-doc]

### Account for context and concurrent work

Weights are only one component of inference memory. vLLM’s GPU memory documentation separates model weights, KV cache, activations, CUDA and framework overhead, and other allocations. It explains that KV cache use scales with sequence length and the number of sequences in a batch. Long context, long outputs, or more concurrent users can therefore exhaust memory even when the model weights load successfully. [@vllm-gpu-memory]

The published context limits also differ: the Gemma overview lists 128K for E2B and E4B and 256K for its medium variants; Mistral Small 4 lists a 256K context. A context maximum is not a guarantee that a particular GPU can serve the maximum with a chosen batch size. Local tests should set a realistic prompt and output length, then measure memory under the expected concurrency rather than testing one short prompt. [@gemma4-deployment-overview] [@mistral-small4-official-doc] [@vllm-gpu-memory]

Power and physical constraints matter too. NVIDIA lists 575 W total graphics power for the RTX 5090 and recommends a 1,000 W system power supply. A workstation plan should include cooling, sustained load, available connectors, and the power envelope of the whole system, not just VRAM. These are hardware specifications, not a model-specific speed result. [@nvidia-rtx5090-spec]

### Quantization needs a quality check

Google documents Gemma 4 in default 16-bit precision and lower-precision formats, including quantization-aware checkpoints for supported runtimes. The llama.cpp quantization guide describes conversion and quantization formats and warns that reducing precision can introduce accuracy loss, which it discusses with measures such as perplexity and Kullback–Leibler divergence. A smaller file should therefore be tested on the task, language, and output format that matter to the deployment. [@gemma4-deployment-overview] [@llama-cpp-quantization]

This report does not compare measured tokens per second across Gemma 4, Mistral Small 4, or GPUs. The reviewed sources do not provide one independent, same-hardware, same-quantization, same-context test for these exact models. Vendor performance pages, where available, should remain attributed to the provider and should not be joined to a different model’s test as if conditions matched.

### A repeatable local deployment check

Before committing hardware, a team can:

1. Pin the model revision, license, runtime, quantization format, and hardware.
2. Confirm the complete model file size and whether all required weights are resident or offloaded.
3. Test at the intended context length and number of concurrent sequences.
4. Record peak GPU memory, system RAM, startup time, latency percentiles, throughput, power, and failure rate.
5. Compare output quality and tool behavior with the unquantized or hosted baseline using a fixed task set.
6. Repeat runs after changing runtime, quantization, batch size, or model revision.
7. Set a fallback for out-of-memory errors, poor-quality responses, or tasks the local model cannot complete.

Keep privacy and locality claims separate from these measurements. Running a model on a local device can change where inference occurs, but it does not by itself establish that prompts, logs, updates, backups, telemetry, and connected tools remain local. Those boundaries depend on the complete application and deployment configuration.

**Bottom line:** A parameter count can screen for weight memory, but context, quantization, runtime, device limits, and task quality determine whether a deployment is practical.

**Why it matters:** A model may load on a device and still fail at production context length, concurrency, quality, or power limits.

**Key takeaways:**
- Read total and active parameter counts separately.
- Treat bit-width arithmetic as a weight-only lower bound, not a sizing guarantee.
- Include KV cache, activations, runtime overhead, context, and concurrency.
- Quantization trades memory for possible quality change and needs task-specific checks.
- Do not compare speed without identical models, hardware, precision, context, and workload.

**What changes:** Maintain a dated model/device matrix with exact revisions, quantization, measured memory, and reproducible workload results.

**Evidence note:** The guide uses official Google, Mistral, and NVIDIA documentation plus llama.cpp and vLLM technical documentation. It publishes no model-performance benchmark.

## 49. Content provenance implementation guide for publishers

**Slug:** `report-content-provenance-guide`  
**Topic:** Implementation reference  
**Proposed dek:** A publisher needs a signing and verification workflow, a clear status display, and a recovery plan for credentials that are absent or no longer valid.

### Treat provenance as a record, not a truth score

C2PA provides a technical format for recording claims about digital content and binding a manifest to an asset. The current specification reviewed for this guide is version 2.4. A valid credential can help a reader inspect a signed provenance record; it does not prove that the depicted event is factual, that every edit is disclosed, or that the asset is trustworthy for every use. Absence of a credential is likewise not evidence that a file is fake. [@c2pa-spec-24]

Publishers should plan the complete asset lifecycle: capture or ingest, editing, signing, export, hosting, display, verification, and preservation. If the production system strips metadata or transforms an image after signing, the manifest may no longer bind as expected. If a later edit is legitimate, the workflow should produce a new, linked record rather than silently implying that the original signature covers the altered file. [@c2pa-deployment-guidance-2026]

### Map responsibilities and signing authority

First identify who creates the provenance claim and whose certificate signs it. The C2PA deployment guidance distinguishes a credential that is cryptographically valid from one whose signer is trusted through the C2PA Trust List. Those statuses should not be collapsed into a generic green “authentic” badge. The user interface should explain whether a credential is present, whether its cryptographic checks passed, and whether the signer is trusted under the verifier’s current trust policy. [@c2pa-deployment-guidance-2026]

Keep signing keys under controlled access and define how certificates are issued, renewed, protected, and revoked. A newsroom should assign an accountable owner for each signing identity and limit which systems can use it. Signing all output with a shared, untracked key makes it difficult to identify the responsible production system or respond to compromise.

### Preserve the record through the editorial workflow

Use tools that maintain compatible manifests when cropping, color-correcting, transcoding, or exporting a new version. Maintain the relationship between the source asset and the published derivative. If the CMS resizes images, the publisher should test whether the selected pipeline preserves or re-establishes the credential after the transformation.

The official deployment guidance recommends applying credentials automatically where possible, maintaining the provenance chain through compatible tools, and making credentials visible to users. It also describes durable credentials, where a manifest can be retrieved through supported mechanisms when an embedded credential is not available. The publisher should document which mechanism its production tools use and what happens when the repository or embedded record cannot be reached. [@c2pa-deployment-guidance-2026]

The open-source `c2patool` can read manifest information, produce reports, and add a manifest to a file. It is useful for testing a pipeline and inspecting a sample asset, but the tool’s ability to sign or read a claim is not proof that the underlying editorial statement is true. Run the same asset through the intended publication and verification path, not only through a command-line demonstration. [@c2pa-c2patool-docs-2026]

### Verify status and handle failures carefully

At the point of publication and receipt, test at least four states: a valid trusted credential; a cryptographically valid credential with an untrusted signer; a credential with an invalid or mismatched binding; and an asset with no credential. The interface should state what the verifier found and offer the record for inspection. It should not replace these states with a binary “real/fake” judgment. [@c2pa-deployment-guidance-2026] [@c2pa-c2patool-docs-2026]

Security testing belongs in the workflow. The Content Authenticity Security Tool can generate malicious manifests and files for testing parser handling, including XSS and injection cases. Its documentation says the tool creates test artifacts but does not automatically determine whether an attack succeeded; teams must run the tests against their own parsers and validate the result. [@c2pa-security-test-tool-2026]

A 2026 independent analysis examines C2PA specification versions 2.2 through 2.4 and real-world implementations. It reports concerns around timestamp manipulation, certificate revocation checks, and validator consistency. These are the authors’ security findings, not proof that every signed file is compromised. They are a reason to pin the specification and validator versions, test trust and revocation behavior, and follow subsequent corrections and independent review. [@c2pa-independent-security-study-2026]

### A publisher rollout checklist

1. Inventory every system that ingests, modifies, signs, stores, or publishes an asset.
2. Define the signer identity, certificate owner, key access, renewal, and revocation process.
3. Pin the C2PA version, signing library, validator, and trust-list policy used in production.
4. Test edits, resizing, compression, format conversion, and CMS delivery against a representative asset set.
5. Display the credential’s actual status and offer a way to inspect the manifest.
6. Test missing, invalid, untrusted, expired, or revoked credentials without labeling the underlying content as false.
7. Use security test cases against the parser and confirm whether they succeed in the deployed environment.
8. Retain original assets and a documented recovery path for key compromise or a validator defect.

**Bottom line:** C2PA can make provenance claims inspectable, but a publisher must implement signing, trust, editing, display, verification, and security testing as separate controls.

**Why it matters:** A credential badge that hides trust status or fails after ordinary editing can mislead users even when the underlying standard is implemented.

**Key takeaways:**
- A valid credential and a trusted signer are distinct statuses.
- Signing records a claim; it does not verify the truth of the claim.
- Test the entire publishing path, including CMS transformations and the reader-facing verifier.
- Missing credentials do not establish that content is false.
- Security research and tools should inform implementation-specific testing, not be generalized into a binary verdict on every C2PA asset.

**What changes:** Maintain a versioned signing/verification profile, test corpus, status-display policy, and key-compromise response plan.

**Evidence note:** The guide uses the C2PA 2.4 specification, July 2026 deployment guidance, official tools, a security-testing utility, and one independent 2026 analysis. It does not test a publisher’s production implementation.

## 50. September 2026 AI model-release timeline and source archive

**Slug:** `report-september-model-release-timeline`  
**Topic:** Dated release reference  
**Proposed dek:** A release date, a card date, and a hosting date describe different events; this snapshot records each only when the source establishes it.

### A month of releases needs a source archive

This timeline covers five September 2026 model announcements or documentation events from Google DeepMind, xAI, OpenAI, and Anthropic. It is a dated snapshot checked through 4 October 2026, not a complete list of every model release. The archive separates the announcement, model or system card, and third-party availability dates so that a later report can tell what changed and when. [@google-gemini-38-audio-card] [@xai-grok47-release] [@openai-gpt6-sol-luna-2026] [@anthropic-sonnet55-system-card] [@openai-gpt61-sol-release]

| Date | Provider and event | Documentation event | Availability or distribution evidence | What this record establishes |
|---|---|---|---|---|
| 15 September | Google DeepMind publishes Gemini 3.8 Audio model cards | Card date and evaluation snapshot are stated in the first-party card | The card lists supported product/API surfaces; this is not an independent capability test | A dated model-card publication and provider-stated access surfaces |
| 21 September | xAI releases Grok 4.7 | Release page and model card are dated 21 September | AWS Bedrock announced availability on 28 September | Release and card dates are distinct from a later cloud-hosting date |
| 22 September | OpenAI introduces GPT-6 Sol and Luna | First-party launch page describes the models; no standalone card is included in this archive | Access details are those stated on the launch page | The announcement is verified; a separate model-card date is not established |
| 28 September | Anthropic releases Claude Sonnet 5.5 | System card is dated 28 September | Release reporting and card are same-date records in the captured set | A system-card publication, not independent validation of Anthropic’s results |
| 29 September | OpenAI releases GPT-6.1 Sol | First-party release page provides the date and availability description | Microsoft Foundry has a separate availability record | Launch and platform distribution should remain separate events |

The Google record is specifically about Gemini 3.8 Audio cards, not a new general-purpose text model. The card describes four audio variants and its stated limitations. The timeline therefore labels it a documentation and availability record and does not claim an independent benchmark. [@google-gemini-38-audio-card] [@techtarget-gemini-38-live-2026]

The Grok entry shows why a provider release and third-party distribution should be separate. xAI’s release and card are dated 21 September; AWS’s Bedrock record is dated 28 September. Decrypt coverage, syndicated through Yahoo Tech, adds independent launch reporting but does not validate xAI’s performance results. [@xai-grok47-release] [@xai-grok47-model-card] [@aws-grok47-bedrock-2026] [@decrypt-grok47-2026]

OpenAI’s GPT-6 Sol/Luna page and GPT-6.1 Sol page are first-party release records. Reuters’ Sol/Luna report and The Hindu’s GPT-6.1 coverage corroborate that the announcements were reported on those dates; they do not independently test the models. Microsoft Foundry’s GPT-6.1 availability entry is a distribution record, not a model evaluation. [@openai-gpt6-sol-luna-2026] [@reuters-gpt6-sol-luna-2026] [@openai-gpt61-sol-release] [@hindu-gpt61-sol-2026] [@microsoft-foundry-gpt61-sol-2026]

Anthropic’s system card and Reuters’ 28 September coverage support the release date. The performance, speed, and token-efficiency claims remain attributed to Anthropic. The card documents evaluation scope and limitations; it does not convert provider measurements into independent comparative tests. [@anthropic-sonnet55-system-card] [@reuters-sonnet55-2026]

### How to maintain the timeline

For each entry, preserve the original URL, publisher, publication date, document type, and retrieval date. Keep announcement date separate from card publication and API or hosting availability. If a source says “available now” without a separate dated record, quote that wording with the source date rather than inventing a platform date. Add later availability events as new rows so they do not overwrite the model’s original launch record.

Treat each row as an event tied to one exact model name, not as a permanent summary of the product. A single model can have a provider announcement, a card publication, an API listing, a consumer-product rollout, and a third-party hosting record. Store the event type and date as the source states it. If the page gives only a publication date and says “available now,” keep that wording rather than converting it into a precise access date. This lets a reader sort the timeline by what changed without conflating launch, documentation and distribution.

Attach evidence to the claim it supports. A provider release can establish the announcement and its own price or availability statements; a model or system card can establish the developer’s disclosed evaluation scope and limitations; a cloud record can establish a distribution route. A news report may independently confirm that an announcement occurred without independently testing the model. Benchmark results should link to the evaluation record that reports the task, conditions and metric, and be labeled as provider-reported or independently measured. Do not let a source that confirms a date appear to validate a performance claim in the same row.

When a page changes, preserve the URL, retrieval timestamp, any explicit version label, and the sections that changed. Keep the earlier capture and add an update event instead of overwriting it. If a date, test condition or platform surface is absent, mark it “not stated in the source reviewed”; absence from one captured page is not proof that the event did not happen. If a page is removed or replaced, record that status and retain the prior source reference where the evidence policy allows.

This structure makes the archive useful during a later story update. A writer can filter for announcement, evaluation, price or hosting evidence, check whether an independent test exists, and follow the exact record behind each statement. Repeated coverage of one vendor result should remain one performance source plus secondary reporting, not a count of independent confirmations. The timeline does not rank models or determine product quality; it helps keep chronology and evidence status auditable.

This timeline does not rank the models, validate vendor benchmark claims, or infer product access from a news headline. Its job is to help readers locate the first-party record and determine whether a later article is about an announcement, evaluation document, or distribution change.

**Bottom line:** September’s model records include announcements, cards, and later platform availability; their dates should not be collapsed into one release timestamp.

**Why it matters:** A model can be announced before its documentation or third-party hosting is available, and those records support different claims.

**Key takeaways:**
- Gemini 3.8 Audio’s September event is a model-card publication.
- Grok 4.7’s AWS availability date follows its 21 September release and card.
- OpenAI’s launch pages are not treated as model cards in this archive.
- Anthropic’s provider evaluation claims remain attributed, even when reporting confirms the launch date.
- Hosting records corroborate distribution, not model quality.

**What changes:** Append a new dated event whenever a model card, API, product surface, or hosting platform becomes available.

**Evidence note:** The snapshot uses first-party pages/cards and independent launch reporting captured by 4 October 2026. It does not independently evaluate any model.

The archive also needs temporal discipline. Recheck provider pages after the research date because cards can be revised; retain dated captures for claims about what was available at launch. A later card revision should be recorded as a new event rather than retroactively attributed to the original release. Keep model aliases and variants distinct so similar names do not collapse separate records. This month-long snapshot is bounded: an event omitted here is not evidence that no other model launched in September.

**Related coverage:** Briefs 4–8; Report 45.