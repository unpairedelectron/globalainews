---
title: "Fine-Tuning vs RAG vs Prompting: How to Choose, and Why OpenAI Is Closing Its Fine-Tuning Door"
seoTitle: "Fine-Tuning vs RAG vs Prompting: How to Choose"
description: "Three ways to make a model fit your task, and they are not interchangeable. What each one actually changes, and why OpenAI's self-serve fine-tuning ends on 6 January 2027."
category: "models"
image: "/images/articles/fine-tuning-vs-rag-vs-prompting/hero.jpg"
imageAlt: "Fine-Tuning vs RAG vs Prompting: How to Choose, and Why OpenAI Is Closing Its Fine-Tuning Door"
tags: ["Fine-tuning", "RAG", "Prompt engineering"]
date: "2026-12-01T07:30:00Z"
takeaways:
  - "Prompting changes the instructions. RAG changes what the model can look up. Fine-tuning changes the model's weights. They solve different problems and are often combined."
  - "RAG is the answer when the issue is missing or changing knowledge. Fine-tuning is the answer when the issue is consistent behaviour, format or tone."
  - "OpenAI is winding down its fine-tuning platform: it is already closed to new users, and eligible existing customers can create training jobs only until 6 January 2027."
  - "The base models that supported OpenAI's supervised fine-tuning are themselves being retired, with gpt-4.1 and gpt-4.1-mini and their fine-tuned versions shutting down on 14 January 2027."
  - "That leaves open-weight models with LoRA or PEFT as the main route to a genuinely custom model, which you can run on hardware you control."
---
## The bottom line

**These three are not competing products. They change different things.** Prompting changes the instructions you send. Retrieval-augmented generation (RAG) changes what the model can look up at the moment it answers. Fine-tuning changes the model's weights.

Most teams reach for the wrong one. The useful rule: if the model does not *know* something, that is a retrieval problem. If the model knows but will not behave — wrong format, wrong tone, inconsistent structure — that is a fine-tuning problem, and often a prompting problem first.

There is also a deadline that changes the practical answer. **OpenAI is winding down its fine-tuning platform.** Its documentation states the platform "is no longer accessible to new users", and that "eligible existing customers can create training jobs until January 6, 2027, unless the base model shuts down earlier". [2] For most teams starting today, hosted fine-tuning at OpenAI is simply not on the table.

## Key facts at a glance

| | |
|---|---|
| Prompting | Changes instructions and examples sent with each request [1] |
| RAG | Combines a pre-trained model's "parametric" memory with an external "non-parametric" index retrieved at query time [4] |
| Fine-tuning | Trains the weights on your own input/output examples [1][2] |
| OpenAI fine-tuning, new users | Closed [2] |
| OpenAI fine-tuning, existing customers | New training jobs until **6 January 2027** [2][3] |
| Fine-tuned model inference | Continues until the base model shuts down [2][3] |
| SFT base models retiring | `gpt-4.1-nano-2025-04-14` shut down 23 October 2026; `gpt-4.1` and `gpt-4.1-mini` and their fine-tuned versions shut down 14 January 2027 [2] |
| Open-weight route | LoRA / PEFT: fine-tune a small number of added parameters [5][6] |

## Prompting: the first thing to try, and often the last thing you need

OpenAI's own guidance puts prompting before fine-tuning, and evaluation before both. Its recommended loop: write evals that measure output and establish a baseline, prompt the model with relevant context and instructions, *then* consider fine-tuning for some use cases, and keep iterating against the evals. [1]

The documentation is blunt that this may be the whole job: "The prompt engineering process may be all you need in order to get great results for your use case." [1]

Its three standing recommendations are to include relevant context the model could not have from training data, give clear goals about the output you want, and provide example outputs — "a process called few-shot learning" — from which the model can extrapolate. [1]

The reason to start here is not purity. It is that prompting is the only one of the three you can change in a minute, and the only one that tells you cheaply whether the task is even well specified.

## RAG: for knowledge the model does not have

RAG comes from a 2020 paper by Patrick Lewis and colleagues at NeurIPS. Its framing is still the clearest statement of the problem it solves. [4]

Large pre-trained models "store factual knowledge in their parameters", the authors note, but "their ability to access and precisely manipulate knowledge is still limited", and "providing provenance for their decisions and updating their world knowledge remain open research problems". [4]

Their fix is to pair two kinds of memory: a pre-trained model (parametric memory) with "a dense vector index of Wikipedia, accessed with a pre-trained neural retriever" (non-parametric memory). [4] In production systems the index is your documents rather than Wikipedia, but the architecture is the same.

Two findings from that paper are worth carrying into any build decision. RAG models set the state of the art on three open-domain question-answering tasks. And for generation, they produced "more specific, diverse and factual language" than a comparable model without retrieval. [4]

Note what RAG gives you that fine-tuning does not: **provenance and freshness.** You can cite the document the answer came from, and you can update the answer by updating the document. Neither is true of knowledge baked into weights. Our explainer on [context windows, memory and RAG](/article/context-window-vs-memory-vs-rag/) covers how the retrieved text actually reaches the model.

## Fine-tuning: for behaviour, not knowledge

Fine-tuning takes a base model and trains it further on examples of the inputs and outputs you expect. [1]

OpenAI's documentation lists four benefits over prompting alone, and they are all about scale and consistency rather than knowledge: [1]

1. You can supply more examples than would fit in a single request's context window.
2. You can then use **shorter prompts**, which "saves on token costs at scale and can be lower latency".
3. You can train on proprietary or sensitive data "without having to include it via examples in every request".
4. You can train "a smaller, cheaper, faster model to excel at a particular task where a larger model is not cost-effective".

Point 2 and point 4 are the real economic case: you pay once in training to stop paying every request in prompt tokens. For anyone working in Indian languages, where the same meaning costs more tokens, that trade can matter more than it does in English — see our explainer on [why Indian languages cost more to process](/article/what-is-a-token-indian-languages-cost-more/).

The tasks OpenAI lists as well suited to supervised fine-tuning are telling: classification, nuanced translation, generating content in a specific format, and correcting instruction-following failures. [1] Not one of them is "knowing more facts".

## What is actually happening to OpenAI fine-tuning

This is the part that changes the decision, and it has dates.

OpenAI says it notified developers on 7 May 2026 of changes to the availability of its self-serve fine-tuning platform. Its published timeline: [3]

| Date | What changed |
|---|---|
| 7 May 2026 | Creating fine-tuning jobs "is not available to organizations that have not previously run fine-tuning" |
| 2 July 2026 | Creating jobs "no longer available to organizations that have not run inference on a fine-tuned model in the past 60 days" |
| 6 January 2027 | "Active existing customers will no longer be able to create new fine-tuning jobs on this date" |

Inference is treated separately: "Inference on fine-tuned models will continue to be available until the base models are deprecated." [3]

But the base models are going too. The supervised fine-tuning guide states that `gpt-4.1-nano-2025-04-14` and its fine-tuned versions shut down on 23 October 2026 — already past — and that `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14` and their fine-tuned versions shut down on 14 January 2027. [2]

Those were the models OpenAI's supervised fine-tuning supported. [1] So this is not only a closed door for new customers; the existing fine-tuned models have a short runway too.

Two related dates are worth noting while you are planning. OpenAI's deprecation table lists the evals dashboard, API and graders becoming read-only on 30 November 2026, with a recommended migration to Promptfoo, and `/v1/prompts` and reusable prompt objects deprecated the same day. [3] If your optimisation loop depends on hosted evals, that loop needs rebuilding.

## What is left if you need a custom model

Fine-tuning as a technique is not going anywhere. What is narrowing is the option to rent it from the largest provider.

The practical route is an open-weight model plus parameter-efficient fine-tuning. Hugging Face's PEFT library exists precisely because full fine-tuning is "prohibitively costly": PEFT methods "only fine-tune a small number of (extra) model parameters - significantly decreasing computational and storage costs - while yielding performance comparable to a fully fine-tuned model". The documentation adds that this "makes it more accessible to train and store large language models (LLMs) and other big models on consumer hardware". [6]

The dominant method is LoRA, from a 2021 paper by Edward Hu and colleagues. It "freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture". [5] The reported numbers explain why it took over: compared with fully fine-tuning GPT-3 175B with Adam, LoRA "can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times", while performing "on-par or better than fine-tuning in model quality" on the models tested, with "no additional inference latency". [5]

Those figures are from the paper's own experiments on RoBERTa, DeBERTa, GPT-2 and GPT-3, not an independent replication. [5] The direction is not seriously disputed, but treat the exact multiples as that paper's results.

For choosing a base model to adapt, see our guide to [hosted APIs versus open-weight models](/reports/hosted-vs-open-weight-models/) and our explainer on [open weights versus open source](/article/open-weights-vs-open-source-ai/) — the licence decides whether you may fine-tune and deploy at all.

## How to choose

Work through it in this order.

**Start with an eval, not a technique.** You cannot tell whether anything improved without a baseline measured on inputs resembling production. OpenAI suggests writing evals even before prompts. [1]

**Is the failure a knowledge failure?** If the model gives confidently wrong or stale answers about your domain, documents or current facts, that is RAG. Fine-tuning on documents is the classic expensive mistake: it teaches style, not recall, and gives you no citation and no way to update a fact. [4]

**Is the failure a behaviour failure?** Wrong format, wrong tone, ignoring instructions, inconsistent structure. Try prompting first, including few-shot examples. [1] If it still fails at scale, that is the fine-tuning case.

**Is the problem cost or latency at volume?** A long prompt repeated millions of times is a running bill. Fine-tuning a smaller model to do one job well is the standard answer. [1]

**Do you need the data to stay in-house?** Then you are looking at open weights and LoRA on infrastructure you control, not a hosted training API. [5][6]

And in practice these combine. A fine-tuned small model with a retrieval step and a short prompt is a common production shape, not a compromise.

## What this means for…

**Indian startups and developers.** If fine-tuning was in your plan via OpenAI, that plan needs revisiting now rather than in January. The open-weight plus LoRA route is more work but removes the vendor-timeline risk entirely, and it runs on hardware you can rent domestically — our coverage of the [IndiaAI GPU tender](/article/indiaai-10000-gpu-tender-explained/) sets out that capacity.

**Teams already running fine-tuned OpenAI models.** Check which base model yours sits on against the shutdown dates, and plan the migration. Inference continuing "until the base models are deprecated" is a shorter promise than it sounds. [2][3]

**Anyone writing an AI roadmap.** The lesson generalises beyond this one wind-down: a capability you rent can be withdrawn on the provider's schedule. Weigh that against the convenience.

## What we don't know yet

- **Whether OpenAI will offer a replacement.** The documentation describes a wind-down and points to prompting and evals, but does not announce a successor for custom-weight training. [1][2][3]
- **What happens to fine-tuned models after 14 January 2027** beyond the stated base-model shutdowns. [2]
- **Whether other hosted providers will keep self-serve fine-tuning.** We could not verify current offerings from other vendors from primary documentation while reporting this piece, so we make no claim about them.
- **How reasoning-model behaviour changes the calculus.** OpenAI now directs new work to its current frontier models with reasoning-effort controls rather than fine-tuning. [1]

## FAQ

### What is the difference between RAG and fine-tuning?

RAG retrieves text at query time and puts it in front of the model, so knowledge stays outside the weights and can be updated and cited. Fine-tuning changes the weights using your examples, which shapes behaviour and format but does not give provenance or easy updates. [2][4]

### Should I fine-tune to teach a model my company's documents?

Usually no. That is a retrieval problem. The 2020 RAG paper's motivation was exactly that updating a model's world knowledge and providing provenance for its answers are hard when knowledge lives only in parameters. [4]

### Can I still fine-tune an OpenAI model?

Only if you are an eligible existing customer, and only until 6 January 2027. OpenAI's documentation says the platform "is no longer accessible to new users". [2][3]

### What replaces hosted fine-tuning?

For a genuinely custom model, an open-weight base plus parameter-efficient fine-tuning. Hugging Face's PEFT library and the LoRA method are the standard tools, and are designed to run on far less hardware than full fine-tuning. [5][6]

### Is prompting enough on its own?

Often, yes. OpenAI's own guidance says prompt engineering "may be all you need in order to get great results for your use case", and recommends trying it, measured against evals, before fine-tuning. [1]

### What is LoRA, in one sentence?

A method that freezes a pre-trained model's weights and trains small added matrices instead, reported to cut trainable parameters by up to 10,000 times versus full fine-tuning with no extra inference latency. [5]

## Sources

**Primary**

1. OpenAI, *Model optimization* (API documentation), accessed 22 November 2026. https://platform.openai.com/docs/guides/model-optimization
2. OpenAI, *Supervised fine-tuning* (API documentation), accessed 22 November 2026. https://developers.openai.com/api/docs/guides/supervised-fine-tuning
3. OpenAI, *Deprecations* — including "Update to OpenAI's self-serve fine-tuning", accessed 22 November 2026. https://developers.openai.com/api/docs/deprecations
4. Lewis, Perez, Piktus, Petroni, Karpukhin et al., *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*, arXiv:2005.11401, May 2020 (revised April 2021; NeurIPS 2020). https://arxiv.org/abs/2005.11401
5. Hu, Shen, Wallis, Allen-Zhu, Li, Wang, Wang and Chen, *LoRA: Low-Rank Adaptation of Large Language Models*, arXiv:2106.09685, June 2021 (revised October 2021). https://arxiv.org/abs/2106.09685
6. Hugging Face, *PEFT* (library documentation), accessed 22 November 2026. https://huggingface.co/docs/peft/en/index

## Methodology note

Research and drafting for this explainer were AI-assisted, and every quoted phrase, date and figure was checked against the vendor documentation and papers above on 22 November 2026. The fine-tuning wind-down dates are quoted from OpenAI's own documentation and deprecation timeline rather than from secondary reporting. The LoRA parameter and memory figures are the results reported in that paper's own experiments, not an independent replication, and are attributed as such. We deliberately make no claim about other vendors' current fine-tuning offerings, because we could not verify them from primary documentation while reporting this piece. See our [editorial policy](/editorial-policy/).
