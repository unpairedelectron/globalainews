---
name: API smoke environment
description: API smoke tests rely on preserving NODE_ENV=test so synthetic editor authentication and test-only fixtures stay isolated.
---

The API development command must preserve an explicitly supplied `NODE_ENV`; smoke tests start it in test mode so the synthetic editor header and deterministic fixtures are unavailable to normal development and production traffic.

**Why:** Overwriting the test environment made browser smoke requests look unauthenticated and encouraged tests to depend on nondeterministic live automation providers.

**How to apply:** Keep test-only newsroom fixtures guarded by `NODE_ENV=test`, and make browser tests clean up any records they create before other public-route checks run.