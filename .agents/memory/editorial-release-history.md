---
name: Editorial release history
description: The audit trail’s durable identity and event model for newsroom release changes.
---

Release history records an explicit actor identity, action, summary, and timestamp in its own durable table. Authenticated Clerk identity from the server request is the actor source for release mutations.

**Why:** The audit trail must be trustworthy during editorial handoffs, so the browser cannot choose or spoof the actor recorded for a mutation.

**How to apply:** Preserve the durable history rows when changing release records, and derive new actors from the authenticated request context at the API boundary.