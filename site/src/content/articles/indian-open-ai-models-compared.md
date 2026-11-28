---
title: "India's Open AI Models: What Each One Is For, and What the Licence Lets You Do"
seoTitle: "India's Open AI Models Compared"
description: "Sarvam, Krutrim, BharatGen and AI4Bharat all publish open weights. The licences differ far more than the models do — and the most-downloaded Indian models are not chatbots."
category: "models"
image: "/images/articles/indian-open-ai-models-compared/hero.jpg"
imageAlt: "India's Open AI Models: What Each One Is For, and What the Licence Lets You Do"
tags: ["India AI", "Open weights", "Licensing", "Sarvam", "BharatGen"]
date: "2026-12-07T07:30:00Z"
takeaways:
  - "Across all four organisations, the most-downloaded model is not a chatbot. AI4Bharat's IndicTrans2 translation model reports 351,585 downloads; the most-downloaded Indian general-purpose LLM we found reports 4,489."
  - "The licences are not interchangeable. AI4Bharat publishes under MIT, Sarvam's LLMs under Apache-2.0 — but sarvam-translate is GPL-3.0, a copyleft licence with very different obligations."
  - "Krutrim's models carry the Krutrim Community License Agreement v1.0, which is not an OSI-approved licence. It requires a separate agreement for commercial use and bars use to support products that compete with Krutrim."
  - "Krutrim's most-downloaded model by a wide margin is Vyakyarth, an Indic embedding model on 238,754 downloads — and it carries that same restrictive licence."
  - "Four of the repositories we checked are gated: you must share your Hugging Face username and email with the authors before you can download the files."
---
## The bottom line

India now has four substantial open-weight model families: **Sarvam AI**, **Krutrim AI Labs**, **BharatGen** and **AI4Bharat**. Most comparisons rank them on chat quality. That is the least useful thing to know, for two reasons.

First, **almost nobody is downloading the chatbots.** The most-used Indian open models are translation, speech and embedding models, by two orders of magnitude.

Second, **the licences differ far more than the models do.** One of these families is not open source at all in the sense most developers assume, and one widely used translation model is copyleft. Those facts decide whether you can ship, long before benchmark scores matter.

This piece maps what each organisation publishes, what its licence permits, and what the usage signals say. Every figure comes from Hugging Face's own model metadata, read on 28 November 2026.

## Key facts at a glance

| Organisation | Backing | Licence(s) seen | Most-downloaded model | Downloads |
|---|---|---|---|---|
| AI4Bharat | IIT Madras initiative; Nilekani Centre since 2022 [6] | MIT | IndicTrans2 (translation) | 351,585 [1] |
| Krutrim AI Labs | Ola Krutrim | Krutrim Community Licence v1.0 (not OSI-approved) [3][5] | Vyakyarth (embeddings) | 238,754 [1] |
| Sarvam AI | Selected under the IndiaAI Mission | Apache-2.0; GPL-3.0 for sarvam-translate | sarvam-translate | 71,205 [1] |
| BharatGen | NM-ICPS / DST, led by IIT Bombay; ₹1,293 crore of government support [7] | Apache-2.0 | Param2-17B-A2.4B-Thinking | 3,841 [1] |

## The four organisations

**AI4Bharat** is the oldest and, by usage, the most successful. It was set up as an IIT Madras initiative to build open-source language AI for Indian languages; in July 2022 IIT Madras launched the Nilekani Centre at AI4Bharat, supported by "Rohini and Nandan Nilekani with a generous grant of Rs. 36 crore through Nilekani Philanthropies". [6] Its Hugging Face organisation carries 146 models and 93 datasets. [1] It publishes no general-purpose chatbot — only the infrastructure underneath one: translation, speech recognition, text-to-speech and encoders.

**Sarvam AI** is the commercial startup selected under the IndiaAI Mission to build a sovereign model. It publishes the largest Indian open-weight LLMs we found: `sarvam-105b` at 106,031,767,424 parameters and `sarvam-30b` at 32,152,650,368, both Apache-2.0, both created 3 March 2026. [1]

**BharatGen** is the government-funded academic consortium. It is "supported under NM-ICPS" and "led by IIT Bombay with a consortium of academic institutions", spanning "text, speech and vision-language technologies", with Param-2 at "17 billion parameters" supporting "all 22 Scheduled Indian languages". [8] A December 2024 answer in the Lok Sabha named the consortium members: "IIT Bombay, IIIT Hyderabad, IIT Mandi, IIT Kanpur, IIT Hyderabad, IIM Indore, and IIT Madras". [9] In November 2025 the government put the support figure at "₹1,293 Crore". [7]

Its catalogue shows that structure: alongside Param-2 sit domain models named `AyurParam`, `AgriParam`, `FinanceParam` and `LegalParam`, plus `Shrutam-2` (speech-to-text) and `sooktam2` (text-to-speech). Their download counts — 337, 142, 102 and 81 respectively — mark them as research outputs. [1]

**Krutrim AI Labs** is Ola's AI arm. It publishes `Krutrim-2-instruct`, the vision-language `Chitrarth`, and `Vyakyarth`, "A Multilingual Sentence Embedding Model for Indic Languages". [4]

## What people actually download

This is the finding that reframes everything else. For each organisation, the single most-downloaded model:

| Model | What it does | Downloads |
|---|---|---|
| `ai4bharat/indictrans2-en-indic-dist-200M` | Translation | 351,585 |
| `krutrim-ai-labs/Vyakyarth` | Sentence embeddings | 238,754 |
| `ai4bharat/indic-conformer-600m-multilingual` | Speech recognition | 218,743 |
| `ai4bharat/indic-parler-tts` | Text-to-speech | 195,440 |
| `sarvamai/sarvam-translate` | Translation | 71,205 |
| `sarvamai/sarvam-30b` | **Chat / general LLM** | 4,489 |
| `bharatgenai/Param2-17B-A2.4B-Thinking` | **Chat / reasoning LLM** | 3,841 |
| `sarvamai/sarvam-105b` | **Chat / general LLM** | 3,245 |
| `krutrim-ai-labs/Krutrim-2-instruct` | **Chat / general LLM** | 293 |

All figures from Hugging Face model metadata, 28 November 2026. [1]

The gap is roughly a hundredfold. The models pulled into real systems do jobs a frontier model does badly or expensively: translating into Odia, transcribing Telugu speech, embedding Indic text for search. Those competing head-on with GPT-class assistants are downloaded in the low thousands.

That is not a verdict on quality. It says where an Indian open model currently has an advantage, and it matches the demand we described in [why Indian languages cost more per token](/article/what-is-a-token-indian-languages-cost-more/).

## The licences differ more than the models

Here the detail matters, because it is binding.

**MIT (AI4Bharat) and Apache-2.0 (Sarvam's LLMs, BharatGen).** Both are permissive and both appear on the Open Source Initiative's approved list, where each is categorised "Popular / Strong Community". [2] Apache-2.0 adds an express patent grant; MIT does not.

**GPL-3.0 (`sarvam-translate`).** Sarvam's most-downloaded model is licensed differently from its flagship LLMs. The model card's front matter reads `license: gpl-3.0`. [3] GPL-3.0 is OSI-approved [2] — but it is strong copyleft, not permissive, so distributing a modified version triggers reciprocal obligations. A team that cleared `sarvam-105b` under Apache-2.0 and assumed the rest of the catalogue matched has not done the check it thinks it has.

**The Krutrim Community License Agreement v1.0.** This one is different in kind. `Krutrim-2-instruct` and `Vyakyarth` both declare `license: other` with `license_name: krutrim-community-license-agreement-version-1.0`. [3][4] It does not appear on the OSI's approved list. [2] Reading the licence text itself: [5]

- **Commercial use requires a separate agreement.** "Commercial Use is permitted only through a separate commercial license agreement with Krutrim, which Krutrim may grant to you in its sole discretion."
- **But "Commercial Use" is defined by scale.** It means use "intended for commercial advantage or monetary compensation where more than 1 million monthly active users of the Licensee use the Software." So the commercial-use clause, read literally, bites above a million MAU.
- **The grant itself is narrower than that implies.** Section 2 grants rights to "Use the Software for permitted purposes as outlined in this license, including research, academic, and personal projects", and to "Modify the Software for research and personal use". Whether ordinary small-scale commercial use is affirmatively licensed is genuinely unclear on the face of the text. We are not going to resolve that for you; if you are deploying it, have a lawyer read it.
- **A non-compete clause applies at any scale.** "The Software may not be used, directly or indirectly, by any person or any entity to develop, market, sell, or otherwise support products or services that compete with Krutrim's core offerings." That covers "both internal development activities and any derivative works".
- **No sub-licensing, and no patent grant.** "Sub-licensing is strictly prohibited." And: "This license does not grant any express or implied patent rights."
- **Audit rights and Indian governing law.** Krutrim "reserves the right to request proof of compliance", which "may include... usage logs"; disputes go to arbitration in Bangalore.

The sting is the combination. Krutrim's most-downloaded artefact, by a factor of 800, is `Vyakyarth` — a 278-million-parameter embedding model, exactly the kind of component a team drops into a production retrieval pipeline without a second thought. It carries all of the above. [4]

"Open weights" and "open source" are not the same claim, and this is the clearest live example of the gap in the Indian ecosystem.

## Four of these repositories are gated

A detail that breaks automated pipelines. Hugging Face reports a `gated` status per repository. For the models we checked:

- **Not gated:** `sarvam-105b`, `sarvam-30b`, `sarvam-translate`, `Krutrim-2-instruct`, `Vyakyarth`
- **Gated (`auto`):** `Param2-17B-A2.4B-Thinking`, `patram-7b-instruct`, `Param-1-2.9B-Instruct`, `IndicF5`, `indic-conformer-600m-multilingual`, `indictrans2-en-indic-dist-200M` [1]

Hugging Face's documentation explains what gating means: "users must submit an access request to access the model files, which shares their Hugging Face information (username and email address) with the model authors unless the authors opted out of collecting it". With automatic approval — the `auto` setting — "any user can access your model once they've shared their personal information with you". [10]

So `auto` is not a wait; it is a form. But an anonymous `git clone` or unauthenticated CI job still gets HTTP 401, and your contact details go to the authors. India's two most-downloaded models are both in this group.

## What the benchmark evidence can and cannot settle

If you want a capability ranking, the honest answer is that the public evidence is thinner than it looks, and a recent paper says so directly.

A structured assessment of India's foundation-model ecosystem, published on arXiv, compared Indian models against global frontier models across eight capability domains and proposed a "Benchmark Maturity Index" scoring each domain on "standardization, participation, independent verification". [11] Its findings:

> "Indian models achieve strong scores on established benchmarks such as MMLU and MATH-500. However, these are now widely regarded as saturated, and frontier developers no longer report them. Indian models participate far less frequently in newer, agentic, and domain-specialized evaluations, and participation is highly uneven across organizations. Sarvam AI reports the broadest coverage by a substantial margin." [11]

And the conclusion that should govern how anyone reads an Indian-model leaderboard:

> "Many apparent capability gaps cannot be distinguished, on available evidence, from evaluation-ecosystem gaps." [11]

In other words, a low score may mean a weaker model or merely that nobody ran the newer evaluation — and on published evidence you often cannot tell which. Run your own test on your own task, as [our guide to reading a model card](/article/how-to-read-an-ai-model-card/) argues.

## How to choose

- **Translating or transcribing Indian languages?** Start with AI4Bharat: MIT licence, deepest catalogue, heaviest real-world use. Budget for the gating step.
- **Need a general-purpose Indian LLM on clean commercial terms?** Sarvam's `sarvam-30b` and `sarvam-105b` are Apache-2.0 and ungated. Check `sarvam-translate` separately — it is GPL-3.0.
- **Building a product on embeddings?** Check the licence before the benchmark. Vyakyarth's terms are not permissive.
- **Working in Ayurveda, agriculture, finance or law?** BharatGen's domain models exist and nothing comparable does. Treat them as research artefacts: counts in the low hundreds mean few people have hit the bugs yet.

On where to run any of this, see [IndiaAI compute against commercial cloud](/reports/indiaai-vs-commercial-cloud/); on when to fine-tune rather than prompt, [fine-tuning versus RAG versus prompting](/article/fine-tuning-vs-rag-vs-prompting/).

## What we don't know yet

- **The download window.** Hugging Face's documentation describes how downloads are counted but, on the page we read, does not state the period the headline number covers. We therefore present these as the platform's reported counts, not as monthly usage.
- **Who the downloaders are.** The documentation is explicit that every GET and HEAD request counts, that all files in a GGUF repository count, and that deduplicating users or excluding CI/CD traffic requires Publisher Analytics. [12] A heavily automated repository looks busier than a human-popular one.
- **Whether Krutrim's licence has since been revised.** We read version 1.0 as published on 28 November 2026.
- **Independent Indic benchmark results.** The arXiv assessment's central point is that these are missing or uneven. [11]

## FAQ

### Which is the best Indian open-source LLM?

On published evidence it cannot be answered cleanly: the arXiv assessment found Indian models participate unevenly in current evaluations, so apparent gaps may be evaluation gaps. [11] On licence clarity and scale, Sarvam's Apache-2.0 models are the straightforward choice for commercial work.

### Are Indian AI models free for commercial use?

It depends entirely on which one. AI4Bharat's MIT and Sarvam's and BharatGen's Apache-2.0 models are permissive. `sarvam-translate` is GPL-3.0, with copyleft obligations on distribution. Krutrim's models are under a custom licence that requires a separate agreement for commercial use as it defines that term, and bars competing uses outright. [3][5]

### Is the Krutrim licence open source?

Not by the Open Source Initiative's reckoning — the Krutrim Community License Agreement v1.0 does not appear on OSI's approved licence list, whereas MIT, Apache-2.0 and GPL-3.0 all do. [2] It contains field-of-use and non-compete restrictions that an OSI-approved licence would not.

### Why can't I download some of these models?

Six of those we checked are gated. You must be signed in to Hugging Face and submit an access request, which shares your username and email with the authors; approval is automatic, but unauthenticated requests are rejected. [10]

### Why are translation models downloaded so much more than Indian chatbots?

Because that is where an Indian open model has a real edge. Frontier chat models are already adequate in major Indian languages, but translation, speech recognition and Indic embeddings are specialised jobs where a purpose-built 200M-parameter model beats a general one on cost and often on quality.

### Does a higher download count mean a better model?

No. It is a noisy usage signal: it counts automated and CI/CD traffic, does not deduplicate users, and counts every file in some repositories. [12] Treat it as evidence a model is embedded in working systems, not as a quality ranking.

## Sources

**Primary**

1. Hugging Face model API metadata for `sarvamai/*`, `krutrim-ai-labs/*`, `bharatgenai/*` and `ai4bharat/*` repositories (fields: `downloads`, `likes`, `gated`, `cardData.license`, `safetensors.total`, `createdAt`). Read 28 November 2026. https://huggingface.co/api/models
2. Open Source Initiative, *Licenses*. Accessed 28 November 2026. https://opensource.org/licenses
3. Hugging Face model cards, front-matter licence declarations: `sarvamai/sarvam-translate` (`license: gpl-3.0`), `krutrim-ai-labs/Krutrim-2-instruct` (`license: other`, `license_name: krutrim-community-license-agreement-version-1.0`). Accessed 28 November 2026. https://huggingface.co/sarvamai/sarvam-translate
4. Krutrim AI Labs, *Vyakyarth: A Multilingual Sentence Embedding Model for Indic Languages*, model card. Accessed 28 November 2026. https://huggingface.co/krutrim-ai-labs/Vyakyarth
5. *Krutrim Community License Agreement Version 1.0*, LICENSE.md. Accessed 28 November 2026. https://huggingface.co/krutrim-ai-labs/Krutrim-2-instruct/raw/main/LICENSE.md
6. Press Information Bureau, *IIT Madras launches 'Nilekani Centre at AI4Bharat' to advance Indian language technology*, 28 July 2022. Accessed 28 November 2026. https://www.pib.gov.in/PressReleasePage.aspx?PRID=1845807
7. Press Information Bureau, *Dr. Jitendra Singh hails "BharatGen" as India's first sovereign multilingual and multimodal AI driven Large Language Model*, 25 November 2025. Accessed 28 November 2026. https://www.pib.gov.in/PressReleasePage.aspx?PRID=2194204
8. Press Information Bureau, *Cyber-Physical Systems: Foundation for a Technology-Driven Future* (backgrounder), 31 August 2026. Accessed 28 November 2026. https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304858
9. Press Information Bureau, *Parliament Question: Launch of BharatGen*, 18 December 2024. Accessed 28 November 2026. https://www.pib.gov.in/PressReleasePage.aspx?PRID=2085534
10. Hugging Face, *Gated models* (Hub documentation). Accessed 28 November 2026. https://huggingface.co/docs/hub/models-gated
11. Agarwal and Jain, *Benchmark-Based Comparative Assessment of Publicly Benchmarked Indian Foundation Models: A Capability and Evaluation-Maturity Framework*, arXiv:2608.11891. Accessed 28 November 2026. https://arxiv.org/abs/2608.11891
12. Hugging Face, *Models Download Stats* (Hub documentation). Accessed 28 November 2026. https://huggingface.co/docs/hub/models-download-stats

## Methodology note

Research and drafting for this comparison were AI-assisted, and every figure was read from Hugging Face's model API and cards on 28 November 2026 rather than from any aggregator or press summary. Licence characterisations come from the licence texts and the cards' front-matter fields; the Krutrim clauses are quoted from LICENSE.md in the `Krutrim-2-instruct` repository. Where that licence's own definitions leave small-scale commercial use ambiguous, we say so rather than resolving it — this is not legal advice. Download counts are the platform's reported repository counts, presented with the caveats Hugging Face documents, including that the page we read does not state the period covered; they are not a like-for-like usage comparison. Funding figures and consortium membership are quoted from the Press Information Bureau releases cited, using the ₹1,293 crore figure from the November 2025 release in preference to lower figures reported elsewhere. We benchmarked no model ourselves. See our [editorial policy](/editorial-policy/).
