---
title: "Mistral Small 4 Explained: Why “6.5B Active Parameters” Isn’t Its Real Size"
seoTitle: "Mistral Small 4: Active vs Total Parameters Explained"
description: "Mistral Small 4 has 119 billion parameters but uses about 6.5 billion per token. What that means for hardware, cost and speed, and why it still needs data-centre GPUs."
category: "models"
tags: ["Mistral","Open-weight models","Small models"]
date: "2026-09-08"
updated: "2026-11-12"
image: "/images/articles/small-models-serious-workflows/hero-1024.webp"
imageAlt: "Model specifications displayed beside a system deployment checklist"
takeaways:
  - "Mistral Small 4 is a mixture-of-experts model with 119 billion total parameters; 4 of its 128 experts run for each token, about 6.5 billion active parameters."
  - "Active parameters drive speed and compute per token; total parameters drive memory. Every expert has to be loaded, so the full weights on Hugging Face take about 242 GB."
  - "Mistral’s stated minimum hardware is 4 NVIDIA HGX H100, 2 HGX H200 or 1 DGX B200. Despite the name, it is not a laptop model."
  - "It is released under Apache 2.0, accepts text and images, has a 256k context window, and lets you switch reasoning on or off per request."
---
## The bottom line

**Mistral Small 4 is “small” only in the work it does per word, not in its size.** It is a mixture-of-experts model with 119 billion parameters in total, but it routes each token through just 4 of its 128 experts, so only about 6.5 billion parameters do the work at any moment. [1][2][3]

That makes it fast and cheap to run per token for its size. But all 119 billion parameters still have to sit in memory. The full weights on Hugging Face take about 242 GB, and Mistral’s own minimum hardware is four NVIDIA H100 systems, two H200 systems or one B200 system. [2][3][4] If you read “6.5B active” as “runs like a 6.5B model on a laptop”, you will be wrong.

## Key facts at a glance

| | |
|---|---|
| Released | 16 March 2026 [1][2] |
| Licence | Apache 2.0 [1][2][3] |
| Architecture | Mixture of experts: 128 experts, 4 active per token [2][3] |
| Total parameters | 119 billion [1][2][3] |
| Active parameters | 6.5 billion per token (model card); Mistral’s launch post says 6 billion, or 8 billion including embedding and output layers [1][2][3] |
| Context window | 256k tokens [1][2][3] |
| Inputs | Text and images; text output [2][3] |
| Weights on Hugging Face | About 242 GB (mostly 8-bit FP8); a 4-bit NVFP4 version is about 71 GB [4] |
| Minimum hardware (Mistral) | 4× NVIDIA HGX H100, 2× HGX H200 or 1× DGX B200 [2] |
| API price | $0.15 per million input tokens, $0.60 per million output tokens [1] |

## What “active parameters” actually means

A conventional “dense” model uses every parameter for every token. A **mixture-of-experts (MoE)** model splits much of the network into many smaller “experts” and uses a router to pick a few for each token. Mistral Small 4 has 128 experts and activates 4 of them per token. [2][3]

That design gives two different size numbers, and they answer different questions:

| Question | Number that answers it |
|---|---|
| How much compute does each token take? | Active parameters (about 6.5B) |
| How much memory do I need to load the model? | Total parameters (119B) |

The router can choose any expert for the next token, so a server can’t keep only the active ones in memory. The whole model has to be loaded. That is why the published weights take about 242 GB even though each token uses a small fraction of them. [4]

Mistral’s own figures differ slightly. The model card and Hugging Face page give 6.5 billion active parameters. The launch post gives 6 billion, or 8 billion counting the embedding and output layers. [1][2][3] The point stands either way: the active figure is a small share of the 119 billion total.

## So what hardware does it need?

Mistral answers this directly. Its stated **minimum** infrastructure is 4× NVIDIA HGX H100, 2× HGX H200 or 1× DGX B200. The recommended setup is 4× H100, 4× H200 or 2× B200 for optimal performance. [2] Those are data-centre systems.

Quantisation helps but doesn’t change the picture. Mistral publishes a 4-bit NVFP4 checkpoint for lower-precision serving, and its weight files total about 71 GB on Hugging Face. [3][4] That is still beyond a typical laptop.

The model card’s example vLLM command serves the model across two GPUs (`--tensor-parallel-size 2`) with the full 262,144-token context. [3] The model is supported in vLLM, llama.cpp, SGLang and Transformers, according to Mistral. [2]

For most teams, the practical choice is between Mistral’s API, at $0.15 per million input tokens and $0.60 per million output tokens, and self-hosting on rented data-centre GPUs. [1] Our guide to [hosted APIs versus open-weight models](/reports/hosted-vs-open-weight-models/) walks through that trade-off.

## What Small 4 is designed to do

Mistral calls Small 4 the first of its models to combine its reasoning (Magistral), multimodal (Pixtral) and agentic coding (Devstral) lines in one model. [2]

- **Reasoning on demand.** A per-request `reasoning_effort` setting switches between `"none"` for fast replies in the style of Mistral Small 3.2, and `"high"` for step-by-step reasoning similar to its Magistral models. [2][3]
- **Images as input.** It accepts text and images and returns text. [2][3]
- **Tools and agents.** The API supports function calling, structured outputs and Mistral’s agents endpoints. [1]

Mistral says Small 4 cut end-to-end completion time by 40% in a latency-optimised setup, and handled 3 times as many requests per second as Mistral Small 3 in a throughput-optimised setup. It also says that with reasoning on, Small 4 matches or beats GPT-OSS 120B on three benchmarks while producing shorter answers. [2] These are Mistral’s own measurements, and we have not seen an independent test.

## What this means for…

**Developers.** Treat “6.5B active” as a speed and cost signal, not a memory budget. Size your hardware from the full weights, and test with your real prompts, context lengths and concurrency before committing. If you plan to use the model inside an [AI agent](/article/what-is-an-ai-agent/), check tool-calling quality on your own tasks.

**Businesses, including in India.** The Apache 2.0 licence allows commercial use and fine-tuning, and self-hosting can keep data on your own infrastructure. [3] But the minimum hardware means self-hosting is a data-centre decision, not a laptop experiment.

**Anyone comparing models.** “Small”, “mini” and “lite” are product names, not hardware specifications. Always check total parameters and file sizes alongside the active count.

## FAQ

### How big is Mistral Small 4?

It has 119 billion parameters in total, and uses about 6.5 billion of them for each token. Its full weights on Hugging Face take about 242 GB. [3][4]

### Can I run Mistral Small 4 on a laptop?

Not realistically. Mistral’s minimum hardware is four NVIDIA H100 systems, two H200 systems or one B200 system, and even the 4-bit version of the weights is about 71 GB. [2][4]

### What is the difference between active and total parameters?

Active parameters are the ones used to process each token, which sets compute and speed. Total parameters are everything the model contains, which sets how much memory you need, because all the experts must be loaded. [2][3]

### Is Mistral Small 4 open source?

Its weights are released under the Apache 2.0 licence, which allows commercial and non-commercial use. [3] For the difference between open weights and fully open-source AI, see our explainer on that topic.

### Does Mistral Small 4 support images?

Yes. It accepts text and image inputs and produces text. [2][3]

### How much does the Mistral Small 4 API cost?

Mistral lists $0.15 per million input tokens and $0.60 per million output tokens. [1]

## Sources

**Primary**

1. Mistral AI, *Mistral Small 4 model card* (Mistral Docs), released 16 March 2026, accessed 12 November 2026. https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03
2. Mistral AI, *Introducing Mistral Small 4*, 16 March 2026. https://mistral.ai/news/mistral-small-4
3. Mistral AI, *Mistral Small 4 119B A6B* (Hugging Face model card), accessed 12 November 2026. https://huggingface.co/mistralai/Mistral-Small-4-119B-2603
4. Hugging Face, file listings for `mistralai/Mistral-Small-4-119B-2603` and `mistralai/Mistral-Small-4-119B-2603-NVFP4` (model API), accessed 12 November 2026. https://huggingface.co/api/models/mistralai/Mistral-Small-4-119B-2603

## Methodology note

This article was first published in September 2026 and substantially updated on 12 November 2026. Research and drafting were AI-assisted, and every figure was checked against the sources above. Weight sizes are the sum of the published `.safetensors` files and are rounded. See our [editorial policy](/editorial-policy/).

## Update

**12 November 2026:** We rewrote this article from Mistral’s launch post and Hugging Face model card, in addition to the original model card. New: the 128-expert design, Mistral’s minimum and recommended hardware, published weight sizes, the reasoning and image features, API prices and an FAQ. We also note that Mistral’s launch post gives 6B active parameters while its model cards give 6.5B. The earlier version said the sources gave no hardware figures; Mistral’s launch post does.
