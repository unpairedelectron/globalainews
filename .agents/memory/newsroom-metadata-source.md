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

Initial-response and app-served SEO checks should share one route-aware primary structured-data expectation. Research, data, and topic routes use their own primary schema types; social-preview images and AMP relationships remain article-specific.

**Why:** The raw-HTML and hydrated-route smoke paths had separate expectations, and authority pages inheriting a linked article's preview image violated the existing article-only metadata contract.

**How to apply:** Reuse the same route-type helper for both SEO checks, and keep article-only image and AMP assertions scoped to article routes.

Only owner-verified contributors should receive personal bylines or indexable profiles; otherwise attribute the story to the organization. Keep trust pages non-indexable until the owner verifies the publication's contact and corrections channels and operating details. Do not invent identities, biographies, contact information, or procedures.

**Why:** The available evidence does not establish contributor identities, biographies, or an approved public contact path; publishing those as facts would overstate what the newsroom can verify.

**How to apply:** Apply this boundary whenever changing bylines, author profiles, trust-page content, route metadata, or release attribution. Ask the owner to verify missing details before making them public.