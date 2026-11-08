---
name: Astro preview startup
description: Replit artifact workflow path and foreground behavior for the standalone Astro site.
---

The Global AI News web artifact lives under `artifacts/global-ai-news`, while the Astro app lives at the workspace root in `site/`. The managed artifact workflow runs relative commands from the artifact directory, so it must use `../../site`. With current Astro CLI versions, agent-environment auto-backgrounding can detach `astro dev` and leave the managed workflow finished; use `--ignore-lock` so the server stays attached to the workflow.

The Replit package firewall blocked Astro 5.18.2 as a critical-CVE dependency. Astro 7 uses Zod 4, so the site's RSS integration also needed a compatible update from 4.0.12 to 4.0.19.

**Why:** The preview initially failed first from a wrong working directory, then from detached server startup and a package firewall block; fixing only one layer did not make the artifact run.

**How to apply:** When this artifact's preview fails, check workflow logs for its working directory, confirm the managed workflow remains running after launch, and do not bypass package security blocks. Keep the Astro and RSS versions compatible when refreshing dependencies.
