# Cloudflare migration

## Current stage: reversible edge proxy

`cloudflare/global-ai-news` contains a small Cloudflare Worker that forwards
requests to the existing Replit deployment. It is an isolated staging step, not
a migration of the application runtime or database. Replit remains the origin
and the source of truth.

The Worker forwards the incoming path, query, method, body, and request headers.
It sets `X-Forwarded-Host` and `X-Forwarded-Proto` from the actual incoming URL
rather than trusting client-supplied forwarding headers. It does not cache
responses. The default Wrangler configuration disables both `workers.dev` and
preview URLs, and defines no domain route, so deploying the config as-is does
not expose a public endpoint or change DNS.

## Local checks

From the workspace root:

```sh
pnpm --filter @workspace/global-ai-news-cloudflare test
pnpm --filter @workspace/global-ai-news-cloudflare run deploy:dry-run
```

## Remaining stages

1. Obtain Cloudflare account access before creating or deploying the Worker.
   For online validation, configure an isolated test hostname and check public
   pages, editor authentication, article HTML, API responses, feeds, and SEO
   headers against the Replit origin.
2. Move the API runtime in compatible slices. The current API starts an
   Express listener, uses Node-specific middleware and `pg`, and starts
   background editorial automation; the proxy Worker does not replace those.
3. Provision Neon and migrate a verified database snapshot only after
   confirming schema compatibility, data counts, secrets, and a rollback path.
   Do not point production writes at Neon until the migration checks pass.
4. Move static assets and web rendering as a separate stage, then test
   authentication, SSR, redirects, feeds, sitemaps, and cache behavior.
5. Change DNS only after the Cloudflare endpoint and database have passed
   production-like checks. Keep the Replit deployment available as rollback.

No Neon project, Cloudflare resource, DNS record, or production database was
created or modified during this stage.
