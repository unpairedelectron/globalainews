---
name: API smoke environment
description: API smoke tests rely on preserving NODE_ENV=test so synthetic editor authentication and test-only fixtures stay isolated.
---

The API development command must preserve an explicitly supplied `NODE_ENV`; smoke tests start it in test mode so the synthetic editor header and deterministic fixtures are unavailable to normal development and production traffic. For database-backed smoke runs, point `DATABASE_URL` at a disposable local database and set `EDITORIAL_AUTOMATION_ENABLED=false`. In this container, temporary PostgreSQL clusters may need an existing socket directory such as `/tmp` because `/run/postgresql` may be absent; keep database startup, tests, and shutdown in the same shell.

**Why:** Overwriting the test environment made browser smoke requests look unauthenticated and encouraged tests to depend on nondeterministic live automation providers. An inherited database URL can escape test isolation, and the default PostgreSQL socket directory may not exist in the container.

**How to apply:** Keep test-only newsroom fixtures guarded by `NODE_ENV=test`, make browser tests clean up records they create, and run database-backed smoke tests only against a disposable local database with automation disabled.