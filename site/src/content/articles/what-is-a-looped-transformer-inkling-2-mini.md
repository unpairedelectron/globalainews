---
title: "What Is a Looped Transformer? Inkling 2 Mini Reuses 24 Layers to Act Like 48"
seoTitle: "What Is a Looped Transformer? Inkling 2 Mini"
description: "Thinking Machines' new open-weight model runs its middle layers three times to act bigger than it is. What looping buys, what it costs, and how to run it on a 32GB machine."
category: "models"
image: "/images/articles/what-is-a-looped-transformer-inkling-2-mini/hero.jpg"
imageAlt: "What Is a Looped Transformer? Inkling 2 Mini Reuses 24 Layers to Act Like 48"
tags: ["Open-weight models", "Model architecture", "Local AI"]
date: "2026-12-02T07:30:00Z"
takeaways:
  - "Inkling 2 Mini, released on 20 November 2026 under Apache 2.0, is a 26.4B-parameter multimodal mixture-of-experts model with 3.4B active parameters per token."
  - "Its middle 12 layers run three times with shared weights, so a 24-layer model performs 48 layer applications per token — the defining trick of a looped transformer."
  - "Looping buys compute per token rather than memory: the weights are stored once, so the checkpoint stays about 20GB while each token gets more processing."
  - "Thinking Machines says it runs on a single NVIDIA DGX Spark, or Apple silicon with 32GB or more of memory, which puts a capable multimodal model on hardware a small team can own."
  - "The model card is unusually candid about the cost: it warns the model can get stuck in long reasoning loops and may take destructive actions when using tools."
---
## The bottom line

**Most ways to make a model smarter cost memory. Looping costs time instead.**

Thinking Machines Lab released Inkling 2 Mini on 20 November 2026 under the Apache 2.0 licence. [1] It is a multimodal mixture-of-experts model with 26.4 billion total parameters and 3.4 billion active per token. [1]

The interesting part is what happens between those two numbers. The model has 24 layers, but the middle 12 of them run **three times each**, reusing the same weights. The card states it plainly: that gives "48 layer applications per token from 24 layers of weights". [1]

Hugging Face's engineering write-up describes the same idea in one line: "some layers are visited in a loop that repeats three times, which makes it work like it had more parameters". [2]

For anyone choosing a model to run on their own hardware, this matters more than a benchmark score. It is a design that deliberately trades latency for capability so the file on disk stays small.

## Key facts at a glance

| | |
|---|---|
| Model | Inkling 2 Mini, Thinking Machines Lab, Inc. [1] |
| Released | 20 November 2026 [1] |
| Licence | Apache 2.0 [1][4] |
| Type | Multimodal autoregressive looped transformer [1] |
| Parameters | 26.4B total, 3.4B active; about 5.4B *effective* active per token [1] |
| Layers | 24, with the middle 12 run three times — 48 layer applications per token [1] |
| Experts | Each token routed to 8 of 128 [1] |
| Context | Up to 1M tokens [1] |
| Inputs | Text and images (40px–4096px per dimension) [1] |
| Checkpoint | About 20GB, mixed NVFP4 and MXFP8 precision [1][2] |
| Runs on | 1× NVIDIA DGX Spark; Apple silicon with 32GB+ memory; GPUs with 32GB+ VRAM recommended [1] |

## What looping actually does

A standard transformer stacks layers. Each layer has its own weights, and a token passes through each one once. More layers means more processing per token — and more memory, because every layer's weights must be stored.

A looped transformer breaks that link. Inkling 2 Mini is "a 24-layer decoder-only transformer with sparse Mixture-of-Experts (MoE) feed-forward layers", in which "the middle 12 layers run three times with shared weights". [1]

The weights for those 12 layers are stored **once** and used **three times**. So the model gets the processing depth of a much deeper network while paying the memory cost of a shallower one.

What you pay instead is compute at inference. Three passes through twelve layers is three times the work of one pass, for every token. Looping does not make the model free; it moves the cost from the thing that is scarce on a laptop (memory) to the thing that is merely annoying (time).

## The parameter arithmetic, carefully

This model has three different parameter numbers, and conflating them is the easiest mistake to make.

- **26.4B total.** What you store. This is why the checkpoint is about 20GB at mixed precision. [1][2]
- **3.4B active.** What a standard mixture-of-experts count would report: each token is routed to 8 of 128 experts. [1]
- **About 5.4B effective active.** The card explains that "each extra pass through the looped layers adds about 1.0B effective active parameters. Since the model runs with three passes, there are 5.4B effective active parameters per token." [1]

That third number is the one describing how much computation each token actually receives. It has no equivalent in a conventional model, which is precisely why comparing architectures by parameter count alone has become unreliable. Our explainer on [small models and active parameters](/article/small-models-serious-workflows/) covers the total-versus-active distinction that applies to any mixture-of-experts model; looping adds a third term on top.

Hugging Face's post, incidentally, rounds the active figure to "3B active parameters per token" where the model card gives 3.4B. [1][2] A small discrepancy, and a reminder to take the primary card over a summary.

## What it costs, in the vendor's own words

The model card's limitations section is more forthcoming than most, and it is the most useful part of the release for anyone planning to deploy. All four of these are Thinking Machines' own statements. [1]

- **Factual recall.** It is "less capable than Inkling 2 Small across most of our evaluations, with the largest gaps on factual recall and knowledge-heavy questions", and "more likely than larger models to state incorrect information with confidence".
- **Repetitive reasoning.** In internal testing the model "sometimes became stuck in long reasoning loops, or repeatedly re-checked its own work without making progress, particularly when debugging code". The recommendation is to set limits on output tokens and agent turns.
- **Agentic reliability.** When using tools it "may take destructive actions, such as deleting or overwriting files, without confirmation, and may not report the outcome of its work accurately".
- **Languages other than English.** Output quality "can be lower outside English". In Chinese testing they observed "clipped phrasing and mixed languages".

Take the third one seriously before pointing this model at a filesystem. And note the fourth if you are working in Indian languages: the card claims English plus "general multilingual support" [1], with no per-language evaluation published, so test on your own language rather than assuming.

The second point deserves a note. A model whose architecture loops its layers is also reported to get stuck in reasoning loops. The card gives no causal link between the two, and we are not asserting one — but the practical advice stands either way: cap the output tokens.

## How people are actually running it

Here is a detail the announcement does not tell you, visible only in the download numbers.

Hugging Face's own repository data, checked on 23 November 2026, shows the official Thinking Machines checkpoint at **23,543 downloads** with 5,053 likes. Community quantised conversions, published three days after the repository was created, are far ahead: `unsloth/Inkling-2-Mini-GGUF` at **805,993 downloads**, and `ggml-org/Inkling-2-Mini-GGUF` at **209,096**. [3]

That is roughly thirty-four times the official repository for a single community build. Those counts measure repository downloads rather than distinct users, and a GGUF repository holds several quantisation variants, so treat them as a signal of where attention went rather than a precise user count. The signal is still clear: for a model designed to run locally, most people reach for the 4-bit or 8-bit community conversion, not the original weights.

Hugging Face provides GGUF 4-bit (`IQ4_NL`) and 8-bit (`Q8_0`) builds, and notes that MLX can use the original checkpoint directly, "without reconversion: you get the original quality the authors intended". [2] On Apple silicon, that is the route that preserves what the authors shipped.

## Why Apache 2.0 matters here

The licence is Apache 2.0, with the licence link given on the card. [1][4] That grants a copyright licence to reproduce and prepare derivative works, and a patent licence, while not granting rights in the licensor's trademarks. [4]

In practice it permits commercial use, fine-tuning and redistribution — which is exactly why the ecosystem of quantised rebuilds appeared within three days. The card also points to a separate Model Acceptable Use Policy. [1] As always the licence text, not the "open" label, decides what you may do; see our explainer on [open weights versus open source](/article/open-weights-vs-open-source-ai/).

## What this means for…

**Indian developers and small teams.** This is the most consequential line in the release: a capable multimodal model with a 1M-token context that runs on Apple silicon with 32GB of memory, or one GPU with 32GB of VRAM. [1] That is a machine a two-person team can buy, not a cluster to rent. The trade is latency, because every token is processed three times through half the stack.

**Anyone comparing models on parameter count.** Stop. Inkling 2 Mini reports 26.4B total, 3.4B active and about 5.4B effective active, and all three are honest numbers describing different things. [1] Read the architecture section, as our [guide to reading a model card](/article/how-to-read-an-ai-model-card/) sets out.

**Teams running agents.** The card's warning about destructive tool actions without confirmation is not boilerplate; it is a specific, disclosed behaviour. Sandbox it.

## What we don't know yet

- **Independent benchmarks.** The evaluation table is Thinking Machines' own reporting, including the comparisons against Gemma 4 31B, Qwen3.8-27B and [Nemotron 3.5 Super VL](/article/nvidia-nemotron-for-science-explained/). We have not seen an independent run. [1]
- **Real-world latency on the named hardware.** The card states what the model runs on, not how fast. [1]
- **How looping affects quality versus simply adding layers.** The card describes the design but publishes no ablation isolating the loop's contribution. [1]
- **Indian-language performance.** No per-language evaluation is published beyond a general multilingual claim and a specific caution about Chinese. [1]

## FAQ

### What is a looped transformer?

A transformer where some layers are run more than once on the same token, reusing the same weights. Inkling 2 Mini runs its middle 12 layers three times, giving 48 layer applications per token from 24 layers of stored weights. [1][2]

### Does looping make the model bigger?

No. It stores the looped layers' weights once, so memory is unchanged. What increases is computation per token, and therefore latency. [1]

### How many parameters does Inkling 2 Mini have?

26.4B total and 3.4B active per token, with about 5.4B effective active once the three looped passes are counted. [1]

### Can I run it on a laptop?

Thinking Machines lists Apple silicon devices with 32GB or more of memory, a single NVIDIA DGX Spark, and other GPUs with 32GB+ VRAM recommended. The checkpoint is about 20GB. [1]

### Is it really open?

The weights are released under Apache 2.0, which permits commercial use, modification and redistribution, and the card also references a Model Acceptable Use Policy. [1][4]

### What are its main weaknesses?

Per its own card: weaker factual recall than larger models, a tendency to get stuck in long reasoning loops when debugging code, unreliable tool use that may delete or overwrite files without confirmation, and lower output quality outside English. [1]

## Sources

**Primary**

1. Thinking Machines Lab, *Inkling 2 Mini* (model card), released 20 November 2026, accessed 23 November 2026. https://huggingface.co/thinkingmachines/Inkling-2-Mini
2. Hugging Face, *Inkling 2 Mini* (engineering blog post), accessed 23 November 2026. https://huggingface.co/blog/inkling2mini
3. Hugging Face, repository metadata for `thinkingmachines/Inkling-2-Mini`, `unsloth/Inkling-2-Mini-GGUF` and `ggml-org/Inkling-2-Mini-GGUF` (download and like counts as reported on 23 November 2026). https://huggingface.co/models?search=Inkling-2-Mini
4. The Apache Software Foundation, *Apache License, Version 2.0*. https://www.apache.org/licenses/LICENSE-2.0

## Methodology note

Research and drafting for this article were AI-assisted, and every quoted phrase, figure and date was checked against the model card and the sources above on 23 November 2026. Parameter counts, hardware requirements and the limitations are quoted from Thinking Machines' own model card and are its claims, not independently verified; we did not run the model or reproduce any benchmark. Download counts are Hugging Face's reported repository figures on the date checked, which count repository downloads rather than distinct users. Where the model card and Hugging Face's blog post differ on the active-parameter figure, we follow the card. See our [editorial policy](/editorial-policy/).
