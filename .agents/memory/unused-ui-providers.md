---
name: Unused UI providers
description: A build hygiene rule for shared UI primitives and third-party sourcemaps.
---

Only mount a shared UI provider in the application shell when the current app has an active consumer for it. Keep the reusable primitive available for future screens without paying its bundle and build-warning cost globally.

**Why:** An unused Radix Tooltip provider pulled an upstream package sourcemap into the production bundle and emitted a misleading Vite warning even though the app had no tooltip consumers.

**How to apply:** When a build warning points at a shared UI primitive, search for active consumers first. Remove an unused shell-level provider before changing bundler resolution or suppressing diagnostics.