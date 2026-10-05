---
name: Documentation checkpoints and build fingerprints
description: Avoid chasing Git SHAs when Replit checkpoints documentation-only changes between turns.
---

Git HEAD can advance when workspace documentation is checkpointed, even when product source is unchanged. In this project, the `sourceRevision` Git prefix changed while the source-content hash and Web/API artifact hashes stayed constant; a running API process continued to advertise the revision from its last build.

**Why:** Comparing a moving branch tip to a build made before a documentation-only checkpoint can create a loop: updating the record itself can move the next Git SHA.

**How to apply:** Keep the exact revision embedded in the last verified build separate from the current branch HEAD. Rebuild and restart when source or build inputs change; for documentation-only commits, record both revisions instead of repeatedly rewriting the build fingerprint.
