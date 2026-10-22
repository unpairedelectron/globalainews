import React from 'react';

export type ComparisonReportSlug =
  | 'ai-assistants-compared'
  | 'ai-image-tools-compared'
  | 'coding-agent-benchmarks-compared'
  | 'hosted-vs-open-weight-models'
  | 'indiaai-vs-commercial-cloud'
  | 'provenance-controls-compared';

interface ComparisonRow {
  product: string;
  documentedUse: string;
  sourceLabel: string;
  sourceUrl: string;
  sourceDate: string;
  limitation: string;
}

interface ComparisonRevision {
  recordedOn: string;
  summary: string;
  previousRows: ComparisonRow[];
}

interface ComparisonReport {
  title: string;
  description: string;
  intro: string;
  criteria: string;
  sourcesReviewedOn: string;
  sourceReviewCadence: string;
  nextSourceReviewDue: string;
  rows: ComparisonRow[];
  revisions: ComparisonRevision[];
  limitations: string[];
  sections: { heading: string; paragraphs: string[] }[];
  indiaContext: string;
  keyTakeaways: string[];
}

export const comparisonReports: Record<ComparisonReportSlug, ComparisonReport> = {
  'ai-assistants-compared': {
    title: 'AI Assistants Compared',
    description:
      'Compare documented workflows in ChatGPT, Claude, Gemini and Microsoft Copilot. A source-led guide, not a performance ranking.',
    intro:
      'This guide compares product surfaces and workflows documented by the vendors: research, file and image handling, and integration with work tools. It does not rank answer quality. We have not run a common benchmark across plans, accounts or regions.',
    criteria:
      'Criteria: user-facing work surfaces, vendor-documented capabilities, and access conditions. Feature availability and usage limits can vary by plan, account type, country and product release.',
    sourcesReviewedOn: '2026-10-14',
    sourceReviewCadence: 'Monthly',
    nextSourceReviewDue: '2026-11-13',
    rows: [
      {
        product: 'ChatGPT',
        documentedUse:
          'OpenAI documents Search for timely, source-backed answers; Deep Research for multi-step research with cited outputs; and image input, generation and natural-language edits.',
        sourceLabel: 'OpenAI capabilities overview',
        sourceUrl: 'https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'The overview is a vendor description; tools, limits and access can differ by plan and account.',
      },
      {
        product: 'Claude',
        documentedUse:
          'Anthropic documents web search with citations, file creation and editing, projects, and interactive visuals. Its support page says it does not produce raster photos or illustrations.',
        sourceLabel: 'Claude features and capabilities help',
        sourceUrl: 'https://support.claude.com/en/collections/18031719-features-and-capabilities',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'The cited help pages describe current product behavior, not a comparative quality test; some visual features are beta.',
      },
      {
        product: 'Gemini Apps',
        documentedUse:
          'Google documents Nano Banana 2 image generation and editing, including local edits, character consistency and combining images.',
        sourceLabel: 'Gemini Apps Help',
        sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'Google notes that availability depends on supported languages and countries, sign-in, age and account type; paid subscribers also have access to Nano Banana Pro.',
      },
      {
        product: 'Microsoft Copilot',
        documentedUse:
          'Microsoft describes Copilot inside Word, Excel, PowerPoint and Outlook, where it can assist with work across those apps and use work files, messages and meetings as context.',
        sourceLabel: 'Microsoft 365 Copilot in apps for work',
        sourceUrl: 'https://www.microsoft.com/en-in/microsoft-365-copilot/in-apps-for-work',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'The page describes Microsoft 365 product surfaces; features depend on subscription and account eligibility.',
      },
    ],
    revisions: [
      {
        recordedOn: '2026-10-14',
        summary:
          'The ChatGPT, Gemini Apps and Microsoft Copilot descriptions and citations were updated after checking the current first-party documentation.',
        previousRows: [
          {
            product: 'ChatGPT',
            documentedUse:
              'OpenAI describes chat for web search and image generation, a work surface for creating and editing deliverables, and Codex for coding tasks.',
            sourceLabel: 'OpenAI product overview',
            sourceUrl: 'https://openai.com/chatgpt/overview/',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'The overview is a vendor description; tools, limits and access can differ by plan and account.',
          },
          {
            product: 'Gemini Apps',
            documentedUse:
              'Google documents model selection and image generation and editing in Gemini Apps, including edits to generated images and user-uploaded images.',
            sourceLabel: 'Gemini Apps Help',
            sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'Google notes that availability can depend on language, country, account type and plan.',
          },
          {
            product: 'Microsoft Copilot',
            documentedUse:
              'Microsoft describes Copilot workflows inside Word, Excel, PowerPoint and Outlook, including drafting, spreadsheet analysis, presentations and email summaries.',
            sourceLabel: 'Microsoft Copilot features',
            sourceUrl: 'https://www.microsoft.com/en-us/copilot/solutions/individuals',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'The page describes Microsoft 365 product surfaces; features depend on subscription and account eligibility.',
          },
        ],
      },
    ],
    limitations: [
      'Vendor pages establish what each company says its product supports; they do not independently verify accuracy, privacy outcomes or productivity gains.',
      'This comparison does not compare model scores, price, message caps or service-level guarantees.',
      'Re-check the linked product documentation before making a purchasing decision; these products change frequently.',
    ],
    sections: [
      {
        heading: 'Choose a workflow, not a brand',
        paragraphs: [
          'The table is most useful as a map of product surfaces. ChatGPT and Gemini describe consumer-facing assistants with search, research and image workflows; Claude documents research and document work; Microsoft positions Copilot inside familiar Microsoft 365 applications. Those descriptions answer where a user may interact with a tool, not whether one assistant will finish a task more accurately. A team should start with its actual job: finding evidence across public websites, drafting from a controlled file set, transforming a spreadsheet, or preparing a presentation. Then it can check whether the documented surface matches that job and which account, subscription and connected data are required.',
          'The product boundaries matter. “Search” can mean a cited answer from the public web, while “research” can mean a longer multi-step workflow that returns a report. An in-app assistant may use a user’s work documents as context, but only when the tenant, permissions and product configuration make those files available. A capability page is not a guarantee that every user sees the same button or receives the same result. Treat each vendor’s description as an implementation lead and verify the exact feature in the intended account before making a workflow depend on it.',
        ],
      },
      {
        heading: 'Evidence quality is separate from interface quality',
        paragraphs: [
          'A polished answer can make a weak source trail look complete. When a tool returns citations, inspect whether each cited page supports the specific sentence, whether important counterevidence is missing, and whether the answer distinguishes fact from inference. A citation count is not a measure of source quality. For file workflows, test whether the assistant quotes the relevant passage accurately and preserves the context that changes its meaning. For spreadsheet work, compare formulas and data transformations with a known answer. For image edits, check whether the generated result preserves the elements the task required.',
          'None of the cited vendor pages supplies an independent, common evaluation across all four assistants. We therefore do not report a winner, aggregate a score, or claim that one product is safer or more productive. A fair local evaluation should freeze the task set, account tier, enabled tools, connected data and date. It should record both successful completion and the work needed to review, correct or redo an answer. Include failure cases and escalation decisions; otherwise a product that confidently returns an incorrect answer can appear faster than a product that signals uncertainty.',
        ],
      },
      {
        heading: 'Privacy and access belong in the comparison',
        paragraphs: [
          'The same assistant can behave differently across individual, team and enterprise accounts. Data controls, retention, administrator settings and connected-workspace access are governed by the specific service and contract, not by the general product name. Before using customer or employee material, locate the current terms for the exact account and endpoint, identify who can access prompts and outputs, and check what the organization can configure. This guide does not compare those contractual protections because the cited capability pages do not establish a like-for-like data-handling policy.',
          'Integration also creates an authorization question. If an assistant can search an organization’s files, the result should be constrained by the user’s existing permissions, and the organization should test whether sensitive content can be surfaced in an unexpected context. Keep connected tools read-only during evaluation unless a task specifically requires a write action. For consequential updates, require an authorized person to review the proposed change and preserve a record of what the assistant read and changed. These are procurement and governance checks, not features this comparison claims every product provides by default.',
        ],
      },
      {
        heading: 'A practical evaluation that can be repeated',
        paragraphs: [
          'Build a small, representative test set before choosing a plan. Include routine tasks, ambiguous requests, missing-source cases and a task that should be refused or handed to a person. For every case, define what a correct result looks like before running the tools. Record exact product name, account type, feature, region, date and prompt; vendor features and limits change over time. Keep the same source files and expected answer available to each system, and note where a product’s workflow cannot be made equivalent without a different plan or connector.',
          'Score more than the final prose. Track whether the task was completed, whether factual claims were supported, whether citations resolved to useful evidence, how long a person spent checking the result, and whether the system took an action that needed reversal. Keep quality, speed and cost in separate columns. A single blended score hides trade-offs and encourages false precision when the products expose different features. Re-run the same cases after a model, plan or integration changes; a dated result is evidence about that setup, not a permanent property of the product.',
        ],
      },
    ],
    indiaContext:
      'For teams in India, the linked Gemini help page explicitly notes that language, country, age and account restrictions can affect availability. The cited pages do not establish identical regional access, local-language quality or data residency across all four products. Verify those conditions for the intended account and language before procurement; this guide makes no India-specific performance ranking.',
    keyTakeaways: [
      'Compare the documented workflow and account conditions, not brand-level claims.',
      'The cited material is vendor documentation, not an independent quality, safety or productivity test.',
      'Test citations, connected-file permissions and human review time on representative tasks.',
      'Verify availability, language support and contractual data controls in the intended region.',
    ],
  },
  'ai-image-tools-compared': {
    title: 'AI Image Tools Compared',
    description:
      'Compare documented generation and editing workflows in ChatGPT Images, Adobe Firefly, Midjourney and Gemini Apps.',
    intro:
      'The table compares capabilities described in first-party documentation, not image quality or commercial suitability. No tool is ranked, and no affiliate links are active on this page.',
    criteria:
      'Criteria: documented image-generation and editing controls, reference-image workflows, and stated access limits. Source dates identify a release/update date when the vendor provides one; otherwise they show when we checked the documentation.',
    sourcesReviewedOn: '2026-10-14',
    sourceReviewCadence: 'Monthly',
    nextSourceReviewDue: '2026-11-13',
    rows: [
      {
        product: 'ChatGPT Images 2.5',
        documentedUse:
          'OpenAI documents image generation, iterative edits, reference-photo subject preservation, sketch input and prompt sharing. The product announcement is dated September 8, 2026.',
        sourceLabel: 'OpenAI: ChatGPT Images 2.5',
        sourceUrl: 'https://openai.com/index/introducing-chatgpt-images-2-5/',
        sourceDate: 'Published 2026-09-08',
        limitation:
          'OpenAI reports the capabilities; the announcement is not an independent image-quality comparison. Availability may change.',
      },
      {
        product: 'Adobe Firefly',
        documentedUse:
          'Adobe documents image generation and editing, reference images and multiple partner models, including FLUX, Gemini, GPT Image, Imagen and Ideogram.',
        sourceLabel: 'Adobe Firefly: What’s new',
        sourceUrl: 'https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'Model access, credits and features depend on the current Firefly plan and release; inclusion is not an endorsement.',
      },
      {
        product: 'Midjourney',
        documentedUse:
          'Midjourney documents version selection and personalization profiles. Its version guide identifies V8.2 as the current default and describes its Edit Model.',
        sourceLabel: 'Midjourney version guide',
        sourceUrl: 'https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version',
        sourceDate: 'V8.2 released 2026-07-24; accessed 2026-10-14',
        limitation:
          'This is a vendor feature description, not a controlled comparison of prompt adherence, fidelity or rights clearance.',
      },
      {
        product: 'Gemini Apps',
        documentedUse:
          'Google documents Nano Banana 2 image generation and editing, including local edits, character consistency and combining images.',
        sourceLabel: 'Google: Generate and edit images',
        sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
        sourceDate: 'Accessed 2026-10-14',
        limitation:
          'Google notes that supported languages and countries, sign-in, age and school-account restrictions affect access; paid subscribers can also use Nano Banana Pro.',
      },
    ],
    revisions: [
      {
        recordedOn: '2026-10-14',
        summary:
          'The Adobe Firefly review date and Gemini Apps feature and access descriptions were updated after checking the current first-party documentation.',
        previousRows: [
          {
            product: 'Adobe Firefly',
            documentedUse:
              'Adobe documents image generation and editing, reference images and multiple partner models, including FLUX, Gemini, GPT Image, Imagen and Ideogram.',
            sourceLabel: 'Adobe Firefly: What’s new',
            sourceUrl: 'https://helpx.adobe.com/firefly/web/whats-new/new-features/whats-new.html',
            sourceDate: 'Updated 2026-09-18',
            limitation:
              'Model access, credits and features depend on the current Firefly plan and release; inclusion is not an endorsement.',
          },
          {
            product: 'Gemini Apps',
            documentedUse:
              'Google documents Nano Banana 2 image generation and editing, including local edits and edits using one or more uploaded images.',
            sourceLabel: 'Google: Generate and edit images',
            sourceUrl: 'https://support.google.com/gemini/answer/14286560?hl=en',
            sourceDate: 'Accessed 2026-10-14',
            limitation:
              'Google notes that language, country, sign-in, age, school-account and plan restrictions can affect availability and output options.',
          },
        ],
      },
    ],
    limitations: [
      'This is a feature comparison based on vendor documentation, not a benchmark or legal assessment of output rights.',
      '“Available” does not mean included in every plan or region. Verify account access, usage limits and terms directly with each provider.',
      'Product versions and terms can change after the dates shown. No ranking, commission claim or affiliate endorsement is made.',
    ],
    sections: [
      {
        heading: 'Editing controls are not an image-quality score',
        paragraphs: [
          'The product pages describe different routes from prompt to image. ChatGPT Images 2.5 emphasizes iterative natural-language edits, references and subject preservation; Firefly combines Adobe’s own tools with partner models; Midjourney documents version and personalization controls; Gemini describes local edits, character consistency and combining supplied images. These are useful workflow distinctions, but the sources do not test the products on the same prompts, reference assets, output sizes or review criteria. A longer feature list cannot establish which tool produces the most accurate, appealing or usable image.',
          'A production team should translate each documented feature into a concrete acceptance test. If a brief requires consistent packaging, supply the same approved reference and inspect whether the logo, label and proportions remain intact after several edits. If the task is a localized revision, check whether unrelated elements stay stable. If the task depends on multiple subjects, include those subjects in the same test set. Record the exact model or product version and the date; a vendor can alter a workflow without changing its top-level product name.',
        ],
      },
      {
        heading: 'Reference handling and repeatability',
        paragraphs: [
          'Reference-image support can help carry visual direction across a generation, but each vendor defines its own controls and boundaries. A feature description does not tell an editor how reliably a specific face, object or brand element will persist through a sequence of edits. A team should test the entire path it plans to use: initial generation, one targeted edit, a second correction, export, and any resize or crop needed for publication. Compare the final output with the original brief, not only with the most recent prompt.',
          'Repeatability should be measured separately from fidelity. Run a prompt more than once and keep the outputs, because stochastic variation can produce a result that looks strong in a single demonstration but is difficult to reproduce. Track how many attempts and corrections were required. If a workflow must deliver a specific layout or legible text, check that requirement directly rather than assuming general image-generation capability will satisfy it. The sources reviewed here do not publish a common repeatability test or a matched prompt-adherence score.',
        ],
      },
      {
        heading: 'Rights, provenance and review remain separate questions',
        paragraphs: [
          'A tool’s ability to generate or edit an image does not answer whether a particular output can be used in a campaign, whether a user has rights to the reference image, or what terms apply to the resulting file. Those questions depend on current product terms, the inputs, the intended use and local law. This comparison is not a legal opinion or a rights-clearance assessment. Before a commercial workflow, check the service terms and any customer-specific commitments, preserve a record of source assets, and route sensitive or recognizable material through the organization’s approved review.',
          'Similarly, a visible or embedded provenance signal is not the same as proof that an image depicts a real event. If a publishing workflow needs provenance, verify what metadata the export preserves and whether downstream transformations remove it. Do not describe a generated image as documentary evidence. The vendors’ feature pages support claims about product functions, but they do not establish the authenticity or truth of an individual output.',
        ],
      },
      {
        heading: 'A like-for-like test for a creative team',
        paragraphs: [
          'Use a shared brief pack with a few task types: an original concept, a controlled edit, a multi-reference composition and a correction after an intentional mistake. Provide each product with equivalent inputs where its interface permits. Define pass conditions in advance, such as preserving a named object, placing text within a safe area, keeping a subject recognizable to an authorized reviewer, or not altering an unrequested region. Save prompts, source assets, output files, version labels and any visible settings so another editor can reproduce the run.',
          'Evaluate at least three dimensions independently: adherence to the brief, number of human correction steps, and operational fit such as export format or integration into the existing design process. Add rights and accessibility review as separate gates. Do not turn a subjective preference into a universal ranking; record who judged the work and what the task required. If the team cannot reproduce an exact configuration for each service, disclose that difference instead of presenting the run as fully controlled.',
        ],
      },
    ],
    indiaContext:
      'Google’s documentation identifies country, language, age and account eligibility as conditions that may affect Gemini access. The sources do not establish comparable availability or commercial terms for India across all four services. Teams should check local account access and the terms for their own use rather than infer regional availability from this feature table.',
    keyTakeaways: [
      'Compare specific editing workflows and reference controls, not broad claims of image quality.',
      'No shared independent test in these sources establishes a product winner.',
      'Check rights, source-image permission, export behavior and provenance separately.',
      'Run repeatable briefs and measure correction effort as well as the final image.',
    ],
  },
  'coding-agent-benchmarks-compared': {
    title: 'SWE-bench Verified vs Terminal-Bench',
    description:
      'A source-led comparison of two coding-agent benchmarks, their task designs, graders and limits.',
    intro:
      'A software issue resolved in a repository and a longer command-line task are different units of work. This guide compares the public descriptions of SWE-bench Verified and Terminal-Bench 2.0; it does not rank agent systems or pool their scores.',
    criteria:
      'Criteria: task definition, environment, validation, versioning and what a passing result can support. Research sources captured 4 October 2026; the Terminal-Bench paper is arXiv:2601.11868v1.',
    sourcesReviewedOn: '2026-10-04',
    sourceReviewCadence: 'Quarterly',
    nextSourceReviewDue: '2027-01-02',
    rows: [
      {
        product: 'SWE-bench Verified',
        documentedUse: 'A human-filtered set of 500 software issue instances from real GitHub repositories. The benchmark describes review of issue clarity, test correctness and solvability.',
        sourceLabel: 'SWE-bench Verified methodology',
        sourceUrl: 'https://swebench.com/verified.html',
        sourceDate: 'Captured 2026-10-04; source page has no publication date in the capture',
        limitation: 'A curated issue set is not a representative sample of all software engineering; results also depend on agent, harness and budget.',
      },
      {
        product: 'Terminal-Bench 2.0',
        documentedUse: 'A curated set of 89 command-line tasks with containerized environments, task-specific tests and human-written solutions, as described by the paper.',
        sourceLabel: 'Terminal-Bench paper, version 1',
        sourceUrl: 'https://arxiv.org/html/2601.11868v1',
        sourceDate: 'arXiv version 1 submitted 2026-01-17; captured 2026-10-04',
        limitation: 'The paper documents residual non-determinism from hardware, external services and infrastructure; the source set does not establish a universally representative workload.',
      },
    ],
    revisions: [],
    limitations: [
      'These benchmark designs have different tasks, environments and graders; raw pass rates are not like-for-like.',
      'A test pass is evidence about the benchmark’s scoring rule, not proof of production safety, user value or broad coding ability.',
      'This page compares benchmark methodology and publishes no model leaderboard or cross-benchmark score.',
    ],
    sections: [
      {
        heading: 'The task unit determines the question',
        paragraphs: [
          'SWE-bench Verified starts from a software issue linked to an existing repository. The agent must inspect the code and produce a change intended to resolve that issue, after which the benchmark harness checks whether the patch satisfies the associated tests. Its Verified subset contains 500 instances that human annotators reviewed for clarity, test quality and solvability. This curation is useful evidence about the dataset design, but it does not transform the set into a random sample of bug reports or a complete measure of software engineering.',
          'Terminal-Bench takes a broader command-line framing. Its paper describes 89 curated tasks, each packaged with instructions, a container image, tests and a human-written solution. A task may require a sequence of environment operations rather than a single repository patch. The benchmark therefore asks how an agent performs in selected terminal-based work under the specified environment. The paper itself notes remaining sources of variation, including hardware and external-service behavior, so packaging helps repeatability without making every run perfectly deterministic.',
        ],
      },
      {
        heading: 'Validation is shaped by the grader',
        paragraphs: [
          'A grader is part of the benchmark definition. In SWE-bench Verified, tests are connected to the issue and repository; in Terminal-Bench, task tests inspect whether the requested state was achieved in the environment. Passing provides a bounded result under those tests. It cannot guarantee that a change is maintainable, that an unstated requirement was met, or that production systems remain secure. A test can be too narrow, and a task can omit organizational constraints that matter in practice.',
          'The benchmark sources also describe different ways to select and package tasks. SWE-bench Verified reports human review of the issue and test patch; Terminal-Bench reports curated environments and human-written solutions, with manual verification used to check solvability and shortcuts. These are design choices that affect what a score means. They are not an identical validation pipeline, and a comparison should not assume that two percentage values represent the same difficulty or error tolerance.',
        ],
      },
      {
        heading: 'Why published scores do not form one ranking',
        paragraphs: [
          'Model results can depend on much more than the model family: exact version, agent scaffold, tool permissions, repository state, time and token budgets, network access, retry policy, and whether the run had human assistance. SWE-bench’s own site distinguishes broad agent leaderboard results from a constrained language-model comparison setup. Terminal-Bench includes its own environments and task-specific checks. A result without these conditions is not enough to reproduce or compare the run.',
          'Even when an organization has results on both benchmarks, the difference between scores cannot be read as a gain or loss in general coding ability. The tasks differ in scope, data and evaluation. The count of 500 versus 89 is not a direct measure of difficulty or statistical reliability. If a report supplies only an aggregate, a small margin should not be treated as decisive without uncertainty and per-task information. Keep every score attached to its exact release and harness.',
        ],
      },
      {
        heading: 'Select a benchmark for the work you need',
        paragraphs: [
          'A team maintaining a large application may care most about issue resolution across its own repositories, build system and review policies. A team that expects an agent to configure environments, run tools or complete a multi-step terminal workflow may want tasks closer to those operations. The first question is not which benchmark is more prestigious; it is which test family resembles the job. Local validation remains necessary because internal dependencies, permissions, secrets handling, deployment rules and rollback procedures may be absent from public benchmark containers.',
          'Build an evaluation set with held-out examples and an acceptance rule that reflects the actual workflow. Pin the model and scaffold, provide the same tools, set a fixed budget, log retries and human interventions, and run the tests under controlled conditions. Review patch quality and security separately from task completion. For an agent that can change files or call services, include authorization checks, denied actions, interruption and recovery. Record the exact grader and source revision so future results remain interpretable.',
          'For teams in India, the useful adaptation is to select tasks from the repositories, programming languages and build systems the local team actually maintains. The benchmark descriptions do not provide an India-specific language or infrastructure slice, so local performance cannot be inferred from their global aggregate results. A team can use the public benchmark designs to structure its own held-out evaluation, but should report that local test separately and avoid describing it as a direct replication unless the same task set and harness were used.',
        ],
      },
    ],
    indiaContext:
      'For Indian software teams, the comparison supports a method rather than a country-specific performance claim: select tasks from the repositories, languages, build systems and deployment controls the team actually maintains. The cited benchmark descriptions do not report an India-specific slice, local-language code result or regional deployment comparison.',
    keyTakeaways: [
      'SWE-bench Verified tests selected repository issue resolution; Terminal-Bench tests selected terminal workflows.',
      'Their 500 and 89 task counts do not make the scores directly comparable.',
      'A pass is tied to the specific harness, environment, agent scaffold and budget.',
      'Use local held-out tasks and review code quality, authorization and recovery separately.',
    ],
  },
  'hosted-vs-open-weight-models': {
    title: 'Hosted APIs vs Open-Weight Models',
    description:
      'Compare provider-hosted Gemini access with documented Gemma and Mistral open-weight deployment options.',
    intro:
      'Hosted APIs and downloadable model weights shift control and operational work in different ways. This guide compares published access, terms and deployment responsibilities for Gemini 3.8 Flash, Gemma 4 and Mistral Small 4; it does not claim a model-quality winner.',
    criteria:
      'Criteria: access route, published specifications, service or license terms, hardware responsibility and data boundary. Sources captured 4–6 October 2026; verify current terms before deployment.',
    sourcesReviewedOn: '2026-10-06',
    sourceReviewCadence: 'Monthly',
    nextSourceReviewDue: '2026-11-05',
    rows: [
      {
        product: 'Gemini 3.8 Flash API',
        documentedUse: 'Provider-operated API; captured model card documents text, image, audio and video input and a context window up to one million tokens.',
        sourceLabel: 'Gemini 3.8 Flash model card',
        sourceUrl: 'https://deepmind.google/models/model-cards/gemini-3-8-flash',
        sourceDate: 'Published 2026-09-02; captured 2026-10-04',
        limitation: 'API terms vary by service tier; the capture does not establish a customer-managed model-weight deployment or independent quality result.',
      },
      {
        product: 'Gemma 4',
        documentedUse: 'Google documents model variants, context options, quantization and deployment guidance for downloadable weights.',
        sourceLabel: 'Gemma 4 model overview',
        sourceUrl: 'https://ai.google.dev/gemma/docs/core',
        sourceDate: 'Captured 2026-10-04; page date not stated in the capture',
        limitation: 'Hardware fit and output quality depend on the exact artifact, runtime and workload; the overview is not an independent benchmark.',
      },
      {
        product: 'Mistral Small 4',
        documentedUse: 'Mistral’s model card lists open weights under Apache 2.0, 119B total parameters, 6.5B active parameters and a 256K context window.',
        sourceLabel: 'Mistral Small 4 model card',
        sourceUrl: 'https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03',
        sourceDate: 'Published 2026-03-16; captured 2026-10-04',
        limitation: 'Active parameters are not a storage or memory estimate; no independent hardware-fit or performance test is provided by the card.',
      },
    ],
    revisions: [],
    limitations: [
      'Open weights are not synonymous with open training data, complete transparency or unrestricted rights; inspect the exact artifact license.',
      'This report does not compare quality, latency, hardware cost, or total cost on a shared workload.',
      'Gemini API terms described here apply to the cited service and tier, not all Google products or other providers.',
    ],
    sections: [
      {
        heading: 'The control boundary is the first decision',
        paragraphs: [
          'A provider-hosted API lets the customer call a service without operating the model runtime. The provider controls the underlying serving infrastructure, while the customer still owns decisions about prompts, application permissions, data handling and the endpoint selected. With downloadable weights, an organization can choose more of the runtime and network boundary, but must plan for hardware, installation, patching, monitoring, capacity and incident response. Neither arrangement is automatically private or automatically suitable; the complete application path determines where user data travels.',
          '“Open weight” describes access to model parameters under stated terms. It does not by itself mean the training data, training process or every safety evaluation is public. It also does not remove license obligations or prove that a particular derivative is suitable for commercial use. Conversely, a managed API does not automatically mean the customer has no meaningful controls; the contract and product configuration determine what can be set. Compare exact service and artifact identifiers instead of treating broad labels as legal or technical guarantees.',
        ],
      },
      {
        heading: 'Published specifications do not settle deployment fit',
        paragraphs: [
          'The three records publish different kinds of specifications. The Gemini card reports modalities and a large context allowance; Gemma documentation explains variants and quantization options; Mistral lists total and active parameter counts and a context limit. Those statements help an operator plan a test, but they do not establish equivalent performance or resource use. A context limit is not a promise that a full-context request will meet a desired latency or cost, and an active parameter count is not the size of the complete stored model.',
          'For open-weight models, memory needs depend on the artifact, precision, runtime overhead, context length, batch size and concurrency. Quantization can reduce storage or compute requirements but may affect output behavior, which must be measured for the task. For a hosted API, the provider abstracts hardware but billing, quotas, service regions and operational limits remain relevant. Do not compare downloadable weights with per-token API rates as if they were the same unit of cost.',
        ],
      },
      {
        heading: 'Terms must be checked at the endpoint',
        paragraphs: [
          'The captured Gemini API Additional Terms distinguish unpaid and paid service handling. The source says unpaid inputs and outputs may be used to improve products and may be processed by human reviewers; it instructs users not to submit sensitive, confidential or personal information. It describes different terms for paid services and a specific regional exception. This is a dated, service-specific source. It should not be generalized to Gemini consumer apps, other Google Cloud services, or the API terms in force after the capture date.',
          'For an organization evaluating any hosted route, check the exact service tier, account, endpoint, region, retention settings, logging behavior and contract. For a self-hosted route, inspect the license for the actual weight file and dependencies, then map what the surrounding application sends to external services. Weights may stay on a controlled network while telemetry, retrieval, authentication or monitoring still crosses a boundary. Document each data flow rather than relying on the word “local.”',
        ],
      },
      {
        heading: 'Build a total-cost comparison around accepted work',
        paragraphs: [
          'A useful estimate includes more than API pricing or a hardware quote. For a hosted model, add input and output usage, cache behavior, retries, tools, storage, support and any regional or service-tier differences. For a self-hosted model, include hardware purchase or rental, power, utilization, engineering, patching, monitoring, spare capacity, upgrades and recovery. Count the human time spent reviewing and correcting outputs for both routes. A lower infrastructure bill can still be worse value if the workflow requires more failed attempts or costly rework.',
          'Measure cost per accepted task using the same held-out examples and quality threshold. Record exact model revision, endpoint or artifact, prompt length, output length, concurrency, quantization, tools and retry policy. Report accuracy, latency and cost separately; avoid hiding a failure in an average. If a data-handling requirement is mandatory, use it as an eligibility gate before comparing price. This method yields a workload-specific estimate without claiming that one model or deployment arrangement is universally cheaper.',
        ],
      },
    ],
    indiaContext:
      'The model records do not establish India-specific latency, local availability, language quality, residency or price. Before deployment from India, verify the selected endpoint’s region and terms, and test supported Indian languages with representative material. Self-hosting may change the data boundary, but it also transfers operations and capacity responsibilities to the deploying organization.',
    keyTakeaways: [
      'Hosted APIs and open weights distribute control and operating responsibilities differently.',
      'Model-card context and parameter counts are not equivalent hardware or quality measurements.',
      'Check the exact endpoint terms and the full application data path.',
      'Compare cost per accepted task, including operations, utilization, review and recovery.',
    ],
  },
  'indiaai-vs-commercial-cloud': {
    title: 'IndiaAI Shared Compute vs Commercial Cloud',
    description:
      'Compare IndiaAI Compute Portal access with commercial cloud on eligibility, allocation, billing and capacity evidence.',
    intro:
      'A subsidized shared-compute programme and commercial on-demand cloud are different access arrangements. This guide compares the documented application and billing mechanisms without treating their accelerator prices or available capacity as directly equivalent.',
    criteria:
      'Criteria: eligibility, access path, allocation evidence, billing basis, capacity commitments and operational responsibility. Portal and source records captured 3–4 October 2026; live terms should be rechecked.',
    sourcesReviewedOn: '2026-10-04',
    sourceReviewCadence: 'Monthly',
    nextSourceReviewDue: '2026-11-03',
    rows: [
      {
        product: 'IndiaAI Compute Portal',
        documentedUse: 'A national programme portal for eligible researchers, students, startups, MSMEs and other users to apply for AI compute and related cloud services.',
        sourceLabel: 'IndiaAI Compute Portal',
        sourceUrl: 'https://www.compute.indiaai.gov.in/',
        sourceDate: 'Captured 2026-10-03; portal page has no publication date in the capture',
        limitation: 'Eligibility, review, subsidy and allocation terms require live confirmation; portal allocation rows are not a census of currently schedulable capacity.',
      },
      {
        product: 'IndiaAI allocation register',
        documentedUse: 'The public hub displays dated project-level allocation rows with accelerator type, provider, project duration and related fields.',
        sourceLabel: 'IndiaAI Compute Capacity: GPU Compute Allocation',
        sourceUrl: 'https://indiaai.gov.in/hub/indiaai-compute-capacity',
        sourceDate: 'Live capture 2026-10-04; page as-of date not stated',
        limitation: 'Visible records do not prove installation, active use, remaining capacity or present availability to another applicant.',
      },
      {
        product: 'Amazon EC2 On-Demand',
        documentedUse: 'AWS documents pay-as-you-go instance billing by the second, a 60-second minimum, and no long-term commitment for On-Demand instances.',
        sourceLabel: 'Purchasing On-Demand EC2 instances',
        sourceUrl: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html',
        sourceDate: 'Captured 2026-10-04; page date not stated',
        limitation: 'This general EC2 page does not establish AI accelerator availability in India, matching hardware, guaranteed capacity or an equivalent IndiaAI price.',
      },
    ],
    revisions: [],
    limitations: [
      'The source set does not support a like-for-like price comparison: accelerator type, region, term, support and subsidy basis differ or are not consistently stated.',
      'A dated allocation record is not proof of delivered, installed, active or currently schedulable compute.',
      'This guide compares documented access processes, not performance, service quality or the success rate of applications.',
    ],
    sections: [
      {
        heading: 'The access path is not the same product',
        paragraphs: [
          'IndiaAI Compute is described by its portal as a programme that makes compute and related cloud services available to eligible users. The captured eligibility page names researchers and academia, startups and MSMEs, students and fellowship participants, with criteria that differ by applicant group. Users should therefore begin with eligibility and application requirements rather than treat the portal as a general public cloud console. The portal page itself is a live source without a captured publication date, so its rules should be checked again at application time.',
          'Commercial cloud On-Demand compute is described differently. AWS says an EC2 On-Demand instance can be launched without a long-term commitment and is billed by the second with a 60-second minimum. That describes a billing arrangement, not a guarantee that a particular accelerator is available in a particular Indian region. Commercial access may reduce the need for programme eligibility review, but users still need to check account quotas, instance availability, region, service limits and the total configuration they will pay for.',
        ],
      },
      {
        heading: 'Allocation records are not a live inventory',
        paragraphs: [
          'The IndiaAI allocation-register capture found project-level rows with fields such as GPU count and type, provider, user category, project duration and dates. The page does not state an overall current schedulable total or establish that a row has been delivered, installed, commissioned, started, or remains available. It would therefore be misleading to add visible allocation rows and present the sum as live supply. A public record can improve transparency while still leaving a gap between approval, delivery and actual access.',
          'Commercial cloud availability also has limits, but the cited EC2 billing page does not provide an India-specific AI accelerator inventory or capacity commitment. A user must check the live service page, account quota and region-specific capacity. Neither the public allocation register nor the generic On-Demand page supplies enough matched data to compare current wait times or guaranteed capacity. The honest answer may be that the user must request a quote or verify availability directly.',
        ],
      },
      {
        heading: 'Price comparisons need a common denominator',
        paragraphs: [
          'A rate comparison is valid only when it refers to a sufficiently similar accelerator, region, billing period, software configuration, support level and utilization assumption. The IndiaAI portal’s rate calculator capture has no explicit update date and does not create a directly comparable all-in price against a public cloud page. Programme subsidy and application decisions also affect the effective cost for a user. The available evidence does not support a numeric claim that one route is cheaper than another for a defined workload.',
          'A team preparing a budget should record the exact accelerator model and count, region, memory, storage, network, software, discounts or subsidy, minimum commitment, setup time and support. It should include idle time and the cost of waiting for an allocation, not only the hourly rate. For a short experiment, flexibility may matter more than the lowest theoretical unit price. For a longer research project, a supported allocation may have value even when terms differ, but that is a project-specific judgment rather than a general ranking.',
        ],
      },
      {
        heading: 'Operational responsibility follows the route',
        paragraphs: [
          'An applicant using a shared programme needs to understand how proposals are reviewed, how usage is scheduled, what happens when a project changes, and which party provides technical support. The portal capture describes an application and provider ecosystem, but the available records do not establish a universal service-level guarantee. Applicants should preserve their approval, allocation scope, permitted use and support contact details, and confirm whether the allocation can be extended or modified.',
          'With commercial cloud, the user typically configures the instance and account controls, manages quotas, and monitors charges, but must still read the service terms and regional conditions. Either route requires security design: protect credentials, restrict access, track stored datasets and model outputs, and plan how to delete or retain project data. The difference is not public versus private in a simple sense; it is a choice between processes, contracts and operational responsibilities that must be checked in context.',
        ],
      },
    ],
    indiaContext:
      'IndiaAI’s application and allocation process is specifically situated in India and may be relevant to eligible local research and startup projects. The evidence does not establish that every Indian applicant qualifies, that a listed accelerator is presently available, or that a public allocation provides the same support and flexibility as a commercial service. Check current criteria, project dates and terms before relying on either route.',
    keyTakeaways: [
      'IndiaAI is an eligibility- and application-based programme; EC2 On-Demand is a commercial billing model.',
      'Allocation records do not establish live or schedulable capacity.',
      'Available sources do not support a like-for-like price or service-level winner.',
      'Compare the same accelerator, region, term, support and utilization before budgeting.',
    ],
  },
  'provenance-controls-compared': {
    title: 'C2PA, Watermarks and AI-Image Detectors',
    description:
      'Compare provenance credentials, watermarks and image classifiers by the evidence each can establish.',
    intro:
      'A signed provenance record, an embedded watermark and an image classifier inspect different signals. This guide compares their purposes and limitations; none is a universal test of whether an image is true.',
    criteria:
      'Criteria: signal inspected, supported question, failure modes and evidence type. Sources include C2PA Specification 2.4, 2026 deployment guidance, one 2026 security preprint and one ICLR 2024 detector study.',
    sourcesReviewedOn: '2026-10-05',
    sourceReviewCadence: 'Quarterly',
    nextSourceReviewDue: '2027-01-03',
    rows: [
      {
        product: 'C2PA Content Credentials',
        documentedUse: 'A signed manifest can make provenance assertions and certain asset-history information inspectable by a compatible verifier.',
        sourceLabel: 'C2PA Technical Specification 2.4',
        sourceUrl: 'https://spec.c2pa.org/specifications/specifications/2.4/index.html',
        sourceDate: 'Version 2.4; captured 2026-10-05',
        limitation: 'A valid signature supports the signed assertion under verifier policy; it does not prove that the depicted event is true.',
      },
      {
        product: 'Watermark detectors',
        documentedUse: 'A compatible detector looks for a signal embedded by a particular watermarking method.',
        sourceLabel: 'ICLR 2024 detector robustness study',
        sourceUrl: 'https://proceedings.iclr.cc/paper_files/paper/2024/file/744e09d3213ee53de88f04164a9b06ab-Paper-Conference.pdf',
        sourceDate: 'Published at ICLR 2024; captured 2026-10-04',
        limitation: 'The experiments cover specific methods and attacks; results do not establish how every current watermark survives every transformation.',
      },
      {
        product: 'AI-image classifiers',
        documentedUse: 'A classifier estimates whether an image matches patterns associated with generated or manipulated images in its training and evaluation setting.',
        sourceLabel: 'ICLR 2024 detector robustness study',
        sourceUrl: 'https://proceedings.iclr.cc/paper_files/paper/2024/file/744e09d3213ee53de88f04164a9b06ab-Paper-Conference.pdf',
        sourceDate: 'Published at ICLR 2024; captured 2026-10-04',
        limitation: 'A classification score is model- and threshold-dependent evidence, not a signed source record or a definitive authenticity judgment.',
      },
    ],
    revisions: [],
    limitations: [
      'The methods answer different questions and are not compared on a shared image set or common authenticity score.',
      'The independent C2PA security findings come from one arXiv preprint and should not be generalized as settled consensus.',
      'Absence of a credential or watermark does not prove an image is fake; presence does not prove depicted events are true.',
    ],
    sections: [
      {
        heading: 'Three signals that should not be collapsed',
        paragraphs: [
          'C2PA credentials are structured provenance claims associated with an asset and protected by a cryptographic signature. A verifier can inspect a manifest, the asset binding and the signer under its trust policy. A watermark detector instead looks for a signal placed into the image by a particular method. A classifier estimates whether visual patterns resemble examples it was trained or evaluated on. These are not three brands of the same test: one examines a signed record, one searches for an embedded marker, and one produces a model-based inference.',
          'The distinction changes how results should be described. “A credential was verified” is not equivalent to “the image is authentic”; the signature says something about the credential and its claims. “A watermark was detected” means that a compatible detector found the signal it was designed to find. “The classifier returned a high score” means the image met that system’s learned decision rule. None of those outcomes independently confirms where a photograph was taken, when it was captured, or whether a described event occurred.',
        ],
      },
      {
        heading: 'Provenance depends on the claim and verifier',
        paragraphs: [
          'The C2PA specification describes mechanisms for signed assertions and binding a manifest to an asset. The deployment guidance explains that organizations should select tools, generate credentials where applicable, verify them and present status to readers. A trustworthy interface needs more than a green badge: it should tell users what the verifier checked, who signed the record, whether the credential is valid or unavailable, and what the status does not establish. A missing credential should not be shown as evidence of manipulation.',
          'A 2026 independent arXiv preprint reports security concerns involving timestamp alteration, revoked or compromised certificates and differences among validators in the versions and implementations it examined. That is a research finding from one study, not a consensus verdict that every credential is compromised. It does support testing the verifier’s trust policy and behavior, documenting the versions involved and retaining enough information to reproduce a check. High-stakes publishers should treat credential validation as one component of verification rather than a substitute for editorial source checks.',
        ],
      },
      {
        heading: 'Watermark robustness is method-specific',
        paragraphs: [
          'A watermark is useful only if the intended detector can reliably find it under the transformations that occur in the target workflow. Cropping, resizing, compression, screenshots and deliberate attacks may change an embedded signal, but the effect depends on the method and image processing. The ICLR 2024 study evaluates particular watermarking methods and reports a tradeoff between evasion and spoofing errors under its tested diffusion-purification conditions. It also analyzes detector approaches separately. Those results should be cited with their experimental scope; they do not show that every watermark in current products fails or succeeds in the same way.',
          'For a publisher or platform, a watermark is most defensible as a signal with a known issuer, detector and version. Test the specific signal after the ordinary publication pipeline, including the actual export and compression steps. Record the threshold and preserve the original image. A watermark hit may help route content for closer review, but it does not provide an edit history or prove authorship unless the system’s design and key management support that particular assertion.',
        ],
      },
      {
        heading: 'Classifiers are triage, not ground truth',
        paragraphs: [
          'Image classifiers can be useful when a newsroom receives a file without an available provenance record, but their scores depend on training data, image sources, transformations and threshold. A detector evaluated on one family of generators may not behave the same way on new models, heavily edited images or ordinary photographs from a different distribution. A score should therefore be accompanied by the model version and the decision threshold, and the system should be tested on examples representative of the images it will actually encounter.',
          'The evaluation should distinguish false positives from false negatives. A false positive can cast suspicion on an authentic image; a false negative can let a synthetic image pass. The acceptable balance depends on the decision and its consequences. Do not use a detector result as a sole basis for a high-impact moderation or reporting decision. Combine technical signals with source history, independent context, location and date checks, and human review. If the available evidence remains mixed, state that uncertainty rather than forcing a binary answer.',
        ],
      },
    ],
    indiaContext:
      'The source set does not evaluate these controls on Indian-language publishing workflows, regional image distributions or India-specific platforms. Indian publishers can apply the same layered method, but should validate tools against their own sources, formats and transformation chain before using a score or status display in an editorial decision.',
    keyTakeaways: [
      'C2PA, watermarks and classifiers inspect distinct signals; there is no shared winner in this evidence set.',
      'A credential or watermark does not establish that an image depicts a true event.',
      'A detector score needs a version, threshold, representative validation and human review.',
      'Preserve the original file and explain disagreement between controls instead of hiding it.',
    ],
  },
};

export function ComparisonReportContent({
  reportSlug,
}: {
  reportSlug: ComparisonReportSlug;
}) {
  const report = comparisonReports[reportSlug];

  return (
    <article data-testid={`comparison-report-${reportSlug}`}>
      <p className="eyebrow text-primary">Global AI News · Comparison report</p>
      <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[.9] tracking-[-.03em] md:text-8xl">
        {report.title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
        {report.intro}
      </p>
      <p className="mt-5 border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">
        {report.criteria}
      </p>

      <div className="mt-10 overflow-x-auto border border-foreground/15">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="bg-surface-muted px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {report.title} · sources checked {report.sourcesReviewedOn} · {report.sourceReviewCadence.toLowerCase()} review · next due {report.nextSourceReviewDue}
          </caption>
          <thead className="bg-secondary/50">
            <tr>
              <th scope="col" className="w-40 border-b border-foreground/15 p-4">Product</th>
              <th scope="col" className="min-w-64 border-b border-foreground/15 p-4">Documented workflow</th>
              <th scope="col" className="min-w-52 border-b border-foreground/15 p-4">Evidence and date</th>
              <th scope="col" className="min-w-64 border-b border-foreground/15 p-4">Limitations</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.map((row) => (
              <tr key={row.product} className="align-top">
                <th scope="row" className="border-b border-foreground/10 p-4 font-serif text-xl">
                  {row.product}
                </th>
                <td className="border-b border-foreground/10 p-4 leading-6">{row.documentedUse}</td>
                <td className="border-b border-foreground/10 p-4 leading-6">
                  <a
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline decoration-primary/40 underline-offset-2"
                  >
                    {row.sourceLabel}
                  </a>
                  <span className="mt-2 block text-xs text-muted-foreground">{row.sourceDate}</span>
                </td>
                <td className="border-b border-foreground/10 p-4 leading-6 text-muted-foreground">
                  {row.limitation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-4xl">
        {report.sections.map((section) => (
          <section key={section.heading} className="border-t border-foreground/15 py-7">
            <h2 className="font-serif text-3xl leading-tight">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-7 text-foreground/90">{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      <section className="my-8 max-w-4xl border-y border-foreground/15 py-6">
        <h2 className="eyebrow text-primary">India ecosystem context</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{report.indiaContext}</p>
      </section>
      <section className="my-8 max-w-4xl">
        <h2 className="eyebrow text-primary">Key takeaways</h2>
        <ul className="mt-4 grid gap-3">
          {report.keyTakeaways.map((takeaway) => (
            <li key={takeaway} className="border-l-2 border-primary pl-4 text-sm leading-6">{takeaway}</li>
          ))}
        </ul>
      </section>

      {report.revisions.length > 0 && (
        <section className="mt-8 border-y border-foreground/15 py-5" aria-labelledby={`history-${reportSlug}`}>
          <h2 id={`history-${reportSlug}`} className="eyebrow text-primary">Previous reviews</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Superseded descriptions and citations are retained so editors can inspect what changed.
          </p>
          <div className="mt-4 divide-y divide-foreground/10">
            {report.revisions.map((revision) => (
              <details key={revision.recordedOn} className="py-3">
                <summary className="cursor-pointer text-sm font-medium hover:text-primary">
                  Revision recorded {revision.recordedOn}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{revision.summary}</p>
                <div className="mt-4 grid gap-4">
                  {revision.previousRows.map((row) => (
                    <article key={row.product} className="border-l-2 border-accent pl-4">
                      <h3 className="font-serif text-lg">{row.product}</h3>
                      <p className="mt-1 text-sm leading-6">{row.documentedUse}</p>
                      <a
                        href={row.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-primary underline decoration-primary/40 underline-offset-2"
                      >
                        {row.sourceLabel}
                      </a>
                      <p className="mt-1 text-xs text-muted-foreground">{row.sourceDate}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.limitation}</p>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 border-y border-foreground/15 py-5">
        <h2 className="eyebrow text-primary">Affiliate disclosure</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          No affiliate links are currently configured on this page. The product links above go to
          vendor documentation and are not commission links.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-3xl">Method and limitations</h2>
        <ul className="mt-4 grid gap-3">
          {report.limitations.map((limitation) => (
            <li key={limitation} className="border-l-2 border-accent pl-4 text-sm leading-6 text-muted-foreground">
              {limitation}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
