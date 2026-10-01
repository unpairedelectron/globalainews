---
name: Vite build-time JSX
description: Keep build-time server rendering compatible with the JSX transform used by Vite's Node configuration.
---

TSX rendered from Vite's Node configuration must account for that configuration's JSX transform separately from the browser application's transform; an explicit React binding may be required even when normal app TSX uses the automatic JSX runtime.

**Why:** The browser build and TypeScript check passed, but release-time `renderToStaticMarkup` failed with `React is not defined`.

**How to apply:** When adding build-time SSR, verify a full release build in addition to typechecking and the browser development server.