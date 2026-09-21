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