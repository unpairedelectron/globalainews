---
title: "Do AI Detectors Work? Why an AI-Writing Score Can’t Prove Who Wrote Something"
seoTitle: "Do AI Detectors Work? What the Evidence Shows"
description: "AI-text detectors give probabilities, not proof. OpenAI withdrew its own classifier for low accuracy, and research found detectors flag non-native English writing unfairly. What students, teachers and editors should do instead."
category: "safety"
image: "/images/articles/can-ai-detectors-prove-who-wrote-it/hero.jpg"
imageAlt: "Do AI Detectors Work? Why an AI-Writing Score Can’t Prove Who Wrote Something"
tags: ["AI detectors", "Education", "Watermarking", "Explainer"]
date: "2026-11-17T07:30:00Z"
takeaways:
  - "AI detectors estimate how “machine-like” a text looks. They produce a probability, not evidence of who wrote it."
  - "OpenAI withdrew its own AI-text classifier in July 2023, citing its low rate of accuracy."
  - "A peer-reviewed study found popular detectors misclassified many essays by non-native English writers as AI-generated, while light editing can help AI text evade detection."
  - "Watermarking and provenance records are more promising, but only work when the AI tool adds them and they survive editing. Process evidence—drafts, notes, version history—remains the fairest check."
---
## The bottom line

AI-writing detectors can’t reliably tell you who wrote a piece of text. They analyse statistical patterns—how predictable the word choices are, how uniform the sentences look—and output a score. That score can be wrong in both directions: it can flag a person’s own writing as AI, and it can miss AI text that has been lightly edited. [1][2][3]

That matters because detector scores are being used to make serious decisions about students, job applicants and writers. A score can be a reason to ask questions. It should never be the only evidence.

## How AI detectors work

Most detectors are classifiers trained to separate human-written from model-written text. They look at signals such as:

- **Perplexity**: how surprising each word is to a language model. AI text often uses more predictable word choices.
- **Burstiness**: how much sentence length and structure vary. People tend to vary more.
- **Learned patterns** from examples of AI and human text.

The problem is that plenty of human writing is predictable too—formal essays, technical writing, text by people writing in a second language, or anything polished with grammar tools. And as models improve and people edit their output, the patterns get weaker.

## What the evidence says

**The maker of ChatGPT gave up on its own detector.** In January 2023 OpenAI released an AI-text classifier and said it correctly identified 26% of AI-written text as “likely AI-written,” while wrongly labelling human-written text as AI-written 9% of the time. In July 2023 it withdrew the tool, citing its low rate of accuracy. [1]

**Detectors can be unfair to non-native English writers.** A peer-reviewed study in the journal *Patterns* tested several widely used detectors on essays written by non-native English speakers for the TOEFL exam and on essays by US eighth-graders. The detectors misclassified a large share of the TOEFL essays as AI-generated, while performing far better on the native speakers’ essays. The authors linked this to the more limited vocabulary and simpler structure that detectors read as “machine-like”—and showed that prompting a model to use more varied language could help AI text slip past detection. [2]

**Detection gets harder as evasion gets easier.** Research has shown that paraphrasing AI-generated text with another model can substantially reduce detection rates, and argues that reliable detection becomes harder as models get closer to human writing. [3]

The pattern across studies is consistent: detectors are least reliable exactly where the stakes are highest—short texts, edited texts and writers whose style differs from the training data.

## Better options: watermarks and provenance

Instead of guessing from the text afterwards, some approaches try to **mark AI output at the moment it is created**:

- **Text watermarking** nudges a model’s word choices in a statistically detectable pattern that a checker with the right key can identify. Researchers proposed practical schemes in 2023, and Google DeepMind described **SynthID-Text**, a watermarking method tested at scale in Gemini, in *Nature* in 2024. [4][5] Watermarks only exist if the AI provider adds them, and heavy rewriting or translation can weaken them.
- **Provenance records** such as **C2PA Content Credentials** attach signed information about how a file was made. They are most common for images and video, and they show history, not truth. (See our explainer on [C2PA Content Credentials](/article/quiet-race-watermark-everything-ai-makes/) and our [comparison of provenance tools](/reports/provenance-controls-compared/).)

Neither tells you whether someone used AI responsibly—only, at best, that a particular tool was involved.

## What to do instead

**For teachers and universities**
- Treat a detector score as, at most, a prompt for a conversation—never as proof.
- Ask for **process evidence**: outlines, drafts, notes, version history in Google Docs or Word.
- Use assessments that show thinking: in-class writing, oral explanations, reflections on sources.
- Set a clear policy on what AI use is allowed, and ask students to disclose it.

**For students and writers**
- Keep your drafts and version history. It is the best defence if your work is questioned.
- If you used AI, say how. Many institutions allow some uses if they are disclosed.

**For editors and employers**
- Judge the work: accuracy, originality, sourcing, and whether the writer can discuss it.
- Ask writers about their process rather than running text through a detector.

## FAQ

### Can Turnitin or GPTZero prove a student used ChatGPT?
No detector can prove authorship. They provide probability-style scores that can be wrong. Treat any score as a reason to look more closely and talk to the student, not as a verdict.

### Why was my own writing flagged as AI?
Detectors often flag formal, predictable or very polished writing, and research shows they are more likely to misclassify text by non-native English writers. [2] Your drafts and version history are the strongest evidence that the work is yours.

### Does OpenAI have a tool to detect ChatGPT text?
OpenAI released a classifier in 2023 and withdrew it the same year because of low accuracy. [1]

### Are AI watermarks reliable?
They are more reliable than after-the-fact detection when they are present, but they only work if the AI provider embeds them, and editing, paraphrasing or translation can weaken them. [4][5]

### Is it allowed to use AI for writing assignments?
That depends on your institution or employer. Policies range from bans to permitted use with disclosure. Check the rules and disclose your use.

## Sources

1. OpenAI, *New AI classifier for indicating AI-written text*, 31 January 2023, updated 20 July 2023. https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/
2. Liang, W. et al., *GPT detectors are biased against non-native English writers*, Patterns, 2023. https://doi.org/10.1016/j.patter.2023.100779
3. Sadasivan, V. S. et al., *Can AI-Generated Text be Reliably Detected?*, arXiv:2303.11156, 2023. https://arxiv.org/abs/2303.11156
4. Kirchenbauer, J. et al., *A Watermark for Large Language Models*, ICML 2023, arXiv:2301.10226. https://arxiv.org/abs/2301.10226
5. Dathathri, S. et al., *Scalable watermarking for identifying large language model outputs*, Nature, 2024. https://www.nature.com/articles/s41586-024-08025-4

## Methodology note

This explainer was researched and drafted with AI assistance and checked against the sources listed above. Detector products change frequently; the research cited reflects the tools and models tested at the time. See our [editorial policy](/editorial-policy/).
