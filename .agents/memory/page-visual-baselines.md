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

Route-level browser smoke checks should reuse one CDP browser session across sequential URL navigations instead of launching Chromium for every route, but readiness must be tied to the requested canonical URL and loaded page content—not pathname and a previous heading alone. A navigation can update the address before the new document commits, and a lazy route may briefly show a loading fallback. Separate visual checks may still need an isolated browser profile. Local test servers should keep pooled HTTP connections alive through long image-comparison gaps and retry one reset on idempotent GETs.

**Why:** Cold Chromium startup under concurrent Vite and image-processing work can exceed short timeouts before any page assertion runs; early navigation readiness can capture stale or fallback DOM; a short server keep-alive can close an otherwise valid pooled connection during ImageMagick assertions.

**How to apply:** Start one browser for sequential route checks; give every separately launched profile up to 60 seconds to expose CDP, bound each endpoint probe, monitor process exit, and retain startup stderr. Keep long keep-alive settings scoped to test servers. For route assertions, wait for the requested canonical URL and a non-loading main heading before serializing; exempt routes whose canonical intentionally points elsewhere, such as AMP. For page screenshots, wait for required DOM controls and fonts rather than `document.readyState === 'complete'`, which can be delayed by unrelated external resources.

Smoke setup should probe the Vite root route for server readiness, not request a generated social-preview PNG; keep preview generation checks in their dedicated assertions.

**Why:** The preview plugin performs synchronous ImageMagick work, so using a generated image as a readiness probe can time out cold starts and cascade one setup failure across the whole suite.

**How to apply:** Use a bounded HTTP check against the app shell to confirm Vite is listening, then test dynamic preview generation separately with its own timeout and diagnostics.

Keep the main Vite watcher stopped through a production release build and CPU-heavy smoke or release-fixture browser checks; restart it once those finish, before preview verification.

**Why:** Concurrent hot reloads can race generated assets and compete with Chromium, causing transient image errors or CDP timeouts even when the completed production build and assets are valid.

**How to apply:** Keep the watcher stopped for the build, full smoke suite, and isolated editorial fixture; restart it after those checks, then confirm the Vite root and changed route respond.

For mobile LCP failures, record the exact LCP element URL and its Resource Timing start and response-end alongside the LCP timestamp. If transfer ends materially earlier, investigate decode, rendering, and hydration rather than attributing the gap to image bytes or relaxing the guard.

**Why:** The newsroom fixture repeatedly showed the hero transfer finishing well before its final LCP paint, and changing image formats did not resolve the gap.

**How to apply:** Keep the existing no-regression threshold intact and use paired paint/resource timings to direct the next trace.

For text LCP candidates, include the element selector and relevant font, script, and stylesheet timings. An early font response does not rule out a late client-rendered candidate.

**Why:** A text heading can become the late LCP candidate after the client replaces useful server HTML, even when the font itself arrived early.

**How to apply:** Compare first-response markup and client rendering before changing font delivery or shrinking the headline; preserve the fixed Lighthouse thresholds.

Production Lighthouse previews that are served locally need a same-origin `/api` proxy to the workspace API, and that proxy must stream raw HTTP responses without transparently decompressing them. Browser route checks should wait for each route's real heading, with normalization logic defined inside the browser callback.

**Why:** Direct Vite access misses Replit's path routing, a remote API hop can distort paint timing, and Node `fetch` decompresses responses before the browser's bandwidth simulation. Route-specific readiness also avoids treating a loading fallback as a finished page.

**How to apply:** Build the production output, proxy `/api` to the local API service, preserve content encoding and length headers, and assert the expected route heading before keyboard checks.