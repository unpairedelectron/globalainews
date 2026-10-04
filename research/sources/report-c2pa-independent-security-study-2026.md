Source: https://arxiv.org/html/2604.24890v1
Title: Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short
Fetched: 2026-10-04T09:50:11.003Z

Title:

Content selection saved. Describe the issue below:

Description:

![](https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg)arXiv is now an independent nonprofit! [Learn more](https://info.arxiv.org/about) ×

[License: CC Zero](https://info.arxiv.org/help/license/index.html#licenses-available)

arXiv:2604.24890v1 \[cs.CR\] 27 Apr 2026

# Verifying Provenance of Digital Media:   Why the C2PA Specifications Fall Short

Enis Golaszewski1Neal Krawetz2Alan T. Sherman1Edward Zieglar3

Sai K. Matukumalli1Roberto Yus1Carson L. Kegley1Michael Barthel1

William Bowman1Bharg Barot1Kaur Kullman1E-mail: [{golaszewski, sherman, smatuku1,\\
ryus, ckegley1, mbarthe1, wbowman4, bhargvb1}@umbc.edu](mailto:%7Bgolaszewski,%20sherman,%20smatuku1,%0Aryus,%20ckegley1,%20mbarthe1,%20wbowman4,%20bhargvb1%7D@umbc.edu)E-mail: [krawetz26@hackerfactor.com](mailto:krawetz26@hackerfactor.com)E-mail: [evziegl@uwe.nsa.gov](mailto:evziegl@uwe.nsa.gov)

††institute:
Cyber Defense Lab, University of Maryland, Baltimore County (UMBC), Baltimore, MD 21250

and Hacker Factor, Fort Collins, Colorado,

and National Security Agency, Fort George G. Meade, Maryland,

April 23, 2026

## Executive Summary

The rapid rise of generative AI has made it easy to create convincing fake media at scale.
In response, an industrial coalition has developed the
Coalition for Content Provenance and Authenticity (C2PA),
a system intended to provide verifiable provenance for digital content.
Our research team [Golaszewski et al. (2026)](https://arxiv.org/html/2604.24890v1#bib.bib2 "") conducted the first comprehensive, independent security analysis of C2PA.
Our study includes the first formal-methods analysis of C2PA’s core protocols.
We find that the current C2PA specifications fail to achieve their claimed security goals.
Furthermore, they also fail to achieve
key additional goals, which all such provenance systems require for trustworthy deployment.
As a result, C2PA may mislead users, platforms, and policymakers if relied upon prematurely.
C2PA is a promising idea, but it should not yet be relied upon for high-stakes uses
such as financial disclosures, journalism, or legal evidence.

## The Problem of Misinformation

The ubiquity of AI has rapidly lowered the cost of producing persuasive, high-quality synthetic media.
A single actor can fabricate images that appear to depict real events, real people, and real documents, at a scale and fidelity that strains human judgment and existing forensic tools.
The harms are well understood: fraud enabled by counterfeit evidence, reputation attacks, and political manipulation through fabricated content.

## What is C2PA?

C2PA aims to provide provenance signals about how digital media were created and modified.
C2PA attaches machine-verifiable metadata intended to help audiences and platforms determine where, when, and how an asset was created or edited.
Such provenance signals are an achievable useful partial step toward helping consumers assess
the authenticity of digital objects (e.g., “Is the image real versus fake?”).
Provenance describes the history of a file,
whereas authenticity concerns, for example, whether the content truthfully represents real-world events.
C2PA provides provenance signals, not proof of authenticity.

C2PA is not a government or international standard.
It is an industry-led effort consisting of
the C2PA coalition,
a set of technical specifications,
a broader ecosystem with tools (e.g., claim generators) and services (e.g., timestamping), and
a conformance program intended to certify products (e.g., validators).
Major companies including Adobe, Google, Microsoft, Meta, and Amazon participate and have endorsed its adoption.

## What C2PA Claims to Do

C2PA attaches “content credentials” (Crs) to digital media. These credentials can describe:
who or what created the content (e.g., a camera or AI system),
when and where it was created, and whether it is original or edited.
These credentials are protected using cryptographic digital signatures,
similar to those used in secure web communications.
However, C2PA was not designed to determine authenticity.
Despite this limitation, misleading promotional materials (e.g., [Adobe (2025)](https://arxiv.org/html/2604.24890v1#bib.bib1 ""))
and public statements by C2PA advocates have sometimes overstated what the technology delivers,
creating a risk that policymakers and the public
will place more trust in C2PA signals than is warranted.

The C2PA specifications make only two security claims:

1. 1.


Claim integrity: Conforming validators can detect tampering of the Crs.

2. 2.


Weak file integrity: Conforming validators can detect if certain bits of the digital asset were modified.


This second claim is very limited in that it applies only to the bits outside of the “exclusion range”
(a set of bit positions) and does not apply to the bits in the exclusion range.

As we point out in our study, any such provenance system should also include the following three additional
essential security goals:

1. 3.


Timestamp agreement: The claim generator (e.g., camera) and validator should agree on the timestamp.

2. 4.


Validator consistency: Conforming validators (sharing the same specification version and trust lists) should agree on the validity of any given claim.

3. 5.


Strong file integrity: Conforming validators should detect if any bits of the digital asset were modified (including non-C2PA metadata).


## C2PA Fails to Deliver on Its Claims

Due to vulnerabilities in the specifications (Versions 2.2–2.4),
weaknesses in the cryptographic engineering, and
limitations of the conformance program,
the C2PA specifications and implementations do not achieve any
of their claimed security goals or any of the essential security goals:

- •


Conforming validators are not required to check for revoked certificates, allowing adversaries to
use compromised keys without detection, defeating all five security goals.

- •


Exploiting inadequate cryptographic bindings, adversaries can replace timestamps without detection.

- •


Missing information (e.g., version number), overly liberal policies, and
certification failing to check source code results in
conforming validators that sometimes give
contradictory results when assessing the provenance of a digital asset.


Although the underlying cryptography in C2PA is battle tested,
its integration in the specifications is not and has failed our tests.

## Key Findings

Our study evaluated the C2PA specifications, real-world implementations,
the conformance program, and validation tools.
We identified several systemic weaknesses.
Figures [1](https://arxiv.org/html/2604.24890v1#Sx6.F1 "Figure 1 ‣ 1. Timestamps Can Be Forged or Altered ‣ Key Findings ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short")– [4](https://arxiv.org/html/2604.24890v1#Sx7.F4 "Figure 4 ‣ Why Our Findings Matter for Policy ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short") present four concrete examples that illustrate how adversaries can exploit vulnerabilities in the C2PA specifications to create forgeries and sow confusion.

### 1\. Timestamps Can Be Forged or Altered

![Refer to caption](https://arxiv.org/html/2604.24890v1/images/ts-onion.png)(a)Layers of C2PA protection.

![Refer to caption](https://arxiv.org/html/2604.24890v1/images/timestamp-screenshot-big-annotated.png)(b)Image with altered timestamp.

Figure 1: Timestamps can be replaced without detection.
C2PA uses a layered security approach: the signature protects the media and the optional trusted timestamp protects the signature. Nothing in the signed data references the timestamp, allowing removal and replacement without detection.
We altered the timestamp in this image.
C2PA validators display the date without noting that it may not be original.
The arrows point to where the CAI Verify validator displays altered dates.

C2PA relies on trusted timestamp authorities to indicate when content was signed.
However, through our formal-methods analysis, we found that
these timestamps can be replaced or modified without detection. Furthermore,
conforming validators may accept conflicting timestamps as valid (Figure [1](https://arxiv.org/html/2604.24890v1#Sx6.F1 "Figure 1 ‣ 1. Timestamps Can Be Forged or Altered ‣ Key Findings ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short")).
This vulnerability undermines trust in determining when content was created—an essential factor
in journalism and legal contexts.

In our study, we suggest ways using signed timestamped assertions
to provide evidence when the content was created or signed.
Our suggestion is not vulnerable to the aforementioned timestamp manipulation.

### 2\. Revoked or Compromised Credentials Are Still Accepted

![Refer to caption](https://arxiv.org/html/2604.24890v1/images/adam-horshack-2-screenshot.png)Figure 2: Validators accept revoked certificates and conforming validators present contradictory results, permitting forgeries without detection.
Using a Nikon Z6 III, Adam Horshack demonstrated how to use the camera to sign an AI image. In November 2025, Nikon revoked the camera’s certificate. Over six months later, Adobe Inspect (pictured here) reports the signature as valid, while Verifieddit reports it as invalid. Neither conforming validator reports the revocation.

If a signing key is compromised, it should be revoked. However,
(a) many conforming validators fail to check revocation properly, and
(b) some conforming validators continue to accept known compromised credentials.
This vulnerability allows attackers to create forged content that appears
legitimate (Figure [2](https://arxiv.org/html/2604.24890v1#Sx6.F2 "Figure 2 ‣ 2. Revoked or Compromised Credentials Are Still Accepted ‣ Key Findings ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short")).

Out of concern for privacy, the C2PA specifications intentionally make checking for revoked certificates optional, and when done, permit such checking only via the Online Certificate Status Protocol (OCSP),
expressly forbidding certificate revocation lists (CRLs).
This design choice is flawed in two ways. First, to achieve the security goals, it is
essential to check for revoked certificates. Second, CRLs offer much better privacy properties
than OCSP provides.

### 3\. Different Tools Produce Contradictory Results

We tested multiple widely used validators and found that
(a) the same image can be labeled valid by one tool and invalid by another, and
(b) users may receive conflicting conclusions about the same media, including
concerning whether it was AI-generated.
This inconsistency creates confusion and undermines trust (Figure [2](https://arxiv.org/html/2604.24890v1#Sx6.F2 "Figure 2 ‣ 2. Revoked or Compromised Credentials Are Still Accepted ‣ Key Findings ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short")).

![Refer to caption](https://arxiv.org/html/2604.24890v1/images/example5-proofmode-annotated.png)(a)Image with altered GPS location. The arrow points to the modified GPS location.

![Refer to caption](https://arxiv.org/html/2604.24890v1/images/exclusion.png)(b)Bytes in the exclusion range can be modified without detection.

Figure 3: Google’s conforming Pixel 10 Pro camera places GPS information in an exclusion range, enabling an attacker to insert a false GPS location. In this image taken by a Pixel 10 Pro, we modified the GPS location. The conforming Proofmode Verify validator does not detect our alteration and displays the false GPS location.

### 4\. Parts of Files Can Be Modified Without Detection

The C2PA specifications allow certain parts of a file (such as metadata) to be excluded from
protection (Figure [3](https://arxiv.org/html/2604.24890v1#Sx6.F3 "Figure 3 ‣ 3. Different Tools Produce Contradictory Results ‣ Key Findings ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short")).
(a) These regions can be altered without invalidating the signature, and
(b) important information (e.g., location data) can be changed undetected.
This vulnerability undermines trust.

To address privacy concerns, the C2PA specifications support an exclusion range so that certain
data (e.g., GPS location) may be redacted after the media were created. In our study, we suggest
a better way (involving additional signatures) to handle such redactions.

### 5\. Credentials Expire and Become Unverifiable

Due in part to expired certificates, some C2PA-signed media have already become unverifiable—sometimes within months (Figure [4](https://arxiv.org/html/2604.24890v1#Sx7.F4 "Figure 4 ‣ Why Our Findings Matter for Policy ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short")). This situation is incompatible with legal
requirements for election record retention (22 months under 52 U.S.C. § 20701), financial records (25 months, 12 C.F.R. § 1002.12), political ads (2 years, 47 C.F.R. § 73.3526), and other archival needs.

### 6\. Certification Does Not Ensure Compliance with the Specifications

C2PA provides a “conformance program” to certify products. However,
the conformance program does not define security requirements for conforming validators.
Certification is based largely on self-reported compliance with no examination
of the product’s functionality or source code.
As a result, “conforming” products do not necessarily comply with the specifications.
Furthermore, because the specifications have vulnerabilities, a product that complies with the
specifications does not necessarily satisfy the claimed security goals.

## Why Our Findings Matter for Policy

C2PA is already being promoted as part of a solution for high-stake applications including:
combating misinformation,
disclosing financial information,
supporting journalism, and
providing legal evidence of digital media.
If the underlying system is unreliable:
false content may be mistakenly trusted,
legitimate content may be wrongly dismissed, and
public confidence may erode further.
Premature adoption of C2PA could worsen the misinformation problem rather than solve it.

![Refer to caption](https://arxiv.org/html/2604.24890v1/images/azsos.png)Figure 4: C2PA-signed media can expire and become unverifiable. The image is part of the Arizona Secretary of State’s C2PA pilot program.
It validated in January 2025, but fails to validate a year later (e.g., by CAI’s Verify and Adobe’s Content Authenticity Inspect),
even though the file has not changed.

## Key Recommendations

Before relying on C2PA in policy or regulation, several improvements are essential:

- •


Require strict certificate revocation checking (including via privacy-preserving methods).

- •


Ensure timestamps are securely bound to content and cannot be altered without detection.

- •


Mandate consistency across validation tools.

- •


Protect the entire file (including non-C2PA metadata), not just selected portions.

- •


Establish independent security audits for certified products.

- •


Clarify claims and limitations in public communications about C2PA.


Our study offers concrete ways to implement these improvements.
Beyond C2PA, it would be useful to integrate C2PA with services for
reputation, fact-checking, and
directing users to the original sources of digital assets.

The Pixel 10 Pro and Version 2.3 (January 2026) of the specifications incorporated some of our suggestions.
Version 2.4 (April 2026) does not address any of our concerns.
We hope our remaining recommendations will be implemented by later specification versions and future validators.
C2PA could eventually be positioned to become a widely adopted useful tool
for helping people to assess the provenance of digital assets.
We hope that our study and recommendations will accelerate this process and strengthen C2PA.

## Conclusion

C2PA represents an important step toward addressing the growing problem of digital misinformation.
However, the specifications are currently flawed, incomplete, inconsistent, and vulnerable to misuse.
Policymakers should view C2PA as an emerging technology, not a mature solution.
Careful cybersecurity engineering, stronger safeguards, and independent scrutiny are essential before widespread adoption.

## References

- Adobe (2025)AdobeContent credentials.
Note: [https://lion.app.box.com/s/rang889q86q1jb80i3phxiww6mzlwcyj](https://lion.app.box.com/s/rang889q86q1jb80i3phxiww6mzlwcyj "") 3 min video promotion.Cited by: [What C2PA Claims to Do](https://arxiv.org/html/2604.24890v1#Sx4.p1.1 "What C2PA Claims to Do ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short").

- Golaszewski et al. (2026)E. Golaszewski, N. Krawetz, A. T. Sherman, E. Zieglar, S. K. Matukumalli, R. Yus, C. L. Kegley, M. Barthel, W. Bowman, B. Barot, and K. KullmanVerifying provenance of digital media: security analysis of C2PA and its implementation.
Note: [https://eprint.iacr.org/2026/804](https://eprint.iacr.org/2026/804 "")Cited by: [Executive Summary](https://arxiv.org/html/2604.24890v1#Sx1.p1.1 "Executive Summary ‣ Verifying Provenance of Digital Media:Why the C2PA Specifications Fall Short").