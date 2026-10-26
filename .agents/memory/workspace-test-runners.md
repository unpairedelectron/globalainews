---
name: Workspace test runners
description: Running tool binaries installed for a workspace package rather than at the repository root.
---

When a command-line tool is exposed only inside an artifact package, invoke it through that package's pnpm filter, such as `pnpm --filter @workspace/global-ai-news exec tsx --test ...`. Root-level `pnpm exec` may not resolve that binary.

**Why:** Workspace dependencies are not necessarily linked into the repository root's executable path, even when package scripts can use them.

**How to apply:** If a root-level command reports a missing binary, check the package's declared toolchain and execute through the owning workspace package rather than installing another copy.
