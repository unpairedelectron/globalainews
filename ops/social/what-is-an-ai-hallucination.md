# Social copy: What Is an AI Hallucination?

URL: https://www.globalainews.in/article/what-is-an-ai-hallucination/

## WhatsApp Channel (≤60 words + link)

A hallucination is a plausible but false statement, said confidently. The cause is not a glitch. OpenAI's research argues models guess because the way we grade them rewards guessing: a wrong guess sometimes scores, "I don't know" always scores zero. The fix starts with the scoreboard, not the model.

https://www.globalainews.in/article/what-is-an-ai-hallucination/

## X (≤270 chars)

Why models make things up:

Grade on accuracy alone and guessing beats honesty. A wrong guess sometimes scores; "I don't know" never does.

OpenAI's numbers: 24% accuracy, 75% errors — vs 22% and 26%.

https://www.globalainews.in/article/what-is-an-ai-hallucination/

## LinkedIn (≤120 words)

The most useful table OpenAI has published on hallucination has two columns and three rows.

One model: 22% accuracy, 26% error rate, abstains 52% of the time.
An older model: 24% accuracy, **75%** error rate, abstains 1% of the time.

The older model wins on accuracy. It is also wrong three times in four.

That is the whole problem. Graded only on accuracy, guessing beats honesty, because a wrong guess sometimes scores and "I don't know" always scores zero. OpenAI's research argues this is why hallucination persists as models improve.

So if you compare models on a single accuracy number, you are selecting for confident error. Measure the error rate.

https://www.globalainews.in/article/what-is-an-ai-hallucination/

## Telegram

**What is an AI hallucination, and why won't it go away?**

A plausible but false statement, produced confidently.

**Where it starts:** pretraining predicts the next word across fluent text with "no 'true/false' labels attached to each statement". Spelling follows patterns, so it improves with scale. Arbitrary low-frequency facts — names, dates, citations — don't, so they can't be learned from patterns at all. OpenAI's analogy: labelling pet photos with each pet's *birthday*.

**Why it persists:** evaluations reward guessing. From OpenAI's SimpleQA table — 22% accuracy / 26% errors vs 24% accuracy / **75%** errors. The more accurate model is wrong far more often.

**History:** TruthfulQA (2021) found the best model truthful on 58% of questions against 94% for humans — and "the largest models were generally the least truthful".

**For Indian languages:** OpenAI's own example is that a model knowing *no* Māori can simply say "I don't know", while one knowing *some* must judge its confidence. Partial coverage is the hard case — which is where Hindi, Tamil and Marathi sit.

https://www.globalainews.in/article/what-is-an-ai-hallucination/
