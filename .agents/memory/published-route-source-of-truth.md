---
name: Published route source of truth
description: Static publishing files and newsroom metadata must agree on every public article route.
---

The root sitemap and RSS feed should be served from the live API so they reflect newly published releases without a web rebuild. Static article HTML and route metadata remain build-time snapshots; keep an article-only missing-file fallback so a post-build slug can load the SPA without shadowing existing pre-rendered articles.

**Why:** Replit static rewrites preserve an existing matching file and only rewrite missing paths. The fallback lets readers open a newly published route, but its first HTML response still carries generic build-time metadata until browser JavaScript runs; social crawlers and non-JavaScript clients may not see the article-specific title, canonical, or structured data.

**How to apply:** Keep the public API snapshot free of editorial scheduling data and use it for hydrated article content, the root sitemap, and RSS. If first-response SEO is required for post-build releases, add request-time rendering or metadata injection within the existing Express/Vite architecture and verify the raw HTTP response without executing JavaScript.