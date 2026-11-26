---
title: "Why You Now Have to Apply to Use AI for Security Work: Inside CVP and Daybreak"
seoTitle: "AI Cyber Access Tiers: CVP and Daybreak Explained"
description: "Anthropic and OpenAI both block most cyber work by default and hand the capability back only to vetted applicants. What each tier allows, and who actually qualifies."
category: "safety"
image: "/images/articles/ai-cyber-access-tiers-cvp-daybreak/hero.jpg"
imageAlt: "Why You Now Have to Apply to Use AI for Security Work: Inside CVP and Daybreak"
tags: ["Cybersecurity", "Model access", "Anthropic"]
date: "2026-12-05T07:30:00Z"
takeaways:
  - "Both Anthropic and OpenAI now ship their general models with cyber safeguards that block most security work, and restore the capability only to applicants they have verified."
  - "Anthropic's Cyber Verification Program has three tiers — Defense, Red Team and Specialized — with review times from a few days to longer than a few weeks."
  - "Anthropic published the number that shows how real the difference is: with Red Team access, Claude Opus 5.5 hit the same completion rate on a cyber benchmark as with no safeguards at all."
  - "Independent researchers can reach Anthropic's lowest tier but not its Red Team tier, which is organisations only. OpenAI's Daybreak accepts individuals or organisations for both of its tiers."
  - "The upper tiers come with conditions: data retention is required for monitoring, Red Team and Specialized sit on Enterprise and API plans, and Specialized applications are reviewed with the US government."
---
## The bottom line

**The most capable cyber capabilities in frontier models are no longer something you buy. They are something you apply for.**

Anthropic states the reasoning plainly: "Cybersecurity is inherently dual use: the same capabilities that enable a security team to find and fix a vulnerability can also help a malicious actor exploit it." Because of that, its generally available models "have conservative cyber safeguards that block most cyber work". [1]

OpenAI operates the same way. Its Daybreak programme says that "to responsibly offer these capabilities, we verify applicants and review how they plan to use OpenAI's models before approving access". [2]

If you do security work in India — at a bank, a utility, a testing firm, or on your own — the practical consequence is that the model you can buy off the shelf is deliberately worse at your job than the one that exists, and closing that gap means passing someone's vetting.

## Key facts at a glance

| | |
|---|---|
| Anthropic's programme | Cyber Verification Program (CVP), expanded 6 October 2026, page updated 18 November 2026 [1] |
| CVP tiers | Defense Access, Red Team Access, Specialized Access [1] |
| Models covered | "our most capable models, including Claude Opus 5.5, Claude Sonnet 5.5, Claude Mythos 5.1, and new models moving forward" [1] |
| Review times | Defense: "within a few days". Red Team: "a few weeks". Specialized: longer, reviewed "in collaboration with the US government" [1] |
| OpenAI's programme | Daybreak, with two tiers: Daybreak Blue and Daybreak Red [2] |
| Individuals eligible? | Anthropic: Defense yes, Red Team no. OpenAI: "as an individual or an organization" [1][2] |
| Condition of entry | Data retention required, so Anthropic "can monitor for cyber misuse" [1] |

## Anthropic's three tiers, and who each is for

CVP replaced two earlier schemes — Project Glasswing, which gave organisations securing critical software access to Claude Mythos, and the original CVP, which reduced safeguards for vetted teams. [1]

**Defense Access** covers defensive work: security operations centre and incident response tasks, reverse-engineering malware, and analysing and validating vulnerabilities. Anthropic lists qualifying applicants broadly: security teams at companies, nonprofits, universities and government bodies "defending systems they own or maintain"; operators of critical infrastructure "of any size, such as regional hospitals or municipal utilities"; smaller security firms; open-source maintainers; and individual researchers "with a track record of reported vulnerabilities". It expects "many organizations conducting defensive cybersecurity work to qualify", and aims to respond "within a few days". [1]

**Red Team Access** adds authorised penetration testing and red-teaming. In-house red teams, government red teams and testing firms qualify, but only to test "systems they are authorized to test". Hard limits remain: users "will still experience real-time blocks on actions that could cause physical harm or mass disruption, such as deploying ransomware, damaging physical systems, or pen testing high-risk safety systems". Review takes "a few weeks", and this tier "is for organizations only; individual researchers are not eligible". [1]

**Specialized Access** has "the fewest cyber blocks" and is reserved for organisations red-teaming "systemically important infrastructure whose failure could impact people's lives or disrupt markets, such as flight operating systems, power grids, telecom networks, interbank transfer infrastructure, and government administrative networks". [1]

One clarification in that tier is worth reading twice: "Operating critical infrastructure doesn't, by itself, qualify an organization for Specialized Access". Applicants must show they are authorised to test such infrastructure and "describe the work they can't do with Red Team Access". Anthropic reviews every application for this tier "in depth, in collaboration with the US government". [1]

## The number that shows the tiers are real

Vendors describe safeguards in prose. Anthropic published a measurement, and it is unusually candid.

It ran Claude Opus 5.5 through CyScenarioBench — an evaluation of whether a model can plan and execute multi-stage cyber operations — with safeguards tuned to each tier, five attempts at each of 10 challenges, so 50 trials per tier. The results: [1]

- **Without CVP access:** "every task was blocked on the first prompt".
- **Defense Access:** 46 of 50 trials were blocked at some point; the other four succeeded.
- **Red Team Access:** "no blocks occurred", and the model completed 34 of 50 tasks — which Anthropic says is "effectively equivalent to the model's 67.6% success rate on this evaluation with no safeguards applied (representative of Specialized Access)".

Read the last line carefully. At Red Team tier the safeguards are not loosened; on this benchmark they are effectively absent. The gate, not the guardrail, is doing the work.

That is the honest shape of the trade-off. These programmes are not a dial on model behaviour so much as a decision about who is trusted, enforced at the account level.

## What the gated access has produced

Anthropic's case for the programme rests on Project Glasswing's output: partners "uncovered at least 129,000 verified software vulnerabilities between April and July 2026", with a further 5,500 from Anthropic's own open-source scanning between April and October, and "more than 33,000" of those rated critical or high severity. [1]

To its credit, Anthropic supplies the caveats itself. The figure is "likely an undercount", based "on survey data from only a subset of Glasswing partners" — 33 partner reports — and it expects "the true impact to be at least five times higher". Fewer than half of partners disclosed patched numbers, "so the patch rate is significantly undercounted". [1]

So treat 129,000 as a partner-reported floor on discovery, not a measure of vulnerabilities actually fixed. Discovery and remediation are different things, and the company says so.

Separately, Anthropic's Cyber Mission adds a Critical Infrastructure Defense Program for operational technology behind "power grids, water systems, and transportation networks", and an OSS Scanner offering open-source projects "regular security scans from our strongest models, for free". [3]

## OpenAI's version

Daybreak splits two ways rather than three. **Daybreak Blue** is "for defensive work including vulnerability discovery, validation, remediation, threat modeling, and security investigation". **Daybreak Red** is "for advanced, authorized red teaming, penetration testing, exploit validation, and controlled security research". [2]

The difference that matters for a lone researcher: OpenAI invites applications "as an individual or an organization" for Daybreak, with no equivalent of Anthropic's organisations-only restriction on red teaming. [2]

OpenAI also attaches money to the defender side. Under Daybreak for Frontline Defenders it says it "has committed $1 billion in subsidized Daybreak access, training, technical support, and partnerships", inviting registrations of interest from anyone working "for or with a utility, state or local government, community bank, nonprofit, or open-source project". [2] And Patch the Planet pairs OpenAI with Trail of Bits, Calif and HackerOne to help open-source maintainers "validate findings, test patches and coordinate disclosure". [2]

## The strings attached

Three conditions deserve attention before you apply.

**Monitoring is mandatory.** "Data retention is required for organizations enrolled in the program so that we can monitor for cyber misuse." Anthropic says a forthcoming Enterprise Frontier Safeguards option will let eligible organisations keep data in infrastructure they control. [1]

**Plan tier gates the capability tier.** Red Team and Specialized Access are "available only on Enterprise and API plans" — a change the page records as part of its 18 November update. [1]

**A government sits in the loop at the top.** Specialized Access reviews are conducted "in collaboration with the US government". [1] That is a reasonable control for the ability to red-team power grids. It is also a fact non-US applicants should factor into their expectations.

## What this means for…

**Indian security firms and testing companies.** Defense Access looks reachable and fast. Red Team Access is the realistic ceiling for most, needs an Enterprise or API plan, and takes weeks. Plan procurement accordingly rather than assuming capability is a purchase.

**Independent Indian researchers.** Anthropic's Defense tier explicitly admits individuals with a track record of reported vulnerabilities, but its Red Team tier does not admit individuals at all. If your work needs authorised offensive testing, OpenAI's Daybreak is the programme that accepts individual applicants. [1][2]

**Indian critical-infrastructure operators.** Note the distinction Anthropic draws: operating critical infrastructure does not by itself qualify you for the top tier; being authorised to *test* it does. OpenAI's subsidised programme names utilities, community banks and nonprofits among its categories but does not state geographic eligibility on that page, so ask rather than assume. [1][2]

**Anyone weighing open weights.** None of this applies to a model whose weights you hold. That is a genuine argument for the open-weight route, with the licence and the capability trade-offs covered in our explainer on [open weights versus open source](/article/open-weights-vs-open-source-ai/). The context for why labs are tightening at all is in our piece on [OpenAI's Critical cybersecurity rating and self-improvement threshold](/article/openai-high-self-improvement-threshold/).

## What we don't know yet

- **Approval rates.** Neither company publishes how many applications it receives, approves or rejects, or any geographic breakdown. [1][2]
- **Whether non-US applicants fare differently**, particularly at Anthropic's Specialized tier given the US government's role in those reviews. [1]
- **What the $1 billion buys.** OpenAI gives a headline figure, not an allocation, eligibility rule or timeline. [2]
- **How much of the 129,000 was fixed.** Anthropic states the patch rate is significantly undercounted and does not give one. [1]

## FAQ

### Why can't I just use a normal model for security work?

Because both companies deliberately block most of it. Anthropic says its generally available models carry "conservative cyber safeguards that block most cyber work", while allowing tasks such as code review, patching known issues, finding vulnerabilities in code you own, and triaging alerts. [1]

### What are Anthropic's CVP tiers?

Defense Access for defensive work; Red Team Access adding authorised penetration testing; and Specialized Access, with the fewest blocks, for organisations authorised to test systemically important infrastructure. [1]

### Can an individual get access?

To Anthropic's Defense Access, yes, if you have "a track record of reported vulnerabilities". To its Red Team Access, no — that tier is organisations only. OpenAI's Daybreak accepts applications from individuals or organisations. [1][2]

### How long does approval take?

Anthropic aims to respond to Defense Access applications "within a few days", expects Red Team Access to take "a few weeks", and says Specialized Access reviews take longer still. [1]

### Does the vetting actually change what the model will do?

Yes, measurably. On CyScenarioBench, every task was blocked on the first prompt without CVP access; 46 of 50 trials were blocked at Defense tier; and at Red Team tier nothing was blocked, with the model matching its unguarded success rate. [1]

### What do I give up by joining?

Data retention, which Anthropic requires so that it can monitor for cyber misuse, and in practice an Enterprise or API plan for the upper two tiers. [1]

## Sources

**Primary**

1. Anthropic, *Expanding the Cyber Verification Program*, published 6 October 2026, page updated 18 November 2026. Accessed 26 November 2026. https://www.anthropic.com/news/cyber-verification-program
2. OpenAI, *Daybreak* (cybersecurity programme page, including Daybreak Blue and Red, Frontline Defenders and Patch the Planet). Accessed 26 November 2026. https://openai.com/daybreak/
3. Anthropic, *Introducing the Anthropic Cyber Mission*, published 8 October 2026. Accessed 26 November 2026. https://www.anthropic.com/news/anthropic-cyber-mission

## Methodology note

Research and drafting for this article were AI-assisted, and every quoted phrase, tier description and figure was checked against the three company pages above on 26 November 2026. All three sources are the vendors' own, because the subject is the access rules they have written; tier criteria, review times and benchmark results are therefore their claims rather than independently verified facts, and the article attributes them throughout. The CyScenarioBench results and the Project Glasswing vulnerability counts are Anthropic's own reported numbers, including the undercount caveats it states itself. We did not apply to either programme or test any model. See our [editorial policy](/editorial-policy/).
