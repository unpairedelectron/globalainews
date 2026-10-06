---
name: Article-render diagnostic whitelist
description: Safe structured logging fields for first-response article rendering and public newsroom snapshot fetches.
---

For article rendering and public snapshot diagnostics, log only validated correlation/request IDs, normalized routes, phase timings, HTTP or final render status, timeout/failure codes, and cache state or age. Do not log request or response bodies, payload-derived byte sizes or record counts, article or other editorial fields, credentials, or sensitive data. Forward the correlation ID from the web renderer to the public content API.

**Why:** Snapshot bodies contain newsroom material; payload sizes, counts, and article fields are not needed to diagnose rendering and can expose editorial details.

**How to apply:** Whitelist fields when adding or changing renderer/API diagnostics. Tests should verify correlation forwarding and assert forbidden body, size, count, and editorial fields are absent.
