# Longform revision candidates — internal review only

Versioned candidate copies of ten Research/Data drafts that were originally below 800 CMS-counted words. Original attachments remain unchanged. Additions are source-linked; all ten revised copies now pass the production CMS counter. They still need final editor review and release gates before CMS entry.

## Claude Finds Lean-Checked Shortcuts for Designing More Efficient Quantum Circuits

**Section:** Research  
**Slug:** `claude-finds-lean-checked-shortcuts-for-designing-more-efficient-quantum-circuits`  
**Dek:** An arXiv preprint describes a model-and-evaluator loop that redesigned quantum circuits on paper. The results are promising, but they are resource estimates—not a demonstration of useful quantum advantage on today’s hardware.

**Candidate body**

A useful quantum computer needs more than qubits. It needs algorithms that can make progress before noise overwhelms the computation, and that often means finding ways to reduce the number of operations a circuit must perform. In research published on 16 October, Anthropic described an experiment in which Claude helped redesign quantum circuits by proposing candidate implementations, testing them with an automated evaluator and using the results to guide further attempts.

The work covers eight computational tasks spanning chemistry, optimization, quantum simulation, number theory and numerical computing. Anthropic says seven of the eight designs reduced both Toffoli-gate counts and qubit requirements against the best previously published designs. In the eighth, the system developed a new reversible architecture for prime-field modular inversion, improving the trade-off between gates and qubits. One decoder used in a quantum optimization method reportedly required about 12 times fewer gates than a previous construction.

## The key was a closed feedback loop

The experiment was not simply a chatbot asked to explain quantum mechanics. Claude received plain-language specifications for what each circuit had to compute. It wrote candidate implementations in code; a separate program checked whether they returned correct results and scored their resource requirements. Feedback from that evaluator helped the model iterate.

That arrangement matters because circuit design involves constraints that do not map neatly onto ordinary software. Quantum operations must be reversible, and temporary information cannot simply be discarded. A design that saves memory may require more operations later; a design that minimizes operations can consume more qubits. The model’s task was to navigate that trade-off rather than optimize a single, easy-to-game score.

Anthropic’s example of modular inversion illustrates the point. A classical algorithm called divsteps is useful for arithmetic but difficult to translate directly into a quantum circuit because the circuit must preserve enough information to reverse conditional decisions. Anthropic says Claude derived a way to reconstruct much of that intermediate information instead of storing the entire history. It then tested the result numerically and formalized a mathematical claim in Lean, a proof assistant.

## What the results do—and do not—show

The detailed paper, *Discovering state-of-the-art quantum circuits with large language models*, was submitted to arXiv on 15 October. It is a preprint, not evidence by itself that independent reviewers have accepted every result. The evaluator and proof artifacts make parts of the process more checkable, but outside researchers still need to reproduce the results and assess the assumptions behind the comparisons.

Nor did this experiment run the redesigned algorithms on a fault-tolerant quantum computer. The gains are in circuit designs and estimated resource use. Turning them into practical benefit still depends on hardware quality, error correction, control systems and whether the full algorithm retains an advantage over classical approaches.

The distinction is important because large reductions in a component can be meaningful without immediately making a quantum application commercially available. In one well-known chemistry example discussed by Anthropic, estimates for the number of gates needed to simulate an iron-sulfur molecule have fallen dramatically over several years due to improvements from multiple research groups. A better circuit is one link in a longer chain, not the whole chain.

## Why researchers should watch the workflow

The broader lesson is about how models can contribute to science when their outputs are testable. A vague answer can be persuasive and still be wrong; a circuit must pass an evaluator, and a mathematical identity can be checked against a formal specification. This gives the model a concrete feedback signal and lets researchers audit parts of the work.

Anthropic also reports limitations: Claude sometimes preferred familiar approaches and repeatedly rechecked improvements that were already well supported. The team said it encouraged parallel exploration of different approaches to reduce that conservatism. That caveat reinforces the central point: performance depends not only on a model but also on the search setup, scoring method and independent checks around it.

The research offers a promising recipe for AI-assisted quantum design: define a precise task, make correctness testable, measure the real resource trade-off and preserve artifacts that other researchers can inspect. Whether these designs change the timetable for practical quantum computing will depend on what independent teams can reproduce—and on what remains difficult once circuits meet actual hardware.

### Editorial note
This story summarizes research claims from Anthropic and the arXiv preprint. It should not say that AI has delivered practical quantum advantage or that the work has been independently replicated unless additional evidence establishes those claims.

Anthropic identifies Andi Gu as the project lead and places the work within its STEM Fellows Program. That provenance matters when weighing the reported improvements: these are company-research estimates, not independently replicated results or a demonstration on fault-tolerant hardware. [Anthropic’s research note](https://www.anthropic.com/research/designing-efficient-quantum-circuits).

### Source records

- [Primary research explanation](https://www.anthropic.com/research/designing-efficient-quantum-circuits) — Company-authored description; attribute performance claims to Anthropic.
- [Preprint](https://arxiv.org/abs/2610.22367) — Submitted 15 Oct 2026; not equivalent to peer-reviewed publication.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## Claude Traces the Origins of Several NIST Curve Seeds—but Leaves Cryptographic Questions Open

**Section:** Research  
**Slug:** `claude-traces-the-origins-of-several-nist-curve-seeds-but-leaves-cryptographic-questions-open`  
**Dek:** The result offers a reproducible explanation for several long-questioned parameters, but the company’s report leaves some curve seeds and base-point origins unresolved.

**Candidate body**

For decades, cryptographers have debated how the seed values behind several NIST elliptic curves were chosen. Those values were published without a detailed account of their origin, leaving room for speculation about whether the process was arbitrary, reproducible or deliberately engineered. On 16 October, Anthropic reported that an internal Claude research model had traced the origins of five widely used prime-field curve seeds to a much simpler process than some theories proposed: output from a common C-library pseudorandom-number generator initialized with a Unix timestamp.

The result concerns provenance, not a newly discovered attack. Anthropic explicitly says the work does not break ECDSA, does not reveal a practical vulnerability and does not require users to change how they use the curves. The company says the findings make deliberate backdooring less plausible for the parameters it explained.

## How the reconstruction worked

The NIST Digital Signature Standard specifies elliptic curves that are used in cryptographic systems, including curves known as P-192, P-224, P-256, P-384 and P-521. The specifications include seed values used in defining curve parameters. Because the original generation process was not documented, researchers had long tried to reconstruct how the values were produced.

According to Anthropic, Claude approached the problem as a software-reconstruction exercise. Instead of pursuing a rumored humorous phrase that might have been hashed, it reasoned about how a 1990s-era program might have generated candidates. The company says it identified the C library’s `lrand48` generator, initialized from a Unix timestamp, as the source of the five seeds. Candidate values were emitted in sequence until a candidate met the relevant curve conditions. Anthropic published code intended to let others reproduce the results.

This is an example of a model being useful not by answering a broad question from memory, but by deriving a hypothesis and then checking whether a concrete procedure reproduces the known values. The evidentiary strength comes from that reproducibility—not from the model’s confidence.

## What remains unresolved

The report is narrower than a claim that the history of NIST curves has been fully explained. Anthropic says some potentially viable candidate curves appear to have been skipped during the selection process and that it does not know why. It also says the origin of the B-163 binary-curve seed remains unexplained. The company could not explain the base points for several NIST curves, including P-224, P-256, P-384 and P-521.

These gaps matter. Reproducing a seed-generation procedure is not the same as documenting every decision made during a historical standardization process. The company argues that the small number of skipped candidates does not make deliberate weakening plausible, but readers should treat that as its interpretation of the evidence rather than a universal finding independently endorsed by every standards body.

The team also reported tracing base points for some related ANSI X9.62 example curves to a different pseudorandom-number generator. Those are separate parameters and should not be conflated with the unresolved NIST base-point origins.

## Why this matters beyond cryptography

The story is a useful case study in AI-assisted reverse engineering. Legacy software leaves traces: generators have recognizable output patterns, timestamps constrain the search space, and a candidate explanation can be tested against exact published values. A model can search for the underlying process, but the result becomes persuasive only when a repeatable computation supports it.

It is equally a reminder about reporting security research responsibly. The presence of the words “cryptography,” “AI” and “mystery” can invite exaggerated headlines about broken encryption. That would misstate this finding. Anthropic’s own guidance is that no security action is required on the basis of this discovery.

For engineers and standards researchers, the valuable next step is independent reproduction and careful documentation of the remaining unknowns. For users of ECDSA, the appropriate conclusion is more limited: this report provides a proposed explanation for several seed values, not a reason to assume the standard is compromised or to disregard normal cryptographic maintenance.

### Editorial note
Attribute the reconstruction to Anthropic’s report and link to its reproducibility code. Do not describe ECDSA as broken, claim every curve parameter has been explained, or imply NIST has independently endorsed the conclusion unless that is separately documented.

The report leaves questions beyond the five prime-field seeds. Anthropic says some potentially viable curve candidates were skipped, but the selection rule is unknown. Four binary-curve seed initializations correspond to February 1984; the B-163 seed remains unexplained. The company also says it will donate the $36,864 seed-origin bounty to the Internet Security Research Group. A reproducible match for five seeds therefore does not explain every parameter or establish a weakness in ECDSA. [Anthropic’s research note](https://www.anthropic.com/research/ecdsa-curve-origins).

Anthropic says the same `lrand48() >> 23` pattern also matched five ANSI X9.62 seeds, extending the reconstruction beyond the NIST curves discussed here. [Anthropic’s research note](https://www.anthropic.com/research/ecdsa-curve-origins).

### Source records

- [Primary research explanation](https://www.anthropic.com/research/ecdsa-curve-origins) — Company-authored research narrative and reproducibility code; preserve stated unresolved questions.
- [Standards reference](https://csrc.nist.gov/pubs/fips/186-2/final) — Background on the Digital Signature Standard; use the exact relevant version when expanding.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## Inside Anthropic’s AI-Heavy Workplace, Agents Produce More Work—and Create a New Bottleneck

**Section:** Research  
**Slug:** `inside-anthropics-ai-heavy-workplace-agents-produce-more-work-and-create-a-new-bottleneck`  
**Dek:** The company’s own workforce offers an unusually detailed case study in AI adoption. It is also a highly unusual company—and its metrics should not be generalized to every employer.

**Candidate body**

When AI agents can work through tasks while employees move on to something else, the bottleneck changes. The challenge becomes not only producing code or drafting a contract, but checking, coordinating and safely using what the system generates. An employment study published by Anthropic on 16 October describes that shift inside the AI company itself.

The report draws on internal employment records, AI-use telemetry, output measures, employee surveys, communication patterns, hiring decisions and 17 interviews. It is unusually detailed, but still describes one organization whose business is developing AI and whose workflows are especially AI-intensive.

## A striking ratio, with a specific definition

Anthropic reports that by August 2026, interactive agent hours were six times employee hours. The measure counts agent runtime, including inference and active tool use, while excluding waits longer than 30 minutes. Human work hours are estimated from headcount using a 40-hour week. These are not identical measures of effort or value: one hour of agent runtime does not necessarily equal one hour of useful human work, and the ratio does not prove a six-fold productivity gain.

The report describes output increases across several functions as employees adopted coding agents. Engineers shipped more code, sales representatives closed more deals, and legal teams processed more contracts. Researchers compared employees who adopted agentic coding tools with colleagues who had not yet adopted them. But adoption was not random: employees preparing for a major project may be more likely to adopt tools, so some measured change could reflect the work itself.

## What happened to entry-level technical hiring?

The report tracks a shift in the company's hiring mix. In technical departments, the share of junior employees fell from 21% to 14% since early 2025; the share of technical hires who were junior fell from 27% to 9%. These are changes in composition, not proof that every affected role disappeared. Anthropic continued to grow, and hiring in sales, finance and recruiting expanded faster than technical hiring as the company scaled.

The authors say hiring managers increasingly emphasize autonomy and judgment relative to specific technical expertise and implementation. If agents can draft an implementation, the human may spend more time deciding what work matters, setting constraints and checking whether the result is correct. That can change entry-level job design even while the employer continues to recruit.

This is a signal for graduates and early-career workers to watch, not evidence that junior technical employment across the entire economy has collapsed. Anthropic builds AI, uses its own products intensively and has a business model unlike most employers.

## More output creates supervision work

Anthropic says additional AI output can make human attention scarce. Employees build dashboards and monitoring systems to keep track of agents. The report says that even non-technical staff could spend a substantial part of the work week reading the outputs of their agents if they tried to inspect everything.

This is a practical issue for any organization considering agents. A system that generates more code or documents can still create little value if review becomes expensive, errors slip through or employees cannot identify which outputs need attention. Output volume is an incomplete productivity measure. Code later removed or reverted, a contract requiring extensive redrafting or a sales contact that never converts may not deliver the expected benefit.

The report includes checks on code that was later removed or reverted, but no single quality measure proves every gain became a better product or financial return. Business growth also occurred during the same period, complicating causal interpretation.

## What employers should take from the study

Anthropic describes internal mechanisms for tracking roles exposed to disruption and redeploying staff. Those steps cannot eliminate disruption, and protections for existing employees do not address people who are never hired into entry-level roles in the first place.

The strongest takeaway is not the six-to-one ratio alone. It is the combination of agent proliferation, changing job composition and rising demand for humans to supervise machine-produced work. Employers should measure verified task completion, error rates, rework, downstream impact and oversight time—not just the quantity of output.

### Editorial note
Attribute figures to Anthropic’s internal report. Explain the agent-runtime definition and the selection-effect caveat. Do not treat the report as proof of economy-wide job losses or agent hours as a productivity multiplier.

Anthropic reports that employees with at least a year at the company were 50% more likely to move across departments each month in 2026 than in 2025. It also compares its revenue per employee with Meta’s and Google’s during their rapid-growth periods, reporting a 2–4× difference. These are company-reported comparisons, not evidence that agents caused the mobility or revenue difference; they describe one unusually AI-intensive organization. [Anthropic’s workplace study](https://www.anthropic.com/research/employment-at-anthropic).

### Source records

- [Primary workplace study](https://www.anthropic.com/research/employment-at-anthropic) — Contains definitions of agent hours, employment trends, interviews and limitations.
- [Related survey](https://www.anthropic.com/research/ai-expectations-gap) — Use only for clearly differentiated context about expectations, not as confirmation of observed employment outcomes.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## Meta’s Four-Week Health-Research Experiment Shows Both the Promise and Limits of AI-Assisted Science

**Section:** Research  
**Slug:** `metas-four-week-health-research-experiment-shows-both-the-promise-and-limits-of-ai-assisted-science`  
**Dek:** The study’s most important feature may be its human-led design: AI helped with hypotheses, code and writing, while researchers remained responsible for scientific decisions and conclusions.

**Candidate body**

A research manuscript can take months to move from a question to an analysis, a set of tables and a defensible written argument. Meta AI Research says a cohort of medical researchers used its Muse-powered tools to develop ten research manuscripts over four weeks. The experiment, described on 14 October, is a glimpse of how AI might shorten parts of the research process. It is not evidence that a model can independently produce reliable clinical guidance.

Meta says its internal coding workflow combined Muse Spark 1.3 and Muse Wonder and could access public data plus a licensed retrospective database of five million de-identified electronic health records. Researchers from fields including cardiology, epidemiology, infectious disease and internal medicine used the system to brainstorm hypotheses, write and execute code, and collaborate on manuscripts. Domain experts remained responsible for scientific decisions and conclusions.

## A workflow, not an autonomous scientist

The distinction between assistance and responsibility is central. Health research is not simply a writing task. Researchers must select a cohort, define outcomes, decide which variables matter, account for confounders and understand what the available data cannot establish. Automating code can accelerate analysis, but it can also make an incorrect assumption repeat consistently at machine speed.

Meta reports that ten manuscripts were shared, covering areas such as infectious disease, emergency medicine, oncology, endocrinology, oral health and sports medicine. Each went through feedback from peers in the cohort, review of the analysis by a biostatistician and summary reviews from contracted independent experts. Those steps are meaningful safeguards, but they should not be confused with a blanket claim that all papers have passed formal peer review or changed clinical practice.

Meta also reports that some manuscripts progressed from the initial prompt to written draft in less than two weeks, and that participants described large productivity gains in best-case scenarios. Those observations come from the company’s experiment and participant feedback; they are not a randomized comparison of AI-assisted and conventional research across a broad set of institutions.

## Why the quality checks matter

One manuscript examined diagnoses of arrhythmias and conduction disorders after infective endocarditis. The page reports a higher rate in the studied group than in a comparator group with bacteremia, but an external review also pointed to surveillance bias as a live alternative explanation: patients may receive different levels of cardiac monitoring, affecting what gets diagnosed. The reviewer described the finding as hypothesis-generating rather than practice-changing.

That caveat illustrates what responsible AI-assisted science should look like. The value is not that the model produced a striking number. It is that reviewers interrogated the study design, identified an alternative explanation and limited what could reasonably be concluded. The manuscript concerns retrospective health records, so the association cannot by itself establish that one condition caused another or dictate what care an individual should receive.

The same discipline applies across other topics. A tool can help an analyst test more hypotheses, but the process still needs predefined outcomes, suitable comparison groups, statistical checks, sensitivity analysis and domain expertise. When the data are incomplete or reflect how a health system operates, faster coding cannot remove those limitations.

## The promise—and the unresolved questions

The experiment suggests a potential division of labour: AI can handle some repetitive work in literature synthesis, coding and manuscript preparation, while researchers concentrate on the research question, interpretation and checks. It may also help teams investigate whether a question can be answered with the data available before investing months in a study.

But Meta describes the current work as an early exploration based on retrospective analyses. Prospective studies, independent replication and transparent methods will be required before the approach can be judged on clinical impact. The fact that records were de-identified does not eliminate every question about data governance; researchers still need to understand permissions, access controls, representativeness and the limits of the underlying dataset.

For research institutions, the practical lesson is to evaluate AI on end-to-end quality rather than draft speed alone. Measures should include reproducibility, error rates, review time, the proportion of hypotheses that survive scrutiny and whether conclusions remain sound when independent experts inspect the work.

AI can make scientific work move faster. Whether that speed produces better science depends on the people, methods and evidence surrounding the model.

### Editorial note
Describe the ten items as manuscripts shared by Meta, not as ten clinically validated discoveries. Use the independent-review caveats and do not offer medical advice or suggest that the results should change individual treatment.

Meta says researchers also built a shared framework and set of skills to steer its models through the research process. That matters when interpreting the four-week experiment: the reported work came from researchers using a model scaffold and refining the workflow, not from a model acting alone. Meta characterizes the work as an early exploration based on retrospective analyses; an external reviewer called its conclusions hypothesis-generating rather than practice-changing. [Meta’s research announcement](https://research.meta.ai/blog/accelerating-scientific-research-in-health-data-science-with-muse-models).

### Source records

- [Primary research announcement and manuscript summaries](https://research.meta.ai/blog/accelerating-scientific-research-in-health-data-science-with-muse-models) — Meta-authored account; includes study context, manuscript summaries and external reviewer comments.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## OpenAI’s Mathematics Release Puts Formal Proofs Beside AI-Generated Results

**Section:** Research  
**Slug:** `openais-mathematics-release-puts-formal-proofs-beside-ai-generated-results`  
**Dek:** The repository makes some claims easier to check, but formalization is not yet complete across the collection—and a checked proof is only one part of evaluating mathematical significance.

**Candidate body**

A mathematical paper asks readers to trust a chain of reasoning. A formal proof asks whether that chain can also be expressed in a system whose rules a computer can check. That distinction is at the center of OpenAI’s 6 October release of mathematical results produced by an internal frontier model, accompanied by a public repository of manuscripts and supporting artifacts.

The release includes Lean formalizations for many proofs. Lean is a proof assistant: it lets researchers encode mathematical statements and proof steps in a form that can be checked by software. This does not automatically settle every question about a result, but it makes the formalized claim more inspectable than prose alone.

## What OpenAI published

OpenAI says the repository contains a broad collection of mathematical manuscripts and supporting materials. Its README currently catalogs 719 manuscripts organized into 372 related families. The repository says that about 42% of top-line results have been formalized in Lean. It also makes clear that the collection includes work at different stages of verification and that some results without formalizations could contain issues.

That caveat should lead any coverage. A large manuscript count is not the same as a large number of accepted mathematical discoveries. Related manuscripts can be grouped into families, and the status of a claim depends on its specific argument, context and verification. Formalization coverage is also incomplete: the repository is not saying every result has a machine-checked proof.

OpenAI says the model was presented with approximately 4,000 problems during evaluation, which were then organized into the released result families and manuscripts. The company also published ten summaries of the model’s reasoning, estimates of compute used and instructions for citations and revisions. It reports an average of roughly three hours of ChatGPT Pro thinking-equivalent compute per result, though that is OpenAI’s accounting of its internal model process rather than a universal benchmark for mathematical discovery.

## What formal verification contributes

Formal verification provides a narrower but valuable kind of assurance. If a theorem and its proof are represented correctly in Lean and the relevant build completes, the proof checker can validate the formal argument against the rules encoded in the system. This can expose a missing step or an invalid inference that might be missed in a lengthy natural-language presentation.

But there are still several layers to assess. Did the formal statement capture the claim the paper intended to make? Are the definitions and assumptions appropriate? Is the result genuinely novel, or does it follow from known work? Does it matter to the field? And can mathematicians understand and use the result? A Lean file can help answer the proof-validity question for a formalized statement; it does not automatically answer every question about interpretation or importance.

OpenAI says it consulted an independent advisory group on mathematics and AI at the Institute for Advanced Study as it developed publication practices. The company also describes protocols for revisions and citations, and says it expects to add further formalizations over time. Preserving versions and correction history is important for a large, fast-growing collection: readers need to know which manuscript and proof artifact they are inspecting.

## A follow-up investment in human scrutiny

On 15 October, OpenAI announced a $5 million contribution to a new Simons Foundation initiative intended to help mathematicians examine, understand and build on AI-produced results. The foundation will manage and award the funding for workshops, conferences and related programmes; OpenAI also said it would provide models and computing resources to supported researchers.

That move recognizes that the bottleneck is not only generating candidate mathematics. People must check, interpret and develop it. External scrutiny can identify mistakes, explain why a result matters and connect it to work that the model may not have situated correctly.

The release therefore signals a shift in how AI-generated research might be shared: alongside manuscripts, provide reproducible proof artifacts, transparent process notes, stable citations and resources for independent investigation. The quality of that system will be judged not by the number of files in a repository, but by which results survive mathematical scrutiny and become useful to other researchers.

For now, the careful conclusion is that AI systems are producing material that merits structured investigation, and formal tools can make parts of that investigation more rigorous. It is too early to treat the entire collection as verified discovery.

### Verification note
The repository itself warns that not all results are formalized and some unformalized results could have issues. Report those limitations alongside any count of manuscripts or proof artifacts.

OpenAI’s repository identifies exceptions to the fixed procedure described for most results: work on a zero-free region for the Riemann zeta function and a proof of the Hodge Conjecture for CM abelian varieties. The 719 manuscripts therefore should not be treated as products of one uniform search pipeline. Readers still need to distinguish catalog inclusion, mathematical significance, and a machine-checked proof. [OpenAI’s mathematics repository](https://github.com/openai/math).

### Source records

- [Primary research announcement](https://openai.com/index/sharing-ai-progress-in-mathematics/) — Includes the 15 Oct update on the Simons Foundation initiative and formalization plan.
- [Primary research repository](https://github.com/openai/math) — README describes catalog size, verification stages and formalization coverage; figures may change as the repository is updated.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## MentalHealthBench Tests AI Support Beyond Crisis Refusals

**Section:** Data  
**Slug:** `mentalhealthbench-tests-ai-support-beyond-crisis-refusals`  
**Dek:** The open benchmark evaluates model responses to everyday distress, high-acuity situations and emergencies. Its detailed rubrics could help developers find failures hidden by a single safety score—but they do not certify a chatbot for clinical use.

**Candidate body**

A chatbot may avoid an obviously dangerous answer and still respond poorly to someone who is upset, uncertain or trying to decide what to do next. It might assume too much, fail to ask a key question, offer generic reassurance or miss a sign that the situation requires urgent support. OpenAI’s MentalHealthBench is designed to make those less obvious failures easier to measure.

Published on 23 September 2026, the benchmark contains 1,215 synthetic mental-health conversations. More than 80 licensed psychologists and psychiatrists from over 20 countries helped develop the evaluation criteria. OpenAI says the expert cohort spans 19 languages and nearly 20 mental-health subspecialties. The public benchmark and accompanying paper are intended to give researchers a shared way to compare model behaviour in realistic support conversations, not only in narrow crisis-response tests. ([OpenAI’s announcement](https://openai.com/index/introducing-mentalhealthbench/); [technical paper](https://cdn.openai.com/ctf-cdn/MentalHealthBench_A_Comprehensive_Benchmark_of_AI_Capabilities_in_Realistic_Mental_Health_Conversations.pdf))

## From one safety label to ten behaviours

MentalHealthBench evaluates responses against tailored criteria written for each conversation. The criteria can reward actions such as asking for relevant context, offering practical guidance and preserving the user’s agency. They can also penalize undesirable behaviour, including overconfident assumptions or responses that fail to handle risk appropriately. The rubric assigns different weights to criteria, reflecting their relative importance in a specific scenario.

The dataset covers non-acute conversations as well as higher-acuity situations and emergencies. It includes contexts involving adults, teenagers, caregivers and clinicians. The paper reports that the examples are synthetic: they were designed using privacy-preserving analysis of broad usage patterns rather than simply publishing people’s private conversations. That distinction matters for teams deciding whether the test represents their own product’s user base.

OpenAI says each rubric is developed through a process involving multiple licensed experts and adjudication. The benchmark also decomposes behaviour into ten dimensions, making it possible to see where a model’s aggregate score conceals weaknesses. Two systems with similar overall scores may behave differently when they need to seek context, calibrate urgency or preserve a user’s decision-making role.

## How developers could use it

For model developers, the benchmark can provide a repeatable regression test. A team could evaluate a model before and after a change to safety instructions, conversation memory or escalation logic, then compare the pattern of scores rather than relying on a few hand-picked examples. Product teams could also use the criteria to build their own evaluations around the situations their users actually encounter.

The benchmark is not a substitute for domain-specific risk review. A team should inspect the dataset’s composition, scoring instructions, languages and user profiles before treating a result as relevant to its product. Because the examples are synthetic and the responses are graded against rubrics, performance can reflect both the model and the benchmark’s assumptions. A score also does not establish what happens during long-term interactions, where user trust, repeated use and real-world consequences may change the risk.

## The limits are as important as the score

MentalHealthBench is an OpenAI-led release, so developers should distinguish its authors’ reported comparisons from independent validation. Its paper is a technical research report; publication on a company website does not itself establish peer-reviewed acceptance. The benchmark measures generated responses to defined scenarios. It does not certify that a product is therapy-ready, establish clinical outcomes, or replace privacy controls, crisis escalation procedures and qualified professional oversight.

The research also compares expert rubrics with perspectives gathered from 44 adults who had used AI for mental-health or emotional support. That separate user study was restricted to non-acute conversations, and the paper treats user preferences as complementary to—not interchangeable with—clinical and safety guidance.

For developers, the useful contribution is a more detailed test surface. The next step is not to advertise a chatbot as safe because it scores well, but to run the benchmark, study the failures, disclose the evaluation’s limits and add independent testing suited to the deployment context. In a field where a technically fluent answer can still be the wrong response, measuring how a model handles context and uncertainty is a more meaningful starting point than counting refusals alone.

### Editorial note
This story describes a benchmark published by OpenAI. Do not frame a high score as clinical certification, proof of clinical benefit, or a replacement for professional care. Verify the current benchmark access terms and paper version before publication.

Conversation depth is another important benchmark characteristic: 53.7% of its synthetic cases contain more than five messages, 8.7% are short, and 37.6% run three to five. Its topic mix also includes romantic relationships (255 cases), self-harm (159), and faith or belief systems (128). These counts show coverage of sustained everyday concerns alongside higher-acuity cases; they do not make the benchmark a clinical test or represent naturally occurring patient conversations. [The technical paper](https://cdn.openai.com/ctf-cdn/MentalHealthBench_A_Comprehensive_Benchmark_of_AI_Capabilities_in_Realistic_Mental_Health_Conversations.pdf).

### Source records

- [Primary announcement](https://openai.com/index/introducing-mentalhealthbench/) — OpenAI announcement dated 23 September 2026; explains scope, expert involvement and dimensions.
- [Technical paper](https://cdn.openai.com/ctf-cdn/MentalHealthBench_A_Comprehensive_Benchmark_of_AI_Capabilities_in_Realistic_Mental_Health_Conversations.pdf) — Confirms 1,215 synthetic conversations, rubric design and stated limitations.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## WAXAL Opens Speech Data for 21 African Languages—but Coverage Still Matters

**Section:** Data  
**Slug:** `waxal-opens-speech-data-for-21-african-languages-but-coverage-still-matters`  
**Dek:** The open collection pairs community-led language work with speech and transcription data. Its scale is significant, but language-by-language coverage, licensing and evaluation still determine what developers can build responsibly.

**Candidate body**

Voice interfaces often feel effortless when the software understands a speaker’s language, accent and phrasing. For many people, that experience remains unavailable—not because speech technology is impossible, but because developers lack enough high-quality, well-documented data to train and evaluate it. WAXAL, an open speech dataset announced by Google Research on 2 February 2026, is intended to narrow that gap for African languages.

Google says WAXAL covers 21 languages and contains more than 11,000 hours of speech drawn from nearly two million recordings. Around 1,250 hours are transcribed speech for automatic speech recognition (ASR), while the collection includes more than 20 hours of studio recordings for text-to-speech (TTS). Those quantities serve different tasks: speech recognition systems learn to map audio to text, while speech synthesis systems need voice examples to generate spoken output. The headline total should not be mistaken for 11,000 hours of fully transcribed material in every language. ([Google’s dataset announcement](https://blog.google/intl/en-africa/company-news/outreach-and-initiatives/introducing-waxal-a-new-open-dataset-for-african-speech-technology/))

## A dataset built through regional partnerships

The work was developed over three years with African institutions and data-collection partners. Google identifies Makerere University in Uganda and the University of Ghana as leading data collection for 13 languages between them, with Digital Umuganda in Rwanda contributing to work on five languages. Regional experts supported the high-quality voice recordings. The stated approach was to preserve partner ownership of the data they collected while making the collection accessible to the global research community.

The dataset includes languages such as Acholi, Akan, Dagaare, Dholuo, Ewe, Hausa, Igbo, Kikuyu, Lingala, Luganda, Shona, Swahili and Yoruba. WAXAL’s release page says participants described pictures in their native languages to capture more natural speech, while professional voice actors produced studio recordings for text-to-speech. Those methods provide different kinds of signal: spontaneous descriptions may better reflect how people talk, while studio sessions offer cleaner audio for synthesis.

The dataset is available on [Hugging Face](https://huggingface.co/datasets/google/WaxalNLP). Its dataset card lists CC-BY-SA 4.0 and CC-BY 4.0 licences. Developers should inspect the current card and the licence attached to each relevant subset or asset before using the material in a commercial product. A public download is not permission to ignore attribution or share-alike conditions.

## What builders can do with it

Researchers can use WAXAL to train or evaluate speech-recognition systems, examine performance across languages, compare transcription quality and test how well a system handles locally spoken input. Developers could use it as a starting point for voice notes, searchable audio archives, accessibility features, customer-support tools or offline speech interfaces—provided the target language and use case are represented adequately.

The most useful first step is not to train one model on the entire collection and declare multilingual coverage solved. Teams should examine each language subset, define a held-out evaluation set, measure word error rate and other task-appropriate metrics, and test performance on speech recorded in the conditions where the product will be used. A model that performs well on clean studio audio may struggle with noisy phones, rural connectivity, code-switching, regional accents or names unfamiliar to its training data.

## Open data is a beginning, not the finish line

Google presents WAXAL as a resource for more inclusive speech technology and language preservation. That is a worthwhile goal, but the dataset covers 21 languages in a region with thousands of languages. Its contribution should be judged by how well developers use it, whether model quality improves for the communities represented and whether community partners retain meaningful agency over collection and reuse.

More data can make underrepresented languages more visible in machine learning, but volume alone does not guarantee balanced coverage, accurate speech recognition or culturally appropriate products. Researchers should document the limits of each language subset and avoid treating one benchmark as evidence that a system understands an entire language community.

For the AI data ecosystem, WAXAL’s significance is both technical and institutional: it offers a substantial resource while demonstrating the role of local universities and organizations in building it. The next measure of success is whether researchers and product teams turn that resource into reliable tools—with transparent testing and licensing—not simply whether the dataset downloads attract attention.

### Editorial note
The hours, languages and partner roles above are reported by Google. Confirm the dataset card’s current licence and language/subset metadata before publication. Do not imply equal hours, equal transcription coverage or equivalent quality across all 21 languages.

Google says WAXAL takes its name from the Wolof word for “speak” and includes languages such as Dagbani, Fante, Fulani, Ikposo, Malagasy, Masaaba, Nyankole, Rukiga, and Soga alongside larger subsets. The company also names the African Institute for Mathematical Sciences as a partner on multilingual data planned for future releases. An aggregate hour count cannot describe each language’s current coverage; check individual subset metadata and licence terms before reuse. [Google’s announcement](https://blog.google/intl/en-africa/company-news/outreach-and-initiatives/introducing-waxal-a-new-open-dataset-for-african-speech-technology).

### Source records

- [Primary announcement](https://blog.google/intl/en-africa/company-news/outreach-and-initiatives/introducing-waxal-a-new-open-dataset-for-african-speech-technology/) — Google announcement dated 2 February 2026; provides total hours, language count, partner information and collection method.
- [Dataset repository/card](https://huggingface.co/datasets/google/WaxalNLP) — Live repository; card lists ASR/TTS tasks and CC-BY-SA 4.0 and CC-BY 4.0 licences. Verify subset-level terms before reuse.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## Google’s Agricultural Understanding API Brings Field-Level Crop Signals to Developers

**Section:** Data  
**Slug:** `googles-agricultural-understanding-api-brings-field-level-crop-signals-to-developers`  
**Dek:** The API is designed to turn satellite-derived information into field-level vector data for agritech platforms and researchers. It is a data layer, not a replacement for ground checks or agronomic judgment.

**Candidate body**

A national crop map can show where farming happens. A farmer, extension worker or irrigation planner often needs something more specific: the boundaries of an individual field, an indication of what is growing there, or a view of how conditions change during a season. Google’s Agricultural Understanding platform is designed to provide such field-level signals through an API that developers can integrate into agricultural applications.

Google describes the platform as a set of models that turn satellite imagery into insights about agricultural land, including field acreage, crop diversity and nearby water sources. Its developer documentation specifies methods for retrieving landscape features and boundaries, checking dates when imagery was captured and processed, and monitoring crop predictions over time. Outputs are structured vector features—including GeoJSON—rather than raw satellite images. ([API overview](https://developers.google.com/agricultural-understanding/api); [REST reference](https://developers.google.com/agricultural-understanding/reference/rest))

## From imagery to usable data

The API exposes three main methods. `lookupLandscape` retrieves spatial features for a location, such as field boundaries and landscape elements. `lookupLandscapeCaptureDate` helps developers discover the dates available for a location. `monitorLandscape` retrieves in-season or historical crop predictions and confidence scores for specified fields and time ranges. A request can identify a geographic location using coordinates or an S2 cell identifier, and the documented response format supports integration with maps, dashboards and geographic information systems.

That structure could help a developer build a monitoring dashboard that combines field boundaries, crop predictions and other sources such as weather, soil measurements or local advisory records. An agricultural administrator could use the data to prioritize field visits, while a research team could use them to compare model signals with crop surveys. These are possible applications, not guaranteed results: the API provides features and predictions, and the user remains responsible for checking whether they are fit for a particular decision.

Google’s India blog says the models are being used through Amnex’s integration with Gujarat’s Krushi Pragati crop-intelligence platform. The company reports that the system supported more than 900 million SMS-based advisories to over 600,000 farmers in the preceding year, spanning more than 14 million hectares. These figures are Google’s reported deployment claims; they should not be described as independently evaluated improvements in yield or income without additional evidence. ([Google India account](https://blog.google/intl/en-in/company-news/from-lab-to-impact-advancing-ai-for-real-world-progress-in-india/))

## Access and technical limits developers should know

The product documentation notes several constraints. The API returns vector information about features rather than raw satellite imagery. It does not perform server-side spatial aggregation for a whole region; developers may need to handle aggregation themselves. Field features are indexed by the centroid of level-13 S2 cells, so polygons near cell boundaries can extend beyond the cell perimeter. Those details matter when a downstream application assumes that a response represents every parcel within a boundary.

Access also is not simply an unrestricted anonymous download. Google’s setup instructions require a Google Cloud project, an API access/quota request and allowlisting before use. Teams should verify current eligibility, quota, pricing and terms directly in the developer documentation before building a production dependency. ([Setup and API overview](https://developers.google.com/agricultural-understanding/api))

## Why predictions still need local checks

Field-level information can be valuable when field surveys are expensive or too slow to repeat frequently. But satellite-derived classification can still be affected by crop rotation, cloud cover, season, mixed land use, field size and local farming practice. A prediction that is accurate on average may fail in a particular district, crop type or season. Developers should compare outputs with representative ground observations and report confidence or uncertainty rather than converting a model output into a definitive crop label.

The risk grows when a data layer feeds decisions about credit, insurance, subsidy eligibility or a farmer’s access to support. Those applications need clear accountability, mechanisms to correct errors and human review where a wrong classification could materially harm someone. An API response alone should not be treated as the authoritative record of a farm.

Google’s platform illustrates how geospatial AI is moving from broad maps toward finer-grained data services. Its practical value will depend on reliable coverage, clear access terms and evidence that the features are accurate enough for the local use case. For developers, the best starting point is a limited pilot: inspect sample responses, confirm available capture dates, validate against field data and establish how updates and uncertainty will be handled before connecting the output to consequential decisions.

### Editorial note
This article uses Google’s own product documentation and deployment account. Attribute rollout and scale figures to Google. Do not claim the API is universally available, that its predictions are ground truth, or that it has independently proven agricultural yield gains.

Google says its India-first Agricultural Understanding models now provide insights in 11 countries. That is a company-reported coverage statement, not evidence that every crop, season, or field has identical local performance. The API documentation also requires allowlisting and quota setup through a Google Cloud project, so access and geographic support should be checked before deployment. [Google’s India update](https://blog.google/intl/en-in/company-news/from-lab-to-impact-advancing-ai-for-real-world-progress-in-india).

### Source records

- [Primary developer documentation](https://developers.google.com/agricultural-understanding/api) — Describes product capabilities, output formats, endpoints, access requirements and limitations.
- [REST reference](https://developers.google.com/agricultural-understanding/reference/rest) — Defines lookupLandscape, lookupLandscapeCaptureDate and monitorLandscape endpoints.
- [Company deployment account](https://blog.google/intl/en-in/company-news/from-lab-to-impact-advancing-ai-for-real-world-progress-in-india/) — Google-reported Gujarat/Amnex deployment metrics; attribute these claims.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## ThinkingBox-Bench Grades AI Agents on What Actually Changed in the System

**Section:** Data  
**Slug:** `thinkingbox-bench-grades-ai-agents-on-what-actually-changed-in-the-system`  
**Dek:** The benchmark evaluates backend state and side effects rather than accepting a model’s claim that it finished the job. It is useful for evaluation, but its maintainers explicitly restrict its task data from model optimization.

**Candidate body**

An AI agent can tell a customer that a problem is resolved while leaving the underlying ticket in the wrong status. It can make the correct tool calls but fail to update a record, trigger an unintended side effect or forget a business rule halfway through a workflow. Microsoft and Hugging Face built ThinkingBox-Bench around that gap: the benchmark asks not only what the model said or which tools it called, but whether the connected system ended up in the required state.

ThinkingBox-Bench version 1.0 contains 507 tasks across five business areas: retail and e-commerce, travel and hospitality, auto insurance, neobank support, and consulting IT/HR support. The dataset is browsable on [Hugging Face](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench), while the executable benchmark, tool servers and fixtures live in Microsoft’s companion [GitHub repository](https://github.com/microsoft/thinkingbox-data). The dataset card lists the Community Data License Agreement—Permissive, Version 2.0 (CDLA-Permissive-2.0). ([Dataset card](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench); [project explanation](https://huggingface.co/blog/microsoft/thinkingbox))

## Why a correct answer is not enough

Traditional evaluations often grade a final text response, a tool-call sequence or a narrow answer. That can miss the outcome that matters in an operational system. An agent might open a support ticket, read the right policy and then close the ticket incorrectly. A grader looking only at the call sequence could reward the process even though the state left behind violates the workflow’s rules.

ThinkingBox sets up simulated business environments with an initial state, a user goal, available tools and constraints. After an agent’s attempt, the benchmark inspects backend state and side effects, then compares the result with executable checks. Some tasks also evaluate semantic details that cannot easily be represented as a database field, such as whether the agent communicated a condition accurately. The benchmark’s central idea is that a task is complete only when the outcome satisfies the requirements.

The authors’ accompanying explanation describes repeated trials because one successful run does not establish reliability. An agent may complete an operation once and fail when the same task is repeated. Consistency matters in customer support, travel changes, financial services and internal IT workflows, where a seemingly small state error can have operational consequences.

## How developers can use it

Teams building agents can use ThinkingBox to test workflow completion, inspect failure patterns, and compare agent configurations against a fixed suite. It can help separate different failure types: choosing the wrong tool, applying the wrong rule, failing to gather required context, or making a correct intermediate move but leaving the system in an invalid final state. Developers can also use the benchmark’s task definitions to think more rigorously about what “done” should mean in their own products.

The repository contains a browsable dataset representation, but the Parquet view is not the executable runtime. A reproducible run requires the benchmark framework and its supporting services. Developers should follow the project’s installation instructions and pin the specified release rather than treating a preview of the tables as a complete evaluation environment.

There is also a critical use restriction: the dataset card says the benchmark is intended exclusively for evaluation. It instructs users not to use task content, expected outcomes, golden state or tool trajectories for prompt optimization, fine-tuning, reinforcement learning, reward-model training or other model optimization. Teams need to respect that limitation, even if the underlying files are easy to download.

## What the benchmark cannot prove

ThinkingBox is a controlled benchmark, not a guarantee that an agent will behave reliably in every production environment. Its tasks, simulated users, tool schemas and state checks represent selected workflows and domains. A model that performs well may still fail when real software has unexpected latency, incomplete data, permissions conflicts, changing policy or a user who behaves differently from the simulation.

The benchmark is also not itself an independent certification standard. Its release and findings are associated with the authors’ evaluation framework, so organizations should inspect its methodology and supplement it with tests drawn from their own processes. In high-impact workflows, deterministic checks, logs, permission limits and human approval for irreversible actions remain necessary.

ThinkingBox-Bench is valuable because it shifts the evaluation question from “Did the agent sound competent?” to “Did it leave the system correct—and can it do so consistently?” For enterprise AI, that is a more demanding test, and a more relevant one. But its results should be one component of a broader assurance process, not a substitute for deployment controls or domain-specific validation.

### Editorial note
Make the evaluation-only use restriction prominent. Do not describe the benchmark as a production reliability guarantee or suggest that its task data may be used for training or prompt optimization.

The project’s repository also specifies FastMCP 3.x for its server packages. That dependency matters because the published data preview, executable task framework, and mock tool services are separate parts of a reproducible evaluation; the Parquet files alone are not a runnable benchmark. [Repository setup](https://github.com/microsoft/thinkingbox-data).

### Source records

- [Dataset card](https://huggingface.co/datasets/microsoft/ThinkingBox-Bench) — Confirms 507 tasks, domains, dataset structure, CDLA-Permissive-2.0 licence and evaluation-only use restriction.
- [Project explanation](https://huggingface.co/blog/microsoft/thinkingbox) — Explains final-state grading, side effects and repeated-run reliability motivation.
- [Executable source repository](https://github.com/microsoft/thinkingbox-data) — Contains benchmark runtime, tool-server mocks, data and test cases.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---

## OpenAI and Ironclad Turn Contract Workflows Into AI-Agent Tests—not a Public Dataset

**Section:** Data  
**Slug:** `openai-and-ironclad-turn-contract-workflows-into-ai-agent-tests-not-a-public-dataset`  
**Dek:** The collaboration tests agents on agreements, approvals and reusable legal terms. OpenAI reports improved task scores for GPT-6 Astra, but its results cover only 11 research tasks and use simulated time estimates.

**Candidate body**

Contracting work rarely consists of a single question. A legal-operations employee may need to configure a template, route an agreement for the right approvals, update a reusable clause and ensure that the process still follows company rules. A computer-using AI agent must keep those constraints straight across multiple screens and actions. OpenAI’s collaboration with contract-management company Ironclad is an effort to turn that kind of work into defined tasks that can be used to train and evaluate agents.

OpenAI announced the research collaboration on 6 October 2026. The partners identified 11 tasks across legal, commercial and procurement work, including setting up nondisclosure agreements, configuring procurement approvals and changing a reusable clause to reflect a requester’s jurisdiction. OpenAI says GPT-6 Astra, its first frontier model trained on Ironclad tasks, scored an average 32% higher than GPT-5.6 Sol on the research evaluation, while estimated time per attempt was 48% lower. ([OpenAI’s research description](https://openai.com/index/advancing-computer-use-with-ironclad/))

Those numbers need a narrow reading. The results cover the 11 tasks in this evaluation, not the full range of Ironclad workflows. OpenAI’s footnote says the time figures are simulated estimates based on assumed processing and generation speeds—not measured customer time savings. The result is evidence of progress on a selected task set, not proof that agents are ready to run a company’s contracting function without oversight.

## Why task definition is the data problem

The research highlights an important challenge in evaluating enterprise agents: task descriptions have to encode the business rules that determine whether an outcome is acceptable. A purchase workflow might require Finance approval above a spending threshold, Security review for a particular category of software, and Legal review for nonstandard terms. A model can make several correct clicks and still create an invalid process if it forgets one rule or fails to test an exception.

For this reason, the collaboration focuses on tasks with observable end conditions. Rather than only judging an answer, evaluators can test whether the configured agreement, approval path or reusable clause matches the original requirements. That makes failures easier to diagnose and gives researchers a more concrete target for improvement.

OpenAI says the simulated tasks were created from contracts publicly available in the US Securities and Exchange Commission’s EDGAR database after filtering designed to remove personal information. The company says it did not use OpenAI customer data, its internal contracts, or nonpublic Ironclad customer data or contracts for training or evaluation. Those data-handling details are important in legal technology, where contracts can contain confidential business terms and personal information. They should be retained whenever this work is summarized.

## Is there a dataset developers can download?

Not on the evidence in the announcement. The publication describes a research collaboration and a set of evaluation tasks, but it does not establish that the complete task dataset, executable environment or underlying artifacts have been released publicly for general download. Therefore, this story should not label the collaboration a newly released open dataset.

For developers, the useful lesson is methodological: turn real professional workflows into bounded tasks, specify the rules that matter, design checks for the final state and include exceptions. A team could apply the approach internally to assess agents on document preparation, vendor onboarding or customer operations, while respecting data access rules and using representative, permissioned material.

## Human review remains part of the workflow

Even a strong score on a task set does not remove the need for permission controls, audit logs and review in legal and commercial systems. Agreement terms can depend on jurisdiction, risk appetite, negotiation context and a company’s internal policies. An agent should not independently approve a legally consequential commitment merely because it has completed a benchmark task successfully.

OpenAI and Ironclad describe their collaboration as research into more capable computer use for complex professional work. The important data story is how they define, simulate and evaluate the job—not the release of a dataset that the source does not document. The approach may make enterprise-agent performance easier to measure, but independent validation and real-world deployment evidence are still needed to establish what the gains mean for customers.

### Editorial note
This is a research-collaboration story, not a public dataset announcement. Preserve the caveat that time savings are simulated estimates and that results cover 11 research tasks only.

The report says each task was assessed against 8–50 criteria, depending on complexity, and Ironclad supplied hosted software environments for model practice. OpenAI estimates an experienced user would take about 30–40 minutes per task, but explicitly calls that timing a simulation rather than measured customer savings. This offers a bounded human comparison, not a real-world productivity result: the experiment measures 11 designed tasks, not a representative sample of deployed contract workflows. [OpenAI’s report](https://openai.com/index/advancing-computer-use-with-ironclad).

### Source records

- [Primary research announcement](https://openai.com/index/advancing-computer-use-with-ironclad/) — Dated 6 October 2026; confirms 11 tasks, reported model comparison, simulated timing caveat and data provenance.

**Review status:** REVISION CANDIDATE — production CMS recount passed; final manual claim review, approval and remaining release gates are pending.

---
