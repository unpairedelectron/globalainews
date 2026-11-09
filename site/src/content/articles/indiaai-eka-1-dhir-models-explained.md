---
title: "EKA-1 and Dhīr Explained: What India’s New IndiaAI Models Can Do, and Which You Can Download"
seoTitle: "EKA-1 and Dhīr: India’s New AI Models Explained"
description: "IndiaAI released Soket’s 26.3B-parameter EKA-1 and ZenteiQ’s Dhīr 2B and 5B on 3 November. What each model is for, what is actually open, and what runs offline."
category: "india"
image: "/images/articles/indiaai-eka-1-dhir-models-explained/hero.jpg"
imageAlt: "EKA-1 and Dhīr Explained: What India’s New IndiaAI Models Can Do, and Which You Can Download"
tags: ["IndiaAI", "Indian LLMs", "Open-weight models"]
date: "2026-11-15T07:30:00Z"
takeaways:
  - "On 3 November 2026 the IndiaAI Mission released three home-grown models: EKA-1 from Soket and Dhīr 2B and Dhīr 5B from ZenteiQ."
  - "EKA-1 has 26.3 billion parameters, was trained on about 7.5 trillion tokens and covers all 22 scheduled Indian languages plus English, according to the government release."
  - "Dhīr 2B and Dhīr 5B are small, Apache 2.0-licensed models for English and ten Indian languages that ZenteiQ says run fully offline on laptops and edge devices."
  - "Dhīr 5B is a mixture-of-experts model with 5.09 billion parameters, of which 1.79 billion are active for each token; its 4-bit file is 2.95 GB."
  - "As of 9 November we found a public download route for Dhīr but not for EKA-1, which Soket’s own site still offers through early access."
---
## The bottom line

India now has three new foundation models built under its national AI programme. On 3 November 2026 the IndiaAI Mission released **EKA-1**, a 26.3-billion-parameter model from Bengaluru’s Soket, and **Dhīr 2B** and **Dhīr 5B**, two compact models from ZenteiQ that are built to run without an internet connection. [1]

They are aimed at different jobs. EKA-1 is the bigger model, pitched at maths, code, reasoning and agentic tasks across all 22 scheduled Indian languages, with banking, financial services and cybersecurity as its target sectors. [1] Dhīr is small enough to run on a laptop or an edge board, under the permissive Apache 2.0 licence, in English and ten Indian languages. [2]

The practical difference today is access. ZenteiQ publishes file sizes, benchmark tables and a download link for Dhīr. [2] For EKA-1, the government calls it open, but as of 9 November Soket’s own site offered early access rather than a public download, and its Hugging Face organisation listed no EKA-1 repository. [1][3][4]

## Key facts at a glance

| | EKA-1 | Dhīr 2B | Dhīr 5B |
|---|---|---|---|
| Developer | Soket Labs Technology and Research | ZenteiQ AiTech Innovations | ZenteiQ AiTech Innovations |
| Size | 26.3B parameters | 2.03B parameters (dense) | 5.09B total, 1.79B active per token |
| Design | “Open, sparse hybrid” language model | Dense transformer | Mixture of experts, 2 of 12 experts per token |
| Training data | ~7.5 trillion tokens | 6 trillion+ tokens | 6 trillion+ tokens |
| Languages | 22 scheduled Indian languages + English | 10 Indian languages + English | 10 Indian languages + English |
| Context window | Not stated in the release | 16,384 tokens | 16,384 tokens |
| Licence | Not stated in the release | Apache 2.0 | Apache 2.0 |
| Built for | Maths, code, reasoning, agentic use; BFSI and cybersecurity | Offline assistants, document-grounded tasks | Same as Dhīr 2B, stronger on code and maths |

Sources: the PIB release for EKA-1 and the release event [1]; ZenteiQ’s Dhīr model page for Dhīr’s specifications. [2]

## What was released, and by whom

The models were unveiled at a press event in New Delhi attended by S. Krishnan, Secretary of the Ministry of Electronics and Information Technology (MeitY). [1] Both companies were selected under the **IndiaAI Innovation Centre (Foundation Models)** pillar, one of the mission’s seven pillars. The government says they received subsidised access to national AI compute and support for ancillary research costs. [1]

That pillar dates back to the Cabinet’s approval of the IndiaAI Mission on 7 March 2024, with a budget outlay of ₹10,371.92 crore. The Cabinet note tasked the Innovation Centre with building “indigenous Large Multimodal Models (LMMs) and domain-specific foundational models in critical sectors”. [5] For background on how the compute side of the mission works, see our explainer on [what India’s GPU numbers really measure](/article/india-ai-compute-access-2026/).

Krishnan said the models strengthen “India’s technological and strategic autonomy in Artificial Intelligence”, and that through platforms such as AIKosh they “can be made accessible to researchers, students, innovators and the wider public”. [1]

## EKA-1: Soket’s bigger, enterprise-focused model

According to the government release, EKA-1 has 26.3 billion parameters, was trained on approximately 7.5 trillion tokens, and spans all 22 scheduled Indian languages alongside English. It is described as “an open, sparse hybrid language model” designed for “math, code, reasoning, and agentic use”. [1]

Soket’s chief executive, Abhishek Upperwal, said the model was “specifically tailored to India's unique banking, financial services and cybersecurity landscape”. [1]

The release does not define “sparse hybrid”. In model design, “sparse” usually means that only part of the network does the work for any given token, which keeps running costs below what the total parameter count suggests. Soket has not published an architecture paper or a model card on its own site that would confirm how EKA-1 does this. [1][3]

EKA-1 is the first release from **Project EKA**, which Soket calls its flagship research programme. The project page lists bigger ambitions than this one model: 1,536 H100 GPUs of “sovereign compute via IndiaAI Mission”, a curated 25-trillion-token corpus, and a model of 120 billion-plus parameters described as “in training”. [3] Those are figures for the programme, not for EKA-1.

Soket has released open models before. Its Pragna-1B, a 1.25-billion-parameter model in Hindi, English, Gujarati and Bengali, is published on Hugging Face. [3][4]

## Dhīr 2B and 5B: small models that work offline

ZenteiQ, which says it was born at IISc Bangalore, has published far more detail. [2] Both Dhīr models were pretrained from scratch rather than adapted from another developer’s weights, and are released as instruction-tuned checkpoints. They share a tokenizer, a block design and a training recipe. [2]

- **Dhīr 2B** is a dense transformer with 2.03 billion parameters. Its 4-bit file is 1.21 GB, and its full 16-bit weights are 4.06 GB. [2]
- **Dhīr 5B** is a mixture-of-experts model. It holds 5.09 billion parameters but routes each token through 2 of its 12 experts, so only 1.79 billion are active at a time. Its 4-bit file is 2.95 GB, and its 16-bit weights are 10.19 GB. [2]

Each model was pretrained on more than 6 trillion tokens and handles a context of 16,384 tokens. The languages are Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi and Odia, alongside English. [2]

ZenteiQ says every training stage ran on Google Cloud TPU v6e chips in Mumbai, with data and checkpoints held in the same region. It built its own 131,000-entry tokenizer, and it identifies every checkpoint from the first training step to release with a SHA-256 digest. [2] The company describes Dhīr as “the first billion-parameter generative language models built in India and pretrained from scratch on TPUs”. [2] That is ZenteiQ’s claim; we have not seen an independent check.

### How fast it runs on ordinary hardware

ZenteiQ published decode speeds measured with llama.cpp, using 4-bit weights and a single stream: [2]

| Device | Dhīr 2B | Dhīr 5B |
|---|---|---|
| Laptop with Intel Iris Xe integrated graphics | 18.6 tokens/s | 20.5 tokens/s |
| NVIDIA Jetson Orin NX | 34.1 tokens/s | 39.9 tokens/s |
| Raspberry Pi 4 (CPU only) | 2.3 tokens/s | 2.8 tokens/s |

The 5B model is slightly faster than the 2B model on every device despite being larger overall. That fits its design: with 1.79 billion active parameters, it does less work per token than the 2.03-billion-parameter dense model. [2]

ZenteiQ’s chief executive, Prof. Sashikumar, said at the launch that the lightweight design “enables on-device deployment on mobile phones, without dependence on cloud connectivity”. [1]

### What the benchmarks show

ZenteiQ reports section averages across 41 benchmarks, comparing both models with 24 open models of 1–7 billion parameters under one protocol: [2]

| Model | Indic | Agentic | Code and maths | English | Overall |
|---|---|---|---|---|---|
| Dhīr 2B | 53.7 | 85.9 | 50.8 | 55.1 | 61.4 |
| Dhīr 5B | 51.2 | 87.2 | 61.2 | 58.9 | 64.6 |

The company says Dhīr 2B is first in its class on 13 of 15 Indic benchmarks, and that its Indic average matches or exceeds every 4B-class model it evaluated. Dhīr 5B leads on agentic, code and maths, and English; Dhīr 2B leads on Indian languages. [2] These are the developer’s own numbers. ZenteiQ has published its evaluation tools so that others can rerun them. [2]

### What Dhīr can’t do

ZenteiQ is unusually direct about the limits: [2]

- Recalling facts without a supporting source is the models’ weakest area. ZenteiQ advises using retrieval from authoritative sources, plus human review, for law, finance, agriculture, medicine or history.
- Neither model has a reasoning mode. Larger models lead on maths and code.
- They handle text only: no images, audio or speech.
- Instruction following has been measured in English only.

On a multilingual safety benchmark covering English and nine Indian languages, ZenteiQ says Dhīr 5B had the lowest rate of harmful responses of the eight models evaluated, and Dhīr 2B the third lowest. [2]

## Open, but how open?

“Open” covers very different things in AI, a gap we explain in our guide to [open weights vs open source AI](/article/open-weights-vs-open-source-ai/).

**Dhīr** is the clearer case. ZenteiQ releases the models under Apache 2.0 and links a download on AIKosh. [2] Apache 2.0 grants a copyright licence to reproduce and prepare derivative works and a patent licence, but not permission to use the licensor’s trademarks. [6] In practice that allows commercial use and fine-tuning. ZenteiQ also sells enterprise licensing and pilot programmes for companies that want help fine-tuning and deploying the models. [2]

**EKA-1** is less clear. The government release calls it “open”, but it does not name a licence or say where the weights can be downloaded. [1] On 9 November, Soket’s Project EKA page offered “Get early access”, and Soket’s Hugging Face organisation listed earlier models such as Pragna-1B but no EKA-1 repository. [3][4] We could not reach AIKosh to check its listing. Until Soket publishes a licence and weights, treat EKA-1 as announced rather than freely available.

## What this means for…

**Indian developers and startups.** Dhīr is the one you can try now. A 1.21 GB 4-bit file and a permissive licence put it within reach of a single laptop, which makes it practical for offline prototypes in Indian languages. [2] If you are deciding between a hosted service and running a model yourself, our guide to [hosted API vs open-weight models](/reports/hosted-vs-open-weight-models/) walks through the trade-offs.

**Banks, insurers and security teams.** EKA-1 is explicitly aimed at you. [1] Before planning around it, ask Soket for the licence, the deployment options and evaluation results on your own tasks. None of these were in the public release.

**Government and public services.** Both developers pitch on-premise and offline use. The release names defence, government, industrial and educational settings for Dhīr, especially “low-connectivity or sensitive environments”. [1] ZenteiQ’s own warning about factual recall still applies: pair the models with authoritative documents and human review. [2]

**Readers who speak Indian languages.** EKA-1 claims all 22 scheduled languages; Dhīr covers ten. [1][2] Neither company has yet published an independent, side-by-side evaluation against the big global assistants, so the language claims are best judged by testing them yourself.

## What we don’t know yet

- **EKA-1’s licence and download date.** The release calls it open but gives neither. [1]
- **EKA-1’s architecture and benchmarks.** Soket has not published a model card or technical report on its site. [3]
- **Independent results.** Every benchmark number above comes from the developers themselves. [2]
- **What the subsidies cost.** The release says the models used subsidised national compute, but it doesn’t say how much compute or money each project received. [1]
- **What comes next.** Soket lists a 120B-plus model “in training”, and ZenteiQ says a Dhīr 9B model is in development, with public release subject to evaluation. Neither has a date. [2][3]

## FAQ

### What are EKA-1 and Dhīr?

They are AI foundation models released by India’s IndiaAI Mission on 3 November 2026. EKA-1 is a 26.3-billion-parameter model from Soket. Dhīr 2B and Dhīr 5B are smaller models from ZenteiQ that can run offline. [1]

### Can I download EKA-1?

Not that we could confirm as of 9 November 2026. The government describes it as open, but Soket’s site offered early access and its Hugging Face page listed no EKA-1 repository. [1][3][4]

### Is Dhīr free for commercial use?

ZenteiQ releases Dhīr under the Apache 2.0 licence, which permits reproduction, modification and redistribution, including commercially, subject to its terms. [2][6] Check the licence file that comes with the download before you ship a product.

### Which Indian languages does Dhīr support?

Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi and Odia, plus English. [2]

### Can Dhīr run on a phone or a laptop?

ZenteiQ reports 18.6 to 20.5 tokens per second on a laptop with Intel integrated graphics, and its chief executive says the design allows on-device use on mobile phones. [1][2] ZenteiQ’s published speed table doesn’t include a phone.

### Are these models better than ChatGPT or Gemini?

They are built for different jobs. Dhīr is compared only with other open models of 1–7 billion parameters, and ZenteiQ says larger models lead on maths and code. [2] No independent comparison with the major hosted assistants has been published.

## Sources

**Primary**

1. Press Information Bureau (MeitY), *IndiaAI Mission Released Indigenous Foundation Models EKA-1 by Soket and Dhīr 2B & Dhīr 5B by ZenteiQ Under the IndiaAI Innovation Centre Pillar*, 3 November 2026. https://www.pib.gov.in/PressReleasePage.aspx?PRID=2332315&reg=48&lang=2
2. ZenteiQ AiTech Innovations, *Dhīr 2B and Dhīr 5B MoE* (model page), accessed 9 November 2026. https://zenteiq.ai/dhir/
3. Soket AI, *Project EKA*, accessed 9 November 2026. https://soket.ai/project-eka
4. Soket Labs on Hugging Face, organisation model list, accessed 9 November 2026. https://huggingface.co/soketlabs
5. Press Information Bureau (Cabinet), *Cabinet Approves Ambitious IndiaAI Mission to Strengthen the AI Innovation Ecosystem*, 7 March 2024. https://pib.gov.in/PressReleasePage.aspx?PRID=2012355
6. Apache Software Foundation, *Apache License, Version 2.0*. https://www.apache.org/licenses/LICENSE-2.0

## Methodology note

Research and drafting for this article were AI-assisted, and every figure was checked against the sources listed above on 9 November 2026. Model specifications, speeds and benchmark scores are the developers’ own published figures and are attributed as such; we did not run the models. Availability statements describe what we could find on the developers’ pages on 9 November 2026. See our [editorial policy](/editorial-policy/).
