# Essay drafts 61–70

**Status:** provisional research drafts. None is approved for publication or added to maintained newsroom records.
**Research date:** 4 October 2026.
**Citation convention:** Inline `[@key]` references resolve through `essay-source-map.md`; keys are research-only.
**Byline:** unassigned; do not invent a named author or credentials.

## 61. A pipeline is a promise; access is a service

**Slug:** `essay-pipeline-promise-access-service`  
**Topic:** Infrastructure argument  
**Proposed dek:** Public AI infrastructure reporting should say whether capacity is proposed, being built, operating, allocated, or actually schedulable.

### A megawatt figure is not yet access

The public debate about AI infrastructure often turns a project announcement into a capacity number and a capacity number into an assumption about access. Those are different stages. A proposed campus can signal investment intent; a permitted project can still lack power or equipment; a commissioned data centre can still have no GPU inventory available to a particular user. The important question for a researcher or startup is not only how much capacity exists in a region, but what they can request, when, under which terms, and with what evidence.

India’s public record makes the distinction visible. Cushman & Wakefield’s H1 2026 update reports operational and upcoming capacity across seven markets and labels construction and planning stages separately. The Government of India’s August AI factsheet reports a national data-centre capacity figure alongside IndiaAI compute statistics. Those numbers describe different records and scopes; they should not be combined into one interchangeable “AI capacity” total. [@cw-india-h1-2026] [@pib-indiaai-compute-usage-2026]

| Stage | What the label should mean | Evidence a reader should expect |
|---|---|---|
| Announced | An organization has described an intended project or investment | Dated announcement, named entity, proposed site and stated capacity unit |
| Planned / pipeline | A project appears in a source’s forward-looking inventory | Source-defined stage, geography, and whether capacity is planned, permitted, funded, or under contract |
| Under construction | Physical construction is reported as underway | Reporting date, source method, and whether the number is IT load, facility load, or another measure |
| Operational | The facility is reported as commissioned or serving customers | Operational date, capacity definition, market scope, and source |
| Allocated | A user or project has approval or a reservation | Applicant, term, approved hours or hardware, conditions, and approval date |
| Schedulable / consumed | A specific workload can run or has run | Live inventory, queue or scheduler evidence, metered use, period, and service terms |

The IndiaAI Compute Portal shows why “capacity” should not stand in for “service.” Applicants must meet eligibility rules, submit a project request, estimate GPU hours, and follow an approval process. The portal’s visible allocation register contains dated project rows, but those rows are not a live inventory and do not prove that a GPU is idle and schedulable now. An approval may give a project a window to begin using services; it does not demonstrate that every approved hour has been consumed. [@indiaai-compute-portal-guidance-2026] [@indiaai-allocation-register-2026]

### The denominator belongs beside the headline

Capacity totals also need a definition. A market report may count commissioned IT load within a group of cities; a government response may give an approximate national figure; a portal may list GPU-hours; a project announcement may describe future investment. These units measure different things. A megawatt of planned facility power cannot be converted directly into a number of available accelerators without assumptions about power usage, cooling, hardware, utilization, and allocation.

Readers should not be asked to reconstruct those assumptions. Every infrastructure claim should carry its source, date, geography, stage, unit, and denominator in the same place as the headline number. If a report aggregates an upcoming pipeline, it should state whether it includes land, announced investment, signed power agreements, permits, or equipment installation. When a public portal shows an approved project, it should distinguish approved, allocated, scheduled, metered, and completed hours.

This is an argument for better reporting, not a claim that every public source is wrong. Different records can be accurate within their own scope and still be unsuitable for addition or direct comparison. The H1 2026 market report’s seven-city operational figure and a national government estimate can both be useful while remaining unreconciled. Labeling the scope is more informative than forcing them into a single national trend. [@cw-india-h1-2026] [@pib-indiaai-compute-usage-2026]

### Public access needs its own service metrics

If public compute is meant to support research, startups, or public-interest projects, the public record should describe the path from application to useful work. Publish the number of applications, approvals, rejections, approved hours, scheduled hours, metered use, and completion rates—with privacy-safe aggregation and exact reporting periods. Identify accelerator type, memory, software image, provider, queue time, price or subsidy, and support terms. A public allocation count alone cannot tell a reader whether applicants can actually run a project.

Those metrics should also expose friction. If access depends on a monthly request window, say so. If a project loses approval after a fixed period, report that rule. If subsidy covers only part of the bill, state who pays the balance. If a specific GPU is not available, distinguish that from a portal’s approval decision. These details make service performance visible without pretending that a building pipeline equals compute access.

There is a legitimate counterargument: infrastructure operators may not disclose precise capacity, utilization, or customer information for commercial, security, or privacy reasons. The answer is not to publish sensitive facility telemetry indiscriminately. It is to agree on useful aggregate metrics and explain the gaps. A dated, anonymized service report can show queue times and metered usage without naming a private workload. Any undisclosed field should be labeled as unavailable rather than silently inferred from another source.

### The vocabulary is part of accountability

“Pipeline,” “operational,” “allocated,” and “schedulable” are not stylistic variants. They point to different evidence and different promises. When a policymaker funds infrastructure, an operator reports capacity, and a researcher applies for access, they should be able to tell which stage each number represents.

The proposal is simple: keep the stage, unit, date, scope, and evidence attached to every capacity figure. Then connect infrastructure reporting to access reporting, while keeping the two as separate measures. A pipeline can explain what may arrive; an access record explains what users can do now.

**Bottom line:** Announced or planned capacity is not a service. Public reporting should track the stages from project intent to schedulable and consumed compute.

**Why it matters:** A large infrastructure total can coexist with long application queues or unavailable accelerators.

**Key takeaways:**
- Keep announcements, pipeline, construction, operations, approvals, allocations, schedules, and metered use distinct.
- Put date, geography, unit, source, and denominator beside every total.
- Do not combine city-market capacity, national estimates, GPU-hours, and project announcements as one series.
- Publish privacy-safe access and usage metrics alongside infrastructure totals.
- State what the record does not reveal instead of inferring availability.

**What changes:** Infrastructure publishers and public compute programs should adopt a dated stage vocabulary and disclose how each number is measured.

**Evidence note:** The essay uses IndiaAI portal rules, dated allocation rows, the C&W market report, and PIB’s national factsheet as examples with different scopes. Its proposed reporting standard is an argument, not an existing government requirement.

**Related coverage:** Brief 1; Analysis 11 and 20; Explainer 21–22; Report 41.

## 62. The public value of AI data is not a record count

**Slug:** `essay-public-value-ai-data`  
**Topic:** Public infrastructure argument  
**Proposed dek:** Catalog counts show activity, but useful public data infrastructure also needs discoverable metadata, clear terms, documentation, and evidence of reuse.

### Counting is a start, not a verdict

A public AI dataset portal can report how many datasets it lists. That count answers a narrow question: how many records were counted under the portal’s method on a particular date? It does not tell a researcher whether the records are usable, legally reusable, current, well documented, representative, or compatible with a planned task.

The dated AIKosh snapshots reviewed for this portfolio illustrate the difference. DD News reported 7,541 datasets and 273 models in February 2026. PIB reported more than 14,000 datasets and 331 models in July. The pages do not define a common record unit, status filter, deduplication rule, or usability measure in the count passages reviewed. The numbers should therefore remain dated institutional snapshots, not a growth rate or a proxy for public value. [@ddnews-aikosh-february-2026] [@pib-aikosh-july-2026]

| Measure | What it can tell a reader | What it cannot establish by itself |
|---|---|---|
| Catalog record count | The number of entries under a stated snapshot and method | Whether entries are unique, current, complete, or usable |
| Metadata completeness | Whether required fields are present for a record | Whether those fields are accurate or the data is representative |
| License and access terms | What reuse conditions are stated | Whether a user’s planned use is legally permitted without reviewing the terms |
| Dataset documentation | How collection, composition, processing, and intended uses are described | Whether the underlying content is high quality or safe for every use |
| Reuse evidence | Whether people have accessed or used a dataset in a defined way | Whether use produced useful, fair, or beneficial outcomes |

The platform’s terms and the five-record AIKosh listing audit can support a narrow examination of access and visible fields. That audit is purposive, not representative: it can identify what those selected pages displayed, but it cannot establish a catalog-wide defect or quality score. This distinction matters. A public evaluation should report its sampling method and separate an observed field gap from a conclusion about the full collection. [@aikosh-platform-terms-2026] [@aikosh-dataset-page-sample-2026-10-04]

### Standards help describe a catalog; they do not certify its contents

W3C’s DCAT 3 standard provides a vocabulary for describing datasets and data services so catalogs can interoperate, federate, and support discovery. The specification is explicit that this metadata vocabulary is not a data-quality guarantee. A catalog may be easier to search and exchange without its underlying datasets becoming accurate or fit for every purpose. [@w3c-dcat3-2024]

“Datasheets for Datasets” makes a complementary proposal: document a dataset’s motivation, composition, collection process, recommended uses, and related lifecycle information. That kind of documentation helps a prospective user ask better questions before reuse. It is not a certification. The presence of a completed datasheet cannot prove that data has no bias, legal issue, missing coverage, or harmful application. [@datasheets-for-datasets-2021]

For a public catalogue, the distinction suggests two layers. The first is machine-readable discovery: stable identifiers, descriptive metadata, formats, contacts, license fields, and links to the actual data. The second is substantive documentation: origin, collection dates, population or geography covered, preprocessing, known limitations, access conditions, and recommended or prohibited uses. Neither layer substitutes for sample inspection, rights review, or use-specific evaluation.

### Measure usefulness with evidence, not adjectives

Public agencies and portals could publish a scorecard that keeps several dimensions separate: metadata completion, active links, download success, stated license, update date, documentation availability, and user support. Those fields are measurable without claiming that one dataset is “good.” Where a portal reports access or reuse, it should identify the metric—downloads, API calls, unique users, projects, citations, or documented downstream products—and the period covered.

Quality review should be proportionate to the data. A catalog of open administrative tables has different risks from a collection of medical records, children’s data, or licensed cultural material. A public portal should show the data origin and rights basis, clarify whether records are open or request-gated, and point to correction or takedown processes. If data cannot be shared publicly, the catalog can still disclose that it exists and explain access conditions, subject to privacy and security limits.

A count remains useful. It can show catalog scale and change in the number of entries. But the claim should be no larger than the measure: “the portal listed X records on date Y,” rather than “the public now has X usable datasets.” Without common definitions, deduplication, and status information, year-on-year comparisons may mix new records with reclassification, migration, or cleanup.

### A better measure of public value

Public value is a chain: a dataset is discoverable, its conditions are understandable, its content is accessible to an eligible user, its quality is assessed for a particular task, and its use produces an outcome worth measuring. A catalog count covers only the first fragment of that chain.

The proposal is not to replace simple counts with a single composite score. That would hide the same uncertainties in a new number. Publish a transparent dashboard of distinct measures, document the counting method, preserve dated snapshots, and invite users to report broken links or unclear terms. A public AI data portal should make the data easier to find and the limits easier to see.

**Bottom line:** Dataset counts measure catalog entries; they do not measure reuse, quality, or public benefit.

**Why it matters:** A large catalogue can still be hard to search, difficult to license, or unsuitable for a research task.

**Key takeaways:**
- Keep dated counts separate when their units and filters are not reconciled.
- Use DCAT for interoperable catalog metadata, not as a quality seal.
- Use dataset documentation to expose provenance, composition, collection, and limits.
- Report link, license, freshness, and reuse measures as separate indicators.
- Treat a small purposive listing audit as an example, not a catalog-wide verdict.

**What changes:** Public portals should publish transparent metadata and access measures alongside record totals, with a method and snapshot date.

**Evidence note:** The essay uses two dated AIKosh count reports, portal terms, a five-record purposive audit, W3C DCAT 3, and the Datasheets for Datasets proposal. It makes no catalog-wide quality claim.

**Related coverage:** Analysis 12; Research 31; Report 42.

## 63. A model card is a research artifact, not a launch poster

**Slug:** `essay-model-card-as-research-record`  
**Topic:** Research-culture argument  
**Proposed dek:** A model card is most useful when it preserves evaluation context and limitations, not when it merely repeats a product announcement.

### The document should travel with the model

A release page is designed to introduce a product. A model card or system card can serve a different purpose: preserve evidence about what was evaluated, how, for whom, and with which limitations. The original model-card proposal recommends describing intended use, performance across relevant conditions, evaluation procedures, and other context that helps users judge suitability. It also does not present a card as an independent audit or safety certificate. [@model-card-paper-2019]

That distinction is important as releases multiply. A product announcement may highlight a capability or benchmark result, while a technical card may specify the tested checkpoint, evaluation mode, safety domains, and exclusions. A user needs both records but should not confuse them. The card is not a guarantee that everything material has been disclosed; it is a research artifact whose value depends on the evidence and uncertainty it preserves.

| A useful release record should include | Why the field matters |
|---|---|
| Stable model identifier and date | Lets later readers connect a result to the exact release |
| Evaluation dataset and task definition | Shows what the score represents |
| Prompt, tools, scaffold, and effort settings | Makes the system under test visible |
| Number of trials and uncertainty | Helps distinguish one run from repeatable behavior |
| Intended and out-of-scope uses | Helps users avoid unsupported extrapolation |
| Negative results, failures, and known limitations | Prevents a positive-only view of the evidence |
| External evaluations and conflicts | Shows who produced and reviewed the results |
| Change history | Reveals what changed between versions |

Recent model disclosures show why those fields matter. Google’s Gemini 3.8 Flash card includes capability and safety sections. Anthropic’s Sonnet 5.5 system card describes test scope and omissions. xAI’s Grok 4.7 card says many results are from its final deployed checkpoint and identifies outside evaluators for selected benchmark suites. OpenAI’s Sol/Luna launch page presents provider-run benchmark results with particular effort settings. These are different document types and should be read as attributed evidence, not as a shared independent test. [@gemini38-flash-card-2026] [@anthropic-sonnet55-system-card-2026] [@grok47-model-card-2026] [@openai-gpt6-sol-luna-2026]

### A score without its method is not a result

Consider a benchmark percentage. It may describe one attempt, an average across multiple runs, a model alone, or a model plus tools and fallback systems. It may use a new task set or a revised scoring rule. Without those details, the number is difficult to interpret even if it is accurate.

This is why a public card should attach each score to its task definition, harness, data version, tools, budget, model checkpoint, number of trials, and grader. If a test is performed by an outside group, identify which part was external: task design, execution, scoring, or review. If a claim is self-reported, say so. This does not make a vendor’s own evidence useless; it gives readers a basis for weighing it.

The same standard should apply to negative and incomplete findings. If an evaluation did not test multilingual safety, tool misuse, long-context retrieval, or human handoff, the card should say that. “Not evaluated” is different from “passed.” A clear omission helps buyers scope their own test rather than infer coverage from a section heading.

### Versioning turns the card into a record

Model names can persist while checkpoints, APIs, and evaluation settings change. A card should therefore be versioned, dated, and archived rather than silently replaced. If the provider updates test results, preserve the previous version and note whether the model, method, dataset, or only the explanation changed. A record should also link to the relevant product endpoint and state if that endpoint may serve a model revision different from the evaluation checkpoint.

Independent researchers can extend the record, but their findings should remain linked to the exact build and method they tested. The card should not absorb outside results without noting who ran them. Conversely, an external benchmark should not silently treat a provider’s own data as independent replication.

### The proposed norm

The public norm should be simple: publish a launch page for users, and a research record for claims. Make the record machine-readable where practical, preserve prior versions, and state the boundary of each result in plain language. Include what the model did not do well and what remains unknown. Invite independent evaluation without presenting the card itself as proof of safety.

That norm benefits providers too. A precise card can reduce misinterpretation, let researchers build on earlier results, and make a real improvement visible across releases. It also gives journalists and customers something more durable than a screenshot of a benchmark chart.

**Bottom line:** A model card is useful when it preserves methods, version, limits, and negative evidence alongside the model—not when it acts as another launch poster.

**Why it matters:** A benchmark result detached from its setup can be repeated as a broader claim than the evidence supports.

**Key takeaways:**
- Separate product positioning from evaluation records.
- Attach each result to the model, task, tools, budget, grader, and trial count.
- Distinguish external testing from provider-run evaluation.
- Label “not tested” separately from a successful result.
- Version and archive cards rather than silently replacing them.

**What changes:** Model providers should publish a dated, versioned evidence record for each release and preserve meaningful changes between versions.

**Evidence note:** The essay combines the 2019 model-card proposal with four first-party model records; it does not audit the underlying models or treat provider claims as independent validation.

**Related coverage:** Research 35 and 37; Report 45.

## 64. Smallness becomes useful only inside a workflow

**Slug:** `essay-smallness-workflow`  
**Topic:** Technology argument  
**Proposed dek:** A smaller model is not a workflow improvement until it can complete the task reliably, fit the operating environment, and reduce total work.

### Parameter count is not a product outcome

“Small” sounds like an answer to cost, speed, or deployment constraints, but a parameter label does not measure any of those outcomes on its own. Model cards disclose architecture and context information; a task benchmark measures only selected behavior under its own test. A team still has to ask whether a model fits the workflow, whether it can run under the required hardware and latency limits, and what happens when it fails. [@gemma4-model-card] [@mistral-small4-model-card] [@agentfloor-2026-preprint]

Mistral Small 4 makes the naming issue concrete: its card lists 119 billion total parameters and 6.5 billion active parameters. That active count is a model specification, not a guarantee that the complete weights fit in a particular device or that a chosen runtime will meet a latency target. Gemma 4 has multiple model sizes and documented deployment configurations, so even within one family “small” refers to a range of choices rather than a single operating point. [@mistral-small4-model-card] [@gemma4-model-card]

The useful question is not “which model has the smallest number?” It is “what is the cost and quality of an accepted task in this environment?” If the model needs retries, long prompts, human correction, or a hosted fallback, the apparent savings can disappear. If the task is narrow and the failure cost is low, a smaller model may be the better operational choice even when it is not the strongest model in a broad benchmark.

### The workflow defines the comparison

Take a support workflow. A model may classify a request, draft a reply, and retrieve policy. A local model could reduce an external API dependency, but the full application may still use hosted search, logs, or ticketing tools. A hosted model may avoid local accelerator management but introduce a contract, network dependency, quota, or service cost. This essay makes no blanket privacy or speed claim; those properties depend on the exact application and endpoint.

The evaluation should include the complete path from input to accepted output. Measure task completion, factual errors, reviewer edits, retries, latency, memory or accelerator use, and cost per accepted result. Record the model version, runtime, quantization, context, concurrency, and tool configuration. If a human needs to rewrite half the output, token price is not the workflow’s full cost.

AgentFloor is one example of a bounded model evaluation: its 2026 preprint tests 30 tasks across six tiers and a specific set of models. That can help identify questions to test, but a 30-task preprint benchmark is not a guarantee of performance in a different company’s documents, policies, or software stack. A small-model decision should use public benchmarks as a starting point and a held-out task set from the intended workflow as the decision evidence. [@agentfloor-2026-preprint]

### Design for escalation, not just completion

A model does not have to handle every case alone. A useful small-model workflow can use confidence thresholds, deterministic checks, a second model, or a human escalation route. This can reduce wasted compute on ordinary cases while sending ambiguous or high-impact cases to a more capable path. The escalation policy should be tested too: a model that fails quietly or overestimates confidence can make the hybrid system less reliable.

The fallback should be visible in measurement. Record how often it was used, why, how much it cost, and whether the final answer passed the same acceptance test. Do not report the smaller model’s score while omitting work performed by the fallback. Avoid using one model for screening if its mistakes could prevent cases from reaching human review.

### Measure operational fit over time

Deployment is not a one-time inference. Models change, runtimes change, context grows, and applications accumulate edge cases. The maintenance cost includes updating weights, securing the runtime, handling new hardware, monitoring drift, and retaining the evaluation set. A hosted API shifts some infrastructure work to the provider but still requires version pinning, service monitoring, and data-term review.

A small model becomes useful when it has a defined job, a bounded failure cost, a measured fallback, and an owner who can maintain it. That is more informative than a parameter-count competition. It also makes “small” a decision tied to work rather than a brand label.

**Bottom line:** Judge small models by accepted-work outcomes and total operating burden, not parameter count alone.

**Why it matters:** A low-cost model can become expensive if it generates more retries, edits, or escalations than the alternative.

**Key takeaways:**
- Parameter count does not certify hardware fit or workflow quality.
- Test the whole task path, including reviewer corrections and fallbacks.
- Public benchmarks are bounded examples, not deployment guarantees.
- Measure cost per accepted outcome, not only model-token cost.
- Plan for updates, monitoring, and escalation before rollout.

**What changes:** Every small-model trial should include a held-out task set, end-to-end cost, fallback rate, and maintenance owner.

**Evidence note:** The essay uses provider model documentation and one 30-task preprint as bounded evidence; it does not claim a universal speed, privacy, or performance advantage.

**Related coverage:** Explainer 30; Analysis 15; Report 48.

## 65. An agent’s authority should be smaller than its objective

**Slug:** `essay-agent-authority`  
**Topic:** Governance argument  
**Proposed dek:** Give an agent only the access needed for its current task, then make high-impact actions reviewable and reversible.

### A broad goal is not a permission

“Book the trip,” “resolve the ticket,” or “update the customer record” describes an objective. It does not say which accounts, tools, messages, or payments an agent should be able to control. The authority should be narrower than the goal: specific actions, specific targets, a bounded period, and a clear path for anything outside the policy.

OWASP’s agentic risk guidance identifies tool misuse and identity or privilege abuse as concerns for agent applications. That is a reminder that a plausible answer does not guarantee a safe action. An agent can use a tool with overbroad credentials, act on a poisoned instruction, or make a change that the user did not authorize. These are system design risks, not just prompt-writing problems. [@owasp-agentic-top10-2025]

| Action class | Sensible default | Why |
|---|---|---|
| Read low-sensitivity reference material | Narrow read-only access | Lets the agent gather context while limiting write effects |
| Draft or summarize | Produce a proposal, do not send automatically | Keeps user intent and final communication under human control |
| Change a reversible low-impact field | Automatic only with narrow scope and audit | Limits the blast radius and supports repair |
| Publish, spend, delete, or disclose sensitive data | Approval-gated or human-executed | The consequences justify deliberate review |
| Act beyond a defined policy | Stop and escalate | Makes uncertainty visible instead of converting it into permission |

### Human review is a system, not a button

An approval step is valuable only if the reviewer can see the action and the application verifies that the approver is authorized. OpenAI’s Agents SDK documents an interruption/resume flow for approval-required tool calls, but leaves approver authentication and authorization to the integrating application. That is a useful boundary: an SDK can pause execution, while the product owner still has to define who can approve what. [@openai-agents-hitl-doc]

The approval should identify the exact tool, target, and arguments. If the request changes after review, it should require a new decision. Stale approvals should expire, rejections should not be ambiguous, and the audit record should connect the person, request, approved arguments, and executed action. A reviewer should also have an easy way to decline or ask for clarification without being pressured by a default “approve” flow.

Approval fatigue is a real design cost even without claiming a particular measured rate. If every low-risk action requires a click, users may stop reading the prompt. The better design puts review at consequential boundaries and makes low-risk actions narrow enough to automate safely. Where a human review is not meaningful, use deterministic checks or do not give the agent the permission.

### Permissions must exist below the conversation

Anthropic’s Claude Code documentation provides a product-specific example of permission rules with allow, ask, and deny behavior. That offers a concrete way to think about precedence, but it is not a universal standard and says nothing by itself about a deployment’s actual setup. The integration needs server-side authorization; a conversational instruction that says “do not write” is not a technical boundary. [@anthropic-claude-code-permissions]

LangSmith Fleet documentation shows another layer: workspace roles can distinguish who may run, clone, or edit an agent, with separate controls for integrations and credentials. Those controls manage people’s access to the agent platform; they do not replace the application’s authorization checks for actions an agent takes through a connected tool. [@langsmith-fleet-access-oversight]

An operator should assign separate credentials or scopes for separate tools, restrict destinations, cap the number or value of writes, make retries idempotent, and monitor unusual patterns. If an agent can update one customer record, it should not receive a general database administrator credential. If it can draft an email, it should not necessarily be able to send to an arbitrary external address.

The same principle applies to escalation. A low-authority agent can still produce a harmful recommendation, expose retrieved information, or make a user believe an action occurred. Read-only systems need privacy controls, and human escalations need context and traceability. Authority is about side effects, not the whole risk model.

### Autonomy should be earned by evidence

Begin in a read-only or draft-only mode. Collect representative cases and test refusal, malformed requests, duplicate actions, poisoned content, and tool errors. Add a specific write permission only after the agent’s behavior and the application’s authorization checks meet a defined threshold. Retest after changing the model, tool description, policy, or identity provider.

An organization should be able to answer: what can the agent do, on whose behalf, to which records, and how would we know if it did the wrong thing? If the answer is “whatever the model decides,” the system has granted authority without an operating policy.

**Bottom line:** Give the agent only the permissions its current task needs, and gate consequential actions at the system boundary.

**Why it matters:** A model’s broad objective can exceed what a user intended to authorize.

**Key takeaways:**
- Treat tool access as an identity and privilege design decision.
- Approval must be authenticated, specific, fresh, and auditable.
- A prompt instruction is not a permission boundary.
- Use narrow scopes, reversible writes, idempotency, and escalation.
- Increase autonomy only after testing the exact model-tool-policy combination.

**What changes:** Maintain a tool-by-tool authority matrix, with owners, allowed targets, approval rules, and recovery paths.

**Evidence note:** The essay draws on OWASP guidance and product documentation from Anthropic, OpenAI, and LangSmith; it does not test those platforms or claim a universally secure configuration.

**Related coverage:** Analysis 16; Explainer 26; Report 44; Comparison 56.

## 66. A benchmark score needs a history, not just a leaderboard

**Slug:** `essay-benchmark-history`  
**Topic:** Research-culture argument  
**Proposed dek:** A score is attached to a versioned task, model, harness, and grader. Preserve that history before treating it as progress.

### The number is the last line of a method

A leaderboard compresses an evaluation into a rank or percentage. The public sees the result; the method determines what it means. Change the task set, scaffold, budget, scoring code, or model version and the same displayed score may no longer represent the same experiment.

The SWE-bench Verified page illustrates this at the agent level. Its bash-only leaderboard records mini-SWE-agent versions, notes that releases 1.x and 2.x use different action mechanisms, and warns that results are not necessarily comparable across those versions. That is useful history, not an inconvenience to hide. Terminal-Bench’s paper describes task containers, graders, and residual non-determinism. The design and the limits belong beside the score. [@swebench-verified-methods] [@terminal-bench-2026-paper]

| What should be preserved | Why a future reader needs it |
|---|---|
| Benchmark and dataset version | Shows which tasks were in the test |
| Model/checkpoint and date | Connects the result to the evaluated system |
| Agent scaffold, tools, and prompts | Shows what ran beyond the model |
| Hardware, timeout, token budget, retries | Makes the resource envelope visible |
| Grader and test version | Explains how success was decided |
| Trial count and aggregation | Distinguishes a one-run score from repeated success |
| Exclusions and contamination checks | Documents known threats to validity |
| Prior runs and changes | Lets readers see whether the evaluation itself changed |

### “Progress” needs a stable comparison

A new result can improve because a model changed, because an agent harness improved, or because a benchmark’s tasks or scoring changed. Those are all real forms of progress, but they answer different questions. A model comparison holds the harness and conditions steady; a system comparison allows the full stack to differ; a benchmark update may improve task quality while breaking direct comparability with an earlier release.

The τ-bench pass^k metric offers another reason to preserve trial history. It estimates the chance that all k independent attempts for a task succeed, averaged across tasks. That is not interchangeable with a single pass@1 score. If a leaderboard reports only one percentage and omits attempts, it may hide whether the system is consistent or merely capable of a successful run. [@tau-bench-2024]

Provider cards also show the need for version labels. xAI’s Grok 4.7 card notes that CursorBench 4.0 adds longer-horizon tasks and that its scores are not comparable with CursorBench 3.2. The result is not invalid; it belongs to a changed test. A release record should describe the break and preserve both versions rather than chart them as a continuous series. [@grok47-model-card-2026]

### Contamination is a question to investigate, not a shortcut verdict

Training data can overlap with public benchmarks, and benchmark tasks can be copied or discussed online. That creates a possible threat to validity, but it does not prove that any particular score is contaminated. Researchers should document what they know: task release dates, training cutoffs if disclosed, deduplication procedures, private test availability, and whether the evaluation includes held-out or newly authored examples.

The burden is shared. Benchmark authors should keep task sources and tests auditable while protecting hidden evaluation material. Model providers should disclose relevant training and evaluation limits. Journalists and buyers should avoid turning an undisclosed cutoff into a factual accusation. If the evidence is unavailable, say the risk was not assessed or not disclosed.

### Publish a test record alongside every score

A useful benchmark release would preserve the benchmark commit, model identifier, harness version, task selection, random seed where applicable, hardware, run logs, grader, exclusions, and changes from prior runs. A rerun should state whether it reproduces the same system or introduces a new one. If a new version changes tasks, provide a bridge set that permits limited comparison or explicitly mark the series break.

This standard makes leaderboards more useful, not less readable. The headline can still show the score. A linked evidence record lets a reader answer the next question: what ran, under what conditions, and what changed? A benchmark with no history invites overclaiming; a benchmark with a history can support real comparison.

**Bottom line:** Treat a leaderboard score as an entry in an evaluation history, not as a context-free measure of intelligence.

**Why it matters:** Without method and version details, a change in the testing system can be mistaken for a change in model capability.

**Key takeaways:**
- Preserve task set, model, scaffold, budget, grader, and trial details.
- Mark benchmark and harness revisions that break direct comparability.
- Distinguish pass@1 from repeated-run metrics such as pass^k.
- Treat contamination as a documented validity risk, not an accusation without evidence.
- Keep older results available so changes can be audited.

**What changes:** Benchmark publishers and model providers should attach a versioned experiment record to each public score.

**Evidence note:** The essay uses benchmark documentation and one provider card to illustrate version breaks; it does not evaluate any model’s leaderboard position.

**Related coverage:** Research 36–37; Analysis 15; Report 43; Comparisons 52 and 55.

## 67. Power demand becomes an AI story only when attribution is clear

**Slug:** `essay-energy-attribution`  
**Topic:** Energy argument  
**Proposed dek:** Data-centre electricity is measurable at one level; AI-specific electricity is harder to isolate. Public claims should keep those boundaries visible.

### A facility total is not an AI total

Electricity demand is becoming a central part of the public conversation about AI infrastructure. But a data centre can serve many workloads: cloud software, storage, web services, enterprise systems, and AI. A facility-level or sector-level electricity estimate should not be relabeled as AI consumption unless the source provides a defensible attribution method.

The International Energy Agency’s Global Energy Review reports that electricity demand from data centres rose by about 17 percent, or 70 terawatt-hours, in 2025, while total global electricity demand rose by roughly 800 terawatt-hours. Those figures describe different denominators: data centres are one part of global electricity demand, and the IEA’s facility-wide figure is not an AI-only measurement. The distinction is essential when an AI headline uses a broader energy statistic. [@iea-global-energy-review-2026] [@iea-ger-2026-news]

The Lawrence Berkeley National Laboratory report estimates U.S. data-centre electricity use for 2023 and presents a 2028 range of scenarios. Its analysis combines data-centre equipment, utilization, cooling, and other assumptions. A scenario is not a measured outcome, and a U.S. estimate is not a global tally. These boundaries are not reasons to ignore demand; they are the conditions under which the estimate should be read. [@lbnl-us-data-centre-energy-2024]

### The attribution ladder

| Level | Example measure | What it establishes |
|---|---|---|
| Facility | Metered electricity at a site | Total site load during a period, subject to the meter boundary |
| Data-centre sector | Aggregated facility estimates or reported sector demand | Demand attributed to data centres under the source’s scope |
| Computing equipment | Server, storage, and network energy estimates | IT load within defined equipment categories |
| Workload category | AI, cloud, storage, or other workload allocation | Requires a model or telemetry that assigns shared resources |
| AI-specific demand | Energy assigned to AI workloads | Requires transparent workload definitions and allocation assumptions |

The further a claim moves down this ladder, the more important the method becomes. A data-centre meter cannot identify whether a server was running a large language model, a search index, a database, or a backup job. Shared cooling and power losses also complicate attribution. Operators may have workload-level data, but public disclosures often lack enough detail to reconstruct it.

This does not mean “AI uses no electricity” or that AI demand should be excluded from planning. It means public statements should separate what has been measured, what has been estimated, and what is a scenario. Grid planners may reasonably prepare for high-demand cases even when no one can assign every megawatt to an AI workload. A forecast is useful as a planning scenario; it is not an observed consumption series.

### Show assumptions alongside the number

Every public energy claim should state geography, year, boundary, metric, and whether the figure is measured, modeled, or projected. If it attributes demand to AI, it should also explain what counts as AI, how shared infrastructure is allocated, whether it includes training, inference, networking, and cooling, and what uncertainty range applies. A company’s renewable-energy purchases or power contracts do not by themselves show physical consumption or the marginal effect on a local grid.

The LBNL report notes that estimates depend on facility and equipment assumptions, while global reviews aggregate across different data-centre uses. That makes transparent methods especially important when figures are used to argue for or against a specific policy. The reader should be able to tell whether a claim concerns total demand, a forecast, a particular region, or AI alone. [@lbnl-us-data-centre-energy-2024] [@iea-global-energy-review-2026]

### Better attribution improves the debate

Accurate boundaries do not weaken a public-interest argument. They make it testable. A local utility can publish connection requests and actual consumption separately. A cloud provider can explain how it assigns energy to shared workloads. A research report can show a scenario range and name the assumptions. A journalist can state clearly that a number is for all data centres, not all AI systems.

The proposal is to treat attribution as part of energy disclosure, not a technical footnote. If the AI share is unavailable, say so. If the source covers data centres, call it data-centre demand. If it covers one country, do not present it as a global result. Public confidence is better served by a bounded number than by a dramatic but mismatched label.

**Bottom line:** Data-centre electricity data can inform AI infrastructure debates, but it is not automatically an AI-specific measure.

**Why it matters:** Misattribution can distort grid planning, environmental claims, and policy choices.

**Key takeaways:**
- Keep global electricity, data-centre, equipment, workload, and AI-specific measures distinct.
- Label measured values, estimates, and scenarios separately.
- State geography, year, meter boundary, allocation method, and uncertainty.
- Do not treat power purchases as a substitute for physical consumption data.
- If an AI-only figure is unavailable, say so plainly.

**What changes:** Energy reporting should publish the attribution method and uncertainty beside every AI-demand figure.

**Evidence note:** The essay uses IEA global electricity reporting and LBNL’s U.S. data-centre analysis. It makes no new estimate of AI electricity use.

**Related coverage:** Brief 2; Research 34; Reports 47 and 49.

## 68. A proposed child-safety rule deserves precise language

**Slug:** `essay-ai-companions-and-law`  
**Topic:** Policy and culture  
**Proposed dek:** Discuss the EU’s 2026 proposal as a proposal, name which services it covers, and keep child-rights and safety evidence distinct from political rhetoric.

### Status words matter

The EU KIDS Act proposal, presented by the European Commission in September 2026, is not enacted law. The Commission text proposes rules for defined categories of online services, including social networking services, video-sharing platforms, AI companions, general conversational chatbots, and online games. Its provisions are not a single blanket ban on all AI products. The Council document and independent reporting establish the proposal’s political context, not a change to the law already in force. [@eu-kids-act-proposal-2026] [@eu-kids-act-council-document-2026] [@euractiv-kids-act-2026]

Current law is a separate record. Article 28 of the Digital Services Act requires online platforms accessible to minors to take appropriate and proportionate measures for minors’ privacy, safety, and security, and restricts profiling-based advertising when the provider knows with reasonable certainty that the recipient is a minor. Its scope is online platforms accessible to minors; it should not be summarized as a universal rule for every chatbot or device. [@eu-dsa-article-28]

The Commission proposal would add provisions for specified service classes and design features. It includes delayed access for certain social networking and video-sharing services, as well as safety-by-design requirements for named categories that include AI companions and general conversational chatbots. The proposal itself recognizes that services can support expression and access to information as well as create risks, and it describes exceptions and design conditions. That balance belongs in public debate, not only in a legal footnote. [@eu-kids-act-proposal-2026]

### Safety evidence and rights are not interchangeable

Common Sense Media’s 2025 U.S. survey reports that 72 percent of surveyed teens aged 13–17 had used AI companions and 52 percent were regular users. It was a cross-sectional, self-reported survey of 1,060 teens conducted by NORC using a probability-based panel combined with a non-probability sample calibrated to represent U.S. teens. The organization notes that respondents may confuse dedicated companions with general-purpose AI tools, and that self-reports do not establish causal effects. Those figures describe reported behavior in one U.S. survey, not a global prevalence rate or proof of harm. [@common-sense-teens-2025]

The United Nations Committee on the Rights of the Child’s General Comment No. 25 sets out how the Convention on the Rights of the Child applies in the digital environment. OHCHR describes it as a framework that includes rights to privacy, safety, participation, and non-discrimination. It is a rights-based interpretation, not an empirical evaluation of a specific companion product. A sound policy argument needs both types of evidence clearly labeled: rights principles, legal duties, product testing, and observed user experience are not interchangeable. [@un-crc-general-comment-25-official] [@ohchr-rights-overview]

### Ask what the rule covers and how it will work

A serious discussion should ask which design features trigger an obligation, how a service is classified, what age assurance is required, what data is collected, how exceptions work, and how children can seek help or challenge a decision. If a proposal applies to services with particular functions, the public should not shorten that to “AI chatbots are banned.” If the evidence concerns teen self-reports, do not convert it into a causal claim about mental health outcomes.

Age assurance raises its own tradeoffs. A system designed to protect minors can create new privacy risks if it requires collecting identity documents or retaining sensitive age data. The proposal and the DSA context should therefore be read alongside data-minimization and child-rights principles. A service should not solve one risk by quietly expanding another. [@eu-kids-act-proposal-2026] [@eu-dsa-article-28] [@ohchr-rights-overview]

The Common Sense survey also complicates a purely paternalistic story: it reports that many teens use companions for entertainment or curiosity, and that most still prefer real friends for serious conversations. That does not make the systems safe, but it cautions against treating all use as the same behavior or assuming that every young person has the same needs. Public policy should listen to young people while still requiring providers to assess foreseeable risks. [@common-sense-teens-2025]

### Demand transparent evidence from providers

If a rule is enacted, providers should be able to show which service category applies, what safety features are present, what age-assurance data is handled, how reports are reviewed, and what evidence supports a claim that a feature is appropriate for children. Independent audits should explain scope, sample, test cases, and limitations. A policy that demands safety without defining evidence can produce compliance theater; a policy that ignores documented design risks can leave children with no practical remedy.

For now, the reporting standard is simple: use “proposed” for the Commission text, cite the enacted DSA only for its actual scope, describe survey data as survey data, and distinguish rights principles from product tests. The argument for stronger protection can be made without overstating either the law or the evidence.

**Bottom line:** Debate the proposal on its actual service scope and evidence, while recognizing children’s rights to both protection and participation.

**Why it matters:** Calling a proposal law or turning a self-reported survey into causal proof can distort public debate and implementation.

**Key takeaways:**
- The September 2026 EU KIDS Act is a proposal, not enacted law.
- DSA Article 28 applies to online platforms accessible to minors; it is not a universal chatbot rule.
- The 2025 Common Sense survey is self-reported and U.S.-specific.
- General Comment No. 25 supplies a rights framework, not a product safety audit.
- Scope, age assurance, privacy, exceptions, and independent evidence all need scrutiny.

**What changes:** Policy coverage should label legal status, service scope, study design, and evidence limits in the same story.

**Evidence note:** The essay uses the Commission proposal, Council and Reuters-style coverage, the DSA, OHCHR materials, and one U.S. teen survey. It makes no independent causal claim about harms.

**Related coverage:** Brief 3; Report 46.

## 69. Provenance documents an asset; it does not settle its truth

**Slug:** `essay-provenance-and-trust`  
**Topic:** Media and culture  
**Proposed dek:** Content credentials can improve accountability about origin and edits, but a signed history is not a verdict about what an image depicts.

### A record can be authentic and still be incomplete

A content credential can tell a reader something about an asset’s asserted origin and recorded edits. It cannot independently prove that the depicted event happened, that a caption is accurate, or that the photographer’s account is complete. Treating provenance as truth compresses several separate questions into one badge.

C2PA’s 2.4 specification defines a way to associate a signed manifest and assertions with media. Its model can help verify whether a claim was signed and whether the credential is bound to the asset under the verifier’s rules. The standard is a provenance mechanism, not a fact-checking system. It records claims and relationships; it does not decide whether those claims describe reality. [@c2pa-spec-24] [@c2pa-deployment-guidance-2026]

| Reader question | What a credential can contribute | What still needs independent evidence |
|---|---|---|
| Who signed this record? | Signer identity and certificate status, as presented by the validator | Whether the signer had firsthand knowledge or an incentive to be accurate |
| Was an edit recorded? | Assertions about declared editing steps | Whether the full edit history was disclosed |
| Is this the same asset? | A binding or fingerprint that helps connect media and manifest | Whether a screenshot or derivative omitted context |
| Did the depicted event happen? | No direct answer from the signature alone | Location, time, witnesses, corroborating records, and context |
| Is an image AI-generated? | May contain a credential or watermark related to generation | Other evidence and detector limits; absence is not proof of human capture |

### Verification itself has an implementation history

The C2PA specification does not remove the need to assess validators and trust policy. A 2026 independent security study reports that its tests found issues involving altered timestamps, revoked or compromised credentials, and disagreement among validators. Those findings are specific to the versions and implementations examined. They support the practical claim that a green check should be explained, not treated as an infallible verdict. [@c2pa-independent-security-study-2026]

Other signals have their own limits. A 2024 ICLR paper evaluates AI-image detectors and watermarks under attacks and transformations, demonstrating why a detector output depends on the method and test conditions. A watermark can be difficult to detect after image changes; a classifier can make errors outside its evaluation distribution. Neither result should be generalized to every current product, but both argue against collapsing all signals into “authentic” or “fake.” [@iclr-image-detectors-2024]

An absent credential is especially easy to misread. A creator may not have used a compatible tool; a platform may have stripped metadata; an image may be an older file; or the record may not have been preserved. “No credential found” describes what the verifier returned. It does not establish that the image is false or synthetic. Likewise, a valid signature shows that a signed statement passed a verification process; it does not confirm every statement inside it.

### Put provenance in a larger evidence chain

Newsrooms and public institutions should preserve the original asset, record where it was obtained, and track any conversion or crop before publication. They can inspect a C2PA manifest, signer, binding, and status; separately check an expected watermark; and use a detector as a limited triage signal. The factual claim still needs verification through independent reporting, metadata context, eyewitness accounts, location and time checks, or other records.

The interface should describe the result in plain language. Replace “verified image” with a narrower message such as “signed creation record found,” “credential signature valid under this trust policy,” “watermark detected,” or “no credential found.” If validators disagree or the trust chain cannot be established, show that state rather than assigning a confident green or red label. [@c2pa-deployment-guidance-2026] [@c2pa-independent-security-study-2026]

This does not make provenance useless. A consistent record can make some changes and origins easier to inspect, preserve attribution, and support correction. It can also make the reporting process more accountable. The argument is for a smaller promise: provenance improves the chain of custody when records survive and are interpreted carefully; it does not certify truth.

### Keep the claim proportional to the signal

The public should be able to ask: What is signed? Who signed it? What trust policy was used? Which transformations are recorded? Which are unknown? What other evidence corroborates the claim? Those are more useful questions than whether an image is “authentic” in the abstract.

An evidence chain can combine credentials, watermarks, detectors, and human reporting, with each result retained separately. The more consequential the publication, the less acceptable it is to let one automated check stand in for independent verification. A content credential is a record about a file; journalism still has to establish what happened.

**Bottom line:** Provenance supports traceability and accountability, not factual truth by itself.

**Why it matters:** Readers may mistake a cryptographic status or detector output for proof of the event an image depicts.

**Key takeaways:**
- C2PA verifies signed assertions under a defined trust process.
- A signature does not prove every assertion is accurate or complete.
- Missing credentials do not prove an image is fake.
- Validators, watermarks, and classifiers have implementation and robustness limits.
- Keep technical signals separate from independent fact-checking.

**What changes:** Publishers should describe provenance states narrowly and attach them to a wider verification record.

**Evidence note:** The essay uses C2PA 2.4, deployment guidance, one 2026 security study, and one 2024 detector study. It does not claim every current implementation is vulnerable.

**Related coverage:** Explainer 28; Report 49; Comparison 60.

## 70. Model releases should leave a public evidence trail

**Slug:** `essay-public-model-release-record`  
**Topic:** Research-culture argument  
**Proposed dek:** A release should remain understandable after the launch page changes: preserve dates, model identifiers, evaluation context, availability, and revisions.

### A launch is an event; a record is a system

Model releases now travel through several documents: an announcement, a technical card, API documentation, product access pages, and cloud or partner listings. These pages answer different questions and may be updated at different times. A durable public record should connect them without pretending that they are the same source or that availability proves performance.

The September 2026 model archive in this project shows why. OpenAI’s GPT-6 Sol/Luna release page describes product positioning and provider-run benchmarks. Anthropic’s Sonnet 5.5 system card records evaluation coverage and omissions. Google’s Gemini 3.8 Flash card documents modalities and context. xAI’s Grok 4.7 card names external evaluators for selected tests and notes benchmark-version changes. AWS’s Bedrock notice records a hosting path for Grok 4.7, not an independent model evaluation. Each document is useful for a different part of the release. [@openai-gpt6-sol-luna-2026] [@anthropic-sonnet55-system-card-2026] [@gemini38-flash-card-2026] [@grok47-model-card-2026] [@aws-grok47-bedrock-2026]

| Record element | What should be kept | Why |
|---|---|---|
| Announcement | Publication date, stated claims, and links to technical documents | Shows what the provider said at launch |
| Model identity | Stable model ID, checkpoint or revision, API version | Connects an evaluation to an accessible system |
| Evaluation card | Tasks, methods, tools, trial counts, exclusions, and limitations | Makes performance claims interpretable |
| Access record | API, product, region, pricing, and eligibility at a stated date | Separates availability from capability |
| Change log | Updated model, terms, tests, and documentation | Prevents later pages from silently rewriting history |
| Independent coverage | Reporting date and attributed claims | Adds context without being mistaken for a benchmark |

### Preserve the difference between documents

A release page can make comparative claims that a model card later bounds to a task, effort setting, or test checkpoint. An API page can change a model ID or price after the announcement. A cloud provider can make a model available through its own service without validating the model’s results. Readers need a dated map from claim to evidence.

Independent reporting helps establish timing and commercial context. Reuters’ reporting on Anthropic’s release, for example, can corroborate when the launch happened and what the company announced; it does not turn Anthropic’s benchmark result into an independent finding. The same boundary applies to reporting about OpenAI and xAI: the source of the test result remains the organization that ran or published it. [@reuters-sonnet55-2026] [@reuters-gpt6-sol-luna-2026] [@decrypt-grok47-2026]

The original model-card research proposal argues for documentation of intended use, performance conditions, and evaluation procedures. A public evidence trail extends that idea over time. The record should preserve prior versions, state what changed, and link a result to the model and endpoint that produced it. The card documents the evaluation; the release ledger documents when and where the model could be obtained. [@model-card-paper-2019]

### Make change visible instead of silently updating the page

A provider should keep a stable identifier and record the date of each change to weights, context limits, safety filters, pricing, or evaluation methods. If a product endpoint serves a changing model behind a stable name, the provider should disclose that behavior and give users a way to pin or identify revisions where possible. If the page is corrected, the previous claim should remain in an archive with the correction date.

The public record should also state what is unknown. If no external assessment exists, say so. If an evaluator could not inspect weights or training data, disclose that. If a model card covers only one language, task family, or safety domain, make the boundary visible. Silence is not evidence of a pass.

This approach protects against two opposite mistakes. A reader should not treat a marketing claim as independent proof; a provider should not be accused of hiding evidence merely because a public page is incomplete. A versioned record makes both critique and correction more precise.

### A release trail is infrastructure for accountability

Researchers need to reproduce or challenge evaluations. Journalists need to verify dates and attribution. Customers need to know which model, terms, and region they are buying. Public agencies need a clear record of what vendors represented when a system was procured. Those are different use cases, but they all benefit from stable source links and dated changes.

The proposal is modest: every model release should have a dated index page linking to the announcement, model or system card, API documentation, pricing and access terms, known limitations, independent evaluations, and a revision log. Each linked document should retain its publication date and prior versions. This does not certify the model. It preserves the evidence needed to judge it later.

**Bottom line:** A release should leave a connected, versioned evidence trail that separates product claims, evaluation, availability, and independent reporting.

**Why it matters:** When pages change or endpoints update, readers can lose the basis for a claim that once shaped a decision.

**Key takeaways:**
- Treat announcement, card, API docs, and hosting notice as distinct records.
- Tie benchmarks to the tested version and method.
- Date pricing, model access, region, and terms separately from launch claims.
- Preserve corrections and prior documents.
- Mark missing evaluations as unknown rather than implying a pass.

**What changes:** Model providers and publishers should maintain a stable release index with dated evidence links and a change log.

**Evidence note:** The essay draws on the 2019 model-card proposal, four current model documents, provider availability records, and independent launch reporting. It makes no cross-model performance claim.

**Related coverage:** Research 35 and 40; Report 45 and 50.