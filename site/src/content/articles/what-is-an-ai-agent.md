---
title: "What Is an AI Agent? A Plain-English Guide to How AI Agents Work"
seoTitle: "What Is an AI Agent? A Plain-English Guide"
description: "An AI agent is a model that plans, uses tools and takes actions in a loop until a goal is met. How agents differ from chatbots and workflows, where they fail, and how to use them safely."
category: "models"
image: "/images/articles/what-is-an-ai-agent/hero.jpg"
imageAlt: "What Is an AI Agent? A Plain-English Guide to How AI Agents Work"
tags: ["AI agents", "Explainer", "LLMs"]
date: "2026-11-10T07:30:00Z"
takeaways:
  - "An AI agent is a language model that decides its own next steps—calling tools, reading results and acting again—until it reaches a goal or stops."
  - "A chatbot answers; a workflow follows steps a developer wrote in advance; an agent chooses the steps itself. Most useful products today mix all three."
  - "Agents fail in predictable ways: small errors compound over many steps, tools can be misused, and broad permissions turn mistakes into real damage."
  - "Give an agent the narrowest permissions that work, require approval for anything irreversible, and log every action."
---
## The bottom line

An **AI agent** is a system in which a large language model (LLM) doesn’t just answer a question—it **decides what to do next, does it, looks at the result and repeats** until a task is done. The “doing” happens through tools: a web search, a code interpreter, a calendar, a company database, a browser or another app. The loop is what makes something an agent. [1][2]

That sounds simple, but it changes the risks. A chatbot that gets something wrong produces a wrong answer. An agent that gets something wrong can send the email, delete the file or buy the ticket. Understanding where an agent sits on the spectrum—from fixed workflow to open-ended autonomy—is the most useful thing you can know before using or building one.

## Chatbot vs workflow vs agent

The word “agent” is used loosely in marketing. A useful distinction, which Anthropic set out in its widely cited engineering guide, separates **workflows**, where a developer hard-codes the sequence of model and tool calls, from **agents**, where the model directs its own process and tool use. [1]

| | Chatbot | Workflow | Agent |
|---|---|---|---|
| Who decides the steps? | No steps: one question, one answer | The developer, in advance | The model, at run time |
| Uses tools? | Sometimes (e.g. search) | Yes, in a fixed order | Yes, chosen as needed |
| Example | “Summarise this article” | “Classify each support ticket, then route it to a team” | “Find out why last night’s build failed and open a fix” |
| Predictability | High | High | Lower |
| Typical failure | Wrong or invented answer | Breaks when an input doesn’t fit | Goes off track over many steps |

Most real products combine these. A coding assistant may run a fixed workflow (run tests, read errors) inside an agent loop that decides which file to edit next. The practical advice from developers who build these systems is to start with the simplest option that works and only add autonomy where it clearly pays off. [1]

## How an agent actually works

Under the hood, almost every agent runs the same loop:

1. **Goal.** A person (or another system) gives a task: “Book the cheapest refundable flight to Bengaluru next Friday.”
2. **Plan / reason.** The model writes out what it thinks it should do next.
3. **Act.** It calls a tool with specific inputs, for example a flight-search API.
4. **Observe.** The tool’s output is fed back into the model.
5. **Repeat or stop.** The model decides whether the goal is met, whether to try something else, or whether to ask the person.

This “reason, then act, then observe” pattern was popularised by the **ReAct** research paper, which showed that interleaving reasoning steps with tool actions made models more accurate on multi-step tasks than reasoning or acting alone. [2] Earlier work such as **Toolformer** showed that language models could learn when and how to call external tools like calculators and search engines. [3]

Three ingredients turn this loop into a usable product:

- **Tools** with clear descriptions, so the model knows what each one does. Open standards such as the **Model Context Protocol (MCP)** aim to let one agent connect to many tools and data sources in a consistent way. [7]
- **Memory or state**, so the agent can keep track of what it has already tried. Within a single task this is usually the model’s context window; across tasks it needs separate storage. Retrieval systems (RAG) can also feed it relevant documents.
- **Stopping rules**: a step limit, a budget, or a point at which the agent must hand back to a person.

## What agents are good at today

Agents work best when the task has **a clear goal, a way to check progress, and cheap mistakes**:

- **Software development.** Running code and tests gives instant, objective feedback. That is one reason coding agents spread fast; GitHub reports that agents now start a large and growing share of pull requests on its platform. (See our analysis of [GitHub’s Octoverse 2026 numbers](/article/github-octoverse-2026-agents-pull-requests/).)
- **Research and summarisation** across many documents or web pages, where a person reviews the output.
- **Data tasks** such as cleaning a spreadsheet, writing a query and checking the result.
- **IT and operations triage**: reading logs, suggesting a cause and drafting a fix for approval.

They are weaker at long, open-ended tasks in messy environments—operating a desktop computer, navigating unfamiliar websites, or anything where a single wrong click is costly. Benchmarks such as **OSWorld**, which tests agents on real computer tasks, have shown large gaps between agents and people, even as scores improve. [6] (More in our piece on [why reliability is the real test for agents](/article/reliability-is-the-new-ai-moat/).)

## Why agents fail

- **Compounding errors.** If each step is 95% reliable, a 20-step task succeeds far less often than any single step suggests. Long tasks magnify small error rates.
- **Getting lost.** Agents can loop, repeat a failing action or pursue a sub-goal that no longer matters.
- **Misreading tools or pages.** A tool returns something unexpected, or a web page contains instructions the agent mistakes for the user’s. This is called **prompt injection**, and it is one of the main security risks for agents that read untrusted content.
- **Too much permission.** OWASP’s Top 10 for LLM applications lists **“excessive agency”**—giving a model more functionality, permissions or autonomy than it needs—as a core risk, because it turns a model mistake into real-world damage. [4]

## How to use agents safely

Whether you are trying a consumer agent or deploying one at work, the same rules apply:

1. **Least privilege.** Give the agent access only to the accounts, files and actions the task needs—read-only where possible. [4]
2. **Approval for irreversible actions.** Payments, deletions, sending messages and changing permissions should need a person’s confirmation, with enough detail to make a real decision.
3. **Separate identity.** Prefer giving an agent its own scoped account or a brokered sign-in over sharing your password.
4. **Logs and limits.** Record every tool call, cap steps and spending, and make it easy to revoke access.
5. **Treat outside content as untrusted.** Emails, web pages and documents an agent reads can contain hidden instructions. Don’t let content alone trigger sensitive actions.

## FAQ

### Is ChatGPT an AI agent?
A plain chat conversation is not an agent: you ask, it answers. But many assistants, including ChatGPT, Claude, Gemini and Copilot, now include agent features that browse, run code or operate apps on your behalf. When those features are switched on and the model chooses its own steps, it is acting as an agent. (See our [AI assistants comparison](/reports/ai-assistants-compared/).)

### What is the difference between an AI agent and automation like Zapier?
Traditional automation follows rules a person wrote: “when X happens, do Y.” An agent decides what to do based on the goal and what it observes. Many products now mix both—fixed automation for predictable steps, an agent for the judgement calls.

### Are AI agents the same as AGI?
No. Agents are a way of using today’s models in a loop with tools. They can be very capable at specific tasks while still making basic mistakes. “Agentic” describes how a system is wired, not how intelligent it is.

### What is a multi-agent system?
A setup in which several agents, often with different roles (planner, researcher, reviewer), pass work between each other. It can help with large tasks, but it adds cost and more places for errors to creep in.

### Can an AI agent spend my money?
Only if it has been given access to a payment method or an account that can buy things. That is exactly the kind of permission that should require your approval each time.

## Sources

1. Anthropic, *Building effective agents*, 19 December 2024. https://www.anthropic.com/engineering/building-effective-agents
2. Yao, S. et al., *ReAct: Synergizing Reasoning and Acting in Language Models*, arXiv:2210.03629 (ICLR 2023). https://arxiv.org/abs/2210.03629
3. Schick, T. et al., *Toolformer: Language Models Can Teach Themselves to Use Tools*, arXiv:2302.04761, 2023. https://arxiv.org/abs/2302.04761
4. OWASP GenAI Security Project, *LLM06:2025 Excessive Agency*. https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
5. Russell, S. and Norvig, P., *Artificial Intelligence: A Modern Approach*, 4th edition, Pearson, 2020 (definition of an agent as perceiving and acting upon an environment).
6. Xie, T. et al., *OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments*, arXiv:2404.07972, 2024. https://arxiv.org/abs/2404.07972
7. Model Context Protocol, official documentation. https://modelcontextprotocol.io

## Methodology note

This explainer was researched and drafted with AI assistance and checked against the sources listed above. It describes general concepts rather than any single product. See our [editorial policy](/editorial-policy/).
