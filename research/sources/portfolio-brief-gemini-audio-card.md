Source: https://deepmind.google/models/model-cards/gemini-3-8-audio/
Title: Gemini 3.8 Audio - Model Card — Google DeepMind
Fetched: 2026-10-04T08:32:10.562Z

[Skip to main content](https://deepmind.google/models/model-cards/gemini-3-8-audio/#page-content)

Published 15 September 2026

# Gemini 3.8 Audio (Live, Live Extended Thinking, Flash TTS, Flash-Lite TTS)

[Learn more](https://deepmind.google/models/gemini-audio/) [View PDF version](https://storage.googleapis.com/deepmind-media/Model-Cards/Gemini-3-8-Audio-Model-Card.pdf)

Model Cards are intended to provide essential information on Gemini models, including known limitations, mitigation approaches, and safety performance. Model cards may be updated from time to time; for example, to include updated evaluations as the model is improved or revised. See the [Google DeepMind site](https://deepmind.google/models/model-cards/) for a comprehensive list of model cards.

Published: September 2026

- [Model Information](https://deepmind.google/models/model-cards/gemini-3-8-audio/#model-information)
- [Model Data](https://deepmind.google/models/model-cards/gemini-3-8-audio/#model-data)
- [Implementation and Sustainability](https://deepmind.google/models/model-cards/gemini-3-8-audio/#implementation-and-sustainability)
- [Distribution](https://deepmind.google/models/model-cards/gemini-3-8-audio/#distribution)
- [Evaluation](https://deepmind.google/models/model-cards/gemini-3-8-audio/#evaluation)
- [Intended Usage and Limitations](https://deepmind.google/models/model-cards/gemini-3-8-audio/#intended-usage-and-limitations)
- [Ethics and Content Safety](https://deepmind.google/models/model-cards/gemini-3-8-audio/#ethics-and-content-safety)

## Model Information

### Description

Gemini 3.8 Audio (Live, Live Extended Thinking, Flash TTS, Flash-Lite TTS) is an addition to the Gemini 3 series of highly-capable models. This model card describes the native capabilities (e.g., audio and video) as additional outputs of Gemini, including optional avatar capabilities (Live Avatar). Information specific to these modalities is specified in-line and referred to as **Gemini 3.8 Live**, **Gemini 3.8 Live Extended Thinking**, **Gemini 3.8 Flash TTS**, and **Gemini 3.8 Flash-Lite TTS** (collectively as **Gemini 3.8 Audio**).

### Model dependencies

Gemini 3.8 Audio is based on Gemini 3 Pro.

### Inputs

- Gemini 3.8 Live and Gemini 3.8 Live Extended Thinking: Audio, images, video, and text with a token context window of up to 128K.
- Gemini 3.8 Flash TTS and Gemini 3.8 Flash-Lite TTS: Text up to 8K.

### Outputs

- Gemini 3.8 Live and Gemini 3.8 Live Extended Thinking: Audio and text, with 64K token output. With Live Avatar: Audio, video, and text, with 24K token output.
- Gemini 3.8 Flash TTS and 3.8 Flash-Lite TTS: Audio, with 64K token output.

### Architecture

Gemini 3.8 Audio models are based on Gemini 3 Pro. For more information about the model architecture, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

* * *

## Model Data

### Training Dataset

Gemini 3.8 Audio models are based on Gemini 3 Pro. For more information about the training dataset, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

### Training Data Processing

For more information about the training data processing for Gemini 3.8 Audio models, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

* * *

## Implementation and Sustainability

### Hardware

Gemini 3.8 Audio models are based on Gemini 3 Pro. For more information about the hardware for Gemini 3 Pro and our continued [commitment to operate sustainably](https://sustainability.google/operating-sustainably/), see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

### Software

Gemini 3.8 Audio models are based on Gemini 3 Pro. For more information about the software for Gemini 3 Pro, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

* * *

## Distribution

Gemini 3.8 Audio is distributed in the following channels; respective documentation shared in line:

**Gemini 3.8 Live**

- [Gemini API](https://ai.google.dev/gemini-api/docs/models)
- [Gemini App](http://gemini.google.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini Enterprise Agent Platform](https://cloud.google.com/products/gemini-enterprise-agent-platform)
- [Google Search Live](https://support.google.com/websearch/answer/16329036)

**Gemini 3.8 Live Extended Thinking**

- [Gemini App](http://gemini.google.com/)
- [Gemini API](https://ai.google.dev/gemini-api/docs/models)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini Enterprise Agent Platform](https://cloud.google.com/products/gemini-enterprise-agent-platform)
- Google Workspace ( [Gmail](https://support.google.com/mail/answer/17085010), [Docs](https://support.google.com/docs/answer/17256297), and [Keep](https://support.google.com/keep/answer/17499364))

**Gemini 3.8 Flash TTS**

- [Gemini API](https://ai.google.dev/gemini-api/docs/models)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini Notebook](https://notebook.google/)
- [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash-tts)

**Gemini 3.8 Flash-Lite TTS**

- [Gemini API](https://ai.google.dev/gemini-api/docs/models)
- [Google AI Studio](https://aistudio.google.com/)
- [Google Vids](https://workspace.google.com/products/vids/)
- [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-8-flash-lite-tts)

Our models are available to downstream providers via an application program interface (API) and subject to relevant terms of use. There is no required hardware or software to use the model. For AI Studio and Gemini API, see the [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms); for Gemini Enterprise Agent Platform, see [Google Cloud Platform Terms of Service](https://cloud.google.com/terms/). For more information, see [Gemini Model API instructions](https://ai.google.dev/gemini-api/docs/) and [Gemini API quickstart](https://ai.google.dev/gemini-api/docs/quickstart?_gl=1*wgdvnb*_up*MQ..*_ga*MTM5MTAyNTI1NC4xNzc4ODYyMjcy*_ga_P1DBVKWT6V*czE3Nzg4NjIyNzEkbzEkZzAkdDE3Nzg4NjIyNzEkajYwJGwwJGg0MjkzMDc0NTE.).

* * *

## Evaluation

### Approach

Gemini 3.8 Audio models were evaluated across a range of benchmarks. For more details, see:

- [Evals & Methodology for 3.8 for Live and Live Extended Thinking](https://deepmind.google/models/evals-methodology/gemini-3-8-live/)
- [Evals & Methodology for 3.8 Flash TTS and Flash-Lite TTS](https://deepmind.google/models/evals-methodology/gemini-3-8-tts/)

* * *

## Intended Usage and Limitations

### Benefit and Intended Usage

Gemini 3.8 Audio models process continuous streams of audio, video, and text to deliver spoken responses in real-time to create natural conversational experiences well-suited for users, developers, and enterprises.

Gemini 3.8 Live with Live Avatar and Gemini 3.8 Live Extended Thinking with Live Avatar generate expressive videos of natural head movements and speech synchronization based on configured images and audio inputs.

### Known Limitations

Gemini 3.8 Audio may exhibit some of the general limitations of foundation models, such as hallucinations. In addition to this, we are continually working to improve jailbreak resistance and have recently strengthened the mitigations across Frontier Safety. There may also be occasional slowness or timeout issues.

Gemini 3.8 Live with Live Avatar and Gemini 3.8 Live Extended Thinking with Live Avatar can support a few minutes of continuous interaction, rather than extended hours.

The knowledge cutoff date is January 2025.

For more information about the known limitations for Gemini 3.8 Audio, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

### Acceptable Usage

For more information about the acceptable usage for Gemini 3.8 Audio, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

* * *

## Ethics and Content Safety

### Evaluation Approach

Gemini 3.8 Audio was developed in partnership with internal safety and responsibility teams. A range of evaluations and red teaming activities were conducted to help improve the model and inform decision-making. These evaluations and activities align with [Google's AI Principles](https://ai.google/responsibility/principles/) and [responsible AI approach](https://ai.google/static/documents/ai-responsibility-update-published-february-2025.pdf), as well as Google's Generative AI policies (e.g., [Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy?e=IdentityBoqPoliciesUiAITestKitchenSSAT::Launch,-IdentityBoqPoliciesUiBardSSAT::Launch,-IdentityBoqPoliciesUiGoodallSSAT::Launch,IdentityBoqPoliciesUiAdditionalAup::Launch) and the [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms)).

Evaluation types included, but were not limited to:

- **Training/Development Evaluations** including automated and human evaluations carried out continuously throughout and after the model’s training, to monitor its progress and performance;
- **Human Evaluations** conducted by specialist teams across the policies and desiderata to ensure the model adheres to safety policies and desired outcomes.
- **Child Safety Evaluations** were conducted using techniques developed by expert teams to protect children online and to meet [Google’s commitments to child safety](https://blog.google/technology/safety-security/an-update-on-our-child-safety-efforts-and-commitments/) across our models and Google products.

Additional information: For more information about the evaluation approach for Gemini 3.8 Audio, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

### Safety Policies

For more information about the safety policies for Gemini 3.8 Audio, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

### Frontier Safety Assessment

Gemini 3.8 Audio is part of the Gemini 3 series of models. To assess Gemini 3.8 Audio for frontier safety, we rely on our evaluations of Gemini 3.7 Flash as outlined in our latest [Frontier Safety Framework](https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/strengthening-our-frontier-safety-framework/frontier-safety-framework_3-1.pdf). We found that Gemini 3.7 Flash did not reach any Tracked or Critical Capability Levels (T/CCLs). Our assessments have shown that Gemini 3.8 Live, Gemini 3.8 Live Extended Thinking, Gemini 3.8 Flash TTS, or Gemini 3.8 Flash-Lite TTS do not have meaningful new capabilities or material increases in performance compared to Gemini 3.7 Flash; therefore, based on Gemini 3.7 Flash results, we are confident that Gemini 3.8 Live, Gemini 3.8 Live Extended Thinking, Gemini 3.8 Flash TTS, or Gemini 3.8 Flash-Lite TTS are not likely to reach any T/CCLs.

For more information on our Frontier Safety Assessment, read the [Gemini 3.7 Flash Model Card](https://deepmind.google/models/model-cards/gemini-3-7-flash/).

### Risks and Mitigations

For more information about the risks and mitigations for Gemini 3.8 Audio, see the Gemini 3 Pro [model card](https://deepmind.google/models/model-cards/gemini-3-pro/).

## Latest model cards

[Learn more](https://deepmind.google/models/model-cards/gemini-3-8-flash/)

### Gemini 3.8 Flash

[Learn more](https://deepmind.google/models/model-cards/gemini-3-8-flash/)

[Learn more](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/)

### Gemini Robotics On-Device 2

[Learn more](https://deepmind.google/models/model-cards/gemini-robotics-on-device-2/)

[Learn more](https://deepmind.google/models/model-cards/gemini-robotics-er-2/)

### Gemini Robotics ER 2

[Learn more](https://deepmind.google/models/model-cards/gemini-robotics-er-2/)

[Learn more](https://deepmind.google/models/model-cards/lyria-3-5/)

### Lyria 3.5

[Learn more](https://deepmind.google/models/model-cards/lyria-3-5/)

[Learn more](https://deepmind.google/models/model-cards/gemini-3-6-flash/)

### Gemini 3.6 Flash

[Learn more](https://deepmind.google/models/model-cards/gemini-3-6-flash/)

[Learn more](https://deepmind.google/models/model-cards/gemini-3-5-flash-lite/)

### Gemini 3.5 Flash-Lite

[Learn more](https://deepmind.google/models/model-cards/gemini-3-5-flash-lite/)