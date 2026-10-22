---
name: Newsroom analytics boundary
description: Safe measurement rules for the Global AI News website.
---

Use platform-injected website analytics as the source for pageview and conversion totals. Microsoft Clarity may be used for secondary behavior insights, but do not send it custom pageview or conversion events. Mask user-submitted inputs and results, exclude editor/account routes and URLs or referrers with queries/fragments, and keep free-text search out of URLs.

**Why:** Clarity can observe URLs and page interactions, so user text and private editor routes must stay outside its capture scope. Static-first pages do not run the React app entrypoint, while the platform-injected analytics remains the established source for totals.

**How to apply:** Keep the Clarity privacy gate in the shared document head so static pages are covered, and keep any app-side fallback consistent. Keep existing analytics calls behind a no-op-safe wrapper, restrict event properties to non-PII values, and treat missing development analytics as normal.