---
name: Static-first route performance
description: Why Reports and About remain complete server responses without loading the React application runtime.
---

In production, `/reports` and `/about-us` intentionally remain as their complete prerendered HTML instead of mounting the React `App`. The client shell differs from the prerendered document, so replacing the root can remove useful first-response content and create a later LCP candidate. Keep the route policy shared between client startup and the HTML renderer. These responses should not load the app module graph or fetch the newsroom snapshot in the browser. Their small inline bootstraps must preserve stored/system theme preference and send Web Vitals through the existing `window.umami` sink, not a second analytics tracker.

**Why:** The server-rendered pages are already complete and navigable; hydrating them with a different shell risks both content replacement and worse mobile LCP.

**How to apply:** When changing startup or SEO rendering, keep these routes static unless their server/client markup is made hydration-compatible. Preserve SEO tags, theme behavior, Web Vitals, and the first-response content; verify with the publication performance fixture and SEO smoke checks.
