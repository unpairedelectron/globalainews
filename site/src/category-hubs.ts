// Editorial hub content for section pages: an introduction, recommended
// starting points, and how we cover the beat. Slugs in `startHere` are shown
// only once the article is published, so future-dated picks are safe.
import type { CategoryKey } from './site.config';

export interface CategoryHub {
  intro: string[];
  startHere: string[];
  coverage: string[];
  tracker?: { label: string; path: string };
}

export const HUBS: Record<CategoryKey, CategoryHub> = {
  models: {
    intro: [
      'A new AI model seems to launch every week, each with a benchmark chart claiming a lead. This section explains what actually changed: what the model can do, who can use it, what it costs to run, and which claims come from the company and which have been tested independently.',
      'We also explain the building blocks behind the headlines—agents, context windows, retrieval, open weights and protocols such as MCP—so you can judge the next launch yourself instead of relying on the press release.',
    ],
    startHere: ['what-is-an-ai-agent', 'context-window-vs-memory-vs-rag', 'what-is-mcp-model-context-protocol', 'gated-frontier-models-gemini-4-carbon'],
    coverage: [
      'Model specifications come from the developer’s own model card or release notes, and we link to them.',
      'Benchmark scores are labelled with who ran them and how; company-run results are never presented as independent tests.',
      'We separate a model’s announcement from its availability: who can access it, through which product, and at what price.',
    ],
  },
  policy: {
    intro: [
      'AI rules are arriving fast and in pieces: the EU AI Act’s staged deadlines, national rules on deepfakes and synthetic media, standards for content provenance, and licences that decide what “open” means. This section turns those documents into plain answers: what applies, to whom, and from when.',
      'We work from the official texts, quote the exact obligation where it matters, and say clearly when something is proposed rather than in force.',
    ],
    startHere: ['eu-ai-act-december-2026-deadlines', 'open-weights-vs-open-source-ai', 'quiet-race-watermark-everything-ai-makes'],
    coverage: [
      'Every legal date links to the official journal, gazette or regulator page it comes from.',
      'We distinguish laws in force, adopted laws not yet applicable, proposals and consultations.',
      'Our explainers are general information, not legal advice; see our disclaimer.',
    ],
  },
  india: {
    intro: [
      'India is building its own AI capacity in public: the IndiaAI Mission’s shared GPU programme, home-grown foundation models, rules for synthetic media, and a fast-growing data-centre industry. This section follows that story closely, from the official releases and tender documents rather than the headlines.',
      'Big numbers are common in Indian AI announcements. We explain what each one measures—GPUs installed versus tendered versus allocated, models announced versus downloadable—so readers can tell progress from plans.',
    ],
    tracker: { label: 'India AI tracker: rules, GPUs and models', path: '/trackers/india-ai/' },
    startHere: ['india-ai-compute-access-2026', 'india-ai-consultation-paper-what-is-law', 'indiaai-10000-gpu-tender-explained', 'indiaai-eka-1-dhir-models-explained'],
    coverage: [
      'Primary sources first: Press Information Bureau releases, MeitY and IndiaAI documents, tender papers and company filings.',
      'Figures are reported with their date, unit and status, and we flag when official numbers don’t reconcile.',
      'We cover what matters to Indian developers, startups and businesses, not just national headlines.',
    ],
  },
  infrastructure: {
    intro: [
      'AI runs on chips, data centres and electricity, and the money flowing into them is now one of the largest investment cycles in the world. This section explains the physical economy behind AI: capital spending, compute capacity, energy and water use, and what those constraints mean for prices and products.',
      'We read company filings and energy-agency reports directly, and explain why figures from different companies or agencies often can’t simply be added together.',
    ],
    tracker: { label: 'Big Tech AI capex tracker', path: '/trackers/ai-capex/' },
    startHere: ['hyperscaler-capex-2026-reconciled', 'weekly-deep-dive-cost-of-intelligence', 'india-ai-compute-access-2026'],
    coverage: [
      'Spending figures come from earnings releases, filings and calls, with the period and accounting basis stated.',
      'Energy figures distinguish data centres in general from AI specifically, and measured values from projections.',
      'We note what is guidance, what is reported, and what is an analyst estimate.',
    ],
  },
  safety: {
    intro: [
      'As AI systems gain the ability to act—browsing, logging in, running code—security and safety stop being abstract. This section covers AI incidents, agent security, model containment, detection and provenance, with practical guidance for people and teams using these tools.',
      'We explain what an incident report actually establishes, what a security feature does and does not protect, and the controls that matter in practice.',
    ],
    startHere: ['ai-agents-delegated-access-banks-passwords', 'openai-containment-incident-offline-training', 'can-ai-detectors-prove-who-wrote-it'],
    coverage: [
      'Incident accounts are attributed to whoever published them, and we say what remains unverified.',
      'Security guidance draws on standards bodies such as NIST and OWASP, not vendor marketing alone.',
      'We avoid both hype and alarm: the aim is a clear picture of the real risk and what reduces it.',
    ],
  },
  business: {
    intro: [
      'The business of AI moves markets and careers: company filings and IPOs, workforce changes, and the way AI is reshaping software development. This section reads the primary documents—S-1 filings, earnings releases, official workforce announcements and platform reports—and explains what they actually say.',
      'When a headline links layoffs, valuations or productivity to AI, we check whether the underlying source does.',
    ],
    startHere: ['anthropic-s1-governance-who-controls', 'github-octoverse-2026-agents-pull-requests', 'ai-in-workforce-plans-october-2026'],
    coverage: [
      'Financial figures come from filings and official releases, with periods clearly labelled.',
      'We separate what a company reports from how others interpret it.',
      'Nothing here is investment advice; see our disclaimer.',
    ],
  },
  research: {
    intro: [
      'AI research papers increasingly shape products, medicine and policy, but most coverage repeats the abstract. This section explains notable studies in plain English: what the researchers did, what they found, and the limits of the result.',
      'We say whether a paper is peer-reviewed or a preprint, which models and conditions were tested, and what the findings do not show.',
    ],
    startHere: ['ai-models-antibiotic-discovery', 'study-finds-word-cues-can-override-game-theory-choices-in-llms'],
    coverage: [
      'We link to the paper itself and state its review status and version.',
      'Results are described for the tested conditions only, not generalised beyond them.',
      'Where a study has commercial backing, we say so.',
    ],
  },
  guides: {
    intro: [
      'Choosing between AI tools is hard when every vendor claims to be best. These guides compare what each product actually documents—features, plans, limits and availability—using the vendors’ own documentation, reviewed on a regular schedule.',
      'We don’t rank tools by answer quality without a common test. Instead we make the trade-offs clear so you can pick what fits your work, budget and data rules.',
    ],
    startHere: ['ai-assistants-compared', 'hosted-vs-open-weight-models', 'coding-agent-benchmarks-compared'],
    coverage: [
      'Every row links to the vendor documentation it comes from, with the date it was checked.',
      'Each guide states its review cadence and when it was last reviewed.',
      'Plans and features change often; check the linked sources before you buy.',
    ],
  },
};
