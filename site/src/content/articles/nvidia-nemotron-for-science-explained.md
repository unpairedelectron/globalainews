---
title: "NVIDIA's Nemotron for Science Explained: Open Models Aimed at Chemistry Labs, and What the Results Actually Show"
seoTitle: "NVIDIA Nemotron for Science: What It Is, Explained"
description: "NVIDIA released an open model, a 50,000-question chemistry dataset and post-training recipes for science agents. What's in it, who's using it, and which numbers are company claims."
category: "research"
image: "/images/articles/nvidia-nemotron-for-science-explained/hero.jpg"
imageAlt: "NVIDIA's Nemotron for Science Explained: Open Models Aimed at Chemistry Labs, and What the Results Actually Show"
tags: ["NVIDIA", "Open-weight models", "AI for science"]
date: "2026-11-28T07:30:00Z"
takeaways:
  - "On 16 November 2026 NVIDIA introduced Nemotron for Science: its Nemotron 3.5 Super VL open model, a new open chemistry dataset and post-training recipes for building science agents."
  - "The model has 120 billion total parameters with 12 billion active, supports context lengths up to 1M tokens, and is published on Hugging Face under the OpenMDW 1.1 licence."
  - "LitmusBench v0.2 is an open dataset of nearly 50,000 questions for training and evaluating chemistry reasoning."
  - "Argonne National Laboratory, Jülich Supercomputing Centre, RIKEN and KTH are using Nemotron models in research agents; KTH reports an agent that fixed 81% of broken simulation setups overnight."
  - "The accuracy gains cited for drug and materials work come from the companies that did the post-training, not from independent evaluation."
---
## The bottom line

**NVIDIA has packaged an open model, an open chemistry dataset and training recipes for researchers who want to build their own science agents.** Announced on 16 November 2026, Nemotron for Science brings together the Nemotron 3.5 Super VL model, "a new open chemistry dataset and post-training recipes to help researchers build specialized agents for scientific discovery". [1]

The interesting part is not a benchmark score. It is the deployment model. The weights are on Hugging Face, the dataset is open, and NVIDIA says the model was optimised to run locally on a 128GB DGX Spark desktop system as well as in data centres. [1][2] That puts a capable model inside institutions that cannot send research data to an external API.

The reported results are striking, and almost all of them come from the companies doing the work. Read them as claims from interested parties.

## Key facts at a glance

| | |
|---|---|
| Announced | 16 November 2026, around the SC26 conference [1] |
| Model | NVIDIA Nemotron 3.5 Super VL: 120B total parameters, 12B active [2] |
| Architecture | Mamba-2 and Transformer hybrid mixture-of-experts, with a C-RADIO vision encoder [2] |
| Context length | Up to 1M tokens [2] |
| Licence | OpenMDW 1.1 [2] |
| Dataset | LitmusBench v0.2: nearly 50,000 chemistry-reasoning questions [1]; published as `nvidia/Nemotron-RL-litmus-bench-v0.2` under CC BY-SA 4.0 and OpenMDW 1.1 [3] |
| Where to get it | Hugging Face [1][2] |
| Local hardware | Optimised to run on a 128GB NVIDIA DGX Spark; the BF16 example serves on 4× H100 [1][2] |

## What is actually being released

Three things, according to NVIDIA: [1]

1. **The model.** Nemotron 3.5 Super VL is a vision-language model "for reasoning, coding, tool use, document understanding, and video understanding". [2] Being a vision-language model matters in science, where much of the information sits in diagrams, spectra and scanned papers rather than plain text.
2. **The dataset.** LitmusBench v0.2 holds "nearly 50,000 questions for training and evaluating language models on chemistry reasoning", drawing on molecular properties and experimental drug-discovery data. It covers predicting how molecules behave, "including their solubility and how the human body processes them". [1] On Hugging Face it is published as `nvidia/Nemotron-RL-litmus-bench-v0.2` and carries both the CC BY-SA 4.0 and OpenMDW 1.1 licences. [3]
3. **Post-training recipes.** Methods for adapting the general model to a narrow scientific task, which is the step that produced most of the reported gains. [1]

For what the parameter counts mean in practice, see our explainer on [Mistral Small 4 and active parameters](/article/small-models-serious-workflows/); the same total-versus-active distinction applies here.

## What the early users report

NVIDIA's release lists several results. Each belongs to the organisation that produced it. [1]

| Organisation | Reported result |
|---|---|
| **Terray Therapeutics** | Post-trained Nemotron to extract reactants, products and reaction conditions from scientific diagrams; recovered "about 76% of annotated reactions" on the RxnScribe test under that benchmark's matching criteria |
| **Lila Sciences** | Post-training with laboratory feedback "nearly doubled the model's accuracy" for making quantum dots, to 61%, which NVIDIA says exceeds GPT-6 Astra's 54% "at 10-20x lower inference cost" |
| **Therna** | Post-trained for mRNA therapeutic design, "nearly doubling accuracy in predicting protein-expression ranges over frontier models"; scientists preferred its explanations in 96% of comparisons |
| **KTH Royal Institute of Technology** | Built an agent that repairs broken GROMACS molecular dynamics setups; in one overnight run on a single DGX Spark it "fixed 81% of test cases with reasoning enabled" |

The KTH result is the most checkable of the four, because NVIDIA notes that "every fix was checked independently by GROMACS itself". [1] That is a verifier outside the model deciding whether the repair actually worked, which is a stronger form of evidence than a model grading its own output.

Argonne National Laboratory is integrating Nemotron into a multi-agent system for designing protein-based therapeutic candidates, and RIKEN has made the model available on its RIKYU AI supercomputing platform. [1]

## How to read these numbers

Three cautions apply to every figure above.

**They are self-reported.** NVIDIA's press release carries the companies' own results. None of the four is an independent evaluation, and the release does not link full methodology for each.

**"Nearly doubled" is a relative claim.** Doubling accuracy from a low base can still leave a system below the level needed for real use. Lila's quantum-dot figure, 61%, is given as an absolute number; Therna's is not.

**A benchmark is not a laboratory outcome.** Recovering 76% of annotated reactions from diagrams is a document-understanding result. It does not establish that a molecule designed this way will work. The same gap we described in our piece on [AI-designed antimicrobial peptides](/article/ai-models-antibiotic-discovery/) applies here: a computational result is the start of the evidence chain, not the end.

## Why the licence and hardware matter

Scientific data is often confidential: patient information, unpublished results, commercially sensitive compounds. That rules out sending it to a hosted API for many institutions.

An open-weight model changes the calculation. Hugging Face lists the model under the **OpenMDW 1.1** licence. [2] As always, the licence text, not the "open" label, decides what you may do; see our explainer on [open weights versus open source](/article/open-weights-vs-open-source-ai/).

The hardware claim is equally practical. NVIDIA says the model "was also optimized to run locally on a 128GB NVIDIA DGX Spark system", while the full-precision weights example serves on 4× H100. [1][2] A desktop-sized option puts the model within reach of a single lab rather than only a supercomputing centre.

## What this means for…

**Indian research institutions.** This is the deployment pattern that fits Indian labs and universities: open weights, an open dataset and the option to run on hardware you control. It pairs with the national compute programme we cover in our explainer on [IndiaAI's GPU capacity](/article/india-ai-compute-access-2026/).

**Researchers.** The post-training recipes, not the base model, are where the reported gains came from. Budget for the adaptation work and for building your own evaluation.

**Anyone reading AI-for-science headlines.** Ask who ran the test, whether an independent tool verified the result, and whether the number is absolute or relative.

## What we don't know yet

- **Independent replication.** None of the four reported results has been independently reproduced in the material NVIDIA published. [1]
- **Full methodology** for the Lila, Terray and Therna figures. [1]
- **How the comparisons with frontier models were run**, including the GPT-6 Astra figure and the cost comparison. [1]

## FAQ

### What is NVIDIA Nemotron for Science?

A package of NVIDIA's Nemotron 3.5 Super VL open model, the LitmusBench v0.2 chemistry dataset and post-training recipes, intended for building specialised scientific agents. [1]

### How big is Nemotron 3.5 Super VL?

120 billion total parameters with 12 billion active per token, a hybrid Mamba-2 and Transformer mixture-of-experts design with a vision encoder, supporting up to 1M tokens of context. [2]

### Can I download it?

Yes. The model and the LitmusBench v0.2 dataset are on Hugging Face. The model card lists the OpenMDW 1.1 licence; the dataset carries CC BY-SA 4.0 and OpenMDW 1.1. [1][2][3]

### Are the accuracy improvements independently verified?

No. They are reported by the companies that post-trained the model. The one result checked by an outside tool is KTH's, where GROMACS itself verified each repair. [1]

### What hardware do I need?

NVIDIA says the model was optimised to run locally on a 128GB DGX Spark system; the model card's full-precision example serves on four H100 GPUs. [1][2]

## Sources

**Primary**

1. NVIDIA, *NVIDIA Introduces Nemotron for Science to Accelerate Discoveries With Agents* (press release), 16 November 2026. https://nvidianews.nvidia.com/news/nvidia-introduces-nemotron-for-science-to-accelerate-discoveries-with-agents
2. NVIDIA, *NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16* (Hugging Face model card), accessed 19 November 2026. https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16
3. NVIDIA, *Nemotron-RL-litmus-bench-v0.2* (Hugging Face dataset), accessed 19 November 2026. https://huggingface.co/datasets/nvidia/Nemotron-RL-litmus-bench-v0.2

## Methodology note

Research and drafting for this article were AI-assisted, and every quote and figure was checked against the sources above on 19 November 2026. Performance results are attributed to the organisations that reported them; we did not run the model or reproduce any benchmark. See our [editorial policy](/editorial-policy/).
