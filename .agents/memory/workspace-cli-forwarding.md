---
name: Workspace CLI forwarding
description: Handle PNPM's forwarded argument separator in package-level Node CLI scripts.
---

For package scripts that accept positional arguments, treat a bare `--` in `process.argv` as the runner separator, not as user input. In this workspace, `pnpm --filter <package> run <script> -- <value>` forwards the separator to the underlying Node process.

**Why:** The live-route verifier initially interpreted `--` as the article slug, so a valid workspace invocation failed.

**How to apply:** When adding a package-level CLI script, either strip the separator before parsing positional inputs or document a tested invocation without it. Test the command through PNPM, not only by calling Node directly.
