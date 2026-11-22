# Social copy: Fine-Tuning vs RAG vs Prompting

URL: https://www.globalainews.in/article/fine-tuning-vs-rag-vs-prompting/

## WhatsApp Channel (≤60 words + link)

If the model doesn't know something, that's a retrieval problem. If it knows but won't behave, that's prompting, then fine-tuning. The three aren't interchangeable. One deadline worth knowing: OpenAI's self-serve fine-tuning is already shut to new users, and existing customers lose job creation on 6 January 2027.

https://www.globalainews.in/article/fine-tuning-vs-rag-vs-prompting/

## X (≤270 chars)

Model doesn't know something → RAG.
Knows but won't behave → prompting, then fine-tuning.

Quietly in OpenAI's docs: self-serve fine-tuning is shut to new users, and ends for everyone on 6 Jan 2027.

https://www.globalainews.in/article/fine-tuning-vs-rag-vs-prompting/

## LinkedIn (≤120 words)

Buried in OpenAI's own documentation: "OpenAI is winding down the fine-tuning platform. The platform is no longer accessible to new users."

Eligible existing customers can create training jobs only until 6 January 2027. And the base models that supported it are going too — gpt-4.1 and gpt-4.1-mini, with their fine-tuned versions, shut down on 14 January 2027.

So the practical answer to "fine-tuning vs RAG vs prompting" has changed. For most teams starting today, hosted fine-tuning at OpenAI isn't an option at all.

What's left for a genuinely custom model: an open-weight base plus LoRA or PEFT, on hardware you control.

The rule of thumb still holds. Missing knowledge is a retrieval problem; bad behaviour is a prompting problem first.

https://www.globalainews.in/article/fine-tuning-vs-rag-vs-prompting/

## Telegram

**Fine-tuning vs RAG vs prompting — and a deadline most people have missed**

The distinction: prompting changes the instructions, RAG changes what the model can look up, fine-tuning changes the weights. Missing knowledge → RAG. Bad behaviour → prompting, then fine-tuning.

From OpenAI's own docs and deprecation timeline:
• Fine-tuning platform "no longer accessible to new users"
• 7 May 2026: closed to orgs that had never fine-tuned
• 2 July 2026: closed to orgs without recent fine-tuned inference
• 6 Jan 2027: existing customers lose job creation
• 14 Jan 2027: gpt-4.1 and gpt-4.1-mini and their fine-tuned versions shut down
• 30 Nov 2026: the hosted evals dashboard, API and graders go read-only

What's left: open weights + LoRA/PEFT. LoRA's paper reports up to 10,000x fewer trainable parameters than full fine-tuning, with no added inference latency.

https://www.globalainews.in/article/fine-tuning-vs-rag-vs-prompting/
