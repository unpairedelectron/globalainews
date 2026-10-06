---
name: Social preview pixel contract
description: Durable guidance for validating generated social preview artwork with raster-level checks.
---

Build-time validation and smoke coverage should use the same renderer-owned title region, title color, and supported size tiers rather than duplicating SVG geometry independently.

**Why:** Estimated text width does not catch low-contrast raster output or clipping introduced by font and palette changes. ImageMagick’s whole-card mean can also classify a short synthetic headline as blank even when its pixels are valid.

**How to apply:** Keep pixel checks focused on the rendered headline region, report the article route and visual condition, and make each size-tier fixture long enough to exercise the existing whole-card readability guard.

When preview generation is triggered by editable story content, keep that data module watched for HMR but exclude it from Vite's config-restart dependencies. Reload the updated module through Vite's SSR loader and regenerate only the changed preview; keep a regression check for both the refreshed image and the absence of a server restart.

**Why:** Vite also restarts for transitive config dependencies. A full restart raced social-image generation and could expose a truncated PNG while the server was coming back up.

**How to apply:** Use the dev server's config dependency list to suppress only the content module's restart trigger, leaving the normal module watcher active. Verify the edit/restore cycle updates the preview and produces no Vite restart log.

When a smoke test temporarily edits editorial content, derive the restore expectation from the captured original source instead of hard-coding the old headline.

**Why:** Maintained headlines change, and a stale reset assertion can make a working preview refresh look broken after the edited preview already passed.

**How to apply:** Capture the original field value before writing the fixture edit; wait for that captured value when the test restores the file.