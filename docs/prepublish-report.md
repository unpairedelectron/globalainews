# October 2026 batch — private pre-publish gate report

Status: **not cleared for publication**. The batch remains private and unpublished.

## Article 6 — India AI consultation paper

| Check | Result |
|---|---|
| Body word count | 1,534 words before FAQ, source list and methodology using `scripts/editorial-prepublish-check.mjs`; within the explainer target of 1,200–1,800. |
| Sources | 8 listed: 6 Tier 1 primary/official sources and 2 Tier 2 reports. Secondary consultation-paper claims remain attributed. |
| Fact log | Present at `docs/fact-logs/india-ai-consultation-paper-what-is-law.md`; legal claims distinguish Gazette text, official explanations and reporting. |
| Original visuals | 3 static SVGs; XML parses; each has a title and description, a paired “View data” table, and was reviewed at 360px. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Title 49 characters; description 150 characters; canonical uses the verified production domain. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News research/report routes returned HTTP 200. |
| FAQ | Five questions; the pre-publish script confirms every answer is 40–70 words. |
| Arithmetic / duplicate title | No calculated numeric result; H1 and metadata title differ. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs` passes for this article, including internal-link checks. Batch-wide ten-article mode remains incomplete. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Article 5 — GitHub Octoverse and agent-started pull requests

| Check | Result |
|---|---|
| Body word count | 2,409 words before FAQ, source list and methodology; within the report target of 1,800–3,000. |
| Sources | 9 listed: 8 Tier 1 official/primary sources and 1 Tier 2 report. |
| Fact log | Present at `docs/fact-logs/github-octoverse-2026-agents-pull-requests.md`; proprietary Octoverse figures remain attributed to GitHub. |
| Original visuals | 4 SVGs parsed and reviewed at 360px: the March/September snapshots, language signal, comparison groups and review path. |
| Social images | 1200×630, 1200×675 and 1200×1200 AVIF/WebP variants generated; each is below 200 KB. |
| Metadata | Script passed title/description length checks; canonical, reviewer and private status are present. |
| Schema | NewsArticle, FAQPage and BreadcrumbList draft parses as JSON. It is not wired to a public route. |
| Internal links | Four existing Global AI News report/research routes returned HTTP 200. Article 10 cross-link is noted as planned, not inserted as a broken URL. |
| FAQ | Five questions; every answer passes the 40–70 word check. |
| Worked example | Hypothetical rates checked: 64/80 and 96/120 both equal 80%; clearly labelled as illustration. |
| Pre-publish script | `scripts/editorial-prepublish-check.mjs --article=github-octoverse-2026-agents-pull-requests --check-links` passes. |
| Lighthouse / live-page performance | Not run: no public article route was created under the draft-only instruction. |

## Articles 1–5 and 7–10

Articles 1–4 and 7–10 remain incomplete. Do not infer readiness from the working packets or the Article 5/6 checks.

## Batch-wide gate

The default ten-article checker has not passed; it must fail until all ten full draft packages are present. Cross-article QA is still pending.

## Release status

No article was added to the release queue, published or scheduled. Do not publish until the owner changes the current draft-only scope and all gates pass.
