# Full-site remediation decision log

- Treat the attached brief as requirements to verify, not as proof that each stated root cause is live. Keep the current deployment and production settings unchanged.
- Use the publisher ID supplied in the brief as the single application config value, generate the exact ads.txt declaration from it in release builds, and check both canonical hosts before the redirect middleware.
- Keep ad markup out of the page entirely unless ads are enabled and a valid slot is configured. Do not reserve layout space for disabled ads.
- Preserve the existing URL/Host-only canonical redirect behavior. Verify it with cookie-less requests; do not add user-agent, cookie, or language-dependent redirects.
- Mark incomplete privacy, terms, and author-placeholder routes noindex and remove them from the sitemap; retain indexability for factual editorial standards disclosures.
- Do not invent or alter editorial records, identities, dates, contact channels, legal terms, image credits, or production database content.
- No database writes are part of this remediation. The existing public article snapshot remains unchanged; a full database dump was not copied into the repository because it is unnecessary for code-only changes and could expose private records.
- No deployment type, machine size, worker, or production setting is changed. The app will be left in preview for the owner to decide whether to publish.
