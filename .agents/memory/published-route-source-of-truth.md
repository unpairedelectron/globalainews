---
name: Published route source of truth
description: Static publishing files and newsroom metadata must agree on every public article route.
---

Keep every article URL advertised by the static sitemap backed by maintained editorial content or a release record that is guaranteed to exist during the production build.

**Why:** A route can exist in the development database and pass browser smoke checks while being absent from the database available during a publish build, causing the metadata gate to fail or leaving production with an incomplete article.

**How to apply:** When adding a sitemap article route, add its complete maintained story/source record or make the route database-backed for the build environment; then run the release build, not only the frontend build.