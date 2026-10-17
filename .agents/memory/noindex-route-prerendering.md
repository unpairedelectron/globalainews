---
name: Noindex route prerendering
description: Keep known noindex pages useful without turning unknown article routes into render errors.
---

Known public routes may be `noindex` while still needing complete first-response HTML. Do not equate `indexable: false` with “skip rendering.” Keep an explicit allowlist for legitimate noindex pages, and leave unknown article slugs unrendered so the request returns 404 instead of throwing during prerender.

**Why:** Section thresholds can change indexability without changing whether readers may visit the section; broadening prerendering to every noindex route also reaches unknown article slugs that have no story snapshot.

**How to apply:** When changing route indexability, verify sitemap exclusion, robots metadata/header, first-response content, and unknown-slug status separately.
