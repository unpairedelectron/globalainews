---
name: AMP preview routing
description: Nested static HTML under a Vite SPA public directory can be served by the production build but fall back to the React router in the live dev preview.
---

Keep a preview-safe client route for nested static documents such as AMP pages, while also shipping the standalone document in the public build output.

**Why:** The dev server's SPA fallback can mask a valid nested public HTML file and show the app's 404 route during preview, even though the file is present in the production build.

**How to apply:** When adding nested static HTML to a Vite SPA, verify both the built file and the proxied preview URL; add a lightweight preview route if the live dev server falls back to the SPA shell.