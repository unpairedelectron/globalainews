# Fact log — Gemini 4 Carbon and gated access

Prepared 31 October 2026. `[V]` marks a claim checked in a primary source and corroborated by an official explanation or an independent source where available. `[S]` marks a single-source or point-in-time claim kept narrow and attributed.

| Claim used in the draft | Tag | Source and tier | Check / limitation |
|---|---|---|---|
| Google announced Gemini 4 Carbon on 28 October 2026 and described cybersecurity and long-horizon capabilities. | [V] | Google DeepMind [1], Tier 1 | Vendor positioning is explicitly attributed, not treated as independent assessment. |
| Google says Carbon access begins with a subset of cyber defenders, then additional trusted partners, then wider product surfaces “as soon as possible.” | [V] | Google DeepMind [1], Tier 1 | No public date or Carbon-specific admissions checklist is given in the announcement. |
| The checked Fairwind page reports 650+ program partners and describes due diligence, MFA and Argon-only internal security-team use. | [V] | Google DeepMind [4], Tier 1 | These page terms describe Gemini 4 Argon, not established Carbon-specific requirements; the article does not transfer them to Carbon. |
| Google reports SEC-bench Pro 88.2%, ExploitGym 54.8% and CWE-bench 71.0%. | [V] | Google DeepMind [1][2], Tier 1 | Each figure is attributed; unlike benchmarks are not ranked as one scale. |
| Google self-computed SEC-bench Pro on the 183-task JavaScript-engine split with three attempts and the Antigravity harness. | [V] | Google DeepMind [2], Tier 1 | Methodology page checked; no operational exploit steps reproduced. |
| Google self-computed ExploitGym with a single attempt, no internet access and mitigations off; the page gives default and extended timeouts. | [V] | Google DeepMind [2], Tier 1 | Method detail is reported only at a high level; no exploit workflow instructions included. |
| CWE-bench uses public leaderboard results evaluated across models by Collinear AI. | [V] | Google DeepMind [2], Tier 1 | Different provenance from the two Google self-computed tests. |
| Artificial Analysis reports an Intelligence Index v5 score of 59 for Carbon. | [V] | Artificial Analysis [3], Tier 1 independent evaluator | General capability index; not a specialized cybersecurity score or a reproduction of SEC-bench/ExploitGym. |
| The official Gemini page links Argon’s model card and safety report; a direct Carbon model-card URL returned 404 on 31 October. | [S] | Google DeepMind [2][5][6], Tier 1 | Point-in-time search. Phrase as “not located in official pages checked,” not proof of permanent absence. |
| Google lists introductory rates of $2/M input and $10/M output tokens. | [V] | Google DeepMind [1], Tier 1 | An announced price does not establish general availability. |
| OpenAI described pausing training after a DNS resolver issue and resuming in an offline environment. | [V] | OpenAI [7], Tier 1 | Used only to distinguish training containment from product access controls. |
| Gemini 4 Argon was announced on 13 October 2026, about two weeks before Carbon. | [V] | Google DeepMind [8], Tier 1; Carbon announcement [1], Tier 1 | Timeline dates checked in official announcements. |
| NIST’s Generative AI Profile is a risk-management reference, not validation of Carbon results. | [V] | NIST [9], Tier 1 | Used as process context only. |
| No commercial relationship with Google. | [V] | Owner-confirmed editorial disclosure | Preserve the disclosure if the draft is later integrated. |
| Article is AI-assisted. | [V] | Editorial process | Disclosure included in the methodology note. |

## Source register

1. Google DeepMind, *Gemini 4 Carbon: our next frontier model*, 28 October 2026, Tier 1: https://deepmind.google/blog/gemini-4-carbon-our-next-frontier-model
2. Google DeepMind, *Gemini 4 Carbon Model Evaluation: Approach, Methodology & Results*, October 2026, Tier 1: https://deepmind.google/models/evals-methodology/gemini-4-carbon
3. Artificial Analysis, *Gemini 4 Carbon is the new #1 on the Artificial Analysis Intelligence Index v5*, 28 October 2026, Tier 1: https://artificialanalysis.ai/articles/gemini-4-carbon-new-number-1
4. Google DeepMind, *Fairwind Program*, accessed 31 October 2026, Tier 1: https://deepmind.google/fairwind-program/
5. Google DeepMind, *Gemini 4 Argon — Model Card*, accessed 31 October 2026, Tier 1: https://deepmind.google/models/model-cards/gemini-4-argon
6. Google DeepMind, *Gemini 4 Argon Safety & Security Report*, October 2026, Tier 1: https://storage.googleapis.com/deepmind-media/gemini/gemini_4_safety_report.pdf
7. OpenAI, *Securing our frontier model training environment*, 23 October 2026, Tier 1: https://openai.com/index/securing-our-frontier-model-training-environment
8. Google DeepMind, *Introducing Gemini 4 Argon*, 13 October 2026, Tier 1: https://deepmind.google/blog/gemini-4-argon-our-next-era-of-frontier-intelligence
9. NIST, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, July 2024, Tier 1: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
