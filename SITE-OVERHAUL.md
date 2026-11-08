# Global AI News: SEO and AdSense audit, rebuild and 90-day plan

**Date:** 8 November 2026 · **Branch:** `claude/fervent-dijkstra-w85ppw`

> **Scope note:** the live site (`www.globalainews.in`) could not be fetched from the audit environment because its network allowlist blocks the host. This audit is based on the full source repository, which is what the deployment runs, plus the project's own logs in `docs/`. Before re-applying to AdSense, run the Search Console checks in §5. They show what Google actually sees.

---

## 1. Why Google lost interest

The site did not fail because of one bug. Over about two months of automated "rescue" work, a series of well-meant but over-cautious decisions together told Google and the AdSense reviewers that this is a thin, unfinished site with no accountable publisher.

| # | Problem | Evidence in the old code | Impact |
|---|---|---|---|
| 1 | **No privacy policy or terms.** `/privacy` and `/terms` were deliberately made "unavailable until owner-approved legal text exists". | `docs/architecture-map.md` route table; `EditorialInputPage` in `src/pages/public.tsx` | AdSense **requires** a privacy policy that discloses Google's ad cookies. On its own this is grounds for rejection or limited ads. |
| 2 | **About, Contact, Corrections and Code of ethics served with `noindex`.** | `docs/architecture-map.md` ("Verified editorial-policy copy with 200 and noindex") | Google can't connect the site to an accountable publisher, which weakens E-E-A-T. Reviewers see placeholder trust pages. |
| 3 | **Invented author personas.** Six reporters with bios and cities (Mira Patel, London; Jonas Rhee, Brussels; and so on) who do not exist. | `artifacts/global-ai-news/src/content.ts:731-736` | Fake bylines breach Google's misrepresentation policy and the "Who/How/Why" content guidance. This is a common reason for manual actions and AdSense rejection. |
| 4 | **Very little live content, and URLs disappearing.** About 7 public stories; 4 more withdrawn; essays of about 40 words; sections hidden unless they had 6+ items. | `withdrawnStorySlugs`, `essays` in `content.ts`; `CONTENT_RULES.sectionMinimumItems` in `content-rules.ts` | "Low value content" is AdSense's most common rejection reason. Withdrawn URLs and disappearing navigation look like churn to Google. |
| 5 | **The 10 strongest articles may never have gone live.** About 28,000 words of well-sourced drafts sat behind a DB publish-state gate, a release registry with `status: "scheduled"` and an owner-only Publish step. | `release/article-registry.json`, `docs/BLOCKED.md`, `docs/OWNER-RELEASE-CARD.md` | The best content was invisible to Google. |
| 6 | **AdSense code not on the page.** The ad script loaded only if `VITE_ENABLE_ADSENSE=true` and numeric slot IDs were set at build time, and only inside React after hydration. | `src/components/monetization.tsx`, `adsense-policy.ts` | AdSense review needs the code snippet in `<head>` on every page. Without it you get "We couldn't verify your site" or ads never serve. |
| 7 | **Fragile rendering.** A React single-page app; article HTML depended on a live API, Postgres, seeding side effects and a 78 KB custom prerender layer. The static `index.html` had one generic title for every route. A 520 KB JS entry, Clerk auth and dozens of Radix/Recharts dependencies. | `src/server.ts`, `seo-prerender.tsx`, `docs/architecture-map.md` ("Production/local parity is known to be mismatched") | If any part failed, crawlers got an empty shell or a generic page. The project's own notes record a stale production deploy and a mobile LCP of 3.9 s. |
| 8 | **Unrelated content on the domain.** A privacy policy for a separate wellness app (GlucoSmart) and tool-like pages (`/ask`, `/signals`, `/glossary`, `/insights`, entity directories). | `src/App.tsx` routes | Thin or unrelated pages dilute site quality signals. |
| 9 | **Headlines nobody searches for, and over-hedged copy.** For example, "Preprint links cooperative game choices to familiar action labels" and "EU AI Act Deadlines Are Not One Deadline". Almost every paragraph ends with a disclaimer. | `content.ts`, `release/article-registry.json` | Accurate, but low click-through and no match to search intent. Readers bounce. |
| 10 | **Process overload.** 1,000+ files, 40+ agent memory files, dozens of audit reports and test gates. Publishing an article needed code, DB and owner steps. | `docs/`, `.agents/`, `research/` | Publishing stalled. A news site that doesn't publish steadily loses crawl priority. |

What was **fine**: `robots.txt`, `ads.txt` (correct publisher ID), HTTPS, and the research quality of the October 2026 drafts. Those drafts are now the core of the new site.

---

## 2. What has been rebuilt (in `site/`)

A new static site that removes every problem above:

**Structure**
- Astro static site: every page is complete HTML at build time. No database, API, login or client-side rendering is needed to read or index an article. JavaScript on article pages is zero, apart from ads and analytics.
- Clean information architecture: Home → 8 sections (AI Models, Policy & Regulation, India AI, Chips & Infrastructure, Safety & Security, Business & Work, Research, Guides & Comparisons) → articles, with breadcrumbs, "Read next" and a full `/latest/` archive.
- **URL continuity:** all existing article URLs (`/article/<slug>/`, `/reports/<slug>/`) are kept. 40+ old routes (aliases, withdrawn stories, `/brief`, `/signals`, `/amp/article/*`, `/code-of-ethics`, and others) **301-redirect** to the best live page (`site/redirects.mjs`).

**Content (23 articles, about 47,000 words)**
- The 10 sourced October/November 2026 articles: Anthropic S-1, OpenAI training incident, Big Tech capex, Gemini 4 Carbon, GitHub Octoverse, India IT Rules, C-DAC GPU tender, EU AI Act deadlines, AI and job cuts, AI agents and passwords. All original SVG charts are included.
- 7 surviving legacy articles (new headlines, citations converted to numbered sources).
- 6 evergreen comparison guides (for example, "ChatGPT vs Claude vs Gemini vs Copilot (2026)").
- Every article now has a **search-intent headline**, a ≤60-character SEO title, a 120–200-character meta description, and a **Key takeaways** box.
- Draft-only language removed ("this draft", "private draft", dead "Subscribe" and "Related coverage" blocks).
- **Scheduling kept:** 4 of the 10 new articles are live now (2, 3, 5 and 7 Nov). The other 6 go live on 9, 11, 13, 16, 18 and 20 Nov at 07:30 UTC, at the next build after each date.

**Trust and AdSense**
- Indexable About, Editorial policy (sourcing, AI-use disclosure, corrections), Contact, Privacy (with the AdSense-required Google cookie disclosures and opt-out links), Terms and Disclaimer pages, linked from every footer.
- Fake personas removed. Bylines read "Global AI News Desk", with the real reviewer named where the drafts recorded one (Aman Mishra).
- AdSense auto-ads script plus `google-adsense-account` meta in `<head>` on every content page. Optional manual in-article units switch on by pasting slot IDs in `site.config.ts`. Kept off legal, 404 and noindex pages.
- GlucoSmart policy kept at its URL (app-store links keep working) but `noindex` and ad-free.

**Technical SEO**
- `NewsMediaOrganization` (with publishing, corrections and ethics policy links), `NewsArticle` / `Article`, `BreadcrumbList`, `CollectionPage`, `AboutPage` and `ContactPage` JSON-LD.
- Canonicals, Open Graph and Twitter cards with 1200×630 images, `article:published_time` and `article:modified_time`, `max-image-preview:large`.
- `sitemap.xml` with accurate `lastmod`, a Google News `news-sitemap.xml` (last 48 hours), RSS at `/feed.xml`, `robots.txt` listing both sitemaps, and `ads.txt`.
- Build-time SEO gate (`site/scripts/check-build.mjs`): fails on a missing or duplicate title or description, a missing canonical, anything other than one `<h1>`, broken internal links or images, missing alt text, or sitemap URLs that don't exist.
- Production server (`site/server.mjs`, zero dependencies): real 301s, apex→www, gzip, long-cache static assets, real 404 status, security headers.
- Mobile checked: no horizontal overflow, readable type, sticky scrollable section nav, light and dark mode.

**Deployment**
- `artifacts/global-ai-news/.replit-artifact/artifact.toml` now builds `site/` and runs `node site/server.mjs`, so a normal Replit **Publish** ships the new site. The old React app's code is untouched, so rolling back is a revert of that file.
- `.github/workflows/site.yml` builds and runs the SEO checks on every push. With Cloudflare Pages it also triggers a daily rebuild so scheduled articles publish themselves (see `site/README.md`).

---

## 3. Before you publish: things only you can confirm

Edit `site/src/site.config.ts`:

1. **Publisher identity.** Currently *Shiv Shakti Mishra, Pune, Maharashtra*. This was taken from the GlucoSmart page already live on this domain. Confirm, or replace with the right person or company.
2. **Contact email.** Currently `samfischer14aug@gmail.com`, the address already published on the site and used as the editor email. A domain address such as `editor@globalainews.in` looks more credible; Cloudflare Email Routing or Zoho Mail can provide one for free.
3. **Reviewer name.** The drafts list **Aman Mishra** as reviewer on all 10 new articles. Keep it only if that person really reviews and agrees to be named. Ideally, add a short real bio for the editor on the About page; a real, named editor is the biggest E-E-A-T gain available.
4. **AdSense dashboard → Privacy & messaging:** turn on the **European regulations (GDPR) consent message**. Google requires a certified CMP for EEA/UK/CH traffic, and the privacy policy says one is shown.
5. Microsoft Clarity (`x8gfztdtd7`) is carried over. Add a GA4 ID if you want Google Analytics.

---

## 4. Cutover checklist

1. Merge this branch into `main`.
2. In Replit, open the project and click **Publish**. The web artifact builds `site/` with `npm ci && npm run build` and starts `node site/server.mjs`.
3. After the deploy, check: `/`, an article, `/sitemap.xml`, `/ads.txt`, `/robots.txt`, `/article/antibiotic/` (should 301), `/does-not-exist/` (should 404).
4. Optional: remove the `api-server` artifact from the deployment once you are sure nothing else uses `/api` (the new site doesn't). That also removes the Postgres, Clerk and automation running costs.
5. Republish on 9, 11, 13, 16, 18 and 20 Nov so scheduled articles appear, or move to Cloudflare Pages with the deploy hook (§2) to automate it.

---

## 5. Google Search Console and AdSense recovery

**Week 0 (cutover day)**
1. Search Console → **Security & Manual actions → Manual actions.** If there is a manual action (for example "Thin content with little or no added value" or "Spammy"), the rebuild is your fix. Submit a **reconsideration request** that explains the specifics: fake bylines removed, legal and trust pages published, thin pages removed or redirected, 23 sourced articles live, editorial policy added.
2. **Sitemaps:** remove old sitemaps and submit `https://www.globalainews.in/sitemap.xml` and `/news-sitemap.xml`.
3. **URL inspection → Request indexing** for the home page, the 6 legal and trust pages, and the 10 strongest articles.
4. **Pages report:** watch "Not found (404)" and "Page with redirect". Redirects are expected; add any important 404s to `site/redirects.mjs`.
5. Check that the property covers both `globalainews.in` and `www` (use a Domain property).

**Weeks 1–4: build depth before asking AdSense for review**
- Publish 3–4 new articles a week (plan in §6) until you have **35+ substantial articles**.
- Don't add ad units manually yet; keep Auto ads at the default density.

**Week 4–5**
- AdSense → **Sites → globalainews.in → Request review.** Make sure the ads.txt status reads "Authorized".
- If you're rejected, the email names a category. Fix that specific issue and wait 2+ weeks before reapplying. Repeated rapid re-submissions hurt.

---

## 6. 90-day content plan

**Positioning.** *AI news, explained with the sources:* the site that tells you what a big AI number or announcement actually means. Strongest angles: **India AI** (low competition, your home market), **AI rules and deadlines** (evergreen search demand), and **"X explained / X vs Y"** guides.

**Cadence:** 3–4 articles a week. Mix each week:
- 1–2 **news explainers** within 24–48 hours of a big announcement (model launch, filing, regulation, tender).
- 1 **evergreen explainer or guide** that keeps ranking for months.
- Refresh 1 older article (`updated:` date plus a correction or update note).

**Topic clusters and first 24 articles.** Research leads and sources for most of these already exist in `research/70-article-launch/`. Re-check every fact before publishing; several leads date from September 2026.

| Cluster | Pillar (link everything here) | Supporting articles |
|---|---|---|
| **India AI** | IndiaAI Compute in 2026 (live) | India data-centre capacity: operational vs pipeline · What "schedulable GPU capacity" means · AIKosh datasets explained · India data-centre water use · How to apply for IndiaAI compute (step by step) |
| **AI regulation** | EU AI Act Deadlines 2026–2028 (live 16 Nov) | EU AI Act for Indian companies: does it apply to you? · EU KIDS Act and AI companions · India's AI rules (live) · The GPAI code of practice explained · AI watermarking laws compared |
| **AI agents** | Should You Give an AI Agent Your Password? (live 20 Nov) | What is an AI agent? (plain-English guide) · How to set permissions for an AI agent · OWASP agentic Top 10 explained · Agent benchmarks: what a pass rate means |
| **Models and tools** | ChatGPT vs Claude vs Gemini vs Copilot (live) | How to read an AI model card · Open weights vs open source · Context window vs memory vs RAG · How to choose a small model · Why AI detectors can't prove authorship |
| **AI infrastructure and money** | Big Tech AI Capex 2026 (live 9 Nov) | AI data-centre electricity: what IEA's 2025 numbers show · PUE vs WUE explained · GPU cloud pricing: reserved vs on-demand |

**Formats that bring repeat traffic**
- A monthly **"AI rules calendar"** (deadlines across the EU, India, the US and UK).
- A **"This week in AI, explained"** roundup every Friday that links to your own articles (good for internal links and Google Discover).
- Keep the comparison guides on their monthly review cycle and bump `updated:` each time.

**Distribution:** post every article to X/LinkedIn with one chart, submit to Google News via Publisher Center, and add the RSS feed to Feedly. Answer related questions on Reddit or Quora only where a link genuinely helps.

**Metrics to watch (Search Console, monthly):** indexed pages vs published pages, impressions and CTR per article (rewrite titles under 2% CTR after 4 weeks), and queries you rank 8–20 for (expand those articles).

---

## 7. After cutover: optional cleanup

Once the new site has been live and stable for a few weeks, the old application (`artifacts/global-ai-news`, `artifacts/api-server`, `artifacts/mockup-sandbox`, `lib/`, `cloudflare/`, `.agents/`, most of `docs/` and `screenshots/`) can be deleted from the repo. Keep `research/` and `docs/editorial-drafts/` as the source archive.
