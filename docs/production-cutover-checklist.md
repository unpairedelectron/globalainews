# Final pre-cutover checklist

**Prepared:** 2026-10-03  
**State:** HOLD — this checklist is documentation only. No production cutover has been performed.

## Scope and approval boundary

This is the final pre-cutover handoff for Global AI News. It does not authorize or perform Publish, Unpublish, production automation, production editorial writes, production configuration changes, or database migrations. Do not start another foundation audit as part of this handoff.

The current production service is a public Autoscale deployment. Replit's current documentation says Unpublish takes the app offline and stops the deployment; the project files and database remain, and the app must be published again from the Publishing tool. Unpublish therefore stops the old process-owned scheduler only by taking the whole public Web and API offline. A human must approve that outage before the sequence below is started.

## Verified state

### Production metadata and read-only probes

Replit deployment metadata reports a public, deployed Autoscale app with a successful published build:

- Primary URL: `https://www.globalainews.in`
- Additional URL: `https://global-ai-media.replit.app`

Read-only checks on 2026-10-03 returned:

| Request | Result |
| --- | --- |
| `GET https://www.globalainews.in/` | `200` |
| `GET https://www.globalainews.in/api/healthz` | `200`, `{"status":"ok"}` |
| Unauthenticated `GET /api/newsroom/releases` | `401` |
| Unauthenticated `GET /api/newsroom/automation/status` | `401` |
| Primary-host `GET /robots.txt` | `200`; general crawling allowed; sitemap listed |
| Alias-host `GET /robots.txt` | `200`; general crawling disallowed; social bots allowed |

No `X-GAN-*` response headers were observed on the tested production root or health responses. Production source/Web/API fingerprint parity is therefore **unverified**, despite the deployment metadata's successful-build status.

The canonical and alias `robots.txt` responses differ. The checked-in `public/robots.txt` is host-independent, and the layer supplying the alias-specific response has not been identified. Do not change the file to try to fix the alias behavior; identify the responsible hosting/domain layer first.

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

- The current deployed API predates the explicit automation override and may still run its process-owned 30-minute timer.
- The pending API artifact sets `EDITORIAL_AUTOMATION_ENABLED=false`; retain that setting.
- The old process cannot be stopped independently through the confirmed Replit control. Unpublishing stops the full deployment and causes public Web and API downtime.
- No production automation was invoked manually for this work.

### Local build and test evidence

The configured full smoke command passed:

```sh
pnpm --filter @workspace/global-ai-news run test:smoke
```

Coverage included 49 desktop routes, 8 mobile routes, 11 AMP pages, RSS, first-response article/report checks, responsive and Clerk theme checks, publication-fixture cleanup, internal-link audit, and content/research/authority/SEO checks. The API dependency-depth security test passed all 6 cases.

Fresh local security scans reported:

- Dependency audit: **1 high** finding, `GHSA-vfj7-8cjw-p6xm` / `CVE-2026-93687`, `braces@3.0.3`; no upstream patch is available.
- SAST: **0** findings.
- Privacy/dataflow scan: **0** findings.

The repository's depth guard and six regression tests are defense-in-depth, not a clean audit. Code inspection found no user-controlled `micromatch` pattern in the current Clerk proxy configuration; this narrows the apparent request path but does not resolve the advisory or prove the package unreachable.

The public JavaScript entry is `575,108` bytes (`170,551` gzip), down from `678,492` bytes (`196,028` gzip). The Clerk route chunk is deferred and measures `105,294` bytes (`26,575` gzip). The public entry still triggers Vite's 500 kB chunk warning. These are local build measurements, not production payload measurements.

### Expected local fingerprints

The final workspace build and `scripts/build-fingerprint.mjs` agree on these values:

| Fingerprint | Value |
| --- | --- |
| Source | `290eb8530edec72be6cd6aee71b7fbe046169fcb+source-sha256:41a4ffc49dcbe608c1239f5fa6920181e054cad266e12d85d1e75eb067ca45ac` |
| Web artifact | `web-sha256:fe42d22f6320cbdbb0f8eae803c4df6773099e555cc659c37fbc2d650738c469` |
| API artifact | `api-sha256:705ef28902243e4fc83ab30ce6465b290e41947fe539b7e26f1f55109383b36b` |

After a future approved publish, compare `X-GAN-Source-Revision`, `X-GAN-Web-Artifact-Revision`, and `X-GAN-API-Artifact-Revision` on both the public root and API health response with the values above. If a build changes before that publish, regenerate the fingerprints and update this document before comparing.

## Ordered maintenance-window procedure

Do not begin until a human has approved the maintenance window and understands the full-site outage.

1. **Preflight and record the starting state.**
   - Confirm the exact deployment and both public URLs in the Publishing tool.
   - Save a current project checkpoint or identify the known-good checkpoint to restore if needed.
   - Confirm the pending API production configuration still sets `EDITORIAL_AUTOMATION_ENABLED=false`.
   - Review any Publish dialog for database/schema operations. Stop if it proposes a destructive or unexplained migration; this hardening work made no production schema changes.
   - Do not run any automation endpoint or newsroom GET listed above.

2. **Stop the old timer, only with outage approval.**
   - In the Publishing tool, select **Unpublish** and confirm only after the outage is approved.
   - This takes both the public Web and API offline; it is not an API-only scheduler stop.
   - Confirm both URLs are offline. Do not leave the old deployment running while assuming the timer has stopped.

3. **Publish the prepared workspace.**
   - From the Publishing tool, publish the reviewed current workspace.
   - Do not change production settings, enable automation, or approve an unfamiliar migration during this step.
   - Wait for the new Autoscale deployment to report successful startup.

4. **Run only the safe post-publish checks.**
   - Confirm the root returns `200` using a plain HTTP request; do not run browser JavaScript against production during this check.
   - Confirm `GET /api/healthz` returns `200` and `{"status":"ok"}`.
   - Confirm unauthenticated `GET /api/newsroom/releases` and `/api/newsroom/automation/status` return `401`.
   - Compare the three `X-GAN-*` response headers with the local fingerprints above on both the root and API health response.
   - Fetch `/robots.txt` on both hosts and record each result. The expected current behavior is that the canonical host allows crawling and lists the sitemap, while the alias disallows general crawlers. Do not edit the host-independent file to change this.
   - Do not fetch production newsroom content, metadata, RSS, sitemap, social-preview, article, or AMP routes for this check: request-time rendering or the API snapshot may reach the seeding path described above.
   - Do not invoke editorial automation. The pending API configuration must remain disabled.

5. **Hold if any gate fails.**
   - A missing/mismatched fingerprint, failed health check, unexpected robots response, unexpected database migration, or evidence that automation is enabled is a stop condition.
   - Keep the issue local and do not attempt a second production action without approval.

## Recovery

Replit's current documentation does not provide an in-place rollback of a published build. To restore an earlier version, restore the known-good project checkpoint in the editor and publish that state again. Unpublishing itself does not delete project files or the database, but the site remains offline until a new publish succeeds.

If the new publish fails after Unpublish, the expected consequence is continued Web and API downtime. Diagnose and fix the workspace, rerun local typecheck and the full smoke command, confirm the fingerprints, and publish only after the outage and action are approved. Do not try to recover by running production automation or by querying the newsroom routes that can seed data.

## Current decision

**HOLD — no cutover, Publish, Unpublish, production automation, production editorial write, production configuration change, or migration was performed for this checklist.** Production fingerprint parity, the source of the alias `robots.txt` response, and the old scheduler's live runtime state remain unverified.