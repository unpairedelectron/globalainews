---
name: Editorial publishing queue
description: The newsroom’s current restart-safe cadence for prepared editorial releases.
---

Prepared editorial records should become public based on their scheduled publish time when the API builds a newsroom snapshot. Keep future publishable records in the process snapshot and cap the content cache at ten minutes, shortened to the next known publication time. Public snapshots and the automation audit refresh on mount/focus; the editor release queue can refresh every five foreground minutes, plus explicit refreshes and mutations.

**Why:** This reduces recurring API and database requests without letting a cached snapshot cover a scheduled release boundary. The publication decision remains at the API boundary and does not require a long-running timer.

**How to apply:** Keep future records out of the public story collection until their publish time, expire any snapshot cache no later than the next scheduled release, and preserve durable run keys and queue records. Process-local release snapshots still need the authenticated editor queue read after an API restart; do not add public database reads to compensate without revisiting this boundary.