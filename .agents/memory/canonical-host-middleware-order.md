---
name: Canonical host middleware order
description: Preserve canonical host redirects when adding static or direct-response routes.
---

Register canonical host and protocol enforcement before route handlers that can finish a response, including static assets and plain-text crawler files.

**Why:** An earlier handler can end the Express response before the canonical redirect runs, leaving some paths accessible on the wrong host even when article and page routes redirect correctly.

**How to apply:** Keep canonicalization ahead of static and content routes, and test both GET and HEAD against the apex and canonical hosts, including direct-response files.
