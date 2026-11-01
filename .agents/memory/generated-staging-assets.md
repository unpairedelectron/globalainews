---
name: Generated staging assets
description: Avoid build-fingerprint races and missing Vite preview assets for generated staging content.
---

Generated preview output is runtime/build content, not tracked source. Keep it excluded from workspace source fingerprints and replace generated files atomically instead of deleting the live tree first. When a dev server starts before generated binary assets exist, serve the allowed staging asset paths explicitly rather than assuming its public-file index will discover them later.

**Why:** parallel production builds exposed missing-file races during regeneration, while Vite returned the app shell for generated binary paths it had not indexed.

**How to apply:** ignore generated preview output, preserve the prior files while regenerating, validate response content types, and use a narrow route allowlist for explicit staging asset delivery.
