# October 2026 article batch — blockers

## Replit deployment initiation

- **Tasks:** final production deployment and verification against the live globalainews.in host.
- **What is needed:** owner clicks Publish in Replit's Publishing surface after reviewing the release-ready build.
- **What was tried:** prepare preview/staging routes, route checks, date-gated publication behavior, and release tooling in the workspace.
- **Why blocked:** Replit requires user-initiated publishing; the agent must not trigger deployment.
- **Next safe action:** owner publishes the validated build; then run `npm run verify:live <slug>` against the production host.
