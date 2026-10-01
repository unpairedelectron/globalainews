# Global AI News publication lifecycle

## Source of truth

The `editorial_releases` PostgreSQL table stores prepared releases. Its `status` column is text, `publish_at` is the intended publication timestamp, and `story` contains the release copy and public story fields. The table does not persist a separate `published` transition when a scheduled release becomes due. The editor release view derives that effective state from the row.

Maintained article records remain the baseline public content. A database release enters the public snapshot only when its status is `scheduled` or `published`, its `publish_at` is at or before the current time, and its editorial copy meets the 800-word publication minimum.

## Status mapping

| Effective state | Database representation | Public behavior |
| --- | --- | --- |
| `draft` | `status = 'draft'` | Private; excluded from article routes, content, metadata, RSS, and sitemap. |
| `scheduled` | `status = 'scheduled'` but the timestamp is in the future or the copy is below the publication minimum | Private until every publication gate passes. |
| `published` | `status` is `scheduled` or `published`, `publish_at <= now`, and the copy meets the 800-word minimum | Included in the live public snapshot and its article metadata, RSS, and indexable sitemap routes. The persisted status may remain `scheduled`; the release view reports the derived state. |
| `unpublished` | `status = 'unpublished'` | Private and excluded from all public surfaces. |
| `archived` | `status = 'archived'` | Private and excluded from all public surfaces. |

`canceled` is a retained legacy terminal value that behaves like `unpublished`. Any unrecognized status is treated as non-public. The read-only production database audit on 2026-10-01 found four rows with `status = 'scheduled'` and no rows in the other listed states.

## Shared public rules

The runtime API and build-time SEO metadata use the same status, timestamp, and word-count gate. Article first-response HTML fetches the live newsroom API for each request; it is not limited to the set of article pages rendered during a build. Homepage content, article routes, RSS, and sitemap must all derive from the same eligible public story set. The sitemap additionally excludes routes marked non-indexable.

Production's first-response behavior for a newly published article has not been proven with a safe production fixture. The local integration test verifies the live API-to-article route flow without rebuilding, but that is not evidence of production behavior.

## Modification dates

Public `dateModified`, `article:modified_time`, and article sitemap `lastmod` are emitted only for an explicit valid modification date that is not earlier than publication. Missing or pre-publication modification dates are omitted; publication dates are never rewritten to satisfy the comparison.