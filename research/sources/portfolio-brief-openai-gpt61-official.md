Source: https://openai.com/index/introducing-gpt-6-1-sol/
Title: Introducing GPT-6.1 Sol | OpenAI
Fetched: 2026-10-04T08:32:56.358Z

Introducing GPT-6.1 Sol \| OpenAI

# GPT-6.1Sol

## Near-Astra intelligence for a fifth of the price

We’re introducing **GPT‑6.1 Sol**, an upgrade to GPT‑6 Sol that nearly matches GPT‑6 Astra’s intelligence on agentic coding, computer use, and professional work at one-fifth of Astra’s standard input and output token prices. Cached input costs just **$0.10 per million tokens**—95% less than standard input pricing and 50% less than GPT‑6 Sol’s cached input pricing—giving developers more room to build and run capable agents that reuse context across requests.

- ### GPT-6Astra









Our most intelligent model for the
best results.



input$10.00



output$50.00



cached input$1.00

- ### GPT-6.1Sol









Near-Astra intelligence for a fifth of the price.



input$2.00



output$10.00



cached input$0.10

- ### GPT-6Luna









Fast and efficient everyday work
at scale.



input$0.10



output$0.50



cached input$0.01


## A more capable Sol across tasks

GPT‑6.1 Sol offers a new balance of capability and cost for important everyday work. It delivers substantial improvements over GPT‑6 Sol across complex professional tasks, from writing and debugging code to understanding documents and executing multi-step business workflows. On several of these evaluations, it approaches GPT‑6 Astra’s performance at substantially lower cost.

### Coding

On **DeepSWE v1.1**, which evaluates complex software-engineering tasks in real codebases, GPT‑6.1 Sol matches GPT‑6 Astra at roughly one-fifth of the cost, while eclipsing GPT‑6 Sol’s best score by 6.4 percentage points at a lower reasoning effort and cost.

DeepSWE

GPT-6.1 Sol

GPT-6 Sol

GPT-6 Astra

$0$2$4$6$8Cost per task0%20%40%60%80%ScoreGPT-6.1 SolGPT-6 SolGPT-6 Astra

_In_ [_DeepSWE 1.1⁠_ ⁠(opens in a new window)](https://deepswe.datacurve.ai/) _, AI agents solve original, long-horizon software engineering tasks._

### Professional work

On **GDP.pdf**, which measures how accurately models answer professional questions using complex PDF documents, including tables, charts, diagrams, and fine-print details, GPT‑6.1 Sol scores higher than Opus 5.5 with fallbacks at less than half the cost per task across the tested reasoning settings. It also approaches GPT‑6 Astra’s state-of-the-art performance at roughly one-fifth the cost per task.

GDP.pdf

GPT-6.1 Sol

GPT-6 Sol

GPT-6 Astra

Opus 5.5
w/ fallbacks

$0$0.50$1$1.50$2Cost per task20%22%24%26%28%30%32%34%ScoreGPT-6.1 SolGPT-6 SolGPT-6 AstraOpus 5.5w/ fallbacks

_In_ [_GDP.pdf_ ⁠(opens in a new window)](https://surgehq.ai/benchmarks/gdp-pdf) _, models must answer real-world prompts about complex PDFs pulled from professional workflows in finance, healthcare, legal, and seven other professional domains._

On **AutomationBench**, which measures whether agents correctly complete multi-step business workflows, GPT‑6.1 Sol scores 2.2 percentage points above Opus 5.5 at medium reasoning effort, at roughly a third of the cost. That score is also up 4.8 percentage points from GPT‑6 Sol at the same setting.

AutomationBench

GPT-6.1 Sol

GPT-6 Sol

GPT-6 Astra

Opus 5.5
w/ fallbacks

Fable 5.1
w/ Opus 5 fallback

$0$0.50$1$1.50$2Cost per task0%10%20%30%40%50%ScoreGPT-6.1 SolGPT-6 SolGPT-6 AstraOpus 5.5w/ fallbacksFable 5.1w/ Opus 5 fallback

_In_ [_AutomationBench 1.0.6⁠_ ⁠(opens in a new window)](https://zapier.com/benchmarks) _, AI agents are tested on end-to-end workflows using 47 tools across sales, marketing, operations, support, finance, and HR. The datapoint for Claude Fable 5.1 understates its actual cost, as it omits the cost of fallbacks, which occurred on ~40% of tasks._

### Computer use

GPT‑6.1 Sol also makes substantial progress on tasks that require interacting with computer applications. On **OSWorld 2.0**’s offline set, which evaluates agents on demanding computer-use workflows, GPT‑6.1 Sol outperforms GPT‑6 Sol by seven percentage points at maximum reasoning effort at less than half the cost. It comes within 2.1 percentage points of Astra’s score at maximum reasoning effort at roughly one-seventh the cost per task.

OSWorld 2.0, offline set

GPT-6.1 Sol

GPT-6 Sol

GPT-6 Astra

$0$2$4$6$8$10Cost per task40%45%50%55%60%65%70%75%ScoreGPT-6.1 SolGPT-6 SolGPT-6 Astra

_In_ [_OSWorld 2.0⁠_ ⁠(opens in a new window)](https://osworld-v2.xlang.ai/) _, AI agents attempt long-horizon computer-use workflows spanning everyday and professional tasks. We report the partial reward on the offline set from the v2026.08.08 release._

### Scientific research

On **Terminal-Bench Science 0.1**, which evaluates scientific workflows including data analysis, simulation, and theorem proving, GPT‑6.1 Sol more than doubles GPT‑6 Sol’s score at maximum reasoning effort at less than half the cost per task. At maximum effort, GPT‑6.1 Sol costs $5.47 per task on average, compared with $23.21 for Opus 5.5 and $23.80 for Astra, delivering substantial scientific capability at over 75% lower cost than either model.

GPT‑6 Astra still achieves the highest score among the models tested at 68.1%, and should be used for the most difficult scientific research tasks.

Terminal-Bench Science 0.1

GPT-6.1 Sol

GPT-6 Sol

GPT-6 Astra

Opus 5.5 w/ fallbacks

$0$5$10$15$20$25Cost per task0%10%20%30%40%50%60%70%ScoreGPT-6.1 SolGPT-6 SolGPT-6 AstraOpus 5.5 w/ fallbacks

_In_ [_Terminal-Bench Science 0.1_ ⁠(opens in a new window)](https://www.terminal-bench-science.ai/) _, agents complete scientific research workflows using code and terminal tools, including analyzing data, running simulations, and fitting models._

### Factuality

GPT‑6.1 Sol also improves factual accuracy on difficult prompts. Its largest factuality improvement over GPT‑6 Sol comes at low reasoning effort, where it reduces the share of responses containing a factual error from 11.4% to 7.7%—a reduction of approximately 32%. Across the tested reasoning settings, its error rate remains within 1.9 percentage points of GPT‑6 Astra’s, at less than one-fifth the cost per task.

This evaluation measures the share of answers containing at least one factual error on de-identified conversations where users flagged an earlier model’s error. These deliberately difficult prompts are not representative of typical usage.

Factual error rate on difficult prompts (lower is better)

GPT-6.1 Sol

GPT-6 Sol

GPT-6 Astra

$0$0.20$0.40$0.60$0.80Cost per task0%5%10%15%20%Answers with any factual errorGPT-6.1 SolGPT-6 SolGPT-6 Astra

_We evaluate factuality on de-identified ChatGPT conversations where users had flagged a factual error from a prior model. These error-inducing conversations are not representative of typical usage, where factual errors are more rare._

## Deploying GPT‑6.1 Sol safely

GPT‑6.1 Sol shows substantial improvements over GPT‑6 Sol in our alignment evaluations, bringing it closer to GPT‑6 Astra.

GPT‑6.1 Sol is more transparent about its limitations and more reliable at respecting user intent and safety constraints. In challenging evaluations, it shows lower failure rates than GPT‑6 Sol on transparency about broken search tools, respecting explicit restrictions, and avoiding unauthorized outcomes during agentic tasks. We observed no attempts to bypass an automated safety reviewer, matching GPT‑6 Astra and GPT‑6 Sol. Full details can be found in the [GPT‑6.1 Sol system card addendum⁠(opens in a new window)](https://deploymentsafety.openai.com/gpt-6-1-sol).

The evaluations below deliberately test challenging situations and do not measure failure rates in typical use.

Failure to disclose a broken search tool (lower is better)

GPT-6AstraGPT-6.1SolGPT-6 SolGPT-6Luna0%20%40%60%80%100%Non-disclosure rate2.1%1.5%4.9%28.7%

_This evaluation tests whether agents tell the user when their search tool is broken instead of giving their best guess. GPT‑6.1 Sol fails to disclose the problem in 2.1% of cases, compared with 4.9% for GPT‑6 Sol, 1.5% for GPT‑6 Astra, and 28.7% for GPT‑6 Luna. Tasks are selected to elicit failures and do not represent typical usage. Effort was set to maximum._

## Pricing and availability

GPT‑6.1 Sol is available starting today to all Plus, Pro, Business, Enterprise, and Edu users in ChatGPT Work and Codex. GPT‑6.1 Sol is not yet available in Chat. Developers can also access it through the OpenAI API as gpt-6.1-sol. Its standard API prices are $2 per million input tokens, $0.10 per million cached input tokens, and $10 per million output tokens. In the coming days, we’ll also offer GPT‑6.1 Sol [Ultrafast⁠](https://openai.com/index/devday-2026-recap/), with up to 8x faster token generation compared to its standard speed in Codex.

- [2026](https://openai.com/news/?tags=2026)
- [GPT](https://openai.com/news/?tags=gpt)

## Author

OpenAI

_Evaluations of GPT were performed in our research environment or via our API, which may provide slightly different output from production ChatGPT due to differences in the system prompts, tools available, efforts, etc. Evaluations of competitor models were taken from publicly available reports._

## Keep reading

[View all](https://openai.com/news/)

![Introducing GPT-6 Sol and Luna — Art card](https://images.ctfassets.net/kftzwdyauwt9/4HANTuYDvaT04gpR91bEQ9/885481304c5675cb7525bcccbe8c5580/gpt-6-sol-luna-art.png?w=3840&q=90&fm=webp)

[Introducing GPT-6 Sol and Luna\\
\\
ProductSep 22, 2026](https://openai.com/index/introducing-gpt-6-sol-and-luna/)

Your browser does not support the video tag.

[GPT-6 Astra: A new generation of intelligence\\
\\
ResearchSep 3, 2026](https://openai.com/index/gpt-6-astra/)

![DevDay 2026 Recap — cover image (1:1)](https://images.ctfassets.net/kftzwdyauwt9/1C75hfnvbohzm6Fx3hd7ux/1391c894029045aa51d520e4d80f6f4b/DevDay_Blog_ArtCard_1x1.png?w=3840&q=90&fm=webp)

[DevDay 2026 Recap\\
\\
CompanySep 29, 2026](https://openai.com/index/devday-2026-recap/)