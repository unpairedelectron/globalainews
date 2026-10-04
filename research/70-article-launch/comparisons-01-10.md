# Comparison drafts 51–60

**Status:** provisional research drafts. Nothing here is approved for publication or added to maintained newsroom records.
**Research date:** 4 October 2026.
**Citation convention:** Inline `[@key]` references resolve through `comparison-source-map.md`; keys are research-only.
**Byline:** unassigned; do not invent a named author or credentials.

## 51. GPT-6 Sol or Luna? Compare the published roles

**Slug:** `compare-gpt6-sol-luna`  
**Topic:** Product comparison  
**Proposed dek:** OpenAI positions Sol for harder work and Luna for lower-cost use, but its own published prices and evaluations do not establish which model fits a specific workflow.

### Compare the jobs the provider describes

OpenAI presents GPT-6 Sol and GPT-6 Luna as two points on its cost-and-capability range. The launch page describes Sol as suited to difficult work tasks, while Luna is positioned as a faster, lower-cost option for routine and high-volume work. These are the provider’s intended roles, not independently verified quality categories. The useful choice is therefore not “which is smarter?” based on the names, but “which should a team test first for this workload?” [@openai-gpt6-sol-luna-2026]

| Published dimension | GPT-6 Sol | GPT-6 Luna | What the comparison can establish |
|---|---|---|---|
| Provider-described role | Difficult work tasks; higher usage limits | Faster, less expensive routine and high-volume use | OpenAI’s positioning, not an independent task taxonomy |
| Listed input price | $2 per million tokens | $0.10 per million tokens | A 20-to-1 difference in the published input rates |
| Listed output price | $10 per million tokens | $0.50 per million tokens | A 20-to-1 difference in the published output rates |
| Provider evaluation evidence | AutomationBench scores and task-cost claims | Comparison with its predecessor and an AutomationBench score | First-party results with task, effort, and setup limits |
| Independent comparative test in this source set | None found | None found | No evidence here establishes a winner on a reader’s own tasks |

The prices are published per million tokens. They do not directly predict a workflow bill: output volume, prompt caching, reasoning effort, retries, tool use, and application-level orchestration can change total cost. A team should calculate its own cost per completed task using the same input data and success criteria rather than selecting by per-token price alone. [@openai-gpt6-sol-luna-2026]

### Keep vendor evaluations in their lane

OpenAI reports results on AutomationBench, a business-workflow evaluation, and compares models at specified reasoning-effort settings. Those numbers are useful as a description of what the company tested. They are not an independent comparison: the provider controls the model versions, runs, and reported analysis in the release page. Reuters corroborates the release and describes the commercial positioning, but its launch coverage is not a separate model benchmark. [@openai-gpt6-sol-luna-2026] [@reuters-gpt6-sol-luna-2026]

Even a same-benchmark comparison can mislead if effort settings, fallbacks, task coverage, or accounting differ. The release page itself notes that one comparison’s reported cost omits the price of a fallback model used on some tasks. That is a concrete reason to look for the cost boundary and fallback assumptions beside any score. A lower cost for a benchmark run does not prove lower cost for a production workflow with different tools, retries, or output lengths. [@openai-gpt6-sol-luna-2026]

There is also a small arithmetic issue worth preserving. The page describes the new prices as a 50% reduction from GPT-5.6 promotional prices. Its table shows Luna output moving from $1.20 to $0.50 per million tokens, which is a 58.3% reduction by direct calculation, not 50%. The page does not explain this difference. A report should quote the displayed prices and label the headline as OpenAI’s description rather than silently choosing one percentage. The Sol output values ($20 to $10) do equal 50%. [@openai-gpt6-sol-luna-2026]

### Choose a first test, then measure your own workload

Sol is the more natural first candidate when the task involves complex, multi-step work and a higher failure cost, if the budget supports testing it. Luna is a reasonable first candidate for repetitive or high-volume work where its published price difference may matter. Neither recommendation guarantees task quality; both should be evaluated against the same locally defined examples and acceptance rules.

A useful comparison run should:

1. Pin the model names and API revisions, prompts, tools, and application code.
2. Use a held-out task set that reflects the intended workflow, including failure and handoff cases.
3. Record reasoning-effort settings and any fallback model; do not combine results from unlike settings.
4. Report completion rate, factual or procedural errors, human review time, retries, and total cost per accepted task.
5. Repeat runs where outputs are stochastic and disclose the number of trials.
6. Keep latency and quality separate; a lower time or price does not show that a task was completed correctly.

The released pages do not provide a same-conditions independent test of Sol versus Luna on a shared user-defined task set. This comparison therefore stops at published role, list price, and evidence type. It does not infer that Sol is universally better for complex work, that Luna is universally fast enough, or that the vendor’s benchmark results transfer to every application.

**Bottom line:** Sol and Luna have sharply different listed token prices and provider-described roles, but workload performance must be tested locally.

**Why it matters:** A model choice based only on a product label or per-token price can increase review effort or total cost if the selected model needs more retries.

**Key takeaways:**
- Treat “difficult work” and “routine work” as provider positioning, not independent findings.
- The published per-token rates differ by 20 times for both input and output.
- OpenAI’s benchmark evidence is first-party; Reuters coverage confirms the launch, not model quality.
- Preserve the unexplained mismatch between the “50%” headline and the Luna output table values.
- Run a shared, representative task set and compare total accepted-task cost.

**What changes:** Recheck the release page, model identifiers, prices, and evaluation conditions before publication or procurement.

**Evidence note:** The comparison uses OpenAI’s release page and Reuters launch coverage. No independent Sol-versus-Luna benchmark was found in the captured sources.

**Related coverage:** Brief 4; Report 45; Report 50.

## 52. SWE-bench Verified versus Terminal-Bench: what coding-agent scores measure

**Slug:** `compare-coding-agent-benchmarks`  
**Topic:** Benchmark comparison  
**Proposed dek:** One benchmark asks an agent to fix a real repository issue; the other asks it to complete a broader command-line task. Their scores answer different questions.

### The benchmark name is not the task

“Coding-agent score” can refer to very different work. SWE-bench Verified is a human-validated subset of 500 software issues drawn from real GitHub repositories. Terminal-Bench 2.0 is a set of 89 containerized command-line tasks, each with a defined environment and verification tests. One centers on issue resolution in a codebase; the other deliberately spans longer, realistic terminal workflows. Their pass rates should not be placed in one leaderboard as if they measured the same capability. [@swebench-verified-methods] [@terminal-bench-2026-paper]

| Comparison point | SWE-bench Verified | Terminal-Bench 2.0 | Interpretation |
|---|---|---|---|
| Task unit | A human-validated repository issue | A command-line task with its own containerized environment | Issue repair is a narrower task family |
| Number of tasks in the source | 500 verified instances | 89 curated tasks | Task count is not a measure of benchmark difficulty |
| Expected work | Inspect a codebase and produce a change intended to resolve an issue | Perform an end-to-end terminal task, such as configuring or running software | “Coding” may include much more than writing a patch |
| Validation | Issue-specific tests and a harness determine whether the patch resolves the task | Task-specific tests inspect the final container state | Passing tests do not prove general correctness or user value |
| Main design emphasis | Human filtering for issue clarity, patch correctness, and solvability | Long-horizon terminal work in constructed environments | Distinct environments and graders make raw scores non-comparable |

SWE-bench Verified’s selection process addresses known dataset-quality concerns by having humans inspect whether issue descriptions are clear, whether tests are appropriate, and whether the task can be solved. That makes the 500-item set more curated than the original pool; it does not turn the set into a representative sample of all software engineering. Results still depend on the agent scaffold, model version, repository environment, time and token budgets, and exact evaluation harness. [@swebench-verified-methods]

Terminal-Bench 2.0’s task packaging makes a different tradeoff. The paper describes each task as an instruction, a container image, tests, and a human-written solution. Its curated environments support repeatable setup, but the authors also discuss residual non-determinism from hardware differences, external services, and infrastructure reliability. The benchmark authors emphasize manual verification because it is difficult to ensure a task is both solvable and resistant to shortcuts. [@terminal-bench-2026-paper]

### What a passing score does—and does not—mean

A pass means that a run met that benchmark’s grader under that benchmark’s conditions. On SWE-bench Verified, it is evidence about resolving selected repository issues with the chosen harness. On Terminal-Bench, it is evidence about completing selected terminal tasks in the specified environments. Neither score alone establishes that an agent is safe to run against production systems, handles every repository, understands user intent, or recovers reliably after tool failures.

The distinction matters for procurement. A team maintaining large software repositories may find the issue-repair task family more relevant, while a team that expects agents to install dependencies, configure services, or operate command-line tools may value terminal tasks. Even then, local acceptance testing is necessary: internal repositories, build systems, permissions, and recovery procedures may not resemble benchmark environments.

### A disciplined way to compare published results

Before comparing numbers, record:

1. Exact benchmark name and release, including dataset revision and task subset.
2. Model version and agent scaffold, not just the model family.
3. Tool permissions, network access, container limits, and allowed retries.
4. Token, wall-clock, and monetary budgets.
5. Grader version, hidden-test policy, and any human intervention.
6. Whether the score uses one attempt or repeated trials.

Do not calculate a “winner” from a score in one paper and a score in another unless the benchmark, harness, and conditions match. A paper may also use a version of SWE-bench or Terminal-Bench with a different agent scaffold or task subset. Cite the method and evaluation date with the score, and treat version changes as possible breaks in comparability. [@swebench-verified-methods] [@terminal-bench-2026-paper]

### Use both as evidence, not as certification

The benchmarks are complementary examples of coding-agent work rather than competitors for one universal title. A high score on the first does not imply high performance on the second, and a low score may reflect model limits, agent orchestration, tooling, or environment fit. For a deployment decision, select tasks that represent the actual job, then add safety, authorization, review, and recovery criteria that these benchmark scores do not provide.

**Bottom line:** SWE-bench Verified and Terminal-Bench test different task families, environments, and graders; report their scores separately.

**Why it matters:** Treating benchmark results as interchangeable can lead a team to select an agent for work the benchmark never tested.

**Key takeaways:**
- SWE-bench Verified covers 500 human-validated GitHub issue instances.
- Terminal-Bench 2.0 covers 89 curated command-line tasks in containerized environments.
- Their graders and task families differ, so raw scores should not be pooled.
- Both remain bounded tests and do not certify safe production use.
- Pin the benchmark, agent, harness, budgets, and grader before interpreting a result.

**What changes:** Maintain a task-specific benchmark sheet and re-run the relevant suite after a model, scaffold, or environment change.

**Evidence note:** The article compares benchmark design from the maintainers’ site and Terminal-Bench’s 2026 paper; it does not rank model results.

**Related coverage:** Analysis 15; Report 43.

## 53. Hosted Gemini 3.8 Flash or open-weight Gemma 4 and Mistral Small 4?

**Slug:** `compare-hosted-open-weight-deployment`  
**Topic:** Deployment-choice comparison  
**Proposed dek:** Compare the serving arrangement, terms, and operator workload—not the model names as if they were a controlled quality test.

### Compare access models before capability claims

Gemini 3.8 Flash is presented through a provider-operated API and downstream services. Gemma 4 and Mistral Small 4 are described as open-weight models that can be run through compatible software, subject to each model’s terms and implementation requirements. These choices give a team different operating responsibilities; they do not form a like-for-like quality test. [@gemini38-flash-card] [@gemma4-model-card-2026] [@mistral-small4-card-2026]

| Decision area | Hosted Gemini 3.8 Flash | Open-weight Gemma 4 | Open-weight Mistral Small 4 |
|---|---|---|---|
| Basic access | Provider API and supported downstream services | Downloadable weights and supported runtimes | Open weights; the captured model card labels the license Apache 2.0 |
| License/terms | Service terms apply; API tier affects data handling | Model card states Apache 2.0; check the exact artifact and license | Model page states Apache 2.0; check any separate service terms if using a hosted endpoint |
| Hardware responsibility | Provider runs the model for the API caller | Operator chooses supported device and runtime | Operator must plan for the full 119B parameter set if self-hosting; 6.5B active is not a memory estimate |
| Published context | Card lists up to 1M tokens | Sizes and context limits vary by variant | Card lists 256K tokens |
| What this table cannot compare | Output quality, actual latency, or total workflow cost | Same | Same |

The Gemini 3.8 Flash card says the model accepts text, images, audio, and video, lists a context window up to one million tokens, and points users to API and cloud terms. It does not specify a user-managed hardware footprint. Gemma 4’s card describes open weights and model sizes; Google’s documentation lists different precision and quantization options. Mistral’s card gives total and active parameter counts and a 256K context, but the parameter label does not tell an operator which runtime, quantization, or device will work best. [@gemini38-flash-card] [@gemma4-model-card-2026] [@gemma4-overview-2026] [@mistral-small4-card-2026]

### “Open weights” shifts work; it does not remove it

With an open-weight deployment, the team can select the runtime, quantization, hardware, network boundary, update process, and logging. That flexibility comes with responsibility for installation, patching, performance monitoring, backup, capacity, access control, and incident response. An open license is permission to use or adapt under stated terms; it does not promise a model is accurate, safe for a specific task, or inexpensive to operate.

Mistral Small 4 is an instructive naming example. Its model card lists 119 billion total parameters and 6.5 billion active parameters. The active count describes conditional computation, not the complete weight storage needed by every runtime. Teams should size from the exact artifact, quantization, and runtime rather than infer hardware fit from the word “Small” or the active-parameter count. [@mistral-small4-card-2026]

### A hosted API also has multiple terms layers

The Gemini API Additional Terms effective 23 March 2026 distinguish unpaid from paid services. For unpaid services, Google may use prompts and responses to provide, improve, and develop products and may involve human review; its terms advise against submitting sensitive or confidential content. For paid services, the terms say prompts and responses are not used to improve products, while limited logging may occur for safety, security, or legal reasons. This comparison is specific to those Gemini API service terms and should not be generalized to other Google products, other providers, or every deployment route. [@gemini-api-terms-2026]

Before procurement, compare the exact service tier, endpoint, license, model revision, region, logging, support, and data-processing terms. A model can be open-weight but still be consumed through a hosted API with its own data contract. Conversely, a hosted model offered through a cloud platform may inherit that platform’s security and billing controls without giving the customer control of model weights.

### A practical selection sequence

1. Define the task set and quality threshold; do not use release-page benchmarks as a substitute.
2. Decide whether the team needs weight access, offline operation, or a provider-managed API.
3. Check license and service terms separately.
4. Estimate hardware from total weight size, context, runtime overhead, and concurrency.
5. Include engineering, power, patching, support, and failure-recovery costs.
6. Test a hosted endpoint and a self-hosted candidate with the same held-out tasks if both are plausible.
7. Document which prompts, files, logs, and tool calls cross the boundary in each design.

**Bottom line:** Gemini’s hosted API and the Gemma/Mistral open-weight routes differ in control and operating work; these records do not establish a model-quality winner.

**Why it matters:** A team can choose a model that meets a license or deployment need yet still miss hardware, data-handling, or maintenance requirements.

**Key takeaways:**
- Compare access and responsibilities separately from model capability.
- Read the exact license and service terms for the chosen artifact and endpoint.
- Total parameters, context, and runtime requirements matter more than product labels.
- Unpaid and paid Gemini API terms differ; do not generalize one tier’s handling to every service.
- Use a shared task set for quality and cost comparisons.

**What changes:** Recheck model artifacts, license language, API terms, supported contexts, and runtimes before selecting a deployment route.

**Evidence note:** The comparison uses provider model cards and API terms. It publishes no cross-model quality or performance ranking.

**Related coverage:** Explainer 29–30; Report 48.

## 54. Local, private-cloud, or hosted API for sensitive workflows?

**Slug:** `compare-local-hosted-private-workflows`  
**Topic:** Privacy-architecture comparison  
**Proposed dek:** “Local” and “hosted” are not privacy guarantees; map where prompts, files, logs, tools, and backups actually go.

### Pick a data boundary, not a label

A private workflow may contain personal, customer, commercial, legal, or internal material. Three common architectures move that material differently: inference on a device or organization-managed server; a model endpoint hosted in a private cloud environment; or a provider-operated API. The right choice depends on data flow, access controls, service terms, operational capacity, and the model quality needed for the task. A local model is not automatically private if the application sends prompts or telemetry elsewhere, and a hosted API is not automatically unsuitable if its terms and controls meet the organization’s requirements. [@nist-genai-profile] [@gemini-api-terms-2026]

| Architecture | Who operates inference? | Questions to verify | Common tradeoff |
|---|---|---|---|
| Local / organization-run | User or organization | Is the model and all supporting code local? Are logs, updates, retrieval, and tools also local? | More control, but hardware and operations are the team’s responsibility |
| Private-cloud deployment | Cloud or platform provider under an organization’s configuration | What region, tenant boundary, access roles, encryption, logs, backups, and subprocessors apply? | More scalable operations, but contractual and platform boundaries still matter |
| Provider API | Model provider or platform | Which service tier applies? What are retention, human review, training, logging, region, and deletion terms? | Less infrastructure work, but the prompt leaves the organization’s runtime |

### What the terms can and cannot answer

Google’s Gemini API Additional Terms illustrate why “hosted” is too broad a category. The current terms distinguish unpaid and paid API service. They say unpaid inputs and outputs may be used to improve products and may be reviewed by humans; paid service prompts and responses are not used for that purpose, although limited logging for safety, security, or legal needs may occur. This is a useful concrete example, not a universal statement about every Gemini service or every provider. [@gemini-api-terms-2026]

The NIST Generative AI Profile offers a risk-management structure rather than a data-processing contract. Its functions encourage organizations to govern, map, measure, and manage risks, including those involving third-party resources. It does not tell a team what a particular endpoint retains or whether its terms satisfy a particular legal obligation. Those answers require the current service terms, product configuration, and the organization’s own legal and security review. [@nist-genai-profile]

### Map the complete workflow

For each architecture, draw the full path for a representative task:

1. User prompt and uploaded files.
2. Retrieval system, browser, or document store.
3. Model endpoint and any fallback model.
4. Tool calls to email, code, CRM, or other systems.
5. Application logs, observability, and human-review systems.
6. Backups, support exports, crash reports, and deletion requests.

Then identify the controller and retention rule at each step. A local model may be paired with a remote search tool, cloud-hosted vector database, or telemetry service. A private-cloud deployment can still involve managed services and external support. A provider API may offer documented retention controls but still require approval for the data category. The diagram should describe actual network routes and configuration, not just the hosting label. [@nist-genai-profile]

### Decide with a risk-weighted matrix

If a workflow cannot tolerate the prompt leaving a controlled device or network, a local or organization-run architecture may be the starting point—but only after verifying the whole application’s outbound behavior. If the organization needs centralized access controls, managed infrastructure, and a contracted data boundary, a private-cloud deployment may fit, provided configuration and terms are reviewed. If a provider API offers a suitable data-processing agreement, retention policy, region, and access controls, it may reduce operations work; the team must still test those conditions.

Quality, latency, and price are separate questions. A smaller local model may require more human review or fail tasks that a hosted model handles; a hosted endpoint may have network delays or rate limits. This comparison does not measure those outcomes. Report 48 gives a hardware-planning method; this article focuses on the data boundary and governance decision.

Before approval, record the data classes allowed, the endpoint and service tier, model version, geographic route, logging defaults, retention and deletion behavior, human review, connected tools, and incident contact. Recheck these fields after a provider changes its terms or the organization changes a model, application, or endpoint.

**Bottom line:** Choose an inference route only after tracing every data path and matching the actual terms and controls to the workflow’s risk.

**Why it matters:** Sensitive data can leave through a retrieval, logging, or tool integration even when the model itself runs locally.

**Key takeaways:**
- “Local,” “private cloud,” and “hosted API” describe deployment shapes, not complete privacy outcomes.
- Map prompts, files, retrieval, tools, logs, backups, and telemetry.
- Read terms for the exact product, tier, endpoint, and region.
- NIST AI 600-1 supports risk management but does not replace a contract or legal review.
- Keep model quality, privacy, latency, and cost as separate comparison axes.

**What changes:** Maintain a data-flow diagram and approved endpoint register for every sensitive AI workflow.

**Evidence note:** The article uses NIST AI 600-1 and Gemini API terms as bounded examples; it does not audit a provider’s implementation or certify a deployment.

**Related coverage:** Explainer 29–30; Report 48.

## 55. Task success, pass^k, or action traces? Choosing agent evaluation measures

**Slug:** `compare-agent-evaluation-metrics`  
**Topic:** Evaluation-metric comparison  
**Proposed dek:** A one-run score, a repeated-run reliability measure, and a tool-action trace answer different questions about an agent.

### Three measures, three questions

Agent evaluations often compress a complex run into a percentage. Before comparing results, identify what the percentage counts. A task-success score asks how often a run met its acceptance condition. The pass^k metric asks how often all k repeated trials of a task succeed. A trajectory or action trace records what the agent did along the way—tools, arguments, approvals, and recovery steps. No one measure covers all three concerns. [@agent-evaluation-survey-2025] [@tau-bench-2024]

| Evidence | Question answered | Example use | Blind spot |
|---|---|---|---|
| One-run task success (pass@1) | Did this attempt meet the grader? | Capability snapshot on a defined task set | A single success may hide inconsistency |
| Repeated-run pass^k | Did every one of k trials for a task succeed? | Reliability-sensitive workflows | Depends on trial design, independence, and task mix |
| Action trace / trajectory review | What tools, decisions, and recoveries led to the result? | Safety, policy compliance, and debugging | Requires a rubric; a longer trace is not automatically better |

τ-bench defines pass^k as the probability that all k independent trials for a task succeed, averaged across tasks. It uses tool-agent-user interactions in domains such as retail and airline service, where a final database state and required response content can be checked against an annotated outcome. This makes repeated success useful for studying consistency under that benchmark’s simulated environment. It does not establish reliability in an enterprise system with different tools, users, or policies. [@tau-bench-2024]

### Why one-run success is not reliability

If a system succeeds on a task in one run, pass@1 records that attempt as a success. It does not say whether the next run will follow the same path. In a simplified illustration—not an observed benchmark result—an agent with an 80% independent per-run success probability would have a 32.8% probability of succeeding on all five runs (0.8⁵). That gap shows why repeated success is a stricter requirement for workflows where every attempt must be correct.

The independence assumption is important. Real runs may share prompts, model versions, tools, outages, or systematic errors, so results are not necessarily independent draws. An evaluator should publish k, the number of trials per task, how tasks were selected, and whether failures share a likely cause. Report the per-task or distributional information when possible rather than presenting one average without a denominator. [@tau-bench-2024]

### What traces add

A successful final state can conceal an unsafe or expensive path. The agent may have tried a prohibited tool, exposed data, made a duplicate write, or relied on an unrecorded human correction. A trace review asks whether the sequence was authorized and recoverable, not only whether the output passed. The evaluation survey separates objectives such as task completion, reliability, capability, and safety from the processes and metrics used to measure them. This supports treating outcome and process evidence as related but distinct. [@agent-evaluation-survey-2025]

Traces also have limits. There is no universal “trajectory quality” score. A rubric must define which actions are required or forbidden, how tool arguments are assessed, what counts as a justified retry, and whether a human handoff is a failure or the correct safe outcome. Collect only the information needed for evaluation and protect traces that contain sensitive prompts or data.

Terminal-Bench 2.0 illustrates a benchmark built around outcome verification: each task has a containerized environment and tests that inspect final state. Its authors also discuss residual non-determinism and the work needed to manually validate tasks. An outcome grader is useful for checking task completion, but it should be paired with a trace review when deployment decisions depend on permissions, cost, or recovery. [@terminal-bench-2026-paper]

### Use a metric set that matches the risk

For a reversible drafting task, a one-run completion rate plus reviewer quality score may be adequate for an initial comparison. For a workflow that sends customer messages or changes records, repeated-run success, unauthorized-action attempts, duplicate-write checks, and audit-trace review matter more. For a long-horizon agent, record interruptions, handoffs, retries, partial completion, and recovery cost as well as final success.

Do not compare pass@1 from one benchmark to pass^k from another, or turn a trace rubric into a model ranking unless the task, agent, and grader are controlled. Choose the metric before the run, state the denominator and threshold, and report the environment and number of trials.

**Bottom line:** One-run success measures a result, pass^k measures repeated consistency, and action traces expose the path; use more than one when risk requires it.

**Why it matters:** An agent can occasionally succeed while remaining inconsistent or taking an unsafe route.

**Key takeaways:**
- Define what “success” means and state the denominator.
- Use repeated runs when consistency matters.
- Review traces for authorization, tool behavior, retries, and recovery.
- Treat pass^k’s independence assumption and task mix as part of the result.
- No metric or benchmark alone certifies a production agent.

**What changes:** Report one-run outcome, repeated-run reliability, and process evidence as separate fields in evaluation records.

**Evidence note:** The comparison draws on a 2025 evaluation survey, τ-bench’s pass^k definition, and Terminal-Bench’s outcome-verification design; it does not test a deployed agent.

**Related coverage:** Analysis 15; Report 43–44.

## 56. Read-only, approval-gated, or unrestricted agent tools?

**Slug:** `compare-agent-tool-permission-modes`  
**Topic:** Security comparison  
**Proposed dek:** Match an agent’s authority to the consequences of its actions; “human approval” only helps when the approval is bound to the right person and operation.

### Compare authority profiles, not vendor labels

An agent tool can inspect information, make a change after approval, or execute changes automatically. These are useful authority profiles for an operator to compare, but they are not standardized across products. “Read-only” should mean the connected service cannot be changed by the agent, not simply that a prompt told the model not to write. Approval-gated access means a request pauses for an authorized decision before the side effect. Unrestricted access means the tool can act without that per-action gate, subject to its configured permissions. [@owasp-agentic-top10-2025] [@anthropic-claude-code-permissions] [@openai-agents-hitl-doc]

| Authority profile | Suitable starting point | Main failure consequence | Minimum evidence to test |
|---|---|---|---|
| Read-only | Search, summarize, or draft from source systems | Confidential information can still be exposed or misrepresented | Confirm no write method or side-effecting endpoint is reachable |
| Approval-gated | Send, publish, purchase, delete, or modify records | A weak or misbound approval can authorize the wrong action | Verify approver identity, exact tool and arguments, rejection path, expiry, and audit record |
| Unrestricted / automatic | Low-impact, reversible, high-volume actions with narrow scope | Prompt injection, tool misuse, or credential abuse can cause direct changes | Bound permissions, targets, volume, idempotency, monitoring, and rollback |

OWASP’s agentic-application risk list includes tool misuse and identity or privilege abuse. Those risks apply even when the final answer appears reasonable: an agent may use a tool against a broader target, pass an unsafe argument, or act with a service identity that has more authority than the user. A permission mode should therefore be selected from the effect of the tool call, not from a model’s self-reported confidence. [@owasp-agentic-top10-2025]

### Read-only reduces side effects, not every risk

A read-only design can be a good first stage for research, triage, or internal search, especially when the data is sensitive or the agent is new. It reduces the chance that an agent will change a record or send a message. It does not prevent the agent from disclosing retrieved data in its response, logging sensitive content, or passing it to another enabled tool. Teams must still limit which records can be read and decide where prompts and traces are stored.

“Read-only” also needs to be checked at the integration layer. A tool that is labelled as search might trigger a remote query, download a document, or write a cache. Review the underlying API methods and permissions. Test the agent with a prompt that asks it to modify or expose data, then inspect server-side authorization and logs rather than relying on the natural-language refusal.

### Approval gates need a security contract

An approval button is not a control unless the application authenticates the reviewer and binds the choice to a specific request. OpenAI’s Agents SDK documentation describes an interruption and resume flow for approval-required tool calls; it also leaves authentication and authorization of the approver to the application. The product feature therefore does not by itself prove that a company’s approval process is secure. [@openai-agents-hitl-doc]

Before enabling writes, verify that the approval view contains the action, target, and arguments; that a rejection cannot be mistaken for approval; that stale requests expire; and that the execution resumes with the same approved arguments. Record who decided and what actually executed. If the underlying state changes between review and execution, require a fresh approval or revalidate the action.

Approval gates introduce latency and reviewer workload. They are appropriate where human judgment is valuable, not as a universal wrapper around every tool. If every low-risk action asks for confirmation, users may approve reflexively. If a destructive operation bypasses review, the gate is too narrow. Define thresholds by reversibility, impact, financial exposure, data sensitivity, and external visibility.

### Automatic action requires smaller boundaries

Unrestricted action can be justified for a narrow, well-tested, reversible task. It should not mean that the agent receives broad credentials or can choose arbitrary destinations. Restrict the service identity, tool set, query scope, and operation volume. Use idempotency or duplicate-action checks for writes, and provide a stop and rollback route where possible.

Anthropic’s Claude Code documentation provides a product-specific example of allow, ask, and deny rules, with deny evaluated ahead of ask and allow. This demonstrates that different tools can have explicit policy precedence, but it does not establish that all agent frameworks implement the same rules or that those settings are correctly configured in a customer deployment. [@anthropic-claude-code-permissions]

### A decision sequence

1. List the tools and their possible side effects.
2. Classify each action by impact, reversibility, data sensitivity, and external audience.
3. Start with read-only access where it can meet the task.
4. Add approval for specific high-impact actions, and verify the approver’s identity and decision binding.
5. Allow automatic writes only when scope is narrow and failure is detectable and recoverable.
6. Test denied, malformed, duplicate, stale, and interrupted actions in the actual environment.

The three profiles can coexist in one workflow: read-only discovery, approval-gated execution, and a narrow automatic post-action check. A single “autonomy level” for the whole agent can obscure which tool can actually change what.

**Bottom line:** Use the least authority that can complete the task, and validate each side-effecting tool at the integration boundary.

**Why it matters:** An agent’s permissions determine what a mistaken or manipulated action can do, regardless of the quality of its final response.

**Key takeaways:**
- Read-only access still carries confidentiality and data-flow risks.
- Approval must be authenticated and tied to the exact operation.
- Unrestricted actions need narrow scope, monitoring, and recovery.
- Product permission examples are not proof of a secure deployment.
- Different tools in one agent can use different authority profiles.

**What changes:** Maintain a tool-by-tool permission table with owner, allowed targets, approval thresholds, and tested failure behavior.

**Evidence note:** The comparison uses OWASP guidance and product documentation; it does not audit any live platform configuration.

**Related coverage:** Analysis 16; Report 44.

## 57. EU AI Act versus NIST GenAI Profile: binding duties or risk guidance?

**Slug:** `compare-eu-ai-act-nist-genai-profile`  
**Topic:** Governance-framework comparison  
**Proposed dek:** The EU AI Act creates legal obligations for actors within scope; NIST AI 600-1 organizes voluntary risk-management work. One does not substitute for the other.

### Two frameworks with different force

The EU AI Act and NIST’s Generative AI Profile both address AI risks, but they are not equivalent instruments. The AI Act is enacted European Union legislation with staged application dates and duties that depend on system classification, role, and applicable provision. NIST AI 600-1 is a cross-sectoral profile of the U.S. AI Risk Management Framework for generative AI. It offers organizations a way to structure governance, mapping, measurement, and management; it is not an EU regulation or a substitute for legal compliance. [@eu-aiact-article-113] [@eu-gpai-obligations] [@nist-genai-profile]

| Question | EU AI Act | NIST AI 600-1 |
|---|---|---|
| Status | Enacted law, with staged dates | Voluntary risk-management profile |
| Primary purpose | Establish legal duties, prohibitions, and controls within scope | Help organizations identify and manage generative-AI risks |
| How to determine applicability | Check the system, provider/deployer role, use, market, classification, and specific provisions | Use the framework to decide what risks and controls fit the organization and use case |
| Structure | Provisions and obligations in the regulation, including duties for certain provider categories | Govern, Map, Measure, and Manage functions applied to generative AI |
| Enforcement or accountability | Legal enforcement under the regulation and relevant national/EU authorities | Organizational adoption and risk-management practice; no NIST enforcement mechanism in the profile |
| What it cannot do alone | Does not answer every implementation question without the applicable facts and guidance | Does not establish legal compliance or replace contracts and regulation |

### Dates must be tied to the exact provision

The AI Act’s schedule is staged. Article 113 sets application dates for different chapters and provisions; the Commission’s GPAI guidance separately says provider obligations applied from 2 August 2025, Commission enforcement powers begin 2 August 2026, and pre-existing GPAI models placed on the market before 2 August 2025 have until 2 August 2027 to comply. Certain high-risk systems under Annex I have a later transition to 2 August 2028. These dates answer different questions and should not be compressed into one general “AI Act start date.” [@eu-aiact-article-113] [@eu-gpai-guidelines] [@eu-gpai-obligations]

NIST AI 600-1 was approved in July 2024. It organizes risk-management actions through the AI RMF functions Govern, Map, Measure, and Manage and includes generative-AI considerations. It does not create a compliance deadline, a classification rule, or a regulator’s enforcement power. An organization may use it alongside the AI Act, but it still needs to map legal duties to its actual system and role. [@nist-genai-profile]

### Translate each into an operational plan

For an EU-facing product, first determine the AI Act’s scope and the organization’s role. Then identify system-specific obligations, applicable dates, evidence required, and who owns the control. Commission guidance can help interpret provider responsibilities, but enacted text governs the law. When the organization is also using the NIST Profile, it can use Govern to assign accountability, Map to define use and context, Measure to evaluate risks, and Manage to prioritize response. NIST is a complement for managing risk, not a legal interpretation service.

For a U.S. team that is not subject to the EU Act, NIST AI 600-1 can still help create a documented process for generative-AI risk. Its usefulness does not turn it into mandatory law. Other contracts, sector rules, state law, or organizational policies may still apply; the profile itself cannot determine all of them.

### Avoid false equivalence

A checklist match between NIST actions and an AI Act requirement does not show that one framework satisfies the other. A risk-management action might support evidence collection while a legal duty requires a specific process, documentation, or notice. Conversely, legal compliance does not guarantee that an organization has strong operational controls for every context. Keep a crosswalk with a separate column for the legal source, NIST action, owner, implementation evidence, and any unresolved legal question.

This comparison is informational, not legal advice. Teams should verify the current consolidated regulation, official guidance, and national implementation before making a compliance decision. The proposal for the EU KIDS Act is not included as a current legal obligation; Report 46 covers its proposal status separately. [@eu-aiact-article-113] [@eu-gpai-guidelines]

**Bottom line:** The AI Act defines binding duties for in-scope actors, while NIST AI 600-1 is a voluntary way to organize generative-AI risk work.

**Why it matters:** Treating guidance as law—or treating a risk checklist as proof of compliance—can leave both legal and operational gaps.

**Key takeaways:**
- Check AI Act scope and dates provision by provision.
- Keep Commission guidance distinct from enacted law.
- NIST’s Govern, Map, Measure, and Manage functions are a risk-management structure, not legal duties.
- A NIST crosswalk can support documentation but does not establish compliance.
- Seek qualified legal review for an organization-specific determination.

**What changes:** Maintain a dated legal applicability matrix and a separate NIST risk-control crosswalk.

**Evidence note:** The comparison uses consolidated EU law, Commission GPAI guidance, and NIST AI 600-1; it does not provide legal advice.

**Related coverage:** Brief 3; Report 46.

## 58. IndiaAI shared compute or commercial cloud access?

**Slug:** `compare-indiaai-commercial-cloud-access`  
**Topic:** Compute-access comparison  
**Proposed dek:** IndiaAI uses an eligibility and project-approval route that may include subsidy; a commercial cloud account is more self-directed but still depends on quotas and capacity.

### Compare the access path, not unlike GPU prices

The IndiaAI Compute Portal and a commercial cloud service can both provide GPU-backed infrastructure, but their access models differ. IndiaAI’s portal is designed for approved user categories and reviewed project requests. An Amazon EC2 On-Demand instance is procured through an AWS account and billed while it runs. Neither route guarantees that a requested accelerator is available at a particular time, and the public records do not define a like-for-like price comparison across the two systems. [@indiaai-compute-portal-guidance-2026] [@aws-ondemand-access]

| Dimension | IndiaAI shared compute portal | Commercial cloud On-Demand example |
|---|---|---|
| Who can apply | Categories listed in the portal, with supporting eligibility documents | Account holder with service permissions and applicable quotas |
| Access step | Register, verify eligibility, submit a compute request, and wait for approval where required | Select an instance and launch it, subject to quota, regional service, and capacity |
| Approval | Portal says requests under 5,000 GPU-hours are auto-approved; requests above that go to PMEC review | No project-level committee in the described purchase flow; quotas and service availability still apply |
| Timing | Portal request window and approval validity apply; listed approvals are valid for 30 calendar days | Billed from the instance’s running state, with a 60-second minimum |
| Subsidy | Approved projects may receive subsidy and still bear costs beyond it | Standard commercial billing; this comparison does not estimate a subsidy-equivalent price |
| Availability evidence | Portal approval is not proof of a particular GPU is schedulable now | On-Demand purchase terms do not guarantee a specific GPU’s capacity |

The IndiaAI portal lists application evidence and approval steps, including a project description, requested GPU hours, and estimated bill of materials. Requests are submitted from the first to the twenty-fifth of the month according to the captured policy. It states that requests below 5,000 GPU-hours are auto-approved and larger requests are reviewed by the PMEC. Approval is valid for 30 calendar days, and the approved user must begin using services within that period. These are portal rules, not a live allocation guarantee. [@indiaai-compute-portal-guidance-2026]

The portal also says IndiaAI subsidizes approved projects, while users pay additional costs beyond the subsidy to the service provider according to its billing cycle. The exact available service, GPU type, subsidy, and bill depend on the application and provider. A dated allocation register can show previously visible entries, but it is not a real-time queue or a census of available capacity. [@indiaai-compute-portal-guidance-2026] [@indiaai-allocation-register-2026]

Amazon EC2’s On-Demand documentation describes per-second billing with a 60-second minimum while an instance is running and no long-term commitment. It also documents instance quotas that may need adjustment. The page does not guarantee that a particular accelerator is available in the selected region. A user still has to choose a region, instance family, image, storage, networking, and any required account permissions. [@aws-ondemand-access]

### Which route fits which constraint?

IndiaAI may be a better starting point for an eligible academic, startup, research, or public-sector user who can prepare a project request and values the possibility of subsidy. The route involves eligibility verification, a review schedule, and an approval window. Teams should budget time for those steps and confirm which actual service provider and accelerator the approval covers.

Commercial cloud may suit a team that needs direct self-service or an existing cloud account with established billing and access controls. It shifts more responsibility to the user to choose instances, quotas, region, software, and spend limits. Availability is still subject to cloud capacity, and the bill depends on selected hardware and runtime.

Do not compare an IndiaAI portal rate to an AWS GPU-hour rate unless the accelerator model, memory, region, storage, networking, support, term, and subsidies match. A discounted allocation is not a commercial on-demand offer, and an on-demand instance is not the same thing as a reviewed research allocation. This article makes no claim that either route is cheaper or faster.

### Before submitting or launching

For IndiaAI, confirm the eligibility category, required documents, request window, GPU-hour estimate, subsidy terms, provider, approval validity, and start date. For a cloud instance, confirm service quotas, region, instance availability, projected running time, storage charges, and shutdown rules. In either route, keep a record of the actual device and usage period; approval or account access alone does not prove that a workload ran.

**Bottom line:** IndiaAI is an application-and-approval path that may subsidize approved compute; commercial On-Demand is self-service billing subject to quota and capacity.

**Why it matters:** Comparing the routes as if they offered the same GPU, term, and availability can create a false price or access conclusion.

**Key takeaways:**
- IndiaAI eligibility and review criteria are part of the access cost.
- Portal approval and a historical allocation row do not establish live availability.
- EC2 On-Demand bills while an instance runs, but does not guarantee GPU capacity.
- Subsidized portal rates and commercial cloud prices are not like-for-like without matching hardware and terms.
- Verify the current rules and service capacity before committing a project schedule.

**What changes:** Keep dated portal criteria and a cloud-region quota check beside any access or cost comparison.

**Evidence note:** The comparison uses captured IndiaAI portal rules, dated allocation records, and AWS On-Demand documentation. It does not compare GPU performance or prices.

**Related coverage:** Brief 1; Analysis 11 and 13; Explainer 21; Report 41.

## 59. Grok 4.7 through xAI API or Amazon Bedrock?

**Slug:** `compare-grok47-api-distribution`  
**Topic:** Same-model distribution comparison  
**Proposed dek:** Both routes expose Grok 4.7, but endpoint, regional routing, billing, and integration controls differ; the names alone do not establish identical serving behavior.

### Compare the route around the model

xAI offers Grok 4.7 directly through its API. Amazon Bedrock lists the model as `xai.grok-4.7` and offers it through Bedrock runtime endpoints and inference profiles. Both documentation sets describe a 500,000-token context window, but that shared specification does not prove that every feature, release revision, decoding behavior, or downstream integration is identical. Pin the model ID and test the actual endpoint. [@xai-grok47-api-docs] [@aws-grok47-bedrock-2026]

| Deployment dimension | xAI direct API | Amazon Bedrock |
|---|---|---|
| Model ID | `grok-4.7` | `xai.grok-4.7`; inference profiles include `us.xai.grok-4.7` and `global.xai.grok-4.7` |
| Published context | 500K tokens | 500K tokens |
| Input and tools | Text and image input; text output; reasoning-effort settings | Image input, tool calling, and four reasoning-effort levels are described in the Bedrock integration |
| Regional option | US regional endpoint; xAI documents a 10% premium for this route | US geographic or Global cross-Region profile; Global can route across supported commercial AWS Regions |
| Billing path | xAI API token pricing and xAI account | Bedrock pricing, account, identity, service quotas, and selected inference profile |
| Integration | xAI API interface and model-specific response fields | Bedrock Responses, Chat Completions, and Converse options, plus AWS integration features |

The direct xAI documentation lists different token rates below and above a 200,000-token prompt threshold, including separate input, cached-input, and output rates. It also states that the US regional endpoint costs 10% more than the standard route. The Bedrock launch material points users to AWS pricing and describes service tiers and inference profiles. These are not enough to calculate a fair cost winner without matching prompt length, cache behavior, service tier, region, tool use, and any cross-region route. [@xai-grok47-api-docs] [@aws-grok47-bedrock-2026]

### Regional routing is a decision, not a guarantee from the model name

xAI documents a US regional endpoint for direct API use. Bedrock describes two cross-Region inference profiles: a Global profile that can route requests to supported commercial AWS Regions and a US geographic profile intended to keep processing within the US geography. A customer with residency requirements should verify the exact profile, permitted regions, current service scope, and applicable contract rather than infer location from the model name or API hostname. [@xai-grok47-api-docs] [@aws-grok47-bedrock-2026]

The two routes also carry different identity and operations work. Direct API access uses xAI’s account and API interface. Bedrock invokes the model through AWS identity permissions and runtime endpoints; its integration documentation describes the required model and inference-profile resources. Teams already operating in AWS may value policy and service integration, while a team using xAI’s API directly may prefer its direct model interface. This is an operational distinction, not a claim that one route is more secure by default.

### Do not equate integration features with model quality

Bedrock’s documented features include tool calling, reasoning-effort options, and AWS Guardrails or invocation logging capabilities. The xAI API publishes its own response semantics and reasoning fields. A service may add different logging, guardrails, authentication, or routing without changing the base model’s advertised name. Conversely, integration compatibility does not prove that the providers expose identical defaults or behavior.

The direct xAI documentation says Grok 4.7’s Responses API returns encrypted reasoning content even if the caller does not request it in `include`. That is an API-handling detail developers should test before persisting or processing responses. Bedrock’s logging and guardrail behavior also depends on configuration. Do not assume that a platform feature is enabled simply because its documentation describes it. [@xai-grok47-api-docs] [@aws-grok47-bedrock-2026]

This comparison does not establish a quality, latency, or privacy winner. The pages are provider documentation, not an independent same-endpoint evaluation or a review of the two services’ complete contractual data terms. Before moving production traffic, inspect current data processing, retention, support access, logging defaults, regional routing, and pricing.

### Run an endpoint-specific acceptance test

For the same prompt set, record model ID, date, API version, region/profile, context length, output tokens, reasoning setting, tools, cache state, and retry policy. Measure task success, structured-output validity, latency, and cost separately. Test a long-context request, an image input, a tool call, an interrupted request, and a malformed or denied action. Confirm the logging configuration and inspect the actual request path.

Recheck the live pages before publishing. The captured xAI docs list future API changes with later effective dates; this report uses only the documentation available on 4 October 2026. Do not project later changes backward into the captured release state.

**Bottom line:** xAI API and Bedrock expose the same named model through different endpoints and regional controls; compare current service settings, not just model labels.

**Why it matters:** A platform choice changes routing, identity, billing, and observability even when the model name is the same.

**Key takeaways:**
- Both docs list 500K context, but shared context does not prove full behavior parity.
- xAI’s direct API offers a US regional endpoint; Bedrock offers US and Global profiles.
- Billing and pricing depend on different tiers, regions, caching, and request shape.
- AWS integration features depend on configuration; do not assume logging or guardrails are active.
- Test the exact endpoint and model ID before moving sensitive or production workloads.

**What changes:** Keep an endpoint register with model ID, profile, region, price source, logging state, and evaluation date.

**Evidence note:** The comparison uses xAI and AWS provider documentation. It does not independently test quality, latency, privacy, or feature parity.

**Related coverage:** Brief 7; Report 50.

## 60. C2PA credentials, watermarks, and image detectors: what each establishes

**Slug:** `compare-provenance-controls`  
**Topic:** Image-authenticity control comparison  
**Proposed dek:** A signed provenance record, an embedded watermark, and a classifier answer different questions; no single result should be presented as proof that an image is true.

### Three control types, three signals

For image verification, C2PA credentials, invisible watermarks, and AI-image detectors are often discussed together, but they inspect different evidence. A C2PA manifest carries signed claims about an asset and its provenance. A watermark embeds a signal into the image for a compatible detector to identify. A classifier estimates whether image patterns resemble generated or manipulated content. They can be complementary, but none is a universal authenticity test. [@c2pa-spec-24] [@iclr-image-detectors-2024]

| Control | Signal examined | Useful question | Main limitation |
|---|---|---|---|
| C2PA credential | A manifest and its binding to the asset, signature, and signer status | Is there an inspectable provenance claim, and what does the verifier report? | Does not prove the claim is factually true; validators and trust checks require care |
| Invisible watermark | A detector-readable signal embedded in image content | Does the image carry a particular embedded marker? | Transformations and attacks can affect detectability; a watermark is not a complete edit history |
| AI-image classifier | Learned image features or statistical traces | Does this image resemble the detector’s generated-image examples? | Output is a classification under a model and threshold, not a signed source record |

C2PA is not simply another watermark. The 2.4 specification discusses invisible watermarks as a possible means of identifying an asset or locating a manifest, while the broader credential carries a manifest and signed assertions. A publisher can therefore use a watermark as a discovery or binding aid alongside a provenance record. The two mechanisms serve different jobs rather than competing as one binary option. [@c2pa-spec-24]

### Robustness is an empirical question

An ICLR 2024 study tested AI-image detection methods, including watermarking and classifier-based detectors, under perturbations and attacks. It reports a tradeoff between false acceptance and false rejection for watermark detectors under a diffusion-purification attack, and evaluates other attacks against classifier-based methods. These findings are bounded to the methods and experimental conditions in that paper; they do not establish that every current watermark or detector fails in the same way. [@iclr-image-detectors-2024]

The comparison also cannot be treated as a single head-to-head scorecard. A watermarking experiment asks whether a signal can be detected after a transformation; a classifier evaluation asks whether an image is categorized correctly against a dataset; a provenance verifier checks a manifest and signer according to its implementation and trust policy. Different tasks, datasets, thresholds, and threat models mean their published error rates cannot be placed in one shared table without a common test corpus.

C2PA’s own standard should also be paired with implementation testing. A 2026 independent security analysis reports issues involving timestamp alteration, revoked or compromised certificates, and validator disagreement in specifications 2.2–2.4 and real-world implementations. The authors’ findings are a reason to check verifier behavior and trust policies; they are not evidence that every C2PA-signed asset is compromised. [@c2pa-independent-security-study-2026]

### Choose controls by the question

For a newsroom that needs to preserve who created an image and which edits were recorded, a C2PA workflow provides a place to inspect signed provenance claims. The publisher should show valid, trusted, untrusted, invalid, and absent states accurately. A missing credential should be shown as “no credential found,” not “fake.” A valid signature should not be translated into “the event happened as described.” [@c2pa-deployment-guidance-2026]

For an image generator or distribution platform that wants to mark its own output, a watermark may help downstream systems detect that mark. The operator needs to test whether ordinary compression, resizing, cropping, screenshots, and adversarial changes affect the detector. A successful watermark check is evidence about that signal, not proof of the complete production history.

For triage of images with no provenance record, a classifier can provide an additional clue, especially when paired with context and human review. It should not make a high-impact editorial or moderation decision on its own without calibrated thresholds, validation against relevant image sources, and a correction path.

### A layered verification workflow

1. Preserve the original file and record where it came from.
2. Check for a C2PA credential and inspect the verifier’s exact status and signer.
3. If relevant, query the expected watermark detector and record its version and threshold.
4. Treat classifier output as probabilistic evidence and compare it with a representative validation set.
5. Confirm the image’s surrounding context, date, location, and other independent evidence.
6. Record transformations performed after capture and rerun checks on the published derivative.
7. Keep the control results separate instead of compressing them into a single authenticity badge.

**Bottom line:** Provenance, watermark detection, and image classification are different controls; use them together only with clear explanations of what each result supports.

**Why it matters:** A detector score or green credential badge can create false certainty when readers interpret it as proof of truth.

**Key takeaways:**
- C2PA checks a signed provenance claim; it does not establish factual truth.
- Watermarks identify embedded signals and may be affected by transformations.
- Classifiers infer from image patterns and need task-specific thresholds.
- The ICLR 2024 results apply to its tested methods and attacks, not every 2026 system.
- No common cross-method benchmark in this source set supports a universal winner.

**What changes:** Record the method, verifier or detector version, threshold, transformation history, and what the result actually means.

**Evidence note:** The comparison uses C2PA 2.4, deployment guidance, one independent security analysis, and one ICLR 2024 robustness study; it is not a head-to-head product test.

**Related coverage:** Explainer 28; Report 49; existing watermarking story.