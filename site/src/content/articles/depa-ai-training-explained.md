---
title: "DEPA for AI Training Explained: India’s Plan to Let AI Learn From Hospital and Bank Data Without Handing It Over"
seoTitle: "DEPA for AI Training Explained: India’s Data Plan"
description: "MeitY’s DEPA handbook lets AI developers train on sensitive data from hospitals and banks inside secure environments, without seeing the raw data. How it works and what it isn’t yet."
category: "india"
image: "/images/articles/depa-ai-training-explained/hero.jpg"
imageAlt: "DEPA for AI Training Explained: India’s Plan to Let AI Learn From Hospital and Bank Data Without Handing It Over"
tags: ["DEPA", "Data protection", "IndiaAI"]
date: "2026-11-24T07:30:00Z"
takeaways:
  - "On 31 October 2026 MeitY launched a Handbook on DEPA for AI Training in Bengaluru, developed with support from the iSPIRT Foundation."
  - "The idea, in the Principal Scientific Adviser’s words, is that “the model travels to the data, rather than the data travelling to the model”."
  - "Data holders such as hospitals and banks keep their data inside secure environments; startups and researchers train models there under machine-readable contracts and differential privacy."
  - "Trained models must pass independent checks for bias, security, robustness and explainability before pilot deployment."
  - "The handbook is marked “Draft for Discussion”. It is not a law, and the oversight body it calls for does not yet exist."
---
## The bottom line

**DEPA for AI Training is India’s proposed system for letting AI developers learn from sensitive data, such as patient records or bank transactions, without ever being handed the raw data.** The Ministry of Electronics and Information Technology (MeitY) launched a handbook describing it on 31 October 2026 in Bengaluru, with support from the iSPIRT Foundation. [1]

The core idea is simple. In the words of India’s Principal Scientific Adviser, Prof. Ajay Kumar Sood: “Under DEPA, the model travels to the data, rather than the data travelling to the model.” [1] Training happens inside secure computing environments, governed by machine-readable contracts and protected by a technique called differential privacy. [2]

It is not yet a law or a working national system. The handbook is marked “Draft for Discussion”, and MeitY Secretary S. Krishnan calls it “a living resource” that invites recommendations. [2]

## Key facts at a glance

| | |
|---|---|
| Launched | 31 October 2026, at a roundtable in Bengaluru [1] |
| By | MeitY, unveiled by Secretary S. Krishnan, with support from the iSPIRT Foundation [1] |
| Status | Draft for discussion; not legally binding [2] |
| Who shares data | Training Data Providers, such as hospitals, banks and public agencies [2] |
| Who trains models | Training Data Consumers, such as startups, researchers, enterprises and regulators [2] |
| Core technology | Data exchange platform, electronic contracts, secure data environments, differential privacy [2] |
| Laws it aligns with | IT Act 2000; Digital Personal Data Protection (DPDP) Act 2023 [2] |

## What problem is DEPA trying to solve?

Good AI needs large amounts of high-quality data, and India’s most valuable datasets sit with hospitals, banks and government agencies. They are reluctant to share it. The handbook says the DPDP Act “rightly imposes strict obligations on handling personal data, making institutions cautious about any form of sharing”. [2] Businesses also worry about leaking commercially sensitive information, such as customer lists and transaction patterns, even when personal details are removed. [2]

The DPDP Act itself, passed on 11 August 2023, does make room for some of this work. Section 17(2)(b) exempts processing that is “necessary for research, archiving or statistical purposes”, provided the data is not used to take any decision about a specific person and follows standards “as may be prescribed”. [3] DEPA is designed to sit alongside that law, not replace it. [2]

The usual answer, anonymising the data, isn’t enough, the handbook argues. Anonymised records can often be re-identified by combining datasets, while anonymising data heavily enough to prevent that can destroy its usefulness. [2]

The foreword, by Department of Science and Technology Secretary Abhay Karandikar, describes the result as a “data chasm”: researchers with world-class talent but without access to “large-scale, high-quality, India-specific datasets”. [2]

## How DEPA for AI Training works

The handbook describes a network of four kinds of participant: [2]

- **Data Principals.** The individuals or entities the data is about.
- **Training Data Providers (TDPs).** Institutions that hold and prepare data, such as hospitals, banks and public agencies. They register with a central registry and are bound by its governance standards.
- **Training Data Consumers (TDCs).** Those who train AI models: academic and non-profit researchers, startups and enterprises, and regulators testing third-party AI for fairness and safety.
- **An oversight body.** It would set standards, register participants, oversee data-sharing procedures and resolve disputes.

The technology rests on four pillars: [2]

1. **A data exchange platform** that connects providers and consumers. It can also offer GPU infrastructure for training.
2. **Electronic contracts** with machine-readable terms for protection, security and permitted use.
3. **Secure data environments** where training happens. The raw data “remains protected” and is “unexposed to TDCs”.
4. **Differential privacy**, a mathematical technique that lets models learn aggregate patterns while making it “practically impossible to re-identify any individual data point”. Each use has a “privacy budget” that is defined, monitored and audited.

The handbook offers two options for anonymisation. Either the data provider anonymises the data before sharing, or the exchange platform does it as a service inside the secure environment. [2] PIB adds that the framework includes **data provenance**, so the origin, permissions and use of data can be traced through training. [1]

## What happens after training

Models don’t go straight into use. The handbook requires independent validation covering: [2]

- **Bias and fairness audits**, to check for discriminatory outcomes.
- **Security and robustness testing**, including for data leakage.
- **Extra safety testing** for high-risk applications.
- **Explainability checks**, so decisions can be explained in legal and practical contexts.

“Only models that pass this comprehensive check receive go ahead for pilot deployment and scaling,” following guidelines from “the competent government authority”. [2]

## How it relates to DEPA Inference and UPI-era infrastructure

DEPA already exists in another form. **DEPA Inference** lets individuals consent to sharing their own data, such as bank statements, through consent managers like Account Aggregators, to get a service. [2] The handbook argues that this consent-by-consent model can’t handle AI training, which needs data pooled from many institutions. [2]

At the launch, HDFC Bank’s Anjani Rathor said the bank’s “experience with DEPA Inference has demonstrated the promise of secure data collaboration”. [1] iSPIRT co-founder Sharad Sharma went further, calling it “easily a more significant moment since February 2016, when the Unified Payment Interface (UPI) was announced”. [1] That is iSPIRT’s view, and iSPIRT helped prepare the handbook. [1][2]

## What this means for…

**Indian AI startups and researchers.** If it becomes operational, DEPA could open access to sector data that is effectively closed today, such as health records and financial data, for training Indian models. For where public compute fits in, see our explainer on [IndiaAI’s GPU capacity](/article/india-ai-compute-access-2026/). For two models built under the IndiaAI Mission, see [EKA-1 and Dhīr](/article/indiaai-eka-1-dhir-models-explained/).

**Hospitals, banks and public bodies.** DEPA proposes a way to contribute data without losing control of it, but with real obligations: registration, anonymisation duties, contracts and audits. [2]

**Citizens.** Your records could help train AI without being copied out, through secure environments and differential privacy. Data Principals sit at the base of the proposed system, and the handbook says their data is managed under existing legal regulations. [2] For India’s wider AI rules, see [what is already law](/article/india-ai-consultation-paper-what-is-law/).

## What we don’t know yet

- **Who the oversight body will be.** The handbook says one is needed but doesn’t name it. [2]
- **When it becomes operational**, and whether any part becomes binding. MeitY says it is “fully committed to taking this framework forward”, without a timeline. [1]
- **Privacy budget settings.** The handbook says budgets will be tailored “to the risk profile of each sector”, but gives no values. [2]
- **Validation guidelines.** The model checks will follow guidelines from “the competent government authority”, which have not been published. [2]

## FAQ

### What is DEPA for AI Training?

A proposed framework from MeitY for training AI models on sensitive institutional data inside secure environments, under machine-readable contracts and differential privacy, so the raw data is never handed to the model developer. [1][2]

### Is DEPA for AI Training a law?

No. The handbook is a “Draft for Discussion”. It is designed to align with the IT Act and the DPDP Act, but it does not itself create legal obligations. [2]

### What does “the model travels to the data” mean?

Instead of copying data to the AI developer, the developer’s training job runs inside a secure environment where the data already sits. Only the trained model, after checks, comes out. [1][2]

### What is differential privacy?

A mathematical technique that adds controlled noise during analysis or training, so a model learns overall patterns but cannot reveal information about any one person. DEPA tracks a “privacy budget” to limit cumulative privacy loss. [2]

### Who developed DEPA for AI Training?

MeitY, with the National e-Governance Division, and the iSPIRT Foundation, whose volunteers helped prepare the handbook. [1][2]

## Sources

**Primary**

1. Press Information Bureau (MeitY), *MeitY Launches DEPA for AI Training Handbook to Advance Trusted Data Collaboration for AI*, 31 October 2026. https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330756&reg=48&lang=2
2. Ministry of Electronics and Information Technology, *Data Empowerment and Protection Architecture (DEPA) for AI Training: A National Framework for Data Empowered Ecosystems for shaping the Age of AI* (Draft for Discussion), October 2026. https://www.meity.gov.in/static/uploads/2026/10/02d8224e4cd6c8c29be5a5198e795158.pdf
3. Government of India, *The Digital Personal Data Protection Act, 2023* (No. 22 of 2023), Gazette of India, 11 August 2023. https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf

## Methodology note

Research and drafting for this article were AI-assisted, and every quote and claim was checked against the PIB release, the full handbook and the DPDP Act text on 15 November 2026. Commentary from the launch is attributed to the people who made it. See our [editorial policy](/editorial-policy/).
