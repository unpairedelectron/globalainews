# Final pre-cutover checklist

**Prepared:** 2026-10-05
**State:** STALE ACTIVE DEPLOYMENT — metadata reports a successful Autoscale deployment; read-only runtime fingerprints confirm both public hosts serve the same older build. No deployment or production mutation was performed for this remediation.

## Scope and approval boundary

This is the final pre-publish handoff for Global AI News. It does not authorize or perform Publish, production automation, production editorial writes, production configuration changes, or database migrations. Do not start another foundation audit as part of this handoff.

Deployment metadata observed at `2026-10-05T12:49Z` reports the Autoscale app as active with a successful build at `https://www.globalainews.in`. Read-only probes at `2026-10-05T12:49:04Z` identify the deployed source, Web, and API revisions; all differ from current `main`, as detailed below. Explicit owner authorization is still required before Publish. Do not invoke editorial automation or write production data.

## Verified state

### Production metadata and read-only probes

The Replit deployment metadata snapshot from `2026-10-05T12:49Z` reports:

- `isDeployed`: `true`
- `hasSuccessfulBuild`: `true`
- Primary deployment URL: `https://www.globalainews.in`
- Alias URL: `https://global-ai-media.replit.app`
- Deployed source, Web, and API revisions: identified by read-only response headers; all differ from this workspace

The following are historical read-only observations from 2026-10-03; they do not establish the current active deployment's behavior:

| Request | Result |
| --- | --- |
| `GET https://www.globalainews.in/` | `200` |
| `GET https://www.globalainews.in/api/healthz` | `200`, `{"status":"ok"}` |
| Unauthenticated `GET /api/newsroom/releases` | `401` |
| Unauthenticated `GET /api/newsroom/automation/status` | `401` |
| Primary-host `GET /robots.txt` | `200`; general crawling allowed; sitemap listed |
| Alias-host `GET /robots.txt` | `200`; general crawling disallowed; social bots allowed |

No `X-GAN-*` response headers were observed on those historical 2026-10-03 root or health responses. Separate read-only requests on 2026-10-05 to `/` and `/api/healthz` on both hosts returned HTTP 200 with identical, stale `X-GAN-*` fingerprints (recorded below). These limited probes confirm a production/local fingerprint mismatch; they do not verify other production routes.

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

- The active deployed API revision is identified as an older source commit, but its automation setting and scheduler state have not been established; scheduler state remains unknown.
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

The API server's exact path is development-only: `http-proxy-middleware@4.2.0` → `micromatch@4.0.8` → `braces@3.0.3`. The API production dependency view has no such path. Production uses `httpxy` directly in the Clerk proxy, and the production API bundle excludes `http-proxy-middleware`, `micromatch`, and `braces`; the security test asserts these exclusions. A separate development test chain is `fast-glob` → `micromatch` → `braces`. The repository's local `pnpm` patch bounds brace input and recursive AST depth; ten API/security tests exercise both development chains, normal expansion, and production-bundle exclusion. The advisory remains scanner-visible, but this dependency path is not shipped in or reachable through the production API bundle. No broad dependency upgrade or production dependency replacement is indicated by this evidence.

The public JavaScript entry is `520,440` bytes (`160,470` gzip). The shared public-route chunk is `63,580` bytes (`14,250` gzip), and the Clerk route chunk is deferred at `146,780` bytes (`36,890` gzip). CSS is `148,390` bytes (`23,330` gzip). The public entry still triggers Vite's 500 kB chunk warning. These are local build measurements, not production payload measurements.

### Expected local fingerprints

The last verified local production build and `scripts/build-fingerprint.mjs` agreed on these values. After the local API workflow restart on 2026-10-05, `/api/healthz` returned `200` with `{"status":"ok"}`, and all three `X-GAN-*` headers matched this table. The workspace HEAD later advanced to `edaa5172a238d9e6e061c4de0502318b531e127f` through documentation-only commits; source-content and Web/API artifact hashes are unchanged, but regenerate fingerprints before any future publish.

| Fingerprint | Value |
| --- | --- |
| Source | `99710e4e3363aeb072a0dbf2cdae144c51cc3253+source-sha256:ef63fe0bcf3bffb215109ccf2a5c57a510c4b4f23e3b9ca9a58177577d62360a` |
| Web artifact | `web-sha256:0b95374b0e3f885f53b50be05823ce2778c87eb399c47267be364625a0d44c41` |
| API artifact | `api-sha256:d7947a0f3167477b2a63b28b31bd771c7e17071b9bcf81c5b3dc17142eee0327` |

### Current production revision observation

Replit deployment metadata at 2026-10-05 12:49Z reports one active, successful, public Autoscale deployment with `https://www.globalainews.in` and `https://global-ai-media.replit.app`. The metadata and available deployment-log callback did not expose a deployment ID or startup build record.

At 2026-10-05T12:49:04Z, read-only `GET /` and `GET /api/healthz` requests to both hosts returned HTTP 200 and the same three runtime fingerprints:

| Fingerprint | Deployed value |
| --- | --- |
| Source | `49575ba878da393ed503f337793d3837ffd7fa29+source-sha256:cc2b6fef44c5575e413a63eff05d40de9d445d1ba8d9460cd673d06dbca24c8d` |
| Web artifact | `web-sha256:6de535690965318fb8e13a4090ba370878d122d98b32b21d25f6f8e482c58340` |
| API artifact | `api-sha256:6d687de00eb58a4e9d2e0ca777049990d49d70ef1741a45194267a6830530219` |

A targeted deployment-log query after 12:50Z found three `Article first-response rendering failed: This operation was aborted` errors, at `12:57:11.635Z`, `13:07:33.515Z`, and `13:15:57.320Z`. The matching handler starts a five-second timer before fetching `/api/newsroom/content`; the timer covers both the fetch and JSON parsing. The server catches an abort and, before sending headers, returns a generic HTTP 503/noindex page. The log does not include the article path, response status, elapsed time, or a request ID shared with the API log, so it cannot confirm what readers saw or which part of the fetch stalled. Nearby `/api/newsroom/content` requests completed with HTTP 200 in about 17–120 ms, but they cannot be correlated to the failing renders. The article-render implementation is identical in deployed source and current `main`; the scoped source diff only changes the Vite metadata plugin's build hook, so publishing the current workspace alone will not alter this timeout. Do not request an article route to reproduce it: its API snapshot may reach the schedule-seeding path described above.

Additional safe `GET /` and `GET /api/healthz` probes around `13:12Z` returned HTTP 200 on both public hosts with the same stale source, Web, and API fingerprints listed above. A log query after `13:16:53Z` found no further abort by `13:20:10Z`. These checks do not verify article-route availability.

The deployed source commit exists in local Git history and is an ancestor nine commits behind current `main` (`edaa5172a238d9e6e061c4de0502318b531e127f`). All three deployed fingerprints differ from the last locally verified build table above. Both public hosts serve the same stale build; there is no evidence of a split host mapping. The evidence identifies an active deployment of an older commit, not a wrong branch or a local build failure. The verified build itself used `99710e4e3363aeb072a0dbf2cdae144c51cc3253`; subsequent changes to `edaa517` are documentation-only. No production editorial writes, publishing automation, or deployment occurred during this check.

The timeout is confirmed, but its upstream cause is not. The success-only article-first-response test does not simulate a delayed/aborted API snapshot or assert the 503 fallback. Publishing remains on hold at the user's request. A future diagnostic change should add request-path, elapsed-time, fetch-phase, and upstream-status context without logging editorial content, then verify the timeout fallback in an isolated local fixture.

After an approved publish, compare `X-GAN-Source-Revision`, `X-GAN-Web-Artifact-Revision`, and `X-GAN-API-Artifact-Revision` on both public hosts and both paths (`/` and `/api/healthz`) with the local values above. If a build changes before that publish, regenerate the fingerprints and update this document before comparing.

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

**STALE ACTIVE DEPLOYMENT — production/local fingerprint mismatch is confirmed.** This remediation did not publish, perform production writes, or run automation. The deployed automation state, non-health route behavior, and current alias `robots.txt` behavior remain unverified. Use only the safe checks above after an owner-authorized publish.