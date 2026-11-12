# Global AI News: website

A fast, fully static news site built with [Astro](https://astro.build). Every page is pre-rendered HTML with complete SEO metadata. There is no database, no login, and no API that has to be up for Google to see an article.

## Everyday use

```bash
cd site
npm install
npm run dev          # http://localhost:4321
npm run build        # builds ./dist and runs the SEO checks
PORT=3000 node server.mjs   # serve ./dist in production
```

- **Add an article:** create `src/content/articles/<slug>.md` (see [CONTENT-GUIDE.md](./CONTENT-GUIDE.md)), put images in `public/images/articles/<slug>/`, run `npm run build`, commit, and publish.
- **Schedule an article:** give it a future `date`. The production server checks every 5 minutes and rebuilds itself when a scheduled time passes, so it goes live automatically, with no Republish needed. Preview everything with `PUBLISH_SCHEDULED=true npm run dev`.
- **Before pushing scheduled articles, run `npm run test:schedule`.** It builds the site as it will look at every upcoming publish time. This catches, for example, an article that links to another article that isn't live yet (that would block its auto-publish).
- **Fix a mistake:** edit the Markdown, set `updated:` to today, and add a note at the end under a `## Correction` heading.
- **Site settings** (name, contact email, AdSense ID, ad slot IDs, analytics, sections) are in `src/site.config.ts`.
- **Newsletter:** set `NEWSLETTER.url` in `src/site.config.ts` to a free Substack or Beehiiv signup page; the signup block then appears on the homepage and every article. Empty = hidden.
- **People:** real editors and authors live in `src/data/people.ts` (bio, photo `image`, profile links `sameAs`). Only add real people who agreed to be listed.
- **Reader features:** search palette (Ctrl/⌘+K, index at `/search.json`), Light/Dark/Auto theme switch, Listen (browser text-to-speech), clickable `[n]` citations with source previews, and a floating table of contents on wide screens. All build themselves from the content; nothing to maintain.
- **Old URLs** are redirected (301) through `redirects.mjs`. Add a line there whenever you rename or remove an article.

## What the build produces

| Path | What it is |
|---|---|
| `/`, `/latest/`, `/models/`, `/policy/`, `/india/`, `/infrastructure/`, `/safety/`, `/business/`, `/research/`, `/reports/` | Home, all stories, section pages |
| `/article/<slug>/`, `/reports/<slug>/` | Articles and comparison guides, with NewsArticle + Breadcrumb JSON-LD |
| `/about-us/`, `/editorial-policy/`, `/contact-us/`, `/privacy/`, `/terms/`, `/disclaimer/` | Trust and legal pages (required for AdSense) |
| `/sitemap.xml`, `/news-sitemap.xml`, `/feed.xml`, `/robots.txt`, `/ads.txt` | Crawl and ad files |
| `_redirects`, `_headers` | Redirects and headers for Cloudflare Pages / Netlify |

`npm run build` fails if any page is missing a title, description, canonical or exactly one `<h1>`; if titles or descriptions are duplicated; if an internal link or image is broken; if an image lacks alt text; or if the sitemap lists a page that doesn't exist.

## Hosting

**Replit (current):** the web artifact in `artifacts/global-ai-news/.replit-artifact/artifact.toml` builds this folder and runs `node site/server.mjs`. Publish from Replit as usual. The server issues real 301 redirects for old URLs, sends apex `globalainews.in` to `www`, gzips responses, sets cache headers and returns real 404s. Scheduled articles go live automatically (the server rebuilds itself when a publish time passes; set `AUTO_PUBLISH=false` to disable).

**Cloudflare Pages (recommended, free, faster):** connect the GitHub repo, set the root directory to `site`, the build command to `npm run build` and the output directory to `dist`. `_redirects` and `_headers` are generated automatically. To make scheduled articles go live on their own, create a deploy hook in Cloudflare and save it as the `CF_PAGES_DEPLOY_HOOK` secret in GitHub; `.github/workflows/site.yml` calls it every day at 07:45 UTC.
