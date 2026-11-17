---
title: "How to Read an AI Model Card: The Eight Things Worth Checking Before You Use a Model"
seoTitle: "How to Read an AI Model Card: A Practical Guide"
description: "A model card is the spec sheet for an AI model. What each section means, which numbers are the vendor's own claims, and the questions to ask when a section is missing."
category: "models"
image: "/images/articles/how-to-read-an-ai-model-card/hero.jpg"
imageAlt: "How to Read an AI Model Card: The Eight Things Worth Checking Before You Use a Model"
tags: ["Model cards", "Explainer", "AI evaluation"]
date: "2026-11-26T07:30:00Z"
takeaways:
  - "A model card is a short document released with a model that states what it is for, how it was evaluated, and where it should not be used."
  - "The idea comes from a 2018 paper by Margaret Mitchell and colleagues, which proposed cards to clarify intended uses and discourage use in contexts a model doesn't suit."
  - "Hugging Face's template has standard sections: model details, uses, bias and limitations, training details, evaluation and environmental impact."
  - "Nearly every performance number on a model card is the developer's own measurement, so read benchmark scores as claims to verify, not independent results."
  - "The most useful section is often the one about limitations, and a card that omits it tells you something too."
---
## The bottom line

**A model card is the spec sheet that comes with an AI model.** It should tell you who built it, what it is meant to do, what it was trained on, how it scored on tests, and where it shouldn't be used.

The idea was proposed in a 2018 paper, *Model Cards for Model Reporting*, by Margaret Mitchell and colleagues. Their argument: released models should carry documentation "detailing their performance characteristics", to "clarify the intended use cases of machine learning models and minimize their usage in contexts for which they are not well suited". [1]

Today most model releases come with one, and they have become the practical starting point for choosing a model. But a card is written by the people who made the model. Read it as a vendor document with useful structure, not as an independent audit.

## The eight sections worth checking

Hugging Face publishes a widely used template and an annotated version explaining each section. [2][3] Here is what to look for.

### 1. Model details

Who built it, who funded it, what type of model it is, and the licence. [3] The licence matters most in practice: it decides whether you can use the model commercially, fine-tune it or redistribute it. Mistral's card for Mistral Small 4, for instance, lists the model as Apache 2.0 with 119B parameters and 6.5B active, and a 256k context window. [4]

### 2. Uses: direct, downstream and out-of-scope

The annotated template says this section covers "how the model is intended to be used in different applied contexts", the foreseeable users "including those affected by the model", and "uses that are considered out of scope or misuse". [3]

The out-of-scope list is the part people skip and shouldn't. It is the developer telling you, in advance, where the model is likely to fail or cause harm.

### 3. Bias, risks and limitations

This is usually the most informative section, and the most uneven in quality. A good one is specific. ZenteiQ's card for its Dhīr models, for example, states that "recall of facts without a supporting source is the weakest area", advises retrieval from authoritative sources and human review "for law, finance, agriculture, medicine or history", and notes the models are "text only" with instruction following "measured in English only". [5]

That is far more useful than a generic warning that the model "may produce inaccurate information".

### 4. Recommendations

What the developers suggest you do about those limitations. [3] If the recommendations amount to "use carefully", the card isn't doing its job.

### 5. Training details

What data the model was trained on, and how. [3] Many commercial cards say very little here. A vague description of training data makes it hard to judge how the model will behave on your domain, or in your language.

### 6. Evaluation

The annotated template notes that evaluation is "ideally disaggregated with respect to different factors, such as task, domain and population subgroup", though in practice this section "is most commonly used to report aggregate evaluation performance on different task benchmarks". [3]

Two questions to ask of any score. First: who ran the test? Almost always the developer. Second: on what? A benchmark average can hide weak performance on the specific task you care about.

### 7. Environmental impact

Hardware type, hours used, cloud provider and carbon emitted. [3] Rarely filled in completely, but worth noting if energy use matters to your organisation.

### 8. How to get started

Working code or commands. Their absence can indicate the weights aren't actually available, whatever the card says.

## How to read the numbers

The 2018 paper framed model cards as a way of "increasing transparency into how well AI technology works", including "benchmarked evaluation in a variety of conditions". [1] The reality in 2026 is more mixed.

Three habits help:

1. **Treat every score as a claim.** It is the developer's measurement, under their conditions. Our look at [OSWorld and agent reliability](/article/reliability-is-the-new-ai-moat/) shows how far a benchmark number can sit from real-world dependability.
2. **Check what is missing.** An absent limitations section, no training-data description or no out-of-scope list are findings in themselves.
3. **Separate the licence from the product.** An Apache 2.0 model can be served through an API with entirely different terms. Read the licence file, not the headline. Our guide to [open weights versus open source](/article/open-weights-vs-open-source-ai/) covers the distinction.

## Sizes, prices and what they don't tell you

Cards usually lead with parameter counts and prices. Both are easy to misread.

Mistral's card lists Small 4 at "119B parameters with 6.5B active" and prices it at $0.15 per million input tokens and $0.60 per million output tokens. [4] The active count describes how much of the model runs per token; the total describes how much memory you need to load it. Neither is a hardware requirement on its own.

Prices are per token, which is not the same as per word. If you work in Indian languages, see our explainer on [why Indian languages cost more to process](/article/what-is-a-token-indian-languages-cost-more/).

## What this means for…

**Developers.** Use the card to shortlist, then test on your own tasks. Pay particular attention to the out-of-scope and limitations sections, and check whether evaluation covers your language and domain.

**Businesses.** The licence and the out-of-scope list are the two sections with legal and operational consequences. Have someone read both before a model goes anywhere near production.

**Researchers and policymakers.** Cards are becoming a compliance artefact as well as a technical one. The quality gap between a card that states its limits plainly and one that lists only benchmark wins is itself worth tracking.

## FAQ

### What is an AI model card?

A short document released alongside a trained model that describes its intended uses, how it was evaluated, its limitations and its licence. [1][2]

### Who invented model cards?

The framework was proposed in *Model Cards for Model Reporting* (2018) by Margaret Mitchell, Simone Wu, Andrew Zaldivar and co-authors. [1]

### Are model card benchmark scores reliable?

They are the developer's own measurements, reported under their chosen conditions. Treat them as claims to verify on your own tasks rather than independent results. [3]

### What should I check first on a model card?

The licence, the out-of-scope uses, and the limitations section. Those three decide whether you can use the model at all, and where it will let you down. [3]

### What if a model card has no limitations section?

Treat that as a gap. The annotated template expects bias, risks and limitations to be documented, so an omission means you will have to find those limits yourself through testing. [3]

## Sources

**Primary**

1. Mitchell, Wu, Zaldivar et al., *Model Cards for Model Reporting*, arXiv:1810.03993, October 2018 (revised January 2019). https://arxiv.org/abs/1810.03993
2. Hugging Face, *Model Cards* (Hub documentation), accessed 17 November 2026. https://huggingface.co/docs/hub/en/model-cards
3. Hugging Face, *Annotated Model Card* (Hub documentation), accessed 17 November 2026. https://huggingface.co/docs/hub/en/model-card-annotated
4. Mistral AI, *Mistral Small 4 model card*, accessed 17 November 2026. https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03
5. ZenteiQ AiTech Innovations, *Dhīr 2B and Dhīr 5B MoE*, accessed 17 November 2026. https://zenteiq.ai/dhir/

## Methodology note

Research and drafting for this explainer were AI-assisted, and every quote and figure was checked against the sources above on 17 November 2026. The two model cards are cited as examples of how sections are filled in, not as endorsements. See our [editorial policy](/editorial-policy/).
