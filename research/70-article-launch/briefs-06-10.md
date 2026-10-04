# Brief drafts 6–10

**Status:** source-checked editorial drafts; not part of maintained public content and not approved for publication.
**Research date:** 4 October 2026.
**Citation convention:** Inline `[@key]` references map through `brief-source-map.md`; they are not live newsroom source IDs.

## 6. Grok 4.7 expands beyond xAI’s own products

**Slug:** `grok-47-platform-availability`  
**Topic:** Models  
**Proposed dek:** xAI announced Grok 4.7 on 21 September; AWS’s captured page lists it as available on Bedrock but does not date that listing. Neither record independently establishes the model’s benchmark performance.

### Release and distribution are two separate developments

xAI announced Grok 4.7 on 21 September 2026, describing it as its strongest model to date for coding and knowledge work. The company says the model is served at the same price and speed as Grok 4.6 and presents improvements across coding, engineering and office tasks. Those are xAI’s claims, drawn from the company’s own release page and model card. [@xai-grok47-release] [@xai-grok47-model-card]

Amazon Web Services’ captured Bedrock page says Grok 4.7 is available through the service, but no publication date is visible in the captured page. It confirms the hosting route, not how soon after xAI’s announcement AWS access began or how the model performs independently. [@aws-grok47-bedrock-2026]

For developers, the practical news is that the model can be accessed through more than one route. xAI’s materials list its API and coding-oriented products, while the captured AWS page documents a managed Bedrock pathway. Independent reports also covered the release and pricing, but the performance data in those articles largely trace back to xAI’s benchmarks and product statements. [@xai-grok47-release] [@aws-grok47-bedrock-2026] [@decrypt-grok47-2026]

### Context length is a specification, not a result

xAI’s documentation lists a 500,000-token context window and text-and-image inputs with text output for the API version. That describes the published interface, but it does not mean every task can use the full context effectively or that the model reliably retrieves details from every position in a long prompt. A maximum context size is a capacity limit; retrieval quality and task success require separate evaluation. [@xai-grok47-api-docs]

The same distinction applies to pricing. A lower or unchanged price per token can still produce a higher cost per completed task if the model uses more tokens, takes additional steps, or needs retries. Decrypt’s launch coverage reported xAI’s same-price-and-speed positioning and placed it alongside reported benchmark comparisons. The useful purchasing unit is therefore not only the token rate but the total cost to complete the team’s target workflow at an acceptable quality level. [@decrypt-grok47-2026]

The xAI model card groups evaluations across coding, knowledge work, engineering and safety-related tests. Some are internal; others rely on external tools or partners. The card can tell readers which tasks xAI chose and what the company reports. It does not turn those results into a controlled comparison against every competitor. Differences in task versions, prompting, reasoning effort, tool access and scoring can change an apparent ranking. [@xai-grok47-model-card]

### A hosting channel does not settle deployment fit

Availability through Bedrock may matter to organizations that already use AWS infrastructure, identity controls, billing and model access policies. It can reduce the friction of testing a new provider inside an existing cloud environment. But availability does not automatically answer a buyer’s questions about data handling, region support, throughput limits, service-level commitments or the configuration available to a specific account. Those details need to be checked in current AWS and xAI documentation before deployment. [@aws-grok47-bedrock-2026]

The same is true for cybersecurity features. xAI says selected cybersecurity partners have invite-only access to red-team capabilities. That indicates a restricted access pathway, not a public security evaluation or a general guarantee about how the model will behave in every setting. Organizations should distinguish a model’s stated safeguards from the controls they need around tools, credentials and approval. [@xai-grok47-model-card]

A buyer can split the decision into model fit and access-route fit. For model fit, test the same tasks and constraints; for route fit, record the exact endpoint and model identifier, region and account access, token billing, request limits, data terms and monitoring available. This is a due-diligence checklist, not a claim that the two routes differ in every area. Keep results from the xAI API and Bedrock separate unless the prompts, tools and response settings are aligned. Recheck both sets of documentation before rollout because the release record and the hosting record answer different questions.

A route comparison can also log request IDs, timeouts, returned errors and billing records alongside answer quality. If results diverge, repeat the same input while holding prompts and settings steady before attributing the difference to the model. This helps separate an access-layer issue from a model capability claim; it is a test procedure, not evidence that either route currently behaves differently.

### What the announcement establishes

The dated record is clear for xAI: it announced Grok 4.7 on 21 September. AWS’s captured page says the model is available through Bedrock, but does not display a publication date, so it does not establish when AWS availability began. The model card and release page document xAI’s specifications and evaluation claims. Independent launch coverage confirms the product announcement and examines its pricing context, but does not independently validate the company’s performance numbers. [@xai-grok47-release] [@aws-grok47-bedrock-2026] [@decrypt-grok47-2026]

Teams comparing Grok 4.7 with another model should run the same tasks, constraints and tools against both. They should track quality, latency, tokens consumed, retries, cost per successful result and policy failures. A new cloud endpoint makes that test easier to run for some customers. It is not the result of the test.

**Evidence note:** xAI is the primary source for release, specification and benchmark claims. AWS is the primary source for Bedrock availability; no publication date is visible in the captured page. Independent news coverage is useful for release context, not independent validation of performance.

## 7. Anthropic releases Sonnet 5.5 with a new system card

**Slug:** `claude-sonnet-55-system-card`  
**Topic:** Models  
**Proposed dek:** Anthropic’s 28 September release pairs a new Claude model with a system card covering its evaluation scope. The card is evidence about what the company tested, not proof that the model is safer or faster in every setting.

### A release with a published evaluation record

Anthropic released Claude Sonnet 5.5 on 28 September 2026, the second model in its Sonnet 5.5 family. Reuters reported the launch, while Anthropic published a system card describing its evaluation process and results. Reuters reported the price at $2 per million input tokens and $10 per million output tokens, unchanged from Sonnet 5, and attributed the performance positioning to the company. [@reuters-sonnet55-2026] [@anthropic-sonnet55-system-card]

Anthropic told Reuters that Sonnet 5.5 needs fewer tokens to complete the same work and described it as a faster, lower-cost complement to Opus 5.5. Those are company claims, not a Reuters benchmark. The unchanged per-token tariff means the claimed savings depend on the workload and token use; it is not a simple price-list reduction. Buyers should measure cost per successful outcome in their own tasks. [@reuters-sonnet55-2026]

This distinction is useful for buyers. A model can finish a task with fewer generated tokens or complete it faster, lowering the cost per outcome even when the price per token stays the same. But that result depends on the task, evaluation setup and comparison model. A team should measure the cost of its own successful workflow instead of applying a percentage claim to every use case.

### What a system card contributes

A system card gives readers more than a launch headline by recording intended uses, evaluation categories, observed behavior and known limitations. The Sonnet 5.5 card is a first-party evaluation document. It lets readers inspect Anthropic’s reported results and test design, but its presence does not make the evaluation independent or guarantee that the same behavior appears in every deployment. [@anthropic-sonnet55-system-card]

The card’s results need to be read alongside the conditions under which tests were run. Model behavior can depend on whether it is accessed through an API or a consumer interface, what system instructions are active, which tools are enabled and what level of reasoning effort is used. If a card reports separate surfaces, the difference itself is part of the evidence rather than a detail to flatten into one score.

An evaluation result also has a boundary. It can show that a model passed, failed or behaved in a particular way on a defined task. It cannot prove that no failure will occur in an untested workflow. This is especially important for coding or agentic uses, where the model can take many actions and where the cost of an error depends on the permissions granted around it.

### “Faster” is not the same as “better”

Speed can improve user experience, reduce waiting or allow more work within a fixed budget. It does not establish accuracy, robustness or safe tool use. Similarly, a lower token count is not necessarily a better answer if it omits required work, and a higher evaluation score on one benchmark does not predict performance on a team’s own repository, documents or applications.

The release should therefore be treated as a testable product claim. Buyers can compare Sonnet 5.5 with their current model on a fixed task set, while holding prompts, tools, input documents and output requirements constant. They should record completion rate, correctness, time, tokens, human repair and policy violations. That gives a local estimate of value without presenting one company’s evaluation as a universal ranking.

### What changed on 28 September

The confirmed development is that Anthropic released a new Sonnet model and published a system card on the same date. Reuters reported the announcement; Anthropic’s own document supplies the evaluation record. The company’s speed and cost descriptions remain company-attributed rather than independent measurements. [@reuters-sonnet55-2026] [@anthropic-sonnet55-system-card]

The next useful evidence will come from repeatable independent tests and from deployment reports that disclose the workload, settings and cost per successful outcome. Until then, the card should be read as a structured disclosure by the model developer. It improves the public record, but it does not remove the need for buyers to validate the model in the environment where they plan to use it.

The card can also be read as a versioned measurement record. For each evaluation, retain the objective, task or benchmark version, interface, tools, comparator, metric and stated caveat. Keep speed and token-use claims separate from accuracy and safety results; they answer different questions. If a later release changes the task, surface or scoring method, show it as a different measurement rather than calculating a trend from the headline numbers. A missing detail is an evidence gap, not proof of poor performance. This crosswalk helps buyers determine whether two published results are actually comparable before they use them to justify a switch. [@anthropic-sonnet55-system-card]

A buyer’s notes should also label which findings are reported by Anthropic and which were reproduced locally. Keeping those records separate prevents a company-reported card result from being mistaken for evidence that the customer’s own configuration passed the same test.

**Evidence note:** Release, pricing and speed claims are attributed to Anthropic. The system card is a first-party evaluation document; the independent reports establish the launch, not a separate benchmark result.

## 8. OpenAI releases GPT-6.1 Sol for production workflows

**Slug:** `openai-gpt61-sol-release`  
**Topic:** Models  
**Proposed dek:** GPT-6.1 Sol arrived on 29 September with a $2/$10 per-million-token API price and staged product availability. OpenAI says it brings stronger results at lower cost, but its benchmark comparisons remain company-reported.

### A lower-cost tier joins the Sol family

OpenAI announced GPT-6.1 Sol on 29 September 2026. The company describes it as a more capable Sol model across coding, professional work, computer use and scientific tasks. It lists API pricing of $2 per million input tokens, $0.10 per million cached input tokens and $10 per million output tokens. OpenAI’s page compares the model with GPT-6 Sol, GPT-6 Astra and other systems, but those comparisons are based on the company’s own reported tests. The Hindu independently dates Sam Altman’s DevDay announcement to 29 September. [@openai-gpt61-sol-release] [@hindu-gpt61-sol-2026]

The product arrived only a week after OpenAI announced GPT-6 Sol and Luna. That sequence suggests a rapidly changing model family, but it does not mean the names map to a simple ladder that stays fixed over time. Each launch page is a dated snapshot. Buyers should check current API documentation and product availability rather than assume that an earlier price or model role is still current. [@openai-gpt61-sol-release] [@openai-gpt6-sol-luna-2026]

The Hindu reported the DevDay announcement and described CEO Sam Altman’s positioning of GPT-6.1 Sol as approaching GPT-6 Astra’s intelligence at a fraction of its price. The article attributes that comparison to Altman, while reporting the API price from OpenAI documentation. The distinction is essential: the release and price are verifiable product facts; “near-Astra” is the company’s performance positioning. [@hindu-gpt61-sol-2026]

### The benchmarks are useful, but not a neutral leaderboard

OpenAI reports GPT-6.1 Sol results across professional-work, coding, computer-use, factuality and scientific-research evaluations. It gives task names, reasoning settings and comparisons with selected models. These results provide a view into what OpenAI chose to measure and how it frames the model’s performance. They are not a cross-vendor test run by a neutral lab under one shared protocol. [@openai-gpt61-sol-release]

The company’s own release page contains the details that matter for interpretation. It labels some results by reasoning effort, notes cost per task, and points to benchmark versions. Those details mean a score should not be copied into a headline without its task, setting and denominator. A comparison at one reasoning level can differ from a comparison at another, while cost per task can depend on how many tokens and tool calls the model used.

The published price also does not answer the operating-cost question. A team may pay less per million tokens but spend more overall if a task requires longer prompts, multiple retries or additional verification. Conversely, a higher-priced model could be cheaper per successful outcome if it completes the work in fewer steps. The meaningful unit for a production decision is cost and quality per completed task.

### Availability is part of the release

OpenAI says GPT-6.1 Sol is available through the API and in ChatGPT Work and Codex for Plus, Pro, Business, Enterprise and Edu customers. Its release page says the model was not yet available in ChatGPT at launch. The company’s rollout information is an important boundary: users should not assume that an API release means every consumer product surface has the model. [@openai-gpt61-sol-release]

The Hindu’s account of the DevDay announcement provides an independent report of the launch event, while Microsoft’s Foundry post records availability through that platform. The additional distribution route can matter to organizations that already use Azure AI Foundry, but it does not change the evidence status of OpenAI’s performance claims. A cloud listing is a deployment record, not an external model evaluation. [@hindu-gpt61-sol-2026] [@microsoft-foundry-gpt61-sol-2026]

For a pilot, keep results from the API, Foundry, ChatGPT Work and Codex as separate records. Save the date, model identifier, product surface, account tier, prompt and tool configuration, plus the task outcome and its cost. The release itself notes that system prompts and available tools can differ between research or API evaluations and ChatGPT. A model name alone is therefore not enough to reproduce a result across interfaces. If an endpoint or rollout changes, rerun the baseline at the surface intended for production instead of treating a new score as a direct continuation of the old one. [@openai-gpt61-sol-release]

Record access failures separately from task failures. An account that has not received a staged rollout cannot reproduce a model evaluation; an endpoint error after access is available is a different operational outcome. Neither should be silently folded into the model’s benchmark score. [@openai-gpt61-sol-release]

### A useful release, not a buying verdict

GPT-6.1 Sol gives developers a new API option and gives OpenAI another model position between its lower-cost and flagship offerings. The release also publishes a substantial benchmark record. What it does not provide is a universal guarantee that the model will outperform alternatives on a particular company’s work.

Organizations considering it should reproduce the tasks they care about, keep the tools and prompts stable, and measure correctness, latency, cost, retries and human review. They should also verify current access terms and whether their chosen interface exposes the same model version. OpenAI’s headline comparisons can guide what to test; they should not replace the test. [@openai-gpt61-sol-release] [@hindu-gpt61-sol-2026]

**Evidence note:** OpenAI is the primary source for API price, availability and benchmark results. The Hindu independently reports the launch; Microsoft confirms Foundry availability. Performance comparisons remain OpenAI-reported.

## 9. The Commission’s AI Act enforcement date is not a single start date

**Slug:** `eu-ai-act-enforcement-dates-2026`  
**Topic:** Policy  
**Proposed dek:** The Commission said new enforcement powers and transparency rules apply from 2 August 2026. Other GPAI obligations began earlier, while some existing models and systems have transition periods.

### One date, several legal clocks

On 31 July 2026, the European Commission announced that it would begin enforcing AI Act rules and new transparency requirements from 2 August. The date matters, but it is not the start date for every obligation in the Act. The regulation uses staged application dates, and the distinction between an obligation applying and an authority gaining enforcement powers can matter to both providers and deployers. [@ec-ai-act-enforcement-press] [@eu-ai-act-article113]

For general-purpose AI models, the Commission’s guidance says provider obligations entered into application on 2 August 2025. The same guidance says the Commission’s enforcement powers apply from 2 August 2026. It also gives providers of models placed on the market before 2 August 2025 until 2 August 2027 to comply. These are three separate dates attached to different questions: when duties apply, when the Commission’s enforcement powers begin, and when certain existing models must complete the transition. [@eu-ai-act-gpai-guidelines]

Article 113 of the regulation sets 2 August 2026 as the general application date, while listing earlier and later exceptions. The European AI Act Service Desk says transparency duties become enforceable on that date but gives a transition until 2 December 2026 for certain systems placed on the market before 2 August. A provider cannot infer its deadline from the headline date alone; it must identify the relevant chapter, article, model or system, and transition rule. [@eu-ai-act-article113] [@eu-ai-act-service-desk-faq]

### What the 2 August milestone covers

The Commission’s July notice describes rules for general-purpose AI and new transparency requirements. The transparency provisions concern disclosure that a user is interacting with AI and the marking or identification of certain AI-generated or manipulated content. The notice is a useful summary of the policy milestone, but the enacted text and official implementation guidance control the exact scope and any exceptions. [@ec-ai-act-enforcement-press]

For GPAI model providers, the enforcement date is especially easy to misstate. Saying “GPAI obligations start on 2 August 2026” would erase the earlier application date described in Commission guidance. Saying “nothing happens until 2027” would also be wrong, because the Commission says its enforcement powers start in 2026 and the legacy-model transition applies to a defined group. A correct summary has to keep those clocks separate. [@eu-ai-act-gpai-guidelines]

The system-level transparency rules have their own boundaries. The official FAQ says some providers of AI systems placed on the market before 2 August 2026 have until 2 December to meet marking and detection obligations. It also identifies later application dates for certain high-risk AI systems. Those transitions mean that a compliance checklist should map product launch dates and system categories, rather than assume a single deadline applies to every product. [@eu-ai-act-service-desk-faq]

### The actors are not interchangeable

The AI Act assigns obligations to different roles. A GPAI model provider is not automatically the same actor as a downstream provider integrating a model into a product, or the deployer using that product in an organization. Transparency duties for a user-facing system may land on a different organization from model-level documentation duties. The legal text and guidance should be checked against the company’s role and the specific product. [@eu-ai-act-article113] [@eu-ai-act-gpai-guidelines]

This is why a broad announcement can be important without answering every operational question. The Commission’s notice flags a change in enforcement and transparency. It does not replace the detailed analysis a provider needs for its model or system. Teams should document which obligations apply, the date relevant to each, whether a transition applies, and what evidence shows they have complied.

An obligation register should use one row per model or system, not one date for the whole company. For each row, record the organization’s role, the product category, the relevant launch or market date, the cited article or guidance, the application or enforcement date, any transition and the evidence owner. A company that provides a model and also deploys a system using it may need to assess those roles separately; do not copy a model-level date onto every downstream product by default. Flag uncertain classifications for legal review and date-stamp the source version so later guidance does not silently replace the basis for an earlier decision. This makes tracking auditable, but it is not legal advice. [@eu-ai-act-article113] [@eu-ai-act-gpai-guidelines]

### A date map is safer than a countdown

The most useful way to report the milestone is as a short timeline: GPAI provider obligations entered application on 2 August 2025; Commission enforcement powers apply from 2 August 2026; general application and certain transparency duties also reach that date; some pre-existing GPAI models have until 2 August 2027; and certain existing systems have a shorter transparency transition ending 2 December 2026. [@eu-ai-act-gpai-guidelines] [@eu-ai-act-article113] [@eu-ai-act-service-desk-faq]

Those dates are not legal advice, and the timeline does not cover every AI Act provision. It is a guard against the most common reporting error: turning “the Commission begins enforcement” into “all obligations begin now.” Providers should consult the regulation and current official guidance for their own model, system and role. [@ec-ai-act-enforcement-press]

**Evidence note:** Dates come from the Commission’s enforcement notice, official GPAI guidance and the AI Act Service Desk. Article 113 establishes staged application; do not summarize the whole Act as having one start date.

## 10. GPT-5.5 cyber-range reports give three different counts

**Slug:** `aisi-gpt55-cyber-evaluation`  
**Topic:** Safety  
**Proposed dek:** AISI reported two successful attempts in April and three in a May update; OpenAI’s earlier system card reports one. The sources do not explain the different counts.

### A bounded test, not a forecast

The UK AI Security Institute published a detailed GPT-5.5 cyber evaluation on 30 April 2026. AISI reports that the model performed strongly on 95 capture-the-flag tasks spanning four difficulty tiers. The evaluation also used cyber ranges: simulated network environments designed to test whether a model can carry out a sequence of actions toward a defined objective. [@aisi-gpt55-cyber-evaluation-2026]

The same range appears with different counts in the published record. AISI’s 30 April post says GPT-5.5 completed “The Last Ones,” a 32-step simulated corporate-network attack, in two of ten attempts, using a 100-million-token budget per attempt. OpenAI’s 23 April system-card section reports one successful attempt out of ten on the same named range and says 3/10 was the highest result then recorded; it does not identify which model achieved that earlier high. AISI’s footnote explains that its 2/10 result followed a grading issue in AISI’s own setup: after manual review and adjudication, AISI assessed that GPT-5.5 would have completed the final step and updated its result. That accounts for the April difference from OpenAI’s 1/10; it is not an unexplained cross-source conflict. AISI also says GPT-5.5 did not solve “Cooling Tower,” a separate seven-step exercise, and that no model had done so at publication. These are outcomes on defined tests, not a general success rate for real-world cyberattacks. [@aisi-gpt55-cyber-evaluation-2026] [@openai-gpt55-system-card-aisi]

AISI’s 13 May update later says GPT-5.5 completed “The Last Ones” in three of ten attempts. It notes that AISI had obtained a newer Mythos Preview checkpoint, but does not say whether GPT-5.5’s checkpoint or test conditions changed, or explain the increase from AISI’s April 2/10. Ars Technica also reports 3/10 and links its account to AISI’s evaluation; that is secondary coverage, not a separate test run. The 1/10-to-2/10 difference has a documented AISI grading correction; the later 2/10-to-3/10 change remains unexplained in the reviewed records. [@aisi-gpt55-cyber-progress-may-2026] [@ars-aisi-gpt55-2026]

### What a cyber range tests

A cyber range gives an evaluator a controlled environment in which to observe a model’s actions over multiple steps. That is different from a single question about a security concept. It can test whether the system discovers information, chooses tools, handles intermediate results and completes a chain of actions. A task’s result depends on the environment, permissions, initial access and allowed tools, so the setup is part of the finding.

AISI’s report describes the ranges as controlled simulations. In “The Last Ones,” the model began with access to a vulnerable target and attempted a specified sequence of actions. The report says the ranges did not include active defenders or defensive tooling. That boundary matters: the result does not tell readers how GPT-5.5 would perform against a well-defended organization with monitoring, patching and incident response. [@aisi-gpt55-cyber-evaluation-2026]

The 95 capture-the-flag tasks provide another kind of signal. They cover specific challenges such as reverse engineering, web exploitation and cryptography. Strong performance can indicate that a model is capable of solving those benchmark tasks. It does not, by itself, establish autonomous end-to-end capability in a live environment or predict the likelihood of a successful intrusion. [@aisi-gpt55-cyber-evaluation-2026] [@ars-aisi-gpt55-2026]

### Counts matter as much as the headline

“Solved a cyber range” sounds binary, but attempt counts show variation. The dated record is OpenAI’s 1/10 report on 23 April, AISI’s revised 2/10 report on 30 April, and AISI’s 3/10 report on 13 May. AISI says its April figure followed manual review and correction of a grading issue; its May update does not explain the increase from 2/10 to 3/10. OpenAI’s separate statement that 3/10 was the highest result then recorded does not identify that result as GPT-5.5. Keep each result attached to its source and date rather than combining them into one settled figure. [@openai-gpt55-system-card-aisi] [@aisi-gpt55-cyber-evaluation-2026] [@aisi-gpt55-cyber-progress-may-2026]

Likewise, failing “Cooling Tower” does not establish that the model lacks the capability in every environment. It establishes that the model did not complete that defined task under AISI’s tested conditions. The result can still be important because the task was designed to represent a multi-step operational challenge, but it should not be converted into a blanket safety claim.

### What the evidence supports

The evidence supports a bounded conclusion: the available records place GPT-5.5’s result on this 32-step range at 1/10 in OpenAI’s 23 April card, 2/10 in AISI’s 30 April report, and 3/10 in AISI’s 13 May update. AISI attributes its April 2/10 to a grading correction after manual review; the reviewed records do not explain its later move to 3/10. AISI also reports that GPT-5.5 did not complete a separate seven-step range and performed strongly on a 95-task capture-the-flag suite. These results help security teams discuss capabilities and test design, but do not forecast real-world attack frequency or prove that the model can compromise a defended target. [@openai-gpt55-system-card-aisi] [@aisi-gpt55-cyber-evaluation-2026] [@aisi-gpt55-cyber-progress-may-2026]

For a buyer or security team, the most useful follow-up is to ask how the evaluation maps to its own threat model. A controlled range can reveal risky capabilities before deployment, but an organization still needs to control tool permissions, credentials, network access, logging and human approval. Model capability and system exposure interact; neither can be inferred from a benchmark score alone.

The lesson for readers is to keep each result attached to its source and date, including the grading note: “OpenAI reports one of ten; AISI’s April manual review updates that result to two of ten; AISI reports three of ten in May without explaining the later change.” That is more useful than a dramatic claim that a model can—or cannot—carry out a cyber operation. [@openai-gpt55-system-card-aisi] [@aisi-gpt55-cyber-evaluation-2026] [@aisi-gpt55-cyber-progress-may-2026] [@ars-aisi-gpt55-2026]

**Evidence note:** The primary records are OpenAI’s 23 April system-card section (1/10, with a separate “highest recorded” figure of 3/10), AISI’s 30 April evaluation (2/10 after a grading correction and manual adjudication), and AISI’s 13 May update (3/10). The April correction explains the difference from OpenAI’s earlier count; AISI does not explain the April-to-May change. Ars Technica reports 3/10 as secondary coverage, not as an independent evaluation. These results are limited to the specified tasks, environment and attempts.