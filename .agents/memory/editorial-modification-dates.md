---
name: Editorial modification dates
description: Contract for stable article modification dates in newsroom content, JSON-LD, and sitemap metadata.
---

The scheduled stories `reliability-is-the-new-ai-moat`, `public-compute-needs-public-metrics`, and `weekly-deep-dive-cost-of-intelligence` use `2026-09-21` as their explicit `dateModified`. Their publication dates remain `2026-09-21`, `2026-09-23`, and `2026-09-28`.

**Why:** The production CMS snapshot reported `2026-09-21` for all three stories, while build-time fallback made local metadata drift for the later scheduled articles. API records can also omit `dateModified`; a fixed publication-date fallback keeps JSON-LD stable without inventing a newer date.

**How to apply:** Maintain `dateModified` with story content, persist it on editor-created records, and update it only when editorial content changes. Rescheduling or reordering a release must preserve it. JSON-LD uses the explicit date or the fixed publication date when absent; sitemap `lastmod` uses the explicit date when available. Emit `article:modified_time` only for explicit dates and show “Updated” only when that date differs from publication. Test that changing only the manifest build time does not change article dates.