Source: https://aws.amazon.com/blogs/machine-learning/grok-4-7-is-now-available-on-amazon-bedrock/
Title: Grok 4.7 is now available on Amazon Bedrock | Artificial Intelligence
Fetched: 2026-10-04T08:40:22.770Z
Publication date: Not visible in the captured page

## Select your cookie preferences

We use essential cookies and similar tools that are necessary to provide our site and services. We use performance cookies to collect anonymous statistics, so we can understand how customers use our site and make improvements. Essential cookies cannot be deactivated, but you can choose “Customize” or “Decline” to decline performance cookies.

If you agree, AWS and approved third parties will also use cookies to provide useful site features, remember your preferences, and display relevant content, including relevant advertising. To accept or decline all non-essential cookies, choose “Accept” or “Decline.” To make more detailed choices, choose “Customize.”

AcceptDeclineCustomize

## Customize cookie preferences

We use cookies and similar tools (collectively, "cookies") for the following purposes.

### Essential

Essential cookies are necessary to provide our site and services and cannot be deactivated. They are usually set in response to your actions on the site, such as setting your privacy preferences, signing in, or filling in forms.

### Performance

Performance cookies provide anonymous statistics about how customers navigate our site so we can improve site experience and performance. Approved third parties may perform analytics on our behalf, but they cannot use the data for their own purposes.

Allowed

### Functional

Functional cookies help us provide useful site features, remember your preferences, and display relevant content. Approved third parties may set these cookies to provide certain site features. If you do not allow these cookies, then some or all of these services may not function properly.

Allowed

### Advertising

Advertising cookies may be set through our site by us or our advertising partners and help us deliver relevant marketing content. If you do not allow these cookies, you will experience less relevant advertising.

Allowed

Blocking some types of cookies may impact your experience of our sites. You may review and change your choices at any time by selecting Cookie preferences in the footer of this site. We and selected third-parties use cookies or similar technologies as specified in the [AWS Cookie Notice](https://aws.amazon.com/legal/cookies/).

CancelSave preferences

## Your privacy choices

We and our advertising partners (“we”) may use information we collect from or about you to show you ads on other websites and online services. Under certain laws, this activity is referred to as “cross-context behavioral advertising” or “targeted advertising.”

To opt out of our use of cookies or similar technologies to engage in these activities, select “Opt out of cross-context behavioral ads” and “Save preferences” below. If you clear your browser cookies or visit this site from a different device or browser, you will need to make your selection again. For more information about cookies and how we use them, read our [Cookie Notice](https://aws.amazon.com/legal/cookies/).

Allow cross-context behavioral adsOpt out of cross-context behavioral ads

To opt out of the use of other identifiers, such as contact information, for these activities, fill out the form [here](https://pulse.aws/application/ZRPLWLL6?p=0).

For more information about how AWS handles your information, read the [AWS Privacy Notice](https://aws.amazon.com/privacy/).

CancelSave preferences

## Unable to save cookie preferences

We will only store essential cookies at this time, because we were unable to save your cookie preferences.

If you want to change your cookie preferences, try again later using the link in the AWS console footer, or contact support if the problem persists.

Dismiss

 [Skip to Main Content](https://aws.amazon.com/blogs/machine-learning/grok-4-7-is-now-available-on-amazon-bedrock/#aws-page-content-main)

## [Artificial Intelligence](https://aws.amazon.com/blogs/machine-learning/)

# Grok 4.7 is now available on Amazon Bedrock

xAI’s Grok 4.7 is now available on [Amazon Bedrock](https://aws.amazon.com/bedrock/), adding a frontier model built for coding, long-running agents, and knowledge work to the Bedrock model catalog. It offers a 500K token context window and supports configurable reasoning effort at four levels: `low`, `medium`, `high`, and `xhigh`.

Grok 4.7 is served on the `bedrock-runtime` endpoint through cross-Region inference profiles, and it supports the Responses, Chat Completions, and Converse APIs. According to xAI, it’s their most capable model for coding and knowledge work: it works longer on difficult tasks and verifies its own output more carefully before moving on.

This post covers what xAI says Grok 4.7 is designed for, how it is packaged on Amazon Bedrock, and how to send your first request.

## What Grok 4.7 is built for

The capability and training details in this section come from xAI’s launch announcement, [Introducing Grok 4.7](https://x.ai/news/grok-4-7), published September 21, 2026, and from the [Grok 4.7 model documentation](https://docs.x.ai/developers/models/grok-4.7).

xAI positions Grok 4.7 as its most capable model for coding and knowledge work. The theme is endurance rather than raw speed: the model works longer on difficult tasks and checks its own work more carefully before moving on.

On training, xAI reports that Grok 4.7 uses a new and larger base model. It was trained with a longer reinforcement learning run over a harder mix of tasks, deliberately weighted toward problems that take many hours to complete. Two capabilities came out of that: the model is better at verifying its own work, and makes more effective use of its 500K token context window on long tasks. xAI also trained it to natively understand the Grok Bot harness, which it credits for improvements in conversational tasks and general knowledge work.

For anyone building agents, the self-verification behavior is the detail worth noting. A model that checks its own output before continuing tends to fail less catastrophically on long trajectories, where an early mistake otherwise compounds through every later step.

xAI also calls out stronger document and presentation generation, and describes gains on professional knowledge work of the kind done by lawyers, nurses, and financial analysts. xAI reports gains across its published evaluations. These span software engineering with CursorBench and DeepSWE, multi-hour terminal and office work with Terminal-Bench and AA Briefcase, electrical engineering with EEBench, legal work with the Harvey Legal Agent Benchmark, and clinical reasoning with HealthBench Professional. For the results themselves, see xAI’s [announcement](https://x.ai/news/grok-4-7).

### Independent evaluation

Artificial Analysis runs its own evaluations rather than relying on developer-reported figures, which makes it a useful second reference alongside xAI’s published results.

According to [Artificial Analysis](https://artificialanalysis.ai/articles/benchmarking-grok-4-7), Grok 4.7 improves across its evaluation suite. The largest gains are on long-horizon agentic knowledge work and on coding agents run in xAI’s own harness. The Intelligence Index is a composite built from multiple independent evaluations covering agentic tool use, reasoning and knowledge, knowledge reliability, and long-context work.

|     |     |     |
| --- | --- | --- |
| **Measure (Artificial Analysis)** | **Grok 4.7** | **Grok 4.6** |
| Intelligence Index | 46 | 44 |
| Coding Agent Index | 56 | 47 |
| AA-Briefcase, long-horizon knowledge work (Elo) | 1,657 | 1,546 |
| GDPval-AA, professional work products (Elo) | 1,695 | 1,605 |
| AA-Omniscience Index | 32 | 30 |
| AA-Omniscience hallucination rate | 29% | 34% |
| Output tokens per Intelligence Index task | ~81k | ~38k |

Grok 4.7 is measured at `xhigh` reasoning effort, and Grok 4.6 at the effort level Artificial Analysis reported for each measure. The final row is the tradeoff to plan for: the gains come with roughly double the output tokens per task. That’s why it pays to set the effort level deliberately rather than inheriting the default.

### Safety and cyber security

According to xAI, Grok 4.7 was built with an entirely new safeguard stack and is the strongest model it has tested on refusals and jailbreak resistance. xAI frames the goal in dual-use domains such as cyber security and biological work as holding two things at once: remaining useful for legitimate tasks while refusing dangerous ones.

On cyber security specifically, xAI reports the model allows only a small fraction of risky dual-use prompts through while rarely blocking legitimate security work. xAI has also begun giving selected cyber security partners invite-only access to Grok 4.7’s red-team capabilities for defense research.

## How Grok 4.7 is packaged on Amazon Bedrock

Grok 4.7 accepts text and image input and returns text. The model is served on the `bedrock-runtime` endpoint through cross-Region inference profiles, so requests name a profile rather than a bare model ID:

|     |     |     |
| --- | --- | --- |
| **Inference option** | **Model ID** | **Base URL** |
| Geo cross-Region | us.xai.grok-4.7 | `https://bedrock-runtime.{region}.amazonaws.com/openai/v1` |
| Global cross-Region | global.xai.grok-4.7 | `https://bedrock-runtime.{region}.amazonaws.com/openai/v1` |

Grok 4.7 supports the Responses API, the Chat Completions API, InvokeModel and the Converse API.

Because the model is OpenAI-compatible, you have a choice of client. The OpenAI SDK works against the `/openai/v1` path with a bearer token, which can be either an Amazon Bedrock API key or a short-term token minted from your AWS Identity and Access Management (IAM) credentials. The AWS SDKs reach the same model through Converse, signing requests with your ordinary AWS credentials. Use the OpenAI SDK if you’re porting an existing integration. Use Converse if you want one message shape across the models in your account, along with invocation logging and response streaming through the standard Bedrock event types.

### Using Grok 4.7 with Bedrock features

Implicit prompt caching applies automatically to repeated prompt prefixes, so agents that resend a large system prompt or reference document on every turn pay the cached rate for that prefix. Amazon Bedrock Guardrails attach by ID and version on the request, applying content filters, denied topics, personally identifiable information (PII) redaction, and word policies to both the prompt and the response. This is useful for a model that might run unattended across many steps. With structured outputs, you can constrain a response to a JSON Schema so downstream code can parse it directly. Invocation logging captures each call in Amazon CloudWatch with the request, the response, and token counts including reasoning tokens. This gives you an audit trail for long agent runs.

### Regions and inference options

Grok 4.7 routes through one of two cross-Region inference profiles rather than pinning to a single Region.

The Global profile, `global.xai.grok-4.7`, routes each request to any supported commercial AWS Region, spreading load across more capacity, and is priced below a geographic profile. The tradeoff is less control over where a given request is served, which can mean more variable latency.

The US geographic profile, `us.xai.grok-4.7`, keeps processing within the US geography, which addresses US data residency requirements. Choose it when you have residency constraints or latency-sensitive traffic, and Global when cost and throughput matter more.

### Service tier and pricing

Standard is pay-per-token with no commitment, selected by setting `"service_tier": "default"` or omitting the field. Priority delivers faster, prioritized processing for a premium (`"service_tier": "priority"`). Flex offers lower-cost access for work that isn’t time-sensitive (`"service_tier": "flex"`).

Service tier is a significant cost lever that you control. For per-token pricing across the tiers, see the [Amazon Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/).

## Send your first request

Before your first call, confirm that the model is available to you in the Bedrock console for the AWS Region that you plan to use.

Install the OpenAI SDK, and `boto3` if you plan to use the Converse API:

```bash
pip install openai
pip install boto3
```

Bash

Generate a long-term Amazon Bedrock API key from the Amazon Bedrock console for exploration, then set your environment:

```bash
export OPENAI_API_KEY="<provide your Bedrock API key>"
export OPENAI_BASE_URL="https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1"
```

Bash

A first request with the Chat Completions API:

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="us.xai.grok-4.7",
    messages=[\
        {"role": "user", "content": "Can you explain the features of Amazon Bedrock?"}\
    ],
)
print(response.choices[0].message.content)
```

Python

The same call through the Responses API:

```python
response = client.responses.create(
    model="us.xai.grok-4.7",
    input="Can you explain the features of Amazon Bedrock?",
)
print(response.output_text)
```

Python

And through the Converse API with `boto3`. Because reasoning is always active, the first content block carries the reasoning and the answer sits in a later block, so search the blocks for the text rather than indexing `content[0]`:

```python
import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")

response = client.converse(
    modelId="us.xai.grok-4.7",
    messages=[\
        {"role": "user", "content": [{"text": "Can you explain the features of Amazon Bedrock?"}]}\
    ],
    inferenceConfig={"maxTokens": 2048},
)

blocks = response["output"]["message"]["content"]
text = next(b["text"] for b in blocks if "text" in b)
print(text)
```

Python

On Converse, you set the effort level through `additionalModelRequestFields` rather than a `reasoning` parameter:

```python
response = client.converse(
    modelId="us.xai.grok-4.7",
    messages=[{"role": "user", "content": [{"text": "What is 17*23? Number only."}]}],
    inferenceConfig={"maxTokens": 3000},
    additionalModelRequestFields={"reasoning_effort": "xhigh"},
)
```

Python

Three operational notes. First, requests must name `us.xai.grok-4.7` or `global.xai.grok-4.7`.

Second, `bedrock:InvokeModel` is evaluated against three resources: your account’s default project, the inference profile you name, and the underlying foundation model (FM). The foundation model Amazon Resource Name (ARN) is wildcarded across Regions because cross-Region profiles route outside the calling Region. Bearer-token authentication additionally requires `bedrock:CallWithBearerToken`, which `boto3` and Converse don’t need:

```json
{
    "Version": "2012-10-17",
    "Statement": [\
        {\
            "Effect": "Allow",\
            "Action": "bedrock:InvokeModel",\
            "Resource": [\
                "arn:aws:bedrock:{region}:{account-id}:project/default",\
                "arn:aws:bedrock:{region}:{account-id}:inference-profile/us.xai.grok-4.7",\
                "arn:aws:bedrock:*::foundation-model/xai.grok-4.7"\
            ]\
        },\
        {\
            "Effect": "Allow",\
            "Action": "bedrock:CallWithBearerToken",\
            "Resource": "*"\
        }\
    ]
}
```

JSON

List every inference profile you plan to call. Profiles are scoped individually, so a policy naming `us.xai.grok-4.7` does not cover `global.xai.grok-4.7`.

Third, the two authentication mechanisms cover different code paths. An Amazon Bedrock API key in `OPENAI_API_KEY` travels as a bearer token and authenticates the OpenAI-compatible calls. The `boto3` Converse examples sign with SigV4 instead, drawing on your ordinary AWS credentials from the environment, a profile, or a role. Configure both if you intend to use Converse alongside the OpenAI-compatible APIs.

Treat a long-term API key as an exploration-only credential. For production, use short-term bearer tokens generated from your IAM credentials with the `aws-bedrock-token-generator` package, since they expire automatically and keep access tied to your IAM identity.

## Working with reasoning effort

Reasoning is active on Grok 4.7, and effort level is a primary control you have over its cost and latency. You configure it through the `reasoning` parameter on the Responses API with `low`, `medium`, `high`, or `xhigh`, and through `additionalModelRequestFields` on Converse.

The default is `high`. That’s worth setting explicitly rather than inheriting, because leaving it unset on latency-sensitive or high-volume calls will spend more reasoning tokens than those calls need.

Because the model is trained to work longer and verify its own output, higher effort buys more than extra deliberation on a single answer: it buys more self-checking across a long task. Short extraction and classification calls belong at `low`. Multi-step planning, long agent trajectories, and work where an early error propagates are where `high` and `xhigh` earn their tokens.

Reasoning content is encrypted. You can have it returned by passing the following on a Responses API request.`include: ["reasoning.encrypted_content"]`

Then send that content back on subsequent turns to give the model its own prior reasoning as context in a multi-turn conversation. The Chat Completions API doesn’t return reasoning tokens.

```python
from openai import OpenAI

client = OpenAI()  # OPENAI_BASE_URL points at the bedrock-runtime endpoint

response = client.responses.create(
    model="us.xai.grok-4.7",
    reasoning={"effort": "high"},
    include=["reasoning.encrypted_content"],
    input="Explain quantum entanglement simply.",
)
print(response.output_text)
```

Python

To find where additional reasoning stops paying for itself, benchmark the levels against your own workload.

## Get started

With Grok 4.7 in Amazon Bedrock, you get a 500K token context window, four reasoning effort levels, image input, tool calling, and Geo and Global cross-Region routing. All of it is reachable through the Responses, Chat Completions, and Converse APIs.

To start building, review the Grok 4.7 model card for the current Region list, feature matrix, and parameter details, and check the [Amazon Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/) for token rates. If you generated a long-term Amazon Bedrock API key for exploration, delete it from the Amazon Bedrock console when you are finished. A standing credential you no longer need only widens your account’s attack surface.

## Sources

- [Grok 4.7 Model Card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-xai-grok-4-7.html)
- [xAI, Introducing Grok 4.7](https://x.ai/news/grok-4-7)
- [Artificial Analysis, Benchmarking Grok 4.7](https://artificialanalysis.ai/articles/benchmarking-grok-4-7)
- [xAI, Grok 4.7 model documentation](https://docs.x.ai/developers/models/grok-4.7)
- [Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/)

* * *

## About the authors

### Resources

- [Getting Started](https://aws.amazon.com/getting-started?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=machine-learning-resources)
- [What's New](https://aws.amazon.com/new?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=machine-learning-resources)

* * *

### Blog Topics

- [Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-machine-learning/amazon-bedrock/)
- [Amazon Comprehend](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-comprehend/)
- [Amazon Kendra](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-kendra/)
- [Amazon Lex](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-lex/)
- [Amazon Polly](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-polly/)
- [Amazon Q](https://aws.amazon.com/blogs/machine-learning/category/amazon-q/)
- [Amazon Rekognition](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-rekognition/)
- [Amazon SageMaker](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/sagemaker/)
- [Amazon Textract](https://aws.amazon.com/blogs/machine-learning/category/artificial-intelligence/amazon-textract/)

* * *

### Follow

- [Twitter](https://twitter.com/awscloud)
- [Facebook](https://www.facebook.com/amazonwebservices)
- [LinkedIn](https://www.linkedin.com/company/amazon-web-services/)
- [Twitch](https://www.twitch.tv/aws)
- [Email Updates](https://pages.awscloud.com/communication-preferences?sc_ichannel=ha&sc_icampaign=acq_awsblogsb&sc_icontent=maching-learning-social)