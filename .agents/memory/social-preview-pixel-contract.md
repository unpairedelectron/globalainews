---
name: Social preview pixel contract
description: Durable guidance for validating generated social preview artwork with raster-level checks.
---

Build-time validation and smoke coverage should use the same renderer-owned title region, title color, and supported size tiers rather than duplicating SVG geometry independently.

**Why:** Estimated text width does not catch low-contrast raster output or clipping introduced by font and palette changes. ImageMagick’s whole-card mean can also classify a short synthetic headline as blank even when its pixels are valid.

**How to apply:** Keep pixel checks focused on the rendered headline region, report the article route and visual condition, and make each size-tier fixture long enough to exercise the existing whole-card readability guard.