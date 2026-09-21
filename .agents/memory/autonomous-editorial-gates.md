---
name: Autonomous editorial gates
description: Durable constraints for the open-source newsroom publishing pipeline.
---

The autonomous editor must select a coherent source package before drafting. It may use one authoritative first-party source when corroboration is unavailable, but it must never add an unrelated citation to satisfy a source-count target. A separate fact-check pass and deterministic validation remain required before a release row is created.

**Why:** Broad feed windows can contain many unrelated items, especially from high-volume sources such as arXiv. A model can produce fluent copy that combines those items and cites the wrong URL unless coherence and citation support are enforced explicitly.

**How to apply:** When changing feed selection, prompts, or verification logic, preserve URL-to-claim support, reject unsupported or copied material, and keep release creation after every gate.