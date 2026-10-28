---
name: Public sitemap contract
description: Keep the public crawler sitemap index separate from the existing flat newsroom API sitemap.
---

The public `/sitemap.xml` is a sitemap index with route-specific child documents. The existing `/api/newsroom/sitemap.xml` remains a flat URL set for API consumers that depend on its current response shape.

**Why:** Switching the API response in place breaks release and metadata consumers that parse URL entries directly; public crawlers still need a standard index that can grow across article, topic, author, static, and news sitemaps.

**How to apply:** Route the public sitemap to a dedicated API index endpoint, keep the legacy API URL set stable, and verify both the index and its public child documents.
