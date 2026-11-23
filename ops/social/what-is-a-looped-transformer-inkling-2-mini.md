# Social copy: What Is a Looped Transformer? Inkling 2 Mini Reuses 24 Layers to Act Like 48

URL: https://www.globalainews.in/article/what-is-a-looped-transformer-inkling-2-mini/

## WhatsApp Channel (≤60 words + link)

Most ways to make a model smarter cost memory. Looping costs time instead. Thinking Machines' new Apache 2.0 model has 24 layers, but runs the middle 12 three times — 48 layer applications per token from 24 layers of weights. The checkpoint stays about 20GB and runs on a 32GB Mac.

https://www.globalainews.in/article/what-is-a-looped-transformer-inkling-2-mini/

## X (≤270 chars)

Inkling 2 Mini has 24 layers but does 48 layer applications per token.

The middle 12 run three times, reusing the same weights.

Memory stays flat, compute rises. ~20GB, Apache 2.0.

https://www.globalainews.in/article/what-is-a-looped-transformer-inkling-2-mini/

## LinkedIn (≤120 words)

Three parameter counts for one model, and all three are honest: 26.4B total, 3.4B active, about 5.4B effective active per token.

That third number exists because Inkling 2 Mini is a looped transformer. It has 24 layers, but the middle 12 run three times with shared weights — 48 layer applications per token from 24 layers of stored weights.

The trade is deliberate: weights are stored once, so the checkpoint stays about 20GB and runs on Apple silicon with 32GB of memory. You pay in latency instead.

The card is also unusually candid about the cost. It warns the model can get stuck in long reasoning loops, and may delete or overwrite files without confirmation when using tools.

https://www.globalainews.in/article/what-is-a-looped-transformer-inkling-2-mini/

## Telegram

**What is a looped transformer?**

Thinking Machines released Inkling 2 Mini on 20 Nov under Apache 2.0. The architecture is the story.

• 24 layers, but the middle 12 run three times with shared weights → 48 layer applications per token
• 26.4B total / 3.4B active / ~5.4B effective active per token
• Each token routed to 8 of 128 experts; 1M-token context; text + image in
• ~20GB checkpoint, runs on 1x DGX Spark or Apple silicon with 32GB+
• Looping buys compute per token, not memory — you pay in latency

From its own limitations section: weaker factual recall than bigger models, can get stuck in long reasoning loops when debugging, and may take destructive actions with tools without confirming.

One detail from the download data: community GGUF builds have ~34x the downloads of the official checkpoint.

https://www.globalainews.in/article/what-is-a-looped-transformer-inkling-2-mini/
