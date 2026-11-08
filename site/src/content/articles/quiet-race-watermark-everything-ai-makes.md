---
title: "C2PA Content Credentials Explained: Why Provenance Doesn’t Prove Content Is True"
seoTitle: "C2PA Content Credentials: What Provenance Proves"
description: "EU disclosure obligations, a voluntary code and a contested provenance standard do different jobs."
category: "policy"
tags: ["C2PA","Watermarking","Deepfakes"]
date: "2026-09-10"
updated: "2026-10-05"
image: "/images/articles/quiet-race-watermark-everything-ai-makes/hero-1024.webp"
imageAlt: "A signed provenance record shown beside an image, with its limits made explicit"
takeaways: ["The EU Code of Practice is voluntary; applicable Article 50 obligations are legal requirements.","A valid provenance record is not proof of authenticity.","A single arXiv security study reports validator and specification weaknesses that remain to be independently tested."]
---
## The bottom line

C2PA can record signed provenance, but it cannot establish that an image is true; one unreviewed preprint reports security limitations that should be investigated. A reader or buyer needs to distinguish legal disclosure, file provenance and verification of the underlying claim.

## A legal obligation and a voluntary code are different

The European Commission says the AI Act transparency obligations for in-scope providers and deployers apply from 2 August 2026. The accompanying Code of Practice helps organizations demonstrate compliance, but adherence to the code itself is voluntary; the underlying Article 50 obligations are legal requirements. That distinction matters more than calling every disclosure tool a new law. [1]

The Code addresses marking and detection of AI-generated or manipulated content, plus labels for deepfakes and certain AI-generated text. It does not require every image on the internet to carry one universal watermark. Its scope and duties depend on the relevant AI Act provisions and the role of the provider or deployer. [1]

## Provenance describes a file history, not the truth

C2PA Content Credentials are signed assertions about an asset’s origin and edits. The specification describes a technical way for participating tools to attach and validate that history; it does not determine whether the scene in a photograph happened as shown. A valid provenance chain is evidence about handling, not a certificate that the content is authentic or true. [2]

That boundary also shapes the meaning of a missing credential. The C2PA deployment guide warns that transformations such as screenshots or exports can remove embedded credentials. An unsigned file therefore cannot be treated as false, just as a signed file cannot replace ordinary verification of its claims. [3] [2]

## One security preprint challenges current deployments

A security paper posted to arXiv in April 2026 reports weaknesses in C2PA specifications versions 2.2–2.4, including cases where timestamps could be altered and validators disagreed about a credential. These are the authors’ findings from one preprint; they should be reported as a challenge to test, not as a settled verdict on every C2PA implementation. [4]

The paper also makes the same important conceptual distinction: provenance is not authenticity. Its criticism is that users may over-trust a provenance signal when the standards or validators do not establish the guarantees they expect. Because this source set contains no independent replication of the reported exploits, the article attributes these claims rather than presenting them as consensus. [4]

## Procurement should test the whole workflow

C2PA’s deployment guidance asks buyers to test whether credentials are attached by default, survive the real editing and publishing path, and can be inspected by the tools downstream teams use. Those are more useful questions than whether a vendor can show a successful demo on a clean sample file. The guide is written by C2PA, so it explains implementation practice rather than independently measuring adoption. [3]

A contract should also state what happens when the chain is missing or a validator reports a problem. The interface needs to distinguish “no credential found,” “credential present but not validated,” and “validated provenance” without turning any of those states into a verdict on the image’s truth. That is a product and editorial requirement, not just a cryptographic one. [3] [4]

## Keep provenance inside a broader verification process

For publishers, credentials can add a useful record to ordinary verification: who supplied the file, what edits were made, and whether the provenance signature validates in the chosen tool. Editors still need to check the source, caption and depicted event. Neither the C2PA specification nor the European Commission’s transparency code turns a metadata record into evidence that an underlying claim is true. [2] [1]

The strongest policy and product language states exactly what a signal can establish and where it stops. A provenance record can narrow uncertainty about a file’s handling. It cannot eliminate uncertainty about the scene, and a missing record does not settle the question in the opposite direction. [2] [4]

## What readers should be told

A reader-facing credential panel should name the signer, describe the recorded edits, and say whether the chosen verifier accepts the signature. If the record cannot be checked, the page should say that plainly. These design choices follow from the C2PA guide’s emphasis on verification and from the security preprint’s reported validator inconsistencies; they are not a guarantee that every deployment already handles them well. [3] [4]

The practical race is not to watermark everything. It is to make disclosure, provenance and verification useful in the situations where they apply—while keeping the limits visible. That lets law, standards and newsroom checks do distinct jobs instead of asking one technical mark to provide certainty it was not designed to supply. [1] [2]

## What to do with this

Procurement and newsroom workflows should test how credentials are attached, preserved, validated and explained when absent.

## Sources

1. European Commission, *Code of Practice on Transparency of AI-generated Content*, 2026-06-10. https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content
2. Coalition for Content Provenance and Authenticity, *C2PA Technical Specifications, version 2.4*. https://spec.c2pa.org/specifications/specifications/2.4/index.html
3. Coalition for Content Provenance and Authenticity, *Content Credentials: Deployment Guidance*, 2026-07-08. https://c2pa.org/wp-content/uploads/sites/33/2026/07/Content-Credentials-Deployment-Guidance.pdf
4. arXiv, *Verifying Provenance of Digital Media: Why the C2PA Specifications Fall Short*, 2026-04-27. https://arxiv.org/abs/2604.24890v1

## Methodology note

This article was first published in September–October 2026 and has been updated with a new headline and summary. Claims are attributed to the sources listed above. See our [editorial policy](/editorial-policy/) for how we source, review and correct our reporting.
