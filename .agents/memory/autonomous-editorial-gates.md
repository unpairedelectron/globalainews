---
name: Autonomous editorial gates
description: Durable constraints for the open-source newsroom publishing pipeline.
---

The autonomous editor must select a coherent source package before drafting. It may use one authoritative first-party source when corroboration is unavailable, but it must never add an unrelated citation to satisfy a source-count target. A separate fact-check pass and deterministic validation remain required before a release row is created.

**Why:** Broad feed windows can contain many unrelated items, especially from high-volume sources such as arXiv. A model can produce fluent copy that combines those items and cites the wrong URL unless coherence and citation support are enforced explicitly.

**How to apply:** When changing feed selection, prompts, or verification logic, preserve URL-to-claim support, reject unsupported or copied material, and keep release creation after every gate.

The cost-conscious configuration should use the less expensive model for drafting and revision, while retaining the stronger model for the final fact-check. Model output must be normalized before validation so malformed JSON shapes become rejections rather than run failures.

**Why:** Drafting is the highest-volume part of the workflow, but verification is the safety-critical step. Lower-cost output can also be structurally inconsistent even when its prose appears plausible.

**How to apply:** Keep the draft and verification model settings independently configurable, and test malformed, short, overbroad, copied, and unsupported drafts through the same deterministic gate.