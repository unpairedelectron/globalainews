---
name: First-response content parity
description: Check whether indexable routes omit maintained content from their initial HTML before classifying them as thin.
---

For indexable authority and timeline routes, prerender the maintained source-backed content that the hydrated page shows. When a raw HTTP audit appears thin, compare the prerendered page with the client-rendered route before adding copy or changing indexability.

**Why:** A content audit found that entity profiles already had maintained editorial sections and primary references, and timeline pages already displayed full linked reporting and source lists after hydration. The SEO prerender omitted those sections, making first-response word counts look like missing editorial content.

**How to apply:** When first-response text and a browser or extraction tool disagree, inspect both route implementations and their shared content snapshot. Prefer rendering the existing reviewed material consistently over duplicating or inventing claims.
