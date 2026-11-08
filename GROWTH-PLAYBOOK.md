# Global AI News: growth playbook

The site is now technically sound. Growth from here comes from three things: **publishing steadily, getting each article in front of people on the day it goes live, and building trust signals Google can see.** This list is ranked by impact for the effort.

## What the site already does for you (no action needed)

- **Scheduled articles publish themselves** at 07:30 UTC (1 p.m. IST) on their date. The server rebuilds within 5 minutes.
- **IndexNow:** when an article auto-publishes, the server notifies Bing, Yandex and other IndexNow engines immediately. Bing results also power ChatGPT search and Microsoft Copilot.
- **Google:** the sitemap and Google News sitemap update on every publish.
- **Share buttons** (WhatsApp, X, LinkedIn, Telegram, Reddit, Email) on every article, plus branded 1200px social cards for good previews.
- **`/llms.txt`**: a clean map of the site for AI assistants and AI crawlers.
- Structured data for Google (NewsArticle, Breadcrumb, Organization), fast static pages with no first-party JavaScript, and mobile-first layout.

## Do this week (one-time, about 2 hours total)

| # | Action | Link | Why |
|---|---|---|---|
| 1 | **Search Console:** submit `sitemap.xml` and `news-sitemap.xml`, check Manual actions, request indexing for the top 10 pages (see `DEPLOY-ON-REPLIT.md`, Step 8) | https://search.google.com/search-console | The fastest way back into Google |
| 2 | **Bing Webmaster Tools:** sign in, choose **Import from Google Search Console** | https://www.bing.com/webmasters | Bing feeds ChatGPT search, Copilot and DuckDuckGo; takes 5 minutes |
| 3 | **Google Publisher Center:** add the publication, its sections and logo | https://publishercenter.google.com/ | Helps with Google News eligibility and branding |
| 4 | **Create social channels** and add their URLs to `SITE.social.sameAs` in `site/src/site.config.ts`: a WhatsApp Channel, X, LinkedIn page and Telegram channel | — | `sameAs` links the brand across platforms for Google; WhatsApp channels are the biggest distribution route in India |
| 5 | **Start a free newsletter** (Beehiiv, Substack or Buttondown) and send me the signup link; I'll add a signup box to every article | https://www.beehiiv.com/ · https://substack.com/ | Email is the audience you own; Google can't take it away |
| 6 | **Real editor profile:** a name, photo, 3-line bio and LinkedIn link for whoever reviews articles; send it to me and I'll add an author page and link every byline to it | — | The single biggest E-E-A-T gain left; Google rewards identifiable, accountable people |
| 7 | **AdSense → Privacy & messaging → European regulations** message | https://www.google.com/adsense/ | Required for ads in the EEA and UK |

## Every article: the 15-minute launch routine

Do this on publish day (1 p.m. IST):

1. **Search Console → URL Inspection → Request indexing** for the new article.
2. **WhatsApp Channel and Telegram:** headline, 2 key takeaways, link.
3. **LinkedIn** (personal profile and page): a short post opening with the most surprising number, plus the article's chart image. Put the link in the first comment.
4. **X:** a thread of 3–4 posts with the key facts and one chart; link in the last post.
5. **Communities, only where it genuinely fits:** r/india or r/developersIndia for India AI pieces; r/artificial, r/MachineLearning or Hacker News (`news.ycombinator.com/submit`) for deep explainers. Post the article's insight, not just the link.
6. **Reply to journalists' and experts' posts** on the same topic with your chart. That earns backlinks.

## Publishing rhythm (3–4 articles a week)

| Day | Format | Example |
|---|---|---|
| Mon | News explainer on last week's biggest AI story | "Gemini 4 Carbon: who gets it first" |
| Wed | Evergreen explainer answering a common search | "What is an AI agent?" |
| Fri | **"This week in AI, explained"**: 5 stories in 5 paragraphs, each linking to a full article | New weekly series |
| Sun (optional) | India AI focus or a refreshed guide | "IndiaAI compute: how to apply" |

Already scheduled: 9, 10, 11, 12, 13, 14, 16, 17, 18 and 20 November. After 20 November the queue is empty, so start writing the next batch now. The topic list is in `SITE-OVERHAUL.md` §6, and `site/CONTENT-GUIDE.md` has the template and headline formulas.

**Search demand to target first** (evergreen, steady traffic, low competition for a new site):
- "ChatGPT vs Gemini vs Claude" style comparisons; refresh the 6 guides monthly and bump `updated:`
- "What is …" explainers: AI agent, RAG, context window, open weights, AI watermark, model card, MCP, fine-tuning, tokens
- India-specific: IndiaAI Mission GPUs, how to apply for IndiaAI compute, India AI rules, AI jobs in India, Indian LLMs (Sarvam, Krutrim and others)
- Deadline guides: EU AI Act dates, India IT Rules compliance, AI rules calendar (monthly)

## Monthly review (30 minutes)

In Search Console → **Performance**, filter by page:
- **High impressions, CTR below 2%:** rewrite the `seoTitle` and `description` to be more specific. This is the fastest traffic gain.
- **Queries at positions 8–20:** add a section or FAQ answering exactly that query, set `updated:`, and request indexing.
- **Pages report:** fix any new 404s by adding a line to `site/redirects.mjs`.

In Microsoft Clarity (https://clarity.microsoft.com/), check where readers stop scrolling on long articles and tighten those sections.

## When to apply to AdSense again

Once **35+ articles** are live, Search Console shows most of them **indexed**, and the site has had steady publishing for **3–4 weeks**: AdSense → Sites → Request review. With the current schedule, that's realistically early-to-mid December 2026 if you keep publishing 3–4 articles a week.
