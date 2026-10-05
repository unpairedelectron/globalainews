---
name: Vite post-build metadata
description: Why config-side metadata processing that reads emitted assets should run from the output hook.
---

When post-processing needs files emitted by Vite, use `writeBundle` rather than `closeBundle` when the process must also work with external or temporary output directories.

**Why:** The release metadata test used a temporary output directory outside the package. Processing from `closeBundle` failed to find `index.html`; moving the operation to `writeBundle` made the emitted file available and the isolated test pass.

**How to apply:** Keep output-dependent processing after the write and add a regression test that builds to an external temporary directory.
