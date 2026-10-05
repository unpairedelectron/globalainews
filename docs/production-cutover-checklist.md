# Final pre-cutover checklist

**Prepared:** 2026-10-05
**State:** ACTIVE DEPLOYMENT — metadata reports a successful Autoscale deployment, but its Web/API revisions have not been matched to this workspace. No deployment or production mutation was performed for this remediation.

## Scope and approval boundary

This is the final pre-publish handoff for Global AI News. It does not authorize or perform Publish, production automation, production editorial writes, production configuration changes, or database migrations. Do not start another foundation audit as part of this handoff.

Deployment metadata observed at `2026-10-05T09:49:00Z` reports the Autoscale app as active with a successful build at `https://www.globalainews.in`. The deployed Web and API revisions have not been matched to the current workspace, so production parity is unverified. Do not publish, invoke editorial automation, or write production data as part of this local remediation.

## Verified state

### Production metadata and read-only probes

The Replit deployment metadata snapshot from `2026-10-05T09:49:00Z` reports:

- `isDeployed`: `true`
- `hasSuccessfulBuild`: `true`
- Primary deployment URL: `https://www.globalainews.in`
- Deployed Web/API revisions: not matched to this workspace

The following are historical read-only observations from 2026-10-03; they do not establish the current active deployment's behavior:

| Request | Result |
| --- | --- |
| `GET https://www.globalainews.in/` | `200` |
| `GET https://www.globalainews.in/api/healthz` | `200`, `{"status":"ok"}` |
| Unauthenticated `GET /api/newsroom/releases` | `401` |
| Unauthenticated `GET /api/newsroom/automation/status` | `401` |
| Primary-host `GET /robots.txt` | `200`; general crawling allowed; sitemap listed |
| Alias-host `GET /robots.txt` | `200`; general crawling disallowed; social bots allowed |

No `X-GAN-*` response headers were observed on those historical production root or health responses. Current production source/Web/API fingerprint parity is **unverified**; no post-2026-10-03 production route probes were made for this remediation.

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

- The active deployed API revision and its automation setting have not been matched to the workspace; production scheduler state is therefore unknown.
- The current workspace API artifact sets `EDITORIAL_AUTOMATION_ENABLED=false`; retain that setting.
- Do not enable or invoke production automation. No production automation was run for this remediation.
- No production automation was invoked manually for this work.

### Local build and test evidence

The configured full smoke command passed:

```sh
pnpm --filter @workspace/global-ai-news run test:smoke
```

Coverage included 56 desktop routes, 8 mobile routes, 11 AMP pages, RSS, first-response article/report checks, responsive and Clerk theme checks, publication-fixture cleanup, internal-link audit, and content/research/authority/SEO checks. The link audit covered 105 built routes and 460 internal references with 0 issues. The API dependency-depth and Clerk proxy tests passed all 10 cases. The development preview refresh test also confirms article-title edits update the social card without restarting Vite.

The latest local security scan results available for this handoff reported:

- Dependency audit: **1 high** finding, `GHSA-vfj7-8cjw-p6xm` / `CVE-2026-93687`, `braces@3.0.3`. The upstream security-fix PR (`micromatch/braces#72`) merged on 2026-10-03, but the npm package and GitHub advisory still list no patched release as of 2026-10-04.
- SAST: **0** findings.
- Privacy/dataflow scan: **0** findings.

The repository carries a local `pnpm` patch with bounded input and recursive AST depth checks, matching the core mitigation in the merged upstream change. Ten regression cases exercise the installed production and development dependency chains and Clerk proxy behavior, including over-deep brace/parenthesis patterns and ordinary expansion. Both `pnpm audit --prod` and `pnpm audit -D` still report the high advisory because the resolved package version remains `3.0.3`; the local patch is a reviewed mitigation, not a clean audit or a released upstream fix. Code inspection found no user-controlled `micromatch` pattern in the current Clerk proxy configuration; this narrows the apparent request path but does not resolve the advisory or prove the package unreachable.

The public JavaScript entry is `520,440` bytes (`160,470` gzip). The shared public-route chunk is `63,580` bytes (`14,250` gzip), and the Clerk route chunk is deferred at `146,780` bytes (`36,890` gzip). CSS is `148,390` bytes (`23,330` gzip). The public entry still triggers Vite's 500 kB chunk warning. These are local build measurements, not production payload measurements.

### Expected local fingerprints

The final workspace build and `scripts/build-fingerprint.mjs` agree on these values. After the local API workflow restart on 2026-10-05, `/api/healthz` returned `200` with `{"status":"ok"}`, and all three `X-GAN-*` headers matched this table. No production route or fingerprint requests were made; deployed Web/API revisions remain unmatched.

| Fingerprint | Value |
| --- | --- |
| Source | `e4f725be73bcded80a8ccbe9f28d14e7c1f8a7f3+source-sha256:ef63fe0bcf3bffb215109ccf2a5c57a510c4b4f23e3b9ca9a58177577d62360a` |
| Web artifact | `web-sha256:0b95374b0e3f885f53b50be05823ce2778c87eb399c47267be364625a0d44c41` |
| API artifact | `api-sha256:d7947a0f3167477b2a63b28b31bd771c7e17071b9bcf81c5b3dc17142eee0327` |

After a future approved publish, compare `X-GAN-Source-Revision`, `X-GAN-Web-Artifact-Revision`, and `X-GAN-API-Artifact-Revision` on both the public root and API health response with the values above. If a build changes before that publish, regenerate the fingerprints and update this document before comparing.

## Safe checks for any future owner-authorized publish

The deployment is currently active. This checklist does not request or perform another Publish. If an owner later authorizes a production update, use the following procedure:

1. **Preflight and record the current state.**
   - Record the active Autoscale deployment URLs and available revision metadata.
   - Save a current project checkpoint or identify the known-good checkpoint to restore if needed.
   - Confirm the API production configuration still sets `EDITORIAL_AUTOMATION_ENABLED=false`.
   - Review any Publish dialog for database/schema operations. Stop if it proposes a destructive or unexplained migration; this hardening work made no production schema changes.
   - Do not run any automation endpoint or newsroom GET listed above.

2. **Publish the prepared workspace.**
   - A human must initiate Publish; this action is not performed by the agent.
   - Publish only if the owner explicitly authorizes updating production to the reviewed workspace.
   - From the Publishing tool, publish the reviewed current workspace.
   - Do not change production settings, enable automation, or approve an unfamiliar migration during this step.
   - Wait for the new Autoscale deployment to report successful startup.

3. **Run only the safe post-publish checks.**
   - Confirm the root returns `200` using a plain HTTP request; do not run browser JavaScript against production during this check.
   - Confirm `GET /api/healthz` returns `200` and `{"status":"ok"}`.
   - Confirm unauthenticated `GET /api/newsroom/releases` and `/api/newsroom/automation/status` return `401`.
   - Compare the three `X-GAN-*` response headers with the local fingerprints recorded for that publish on both the root and API health response.
   - Fetch `/robots.txt` on both hosts and record each result. The expected current behavior is that the canonical host allows crawling and lists the sitemap, while the alias disallows general crawlers. Do not edit the host-independent file to change this.
   - Do not fetch production newsroom content, metadata, RSS, sitemap, social-preview, article, or AMP routes for this check: request-time rendering or the API snapshot may reach the seeding path described above.
   - Do not invoke editorial automation. The pending API configuration must remain disabled.

4. **Hold if any gate fails.**
   - A missing/mismatched fingerprint, failed health check, unexpected robots response, unexpected database migration, or evidence that automation is enabled is a stop condition.
   - Keep the issue local and do not attempt a second production action without approval.

## Recovery

Replit's current documentation does not provide an in-place rollback of a published build. If a future owner-authorized publish must be reversed, restore the known-good project checkpoint in the editor and publish that state again. Unpublishing itself does not delete project files or the database, but the site remains offline until a new publish succeeds.

If a future publish fails after Unpublish, the expected consequence is continued Web and API downtime. Diagnose and fix the workspace, rerun local typecheck and the full smoke command, confirm the fingerprints, and publish only after the outage and action are approved. Do not try to recover by running production automation or by querying the newsroom routes that can seed data.

## Current decision

**ACTIVE DEPLOYMENT — production revision parity is unverified.** This remediation did not publish, perform production writes, or run automation. The active deployment's runtime fingerprints, automation state, and the historical alias `robots.txt` behavior remain unverified. Use only the safe checks above after an owner-authorized publish.