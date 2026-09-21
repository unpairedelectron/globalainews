---
name: Newsroom analytics boundary
description: Safe measurement rules for the Global AI News website.
---

Use the platform-injected website analytics for pageviews and add only low-risk custom events for meaningful outcomes such as newsletter subscriptions, search submissions, bookmarks, and browser performance metrics. Do not add a second analytics script, website identifier, or visitor-level data collection.

**Why:** The platform already owns pageview collection and may only inject the tracker after publishing. A duplicate tracker creates conflicting counts, while visitor data is unnecessary for the newsroom’s growth decisions.

**How to apply:** Keep analytics calls behind a no-op-safe wrapper, restrict event properties to non-PII strings/numbers/booleans, and treat missing development analytics as normal.