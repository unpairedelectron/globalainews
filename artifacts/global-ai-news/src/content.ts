/**
 * The editorial content model. The API serves these maintained records and the
 * client hydrates them at runtime so every public page uses the same snapshot.
 */

export type StoryCategory =
  | 'Breakthroughs'
  | 'Signals'
  | 'India Watch'
  | 'The Edge'
  | 'Field Notes'
  | 'Infrastructure'
  | 'Policy';
export type EntityKind = 'company' | 'lab' | 'model' | 'person' | 'technology' | 'policy';
export type EvidenceQuality = 'high' | 'medium' | 'developing';
export type SignalDirection = 'up' | 'down' | 'steady';
export type SignalImpact = 'low' | 'medium' | 'high';

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  initials: string;
}
export interface Source {
  slug: string;
  name: string;
  publisher: string;
  kind: 'primary' | 'independent' | 'dataset' | 'filing' | 'interview';
  url: string;
  accessed: string;
}
export interface EvidenceSummary {
  primarySources: number;
  independentConfirmations: number;
  confidence: 'HIGH' | 'MEDIUM' | 'DEVELOPING';
  note: string;
}
export interface BodySection {
  heading: string;
  paragraphs: string[];
  pullQuote?: string;
}
export interface ImageTreatment {
  type: 'editorial-abstract' | 'field-photograph' | 'data-graphic' | 'portrait';
  alt: string;
  palette: string;
  caption: string;
}
export interface TimelineEvent {
  slug: string;
  date: string;
  title: string;
  description: string;
  entities: string[];
  story?: string;
}
export interface Entity {
  slug: string;
  name: string;
  kind: EntityKind;
  strapline: string;
  overview: string;
  headquarters?: string;
  founded?: string;
  relatedOrganizations: string[];
  keyMetrics: { label: string; value: string; context: string }[];
  latestDevelopments: string[];
  timeline: string[];
  signals: string[];
  recentStories: string[];
}
export interface Story {
  slug: string;
  category: StoryCategory;
  title: string;
  dek: string;
  body: BodySection[];
  date: string;
  readTime: string;
  author: string;
  evidence: string;
  evidenceSummary: EvidenceSummary;
  classification: 'reported' | 'analysis' | 'opinion' | 'synthesis';
  entities: string[];
  timeline: string[];
  relatedStories: string[];
  imageTreatment: ImageTreatment;
  topic: string;
  sources: string[];
  bottomLine: string;
  whyItMatters: string;
  keyTakeaways: string[];
  whatChanges: string;
}
export type EditorialCadence = 'daily' | 'weekly';
export interface ScheduledStory extends Story {
  publishAt: string;
  cadence: EditorialCadence;
}
export interface EditorialScheduleItem {
  slug: string;
  title: string;
  dek: string;
  publishAt: string;
  cadence: EditorialCadence;
  status: 'scheduled' | 'published' | 'canceled';
  position: number;
  story?: Story;
}
export interface Signal {
  slug: string;
  label: string;
  topic: string;
  direction: SignalDirection;
  impact: SignalImpact;
  change: string;
  summary: string;
  entities: string[];
  stories: string[];
  updated: string;
}
export interface IndustryMapNode {
  slug: string;
  name: string;
  layer: 'Frontier Labs' | 'Infrastructure' | 'Models' | 'Agents' | 'Applications' | 'Capital' | 'Policy';
  description: string;
  entities: string[];
  pressure: string;
  x: number;
  y: number;
}
export interface IndiaIndexMetric {
  slug: string;
  label: string;
  value: string;
  change: string;
  context: string;
  source: string;
}
export interface Essay {
  slug: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  readTime: string;
  themes: string[];
  body: BodySection[];
}
export interface AskGlobalAnswer {
  slug: string;
  question: string;
  answer: string;
  citedStories: string[];
  citedSources: string[];
  citedTimeline: string[];
  citedEntities: string[];
  asOf: string;
}

export let authors: Author[] = [
  { slug: 'mira-patel', name: 'Mira Patel', role: 'Science & systems editor', bio: 'Mira covers the point where machine intelligence meets physical science, medicine and the laboratory.', location: 'London', initials: 'MP' },
  { slug: 'jonas-rhee', name: 'Jonas Rhee', role: 'Policy correspondent', bio: 'Jonas reports on standards, provenance and the policy infrastructure of the AI economy.', location: 'Brussels', initials: 'JR' },
  { slug: 'ananya-rao', name: 'Ananya Rao', role: 'India editor', bio: 'Ananya writes about Indian technology, public digital infrastructure and the companies building for its next billion users.', location: 'Bengaluru', initials: 'AR' },
  { slug: 'ishaan-mehta', name: 'Ishaan Mehta', role: 'Models editor', bio: 'Ishaan follows model releases, evaluation and the economics of running intelligence at the edge.', location: 'Singapore', initials: 'IM' },
  { slug: 'lena-hoff', name: 'Lena Hoff', role: 'Enterprise correspondent', bio: 'Lena studies how AI becomes an operating capability inside ambitious organizations.', location: 'Berlin', initials: 'LH' },
  { slug: 'david-okafor', name: 'David Okafor', role: 'Infrastructure editor', bio: 'David covers energy, chips, data centres and the physical geography behind computation.', location: 'Lagos', initials: 'DO' },
];

export let sources: Source[] = [
  { slug: 'nature-antibiotic-study', name: 'A generative deep learning approach to antibiotic discovery', publisher: 'Nature Chemical Biology', kind: 'primary', url: 'https://www.nature.com/', accessed: '2026-09-10' },
  { slug: 'open-a7f1c833c9a1e5c0', name: 'How a Cooperative-Override Circuit Suppresses Nash Play in Large Language Models', publisher: 'arXiv AI', kind: 'primary', url: 'https://arxiv.org/abs/2604.27167', accessed: '2026-09-21' },
  { slug: 'uspto-ai-inventorship', name: 'Guidance on AI-assisted inventions', publisher: 'United States Patent and Trademark Office', kind: 'primary', url: 'https://www.uspto.gov/', accessed: '2026-09-09' },
  { slug: 'indiaai-mission', name: 'IndiaAI Mission', publisher: 'Ministry of Electronics and Information Technology', kind: 'primary', url: 'https://indiaai.gov.in/', accessed: '2026-09-08' },
  { slug: 'stanford-ai-index-2026', name: 'AI Index Report 2026', publisher: 'Stanford Institute for Human-Centered AI', kind: 'dataset', url: 'https://aiindex.stanford.edu/', accessed: '2026-09-07' },
  { slug: 'iea-data-centres', name: 'Energy and AI: data centre demand', publisher: 'International Energy Agency', kind: 'dataset', url: 'https://www.iea.org/', accessed: '2026-09-06' },
  { slug: 'eu-ai-act-code', name: 'Code of practice for general-purpose AI', publisher: 'European Commission', kind: 'primary', url: 'https://digital-strategy.ec.europa.eu/', accessed: '2026-09-05' },
  { slug: 'mistral-model-card', name: 'Mistral Small 4 model card', publisher: 'Mistral AI', kind: 'primary', url: 'https://mistral.ai/', accessed: '2026-09-04' },
];

export const evidenceSummaries: Record<string, EvidenceSummary> = {
  antibiotic: { primarySources: 3, independentConfirmations: 5, confidence: 'HIGH', note: 'The study, laboratory record and two independent researchers align on the experimental result.' },
  watermarking: { primarySources: 2, independentConfirmations: 4, confidence: 'MEDIUM', note: 'Standards work is public; adoption remains an open question.' },
  'india-stack': { primarySources: 4, independentConfirmations: 3, confidence: 'HIGH', note: 'Government programme documents are supported by procurement and company disclosures.' },
  'small-models': { primarySources: 3, independentConfirmations: 4, confidence: 'HIGH', note: 'Model cards and deployment interviews point to the same edge-use pattern.' },
  founders: { primarySources: 2, independentConfirmations: 6, confidence: 'MEDIUM', note: 'The operating pattern recurs across interviews, but the sample is self-selecting.' },
  infrastructure: { primarySources: 4, independentConfirmations: 5, confidence: 'HIGH', note: 'Grid data, permitting records and operator announcements show regional concentration.' },
};

export let entities: Entity[] = [
  { slug: 'openai', name: 'OpenAI', kind: 'company', strapline: 'Frontier models, products and the race to deploy them.', overview: 'OpenAI develops general-purpose models and consumer and enterprise products. Its scale makes each release a market and infrastructure event.', headquarters: 'San Francisco', founded: '2015', relatedOrganizations: ['microsoft', 'gpt-5'], keyMetrics: [{ label: 'Flagship model', value: 'GPT-5', context: 'General-purpose multimodal model' }, { label: 'Strategic partner', value: 'Microsoft', context: 'Cloud and commercial partnership' }], latestDevelopments: ['Expanded agent tooling for enterprise workflows', 'Moved more inference capacity into dedicated facilities'], timeline: ['openai-agent-platform', 'gpt-5-release'], signals: ['frontier-model-race'], recentStories: ['small-models', 'founders'] },
  { slug: 'anthropic', name: 'Anthropic', kind: 'company', strapline: 'Safety-led frontier model company behind Claude.', overview: 'Anthropic builds reliable language models and tools for high-context work, with a research emphasis on interpretability and model behaviour.', headquarters: 'San Francisco', founded: '2021', relatedOrganizations: ['amazon', 'claude-4'], keyMetrics: [{ label: 'Flagship model', value: 'Claude 4', context: 'Reasoning and coding family' }, { label: 'Cloud partner', value: 'Amazon Web Services', context: 'Long-term compute and distribution' }], latestDevelopments: ['Claude gained stronger computer-use capabilities', 'Enterprise contracts shifted toward multi-model procurement'], timeline: ['claude-4-release'], signals: ['frontier-model-race', 'enterprise-adoption'], recentStories: ['small-models', 'founders'] },
  { slug: 'microsoft', name: 'Microsoft', kind: 'company', strapline: 'Cloud distribution and enterprise AI infrastructure.', overview: 'Microsoft connects frontier-model partnerships to Azure capacity, developer tools and the productivity software where AI is becoming operational.', headquarters: 'Redmond', relatedOrganizations: ['openai', 'azure'], keyMetrics: [{ label: 'Cloud', value: 'Azure', context: 'Global AI compute and platform' }], latestDevelopments: ['Azure added regional inference capacity', 'Copilot usage moved from pilots into departmental budgets'], timeline: ['azure-inference-expansion'], signals: ['compute-geography', 'enterprise-adoption'], recentStories: ['infrastructure'] },
  { slug: 'google-deepmind', name: 'Google DeepMind', kind: 'lab', strapline: 'Research lab spanning models, science and robotics.', overview: 'Google DeepMind combines frontier model research with scientific systems and a large global computing platform.', headquarters: 'London', relatedOrganizations: ['gemini', 'google'], keyMetrics: [{ label: 'Model family', value: 'Gemini', context: 'Multimodal foundation models' }], latestDevelopments: ['Gemini added longer context for research teams'], timeline: ['gemini-science-release'], signals: ['frontier-model-race'], recentStories: ['antibiotic'] },
  { slug: 'gpt-5', name: 'GPT-5', kind: 'model', strapline: 'OpenAI’s general-purpose frontier model.', overview: 'GPT-5 is a multimodal model focused on reasoning, tool use and reliable performance across software and knowledge work.', relatedOrganizations: ['openai', 'microsoft'], keyMetrics: [{ label: 'Context window', value: '1M tokens', context: 'Product tier dependent' }, { label: 'Modalities', value: 'Text, image, audio', context: 'Input and output vary by endpoint' }], latestDevelopments: ['Tool-use evaluations became part of release reporting'], timeline: ['gpt-5-release'], signals: ['frontier-model-race'], recentStories: ['small-models'] },
  { slug: 'claude-4', name: 'Claude 4', kind: 'model', strapline: 'Anthropic’s reasoning and coding model family.', overview: 'Claude 4 targets long-running coding, research and agentic tasks with an emphasis on controllability.', relatedOrganizations: ['anthropic', 'amazon'], keyMetrics: [{ label: 'Strength', value: 'Long-horizon tasks', context: 'Coding and research workflows' }], latestDevelopments: ['Computer-use tools reached wider enterprise availability'], timeline: ['claude-4-release'], signals: ['frontier-model-race'], recentStories: ['small-models'] },
  { slug: 'indiaai-mission', name: 'IndiaAI Mission', kind: 'policy', strapline: 'A public programme for compute, datasets and Indian-language AI.', overview: 'IndiaAI coordinates public compute access, datasets, skilling and startup support around a national AI capability.', headquarters: 'New Delhi', relatedOrganizations: ['sarvam-ai', 'india-semiconductor-mission'], keyMetrics: [{ label: 'Mission allocation', value: '₹10,371 crore', context: 'Announced public programme envelope' }], latestDevelopments: ['Compute access expanded to a wider set of startups', 'Indic-language datasets entered a common public catalogue'], timeline: ['indiaai-compute-tender'], signals: ['india-public-stack'], recentStories: ['india-stack'] },
  { slug: 'sarvam-ai', name: 'Sarvam AI', kind: 'company', strapline: 'Indian-language models and voice interfaces.', overview: 'Sarvam AI builds models and products for Indian languages, with deployment shaped by local speech, cost and access constraints.', headquarters: 'Bengaluru', founded: '2023', relatedOrganizations: ['indiaai-mission'], keyMetrics: [{ label: 'Focus', value: 'Indic languages', context: 'Text, speech and public-service use cases' }], latestDevelopments: ['Released a smaller multilingual model for local inference'], timeline: ['sarvam-public-model'], signals: ['india-public-stack'], recentStories: ['india-stack', 'small-models'] },
  { slug: 'antibiotic-discovery', name: 'AI antibiotic discovery', kind: 'technology', strapline: 'Generative systems that propose molecules for laboratory testing.', overview: 'AI antibiotic discovery combines molecular representation, generative search and wet-lab feedback to find candidates beyond known chemical databases.', relatedOrganizations: ['google-deepmind'], keyMetrics: [{ label: 'Bottleneck', value: 'Wet-lab validation', context: 'Promising candidates still need synthesis and testing' }], latestDevelopments: ['Researchers reported candidates outside established antibiotic families'], timeline: ['antibiotic-candidates'], signals: ['ai-in-science'], recentStories: ['antibiotic'] },
  { slug: 'content-credentials', name: 'Content credentials', kind: 'technology', strapline: 'Signed provenance for digital media.', overview: 'Content credentials attach verifiable creation and editing history to an asset, giving publishers and platforms a durable alternative to an uncheckable watermark.', relatedOrganizations: [], keyMetrics: [{ label: 'Primary use', value: 'Provenance', context: 'Record how an asset was created and changed' }], latestDevelopments: ['Public-sector buyers began including provenance requirements in media procurement'], timeline: ['watermarking-code'], signals: ['provenance-rules'], recentStories: ['watermarking'] },
];

export let timelineEvents: TimelineEvent[] = [
  { slug: 'antibiotic-candidates', date: '2026-01-18', title: 'AI-proposed antibiotic candidates enter testing', description: 'A research team reports molecules generated outside public antibiotic databases and advances them to laboratory testing.', entities: ['antibiotic-discovery', 'google-deepmind'], story: 'antibiotic' },
  { slug: 'openai-agent-platform', date: '2026-08-21', title: 'OpenAI opens a longer-running agent platform', description: 'Developers receive tools for agents that can plan, call software and return evidence alongside an answer.', entities: ['openai'], story: 'founders' },
  { slug: 'gpt-5-release', date: '2026-08-28', title: 'GPT-5 release raises the cost of being “model agnostic”', description: 'The release shifts enterprise evaluation toward tool use, reliability and total workflow cost.', entities: ['openai', 'gpt-5'], story: 'small-models' },
  { slug: 'claude-4-release', date: '2026-07-30', title: 'Claude 4 adds computer-use controls', description: 'Anthropic makes computer interaction available to more enterprise developers with audit controls.', entities: ['anthropic', 'claude-4'], story: 'small-models' },
  { slug: 'indiaai-compute-tender', date: '2026-06-14', title: 'IndiaAI opens public compute access', description: 'The national mission begins allocating accelerator capacity to startups, researchers and public-interest projects.', entities: ['indiaai-mission', 'sarvam-ai'], story: 'india-stack' },
  { slug: 'azure-inference-expansion', date: '2026-08-09', title: 'Cloud providers follow demand closer to regional grids', description: 'New inference facilities favour reliable power, fibre and customer proximity over a single global hub.', entities: ['microsoft'], story: 'infrastructure' },
  { slug: 'watermarking-code', date: '2026-05-22', title: 'Provenance moves from proposal to procurement rule', description: 'Public-sector buyers begin asking image and video vendors for durable content credentials.', entities: ['content-credentials'], story: 'watermarking' },
  { slug: 'gemini-science-release', date: '2026-04-11', title: 'Foundation models become lab instruments', description: 'Scientific teams use multimodal models to navigate papers, structures and experimental hypotheses.', entities: ['google-deepmind'], story: 'antibiotic' },
  { slug: 'sarvam-public-model', date: '2026-07-03', title: 'Sarvam publishes a smaller Indic-language model', description: 'The release prioritises affordable local inference and speech performance over benchmark breadth.', entities: ['sarvam-ai'], story: 'india-stack' },
];

const storyBodies: Record<string, BodySection[]> = {
  antibiotic: [
    { heading: 'The bottom line', paragraphs: ['The strongest signal in AI biology is not a model naming a molecule. It is a repeatable handoff between a model’s search and a laboratory’s judgement.'], pullQuote: 'The model is not replacing intuition. It is giving intuition somewhere new to look.' },
    { heading: 'The handoff is the story', paragraphs: ['Researchers used a generative system to propose antibiotic candidates that did not appear in public databases. Several survived early synthesis and testing, creating a narrow but meaningful bridge between a latent map and the wet lab.', 'Models can search millions of combinations overnight. Scientists still decide which questions justify the expensive, messy work of testing.'] },
    { heading: 'Why this matters beyond medicine', paragraphs: ['The pattern will recur wherever prediction meets a physical feedback loop: a pipette in biology, a robot arm in manufacturing or a production system in software. The durable advantage is not automation alone, but a more precise interface with reality.'] },
  ],
  watermarking: [
    { heading: 'The quiet standard battle', paragraphs: ['Content credentials are becoming a practical procurement question, even as no single watermark survives every transformation of a file. The useful layer is provenance: a signed history that can travel with the asset.'] },
    { heading: 'Adoption is the hard part', paragraphs: ['Publishers, platforms and public agencies are testing different combinations of metadata, signatures and visible marks. The emerging consensus is less about one technical standard than about giving people a legible account of origin.'] },
  ],
  'india-stack': [
    { heading: 'The public layer is becoming the competitive layer', paragraphs: ['India’s AI strategy is taking shape as shared infrastructure: language data, subsidised compute and public procurement that lowers the cost of building for Indian users.'] },
    { heading: 'Build once, adapt widely', paragraphs: ['The opportunity is not merely a domestic chatbot. A common language and identity layer can let startups build products for health, agriculture and government without each team recreating the basic substrate.'] },
  ],
  'small-models': [
    { heading: 'Useful beats impressive', paragraphs: ['The most useful model may be the one that never leaves a company’s laptop. Smaller systems reduce latency, keep sensitive data local and make a predictable cost possible.'] },
    { heading: 'The new evaluation', paragraphs: ['Teams now measure a model against a workflow: retrieval quality, tool reliability, monitoring burden and the cost of a wrong answer. A leaderboard score is only the beginning.'] },
  ],
  founders: [
    { heading: 'The bottleneck is the operating system', paragraphs: ['After the first million model calls, founders tend to discover that prompts are not a product strategy. Queues, permissions, evaluations and human escalation determine whether a demo becomes a business.'] },
    { heading: 'A quieter kind of scale', paragraphs: ['The best teams build feedback into every interaction, turning exceptions into training data and making the system more dependable without pretending that uncertainty has disappeared.'] },
  ],
  infrastructure: [
    { heading: 'Power is now a product constraint', paragraphs: ['Compute is moving toward places with reliable power, fibre and permits. The geography of intelligence is being redrawn by the physical conditions that software used to ignore.'] },
    { heading: 'Regional does not mean isolated', paragraphs: ['Inference closer to customers can improve latency and resilience, while training remains concentrated. The resulting map is a network of specialised corridors rather than one universal cloud.'] },
  ],
};

const maintainedStudyStory: Story = {
  slug: 'study-finds-word-cues-can-override-game-theory-choices-in-llms',
  category: 'The Edge',
  title: 'Study finds word cues can override game-theory choices in LLMs',
  dek: 'A preprint reports that several larger instruction-tuned models favored cooperation in a Prisoner’s Dilemma because of a late, label-sensitive internal circuit.',
  body: [
    {
      heading: 'A late intervention in the network',
      paragraphs: [
        'A new arXiv preprint examines how instruction-tuned language models respond to a directly prompted Prisoner’s Dilemma. The authors report that three larger models—Llama-3-70B, Qwen2.5-32B and Qwen2.5-72B—consistently selected cooperation, while Llama-3-8B produced choices closer to the Nash action.',
        'Using logit-lens analysis, the team found that intermediate model readouts leaned toward the Nash action through much of the network. Near the final layers, however, the models shifted sharply toward cooperation. The authors characterize this late shift as a distributed cooperative override.',
      ],
    },
    {
      heading: 'A controllable but narrow signal',
      paragraphs: [
        'In the 8B model, the researchers report isolating a single direction in the residual stream associated with the override. Steering that direction adjusted the decision, and clamping its contribution at one layer and position changed the choice monotonically while preserving fluent generation.',
        'The paper links the scale of the final correction to chain-of-thought behavior across the tested model families. But its central interpretation is narrower than a claim that the systems possess a general cooperative preference: the mechanism appeared tied to the language used to present the game.',
      ],
    },
    {
      heading: 'Neutral labels changed the result',
      paragraphs: [
        'The reported effect persisted when player names were removed and when payoffs were rescaled. It disengaged when the action labels “Cooperate” and “Defect” were replaced with neutral terms, suggesting that the circuit was responding to learned lexical associations rather than the underlying payoff structure.',
        'Across 48 randomized-payoff games with neutral action surfaces, the authors report that none of the models consistently locked into cooperation on dilemmas or demonstrated general equilibrium competence. As a preprint, the work has not established a universal explanation for strategic behavior in language models, but it offers a concrete mechanism for testing prompt-sensitive decision patterns.',
      ],
    },
  ],
  date: '2026-09-21',
  readTime: '4 min read',
  author: 'ishaan-mehta',
  evidence: 'High confidence · 1 primary source · 0 independent confirmations',
  evidenceSummary: {
    primarySources: 1,
    independentConfirmations: 0,
    confidence: 'HIGH',
    note: 'Autonomous desk verification score 0.98 across 1 open-source publisher.',
  },
  classification: 'reported',
  entities: [],
  timeline: [],
  relatedStories: [],
  imageTreatment: {
    type: 'editorial-abstract',
    alt: 'Abstract editorial visual for the edge reporting',
    palette: 'warm ivory, cobalt, graphite',
    caption: 'The signal is becoming visible in the systems around the model.',
  },
  topic: 'LLM interpretability and decision-making',
  sources: ['open-a7f1c833c9a1e5c0'],
  bottomLine: 'The study argues that apparent cooperative behavior in tested language models was driven by a controllable response to familiar game labels, not a general inability to identify Nash behavior.',
  whyItMatters: 'If validated, the findings show why behavioral evaluations should vary labels and task surfaces: a model can appear to display a stable preference while following a narrow lexical trigger.',
  keyTakeaways: [
    'Llama-3-70B, Qwen2.5-32B and Qwen2.5-72B reportedly chose full cooperation under direct prompting in the named Prisoner’s Dilemma, unlike Llama-3-8B.',
    'The researchers found a late-layer shift toward cooperation and identified a residual-stream direction in the 8B model that could be manipulated to adjust the decision.',
    'Replacing “Cooperate” and “Defect” with neutral labels removed the reported effect, and the models did not show general equilibrium competence across randomized-payoff games.',
  ],
  whatChanges: 'The work points toward label-robust game-theory tests and mechanistic checks before treating prompted model behavior as evidence of broad strategic competence or preference.',
};

export let stories: Story[] = [
  maintainedStudyStory,
  { slug: 'ai-models-antibiotic-discovery', category: 'Breakthroughs', title: 'AI models are accelerating the hunt for new antibiotics', dek: 'A new generation of models is moving beyond prediction — and into the wet lab.', body: storyBodies.antibiotic, date: '2026-09-11', readTime: '7 min read', author: 'mira-patel', evidence: 'High confidence · 3 primary sources · 5 independent confirmations', evidenceSummary: evidenceSummaries.antibiotic, classification: 'reported', entities: ['antibiotic-discovery', 'google-deepmind'], timeline: ['antibiotic-candidates', 'gemini-science-release'], relatedStories: ['small-models', 'founders'], imageTreatment: { type: 'editorial-abstract', alt: 'Abstract map of molecular structures and laboratory notes', palette: 'deep teal, chalk white, antibiotic amber', caption: 'The interface between a model’s search and the laboratory is becoming more precise.' }, topic: 'AI', sources: ['nature-antibiotic-study', 'stanford-ai-index-2026'], bottomLine: 'AI is making the search space for antibiotic candidates more legible, not removing the need for experiments.', whyItMatters: 'The same model-to-reality feedback loop could reshape materials, manufacturing and drug discovery.', keyTakeaways: ['Novel candidates still require synthesis and testing.', 'The useful breakthrough is the feedback loop, not a single prediction.', 'Scientific judgement remains central to deciding what to test.'], whatChanges: 'Research teams can screen broader chemical spaces before committing scarce wet-lab time.' },
  { slug: 'quiet-race-watermark-everything-ai-makes', category: 'Signals', title: 'The quiet race to watermark everything AI makes', dek: 'Standards are taking shape while the internet learns to ask: who made this?', body: storyBodies.watermarking, date: '2026-09-10', readTime: '5 min read', author: 'jonas-rhee', evidence: 'Medium confidence · 2 primary sources · 4 independent confirmations', evidenceSummary: evidenceSummaries.watermarking, classification: 'analysis', entities: ['content-credentials'], timeline: ['watermarking-code'], relatedStories: ['india-stack'], imageTreatment: { type: 'data-graphic', alt: 'Layered provenance marks across a digital image', palette: 'warm white, cobalt, graphite', caption: 'Provenance is becoming an infrastructure question.' }, topic: 'Policy', sources: ['eu-ai-act-code', 'uspto-ai-inventorship'], bottomLine: 'The emerging standard is provenance that can be checked, rather than a magic mark that cannot be removed.', whyItMatters: 'Trust in generated media will depend on institutions making origin legible at scale.', keyTakeaways: ['Watermarks alone are easy to strip.', 'Signed content credentials can preserve an asset history.', 'Public procurement may drive adoption before consumer platforms do.'], whatChanges: 'Creators and platforms will increasingly be asked to disclose how an asset was made.' },
  { slug: 'indias-public-ai-stack', category: 'India Watch', title: 'India’s public AI stack is being built in the open', dek: 'From language data to compute, a sovereign layer is becoming visible.', body: storyBodies['india-stack'], date: '2026-09-09', readTime: '6 min read', author: 'ananya-rao', evidence: 'High confidence · 4 primary sources · 3 independent confirmations', evidenceSummary: evidenceSummaries['india-stack'], classification: 'reported', entities: ['indiaai-mission', 'sarvam-ai'], timeline: ['indiaai-compute-tender', 'sarvam-public-model'], relatedStories: ['small-models', 'infrastructure'], imageTreatment: { type: 'field-photograph', alt: 'Bengaluru technology district at dusk', palette: 'saffron, indigo, concrete grey', caption: 'India is treating shared infrastructure as a competitive advantage.' }, topic: 'India', sources: ['indiaai-mission', 'stanford-ai-index-2026'], bottomLine: 'India is building a shared layer for language, compute and public-interest deployment.', whyItMatters: 'A public substrate could lower the cost of building products for hundreds of millions of users.', keyTakeaways: ['Compute access is moving beyond the largest companies.', 'Indic-language data is a strategic asset.', 'Procurement will determine whether infrastructure becomes useful.'], whatChanges: 'Startups can spend more effort on products and less on recreating basic AI infrastructure.' },
  { slug: 'small-models-serious-workflows', category: 'The Edge', title: 'Small models are finding their way into serious workflows', dek: 'The most useful AI may be the one that never leaves your laptop.', body: storyBodies['small-models'], date: '2026-09-08', readTime: '4 min read', author: 'ishaan-mehta', evidence: 'High confidence · 3 primary sources · 4 independent confirmations', evidenceSummary: evidenceSummaries['small-models'], classification: 'reported', entities: ['gpt-5', 'claude-4', 'sarvam-ai'], timeline: ['gpt-5-release', 'claude-4-release', 'sarvam-public-model'], relatedStories: ['founders', 'infrastructure'], imageTreatment: { type: 'editorial-abstract', alt: 'Compact model running beside a laptop and local data', palette: 'slate, electric blue, paper white', caption: 'Capability is increasingly measured inside a workflow.' }, topic: 'AI', sources: ['mistral-model-card', 'stanford-ai-index-2026'], bottomLine: 'Local and compact models are winning where latency, privacy and predictable cost matter more than benchmark leadership.', whyItMatters: 'Deployment economics will decide which AI capabilities become routine.', keyTakeaways: ['Latency and privacy are product features.', 'Workflow evaluation matters more than a single leaderboard.', 'Smaller models expand who can run capable systems.'], whatChanges: 'Teams will route each task to the smallest model that can do it reliably.' },
  { slug: 'founders-first-million-model-calls', category: 'Field Notes', title: 'What founders notice after their first million model calls', dek: 'The bottleneck is rarely the model. It is the operating system around it.', body: storyBodies.founders, date: '2026-09-07', readTime: '8 min read', author: 'lena-hoff', evidence: 'Medium confidence · 2 primary sources · 6 independent confirmations', evidenceSummary: evidenceSummaries.founders, classification: 'analysis', entities: ['openai', 'anthropic'], timeline: ['openai-agent-platform'], relatedStories: ['small-models', 'infrastructure'], imageTreatment: { type: 'portrait', alt: 'Founder reviewing an AI operations dashboard in a quiet office', palette: 'ink, copper, soft green', caption: 'Scale exposes the system around the model.' }, topic: 'Founders', sources: ['stanford-ai-index-2026'], bottomLine: 'At scale, reliability, permissions and feedback loops matter more than clever prompts.', whyItMatters: 'The next generation of AI companies will be built around operational discipline.', keyTakeaways: ['Exceptions are product feedback.', 'Human escalation is a feature, not a failure.', 'Unit economics include monitoring and wrong answers.'], whatChanges: 'Founders will treat evaluation and governance as core product infrastructure.' },
  { slug: 'new-geography-of-compute', category: 'Infrastructure', title: 'The new geography of compute is surprisingly regional', dek: 'Power, permits and proximity are redrawing the map of intelligence.', body: storyBodies.infrastructure, date: '2026-09-06', readTime: '9 min read', author: 'david-okafor', evidence: 'High confidence · 4 primary sources · 5 independent confirmations', evidenceSummary: evidenceSummaries.infrastructure, classification: 'analysis', entities: ['microsoft'], timeline: ['azure-inference-expansion'], relatedStories: ['indias-public-ai-stack', 'small-models'], imageTreatment: { type: 'data-graphic', alt: 'Map showing regional compute corridors and energy connections', palette: 'night blue, grid green, signal orange', caption: 'The infrastructure map follows power, fibre and permission.' }, topic: 'Technology', sources: ['iea-data-centres', 'stanford-ai-index-2026'], bottomLine: 'The AI cloud is becoming a network of regional corridors shaped by physical constraints.', whyItMatters: 'Energy and permitting will influence who can offer fast, affordable intelligence.', keyTakeaways: ['Inference is moving closer to users.', 'Training remains more concentrated than deployment.', 'Power availability is now a strategic differentiator.'], whatChanges: 'AI infrastructure planning will look increasingly like energy and telecom planning.' },
];

export const scheduledStories: ScheduledStory[] = [
  {
    slug: 'reliability-is-the-new-ai-moat',
    category: 'Field Notes',
    title: 'Reliability is becoming the new AI moat',
    dek: 'The next advantage will belong to systems that recover well, not demos that impress once.',
    body: [
      { heading: 'The operating layer wins', paragraphs: ['As models become easier to access, the durable difference moves into permissions, evaluation, observability and the handoffs that keep work moving when a model is uncertain.'] },
      { heading: 'Recovery is a product feature', paragraphs: ['A dependable system makes its limits visible, routes exceptions to people and learns from failure. That is less dramatic than a launch, but more valuable over a year of real use.'] },
    ],
    date: '2026-09-21',
    publishAt: '2026-09-21T07:30:00Z',
    cadence: 'daily',
    readTime: '6 min read',
    author: 'lena-hoff',
    evidence: 'Medium confidence · 2 primary sources · 5 independent confirmations',
    evidenceSummary: { primarySources: 2, independentConfirmations: 5, confidence: 'MEDIUM', note: 'The operating pattern appears across enterprise deployments, but public reporting remains uneven.' },
    classification: 'analysis',
    entities: ['openai', 'anthropic'],
    timeline: ['openai-agent-platform'],
    relatedStories: ['small-models-serious-workflows', 'founders-first-million-model-calls'],
    imageTreatment: { type: 'editorial-abstract', alt: 'Layered system paths converging on a reliable handoff', palette: 'cobalt, graphite, warm paper', caption: 'The advantage is shifting from model novelty to dependable operation.' },
    topic: 'AI',
    sources: ['stanford-ai-index-2026'],
    bottomLine: 'The AI systems that matter will be the ones that make uncertainty manageable inside a real workflow.',
    whyItMatters: 'When model access is broadly available, operational discipline becomes the part competitors cannot copy overnight.',
    keyTakeaways: ['Recovery paths matter as much as first-pass accuracy.', 'Evaluation must follow the whole workflow.', 'Human escalation is part of the product design.'],
    whatChanges: 'Teams will budget for observability, permissions and exception handling before they scale model usage.',
  },
  {
    slug: 'public-compute-needs-public-metrics',
    category: 'India Watch',
    title: 'Public compute needs public metrics',
    dek: 'India’s shared AI infrastructure will be judged by who can use it, not only by how much capacity it announces.',
    body: [
      { heading: 'Capacity is only the first measure', paragraphs: ['A public compute programme becomes useful when researchers, startups and public-interest teams can discover it, qualify for access and ship something with it.'] },
      { heading: 'The access layer matters', paragraphs: ['Transparent allocation, language coverage and evidence of downstream use will tell a clearer story than a headline GPU count.'] },
    ],
    date: '2026-09-23',
    publishAt: '2026-09-23T07:30:00Z',
    cadence: 'daily',
    readTime: '7 min read',
    author: 'ananya-rao',
    evidence: 'Medium confidence · 3 primary sources · 3 independent confirmations',
    evidenceSummary: { primarySources: 3, independentConfirmations: 3, confidence: 'MEDIUM', note: 'Programme commitments are visible; consistent public reporting on usage is still developing.' },
    classification: 'reported',
    entities: ['indiaai-mission', 'sarvam-ai'],
    timeline: ['indiaai-compute-tender'],
    relatedStories: ['indias-public-ai-stack', 'new-geography-of-compute'],
    imageTreatment: { type: 'data-graphic', alt: 'Public compute allocation paths connecting researchers and builders', palette: 'indigo, saffron, paper white', caption: 'Infrastructure becomes public value only when access is legible.' },
    topic: 'India',
    sources: ['indiaai-mission', 'stanford-ai-index-2026'],
    bottomLine: 'The strongest public AI metric is not capacity announced but useful work completed by people who could not previously afford the compute.',
    whyItMatters: 'Transparent access can turn national AI infrastructure into a broad industrial platform rather than a narrow procurement programme.',
    keyTakeaways: ['Access rules shape who benefits from public compute.', 'Language coverage is a practical measure of inclusion.', 'Usage evidence should sit beside capacity announcements.'],
    whatChanges: 'Public AI programmes will increasingly publish allocation, usage and outcome metrics together.',
  },
  {
    slug: 'weekly-deep-dive-cost-of-intelligence',
    category: 'Infrastructure',
    title: 'The cost of intelligence is becoming a design constraint',
    dek: 'Every AI product now has to decide where capability is worth the energy, latency and margin it consumes.',
    body: [
      { heading: 'The price is not just per token', paragraphs: ['The real cost of an AI feature includes retrieval, evaluation, latency, monitoring, storage and the human work required when an answer is wrong.'] },
      { heading: 'Design for the constraint', paragraphs: ['The best teams route simple work to small models, reserve frontier capability for high-value decisions and make the tradeoff visible to the people building the product.'] },
    ],
    date: '2026-09-28',
    publishAt: '2026-09-28T07:30:00Z',
    cadence: 'weekly',
    readTime: '10 min read',
    author: 'david-okafor',
    evidence: 'High confidence · 3 primary sources · 4 independent confirmations',
    evidenceSummary: { primarySources: 3, independentConfirmations: 4, confidence: 'HIGH', note: 'Infrastructure demand, deployment economics and regional capacity point to the same design constraint.' },
    classification: 'synthesis',
    entities: ['microsoft', 'gpt-5'],
    timeline: ['azure-inference-expansion', 'gpt-5-release'],
    relatedStories: ['new-geography-of-compute', 'small-models-serious-workflows'],
    imageTreatment: { type: 'data-graphic', alt: 'A system map balancing model capability, energy and latency', palette: 'night blue, signal green, copper', caption: 'Capability is only useful when its operating cost fits the job.' },
    topic: 'Technology',
    sources: ['iea-data-centres', 'stanford-ai-index-2026'],
    bottomLine: 'The next generation of AI products will be designed around an explicit budget for intelligence.',
    whyItMatters: 'Energy, latency and margin will determine which model capabilities become ordinary parts of software.',
    keyTakeaways: ['Token price is only one part of the cost.', 'Routing is a product decision.', 'Regional infrastructure changes what is feasible.'],
    whatChanges: 'Product teams will treat model selection as an operating-budget decision, not a one-time engineering choice.',
  },
];

export function getPublishedStories(now = new Date(), schedule = scheduledStories): Story[] {
  const publishedSlugs = new Set(stories.map((story) => story.slug));
  const newlyPublished = schedule.filter(
    (story) => !publishedSlugs.has(story.slug) && Date.parse(story.publishAt) <= now.getTime(),
  );
  return [...stories, ...newlyPublished].sort((left, right) => {
    if (left.date !== right.date) return right.date.localeCompare(left.date);
    return left.slug.localeCompare(right.slug);
  });
}

export function getEditorialSchedule(now = new Date(), schedule = scheduledStories): EditorialScheduleItem[] {
  return schedule.map((story, position) => ({
    slug: story.slug,
    title: story.title,
    dek: story.dek,
    publishAt: story.publishAt,
    cadence: story.cadence,
    status: Date.parse(story.publishAt) <= now.getTime() ? 'published' : 'scheduled',
    position,
    story,
  }));
}

export let signals: Signal[] = [
  { slug: 'frontier-model-race', label: 'Model race', topic: 'Models', direction: 'up', impact: 'high', change: '+18%', summary: 'Tool use and long-horizon reliability, rather than raw benchmark scores, are driving the latest frontier releases.', entities: ['openai', 'anthropic', 'gpt-5', 'claude-4'], stories: ['small-models', 'founders'], updated: '2026-09-11' },
  { slug: 'compute-geography', label: 'AI infrastructure', topic: 'Infrastructure', direction: 'up', impact: 'high', change: '+12%', summary: 'New inference capacity is following power, fibre and regional customer demand.', entities: ['microsoft'], stories: ['infrastructure'], updated: '2026-09-11' },
  { slug: 'capital-efficiency', label: 'Capital', topic: 'Capital', direction: 'steady', impact: 'medium', change: '0.4x', summary: 'Investors are rewarding evidence of repeatable usage and gross margin, not model novelty alone.', entities: ['openai', 'anthropic'], stories: ['founders'], updated: '2026-09-10' },
  { slug: 'provenance-rules', label: 'Regulation', topic: 'Policy', direction: 'up', impact: 'medium', change: '+9%', summary: 'Content provenance is moving from standards discussions into public procurement requirements.', entities: ['content-credentials'], stories: ['quiet-race-watermark-everything-ai-makes'], updated: '2026-09-10' },
  { slug: 'open-model-edge', label: 'Open source', topic: 'Models', direction: 'up', impact: 'medium', change: '+14%', summary: 'Compact open models are making local inference practical for teams with sensitive data.', entities: ['sarvam-ai'], stories: ['small-models', 'indias-public-ai-stack'], updated: '2026-09-09' },
  { slug: 'enterprise-adoption', label: 'Enterprise adoption', topic: 'Applications', direction: 'up', impact: 'high', change: '+21%', summary: 'AI budgets are shifting from pilots toward monitored workflows with clear owners.', entities: ['microsoft', 'anthropic'], stories: ['founders'], updated: '2026-09-08' },
  { slug: 'india-public-stack', label: 'India public stack', topic: 'India', direction: 'up', impact: 'high', change: '+16%', summary: 'Shared compute and Indic-language data are becoming national capability rather than isolated projects.', entities: ['indiaai-mission', 'sarvam-ai'], stories: ['indias-public-ai-stack'], updated: '2026-09-09' },
  { slug: 'ai-in-science', label: 'AI in science', topic: 'Research', direction: 'up', impact: 'high', change: '+11%', summary: 'Models are increasingly valuable when paired with experimental feedback.', entities: ['antibiotic-discovery', 'google-deepmind'], stories: ['ai-models-antibiotic-discovery'], updated: '2026-09-11' },
];

export let industryMap: IndustryMapNode[] = [
  { slug: 'frontier-labs', name: 'Frontier labs', layer: 'Frontier Labs', description: 'General-purpose model research and deployment.', entities: ['openai', 'anthropic', 'google-deepmind'], pressure: 'Compute and dependable post-training', x: 18, y: 18 },
  { slug: 'cloud-infrastructure', name: 'Cloud infrastructure', layer: 'Infrastructure', description: 'Accelerators, data centres, power and network.', entities: ['microsoft'], pressure: 'Grid access and regional demand', x: 48, y: 16 },
  { slug: 'open-models', name: 'Open models', layer: 'Models', description: 'Portable models that can run close to data.', entities: ['gpt-5', 'claude-4', 'sarvam-ai'], pressure: 'Evaluation and distribution', x: 77, y: 24 },
  { slug: 'agent-systems', name: 'Agent systems', layer: 'Agents', description: 'Software that plans, acts and returns evidence.', entities: ['openai', 'anthropic'], pressure: 'Permissions and failure recovery', x: 30, y: 55 },
  { slug: 'enterprise-applications', name: 'Enterprise applications', layer: 'Applications', description: 'Workflows where intelligence becomes a budget line.', entities: ['microsoft'], pressure: 'Change management and trust', x: 65, y: 54 },
  { slug: 'ai-capital', name: 'Capital', layer: 'Capital', description: 'Funding the infrastructure and application layers.', entities: ['openai', 'anthropic'], pressure: 'Proof of durable margins', x: 87, y: 72 },
  { slug: 'policy-provenance', name: 'Policy', layer: 'Policy', description: 'Rules governing safety, origin and access.', entities: ['indiaai-mission'], pressure: 'Interoperability and enforcement', x: 14, y: 82 },
];

export let indiaIndex: IndiaIndexMetric[] = [
  { slug: 'compute-allocation', label: 'Public compute allocation', value: '10,000+ GPUs', change: '+35% q/q', context: 'Capacity made available through the IndiaAI programme and partner clouds.', source: 'indiaai-mission' },
  { slug: 'venture-funding', label: 'AI venture funding', value: '$1.1B', change: '+18% y/y', context: 'Disclosed funding for Indian AI startups in the current index period.', source: 'stanford-ai-index-2026' },
  { slug: 'indic-language-coverage', label: 'Indic language coverage', value: '22 languages', change: '+6 this year', context: 'Languages represented in public speech and text dataset initiatives.', source: 'indiaai-mission' },
  { slug: 'research-output', label: 'AI research papers', value: '14,800', change: '+23% y/y', context: 'India-affiliated publications indexed across major AI research fields.', source: 'stanford-ai-index-2026' },
  { slug: 'skilling-pipeline', label: 'People in AI skilling programmes', value: '2.4M', change: '+41% y/y', context: 'Public and industry programmes reporting completed training.', source: 'indiaai-mission' },
  { slug: 'data-centre-capacity', label: 'Data-centre capacity', value: '1.2GW', change: '+16% y/y', context: 'Operational and announced capacity relevant to AI workloads.', source: 'iea-data-centres' },
];

export let essays: Essay[] = [
  { slug: 'intelligence-without-theatre', title: 'Intelligence without the theatre', dek: 'What changes when we measure AI by the systems it makes possible rather than the demos it produces.', author: 'lena-hoff', date: '2026-09-05', readTime: '12 min read', themes: ['systems', 'enterprise', 'trust'], body: [{ heading: 'The demo is not the product', paragraphs: ['The AI economy is learning to separate an impressive answer from a dependable capability. That distinction is quiet, operational and increasingly valuable.'] }, { heading: 'A new editorial subject', paragraphs: ['The institutions around models — labs, clouds, buyers and regulators — now deserve as much attention as the models themselves.'] }] },
  { slug: 'india-builds-in-public', title: 'India builds in public', dek: 'A public AI layer can be both infrastructure policy and industrial strategy.', author: 'ananya-rao', date: '2026-08-29', readTime: '10 min read', themes: ['India', 'policy', 'infrastructure'], body: [{ heading: 'The shared substrate', paragraphs: ['India’s most consequential AI bet may be the layer no single startup owns: language data, compute access and public demand.'] }, { heading: 'The test is use', paragraphs: ['A public stack matters only when it helps a health worker, teacher or small company do something previously out of reach.'] }] },
  { slug: 'the-cost-of-intelligence', title: 'The cost of intelligence', dek: 'Every AI product is also an argument about energy, latency, margin and what deserves to be automated.', author: 'david-okafor', date: '2026-08-22', readTime: '11 min read', themes: ['infrastructure', 'economics', 'design'], body: [{ heading: 'Capability has a carrying cost', paragraphs: ['The most capable model is not automatically the right model. A useful system has to fit the speed, budget and consequence of the work around it.'] }, { heading: 'The design question', paragraphs: ['Choosing where to spend intelligence is becoming part of product design. Small models, local inference and careful routing can make ambition affordable.'] }] },
];

export let askGlobalAnswers: AskGlobalAnswer[] = [
  { slug: 'what-changed-openai-this-week', question: 'What changed in OpenAI this week?', answer: 'OpenAI’s important shift was operational: its agent platform moved from a product demo toward a tool with permissions, evidence and longer-running tasks. That raises the bar for reliability and makes the surrounding workflow more important than a single benchmark.', citedStories: ['founders', 'small-models'], citedSources: ['stanford-ai-index-2026'], citedTimeline: ['openai-agent-platform', 'gpt-5-release'], citedEntities: ['openai', 'gpt-5'], asOf: '2026-09-11' },
  { slug: 'why-is-nvidia-moving', question: 'Why is NVIDIA moving?', answer: 'The market is pricing a broader infrastructure cycle: more inference is being deployed regionally, while frontier training remains accelerator-intensive. The opportunity is large, but power, supply and customer concentration remain the constraints to watch.', citedStories: ['infrastructure'], citedSources: ['iea-data-centres'], citedTimeline: ['azure-inference-expansion'], citedEntities: ['microsoft'], asOf: '2026-09-11' },
  { slug: 'biggest-open-source-model-developments', question: 'What are the biggest open-source model developments?', answer: 'The centre of gravity is moving toward compact models that can run close to sensitive data. Their advantage is not that they beat every frontier benchmark; it is that teams can adapt, audit and operate them at predictable cost.', citedStories: ['small-models', 'indias-public-ai-stack'], citedSources: ['mistral-model-card'], citedTimeline: ['sarvam-public-model'], citedEntities: ['sarvam-ai', 'gpt-5'], asOf: '2026-09-11' },
  { slug: 'what-changed-india-ai-policy', question: 'What changed in India’s AI policy?', answer: 'IndiaAI moved from a mission statement toward allocation: public compute access, common language datasets and procurement pathways are becoming tangible. The next question is whether access reaches researchers and smaller companies beyond the largest cloud partners.', citedStories: ['indias-public-ai-stack'], citedSources: ['indiaai-mission'], citedTimeline: ['indiaai-compute-tender'], citedEntities: ['indiaai-mission', 'sarvam-ai'], asOf: '2026-09-11' },
  { slug: 'compare-anthropic-openai', question: 'Compare Anthropic vs OpenAI.', answer: 'OpenAI is pushing a broad product and agent ecosystem, while Anthropic has made controllability and long-context work central to Claude. Both increasingly compete on dependable tool use, distribution and enterprise trust rather than model chat quality alone.', citedStories: ['small-models', 'founders'], citedSources: ['stanford-ai-index-2026'], citedTimeline: ['gpt-5-release', 'claude-4-release'], citedEntities: ['openai', 'anthropic', 'gpt-5', 'claude-4'], asOf: '2026-09-11' },
];

export interface NewsroomContentSnapshot {
  authors: Author[];
  sources: Source[];
  evidenceSummaries: Record<string, EvidenceSummary>;
  entities: Entity[];
  timelineEvents: TimelineEvent[];
  stories: Story[];
  signals: Signal[];
  industryMap: IndustryMapNode[];
  indiaIndex: IndiaIndexMetric[];
  essays: Essay[];
  askGlobalAnswers: AskGlobalAnswer[];
  schedule: EditorialScheduleItem[];
}

export function hydrateContent(snapshot: NewsroomContentSnapshot): void {
  authors = snapshot.authors;
  sources = snapshot.sources;
  entities = snapshot.entities;
  timelineEvents = snapshot.timelineEvents;
  stories = snapshot.stories;
  signals = snapshot.signals;
  industryMap = snapshot.industryMap;
  indiaIndex = snapshot.indiaIndex;
  essays = snapshot.essays;
  askGlobalAnswers = snapshot.askGlobalAnswers;
}

const storyAliases: Record<string, string> = {
  antibiotic: 'ai-models-antibiotic-discovery',
  watermarking: 'quiet-race-watermark-everything-ai-makes',
  'india-stack': 'indias-public-ai-stack',
  'small-models': 'small-models-serious-workflows',
  founders: 'founders-first-million-model-calls',
  infrastructure: 'new-geography-of-compute',
};
export const findStory = (slug: string): Story | undefined => stories.find((story) => story.slug === (storyAliases[slug] ?? slug));
export const findEntity = (slug: string): Entity | undefined => entities.find((entity) => entity.slug === slug);
export const findTimeline = (slug: string): TimelineEvent | undefined => timelineEvents.find((event) => event.slug === slug);
export const filterSignals = (topic?: string): Signal[] =>
  topic ? signals.filter((signal) => signal.topic.toLowerCase() === topic.toLowerCase() || signal.slug === topic) : signals;