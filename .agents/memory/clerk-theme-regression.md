---
name: Clerk theme browser checks
description: Environment-specific guidance for reliable Clerk sign-in and sign-up visual regression checks.
---

Clerk auth route checks must run through the smoke server that proxies `/api/*`; navigating the Vite dev port directly can return the SPA shell for API requests and trigger a misleading newsroom error boundary.

**Why:** The auth components share the newsroom provider, so an incorrect browser target looks like a Clerk rendering failure even when the managed smoke route is healthy.

**How to apply:** Use the existing CDP smoke browser, move focus with Tab key events when asserting `:focus-visible`, select the Clerk primary form button rather than a social-provider button, and resolve translucent computed backgrounds to their opaque ancestor before contrast checks.