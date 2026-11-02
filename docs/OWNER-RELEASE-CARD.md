# Owner release card

**Status: prepared, not applied.** The Clerk-protected admin page and state-only manifest are ready for an owner-approved release. This work did not apply any state or publish an article.

1. Confirm the article, sources, disclosure, and scheduled UTC time against `docs/RELEASE-RUNBOOK.md`.
2. Sign in with the verified Clerk editor account and open `/admin/release`.
3. Upload `release/manifest.json`; confirm it contains only the ten article slugs, status, and `publishAt` values. It contains no article or Brief copy.
4. Run the dry run and review every change. Apply only after owner approval; then confirm release history and rollback are available.
5. After an article goes live, run `verify:live` and submit/inspect the sitemap. **OWNER: flip to index when ready.** Keep Reports and India Watch `noindex,follow` until substantive and approved.
