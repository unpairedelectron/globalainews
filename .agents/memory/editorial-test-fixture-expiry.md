---
name: Editorial test fixture expiry
description: Prevent scheduled records from interrupted editorial tests from aging into public stories.
---

Treat persisted editorial smoke-test rows as potentially publication-eligible after their scheduled date passes. Test cleanup should remove stale rows only when their slug belongs to a reserved fixture namespace and the row is old enough that no active test should still own it.

**Why:** A first-response fixture scheduled in the future can become public when a later smoke test evaluates the same persisted database after that date.

**How to apply:** Before editorial integration tests, prune only expired, timestamped fixture rows and their audit history; never broaden cleanup to ordinary newsroom records.
