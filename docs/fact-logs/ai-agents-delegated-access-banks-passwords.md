# Fact log — delegated access for AI agents

Prepared 31 October 2026. `[V]` marks a claim checked against a vendor or technical source; vendor capability claims remain attributed.

| Claim used in the draft | Tag | Source and tier | Check / limitation |
|---|---|---|---|
| 1Password says its agent integration can broker sign-in while keeping the underlying password from the agent and asking the user to approve. | [V] | 1Password [1], Tier 1 | Vendor description, not an independent assessment. |
| Google Cloud says a Gemini coworker agent can receive its own Workspace account, email, calendar, Drive and directory identity. | [V] | Google Cloud [2], Tier 1 | Vendor description; actual scope depends on configuration. |
| Chrome enhanced autofill can suggest selected details drawn from Gmail for forms. | [V] | Google Chrome [3], Tier 1 | Separate user-facing feature, not a delegated agent login. |
| Opera WebAI allows websites and extensions to use models running locally in the browser. | [V] | Opera [4], Tier 1 | Local execution does not establish all data flows or permissions. |
| NIST and Google OAuth guidance support secure authenticator/token handling. | [V] | NIST [5] and Google [6], Tier 1 | General identity guidance, not product audits. |
| OWASP identifies excessive agency as a risk to manage in LLM applications. | [V] | OWASP [7], Tier 1 technical guidance | General defensive framework, not evidence of a named product defect. |
| TechCrunch describes the 1Password broker flow and launch. | [S] | TechCrunch [8], Tier 2 | Secondary context; vendor source remains primary for product capabilities. |
| Local inference, a broker, or a separate account does not alone guarantee security. | [V] | Synthesis of [1–7] | Compare permissions, identity, approval, audit, data flow and revocation. |
| No Bank of America warning or bank-blocking claim is included. | [V] | Editorial scope | No supporting primary statement was located in this check. |
| Article is AI-assisted and unpublished. | [V] | Editorial process | Disclosed in methodology. |

## Source register

1. 1Password, *Introducing 1Password for Agents*, 22 October 2026, Tier 1: https://1password.com/blog/1password-for-ai-agents
2. Google Cloud, *Welcome to Gemini at Work 2026: Introducing the Gemini agent*, 8 October 2026, Tier 1: https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026
3. Google Chrome, *Chrome’s enhanced autofill helps you fill out forms with suggestions pulled from Gmail*, 28 October 2026, Tier 1: https://blog.google/products-and-platforms/products/chrome/enhanced-autofill-gmail/
4. Opera, *WebAI: Local AI for the web, now in Opera*, 27 October 2026, Tier 1: https://blogs.opera.com/news/2026/10/webai-local-ai-for-the-web-now-in-opera
5. NIST, *Digital Identity Guidelines: Authentication and Authenticator Management*, SP 800-63B-4, Tier 1: https://pages.nist.gov/800-63-4/sp800-63b.html
6. Google Identity, *OAuth 2.0 best practices*, Tier 1: https://developers.google.com/identity/protocols/oauth2/resources/best-practices
7. OWASP GenAI Security Project, *OWASP Top 10 for LLM Applications*, Tier 1 technical guidance: https://genai.owasp.org/llm-top-10/
8. TechCrunch, *1Password launches a way for AI agents to log in on your behalf without seeing your password*, 22 October 2026, Tier 2: https://techcrunch.com/2026/10/22/1password-launches-a-way-for-ai-agents-to-log-in-on-your-behalf-without-seeing-your-password/
