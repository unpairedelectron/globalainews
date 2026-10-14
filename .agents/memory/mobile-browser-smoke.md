---
name: Mobile browser smoke scrolling
description: Headless Chromium mobile emulation can ignore script and wheel scrolling during viewport assertions.
---

For mobile browser smoke checks, wait for route-specific content to stabilize after navigation, then use the Chromium DOM `scrollIntoViewIfNeeded` command on the exact node before measuring its viewport rectangle.

**Why:** In this environment, client-rendered article routes can briefly show a loading state after navigation, and `window.scrollTo`, `scrollIntoView`, and CDP wheel events can leave `scrollY` at zero even when the document is much taller than the viewport.

**How to apply:** Wait for the expected heading, body snippet, and visible typography to remain stable before measuring. Locate the target element with `DOM.getDocument` and `DOM.querySelector`, call `DOM.scrollIntoViewIfNeeded`, then measure `getBoundingClientRect()` in the page.