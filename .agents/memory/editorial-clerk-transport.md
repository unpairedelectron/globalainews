---
name: Editorial Clerk transport
description: Authentication boundary for the Global AI News editor workspace.
---

The editor workspace uses Clerk browser sessions carried by same-origin cookies. The API protects editor endpoints server-side and grants access only to the configured, verified primary email; the browser must not add bearer-token handling or a custom auth header.

**Why:** The web and API run behind the same Replit preview/publication boundary, while the Clerk proxy is required for production custom-domain loading. Mixing in mobile-style token transport would make the browser flow less reliable.

**How to apply:** Keep the Clerk proxy mounted before Express body parsers, keep `clerkMiddleware()` before API routes, and require the configured email to match the signed-in user's verified primary address before allowing newsroom editor operations.