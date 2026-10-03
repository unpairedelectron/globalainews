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

When root RSS differs from API RSS, inspect production response headers and target identity before changing publication eligibility. A static-style root response with an older `Last-Modified` and `Accept-Ranges`, contrasted with an Express/API RSS response, points to a separate stale root artifact. AMP checks must also compare each article's declared target, returned title, and canonical—not just HTTP 200.

**Why:** After republishing, root RSS still returned three items from a static-style response while the API feed returned ten; six article pages also pointed to the same AMP route and content.

**How to apply:** Use a cache-busted request and compare headers, article sets, AMP target URLs, and canonical destinations on production. Preserve the eligible article set; fix the serving route or artifact instead of hiding a routing mismatch by changing editorial rules.

Do not assume the `localhost:80` service routing used by workspace web requests is available to server-side fetches in a published web service. A web/API origin that cannot be reached at runtime can produce 503s for root XML, article HTML, and trust pages while the public `/api` endpoints remain healthy. Replit documents path-based artifact routing but does not provide a private per-service hostname for these server-side calls; use a verified production origin when no private target is exposed.

**Why:** Production logs showed web-side `fetch failed` errors for those routes while the same deployment returned 200 from the namespaced API endpoints. After configuring the web service with the verified public origin, both published hosts served root XML and server-rendered articles/trust pages successfully.

**How to apply:** Keep the development proxy origin separate from production. For cross-artifact server rendering and proxy routes, verify the configured production origin from the web handler itself and preserve API authorization; a successful build and healthy public API alone do not prove that connection works.

The local link-audit server must model production ownership for root XML routes after static feed and sitemap files are removed; proxy `/feed.xml` and `/sitemap.xml` to their namespaced API endpoints.

**Why:** A build-only smoke server otherwise falls back to the SPA shell, so tests can report HTML as a successful root feed response even when the real web server correctly proxies the API.

**How to apply:** Keep static-output and Vite-dev smoke checks explicit about which server they exercise, and verify root XML parity against the API endpoints.