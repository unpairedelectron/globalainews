---
name: IndiaAI compute observation contract
description: Keep the public API schema aligned with IndiaAI compute stage and qualifier additions.
---

IndiaAI GPU observations are included in the public newsroom content response, whose generated schema validates each status and quantity qualifier. Additions to those taxonomies need matching OpenAPI support and regenerated clients; otherwise the newsroom content endpoint rejects the snapshot at runtime.

**Why:** Adding a newly evidenced installation stage and the source wording “nearly” without matching API enum values caused the public content response to fail validation.

**How to apply:** When adding a GPU stage or qualifier, update the canonical API contract, regenerate its clients, and verify the public content endpoint and release-metadata build.