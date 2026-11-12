// Single source of truth for site identity, monetisation and owner details.
// OWNER: review every value marked "CONFIRM" before publishing.

export const SITE = {
  name: 'Global AI News',
  url: 'https://www.globalainews.in',
  tagline: 'AI news, explained with the sources.',
  description:
    'Global AI News explains the biggest stories in artificial intelligence—models, policy, chips, jobs and India’s AI push—with every claim linked to its source.',
  locale: 'en_IN',
  lang: 'en-IN',
  // Shown on About, Contact, Privacy and Terms. CONFIRM.
  publisher: {
    name: 'Shiv Shakti Mishra',
    location: 'Pune, Maharashtra, India',
    email: 'samfischer14aug@gmail.com', // CONFIRM: a domain address such as editor@globalainews.in is better for trust.
  },
  // Byline used on every article. A named desk is honest; add individual
  // author profiles only for real people who agree to be listed.
  desk: 'Global AI News Desk',
  founded: '2026',
  social: {
    // Add profile URLs once they exist; they are emitted as Organization.sameAs.
    sameAs: [] as string[],
  },
};

export const ADS = {
  // Google AdSense publisher ID (also in public/ads.txt).
  client: 'ca-pub-3766621537317806',
  // Manual ad units, placed where they don't interrupt reading (see
  // src/components/AdSlot.astro for the placement rules). Create each unit in
  // AdSense (Ads -> By ad unit) and paste its numeric data-ad-slot ID here.
  // While a value is empty, that placement renders nothing.
  units: {
    mid: '1369592419',  // "GAN In-Article" (In-article): between sections inside articles
    end: '1113775614',  // "Article Footer" (Display): end of article, before Read next
    rail: '4147133064', // "Article Sidebar" (Display): desktop sticky right rail, 300x600
    home: '3739938958', // "Homepage Bottom" (Display): homepage between sections
    list: '7649161359', // "GAN Feed In-Content" (Display): inside Latest / section lists
  },
};

// IndexNow key (file public/<key>.txt). Lets the server notify Bing and others of new URLs.
export const INDEXNOW_KEY = '2abb0c77dfd1018d907f3426f86ce2a9';

// Newsletter: paste the public signup page of a free Substack or Beehiiv
// newsletter. Leave empty to hide every newsletter block on the site.
// Signups happen on that service, so no email addresses are collected here.
export const NEWSLETTER = {
  url: '',
  cadence: 'every Friday',
};

// Optional analytics. Leave empty to load nothing.
export const ANALYTICS = {
  ga4: '', // e.g. 'G-XXXXXXX'
  clarity: 'x8gfztdtd7', // Microsoft Clarity project carried over from the old site.
};

export type CategoryKey =
  | 'models'
  | 'policy'
  | 'india'
  | 'infrastructure'
  | 'safety'
  | 'business'
  | 'research'
  | 'guides';

export const CATEGORIES: Record<
  CategoryKey,
  { name: string; path: string; title: string; description: string }
> = {
  models: {
    name: 'AI Models',
    path: '/models/',
    title: 'AI Model Releases and Benchmarks',
    description: 'New AI model releases from OpenAI, Google, Anthropic, Mistral and others—what changed, what the benchmarks measure, and who can use them.',
  },
  policy: {
    name: 'Policy & Regulation',
    path: '/policy/',
    title: 'AI Policy and Regulation News',
    description: 'AI laws, deadlines and standards explained—from the EU AI Act to content provenance rules—with links to the official texts.',
  },
  india: {
    name: 'India AI',
    path: '/india/',
    title: 'India AI News: IndiaAI, GPUs and Rules',
    description: 'India’s AI story: the IndiaAI Mission, GPU tenders, compute access, MeitY rules and the companies building for India.',
  },
  infrastructure: {
    name: 'Chips & Infrastructure',
    path: '/infrastructure/',
    title: 'AI Chips, Data Centres and Energy',
    description: 'Data centres, GPUs, power demand and Big Tech capital spending—the physical economy behind artificial intelligence.',
  },
  safety: {
    name: 'Safety & Security',
    path: '/safety/',
    title: 'AI Safety and Security News',
    description: 'AI incidents, agent security, model containment and practical controls—what happened, and what it means for teams and users.',
  },
  business: {
    name: 'Business & Work',
    path: '/business/',
    title: 'AI Business, Jobs and Developers',
    description: 'The business of AI: company filings, IPOs, workforce changes and how AI is changing software development.',
  },
  research: {
    name: 'Research',
    path: '/research/',
    title: 'AI Research Papers Explained',
    description: 'New AI research papers and scientific results, explained in plain English with their limits clearly stated.',
  },
  guides: {
    name: 'Guides & Comparisons',
    path: '/reports/',
    title: 'AI Tools Compared: Guides',
    description: 'Side-by-side guides to AI assistants, image generators, coding agents and models—built from vendor documentation and reviewed monthly.',
  },
};

export const NAV: CategoryKey[] = ['models', 'policy', 'india', 'infrastructure', 'safety', 'business', 'guides'];
