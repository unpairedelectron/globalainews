// Permanent (301) redirects from URLs the old site exposed. Used by
// astro.config.mjs, the Node server (server.mjs) and the generated
// Cloudflare Pages _redirects file, so all three hosts behave the same.

export const redirects = {
  // Short aliases the old site accepted.
  '/article/antibiotic/': '/article/ai-models-antibiotic-discovery/',
  '/article/small-models/': '/article/small-models-serious-workflows/',
  '/article/watermarking/': '/article/quiet-race-watermark-everything-ai-makes/',
  '/article/founders/': '/article/reliability-is-the-new-ai-moat/',
  '/article/india-stack/': '/article/india-ai-compute-access-2026/',
  '/article/infrastructure/': '/article/weekly-deep-dive-cost-of-intelligence/',

  // Stories withdrawn or merged during the 2026 rebuild.
  '/article/indias-public-ai-stack/': '/article/india-ai-compute-access-2026/',
  '/article/public-compute-needs-public-metrics/': '/article/india-ai-compute-access-2026/',
  '/article/founders-first-million-model-calls/': '/article/reliability-is-the-new-ai-moat/',
  '/article/new-geography-of-compute/': '/article/weekly-deep-dive-cost-of-intelligence/',
  '/research/india-ai-compute-2026/': '/article/india-ai-compute-access-2026/',

  // Old section and utility routes.
  '/brief/': '/latest/',
  '/archive/': '/latest/',
  '/signals/': '/latest/',
  '/essays/': '/latest/',
  '/topics/': '/latest/',
  '/data/': '/latest/',
  '/ask/': '/latest/',
  '/search/': '/latest/',
  '/topic/ai/': '/latest/',
  '/topic/india/': '/india/',
  '/industry/': '/business/',
  '/about/': '/about-us/',
  '/contact/': '/contact-us/',
  '/code-of-ethics/': '/editorial-policy/',
  '/privacy-policy/': '/privacy/',
  '/terms-of-use/': '/terms/',
  '/insights/': '/',
  '/sign-in/': '/',
  '/sign-up/': '/',
  '/admin/release/': '/',
  '/rss.xml': '/feed.xml',
  '/rss/': '/feed.xml',

  // Old root-level guides still listed in Search Console.
  '/chatgpt-vs-claude-vs-gemini-2026/': '/reports/ai-assistants-compared/',
  '/midjourney-vs-dalle-vs-stable-diffusion-2026/': '/reports/ai-image-tools-compared/',
  '/generative-ai-adoption-statistics/': '/trackers/',
  '/ai-industry-statistics-2026/': '/trackers/',
};

// URLs from the old site whose content was removed for good (the auto-generated
// /article/<uuid>/<slug> news pages). They answer 410 Gone so Google drops them
// quickly instead of re-crawling them as low-quality pages.
export const gonePatterns = [
  /^\/article\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(\/|$)/i,
];

// Prefix rules: /amp/article/<slug>/ -> /article/<slug>/
export const prefixRedirects = [['/amp/article/', '/article/']];
