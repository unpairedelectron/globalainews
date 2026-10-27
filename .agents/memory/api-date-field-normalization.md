---
name: API date-field normalization
description: Handling date-only editorial metadata across the generated newsroom API boundary.
---

Treat editorial review and publication dates as calendar days. A value declared as an OpenAPI `format: date` may arrive from the API as an ISO timestamp at midnight UTC; consumers and API tests should normalize the `YYYY-MM-DD` portion before comparing review intervals, linked-event dates, or saved history entries.

**Why:** Comparing a timestamp directly with a date-only value produced false “invalid date” warnings in profile review badges, even though the displayed date was correct.

**How to apply:** For editorial freshness logic and saved-history assertions, validate the calendar-day portion and accept a timestamp only when it parses successfully. Keep comparisons in UTC calendar days, and test both date-only and API-serialized timestamp forms.
