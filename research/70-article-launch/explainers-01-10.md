# Explainer drafts 21–30

**Status:** provisional research drafts; none approved for publication or integrated into newsroom records.
**Research date:** 4 October 2026.
**Citation convention:** Inline `[@key]` references map through `explainer-source-map.md`; they are not live newsroom source IDs.
**Byline:** unassigned; do not invent a named author or credentials.

## 21. What does “schedulable GPU capacity” actually mean?

**Slug:** `schedulable-gpu-capacity`  
**Topic:** Compute access  
**Proposed dek:** A GPU count can describe hardware, a programme promise, an allocation or a service someone can start using. Applicants need to know which one—and whether the requested accelerator is available in their window.

### One number can describe several different things

“How many GPUs are available?” sounds like a simple question. In practice, an answer can refer to machines installed in a data centre, machines connected to a provider’s service, capacity listed in a programme, hours assigned to a project, or devices a customer can put to work now. Those are not interchangeable counts.

There is no single public reporting vocabulary that every cloud, operator and government programme uses for these stages. This guide uses the terms below as practical distinctions, not as official IndiaAI definitions or a claim that every provider exposes the same status fields.

**Installed** means hardware has been placed at a site. That says little about whether power, networking, cooling, software or the provider’s control plane are ready. **Onboarded** means a provider has made the relevant hardware part of a service or programme; the word needs a provider-specific definition. **Allocated** means a project has been assigned a quantity or quota for a stated period. **Accessible** means an eligible user has a route to request or use it. None of those words alone proves that a job can start.

For this explainer, **schedulable** means that a service can start the requested workload in the user’s relevant time window, with the requested accelerator type, region, software environment and scale. It is a deliberately operational definition. A capacity claim should say whether “schedulable” means immediately idle, reservable for a future start, or merely expected to become available.

### Allocation is a decision, not a running job

The IndiaAI Compute Portal shows why these distinctions matter. Its guidance describes registration, eligibility checks, project proposals and review paths. A user seeking compute is moving through an access process; the portal’s published rules do not provide a live inventory of idle devices. The allocation page, in turn, displays dated project-level rows, including GPU type, count, provider and project dates. Those records establish that allocations were recorded, not that every listed accelerator remains available or can take a new job today. [@indiaai-compute-portal-guidance-2026] [@indiaai-allocation-register-2026]

A separate government factsheet says 237 projects had accessed subsidised AI computing by August 2026, covering 93.18 lakh GPU-hours. That is a programme-reported activity figure. The factsheet does not define whether the hours are allocated, metered or consumed, and it does not connect the aggregate to a current queue, hardware type or wait time. It should not be converted into a claim about present schedulable supply. [@pib-indiaai-compute-usage-2026]

The same logic applies outside IndiaAI. A provider’s product page can show that a GPU type exists in a region without telling a buyer whether enough devices are free for a multi-node job at a particular time. A reservation option may promise capacity only after a future start date and may impose a minimum duration. An allocation may be a quota, not a guarantee of immediate service.

### Ask for the job-shaped answer

To determine whether capacity is schedulable for a project, turn a headline count into a workload request. Specify the accelerator model, number of devices, region, expected start date, duration, memory needs, network requirements and software stack. Then ask whether the provider can start that exact workload in that window, what alternatives are offered, and how much notice is required.

A useful response should distinguish an immediate start from a future reservation; a single device from a multi-device placement; and a quota from a confirmed assignment. It should also say whether the quote refers to physical GPUs, virtualized instances, accelerator partitions or GPU-hours. A team that needs eight connected accelerators for distributed training cannot treat eight separate single-device slots as equivalent without knowing the network and scheduling arrangement.

Record the answer with a date. Capacity changes as workloads start and finish, reservations are placed, equipment is maintained and providers alter their available service. A statement that was true last quarter may not answer whether a job can run this week.

### Build a status ladder, not a single total

Public reporting becomes more useful when each stage has its own count and timestamp: installed devices; devices accepted into a service; capacity offered to users; requests received; allocations made; jobs started; and hours metered or completed. The measure should include accelerator type, provider, location, reporting period and the definition of each status.

For applicants, those records make it easier to plan data preparation and staffing around a realistic start window. For researchers and policymakers, they separate investment or inventory from service delivered. If a programme reports only allocations, readers should not infer successful job starts; if it reports aggregate hours, they should not infer how quickly a new user can get a slot.

The most useful question is therefore not just “How many GPUs are there?” It is “How many of the right GPUs can start this workload, in this place, during this period—and what evidence supports that answer?” Once a source answers those parts, its capacity number becomes much easier to interpret.

**Bottom line:** A GPU count becomes useful to an applicant only when its stage, accelerator type, time window and path to a running job are clear.

**Why it matters:** Installed hardware, programme allocations and immediately schedulable service answer different questions.

**Key takeaways:**
- “Installed,” “onboarded,” “allocated,” “accessible” and “schedulable” are useful distinctions, not a universal public taxonomy.
- A dated allocation or aggregate GPU-hour figure does not prove current idle supply.
- Ask whether the requested accelerator can start the workload in the needed region and time window.

**What changes:** Capacity reporting should connect inventory and allocations to job starts and metered use, with consistent dates and definitions.

**Evidence note:** IndiaAI portal pages and the PIB factsheet establish published process and programme-reported figures. They do not provide a live schedulability ledger.

## 22. How to read a data-centre capacity announcement

**Slug:** `data-centre-capacity-stages`  
**Topic:** Infrastructure  
**Proposed dek:** “Capacity” may mean live IT load, a building under construction, a utility connection or a planned project. A few checks can stop a pipeline headline from being mistaken for supply already in service.

### Start with the boundary

When a data-centre announcement says a market has a certain number of megawatts, begin by asking what the number measures. It might describe IT critical load, total facility power, a campus design target, a utility connection or the capacity of a single building. These terms describe related parts of a project, but they are not the same denominator.

The geography matters just as much. A market total might cover a city, a group of major markets, a country or a developer’s own portfolio. A report can also define “capacity” differently from another report. For example, a dated market update may count operational supply for a named set of Indian markets while listing planned projects separately; another research house can use a different geography or project-status method. Those numbers should not be added together without checking scope and date. [@cw-india-dc-h1-2026] [@jll-india-dc-market-dynamics]

### Separate live capacity from future projects

**Operational capacity** generally refers to facilities that have reached the reporting source’s stated operational stage. But a reader still needs to know whether the number refers to IT load or facility power and whether it includes all halls or only space ready for customer use.

**Under construction** is a different status: physical work is underway, but the facility is not necessarily able to serve customers. A construction start does not establish when power will be available, commissioning will finish or equipment will be installed. **Planned or pipeline capacity** can be earlier still. It may include projects that have been announced, permitted, financed or assigned a target date, and sources do not always use those labels identically.

Market reports often separate operational stock from a project pipeline. That separation is important: a pipeline is a view of possible future supply, not a count of capacity a customer can use today. Knight Frank’s market reporting, for instance, treats project stages and future development as distinct information from existing operational stock. The stage definition and report date still need to travel with the figure. [@knightfrank-pipeline-reporting]

### Read vacancy and absorption separately

Capacity can also be described through **vacancy**, **availability** or **absorption**. Vacancy usually refers to space or capacity not leased or occupied under the source’s definition; it does not automatically mean that powered racks, cooling, networking and the requested accelerator are ready. “Available” can refer to a marketed product or leasing status rather than a live compute service.

Absorption commonly describes how much capacity has been taken up during a period, but the source’s unit and period matter. It is not necessarily the same as workload utilization. A leased data hall can contain servers that are lightly used; a cloud GPU fleet can run hot while the building’s total capacity remains below its maximum. The data-centre market and the compute market have different measures.

### Use a short comparison checklist

Before comparing two announcements, write down five things:

1. **Stage:** operational, under construction, planned, or simply announced?
2. **Unit:** IT critical load, facility power, floor area, racks, servers or accelerators?
3. **Scope:** which city, markets, buildings and operators are included?
4. **Date:** when was the figure measured, and is it an estimate or a commissioned total?
5. **Access:** does the number mean a customer can lease space or start a compute job?

Then look for the source’s notes on power availability, commissioning, phasing and project status. If the answer is missing, keep the number as a reported figure with its original label instead of converting it into a live-supply estimate. Two sources can both be accurate within their methods and still be non-comparable.

### A worked example

Imagine a release reports “1,000 MW operational and 600 MW in the pipeline.” The first follow-up is whether the 1,000 MW means IT load or total facility power. Next, ask whether all operational buildings are commissioned and customer-ready. For the 600 MW, ask whether projects are financed, under construction or only announced, and whether it has a confirmed power connection.

If one company’s slide counts a planned campus from announcement while another counts only commissioned halls, the totals describe different stages even if both are labelled “capacity.” A reader should preserve the source wording, date and geography rather than silently recategorize the pipeline as supply.

The same discipline applies to AI infrastructure. A data centre’s power capacity is not a GPU inventory. A facility can support many kinds of workloads, and accelerator supply depends on equipment, networking, service design and scheduling as well as the building. A megawatt figure alone cannot tell a research team whether a particular model-training job can start.

**Bottom line:** Read a capacity number with its stage, unit, geography, date and access meaning; keep planned projects separate from operating supply.

**Why it matters:** Treating pipeline as live stock can overstate what operators or customers can use now.

**Key takeaways:**
- “MW” may describe IT load, facility power or a project target; the source must specify which.
- Operational, under-construction and planned capacity are different project stages.
- Vacancy or a data-centre power total does not establish GPU availability or workload utilization.

**What changes:** Every capacity comparison should retain each source’s scope, date and stage labels before calculating a combined total.

**Evidence note:** C&W, JLL and Knight Frank provide dated market-report examples. Their labels are not presented as a universal taxonomy, and no pipeline figure is treated as operational supply.

## 23. What a model card can—and cannot—tell you

**Slug:** `model-card-reading-guide`  
**Topic:** Model documentation  
**Proposed dek:** A model card can show who built a model, how it was evaluated and where its limits may be. It is a starting point for due diligence—not an independent audit or a guarantee of safe performance.

### Treat the card as a map, not a verdict

A model card is documentation that accompanies a model. The original model-card proposal recommends explaining a model’s intended use, performance under relevant conditions and the evaluation procedures behind reported results. Its goal is to give users more context when deciding whether a model fits an application. It does not turn a model into a certified product or prove that every disclosure is complete. [@model-card-reporting-paper-2019]

Start with identity. Record the exact model name, version, publication date and dependencies. If the card says a new release is based on an earlier model, note which details carry forward and which were newly evaluated. A card for one version is not automatically evidence about a later release.

### Check what the model is meant to do

The **intended-use** section tells you which users, tasks and settings the provider had in mind. Compare it with your own workflow. A model evaluated for general question answering may not be tested for financial advice, medical triage or the exact language variety your organization needs.

Check the **inputs and outputs** too. Text-only and multimodal systems have different failure surfaces. A card may describe images, audio or video as accepted inputs, but that does not show equal reliability across each modality. A limit such as a token context window is a specification; it does not certify that the model will retrieve every relevant fact in a long input. [@google-gemini38-flash-card]

### Follow each benchmark back to its conditions

For every reported score, look for the benchmark version, test split, prompting method, model configuration, tools, number of trials and scoring process. Some cards provide these details in a linked evaluation report rather than on the main page. The extra document matters: the headline result alone may not say whether a model used browsing, reasoning effort, a particular harness or human judging.

Provider cards illustrate why a field-by-field read is necessary. Google’s card includes sections for model information, data, evaluation, intended usage and limitations. Anthropic, OpenAI and xAI disclose evaluation material in their own card or system-card formats, with different choices about task details and trial reporting. Those are useful primary sources for what each company claims about its product; they are not independent confirmation that one model is better than another. [@google-gemini38-flash-card] [@anthropic-sonnet55-card-2026] [@openai-gpt6-sol-luna-card-2026] [@xai-grok47-card-2026]

To compare scores, align the task, benchmark version, input modality, model setting, tool access and evaluation method. If one card shows pass@1 and another reports a multi-attempt score, the values do not share the same interpretation. A number can be accurate inside its method and still be unsuitable for a direct ranking.

### Read limitations as part of the specification

The limitations section can name known weaknesses, excluded users, safety boundaries or conditions in which a provider does not recommend deployment. Treat these disclosures as useful constraints, not as a complete list of possible failures. Also note whether risks were tested directly, mitigated through product controls, or simply identified as an area requiring care.

Look for data and training details, model dependencies, distribution terms, hardware and software assumptions, and post-release updates. A hosted API and downloadable weights create different deployment questions. The card may point to terms or supporting reports; those documents should be opened rather than inferred from a short label such as “open” or “enterprise-ready.”

### What an absent field means

If a model card does not disclose a benchmark detail, write “not disclosed in the card reviewed.” That is different from claiming the provider did not perform the evaluation. Similarly, a statement that data details are limited does not reveal the full training process. The card defines what readers can verify from the document, not every internal practice.

Use the document to build a test plan: select the intended task, define unacceptable errors, reproduce the relevant conditions and evaluate on representative examples that were not used to tune prompts. Check outputs for accuracy, consistency, calibration and refusal behavior. For high-impact decisions, add independent review and safeguards appropriate to the consequences.

The practical value of a model card is that it makes questions easier to ask. It can narrow a shortlist, expose a mismatch between intended and actual use, and provide methods to reproduce. The final judgment still depends on your own evaluation, the complete terms and the way the system will be deployed.

**Bottom line:** A model card is provider documentation that can guide evaluation; it does not replace independent testing or application-specific due diligence.

**Why it matters:** Benchmark scores have meaning only when the model version, task and evaluation conditions are visible.

**Key takeaways:**
- Read version, intended use, inputs, evaluation method, limitations and distribution together.
- Keep first-party claims distinct from independent replication.
- Treat missing information as “not disclosed in this document,” not proof of an undisclosed process.

**What changes:** Buyers can turn the card’s stated use and evaluation conditions into a held-out test plan before deployment.

**Evidence note:** The model-card paper proposes a transparency framework. Current provider cards illustrate varying first-party disclosures; none is treated as a safety certification.

## 24. Context window, conversation history and retrieval are different things

**Slug:** `context-memory-retrieval`  
**Topic:** Model concepts  
**Proposed dek:** A model’s input limit, a chat transcript and a searchable knowledge base solve different problems. Calling all three “memory” can hide where information is stored, how it returns and what may go wrong.

### The context window belongs to a request

A context window is the amount of input a model can accept for a request, measured in tokens. The exact limit depends on the model and configuration. Google’s Gemini 3.8 Flash card, for example, lists an input window of up to one million tokens. That is a product specification for the request, not proof that the model remembers information after the request ends. [@google-gemini38-flash-card]

An application may place instructions, user messages, prior turns, retrieved passages and tool results into that request. The model can only respond to the information it receives in the current context. If a system truncates earlier turns or omits a relevant document, a long maximum window cannot restore it.

### Conversation history is stored by the product

When a chat seems to “remember” what was said yesterday, the product may be saving and resending conversation history. That history might be stored in an application database, summarized into a shorter profile, or represented by selected facts. The model itself does not need to carry the full transcript inside its weights for the product to bring earlier information back.

This design choice has consequences. A full transcript may preserve nuance but consume more context and expose more private material each time it is sent. A summary is shorter but can lose details or preserve a mistaken statement. An application should make clear what it stores, how users can correct or delete it, and whether that history is included in later requests.

### Retrieval adds external information to the prompt

Retrieval-augmented generation, or RAG, pairs a language model with a separate search system or knowledge base. The search system finds material relevant to a question and passes it into the model’s context. NIST’s glossary describes RAG this way and notes that changing the external information can update what the system uses without retraining the underlying model. [@nist-rag-definition-2025]

That means RAG is not the same as persistent personal memory. It is a way to find and supply information at answer time. A document index may be refreshed, but the system still has to retrieve the right passages, preserve their source, and fit them into the prompt. A wrong search result, stale file, missing access control or poorly chosen chunk can produce a bad answer even when the model itself is unchanged.

### Choose the mechanism that matches the need

Use the context window for information needed in one request. Use conversation history when the product must carry relevant prior interaction across turns. Use retrieval when the system needs to consult a changing library of documents or records. A product can combine them, but each component should have a clear job.

For example, a support assistant might keep the current exchange in its chat history, retrieve the latest approved policy from a document index, and send both to the model for one answer. The transcript is not the policy database; the retrieval index is not a guarantee of recall; and the model’s context window is not long-term storage.

### Evaluate the whole information path

Ask where each piece of information is stored, how long it persists, who can retrieve it, and what makes it appear in a request. Test stale and conflicting documents, missing records, permission boundaries and deletion requests. For retrieval, track which source passages were returned and whether the final answer is supported by them. For conversation memory, test whether the application carries only the facts users expect.

These choices also affect updates. Changing a policy document in a knowledge base can change what a RAG system retrieves after the index is refreshed; it does not change the model’s learned weights. Changing a stored user profile affects what the product may send in a later request; it does not mean the model permanently learned that fact. NIST’s definition separates the retrieval system from the model, while the product’s own storage design determines how history persists. [@nist-rag-definition-2025] [@anthropic-building-effective-agents]

For each information path, decide how to correct a bad fact and how to remove a user’s information. A product may need to delete a stored profile, remove a document from an index, refresh cached chunks and stop resending a past transcript. Those are distinct operations. If the team cannot identify where a fact lives, it will be difficult to explain retention or make a correction reliably.

Keep the term “memory” precise in product documentation. If a system stores a profile, say that the application stores a profile. If it retrieves documents, say it searches a knowledge base. If a model accepts a large prompt, describe the context limit. These distinctions make it easier to debug errors and discuss privacy without implying a capability the system does not have.

**Bottom line:** Context is request-sized input, history is product-managed state, and retrieval searches an external source before adding material to the request.

**Why it matters:** Teams need to know where information lives and how it reaches a model before relying on it for continuity or accuracy.

**Key takeaways:**
- A large token limit is not durable memory.
- RAG retrieves external information; it does not guarantee the right evidence will be found.
- Conversation history and user profiles are application storage choices with privacy and retention consequences.

**What changes:** Architecture diagrams and user disclosures should name context, stored history and retrieval separately.

**Evidence note:** The model context figure is a first-party specification. NIST provides a terminology definition for RAG; neither source establishes retrieval quality for a particular application.

## 25. What makes an AI system an agent?

**Slug:** `what-is-an-ai-agent`  
**Topic:** AI agents  
**Proposed dek:** An agent is not defined by a product label or a long prompt. The useful question is whether a system can choose actions through tools, carry state across steps and continue toward a goal—with humans setting its limits.

### Start with the system around the model

An AI agent is best understood as a system, not just a model. It can include a language model, instructions, tools, memory or state, a control loop and rules about when to stop or ask a person. The model may propose what to do next, while software decides which actions are available and whether a proposed action is permitted.

There is no single definition used by every provider and research group. Anthropic’s engineering guide makes a useful distinction: a **workflow** sends models and tools through predefined code paths, while an **agent** dynamically directs its own process and tool use. The same article groups both under the broader term “agentic systems.” [@anthropic-building-effective-agents]

Anthropic’s 2026 autonomy study uses a narrower operational definition for its measurement: an AI system equipped with tools that let it take actions such as running code or calling external APIs. That definition makes a study measurable, but it does not settle terminology for every product. [@anthropic-agent-autonomy-2026]

### Compare a fixed workflow with a tool-choosing loop

Consider a document assistant that follows three hard-coded steps: classify a request, retrieve a policy page and draft a response. It uses an LLM and tools, but the software chooses the sequence. That is a workflow under Anthropic’s distinction.

Now imagine a system given a goal, allowed to inspect a ticket, choose between search and a billing lookup, check the result and decide whether another action is needed. The model has more control over the sequence. It is more agent-like because it selects actions and uses their results to continue.

The distinction is about control, not whether a system is useful. A fixed workflow can be more reliable and easier to inspect for a routine task. An agent can adapt when the route is not known in advance, but it may add latency, cost and more possible failure paths. Anthropic itself advises starting with the simplest approach that satisfies the task rather than adding autonomy by default. [@anthropic-building-effective-agents]

### Autonomy has several dimensions

“Autonomous” is not a switch that is simply on or off. A system may choose tools but need approval before sending an email. It may act for one minute on a narrow task or continue for hours across multiple services. It may read records but not edit them, or modify a draft but require a person to publish it.

To describe a system clearly, specify its goal, available tools, data access, decision authority, time horizon, stop condition and human checkpoints. Also say whether it can take an irreversible action, such as deleting information, moving money or notifying a customer. Two products both called “agents” may have very different power and risk.

Evaluation research reinforces the need to break the label into capabilities. Agent benchmarks can test tool use, planning, memory, reliability and safety separately; a single task-completion score may not show which part worked or failed. That is why a product description should explain what the system can do rather than relying on the word “agent” alone. [@agent-evaluation-survey-2025]

### A simple test for the label

Ask four questions:

1. Does the system receive a goal or only a fixed input-output prompt?
2. Can it choose among tools or actions, rather than follow one fixed sequence?
3. Does it use action results to decide what to do next?
4. Can it continue across multiple steps without a person choosing every next move?

More “yes” answers suggest a more agent-like design, but the list is not a formal certification. The important point is to make control visible. A system that uses a tool once in a fixed workflow may not need the same label—or the same risk description—as one that chooses and chains actions over time.

### Keep people in the control design

Human oversight is not a single button. It can mean reviewing a plan before execution, approving a sensitive action, monitoring a live run, or checking an output before it reaches a customer. The right design depends on the consequence of error and whether the action can be reversed.

Teams should first decide what must remain deterministic, then give the model discretion only where flexibility improves results. Define allowed tools, limit scope, log decisions, set a stop condition and create a route for a person to intervene. Those are permission and security controls; the next explainer covers them in detail.

An agent is therefore not simply “a chatbot that thinks longer.” It is a software system with a model-led decision loop and some ability to act. The term is most informative when paired with a plain description of the actions, limits and human checkpoints behind it.

**Bottom line:** An agent-like system lets a model direct some sequence of tool-mediated actions toward a goal; its actual autonomy depends on the controls around that loop.

**Why it matters:** The word “agent” can conceal large differences in authority, duration and risk.

**Key takeaways:**
- Fixed workflows and dynamically directed tool use are different architectures.
- Agent definitions vary; state the study or product definition being used.
- Describe tools, permissions, stop conditions and human checkpoints alongside the label.

**What changes:** Product teams can explain agent capability in terms of actions and control, not marketing terminology alone.

**Evidence note:** The architectural distinction is Anthropic’s provider framing, the autonomy measure is study-specific, and the evaluation survey organizes agent capabilities without establishing a universal definition.

## 26. How to scope permissions for an AI agent

**Slug:** `agent-permissions-explainer`  
**Topic:** Enterprise security  
**Proposed dek:** “Human in the loop” is not a permission model. A safer agent has its own identity, only the tools and records it needs, approval for consequential actions, and logs that let an operator reconstruct what happened.

### Give the agent its own narrow identity

An agent should not inherit a broad administrator account simply because its user has one. Give each agent or service a distinct identity so that access can be limited, monitored and revoked without changing a person’s account. The exact identity mechanism depends on the platform, but the principle is to attribute tool calls to the system that made them.

OWASP’s agent-security work identifies identity and privilege abuse, along with tool misuse, as relevant risks. Its Agent Control Standard is project guidance for controlling agent behavior, not regulation or a single required product configuration. Its value is to direct attention to the controls around the model rather than treating the model prompt as the security boundary. [@owasp-agentic-top10-announcement-2025] [@owasp-agent-control-standard-2026]

### Separate reading from changing

Start with the smallest permission set that supports the workflow. If the agent needs to summarize a customer case, it may need read access to a specific case and approved policy documents; that does not mean it also needs permission to issue a refund, change billing details or export an entire customer table.

Separate read actions from write actions wherever the system allows it. A tool that can search a record should not automatically expose delete or update operations. If a workflow must make changes, constrain them to the relevant object and fields. For example, an agent that drafts a support response may be allowed to update a draft field but not send the message until an employee approves it.

This is also why tool descriptions and API schemas matter. A generic “run any query” or “execute arbitrary code” tool offers a much broader surface than a purpose-built lookup. Narrow tools are easier to authorize, test and log. Access should be reviewed against the task, not copied wholesale from another agent because the two systems share a model.

### Put approval at the point of consequence

Approval is most useful when it arrives before an action that is difficult to reverse or has material impact. Sending a message, changing a payment, deleting a record, provisioning expensive compute or publishing a release may warrant a confirmation step. A person should see what will happen, which data or account is affected, and what the agent relied on before they approve.

Do not use a generic confirmation dialog as a substitute for a useful review. If the agent can change the action after approval, the system should bind approval to the actual operation and relevant parameters. The workflow should also define what happens if the approver rejects, edits or does not respond.

Some low-impact actions can be automated once they are tested and bounded. The key is to make the boundary explicit: which operations are automatic, which require approval, and which are not available to the agent at all. OWASP’s control guidance and security categories can help teams frame these questions, but neither replaces a product-specific threat assessment. [@owasp-agent-control-standard-2026]

### Limit time, scope and blast radius

Permissions should not last longer or reach further than needed. Where the platform supports it, use short-lived credentials, scoped access, a limited set of records and explicit expiration. If a task only needs one account or project, avoid granting access to every organization or environment.

Set limits on the agent’s run as well as its data. A maximum number of tool calls, execution time, spending amount or retry count can prevent a loop from creating an unexpectedly large effect. Provide a stop mechanism and a safe fallback when an authorization check fails. A model’s decision that it has finished is not a substitute for system-enforced limits.

### Log enough to reconstruct the action

An audit record should identify the agent, human requester, tool, action, target, relevant parameters, approval and result. Logs can help answer whether the agent had permission, whether the tool performed the requested action and whether a person approved it. One platform’s documented controls, for example, describe roles, access policies, tool access and execution traces; those features illustrate a possible implementation, not a universal standard. [@langsmith-fleet-access-oversight]

Logging also creates privacy and security responsibilities. Avoid retaining secrets or full sensitive payloads when a safer structured record can answer the audit question. Limit who can review traces, define retention and protect logs from later modification. A trace that is too sparse cannot explain an incident; a trace that stores everything indefinitely creates a different risk.

### Test the denial paths

Before deployment, try to make the agent access an unrelated record, call an unapproved tool, exceed its budget, repeat an action and continue after a rejection. Test expired permissions and unavailable approval services. The expected result should be a denied action or a safe stop—not a silent retry with broader access.

Permissions are a system property: identity, tool design, authorization checks, approval, limits and logging need to agree. Prompts can tell a model not to do something, but the tool should still reject an unauthorized request. That separation makes oversight concrete and gives operators a way to intervene when the model behaves unexpectedly.

**Bottom line:** Give an agent a distinct identity, narrow access, enforced limits, approvals for consequential actions and an auditable route to stop it.

**Why it matters:** A tool-using model can affect real records; instructions alone do not enforce the boundary.

**Key takeaways:**
- Scope permissions to the task and separate reading from writing.
- Bind human approval to the actual consequential action.
- Test denials, expiration, retries and stop behavior—not only the successful path.

**What changes:** Teams can turn an abstract “human in the loop” promise into specific access rights and checkpoints.

**Evidence note:** OWASP materials are security project guidance, not regulation. The LangSmith source documents one platform’s controls and is not evidence that every agent platform works the same way.

## 27. PUE and WUE measure different data-centre constraints

**Slug:** `pue-wue-explainer`  
**Topic:** Data-centre energy and water  
**Proposed dek:** PUE compares facility energy with IT-equipment energy; WUE tracks water under a stated measurement category. Neither ratio alone tells you a data centre’s total environmental footprint.

### PUE is an energy ratio

Power Usage Effectiveness, or PUE, is a data-centre energy-efficiency indicator. In its basic form, it compares energy used by the whole facility with energy used by IT equipment. If a facility uses 100 units of energy in total and IT equipment uses 60, the simple ratio is 100 divided by 60, or about 1.67. The numerator includes supporting systems such as cooling and power delivery; the denominator is the IT load.

ISO/IEC 30134-2:2026 is the current second edition of the PUE standard. Its public description says it defines the KPI and provides measurement categories and reporting rules, including updated guidance for mixed-use buildings, unaccounted energy and on-site generation. That matters because the ratio is only interpretable when the facility boundary and measurement category are clear. [@iso-pue-2026]

The ratio is dimensionless because it divides energy by energy. A lower value means less facility energy relative to the IT-equipment energy under the stated method. It does not say how much energy the facility used in absolute terms.

### WUE tracks water against IT energy

Water Usage Effectiveness, or WUE, is a separate indicator. ISO/IEC 30134-9:2022 defines WUE as a KPI for quantifying data-centre water consumption during the use phase and describes measurement categories, calculation, reporting and interpretation. The standard’s categories matter: water sources and system boundaries can change what a reported value represents. [@iso-wue-2022]

The Green Grid’s historical method illustrates one common ratio: annual site water usage divided by IT-equipment energy. It also describes a source-based approach that includes water associated with producing the electricity used by the facility. Those measures answer different questions, so a report should identify whether it is describing on-site water or a wider source-based quantity. The 2011 paper is background, not a substitute for the current ISO standard. [@greengrid-wue-method-2011]

WUE therefore is not just “how much water did the data centre use?” It is a water measure normalized against IT energy within a chosen category and boundary. A reader needs the numerator, denominator, period and measurement method before comparing values.

### Ratios can hide scale

A better ratio does not necessarily mean lower total consumption. A large facility can have a lower PUE than a small one and still use more energy overall because its IT load is much larger. Likewise, a WUE figure normalized per unit of IT energy can fall while total water use rises if the facility serves substantially more compute.

The reverse is also possible: two sites can report similar ratios while using different cooling designs, operating under different climates or relying on different electricity mixes. PUE and WUE do not by themselves measure carbon emissions, water scarcity in the surrounding watershed, equipment manufacturing or the value of the computing work performed.

Consider a simple illustration. A facility using 100 MWh for IT and reporting a PUE of 1.5 would use 150 MWh under that simplified boundary. A second facility using 1,000 MWh for IT at a PUE of 1.3 would use 1,300 MWh. Its ratio is lower, but its absolute energy use is much higher. The same logic applies to water per unit of IT energy: a normalized value cannot replace the underlying total. These are arithmetic examples, not measurements of named facilities.

Mixed-use buildings make the boundary especially important. ISO’s current PUE page calls out guidance for mixed-use sites, unaccounted energy and on-site generation. If a facility shares power systems with offices or other uses, a reader needs the reporting category and allocation method to understand which energy entered the numerator. The same applies to water: ask whether the number covers only water on-site or includes a broader source-based category. [@iso-pue-2026] [@iso-wue-2022] [@greengrid-wue-method-2011]

### Compare like with like

When a provider publishes a PUE or WUE number, check:

- the reporting year or measurement period;
- whether the figure is a design target, annual result or momentary reading;
- the facility boundary and whether it is a mixed-use site;
- which PUE or WUE category and calculation method were used;
- whether the number represents a single facility or a portfolio;
- whether the provider reports absolute energy and water alongside the ratio.

These checks are not reasons to dismiss the metric. Standardized measures help operators track performance and can support comparisons when the methods are aligned. The mistake is to turn one ratio into a complete sustainability ranking without knowing how it was measured.

For a local impact assessment, add information beyond PUE and WUE: total electricity, total water, water source, seasonality, local water stress, cooling method and the IT load served. A data centre can improve its facility ratio while the region still faces a difficult water or power constraint. Conversely, a higher ratio may reflect a more water-efficient cooling choice or a different boundary, so the cause needs investigation.

**Bottom line:** PUE and WUE normalize different resources against IT energy; report their categories and absolute totals before comparing facilities.

**Why it matters:** A low ratio can look reassuring while concealing the scale, location or source of resource use.

**Key takeaways:**
- PUE compares total facility energy with IT-equipment energy.
- WUE concerns water consumption and must be read with its measurement category and boundary.
- Neither ratio alone measures absolute use, carbon emissions or local resource stress.

**What changes:** Data-centre disclosures should pair standardized ratios with their method, period, boundaries and absolute energy and water totals.

**Evidence note:** ISO catalogue pages establish the current PUE and WUE standards and scope. The Green Grid paper is a historical explanation of site- and source-based WUE, not the current standard.

## 28. Why an AI-detector score is not proof of authorship

**Slug:** `ai-detector-limitations`  
**Topic:** Education and verification  
**Proposed dek:** An AI-text detector estimates whether writing resembles patterns associated with generated text. A peer-reviewed study found serious false positives in one test set, showing why a score should not stand alone as evidence of who wrote something.

### A classifier produces a score, not a provenance record

An AI-text detector analyzes a passage and returns a classification or score. Depending on the tool, it may use statistical patterns, a learned classifier or another signal. The result is an estimate produced by that system, not a record of the text’s creation.

That distinction separates detection from provenance. A detector cannot show the document’s editing history or identify the person who wrote it. A signed content-credentials record can carry provenance information when the relevant system creates and preserves it, but that is a different mechanism from guessing authorship based on text. Neither approach should be described as solving every authenticity problem. [@c2pa-specifications-2026]

### One study shows how a confident-looking result can fail

A 2023 peer-reviewed study evaluated seven AI-text detectors on 91 TOEFL essays written by non-native English speakers and 88 essays by U.S. eighth-grade students. On the TOEFL set, the authors reported an average false-positive rate of 61.3 percent: more than half of those human-written essays were classified as AI-generated on average. All seven detectors unanimously flagged 19.8 percent, while at least one detector flagged 97.8 percent. [@liang-detector-bias-2023]

Those numbers should be read with the study’s scope attached. They describe the detector versions and the two essay sets the authors tested. They do not establish the false-positive rate for every language group, writing task, detector or current product. The result is not a universal performance estimate; it is evidence that detector errors can be uneven and consequential.

The study also helps explain why a threshold is not a neutral truth line. A tool may label more text as AI-written to catch more generated examples, but that can increase false accusations. A stricter threshold may reduce false positives while missing more generated passages. The person using the detector needs to know what the score means, how it was tested and which kinds of errors are likely.

### Separate suspicion from evidence

Even a detector that performs well on its published benchmark can behave differently on a new genre, language, length or writing style. A product’s own accuracy claim should be checked for the evaluation set, threshold, version and false-positive and false-negative rates—not only a single headline percentage.

If a detector flags a submission, that output can justify a closer review, not a conclusion that the person did not write it. Other evidence may include drafts, revision history, citations, a discussion of the work and the institution’s published process. Each source has its own limitations, but a fair decision should not treat a statistical classifier as the author or as an eyewitness.

The same caution applies in hiring, moderation and workplace investigations. A score that is difficult to explain can have consequences for a person who has no opportunity to inspect the test or challenge the result. Organizations should tell people when a detector is used, preserve a route to human review and avoid automatic penalties based on the score alone.

### Ask what was actually tested

Before relying on a detector, ask for the model version, supported languages, tested writing genres, sample size, threshold and error rates. Look for independent evaluations with human-written and generated examples that match the setting where the tool will be used. Test more than one class of writing and report the results separately.

If the vendor does not publish those details, record that the performance is not independently established for the intended use. Do not replace a missing evaluation with a score that appears precise. A decimal value can be exact as a software output and still be an unreliable estimate for a particular student, job applicant or author.

### Use the tool only as one limited signal

A responsible process treats detection as one imperfect signal among several. The people making a decision should be able to explain what other evidence they considered and how uncertainty was handled. They should also review whether the detector works differently across languages or writing backgrounds, and retire it if the harms outweigh its value.

The practical conclusion is straightforward: a detector can say that a passage resembles examples in its test set. It cannot prove a person’s authorship. Provenance records and writing-history evidence answer different questions, and any consequential decision requires a process that can account for error.

**Bottom line:** An AI-detector score is a fallible classification, not proof that a named person did or did not write a text.

**Why it matters:** False positives can affect grades, employment and reputation, especially when users cannot challenge an unexplained score.

**Key takeaways:**
- One peer-reviewed study found a 61.3% average false-positive rate on its TOEFL essay set; it does not estimate every current detector.
- Thresholds trade false positives against false negatives.
- Use a score as a prompt for review, never as the only evidence for a consequential accusation.

**What changes:** Institutions can publish detector limits, require human review and provide a clear way to contest results.

**Evidence note:** Liang et al.'s 2023 study evaluated seven detector versions on two essay sets. C2PA is cited only to distinguish provenance records from probabilistic text classification.

## 29. Open weights are not the same as open-source software

**Slug:** `open-weights-vs-open-source`  
**Topic:** Model licensing  
**Proposed dek:** Downloadable weights can make a model easier to run or adapt, but they do not automatically reveal the code and data information needed to modify the full system. Read the license and inspect what is actually available.

### Weights are one part of a model system

Model weights are learned parameters used by a model to turn inputs into outputs. When a provider makes weights available, developers may be able to download them and run the model in an environment they control, depending on hardware and license terms. That is meaningful access—but it is only one part of the system.

A model also depends on architecture, code, data processing, training choices, evaluation and software. A weights file does not automatically tell a user what data shaped the model, how that data was filtered, which code produced the parameters or what conditions apply to redistribution and commercial use. “Open weights” describes availability of parameters, not necessarily the availability of every component.

### The Open Source AI Definition asks for more

The Open Source Initiative’s version 1.0 definition applies four freedoms: use, study, modify and share. It says users need access to the preferred form for making modifications. For machine-learning systems, that preferred form includes data information, code and parameters; the definition treats weights as part of the parameters rather than the whole system. [@osi-open-source-ai-definition-1-0]

That does not mean every developer needs the same level of access for every project. It does mean the terms “open weights” and “open-source AI” answer different questions. A user may have a downloadable model and permission to use or adapt it while still lacking the training-data information or code described by the OSI definition.

### Read the license separately from the label

Provider pages illustrate the difference between a product label and a complete audit. Google describes Gemma 4 as open weights and lists Apache 2.0; its model card also identifies model sizes and supported capabilities. Mistral labels Small 4 as Apache 2.0 and an open-weights model. Those pages establish what the companies publish about access and licensing, not whether every part of each model’s development meets OSI’s definition. [@gemma4-model-card] [@mistral-small4-model-card]

Read the license itself. Check whether it covers the weights, code, datasets or only some of them; whether it permits modification and redistribution; and whether there are additional conditions in the model documentation. Do not assume that a license applying to weights also grants rights to the training data or other assets.

It is also possible for a model to have accessible weights without being suitable for a particular deployment. A team still needs to assess security, support, hardware requirements, privacy, data provenance and its ability to maintain the software. Conversely, access to more components does not guarantee that a system is accurate, safe or well documented.

### Avoid a binary shortcut

Instead of asking only “Is this model open?”, use a checklist:

- Can the intended users obtain the weights or other parameters?
- Which license applies to the weights, code and documentation?
- Is the training-data information detailed enough to understand provenance and composition?
- Is the training and inference code available in a usable form?
- Can the system be modified and shared under the stated terms?
- Which components remain unavailable or subject to separate conditions?

If the answer is unknown, write “not disclosed in the material reviewed.” Do not treat an open-weights label as evidence that the model meets every OSI requirement, and do not make a definitive legal classification from a marketing page alone.

It helps to keep three questions in separate columns: **access**, **rights** and **reproducibility**. Access asks whether a team can obtain the weights or code. Rights ask what the license permits the team to do. Reproducibility asks whether enough information and materials exist to study or recreate the system. A model can be downloadable and permissively licensed while still leaving training details unavailable. OSI’s definition makes this distinction explicit by requiring data information and code in addition to parameters. [@osi-open-source-ai-definition-1-0]

### Choose access for the work you need to do

An organization building a local product may care most about whether it can run the weights on its hardware and whether the license permits commercial use. A researcher studying training behavior may need data information and training code as well. A company distributing a modified model will need to understand redistribution conditions and support obligations.

Those are different deployment decisions. A precise description—“weights are downloadable under the named license; training data details are limited; the card links to the model code”—is more useful than a one-word label. It lets teams compare rights and evidence without implying that “open” means unrestricted, fully reproducible or risk-free.

**Bottom line:** Open weights means parameter access; open-source AI under OSI’s definition also depends on freedoms and access to the preferred form, including data information and code.

**Why it matters:** License scope and available materials determine whether a team can run, study, modify and redistribute a model.

**Key takeaways:**
- Weights are a component, not a full account of training data and software.
- Check the license for each component rather than relying on the model label.
- Do not classify a specific model against OSI’s definition without reviewing its full materials and terms.

**What changes:** Model comparisons can report weights, code, data information and license status as separate fields.

**Evidence note:** OSI supplies its own version 1.0 definition. Gemma and Mistral pages are first-party statements about those releases; no independent legal determination is made here.

## 30. How to choose a small model for a real workflow

**Slug:** `small-model-workflow-selection`  
**Topic:** Model selection  
**Proposed dek:** Choose the smallest model that meets your task’s quality and operating requirements—not the model with the smallest parameter count or the most attractive product label.

### Define the job before comparing models

Start by writing down what the model must do and what counts as a failure. A model that summarizes a short internal note has different requirements from one that extracts safety-critical details or decides which account action to take. Gather representative examples, including difficult and unusual cases, and decide how errors will be scored before looking at vendor rankings.

Separate quality requirements from operating requirements. Quality may include factual accuracy, correct tool use, format compliance, language coverage and how often the model should abstain. Operating requirements may include response time, throughput, privacy, deployment location, license, cost and the hardware the team can maintain. A small model is only a good fit if it satisfies the constraints that matter for the workflow.

### Do not let the label stand in for hardware fit

Model names and parameter counts can be misleading. Gemma 4 spans provider-listed sizes from E2B and E4B through 31B, including a 26B mixture-of-experts variant. Mistral Small 4 is labelled “Small” but lists 119 billion total parameters and 6.5 billion active parameters. The active count describes part of how the model computes; it is not the total amount of weight data that must be stored for local inference. [@gemma4-model-card] [@mistral-small4-model-card]

A model card can help identify size, context limit, license and distribution options, but it does not prove that the model will fit your device or meet your latency target. Test the exact quantization, runtime, context length, concurrency and hardware configuration you intend to use. Measure startup time, memory pressure and sustained throughput rather than assuming that a product description such as “laptop-ready” guarantees performance on a particular machine.

### Evaluate completed work, not just tokens

Run candidate models on the same held-out task set and compare the work that reaches an acceptable result. Include retries and human review in the cost. A model that is cheaper per token can cost more per successful task if it needs multiple attempts or creates more correction work.

Measure task success and error severity separately. A formatting error may be easy to fix; a missed legal clause or unauthorized tool call may not be. Track the cases where the model refuses, invents missing details, omits evidence or needs escalation. For a workflow used by different groups, include the languages, formats and input quality those users actually produce.

Research can help choose what to test, but it should not replace local measurement. The 2026 AgentFloor preprint reports that small and mid-sized open-weight models handled much of its short-horizon structured agent work, while longer-horizon planning remained difficult across its tested systems. That is evidence about one 30-task benchmark and model set, not proof that a small model will work for every customer-support, coding or business process. [@agentfloor-2026-preprint]

### Run a controlled trial

A useful trial has four stages:

1. **Screen:** remove candidates that fail the license, privacy, language, modality or hardware requirement.
2. **Benchmark:** compare the remaining models on the same representative test set and scoring rules.
3. **Pilot:** run the strongest candidate against real traffic in a limited, reversible setting, with human review where needed.
4. **Monitor:** track quality, latency, memory, cost per completed task and escalation rate as inputs and model versions change.

Keep prompts, model versions and software settings fixed during each comparison. When you change one, record it. Otherwise, a faster runtime or revised prompt can be mistaken for a better model.

### Keep a fallback that matches the failure

The best design may route different tasks to different models. A compact model can handle a predictable extraction or classification step; a larger model or human reviewer can take over when confidence is low, the request is unusual or the cost of error is high. The fallback should be tested, not assumed to be an improvement.

Define what triggers escalation and how the handoff preserves context. If a model cannot complete the task, it should fail visibly rather than return an unsupported answer. Also plan for model unavailability, resource exhaustion and a new release that changes behavior.

The right choice is therefore not the smallest model that can produce a plausible response once. It is the smallest model that repeatedly meets the required quality, privacy, speed and hardware limits on the work people actually need done—with a tested route for cases it cannot handle.

**Bottom line:** Compare models on representative completed tasks and the target deployment setup; parameter counts and “small” labels are not a substitute.

**Why it matters:** Local quality, device fit and correction cost can differ sharply from leaderboard or token-price claims.

**Key takeaways:**
- Define task success and failure severity before comparing candidates.
- Measure the exact model version, runtime, context and hardware you will deploy.
- Use independent benchmarks to form hypotheses, then validate with a held-out local set and a reversible pilot.

**What changes:** Model selection becomes a repeatable workflow test rather than a ranking by parameter count or brand.

**Evidence note:** Gemma and Mistral specifications are first-party; AgentFloor is a preprint limited to its task suite. No general small-model superiority claim is made.