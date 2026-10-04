Source: https://ai.google.dev/gemma/docs/core
Title: Gemma 4 model overview  |  Google AI for Developers
Fetched: 2026-10-04T09:50:21.050Z

[Skip to main content](https://ai.google.dev/gemma/docs/core#main-content)

[![Google AI for Developers](https://www.gstatic.com/devrel-devsite/prod/vfdb441d2e08dbd9d3e48d8cd72b242388a87bcf7626bf5fb9df50c2bdd4a70fd/googledevai/images/lockup-new.svg)](https://ai.google.dev/)

`/`

Language

- [English](https://ai.google.dev/gemma/docs/core)
- [Deutsch](https://ai.google.dev/gemma/docs/core?hl=de)
- [Español – América Latina](https://ai.google.dev/gemma/docs/core?hl=es-419)
- [Français](https://ai.google.dev/gemma/docs/core?hl=fr)
- [Indonesia](https://ai.google.dev/gemma/docs/core?hl=id)
- [Italiano](https://ai.google.dev/gemma/docs/core?hl=it)
- [Polski](https://ai.google.dev/gemma/docs/core?hl=pl)
- [Português – Brasil](https://ai.google.dev/gemma/docs/core?hl=pt-br)
- [Shqip](https://ai.google.dev/gemma/docs/core?hl=sq)
- [Tiếng Việt](https://ai.google.dev/gemma/docs/core?hl=vi)
- [Türkçe](https://ai.google.dev/gemma/docs/core?hl=tr)
- [Русский](https://ai.google.dev/gemma/docs/core?hl=ru)
- [עברית](https://ai.google.dev/gemma/docs/core?hl=he)
- [العربيّة](https://ai.google.dev/gemma/docs/core?hl=ar)
- [فارسی](https://ai.google.dev/gemma/docs/core?hl=fa)
- [हिंदी](https://ai.google.dev/gemma/docs/core?hl=hi)
- [বাংলা](https://ai.google.dev/gemma/docs/core?hl=bn)
- [ภาษาไทย](https://ai.google.dev/gemma/docs/core?hl=th)
- [中文 – 简体](https://ai.google.dev/gemma/docs/core?hl=zh-cn)
- [中文 – 繁體](https://ai.google.dev/gemma/docs/core?hl=zh-tw)
- [日本語](https://ai.google.dev/gemma/docs/core?hl=ja)
- [한국어](https://ai.google.dev/gemma/docs/core?hl=ko)

[Sign in](https://ai.google.dev/_d/signin?continue=https%3A%2F%2Fai.google.dev%2Fgemma%2Fdocs%2Fcore&prompt=select_account)

- [Gemma](https://ai.google.dev/gemma)

- On this page
- [Capabilities](https://ai.google.dev/gemma/docs/core#capabilities)
- [Parameter sizes and quantization](https://ai.google.dev/gemma/docs/core#parameter-sizes-and-quantization)
  - [Gemma 4 Inference Memory Requirements](https://ai.google.dev/gemma/docs/core#gemma-4-inference-memory-requirements)
  - [Key Considerations for Memory Planning](https://ai.google.dev/gemma/docs/core#key-considerations-for-memory-planning)
  - [Quantization-Aware Training (QAT)](https://ai.google.dev/gemma/docs/core#qat)
- [Previous Gemma models](https://ai.google.dev/gemma/docs/core#previous-models)

**Gemma 4** released with text, audio and image input and long up to 256K context window! [**Learn more**](https://ai.google.dev/gemma/docs/core)

- [Home](https://ai.google.dev/)
- [Gemma](https://ai.google.dev/gemma)
- [Models](https://deepmind.google/models/gemma)
- [Docs](https://ai.google.dev/gemma/docs)

Was this helpful?



 Send feedback



# Gemma 4 model overview

- On this page
- [Capabilities](https://ai.google.dev/gemma/docs/core#capabilities)
- [Parameter sizes and quantization](https://ai.google.dev/gemma/docs/core#parameter-sizes-and-quantization)
  - [Gemma 4 Inference Memory Requirements](https://ai.google.dev/gemma/docs/core#gemma-4-inference-memory-requirements)
  - [Key Considerations for Memory Planning](https://ai.google.dev/gemma/docs/core#key-considerations-for-memory-planning)
  - [Quantization-Aware Training (QAT)](https://ai.google.dev/gemma/docs/core#qat)
- [Previous Gemma models](https://ai.google.dev/gemma/docs/core#previous-models)

What’s new in Gemma 4 - YouTube

Tap to unmute

[What’s new in Gemma 4](https://www.youtube.com/watch?v=jZVBoFOJK-Q) [Google for Developers](https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw)

Google for Developers2.68M subscribers

[Watch on](https://www.youtube.com/watch?v=jZVBoFOJK-Q)

Gemma is a family of generative artificial intelligence models and you can
use them in a wide variety of generation tasks, including question answering,
summarization, and reasoning. Gemma models are provided with open weights and
permit responsible
[commercial use](https://ai.google.dev/gemma/terms),
allowing you to tune and deploy them in your own projects and applications.

Gemma 4 model family spans four distinct architectures tailored for specific
hardware requirements:

- **Small Sizes:** 2B and 4B effective parameter models built for
ultra-mobile, edge, and browser deployment (e.g., Pixel, Chrome).
- **Dense:** A powerful 31B parameter dense model that bridges the gap between
server-grade performance and local execution.
- **Mixture-of-Experts:** A highly efficient 26B MoE model designed for
high-throughput, advanced reasoning.
- **Unified:** A 12B parameter encoder free model for multimodal tasks,
replaced vision and audio encoders with direct linear projections of the
input.

You can download Gemma 4 models from
[Kaggle](https://www.kaggle.com/models?query=gemma-4&publisher=google) and
[Hugging Face](https://huggingface.co/collections/google/gemma-4).
For more technical details on Gemma 4, see the
[Model Card](https://ai.google.dev/gemma/docs/core/model_card_4) and
[Technical Report](https://goo.gle/Gemma4Report).
Earlier versions of Gemma core models are also available for download. For more
information, see [Previous Gemma models](https://ai.google.dev/gemma/docs/core#previous-models).

[Get it on Kaggle](https://www.kaggle.com/models?query=gemma-4&publisher=google) [Get it on Hugging Face](https://huggingface.co/collections/google/gemma-4)

## Capabilities

- **Reasoning:** All models in the family are designed as highly capable
reasoners, with configurable [thinking\\
modes](https://ai.google.dev/gemma/docs/capabilities/thinking).
- **Extended Multimodalities:** Processes Text,
[Image](https://ai.google.dev/gemma/docs/capabilities/vision/image) with variable aspect ratio
and resolution support (all models),
[Video](https://ai.google.dev/gemma/docs/capabilities/vision/video), and
[Audio](https://ai.google.dev/gemma/docs/capabilities/audio) (featured natively on the E2B, E4B
and 12B models).
- **Increased Context Window:** Small models feature a 128K context window,
while the medium models support 256K.
- **Enhanced Coding & Agentic Capabilities:** Achieves notable improvements in
coding benchmarks alongside built-in [function-calling\\
support](https://ai.google.dev/gemma/docs/capabilities/text/function-calling-gemma4), powering
highly capable autonomous agents.
- **Native System Prompt Support:** Gemma 4 introduces built-in support for
the system role, enabling more structured and controllable conversations.
- **[Multi-Token Prediction](https://ai.google.dev/gemma/docs/mtp/overview):** All Gemma 4 models
(E2B, E4B, 12B, 31B, and 26B A4B) include a dedicated draft model for
speculative decoding, enabling significantly faster inference with no
quality loss.

## Parameter sizes and quantization

Gemma 4 models are available in 5 parameter sizes: E2B, E4B, 12B, 31B and 26B
A4B. The models can be used with their default precision (16-bit) or with a
lower precision using quantization. The different sizes and precisions represent
a set of trade-offs for your AI application. Models with higher parameters and
bit counts (higher precision) are generally more capable, but are more expensive
to run in terms of processing cycles, memory cost and power consumption. Models
with lower parameters and bit counts (lower precision) have less capabilities,
but may be sufficient for your AI task.

### Gemma 4 Inference Memory Requirements

The following table details the approximate GPU or TPU memory requirements for
running inference with each size of the Gemma 4 model versions.

| Parameters | BF16 (16-bit) | SFP8 (8-bit) | Q4\_0 (4-bit) | Mobile | Mobile (Text-only) |
| --- | --- | --- | --- | --- | --- |
| Gemma 4 E2B | 11.4 GB | 5.7 GB | 2.9 GB | 1.1 GB | 0.84 GB |
| Gemma 4 E4B | 17.9 GB | 8.9 GB | 4.5 GB | 2.5 GB | 2.2 GB |
| Gemma 4 12B | 26.7 GB | 13.4 GB | 6.7 GB | - | - |
| Gemma 4 26B A4B | 57.7 GB | 28.8 GB | 14.4 GB | - | - |
| Gemma 4 31B | 69.9 GB | 34.9 GB | 17.5 GB | - | - |

**Table 1.** Approximate GPU or TPU memory required to load Gemma 4 models based
on parameter count, quantization level and 20% overhead of loading additional
things. Mobile versions use LiteRT-LM.

### Key Considerations for Memory Planning

- **Efficient Architecture (E2B and E4B):** The "E" stands for "effective"
parameters. The smaller models incorporate Per-Layer Embeddings (PLE) to
maximize parameter efficiency in on-device deployments. Rather than adding
more layers to the model, PLE gives each decoder layer its own small
embedding for every token. These embedding tables are large but only used
for quick lookups, which is why the total memory required to load static
weights is higher than the effective parameter count suggests.
- **The MoE Architecture (26B A4B):** The 26B is a Mixture of Experts
model. While it only activates 4 billion parameters per token during
generation, **all 26 billion parameters** must be loaded into memory to
maintain fast routing and inference speeds. This is why its baseline memory
requirement is much closer to a dense 26B model than a 4B model.
- **Base Weights Only:** The estimates in the preceding table _only_ account
for the memory required to load the static model weights. They don't include
the additional VRAM needed for supporting software or the context window.
- **Context Window (KV Cache):** Memory consumption will increase dynamically
based on the total number of tokens in your prompt and the generated
response. Larger context windows require significantly more VRAM on top of
the base model weights.
- **Fine-Tuning Overhead:** Memory requirements for _fine-tuning_ Gemma models
are drastically higher than for standard inference. Your exact footprint
will depend heavily on the development framework, batch size, and whether
you are using full-precision tuning versus a Parameter-Efficient Fine-Tuning
(PEFT) method like Low-Rank Adaptation (LoRA).

### Quantization-Aware Training (QAT)

For deployments requiring maximum efficiency with minimal quality compromise,
Gemma offers official **Quantization-Aware Training (QAT)** models.

Unlike standard Post-Training Quantization (PTQ), which compresses a fully
trained model and can lead to quality degradation, QAT integrates quantization
simulation into the training process itself. This allows the model to learn to
compensate for the precision loss, resulting in smaller models that perform
nearly identically to their high-precision baselines.

#### Quick Routing Table

| Target Deployment Engine | Download Suffix | Primary Use Case |
| --- | --- | --- |
| llama.cpp / LM Studio (Local) | `{model-name}-qat-q4_0-gguf` | Zero-setup local deployment on CPU, Apple Silicon, or consumer GPUs. |
| vLLM / SGLang | SERVER: `{model-name}-qat-w4a16-ct`<br>MOBILE: `{model-name}-qat-mobile-ct` | High-throughput inference utilizing 4-bit weights with 16-bit activations. |
| Speculative Decoding | MODEL: `{model-name}-qat-q4_0-unquantized`<br>DRAFTER: `{model-name}-qat-q4_0-unquantized-assistant` | Running a primary model alongside its matching MTP draft model to drastically accelerate token generation. The model must be quantized. |
| Other formats | `{model-name}-qat-q4_0-unquantized` | Unquantized weights for converting to other formats (e.g. MLX) |
| Mobile Deployment (Transformers) | `{model-name}-qat-mobile-transformers` | Edge weights optimized for mobile use cases. They serve as reference for other formats. |

Official QAT collections on Hugging Face

- **[collections/google/gemma-4-qat-q4-0](https://huggingface.co/collections/google/gemma-4-qat-q4-0)**
  - **Unquantized QAT Checkpoints (`-unquantized` / `-assistant`):**
    Half-precision weights extracted directly from the QAT pipeline. These
    are ideal for custom downstream compilation, research, or running
    speculative decoding using the assistant draft models. _Available for_
    _Gemma 4 E2B, E4B, 12B, 26B A4B, and 31B._
  - **GGUF (`-gguf`):** Checkpoints available for immediate drop-in
    compatibility across the local LLM ecosystem. _Available for Gemma 4_
    _E2B, E4B, 12B, 26B A4B, and 31B._
  - **Compressed Tensors (`-w4a16-ct`):** Serialized natively in the
    `compressed-tensors` standard for optimized, high-concurrency cloud
    serving. _Available for Gemma 4 E2B, E4B, 12B, and 31B._
- **[collections/google/gemma-4-qat-mobile](https://huggingface.co/collections/google/gemma-4-qat-mobile)**
  - **Mobile-Optimized (`-mobile-transformers` / `-mobile-ct`):** Built on a
    custom `wNa8o8` schema engineered specifically for mobile hardware
    limits. It utilizes targeted 2-bit decoding layers, optimized KV caches,
    and static activations to maximize on-device RAM savings without choking
    edge processors. _Available for Gemma 4 E2B and E4B._

All official Gemma 4 QAT checkpoints can also be accessed directly from
[Kaggle](https://www.kaggle.com/models/google/gemma-4/transformers).

## Previous Gemma models

You can work with previous generations of Gemma models, which are also
available from [Kaggle](https://www.kaggle.com/models?query=gemma) and
[Hugging Face](https://huggingface.co/google/collections).
For more technical details about previous Gemma models, see the following
model card pages:

- Gemma 3 [Model Card](https://ai.google.dev/gemma/docs/core/model_card_3)
- Gemma 2 [Model Card](https://ai.google.dev/gemma/docs/core/model_card_2)
- Gemma 1 [Model Card](https://ai.google.dev/gemma/docs/core/model_card)

Ready to start building?
[Get started](https://ai.google.dev/gemma/docs/get_started)
with Gemma models!

Was this helpful?



 Send feedback



Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2026-07-08 UTC.


Need to tell us more?






\[\[\["Easy to understand","easyToUnderstand","thumb-up"\],\["Solved my problem","solvedMyProblem","thumb-up"\],\["Other","otherUp","thumb-up"\]\],\[\["Missing the information I need","missingTheInformationINeed","thumb-down"\],\["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"\],\["Out of date","outOfDate","thumb-down"\],\["Samples / code issue","samplesCodeIssue","thumb-down"\],\["Other","otherDown","thumb-down"\]\],\["Last updated 2026-07-08 UTC."\],\[\],\[\]\]