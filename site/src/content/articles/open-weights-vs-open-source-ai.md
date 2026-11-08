---
title: "Open Weights vs Open Source AI: What’s the Difference, and Why Does It Matter?"
seoTitle: "Open Weights vs Open Source AI: The Difference"
description: "Many “open” AI models share their weights but not their training data or code, and some licences restrict use. How open weights differ from open source, and what to check before you deploy."
category: "policy"
image: "/images/articles/open-weights-vs-open-source-ai/hero.jpg"
imageAlt: "Open Weights vs Open Source AI: What’s the Difference, and Why Does It Matter?"
tags: ["Open source", "Open-weight models", "Licensing", "Explainer"]
date: "2026-11-14T07:30:00Z"
takeaways:
  - "“Open weights” means you can download the trained model parameters. It does not necessarily mean you get the training data, the training code or permission to use the model however you like."
  - "The Open Source Initiative’s Open Source AI Definition (2024) requires the freedom to use, study, modify and share, plus enough information about training data to rebuild a substantially equivalent system."
  - "Licences vary widely: Apache 2.0 is permissive; others add use restrictions or conditions above a user threshold. Always read the licence, not the label."
  - "The difference matters for compliance too: the EU AI Act gives some lighter obligations to models released under free and open-source licences."
---
## The bottom line

When a company announces an “open” AI model, it usually means one thing: **you can download the model weights**—the billions of numbers that make up the trained model—and run them on your own hardware. That is valuable. But it is not the same as **open source** in the sense software developers have used for decades.

Open-source software gives you the source code and the freedom to use, study, change and share it. For AI, the “source” is more than code: it includes the training data and the training process. Many popular models release weights but keep the data private, and some attach licence terms that restrict who can use them or for what. [1]

So before you build a product on an “open” model, ask three questions: **What exactly was released? What does the licence allow? What do I need for my use case?**

## What makes up an AI model

| Component | What it is | Usually released with “open weights”? |
|---|---|---|
| **Weights** | The trained parameters you need to run the model | Yes |
| **Inference code** | Software to load and run the weights | Usually |
| **Training code** | Software used to train the model | Sometimes |
| **Training data** | The text, images or code the model learned from | Rarely |
| **Data documentation** | What data was used, where it came from, how it was filtered | Sometimes, often partial |
| **Licence** | The legal terms for use, modification and redistribution | Yes, but terms vary widely |

With weights alone you can run, fine-tune and deploy a model. Without the data and training details, you can’t fully inspect how it was built or reproduce it.

## The Open Source AI Definition

In October 2024 the **Open Source Initiative (OSI)**—the body that maintains the widely used Open Source Definition for software—published version 1.0 of the **Open Source AI Definition**. [1] It says an open-source AI system must grant the freedoms to:

1. **Use** the system for any purpose, without asking permission;
2. **Study** how it works and inspect its components;
3. **Modify** it for any purpose, including changing its output;
4. **Share** it, with or without modifications, for any purpose.

To make those freedoms real, the definition requires access to the model parameters, the complete code used for training and running it, and **sufficiently detailed information about the training data** to allow a skilled person to build a substantially equivalent system. It does not require every piece of training data to be published, which has been a point of debate. [1]

By that standard, many well-known “open” models are **open-weight** rather than open source.

## Licences: the part people skip

The licence decides what you are actually allowed to do. Common patterns:

- **Permissive open-source licences such as Apache 2.0.** These allow commercial use, modification and redistribution, with conditions such as keeping notices and including the licence text. [3] Mistral, for example, lists Small 4 under Apache 2.0. (See our explainer on [Mistral Small 4](/article/small-models-serious-workflows/).)
- **Custom “community” licences.** Meta’s Llama licences allow broad use but include conditions such as an acceptable-use policy and, in the Llama 3 licence, a requirement for companies with more than 700 million monthly active users to request a separate licence. [2]
- **Model-specific terms of use.** Google’s Gemma models are released under Gemma terms of use that include a prohibited-use policy. [4]
- **Fully open releases.** Some research groups, such as the Allen Institute for AI with its OLMo models, publish weights, code, training data and documentation together, aiming for full reproducibility. [6]

Restrictions are not necessarily bad—many aim to prevent harmful uses—but they mean the model isn’t open source under the OSI definition, and they can matter for your product, your customers and your lawyers.

## Why the difference matters

**For developers and startups**
- You can self-host open-weight models, which helps with data privacy, latency and cost control.
- You must check whether the licence allows your commercial use, whether you can redistribute a fine-tuned version, and what attribution or naming rules apply.

**For researchers and auditors**
- Without training data or detailed documentation, it is hard to check for bias, contamination of benchmark results or copyrighted material.

**For compliance**
- The EU AI Act gives certain general-purpose AI models released under a **free and open-source licence**, with their parameters publicly available, an exemption from some documentation obligations—though not from copyright-policy and training-data-summary duties, and not if the model is classified as posing systemic risk. [5] Whether a given licence qualifies is a legal question, which is another reason to read the licence closely. Our [India AI rules explainer](/article/india-ai-consultation-paper-what-is-law/) covers a different approach: rules for synthetic media rather than for models.

## A practical checklist before you deploy an “open” model

1. **Read the licence file** in the model repository, not just the announcement.
2. **Check commercial use**, user-count thresholds and any field-of-use restrictions.
3. **Check redistribution rules** for fine-tuned or quantised versions.
4. **Look for a model card** describing training data, evaluation and known limitations.
5. **Confirm the hardware fit**: total parameters determine memory needs more than “active” parameters do.
6. **Keep a record** of the exact model version and licence you deployed.

## FAQ

### Is Llama open source?
Meta calls Llama open, and its weights are downloadable, but its licences include conditions—such as acceptable-use rules and a large-company threshold—that do not meet the OSI’s Open Source AI Definition. Most experts describe it as open-weight. [1][2]

### Can I use an open-weight model commercially?
Often yes, but it depends entirely on the licence. Apache 2.0 models generally allow it; custom licences may add conditions. Read the licence before launch.

### Are open-weight models less safe?
They carry different risks. Anyone can modify them, including to remove safety training, but they also allow independent researchers to study and test them. Safety depends on the model, the deployment and the controls around it.

### What is a “fully open” model?
One that publishes weights, training code, training data and documentation so others can study and reproduce it. Such releases are rarer than open-weight ones.

### Does open source AI have to publish all its training data?
Under OSI’s definition, not necessarily all of it, but it must provide enough detail about the data to let a skilled person build a substantially equivalent system. [1]

## Sources

1. Open Source Initiative, *The Open Source AI Definition 1.0*, October 2024. https://opensource.org/ai/open-source-ai-definition
2. Meta, *Meta Llama 3 Community License Agreement*. https://www.llama.com/llama3/license/
3. Apache Software Foundation, *Apache License, Version 2.0*. https://www.apache.org/licenses/LICENSE-2.0
4. Google, *Gemma Terms of Use*. https://ai.google.dev/gemma/terms
5. Regulation (EU) 2024/1689 (Artificial Intelligence Act), Article 53(2), Official Journal of the EU. https://eur-lex.europa.eu/eli/reg/2024/1689/oj
6. Allen Institute for AI, *OLMo*. https://allenai.org/olmo

## Methodology note

This explainer was researched and drafted with AI assistance and checked against the sources listed above. It is general information, not legal advice; licence terms change, so always read the current version. See our [editorial policy](/editorial-policy/) and [disclaimer](/disclaimer/).
