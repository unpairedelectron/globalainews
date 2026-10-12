---
name: SEO audit reversibility
description: Production SEO remediation must preserve data and deployment configuration until explicitly approved.
---

During production SEO audits, use reversible 301 redirects, 410 responses, noindex directives, and status flags. Never delete or edit production database rows, unpublish the site, or change deployment type or compute size. Do not claim workspace changes are live before the owner publishes them.

**Why:** The user set these boundaries to make SEO remediation auditable and reversible without risking production content or availability.

**How to apply:** Separate read-only production evidence from local workspace edits, verify behavior locally, document manual Search Console follow-up, and present Publish without deploying directly.
