---
name: Published route source of truth
description: Static publishing files and newsroom metadata must agree on every public article route.
---

The root sitemap and RSS feed should be served from the live API so they reflect newly published releases without a web rebuild. Static article HTML and route metadata remain build-time snapshots; keep an article-only missing-file fallback so a post-build slug can load the SPA without shadowing existing pre-rendered articles.

**Why:** Replit static rewrites preserve an existing matching file and only rewrite missing paths. The fallback lets readers open a newly published route, but its first HTML response still carries generic build-time metadata until browser JavaScript runs; social crawlers and non-JavaScript clients may not see the article-specific title, canonical, or structured data.

**How to apply:** Keep the public API snapshot free of editorial scheduling data and use it for hydrated article content, the root sitemap, and RSS. If first-response SEO is required for post-build releases, add request-time rendering or metadata injection within the existing Express/Vite architecture and verify the raw HTTP response without executing JavaScript.

After publishing a change that spans the web and API artifacts, a successful-build status alone does not prove that every live route is running the current workspace revision. Compare the public routes directly on the production URLs.

**Why:** Production checks showed a successful deployment state while both published hosts still exposed editor GET routes, leaked schedule fields, served a shorter root RSS feed, and missed current trust routes.

**How to apply:** Verify the homepage, API projection, editor authorization, root/API feeds, sitemap, trust routes, and 404/noindex behavior on each published host. Do not create production editorial records just to test a release; use an isolated fixture or leave the deployed publication flow explicitly unverified.