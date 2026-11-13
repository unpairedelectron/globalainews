---
title: "AI Agents Are Getting Better at OSWorld, but Reliability Is Still the Real Test"
seoTitle: "AI Agents on OSWorld: Why Reliability Is the Real Test"
description: "AI agents went from about 12% to 66.3% on OSWorld’s real computer tasks, near the 72% human level. Why that still isn’t workplace reliability, and how to test agents yourself."
category: "models"
tags: ["AI agents","Benchmarks","OSWorld"]
date: "2026-09-21"
updated: "2026-11-13"
image: "/images/articles/reliability-is-the-new-ai-moat/hero-1024.webp"
imageAlt: "An abstract computer-task benchmark score beside its human comparison"
takeaways:
  - "On OSWorld, a test of 369 real computer tasks, the best AI agent’s success rate rose from about 12% to 66.3%, according to Stanford’s 2026 AI Index."
  - "That is within about 6 percentage points of the 72.35% human baseline, but it still means roughly one failed attempt in three."
  - "A single success rate hides consistency. On τ-bench, GPT-4o succeeded on under 50% of tasks and on fewer than 25% of retail tasks across eight repeated tries."
  - "Before trusting an agent with real work, test it on your own tasks several times, and track errors, recoveries and human interventions, not just completions."
---
## The bottom line

**AI agents have become dramatically better at using a computer, but not yet reliable enough to leave alone.** On OSWorld, a benchmark of 369 real computer tasks, the best agent’s success rate rose from roughly 12% to 66.3%, within about 6 points of the 72.35% human baseline, according to Stanford’s 2026 AI Index. [1]

That is real progress. But 66.3% still means about one failed attempt in three, and the Index itself says agents “still fail roughly one in three attempts on structured benchmarks”. [1] A single success rate also says nothing about whether an agent succeeds *consistently* on the same task, which is what a business needs. Research that measures consistency directly finds it much lower than one-try scores suggest. [3]

## Key facts at a glance

| | |
|---|---|
| What OSWorld tests | 369 tasks across real desktop and web apps, file operations and multi-app workflows, on Ubuntu, Windows and macOS [1][2] |
| Best agent at launch (April 2024) | 12.24% success [2] |
| Human performance | 72.36% in the original paper; 72.35% in the AI Index chart [1][2] |
| Best agent in 2025 | 66.3% (Claude Opus 4.5), per the AI Index, using Epoch AI data [1] |
| Remaining gap | About 6 percentage points [1] |
| Human speed | Computer science students solved tasks with a median time of about two minutes [1] |

## What OSWorld measures

OSWorld puts an agent in front of a real operating system and asks it to complete an open-ended task: editing a spreadsheet, changing a setting, moving data between applications. Each task has its own starting setup and an evaluation script that checks the end result. [2]

When the benchmark launched in April 2024, the best model succeeded on 12.24% of tasks, while people managed 72.36%. The authors said the models struggled mainly with “GUI grounding and operational knowledge”, that is, finding the right thing on screen and knowing how software works. [2]

The AI Index describes how quickly that changed. Models had historically reached “only 1%–12% success”, but by 2025 Claude Opus 4.5 led with 66.3%. That makes OSWorld one of the benchmarks where the gap between models and humans “has closed the fastest”. [1] Anthropic, which makes Claude, called Opus 4.5 “the best model in the world for coding, agents, and computer use” when it launched it in November 2025. [4]

## Why 66% isn’t the same as “reliable”

**One in three still fails.** At 66.3%, roughly a third of benchmark attempts miss. For a draft email that is tolerable. For a payment, a customer record or a system setting it is not. [1]

**One try isn’t consistency.** A success rate usually counts whether the agent got each task right once. τ-bench, a 2024 benchmark of agents serving simulated customers with real tools and company policies, introduced a stricter metric, **pass^k**: the chance an agent succeeds on the same task in *all* of *k* tries. [3]

The results were sobering. State-of-the-art function-calling agents, including GPT-4o, succeeded on under 50% of tasks, and pass^8 in the retail domain was under 25%. In plain terms, they rarely got the same job right eight times in a row. [3] The authors concluded that agents need to “act consistently and follow rules reliably”. [3]

**Benchmarks are cleaner than workplaces.** OSWorld’s tasks are realistic, but a test environment can’t reproduce every company login, permission rule, odd record format or outage. Those are exactly where a deployed agent can go wrong.

## Reliability includes recovery

In real work, reliability means more than finishing a task on the first try. A dependable agent also needs to:

- notice when it lacks information, and ask instead of guessing;
- report when a tool call fails, rather than carrying on;
- stay inside the permissions it was given;
- undo or avoid duplicate changes when it retries.

None of these shows up in a headline success rate. They are why the safest deployments keep a person in the loop for anything consequential. See our explainer on [what an AI agent is](/article/what-is-an-ai-agent/) for how agents plan and act.

## How to test an agent before you trust it

1. **Use your own tasks.** Pick 20–50 representative tasks from the real workflow, including awkward edge cases.
2. **Run each one several times.** Follow τ-bench’s logic and count a task as passed only if the agent succeeds on every run. [3]
3. **Score more than completion.** Track correctness, time taken, retries, tool errors, human interventions and how serious each mistake was.
4. **Separate reversible from irreversible actions.** Let the agent do low-risk tasks alone. Require approval for payments, deletions and messages to customers.
5. **Re-test after every update.** Record the model version, tools and permissions, and re-run the same set when any of them changes.

For comparisons of agent scores on coding tasks specifically, see our guide to [coding-agent benchmarks](/reports/coding-agent-benchmarks-compared/).

## What this means for…

**Businesses, including in India.** Computer-use agents can now handle many routine back-office steps. But the evidence supports supervised use, not autonomy, for anything touching money, customers or records.

**Developers.** Report pass^k-style consistency, not just best-of-one scores, when you evaluate an agent for a client. [3]

**Everyone else.** When an AI product boasts a benchmark score, ask two questions: on how many tries, and how often did a person have to step in?

## FAQ

### What is OSWorld?

A benchmark of 369 computer tasks in real operating systems, including Ubuntu, Windows and macOS. Each one is checked by a script that inspects the final result. [2]

### How good are AI agents at using computers in 2026?

The best agent reached 66.3% on OSWorld in 2025, up from roughly 12%, against a human baseline of about 72%, according to Stanford’s AI Index. [1]

### Are AI agents better than humans at computer tasks now?

Not on OSWorld. Humans still score about 6 percentage points higher, and solve tasks with a median time of about two minutes. [1]

### What is pass^k?

A reliability metric from τ-bench. It is the probability that an agent succeeds on the same task in all of *k* attempts, rather than at least once. [3]

### Can I let an AI agent work unsupervised?

For low-risk, reversible tasks, perhaps, after testing on your own workflow. For anything consequential, current evidence supports keeping a person in the loop. [1][3]

## Sources

**Primary**

1. Stanford Institute for Human-Centered AI, *AI Index Report 2026* (chapter 2.6, AI agents; OSWorld data from Epoch AI). https://hai.stanford.edu/ai-index/2026-ai-index-report
2. Xie et al., *OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments*, arXiv:2404.07972, April 2024 (revised May 2024). https://arxiv.org/abs/2404.07972
3. Yao et al., *τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains*, arXiv:2406.12045, June 2024. https://arxiv.org/abs/2406.12045
4. Anthropic, *Introducing Claude Opus 4.5*, 24 November 2025. https://www.anthropic.com/news/claude-opus-4-5

## Methodology note

This article was first published in September 2026 and substantially updated on 13 November 2026. Research and drafting were AI-assisted, and every figure was checked against the sources above on 13 November 2026, including the full AI Index report. See our [editorial policy](/editorial-policy/).

## Update

**13 November 2026:** We rewrote this article from the full AI Index report, the original OSWorld paper and the τ-bench paper, in addition to the AI Index summary. New: which model holds the 66.3% score, how the benchmark works, the 2024 starting point, the human time baseline, the pass^k consistency metric, a testing checklist and an FAQ. The original OSWorld paper gives the human baseline as 72.36%; the AI Index chart gives 72.35%.
