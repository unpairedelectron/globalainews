# Final pre-cutover checklist

**Prepared:** 2026-10-04
**State:** READY FOR HUMAN PUBLISH — the previous deployment is offline and its process-owned scheduler is stopped. Publishing remains a human action.

## Scope and approval boundary

This is the final pre-publish handoff for Global AI News. It does not authorize or perform Publish, production automation, production editorial writes, production configuration changes, or database migrations. Do not start another foundation audit as part of this handoff.

The latest available deployment metadata reports that the Autoscale app is not deployed, has no successful published build, and has no current deployment URLs. The previous deployment is offline, so its process-owned scheduler is stopped; both public Web and API remain unavailable until a human publishes the reviewed workspace.

## Verified state

### Production metadata and read-only probes

The latest available Replit deployment metadata reports:

- `isDeployed`: `false`
- `hasSuccessfulBuild`: `false`
- Current deployment URLs: none

The following are historical read-only observations from 2026-10-03, before the current offline state:

| Request | Result |
| --- | --- |
| `GET https://www.globalainews.in/` | `200` |
| `GET https://www.globalainews.in/api/healthz` | `200`, `{"status":"ok"}` |
| Unauthenticated `GET /api/newsroom/releases` | `401` |
| Unauthenticated `GET /api/newsroom/automation/status` | `401` |
| Primary-host `GET /robots.txt` | `200`; general crawling allowed; sitemap listed |
| Alias-host `GET /robots.txt` | `200`; general crawling disallowed; social bots allowed |

No `X-GAN-*` response headers were observed on those historical production root or health responses. Current production source/Web/API fingerprint parity is **unverified**; no production routes were probed after the deployment went offline.

The historical canonical and alias `robots.txt` responses differ. The checked-in `public/robots.txt` is host-independent, and the layer supplying the alias-specific response has not been identified. Do not change the file to try to fix the alias behavior; identify the responsible hosting/domain layer first.

### Production GETs that are not safe diagnostics

Do not request the following API routes during pre-cutover checks:

- `/api/newsroom/content`
- `/api/newsroom/metadata`
- `/api/newsroom/feed.xml`
- `/api/newsroom/sitemap.xml`
- `/api/newsroom/social/articles/:slug.svg`

These routes reach `getPublishedStoriesFromDatabase()` → `getReleaseRows()` → `ensureSeeded()`. If the release table is empty, the GET can insert the maintained schedule. Do not use them as health checks or run a browser-based production smoke test that would fetch the newsroom snapshot. If content validation becomes necessary, first establish the production database state using an authorized read-only query and obtain approval for any check that could invoke seeding.

`GET /api/healthz` is safe: it returns a static health response without querying editorial data. The unauthenticated `401` checks above stop at editor authorization and do not invoke editor operations.

### Scheduler and current production risk

- The previous deployed API predates the explicit automation override. That deployment is offline, so its process-owned 30-minute timer is stopped.
- The pending API artifact sets `EDITORIAL_AUTOMATION_ENABLED=false`; retain that setting.
- The new API automation remains disabled. Do not enable or invoke it as part of publishing.
- No production automation was invoked manually for this work.

### Local build and test evidence

The configured full smoke command passed:

```sh
pnpm --filter @workspace/global-ai-news run test:smoke
```

Coverage included 58 desktop routes, 8 mobile routes, 11 AMP pages, RSS, first-response article/report checks, responsive and Clerk theme checks, publication-fixture cleanup, internal-link audit, and content/research/authority/SEO checks. The link audit covered 104 built routes and 465 internal references with 0 issues. The API dependency-depth security test passed all 6 cases. The development preview refresh test also confirms article-title edits update the social card without restarting Vite.

The latest local security scan results available for this handoff reported:

- Dependency audit: **1 high** finding, `GHSA-vfj7-8cjw-p6xm` / `CVE-2026-93687`, `braces@3.0.3`; no upstream patch is available.
- SAST: **0** findings.
- Privacy/dataflow scan: **0** findings.

The repository's depth guard and six regression tests are defense-in-depth, not a clean audit. Code inspection found no user-controlled `micromatch` pattern in the current Clerk proxy configuration; this narrows the apparent request path but does not resolve the advisory or prove the package unreachable.

The public JavaScript entry is `588,045` bytes (`171,280` gzip). The Clerk route chunk is deferred and measures `146,770` bytes (`36,890` gzip). CSS is `147,507` bytes (`23,190` gzip). The public entry still triggers Vite's 500 kB chunk warning. These are local build measurements, not production payload measurements.

### Expected local fingerprints

The final workspace build and `scripts/build-fingerprint.mjs` agree on these values. After the managed workflow restart, the local API health response returned `200`, and all three `X-GAN-*` headers matched this table:

| Fingerprint | Value |
| --- | --- |
| Source | `69283d30a906b48ba210fe2e96dff92d6b678301+source-sha256:75730aa7fb4e854b0568077ed015ae0a2bee0a7b6596bfda5c80bd1c84edf729` |
| Web artifact | `web-sha256:181241e3a1b5121398423b79dd574d09a3d500b36c7ba26abe4384e0bb9e5a98` |
| API artifact | `api-sha256:1d8ef79e443a206a1d6195bb05dbb7e6f3de479ac69426de73279be77402d63b` |

After a future approved publish, compare `X-GAN-Source-Revision`, `X-GAN-Web-Artifact-Revision`, and `X-GAN-API-Artifact-Revision` on both the public root and API health response with the values above. If a build changes before that publish, regenerate the fingerprints and update this document before comparing.

## Ordered maintenance-window procedure

The old deployment is already offline. The next production action is a human Publish of the reviewed workspace.

1. **Preflight and record the current state.**
   - Confirm the Autoscale deployment is still offline in the Publishing tool.
   - Save a current project checkpoint or identify the known-good checkpoint to restore if needed.
   - Confirm the API production configuration still sets `EDITORIAL_AUTOMATION_ENABLED=false`.
   - Review any Publish dialog for database/schema operations. Stop if it proposes a destructive or unexplained migration; this hardening work made no production schema changes.
   - Do not run any automation endpoint or newsroom GET listed above.

2. **Publish the prepared workspace.**
   - A human must initiate Publish; this action is not performed by the agent.
   - Publishing restores the public Web and API from their current offline state.
   - From the Publishing tool, publish the reviewed current workspace.
   - Do not change production settings, enable automation, or approve an unfamiliar migration during this step.
   - Wait for the new Autoscale deployment to report successful startup.

3. **Run only the safe post-publish checks.**
   - Confirm the root returns `200` using a plain HTTP request; do not run browser JavaScript against production during this check.
   - Confirm `GET /api/healthz` returns `200` and `{"status":"ok"}`.
   - Confirm unauthenticated `GET /api/newsroom/releases` and `/api/newsroom/automation/status` return `401`.
   - Compare the three `X-GAN-*` response headers with the local fingerprints above on both the root and API health response.
   - Fetch `/robots.txt` on both hosts and record each result. The expected current behavior is that the canonical host allows crawling and lists the sitemap, while the alias disallows general crawlers. Do not edit the host-independent file to change this.
   - Do not fetch production newsroom content, metadata, RSS, sitemap, social-preview, article, or AMP routes for this check: request-time rendering or the API snapshot may reach the seeding path described above.
   - Do not invoke editorial automation. The pending API configuration must remain disabled.

4. **Hold if any gate fails.**
   - A missing/mismatched fingerprint, failed health check, unexpected robots response, unexpected database migration, or evidence that automation is enabled is a stop condition.
   - Keep the issue local and do not attempt a second production action without approval.

## Recovery

Replit's current documentation does not provide an in-place rollback of a published build. To restore an earlier version, restore the known-good project checkpoint in the editor and publish that state again. Unpublishing itself does not delete project files or the database, but the site remains offline until a new publish succeeds.

If the new publish fails after Unpublish, the expected consequence is continued Web and API downtime. Diagnose and fix the workspace, rerun local typecheck and the full smoke command, confirm the fingerprints, and publish only after the outage and action are approved. Do not try to recover by running production automation or by querying the newsroom routes that can seed data.

## Current decision

**READY FOR HUMAN PUBLISH — the previous deployment is offline, so the old scheduler is stopped.** Local build, smoke, and fingerprint generation are complete. The agent did not publish or perform production writes or automation. Production fingerprint parity and the source of the historical alias `robots.txt` response remain unverified until safe checks after Publish.