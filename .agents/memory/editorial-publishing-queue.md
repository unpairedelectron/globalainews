---
name: Editorial publishing queue
description: The newsroom’s current restart-safe cadence for prepared editorial releases.
---

Prepared editorial records should become public based on their scheduled publish time when the API builds a newsroom snapshot. The client can poll that snapshot to reflect releases without requiring a long-running timer or a server restart.

**Why:** The newsroom has a maintained editorial source rather than an external feed, so a time-based release decision is more reliable than an in-memory scheduler and keeps the public/API snapshot aligned.

**How to apply:** Keep future records out of the live story collection until their publish time. When this queue grows beyond code-managed seed content, move the records to durable editor-managed storage while preserving the same API-boundary publication rule.