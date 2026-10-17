# Production database cost fix results

## Current result

The public GET and release-build paths have been changed to use maintained static content rather than the production database. Authenticated editorial operations and valid newsletter signups still use PostgreSQL. Automation defaults off and the pool is limited to two clients with a 10-second idle timeout.

**Production compute savings are not yet measured.** This workspace did not publish the changes or alter production settings, so it cannot report a post-change usage total or confirm the <$0.50/month target. The reported pre-change compute hours cannot be attributed to a particular caller without production activity logs.

The Replit-managed recovery point selected for this work was not verifiable from the workspace. Confirm a recent recovery point in the Database page before publishing.

## Checks completed

- API and web TypeScript checks passed; the focused release-history and first-response tests passed.
- A local public-route probe with `DATABASE_URL` unset returned successfully without database-pool activity.
- The three-pass smoke run stopped on its first pass at the SEO suite's `/brief/#newsletter` assertion: `/brief/` did not return the explicitly expected `noindex,follow` directive. I did not change that public SEO behavior because it is outside this cost-fix scope; the second and third passes therefore were not run.
- The current static source produces seven stories and 32 sources. A 2026-10-12 production audit recorded eight stories before later SEO changes. No content records were changed here, but compare the current public slug set with the intended live edition before publishing.
- No production records or public editorial content were modified.

## Manual production verification after publishing

1. Confirm the Replit Database page shows a recent managed recovery point before publishing.
2. Publish the completed code.
3. Temporarily set `DB_CONNECTION_DIAGNOSTICS=true` in the production environment and restart the API. Request the homepage, one article, `/sitemap.xml`, `/feed.xml`, and social-preview URLs with a cookie-less client. Public GET requests should not acquire a database connection. The log contains an event, timestamp, caller, route, truncated user agent and activity counter; it never logs SQL or parameters.
4. Leave the site idle for 15 minutes. Review database activity/compute and application logs; then disable temporary diagnostics.
5. Compare production compute after 24 hours and again after seven days. Convert observed active hours using the current Replit database rate and confirm whether the monthly run-rate is below $0.50.
6. If database activity continues, inspect its logged caller and request path before changing any database or deployment settings.
