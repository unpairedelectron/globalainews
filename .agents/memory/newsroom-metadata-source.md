---
name: Newsroom metadata source
description: The source boundary for initial HTML and hydrated publication metadata.
---

Initial route metadata should be generated from the API-backed newsroom metadata manifest, while hydrated pages resolve the same records after the content snapshot loads. Production publication builds require both a fresh metadata manifest and its matching content snapshot; validate route coverage and content shape, and reject either snapshot when older than 15 minutes. Prerendered bylines and source attributions must come from those snapshot records, not invented fallbacks.

**Why:** Editorial edits can land in the maintained newsroom source without a frontend rebuild; a build-safe manifest gives static route generation an explicit contract and makes drift testable.

**How to apply:** Keep the manifest and content snapshot derived from the same newsroom source, connect release builds to both API endpoints, generate the sitemap and route HTML from them, fail builds when either endpoint is unavailable, malformed, incomplete, or stale, and compare initial and hydrated metadata against them in route smoke checks.

Route-specific robots directives must replace any generic shell directive, not append to it; non-indexable route HTML should contain one unambiguous `noindex,follow` tag before JavaScript runs.

**Why:** A base shell can already declare `index, follow`, which conflicts with a later route-specific `noindex` and leaves crawlers an ambiguous signal.

**How to apply:** Strip the shell's robots tag when generating route HTML, then add exactly one robots directive only when the route metadata requires it; assert this against the initial HTML.

Production route checks must distinguish Replit Static Deployment from the Vite preview server: this artifact serves built files statically and has only explicit auth rewrites, so an unknown production path returns 404, while Vite's development fallback can return the SPA shell with 200.

**Why:** The preview's status code does not establish how a missing path behaves in production.

**How to apply:** Confirm the artifact's production `serve` mode and rewrite rules, and test release output separately from Vite preview before making HTTP-status claims.