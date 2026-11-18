---
title: "Microsoft Built Its New Production Model on Google's Gemma, and Will License Its Own Weights. Why That Matters"
seoTitle: "Microsoft's Gemma-Based Model and MAI Licensed Weights"
description: "At Ignite 2026 Microsoft said its Decision-1.1 model is built on Google's open-weight Gemma 4, and announced MAI Licensed Weights for trusted customers. What both moves signal."
category: "business"
image: "/images/articles/microsoft-mai-licensed-weights-gemma-base/hero.jpg"
imageAlt: "Microsoft Built Its New Production Model on Google's Gemma, and Will License Its Own Weights. Why That Matters"
tags: ["Microsoft", "Open-weight models", "Gemma"]
date: "2026-11-27T07:30:00Z"
takeaways:
  - "At Ignite on 17 November 2026, Microsoft said Microsoft-Decision-1.1, now generally available, is built on a new base: Google's Gemma 4 26B A4B."
  - "Microsoft also announced MAI Licensed Weights, which it says will let trusted customers get access to its own model weights through its Frontier offering."
  - "Both moves point the same way: open-weight models are moving from experiments into the production stacks of the largest vendors."
  - "Microsoft says Decision-1.1 scores 68 on the Artificial Analysis Decision Index v2.1 and is more than twice as fast as its predecessor. Those are Microsoft's own reported figures."
  - "Gemma's terms are a custom licence with distribution conditions, not a standard open-source licence, so building on it carries obligations."
---
## The bottom line

**One of the clearest signals from Microsoft's Ignite conference was not a new frontier model. It was what sits underneath one.** Microsoft said that Microsoft-Decision-1.1, a model now generally available and already used to route requests inside Copilot, is "built on a new base, Gemma 4 26B A4B". [2] Gemma is Google's family of open-weight models. [3]

In the same keynote, Satya Nadella announced the reverse direction too: "We are announcing MAI Licensed Weights, meaning our trusted customers will now be able to get access to Microsoft AI model weights through our Frontier Co." [1]

Taken together, these are two sides of the same shift. A company that sells access to frontier models is building production systems on a competitor's open weights, and preparing to hand its own weights to customers. Open weights have stopped being a hobbyist concern.

## Key facts at a glance

| | |
|---|---|
| Announced | Ignite, 17 November 2026 [1][2] |
| Microsoft-Decision-1.1 | Generally available; built on Gemma 4 26B A4B; adds image inputs [2] |
| Where it runs | Microsoft Foundry, OpenRouter and Vercel [2] |
| Reported score | 68 on the Artificial Analysis Decision Index v2.1, up six points [2] |
| MAI Licensed Weights | Announced; weights access for "trusted customers" through Frontier [1] |
| Other new MAI models | MAI-Code-2 and MAI-Code-2-Flash (coding), MAI-Image-2.7 and 2.7-Flash (images), MAI-Cyber-2-Flash (security) [2] |
| Gemma 4 26B A4B | A 26-billion-parameter mixture-of-experts model in Google's Gemma 4 family [3] |

## What Microsoft-Decision-1.1 actually does

It is not a chatbot. Microsoft describes it as "purpose-built for structured decisions such as routing, classification, prioritization, verification and workflow control". [2] It picks among permitted actions inside developer-defined constraints and returns "calibrated confidence scores, allowing applications to defer when uncertainty is high". [2]

The point is economics. Microsoft frames it as handling "frequent, small agent decisions in real time… so frontier models can focus on deeper reasoning". [2] In Copilot, it decides whether a request is best handled by Copilot or Cowork. [2]

Microsoft says the 1.1 release scores 68 on the Artificial Analysis Decision Index v2.1, six points above the first version, ahead of Google's Gemini-Decision-1 and OpenAI's GPT-6 Luna (Decisions), and is "more than twice as fast" as its predecessor. [2] These are Microsoft's own reported numbers, on a third-party index; we have not seen an independent run.

## Why building on Gemma is notable

Microsoft sells access to its own MAI models and to OpenAI's. For a production model embedded in Copilot's routing, it chose a Google open-weight base. [2]

That is a practical endorsement of what open weights are for. You can take the weights, adapt them for a narrow task, and run the result in your own stack at your own cost. The alternative, calling someone else's API for every small routing decision, is slower and more expensive at scale.

It is also a reminder that "open weights" is not the same as "open source". Gemma is distributed under Google's own terms, which include a section headed "Distribution and Restrictions" governing the use, reproduction, distribution and modification of Gemma and of "Model Derivatives", including through a hosted service. [4] Anyone building on it inherits those conditions. Our explainer on [open weights versus open source](/article/open-weights-vs-open-source-ai/) sets out the distinction, and our guide to [hosted APIs versus open-weight models](/reports/hosted-vs-open-weight-models/) covers the trade-offs.

## What MAI Licensed Weights could mean

Microsoft's announcement is brief. Nadella said trusted customers "will now be able to get access to Microsoft AI model weights through our Frontier Co". [1] Neither the keynote nor the Book of News sets out which models, what the licence allows, what "trusted" means, or when this starts. [1][2]

If it means what it appears to, customers in regulated sectors could run Microsoft's models inside their own infrastructure rather than calling a hosted API. That is the same demand that drives interest in on-premises deployment in India: data that cannot leave the building, and workloads where per-call pricing does not fit.

For now it is an announcement, not a published programme.

## The rest of the model news

Microsoft also introduced, per its Book of News: [2]

- **MAI-Code-2** for "demanding agentic coding work" and **MAI-Code-2-Flash** for "high-volume, everyday coding". Both are generally available in GitHub; Code-2-Flash is in private preview in Foundry.
- **MAI-Image-2.7** and **MAI-Image-2.7-Flash**, in preview.
- **MAI-Cyber-2-Flash**, purpose-built for cybersecurity, in preview in one product only.

Nadella's framing for the family: models that are "compute-efficient when it comes to pre-training and token-efficient when it comes to product deployment". [1]

## What this means for…

**Developers and startups, including in India.** The cheapest intelligence for a task is often not the biggest model. Microsoft's own routing stack now uses a small open-weight-based model for the frequent decisions and saves the expensive models for hard reasoning. That pattern is available to anyone.

**Enterprises.** If MAI Licensed Weights becomes a real programme, running a major vendor's model on your own infrastructure becomes a live option. Wait for the licence terms before planning around it.

**Everyone watching the open-weights debate.** The question is no longer whether open weights are serious. It is what the licences attached to them permit. Read the terms, not the label.

## What we don't know yet

- **The MAI Licensed Weights terms.** Which models, which customers, what the licence allows, and when. [1]
- **How Decision-1.1 was adapted** from Gemma 4, and what Microsoft changed. [2]
- **Independent benchmarks.** The Decision Index figures are Microsoft's own reported results. [2]
- **Pricing for the new MAI models**, which the Book of News does not state. [2]

## FAQ

### What is Microsoft-Decision-1.1?

A small, fast model for structured decisions such as routing, classification and verification, now generally available in Microsoft Foundry, OpenRouter and Vercel. [2]

### Is Microsoft-Decision-1.1 really built on Google's model?

Microsoft's Book of News says it is "built on a new base, Gemma 4 26B A4B". [2] Gemma 4 is Google's open-weight family, and the 26B A4B is its mixture-of-experts model. [3]

### What are MAI Licensed Weights?

An announcement that trusted customers will be able to access Microsoft's model weights through its Frontier offering. Microsoft has not yet published the terms or scope. [1]

### Does using Gemma mean Microsoft can do anything it likes with it?

No. Gemma is released under Google's own terms, which include restrictions on distribution and on model derivatives, including via hosted services. [4]

### What other models did Microsoft announce at Ignite?

MAI-Code-2 and MAI-Code-2-Flash for coding, MAI-Image-2.7 and MAI-Image-2.7-Flash for images, and MAI-Cyber-2-Flash for security, alongside the generally available Microsoft-Decision-1.1. [2]

## Sources

**Primary**

1. Microsoft (Satya Nadella), *Ignite 2026: Building the frontier ecosystem* (edited keynote remarks), 17 November 2026. https://blogs.microsoft.com/blog/2026/11/17/ignite-2026-building-the-frontier-ecosystem/
2. Microsoft, *Microsoft Ignite 2026 Book of News*, accessed 18 November 2026. https://news.microsoft.com/events/ignite/2026/book-of-news/
3. Google, *Gemma 4 model overview*, accessed 18 November 2026. https://ai.google.dev/gemma/docs/core
4. Google, *Gemma Terms of Use*, accessed 18 November 2026. https://ai.google.dev/gemma/terms

## Methodology note

Research and drafting for this article were AI-assisted, and every quote and figure was checked against the sources above on 18 November 2026. Performance figures are Microsoft's own reported results and are attributed as such; we did not run independent tests. See our [editorial policy](/editorial-policy/).
