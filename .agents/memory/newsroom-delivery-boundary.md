---
name: Newsroom delivery boundary
description: The publication’s runtime content and newsletter delivery boundary.
---

The public newsroom should consume one maintained API snapshot rather than mixing API data with client-side editorial fixtures. That snapshot combines maintained stories with eligible database release rows and de-duplicates by slug, so a public story count is not a database row count. Production and development databases are isolated; verify the deployment's production database before interpreting a mismatch. Automation-discovered source items are editorial working inventory; expose only source records cited by published stories. Newsletter signups should be persisted before provider delivery is attempted, with an explicit queued state when no provider is configured.

**Why:** This keeps homepage, signal, entity, timeline, and article pages consistent; sending the whole discovery inventory would expose leads for drafts or future stories. Comparing counts without accounting for the maintained source and environment-specific database can lead to false data-source conclusions. A provider outage or missing provider configuration must not lose a valid subscriber.

**How to apply:** Keep the public content response contract explicit, project only cited sources, inspect production and development separately, and configure a real provider through server environment variables without exposing credentials to the browser.