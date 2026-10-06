---
name: Release severity gates
description: Global AI News publication gates and the required final verification sequence.
---

Only demonstrated P0 defects block publication: production-exposed security vulnerabilities, public/private API boundary failures, internal-data leakage, core public article or homepage failures, broken article rendering/canonical indexing/sitemap/RSS/systematic AMP, Web/API connectivity failures, corrupt or mutually mismatched current artifacts, or materially harmful robots behavior.

Treat non-critical performance issues (including Reports/About LCP around 3–4 seconds), Vite chunk warnings, optional metadata/internal-link/research improvements, and development-only advisories as P1/P2. Do not hold publication for those; record them separately. Do not treat the currently deployed old fingerprint as a mismatch blocker before publishing a newly verified workspace build. Resolve weak standalone story copy with real evidence or unpublish/noindex it; never pad to a word target.

**Why:** The user directed the project to stop repeating full-release freezes for non-critical findings and to block only demonstrated production risks.

**How to apply:** Run the final workspace P0 checks, build and compare current Web/API fingerprints, verify deployment configuration, and publish when P0 is zero. Immediately verify production with GET requests. Fix reproducible P0s; record P1/P2 findings and continue.
