# Snapshot scope

The current remediation changes application code, static assets, generated release files, and documentation only. It does not write to or migrate any database. The existing `production-articles-2026-10-12.csv` is a public editorial snapshot, not a full database backup.

A full database export was not added to the repository: it is not needed to reverse these code-only changes and could expose private editorial or account records.
