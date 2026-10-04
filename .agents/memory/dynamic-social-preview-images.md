---
name: Dynamic social preview images
description: Image format and serving expectations for stories published after build-time social card generation.
---

Build-time article cards use stable PNG files. If a published story has no built image, first-response metadata should point to a public API route that generates a PNG from the shared social-card renderer. Do not use SVG as the social metadata fallback because crawler support is inconsistent.

**Why:** Stories published after the web build still need a social image that works across Open Graph and Twitter crawlers without rebuilding the web artifact.

**How to apply:** Preserve existing `/social/articles/<slug>.png` URLs for built articles. For dynamic articles, verify anonymous image fetches return a valid 1200×630 PNG for published stories and 404 for scheduled stories.