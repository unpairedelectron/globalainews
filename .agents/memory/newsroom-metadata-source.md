---
name: Newsroom metadata source
description: The source boundary for initial HTML and hydrated publication metadata.
---

Initial route metadata should be generated from the API-backed newsroom metadata manifest, while hydrated pages resolve the same records after the content snapshot loads. Production publication builds require that manifest, validate its route coverage, and reject snapshots older than 15 minutes instead of falling back to local metadata.

**Why:** Editorial edits can land in the maintained newsroom source without a frontend rebuild; a build-safe manifest gives static route generation an explicit contract and makes drift testable.

**How to apply:** Keep the manifest derived from the same content source as `/newsroom/content`, connect release builds to the current API endpoint, fail builds when the endpoint is unavailable, malformed, incomplete, or stale, and compare initial and hydrated metadata against it in route smoke checks.