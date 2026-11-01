# Code-native release publish state

Article bodies, section structure, citations, JSON-LD, visuals, and tables remain in the repository. `editorial_publish_states` stores only each slug's `publish_at`, status, last update time, and actor. It must never become a second article-content store.

## Statuses

- `staged`: retained privately for review; never appears on public surfaces.
- `scheduled`: eligible only after `publish_at`; a server-side job promotes it to `published`.
- `published`: public only when the schedule time has passed.
- `paused`: excluded from public surfaces regardless of its schedule time.

`updated_by` is derived from the verified Clerk identity for editor changes and `system:scheduler` for scheduled promotion. The browser cannot choose the recorded actor. The table is additive and does not alter the existing CMS release queue.

## Reversal

To roll back application code, revert the code-native release feature and leave the additive table in place; the existing CMS queue and editorial history remain untouched. If the table has no retained publication state and removal is explicitly approved, remove its Drizzle declaration and let Replit's Publish schema review show the resulting drop. Export and retain its rows before any approved drop. Never run DDL against production directly, add startup-time DDL, or put schema changes in a deploy build.

Changing an article's publication state is not a schema rollback. Use the editor action to pause it, or restore the prior state through an audited editor action so public snapshots refresh.
