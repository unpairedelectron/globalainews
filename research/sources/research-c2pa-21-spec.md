Source: https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html
Title: Content Credentials : C2PA Technical Specification :: C2PA Specifications
Fetched: 2026-10-04T09:35:02.061Z
Truncated: continue from startIndex 250000

2.1

[2.4](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html) [2.3](https://spec.c2pa.org/specifications/specifications/2.3/specs/C2PA_Specification.html) [2.2](https://spec.c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html) [2.1](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html) [2.0](https://spec.c2pa.org/specifications/specifications/2.0/specs/C2PA_Specification.html) [1.4](https://spec.c2pa.org/specifications/specifications/1.4/specs/C2PA_Specification.html) [1.3](https://spec.c2pa.org/specifications/specifications/1.3/specs/C2PA_Specification.html) [1.2](https://spec.c2pa.org/specifications/specifications/1.2/specs/C2PA_Specification.html) [1.1](https://spec.c2pa.org/specifications/specifications/1.1/specs/C2PA_Specification.html) [1.0](https://spec.c2pa.org/specifications/specifications/1.0/specs/C2PA_Specification.html)

# Content Credentials : C2PA Technical Specification

Table of Contents

- [1\. Introduction](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_introduction)
  - [1.1. Overview](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_overview)
  - [1.2. Scope](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_scope)
  - [1.3. Technical Overview](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_technical_overview)
- [2\. Glossary](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_glossary)
  - [2.1. Introductory terms](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_introductory_terms)
  - [2.2. Assets and Content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assets_and_content)
  - [2.3. Core Aspects of C2PA](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_core_aspects_of_c2pa)
  - [2.4. Additional Terms](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_additional_terms)
  - [2.5. Overview](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_overview_2)
- [3\. Normative References](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_normative_references)
  - [3.1. Core Formats](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_core_formats)
  - [3.2. Schemas](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_schemas)
  - [3.3. Digital & Electronic Signatures](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_electronic_signatures)
  - [3.4. Embeddable Formats](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embeddable_formats)
  - [3.5. Other](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_other)
- [4\. Standard Terms](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_standard_terms)
- [5\. Versioning](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_versioning)
  - [5.1. Compatibility](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_compatibility)
  - [5.2. Version History](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_version_history)
- [6\. Assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertions)
  - [6.1. General](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_general)
  - [6.2. Labels](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_labels)
  - [6.3. Versioning](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_versioning_2)
  - [6.4. Multiple Instances](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_multiple_instances)
  - [6.5. Schema Validation](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_schema_validation)
  - [6.6. Assertion Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertion_store)
  - [6.7. Embedded vs Externally-Stored Data](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedded_vs_externally_stored_data)
  - [6.8. Redaction of Assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_redaction_of_assertions)
- [7\. Data Boxes](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_boxes)
  - [7.1. General](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_general_2)
  - [7.2. Schema and Example](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_schema_and_example)
- [8\. Unique Identifiers](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_unique_identifiers)
  - [8.1. Uniquely Identifying C2PA Manifests and Assets](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uniquely_identifying_c2pa_manifests_and_assets)
  - [8.2. Versioning Manifests Due to Conflicts](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_versioning_manifests_due_to_conflicts)
  - [8.3. Identifying Non-C2PA Assets](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_identifying_non_c2pa_assets)
  - [8.4. URI References](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references)
- [9\. Binding to Content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_binding_to_content)
  - [9.1. Overview](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_overview_3)
  - [9.2. Hard Bindings](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hard_bindings)
  - [9.3. Soft Bindings](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_soft_bindings)
- [10\. Claims](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claims)
  - [10.1. Overview](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_overview_4)
  - [10.2. Syntax](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_syntax)
  - [10.3. Creating a Claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_creating_a_claim)
  - [10.4. Multiple Step Processing](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_multiple_step_processing)
- [11\. Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_manifests)
  - [11.1. Use of JUMBF](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_use_of_jumbf)
  - [11.2. Types of Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_types_of_manifests)
  - [11.3. Embedding manifests into various file formats](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_various_file_formats)
  - [11.4. External Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_external_manifests)
  - [11.5. Embedding a Reference to an external Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_a_reference_to_an_external_manifest)
- [12\. Entity Diagram](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_entity_diagram)
- [13\. Cryptography](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_cryptography)
  - [13.1. Hashing](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing)
  - [13.2. Digital Signatures](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_signatures)
- [14\. Trust Model](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trust_model)
  - [14.1. Overview](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_overview_5)
  - [14.2. Identity of Signers](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_identity_of_signers)
  - [14.3. Validation states](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validation_states)
  - [14.4. Trust Lists](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trust_lists)
  - [14.5. X.509 Certificates](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates)
- [15\. Validation](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#validation-clause)
  - [15.1. Validation Process](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validation_process)
  - [15.2. Returning Validation Results](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_returning_validation_results)
  - [15.3. Displaying Manifest Information](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_displaying_manifest_information)
  - [15.4. Determining the hashing algorithm](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_determining_the_hashing_algorithm)
  - [15.5. Locating the Active Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_locating_the_active_manifest)
  - [15.6. Locating and Validating the Claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_locating_and_validating_the_claim)
  - [15.7. Validate the Signature](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_signature)
  - [15.8. Validate the Time-Stamp](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_time_stamp)
  - [15.9. Validate the Credential Revocation Information](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_credential_revocation_information)
  - [15.10. Validate the Assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_assertions)
  - [15.11. Validate the Ingredients](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_ingredients)
  - [15.12. Validate the Asset’s Content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_assets_content)
- [16\. User Experience](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_user_experience)
  - [16.1. Approach](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_approach)
  - [16.2. Principles](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_principles)
  - [16.3. Disclosure Levels](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_disclosure_levels)
  - [16.4. Public Review, Feedback and Evolution](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_public_review_feedback_and_evolution)
- [17\. Information security](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_information_security)
  - [17.1. Threats and Security Considerations](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_threats_and_security_considerations)
  - [17.2. Harms, Misuse, and Abuse](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_harms_misuse_and_abuse)
- [18\. C2PA Standard Assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_standard_assertions)
  - [18.1. Introduction](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_introduction_3)
  - [18.2. Regions of Interest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_regions_of_interest)
  - [18.3. Metadata About Assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_metadata_about_assertions)
  - [18.4. Standard C2PA Assertion Summary](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_standard_c2pa_assertion_summary)
  - [18.5. Data Hash](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_hash)
  - [18.6. BMFF-Based Hash](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_bmff_based_hash)
  - [18.7. General Boxes Hash](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_general_boxes_hash)
  - [18.8. Collection Data Hash](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_collection_data_hash)
  - [18.9. Soft Binding](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#soft_binding_assertion)
  - [18.10. Cloud Data](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_cloud_data)
  - [18.11. Thumbnail](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#thumbnail_assertion)
  - [18.12. Actions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actions)
  - [18.13. Ingredient](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#ingredient_assertion)
  - [18.14. Metadata](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_metadata)
  - [18.15. Asset Reference](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset_reference)
  - [18.16. Asset Type](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset_type)
  - [18.17. Depthmap](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_depthmap)
  - [18.18. Font Information](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_font_information)
- [19\. Patent Policy](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_patent_policy)
- [Appendix A: Embedding manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#embedding_annex)
  - [A.1. Supported Formats](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_supported_formats)
  - [A.2. Embedding manifests into non-BMFF-based assets](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_non_bmff_based_assets)
  - [A.3. Embedding manifests into PDFs](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_pdfs)
  - [A.4. Embedding manifests into BMFF-based assets](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_bmff_based_assets)
  - [A.5. Embedding manifests into ZIP-based formats](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_zip_based_formats)
- [Appendix B: Implementation Details for `c2pa.metadata`](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#metadata_annex)
  - [B.1. Completely Supported Schemas](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_completely_supported_schemas)
  - [B.2. Partially Supported Schemas](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_partially_supported_schemas)
- [Appendix C: Considerations for Deprecation](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#versioning_annex)
  - [C.1. Deprecated Constructs](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_deprecated_constructs)

[![Creative Commons License](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/CCby4.png)](http://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

* * *

THESE MATERIALS ARE PROVIDED “AS IS.” The parties expressly disclaim any warranties (express, implied, or otherwise), including implied warranties of merchantability, non-infringement, fitness for a particular purpose, or title, related to the materials. The entire risk as to implementing or otherwise using the materials is assumed by the implementer and user. IN NO EVENT WILL THE PARTIES BE LIABLE TO ANY OTHER PARTY FOR LOST PROFITS OR ANY FORM OF INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY CHARACTER FROM ANY CAUSES OF ACTION OF ANY KIND WITH RESPECT TO THIS DELIVERABLE OR ITS GOVERNING AGREEMENT, WHETHER BASED ON BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE, AND WHETHER OR NOT THE OTHER MEMBER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## 1\. Introduction

### 1.1. Overview

With the increasing velocity of digital content and the increasing availability of powerful creation and editing techniques, establishing the provenance of media is critical to ensure transparency, understanding, and ultimately, trust.

We are witnessing extraordinary challenges to trust in media. As social platforms amplify the reach and influence of certain content via ever more complex and opaque algorithms, mis-attributed and mis-contextualized content spreads quickly. Whether inadvertent misinformation or deliberate deception via disinformation, inauthentic content is on the rise.

Currently, those who wish to include metadata about their work cannot do so in a secure, tamper-evident and standardized way across platforms. Without this information coming from a recognized source, publishers and consumers lack critical context for determining the authenticity of media.

Provenance empowers content creators and editors, regardless of their geographic location or degree of access to technology, to disclose information about how an asset was created, how it was changed and what was changed. Each time an asset is changed, the existing provenance of the asset is preserved, with each new change being added to the provenance. In this way, content with provenance provides indicators of authenticity so that consumers can have awareness of altered content. Such provenance could include what has been changed and the source of those changes. This ability to provide provenance for creators, publishers and consumers is essential to facilitating trust online.

To address this issue at scale for publishers, creators and consumers, the Coalition for Content Provenance and Authenticity (C2PA) has developed this technical specification for providing content provenance and authenticity. It is designed to enable global, opt-in, adoption of digital provenance techniques through the creation of a rich ecosystem of digital provenance enabled applications for a wide range of individuals and organizations while meeting appropriate security requirements.

This specification has been, and continues to be, informed by scenarios, workflows and requirements gathered from industry experts and partner organizations, including the [Project Origin Alliance](https://www.originproject.info/) and the [Content Authenticity Initiative (CAI)](https://contentauthenticity.org/). It is also possible that regulatory bodies and governmental agencies could utilize this specification to establish standards for digital provenance.

### 1.2. Scope

This specification describes the technical aspects of the C2PA architecture; a model for storing and accessing cryptographically verifiable information whose trustworthiness can be assessed based on a defined [trust model](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trust_model). Included in this document is information about how to create and process a C2PA Manifest and its components, including the use of digital signature technology for enabling tamper-evidence as well as establishing trust.

Prior to developing this specification, the C2PA created our [Guiding Principles](https://c2pa.org/principles/) that enabled us to remain focused on ensuring that the specification can be used in ways that respect privacy and personal control of data with a critical eye toward potential abuse and misuse. For example, implementers of this specification are strongly encouraged to provide creators and publishers of media assets with the ability to control whether certain provenance data is included.

|     |     |
| --- | --- |
|  | From the overarching goals section of the guiding principles:<br>> C2PA specifications SHOULD NOT provide value judgments about whether a given set of provenance data is 'good' or 'bad,' merely whether the assertions included within can be validated as associated with the underlying asset, correctly formed, and free from tampering. |

It is important that the specification does not negatively impact content accessibility for consumers.

Other documents from the C2PA will address specific implementation considerations such as expected user experiences and details of our threat and harms modelling.

### 1.3. Technical Overview

The C2PA information comprises a series of statements that cover areas such as asset creation, edit actions, capture device details, bindings to content and many other subjects. These statements, called assertions, make up the provenance of a given asset and represent a series of trust signals that can be used by a human to improve their view of trustworthiness concerning the asset. Assertions are wrapped up with additional information into a digitally signed entity called a claim. This claim is digitally signed by the signer, producing the claim signature.

These assertions, claims, and the claim signature are all bound together into a verifiable unit called a C2PA Manifest (see [Figure 1, “A C2PA Manifest and its constituent parts”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#manifest-parts)) by a hardware or software component called a claim generator. The set of C2PA Manifests, as stored in the asset’s Content Credential, represent its provenance data.

![A C2PA Manifest and its parts](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/Manifest.drawio.svg)

Figure 1. A C2PA Manifest and its constituent parts

#### 1.3.1. Establishing Trust

The basis of making trust decisions in C2PA, our [trust model](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trust_model), is the identity of the signer associated with the cryptographic signing key used to sign the claim(s) in the C2PA Manifest Store. The claim signatures of C2PA Manifests, when combined with trusted time-stamps, can undergo the validation process indefinitely to determine if claims were signed while the signing credentials were valid and not revoked.

#### 1.3.2. An Example

A very common scenario will be a user taking a photograph with their C2PA-enabled camera (or phone). In that instance, the camera would create a manifest containing some assertions including information about the camera itself, a thumbnail of the image and some cryptographic hashes that bind the photograph to the manifest. These assertions would then be listed in the Claim, which would be digitally signed and then the entire C2PA Manifest (see [Figure 2, “Example C2PA Manifest of a Photograph”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#Photo_Manifest)) would be embedded into the output JPEG. This C2PA Manifest would remain valid indefinitely.

![Example C2PA Manifest of a Photograph](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/Photo_Manifest.svg)

Figure 2. Example C2PA Manifest of a Photograph

A Manifest Consumer, such as a C2PA validator, helps users to establish the trustworthiness of the asset by first validating the digital signature and its associated credential. It also checks each of the assertions for validity and presents the information contained in them, and the signature, to the user in a way that they can then make an informed decision about the trustworthiness of the digital content.

#### 1.3.3. Design Goals

In the creation of the C2PA architecture, it was important to establish some clear goals for the work to ensure that the technology was usable across a wide spectrum of hardware and software implementations worldwide and accessible to all. Those goals can be found in [Table 1, “C2PA Design Goals”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#design-goals).

| Goal | Description |
| --- | --- |
| Privacy | Enable users to control the privacy of their information, including consumption data and information recorded in provenance |
| Responsibility | Ensure consumers can determine the provenance of an asset |
| Scalability | Enable creation/consumption/validation of media provenance at the same scale as media creation/consumption on the web |
| Extensibility | Ensure future metadata and credential providers are able to add their information without requiring input or approval from the C2PA |
| Interoperability | Ensure that differing implementations are able to operate with each other without ambiguity |
| Whole Workflow Applicability | Maintain the provenance of the asset across multiple tools, from creation through all subsequent modification and publication/distribution |
| Technology Minimalism | Create only the minimum required novel technology in the specification by relying on prior, well-established techniques |
| Security | Design to ensure that consumers can trust the integrity and source of provenance, and ensure the design is reviewed by experts |
| Content Ubiquity | Enable the inclusion of provenance for all common media types, including documents |
| Flexible Locality | Enable both online and offline (asset-only) storage and consumption/validation of provenance |
| Global Universality | Design for the needs of interested users throughout the world |
| Accessibility | Ensure that the technology can be used in a way that conform to recognized accessibility standards, such as WCAG |
| Harms and Misuse | Design to avert and mitigate potential harms, including threats to human rights and disproportionate risks to vulnerable groups |
| Evolving | Continuous review of the specification against these goals to ensure that they remain our priority |

Table 1. C2PA Design Goals

## 2\. Glossary

### 2.1. Introductory terms

#### 2.1.1. Actor

A human or non-human (hardware or software) that is participating in the C2PA ecosystem. For example: a camera (capture device), image editing software, cloud service or the person using such tools.

|     |     |
| --- | --- |
|  | An organization or group of [actors](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actor) may also be considered an [actor](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actor) in the C2PA ecosystem. |

#### 2.1.2. Claim generator

The non-human (hardware or software) [actor](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actor) that generates the [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim) about an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) as well as the [claim signature](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim_signature), thus leading to the [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset)'s associated [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

#### 2.1.3. Signer

The credential holder of a private key that is used to sign the [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim). The [signer](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signer) is identified by the subject of the credential.

#### 2.1.4. Manifest consumer

An [actor](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actor) who consumes an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) with an associated [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) for the purpose of obtaining the [provenance data](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_provenance_data) from the [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

#### 2.1.5. Validator

A [Manifest Consumer](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_manifest_consumer) whose role is to perform the actions described in [validation](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#validation-clause).

#### 2.1.6. Action

An operation performed by an [actor](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actor) on an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset). For example, "create", "embed", or "apply filter".

### 2.2. Assets and Content

#### 2.2.1. Digital content

The portion of an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) that represents the actual content, such as the pixels of an image, along with any additional technical metadata required to understand the content (e.g., a colour profile or encoding parameters).

#### 2.2.2. Asset metadata

Non-technical information about the [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) and its [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content).

#### 2.2.3. Asset

A file or stream of data containing [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content), [asset metadata](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset_metadata) and optionally, a [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

|     |     |
| --- | --- |
|  | For the purposes of this definition, we will extend the typical definition of "file" to include cloud-native and dynamically generated data. |

#### 2.2.4. Derived asset

A [derived asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_derived_asset) is an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) that is created by starting from an existing [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) and performing [actions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_action) to it that modify its [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content).

**EXAMPLE:** An audio stream that has been shortened or a document where pages have been added.

#### 2.2.5. Asset rendition

A representation of an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) (either as a part of an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) or a completely new [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset)) where the [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) has had a 'non-editorial transformation' [action](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_action) (e.g., re-encoding or scaling) applied.

**EXAMPLE:** A video file that is re-encoded for reduced screen resolution or network bandwidth.

#### 2.2.6. Composed asset

A composed asset is an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) that is created by building up a collection of multiple parts or fragments of [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) (referred to as [ingredients](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_ingredient)) from one or more other [assets](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset). When starting from an existing [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset), it is a special case of a [derived asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_derived_asset) \- however a [composed asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_derived_asset) can also be one that starts from a "blank slate".

**EXAMPLES:**

- A video created by importing existing video clips and audio segments into a "blank slate".

- An image where another image is imported and super-imposed on top of the starting image.


### 2.3. Core Aspects of C2PA

#### 2.3.1. Assertion

A data structure which represents a statement either made (or "created") by the [signer](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#signer-definition) or simply gathered at claim generation-time, concerning the [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset). This data is a part of the [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

#### 2.3.2. Claim

A digitally signed and tamper-evident data structure that references a set of [assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertion), concerning an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset), and the information necessary to represent the [content binding](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_content_binding). If any [assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertion) were redacted, then a declaration to that effect is included. This data is a part of the [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

#### 2.3.3. Claim signature

The digital signature on the [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim) using the private key of a [signer](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#signer-definition). The [claim signature](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim_signature) is a part of the [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

#### 2.3.4. C2PA Manifest

The set of information about the _provenance_ of an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) based on the combination of one or more [assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertion) (including [content bindings](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_binding_to_content)), a single [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim), and a [claim signature](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim_signature). A [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) is part of a [C2PA Manifest Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest_store).

|     |     |
| --- | --- |
|  | A [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) can reference other [C2PA Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest). |

#### 2.3.5. C2PA Manifest Store

A collection of [C2PA Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) that can either be embedded into an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) or be external to its [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset).

#### 2.3.6. Content Credential

This is the preferred, non-technical, term for a [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest). The [C2PA Manifest Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest_store) therefore represents the Content Credentials of an asset.

Content Credentials also refers to the overall C2PA technology, and is therefore essentially treated as a plural noun. If a [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) is a Content Credential, then multiple [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) or the broader, universal concept is Content Credentials.

#### 2.3.7. Active Manifest

The last manifest in the list of [C2PA Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) inside of a [C2PA Manifest Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest_store) which is the one with the set of [content bindings](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_content_bindings) that are able to be validated.

#### 2.3.8. Provenance

The logical concept of understanding the history of an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) and its interaction with [actors](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actor) and other [assets](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset), as represented by the [provenance data](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_provenance_data).

#### 2.3.9. Provenance data

The set of [C2PA Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) for an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) and, in the case of a [composed asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_composed_asset), its [ingredients](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_ingredient).

|     |     |
| --- | --- |
|  | A [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) can reference other [C2PA Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest). |

#### 2.3.10. Authenticity

A property of [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) comprising a set of facts (such as the [provenance data](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_provenance_data) and [hard bindings](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hard_bindings)) that can be cryptographically verified as not having been tampered with.

#### 2.3.11. Content binding

Information that associates [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) to a specific [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) associated with a specific [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset), either as a [hard binding](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hard_binding) or a [soft binding](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#soft_binding_assertion).

#### 2.3.12. Hard binding

One or more cryptographic hashes that uniquely identifies either the entire [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) or a portion thereof.

#### 2.3.13. Soft binding

A content identifier that is either (a) not statistically unique, such as a [fingerprint](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_fingerprint), or (b) embedded as an [invisible watermark](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_invisible_watermark) in the identified [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content).

#### 2.3.14. Trust signals

The collection of information that can inform a [Manifest Consumer’s](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_manifest_consumer) judgment of the trustworthiness of an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset). These are in addition to the [signer](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#signer-definition) of a [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim), upon which the fundamental trust model relies.

#### 2.3.15. C2PA Trust List

A C2PA-managed list of X.509 certificate trust anchors that issue certificates to hardware & software [signers](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#signer-definition) that are trusted to sign [claims](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim).

### 2.4. Additional Terms

#### 2.4.1. Fingerprint

A set of inherent properties computable from [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) that identifies the content or near duplicates of it.

**EXAMPLE:** An [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) can become separated from its [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) due to removal or corruption of [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) metadata. A [fingerprint](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_fingerprint) of the [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) of the [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) could be used to search a database to recover the [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) with an intact [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

#### 2.4.2. Invisible Watermark

Information incorporated in a substantially human imperceptible way into the [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) of an [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) which can be used, for example, to uniquely identify the [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset) or to store a reference to a [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest).

#### 2.4.3. Visible Watermark

A perceptible component of the [digital content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_content) carrying some human consumable information about the provenance of the [asset](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset).

#### 2.4.4. Manifest Repository

A repository into which [C2PA Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest) and [C2PA Manifest Stores](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_manifest_stores) can be placed, and which can be searched using a [content binding](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_content_binding).

### 2.5. Overview

This image shows how all these various elements come together to represent the C2PA architecture.

![A diagram of how all the parts of C2PA go together](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/Overview_Diagram.svg)

Figure 3. Elements of C2PA

## 3\. Normative References

### 3.1. Core Formats

- [CBOR](https://tools.ietf.org/html/rfc8949)

- [JSON](https://tools.ietf.org/html/rfc8259)

- [JSON-LD](https://www.w3.org/TR/json-ld11/)

- [JPEG universal metadata box format](https://www.iso.org/standard/73604.html) (JUMBF)


### 3.2. Schemas

- [CDDL](https://datatracker.ietf.org/doc/html/rfc8610)

- [JSON Schema](https://json-schema.org/specification-links.html#2020-12)

- [Dublin Core Metadata Initiative](https://www.dublincore.org/specifications/dublin-core/dces/)


### 3.3. Digital & Electronic Signatures

- [X.509 Certificates](https://tools.ietf.org/html/rfc5280)

- [JSON Web Algorithms](https://tools.ietf.org/html/rfc7518) (JWA)

- [CBOR Object Signing and Encryption](https://tools.ietf.org/html/rfc8152) (COSE)

- [Using RSA Algorithms with COSE Messages](https://tools.ietf.org/html/rfc8230)

- [Online Certificate Status Protocol](https://tools.ietf.org/html/rfc6960) (OCSP)

- [Transport Layer Security (TLS) Extensions: Extension Definitions](https://tools.ietf.org/html/rfc6066)

- [Internet X.509 PKI Time-Stamp Protocol](https://tools.ietf.org/html/rfc3161)

- [CBOR Object Signing and Encryption (COSE): Header Parameters for Carrying and Referencing X.509 Certificates](https://datatracker.ietf.org/doc/html/rfc9360)

- [Algorithms and Identifiers for the Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile](https://tools.ietf.org/html/rfc3279)

- [Internet X.509 Public Key Infrastructure: Additional Algorithms and Identifiers for DSA and ECDSA](https://tools.ietf.org/html/rfc5758)

- [Algorithm Identifiers for Ed25519, Ed448, X25519, and X448 for Use in the Internet X.509 Public Key Infrastructure](https://tools.ietf.org/html/rfc8410)

- [PKCS #1: RSA Cryptography Specifications Version 2.2](https://tools.ietf.org/html/rfc8017)

- [Edwards-Curve Digital Signature Algorithm (EdDSA)](https://tools.ietf.org/html/rfc8032)

- [JSON Advanced Electronic Signatures](https://www.etsi.org/deliver/etsi_ts/119100_119199/11918201/01.01.01_60/ts_11918201v010101p.pdf) (JAdES)

- [US Secure Hash Algorithms](https://datatracker.ietf.org/doc/html/rfc6234)

- [X.509 Certificate General-Purpose Extended Key Usage (EKU) for Document Signing](https://www.rfc-editor.org/rfc/rfc9336)

- [Internet X.509 Public Key Infrastructure: Logotypes in X.509 Certificates](https://www.rfc-editor.org/rfc/rfc9399.html)


### 3.4. Embeddable Formats

- [ISO Base Media File Format](https://www.iso.org/standard/74428.html) (BMFF)

- [PDF 1.7](https://www.iso.org/standard/51502.html)

- [PDF 2.0](https://www.iso.org/standard/75839.html)

- [JPEG 1](https://www.iso.org/standard/18902.html)

- [JPEG XT, ISO/IEC 18477-3](https://www.iso.org/standard/66071.html)

- [JPEG XL, ISO/IEC 18181-2:2021](https://www.iso.org/standard/80617.html)

- [PNG](https://www.w3.org/TR/2003/REC-PNG-20031110/)

- [SVG](https://www.w3.org/TR/SVG11/)

- [GIF](https://www.w3.org/Graphics/GIF/spec-gif89a.txt)

- [ID3](https://id3.org/id3v2.3.0)

- [Digital Negative or DNG](https://helpx.adobe.com/content/dam/help/en/photoshop/pdf/dng_spec_1_6_0_0.pdf)

- [TIFF/EP](https://www.iso.org/standard/29377.html)

- [TIFF v6](https://www.itu.int/itudoc/itu-t/com16/tiff-fx/docs/tiff6.pdf))

- [RIFF](https://www.loc.gov/preservation/digital/formats/fdd/fdd000025.shtml)

- [Multi-Picture Format (MPF)](https://www.cipa.jp/e/std/std-sec.html)

- [Open Font Format](https://www.iso.org/standard/74461.html)

- [OpenType](https://learn.microsoft.com/en-us/typography/opentype/spec/)


### 3.5. Other

- [eXtensible Metadata Platform](https://www.iso.org/standard/75163.html) (XMP)

- [JSON-LD serialization of XMP](https://www.iso.org/standard/79384.html)

- [IPTC Photo Metadata Standard](http://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata)

- [Exif](https://www.cipa.jp/std/documents/download_e.html?DC-008-Translation-2019-E)

- [UUID](https://tools.ietf.org/html/rfc4122)

- [Uniform Resource Names (URNs)](https://tools.ietf.org/html/rfc8141)

- [Universally Unique IDentifiers (UUIDs)](https://tools.ietf.org/html/rfc9562)

- [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html)

- [RFC 3339](https://https//www.rfc-editor.org/rfc/rfc3339)

- [RFC 2326](https://www.ietf.org/rfc/rfc2326.txt)

- [Media Fragments](https://www.w3.org/TR/media-frags/)

- [Web Annotation Data Model](https://www.w3.org/TR/annotation-model/)

- [Brotli Compressed Data Format](https://datatracker.ietf.org/doc/html/rfc7932)

- [RFC 5646, BCP 47](https://www.rfc-editor.org/info/rfc5646)


## 4\. Standard Terms

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [BCP 14](https://tools.ietf.org/html/bcp14), [RFC 2119](https://tools.ietf.org/html/rfc2119), and [RFC 8174](https://tools.ietf.org/html/rfc8174) when they appear in any casing (upper, lower or mixed).

## 5\. Versioning

### 5.1. Compatibility

As the Content Credentials specification has evolved, constructs such as box labels, assertions (and their fields), claims and time-stamps have also evolved. New assertions have been added, and some existing assertions and the claim have newer versions with additional fields. In addition, some constructs have been deprecated. In this specification, when a construct is marked as deprecated, that means that a claim generator shall not write that construct (or value), but that a validator should read it.

To facilitate interoperability between claim generators and validators, a claim generator declares which version of the specification it is using to generate the claim. When a claim generator declares that it is using a version of the specification, it is declaring that the active manifest of the asset is produced in accordance with that version of the specification and thus does not contain any deprecated constructs listed under that version of the specification in [Table 19, “Deprecated Constructs”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#deprecated_constructs_table) of [Appendix C, _Considerations for Deprecation_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#versioning_annex).

|     |     |
| --- | --- |
|  | This specification does not dictate the specific technical manner for this declaration, but it is expected that guidance will be provided through other means. |

A validator shall be compatible with at least one version of the specification, but may be compatible with additional versions. A validator that is compatible with a specific version of the specification shall support all non-deprecated constructs listed for that version. If the validator encounters a manifest that uses constructs from a version of the specification that the validator does not support (either because they are deprecated or unknown), it may ignore the deprecated construct and process the rest of manifest as if that construct were not present. Alternatively, the validator may treat the entire manifest as having unknown provenance, by returning either the `ingredient.unknownProvenance` or `manifest.unknownProvenance` status code as appropriate.

### 5.2. Version History

#### 5.2.1. 2.1 - September 2024

This version focuses on both technical and editorial changes to the specification for the purposes of improving the security and reliability of Content Credentials. All publicly disclosed security vulnerabilities have been addressed, and the specification has been updated to reflect the latest best practices in the field.

- Clear definitions of Manifest & Asset states



  - Well-formed Manifests

  - Valid Manifests

  - Trusted Manifests

  - Valid Assets


- Clear definitions and processes for handling deprecation and versioning

- New `c2pa` URN namespace for labelling manifests!



  - including a fully specified ABNF


- New `ingredients v3` assertion



  - Supports richer models of ingredient-based workflows.

  - Support for `dataTypes` and `claimSignature`.

  - Fields renamed to be more consistent with other assertions.

  - Added new validation status fields to accompany the new status info

  - `dc:title` and `dc:format` are now optional


- New `c2pa.hash.bmff.v3` assertion



  - Supports hashing of fixed & variable block sizes for BMFF-based assets


- New time-stamp manifest



  - Establishing a "time of existence" for a given asset.

  - Similar to an update manifest, but with the signer being a TSA


- Improved model for doing standard RFC 3161 time-stamping.



  - `sigTst2` & CTT time-stamping

  - Introduces the new C2PA TSA Trust List


- Improvements in Validation



  - Detailed validation instructions for all standard assertions

  - Validation of ingredients is now required when using the `ingredients` assertion

  - Extended ingredient validation to provide more detailed status information

  - Support for validation of redacted assertions in ingredients

  - Addition of detailed requirements for validation of time-stamps

  - Hashed URIs to data boxes, and any custom boxes, are now validated

  - Defined procedure for handling manifests with matching unique IDs

  - Address "orphaned manifests" in the validation process

  - LOTS of new validation status codes, including a new "informational" code type


- Improvements in documentation & security of hashing methods



  - BMFF-based assets

  - "general boxes"

  - ZIP


- The format embedding section has been moved to its own annex



  - Added support for JPEG-XL


- Improvements to soft bindings

- Improvements to action assertions



  - Either a `c2pa.created` or a `c2pa.opened` is now mandatory in a standard manifest

  - Some new standard action types were added

  - It is now possible to have multiple action assertions in a single manifest

  - Action templates are now better explained with more examples.

  - RFC 3339-based regions of interest


- The various types/forms of unique identifiers for assets have been clarified.

- Added some missing compatibility support for JPEG Trust

- Cleaned up all CDDLs, including removing any normative language

- And various areas of editorial improvements



  - Redefined custom labels to a custom naming scheme.

  - Embedding in PDFs

  - LOTS of editorial improvements to prepare the document for standardization by ISO


#### 5.2.2. 2.0 - January 2024

This version represents a significant departure from previous versions. It reduces the use of the term "actor", which no longer represents humans and organisations. In addition to validator-configured trust lists, it also introduces a new default trust list, the "C2PA Trust List", which is intended to cover certificates issued to hardware and software. This philosophical change led to the following functional changes in the specification:

- Only X.509 certificates may be used for signing.

- Improvements to the Validation & Trust Model sections



  - Introduces the concepts of "well-formed" and "valid" C2PA Manifests

  - Clarifies various aspects of the validation process


- Refined metadata handling



  - removed the deprecated Exif, IPTC and Schema.org metadata assertions

  - defined a new general "metadata assertion" concept

  - `c2pa.metadata` only allows a fixed set of schemas & values

  - the process for creating `c2pa.metadata` is now documented in more detail

  - XMP processing sections have been revamped to reflect relevant changes

  - improved recommendations concerning hashing of standard metadata locations outside the manifest


- Removed the "W3C Verifiable Credentials" section



  - Removed any references to it and the VC Store.

  - Removed the `actors` field from the actions assertion

  - Removed identified humans from assertion metadata


- Removed the "Training & Data Mining" assertion

- Removed the "Endorsements" assertion


In addition, the following other changes were made to improve various aspects of the spec:

- Version v2 version of the claim.



  - Removes deprecated and unused fields

  - Split `assertions` into `created_assertions` & `gathered_assertions`

  - Only allows a single claim generator, which must be the signer

  - `claim-generator-info` now has a specific `operating_system` field


- Box-based hashing is now strongly recommended for any format that supports it

- Removed the deprecated `c2pa.hash.bmff` assertion

- Added a new `c2pa.watermarked` action

- `c2pa.font` actions are now just `font` actions



  - also `c2pa.font.info` is now just `font.info`


- Cleaned up rendering of CDDL schemas

- Updated some normative references & removed notes about future versions

- Lots of editorial improvements including fixed links


#### 5.2.3. 1.4 - November 2023

- Added support for embedding a C2PA Manifest into a ZIP-based format (e.g., EPUB, OOXML, ODF, OpenXPS)

- Manifests can now be compressed into a special `brob` box.

- Added support for multiple file, aka collection, hashing

- Added new regions of interest for text-based formats (e.g., PDF, Office, EPUB, etc.)

- Added new `c2pa.metadata` assertion to support Exif, IPTC, Schema.org and XMP

- Major revision to TIFF embedding support

- Added support for embedding C2PA Manifests inside of OpenType and TrueType fonts

- Introduced support for object-level manifests in PDF

- Extended the Link header support for embedded manifests

- Clarified issues with box hashing

- Clarified issues on signing including time stamping, PKIStatus & document signing EKU

- Align with Exif 3.0

- Improvements to the CDDL schemas

- Many editorial improvements


#### 5.2.4. 1.3 - April 2023

- New v2 version of the actions assertion with support for many new options

- New v2 version of the ingredient assertion with support for embedded data

- New asset reference & asset type assertions

- New data boxes, for storing arbitrary data inside the Manifest

- New generic box hash methodology for a more inclusive byte range hashing

- New "Regions of Interest" data structures that can be applied to various assertions

- Added document signing EKU as an alternative default EKU for C2PA signers when a validator is not configured with an EKU list

- Added a new `digitalSourceType` field for use by C2PA

- Added support for many new formats: MPF, WebP, AIFF, AVI, GIF

- Updated Entity diagram to reflect additions since 1.0

- Updated COSE header definition for X.509 certificates to RFC 9360

- Updated the guidance on PDF embedding and its relationship to PDF signatures

- Updated information about JUMBF hashing and JUMBF box toggles

- Deprecated v1 of the BMFF Hash

- Clarified use of the JUMBF Protection Box in a C2PA Manifest

- Clarified C2PA-specific requirement that all intermediate X.509 certificates be included in COSE signatures

- Clarified that time-stamps are valid indefinitely

- LOTS of editorial improvements!!


#### 5.2.5. 1.2 - October 2022

- Added details about how to embed a C2PA Manifest in DNG or TIFF

- Added new `digitalSourceType` field to Actions

- Changed `stds.iptc.photometadata` → `stds.iptc` to support IPTC video metadata

- Clarified versioning of assertions when adding optional fields


#### 5.2.6. 1.1 - September 2022

- Define a mechanism to support salting box hashing

- New `c2pa.hash.bmff.v2` assertion, with changes to hashing model, to improve security

- Enable assertion metadata for the Claim

- Replaced `claim_generator_hints` with `claim_generator_info`

- Added a new assertion to support the concept of Endorsements

- Improvements to the `c2pa.actions` assertion

- All Error & Status Codes are now prefixed with `c2pa`

- Define mechanism for redaction of W3C VC’s

- Clarify validation of EKUs in certificates

- Validation algorithm revised to reflect technical changes

- Corrections to the CDDL and JSON schemas to match normative text

- Revise figures to reflect changes

- Various Editorial and Typographical Corrections

- Update Normative References (incl. JUMBF & W3C VC Data Model)


#### 5.2.7. 1.0 - December 2021

- Initial Release


## 6\. Assertions

### 6.1. General

It is expected that each claim generator, used by actors in the system that creates or processes an asset, will create or assemble one or more assertions about when, where, and how the asset was originated or transformed. An assertion is labelled data, typically (though not required to be) in a CBOR-based structure which represents a declaration about an asset. Some of these assertions will contain human-generated information (e.g., alternate text for accessibility) while others will come from machines (software/hardware) providing the information they generated (e.g., camera type).

Some examples of assertions are:

- metadata (e.g., camera information such as maker or lens);

- actions performed on the asset (e.g., clipping, color correction);

- thumbnail of the asset or its ingredients;

- content bindings (e.g., cryptographic hashes).


Certain assertions may be redacted by subsequent claims (see [Section 6.8, “Redaction of Assertions”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_redaction_of_assertions)), but they cannot be modified once made as part of a claim.

### 6.2. Labels

#### 6.2.1. Namespacing

String values in C2PA data structures may be organized into namespaces using a period (`.`) as a separator. The C2PA namespace, `c2pa`, shall be the beginning of any string value defined in this specification. Entity-specific namespaces shall begin with the Internet domain name for the entity similar to how Java packages are defined (e.g., `com.litware`, `net.fineartschool`).

The period-separated components of an entity-specific namespace shall follow the variable naming convention (`[a-zA-Z0-9][a-zA-Z0-9_-]*`) specified in the POSIX or C locale, as defined in the ABNF below ( [ABNF for Namespaces](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#abnf_for_namespaces)).

ABNF for Namespaces

```abnf
qualified-namespace = "c2pa" / entity
entity = entity-component *( "." entity-component )
entity-component = 1( DIGIT / ALPHA ) *( DIGIT / ALPHA / "-" / "_" )
```

abnf![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

#### 6.2.2. Label Naming

Each assertion has a label defined either by the C2PA specifications or an external entity. These labels are strings which are namespaced, as described in the preceding clause or by an entity. The most common labels will be defined in the `c2pa` namespace, but labels may use any namespace that follows the conventions. Labels are also versioned with a simple incrementing integer scheme (e.g., `c2pa.actions.v2`). If no version is provided, it is considered as `v1`. The list of publicly known labels can be found in [Chapter 18, _C2PA Standard Assertions_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_standard_assertions).

|     |     |
| --- | --- |
|  | Previous versions of this document also provided for namespacing for well-established standards, but that has been superseded by simply having them via entity-specific namespaces (e.g., `org.iso`, `org.w3`). |

ABNF for Assertion Labels

```abnf
namespaced-label = qualified-namespace label
qualified-namespace = "c2pa" / entity
entity = entity-component *( "." entity-component )
entity-component = 1( DIGIT / ALPHA ) *( DIGIT / ALPHA / "-" / "_" )
label = 1*( "." label-component )
label-component = 1( DIGIT / ALPHA ) *( DIGIT / ALPHA / "-" / "_" )
```

abnf![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

The period-separated components of a label follow the variable naming convention (`[a-zA-Z][a-zA-Z0-9_-]*`) specified in the POSIX or C locale, with the restriction that the use of a repeated underscore character (`__`) is reserved for labelling multiple assertions of the same type.

### 6.3. Versioning

When an assertion’s schema is changed, it should be done in a backwards-compatible manner. This means that new fields may be added and existing ones may be marked as deprecated (i.e., can be read, but never written). Existing fields shall not be removed. The label would then consist of an incremented version number, for example moving from `c2pa.hash.bmff` (deprecated) to `c2pa.hash.bmff.v2`.

Since the addition of optional fields can be done while maintaining backwards compatibility, such fields may be added to an existing assertion’s schema without a change to the version number.

Deprecated fields for C2PA standard assertions shall be indicated in [Chapter 18, _C2PA Standard Assertions_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_standard_assertions). Claim generators shall not insert data into deprecated assertion fields when creating assertions.

In those situations where a non-backwards compatible change is required, instead of increasing the label’s version number, the assertion shall be given a new label.

|     |     |
| --- | --- |
|  | For example, `c2pa.ingredient` might be changed to the fictional `c2pa.component`. |

### 6.4. Multiple Instances

Multiple assertions of the same type can occur in the same manifest, but since assertions are referenced by claims via their label, the assertion labels are required to be unique. This is accomplished by adding a double-underscore and a monotonically increasing index to the label. For example, if a manifest contains a single assertion of type `c2pa.metadata`, then the assertion label will be `c2pa.metadata`. If a manifest contains three assertions of this type, the labels will be `c2pa.metadata`, `c2pa.metadata__1` and `c2pa.metadata__2`.

When a label includes a version number, that version number is part of the label itself. As such, when there are multiple instances, the instance number continues to follow the label - e.g., `c2pa.ingredient.v2__2`.

### 6.5. Schema Validation

The schemas provided in this document, as well as the machine readable ones that are downloaded-able from the C2PA website, should only be used for aids in understanding the syntax to be read or written. It is not necessary, nor it is recommended, for a validator to perform any form of schema validation.

### 6.6. Assertion Store

The set of assertions referenced by a [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claims) in a manifest are collected together into a logical construct that is referred to as the _assertion store_. The assertions and assertion store shall be stored as described in [Section 11.1, “Use of JUMBF”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_use_of_jumbf); in particular, each assertion referenced in a claim’s `created_assertions` or `gathered_assertions` (but not [`redacted_assertions`](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_redaction_of_assertions)) shall be present in the assertion store located in the same C2PA Manifest as the claim.

In each manifest, there is a single assertion store. However, as an asset may have multiple manifests associated with it, each one representing a specific series of assertions, there may be multiple assertion stores associated with an asset.

### 6.7. Embedded vs Externally-Stored Data

Some assertion data, due to its size or an infrequent need for it, may be externally hosted. Such data are not embedded in the assertion store, but instead are referenced by URI. This is accomplished through a cloud data assertion (see [Section 18.10, “Cloud Data”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_cloud_data)). Unlike embedded assertion data, cloud data is not retrieved nor validated as part of manifest validation, and are only retrieved and validated when specifically needed by an application according to a different set of validation rules as described in [Section 15.10, “Validate the Assertions”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_assertions).

### 6.8. Redaction of Assertions

Assertions that are present in an asset-embedded manifest may be removed from that asset’s manifest when the asset is [used as an ingredient](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_ingredient_storage). This process is called redaction.

Redaction involves either removing the entire assertion from the manifest’s assertion store or retaining the labelled assertion container but replacing its data with zeros (binary `0x00` values). In addition, a record that something was removed shall be added to the [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claims) in the form of a [URI reference](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) to the redaction assertion in the `redacted_assertions` field of the claim. It is also strongly recommended that the claim generator should add a `c2pa.redacted` [action assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_actions) with a `redacted` field as described in [Section 18.12.5, “Parameters”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_parameters).

When redacting an ingredient assertion that references a C2PA Manifest, the associated manifest shall be removed from the C2PA Manifest Store if no other references to it remain after redacting.

|     |     |
| --- | --- |
|  | Because each assertion’s [URI reference](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) includes the assertion label, it is also known what type of information (e.g., thumbnail, metadata, etc.) was removed. This enables both humans and machines to apply rules to determine if the removal was acceptable. |

Unless the redaction of the assertion also requires modification to the digital content, an [update manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_update_manifests) shall be used to document the redaction as it makes a statement about the non-changes to the content.

Claim generators shall not redact assertions with a label of `c2pa.actions` or `c2pa.actions.v2` as this assertion type represents essential information in understanding the history of an asset. They shall also not redact any [hard binding to content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_binding_to_content) assertion - either a `c2pa.hash.data`, `c2pa.hash.boxes`, `c2pa.hash.collection.data`, `c2pa.hash.bmff.v2` (deprecated), or `c2pa.hash.bmff.v3`, as these assertions are necessary for determining the integrity of the asset.

## 7\. Data Boxes

### 7.1. General

Data boxes provide a way to include arbitrary data into the C2PA Manifest that is referenced from an assertion, instead of embedding it directly into a field of the assertion as a binary string. These data boxes are placed in the [Data Box Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_storage) and each one will be a single CBOR Content Type box (`cbor`).

The data of a data box is provided directly as the value of the `data` field, which is a `bstr`, so any binary data can be provided. The type of the data shall be identified using the `dc:format` field, with a standard IANA media type.

|     |     |
| --- | --- |
|  | IANA structured suffixes ( [https://www.iana.org/assignments/media-type-structured-suffix/media-type-structured-suffix.xhtml](https://www.iana.org/assignments/media-type-structured-suffix/media-type-structured-suffix.xhtml)), such as `+json` and `+zip`, are also supported as values of the `dc:format` field. |

Sometimes, it may also be necessary to provide one or more [asset types](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset_type) as the value of the `data_types` field for more clarity on the format and usage of that data.

A data box shall have a label of `c2pa.data` and follows the [rules of assertion labels](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_multiple_instances) with respect to multiple instances.

### 7.2. Schema and Example

The schema for this type is defined by the `data-box-map` rule in the [CDDL Definition](https://datatracker.ietf.org/doc/html/rfc8610) in [CDDL for data box](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#cddl_for_data_box).:

CDDL for data box

```cddl
; box allowing for the storage of arbitrary data

data-box-map = {
  "dc:format": format-string, ; IANA media type of the data
  "data" : bstr, ; arbitrary text/binary data
  ? "data_types": [1* $asset-type-map],  ; additional information about the data's type
}
```

cddl![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

## 8\. Unique Identifiers

### 8.1. Uniquely Identifying C2PA Manifests and Assets

Every C2PA Manifest is uniquely identified and referenced by a Uniform Resource Name [RFC 8141, URNs](https://tools.ietf.org/html/rfc8141) from the `c2pa` URN namespace, and a C2PA asset is uniquely identified by the `c2pa` URN value of its active manifest. The ABNF for the C2PA URN is described by [ABNF for C2PA URN](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#abnf_for_urn).

A `c2pa` URN shall consist of two mandatory and two optional components, in the following order, with colons (`:`) between each section.

- URN identifier (`urn:c2pa`): REQUIRED

- UUID v4, in string representation (as per RFC 9562, section 4): REQUIRED

- Claim Generator identifier string : OPTIONAL

- Version and Reason string (as described below) : OPTIONAL


When present, the "Claim Generator identifier" string shall consist of no more than 32 characters from the ASCII range (as per RFC 20), but which are not Control Characters (RFC 20, 5.2) or Graphic Characters (RFC 20, 5.3).

When present, the "Version and Reason" string shall consist of a positive integer, followed by an underscore (`_`) and then another positive integer. The details of each of these values and how they are to be used is described in [Versioning Manifests Due to Conflicts](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_versioning_manifests_due_to_conflicts). In addition, when a "Version and Reason" string is present, a "Claim Generator identifier" string shall also be present but it may be empty.

ABNF for C2PA URN

```abnf
c2pa_urn = c2pa-namespace UUID [claim-generator [version-reason]]

c2pa-namespace = "urn:c2pa:"

; this definition is taken from RFC 9562
UUID     =  4hexOctet "-"
			2hexOctet "-"
			2hexOctet "-"
			2hexOctet "-"
			6hexOctet
hexOctet = HEXDIG HEXDIG
DIGIT    = %x30-39
HEXDIG   = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"

; ASCII, but not Control Characters or Graphic Characters
visible-char-except-space = %x21-7E / %x80-FF

; claim-generator-identifier is a string of 0 to 32 visible-char-except-space characters
; this means that an empty string is valid
claim-generator = ":" claim-generator-identifier
claim-generator-identifier = 0*32visible-char-except-space

; version-reason is a string consisting of a positive integer
; followed by an underscore and a positive integer
version-reason = ":" version "_" reason
version = 1*DIGIT
reason = 1*DIGIT
```

abnf![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

Examples:

- `urn:c2pa:F9168C5E-CEB2-4FAA-B6BF-329BF39FA1E4`

- `urn:c2pa:F9168C5E-CEB2-4FAA-B6BF-329BF39FA1E4:acme`

- `urn:c2pa:F9168C5E-CEB2-4FAA-B6BF-329BF39FA1E4:acme:2_1`

- `urn:c2pa:F9168C5E-CEB2-4FAA-B6BF-329BF39FA1E4::2_1`


|     |     |
| --- | --- |
|  | Previous versions of this specification used [RFC 9562, UUIDs](https://tools.ietf.org/html/rfc9562) URN, and had the identifier of the claim generator at the beginning of the URN. However, this was found to be not in compliance with either [RFC 9562, UUIDs](https://tools.ietf.org/html/rfc9562) or [RFC 8141, URNs](https://tools.ietf.org/html/rfc8141). |

This `c2pa` URN identifier is used in various parts of a C2PA-enabled workflow, such as when identifying an asset as an [ingredient](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#ingredient_assertion) in a derived or composed asset.

### 8.2. Versioning Manifests Due to Conflicts

Situations may arise where it is necessary to re-label a C2PA Manifest due to a conflict of identifiers. For example, if a claim generator had already added an ingredient manifest into the asset’s C2PA Manifest Store, then later added another ingredient which had a manifest with the same label in its manifest store, but this latter version of the manifest was different due, for example, to a manipulation of one of its assertion values. In such a case, the modified version of the ingredient manifest needs to be copied into the asset’s C2PA Manifest Store, but must be re-labeled.

To re-label a manifest:

- If the current URN does not contain a "Claim Generator identifier string", then the claim generator shall append a `:`.

- In all cases, the claim generator shall append a `:` to the URN followed by a monotonically increasing integer, starting with 1, followed by an underscore (`_`) and then an integer from the list below representing the reason for the re-labeling.



  - 1: Conflict with another C2PA Manifest


For example, if the claim generator has to re-label a C2PA Manifest for the second time due to a conflict, the appended string would be `:2_1`.

### 8.3. Identifying Non-C2PA Assets

When working with assets that do not contain a C2PA Manifest, but the asset contains embedded XMP which include values for `xmpMM:DocumentID` and/or `xmpMM:InstanceID` as defined in [XMP Specification Part 2, 2.2](https://github.com/adobe/xmp-docs/blob/master/XMPNamespaces/XMPDataTypes/ResourceEvent.md), those values shall be used as identifiers for the asset.

When working with assets that do not contain a C2PA Manifest and do not contain embedded XMP, the claim generator may use any method of its choosing to provide it with a unique identifier.

### 8.4. URI References

#### 8.4.1. Standard URIs

All references to information in the manifest, whether stored internally to the asset (i.e., embedded) or stored externally to the asset (e.g., in the cloud), shall be referenced via JUMBF URI references as defined in ISO 19566-5:2023, C.2. These URIs shall be used either as part of a `hashed_uri` or `hashed_ext_uri` data structure.

When the reference is to a [compressed manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_compressed_manifests), the JUMBF URI shall not contain anything about the `brob` box, but the URI to the manifest is treated as if the manifest was not compressed. This means that the URI would include the label of the `c2ma` or `c2um` box, but not the label of the `c2cm` box. In addition, the URI reference to a compressed manifest shall not include the label of the `brob` box - but only the label of the compressed manifest itself.

#### 8.4.2. Hashed URIs

##### 8.4.2.1. Embedded

A `hashed_uri` is used when the URI is for something embedded in the same C2PA Manifest Store.

This specification provides an equivalent `hashed-uri-map` data structure (in [CDDL for hashed URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#hashed-uri-map)) for schemas using a [CDDL Definition](https://datatracker.ietf.org/doc/html/rfc8610):

CDDL for hashed URI

```cddl
; The data structure used to store a reference to a URL within the same JUMBF and its hash. We use a socket/plug here to allow hashed-uri-map to be used in individual files without having the map defined in the same file
$hashed-uri-map /= {
  "url": jumbf-uri-type, ; JUMBF URI reference
  ? "alg": tstr .size (1..max-tstr-length), ; A string identifying the cryptographic hash algorithm used to compute all hashes in this claim, taken from the C2PA hash algorithm identifier list. If this field is absent, the hash algorithm is taken from an enclosing structure as defined by that structure. If both are present, the field in this structure is used. If no value is present in any of these places, this structure is invalid; there is no default.
  "hash": bstr, ;  byte string containing the hash value
}

; with CBOR Head (#) and tail ($) are introduced in regexp, so not needed explicitly
jumbf-uri-type  /= tstr .regexp "self#jumbf=[\\w\\d\/][\\w\\d\\.\/:-]+[\\w\\d]"
```

cddl![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

Because assertion stores shall be located in the same C2PA Manifest box as the claim that refers to them, only `self#jumbf` URIs are permitted. These `self#jumbf` URIs may be relative to the entire C2PA Manifest Store, in which case they shall start with a `/` (U+002F, Slash), or relative to the current C2PA Manifest. URIs shall not contain the sequence `..` (a pair of U+002E, Full Stop).

Example 1. Example `self#jumbf` URIs

The following are examples of valid `self#jumbf` URIs:

- `self#jumbf=/c2pa/urn:c2pa:F095F30E-6CD5-4BF7-8C44-CE8420CA9FB7/c2pa.assertions/c2pa.thumbnail.claim.jpeg` is relative to the entire store (since it starts with `/`);

- `self#jumbf=c2pa.assertions/c2pa.thumbnail.claim.jpeg` would be relative to the manifest of the box containing the URI.


##### 8.4.2.2. External

When referring to a resource that exists externally to the C2PA Manifest Store, a `hashed-ext-uri-map` data structure is used. It is a variation on the `hashed-uri`, in that it references an external URI instead of a `self#jumbf`. The `hashed-ext-uri` data structure is defined by the `hashed-ext-uri-map` rule in the following CDDL in [CDDL for hashed external URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#hashed-ext-uri-map):

CDDL for hashed external URI

```cddl
; The data structure used to store a reference to an external URL and its hash.
; We use a socket/plug here to allow hashed-ext-uri-map to be used in individual files
; without having the map defined in the same file
$hashed-ext-uri-map /= {
  "url": ext-url-type, ; http/https URI reference
  "alg": tstr .size (1..max-tstr-length), ; A string identifying the cryptographic hash algorithm used to compute the hash on this URI's data, taken from the C2PA hash algorithm identifier list. Unlike alg fields in other types, this field is mandatory here.
  "hash": bstr, ;  byte string containing the hash value
  ? "dc:format": format-string, ; IANA media type of the data
  ? "size": size-type, ; Number of bytes of data
  ? "data_types": [1* $asset-type-map],  ; additional information about the data's type
}

; with CBOR Head (#) and tail ($) are introduced in regexp, so not needed explicitly
ext-url-type  /= tstr .regexp "https?:\/\/[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b[-a-zA-Z0-9@:%_\\+.~#?&//=]*"
```

cddl![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
|  | In keeping with common practice, it is recommended that the `https` scheme be used to retrieve assertion data to protect the privacy of the data in transit, but `http` is also permitted because the data’s integrity is protected by the `hash` field and this privacy may not be required in all circumstances. Authors of manifests with external URIs should choose the scheme to suit their needs. |

The optional `dc:format` field, when present, provides an alternative to the `Content-Type` field of the http(s) headers. If present, this field shall be used as the required format retrieved during any content negotiate/request. Sometimes, it may also be necessary to provide one or more [asset types](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset_type) as the value of the `data_types` field for more clarity on the format and usage of that data.

An optional `size` field is also provided to specify the size of the data to be retrieved. This may be useful to a validator as a hint in addition to the hash.

|     |     |
| --- | --- |
|  | It could be used to provide information about whether to perform downloading or validation or both. |

##### 8.4.2.3. Hashing JUMBF Boxes

When creating a URI reference to any JUMBF box (e.g., [assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertions) and [data boxes](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_boxes)), the hash shall be performed over the contents of the structure’s JUMBF superbox, which includes both the JUMBF Description Box and all content boxes therein (but does not include the structure’s JUMBF superbox header).

|     |     |
| --- | --- |
|  | More details on hashing can be found at [Section 13.1, “Hashing”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing). |

As described in the latest version of JUMBF (ISO 19566-5:2023), and shown in [Figure 4, “Example `c2pa.actions` assertion”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#example-actions-assertion), a new `Private` field can be present as part of any JUMBF Description box. This C2PA specification defines the C2PA salt as a `Private` field whose value is a standard box consisting of:

- a box length (LBox, as a 4-byte big-endian unsigned integer);

- a box type (TBox, 4-byte big-endian unsigned integer, with a value of `c2sh` (for C2PA salt hash));

- and payload data (consisting of randomly-generated binary data of either 16 or 32 bytes in length).


![Example assertion structure](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/assertion_JUMBF.drawio.svg)

Figure 4. Example `c2pa.actions` assertion

## 9\. Binding to Content

### 9.1. Overview

A key aspect to the [standard C2PA manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_standard_manifests) is the presence of one or more data structures, called content bindings, that can uniquely identify portions of the asset. There are two types of bindings that are supported by C2PA - hard bindings and soft bindings. A hard binding (also known as a cryptographic binding) enables the validator to ensure that (a) this manifest belongs with this asset and (b) that the asset has not been modified, by determining values that can match only this asset and no other, not even other assets derived from it or renditions produced from it. A soft binding is computed from the digital content of an asset, rather than its raw bits. A soft binding is useful for identifying derived assets and asset renditions.

A single manifest shall not contain more than one assertion defining a hard binding but may contain zero or more assertions defining soft bindings.

### 9.2. Hard Bindings

#### 9.2.1. Hashing using byte ranges

The simplest type of hard binding that can be used to detect tampering is a cryptographic hashing algorithm, as described in [Section 13.1, “Hashing”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing), over some or all of the bytes of an asset. This approach can be used on any type of asset, but should only be considered for formats that don’t support one of the forms of box-based hashing.

When using this form of hard binding, a [data hash assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_hash) is used to define the range of bytes that are hashed (and those that are not). Because a data hash assertion defines a byte range, it is flexible enough to be usable whether the asset is a single binary or represented in multiple chunks or portions.

#### 9.2.2. Hashing using a general box hash

When an asset’s format is a non-BMFF-based box format, such as JPEG, PNG, GIF or others listed [here](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_handling_for_specific_formats), then a [general box hash](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_general_boxes_hash) assertion should be used. This assertion consists of an array of structures, each one listing one or more boxes (by their name/identifier) and a hash that covers that data of those boxes (and any possible data that may be present in the file between them), along with the algorithm used for [hashing](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing).

#### 9.2.3. Hashing a BMFF-formatted asset

If the asset is based on [ISO BMFF](https://www.iso.org/standard/74428.html) then a hard binding optimized for the box-based format (called [BMFF-based hash assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_bmff_based_hash)) may be used instead.

For a monolithic MP4 file asset where the `mdat` box is validated as a unit, the assertion is validated nearly identically to a data hash assertion. It simply uses a box exclusion list instead of byte ranges to define the range of bytes that are hashed (and those that are not).

For fragmented MP4 (fMP4) files, the assertion itself shall be combined with chunk-specific hashing information which is located as specified in [Section A.4, “Embedding manifests into BMFF-based assets”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_bmff_based_assets).

#### 9.2.4. Hashing a Collection

In workflows where the C2PA Manifest will refer to a collection of assets, instead of a single asset, the [collection data hash assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_collection_data_hash) shall be used as the method to specify the hard bindings for the assets in the collection.

|     |     |
| --- | --- |
|  | For example, a collection data hash assertion can be used to describe each folder of a training data set for an AI/ML model. |

#### 9.2.5. Asset Metadata Bindings

[Signers](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_signers) of the C2PA Manifest are not required to sign the asset metadata not contained within the C2PA Manifest. In such a case, the asset metadata shall be excluded by [data hash assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_hash) and their boxes shall not be listed by [general box hash assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_general_boxes_hash) or [BMFF-based hash assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_bmff_based_hash).

|     |     |
| --- | --- |
|  | Not including asset metadata in a [data hash assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_hash) is a security concern, which is why using a [general box hash assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_general_boxes_hash), when possible, is preferred if not signing the asset metadata. |

Any asset metadata values that are supported by the [common metadata assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_metadata), as described in [Appendix B, _Implementation Details for `c2pa.metadata`_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#metadata_annex), and can be asserted by the signer should be copied into such an assertion and included in the C2PA Manifest.

### 9.3. Soft Bindings

Soft bindings are described using [soft binding assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#soft_binding_assertion) such as a fingerprint computed from the digital content or an invisible watermark embedded within the digital content. These soft bindings enable digital content to be matched even if the underlying bits differ.

|     |     |
| --- | --- |
|  | For example, an asset rendition in a different resolution or encoding format. |

Additionally, if a C2PA manifest is removed from an asset, but a copy of that manifest remains in a provenance store elsewhere, the manifest and asset may be matched using available soft bindings.

Because they serve a different purpose, a soft binding shall not be used as a hard binding.

#### 9.3.1. List of Allowed Soft Binding Algorithms

All soft bindings shall be generated using one of the algorithms listed in the [soft binding algorithm list](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_soft_binding_algorithm_list) as supported by this specification.

## 10\. Claims

### 10.1. Overview

A **claim** gathers together all the assertions about an asset at a given time including the set of assertions for [binding to the content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_binding_to_content). The claim is then cryptographically hashed and signed as described in [Section 10.3.2.4, “Signing a Claim”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signing_a_claim). A claim has all the same properties as an assertion including being assigned the label (`c2pa.claim.v2`) but it does not support the use of [assertion metadata](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_metadata_about_assertions). A claim is encoded as CBOR data, and such, shall comply with the ["Core Deterministic Encoding Requirements" of CBOR](https://www.rfc-editor.org/rfc/rfc8949.html#name-core-deterministic-encoding).

|     |     |
| --- | --- |
|  | Previous versions supported the use of assertion metadata with claims, but this has been deprecated. |

A previous version of this specification used the label `c2pa.claim` and associated `claim-map` for the Claim, but those have now been deprecated. Validators shall still accept this label (and associated `claim-map`), but claim generators should not produce such a claim.

### 10.2. Syntax

#### 10.2.1. Schema

The schema for this type is defined by the `claim-map-v2` and `claim-map` rules in the following [CDDL Definition](https://datatracker.ietf.org/doc/html/rfc8610) for claims with labels `c2pa.claim.v2` and `c2pa.claim`, respectively:

```cddl
; CDDL schema for a claim map in C2PA
claim-map = {
  "claim_generator": tstr, ; A User-Agent string formatted as per http://tools.ietf.org/html/rfc7231#section-5.5.3, for including the name and version of the claims generator that created the claim
  "claim_generator_info": [1* generator-info-map],
  "signature": jumbf-uri-type, ; JUMBF URI reference to the signature of this claim
  "assertions": [1* $hashed-uri-map],
  "dc:format": tstr, ; media type of the asset
  "instanceID": tstr .size (1..max-tstr-length), ; uniquely identifies a specific version of an asset
  ? "dc:title": tstr .size (1..max-tstr-length), ; name of the asset,
  ? "redacted_assertions": [1* jumbf-uri-type], ; List of JUMBF URI references to the assertions of ingredient manifests being redacted
  ? "alg": tstr .size (1..max-tstr-length), ; A string identifying the cryptographic hash algorithm used to compute all data hash assertions listed in this claim unless otherwise overridden, taken from the C2PA data hash algorithm identifier registry. This provides the value for the 'alg' field in data-hash and hashed-uri structures contained in this claim
  ? "alg_soft": tstr .size (1..max-tstr-length), ; A string identifying the algorithm used to compute all soft binding assertions listed in this claim unless otherwise overridden, taken from the C2PA soft binding algorithm identifier registry."
  ? "metadata": $assertion-metadata-map, ; additional information about the assertion
}

; CDDL schema for a claim map in C2PA
claim-map-v2 = {
  "instanceID": tstr .size (1..max-tstr-length), ; uniquely identifies a specific version of an asset
  "claim_generator_info": $generator-info-map, ; the claim generator of this claim
  "signature": jumbf-uri-type, ; JUMBF URI reference to the signature of this claim
  "created_assertions": [1* $hashed-uri-map],
  ? "gathered_assertions": [1* $hashed-uri-map],
  ? "dc:title": tstr .size (1..max-tstr-length), ; name of the asset,
  ? "redacted_assertions": [1* jumbf-uri-type], ; List of JUMBF URI references to the assertions of ingredient manifests being redacted
  ? "alg": tstr .size (1..max-tstr-length), ; A string identifying the cryptographic hash algorithm used to compute all data hash assertions listed in this claim unless otherwise overridden, taken from the C2PA data hash algorithm identifier registry. This provides the value for the 'alg' field in data-hash and hashed-uri structures contained in this claim
  ? "alg_soft": tstr .size (1..max-tstr-length), ; A string identifying the algorithm used to compute all soft binding assertions listed in this claim unless otherwise overridden, taken from the C2PA soft binding algorithm identifier registry."
  ? "metadata": $assertion-metadata-map, ; (DEPRECATED) additional information about the assertion
}

generator-info-map = {
  "name": tstr .size (1..max-tstr-length), ; A human readable string naming the claim generator
  ? "version": tstr, ; A human readable string of the product's version
  ? "icon": $hashed-uri-map / $hashed-ext-uri-map, ; hashed URI to the icon (either embedded or remote)
  ? "operating_system": tstr, ; A human readable string of the operating system the claim generator is running on
  * tstr => any
}
```

cddl![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

An example of the `claim-map-v2` structure in [CBOR-Diag](https://www.rfc-editor.org/rfc/rfc8949.html#name-diagnostic-notation):

```none
{
  "alg" : "sha256",
  "claim_generator_info" : {
    "name": "Joe's Photo Editor",
    "version": "2.0",
    "operating_system": "Windows 10"
  },
  "signature" : "self#jumbf=c2pa/urn:c2pa:F9168C5E-CEB2-4faa-B6BF-329BF39FA1E4/c2pa.signature",
  "created_assertions" : [\
    {\
      "url": "self#jumbf=c2pa/urn:c2pa:F9168C5E-CEB2-4faa-B6BF-329BF39FA1E4/c2pa.assertions/c2pa.hash.data",\
      "hash": b64'U9Gyz05tmpftkoEYP6XYNsMnUbnS/KcktAg2vv7n1n8='\
    },\
    {\
      "url": "self#jumbf=c2pa/urn:c2pa:F9168C5E-CEB2-4faa-B6BF-329BF39FA1E4/c2pa.assertions/c2pa.thumbnail.claim.jpeg",\
      "hash": b64'G5hfJwYeWTlflxOhmfCO9xDAK52aKQ+YbKNhRZeq92c='\
    },\
    {\
      "url": "self#jumbf=c2pa/urn:c2pa:F9168C5E-CEB2-4faa-B6BF-329BF39FA1E4/c2pa.assertions/c2pa.ingredient.v3",\
      "hash": b64'Yzag4o5jO4xPyfANVtw7ETlbFSWZNfeM78qbSi8Abkk='\
    }\
  ],
  "redacted_assertions" : [\
    "self#jumbf=c2pa/urn:c2pa:5E7B01FC-4932-4BAB-AB32-D4F12A8AA322/c2pa.assertions/c2pa.metadata"\
  ]
}
```

![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

#### 10.2.2. Fields

If present, the value of `dc:title` shall be a human-readable name for the asset.

|     |     |
| --- | --- |
|  | The `c2pa.claim` has a `dc:format` field which is no longer present in `c2pa.claim.v2`. |

If the asset contains XMP, then the asset’s `xmpMM:InstanceID` should be used as the `instanceID`. When no XMP is available, then some other [unique identifier](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_unique_identifiers) for the asset shall be used as the value for `instanceID`.

|     |     |
| --- | --- |
|  | Some field names, such as `dc:title`, have namespace prefixes as their names and definitions are taken directly from the XMP standard. However, their usage in C2PA does not require the use of XMP. |

The `signature` field shall be present containing a [URI reference](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) to a [claim signature](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signing_a_claim).

The `created_assertions` field shall be present and it shall contain one or more [URI references](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) to [assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertions) being made by this claim that were created by the claim generator. In a standard manifest or time-stamp manifest, it shall contain at least one assertion that represents a [hard binding](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hard_bindings).

When present, the `gathered_assertions` field shall contain one or more [URI references](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) to assertions that have not been created by the claim generator but have been provided by other components in the workflow.

When present, the `redacted_assertions` field shall contain one or more [URI references](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) to [redacted assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_redaction_of_assertions).

#### 10.2.3. Claim Generator Info

##### 10.2.3.1. General

Detailed information about the claim generator shall be present as the value of `claim_generator_info`. A Manifest Consumer shall use the value of `claim_generator_info` in determining information about the claim generator for itself or for presentation in a UX.

|     |     |
| --- | --- |
|  | The `c2pa.claim` has a `claim_generator` field, whose value is a simple string, which is no longer present in `c2pa.claim.v2`. |

##### 10.2.3.2. Generator Info Map

When adding a `claim_generator_info` field, its value is a `generator-info-map` object which shall contain a `name` field. It may also contain either a `version` field or an `icon` field or both. In addition, any other field is permitted, using the standard entity-specific namespacing described in [Section 6.2.1, “Namespacing”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_namespacing). The data in this object shall represent the non-human (hardware or software) actor that actually generated the claim (aka the claim generator itself).

A claim generator may desire to provide a graphical representation of itself, referred here as an `icon`, to a Manifest Consumer that is presenting a user experience. The value of the `icon` field, if present, shall be a [hashed URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashed_uris).

|     |     |
| --- | --- |
|  | As with the assertions array, the hash algorithm used for a [hashed URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashed_uris) is determined by the `alg` field present in the hashed URI, or when absent, by an `alg` field in the claim. |

Example using claim generator info

```json
{
	"claim_generator_info" : {
		"name": "Joe's Photo Editor",
		"version": "2.0",
		"operating_system": "Windows 10",
		"icon": {
			"url": "http://cdn.examplephotoagency.com/logo.svg",
			"hash": "5bdec8169b4e4484b79aba44cee5c6bd"
		}
	}
}
```

json![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

### 10.3. Creating a Claim

#### 10.3.1. Creating Assertions

Before the claim can be finalized, all [assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertions) need to be created and stored in a newly created [C2PA Assertion Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_box_details) as described [later in this document](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_types_of_manifests).

When creating a standard manifest, it may not be possible to know all of the required binding information at the time of claim creation, in which case use the [multiple step processing method](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_multiple_step_processing) to setup and then later fill-in the information.

#### 10.3.2. Preparing the Claim

##### 10.3.2.1. Adding Assertions and Redactions

The claim shall contain a `created_assertions` field and may contain a `gathered_assertions` field. The combined values from those two fields represents a list of all of the URI references for all assertions that were added to the assertion store that are being "claimed" by this claim. In a standard or time-stamp manifest, the `created_assertions` field’s value shall include at least one assertion that represents a [hard binding](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hard_bindings).

If any assertions in ingredient claims are being redacted, their URI references shall be added to list which is the value of the `redacted_assertions` field.

##### 10.3.2.2. Adding Ingredients

In many authoring scenarios, an actor does not create an entirely new asset but instead brings in other existing assets on which to create their work - either as a derived asset, a composed asset or an asset rendition. These existing assets are called ingredients and their use is documented in the provenance data through the use of an [ingredient assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#ingredient_assertion).

When an ingredient contains one or more C2PA manifests, those manifests shall be inserted into this asset’s C2PA Manifest Store to ensure that the provenance data is kept intact. Such ingredient manifests are added to the JUMBF as described in [Section 11.1.4, “C2PA Box details”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_box_details). If a manifest with the same unique identifier is already present in the C2PA Manifest Store, the two shall be compared (via hashing). If they are identical, the new manifest shall be ignored. If they are different, the new manifest shall be added to the store after changing its unique identifier to a new value as described in [Chapter 8, _Unique Identifiers_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_unique_identifiers).

If an ingredient’s manifest is [remote](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_external_manifests), and the claim generator is unable to retrieve the manifest, it should use an error code of `manifest.inaccessible` to reflect that.

##### 10.3.2.3. Connecting the Signature

The signature cannot be part of the signed payload, but since its label is pre-defined, then the full URI reference is also known. As such, we can include that in the claim by setting the value of the `signature` field of the claim to that URI reference.

|     |     |
| --- | --- |
|  | This provides the explicit binding of the claim to its signature. |

##### 10.3.2.4. Signing a Claim

Producing the signature is specified in [Section 13.2, “Digital Signatures”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_signatures).

For standard and update manifests, the `payload` field of `Sig_structure` shall be the serialized CBOR of the claim document, and shall use detached content mode.

For time-stamp manifests, the `payload` field of `Sig_structure` shall be the value of the `signature` field of the `COSE_Sign1_Tagged` structure contained in the C2PA Claim Signature box of the C2PA Manifest of its parent ingredient, and shall use detached content mode.

The serialized `COSE_Sign1_Tagged` structure resulting from the digital signature procedure is written into the C2PA Claim Signature box.

##### 10.3.2.5. Time-stamps

###### 10.3.2.5.1. Use of RFC 3161

If possible, the signer should use a RFC 3161-compliant Time Stamp Authority (TSA) ( [RFC 3161](http://datatracker.ietf.org/doc/html/rfc3161)) to obtain a trusted time-stamp proving that the signature itself actually existed at a certain date and time and incorporate that into the `COSE_Sign1_Tagged` structure as a countersignature.

A time-stamp manifest shall never follow this procedure, as the signer of the manifest itself is a TSA.

Signers are encouraged to obtain and include time-stamps to ensure their manifests will remain valid. As described in [Chapter 15, _Validation_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#validation-clause), manifests without time-stamps cease to be valid when the signing credential expires or becomes revoked. A manifest shall contain only one time-stamp.

|     |     |
| --- | --- |
|  | Previous versions of this specification allowed for multiple time-stamps to be included in a manifest. |

###### 10.3.2.5.2. Choosing the Payload

A previous version of this specification used the same value for the `payload` field in the time-stamp as was used in the `Sig_signature` as described in [Section 10.3.2.4, “Signing a Claim”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signing_a_claim). This payload is henceforth referred to as a "v1 payload" in a "v1 time-stamp" and is considered deprecated. A claim generator shall not create one, but a validator shall process one if present.

The "v2 payload", of the "v2 time-stamp", is the value of the `signature` field of the `COSE_Sign1_Tagged` structure created as part of [Section 10.3.2.4, “Signing a Claim”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signing_a_claim). A "v2 payload" shall be used by claim generators performing a time-stamping operation.

|     |     |
| --- | --- |
|  | The value of the `signature` field includes the entire serialized `bstr`, including the bytes that indicate the major type and the length (not just the string itself). |

###### 10.3.2.5.3. Obtaining the time-stamp

All time-stamps shall be obtained as described in [RFC 3161](http://datatracker.ietf.org/doc/html/rfc3161) with the following additional requirements:

- The `MessageImprint` of the `TimeStampReq` structure ( [RFC 3161](http://datatracker.ietf.org/doc/html/rfc3161), section 2.4.1) shall be computed by creating the `ToBeSigned` value in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 4.4, with the following values for elements of `Sig_structure`:



  - The `context` element shall be `CounterSignature`.

  - The `payload` element shall be the value described by [Section 10.3.2.5.2, “Choosing the Payload”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_choosing_the_payload).

  - The remaining elements of `Sig_structure` are as described in [Section 13.2.3, “Computing the Signature”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_computing_the_signature).


- The `ToBeSigned` value is then hashed using a hash algorithm from the allowed list in [Section 13.1, “Hashing”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing) that the TSA supports, and that hash algorithm and value are placed in the `MessageImprint`. If the TSA does not support any hash algorithms from the allowed list, it cannot be used for time-stamping.



  - Where possible, the hash algorithm should use the same hash algorithm used in the digital signature of the claim.


- The `certReq` boolean of the `TimeStampReq` structure shall be asserted in the request to the TSA, to ensure its certificate chain is provided in the response.


###### 10.3.2.5.4. Storing the time-stamp

v1 time-stamps (deprecated) are stored in a COSE unprotected header whose label is the string `sigTst`. If present, the value of this header shall be a `tstContainer` defined by [Example 2, “CDDL for `tstContainer`”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#tstContainer-CDDL). The content of the `TimeStampResp` structure received in reply from the TSA shall be stored as the value of the `val` property of an element of `tstTokens`.

v2 time-stamps shall be stored in a COSE unprotected header whose label is the string `sigTst2`. When present, the value of this header shall be a `tstContainer` defined by [Example 2, “CDDL for `tstContainer`”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#tstContainer-CDDL). The content of value of the `timeStampToken` field of the `TimeStampResp` structure received in reply from the TSA shall be stored as the value of the `val` property of an element of `tstTokens`.

|     |     |
| --- | --- |
|  | A v2 time-stamp is equivalent to the "CTT" model of [COSE Header parameter for RFC 3161 Time-Stamp Tokens Draft](https://datatracker.ietf.org/doc/draft-ietf-cose-tsa-tst-header-parameter/). It requires that the complete signature structure be completed prior to time-stamping, thus enabling the time-stamp to serve as a countersignature on the entire signature structure, including the actual certificate. |

If no time-stamps are included, then neither header (`sigTst` nor `sigTst2`) shall be present in the COSE unprotected header.

Example 2. CDDL for `tstContainer`

```cddl
; CBOR version of tstContainer and related structures based on JSON schema at
; https://forge.etsi.org/rep/esi/x19_182_JAdES/raw/v1.1.1/19182-jsonSchema.json
tstContainer = {
  "tstTokens": [1* tstToken]
}

tstToken = {
  "val": bstr
}
```

cddl![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
|  | The above definition is a CBOR adaptation of a subset of the schema from [JAdES](https://www.etsi.org/deliver/etsi_ts/119100_119199/11918201/01.01.01_60/ts_11918201v010101p.pdf), section 5.3.4 and [its JSON schema](https://forge.etsi.org/rep/esi/x19_182_JAdES/raw/v1.1.1/19182-jsonSchema.json), except with the modification that the content of `val` is a byte string and not a Base64-encoded string. |

##### 10.3.2.6. Credential Revocation Information

If the signer’s credential supports querying its online credential status, and the credential contains a pointer to a service to provide time-stamped credential status information, the signer should query the service, capture the response, and store it in the manner described for credentials in the [Trust Model](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trust_model). If credential revocation information is attached in this manner, a trusted time-stamp shall also be obtained after signing, as described in [Section 10.3.2.5, “Time-stamps”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_time_stamps).

#### 10.3.3. Examples of Claims

##### 10.3.3.1. Single Claim

Here is a visual representation of an image containing a single claim with multiple assertions that have been embedded inside it.

![A single claim with assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/Single_Claim.svg)

Figure 5. A single claim with assertions

##### 10.3.3.2. Multiple Claims

In this example of creating a second claim for the [previous example](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_single_claim), one of the original assertions has been redacted from the previous claim. The visual representation for this scenario would look like:

![Redacting assertions in a secondary claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/Multiple_Claims.svg)

Figure 6. Redacting assertions in a secondary claim

### 10.4. Multiple Step Processing

Some asset file formats require file offsets of the C2PA Manifest Store and asset content to be fixed before the manifest is signed, so that content bindings will correctly align with the content they authenticate. Unfortunately, the size of a manifest and its signature cannot be precisely known until after signing, which could cause file offsets to change.

As an example, in [JPEG 1](https://en.wikipedia.org/wiki/JPEG) files, the entire C2PA Manifest Store is required to appear in the file before the image data, and so its size will affect the file offsets of content being authenticated.

To accomplish this, a multiple step approach shall be taken, similar to how signatures in PDF are done.

#### 10.4.1. Create content bindings

When creating a [standard manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_standard_manifests), its claim shall include one or more content binding assertions in its list of assertions to ensure that the asset is tamper-evident.

Create the data hash assertion and add it to the assertion store taking into account the following considerations.

In many cases, such as with JPEG 1, it is not possible to hash the asset in its entirety because the manifest will be embedded in the middle of the file, so the size or location manifest data will not be known at the time the asset hash is computed. This circular dependency is avoided by allowing exclusion ranges to be specified during hashing. When exclusion ranges are specified, a single hash is performed, but only over the asset ranges that are not in any of the exclusions. The data present in an exclusion range shall only contain a C2PA Manifest and any padding.

If a manifest is embedded in the center of a JPEG 1 file in an APP11 segment, then the claim creator may exclude the APP11 segment(s) from the hash calculation.

In order to prevent insertion attacks, it is desirable to have only a single exclusion range when possible. When the size or location (or both) of the manifest in the asset is not known, then the `start` and `length` values in the data hash assertion shall both be zero and the size of the `pad` value should be large enough to accommodate writing in the values during the second pass. At least 16 bytes is recommended. The value of the `pad` key shall consist of all 0x00’s.

If padding is employed, it is possible that the pad data could be changed without resulting in a validation failure. Claim generators shall ensure that changes to pad data (or any other excluded asset data) cannot change how the asset is interpreted.

|     |     |
| --- | --- |
|  | In the case of JPEG 1 files, this can be achieved either by eliminating padding or by ensuring that the `JFIF APP11/C2PA` segments cannot be shortened of changed to a different segment type. This is accomplished by including all the C2PA manifest segment headers (APP11) and 2-byte length fields in the data-hash-map for all manifest-containing segments. Doing so ensures that any data changed in the exclusion region will not be misinterpreted by JPEG processors. |

#### 10.4.2. Create a temporary Claim and Signature

Add the newly created data hash assertion reference to the claim’s assertion list providing a temporary hash value, such as empty spaces.

At this point, the temporary claim is complete and can be added to the C2PA Manifest being created.

Since the claim is only temporary at this time, it is not possible to sign it. To ensure the claim signature box contains a valid CBOR structure, create a temporary `COSE_Sign1_Tagged` structure as described in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 4.2. The `COSE_Sign1_Tagged` is a tag byte followed by a `COSE_Sign1` structure, which is a four-element CBOR array. Construct the array as follows:

- The first element is the `protected` header bucket ( [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 3). Create an empty bucket by placing a `bstr` of size 0 in this position.

- The second element is the `unprotected` header bucket, which is a CBOR map. Create a map of 1 pair. Use the string `pad` as the label, and place a `bstr` of the desired padding size filled with zero bytes (0x00) as the value. A 25 kilobyte size is recommended for the initial size of this padding.

- The third element is the `payload`. Place the value `nil` (CBOR major type 7, value 22) here.

- The fourth element is `signature`. Place a `bstr` of size 0 here.


#### 10.4.3. Complete the C2PA Manifest

At this point all of the boxes that comprise the entire C2PA Manifest for the asset are completed and can be (if not already) constructed into its final form. The asset’s C2PA Manifest, along with the manifests of any ingredients, are combined together to form the complete C2PA Manifest Store. The active manifest is required to be the last C2PA Manifest superbox in the C2PA Manifest Store superbox. The C2PA Manifest Store can then be embedded into the asset as discussed in [Section 11.3, “Embedding manifests into various file formats”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_various_file_formats).

#### 10.4.4. Going back and filling in

Now that the C2PA Manifest Store has been embedded into the asset, the starting offset and the length of the active manifest can be updated in its data hash assertion. It is necessary that when doing so, you do not change the size of the assertion’s box, only its data. This is done by adjusting the value of the `pad` field to be the necessary length to "fill up" the remaining bytes.

|     |     |
| --- | --- |
|  | Preferred/deterministic CBOR serialization of `pad` uses a variable length integer to specify the length of the encoded binary data. When the length goes from zero to 1 byte, or 1 to 2 bytes (etc.), the length of the resulting pad jumps by two bytes. This means that not all paddings can be expressed using a single padding field. For example, 24-byte and 26-byte pads can be created, but a 25-byte pad cannot. If this situation arises, the desired padding can be split between `pad` and `pad2`. For example, to make a 25-byte pad, a claim generator can encode 19 bytes into `pad` (resulting in an encoded length of 20 bytes), and 4 bytes into `pad2` (resulting in 5 bytes.) |

Once the data hash assertion has been updated, it can be hashed and the hash written over the empty spaces that were used previously to hold the location.

The claim is now complete, and it can be hashed and signed as described in [Section 10.3.2.4, “Signing a Claim”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signing_a_claim), with the resultant signature filling the pre-allocated space. The `pad` header can then be shrunk as required so that the claim signature box remains the same size; because this header is unprotected, changing it does not invalidate the claim signature.

If the serialized `COSE_Sign1_Tagged` structure exceeds the reserved size of the C2PA Claim Signature box, multiple step processing shall be repeated with a larger padding size chosen in [Section 10.4.2, “Create a temporary Claim and Signature”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_create_a_temporary_claim_and_signature). Revocation information retrieved during the previous attempt should be reusable if it is still within its validity interval ( [RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960), section 4.2.2.1), but a new time-stamp will be required on the new claim with the file offsets changed as the result of added padding.

A C2PA Manifest may contain assertions defined outside of this specification, and they could depend on file layout. As such, the claim generator may no longer be able to change the file layout and/or offsets in a data hash assertion. In this case, claim generators should use padding prior to assertion creation to ensure that the file layout need not change once the assertion has been finalized.

## 11\. Manifests

### 11.1. Use of JUMBF

#### 11.1.1. Rationale

In order to support many of the requirements of C2PA, C2PA Manifests needed to be stored (serialized) into a structured binary data store that enables some specific functionality including:

- Ability to store multiple manifests (e.g., parents and ingredients) in a single container.

- Ability to refer to individual elements (both within and across manifests) via URIs.

- Ability to clearly identify the parts of an element to be hashed.

- Ability to store pre-defined data types used by C2PA (e.g., JSON and CBOR).

- Ability to store arbitrary data formats (e.g., XML, JPEG, etc.).


In addition to supporting all of the requirements above, our chosen container format - ISO 19566-5:2023 (JUMBF) - is also natively supported by the JPEG family of formats and is compatible with the box-based model (i.e., [ISOBMFF, ISO 14496-12](https://www.iso.org/standard/68960.html)) used by many common image and video file formats. Using JUMBF enables all the same benefits (and a few extras, such as [URI References](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references)) while being able to work with classic image formats, such as JPEG/JFIF and PNG as well as 3D and document (e.g., PDF) formats. This serialized format shall be used also in formats that do not natively support JUMBF, or when C2PA Manifest Stores are stored separately from the asset, such as in a separate file or URI location.

|     |     |
| --- | --- |
|  | Since most of the standard assertions, as well the claim signature, are serialized as CBOR, using CBOR for the entire C2PA Manifest was considered but not chosen because CBOR is not a container format.<br>For example, to store a "blob of JSON" inside of CBOR, and know that it is JSON (and not some other format) would necessitate designing a data structure for storing such things. Then the parent structure would need to be defined as to how to carry that structure. This same concept would also have to be done for each of the native features of JUMBF.<br>While it would certainly be possible to re-implement all of the required functionality entirely in CBOR, it would be a lot of work and would not fully remove the need for a JUMBF/BMFF parser in all implementations. |

#### 11.1.2. Processing Rules

A C2PA Manifest Consumer shall never process an assertion, assertion store, claim, claim signature or C2PA Manifest that is not contained inside of a C2PA Manifest Store. Additionally, when a C2PA Manifest Consumer encounters a JUMBF box or superbox whose JUMBF type UUID it does not recognize, it shall skip over (and ignore) its contents.

|     |     |
| --- | --- |
|  | This means that the C2PA Manifest Consumer can process private boxes that it knows about, but ignore ones of which it is unaware. |

If the _Requestable_ and _Label Present_ toggles are both set in the JUMBF Description box of any JUMBF box or superbox, that box or superbox shall be maintained in any updated C2PA Manifest Store.

|     |     |
| --- | --- |
|  | Boxes with those toggles set are intended to be referenced via JUMBF URIs, and their removal might cause downstream workflows to fail. |

#### 11.1.3. Extensions

##### 11.1.3.1. Compressed boxes

In order to support compressing manifests, a new `brob` content box is supported by C2PA. Based on a similar box in JPEG-XL (ISO/IEC 18181-2:2021), the `brob` box is a content box whose contents are the [Brotli-compressed](https://datatracker.ietf.org/doc/html/rfc7932) bytes of either a [standard manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_standard_manifests) or [update manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_update_manifests), as described in the [compressed manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_compressed_manifests) clause. The `brob` box shall have box ID of `0x62726F62` (`brob`).

![Example of compressed manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/brob_box.drawio.png)

Figure 7. Example of a compressed manifest

Hashing a compressed box is done in the same way as any other box, as described in [Section 8.4.2.3, “Hashing JUMBF Boxes”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing_jumbf_boxes).

|     |     |
| --- | --- |
|  | This implies that given a `hashed_uri` reference from an ingredient assertion to a C2PA Manifest via the `activeManifest` field, the hash is computed using the same process as any other JUMBF superbox: over the JUMBF Description Box and the `brob` box with its compressed payload, but excluding the superbox’s header. The contents of the `brob` box are not decompressed first to compute the hash. |

#### 11.1.4. C2PA Box details

##### 11.1.4.1. JUMBF Description boxes

###### 11.1.4.1.1. Labels

As described in the JUMBF specification (ISO 19566-5:2023, A.3), a label shall be stored as ISO/IEC 10646 characters in the UTF-8 encoding. Characters in the ranges U+0000 to U+001F inclusive and U+007F to U+009F inclusive, as well as the specific characters '/', ';', '?', and '#', are not permitted in the label. The label shall be null-terminated.

As labels used as part of JUMBF URIs, the characters U+FEFF, U+FFFF, and U+D800-U+DFFF shall also not be used.

###### 11.1.4.1.2. Toggles

All JUMBF Description boxes (ISO 19566-5:2023, A.3) used in a C2PA Manifest require a label, the _Label Present_ toggle (`xxxxxx1x`) shall be set. In addition, because JUMBF URIs are used to refer to boxes throughout the system (e.g., listing assertions, references to ingredients, etc.), the _Requestable_ toggle (`xxxxxx11`) shall be set.

When including a salt in a _PRIVATE_ box as described in [Section 8.4.2.3, “Hashing JUMBF Boxes”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing_jumbf_boxes), the _Private_ toggle (`xxx1xxxx`) shall also be set.

##### 11.1.4.2. Manifest Store

C2PA data is serialized into a JUMBF-compatible box structure. The outermost box is referred to as the C2PA Manifest Store, also known as the Content Credentials. Here is an example C2PA Manifest Store with a single C2PA Manifest:

![C2PA Manifest Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/ManifestStore.svg)

Figure 8. C2PA Manifest Store

The C2PA Manifest Store is a JUMBF superbox composed of a series of other JUMBF boxes and superboxes, each identified by their own JUMBF type UUID and label in their JUMBF Description box. The C2PA Manifest Store shall have a label of `c2pa`, a JUMBF type UUID of `63327061-0011-0010-8000-00AA00389B71` (`c2pa`) and shall contain one or more C2PA manifest superboxes, also known as C2PA Manifests. The C2PA Manifest Store may also contain JUMBF boxes and superboxes whose JUMBF type UUIDs are not defined in this specification.

|     |     |
| --- | --- |
|  | Allowing other boxes and superboxes enables custom extensions to C2PA as well as enabling the addition of new boxes in future versions of this specification without breaking compatibility. |

Each C2PA Manifest shall contain the data created at the time a claim is issued including the C2PA Assertion Store, a C2PA Claim, and a C2PA Claim Signature. A C2PA Manifest may also contain JUMBF boxes and superboxes whose JUMBF type UUIDs are not defined in this specification.

The JUMBF type UUID for each C2PA Manifest shall be either `63326D61-0011-0010-8000-00AA00389B71` (`c2ma`), `6332636D-0011-0010-8000-00AA00389B71` (`c2cm`) or `6332756D-0011-0010-8000-00AA00389B71` (`c2um`) depending on the [type of manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_types_of_manifests). The C2PA Manifest box shall be labelled with a `urn:c2pa` value computed as described in [Unique Identifiers](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_unique_identifiers).

##### 11.1.4.3. Assertion Store

The C2PA [Assertion Store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertion_store) is a superbox that shall have a label of `c2pa.assertions` and a JUMBF type UUID of `63326173-0011-0010-8000-00AA00389B71` (`c2as`). It shall contain one or more JUMBF superboxes (called C2PA Assertion boxes) whose JUMBF type defines the BMFF type of the sub-boxes that contain the assertion data (ISO 19566-5:2023, Annex B). These superboxes shall each have a label as defined in [Standard Assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_standard_assertions).

The JUMBF Content Type (ISO 19566-5:2023, Annex B) box(es) contained in each assertion superbox should be CBOR Content Type (`cbor`), JSON Content Type (`json`), Embedded File Content Type (`bfdb` & `bidb`) or UUID Content Type (`uuid`) though any Content Type defined in JUMBF and its amendments is permitted. In addition, a JUMBF Protection Box as described in ISO 19566-4:2020 may also be used.

The C2PA Assertion Store shall not contain any JUMBF boxes or superboxes that are not JUMBF Content Boxes.

|     |     |
| --- | --- |
|  | Custom assertions containing other formats/serializations of data, such as encrypted data, are supported through the use of a UUID Content Box containing the custom UUID followed by the data (ISO 19566-5:2023, B.5). |

##### 11.1.4.4. Claim and Claim Signature

The C2PA [Claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claims) box shall have a label of `c2pa.claim.v2`, a JUMBF type UUID of `6332636C-0011-0010-8000-00AA00389B71` (`c2cl`) and shall consist of a single CBOR Content Type box (`cbor`).

The C2PA [Claim Signature](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_signatures) box shall have a label of `c2pa.signature`, a JUMBF type UUID of `63326373-0011-0010-8000-00AA00389B71` (`c2cs`) and shall consist of a single CBOR Content Type box (`cbor`).

##### 11.1.4.5. Ingredient Storage

When a C2PA Manifest includes [ingredient assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#ingredient_assertion), and an ingredient contains a C2PA Manifest, that C2PA Manifest shall be included to ensure that the provenance data is kept intact. Such ingredient manifests are added to the C2PA Manifest Store as a peer of the C2PA Manifest for the asset itself.

![C2PA Manifest Store with Ingredient](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/ManifestStore_Ingredient.svg)

Figure 9. C2PA Manifest Store With an Ingredient

##### 11.1.4.6. Data Storage

A C2PA Data Box Store is a JUMBF superbox that shall contain only one or more CBOR Content Type boxes (`cbor`). It shall not contain any other type of JUMBF box or superbox. It shall have a label of `c2pa.databoxes` and a JUMBF type UUID of `63326462-0011-0010-8000-00AA00389B71` (`c2db`).

The CBOR Content Type boxes shall have a label of `c2pa.data` (for [embedded data](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_data_boxes)).

![C2PA Manifest Store with Data boxes](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/ManifestStore_DataBoxes.svg)

Figure 10. C2PA Manifest Store with Data Boxes

### 11.2. Types of Manifests

#### 11.2.1. Commonalities

All C2PA Manifests shall contain an [assertion store](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertion_store) with at least one [assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertions), a [claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claims) and a [claim signature](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signing_a_claim).

#### 11.2.2. Standard Manifests

A standard C2PA Manifest (JUMBF type UUID: `63326D61-0011-0010-8000-00AA00389B71` (`c2ma`)) shall contain exactly one [hard binding to content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_binding_to_content) assertion - either a `c2pa.hash.data`, `c2pa.hash.boxes`, `c2pa.hash.collection.data`, `c2pa.hash.bmff.v2` (deprecated), or `c2pa.hash.bmff.v3` based on the type of asset and version for which the manifest is destined. Because of this requirement, they are the predominant type of manifest that will be present in C2PA provenance data.

Manifest Consumers shall also accept standard C2PA Manifests specified with JUMBF type UUID `63326D64-0011-0010-8000-00AA00389B71` (c2md), but claim generators shall not create manifests with this JUMBF type UUID.

|     |     |
| --- | --- |
|  | A standard C2PA Manifest can be located either as the active manifest or as an ingredient manifest. |

#### 11.2.3. Update Manifests

There are, however, provenance workflows where additional assertions need to be added but the digital content is not changed. In these workflows, an Update Manifest (JUMBF type UUID: `6332756D-0011-0010-8000-00AA00389B71` (`c2um`)) should be used.

An Update Manifest shall not contain assertions of types `c2pa.hash.data`, `c2pa.hash.boxes`, `c2pa.hash.collection.data`, `c2pa.hash.bmff.v2` (deprecated), or `c2pa.hash.bmff.v3` because the content has not changed and therefore the bindings need not be updated. In the case of a file offset hash (`c2pa.hash.data`), the C2PA Manifest Store has to continue to start at the same file offset after updating - only its length may change.

An Update Manifest may contain assertions of type `c2pa.actions` or `c2pa.actions.v2`, provided that the value of the `action` field of each action present in the `actions` array of these assertions shall only be one of the following values:

- `c2pa.edited.metadata`

- `c2pa.opened`

- `c2pa.published`

- `c2pa.redacted`


An Update Manifest shall not contain an assertion of type `c2pa.actions` or `c2pa.actions.v2` that contains an `action` field outside of this list.

An Update Manifest shall not contain a [thumbnail assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#thumbnail_assertion).

|     |     |
| --- | --- |
|  | The reason for these requirements is that an `action` field outside of this list or a thumbnail implies changes to the digital content. |

The Update Manifest shall contain exactly one `c2pa.ingredient.v3` assertion that (a) includes both `activeManifest` and `claimSignature` fields with values that are the [URI references](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) to the C2PA Manifest and Claim Signature respectively (or one `c2pa.ingredient.v2` or `c2pa.ingredient` that includes a `c2pa_manifest` field) of the asset that is being updated and (b) has the value of `parentOf` for the `relationship` field.

|     |     |
| --- | --- |
|  | The ingredient’s C2PA Manifest can be either a standard manifest or an update manifest. |

#### 11.2.4. Compressed Manifests

Standard and Update Manifests can be compressed, in their entirety, using the [Brotli compression algorithm](https://datatracker.ietf.org/doc/html/rfc7932) as described [above](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_compressed_boxes). For either type of manifest, the value of the `TYPE` field shall be `c2cm`, the value of the [label field](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_labels) shall be the identical to the label of the compressed manifest superbox, and the contents of the `brob` content box shall be the compressed bytes of the entire manifest superbox. See [Figure 7, “Example of a compressed manifest”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#compressed_manifest_image) for an example of a compressed standard manifest.

|     |     |
| --- | --- |
|  | Any place in this specification that a standard or update manifest is referenced, a compressed standard or update manifest is also valid. |

#### 11.2.5. Time-Stamp Manifests

In some provenance workflows, a standard or update manifest is created offline, where it is not possible to obtain a trusted time-stamp (as per [RFC 3161](http://datatracker.ietf.org/doc/html/rfc3161)) from a TSA at the time of signing. In order to accommodate this, it is possible to use a Time-Stamp Manifest (JUMBF type UUID: `6332746D-0011-0010-8000-00AA00389B71` (`c2tm`)) to add the time-stamp in a later operation when a TSA can be contacted.

A Time-Stamp Manifest shall contain only a single assertion, which is the `c2pa.ingredient.v3` assertion that (a) includes an `activeManifest` field with a value that is the [URI reference](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) to that [C2PA Manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_box_details) that is being updated and (b) has the value of `parentOf` for the `relationship` field.

|     |     |
| --- | --- |
|  | The ingredient’s C2PA Manifest (referenced via the `activeManifest` field) can be either a standard manifest or an update manifest. |

### 11.3. Embedding manifests into various file formats

A C2PA Manifest can be embedded into a variety of file formats covering media types including images, videos, audio, fonts, and documents. [Appendix A, _Embedding manifests_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#embedding_annex) provides the technical details on how to embed C2PA Manifests into each specifically supported file format.

|     |     |
| --- | --- |
|  | Many classic image formats such as BMP do not support the embedding of arbitrary data, so the use of an [external manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_external_manifests) is required. |

### 11.4. External Manifests

In some cases, it may not be possible (or practical) to embed a C2PA Manifest Store in an asset. In those cases, keeping the C2PA Manifests externally to the asset is an acceptable model for providing provenance to assets. The C2PA Manifest should be stored in a location, referred to as a manifest repository, that is easily locatable by a Manifest Consumer working with the asset, such as [by reference or URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_by_reference_or_uri). As the C2PA Manifest Store is a JUMBF box, it shall be served with the JUMBF Media Type, `application/c2pa`.

|     |     |
| --- | --- |
|  | Previous versions of this specification used the media type `application/x-c2pa-manifest-store` for the C2PA Manifest Store. That media type is deprecated. |

Some common reasons to use an external manifest are:

- It may not be technically possible, such as with a `.txt` file.

- It may not be practical, such as when the size of the C2PA Manifest Store is larger than the asset’s digital content.

- It may not be appropriate, such as when it would modify an asset that should not be modified.



|     |     |
| --- | --- |
|  | a good example of this is creating a manifest for a pre-existing asset. |


### 11.5. Embedding a Reference to an external Manifest

If the asset has embedded XMP, and the C2PA Manifest will be stored externally, it is recommended that the claim generator add a [`dcterms:provenance`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/provenance) key to the XMP, the value (a URI reference) being where to locate the active manifest.

|     |     |
| --- | --- |
|  | A previous version of this specification also recommended using this method for references to embedded manifests. Now this mechanism is only for external manifests. |

Since fonts do not support XMP, an equivalent method for specifying a URI to a remote C2PA Manifest Store is described in [this clause on fonts](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_fonts).

## 12\. Entity Diagram

[Figure 11, “C2PA Entity Diagram”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#entity-diagram) provides a look at how all of the pieces of the C2PA system integrate and relate to each other.

![C2PA Entity Diagram](https://kroki.io/plantuml/svg/eNqlVdtqGzEQfd79isF5MBSSpS992BZD4rQlD2mh8Q_Iq7EtopUWSY7jhvx7R9qLtLaxWxoIWY00Z86cuSSfwo-fi68loHLC7UFYYAqYFMzCShuoJLM2_2LdXuIsD6d7wdaG1fCWQ3sdvvzPFJhzRiy3Dj0MhxrdRnPbX3_Tys21JNil3GJvvWPV89roreLt3R6l1Lt8wGxjKFb3HhtkHM0QFcDjPonfCB8_DbYk2IvQEt34tc8Hllryzvye-9_3_EvRpZpnEteoeJ5lH-BWSjAomRNa2Y1oKDuDYIVabyUzsFUSiaJ2GzQ7YemmwUqsBLbe3w2iAikUqWKwMWhJbMB6iZwjLyriw4Sy4e0dCXP0lM7PyMmwQoOqwvbpAl8dCAVFIRwVrLJFQYIzRUQaT5RJQIk1AdB7yqTLJ8-msBEcgdgSUe0GA1N7YtVQF7gNpWZvbm7yLNxUwlQSu0P7pPb8jQ1w7EULDo3RS4pnYSfchsDWkjhXRu-okxB9GPssVMN87_gM3b5B0IY6JPf8QvvdWouOKptlc1KFjPQ1Bc-D_jyiY5w5RodgeWRKrNBSMbUhcu8jFOMlCEj3iUtR9CBFETymfePPDXL_Saq9eXNEuxOKkxzeHI0Pak0OwleHJmWSHIfgkxD9QdEY1aFzIon7jkB_Xmy29VIxIVNjn17LdIg8l0zUAXqIZKPTL-SsCrYIFTyexFoxtx0LNb4JmbTwg61NYmG21lE15z7eSlTMYUK-u1yIGp8cq5sDwqMyhRi9BYKpDXFLrF-wv4noUdn-zqYieSXv9GsA6kp6EHYsVdcrsamKIlZ-QEl0uyziMcO2VYYHQ00O7B4t7LHUmCYUxPIGIEsqVvfIL4L3Q8-R0ySZAB8kzFdZjktyfX3NZ3AwTXnUrCwDHD2bpX1_5Zf4Z0dbqPRfUELN9nFJ-SE6hpilg3YJIc_62QuxO_LdZjjhnS7IKZzy7af_vHM-Xi1lOW7OkMZwuFr79d5ChU_Ciiv9AOhENwe0SU3Ld3Kqlf4JftQ8HndkOAsVsSjd0bSkBONm_TteJ7H6wvwHxJFeJ8F8N3WAviEi4sHIp5Cj_ryEmSCGtRlarVsbB3dxy8ZHcZ3kWUwljieMJy72xMW5CfCJcraNelzFM2MAA0z8p5IqFdfaxU3Q4VwW4tJcdivzpIJprw-jgCPK_Yo823l_AAVflEg=?id=entity-diagram)

Figure 11. C2PA Entity Diagram

## 13\. Cryptography

### 13.1. Hashing

All cryptographic hashes that are applied as per the technical requirements of this specification shall be generated using one of the hash algorithms as described in this section. This section defines both:

- A list of hash algorithms that are allowed for generating hashes of new content as well as required for validating hashes of existing content (the allowed list);

- A list of hash algorithms that are required to be supported for validating hashes of existing content but are not allowed for generating hashes of new content (the deprecated list).


|     |     |
| --- | --- |
|  | This section does not govern algorithms used for soft bindings as described in [Section 18.9, “Soft Binding”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#soft_binding_assertion). |

|     |     |
| --- | --- |
|  | This section does not govern algorithms used by custom assertions that are defined outside of this specification. |

An algorithm shall appear in no more than one list. An algorithm that is instantiated over multiple output lengths (such as the various lengths of SHA2) will each be considered different algorithms, and each instantiation shall be listed separately. If an algorithm does not appear in either list, it is forbidden and shall not be used or supported. Algorithms can be removed from the lists in order to implement forbidding an algorithm. For this reason, implementations shall not support additional algorithms on an optional basis.

Implementers should consult this section in the current version of the specification when releasing software updates and ensure their supported algorithms conform to it.

These lists establish the allowed algorithms for creating hashes and a string algorithm identifier to be used as the algorithm identifier (usually called `alg`) in the corresponding field of C2PA data structures. The outputs of hash functions shall be stored as their binary values encoded into CBOR as byte strings (major type 2) with a declared length. Wherever a field contains the output of a hash function, an algorithm identifier string field shall be present within the same structure, or within an enclosing structure, or in the `claim-map` or `claim-map-v2` structure to declare which algorithm was used. A hash algorithm identifier field should be present in exactly one of these places, but if more than one is present within the structure and its enclosing structures, the nearest identifier shall be used. Nearest is defined first as an identifier that is a sibling field of the hash value, and then the immediately enclosing structure, up to the root structure. If no identifier is present in any of these places, then the `alg` field from the `claim-map` or `claim-map-v2` structure shall be used.

The allowed list is:

- SHA2-256 ("sha256");

- SHA2-384 ("sha384");

- SHA2-512 ("sha512").


|     |     |
| --- | --- |
|  | The SHA-3 family of hash algorithms are not on the allowed list for consistency with the digital signature algorithm allowed list, because COSE has not yet established digital signature algorithms that use a SHA-3 algorithm as the hash algorithm. |

The deprecated list is empty.

### 13.2. Digital Signatures

All digital signatures applied as per the technical requirements of this specification shall be generated using one of the digital signature algorithms and key types listed as described in this section. This section defines both:

- A list of digital signature algorithms and key types that are allowed for generating signatures for new claim signatures as well as required for validating existing claim signatures (the allowed list);

- A list of digital signature algorithms and key types that are required to be supported for validating existing claim signatures but are not allowed for generating new claim signatures (the deprecated list).


|     |     |
| --- | --- |
|  | This section does not govern digital signatures used by custom assertions that are defined outside of this specification. |

These lists establish the allowed algorithms and key types by referencing an algorithm identifier from the relevant standards that define algorithms for COSE and their mappings to CBOR identifiers, including but not limited to [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152) and [RFC 8230](https://datatracker.ietf.org/doc/html/rfc8230/). These standards also specify the hash algorithm used in the signature scheme. Nothing in [Section 13.1, “Hashing”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing) shall apply to this use of hash algorithms; if a digital signature algorithm is present in the digital signature algorithm and key type [below](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signature_algorithms), the use of its specified hash algorithm in the signature scheme shall be allowed and followed.

|     |     |
| --- | --- |
|  | Parenthetical notes in the lists below are explainers provided only as an aid to the reader. |

#### 13.2.1. Signature Algorithms

The allowed list is:

- ES256 (ECDSA with SHA-256);

- ES384 (ECDSA with SHA-384);

- ES512 (ECDSA with SHA-512);

- PS256 (RSASSA-PSS using SHA-256 and MGF1 with SHA-256);

- PS384 (RSASSA-PSS using SHA-384 and MGF1 with SHA-384);

- PS512 (RSASSA-PSS using SHA-512 and MGF1 with SHA-512);

- EdDSA (Edwards-Curve DSA).



  - Ed25519 instance only. No other EdDSA instances are allowed.


The deprecated list is empty.

Implementations are required to check that keys provided for signing or verification operations are correct for the chosen algorithm, as required by [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 8.1 for ECDSA, [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 8.2 for EdDSA, and [RFC 8230 section 2](https://www.rfc-editor.org/rfc/rfc8230.html#section-2) and [section 4](https://www.rfc-editor.org/rfc/rfc8230.html#section-4) for RSASSA-PSS.

These requirements are summarized here for convenience:

- ECDSA requires elliptic curve keys on the P-256, P-384, or P-521 elliptic curves.



  - Although it is recommended to use P-256 keys with `ES256`, P-384 keys with `ES384`, and P-521 keys with `ES512`, it is not required. Implementations shall accept keys on any of these curves for all ECDSA algorithm choices.


- Ed25519 requires elliptic curve keys on the X25519 elliptic curve.

- RSASSA-PSS requires RSA keys with a modulus length of at least 2048 bits.


Implementations shall refuse to generate or verify signatures with keys that are not correct for the algorithm choice. Implementations may refuse RSA keys with modulus length greater than 16384 bits.

#### 13.2.2. Use of COSE

The signature for the CBOR-encoded claim is produced by CBOR Object Signing and Encryption (COSE) as described in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), sections 4.2 and 4.4.

|     |     |
| --- | --- |
|  | Payloads can either be present inside a COSE signature, or transported separately ("detached content" as described in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 4.1). In "detached content" mode, the signed data is stored externally to the `COSE_Sign1_Tagged` structure, and the `payload` field of the `COSE_Sign1_Tagged` structure is always `nil`. |

Regardless of whether the payload will be present in or detached from the `COSE_Sign1_Tagged` signature; the contents of the `payload` field of `Sig_structure` in memory, when constructed to compute or verify a digital signature, shall be populated with that external data as described by the particular use of digital signature in this specification. The `payload` field of `Sig_structure` shall never be `nil`.

When computing or verifying the signature of a standard or update manifest, the `payload` field of the `Sig_structure` will contain the contents of the claim JUMBF box, as described in [Section 10.3.2.4, “Signing a Claim”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_signing_a_claim) and [Section 11.1, “Use of JUMBF”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_use_of_jumbf).

When computing or verifying the signature of a time-stamp manifest, the `payload` field of the `Sig_structure` will contain the C2PA Claim Signature box of the C2PA Manifest of its parent ingredient, and shall use detached content mode.

#### 13.2.3. Computing the Signature

The signature is computed or verified as described in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 4.4. The following additional requirements apply to the construction of `Sig_structure`:

- The value for the `context` element shall be `Signature1` except where a particular use of digital signatures in this specification specifies using `CounterSignature` instead. `Signature` shall not be used.

- The value for the `payload` element will be specified by each use of digital signatures in this specification.

- The `external_aad` element shall be a `bstr` of length zero. External authenticated data shall not be used.

- The `alg` header specifying the signature algorithm shall be present in the `body_protected` element as defined in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 3.1.



|     |     |
| --- | --- |
|  | The `alg` header is a standard COSE header, and therefore is always included in the protected header map with the integer `1` as its label, as established in the [IANA COSE Header Parameters Registry](https://www.iana.org/assignments/cose/cose.xhtml#header-parameters). The literal string `alg` is never used as the label. The `sign_protected` element is always omitted when using `COSE_Sign1`. |


All digital signatures in C2PA structures shall be a `COSE_Sign1_Tagged` structure as defined in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 4.2. `COSE_Sign1_Tagged` contains a `COSE_Sign1` structure. The following additional requirements apply to the construction of `COSE_Sign1_Tagged`:

- The same `alg` header in the `Sig_structure` above shall be present in the `protected` header bucket.

- The value for the `payload` field and whether the payload is present in the signature or detached will be specified by each use of digital signatures in this specification. When the `payload` is specified as detached, its value here shall be `nil`. Conversely, when the payload is present in the signature, the binary contents of the payload are stored in this field as a `bstr`.


|     |     |
| --- | --- |
|  | COSE defines `nil` to be major type 7, value 22 in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 1.3, and uses this value exclusively for detached content. A byte array (major type 2) of length zero cannot be used to indicate detached content. |

#### 13.2.4. Signature Validation

When producing a signature, if the claim generator can also act as a validator, the claim generator should validate that the signing credential is acceptable according to [Chapter 14, _Trust Model_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trust_model) and produce a warning if it is not. The claim generator may still allow signing with that credential if so desired. This may be desirable if it is known that the local claim generator’s validator has a different configuration than validators used by the expected audience of the asset.

#### 13.2.5. Cryptographic validation

When verifying a signature, an in-memory `Sig_structure` is generated. Its `body_protected` field is populated with the contents of the `protected` header bucket from the `COSE_Sign1_Tagged` structure ( [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 4.4). For the `payload` field, if the payload was specified as present in the signature, it is populated from the `payload` field of the `COSE_Sign1_Tagged` structure. If the payload was specified as detached, the `payload` field of the `COSE_Sign1_Tagged` structure will be `nil`. In this case, the contents of the `payload` field of `Sig_structure` shall be populated from the same external source that was used in the generation of the signature. These are defined in the places where the digital signature is used in this specification.

#### 13.2.6. Inclusion of Signer Icons

A C2PA Manifest Consumer may wish to display an icon or logo for the signer. To locate such a graphic, it shall look inside the embedded certificate for a logotype as defined in [RFC 9399](https://datatracker.ietf.org/doc/rfc9399/). If no logotype is present, the Manifest Consumer may use icons or logos from other sources in an implementation-dependent manner.

## 14\. Trust Model

|     |     |
| --- | --- |
|  | In this section, "user" refers to human actors that are using C2PA-compliant validators in consumption and authoring scenarios. |

### 14.1. Overview

![C2PA Trust Model Diagram](https://kroki.io/ditaa/png/eNqtks1qwzAMx-95Ct2NX6BslxQKO2_sWPActTVLE5CcQiAPP8Wxk3hLYIz9T7J-6MuS0lEKvklpvctyroohOYc36tgzsLs2SODbYQkQM1LH3AUanAlLltcpTJyMtiMEf0NHwo6EFTbemVqYC-alj1VY-LupXWV8S8OqlyedS8Z4mSr_ZPmYksWeTmXs2s7FeXTYciLr5leSyLKMWdS__O74PsMfdS52O_2NDiH8sMnUc5KaV_tIiwjbjeHpKgwzkndtIybhklQse0P7OUU734NpqqW60npzW0dJ1N2Rtvn8dQB3UyF89OM1pcuEvHpLhNbX_Xxbxf6XZGPHE_wC98W3Jg==?id=trust-model-diagram)

Figure 12. C2PA Trust Model Diagram

[Figure 12, “C2PA Trust Model Diagram”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#trust-model-diagram) shows, in yellow, green and red, the three entities specified in the trust model, which is concerned with trust in a signer’s identity. In dashed lines, below, is the consumer (who is not specified in the trust model), who uses the identity of the signer, along with other trust signals, to decide whether the assertions made about an asset are true.

### 14.2. Identity of Signers

Identity in the trust model is the means by which a cryptographic signing key (aka credential) is associated with the signer for the basis of making trust decisions based on the claim signature or any structure (including, but not limited to, assertions and claims) signed with that key.

The credential shall be listed in the COSE protected headers of the `COSE_Sign1_Tagged` structure used for digital signatures in all C2PA manifests. Exactly one instance of an identity credential shall appear in the union of the protected and unprotected headers. `COSE_Sign1_Tagged` structures with no credentials, or two or more credentials, shall be rejected. Repeating the same credential more than once, including separately in the protected and unprotected headers, is also an instance of two or more credentials and shall be rejected.

|     |     |
| --- | --- |
|  | Older versions of this specification also allowed the credential to appear in the COSE unprotected headers. |

How the credential is stored in the header value, how trust chains are constructed are specified, and additional information can be found in [Section 14.5, “X.509 Certificates”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates).

### 14.3. Validation states

#### 14.3.1. General

A validator is a Manifest Consumer that will make some [validation](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#validation-clause) statements about that asset and its associated active manifest. The process for retrieving these statements is described in the [validation section](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#validation-clause). The actor consuming the asset, usually through their user agent and its user interface, then has to interpret those statements to arrive at a set of conclusions of their own about the provenance of the asset they are consuming. These conclusions will be drawn from those statements and the contents of the asset itself.

#### 14.3.2. Manifest States

Based on these statements, a C2PA Manifest may be one of the following:

- [Well-Formed](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_well_formed_manifest)

- [Valid](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_valid_manifest)

- [Trusted](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trusted_manifest)


|     |     |
| --- | --- |
|  | Any Trusted manifest is also Valid, and any Valid manifest is also Well-Formed. |

#### 14.3.3. Asset States

If a validator reports that the portions of the asset that are covered by content bindings have not been modified since the active manifest was produced \[ [Section 15.12, “Validate the Asset’s Content”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_assets_content)\], and its active manifest is either [Valid](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_valid_manifest) or [Trusted](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trusted_manifest), then the asset itself is a Valid asset.

#### 14.3.4. Well-Formed Manifest

A C2PA Manifest is Well-Formed if validation determines that each of the following is true:

- The manifest’s contents abide by the normative requirements of this specification, that are validated via the [validation process](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validation_process).

- Only those assertions allowed for the [specific type](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_types_of_manifests) of the manifest are present \[ [Section 15.10.1, “Validate the correct assertions for the type of manifest”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_correct_assertions_for_the_type_of_manifest)\].

- The assertions of the manifest meet all the requirements for assertions \[ [Section 15.10.3, “Assertion Validation”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_assertion_validation)\].

- Any ingredients present in the manifest meet all the requirements for ingredients \[ [Section 15.11, “Validate the Ingredients”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_ingredients)\].


#### 14.3.5. Valid Manifest

A C2PA Manifest is Valid if validation determines that each of the following is true:

- The manifest is Well-Formed \[ [Section 14.3.4, “Well-Formed Manifest”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_well_formed_manifest)\].

- The manifest has not been modified since the manifest was signed \[ [Section 13.2.5, “Cryptographic validation”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_cryptographic_validation)\].

- The claim signature receives a success code of `claimSignature.validated` \[ [Section 15.7, “Validate the Signature”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_signature)\].

- Validation of the claim signature validity period receives the success code of `claimSignature.insideValidity` \[ [Section 15.8, “Validate the Time-Stamp”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_time_stamp)\].

- The credential of the signer of the C2PA Manifest is not rejected with a failure code of `signingCredential.ocsp.revoked`, or `signingCredential.ocsp.unknown` \[ [Section 15.9, “Validate the Credential Revocation Information”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_credential_revocation_information)\].


If a C2PA Manifest is Valid, then the manifest’s claim can be attributed to the claim generator which is identified by the `claim_generator_info` field of the claim \[ [Section 10.2.3, “Claim Generator Info”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_claim_generator_info)\].

#### 14.3.6. Trusted Manifest

A C2PA Manifest is Trusted if validation determines that each of the following is true:

- The manifest is Valid \[ [Section 14.3.5, “Valid Manifest”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_valid_manifest)\].

- The signing credential of the C2PA Manifest receives the success code of `signingCredential.trusted` \[ [Section 15.7, “Validate the Signature”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_signature)\].


### 14.4. Trust Lists

#### 14.4.1. C2PA Signers

A validator shall maintain the following lists for C2PA signers:

- The list of X.509 certificate trust anchors provided by the C2PA (i.e., the C2PA Trust List).

- A list of additional X.509 certificate trust anchors.

- A list of accepted Extended Key Usage (EKU) values.


|     |     |
| --- | --- |
|  | Some of these lists can be empty. |

In addition to the list of trust anchors provided in the C2PA Trust List, a validator should allow a user to configure additional trust anchor stores, and should provide default options or offer lists maintained by external parties that the user may opt into to populate the validator’s trust anchor store for C2PA signers.

#### 14.4.2. Time Stamp Authorities

A validator shall maintain a list of X.509 certificate trust anchors for Time Stamp Authorities, which shall be different than the lists [for C2PA signers](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_signers) and will be referred to as the C2PA TSA Trust List.

|     |     |
| --- | --- |
|  | This list can be empty. |

In addition to the list of trust anchors provided in the C2PA TSA Trust List, a validator should allow a user to configure additional trust anchor stores, and should provide default options or offer lists maintained by external parties that the user may opt into to populate the validator’s trust anchor store for Time Stamp Authorities.

#### 14.4.3. Private Credential Storage

A validator may also allow the user to create and maintain a private credential store of signing credentials. This store is intended as an "address book" of credentials they have chosen to trust based on an out-of-band relationship. If present, the private credential store shall only apply to validating signed C2PA manifests, and shall not apply to validating time-stamps. If present, the private credential store shall only allow trust in signer certificates directly; entries in the private credential store cannot issue credentials and shall not be included as trust anchors during validation.

A validator shall not be pre-configured with any entries in a private credential store.

A validator shall only add entries to a private credential store in response to a user request to trust the credential. Similarly, a validator shall only remove entries from a private credential store in response to a user request to stop trusting the credential.

### 14.5. X.509 Certificates

X.509 Certificates are stored as defined by [RFC 9360](https://datatracker.ietf.org/doc/html/rfc9360) ( _CBOR Object Signing and Encryption (COSE): Header Parameters for Carrying and Referencing X.509 Certificates_). For convenience, the definition of `x5chain` is copied below.

|     |     |
| --- | --- |
|  | This specification adds additional requirements beyond those of [RFC 9360](https://datatracker.ietf.org/doc/html/rfc9360), which are listed after the quoted text. In particular, this specification requires all intermediate certificate authorities' certificates of the signer’s certificate chain to be included in the `x5chain` header, and requires claim generators to always place the `x5chain` header in the protected header bucket. |

> x5chain: This header parameter contains an ordered array of X.509 certificates. The certificates are to be ordered starting with the certificate containing the end-entity key followed by the certificate that signed it, and so on. There is no requirement for the entire chain to be present in the element if there is reason to believe that the relying party already has, or can locate, the missing certificates. This means that the relying party is still required to do path building but that a candidate path is proposed in this header parameter.
>
> The trust mechanism MUST process any certificates in this parameter as untrusted input. The presence of a self-signed certificate in the parameter MUST NOT cause the update of the set of trust anchors without some out-of-band confirmation. As the contents of this header parameter are untrusted input, the header parameter can be in either the protected or unprotected header bucket. Sending the header parameter in the unprotected header bucket allows an intermediary to remove or add certificates.
>
> The end-entity certificate MUST be integrity protected by COSE. This can, for example, be done by sending the header parameter in the protected header, sending an 'x5chain' in the unprotected header combined with an 'x5t' in the protected header, or including the end-entity certificate in the external\_aad.
>
> This header parameter allows for a single X.509 certificate or a chain of X.509 certificates to be carried in the message.
>
> - If a single certificate is conveyed, it is placed in a CBOR byte string.
>
> - If multiple certificates are conveyed, a CBOR array of byte strings is used, with each certificate being in its own byte string.

The validator is only expected to have the certificates for its trust anchors. Therefore, when creating the `x5chain` header as part of signing, the claim generator shall include the signer’s certificate and all intermediate certificate authorities in the header’s value. The trust anchor’s certificate (also called the root certificate) should not be included.

The `subjectPublicKeyInfo` element of the first or only certificate will be the public key used to validate the signature. The `validity` element of the `tbsCertificate` sequence provides the time validity period of the certificate.

A previous version of this specification required claim generators to write the string label `x5chain` only to avoid the unlikely possibility that the integer label `33` would not be standardized. Integer label `33` has now been standardized, and this specification now adopts it as standard, and deprecates use of the string label. Therefore:

- Claim generators should use only the integer `33` as the label when inserting this header into a COSE signature. Claim generators may continue to write the string label `x5chain` but this behaviour is now deprecated and claim generators should be updated to use the integer label only. Claim generators shall place this header only in the protected header bucket of the COSE signature as required above.

- Validators shall accept either the string `x5chain` or the integer `33` as the label for this header. If both labels are present, validators shall use the header with the integer label `33` and ignore the header with the string `x5chain` as the label. Validators shall accept the header from either the protected or unprotected bucket, to maintain compatibility with previous versions of this specification. In compliance with [Section 14.2, “Identity of Signers”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_identity_of_signers), if this header appears in both the protected and unprotected buckets with the same label, a validator shall reject the claim signature as malformed due to the presence of multiple credentials.


#### 14.5.1. Certificate Profiles

##### 14.5.1.1. General Requirements

This section defines the requirements to validate that an X.509 certificate is acceptable as a signing credential as described in [Section 15.7, “Validate the Signature”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_signature).

All certificates shall fulfill the following requirements.

- The `algorithm` field of the `signatureAlgorithm` field shall be one of the following values:

`ecdsa-with-SHA256`

[RFC 5758, section 3.2](https://datatracker.ietf.org/doc/html/rfc5758#section-3.2)

`ecdsa-with-SHA384`

[RFC 5758, section 3.2](https://datatracker.ietf.org/doc/html/rfc5758#section-3.2)

`ecdsa-with-SHA512`

[RFC 5758, section 3.2](https://datatracker.ietf.org/doc/html/rfc5758#section-3.2)

`sha256WithRSAEncryption`

[RFC 8017, appendix A.2.4](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.4)

`sha384WithRSAEncryption`

[RFC 8017, appendix A.2.4](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.4)

`sha512WithRSAEncryption`

[RFC 8017, appendix A.2.4](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.4)

`id-RSASSA-PSS`

[RFC 8017, appendix A.2.3](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.3)

`id-Ed25519`

[RFC 8410 section 3](https://datatracker.ietf.org/doc/html/rfc8410#section-3)

- If the `algorithm` field of the `signatureAlgorithm` field is `id-RSASSA-PSS`, the `parameters` field is of type `RSASSA-PSS-params`. Its fields shall have the following requirements as defined in [RFC 8017, appendix A.2.3](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.3):



  - The `hashAlgorithm` field shall be present.

  - The `algorithm` field of the `hashAlgorithm` field shall be one of the following values as defined in [RFC 8017, appendix B.1](https://datatracker.ietf.org/doc/html/rfc8017#appendix-B.1):



    - `id-sha256`.

    - `id-sha384`.

    - `id-sha512`.


  - The `maskGenAlgorithm` field shall be present.

  - The `algorithm` field of the `parameters` field of the `maskGenAlgorithm` field shall be equal to the `algorithm` field of the `hashAlgorithm` field.


- If the `algorithm` field of the `algorithm` field of the certificate’s `subjectPublicKeyInfo` is `id-ecPublicKey`, the `parameters` field shall be one of the following named curves from [RFC 5480, section 2.1.1.1](https://datatracker.ietf.org/doc/html/rfc5480#section-2.1.1.1):



  - `prime256v1`.

  - `secp384r1`.

  - `secp521r1`.


- If the `algorithm` field of the `algorithm` field of the certificate’s `subjectPublicKeyInfo` is `rsaEncryption` or `id-RSASSA-PSS`, the `modulus` field of the `parameters` field shall have a length of at least 2048 bits.


All certificates except those in the private credential store for X.509 certificates shall fulfill the following additional requirements to be acceptable.

- Version shall be `v3` as per [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.1.2.1.

- The `issuerUniqueID` and `subjectUniqueID` optional fields of the `TBSCertificate` sequence shall not be present, as per [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.1.2.8.

- The Basic Constraints extension shall follow [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.1.9. In particular, one of the following shall be true:



  - If the certified public key can be used to verify certificate signatures, the Basic Constraints extension shall be present with the `cA` boolean asserted.

  - If the certified public key cannot be used to verify certificate signatures, either the Basic Constraints extension shall be absent or the `cA` boolean in the extension shall not be asserted and the `keyCertSign` bit in the key usage extension shall not be asserted.


- The Authority Key Identifier extension shall be present in any certificate that is not self-signed, as per [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.1.1.

- As prescribed in [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.1.2, the Subject Key Identifier extension shall be present in any certificate that acts as a CA. It should be present in end entity certificates.

- As prescribed in [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.1.3, the Key Usage extension shall be present and should be marked as critical. Certificates used to sign C2PA manifests shall assert the `digitalSignature` bit. The `keyCertSign` bit shall only be asserted if the `cA` boolean is asserted in the Basic Constraints extension.

- The Extended Key Usage (EKU) extension shall be present and non-empty in any certificate where the Basic Constraints extension is absent or the `cA` boolean is not asserted, as per [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.1.12. These are commonly called "end entity" or "leaf" certificates.



  - The `anyExtendedKeyUsage` EKU (2.5.29.37.0) shall not be present.

  - If the configuration store contains a list of EKUs, a certificate that signs C2PA manifests shall be valid for at least one of the listed purposes.

  - If the configuration store does not contain a list of EKUs, a certificate that signs C2PA manifests shall be valid for the `id-kp-emailProtection` (1.3.6.1.5.5.7.3.4) purpose and/or the `id-kp-documentSigning` (1.3.6.1.5.5.7.3.36) purpose.



    - The `id-kp-emailProtection` and `id-kp-documentSigning` purposes are not implicitly included by default if a list of EKUs has been configured. This only applies when no list has been configured.


  - A certificate that signs time-stamping countersignatures shall be valid for the `id-kp-timeStamping` (1.3.6.1.5.5.7.3.8) purpose.

  - A certificate that signs OCSP responses for certificates shall be valid for the `id-kp-OCSPSigning` (1.3.6.1.5.5.7.3.9) purpose.

  - If a certificate is valid for either `id-kp-timeStamping` or `id-kp-OCSPSigning`, it shall be valid for exactly one of those two purposes, and not valid for any other purpose.

  - A certificate should not be valid for any other purposes outside of the purposes listed above, but the presence of any EKUs not mentioned in this profile and not in the list of EKUs in the configuration store shall not cause the certificate to be rejected.


##### 14.5.1.2. Certificate Trust Chain

When validating a certificate as the signing credential, if the certificate is present in the private credential store for X.509 certificates, the certificate is accepted. The private credential store is not consulted when validating time-stamps.

If the certificate is not present in the private credential store, or the validator does not implement one, the trust chain shall be built and validated according to the procedure in [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 6 for the particular purpose required (signing, time-stamping, or OCSP signing) and for the appropriate trust anchor store for that purpose. Any failure of that validation algorithm shall mean the chain shall be rejected. The private credential store is never included when building certificate chains; certificates in the private credential store cannot act as CAs.

Only end entity certificates shall be used to sign C2PA Manifests or time-stamps. A CA certificate shall not be used for these purposes. Any CA certificate (where the `cA` boolean in the Basic Constraints extension is asserted) being used to validate a signature on a C2PA Manifest, time-stamp, or OCSP response shall be rejected with a failure code of `signingCredential.untrusted`.

A validator shall ensure a signing certificate is authorized for the purpose for which it is being used, and reject certificates used for an unauthorized purpose. A certificate is authorized for a particular purpose if the purpose’s EKU Object Identifier (OID) is present in the Extended Key Usage extension of the certificate ( [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.1.12). When validating a certificate chain used to sign a C2PA manifest, the signing certificate shall have at least one of the accepted EKUs for C2PA signers if configured, or at least one of `id-kp-emailProtection` (1.3.6.1.5.5.7.3.4) and `id-kp-documentSigning` (1.3.6.1.5.5.7.3.36) EKUs if such a list is not configured. When validating a certificate chain used to sign a time-stamp, the signing certificate shall have the `id-kp-timeStamping` (1.3.6.1.5.5.7.3.8) EKU. When validating a certificate chain used to sign an OCSP response, the signing certificate shall have the `id-kp-OCSPSigning` (1.3.6.1.5.5.7.3.9) EKU.

|     |     |
| --- | --- |
|  | It is recommended that implementors always configure a list of acceptable EKUs for C2PA signers, even when using the defaults. |

Except for certificates accepted through the private credential store for X.509 certificates, a validator shall verify a certificate’s compliance with the Certificate Profile, and reject certificates that do not comply. This includes requiring the presence of the Extended Key Usage extension, as well as a certificate being authorized for no more than one of the three purposes listed in this section: C2PA signing, time-stamp signing, or OCSP response signing.

As described in the Certificate Profile, Certification Authority (CA) certificates which issue certificates are not required to have an EKU extension, and usually will not. If one is present, it shall be ignored. This requirement only applies to end entity certificates signing C2PA manifests, time-stamps, or OCSP responses. CA certificates shall not be used for signing C2PA manifests, time-stamps, or OCSP responses.

#### 14.5.2. Certificate Revocation

X.509 certificates support revocation status queries. A claim generator should use the Online Certificate Status Protocol (OCSP, see [RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960)) and OCSP stapling (as originally conceptualized in [RFC 6066, Section 8](https://datatracker.ietf.org/doc/html/rfc6066), but implemented as described in this clause) to implement revocation. The claim generator shall not use Certificate Revocation Lists (CRLs, see [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280)).
\`\`

|     |     |
| --- | --- |
|  | Using CRLs requires downloading the entire list of revoked certificates for each Certificate Authority encountered, which can be time-consuming. Although a CRL could be included in the same way an OCSP response is stapled, the potential size of a CRL relative to an OCSP response also makes this undesirable. |

A conforming CA should include an AuthorityInfoAccess (AIA) extension ( [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.2.1) to provide access information for the OCSP service operated by the CA.

If the certificate has an AIA extension, revocation information shall be stored in an unprotected header of the `COSE_Sign1` structure with the string label `rVals` and the value’s schema shall follow the `rVals` rule in [Example 3, “CDDL for `rVals`”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#rVals-cddl):

Example 3. CDDL for `rVals`

```cddl
; CBOR version of rVals and related structures based on JSON schema in https://www.etsi.org/deliver/etsi_ts/119100_119199/11918201/01.01.01_60/ts_11918201v010101p.pdf section 5.3.5.2
rVals = {
  "ocspVals": [1* bstr]
}
```

cddl![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

|     |     |
| --- | --- |
|  | The above definition is a CBOR adaptation of a subset of the schema from :jades:, section 5.3.5.2, which only stores OCSP responses, and stores them as binary strings. |

Before signing a claim, if a signer’s certificate has the AIA extension, a signer should query the OCSP service indicated therein, capture the response, and store it in an element of the `ocspVals` array of the `rVals` header.

The process for validating the revocation status of certificates is described in more detail in [Validate the Credential Revocation Information](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_credential_revocation_information).

## 15\. Validation

### 15.1. Validation Process

#### 15.1.1. Description

Validation of a C2PA Manifest is a multi-step process that involves validating the assertions, claim & associated claim signature contained within it along with (for active manifests, only) validation of any associated hard bindings. This validation process is performed by a validator, which is a hardware or software actor that implements the validation algorithms described in this clause.

#### 15.1.2. Phases of Validation

These phases, which are listed in no particular order, are described in the following clauses:

- [Section 15.10, “Validate the Assertions”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_assertions): Validation of the assertions.

- [Section 15.11, “Validate the Ingredients”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_ingredients): Validation of the ingredients, if any.

- [Section 15.8, “Validate the Time-Stamp”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_time_stamp): Validation of the time-stamp.

- [Section 15.9, “Validate the Credential Revocation Information”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_credential_revocation_information): Validation of the credential revocation information.

- [Section 15.7, “Validate the Signature”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_signature): Validation of the claim signature.

- [Section 15.12, “Validate the Asset’s Content”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_assets_content): Validation of the content of the asset.


As described in [Section 14.3, “Validation states”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validation_states), a C2PA Manifest may be considered as [Well-Formed](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_well_formed_manifest), [Valid](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_valid_manifest) or [Trusted](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trusted_manifest) based on the results of these steps.

#### 15.1.3. Visual Representation

[Figure 13, “Validating a Claim”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#Claim_Validation) is a visual representation of the process of validating a C2PA Manifest.

![Validating a Claim](https://spec.c2pa.org/specifications/specifications/2.1/specs/_images/Claim_Validation.svg)

Figure 13. Validating a Claim

|     |     |
| --- | --- |
|  | If there are any discrepancies between the visual representation and the text, the text is considered authoritative. |

### 15.2. Returning Validation Results

The validation algorithm shall return a consolidated set of validation results for the all manifests in the asset’s C2PA Manifest Store, including the active manifest as well all other manifests in the C2PA Manifest Store that are referenced via ingredient assertions.

Validation results are expressed via a standard set of success, informational, and failure codes, as defined below in [Section 15.2.1, “Standard Status Codes”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_standard_status_codes). Custom status codes are also permitted, when a claim generator has a need to record some process-specific status information. Custom codes shall conform to the same syntax as [entity-specific namespaces](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_namespacing), e.g. `com.litware`.

When a claim generator adds an ingredient asset via an ingredient assertion, it shall act as a validator, and perform the full validation algorithm described in this section on the ingredient. The claim generator shall record the validation results of the ingredient, per the following [CDDL Definition](https://datatracker.ietf.org/doc/html/rfc8610) schema, as the value of the `validationResults` field in the [ingredient assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#ingredient_assertion).

CDDL for Validation Results

```cddl
; Validation codes

; Success codes
$status-code /= "claimSignature.validated"
$status-code /= "claimSignature.insideValidity"
$status-code /= "signingCredential.trusted"
$status-code /= "signingCredential.ocsp.notRevoked"
$status-code /= "timeStamp.validated"
$status-code /= "timeStamp.trusted"
$status-code /= "assertion.hashedURI.match"
$status-code /= "assertion.dataHash.match"
$status-code /= "assertion.bmffHash.match"
$status-code /= "assertion.boxesHash.match"
$status-code /= "assertion.collectionHash.match"
$status-code /= "assertion.accessible"
$status-code /= "ingredient.manifest.validated"
$status-code /= "ingredient.claimSignature.validated"

; Informational codes
$status-code /= "signingCredential.ocsp.skipped"
$status-code /= "signingCredential.ocsp.inaccessible"
$status-code /= "timeStamp.mismatch"
$status-code /= "timeStamp.malformed"
$status-code /= "timeStamp.outsideValidity"
$status-code /= "timeStamp.untrusted"
$status-code /= "manifest.unknownProvenance"
$status-code /= "ingredient.unknownProvenance"

; Failure codes
$status-code /= "claim.missing"
$status-code /= "claim.multiple"
$status-code /= "claim.hardBindings.missing"
$status-code /= "claim.cbor.invalid"
$status-code /= "claimSignature.missing"
$status-code /= "claimSignature.outsideValidity"
$status-code /= "claimSignature.mismatch"
$status-code /= "manifest.multipleParents"
$status-code /= "manifest.timestamp.invalid"
$status-code /= "manifest.timestamp.wrongParents"
$status-code /= "manifest.update.invalid"
$status-code /= "manifest.update.wrongParents"
$status-code /= "manifest.inaccessible"
$status-code /= "manifest.compressed.invalid"
$status-code /= "manifest.unreferenced"
$status-code /= "signingCredential.untrusted"
$status-code /= "signingCredential.invalid"
$status-code /= "signingCredential.expired"
$status-code /= "signingCredential.ocsp.revoked"
$status-code /= "signingCredential.ocsp.unknown"
$status-code /= "assertion.hashedURI.mismatch"
$status-code /= "assertion.outsideManifest"
$status-code /= "assertion.missing"
$status-code /= "assertion.multipleHardBindings"
$status-code /= "assertion.undeclared"
$status-code /= "assertion.inaccessible"
$status-code /= "assertion.notRedacted"
$status-code /= "assertion.selfRedacted"
$status-code /= "assertion.json.invalid"
$status-code /= "assertion.cbor.invalid"
$status-code /= "assertion.action.ingredientMismatch"
$status-code /= "assertion.action.malformed"
$status-code /= "assertion.action.redacted"
$status-code /= "assertion.action.redactionMismatch"
$status-code /= "assertion.dataHash.malformed"
$status-code /= "assertion.dataHash.mismatch"
$status-code /= "assertion.bmffHash.malformed"
$status-code /= "assertion.bmffHash.mismatch"
$status-code /= "assertion.boxesHash.mismatch"
$status-code /= "assertion.boxesHash.unknownBox"
$status-code /= "assertion.boxesHash.unknownBoxes"
$status-code /= "assertion.cloud-data.hardBinding"
$status-code /= "assertion.cloud-data.actions"
$status-code /= "assertion.cloud-data.malformed"
$status-code /= "assertion.collectionHash.mismatch"
$status-code /= "assertion.collectionHash.incorrectFileCount"
$status-code /= "assertion.collectionHash.invalidURI"
$status-code /= "assertion.collectionHash.malformed"
$status-code /= "assertion.ingredient.malformed"
$status-code /= "assertion.metadata.disallowed"
$status-code /= "ingredient.manifest.missing"
$status-code /= "ingredient.manifest.mismatch"
$status-code /= "ingredient.claimSignature.missing"
$status-code /= "ingredient.claimSignature.mismatch"
$status-code /= "algorithm.unsupported"
$status-code /= "algorithm.deprecated"
$status-code /= "hashedURI.missing"
$status-code /= "hashedURI.mismatch"
$status-code /= "general.error" ; when nothing else applies

; custom status codes
$status-code /= tstr .regexp "([\\da-zA-Z_-]+\\.)+[\\da-zA-Z_-]+"

status-map = {
  "code": $status-code,         ; A label-formatted string that describes the status
  ? "url": jumbf-uri-type,     ; JUMBF URI reference to the JUMBF box to which this status code applies
  ? "explanation": tstr .size (1..max-tstr-length), ; A human readable string explaining the status
  ? "success": bool             ; DEPRECATED. Does the code reflect success (true) or failure (false)
}

status-codes-map = {
    "success": [* $status-map],          ; an array of validation success codes. May be empty.
    "informational": [* $status-map],    ; an array of validation informational codes. May be empty.
    "failure": [* $status-map]           ; an array of validation failure codes. May be empty.
}

; Objects containing validation results for a manifest and its ingredients

validation-results-map = {
    ? "activeManifest": $status-codes-map, ; Validation status codes for the ingredient's active manifest. Present if ingredient is a C2PA asset. Not present if the ingredient is not a C2PA asset.
    ? "ingredientDeltas": [* $ingredient-delta-validation-result-map] ; List of any changes/deltas between the current and previous validation results for each ingredient's manifest. Present if the the ingredient is a C2PA asset.
}

ingredient-delta-validation-result-map = {
    "ingredientAssertionURI": jumbf-uri-type,  ; JUMBF URI reference to the ingredient assertion
    "validationDeltas": $status-codes-map       ; Validation results for the ingredient's active manifest
}
```

cddl![copy icon](https://spec.c2pa.org/specifications/_/img/octicons-16.svg#view-clippy)Copied!

#### 15.2.1. Standard Status Codes

##### 15.2.1.1. Success codes

| Value | Meaning | `url` Usage |
| --- | --- | --- |
| `claimSignature.validated` | The claim signature referenced in the claim validated. | C2PA Claim Signature Box |
| `claimSignature.insideValidity` | The claim signature referenced in the claim was created within the validity period of the signing credential | C2PA Claim Signature Box |
| `signingCredential.trusted` | The signing credential is trusted | C2PA Claim Signature Box |
| `signingCredential.ocsp.notRevoked` | The signing credential was not revoked at the time of signing. | C2PA Claim Signature Box |
| `timeStamp.validated` | The time-stamp is well-formed, has a message imprint that matches the Claim Signature, and was created within the validity period of the time-stamp credential. | C2PA Claim Signature Box |
| `timeStamp.trusted` | The time-stamp credential is listed on the validator’s [list of trust anchors for time stamp authorities](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_time_stamp_authorities). | C2PA Claim Signature Box |
| `assertion.hashedURI.match` | The hash of the referenced assertion matches the corresponding hash in the assertion’s hashed URI in the claim. | C2PA Assertion |
| `assertion.dataHash.match` | Hash of a byte range of the asset matches the hash declared in the data hash assertion. | C2PA Assertion |
| `assertion.bmffHash.match` | Hash of a box-based asset matches the hash declared in the BMFF hash assertion. | C2PA Assertion |
| `assertion.boxesHash.match` | Hash of a box-based asset matches the hash declared in the general boxes hash assertion. | C2PA Assertion |
| `assertion.collectionHash.match` | Hashes of all the assets contained in a collection matches the hashes declared in the collection data hash assertion. | C2PA Assertion |
| `assertion.accessible` | A non-embedded (remote) assertion was accessible at the time of validation. | C2PA Assertion |
| `ingredient.manifest.validated` | The hash of the ingredient’s C2PA Manifest box was successfully validated. | C2PA Assertion |
| `ingredient.claimSignature.validated` | The hash of the ingredient’s C2PA Claim Signature box was successfully validated. | C2PA Assertion |

Table 2. Validation success codes

##### 15.2.1.2. Informational codes

| Value | Meaning | `url` Usage |
| --- | --- | --- |
| `signingCredential.ocsp.skipped` | The validator chose not to perform an online OCSP check. | C2PA Claim Signature Box |
| `signingCredential.ocsp.inaccessible` | The validator attempted to perform an online OCSP check, but did not receive a response. | C2PA Claim Signature Box |
| `timeStamp.malformed` | The time-stamp response included in the claim signature header is not properly formed, as per RFC 3161 | C2PA Claim Signature Box |
| `timeStamp.mismatch` | The time-stamp does not correspond to the contents of the claim. | C2PA Claim Signature Box |
| `timeStamp.outsideValidity` | The signed time-stamp attribute in the signature was created outside the validity period of the TSA’s certificate. | C2PA Claim Signature Box |
| `timeStamp.untrusted` | The time-stamp credential is not listed on the validator’s TSA [trust lists](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_time_stamp_authorities). | C2PA Claim Signature Box |
| `ingredient.unknownProvenance` | The ingredient does not have a C2PA Manifest. | C2PA Assertion |
| `algorithm.deprecated` | The algorithm has been deprecated. | C2PA Claim Box or C2PA Assertion |

Table 3. Validation informational codes

##### 15.2.1.3. Failure codes

| Value | Meaning | `url` Usage |
| --- | --- | --- |
| `claim.missing` | The referenced claim in the manifest cannot be found. | C2PA Claim Box |
| `claim.multiple` | More than one claim box is present in the manifest. | C2PA Claim Box |
| `claim.hardBindings.missing` | No hard bindings are present. | C2PA Claim Box |
| `claim.cbor.invalid` | The cbor of the claim is not valid. | C2PA Claim Box |
| `claimSignature.missing` | The claim signature referenced in the claim cannot be found in its manifest. | C2PA Claim Signature Box |
| `claimSignature.outsideValidity` | The claim signature referenced in the claim was created outside the validity period of the signing credential. | C2PA Claim Signature Box |
| `claimSignature.mismatch` | The claim signature referenced in the claim failed to validate. | C2PA Claim Signature Box |
| `manifest.multipleParents` | The manifest has more than one ingredient whose `relationship` is `parentOf`. | C2PA Claim Box |
| `manifest.timestamp.invalid` | The manifest is a time-stamp manifest, but it contains a disallowed (non-ingredient) assertion. | C2PA Claim Box |
| `manifest.timestamp.wrongParents` | The manifest is an time-stamp manifest, but it contains either zero or multiple `parentOf` ingredients. | C2PA Claim Box |
| `manifest.update.invalid` | The manifest is an update manifest, but it contains a disallowed assertion, such as a hard binding or actions assertions. | C2PA Claim Box |
| `manifest.update.wrongParents` | The manifest is an update manifest, but it contains either zero or multiple `parentOf` ingredients. | C2PA Claim Box |
| `manifest.inaccessible` | A non-embedded (remote) manifest was inaccessible at the time of validation. | C2PA Claim Box |
| `manifest.compressed.invalid` | The compressed manifest was not valid. | C2PA Claim Box |
| `manifest.unreferenced` | The manifest is not referenced via an ingredient assertion. | C2PA Manifest |
| `signingCredential.untrusted` | The signing credential is not listed on any of the validator’s [trust lists](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_signers). | C2PA Claim Signature Box |
| `signingCredential.invalid` | The signing credential is not valid for signing. | C2PA Claim Signature Box |
| `signingCredential.expired` | The signing credential has expired. | C2PA Claim Signature Box |
| `signingCredential.ocsp.revoked` | The OCSP response indicates that the signing credential has been revoked by the issuer. | C2PA Claim Signature Box |
| `signingCredential.ocsp.unknown` | The OCSP response contains an `unknown` status for the signing credential | C2PA Claim Signature Box |
| `assertion.hashedURI.mismatch` | The hash of the the referenced assertion in the manifest does not match the corresponding hash in the assertion’s hashed URI in the claim. | C2PA Assertion |
| `assertion.outsideManifest` | An assertion listed in the claim is not in the same C2PA Manifest as the claim | C2PA Claim Box |
| `assertion.missing` | An assertion listed in the manifest’s claim is missing from the asset’s manifest. | C2PA Claim Box |
| `assertion.multipleHardBindings` | The manifest has more than one hard binding assertion. | C2PA Assertion Store Box |
| `assertion.undeclared` | An assertion was found in the manifest that was not explicitly declared in the claim. | C2PA Assertion |
| `assertion.inaccessible` | A non-embedded (remote) assertion was inaccessible at the time of validation. | C2PA Assertion |
| `assertion.notRedacted` | An assertion was declared as redacted in the claim but is still present in the manifest. | C2PA Assertion |
| `assertion.selfRedacted` | An assertion was declared as redacted by its own claim. | C2PA Claim Box |
| `assertion.json.invalid` | The JSON(-LD) of an assertion is not valid | C2PA Assertion |
| `assertion.cbor.invalid` | The cbor of an assertion is not valid | C2PA Assertion |
| `assertion.action.ingredientMismatch` | An action that requires an associated ingredient either does not have one or the one specified cannot be located | C2PA Assertion |
| `assertion.action.malformed` | An actions assertion is malformed. | C2PA Assertion |
| `assertion.action.redacted` | An actions assertion was redacted when the claim was created. | C2PA Assertion |
| `assertion.action.redactionMismatch` | An action that requires an associated redaction either does not have one or the one specified cannot be located | C2PA Assertion |
| `assertion.dataHash.redacted` | A hard binding assertion was redacted when the claim was created. | C2PA Assertion |
| `assertion.dataHash.malformed` | A data hash assertion is malformed. | C2PA Assertion |
| `assertion.dataHash.mismatch` | The hash of a byte range of the asset does not match the hash declared in the data hash assertion. | C2PA Assertion |
| `assertion.bmffHash.malformed` | A BMFF hash assertion is malformed. | C2PA Assertion |
| `assertion.bmffHash.mismatch` | The hash of a box-based asset does not match the hash declared in a BMFF hash assertion. | C2PA Assertion |
| `assertion.boxesHash.mismatch` | The hash of a general box-like asset format does not match the hash declared in a general boxes hash assertion. | C2PA Assertion |
| `assertion.boxesHash.unknownBox` | A box other than those expected was found | C2PA Assertion |
| `assertion.cloud-data.hardBinding` | A hard binding assertion is in a cloud data assertion. | C2PA Assertion |
| `assertion.cloud-data.actions` | An update manifest contains a cloud data assertion referencing an actions assertion. | C2PA Assertion |
| `assertion.cloud-data.malformed` | The cloud-data assertion was incomplete | C2PA Assertion |
| `assertion.collectionHash.mismatch` | A hash of an asset in the collection does not match hash declared in the collection data hash assertion. | C2PA Assertion |
| `assertion.collectionHash.incorrectFileCount` | An asset that was listed in the collection data hash assertion is missing from the collection. | C2PA Assertion |
| `assertion.collectionHash.invalidURI` | A URI of an asset in the collection data hash assertion contains the file part '..' or '.'. | C2PA Assertion |
| `assertion.collectionHash.malformed` | The collection hash assertion was incomplete | C2PA Assertion |
| `assertion.ingredient.malformed` | The ingredient assertion was incomplete | C2PA Assertion |
| `assertion.metadata.disallowed` | The C2PA metadata assertion contains a field that is not allowed by this specification | C2PA Assertion |
| `ingredient.manifest.missing` | The referenced ingredient C2PA Manifest was not found. | C2PA Assertion |
| `ingredient.claimSignature.missing` | The referenced ingredient C2PA Claim Signature was not found. | C2PA Assertion |
| `ingredient.manifest.mismatch` | The hash of an embedded C2PA Manifest does not match the hash declared in the `hashed_uri` value of the `activeManifest` field in the ingredient assertion. | C2PA Assertion |
| `ingredient.claimSignature.mismatch` | The hash of an embedded C2PA Manifest’s C2PA Claim Signature does not match the hash declared in the `hashed_uri` value of the `claimSignature` field in the ingredient assertion. | C2PA Assertion |
| `algorithm.unsupported` | The algorithm is unspecified or unsupported. | C2PA Claim Box or C2PA Assertion |
| `hashedURI.missing` | The data pointed to by a `hashed_uri` cannot be located | C2PA Assertion |
| `hashedURI.mismatch` | The hash of a given `hashed_uri` does not match the corresponding hash of the destination URI’s data | C2PA Assertion |
| `general.error` | A value to be used when there was an error not specifically listed here. | C2PA Claim Box or C2PA Assertion |

Table 4. Validation failure codes

### 15.3. Displaying Manifest Information

Manifest Consumers should not display data from manifests which are not [Valid](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_valid_manifest) nor from assets which are not [Valid](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_asset_states). If the Manifest Consumer chooses to display such data, it shall include as part of the display:

- a warning about the lack of validity,

- a warning that the data shall not be attributed to the manifest’s signer, and in the case of an ingredient manifest, additional not to the asset’s manifest’s signer.


|     |     |
| --- | --- |
|  | In authoring scenarios, it is desirable to more prominently raise warnings so that a creator can make an informed decision about how to proceed with an asset that is not Valid or that has a flawed provenance history . |

### 15.4. Determining the hashing algorithm

#### 15.4.1. For Hashed URIs

Various parts of the C2PA Manifest utilize a `hashed_uri` structure for encapsulating a URI, its hash and (optionally) the algorithm used to compute the hash. If there is an `alg` field in the `hashed_uri` structure, it shall be used as the hashing algorithm. If the `alg` field is not present in the `hashed_uri` structure, the hash algorithm shall be determined by evaluating the nearest enclosing structure that contains an `alg` field. If no `alg` field is found in any of these locations, the value of the `alg` field in the claim shall be used as the hash algorithm. If no `alg` field is present in any of these locations, the claim shall be rejected with a failure code of `algorithm.unsupported`.

#### 15.4.2. For Hashed Ext URIs

Some parts of a C2PA Manifest utilize a `hashed_ext_uri` structure for encapsulating an external URI, its hash and the algorithm used to compute the hash. If there is an `alg` field in the `hashed_ext_uri` structure, it shall be used as the hashing algorithm. If the `alg` field is not present in the `hashed_ext_uri` structure, the failure code of `algorithm.unsupported` shall be used.

|     |     |
| --- | --- |
|  | The `alg` field is mandatory in `hashed_ext_uri`, so no recursive procedure to determine the hash algorithm is necessary. |

#### 15.4.3. Algorithm validation

Once the hashing algorithm is determined, it shall be compared to the values in the allowed list or the deprecated list in [Section 13.1, “Hashing”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing). If it is not present in either list, the claim shall be rejected with a failure code of `algorithm.unsupported`. If the algorithm is present in the deprecated list, the claim shall be issued an informational code of `algorithm.deprecated`.

### 15.5. Locating the Active Manifest

#### 15.5.1. General

The last C2PA Manifest superbox in the C2PA Manifest Store superbox shall be considered the active manifest, but locating the C2PA Manifest Store may involve looking in a number of possible locations.

#### 15.5.2. Embedded

##### 15.5.2.1. General

The C2PA Manifest Store shall be located by the validator embedded inside the asset at the [standard locations for embedding manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_embedding_manifests_into_various_file_formats). However, if an asset was retrieved via an HTTP connection, a validator may look for a `Link` header, as described in the [Link Header](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_by_link_header) clause below, to determine if a C2PA Manifest Store is present.

|     |     |
| --- | --- |
|  | Checking the `Link` header, if present, allows a validator to determine if a C2PA Manifest Store is present without having to download the entire asset. This is useful for assets that are large or that are streamed. |

If there are multiple C2PA Manifest Stores present in an asset, they shall all be considered as invalid and the validation should treat this as if no manifests were located. In the case where this asset is being added as an ingredient, none of these embedded C2PA Manifests shall be included in the ingredient assertion.

##### 15.5.2.2. Special Considerations for PDF

PDF files support a technology called "incremental update", where information is appended to the end of the document instead of modifying the original. This requires that PDF files support multiple C2PA Manifest Stores - though there shall only be one per update section.

If there are multiple C2PA Manifest Stores present in a single update section, they shall all be considered as invalid and the validation should treat this as if no manifests were located. However, any C2PA Manifest Stores present in early updates of the PDF or of the original PDF, shall still be considered valid and processed accordingly.

#### 15.5.3. By Reference or URI

##### 15.5.3.1. By Reference

If there is no embedded C2PA Manifest Store, the following attempts should be made to locate one at a remote location.

- If the asset was retrieved via an HTTP connection, the [Link Header](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_by_link_header) clause below describes how to find a manifest via the `Link` header.

- If the asset has any XMP in the standard asset locations (i.e., outside the C2PA Manifest) and that XMP contains a `dcterms:provenance` key, the provided URI should be used to locate the active manifest.

- If the asset is a font with a `C2PA` table and its `activeManifestUriLength` is non-zero, then the indicated URI should be used to locate the active manifest.

- If no C2PA Manifest Store has been located, the validator should look for files at the same path or URI, but with a filename extension of `.c2pa`. If the C2PA Manifest Store is not found, a validator may look in whatever additional places it deems most appropriate to locate it. For example, a child folder of a file system.


|     |     |
| --- | --- |
|  | A validator is not restricted to only the above locations, it can choose to look in additional locations as well. |

If a manifest was documented to exist in a remote location, but is not present there, or the location is not currently available (such as in an offline scenario), the `manifest.inaccessible` error code shall be used to report the situation.

Information about the IANA media type for a C2PA Manifest Store can be found in the [external manifests section](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_external_manifests).

##### 15.5.3.2. By `Link` header

If the asset was retrieved via an HTTP connection, the validator should look in the header of the HTTP response for a `Link` header, as defined in [RFC 8288](https://datatracker.ietf.org/doc/html/rfc8288), containing a parameter of `rel=c2pa-manifest`. If present, a C2PA Manifest Store can be retrieved from that URI reference. The URI will be a standard `http` or `https` URI, such as https://c2pa.org/image.c2pa.

It is also possible to use the link relation to refer to the C2PA Manifest Store that is embedded inside an asset through the use of a [JUMBF URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) fragment. The URI would include a [JUMBF URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) fragment, to the C2PA Manifest Store superbox https://c2pa.org/image.jpg#jumbf=c2pa. References to specific C2PA Manifests within the C2PA Manifest Store are not permitted and the validator shall ignore any `childlabel` portion of the [JUMBF URI](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_uri_references) fragment.

|     |     |
| --- | --- |
|  | HTTP refers to the _Hypertext Transfer Protocol_ defined in [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230), not the specific URL scheme `http://`. |

#### 15.5.4. Decompression

As described [previously](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_compressed_manifests), both standard and update manifests can be compressed. When a compressed manifest is encountered, a validator shall decompress it before proceeding with the standard validation process. If the data contained in the `brob` box of a compressed manifest is not either a standard or update manifest or if the decompression fails, the validator shall reject the manifest with a failure code of `manifest.compressed.invalid`.

#### 15.5.5. Validating a Match

A validator may wish to validate that the located C2PA Manifest Store is indeed the one associated with asset.

If the C2PA Manifest Store was located then the hard binding assertion present in its active manifest shall be used to validate that it is the matching manifest and whether the asset has been modified without manifest updates. If the hard binding does not match, it is unknown if that is because of (a) modification of the asset or (b) the wrong C2PA Manifest Store was located. Accordingly, the validator shall treat this as a non-matching hard binding and reject the manifest with a failure code of `assertion.dataHash.mismatch` if a data hash assertion is used, `assertion.boxesHash.mismatch` if a general boxes hash assertion is used, `assertion.collectionHash.mismatch` if a collection data hash assertion is used, or `assertion.bmffHash.mismatch` if a BMFF hash assertion is used.

### 15.6. Locating and Validating the Claim

#### 15.6.1. Locating

Once the manifest to be validated has been located (hereafter referred to as the "current manifest"), the claim is found by locating, within the current manifest, the JUMBF Superbox with a label of `c2pa.claim.v2` (or `c2pa.claim` for files with older claim structures) and a JUMBF type UUID of `0x6332636C-0011-0010-8000-00AA00389B71` (`c2cl`). Note that the JUMBF type UUID is the same for both the new (with `c2pa.claim.v2` label) and old (with `c2pa.claim` label) claim formats. There shall only be one such box in the current manifest. If more than one is located, the C2PA Manifest shall be rejected with a failure code of `claim.multiple`.

#### 15.6.2. Validating

If the content of the claim is not well-formed CBOR, the claim shall be rejected with a failure code of `claim.cbor.invalid`.

|     |     |
| --- | --- |
|  | Well-formed CBOR is defined in [RFC 8949, Appendix C](https://datatracker.ietf.org/doc/html/rfc8949#pseudocode). |

For a "c2pa.claim.v2", the following fields are expected to be present in the CBOR object. If any are absent, then the claim shall be rejected with a failure code of `claim.malformed`.

- `instanceID`

- `signature`

- `created_assertions`

- `claim_generator_info`


If the `claim_generator_info` field does not contain a `name` field, the claim shall be rejected with a failure code of `claim.malformed`.

If there is an `icon` field in the `generator-info-map` referenced by the `claim_generator_info` field of the `claim-map` or `claim-map-v2`, then its value shall be validated as described in [Section 15.10.3.3, “Validation of References”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validation_of_references).

### 15.7. Validate the Signature

Retrieve the URI reference for the signature from the value of the claim’s `signature` field and resolve the URI reference to obtain the COSE signature. The signature shall be embedded in the same manifest as described in [Section 11.1.4, “C2PA Box details”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_box_details). If the signature URI does not refer to a location within the same C2PA Manifest box (a `self#jumbf` location), the claim shall be rejected. If no such field is present or the URI cannot be resolved, then the claim shall be rejected with a failure code of `claimSignature.missing`.

If the signature and the claim are not contained in the same C2PA Manifest, that C2PA Manifest shall not be considered valid.

If the C2PA Manifest is a [time-stamp manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#time_stamp_manifests), the signature shall be validated as described in [Section 14.4.2, “Time Stamp Authorities”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_time_stamp_authorities). For all other types of C2PA Manifests, the validation of the credential used in the signature shall be performed according to [Chapter 14, _Trust Model_](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_trust_model).

If the credential is not acceptable per [the requirements of the credential’s type](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates), then the claim shall be rejected with a failure code of `signingCredential.invalid`. If the signature algorithm is not on the allowed or deprecated list in [Section 13.2, “Digital Signatures”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_signatures), then the claim shall be rejected with a failure code of `algorithm.unsupported`.

If a chain of trust cannot be built from the credential to an entry in [one of the trust anchor lists](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_signers), the claim shall be rejected with a failure code of `signingCredential.untrusted`, otherwise, the claim signature shall be assigned a success code of `signingCredential.trusted`.

If the claim has not yet been rejected, validation shall proceed according to the specified procedure in [Section 13.2, “Digital Signatures”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_signatures). If validation of the signature fails, then the claim shall be rejected with a failure code of `claimSignature.mismatch`. Otherwise, the claim signature shall be assigned a success code of `claimSignature.validated`.

For the remainder of this chapter, headers refer to the union of the set of protected and unprotected header parameters in the COSE signature. Unless otherwise specified in [Section 13.2, “Digital Signatures”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_digital_signatures) or [Section 14.5, “X.509 Certificates”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates), a header may appear in either bucket. COSE headers are described in [RFC 8152](https://datatracker.ietf.org/doc/html/rfc8152), section 3.

### 15.8. Validate the Time-Stamp

If either the `sigTst` or `sigTst2` header is present, then the `tstTokens` array is expected to contain a single `tstToken`. If the header contains more than one `tstToken`, the validator shall issue a `timestamp.malformed` informational code and ignore the time-stamps.

A validator that supports `sigTst` shall perform the following procedures to validate the time-stamp response:

- Retrieve the `val` property from the `tstToken`, which shall be an RFC3161-compliant `TimeStampResp` (time-stamp response).

- Check the value of the `status` field `PKIStatusInfo`, which is the value of the `status` field of `TimeStampResp`.



  - If it contains any value other than `0` (`granted`) or `1` (`grantedWithMods`), the validator shall issue a `timeStamp.malformed` informational code and ignore that time-stamp.

  - If it is either `0` (`granted`) or `1` (`grantedWithMods`), continue with the rest of the time-stamp validation process as described below.


- Retrieve the value of the `timeStampToken` field of the `TimeStampResp` for use in the remainder of the validation process.


A validator for `sigTst2` shall retrieve the `val` property from the `tstToken`, which shall be an RFC3161-compliant `timeStampToken` (TimeStampToken, TST).

All validators shall continue the process as follows:

- If the `timeStampToken` does not contain a `messageImprint` field, the validator shall issue a `timestamp.malformed` informational code and ignore the time-stamp.

- Validate that the value of the `messageImprint` field (in the `timeStampToken`), matches either the claim (v1, `sigTst`) or `COSE_Sign1_Tagged` structure’s `signature` field (v2, `sigTst2`) of the C2PA Manifest being validated, as described in [Section 10.3.2.5.2, “Choosing the Payload”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_choosing_the_payload). If the values do not match, the validator shall issue a `timestamp.mismatch` informational code and ignore the time-stamp.

- Validate that the TSA’s certificate exists, as described in [RFC 3161](http://datatracker.ietf.org/doc/html/rfc3161), section 2.4.1, and it is possible to build a trust chain from the certificate to an entry in C2PA TSA Trust List (or other list of trust anchors present in the validator for this purpose). If the certificate cannot be located or a trust chain cannot be constructed, the validator shall issue a `timestamp.untrusted` informational code and ignore the time-stamp.

- Validate that the attested time, as found in the `genTime` field (in the `timeStampToken`), falls within the validity period of the TSA’s signing certificate. If it does not, the validator shall issue a `timestamp.outsideValidity` informational code and ignore the time-stamp.

- If the time-stamp validation does not stop or fail due to any of the above conditions, then the validator shall issue the success codes of `timeStamp.trusted` and `timeStamp.validated`.

- If the validator issued both `timeStamp.trusted` and `timeStamp.validated` success codes, then the validator shall validate that the time attested by the Time Stamp Authority (TSA), as found in the `genTime` field (in the `timeStampToken`), falls within the validity period of the signing credential. If it does not, the validator shall reject the claim with a `claimSignature.outsideValidity` failure code.


|     |     |
| --- | --- |
|  | Time-stamps remain valid even after the signing credential of the time-stamp authority expires, so long as the attested time falls within the time-stamp authority’s certificate’s validity period. This is a special type of trust extended only to time-stamp authorities. |

At time of validation, when a time-stamp is present, trusted, and validated, validators shall use the attested time, and not the current time, when determining the time validity of the signing certificate and the time-stamp authority’s certificate.

|     |     |
| --- | --- |
|  | This document does not require that the revocation status of a Time Stamp Authority’s certificate be captured at signing time nor validated at validation time. |

If neither the `sigTst` nor the `sigTst2` headers are present, or if at least one of them is present but their time-stamp token does not satisfy the above requirements, then the C2PA Manifest is valid if the current time at validation is within the validity period of the signer’s credential. If it is, the validator shall return a success code of `claimSignature.insideValidity`. If it is not, the C2PA Manifest shall be rejected with a failure code of `claimSignature.outsideValidity`.

### 15.9. Validate the Credential Revocation Information

A validator will encounter one of the following three scenarios:

- The signer’s credential does not support revocation status, or the credential’s issuer did not provide a method to query its revocation status. In this case, the validator shall treat the credential as not revoked.

- The claim generator "stapled" an OCSP response for the signing credential in the `rVals` header of the `COSE_Sign1` structure. In such a case, the validator shall decode and validate the stapled OCSP response as described [below](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#ocsp_revocation).

- The claim generator did not "staple" an OCSP response for its signing credential or the C2PA Manifest does not have a time-stamp. In such a case, the validator should attempt to determine the revocation status of the signing credential by querying the OCSP responder as described [below](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#ocsp_revocation).


#### 15.9.1. Determining revocation through OCSP response in `rVals` header

A validator shall decode the OCSP response per the requirements of [RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960), in particular [RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960), section 3. If it is accepted and if all of the following requirements are met, then this establishes that the signer’s certificate was not revoked at the time of signing.

- The manifest has an attested time provided by a valid signed time-stamp.

- There exists a `SingleResponse` in the `responses` array of the `tbsResponseData` field of the OCSP response such that:



  - The attested time from the time-stamp:



    - is earlier than `thisUpdate`, or

    - falls within the `(thisUpdate,nextUpdate)` interval, if `nextUpdate` is present, or

    - falls within the `(thisUpdate,producedAt)` interval where `producedAt` is the field in the containing `ResponseData`, if `nextUpdate` is not present,


  - The `certStatus` field of the `SingleResponse` is `good`, or `revoked` but with a `revocationReason` of `removeFromCRL`,



    |     |     |
    | --- | --- |
    |  | The `removeFromCRL` is unique amongst the values of `revocationReason` because it is equivalent to a `good` response. Despite being a type of `revoked` response, this response indicates the certificate had temporarily been put "on hold" (the `certificateHold` reason) previously due to some concern about its integrity, but that the concern has been resolved and the issuer is stating the certificate remains trustworthy. |


- The signer of the response is an "authorized responder" as defined by [RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960), section 4.2.2.2.


Validators shall check the `revocationReason` of any `revoked` response to disambiguate the `removedFromCRL` case from an actual revocation.

If the above conditions are met, the certificate shall be considered not revoked at the time of signing, the validator shall issue a `signingCredential.ocsp.notRevoked` success code. Otherwise the claim shall be rejected with a `signingCredential.ocsp.revoked` failure code.

#### 15.9.2. Determining revocation for online OCSP response

If the `rVals` header is not present, or if the manifest does not have a time-stamp, the validator may choose to query the OCSP responder per the information in the AuthorityInfoAccess (AIA) extension ( [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280), section 4.2.2.1) of the [Section 14.5, “X.509 Certificates”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#x509_certificates).

|     |     |
| --- | --- |
|  | Querying the credential status method can reveal to an observer the identity of the asset being validated, and so this query is optional. |

If the validator chooses not to perform an online OCSP check, it shall issue a `signingCredential.ocsp.skipped` informational code.

If the validator attempts to query the OCSP responder but is unable to receive a response, the validator shall issue a `signingCredential.ocsp.inaccessible` informational code.

If a response is received and accepted per the requirements of [RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960), it shall establish the signer’s certificate was not revoked at the time of signing if either of the following requirements is fulfilled:

- The claim signature has a valid time-stamp, and the attested time falls within the `(thisUpdate,nextUpdate)` interval of the response, or

- The claim signature does not have a `sigTst` or `sigTst2` header but the current real-world time falls within the `(thisUpdate,nextUpdate)` interval of the response,


And both of the following requirements are fulfilled:

- The `certStatus` field of the response is `good`, or `revoked` but with a `revocationReason` of `removeFromCRL`, and

- The signer of the response is an "authorized responder" as defined by [RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960), section 4.2.2.2.


If the `certStatus` field of the response is `revoked` but with a `revocationReason` that is not `removeFromCRL`, it shall establish the signer’s certificate was not revoked at the time of signing if both of the following requirements are met:

- The manifest has a valid time-stamp, and the attested time falls within the `(thisUpdate,nextUpdate)` interval of the response, and

- The `revocationTime` in the response is after the attested time-stamp.


If the above conditions are met, the certificate shall be considered not revoked at the time of signing, the validator shall issue a `signingCredential.ocsp.notRevoked` success code.

Otherwise:
. If the `certStatus` field of the response is `unknown`, the claim shall be rejected with a `signingCredential.ocsp.unknown` failure code.
. Else, the certificate shall be considered revoked at the time of signing and the claim shall be rejected with a `signingCredential.ocsp.revoked` failure code.

### 15.10. Validate the Assertions

#### 15.10.1. Validate the correct assertions for the type of manifest

##### 15.10.1.1. General

Depending on the [type of manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_types_of_manifests), there are assertions that are either required or forbidden. A validator shall check for required and not-permitted assertions.

##### 15.10.1.2. Standard Manifest Assertions

If it is a [standard manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_standard_manifests):

1. Validate that there is exactly one [hard binding to content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_binding_to_content) assertion - either a `c2pa.hash.data`, a `c2pa.hash.boxes`, a `c2pa.hash.collection.data`, `c2pa.hash.bmff.v2` (deprecated), or a `c2pa.hash.bmff.v3`. If no such assertion is present, the manifest shall be rejected with a failure code of `claim.hardBindings.missing`. If there is more than one such assertion, the manifest shall be rejected with a failure code of `assertion.multipleHardBindings`.

2. Validate that there are zero or one `c2pa.ingredient` assertions whose `relationship` is `parentOf`. If there is more than one, the manifest shall be rejected with a failure code of `manifest.multipleParents`.


##### 15.10.1.3. Update Manifest Assertions

If it is an [update manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_update_manifests):

1. Validate that exactly one ingredient assertion is present and that its `relationship` is `parentOf`. If there is not (i.e., either it is missing, there are more than one, or the value of `relationship` is not `parentOf`), the manifest shall be rejected with a failure code of `manifest.update.wrongParents`.

2. Validate that there are no `c2pa.hash.data`, `c2pa.hash.boxes`, `c2pa.hash.collection.data`, `c2pa.hash.bmff.v2` (deprecated), `c2pa.hash.bmff.v3`, or [thumbnail](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#thumbnail_assertion) assertions. If there are, the manifest shall be rejected with a failure code of `manifest.update.invalid`.

3. If there is one or more `c2pa.actions` or `c2pa.actions.v2` assertions, validate that the `action` field of each action found in the `actions` array of any such assertion is one of the supported values specified in [Update Manifests](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_update_manifests). If it is not, the manifest shall be rejected with a failure code of `manifest.update.invalid`.


##### 15.10.1.4. Time-Stamp Manifest Assertions

If it is a [time-stamp manifest](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#time_stamp_manifests):

1. Validate that exactly one ingredient assertion is present and that its `relationship` is `parentOf`. If there is not (i.e., either it is missing, there are more than one, or the value of `relationship` is not `parentOf`), the manifest shall be rejected with a failure code of `manifest.timestamp.wrongParents`.

2. Validate that there are no assertions other than the ingredient assertion. If other assertions are present, the manifest shall be rejected with a failure code of `manifest.timestamp.invalid`.


#### 15.10.2. Preparing the list of redacted assertions

A validator, when processing a claim, shall gather the set of redacted assertions for each ingredient’s manifest (if present) based on each JUMBF URI listed in its `redacted_assertions` field. A claim’s `redacted_assertions` field shall never include a JUMBF URI to any of its own assertions.

|     |     |
| --- | --- |
|  | Assertions can be redacted from ingredient assets at any point in the final asset’s provenance history, and not necessarily by the claim generator that first uses an ingredient asset as an ingredient. |

For more details, please see the [Section 15.11.3.2, “Performing explicit validation”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_performing_explicit_validation) section.

#### 15.10.3. Assertion Validation

##### 15.10.3.1. General

Each assertion in the `created_assertions` and `gathered_assertions` fields of the claim is a `hashed_uri` structure. For each assertion, the validator shall first determine if the URI reference in the `url` field is in the [list of redacted assertions](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_preparing_the_list_of_redacted_assertions).

If it is in the list of redacted assertions, then if the assertion’s label is `c2pa.actions` or `c2pa.actions.v2`, the claim shall be rejected with a failure code of `assertion.action.redacted` as `c2pa.actions` and `c2pa.actions.v2` assertions shall not be redacted. If it is in the list of redacted assertions, then if the assertion’s label is a [hard binding to content](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_binding_to_content) assertion - either a `c2pa.hash.data`, `c2pa.hash.boxes`, `c2pa.hash.collection.data`, `c2pa.hash.bmff.v2` (deprecated), or `c2pa.hash.bmff.v3` \- the claim shall be rejected with a failure code of `assertion.dataHash.redacted` as these types of assertions shall not be redacted. Otherwise, the redacted assertion is considered valid, and validation continues [based on the type of assertion](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_specific_assertion_validation).

For all other assertions (not found in the list of redacted assertions), resolve the URI reference in the `url` field to obtain its data. If the URI does not refer to a location within the same C2PA Manifest (a `self#jumbf` location), the claim shall be rejected with a failure code of `assertion.outsideManifest`. If the URI cannot be resolved and the data retrieved, the claim shall be rejected with a failure code of `assertion.missing`.

Follow the procedure in [Section 15.4, “Determining the hashing algorithm”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_determining_the_hashing_algorithm) to determine the hash algorithm and any possible failure codes. Compute the hash of the assertion using that algorithm and the procedure described in [Section 8.4.2.3, “Hashing JUMBF Boxes”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_hashing_jumbf_boxes), and compare the computed hash value with the value in the `hash` field. If they do not match, the claim shall be rejected with a failure code of `assertion.hashedURI.mismatch`. Otherwise, a success code of `assertion.hashedURI.match` shall be recorded.

If the content of a standard assertion is not well-formed CBOR or is non-conforming JSON, the claim shall be rejected with a failure code of `assertion.cbor.invalid` or `assertion.json.invalid`.

|     |     |
| --- | --- |
|  | Well-formed CBOR is defined in [RFC 8949, Appendix C](https://datatracker.ietf.org/doc/html/rfc8949#pseudocode). |

|     |     |
| --- | --- |
|  | [RFC 7159, Section 2](https://datatracker.ietf.org/doc/html/rfc7159#section-2) defines the grammar that JSON data conforms to. |

If an assertion that is present in the assertion store is not referenced by either the `created_assertions` or `gathered_assertions` fields of the claim, the claim shall be rejected with a failure code of `assertion.undeclared`.

For each URI in the claim’s `redacted_assertions` array, if the URI points into the claim’s own manifest, the claim shall be rejected with a failure code of `assertion.selfRedacted`. A claim is not permitted to redact its own assertions.

##### 15.10.3.2. Specific Assertion Validation

For each assertion, the validator shall check the assertion’s label and if it is listed below, the validator shall perform the specific validation steps for that assertion type. If the assertion’s label is not listed below, then that type of assertion does not require any additional validation steps beyond those already described.

- `c2pa.cloud-data`, [Section 15.10.3.2.1, “`c2pa.cloud-data` validation”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_cloud_data_validation)

- `c2pa.actions` or `c2pa.actions.v2`, [Section 15.10.3.2.2, “`c2pa.actions` validation”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_actions_validation)

- `c2pa.ingredient` or `c2pa.ingredient.v2` or `c2pa.ingredient.v3`, [Section 15.11, “Validate the Ingredients”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validate_the_ingredients)

- `c2pa.metadata`, [Section 15.10.3.2.3, “`c2pa.metadata` validation”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_c2pa_metadata_validation)


If the value of any field of an assertion is of type `hashed_uri` or `hashed_ext_uri`, the validator shall perform the steps described in [Section 15.10.3.3, “Validation of References”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validation_of_references).

###### 15.10.3.2.1. `c2pa.cloud-data` validation

If the assertion’s label is `c2pa.cloud-data`:

1. Check that the assertion contains the following fields: `label`, `size`, `location` and `content_type`. If any of those fields are missing, the claim shall be rejected with a failure code of `assertion.cloud-data.malformed`.

2. If the `label` field of the external assertion is `c2pa.hash.data`, `c2pa.hash.boxes`, `c2pa.hash.collection.data`, `c2pa.hash.bmff.v2` (deprecated), `c2pa.hash.bmff.v3`, the claim shall be rejected with a failure code of `assertion.cloud-data.hardBinding`.

3. If the manifest is an update manifest and the `label` field of the external assertion is `c2pa.actions` or `c2pa.actions.v2`, the claim shall be rejected with a failure code of `assertion.cloud-data.actions`.

4. The `location` field shall be validated according to [Section 15.10.4.2, “Validation of External References”](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html#_validation_of_external_references).


###### 15.10.3.2.2. `c2pa.actions` validation

If the assertion’s label is `c2pa.actions` or `c2pa.actions.v2`:

1. Ensure that it has an `actions` field. If not, the claim shall be rejected with a failure code of `assertion.action.malformed`.

2. If this is the first actions assertion in the `created_assertions` array in the claim, check that the first element of the `actions` array in the actions assertion has a value of `c2pa.created` or `c2pa.opened`. If not, the claim shall be rejected with a failure code of `assertion.action.malformed`.



1. For all other actions assertions, check if the first element of the `actions` array in the actions assertion has a value of `c2pa.created` or `c2pa.opened`. If it is, the claim shall be rejected with a failure code of `assertion.action.malformed`.


3. For each action in the `actions` list:



1. Ensure that it has an `action` field. If not, the claim shall be rejected with a failure code of `assertion.action.malformed`.

2. If the `action` field is `c2pa.created` or `c2pa.opened` and it is not the first element of the `actions` array, then the claim shall be rejected with a failure code of `assertion.action.malformed`.

3. If the `action` field is `c2pa.opened`, `c2pa.placed`, `c2pa.removed`, `c2pa.repackaged`, or `c2pa.transcoded`:



      1. If the action has no `ingredients` field (or `ingredient` field for `c2pa.actions`) in the `parameters` object, or the field’s value is empty, the claim shall be rejected with a failure code of `assertion.action.ingredientMismatch`.

      2. If any element in the `ingredients` field (or `ingredient` field for `c2pa.actions`) in the `parameters` object has no JUMBF URI, or the JUMBF URI cannot be resolved to an ingredient assertion in the current manifest, the claim shall be rejected with a failure code of `assertion.action.ingredientMismatch`.



         1. For `c2pa.opened`, `c2pa.repackaged`, or `c2pa.transcoded`: Check that the value of the `relationship` field is `parentOf`. If it is not, the claim shall be rejected with a failure code of `assertion.action.ingredientMismatch`.

         2. For `c2pa.placed` or `c2pa.removed`: Check that the value of the `relationship` field is `componentOf`. If it is not, the claim shall be rejected with a failure code of `assertion.action.ingredientMismatch`.

         3. Check the `activeManifest` field in the ingredient assertion for the presence of a hashed URI. If the hashed URI is not present, or cannot be resolved to a manifest, the claim shall be rejected with a failure code of `assertion.action.ingredientMismatch`.


4. If the `action` field is `c2pa.redacted`:



      1. Check the `redacted` field that is a member of the `parameters` object for the presence of a JUMBF URI. If the JUMBF URI is not present, or cannot be resolved to an assertion, the claim shall be rejected with a failure code of `assertion.action.redaction
…[truncated]