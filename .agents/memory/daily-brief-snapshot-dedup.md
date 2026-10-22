---
name: Daily Brief snapshot deduplication
description: Regression-testing duplicate canonical story records in public newsroom snapshots.
---

When a public newsroom snapshot contains multiple records for one canonical article, verify that the latest eligible record's editorial fields render as well as confirming only one story card appears.

**Why:** A list can deduplicate to the newest record while a child component independently looks up the first record by slug and displays stale content.

**How to apply:** In Daily Brief and topic-page regressions, assert the displayed title/date/dek against the selected snapshot record, not just the number of rendered cards.
