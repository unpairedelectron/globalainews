---
title: "What Is a Token in AI, and Why Do Indian Languages Cost More to Process?"
seoTitle: "What Is a Token in AI? Why Hindi Costs More"
description: "AI bills, limits and speeds are all measured in tokens. The same sentence can take many more tokens in Hindi or Tamil than in English. Why that happens, and what Indian labs are doing about it."
category: "models"
image: "/images/articles/what-is-a-token-indian-languages-cost-more/hero.jpg"
imageAlt: "What Is a Token in AI, and Why Do Indian Languages Cost More to Process?"
tags: ["Tokens", "Indian languages", "Explainer"]
date: "2026-11-25T07:30:00Z"
takeaways:
  - "A token is the unit an AI model reads and writes: roughly a word, a word-piece or a few characters, not a letter."
  - "Tokens decide three things that matter to users: what you pay per million tokens, how much text fits in the context window, and how fast a reply arrives."
  - "Research has found the same text translated into different languages can differ in token count by up to 15 times, which makes some languages more expensive to process."
  - "Indian-language text often splits into more tokens than English because most tokenizers were built mainly from English-heavy text."
  - "Indian AI labs are now building their own tokenizers: ZenteiQ's Dhīr models use a 131,000-entry tokenizer for English and ten Indian languages."
---
## The bottom line

**A token is the chunk of text an AI model actually handles.** Models don't read letters or words exactly as people do. They break text into tokens: whole common words, pieces of rarer words, or sometimes individual characters. [1]

This matters because tokens are the unit of everything you care about. API prices are quoted per million tokens. Context windows are measured in tokens. Response speed is measured in tokens per second.

And here is the catch for Indian users: the same meaning can take far more tokens in Hindi, Tamil or Bengali than in English. A 2023 study found that the same text translated into different languages had token counts differing "up to 15 times in some cases". [2] More tokens means a higher bill, less text fitting in the context window, and slower replies.

## Key facts at a glance

| | |
|---|---|
| What a token is | A subword unit: a common word, a word-piece, or a few characters [1] |
| Why not whole words | A word-level vocabulary can't handle unseen words; subwords can build them from known pieces [1] |
| Common method | Byte pair encoding (BPE), used by models including Llama, Gemma and Qwen2 [1] |
| Typical vocabulary size | GPT-2 used byte-level BPE with 50,257 tokens [1] |
| Cross-language gap | Up to 15× difference in token count for the same text [2] |
| Example pricing unit | Mistral Small 4: $0.15 per million input tokens, $0.60 per million output tokens [3] |
| An Indian tokenizer | ZenteiQ's Dhīr: 131,000 entries, built for English and ten Indian languages [4] |

## How tokenization works

Models can't take raw text. A **tokenizer** converts text into a list of numbers first, each standing for an entry in a fixed vocabulary.

Why not just use words? A vocabulary of whole words would be enormous and still miss anything new. Hugging Face's documentation explains the compromise: subword tokenization splits text "into units between words and characters, keeping the vocabulary compact while still capturing meaningful pieces. Common words stay intact as single tokens, and rare or unknown words decompose into subwords." [1]

The most popular method is **byte pair encoding (BPE)**. It starts with individual characters and repeatedly merges the most frequent adjacent pair into a new vocabulary entry, until it reaches a target vocabulary size. [1] The example in the documentation: "annoyingly" might become `["annoying", "ly"]` or `["annoy", "ing", "ly"]`, depending on what the vocabulary contains. [1]

There's a further refinement. Including every Unicode character would make the starting vocabulary enormous, so **byte-level BPE** starts from the 256 possible byte values instead, which guarantees any text can be encoded without an "unknown" token. GPT-2 used this with a vocabulary of 50,257. [1]

That guarantee is important for Indian languages. It means Devanagari or Tamil text will always encode. It does not mean it will encode *efficiently*.

## Why Indian languages take more tokens

The merges a tokenizer learns depend on the text it was trained on. If that text is mostly English, the vocabulary fills up with English words and word-pieces. Other languages then have to be built from smaller fragments, sometimes down to individual bytes. One Devanagari character can take several bytes in UTF-8, so a single Hindi word can become several tokens.

The 2023 paper *Language Model Tokenizers Introduce Unfairness Between Languages*, by Petrov and colleagues, measured this. Its findings: [2]

- The same text in different languages can differ in tokenized length "up to 15 times in some cases".
- The gap "persists even for tokenizers that are intentionally trained for multilingual support".
- Even character-level and byte-level models show "over 4 times the difference in the encoding length for some language pairs".

The authors spell out the consequences: unfair treatment "in regard to the cost of accessing commercial language services, the processing time and latency, as well as the amount of content that can be provided as context to the models". They argue future models should use "multilingually fair subword tokenizers". [2]

In practice, for an Indian developer or business, this means three things:

1. **Cost.** If Hindi takes three times the tokens of equivalent English, the same work costs three times as much at the same per-token price. [2][3]
2. **Context.** A 256,000-token context window holds proportionally less Hindi or Tamil text than English text. [2]
3. **Speed.** More tokens to generate means a longer wait. [2]

## What Indian labs are doing about it

This is one reason Indian model builders treat the tokenizer as a core piece of work rather than an afterthought.

**ZenteiQ** built its own tokenizer for the Dhīr models: 131,000 entries, built in-house for English and ten Indian languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi and Odia). It has also published the tools it uses to measure the tokenizer, so its numbers can be checked. [4]

**Soket AI**, whose EKA-1 model we covered in our explainer on [EKA-1 and Dhīr](/article/indiaai-eka-1-dhir-models-explained/), lists "efficient tokenization" as one of its research directions, describing work on "token-efficient vocabularies for Indian languages — minimizing bytes-per-token for Indic scripts". Its project page notes that "most frontier labs optimize for English". [5]

A better tokenizer doesn't make a model smarter. It makes the same model cheaper and faster for the same text, and lets more of your document fit in the context window.

## What this means for…

**Developers in India.** Measure token counts in the languages you actually serve, not just English, before you estimate costs. Two models at the same advertised price per million tokens can differ substantially in real cost for Hindi or Tamil work. If you are weighing a hosted service against running a model yourself, see our guide to [hosted APIs versus open-weight models](/reports/hosted-vs-open-weight-models/).

**Businesses.** Budget in tokens, not words. The multiplier between your language and English is a real line item.

**Everyone.** When a model seems to "forget" earlier parts of a long conversation in an Indian language sooner than in English, inefficient tokenization is one likely reason: the same conversation simply consumes the context window faster. Our explainer on [context windows, memory and RAG](/article/context-window-vs-memory-vs-rag/) covers what the context window does.

## FAQ

### What is a token in AI?

The unit of text a model processes. Usually a whole common word, a piece of a longer word, or a few characters, depending on the tokenizer's vocabulary. [1]

### How many tokens is a word?

There is no fixed ratio. Common English words are often one token; longer or rarer words split into several. For languages written in non-Latin scripts, a single word can take many more. The only reliable way to know is to run your own text through the model's tokenizer. [1][2]

### Why does Hindi cost more than English with the same AI model?

Because pricing is per token, and the same meaning usually takes more tokens in Hindi. Tokenizer vocabularies are typically built from text dominated by English, so English gets the efficient entries. [1][2]

### Does a bigger vocabulary fix this?

It helps, if the extra entries cover the languages you need. That is what tokenizers like Dhīr's 131,000-entry vocabulary for English and ten Indian languages are for. But the 2023 research found gaps persist even in tokenizers built for multilingual use. [2][4]

### What is byte pair encoding?

A method that starts with single characters and repeatedly merges the most frequent adjacent pair into a new vocabulary entry, until the vocabulary reaches a target size. It is the most popular tokenization algorithm in current models. [1]

## Sources

**Primary**

1. Hugging Face, *Summary of the tokenizers* (Transformers documentation), accessed 16 November 2026. https://huggingface.co/docs/transformers/en/tokenizer_summary
2. Petrov, La Malfa, Torr and Bibi, *Language Model Tokenizers Introduce Unfairness Between Languages*, arXiv:2305.15425, May 2023 (revised October 2023). https://arxiv.org/abs/2305.15425
3. Mistral AI, *Mistral Small 4 model card* (pricing per million tokens), accessed 16 November 2026. https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03
4. ZenteiQ AiTech Innovations, *Dhīr 2B and Dhīr 5B MoE*, accessed 16 November 2026. https://zenteiq.ai/dhir/
5. Soket AI, *Project EKA*, accessed 16 November 2026. https://soket.ai/project-eka

## Methodology note

Research and drafting for this explainer were AI-assisted, and every quote and figure was checked against the sources above on 16 November 2026. The explanation of how subword tokenization affects cost, context and speed follows the reasoning set out in the cited research; we did not run our own token-count measurements. See our [editorial policy](/editorial-policy/).
