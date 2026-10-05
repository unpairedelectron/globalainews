---
name: API smoke environment
description: API smoke tests rely on preserving NODE_ENV=test so synthetic editor authentication and test-only fixtures stay isolated.
---

The API development command must preserve an explicitly supplied `NODE_ENV`; database-backed smoke runs should use `NODE_ENV=test`, a disposable localhost PostgreSQL `DATABASE_URL`, and `EDITORIAL_AUTOMATION_ENABLED=false`. The explicit automation setting takes precedence over test mode. Start a temporary PostgreSQL cluster with its Unix socket under the same temporary directory (for example, `pg_ctl -o "-k $DBROOT"`), because `/run/postgresql` may be absent in this container. Keep database startup, tests, and shutdown in the same shell.

**Why:** Overwriting the test environment made browser smoke requests look unauthenticated and encouraged tests to depend on nondeterministic live automation providers. An inherited database URL can escape test isolation, and the default PostgreSQL socket directory may not exist in the container.

**How to apply:** Keep test-only newsroom fixtures guarded by `NODE_ENV=test`, make browser tests clean up records they create, and run database-backed smoke tests only against a disposable local database with `EDITORIAL_AUTOMATION_ENABLED=false`; do not rely on test mode alone to disable automation.