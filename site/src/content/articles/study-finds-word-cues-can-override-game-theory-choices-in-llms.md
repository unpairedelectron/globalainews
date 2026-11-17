---
title: "Do Word Labels Steer How LLMs Play the Prisoner’s Dilemma? What a New Preprint Finds"
seoTitle: "Word Cues and LLM Cooperation: What a Preprint Finds"
description: "A preprint finds large AI models cooperate in the Prisoner’s Dilemma because of the word “Cooperate”, not strategy. Swap in neutral labels and the effect vanishes. What it means for AI agents."
category: "research"
tags: ["LLMs","Interpretability","Game theory"]
date: "2026-09-21"
updated: "2026-11-15"
image: "/images/articles/study-finds-word-cues-can-override-game-theory-choices-in-llms/hero-1024.webp"
imageAlt: "Abstract editorial visual for the edge reporting"
takeaways:
  - "In a preprint, Llama-3-70B, Qwen2.5-32B and Qwen2.5-72B always cooperated in a standard Prisoner’s Dilemma, while the smaller Llama-3-8B played close to the self-interested “Nash” choice."
  - "Inside the models, the authors find the Nash answer leading for about three-quarters of the network before a late switch to cooperation, which they call a cooperative override."
  - "The override is triggered by words: it survives renaming the players and rescaling the payoffs, but disappears when “Cooperate” and “Defect” become neutral labels."
  - "In 48 games with random payoffs and neutral labels, no model consistently cooperated or showed general game-theory competence."
  - "In mixed groups of AI agents, the authors report that a single Nash-playing agent made cooperation collapse."
---
## The bottom line

**A new preprint argues that large AI models “cooperate” in the classic Prisoner’s Dilemma because of the word *Cooperate*, not because of strategic reasoning.** When the action labels were replaced with neutral ones, the effect switched off. [1]

The authors, Paraskevas V. Lekeas and Giorgos Stamatopoulos, conclude that “what suppresses Nash play in large language models is a word-triggered circuit rather than missing competence”. They also say it “can be measured, bounded, and controlled”. [1]

This is a single preprint, not yet independently replicated. But it carries a practical warning for anyone testing AI agents: a model’s choice can depend on the *words* in a task as much as on its *structure*. Change the labels before you trust the result.

## Key facts at a glance

| | |
|---|---|
| Paper | *How a Cooperative-Override Circuit Suppresses Nash Play in Large Language Models* [1] |
| Versions | First posted 29 April 2026; latest version (v4) 17 October 2026 [1] |
| Models tested | Llama-3-8B, Llama-3-70B, Qwen2.5-32B, Qwen2.5-72B (instruction-tuned) [1] |
| Main behaviour | The three larger models locked at full cooperation with zero variance; Llama-3-8B played near-Nash [1] |
| Internal finding | Nash leads for about three-quarters of network depth, then a late surge toward cooperation [1] |
| Control | In Llama-3-8B, one direction in the model’s activations steers the decision monotonically (Spearman ρ = 1.000) [1] |
| Robustness | Survives name removal and payoff rescaling; disengages with neutral labels [1] |

## What is the Prisoner’s Dilemma, and what is “Nash play”?

In the Prisoner’s Dilemma, two players each choose to cooperate or defect. Both do better if both cooperate. But each player individually gains by defecting, whatever the other does. The game-theory prediction for a single round, the **Nash equilibrium**, is that both defect.

So a model that always cooperates in a one-shot game is, by that standard, far from the Nash prediction. The paper measures exactly that distance. [1]

Earlier research had found language models doing *well* at this family of games. In 2023, Akata and colleagues had several models play repeated two-by-two games with each other and with people. They found models “perform particularly well at self-interested games like the iterated Prisoner’s Dilemma family”, but behave sub-optimally in games that need coordination. [2] The new preprint asks a different question: not how well models play, but *why* they choose what they choose.

## What the researchers found inside the models

The authors used a **logit lens**, a technique that decodes a model’s intermediate layers into word predictions to see how an answer forms as text passes through the network. [1] The method is known to be useful but “often brittle”, which is why refinements such as the tuned lens exist. [3]

Their reading is a “distributed cooperative override”. [1]

- Through roughly **three-quarters of the network’s depth**, intermediate readouts lean toward the Nash (defect) action.
- Then comes a **late surge toward cooperation**, and the final layer settles the contest.
- The size of that **final correction**, rather than the surge, matched the models’ chain-of-thought behaviour across model sizes and both architectures.

In Llama-3-8B, the authors found the override behaves like a single direction in the model’s internal activations. Steering along it “dials the decision”. Clamping it at one position in one layer moved the choice strictly monotonically, with Spearman ρ = 1.000, while the generated text stayed fluent. [1] This builds on **activation steering**, a family of techniques that change a model’s internal activations at inference time to control its outputs, for example to shift sentiment. [4]

## The key test: change the words

The strongest evidence that this is about words, not strategy, comes from changing the prompt. [1]

| Change | Did the cooperation effect survive? |
|---|---|
| Removing player names | Yes |
| Rescaling the payoffs | Yes |
| Replacing “Cooperate” and “Defect” with neutral labels | **No** |

The authors then ran **48 games with random payoffs and neutral labels**. No model locked into cooperation on any dilemma, and none showed “general equilibrium competence”. [1] In other words, once the familiar words were gone, the models neither cooperated reliably nor played the game-theoretically correct move reliably.

## One defector changes the group

The paper also tested groups of AI agents built on different models. It reports that “a single Nash-playing agent collapses cooperation contagiously”. [1] That matters for multi-agent systems, where several AI agents negotiate or trade with each other: one agent with different instincts may shift the behaviour of the whole group.

## What this means for…

**People building AI agents.** If an agent negotiates, bids or allocates resources, test it with neutral wording as well as natural wording. Its choices may track loaded words such as “cooperate” or “fair” rather than the actual incentives. See our explainer on [what an AI agent is](/article/what-is-an-ai-agent/).

**AI evaluators.** Benchmarks that use familiar labels may be measuring vocabulary as well as reasoning. Vary the labels, report where an effect disappears, and separate a model’s stated reasoning from its action.

**Researchers.** The paper offers a measurable, steerable mechanism for one behaviour in one model. It is a good candidate for replication across other model families, larger models and repeated games.

## What the study doesn’t show

- **No independent replication yet.** This is one preprint, now in its fourth version, and its arXiv listing shows no peer-reviewed publication. [1]
- **Specific models only.** Four open models from two families; no results for the largest commercial systems. [1]
- **Mostly one-shot games.** Repeated games, where cooperation can be rational, are a different setting, and that is where earlier work found models doing well. [2]
- **Interpretation of internals.** Logit-lens readings are an analysis tool, not a direct view of “what the model thinks”, and the method has known limits. [3]

## FAQ

### Do AI models cooperate in the Prisoner’s Dilemma?

In this preprint, the three larger models tested always cooperated in a one-shot game with standard labels, and the smaller Llama-3-8B did not. With neutral labels, none cooperated consistently. [1]

### Why does the word “Cooperate” matter?

The authors find a late-acting internal “override” that pushes the models toward cooperating. It switches off when the actions are given neutral names, so they conclude it is triggered by the words rather than the payoffs. [1]

### What is a logit lens?

A technique that converts a model’s intermediate layers into word predictions, to see how an answer develops through the network. Researchers note it can be brittle, and refinements such as the tuned lens aim to improve it. [3]

### Are AI models bad at game theory?

Not simply. Earlier work found models did well in repeated Prisoner’s Dilemma-style games but struggled with coordination games. [2] This preprint suggests their choices can depend heavily on wording. [1]

### What is activation steering?

Changing a model’s internal activations while it runs, to push its output in a chosen direction, such as more positive sentiment, without retraining it. [4]

## Sources

**Primary**

1. Lekeas and Stamatopoulos, *How a Cooperative-Override Circuit Suppresses Nash Play in Large Language Models*, arXiv:2604.27167, version 4, 17 October 2026 (first posted 29 April 2026). https://arxiv.org/abs/2604.27167v4
2. Akata et al., *Playing repeated games with Large Language Models*, arXiv:2305.16867, May 2023 (revised May 2025). https://arxiv.org/abs/2305.16867
3. Belrose et al., *Eliciting Latent Predictions from Transformers with the Tuned Lens*, arXiv:2303.08112, March 2023 (revised November 2025). https://arxiv.org/abs/2303.08112
4. Turner et al., *Steering Language Models With Activation Engineering*, arXiv:2308.10248, August 2023 (revised October 2024). https://arxiv.org/abs/2308.10248

## Methodology note

This article was first published in September 2026 and substantially updated on 15 November 2026. Research and drafting were AI-assisted, and every claim was checked against the sources above on 15 November 2026. The explanation of the Prisoner’s Dilemma and Nash equilibrium is standard game theory. See our [editorial policy](/editorial-policy/).

## Update

**15 November 2026:** We updated this article to cite version 4 of the preprint (17 October 2026), whose abstract matches version 3. We added the authors, background on the Prisoner’s Dilemma and Nash play, earlier research on language models in repeated games, context on the logit-lens and activation-steering techniques, the paper’s multi-agent “contagion” finding, and an FAQ.
