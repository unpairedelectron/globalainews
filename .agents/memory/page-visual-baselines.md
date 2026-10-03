---
name: Page visual baselines
description: Durable guidance for comparing browser-rendered page screenshots in smoke tests.
---

Browser screenshot baselines should wait for `document.fonts` to finish loading and use a small ImageMagick fuzz before applying a changed-pixel ceiling.

**Why:** Exact or near-exact pixel comparisons can flag normal font antialiasing differences as broad page regressions, especially on large serif headlines. Waiting for fonts removes capture timing noise; a bounded fuzz preserves detection of layout, icon, and surface changes.

**How to apply:** Keep the viewport and route/theme matrix deterministic, document the fuzz and pixel ceiling beside the baselines, and retain the failing capture with route and theme in its error output.

When a visual change is intentional, regenerate baselines only after the final DOM structure is stable and verify key repeated controls by count before accepting the new images.

**Why:** A temporary hot-reload regression can otherwise be captured as the new expected appearance and hide a real layout defect.

**How to apply:** After shared layout edits, run a final rendered-DOM sanity check, fix structural regressions, then update baselines and run the visual test again.

Route-level browser smoke checks should reuse one CDP browser session across sequential URL navigations instead of launching Chromium for every route. Separate visual checks may still need an isolated browser profile. Local test servers should keep pooled HTTP connections alive through long image-comparison gaps and retry one reset on idempotent GETs.

**Why:** Cold Chromium startup under concurrent Vite and image-processing work can exceed short timeouts before any page assertion runs, while a short server keep-alive can close an otherwise valid pooled connection during ImageMagick assertions.

**How to apply:** Start one browser for sequential route checks; give every separately launched profile up to 60 seconds to expose CDP, bound each endpoint probe, monitor process exit, and retain startup stderr. Keep long keep-alive settings scoped to test servers. For page screenshots, wait for required DOM controls and fonts rather than `document.readyState === 'complete'`, which can be delayed by unrelated external resources.

Smoke setup should probe the Vite root route for server readiness, not request a generated social-preview PNG; keep preview generation checks in their dedicated assertions.

**Why:** The preview plugin performs synchronous ImageMagick work, so using a generated image as a readiness probe can time out cold starts and cascade one setup failure across the whole suite.

**How to apply:** Use a bounded HTTP check against the app shell to confirm Vite is listening, then test dynamic preview generation separately with its own timeout and diagnostics.

Do not rely on an active Vite watcher during a production release build that rewrites the story snapshot and generated preview assets; finish the build, then restart the web workflow before preview verification.

**Why:** A concurrent hot reload can run ImageMagick while a generated PNG is being replaced, causing a transient invalid-header error and leaving the preview server unavailable even though the finished asset is valid.

**How to apply:** Run the production build to completion before restarting or capturing the dev preview, then confirm the Vite root and changed route respond.