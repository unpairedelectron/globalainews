# Fact log — GitHub Octoverse 2026 and agent-started pull requests

Prepared 31 October 2026. `[V]` marks a claim checked in a primary source and corroborated by an official explanation or independent report where available. `[S]` marks a single-source claim kept attributed.

| Claim used in the draft | Tag | Source and tier | Check / limitation |
|---|---|---|---|
| Octoverse 2026 was published on 28 October 2026 and reports activity through September 2026. | [V] | GitHub Octoverse [1], Tier 1 | The article uses the report's stated publication and reporting periods. |
| More than 40% of September pull requests started with an agent's first draft, compared with 17% in March. | [V] | GitHub [1], Tier 1; GitGuardian [9], Tier 2 for headline figures | Attribute to GitHub; this is a platform-specific detection metric, not all AI use. |
| GitHub reports about 110 million agent-started pull requests in September, about six times March's volume. | [S] | GitHub [1], Tier 1 | First-party platform statistic; retained with attribution. |
| GitHub calls the measure a floor because it does not detect all agent involvement. | [S] | GitHub [1], Tier 1 | Definition and limitation stated by the reporting platform. |
| Agent-started pull requests changed multiple files in about 87% of cases versus 79% for the comparison group. | [S] | GitHub [1], Tier 1 | Descriptive comparison; not causal evidence. |
| In September, 90% of agent-started pull requests merged within two weeks versus about 86% for pull requests without detected involvement; February figures were 83% and about 86%. | [S] | GitHub [1], Tier 1 | Preserve month and comparison group; not a quality or safety outcome. |
| Merged pull requests with detected AI involvement were 44.1% for TypeScript, 41.1% for Python, 40.4% for Rust and 21.2% for Java over the preceding 12 months. | [S] | GitHub [1], Tier 1 | Separate metric from agent-started PR share; values are platform-detected. |
| GitHub does not provide a public/private split in the report passages checked. | [S] | GitHub [1], Tier 1 | Narrowly phrased as a limit in the checked report, not proof no split exists elsewhere. |
| GitHub recommends human review/testing for generated code and supports required review controls. | [V] | GitHub Docs [2][3][4][8], Tier 1 | Product documentation; describes available controls, not measured effectiveness. |
| Untrusted pull-request content can create security risks when privileged Actions workflows are configured unsafely. | [V] | GitHub Docs [5], Tier 1 | General Actions security guidance, not a finding about the Octoverse PR sample. |
| SSDF and NIST AI RMF are process frameworks, not evidence that a specific workflow improves outcomes. | [V] | NIST [6][7], Tier 1 | Used as process references only. |
| Worked example: 64/80 and 96/120 each equal 80%. | [V] | Editorial calculation | Hypothetical illustration; arithmetic checked and labelled as such. |
| Article is AI-assisted. | [V] | Editorial process | Disclosure included in the draft methodology note. |

## Source register

1. GitHub, *Octoverse: Commits, pushes, reach new highs in 2026 as developers build with agents*, 28 October 2026, Tier 1: https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/
2. GitHub Docs, *Application card: GitHub Copilot Agents*, accessed 31 October 2026, Tier 1: https://docs.github.com/en/copilot/responsible-use/agents
3. GitHub Docs, *Review output from Copilot*, accessed 31 October 2026, Tier 1: https://docs.github.com/copilot/how-tos/agents/copilot-coding-agent/reviewing-a-pull-request-created-by-copilot
4. GitHub Docs, *About protected branches*, accessed 31 October 2026, Tier 1: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
5. GitHub Docs, *Security hardening for GitHub Actions*, accessed 31 October 2026, Tier 1: https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions
6. NIST, *Secure Software Development Framework (SSDF) Version 1.1*, February 2022, Tier 1: https://csrc.nist.gov/pubs/sp/800/218/final
7. NIST, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, July 2024, Tier 1: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
8. GitHub Docs, *Use GitHub Copilot code review across the pull request lifecycle*, accessed 31 October 2026, Tier 1: https://docs.github.com/en/copilot/tutorials/use-copilot-code-review-across-the-pull-request-lifecycle
9. GitGuardian, *GitHub Octoverse 2026: AI Agents, Citizen Developers, and the New Security Reality*, October 2026, Tier 2: https://blog.gitguardian.com/github-octoverse-2026/
