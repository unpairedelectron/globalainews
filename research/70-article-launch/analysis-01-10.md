# Analysis drafts 11–20

**Status:** ten provisional research drafts. None is approved for publication.
**Research date:** 4 October 2026.
**Citation convention:** Inline `[@key]` references map through `analysis-source-map.md`; they are not live newsroom source IDs.
**Byline:** unassigned; do not invent a named author or credentials.

## 11. IndiaAI compute access is a monthly application process, not just a GPU count

**Slug:** `indiaai-compute-application-flow`  
**Topic:** Public infrastructure  
**Proposed dek:** The IndiaAI portal describes registration, review thresholds, monthly decision dates and a 30-day start window. Those rules explain how applicants seek service; they do not establish current capacity or successful delivery.

### The access story begins after the capacity announcement

India’s shared-compute conversation often starts with the number of GPUs in a programme. The IndiaAI Compute Portal documents a different part of the system: how an eligible applicant moves from registration to a request for service. Its public guidance requires applicants to register, establish eligibility, and submit a project proposal before requesting compute. The proposal is expected to describe the technical approach, intended impact and estimated bill of materials. [@indiaai-compute-portal-guidance-2026]

That distinction matters because hardware stock and user access are separate quantities. An installed accelerator does not reveal whether an applicant can discover it, meet eligibility requirements, receive an allocation, begin work on time or use the service for the needed workload. The portal’s process documentation can answer some of those questions, but not the most important outcome question: how many applicants actually received usable compute and completed a project.

The portal describes eligible groups as including researchers, academic faculty, IndiaAI fellowship awardees, students, startups, micro, small and medium enterprises, and government entities. Required documentation varies by category. Once an account and eligibility are verified, an applicant submits a project proposal through the portal. This sequence is not just administrative detail: it means a GPU-hour request sits inside an eligibility and review workflow rather than acting as a direct reservation against a public hardware list. [@indiaai-compute-portal-guidance-2026]

### The 5,000-hour threshold divides the review path

The portal states that requests for fewer than 5,000 GPU hours are auto-approved, while requests greater than 5,000 hours go to the PMEC committee. It also says requests should be submitted between the first and twenty-fifth of the month, with the final PMEC-approved list published by the tenth of the next month or the next working day. [@indiaai-compute-portal-guidance-2026]

That wording gives prospective users a useful planning signal, but it should be quoted precisely. The captured guidance uses “less than 5,000” and “greater than 5,000”; it does not specify how a request of exactly 5,000 GPU hours is handled. Nor does the page state an approval rate, the median time from submission to service, or the proportion of auto-approved requests that begin running.

An “auto-approved” request is not the same as evidence that an applicant’s entire project has been provisioned. The same guidance places approval after successful registration and eligibility verification. It also says allocation depends on eligibility, requested GPU hours and whether the applicant seeks a subsidy. The page does not define a service-level guarantee or state that an approved request will find an immediately available accelerator of the requested type. [@indiaai-compute-portal-guidance-2026]

### Approval has a clock, but availability is still unmeasured

The portal says approved services are valid for 30 calendar days and that applicants must start using them within that window to avoid expiration. For a team, this creates a practical constraint: readiness matters after approval. Data preparation, software environment, staff availability and a valid project plan all need to align with the service window. The published page does not describe an extension path or explain how a delay caused by provider availability is treated. [@indiaai-compute-portal-guidance-2026]

The IndiaAI allocation page offers a second, narrower piece of evidence. In the capture reviewed on 4 October, visible rows carry allocation timestamps from 23 April through 30 May 2025 and list fields such as GPU count and type, service provider, user category, project duration and a date by which an applicant must start. That is evidence that project-level allocations were recorded with those fields. It is not a current provider inventory, and the page does not say that every visible allocation was delivered, started, still active or schedulable now. [@indiaai-allocation-register-2026]

A separate PIB factsheet says 237 projects had accessed subsidised AI computing by August 2026, covering 93.18 lakh GPU hours. This is a useful programme-level activity figure, but the factsheet does not define whether “covering” means allocated, metered or consumed hours, nor connect the total to applications, decisions, allocation rows, provider or accelerator types, or time to first job. The figure is not a measure of current schedulable supply, and it does not provide a series that traces a request through to use. [@pib-indiaai-compute-usage-2026]

The difference between these records is important. A portal rule describes what an applicant is told to do. An allocation row describes a recorded decision for a project. The PIB total adds a separate programme-level figure, but the reviewed sources do not connect it to application outcomes or show the wait time from request to first run. Summing dated allocation rows would not fill those gaps because the records do not establish whether capacity was used, released or renewed.

### Measure the path from application to useful work

The published process suggests a more informative public scorecard than a single GPU total. Applicants and policymakers would benefit from counts of applications received, decisions by request size, approval time, time to first job, requested versus allocated GPU type and hours, project starts, expirations, and completed usage. Each measure would need a clear reporting period and definition. An approval count, for example, should be distinguished from an allocation, a job start and metered GPU-hours.

Those linked figures are not visible in the portal guidance and factsheet reviewed here, so this analysis cannot estimate how quickly the programme serves applicants or how concentrated allocations are. It can identify the public rules a team should plan around and the missing application-to-usage data that keeps a reported programme total separate from current access.

For an applicant, the immediate practical steps are to confirm eligibility, prepare the technical and impact case, state the resource estimate clearly, and check the current submission calendar and provider terms. For a reader evaluating the programme, the question is broader: does an approved request turn into a job on a suitable accelerator within a predictable time? The reported 93.18 lakh GPU hours offer one aggregate data point, but the public record reviewed does not provide a dated, comparable series linking application, decision, start and use. [@indiaai-compute-portal-guidance-2026] [@indiaai-allocation-register-2026] [@pib-indiaai-compute-usage-2026]

**Bottom line:** IndiaAI’s portal describes a monthly route to request compute, and a PIB snapshot reports GPU-hours accessed; neither resolves current availability or the path from application to use.

**Why it matters:** Applicants need to plan for verification, committee review and a short start window; policymakers need application-to-usage measures to evaluate access.

**Key takeaways:**
- Eligibility and project review come before a compute request.
- The portal separates requests below and above 5,000 GPU hours, but its captured wording leaves exactly 5,000 unspecified.
- Approval, allocation, job start and metered use are different events; the published aggregate does not connect them.

**What changes:** The most useful next public metric is not another headline GPU total, but a dated record showing how approved hours become started and completed jobs.

**Evidence note:** The IndiaAI Compute Portal, IndiaAI allocation page and PIB factsheet are primary sources for published process and programme-reported figures. The 93.18 lakh GPU-hour figure is not independently verified and is not defined in the factsheet as allocated, metered or consumed.

## 12. AIKosh’s published totals do not yet make a comparable growth series

**Slug:** `aikosh-counts-and-denominators`  
**Topic:** Public data  
**Proposed dek:** February and July 2026 government snapshots report different AIKosh dataset and model totals. The pages reviewed do not define a stable counting unit, so the figures should remain dated snapshots—not a measured growth rate.

### Two official snapshots report different totals

AIKosh is presented as a national platform for datasets and AI models, but its public headline counts need careful handling. A DD News article dated 10 February 2026 reports 7,541 datasets and 273 AI models across 20 sectors. It also reports 3.85 lakh visits, 11,000 registered users and 26,000 downloads. [@ddnews-aikosh-feb-2026]

A later Ministry of Electronics and Information Technology factsheet says that, as of July 2026, AIKosh hosted more than 14,000 datasets and 331 AI models. The two sources therefore provide useful dated snapshots of what government communications reported at different points in the year. They do not, by themselves, establish a consistent time series. [@pib-aikosh-july-2026]

It is tempting to subtract the February totals from the July totals and present the result as catalog growth. That would assume both counts use the same record definition, treatment of duplicates, status rules and coverage. The cited February and July texts do not explain those choices alongside the totals. Without a shared method or a versioned extract, the arithmetic difference cannot distinguish newly added resources from reclassification, record cleanup, imported catalogues or a change in what the platform counts.

The limitation applies to the model totals as well. “AI models” could refer to distinct model entries, versions, downloadable weights, hosted endpoints or other catalog records. The two snapshots use the same broad label, but the releases reviewed do not provide a common data dictionary explaining the unit. The article therefore reports each number with its source and date instead of converting them into a percentage increase. [@ddnews-aikosh-feb-2026] [@pib-aikosh-july-2026]

### Usage figures are not a substitute denominator

The February DD News article adds visits, registrations and downloads. Those are useful activity measures, but they are not interchangeable. A visit can include repeat sessions; a registered account does not prove that a user accessed a specific dataset; and a download does not establish that the asset was usable, licensed for the intended task or used in a model. The source gives totals but does not define the measurement window for each activity field in the cited passage. [@ddnews-aikosh-feb-2026]

The July factsheet’s headline provides dataset and model totals but does not repeat those same usage measures in the passage reviewed. That means the two publications cannot show whether the larger July catalog corresponded to more distinct users, more successful access, or more completed work. A larger catalogue may be valuable, but the published totals alone do not quantify its practical reach.

There is also a difference between the number of records and the number of resources a team can use. To assess usefulness, a reader needs information such as access conditions, license, documentation, language, domain, version, maintenance status and whether a resource can be downloaded or queried. The two cited announcements do not supply those fields as part of their headline counts. That does not prove the platform lacks such metadata; it means the totals cannot stand in for an audit of it.

### What a comparable series would require

A defensible time series could begin with a dated export and a stable identifier for each dataset and model record. Each monthly snapshot would need to preserve the record’s creation date, last-update date, active or withdrawn status, version, source, license and access mode. The report should also say whether a revision counts as a new record, how duplicates are detected and how sector labels are assigned.

Usage should be reported separately from inventory. A catalog could publish unique users, successful access requests, downloads or API calls, and repeat use, each with a fixed time window and a clear definition. For data assets, it would help to distinguish listings from assets that are downloadable, licensed for reuse, documented and maintained. For models, the catalogue should distinguish a versioned model artifact from an endpoint or product listing.

Until those fields are available in a versioned record, the February and July figures are still useful—but for a narrower purpose. They document that public sources reported 7,541 datasets and 273 models in February, then more than 14,000 datasets and 331 models for July. They do not establish a comparable rate of growth or a corresponding increase in usable resources. [@ddnews-aikosh-feb-2026] [@pib-aikosh-july-2026]

**Bottom line:** The government snapshots show different reported AIKosh totals, but the material reviewed does not provide the shared counting method needed to treat them as a measured growth series.

**Why it matters:** Researchers, policymakers and builders need to know whether a catalogue is expanding in usable resources, not only whether a headline number has risen.

**Key takeaways:**
- Keep the February and July counts attached to their source dates.
- Do not calculate a growth rate without a stable record definition and versioned snapshots.
- Keep catalogue inventory, user activity and successful reuse as separate measures.

**What changes:** A public, versioned inventory with stable IDs and explicit status, access and licensing fields would make future comparisons auditable.

**Evidence note:** DD News and PIB establish the figures they published. Neither cited snapshot, as reviewed here, defines a common denominator or proves that the counted entries were all accessible and reusable.

## 13. AWS GPU capacity-block prices are a dated reservation decision

**Slug:** `aws-capacity-block-pricing`  
**Topic:** AI infrastructure economics  
**Proposed dek:** AWS says its reserved accelerator prices move with supply and demand. A scheduled October rate change shows why buyers need the purchase date, reservation type and full instance bill—not only a per-GPU quote.

### The announced rate is tied to a future date

AWS’s EC2 Capacity Blocks for Machine Learning pricing page says reservation rates are dynamic and updated periodically based on supply and demand. A page captured on 4 October 2026 announced new hourly rates effective 7 October. The change lists per-accelerator prices for several instance families, including P5 at $5.970, while the then-current table showed P5 at $5.191 per accelerator in some listed regions. These are dated AWS prices, not a stable market benchmark; the scheduled rate must be checked again before publication. [@aws-capacity-block-pricing-2026]

The same page says the update applies to Capacity Block reservation prices and leaves fixed pricing models such as On-Demand and Savings Plans unchanged. That means the scheduled change is not a blanket increase across every AWS way to rent accelerated compute. It applies to one purchasing model, with its own reservation terms and timing. A buyer comparing an EC2 Capacity Block with an On-Demand instance should first confirm that the options offer the capacity, start window and commitment the workload requires. [@aws-capacity-block-pricing-2026]

### A per-accelerator number is not the whole instance charge

The pricing table shows both an hourly instance rate and an hourly per-accelerator equivalent. For example, it lists an eight-H100 P5.48xlarge instance at $41.528 per hour, or $5.191 per accelerator, in some regions before the scheduled update. The distinction makes the arithmetic easier to compare, but the customer reserves and runs the instance shape—not a free-standing GPU detached from its host. The table also separates a reservation fee from an operating-system fee. [@aws-capacity-block-pricing-2026]

That billing structure matters when teams translate a vendor’s rate into a research or inference budget. Multiplying a per-accelerator quote by eight estimates the accelerator component of the instance rate shown; it does not determine how many hours the job will need, whether all accelerators stay busy, or what ancillary services cost. Nor does a quote for one GPU generation establish the price or throughput of another. Any “cost per training run” or “cost per million tokens” needs workload and utilization data beyond this rate card.

### Purchase time and start time can differ

AWS says the reservation charge is paid upfront when the customer schedules the block, and that the applicable rate is the one at the time of purchase—even when the capacity block is set to start later. A rate card therefore has at least two dates relevant to a buyer: the date the reservation is purchased and the period in which the compute will run. A future start date does not, under the published terms, defer the price decision until the reservation begins. [@aws-capacity-block-pricing-2026]

This gives the scheduled update a practical significance without making it a forecast of market-wide GPU costs. A team deciding whether to reserve before or after a rate change has to consider capacity availability, planned start date, reservation duration and the applicable price. The page itself says prices change with supply and demand, but it does not disclose demand levels, reservation fill rates or whether a particular region has spare capacity. A rate movement alone cannot show whether compute became more or less accessible.

### Compare like with like

Before comparing quotes, a buyer should align the accelerator type, region, number of devices, reservation duration, purchase date and operating-system choice. The buyer should then calculate the whole job: expected runtime, utilization, storage and data movement, software requirements and the risk of unused reserved time. These factors do not turn the AWS price page into a total-cost calculator; they explain why its per-accelerator figure is only one input.

The useful analysis is narrow. AWS is publishing a scheduled change for one reservation product, not a cross-cloud price index and not a claim that every AI workload will become more expensive. The page establishes the current buying rules and the rate schedule AWS says will apply from 7 October. Readers evaluating the market should keep the old table, new schedule and pricing model attached to their respective dates, then recheck the current page before using any amount in a budget. [@aws-capacity-block-pricing-2026]

**Bottom line:** AWS’s Capacity Block rate is a time-stamped reservation price, not a universal GPU cost or a complete workload bill.

**Why it matters:** Teams can misbudget compute if they compare per-accelerator prices without matching the purchase date, instance size and reservation terms.

**Key takeaways:**
- AWS says Capacity Block reservation rates change periodically with supply and demand.
- The 7 October 2026 schedule was future-dated in the 4 October capture and must be rechecked before publication.
- Instance charges, reservation fees and operating-system fees are separate parts of the bill.

**What changes:** Compute budgets should record the pricing page date, region, accelerator count and reservation model alongside every quoted hourly rate.

**Evidence note:** AWS is the primary source for its pricing page and announced schedule. No claim here treats its price as representative of other providers or as a measurement of current market availability.

## 14. A context window is a ceiling, not a recall score

**Slug:** `context-window-vs-memory`  
**Topic:** Model evaluation  
**Proposed dek:** Google says Gemini 3.8 Flash accepts up to one million input tokens. That is a capacity specification, not a guarantee that the model will find and use every relevant fact across a long prompt.

### An input limit is not a reliability result

Google DeepMind’s Gemini 3.8 Flash card lists a token context window of up to one million tokens. That tells a developer how much input the product may accept under the described configuration. It does not say how accurately the model will retrieve a detail buried in a long document, connect evidence from distant sections, or refuse to answer when the supporting fact is missing. Those are task-performance questions, not measures of input capacity. [@google-gemini38-flash-card]

The difference is easy to miss because a large limit sounds like a large memory. In everyday product language, “memory” can suggest that a system will preserve information and use it reliably later. A context window is narrower: it describes the input presented in a particular model request. Persistent memory across sessions requires the surrounding application to store information and make it available again. Neither a large window nor a successful single retrieval test proves that a system has durable memory.

### A simple needle test can overstate capability

The 2024 RULER study was designed to test more than whether a model can locate one planted fact in a long input. Its benchmark includes retrieval, multi-hop tracing, aggregation and question answering, with task complexity and context length varied. The authors evaluated ten long-context models across 13 task configurations. They report that models could achieve nearly perfect performance on a basic needle-in-a-haystack test while showing substantial drops on more complex tasks as inputs grew. [@ruler-long-context-2024]

RULER’s results also distinguish an advertised limit from an effective working range. In the systems it tested, all models claimed context lengths of at least 32,000 tokens, but only four maintained what the authors considered satisfactory performance at 32K. The study reports that almost all tested models fell below its threshold before reaching their claimed context size. That threshold belongs to the researchers’ benchmark; it is not a universal product standard. [@ruler-long-context-2024]

This is not evidence that Gemini 3.8 Flash—or another 2026 model—fails at one million tokens. RULER evaluates older model versions and does not test current products. Its contribution is methodological: a single fact-retrieval test can miss failures that appear when a task requires multiple steps, aggregation or evidence at longer distances.

### The position of evidence can change the answer

The “Lost in the Middle” study provides another reason to vary test conditions. It evaluates multi-document question answering and key-value retrieval while moving relevant information through the input. The authors report that systems often performed best when the answer-bearing passage appeared near the beginning or end and worse when it was in the middle. This position sensitivity was observed in the models tested at the time, including systems described as long-context models. [@lost-middle-context-2023]

That finding is also historical, not a result for current commercial systems. It should not be used to claim that every modern model has the same curve. It does suggest a practical question that a maximum-token spec does not answer: does the system find relevant evidence when its location, surrounding distractors and number of supporting passages change?

### Test the workload, not the advertised maximum

A buyer evaluating long-context capability should test at several input lengths and place relevant evidence at the beginning, middle and end. The evaluation should include multiple relevant passages, distractors, conflicting statements, aggregation across sections and a no-answer case. The system should be scored on factual accuracy and citation support, not merely whether it returns an answer. If a workflow processes contracts, research papers or case files, use representative documents and keep a held-out set so prompt tuning does not turn the evaluation into memorization.

The test should also reflect the surrounding product. Retrieval systems, document chunking, system prompts and tool calls can change what the model actually sees. If an application retrieves a few pages from a larger archive, the effective context is partly determined by that retrieval stage. A large model window cannot repair a search system that omitted the key evidence, and an answer can still be unreliable when every relevant passage fits.

Teams should record the model version, input length, evidence position, retrieval method, task type and scoring rule. They should also test whether the system can identify when the supplied material does not contain an answer. These details make a result interpretable and repeatable. Without them, “supports one million tokens” may be technically correct but does not tell a buyer how the model performs on the buyer’s task.

### Keep the claim within its evidence

Google’s card establishes a stated input window. RULER and “Lost in the Middle” establish that older long-context systems could behave differently depending on task complexity, input length and evidence position. None of these sources independently tests Gemini 3.8 Flash on a million-token workload. A current-model comparison would need a fresh, reproducible evaluation that discloses the exact model, prompt, context length, evidence placement, retrieval setup and scoring.

The useful conclusion is therefore not that large context windows are ineffective. They can make more source material available in one request and reduce the need to split a task. But a larger window moves the evaluation question; it does not answer it. Developers still need to verify that the model can use the relevant evidence under the conditions their product will encounter. [@google-gemini38-flash-card] [@ruler-long-context-2024] [@lost-middle-context-2023]

**Bottom line:** A context-window specification measures accepted input capacity; it does not certify recall, reasoning across long documents or persistent memory.

**Why it matters:** Teams that buy on token limits alone may select a model that accepts the material but misses the evidence their workflow depends on.

**Key takeaways:**
- Google lists up to one million input tokens for Gemini 3.8 Flash.
- RULER and “Lost in the Middle” show why task complexity and evidence position belong in long-context evaluations.
- Older studies motivate a test design; they do not establish the performance of current models.

**What changes:** Long-context procurement tests should report task, length, evidence position, retrieval setup and scoring criteria alongside the advertised token limit.

**Evidence note:** Google’s model card is a first-party specification; RULER and “Lost in the Middle” are independent research studies of older systems. No current 2026 long-context score is asserted.

## 15. An agent pass rate needs a task map around it

**Slug:** `agent-evaluation-task-map`  
**Topic:** AI-agent evaluation  
**Proposed dek:** A success rate says how often an agent reached a goal in one benchmark. It does not show which task tiers it handled, how it failed, or whether it followed the right permissions along the way.

### A pass rate is useful, but it is only one measure

Task completion is a standard way to evaluate an AI agent: did it reach the specified end state? The 2025 survey “Evaluation and Benchmarking of LLM Agents” describes success rate, pass rate and binary reward as common measures. It also notes a limit: task completion can provide little detail about why an agent failed, particularly when most systems have low success rates. The survey separates outcome measures from capability questions such as tool use, planning, memory, reliability and safety. [@agent-evaluation-survey-2025]

That distinction matters because an agent can reach a goal by taking a brittle route, or fail after performing most of the work correctly. An aggregate success percentage does not reveal whether a failure came from choosing the wrong tool, losing an earlier constraint, mishandling a transient error, or acting outside its authority. Those are different risks and call for different remedies.

### AgentFloor shows why task mix changes the result

The 2026 AgentFloor preprint makes task scope visible through a benchmark of 30 tasks organized into six capability tiers, from instruction following and tool use to multi-step coordination and long-horizon planning. The authors report 16,542 scored runs across 16 open-weight models and GPT-5. In their results, small and mid-sized open-weight models were sufficient for much of the short-horizon structured work; the strongest open-weight model matched GPT-5 in aggregate on this benchmark. The authors report a clearer gap on long-horizon planning, where neither group achieved strong reliability. [@agentfloor-2026-preprint]

The result is not that open-weight models match frontier models generally, or that every routine workflow can be routed to a small model. AgentFloor is one deterministic task suite with a stated set of models and conditions. Its value for buyers is that it reports performance by a capability ladder rather than asking readers to infer every workflow from one undifferentiated number. The paper also reports that targeted interventions had model-specific effects, a reminder that a technique that helps one system may not transfer to another. [@agentfloor-2026-preprint]

### Ask what is inside the score

Before comparing agent percentages, a buyer should inspect the tasks and their weights. A benchmark dominated by short tool calls will favor different behavior from one dominated by long plans that must preserve constraints across many steps. If the suite reports one average, ask for its per-tier results and how much each task contributes. A high aggregate score can coexist with a weak result on the exact workflow a buyer needs.

The execution environment matters too. A simulated browser, a fixed API and a live business system impose different failure modes. The survey treats evaluation context, dataset, interaction mode and metrics as separate dimensions. It also distinguishes static tests from interactive assessments. These choices affect what a score means; two “success rates” are not comparable unless the tasks, environment, success criteria and scoring method are sufficiently aligned. [@agent-evaluation-survey-2025]

The benchmark should record more than the final answer. Tool choice, tool arguments, intermediate state, retries, recovery after an error, and policy compliance help explain how the agent reached—or missed—the goal. A task can be marked successful while still revealing an unsafe or unnecessarily expensive path. Conversely, an agent may fail because an external service was unavailable, not because its planning was wrong. A trace makes the distinction inspectable.

### Build a scorecard around the work

For a real deployment, teams can report overall goal completion beside per-task or per-tier success, repeatability across multiple runs, and failure categories. They should also record unauthorized or policy-violating attempts, human intervention, recovery behavior, latency and cost. These measures are not a universal formula: the right scorecard depends on the agent’s role and the consequences of its actions. A research assistant and an agent that edits customer records do not need the same acceptance threshold.

Repeated runs matter because agent behavior can vary. A single successful run demonstrates possibility, not dependable performance. Teams should state the number of trials, whether tasks were held out from prompt development, what tools were enabled, and how success was judged. If an LLM judge is used, its rubric and calibration should also be reported; if success is mechanically verified, the desired state should be explicit.

The evaluation survey provides a useful organizing principle: measure the outcome, the capabilities needed to produce it, the system’s reliability, and its safety in the evaluation context. AgentFloor’s tiered results show how that kind of decomposition can change the interpretation of a headline comparison. A pass rate remains valuable, but only when readers can see what passed, under which conditions, and what failures the aggregate may conceal. [@agent-evaluation-survey-2025] [@agentfloor-2026-preprint]

**Bottom line:** An agent’s overall success rate is not a complete reliability profile; it needs task-level results and an account of how the system acted.

**Why it matters:** Teams can avoid choosing an agent that performs well on routine tasks but fails on the long-horizon or high-risk work they actually need.

**Key takeaways:**
- Agent benchmarks measure different task mixes, environments and success criteria.
- AgentFloor reports distinct results across short-horizon and long-horizon task tiers.
- Repeated runs, traces and policy checks help explain what an aggregate pass rate leaves out.

**What changes:** Procurement scorecards should publish per-tier outcomes, trial counts, failure categories and the evaluation environment.

**Evidence note:** The survey synthesizes evaluation methods; AgentFloor is a 2026 preprint and its findings are limited to its benchmark and tested models.

## 16. Enterprise agent security begins at the tool boundary

**Slug:** `enterprise-agent-tool-security`  
**Topic:** AI-agent security  
**Proposed dek:** OWASP highlights tool misuse and identity or privilege abuse among agentic risks. New control guidance points toward inspectable, traceable systems with runtime policies—but those controls are not universal and do not replace careful authorization.

### The prompt is not the security boundary

An instruction such as “only read this folder” is not, by itself, an access-control mechanism. If an agent can call a mail, code or data tool, the system must determine which identity it represents, which resources that identity can access, and whether a specific action is allowed. OWASP’s December 2025 announcement of its Top 10 for Agentic Applications highlights agent behavior hijacking, tool misuse and exploitation, and identity and privilege abuse as risks. [@owasp-agentic-top10-announcement-2025]

These risks connect model behavior to ordinary authorization problems. A prompt can describe the desired boundary, but the application or tool platform should enforce the boundary before a side effect occurs. If a model is manipulated or simply makes a mistake, credentials that carry broader access than the task requires can turn an incorrect tool call into a data exposure or an unwanted change.

### Treat authority as a control plane

OWASP’s Agent Control Standard (ACS), published in September 2026, describes agent platforms as needing to be inspectable, traceable and instrumentable: operators should be able to see what an agent is, what it can access, what it did and why, and control its behavior at runtime. The project says ACS defines how platforms expose middleware hooks for enforcing safety policies, with declarative controls intended to work across frameworks. [@owasp-agent-control-standard-2026]

That is a design direction, not proof that all frameworks implement the same controls or that ACS is a legal requirement. The OWASP page presents an open foundation for portable control, while actual deployments still need to define the policy and verify that enforcement works. A policy layer is only useful if it sees the action before the tool carries it out and can deny or pause the action when the request falls outside the agent’s authority.

A practical control design starts with identity. The trace should make clear which user or service the agent acts for, which credentials are in use, and which permissions were granted. Tool access should be limited to the job: read-only access where possible, narrow resource scopes, and separate permissions for actions that write, send or delete. High-impact actions can require a human confirmation or a second approval, but the approval step should be explicit and enforceable rather than a request embedded in the model’s prompt.

### Logs help explain; policy must prevent

LangSmith’s Fleet documentation offers one example of how a platform can expose controls: it documents role-based and attribute-based access policies for tools and integrations, as well as structured traces of tool calls, decisions and outputs. The docs say traces can be inspected and exported alongside agent identity and permissions. This is a vendor-specific implementation example, not evidence that every agent platform has equivalent features or that any one product satisfies every enterprise requirement. [@langsmith-fleet-access-oversight]

The distinction between prevention and investigation is important. An audit trail can help answer who acted, with which permissions and what result followed. It cannot undo a message already sent or data already exposed. A deployment therefore needs both runtime authorization and traceability. Where an action is reversible, the system should preserve a clear undo path; where it is not, the approval threshold should reflect that consequence.

Tool boundaries also require testing. Security teams can simulate malicious instructions in retrieved documents, a tool returning unexpected content, an expired credential, and an agent trying to use a tool outside its assigned task. Tests should confirm not only that the model says “I can’t,” but that the tool call is blocked, the reason is logged, and the operator can identify the event. OWASP’s risk list is a prompt to examine those failure paths, not a substitute for a threat model tailored to the deployment. [@owasp-agentic-top10-announcement-2025]

### Keep standards separate from guarantees

The new OWASP ACS and Agentic Top 10 add useful vocabulary for platform builders and security teams. They do not establish that an agent is safe simply because it uses a compatible framework, nor do they verify an individual deployment’s access policy. Organizations still need to inventory agents and tools, assign least authority, protect credentials, test controls under adversarial inputs, and review traces when actions matter.

The core design principle is straightforward: the model may propose an action, but a trusted control layer must decide whether that action is authorized. Prompts help guide behavior; scoped credentials, runtime checks and observable execution limit what happens when guidance fails. [@owasp-agent-control-standard-2026] [@langsmith-fleet-access-oversight]

**Bottom line:** Secure agents need authorization and runtime policy at the tool boundary; prompt instructions and audit logs alone cannot enforce access.

**Why it matters:** A compromised or mistaken agent can cause real harm when its credentials reach beyond the task it was assigned.

**Key takeaways:**
- OWASP identifies tool misuse and identity or privilege abuse as agentic risks.
- ACS emphasizes visibility and runtime controls, but it does not certify every platform or deployment.
- One platform’s access and tracing features are examples, not an industry-wide guarantee.

**What changes:** Agent deployments should scope identity and tools, block unauthorized actions before execution, and keep traces that show who acted and why.

**Evidence note:** OWASP pages describe project guidance; LangSmith docs describe one vendor’s features. Neither establishes universal implementation or compliance.

## 17. India’s data-centre water estimates are not a national meter

**Slug:** `india-data-centre-water-evidence`  
**Topic:** Infrastructure resilience  
**Proposed dek:** A CEEW study cites large water-use estimates for India’s data-centre sector and a typical hyperscale facility. A parliamentary reply discusses capacity and cooling technologies, but does not provide a measured national water-consumption total.

### A facility estimate is not a national measurement

A 2026 study by the Council on Energy, Environment and Water (CEEW) says that cooling a typical 100-megawatt hyperscale data centre can require about two million litres of water a day. The report attributes that estimate to the International Energy Agency’s 2025 material. It is a scale illustration for a described facility type, not a measurement of every Indian data centre or a direct estimate of water used for AI workloads. [@ceew-india-datacentre-water-2026]

The quoted two-million-litre figure is specifically described as a daily cooling requirement. The passage does not state the water source, whether water is reused, or the measurement method. Withdrawal, consumption and cooling demand are related but distinct quantities; a cooling estimate should not be treated as the full facility’s water balance or as a measure of water returned to the local system.

The same report cites an estimate that India’s data centres used about 150 billion litres of water in 2024, with use projected to more than double by 2030. That number is attributed in the report to Mordor Intelligence, while the facility-level cooling estimate points to the IEA. The figures have different sources and units: one describes a national annual estimate, the other a daily cooling requirement for a typical 100-MW site. Neither should be converted into a verified national total by multiplying or scaling without matching facility counts, cooling systems, location, water source and measurement boundaries. [@ceew-india-datacentre-water-2026]

This distinction is especially important when a report discusses data centres as a sector. The estimates cover data-centre facilities and cooling, not only AI workloads. A facility can host cloud, storage and other digital services alongside AI. Without a measured breakdown by workload, a sector-wide water number cannot be presented as AI’s individual water footprint.

### A parliamentary answer describes process, not consumption

A March 2026 Rajya Sabha reply published by the Ministry of Jal Shakti says that MeitY had received no concerns regarding water consumption in data centres. It also reports national capacity growing from 375 MW in 2020 to more than 1,500 MW in 2025 and names cooling approaches including direct-to-chip liquid cooling, adiabatic cooling and immersion cooling. The reply does not provide a national water-consumption total, a site-level series or a water-use-efficiency figure. [@pib-water-consumption-datacentres-2026]

“No concerns received” is not the same statement as “no water is consumed,” “no local water risk exists,” or “water use is being measured consistently.” It records what the ministry said it had received, while the capacity figure tracks a different quantity. The reply’s list of cooling methods establishes that these approaches are reported as industry practices; it does not quantify how many sites use each one or how much water they save in operation.

CEEW also reports that stakeholders in its consultations generally perceived water-availability risk as low to medium. That is useful evidence about stakeholder perceptions at the time of the study. It is not a hydrological assessment for every site, and it does not replace measurements of water withdrawal, consumption, reuse or source. The report itself argues for integrated land-water-energy planning, suggesting that siting and resource disclosure deserve attention as the sector grows. [@ceew-india-datacentre-water-2026]

### What a comparable record would need

To evaluate a facility’s water footprint, a reader needs more than capacity in megawatts. Useful records would distinguish water withdrawn from water consumed, identify the source—municipal supply, groundwater or recycled water—and state whether the measure covers cooling alone or the entire facility. The cooling technology, local climate, workload density, reporting period and method for calculating water-use efficiency also matter.

A national estimate would need the same definitions across facilities and dates, as well as a way to avoid counting planned capacity as operating. A 100-MW design example cannot stand in for a fleet with different sizes, cooling systems and water sources. Likewise, a projected doubling in a report should remain a projection unless later measurement confirms it.

The current public record therefore supports a bounded conclusion: Indian research reports substantial sector-level and facility-level water estimates, while the cited parliamentary response provides capacity and cooling-policy context without a measured national consumption total. That is enough to justify better disclosure; it is not enough to assign a precise AI-only water burden or to assert that all data centres face the same risk. [@ceew-india-datacentre-water-2026] [@pib-water-consumption-datacentres-2026]

**Bottom line:** Public water figures for Indian data centres are estimates with different boundaries, not a measured national total or an AI-only footprint.

**Why it matters:** Site-specific water sources and cooling systems shape local risk; headline capacity alone cannot show a facility’s water demand.

**Key takeaways:**
- CEEW cites a roughly two-million-litre daily cooling estimate for a typical 100-MW hyperscale facility.
- The parliamentary reply reports no concerns received and gives capacity figures, but not a national water-consumption measurement.
- Sector-wide data-centre estimates must not be presented as AI-only water use.

**What changes:** A dated facility-level record should separate water withdrawal, consumption, reuse, source and cooling method.

**Evidence note:** CEEW’s figures are attributed estimates compiled from other sources; the PIB page is a parliamentary reply. Neither source independently measures water use across all Indian data centres.

## 18. Why U.S. data-centre electricity forecasts span a wide range

**Slug:** `us-data-centre-energy-scenarios`  
**Topic:** Infrastructure  
**Proposed dek:** Lawrence Berkeley National Laboratory estimates U.S. data centres used 176 terawatt-hours in 2023, then models 325–580 TWh in 2028 under different equipment, utilization and cooling assumptions. The range is a scenario set, not a single observed number.

### Separate the historical estimate from the scenarios

The 2024 United States Data Center Energy Usage Report from Lawrence Berkeley National Laboratory (LBNL) estimates historical electricity consumption for data centres and models a range of possible demand through 2028. It puts 2023 use at 176 terawatt-hours, or 4.4% of total U.S. electricity consumption. For 2028, it gives a low-to-high range of roughly 325 to 580 TWh, equivalent to 6.7% to 12.0% of the report’s forecast for U.S. electricity consumption that year. [@lbnl-us-data-centre-energy-2024]

The report says its historical series relies on previous studies and shipment data as well as newer information. The 2023 number is therefore a research estimate, not a direct sum of utility meter readings from every U.S. data centre. Keeping that status visible helps readers compare like with like: an estimate of past use should not be described as a fully measured total, and a future scenario should not be treated as an observed result. [@lbnl-us-data-centre-energy-2024]

Those values answer different questions. The 176 TWh figure is the report’s estimate of historical 2023 use; 325–580 TWh is a range of modeled futures. Reporting the upper endpoint as though it were measured demand, or treating the midpoint as a central forecast without the report’s assumptions, would erase the main information in the analysis: future data-centre power use depends heavily on the pace and operation of accelerated computing.

The report describes its total as including servers, storage, network equipment and data-centre infrastructure. It is not an AI-only electricity measure. GPU-accelerated servers form an important part of its future scenarios, but the total still covers the broader data-centre system. The figures should not be used as if every terawatt-hour belonged to AI training or inference. [@lbnl-us-data-centre-energy-2024]

### The endpoints reflect different operating assumptions

LBNL says the post-2023 range reflects alternative assumptions about future equipment shipments and operational practices, as well as cooling energy. The GPU shipment assumptions depend on demand for GPUs and manufacturers’ ability to supply them. The operating scenarios vary how much computational power the installed AI hardware draws and how often it is used. Cooling assumptions vary by system selection and efficiency, including possible movement toward liquid cooling or away from evaporative cooling. [@lbnl-us-data-centre-energy-2024]

That means the range is not a statistical confidence interval around one measured value. It is a scenario range produced from different inputs. A high endpoint can reflect a faster build-out and more intensive operation; a low endpoint reflects a different set of equipment and use assumptions. The report makes those choices visible enough that readers can ask what changed between scenarios rather than simply choose the largest number.

The conversion to power demand is also conditional. LBNL says that, assuming average capacity utilization of 50%, the annual energy range would correspond to an estimated 74–132 GW of total data-centre power demand. That is a scenario-derived conversion, not a measured demand at a particular grid connection or a statement about peak use. It should remain attached to the utilization assumption whenever it is quoted. [@lbnl-us-data-centre-energy-2024]

### Forecast disagreement is not automatically a factual dispute

A wide range can look like uncertainty about a single forecast, but it may instead reflect different assumptions about GPUs, workload growth, utilization and cooling. To compare two data-centre estimates, a reader should first check the geography, base year, included equipment, treatment of accelerated servers and whether the figure is historical, forecast or scenario. A global estimate for actual 2025 use cannot be substituted for a U.S. 2028 scenario without explaining those differences.

The LBNL report is useful because it makes several of those assumptions explicit. It does not resolve how much of the future total will be attributable only to AI, how the mix of workloads will evolve, or where new load will connect to the grid. Those questions require more granular information about facility commissioning, server shipments, workload use and site-level power. The scenario range is a planning tool, not a precise claim about a future bill.

For policymakers and utilities, the immediate implication is to plan for a range and update it as shipments and operating data arrive. For readers, the key is to retain the distinction between the historical estimate and the modeled future. The report’s central signal is not one fixed 2028 total: it is that data-centre demand can rise substantially, with the exact scale tied to decisions and supply conditions that remain changeable. [@lbnl-us-data-centre-energy-2024]

**Bottom line:** LBNL’s 325–580 TWh figure is a U.S. 2028 scenario range driven by assumptions—not a measured outcome or an AI-only forecast.

**Why it matters:** Utilities and policymakers need to see the assumptions behind rapidly rising demand projections before treating one endpoint as inevitable.

**Key takeaways:**
- LBNL estimates 176 TWh of U.S. data-centre electricity use in 2023.
- Its 2028 range varies with GPU shipments, AI-hardware utilization and cooling assumptions.
- The total covers the data-centre system, not only AI workloads.

**What changes:** New forecasts should report scenario inputs and update them against observed shipments, utilization and facility-level electricity use.

**Evidence note:** LBNL is the primary source for the historical estimate and scenario range. These are estimates and modeled scenarios, not independently measured 2028 demand.

## 19. Model-card benchmarks do not create a cross-vendor leaderboard

**Slug:** `model-card-benchmark-incomparability`  
**Topic:** Model evaluation  
**Proposed dek:** Current model cards publish useful benchmark scores, sometimes in side-by-side tables. But task versions, tools, scoring rules, effort settings and trial counts differ; a leaderboard claim requires more than matching model names in columns.

### A table can contain several different kinds of evidence

Google DeepMind’s September 2026 Gemini 3.8 Flash card provides a useful example of why the rows matter. It reports results across coding, knowledge work, long-context, computer use and scientific reasoning. Some rows name a benchmark version; others describe a score mode. The card labels OSWorld-2.0 as a partial score with batch tools enabled, describes CharXiv as “no tools,” and separates agentic and static LVBench results. Those labels are not decoration: they define what the reported number represents. [@google-gemini38-flash-card]

The card also lists Terminal-bench 2.1 and Terminal-bench 4.0 as separate rows. The first is described as agentic terminal coding; the second as general agent capabilities. Their scores cannot be read as if they were two attempts at the same test or combined into a single model ranking. A model may perform differently because the task changed, not because its general capability rose or fell. [@google-gemini38-flash-card]

### Disclosures differ across model releases

Anthropic’s Claude Sonnet 5.5 system card says it presents a variety of pre-deployment evaluations, omits some assessments that require substantial human time when they are not critical to a section, and focuses more on numerical results than extended prose analysis. That is a useful disclosure about coverage, but it also means readers should not assume that every model card reports the same evaluation set or level of detail. [@anthropic-sonnet55-card-2026]

OpenAI’s GPT-6 release material attaches an effort condition to some results, such as GPT-6 Sol at maximum effort, and reports cost per task for selected workflow evaluations. Effort and cost are relevant to buyers: a result produced under a high reasoning budget may have different latency and economics from a default setting. The same release text describes tool controls and prompt caching separately, reinforcing that the model is only one part of a deployed workflow. [@openai-gpt6-sol-luna-card-2026]

xAI’s Grok 4.7 system card states that most results are for the final deployed checkpoint, identifies external evaluators for some benchmark sections, and describes at least one agentic benchmark with eight trials per task and a native agent harness. The trial count, verifier threshold and harness affect how a score should be interpreted. Another vendor’s number is not automatically produced under those same conditions simply because it appears next to it. [@xai-grok47-card-2026]

These examples do not prove that vendors’ numbers are wrong or that cross-vendor comparison is impossible. A side-by-side result can be informative when the exact model versions, benchmark version, task set, access method, tools, effort budget, number of trials and scoring rule align. A card’s layout alone does not establish that alignment. The test owner also matters: a vendor’s own evaluation can be carefully designed, but it is still a different kind of evidence from an independent test run under a published common protocol.

### Compare the task and protocol, not just the percentage

An independent 2025 survey of agent evaluation organizes assessment around both objectives—such as task completion, capability, reliability and safety—and process choices such as the interaction mode, evaluation data, metric, tooling and context. That framework helps readers ask the questions a score table may leave unanswered: Was the task simulated or interactive? Did the agent have a browser or batch tool? Was success binary, partial or judged by another model? Were failures averaged across one run or repeated trials? [@agent-evaluation-survey-2025]

For a procurement decision, first identify the task the benchmark represents. Then confirm the benchmark version and whether the systems ran under the same prompts, tools, system instructions, scaffolding and resource limits. Look for the success definition, sample size, retries, model checkpoint and test date. If one entry is a static answer and another an agentic run with tool access, treat them as different evidence even if the table puts them on the same line.

The next step is to validate the comparison on the buyer’s own workload. Use the same task set and harness for each candidate, disclose reasoning effort and tool availability, and run enough trials to estimate variability. Keep task-level results, failure categories, latency and cost alongside the average. An overall percentage may hide a low score on the one task that matters most to a particular team.

### Model cards are evidence, not a universal ranking

Model cards and system cards are valuable because they disclose intended use, risks, evaluation results and known limitations. Their differences are also informative: they show that vendors make different decisions about which tests to run and publish. Readers should reward clear protocols, but not treat a longer table as proof of broader capability or a winner across all use cases.

The practical standard is conditional. If two models were tested on the same benchmark version, with the same access, tools, effort and scoring, their results may support a bounded comparison for that task. If those details differ or are missing, the score remains a vendor-reported signal—not a normalized leaderboard. This distinction lets buyers use public evidence without overstating what it proves. [@google-gemini38-flash-card] [@anthropic-sonnet55-card-2026] [@openai-gpt6-sol-luna-card-2026] [@xai-grok47-card-2026]

**Bottom line:** A score table supports a cross-vendor comparison only when the benchmark version and evaluation protocol are aligned and disclosed.

**Why it matters:** Buyers can mistake different tasks, tool setups or effort budgets for a single ranking of general model capability.

**Key takeaways:**
- Model cards report different task types, score modes and evaluation coverage.
- Effort settings, tools, harnesses and trial counts change what a benchmark score means.
- A shared benchmark name is not enough; compare the version and protocol.

**What changes:** Every model comparison should keep model version, test owner, benchmark version, tools, effort, trials and scoring rule with the score.

**Evidence note:** The model and system cards are first-party disclosures; the agent-evaluation survey is independent methodological context. No model is ranked overall here.

## 20. India’s capacity figures disagree before the GPU question begins

**Slug:** `india-capacity-definition-gap`  
**Topic:** India data-centre infrastructure  
**Proposed dek:** Cushman & Wakefield reports 1,789 MW of operational capacity across India’s top seven data-centre markets in H1 2026. A PIB factsheet gives a lower, undated “current” national figure of about 1,575 MW. The public pages do not provide a common definition to reconcile them.

### Similar units do not guarantee the same measure

Cushman & Wakefield’s September 2026 update says India’s top seven data-centre markets added 178 MW in the first half of 2026, bringing their operational capacity to 1,789 MW as of H1. The same update forecasts another 3,860 MW of supply by 2030, split into 509 MW under construction and 3,351 MW in the planning stage. The report labels these categories separately: the pipeline is not operating capacity. [@cw-india-dc-h1-2026]

A PIB factsheet gives a different snapshot, saying installed data-centre capacity has grown from 375 MW in 2020 to about 1,575 MW “currently.” The capacity line itself does not state an observation date or explain how installed capacity is measured. A separate Rajya Sabha reply published in March 2026 says national capacity reached around 1,500 MW by 2025. These government figures are close in scale, but their wording and reference periods are not identical either. [@pib-india-dc-capacity-factsheet-2026] [@pib-india-dc-rajya-sabha-mar2026]

The apparent mismatch is worth investigating: a report about seven major markets gives a higher number than the PIB factsheet’s undated national total. But the sources do not provide a shared table of included sites, measurement definitions or cutoff dates. It would be premature to call one number wrong without knowing whether “operational,” “installed” and “capacity” include the same facility types and measurement boundary.

### Keep live capacity separate from the pipeline

The C&W report’s 3,860 MW through 2030 combines projects in construction with those still at the planning stage. Only the 509 MW under construction is in that category; the 3,351 MW planned portion is further from operation. Adding the entire pipeline to a current capacity figure would turn prospective supply into live capacity. Conversely, planned projects can change or be delayed, so the full amount is not guaranteed to arrive by 2030. [@cw-india-dc-h1-2026]

Another number sometimes appearing beside data-centre capacity is the government’s 13.56 GW estimate of electricity demand from data centres by 2031–32. That is a future power-demand estimate, not a report of installed IT load or data-centre capacity today. It cannot be added to a current MW capacity total or used as a cross-check without knowing the demand model and what loads it includes. [@pib-india-dc-rajya-sabha-mar2026]

GPU counts describe a different layer again. The PIB factsheet says shared IndiaAI compute capacity had grown to more than 45,000 GPUs by June 2026. This is a programme-level count of onboarded accelerators, not a national data-centre MW total. Converting GPUs into megawatts would require details such as device mix, server configuration, power usage, utilization and what facility overhead is included. [@pib-india-dc-capacity-factsheet-2026]

### Media repetition is not independent confirmation

The Tribune and Economic Times articles captured for this research both repeat the C&W report’s 3,860-MW pipeline and investment figures. They are useful as evidence of how the report was covered, but they do not provide a second independent measurement of operational capacity. Treating three pages that repeat one consultancy estimate as three confirmations would exaggerate the evidence base.

The more defensible reading is a set of dated snapshots with unresolved definitions: a market report measuring the top seven cities at H1 2026, a PIB national fact-sheet line with an unspecified “current” date, and a March reply summarizing capacity by 2025. The numerical difference points to a need for methodology and coverage notes; it does not prove that national capacity is exactly either 1,575 MW or 1,789 MW.

### What a reconciled series should disclose

A comparable national series would name the reference date, geographic coverage, operational-status threshold and capacity measure. It should distinguish IT load from utility power demand, count only facilities that are operating in the current total, and separately report announced, planned and under-construction projects. If the series includes only major markets, it should say which cities and providers are covered.

Until those details are aligned, readers should keep the numbers attached to their sources and labels. C&W’s H1 2026 seven-market estimate is useful for understanding leading-market growth; PIB’s figure is a government snapshot with an unclear as-of date; the March reply gives an approximate 2025 national value. None on its own settles a single, reconciled national total. [@cw-india-dc-h1-2026] [@pib-india-dc-capacity-factsheet-2026] [@pib-india-dc-rajya-sabha-mar2026]

**Bottom line:** Published India data-centre capacity totals use different dates and labels; the sources reviewed do not support a reconciled national figure.

**Why it matters:** Mixing operating capacity, pipeline, power demand and programme GPU counts can make India’s infrastructure scale appear larger or smaller than the evidence supports.

**Key takeaways:**
- C&W reports 1,789 MW of operating capacity across seven markets in H1 2026.
- PIB reports about 1,575 MW of current installed capacity without a dated reference point in the cited sentence.
- C&W’s 3,860-MW pipeline and IndiaAI’s 45,000-plus GPUs are not current national capacity.

**What changes:** Every published total should include its date, geography, operational threshold and definition of capacity.

**Evidence note:** C&W and PIB are the primary sources for their respective figures. Tribune and Economic Times repeat C&W’s pipeline report and are not independent capacity measurements.