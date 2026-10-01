---
name: Newsroom delivery boundary
description: The publication’s runtime content and newsletter delivery boundary.
---

The public newsroom should consume one maintained API snapshot rather than mixing API data with client-side editorial fixtures. Automation-discovered source items are editorial working inventory; expose only source records cited by published stories. Newsletter signups should be persisted before provider delivery is attempted, with an explicit queued state when no provider is configured.

**Why:** This keeps homepage, signal, entity, timeline, and article pages consistent; sending the whole discovery inventory would expose leads for drafts or future stories. A provider outage or missing provider configuration must not lose a valid subscriber.

**How to apply:** Keep the public content response contract explicit, project only cited sources, and configure a real provider through server environment variables without exposing credentials to the browser.