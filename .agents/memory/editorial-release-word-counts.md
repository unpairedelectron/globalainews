---
name: Editorial release word counts
description: How visible-copy minimums must distinguish maintained stories from editor-created release records.
---

Maintained and editor-created releases do not expose the same visible-copy fields. Maintained stories should use the complete story snapshot for quality checks, while editor-created records should use the standfirst and working copy that the editor controls.

**Why:** Database seed rows can lag behind the maintained source, and editor-created records may inherit story defaults. A single field count can either hide short editor copy or incorrectly remove valid maintained routes.

**How to apply:** Keep release provenance explicit at the API boundary, use the matching count for write-time validation and publication filtering, and expose the effective count to newsroom clients.