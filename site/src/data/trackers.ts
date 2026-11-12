// Tracker data. Every row must come from a primary source we have read, with
// the date it was checked. `article` links to our explainer once published.
export interface TrackerRow {
  item: string;
  status?: string;
  date: string; // date of the event or document (YYYY-MM-DD)
  detail: string;
  source: { label: string; url: string };
  checked: string; // YYYY-MM-DD the source was last checked
  article?: string;
}

export interface TrackerSection { title: string; intro?: string; rows: TrackerRow[] }

export const INDIA_AI_TRACKER: TrackerSection[] = [
  {
    title: 'Rules and regulation',
    intro: 'What is legally in force for AI in India today, and what has only been proposed or announced.',
    rows: [
      {
        item: 'IT Rules amendment on synthetically generated information',
        status: 'In force',
        date: '2026-02-20',
        detail: 'Notified on 10 February 2026 (G.S.R. 120(E)) and in force from 20 February. Adds due-diligence duties for intermediaries on specified synthetic audio, visual and audiovisual content.',
        source: { label: 'Gazette of India, G.S.R. 120(E)', url: 'https://egazette.gov.in/WriteReadData/2026/2699' },
        checked: '2026-10-31',
        article: 'india-ai-consultation-paper-what-is-law',
      },
      {
        item: 'Draft amendment on synthetic information (2025)',
        status: 'Superseded draft',
        date: '2025-10-22',
        detail: 'MeitY’s October 2025 draft, which proposed a fixed 10% marking formula. The final February 2026 rules use different wording.',
        source: { label: 'MeitY draft amendment rules, 2025', url: 'https://www.meity.gov.in/static/uploads/2025/10/9de47fb06522b9e40a61e4731bc7de51.pdf' },
        checked: '2026-10-31',
        article: 'india-ai-consultation-paper-what-is-law',
      },
      {
        item: 'Broader AI governance consultation paper',
        status: 'Announced, not published',
        date: '2026-10-08',
        detail: 'The IT minister said a consultation paper would be floated within a month. As of our 31 October check it was not on official sources; a consultation paper would not itself be binding law.',
        source: { label: 'News on AIR, 8 October 2026', url: 'https://newsonair.gov.in/ai-regulation-consultation-paper-to-be-floated-within-a-month-ashwini-vaishnaw/' },
        checked: '2026-10-31',
        article: 'india-ai-consultation-paper-what-is-law',
      },
    ],
  },
  {
    title: 'IndiaAI Mission and public compute',
    intro: 'Official figures for India’s shared AI compute programme. They describe different stages—target, onboarded, shared, used—and do not add up to a single capacity number.',
    rows: [
      {
        item: 'IndiaAI Mission approved',
        status: 'Approved',
        date: '2024-03-07',
        detail: 'Five-year outlay of ₹10,371.92 crore, with a common compute target of more than 10,000 GPUs.',
        source: { label: 'PIB, Cabinet approves IndiaAI Mission', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2012355' },
        checked: '2026-10-12',
        article: 'india-ai-compute-access-2026',
      },
      {
        item: 'GPUs onboarded',
        status: 'Reported',
        date: '2026-03-25',
        detail: '38,231 GPUs onboarded from 14 providers, according to the government. Onboarded capacity is not the same as capacity in active use.',
        source: { label: 'PIB, 25 March 2026', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2245063' },
        checked: '2026-10-12',
        article: 'india-ai-compute-access-2026',
      },
      {
        item: 'Shared compute capacity and usage',
        status: 'Reported',
        date: '2026-08-13',
        detail: 'Shared capacity of more than 45,000 GPUs as of June 2026; 237 projects and 93.18 lakh GPU-hours reported by August. The factsheet does not define whether hours are allocated or metered.',
        source: { label: 'PIB factsheet, Semiconductor and AI Revolution', url: 'https://www.pib.gov.in/FactsheetDetails.aspx?Id=150860&lang=1&reg=48' },
        checked: '2026-10-12',
        article: 'india-ai-compute-access-2026',
      },
      {
        item: 'C-DAC tender for up to 10,000 AI compute units',
        status: 'Bidding',
        date: '2026-10-07',
        detail: 'Request for empanelment of AI compute service providers in two stages. A 27 October corrigendum set bid submission for 13 November 2026, 3:30 p.m. IST. A tender requirement, not deployed capacity.',
        source: { label: 'C-DAC RFE C-DAC/GPU/01/2026', url: 'https://cdac.in/index.aspx?id=tenders_ASP-RFE' },
        checked: '2026-10-31',
        article: 'indiaai-10000-gpu-tender-explained',
      },
    ],
  },
  {
    title: 'Indian foundation models',
    intro: 'Models released under the IndiaAI Mission, and whether you can actually download them.',
    rows: [
      {
        item: 'EKA-1 (Soket)',
        status: 'Released; early access',
        date: '2026-11-03',
        detail: '26.3 billion parameters, trained on about 7.5 trillion tokens, covering all 22 scheduled Indian languages plus English, according to the government. Soket offered early access rather than a public download as of 9 November.',
        source: { label: 'PIB, 3 November 2026', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2332315&reg=48&lang=2' },
        checked: '2026-11-09',
        article: 'indiaai-eka-1-dhir-models-explained',
      },
      {
        item: 'Dhīr 2B and Dhīr 5B (ZenteiQ)',
        status: 'Downloadable (Apache 2.0)',
        date: '2026-11-03',
        detail: 'Small models for English and ten Indian languages that ZenteiQ says run fully offline. Dhīr 5B is a mixture-of-experts model with 5.09 billion parameters, 1.79 billion active per token.',
        source: { label: 'ZenteiQ, Dhīr model page', url: 'https://zenteiq.ai/dhir/' },
        checked: '2026-11-09',
        article: 'indiaai-eka-1-dhir-models-explained',
      },
    ],
  },
];

export interface CapexRow {
  company: string;
  min: number; // billions of US dollars
  max: number;
  guidance: string;
  basis: string;
  latestQuarter: string;
  source: { label: string; url: string };
  checked: string;
}

export const CAPEX_TRACKER: CapexRow[] = [
  {
    company: 'Alphabet',
    min: 195,
    max: 205,
    guidance: '$195–205 billion',
    basis: 'Capital expenditures; most spending on technical infrastructure (not an AI-only figure)',
    latestQuarter: 'Q3 2026: $51.4 billion',
    source: { label: 'Alphabet Q3 2026 earnings call, 28 Oct 2026', url: 'https://abc.xyz/investor/events/event-details/2026/2026-Q3-Earnings-Call-2026-Ujou16CTw9/default.aspx' },
    checked: '2026-10-31',
  },
  {
    company: 'Amazon',
    min: 220,
    max: 220,
    guidance: '~$220 billion',
    basis: 'Cash capital expenditures; majority for AWS',
    latestQuarter: 'Not used here',
    source: { label: 'Amazon Q3 2026 results, 29 Oct 2026', url: 'https://www.aboutamazon.com/news/company-news/amazon-earnings-q3-2026-report' },
    checked: '2026-10-31',
  },
  {
    company: 'Meta',
    min: 135,
    max: 145,
    guidance: '$135–145 billion',
    basis: 'Capital expenditures including principal payments on finance leases',
    latestQuarter: 'Q3 2026: $34.91 billion (same basis)',
    source: { label: 'Meta Q3 2026 results, 21 Oct 2026', url: 'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Third-Quarter-2026-Results/default.aspx' },
    checked: '2026-10-31',
  },
  {
    company: 'Microsoft',
    min: 170,
    max: 170,
    guidance: '~$170 billion (calendar 2026 estimate)',
    basis: 'Capital expenditures; fiscal year ends in June, so calendar and fiscal figures differ',
    latestQuarter: 'Quarter to 30 Sep 2026: $45.2 billion, incl. $7.4 billion finance leases',
    source: { label: 'Microsoft FY2027 Q1 earnings call, 28 Oct 2026', url: 'https://www.microsoft.com/en-us/Investor/events/fy-2027/earnings-fy-2027-q1' },
    checked: '2026-10-31',
  },
];

// IndiaAI GPU figures by stage (same unit: GPUs). Different stages, not additive.
export const INDIA_GPU_STAGES = [
  { stage: 'Original target', value: 10000, plus: true, date: 'Mar 2024', source: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2012355', note: 'Common compute target when the IndiaAI Mission was approved' },
  { stage: 'Onboarded', value: 38231, plus: false, date: 'Mar 2026', source: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2245063', note: 'GPUs onboarded from 14 providers, per the government' },
  { stage: 'Shared capacity', value: 45000, plus: true, date: 'Jun 2026', source: 'https://www.pib.gov.in/FactsheetDetails.aspx?Id=150860&lang=1&reg=48', note: 'Shared capacity as of June 2026, per the August factsheet' },
];
