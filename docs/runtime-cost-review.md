# Runtime cost and database retention review

**Reviewed:** 2026-10-22  
**Scope:** Global AI News API snapshots, browser refresh behavior, editorial automation, and candidate database retention.

## Recurring work inventory

| Work | Before | Current behavior | Decision |
| --- | --- | --- | --- |
| Public newsroom content in an open browser tab | Repeated every 12 hours | Fetch on mount or when a focused tab has stale data; ten-minute client staleness | Removed the timer; retain user-driven refreshes |
| Editor release queue | Every 60 seconds while the page was open | Every five minutes while the editor page is foregrounded, plus mount, focus, explicit refresh, and after editor actions | Lengthened the interval fivefold and stopped background-tab polling |
| Editor automation audit | Every 60 seconds while the page was open | Fetch on mount and focus; manual retry remains | Removed background polling |
| Editorial automation | One scheduled run at or after 07:30 UTC per day when enabled; one daily recursive timeout | Unchanged; durable run keys still prevent duplicate cadence runs | Required publishing work |
| Editorial source discovery | Five configured feeds per automation run; recent source rows are saved and older-than-14-day rows are pruned during a run | Unchanged; automation was not invoked for this review | Existing bounded source inventory |
| Article renderer warmup | One content-snapshot request per web-server start | Unchanged | Retained to avoid a cold first article response |
| Release queue reads | Database reads on authenticated queue views and release mutations; public feeds read the process snapshot | Unchanged except mutations now refresh the in-memory public release snapshot | Retained for durable editor state and correct public updates |
| Newsletter signup | Database lookup, insert when needed, provider delivery, and status update per valid signup | Unchanged | Required subscription behavior |

The public API snapshot is retained in one process-local cache entry for at most ten minutes. Its shared-cache header is capped at five minutes and is shortened to the next known scheduled publication boundary. Valid future releases remain in the process snapshot but are filtered by publication eligibility at request time. Authenticated routes, mutations, metadata, and newsletter responses default to `no-store`.

## Database storage candidates and safe options

Production table sizes were **not measured**: the production database query was read-only, but the current session did not have an authenticated production database connection. No production rows were read or modified. These are schema- and code-based candidates, not measured bloat findings.

| Candidate | Why it may grow | Safe retention option |
| --- | --- | --- |
| `editorial_automation_runs.detail` | Terminal run records can retain full draft, verification, and validation-source payloads indefinitely. | Measure row counts and table size first. If material, agree on an audit period and archive or remove only bulky raw payload fields after that period while preserving run outcome, timestamps, run key, and replay-critical evidence. Do not delete whole runs as a cost shortcut. |
| `editorial_release_history` | Audit events accumulate as editors create, edit, reschedule, reorder, and cancel releases. | Keep the searchable audit intact by default. Consider archival only after editorial/legal retention requirements and retrieval expectations are approved. |
| `editorial_source_items` | Feed records are stored as editorial working inventory. | Existing automation prunes records older than 14 days. Measure volume before changing the window; do not run automation just to trigger cleanup. |
| `editorial_releases` | Durable release records support publication and editorial history. | Preserve scheduled and published records. Any archival of canceled or completed records needs an approved retention and recovery policy. |
| `newsletter_subscribers` | Stores subscriber email and delivery status. | Do not prune for compute savings. Any retention change must follow consent, unsubscribe, and privacy requirements. |

When production access is available, the following catalog query reports table bytes and PostgreSQL's estimated row count without scanning table contents or changing data:

```sql
SELECT
  c.relname AS table_name,
  pg_total_relation_size(c.oid) AS total_bytes,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
  COALESCE(s.n_live_tup, 0) AS estimated_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname = ANY (ARRAY[
    'editorial_source_items',
    'editorial_automation_runs',
    'editorial_releases',
    'editorial_release_history',
    'newsletter_subscribers'
  ])
ORDER BY pg_total_relation_size(c.oid) DESC;
```

No retention changes, production deletes, database-plan changes, automation runs, or deployments were performed for this review.
