# Social copy: India's Open AI Models Compared

URL: https://www.globalainews.in/article/indian-open-ai-models-compared/

## WhatsApp Channel (≤60 words + link)

India has four open-weight model families: Sarvam, Krutrim, BharatGen and AI4Bharat. Two findings from their own Hugging Face data: almost nobody downloads the chatbots — translation and speech models beat them a hundredfold — and the licences differ far more than the models do. One is not open source at all.

https://www.globalainews.in/article/indian-open-ai-models-compared/

## X (≤270 chars)

India's most-downloaded open AI models aren't chatbots.

Translation: 351,585
Embeddings: 238,754
Best Indian chat LLM: 4,489

Licences differ more than the models. One needs a separate deal to sell.

https://www.globalainews.in/article/indian-open-ai-models-compared/

## LinkedIn (≤120 words)

If you are picking an Indian open-weight model, check the licence before the benchmark.

Sarvam's LLMs are Apache-2.0 — but sarvam-translate, its most-downloaded model, is GPL-3.0. Different obligations entirely.

Krutrim's models carry a custom community licence that is not OSI-approved: commercial use needs a separate agreement, and it bars use to support anything competing with Krutrim. Its most-downloaded model by a factor of 800 is an embedding model — exactly what teams drop into production retrieval without a second thought.

Meanwhile AI4Bharat, MIT-licensed, quietly out-downloads every Indian chatbot a hundred to one, with translation and speech models.

"Open weights" and "open source" are not the same claim.

https://www.globalainews.in/article/indian-open-ai-models-compared/

## Telegram

**India's open AI models: what each is for, and what the licence lets you do**

All figures read from Hugging Face's model API on 28 November 2026.

**1. Nobody is downloading the chatbots.** The most-used model from each organisation:
• AI4Bharat IndicTrans2 (translation) — 351,585
• Krutrim Vyakyarth (embeddings) — 238,754
• Sarvam sarvam-translate (translation) — 71,205
• Best Indian general-purpose LLM, sarvam-30b — 4,489

A hundredfold gap. The models that get into real systems do jobs a frontier model does badly or expensively.

**2. The licences are not interchangeable.**
• AI4Bharat — MIT
• Sarvam LLMs, BharatGen — Apache-2.0
• **sarvam-translate — GPL-3.0** (copyleft, not permissive)
• **Krutrim — Krutrim Community Licence v1.0**, not OSI-approved: commercial use requires a separate agreement, plus a non-compete clause, no sub-licensing, no patent grant and audit rights.

**3. Six repositories are gated.** Including both of India's most-downloaded models. Automatic approval, but you share your username and email, and unauthenticated CI jobs get a 401.

**4. The benchmarks can't settle it.** A recent arXiv assessment: "Many apparent capability gaps cannot be distinguished, on available evidence, from evaluation-ecosystem gaps."

https://www.globalainews.in/article/indian-open-ai-models-compared/
