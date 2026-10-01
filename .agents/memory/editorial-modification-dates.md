---
name: Editorial modification dates
description: Contract for stable article modification dates in newsroom content, JSON-LD, and sitemap metadata.
---

Preserve explicit editorial modification dates across release reschedules, but do not emit a public modification date earlier than publication. When `dateModified` is absent or earlier than `datePublished`, omit `dateModified`, `article:modified_time`, and article sitemap `lastmod`; never substitute publication date or build time.

**Why:** The production CMS snapshot can record the last editorial edit before a scheduled article is released. That timestamp is not a post-publication update, and falling back to publication or build time creates an unsubstantiated modification date.

**How to apply:** Maintain `dateModified` with story content and update it only when editorial content changes. Rescheduling or reordering must preserve it. Use the shared publication-safe date helper for prerendered article markup, hydrated article UI, and article head metadata; never inspect the raw field independently. Emit the value in JSON-LD and sitemap metadata only when it is valid and at or after publication; show “Updated” only when that explicit date differs from publication. Test that changing only the manifest build time does not change article dates.