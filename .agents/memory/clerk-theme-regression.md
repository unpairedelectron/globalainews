---
name: Clerk theme browser checks
description: Environment-specific guidance for reliable Clerk sign-in and sign-up visual regression checks.
---

Clerk auth route checks must run through the smoke server that proxies `/api/*`; navigating the Vite dev port directly can return the SPA shell for API requests and trigger a misleading newsroom error boundary.

**Why:** The auth components share the newsroom provider, so an incorrect browser target looks like a Clerk rendering failure even when the managed smoke route is healthy.

**How to apply:** Use the existing CDP smoke browser, move focus with Tab key events when asserting `:focus-visible`, select the Clerk primary form button rather than a social-provider button, and resolve translucent computed backgrounds to their opaque ancestor before contrast checks.

Clerk's combined sign-in form does not reliably emit local field errors for empty or short passwords; the app-level guard owns empty-credential feedback, while sign-up retains Clerk's password-policy error.

**Why:** The development Clerk instance delegated sign-in validation to the auth service, making a supposedly client-only smoke interaction both nondeterministic and unsafe.

**How to apply:** Exercise sign-in's empty state through the guard, mark the alert as an explicit live region, use opaque destructive tokens in both themes, and select the visible non-empty error node when Clerk renders duplicate error elements.