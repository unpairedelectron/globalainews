---
name: Newsroom delivery boundary
description: The publication’s runtime content and newsletter delivery boundary.
---

The public newsroom should consume one maintained API snapshot rather than mixing API data with client-side editorial fixtures. Newsletter signups should be persisted before provider delivery is attempted, with an explicit queued state when no provider is configured.

**Why:** This keeps homepage, signal, entity, timeline, and article pages consistent, while a provider outage or missing provider configuration does not lose a valid subscriber.

**How to apply:** Keep the content response contract stable when editorial fields change, and configure a real provider through server environment variables without exposing credentials to the browser.