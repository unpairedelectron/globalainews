---
title: "US Export Controls Now Follow the Customer, Not the Country: What That Means for Indian Compute"
seoTitle: "US Compute Export Controls: What India Needs"
description: "Washington's new rule controls AI chips by who rents the compute, not where the data centre sits. India is not named — but Indian operators and startups still have new work to do."
category: "policy"
image: "/images/articles/us-remote-compute-export-controls-india/hero.jpg"
imageAlt: "US Export Controls Now Follow the Customer, Not the Country: What That Means for Indian Compute"
tags: ["Export controls", "India", "Compute"]
date: "2026-11-29T07:30:00Z"
takeaways:
  - "A US interim final rule effective 19 November 2026 requires a licence to send advanced chips to any data centre, anywhere, that gives more than 12,000,000 'aggregate TPP' of compute to companies headquartered in Macau or an arms-embargoed country."
  - "India is not named in the new controls. It sits in Country Group A:5, which the rule expressly excludes, and it does not appear in Country Group D at all."
  - "The obligation that does reach India is diligence: a foreign data centre that cannot show who ultimately owns or controls its customers becomes a 'red flag' that presumptively gives a chip supplier knowledge of a prohibited end use."
  - "Indonesia, Malaysia, Singapore, Brazil and Thailand now need licences for advanced chips, which matters to any Indian company renting capacity in Singapore or Malaysia."
  - "The same rule deletes the export control on AI model weights and the AI Diffusion Rule's country tiers, so one part of the regime got looser as another tightened."
---
## The bottom line

**The United States has stopped drawing its chip-control map purely by geography.** An interim final rule from the Commerce Department's Bureau of Industry and Security, *Addressing Remote Access to Advanced Semiconductors*, published and effective on 19 November 2026, controls advanced chips according to **who ends up renting the compute**, not only where the hardware physically sits. [1]

For India the headline is straightforward: **India is not a target of this rule.** It is not among the five countries given new licence requirements, it is in Country Group A:5 — which the rule explicitly carves out — and it does not appear in Country Group D at all. [1][3]

The part that does reach Indian companies is less visible and more practical. If you operate a data centre, you are now expected to know who ultimately owns and controls your customers, and to be able to prove it to your chip supplier. If you rent GPUs abroad, your provider's licensing position just changed in several places that Indian startups actually use.

## Key facts at a glance

| | |
|---|---|
| Rule | *Addressing Remote Access to Advanced Semiconductors*, interim final rule [1] |
| Citation | 91 FR 74970; Docket 261116-0005; RIN 0694-AK50 [6] |
| Published and effective | 19 November 2026 [1] |
| Comments close | 19 January 2027 [6] |
| Core control | New 15 CFR 744.24(a)(1): licence required where there is "knowledge" chips will serve a data centre, "wherever located", providing more than 12,000,000 "aggregate TPP" to Macau- or Country Group D:5-headquartered companies [1] |
| Deadline for existing operators | A licence within 90 days of the effective date "or face future export restrictions" [1] |
| New destination licences | Indonesia, Malaysia, Singapore, Brazil, Thailand [1] |
| India's status | Country Group A:5; absent from Country Group D [3] |
| Also does | Rescinds the AI Diffusion Rule, including the control on model weights [1] |

## What the new control actually does

The rule adds section 744.24 to the Export Administration Regulations. The operative test has three parts, and all three matter. [1]

**First, knowledge.** The licence requirement bites when the exporter has "knowledge" that the chips will be used in a qualifying data centre. This is not a shipping destination test.

**Second, location is irrelevant.** The rule reaches data centres "wherever located". A facility in Mumbai, Frankfurt or São Paulo is covered on exactly the same terms as one in a country of concern.

**Third, the customer's headquarters.** What triggers the control is supplying "direct or indirect access" to more than 12,000,000 "aggregate TPP" of computing power to a company headquartered in — or whose ultimate parent is headquartered in — Macau or a destination in Country Group D:5. [1] That group is the US arms-embargoed list, and it includes China. [3]

Two mechanics widen the reach considerably. The ceiling is measured across **"linked data centers"**, defined to include "digitally-linked infrastructure, not just physically-linked infrastructure" — so splitting a workload across sites does not split the number. [1] And the obligation follows a change of circumstances: if a data centre starts serving such customers *after* the chips have arrived, the rule makes the operator responsible for obtaining the licence itself. [1]

Operators already providing those services before publication must obtain a licence within 90 days of the effective date "or face future export restrictions". [1] Applications are reviewed case by case. [1]

There is one carve-out, and it is narrower than it first sounds. A "commercial recommender system" is exempt — but the rule defines that as a tool "exclusively designed and exclusively used" to rank, filter or suggest products and content, and expressly excludes any system "designed or used to generate novel text, image, audio, video, software, or other content", or any system that incorporates one. [1] Generative workloads do not qualify.

## Where India actually sits

This is worth stating precisely, because the secondary coverage of export-control rules often blurs it.

The Export Administration Regulations sort countries into groups. We read the current table directly. India appears in Country Group **A:5**, alongside the Wassenaar, Missile Technology Control Regime and Australia Group listings, and it does **not** appear anywhere in the Country Group D table. [3]

That matters twice over. The rule's second new licence requirement, in section 742.6(a)(6)(iii)(A)(2), covers Country Groups D:1, D:4 and D:5 while **excluding destinations in Country Groups A:5 or A:6**. [1] India is excluded on both counts: it is in A:5, and it is not in Group D to begin with.

India is also not among the five countries — Indonesia, Malaysia, Singapore, Brazil and Thailand — added for presenting what BIS calls an unacceptable risk of diversion. [1]

So nothing in this rule restricts shipping advanced chips to India. Our explainer on the [IndiaAI GPU tender](/article/indiaai-10000-gpu-tender-explained/) and our guide to [India's AI compute access](/article/india-ai-compute-access-2026/) cover the domestic side.

## What actually changes for Indian companies

**If you run a data centre or cloud service.** The due-diligence expectation is the real obligation. The rule says foreign data centres "will be expected to perform robust due diligence on their customers to identify direct or indirect ownership or control by Country Group D:5 or Macau persons", explicitly so that companies "cannot circumvent new controls through corporate restructurings or spinoffs". [1]

The enforcement mechanism is the sharp end. A chip supplier must be able to obtain information about your know-your-customer checks, and the rule states that a data centre "declining or being unable to provide information sufficient to verify compliance with this end use control shall be considered a red flag that presumptively provides you with 'knowledge'" — unless the supplier resolves it first. [1] In practice, an operator who cannot answer ownership questions becomes harder to supply, whatever its own compliance position.

**If you rent GPUs abroad.** Singapore and Malaysia are common choices for Indian teams needing capacity quickly. Both now require a licence for advanced chips. [1] The requirement falls on the exporter rather than on you, and it does not apply where the end user's ultimate parent is headquartered in the United States and the exporter files the reports in the new section 743.10. [1] The practical effect is on lead times and provider mix, not a prohibition.

**If you are planning capacity.** The 12,000,000 aggregate TPP ceiling is a threshold to track, not a cliff edge you cross silently — but it aggregates across linked sites, so a multi-region footprint counts as one number. [1]

## How to tell whether the ceiling applies to you

The rule measures compute in "total processing performance", or TPP: two multiplied by "MacTOPS" multiplied by the bit length of the operation, aggregated across processing units. [1]

A chip is controlled at 4,800 TPP, and the rule gives its own worked example: that threshold "can be met with 600 tera integer operations (or 2 x 300 MacTOPS) at 8 bits or 300 tera FLOPS (or 2 x 150 MacTOPS) at 16 bits". [1]

Set the control threshold against the data-centre ceiling and the arithmetic is simple. Twelve million divided by 4,800 is **2,500** — that is our own calculation from the rule's two figures, and it describes chips sitting exactly at the control threshold. Current top-end accelerators are well above 4,800, so a real deployment reaches the ceiling with substantially fewer units than that.

There is a trap in working out your own number, and it is worth flagging because it is easy to get wrong in the direction that understates your exposure. The rule specifies that where a chip handles both sparse and dense matrices, "the `TPP' values are the values for processing of dense matrices". [1] Vendor marketing pages frequently lead with the sparsity-assisted figure. NVIDIA's H100 page, for instance, lists 3,958 teraFLOPS for FP8 and 1,979 for FP16 with an asterisk resolving to "With sparsity". [5] Those are not the numbers the regulation asks for. Use the dense specification, and if the vendor does not publish it, ask.

## The part that got looser: model weights

Buried in the same document is a change pointing the other way. The rule formally rescinds the AI Diffusion Rule of January 2025 and, with it, the export control on AI model weights. [1]

Specifically, it removes ECCN 4E091 from the Commerce Control List outright, together with the model-weights Foreign Direct Product rule in section 734.9, the related red flag, and the definition of "Model Weights" from the regulations. [1] BIS says a destination- and end-use-based approach is more effective than controlling the weights themselves. [1]

It also deletes the AI Diffusion Rule's country tiers, License Exception AIA and the Data Center Validated End-User authorisation. [1]

For anyone publishing or consuming open-weight models, that removes a US export-control layer that had hung over the question since 2025 — though licensing terms are a separate matter, as our explainer on [open weights versus open source](/article/open-weights-vs-open-source-ai/) and our piece on [Microsoft's licensed weights](/article/microsoft-mai-licensed-weights-gemma-base/) set out.

## Why the rule says "SI" instead of "AI"

Readers going to the source text will find it refers throughout to "Super Intelligence" and "SI". This is not a drafting quirk.

Executive Order 14434, signed on 29 September 2026, directs that the executive branch "shall use the terms 'Super Intelligence' and 'SI' in place of 'Artificial Intelligence' and 'AI' and will not acknowledge the usage of 'Artificial Intelligence' and 'AI' in any applicable setting". [4] The order defines the new terms as meaning the same technologies the existing statutory definition of artificial intelligence already covers. [4] It is a renaming, not a change of scope.

One further detail from the agency's own announcement is unusual enough to note: BIS says the rule was "written by and at the direction of the Department of Treasury and the National Security Council". [2] Export-control rules are normally drafted by BIS itself.

## What this means for…

**Indian cloud and data-centre operators.** Build the ownership-and-control diligence now, and be ready to evidence it to suppliers. The cost of not being able to answer is being treated as a red flag.

**Indian startups renting foreign compute.** Check where your provider's capacity physically sits and who its parent is. Expect longer procurement in Singapore and Malaysia.

**Anyone tracking the open-weights debate.** A US export control on model weights existed on paper and has now been removed. That is a real shift, and it arrived inside a rule reported almost everywhere as a tightening.

## What we don't know yet

- **How "significant" is enforced below the ceiling.** The rule sets a 12,000,000 aggregate TPP figure, but the preamble also speaks of "significant volumes" in general terms. [1]
- **How quickly licences will be decided.** Review is case-by-case with no stated service standard, against a 90-day compliance deadline. [1]
- **Whether more countries will be added.** The rule allows the Secretary of Commerce to designate further destinations, and lets the Secretary of State or the National Security Advisor flag a destination as high-risk. [1]
- **What the comment period changes.** This is an interim final rule already in force; comments close on 19 January 2027. [6]

## FAQ

### Does this rule restrict AI chip exports to India?

No. India is not named in the new controls, sits in Country Group A:5 — which the rule's expanded destination requirement expressly excludes — and does not appear in Country Group D. [1][3]

### What is "aggregate TPP"?

The sum of the total processing performance of a group of chips. TPP itself is two multiplied by MacTOPS multiplied by the bit length of the operation. A single chip is controlled at 4,800 TPP; the data-centre ceiling in this rule is 12,000,000. [1]

### I run a data centre in India with no Chinese customers. Does anything change?

Your supplier may now ask you to evidence who ultimately owns and controls your customers. Being unable to answer is itself treated as a red flag that presumptively gives the supplier "knowledge" of a prohibited end use. [1]

### Which countries need a licence now that did not before?

Indonesia, Malaysia, Singapore, Brazil and Thailand, with an exclusion where the end user's ultimate parent is headquartered in the United States and the exporter meets the reporting requirements of section 743.10. [1]

### Is exporting AI model weights still controlled?

Not under the EAR provision that previously covered them. This rule removes ECCN 4E091 and the associated model-weights rules outright. [1]

### Why does the rule say "Super Intelligence"?

Because Executive Order 14434 directs the executive branch to use "Super Intelligence" and "SI" in place of "artificial intelligence" and "AI". The underlying definition is unchanged. [4]

## Sources

**Primary**

1. Bureau of Industry and Security, Department of Commerce, *Addressing Remote Access to Advanced Semiconductors*, interim final rule, 91 FR 74970, published and effective 19 November 2026, full text accessed 20 November 2026. https://www.govinfo.gov/content/pkg/FR-2026-11-19/html/2026-23529.htm
2. Bureau of Industry and Security, *BIS Issues Rule Addressing Remote Access to American Super Intelligence Technology* (press release), accessed 20 November 2026. https://www.bis.gov/press-release/bis-issues-rule-addressing-remote-access-american-super-intelligence-technology
3. Electronic Code of Federal Regulations, *Supplement No. 1 to Part 740 — Country Groups*, 15 CFR, as in force 9 November 2026, accessed 20 November 2026. https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740
4. The White House, *Inaugurating the Era of Super Intelligence*, Executive Order 14434, 29 September 2026. https://www.whitehouse.gov/presidential-actions/2026/09/inaugurating-the-era-of-super-intelligence/
5. NVIDIA, *NVIDIA H100 Tensor Core GPU* (product specifications), accessed 20 November 2026. https://www.nvidia.com/en-us/data-center/h100/
6. Office of the Federal Register, document record for *Addressing Remote Access to Advanced Semiconductors* (Docket 261116-0005, RIN 0694-AK50, comments close 19 January 2027), accessed 20 November 2026. https://www.federalregister.gov/documents/2026/11/19/2026-23529/addressing-remote-access-to-advanced-semiconductors

## Methodology note

Research and drafting for this article were AI-assisted, and every quoted phrase, figure, section number and date was checked against the official rule text on 20 November 2026. India's Country Group status was read directly from the current Code of Federal Regulations rather than taken from secondary reporting. The division of 12,000,000 by 4,800 is our own arithmetic on two figures stated in the rule, and is labelled as such in the text; we did not estimate chip counts for any specific product, because the rule requires dense-matrix performance figures that vendors do not always publish. This article is journalism, not legal advice; compliance decisions need a qualified export-control adviser. See our [editorial policy](/editorial-policy/).
