# October 2026 article batch — blockers

## Replit deployment initiation

- **Tasks:** final production deployment and verification against the live globalainews.in host.
- **What is needed:** owner clicks Publish in Replit's Publishing surface after reviewing the release-ready build.
- **What was tried:** prepare preview/staging routes, route checks, date-gated publication behavior, and release tooling in the workspace.
- **Why blocked:** Replit requires user-initiated publishing; the agent must not trigger deployment.
- **Next safe action:** owner publishes the validated build; then run `npm run verify:live <slug>` against the production host.

## Clerk-protected manifest import

- **Tasks:** strict pass A2; owner card A6 is written but remains non-executable until A2 is safe.
- **What is needed:** the release API must accept a complete article structure and source/citation records, then persist an auditable import batch with guarded rollback before an Apply UI can safely write the manifest.
- **What was tried:** inspected `EditorialReleaseInput` and `storyFromInput`; the current request accepts plain text and rebuilds generic body sections from a template story. The API returned 401 without an authenticated editor session.
- **Why blocked:** applying this manifest through the current transform could replace authored structure or source metadata. No session was available to test real Clerk access, and test headers/bypasses are prohibited.
- **Next safe action:** extend the OpenAPI/DB contract for complete Story content and reversible import batches; then test the page with the existing Clerk authorization and keep production queue writes owner-controlled.
