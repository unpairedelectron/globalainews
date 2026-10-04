Source: https://www.w3.org/TR/vocab-dcat-3
Title: Data Catalog Vocabulary (DCAT) - Version 3
Fetched: 2026-10-04T10:07:03.259Z
Truncated: continue from startIndex 250000

[↑Jump to Table of Contents](https://www.w3.org/TR/vocab-dcat-3/#toc) [←Collapse Sidebar](https://www.w3.org/TR/vocab-dcat-3/#toc)

[![W3C](https://www.w3.org/StyleSheets/TR/2021/logos/W3C)](https://www.w3.org/)

# Data Catalog Vocabulary (DCAT) - Version 3

[W3C Recommendation](https://www.w3.org/standards/types#REC) 22 August 2024

More details about this documentThis version:[https://www.w3.org/TR/2024/REC-vocab-dcat-3-20240822/](https://www.w3.org/TR/2024/REC-vocab-dcat-3-20240822/)Latest published version:[https://www.w3.org/TR/vocab-dcat-3/](https://www.w3.org/TR/vocab-dcat-3/)Latest editor's draft:[https://w3c.github.io/dxwg/dcat/](https://w3c.github.io/dxwg/dcat/)History:[https://www.w3.org/standards/history/vocab-dcat-3/](https://www.w3.org/standards/history/vocab-dcat-3/)[Commit history](https://github.com/w3c/dxwg/commits/)Implementation report:[https://w3c.github.io/dxwg/dcat3-implementation-report/](https://w3c.github.io/dxwg/dcat3-implementation-report/)Previous Recommendation:[https://www.w3.org/TR/2020/REC-vocab-dcat-2-20200204/](https://www.w3.org/TR/2020/REC-vocab-dcat-2-20200204/)Editors:[Riccardo Albertoni](https://imati.cnr.it/mypage.php?idk=PG-62) ( [Invited Expert / CNR - Consiglio Nazionale delle Ricerche, Italy](https://www.cnr.it/))
David Browning (Invited Expert) (Previously at Refinitiv.com)
[Simon J D Cox](https://orcid.org/0000-0002-3884-3420) (Invited Expert) (Previously at CSIRO)
[Alejandra Gonzalez Beltran](https://www.scd.stfc.ac.uk/Pages/Alejandra-Gonzalez-Beltran.aspx) ( [Invited Expert / Scientific Computing Department, Science and Technology Facilities Council, UK](https://stfc.ukri.org/)) (Previously at the University of Oxford)
Andrea Perego (Invited Expert)
Peter Winstanley (Invited Expert)

Former editors:
Fadi Maali ( [DERI](https://en.wikipedia.org/wiki/Digital_Enterprise_Research_Institute))
John Erickson ( [Tetherless World Constellation (RPI)](http://tw.rpi.edu/))
Feedback:[GitHub w3c/dxwg](https://github.com/w3c/dxwg/)
( [pull requests](https://github.com/w3c/dxwg/pulls/),
[new issue](https://github.com/w3c/dxwg/issues/new/choose),
[open issues](https://github.com/w3c/dxwg/issues/))
[public-dxwg-comments@w3.org](mailto:public-dxwg-comments@w3.org?subject=%5Bvocab-dcat-3%5D%20YOUR%20TOPIC%20HERE) with subject line `[vocab-dcat-3] … message topic …` ( [archives](https://lists.w3.org/Archives/Public/public-dxwg-comments))Errata:[Errata exists](https://w3c.github.io/dxwg/errata/).Contributors[Makx Dekkers](https://github.com/makxdekkers)

See also
[**translations**](https://www.w3.org/Translations/?technology=vocab-dcat-3).


This document is also available in these non-normative formats:
[Turtle](https://www.w3.org/ns/dcat.ttl), [RDF/XML](https://www.w3.org/ns/dcat.rdf), and [JSON-LD](https://www.w3.org/ns/dcat.jsonld)

[Copyright](https://www.w3.org/policies/#copyright)
©
2024

[World Wide Web Consortium](https://www.w3.org/).
W3C® [liability](https://www.w3.org/policies/#Legal_Disclaimer),
[trademark](https://www.w3.org/policies/#W3C_Trademarks) and
[permissive document license](https://www.w3.org/copyright/software-license-2023/ "W3C Software and Document Notice and License") rules apply.


* * *

Note

## Abstract

DCAT is an RDF vocabulary designed to facilitate interoperability between data catalogs published on the Web.
This document defines the schema and provides examples for its use.

DCAT enables a publisher to describe datasets and data services in a catalog using a standard model and vocabulary that facilitates the consumption and aggregation of metadata from multiple catalogs.
This can increase the discoverability of datasets and data services.
It also makes it possible to have a decentralized approach to publishing data catalogs and makes federated search for datasets across catalogs in multiple sites possible using the same query mechanism and structure.
Aggregated DCAT metadata can serve as a manifest file as part of the digital preservation process.

The namespace for DCAT terms is `http://www.w3.org/ns/dcat#`

The suggested prefix for the DCAT namespace is `dcat`

## Status of This Document

_This section describes the status of this_
_document at the time of its publication. A list of current W3C_
_publications and the latest revision of this technical report can be found_
_in the [W3C technical reports index](https://www.w3.org/TR/) at_
_https://www.w3.org/TR/._

This document defines a major revision of the DCAT 2 vocabulary (\[[VOCAB-DCAT-2](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-2 "Data Catalog Vocabulary (DCAT) - Version 2")\]) in response to use cases, requirements and community experience which could not be considered during the previous vocabulary development. This revision extends the DCAT standard in line with community practice while supporting diverse approaches to data description and dataset exchange. The main changes to the DCAT vocabulary have been:


- addition of [`spdx:checksum`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_checksum) property and [`spdx:Checksum`](https://www.w3.org/TR/vocab-dcat-3/#Class:Checksum) class to provide digest for DCAT distributions
- addition of properties for supporting versioning, e.g., [`dcat:version`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version), [`dcat:previousVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version), [`dcat:hasCurrentVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version), see [11\. Versioning](https://www.w3.org/TR/vocab-dcat-3/#dataset-versions)
- addition of a [`dcat:DatasetSeries`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series) class and properties for representing Dataset Series, see [12\. Dataset series](https://www.w3.org/TR/vocab-dcat-3/#dataset-series)

This new version of the vocabulary updates and expands the original but preserves backward compatibility. A full list of the significant changes (with links to the relevant GitHub issues) is described in [D. Change history](https://www.w3.org/TR/vocab-dcat-3/#changes).


[Issues, requirements, and features](https://github.com/w3c/dxwg/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3Adcat+) that have been considered and discussed by the Data eXchange Working Group but have not been addressed due to lack of maturity or consensus are collected in GitHub. Those believed to be a priority for a future release are in the milestone [DCAT Future Priority Work](https://github.com/w3c/dxwg/milestone/31).


### DCAT history

[Permalink for this Section](https://www.w3.org/TR/vocab-dcat-3/#dcat_history)

The original DCAT vocabulary was developed and hosted at the [Digital Enterprise Research Institute (DERI)](https://web.archive.org/web/20141224031914/http://www.deri.ie/), then refined by the [eGov Interest Group](https://www.w3.org/egov/), and finally standardized in 2014 \[[VOCAB-DCAT-1](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-1 "Data Catalog Vocabulary (DCAT)")\] by the [Government Linked Data (GLD)](https://www.w3.org/2011/gld/) Working Group.

A second recommended revision of DCAT, DCAT 2 \[[VOCAB-DCAT-2](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-2 "Data Catalog Vocabulary (DCAT) - Version 2")\], was developed by the [Dataset Exchange Working Group](https://www.w3.org/2017/dxwg/) in response to a new set of Use Cases and Requirements \[[DCAT-UCR](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ucr "Dataset Exchange Use Cases and Requirements")\] gathered from peoples' experience with the DCAT vocabulary from the time of the original version, and new applications that were not considered in the first version.

This version of DCAT, DCAT 3, was developed by the [Dataset Exchange Working Group](https://www.w3.org/2017/dxwg/), considering some of the more pressing use cases and requests among those left unaddressed in the previous standardization round. A summary of the changes from \[[VOCAB-DCAT-2](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-2 "Data Catalog Vocabulary (DCAT) - Version 2")\] is provided in [D. Change history](https://www.w3.org/TR/vocab-dcat-3/#changes).

### External terms

[Permalink for this Section](https://www.w3.org/TR/vocab-dcat-3/#external_terms)

DCAT incorporates terms from pre-existing vocabularies where stable terms with appropriate meanings could be found, such as [`foaf:homepage`](http://xmlns.com/foaf/0.1/homepage) and [`dcterms:title`](http://purl.org/dc/terms/title).
Informal summary definitions of the externally-defined terms are included in the DCAT vocabulary for convenience, while authoritative definitions are available in the normative references.
Changes to definitions in the references, if any, supersede the summaries given in this specification.
Note that conformance to DCAT ( [4\. Conformance](https://www.w3.org/TR/vocab-dcat-3/#conformance)) concerns usage of only the terms in the DCAT vocabulary specification, so possible changes to other external definitions will not affect the conformance of DCAT implementations.

### Please send comments

[Permalink for this Section](https://www.w3.org/TR/vocab-dcat-3/#please_send_comments)

 The Working Group invited publishers to describe their catalogs and datasets with the revised version of DCAT described in this document and to report their implementations following [the instruction to reporting DCAT revised implementations](https://github.com/w3c/dxwg/wiki/DCAT-implementation-evidence). This information and subsequent analysis is published in the [implementation report.](https://w3c.github.io/dxwg/dcat3-implementation-report/)

This document was published by the [Dataset Exchange Working Group](https://www.w3.org/groups/wg/dx) as
a Recommendation using the
[Recommendation track](https://www.w3.org/policies/process/20231103/#recs-and-notes).


W3C recommends the wide deployment of this specification as a standard for
the Web.


A W3C Recommendation is a specification that, after extensive
consensus-building, is endorsed by
W3C and its Members, and
has commitments from Working Group members to
[royalty-free licensing](https://www.w3.org/policies/patent-policy/#sec-Requirements)
for implementations.




This document was produced by a group
operating under the
[W3C Patent\\
Policy](https://www.w3.org/policies/patent-policy/).


W3C maintains a
[public list of any patent disclosures](https://www.w3.org/groups/wg/dx/ipr)
made in connection with the deliverables of
the group; that page also includes
instructions for disclosing a patent. An individual who has actual
knowledge of a patent which the individual believes contains
[Essential Claim(s)](https://www.w3.org/policies/patent-policy/#def-essential)
must disclose the information in accordance with
[section 6 of the W3C Patent Policy](https://www.w3.org/policies/patent-policy/#sec-Disclosure).



This document is governed by the
[03 November 2023 W3C Process Document](https://www.w3.org/policies/process/20231103/).


## 1\. Introduction

[Permalink for Section 1.](https://www.w3.org/TR/vocab-dcat-3/#introduction)

_This section is non-normative._

Sharing data resources among different organizations, researchers, governments and citizens requires the provision of metadata.
This is irrespective of the data being open or not.
DCAT is a vocabulary for publishing data catalogs on the Web, which was originally developed in the context of government data catalogs
such as [data.gov](https://www.data.gov/) and [data.gov.uk](https://data.gov.uk/), but it is also applicable and has been used in other contexts.


DCAT 3 has extended the previous version to support further use cases and requirements \[[DCAT-UCR](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ucr "Dataset Exchange Use Cases and Requirements")\].
These include the possibility of cataloging other resources in addition to
datasets, such as dataset series. The revision also supports describing versioning of resources. Guidance on how to use inverse properties is provided.


DCAT provides RDF classes and properties to allow datasets and data services to be described and included in a catalog.
The use of a standard model and vocabulary facilitates the consumption and aggregation of metadata from multiple catalogs, which can:

1. increase the discoverability of datasets and data services

2. allow federated search for datasets across catalogs in multiple sites


Data described in a catalog can come in many formats, ranging from spreadsheets, through XML and RDF to various specialized formats.
DCAT does not make any assumptions about these serialization formats of the datasets but it does
distinguish between the abstract dataset and its different manifestations or distributions.


Data is often provided through a service which supports selection of an extract, sub-set, or combination of existing data, or of new data generated by some data processing function.
DCAT allows the description of a data access service to be included in a catalog.


Complementary vocabularies can be used together with DCAT to provide more detailed format-specific information.
For example, properties from the VoID vocabulary \[[VOID](https://www.w3.org/TR/vocab-dcat-3/#bib-void "Describing Linked Datasets with the VoID Vocabulary")\] can be used within DCAT to express various statistics about a dataset if that dataset is in RDF format.


This document does not prescribe any particular method of deploying data catalogs expressed in DCAT.
DCAT information can be presented in many forms including RDF accessible via SPARQL endpoints, embedded in HTML pages as \[[HTML-RDFa](https://www.w3.org/TR/vocab-dcat-3/#bib-html-rdfa "HTML+RDFa 1.1 - Second Edition")\], or serialized as RDF/XML \[[RDF-SYNTAX-GRAMMAR](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf-syntax-grammar "RDF 1.1 XML Syntax")\], \[[N3](https://www.w3.org/TR/vocab-dcat-3/#bib-n3 "Notation3 (N3): A readable RDF syntax")\], \[[Turtle](https://www.w3.org/TR/vocab-dcat-3/#bib-turtle "RDF 1.1 Turtle")\], \[[JSON-LD](https://www.w3.org/TR/vocab-dcat-3/#bib-json-ld "JSON-LD 1.0")\] or other formats.
Within this document the examples use \[[Turtle](https://www.w3.org/TR/vocab-dcat-3/#bib-turtle "RDF 1.1 Turtle")\] because of its readability.


## 2\. Motivation for change

[Permalink for Section 2.](https://www.w3.org/TR/vocab-dcat-3/#motivation)

_This section is non-normative._

The original Recommendation \[[VOCAB-DCAT-1](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-1 "Data Catalog Vocabulary (DCAT)")\] published in January 2014 provided the basic framework for describing datasets. It made an important distinction between a _dataset_ as an abstract idea and a _distribution_ as a manifestation of the dataset. Although DCAT has been widely adopted, it has become clear that the original specification lacked a number of essential features that were added either through the mechanism of a profile, such as the European Commission's DCAT-AP \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\], or the development of larger vocabularies that to a greater or lesser extent built upon the base standard, such as the Healthcare and Life Sciences Community Profile \[[HCLS-Dataset](https://www.w3.org/TR/vocab-dcat-3/#bib-hcls-dataset "Dataset Descriptions: HCLS Community Profile")\], the Data Tag Suite \[[DATS](https://www.w3.org/TR/vocab-dcat-3/#bib-dats "Data Tag Suite")\] and more. DCAT 2 \[[VOCAB-DCAT-2](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-2 "Data Catalog Vocabulary (DCAT) - Version 2")\] was developed to address the specific shortcomings that have come to light through the experiences of different communities, the aim being to improve interoperability between the outputs of these larger vocabularies.
For example, DCAT 2 provided classes, properties and guidance to address [identifiers](https://www.w3.org/TR/vocab-dcat-3/#dereferenceable-identifiers), [dataset quality information](https://www.w3.org/TR/vocab-dcat-3/#quality-information), and [data citation](https://www.w3.org/TR/vocab-dcat-3/#data-citation) issues.

This revision, DCAT 3, updates the specification throughout. Significant changes from the 2014 Recommendation and DCAT 2 are marked within the text using "Note" sections, as well as being described in [D. Change history](https://www.w3.org/TR/vocab-dcat-3/#changes).

## 3\. Namespaces

[Permalink for Section 3.](https://www.w3.org/TR/vocab-dcat-3/#namespaces)

The namespace for DCAT is `http://www.w3.org/ns/dcat#`.
DCAT also makes extensive use of terms from other vocabularies, in particular Dublin Core \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\].
DCAT defines a minimal set of classes and properties of its own.

### 3.1 Normative namespaces

[Permalink for Section 3.1](https://www.w3.org/TR/vocab-dcat-3/#normative-namespaces)

Namespaces and prefixes used in normative parts of this recommendation are shown in the following table.

| Prefix | Namespace IRI | Source |
| --- | --- | --- |
| `adms` | `http://www.w3.org/ns/adms#` | \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\] |
| `dc` | `http://purl.org/dc/elements/1.1/` | \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] |
| `dcat` | `http://www.w3.org/ns/dcat#` | \[[VOCAB-DCAT](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat "Data Catalog Vocabulary (DCAT)")\] |
| `dcterms` | `http://purl.org/dc/terms/` | \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] |
| `dctype` | `http://purl.org/dc/dcmitype/` | \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] |
| `foaf` | `http://xmlns.com/foaf/0.1/` | \[[FOAF](https://www.w3.org/TR/vocab-dcat-3/#bib-foaf "FOAF Vocabulary Specification 0.99 (Paddington Edition)")\] |
| `locn` | `http://www.w3.org/ns/locn#` | \[[LOCN](https://www.w3.org/TR/vocab-dcat-3/#bib-locn "ISA Programme Location Core Vocabulary")\] |
| `odrl` | `http://www.w3.org/ns/odrl/2/` | \[[ODRL-VOCAB](https://www.w3.org/TR/vocab-dcat-3/#bib-odrl-vocab "ODRL Vocabulary & Expression 2.2")\] |
| `owl` | `http://www.w3.org/2002/07/owl#` | \[[OWL2-SYNTAX](https://www.w3.org/TR/vocab-dcat-3/#bib-owl2-syntax "OWL 2 Web Ontology Language Structural Specification and Functional-Style Syntax (Second Edition)")\] |
| `prov` | `http://www.w3.org/ns/prov#` | \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] |
| `rdf` | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` | \[[RDF-SYNTAX-GRAMMAR](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf-syntax-grammar "RDF 1.1 XML Syntax")\] |
| `rdfs` | `http://www.w3.org/2000/01/rdf-schema#` | \[[RDF-SCHEMA](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf-schema "RDF Schema 1.1")\] |
| `skos` | `http://www.w3.org/2004/02/skos/core#` | \[[SKOS-REFERENCE](https://www.w3.org/TR/vocab-dcat-3/#bib-skos-reference "SKOS Simple Knowledge Organization System Reference")\] |
| `spdx` | `http://spdx.org/rdf/terms#` | \[[SPDX](https://www.w3.org/TR/vocab-dcat-3/#bib-spdx "SPDX 2.2")\] |
| `time` | `http://www.w3.org/2006/time#` | \[[OWL-TIME](https://www.w3.org/TR/vocab-dcat-3/#bib-owl-time "Time Ontology in OWL")\] |
| `vcard` | `http://www.w3.org/2006/vcard/ns#` | \[[VCARD-RDF](https://www.w3.org/TR/vocab-dcat-3/#bib-vcard-rdf "vCard Ontology - for describing People and Organizations")\] |
| `xsd` | `http://www.w3.org/2001/XMLSchema#` | \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] |

### 3.2 Non-normative namespaces

[Permalink for Section 3.2](https://www.w3.org/TR/vocab-dcat-3/#non-normative-namespaces)

_This section is non-normative._

Namespaces and prefixes used in examples and guidelines in the document and not from normative parts of the recommendation are shown in the following table.

| Prefix | Namespace IRI | Source |
| --- | --- | --- |
| `dqv` | `http://www.w3.org/ns/dqv#` | \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\] |
| `earl` | `http://www.w3.org/ns/earl#` | \[[EARL10-Schema](https://www.w3.org/TR/vocab-dcat-3/#bib-earl10-schema "Evaluation and Report Language (EARL) 1.0 Schema")\] |
| `geosparql` | `http://www.opengis.net/ont/geosparql#` | \[[GeoSPARQL](https://www.w3.org/TR/vocab-dcat-3/#bib-geosparql "OGC GeoSPARQL - A Geographic Query Language for RDF Data")\] |
| `oa` | `http://www.w3.org/ns/oa#` | \[[ANNOTATION-VOCAB](https://www.w3.org/TR/vocab-dcat-3/#bib-annotation-vocab "Web Annotation Vocabulary")\] |
| `pav` | `http://purl.org/pav/` | \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\] |
| `sdmx-attribute` | `http://purl.org/linked-data/sdmx/2009/attribute#` | \[[VOCAB-DATA-CUBE](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-data-cube "The RDF Data Cube Vocabulary")\] |
| `sdo` | `https://schema.org/` | \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] |
| `xhv` | `http://www.w3.org/1999/xhtml/vocab#` | \[[XHTML-VOCAB](https://www.w3.org/TR/vocab-dcat-3/#bib-xhtml-vocab "XHTML Vocabulary")\] |

## 4\. Conformance

[Permalink for Section 4.](https://www.w3.org/TR/vocab-dcat-3/#conformance)

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words _MAY_, _MUST_, _MUST NOT_, and _SHOULD_ in this document
are to be interpreted as described in
[BCP 14](https://datatracker.ietf.org/doc/html/bcp14)
\[[RFC2119](https://www.w3.org/TR/vocab-dcat-3/#bib-rfc2119 "Key words for use in RFCs to Indicate Requirement Levels")\] \[[RFC8174](https://www.w3.org/TR/vocab-dcat-3/#bib-rfc8174 "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words")\]
when, and only when, they appear in all capitals, as shown here.


A data catalog conforms to DCAT if:

- Access to data is organized into datasets, distributions, data services and dataset series.
- An RDF description of the catalog itself, the corresponding cataloged resources, and distributions is available (but the choice of
   RDF syntax, access protocol, and access policy are not mandated by this specification).
- The contents of all metadata fields that are held in the catalog and that contain data about the catalog itself, the corresponding cataloged resources, and distributions are included in this RDF description and are expressed using the appropriate classes and properties from DCAT, except where no such class or property exists.
- All classes and properties defined in DCAT are used in a way consistent with the semantics declared in this specification.

 DCAT-compliant catalogs _MAY_ include additional non-DCAT metadata fields and additional RDF data in the catalog's RDF description.



A **DCAT profile** is a specification for a data catalog that adds additional constraints to DCAT. A data catalog that conforms to the profile also conforms to DCAT. Additional constraints in a profile _MAY_ include:


- Cardinality constraints, including a minimum set of required metadata fields
- Sub-classes and sub-properties of the standard DCAT classes and properties
- Classes and properties for additional metadata fields not covered in DCAT vocabulary specification
- Controlled vocabularies or IRI sets as acceptable values for properties
- Requirements for specific access mechanisms (RDF syntaxes, protocols) to the catalog's RDF description

Note

## 5\. Vocabulary overview

[Permalink for Section 5.](https://www.w3.org/TR/vocab-dcat-3/#vocabulary-overview)

_This section is non-normative._

### 5.1 DCAT scope

[Permalink for Section 5.1](https://www.w3.org/TR/vocab-dcat-3/#dcat-scope)

DCAT is an RDF vocabulary for representing data catalogs.
DCAT is based around seven main classes ( [Figure 1](https://www.w3.org/TR/vocab-dcat-3/#fig-dcat-all-attributes "Overview of DCAT model, showing the classes of resources that can be members of a Catalog, and the relationships between them. Except where specifically indicated, DCAT does not provide cardinality constraints.")):

- [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) represents a catalog, which is a dataset in which each individual item is a metadata record describing some resource; the scope of `dcat:Catalog` is collections of metadata about **datasets**, **data services**, or other resource types.

- [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) represents a dataset, a data service or any other resource that may be described by a metadata record in a catalog.
   This class is not intended to be used directly, but is the parent class of [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset), [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) and [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog).
   Resources in a catalog should be instances of one of these classes, or of a sub-class of these, or of a sub-class of [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) defined in a DCAT profile or other DCAT application.
   [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) is actually an extension point for defining a catalog of any kind of resources. [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) and [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) can be used for datasets and services which are not documented in any catalog.

- [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) represents a collection of data, published or curated by a single agent or identifiable community. The notion of dataset in DCAT is broad and inclusive, with the intention of accommodating resource types arising from all communities. Data comes in many forms including numbers, text, pixels, imagery, sound and other multi-media, and potentially other types, any of which might be collected into a dataset.

- [`dcat:Distribution`](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) represents an accessible form of a dataset such as a downloadable file.

- [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) represents a collection of operations accessible through an interface (API) that provide access to one or more datasets or data processing functions.

- [`dcat:DatasetSeries`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series) is a dataset that represents a collection of datasets that are published separately, but share some characteristics that group them.

- [`dcat:CatalogRecord`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record) represents a metadata record in the catalog, primarily concerning the registration information, such as who added the record and when.


![UML model of DCAT classes and properties](https://www.w3.org/TR/vocab-dcat-3/images/dcat-all-attributes.svg)[Figure 1](https://www.w3.org/TR/vocab-dcat-3/#fig-dcat-all-attributes)
 Overview of DCAT model, showing the classes of resources that can be members of a Catalog, and the relationships between them. Except where specifically indicated, DCAT does not provide cardinality constraints.


Note

A **dataset** in DCAT is defined as a "collection of data, published or curated by a single agent, and available for access or download in one or more serializations or formats".
A dataset is a conceptual entity, and can be represented by one or more **distributions** that serialize the dataset for transfer.
Distributions of a dataset can be provided via **data services**.


A data service typically provides selection, extraction, combination, processing or transformation operations over datasets that might be hosted locally or remote to the service.
The result of any request to a data service is a representation of a part or all of a dataset or catalog.
A data service might be tied to specific datasets, or its source data might be configured at request- or run-time.
A data distribution service allows selection and download of a distribution of a dataset or subset.
A data discovery service allows a client to find a suitable dataset.
Other kinds of data service include data transformation services, such as coordinate transformation services, re-sampling and interpolation services, and various data processing services, including simulation and modeling services.
Note that a data service in DCAT is a collection of operations or **API** which provides access to data.
An interactive user-interface is often available to provide convenient access to API operations, but its description is outside the scope of DCAT.
The details of a particular data service endpoint will often be specified through a description conforming to a standard service type, which complement the scope of the DCAT vocabulary itself.


Descriptions of datasets and data services can be included in a **catalog**.
A catalog is a kind of dataset whose member items are descriptions of datasets and data services.
Other types of resources might also be cataloged, but the scope of DCAT is currently limited to datasets and data services.
To extend the scope of a catalog beyond datasets and data services it is recommended to define additional sub-classes of [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) in a DCAT profile or other DCAT application.
To extend the scope of service descriptions beyond data distribution services it is recommended to define additional sub-classes of [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) in a DCAT profile or other DCAT application.


Note

A **catalog record** describes an entry in the catalog. Notice that while [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) represents the dataset or service itself, [`dcat:CatalogRecord`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record) is the record that describes the registration of a resource in the catalog. The use of [`dcat:CatalogRecord`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record) is considered optional. It is used to capture provenance information about entries in a catalog explicitly. If this is not necessary then [`dcat:CatalogRecord`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record) can be safely ignored.

### 5.2 RDF considerations

[Permalink for Section 5.2](https://www.w3.org/TR/vocab-dcat-3/#dcat-rdf)

The DCAT vocabulary is an OWL2 ontology \[[OWL2-OVERVIEW](https://www.w3.org/TR/vocab-dcat-3/#bib-owl2-overview "OWL 2 Web Ontology Language Document Overview (Second Edition)")\] formalized using \[[RDF-SCHEMA](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf-schema "RDF Schema 1.1")\].
Each class and property in DCAT is denoted by an IRI \[[RFC3987](https://www.w3.org/TR/vocab-dcat-3/#bib-rfc3987 "Internationalized Resource Identifiers (IRIs)")\].
Locally defined elements are in the namespace [`http://www.w3.org/ns/dcat#`](https://www.w3.org/ns/dcat#).
Elements are also adopted from several external vocabularies, in particular \[[FOAF](https://www.w3.org/TR/vocab-dcat-3/#bib-foaf "FOAF Vocabulary Specification 0.99 (Paddington Edition)")\], \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] and \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\]


RDF allows resources to have global identifiers (IRIs) or to be blank nodes.
Blank nodes can be used to denote resources without explicitly naming them with an IRI.
They can appear in the subject and object position of a triple \[[RDF11-PRIMER](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf11-primer "RDF 1.1 Primer")\].
For example, in many actual DCAT catalogs, distributions are represented as blank nodes nested inside the related dataset description.
While blank nodes can offer flexibility for some use cases, in a Linked Data context, blank nodes limit our ability to collaboratively annotate data.
A blank node resource cannot be the target of a link and it can't be annotated with new information from new sources.
As one of the biggest benefits of the Linked Data approach is that "anyone can say anything anywhere", use of blank nodes undermines some of the advantages we can gain from wide adoption of the RDF model.
Even within the closed world of a single application dataset, use of blank nodes can quickly become limiting when integrating new data \[[LinkedDataPatterns](https://www.w3.org/TR/vocab-dcat-3/#bib-linkeddatapatterns "Linked Data Patterns: A pattern catalogue for modelling, publishing, and consuming Linked Data")\].
For these reasons, it is recommended that instances of the DCAT main classes have a global identifier, and use of blank nodes is generally discouraged when encoding DCAT in RDF.


All RDF examples in this document are written in Turtle syntax \[[Turtle](https://www.w3.org/TR/vocab-dcat-3/#bib-turtle "RDF 1.1 Turtle")\] and many are available from the [DXWG code repository](https://github.com/w3c/dxwg/tree/gh-pages/dcat/examples).


Note

### 5.3 Basic example

[Permalink for Section 5.3](https://www.w3.org/TR/vocab-dcat-3/#basic-example)

This example provides a quick overview of how DCAT might be used to represent a government catalog and its datasets. Titles, labels and keywords are provided both in English and Spanish to demonstrate the use of language tags.

First, the catalog description:


The publisher of the catalog has the relative IRI`ex:transparency-office`. Further description of the publisher can be provided as in [Example 2](https://www.w3.org/TR/vocab-dcat-3/#ex-publisher):


The catalog lists each of its datasets via the `dcat:dataset` property. In [Example 1](https://www.w3.org/TR/vocab-dcat-3/#ex-catalog), an example dataset was mentioned with the relative IRI`ex:dataset-001`. A possible description of it using DCAT is shown below:


Five distinct temporal descriptors are shown for this dataset.
The dataset publication and revision dates are shown in [`dcterms:issued`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date) and [`dcterms:modified`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date).
For the frequency of update of the dataset in [`dcterms:accrualPeriodicity`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency), we use an instance from the [content-oriented guidelines](https://www.w3.org/TR/vocab-data-cube/#dsd-cog) developed as part of the W3C Data Cube Vocabulary \[[VOCAB-DATA-CUBE](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-data-cube "The RDF Data Cube Vocabulary")\] efforts.
The temporal coverage or extent is given in [`dcterms:temporal`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal) defining a [`dcterms:PeriodOfTime`](https://www.w3.org/TR/vocab-dcat-3/#Class:Period_of_Time) as a closed interval indicated by [`dcat:startDate`](https://www.w3.org/TR/vocab-dcat-3/#Property:period_start_date) and [`dcat:endDate`](https://www.w3.org/TR/vocab-dcat-3/#Property:period_end_date).
The temporal resolution, which describes the minimum spacing of items within the dataset, is given in [`dcat:temporalResolution`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution) using the standard datatype `xsd:duration`.


Additionally, the spatial coverage or extent is given [`dcterms:spatial`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial) using an IRI from [Geonames](http://www.geonames.org/).
The spatial resolution, which describes the minimum spatial separation of items within the dataset, is given in [`dcat:spatialResolutionInMeters`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution) using the standard datatype `xsd:decimal`.


A contact point is provided where comments and feedback about the dataset can be sent.
Further details about the contact point, such as email address or telephone number, can be provided using vCard \[[VCARD-RDF](https://www.w3.org/TR/vocab-dcat-3/#bib-vcard-rdf "vCard Ontology - for describing People and Organizations")\].


One representation of the dataset `ex:dataset-001-csv` can be downloaded as a 5kB CSV file. This is
represented as an RDF resource of type `dcat:Distribution`.


### 5.4 Classifying datasets thematically

[Permalink for Section 5.4](https://www.w3.org/TR/vocab-dcat-3/#classifying-datasets)

The catalog classifies its datasets according to a set of domains represented by the relative IRI`ex:themes`. SKOS \[[SKOS-REFERENCE](https://www.w3.org/TR/vocab-dcat-3/#bib-skos-reference "SKOS Simple Knowledge Organization System Reference")\] can be used to describe the domains used:


Notice that this dataset is classified under the domain represented by the relative IRI`ex:accountability`.
It is recommended to define the concept as part of the concept scheme identified by the IRI`ex:themes` that was used to describe the catalog domains. An example SKOS description:


### 5.5 Classifying dataset types

[Permalink for Section 5.5](https://www.w3.org/TR/vocab-dcat-3/#classifying-dataset-types)

The type or genre of a dataset can be indicated using the [`dcterms:type`](http://purl.org/dc/terms/type) property.
It is recommended that the value of the property is taken from a well governed and broadly recognised set of resource types,
such as the [DCMI Type Vocabulary](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#section-7) \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\],
the [MARC Genre/Terms Scheme](https://id.loc.gov/vocabulary/marcgt.html),
the \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\] [`MD_Scope codes`](https://standards.iso.org/iso/19115/resources/Codelists/gml/MD_ScopeCode.xml),
the [DataCite resource types](https://schema.datacite.org/meta/kernel-4.4/include/datacite-resourceType-v4.xsd) \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\],
or the PARSE.Insight content-types from Re3data \[[RE3DATA-SCHEMA](https://www.w3.org/TR/vocab-dcat-3/#bib-re3data-schema "Metadata Schema for the Description of Research Data Repositories: version 3")\].


In the following examples, a (notional) dataset is classified separately using values from different vocabularies.


It is also possible for multiple classifications to be present in a single description.


### 5.6 Describing catalog records metadata

[Permalink for Section 5.6](https://www.w3.org/TR/vocab-dcat-3/#describing-catalog-records-metadata)

If the catalog publisher decides to keep metadata
describing its records (i.e., the records containing metadata
describing the datasets), `dcat:CatalogRecord` can be used. For example,
while `ex:dataset-001` was issued on 2011-12-05, its description on Imaginary Catalog was added on 2011-12-11. This can be represented by DCAT as in [Example 9](https://www.w3.org/TR/vocab-dcat-3/#ex-catalog-record):


### 5.7 Dataset available only behind some Web page

[Permalink for Section 5.7](https://www.w3.org/TR/vocab-dcat-3/#example-landing-page)

`ex:dataset-002` is available as a CSV file. However `ex:dataset-002` can only be obtained through some Web page
where the user needs to follow some links, provide some information and check some boxes
before accessing the data.

Notice the use of a `dcat:landingPage` and the definition of the `dcat:Distribution` instance.

### 5.8 A dataset available as a download and behind some Web page

[Permalink for Section 5.8](https://www.w3.org/TR/vocab-dcat-3/#a-dataset-available-as-download-and-behind-some-web-page)

On the other hand, `ex:dataset-003` can be obtained through some landing page but also can be downloaded from a known URL.


Notice that we used `dcat:downloadURL` with the downloadable distribution and that the other distribution accessible through the landing page
does not have to be defined as a separate `dcat:Distribution` instance.

### 5.9 A dataset available through a service

[Permalink for Section 5.9](https://www.w3.org/TR/vocab-dcat-3/#a-dataset-available-from-a-service)

`ex:dataset-004` is distributed in different representations from different services.
The `dcat:accessURL` for each `dcat:Distribution` corresponds with the `dcat:endpointURL` of the service.
Each service is characterized by its general type using `dcterms:type` (here using values from the INSPIRE spatial data service type vocabulary),
its specific API definition using `dcterms:conformsTo`,
with the detailed description of the individual endpoint parameters and options linked using `dcat:endpointDescription`.


## 6\. Vocabulary specification

[Permalink for Section 6.](https://www.w3.org/TR/vocab-dcat-3/#vocabulary-specification)

### 6.1 RDF representation

[Permalink for Section 6.1](https://www.w3.org/TR/vocab-dcat-3/#RDF-representation)

Editor's note

The (revised) DCAT vocabulary is [available in RDF](https://www.w3.org/ns/dcat#).
The primary artifact [`dcat.ttl`](https://www.w3.org/ns/dcat.ttl) is a serialization of the core DCAT vocabulary.
Alongside it are a set of other RDF files that provide additional information, including:

1. The files [dcat-external.ttl](https://www.w3.org/ns/dcat-external.ttl), [dcat-external.rdf](https://www.w3.org/ns/dcat-external.rdf), and [dcat-external.jsonld](https://www.w3.org/ns/dcat-external.jsonld) includes externally defined terms where DCAT has provided additional documentation or usage notes.

2. The files [dcat2.ttl](https://www.w3.org/ns/dcat2.ttl), [dcat2.rdf](https://www.w3.org/ns/dcat2.rdf), and [dcat2.jsonld](https://www.w3.org/ns/dcat2.jsonld) that correspond to version 2 of DCAT \[[VOCAB-DCAT-2](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-2 "Data Catalog Vocabulary (DCAT) - Version 2")\].

3. The files [dcat2014.ttl](https://www.w3.org/ns/dcat2014.ttl) and [dcat2014.rdf](https://www.w3.org/ns/dcat2014.rdf) that correspond to the 2014 version of DCAT \[[VOCAB-DCAT-1](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-1 "Data Catalog Vocabulary (DCAT)")\].


Note

### 6.2 Elements from other vocabularies

[Permalink for Section 6.2](https://www.w3.org/TR/vocab-dcat-3/#external-vocab)

DCAT requires use of elements from a number of other vocabularies.
Furthermore, DCAT may be augmented by additional elements from external vocabularies, following the usual RDFS \[[RDF-SCHEMA](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf-schema "RDF Schema 1.1")\] and OWL2 \[[OWL2-OVERVIEW](https://www.w3.org/TR/vocab-dcat-3/#bib-owl2-overview "OWL 2 Web Ontology Language Document Overview (Second Edition)")\] rules and patterns.


#### 6.2.1 Complementary vocabularies

[Permalink for Section 6.2.1](https://www.w3.org/TR/vocab-dcat-3/#complements)

Elements from a number of complementary vocabularies _MAY_ be used together with DCAT to provide more detailed information.
For example: properties from the VoID vocabulary \[[VOID](https://www.w3.org/TR/vocab-dcat-3/#bib-void "Describing Linked Datasets with the VoID Vocabulary")\] allow the description of various statistics about a DCAT-described dataset if that dataset is in RDF format; properties from the Provenance ontology \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] can be used to provide more information about the workflow that generated a dataset or service and related activities and agents; classes and properties from the Organization Ontology \[[VOCAB-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-org "The Organization Ontology")\] can be used to explain additional details of responsible agents.


#### 6.2.2 Element definitions

[Permalink for Section 6.2.2](https://www.w3.org/TR/vocab-dcat-3/#dependencies)

The definitions (including domain and range) of terms outside the DCAT namespace are provided here only for convenience and _MUST NOT_ be considered normative. The authoritative definitions of these terms are in the corresponding specifications, i.e., \[[DC11](https://www.w3.org/TR/vocab-dcat-3/#bib-dc11 "Dublin Core Metadata Element Set, Version 1.1")\], \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\], \[[FOAF](https://www.w3.org/TR/vocab-dcat-3/#bib-foaf "FOAF Vocabulary Specification 0.99 (Paddington Edition)")\], \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\], \[[RDF-SCHEMA](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf-schema "RDF Schema 1.1")\], \[[SKOS-REFERENCE](https://www.w3.org/TR/vocab-dcat-3/#bib-skos-reference "SKOS Simple Knowledge Organization System Reference")\], \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] and \[[VCARD-RDF](https://www.w3.org/TR/vocab-dcat-3/#bib-vcard-rdf "vCard Ontology - for describing People and Organizations")\].


### 6.3 Class: Catalog

[Permalink for Section 6.3](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog)

Note

The following properties are specific to this class:

- [catalog record](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_catalog_record)
- [resource](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_resource)
- [dataset](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_dataset)
- [service](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_service)
- [catalog](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_catalog)
- [homepage](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_homepage)
- [themes](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_themes)

The following properties of the super-class [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) are also available for use:

- [distribution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_distribution)
- [frequency](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency)
- [spatial/geographic coverage](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial)
- [spatial resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution)
- [temporal coverage](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal)
- [temporal resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution)
- [was generated by](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_was_generated_by)

The following properties of the super-class [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) are also available for use:

- [access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights)
- [conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to)
- [contact point](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_contact_point)
- [creator](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator)
- [description](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_description)
- [has policy](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_policy)
- [identifier](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier)
- [is referenced by](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_referenced_by)
- [keyword/tag](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_keyword)
- [landing page](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_landing_page)
- [license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license)
- [language](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_language)
- [relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_relation)
- [rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights)
- [qualified relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation)
- [publisher](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_publisher)
- [release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date)
- [theme/category](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme)
- [title](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_title)
- [type/genre](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_type)
- [update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date)
- [qualified attribution](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_attribution)
- [has current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version)
- [has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version)
- [previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version)
- [replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces)
- [status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status)
- [version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version)
- [version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes)
- [first](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first)
- [last](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last)
- [previous](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous)

| RDF Class: | [`dcat:Catalog`](https://www.w3.org/ns/dcat#Catalog) |
| Definition: | A curated collection of metadata about resources. |
| Sub-class of: | [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) |
| Usage note: | A Web-based data catalog is typically represented as a single instance of this class. |
| Usage note: | Datasets and data services are examples of resources in the context of a data catalog. |
| See also: | [6.5 Class: Catalog Record](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record), [6.6 Class: Dataset](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) |

#### 6.3.1 Property: homepage

[Permalink for Section 6.3.1](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_homepage)

| RDF Property: | [`foaf:homepage`](http://xmlns.com/foaf/0.1/homepage) |
| Definition: | A homepage of the catalog (a public Web document usually available in HTML). |
| Range: | [`foaf:Document`](http://xmlns.com/foaf/0.1/Document) |
| Usage note: | [`foaf:homepage`](http://xmlns.com/foaf/0.1/homepage) is an inverse functional property (IFP) which means that it _MUST_ be unique and precisely identify the Web-page for the resource. This property indicates the canonical Web-page, which might be helpful in cases where there is more than one Web-page about the resource. |

#### 6.3.2 Property: themes

[Permalink for Section 6.3.2](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_themes)

| RDF Property: | [`dcat:themeTaxonomy`](https://www.w3.org/ns/dcat#themeTaxonomy) |
| Definition: | A knowledge organization system (KOS) used to classify the resources documented in the catalog (e.g., datasets and services). |
| Domain: | [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) |
| Range: | [`rdfs:Resource`](https://www.w3.org/2000/01/rdf-schema#Resource) |
| Usage note: | It is recommended that the taxonomy is organized in a [`skos:ConceptScheme`](https://www.w3.org/2004/02/skos/core#ConceptScheme), [`skos:Collection`](https://www.w3.org/2004/02/skos/core#Collection), [`owl:Ontology`](https://www.w3.org/2002/07/owl#Ontology) or similar, which allows each member to be denoted by an IRI and published as Linked Data. |

#### 6.3.3 Property: resource

[Permalink for Section 6.3.3](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_resource)

Note

| RDF Property: | [`dcat:resource`](https://www.w3.org/ns/dcat#resource) |
| Definition: | A resource that is listed in the catalog. |
| Sub-property of: | [`dcterms:hasPart`](http://purl.org/dc/terms/hasPart) |
| Domain: | [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) |
| Range: | [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) |
| Usage note: | This is the most general predicate for membership of a catalog. Use of a more specific sub-property is recommended when available. |
| See also: | Sub-properties of `dcat:resource` in particular [`dcat:dataset`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_dataset), [`dcat:catalog`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_catalog), [`dcat:service`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_service). |

#### 6.3.4 Property: dataset

[Permalink for Section 6.3.4](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_dataset)

| RDF Property: | [`dcat:dataset`](https://www.w3.org/ns/dcat#dataset) |
| Definition: | A dataset that is listed in the catalog. |
| Sub-property of: | [`dcat:resource`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_resource) |
| Domain: | [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) |
| Range: | [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) |

#### 6.3.5 Property: service

[Permalink for Section 6.3.5](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_service)

Note

| RDF Property: | [`dcat:service`](https://www.w3.org/ns/dcat#service) |
| Definition: | A service that is listed in the catalog. |
| Sub-property of: | [`dcat:resource`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_resource) |
| Domain: | [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) |
| Range: | [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) |

#### 6.3.6 Property: catalog

[Permalink for Section 6.3.6](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_catalog)

Note

| RDF Property: | [`dcat:catalog`](https://www.w3.org/ns/dcat#catalog) |
| Definition: | A catalog that is listed in the catalog. |
| Sub-property of: | [`dcat:resource`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_resource) |
| Domain: | [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) |
| Range: | [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) |

#### 6.3.7 Property: catalog record

[Permalink for Section 6.3.7](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_catalog_record)

| RDF Property: | [`dcat:record`](https://www.w3.org/ns/dcat#record) |
| Definition: | A record describing the registration of a single resource (e.g., a dataset, a data service) that is part of the catalog. |
| Domain: | [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) |
| Range: | [`dcat:CatalogRecord`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record) |

### 6.4 Class: Cataloged Resource

[Permalink for Section 6.4](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource)

Note

The following properties are specific to this class:

- [access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights)
- [conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to)
- [contact point](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_contact_point)
- [creator](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator)
- [description](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_description)
- [has part](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_part)
- [has policy](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_policy)
- [identifier](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier)
- [is referenced by](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_referenced_by)
- [keyword/tag](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_keyword)
- [landing page](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_landing_page)
- [license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license)
- [language](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_language)
- [relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_relation)
- [rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights)
- [qualified relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation)
- [publisher](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_publisher)
- [release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date)
- [theme/category](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme)
- [title](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_title)
- [type/genre](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_type)
- [update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date)
- [qualified attribution](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_attribution)
- [has current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version)
- [has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version)
- [previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version)
- [replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces)
- [status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status)
- [version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version)
- [version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes)
- [first](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first)
- [last](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last)
- [previous](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous)

| RDF Class: | [`dcat:Resource`](https://www.w3.org/ns/dcat#Resource) |
| Definition: | Resource published or curated by a single agent. |
| Usage note: | The class of all cataloged resources, the super-class of<br>[`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset), [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service), [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog) and any other member of a [`dcat:Catalog`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog).<br>This class carries properties common to all cataloged resources, including datasets and data services.<br>The instances of this class _SHOULD_ be included in a catalog.<br>When describing a resource which is not a [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) or [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service), it is recommended to create a suitable sub-class of [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource), or use [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) with the [`dcterms:type`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_type) property to indicate the specific type. |
| Usage note: | [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) is an extension point that enables the definition of any kind of catalog. Additional sub-classes may be defined in a DCAT profile or other DCAT application for catalogs of other kinds of resources. |
| See also: | [6.5 Class: Catalog Record](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record) |

#### 6.4.1 Property: access rights

[Permalink for Section 6.4.1](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights)

Note

| RDF Property: | [`dcterms:accessRights`](http://purl.org/dc/terms/accessRights) |
| Definition: | Information about who can access the resource or an indication of its security status. |
| Range: | [`dcterms:RightsStatement`](http://purl.org/dc/terms/RightsStatement) |
| Usage note: | Information about licenses and rights _MAY_ be provided for the Resource. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.4.20 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights) |

#### 6.4.2 Property: conforms to

[Permalink for Section 6.4.2](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to)

Note

| RDF Property: | [`dcterms:conformsTo`](http://purl.org/dc/terms/conformsTo) |
| Definition: | An established standard to which the described resource conforms. |
| Range: | [`dcterms:Standard`](http://purl.org/dc/terms/Standard) ("A basis for comparison; a reference point against which other things can be evaluated." \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\]) |
| Usage note: | This property _SHOULD_ be used to indicate the model, schema, ontology, view or profile that the cataloged resource content conforms to. |

For guidance on the use of this property, see [14.2.1 Conformance to a standard](https://www.w3.org/TR/vocab-dcat-3/#quality-conformance-statement).

Note

#### 6.4.3 Property: contact point

[Permalink for Section 6.4.3](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_contact_point)

Note

| RDF Property: | [`dcat:contactPoint`](https://www.w3.org/ns/dcat#contactPoint) |
| Definition: | Relevant contact information for the cataloged resource. Use of vCard is recommended \[[VCARD-RDF](https://www.w3.org/TR/vocab-dcat-3/#bib-vcard-rdf "vCard Ontology - for describing People and Organizations")\]. |
| Range: | [`vcard:Kind`](https://www.w3.org/TR/vcard-rdf/#d4e1819) |

#### 6.4.4 Property: creator

[Permalink for Section 6.4.4](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator)

Note

| RDF Property: | [`dcterms:creator`](http://purl.org/dc/terms/creator) |
| Definition: | The entity responsible for producing the resource. |
| Range: | [`foaf:Agent`](http://xmlns.com/foaf/0.1/Agent) |
| Usage note: | Resources of type [`foaf:Agent`](http://xmlns.com/foaf/0.1/Agent)<br> are recommended as values for this property. |
| See also: | [6.12 Class: Organization/Person](https://www.w3.org/TR/vocab-dcat-3/#Class:Organization_Person) |

Note

#### 6.4.5 Property: description

[Permalink for Section 6.4.5](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_description)

| RDF Property: | [`dcterms:description`](http://purl.org/dc/terms/description) |
| Definition: | A free-text account of the resource. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |

#### 6.4.6 Property: title

[Permalink for Section 6.4.6](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_title)

| RDF Property: | [`dcterms:title`](http://purl.org/dc/terms/title) |
| Definition: | A name given to the resource. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |

#### 6.4.7 Property: release date

[Permalink for Section 6.4.7](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date)

| RDF Property: | [`dcterms:issued`](http://purl.org/dc/terms/issued) |
| Definition: | Date of formal issuance (e.g., publication) of the resource. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal)<br> encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] ( [`xsd:gYear`](https://www.w3.org/TR/xmlschema11-2/#gYear), [`xsd:gYearMonth`](https://www.w3.org/TR/xmlschema11-2/#gYearMonth), [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date), or [`xsd:dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)). |
| Usage note: | This property _SHOULD_ be set using the first known date of issuance. |
| See also: | [6.5.3 Property: listing date](https://www.w3.org/TR/vocab-dcat-3/#Property:record_listing_date) and [6.8.3 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_release_date) |

#### 6.4.8 Property: update/modification date

[Permalink for Section 6.4.8](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date)

| RDF Property: | [`dcterms:modified`](http://purl.org/dc/terms/modified) |
| Definition: | Most recent date on which the resource was changed, updated or modified. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal)<br> encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] ( [`xsd:gYear`](https://www.w3.org/TR/xmlschema11-2/#gYear), [`xsd:gYearMonth`](https://www.w3.org/TR/xmlschema11-2/#gYearMonth), [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date), or [`xsd:dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)). |
| Usage note: | The value of this property indicates a change to the actual resource, not a change to the catalog record. An absent value _MAY_ indicate that the resource has never changed after its initial publication, or that the date of last modification is not known, or that the resource is continuously updated. |
| See also: | [6.6.2 Property: frequency](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency), [6.5.4 Property: update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:record_update_date) and [6.8.4 Property: update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_update_date) |

#### 6.4.9 Property: language

[Permalink for Section 6.4.9](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_language)

| RDF Property: | [`dcterms:language`](http://purl.org/dc/terms/language) |
| Definition: | A language of the resource. This refers to the natural language used for textual metadata (i.e., titles, descriptions, etc.) of a cataloged resource (i.e., dataset or service) or the textual values of a dataset distribution |
| Range: | [`dcterms:LinguisticSystem`](http://purl.org/dc/terms/LinguisticSystem)<br>Resources defined by the Library of Congress ( [ISO 639-1](http://id.loc.gov/vocabulary/iso639-1.html), [ISO 639-2](http://id.loc.gov/vocabulary/iso639-2.html)) _SHOULD_ be used.<br>If a ISO 639-1 (two-letter) code is defined for language, then its corresponding IRI _SHOULD_ be used; if no ISO 639-1 code is defined, then IRI corresponding to the ISO 639-2 (three-letter) code _SHOULD_ be used. |
| Usage note: | Repeat this property if the resource is available in multiple languages. |
| Usage note: | The value(s) provided for members of a catalog (i.e., dataset or service) override the value(s) provided for the catalog if they conflict. |
| Usage note: | If representations of a dataset are available for each language separately, define an instance of `dcat:Distribution` for each language and describe the specific language of each distribution using `dcterms:language` (i.e., the dataset will have multiple `dcterms:language` values and each distribution will have just one as the value of its `dcterms:language` property). In case of multilingual distributions, the distributions will have multiple `dcterms:language` values. |

Note

#### 6.4.10 Property: publisher

[Permalink for Section 6.4.10](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_publisher)

Note

| RDF Property: | [`dcterms:publisher`](http://purl.org/dc/terms/publisher) |
| Definition: | The entity responsible for making the resource available. |
| Usage note: | Resources of type [`foaf:Agent`](http://xmlns.com/foaf/0.1/Agent)<br> are recommended as values for this property. |
| See also: | [6.12 Class: Organization/Person](https://www.w3.org/TR/vocab-dcat-3/#Class:Organization_Person) |

#### 6.4.11 Property: identifier

[Permalink for Section 6.4.11](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier)

| RDF Property: | [`dcterms:identifier`](http://purl.org/dc/terms/identifier) |
| Definition: | A unique identifier of the resource being described or cataloged. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |
| Usage note: | The identifier might be used as part of the IRI of the resource, but still having it represented explicitly is useful. |
| Usage note: | The identifier is a text string which is assigned to the resource to provide an unambiguous reference within a particular context. |

#### 6.4.12 Property: theme/category

[Permalink for Section 6.4.12](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme)

Note

| RDF Property: | [`dcat:theme`](https://www.w3.org/ns/dcat#theme) |
| Type: | [`owl:ObjectProperty`](https://www.w3.org/2002/07/owl#ObjectProperty) |
| Definition: | A main category of the resource. A resource can have multiple themes. |
| Sub-property of: | [`dcterms:subject`](http://purl.org/dc/terms/subject) |
| Usage note: | The set of themes used to categorize the resources are organized in a [`skos:ConceptScheme`](https://www.w3.org/2004/02/skos/core#ConceptScheme), [`skos:Collection`](https://www.w3.org/2009/08/skos-reference/skos.html#Collection), [`owl:Ontology`](https://www.w3.org/2002/07/owl#Ontology) or similar, describing all the categories and their relations in the catalog. |
| See also: | [6.3.2 Property: themes](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_themes) |

#### 6.4.13 Property: type/genre

[Permalink for Section 6.4.13](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_type)

Note

| RDF Property: | [`dcterms:type`](http://purl.org/dc/terms/type) |
| Definition: | The nature or genre of the resource. |
| Sub-property of: | [`dc:type`](http://purl.org/dc/elements/1.1/type) |
| Range: | [`rdfs:Class`](https://www.w3.org/2000/01/rdf-schema#Class) |
| Usage note: | The value _SHOULD_ be taken from a well governed and broadly recognised controlled vocabulary, such as:<br> <br>1. [DCMI Type vocabulary](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#section-7) \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\]<br>2. \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\] [scope codes](https://standards.iso.org/iso/19115/resources/Codelists/gml/MD_ScopeCode.xml)<br>3. [Datacite resource types](https://schema.datacite.org/meta/kernel-4.1/include/datacite-resourceType-v4.1.xsd) \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\]<br>4. PARSE.Insight content-types used by [re3data.org](https://www.re3data.org/) \[[RE3DATA-SCHEMA](https://www.w3.org/TR/vocab-dcat-3/#bib-re3data-schema "Metadata Schema for the Description of Research Data Repositories: version 3")\] (see item 15 contentType)<br>5. [MARC intellectual resource types](http://id.loc.gov/vocabulary/marcgt.html)<br> Some members of these controlled vocabularies are not strictly suitable for datasets or data services (e.g., DCMI Type _Event_, _PhysicalObject_; \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\] _CollectionHardware_, _CollectionSession_, _Initiative_, _Sample_, _Repository_), but might be used in the context of other kinds of catalogs defined in DCAT profiles or applications. |
| Usage note: | To describe the file format, physical medium, or dimensions of the resource, use the [`dcterms:format`](http://purl.org/dc/terms/format) element. |

#### 6.4.14 Property: relation

[Permalink for Section 6.4.14](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_relation)

Note

| RDF Property: | [`dcterms:relation`](http://purl.org/dc/terms/relation) |
| Definition: | A resource with an unspecified relationship to the cataloged resource. |
| Usage note: | [`dcterms:relation`](http://purl.org/dc/terms/relation) _SHOULD_ be used where the nature of the relationship between a cataloged resource and related resources is not known. A more specific sub-property _SHOULD_ be used if the nature of the relationship of the link is known.<br> The property [`dcat:distribution`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_distribution) _SHOULD_ be used to link from a [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) to a representation of the dataset, described as a [`dcat:Distribution`](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) |
| See also: | Sub-properties of `dcterms:relation` in particular<br> [`dcat:distribution`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_distribution),<br> [`dcterms:hasPart`](http://purl.org/dc/terms/hasPart),<br> (and its sub-properties<br> [`dcat:resource`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_resource),<br> [`dcat:catalog`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_catalog),<br> [`dcat:dataset`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_dataset),<br> [`dcat:service`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_service)<br> ),<br> [`dcterms:isPartOf`](http://purl.org/dc/terms/isPartOf),<br> [`dcterms:conformsTo`](http://purl.org/dc/terms/conformsTo),<br> [`dcterms:isFormatOf`](http://purl.org/dc/terms/isFormatOf),<br> [`dcterms:hasFormat`](http://purl.org/dc/terms/hasFormat),<br> [`dcterms:isVersionOf`](http://purl.org/dc/terms/isVersionOf),<br> [`dcterms:hasVersion`](http://purl.org/dc/terms/hasVersion) (and its sub-property <br> [`dcat:hasVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version)<br> ),<br> [`dcterms:replaces`](http://purl.org/dc/terms/replaces),<br> [`dcterms:isReplacedBy`](http://purl.org/dc/terms/isReplacedBy),<br> [`dcterms:references`](http://purl.org/dc/terms/references),<br> [`dcterms:isReferencedBy`](http://purl.org/dc/terms/isReferencedBy),<br> [`dcterms:requires`](http://purl.org/dc/terms/requires),<br> [`dcterms:isRequiredBy`](http://purl.org/dc/terms/isRequiredBy) |

Many existing and legacy catalogs do not distinguish between dataset components, representations, documentation, schemata and other resources that are lumped together as part of a dataset.
[`dcterms:relation`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/relation) is a super-property of a number of more specific properties which express more precise relationships, so use of `dcterms:relation` is not inconsistent with a subsequent reclassification with more specific semantics, though the more specialized sub-properties _SHOULD_ be used to link a dataset to component and supplementary resources if possible.


#### 6.4.15 Property: qualified relation

[Permalink for Section 6.4.15](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation)

Note

| RDF Property: | [`dcat:qualifiedRelation`](https://www.w3.org/ns/dcat#qualifiedRelation) |
| Definition: | Link to a description of a relationship with another resource |
| Sub-property of: | [`prov:qualifiedInfluence`](https://www.w3.org/TR/prov-o/#qualifiedInfluence) |
| Domain: | [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) |
| Range: | [`dcat:Relationship`](https://www.w3.org/TR/vocab-dcat-3/#Class:Relationship) |
| Usage note: | Used to link to another resource where the nature of the relationship is known but does not match one of the standard \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] properties<br> ( [`dcterms:hasPart`](http://purl.org/dc/terms/hasPart),<br> [`dcterms:isPartOf`](http://purl.org/dc/terms/isPartOf),<br> [`dcterms:conformsTo`](http://purl.org/dc/terms/conformsTo),<br> [`dcterms:isFormatOf`](http://purl.org/dc/terms/isFormatOf),<br> [`dcterms:hasFormat`](http://purl.org/dc/terms/hasFormat),<br> [`dcterms:isVersionOf`](http://purl.org/dc/terms/isVersionOf),<br> [`dcterms:hasVersion`](http://purl.org/dc/terms/hasVersion),<br> [`dcterms:replaces`](http://purl.org/dc/terms/replaces),<br> [`dcterms:isReplacedBy`](http://purl.org/dc/terms/isReplacedBy),<br> [`dcterms:references`](http://purl.org/dc/terms/references),<br> [`dcterms:isReferencedBy`](http://purl.org/dc/terms/isReferencedBy),<br> [`dcterms:requires`](http://purl.org/dc/terms/requires),<br> [`dcterms:isRequiredBy`](http://purl.org/dc/terms/isRequiredBy))<br> or \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] properties<br> ( [`prov:wasDerivedFrom`](https://www.w3.org/TR/prov-o/#wasDerivedFrom),<br> [`prov:wasInfluencedBy`](https://www.w3.org/TR/prov-o/#wasInfluencedBy),<br> [`prov:wasQuotedFrom`](https://www.w3.org/TR/prov-o/#wasQuotedFrom),<br> [`prov:wasRevisionOf`](https://www.w3.org/TR/prov-o/#wasRevisionOf),<br> [`prov:hadPrimarySource`](https://www.w3.org/TR/prov-o/#hadPrimarySource),<br> [`prov:alternateOf`](https://www.w3.org/TR/prov-o/#alternateOf),<br> [`prov:specializationOf`](https://www.w3.org/TR/prov-o/#specializationOf)). |

This DCAT property follows the common qualified relation pattern described in [15\. Qualified relations](https://www.w3.org/TR/vocab-dcat-3/#qualified-forms) .


Note

#### 6.4.16 Property: keyword/tag

[Permalink for Section 6.4.16](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_keyword)

Note

| RDF Property: | [`dcat:keyword`](https://www.w3.org/ns/dcat#keyword) |
| Definition: | A keyword or tag describing the resource. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |

#### 6.4.17 Property: landing page

[Permalink for Section 6.4.17](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_landing_page)

Note

| RDF Property: | [`dcat:landingPage`](https://www.w3.org/ns/dcat#landingPage) |
| Definition: | A Web page that can be navigated to in a Web browser to gain access to the catalog, a dataset, its distributions and/or additional information. |
| Sub-property of: | [`foaf:page`](http://xmlns.com/foaf/0.1/page) |
| Range: | [`foaf:Document`](http://xmlns.com/foaf/0.1/Document) |
| Usage note: | If the distribution(s) are accessible only through a landing page<br> (i.e., direct download URLs are not known), then the landing page link _SHOULD_ be duplicated as `dcat:accessURL` on a distribution. (see [5.7 Dataset available only behind some Web page](https://www.w3.org/TR/vocab-dcat-3/#example-landing-page)) |

#### 6.4.18 Property: qualified attribution

[Permalink for Section 6.4.18](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_attribution)

Note

| RDF Property: | [`prov:qualifiedAttribution`](https://www.w3.org/TR/prov-o/#qualifiedAttribution) |
| Definition: | Link to an Agent having some form of responsibility for the resource |
| Sub-property of: | [`prov:qualifiedInfluence`](https://www.w3.org/TR/prov-o/#qualifiedInfluence) |
| Domain: | [`prov:Entity`](https://www.w3.org/TR/prov-o/#Entity) |
| Range: | [`prov:Attribution`](https://www.w3.org/TR/prov-o/#Attribution) |
| Usage note: | Used to link to an Agent where the nature of the relationship is known but does not match one of the standard \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] properties ( [`dcterms:creator`](http://purl.org/dc/terms/creator), [`dcterms:publisher`](http://purl.org/dc/terms/creator)).<br> Use `dcat:hadRole` on the [`prov:Attribution`](https://www.w3.org/TR/prov-o/#Attribution) to capture the responsibility of the Agent with respect to the Resource.<br> See [15.1 Relationships between datasets and agents](https://www.w3.org/TR/vocab-dcat-3/#qualified-attribution) for usage examples. |

This DCAT property follows the common qualified relation pattern described in [15\. Qualified relations](https://www.w3.org/TR/vocab-dcat-3/#qualified-forms) .


Note

#### 6.4.19 Property: license

[Permalink for Section 6.4.19](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license)

| RDF Property: | [`dcterms:license`](http://purl.org/dc/terms/license) |
| Definition: | A legal document under which the resource is made available. |
| Range: | [`dcterms:LicenseDocument`](http://purl.org/dc/terms/LicenseDocument) |
| Usage note: | Information about licenses and rights _MAY_ be provided for the Resource. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.4.20 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights), [6.8.5 Property: license](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_license) |

#### 6.4.20 Property: rights

[Permalink for Section 6.4.20](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights)

| RDF Property: | [`dcterms:rights`](http://purl.org/dc/terms/rights) |
| Definition: | A statement that concerns all rights not addressed with [`dcterms:license`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license) or [`dcterms:accessRights`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights), such as copyright statements. |
| Range: | [`dcterms:RightsStatement`](http://purl.org/dc/terms/RightsStatement) |
| Usage note: | Information about licenses and rights _MAY_ be provided for the Resource. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.4.19 Property: license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license), [6.8.7 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_rights), [6.4.1 Property: access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights) |

#### 6.4.21 Property: has part

[Permalink for Section 6.4.21](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_part)

Note

| RDF Property: | [`dcterms:hasPart`](http://purl.org/dc/terms/hasPart) |
| Definition: | A related resource that is included either physically or logically in the described resource. |

#### 6.4.22 Property: has policy

[Permalink for Section 6.4.22](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_policy)

Note

| RDF Property: | [`odrl:hasPolicy`](https://www.w3.org/TR/odrl-vocab/#term-hasPolicy) |
| Definition: | An ODRL conformant policy expressing the rights associated with the resource. |
| Range: | [`odrl:Policy`](https://www.w3.org/TR/odrl-vocab/#term-Policy) |
| Usage note: | Information about rights expressed as an ODRL policy \[[ODRL-MODEL](https://www.w3.org/TR/vocab-dcat-3/#bib-odrl-model "ODRL Information Model 2.2")\] using the ODRL vocabulary \[[ODRL-VOCAB](https://www.w3.org/TR/vocab-dcat-3/#bib-odrl-vocab "ODRL Vocabulary & Expression 2.2")\] _MAY_ be provided for the resource. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.4.19 Property: license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license), [6.4.1 Property: access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights), [6.4.20 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights) |

#### 6.4.23 Property: is referenced by

[Permalink for Section 6.4.23](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_referenced_by)

Note

| RDF Property: | [`dcterms:isReferencedBy`](http://purl.org/dc/terms/isReferencedBy) |
| Definition: | A related resource, such as a publication, that references, cites, or otherwise points to the cataloged resource. |
| Usage note: | In relation to the use case of data citation, when the cataloged resource is a dataset, the `dcterms:isReferencedBy` property allows to relate the dataset to the resources (such as scholarly publications) that cite or point to the dataset. Multiple `dcterms:isReferencedBy` properties can be used to indicate the dataset has been referenced by multiple publications, or other resources. |
| Usage note: | This property is used to associate a resource with the resource (of type `dcat:Resource`) in question. For other relations to resources not covered with this property, the more generic property [`dcat:qualifiedRelation`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation) can be used. See also [15\. Qualified relations](https://www.w3.org/TR/vocab-dcat-3/#qualified-forms). |

For examples on the use of this property, see [C.3 Link datasets and publications](https://www.w3.org/TR/vocab-dcat-3/#examples-dataset-publication).

#### 6.4.24 Property: previous version

[Permalink for Section 6.4.24](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version)

Note

| RDF Property: | [`dcat:previousVersion`](https://www.w3.org/ns/dcat#previousVersion) |
| Definition: | The previous version of a resource in a lineage \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\]. |
| Equivalent property: | [`pav:previousVersion`](https://pav-ontology.github.io/pav/#d4e459) |
| Sub-property of: | [`prov:wasRevisionOf`](https://www.w3.org/TR/prov-o/#wasRevisionOf) |
| Usage note: | This property is meant to be used to specify a version chain, consisting of snapshots of a resource.<br>The notion of version used by this property is limited to versions resulting from revisions occurring to a resource as part of its life-cycle. One of the typical cases here is representing the history of the versions of a dataset that have been released over time. |
| See also: | [6.4.26 Property: current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version),<br>[6.4.25 Property: has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version),<br>[6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date),<br>[6.4.27 Property: replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces),<br>[6.4.30 Property: status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status),<br>[6.4.28 Property: version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version),<br>[6.4.29 Property: version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes). |

For guidance on the use of this property, see [11.1.1 Version chains and hierarchies](https://www.w3.org/TR/vocab-dcat-3/#version-history).

#### 6.4.25 Property: has version

[Permalink for Section 6.4.25](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version)

Note

| RDF Property: | [`dcat:hasVersion`](https://www.w3.org/ns/dcat#hasVersion) |
| Definition: | This resource has a more specific, versioned resource \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\]. |
| Equivalent property: | [`pav:hasVersion`](https://pav-ontology.github.io/pav/#d4e395) |
| Sub-property of: | [`dcterms:hasVersion`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/hasVersion) |
| Sub-property of: | [`prov:generalizationOf`](https://www.w3.org/TR/prov-o/#inverse-names-table) |
| Usage note: | This property is intended for relating a non-versioned or abstract resource to several versioned resources, e.g., snapshots \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\].<br>The notion of version used by this property is limited to versions resulting from revisions occurring to a resource as part of its life-cycle. Therefore, its semantics is more specific than its super-property [`dcterms:hasVersion`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/hasVersion), which makes use of a broader notion of version, including editions and adaptations. |
| See also: | [6.4.26 Property: current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version),<br>[6.4.24 Property: previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version),<br>[6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date),<br>[6.4.27 Property: replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces),<br>[6.4.30 Property: status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status),<br>[6.4.28 Property: version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version),<br>[6.4.29 Property: version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes). |

For guidance on the use of this property, see [11.1.1 Version chains and hierarchies](https://www.w3.org/TR/vocab-dcat-3/#version-history).

#### 6.4.26 Property: current version

[Permalink for Section 6.4.26](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version)

Note

| RDF Property: | [`dcat:hasCurrentVersion`](https://www.w3.org/ns/dcat#hasCurrentVersion) |
| Definition: | This resource has a more specific, versioned resource with equivalent content \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\]. |
| Equivalent property: | [`pav:hasCurrentVersion`](https://pav-ontology.github.io/pav/#d4e359) |
| Sub-property of: | [`pav:hasVersion`](https://pav-ontology.github.io/pav/#d4e395) |
| Usage note: | This property is intended for relating a non-versioned or abstract resource to a single snapshot that can be used as a permalink to indicate the current version of the content \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\].<br>The notion of version used by this property is limited to versions resulting from revisions occurring to a resource as part of its life-cycle. |
| See also: | [6.4.25 Property: has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version),<br>[6.4.24 Property: previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version),<br>[6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date),<br>[6.4.27 Property: replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces),<br>[6.4.30 Property: status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status),<br>[6.4.28 Property: version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version),<br>[6.4.29 Property: version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes). |

For guidance on the use of this property, see [11.1.1 Version chains and hierarchies](https://www.w3.org/TR/vocab-dcat-3/#version-history).

#### 6.4.27 Property: replaces

[Permalink for Section 6.4.27](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces)

Note

| RDF Property: | [`dcterms:replaces`](http://purl.org/dc/terms/replaces) |
| Definition: | A related resource that is supplanted, displaced, or superseded by the described resource \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\]. |
| Sub-property of: | [`dcterms:relation`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/relation) |
| See also: | [6.4.26 Property: current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version),<br>[6.4.25 Property: has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version),<br> [7\. Use of inverse properties](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties),<br>[6.4.24 Property: previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version),<br>[6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date),<br>[6.4.30 Property: status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status),<br>[6.4.28 Property: version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version),<br>[6.4.29 Property: version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes). |

For guidance on the use of this property, see [11.1.2 Versions replaced by other ones](https://www.w3.org/TR/vocab-dcat-3/#version-replace).

#### 6.4.28 Property: version

[Permalink for Section 6.4.28](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version)

Note

| RDF Property: | [`dcat:version`](https://www.w3.org/ns/dcat#version) |
| Definition: | The version indicator (name or identifier) of a resource. |
| Equivalent property: | [`pav:version`](https://pav-ontology.github.io/pav/#d4e869) |
| Range: | [`rdfs:Literal`](https://www.w3.org/TR/rdf-schema/#ch_literal) |
| Usage note: | DCAT does not prescribe how a version name / identifier should be specified, and refers for guidance to \[[DWBP](https://www.w3.org/TR/vocab-dcat-3/#bib-dwbp "Data on the Web Best Practices")\]'s [Best Practice 7: Provide a version indicator](https://www.w3.org/TR/dwbp/#VersioningInfo). |
| See also: | [6.4.26 Property: current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version),<br>[6.4.25 Property: has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version),<br>[6.4.24 Property: previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version),<br>[6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date),<br>[6.4.27 Property: replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces),<br>[6.4.30 Property: status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status),<br>[6.4.29 Property: version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes). |

For guidance on the use of this property, see [11.2 Version information](https://www.w3.org/TR/vocab-dcat-3/#version-info).

#### 6.4.29 Property: version notes

[Permalink for Section 6.4.29](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes)

Note

| RDF Property: | [`adms:versionNotes`](https://www.w3.org/TR/vocab-adms/#adms-versionnotes) |
| Definition: | A description of changes between this version and the previous version of the resource \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\]. |
| Range: | [`rdfs:Literal`](https://www.w3.org/TR/rdf-schema/#ch_literal) |
| Usage note: | In case of backward compatibility issues with the previous version of the resource, a textual description of them _SHOULD_ be specified by using this property. |
| See also: | [6.4.26 Property: current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version),<br>[6.4.25 Property: has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version),<br>[6.4.24 Property: previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version),<br>[6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date),<br>[6.4.27 Property: replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces),<br>[6.4.30 Property: status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status),<br>[6.4.28 Property: version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version). |

For guidance on the use of this property, see [11.2 Version information](https://www.w3.org/TR/vocab-dcat-3/#version-info).

#### 6.4.30 Property: status

[Permalink for Section 6.4.30](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status)

Note

| RDF Property: | [`adms:status`](https://www.w3.org/TR/vocab-adms/#adms-status) |
| Definition: | The status of the resource in the context of a particular workflow process \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\]. |
| Range: | [`skos:Concept`](https://www.w3.org/TR/skos-reference/#concepts) |
| Usage note: | DCAT does not prescribe the use of any specific set of life-cycle statuses, but refers to existing standards and community practices fit for the relevant application scenario. |
| See also: | [6.4.26 Property: current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version),<br>[6.4.25 Property: has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version),<br>[6.4.24 Property: previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version),<br>[6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date),<br>[6.4.27 Property: replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces),<br>[6.4.28 Property: version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version),<br>[6.4.29 Property: version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes). |

For guidance on the use of this property, see [11.3 Resource life-cycle](https://www.w3.org/TR/vocab-dcat-3/#life-cycle).

#### 6.4.31 Property: first

[Permalink for Section 6.4.31](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first)

Note

| RDF Property: | [`dcat:first`](https://www.w3.org/ns/dcat#first) |
| Definition: | The first resource in an ordered collection or series of resources, to which the current resource belongs. |
| Sub-property of: | [`xhv:first`](https://www.w3.org/1999/xhtml/vocab#first) |
| Usage note: | In DCAT this property is used for resources belonging to a [`dcat:DatasetSeries`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series). |
| See also: | [6.4.32 Property: last](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last),<br> [7\. Use of inverse properties](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties),<br>[6.4.33 Property: previous](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous). |

For guidance on the use of this property, see [12\. Dataset series](https://www.w3.org/TR/vocab-dcat-3/#dataset-series).

#### 6.4.32 Property: last

[Permalink for Section 6.4.32](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last)

Note

| RDF Property: | [`dcat:last`](https://www.w3.org/ns/dcat#last) |
| Definition: | The last resource in an ordered collection or series of resources, to which the current resource belongs. |
| Sub-property of: | [`xhv:last`](https://www.w3.org/1999/xhtml/vocab#last) |
| Usage note: | In DCAT this property is used for resources belonging to a [`dcat:DatasetSeries`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series). |
| See also: | [6.4.31 Property: first](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first),<br> [7\. Use of inverse properties](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties),<br>[6.4.33 Property: previous](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous). |

For guidance on the use of this property, see [12\. Dataset series](https://www.w3.org/TR/vocab-dcat-3/#dataset-series).

#### 6.4.33 Property: previous

[Permalink for Section 6.4.33](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous)

Note

| RDF Property: | [`dcat:prev`](https://www.w3.org/ns/dcat#prev) |
| Definition: | The previous resource (before the current one) in an ordered collection or series of resources. |
| Sub-property of: | [`xhv:prev`](https://www.w3.org/1999/xhtml/vocab#prev) |
| Usage note: | In DCAT this property is used for resources belonging to a [`dcat:DatasetSeries`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series).<br>It is important to note that this property is different from [`dcat:previousVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version), as it does not denote a previous version of the same resource, but a distinct resource immediately preceding the current one in an ordered collection of resources. |
| See also: | [6.4.31 Property: first](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first),<br>[6.4.32 Property: last](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last),<br> [7\. Use of inverse properties](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties). |

For guidance on the use of this property, see [12\. Dataset series](https://www.w3.org/TR/vocab-dcat-3/#dataset-series).

### 6.5 Class: Catalog Record

[Permalink for Section 6.5](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record)

The following properties are specific to this class (`dcat:CatalogRecord`):

- [conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:record_conforms_to)
- [description](https://www.w3.org/TR/vocab-dcat-3/#Property:record_description)
- [listing date](https://www.w3.org/TR/vocab-dcat-3/#Property:record_listing_date)
- [primary topic](https://www.w3.org/TR/vocab-dcat-3/#Property:record_primary_topic)
- [title](https://www.w3.org/TR/vocab-dcat-3/#Property:record_title)
- [update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:record_update_date)

| RDF Class: | [`dcat:CatalogRecord`](https://www.w3.org/ns/dcat#CatalogRecord) |
| Definition: | A record in a catalog, describing the registration of a single [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource). |
| Usage note | This class is optional and not all catalogs will use it. It exists for catalogs where a distinction is made between metadata about<br> a _dataset or service_ and metadata about the _entry in the catalog about the dataset or service_. For example, the _publication date_ property of the _dataset_ reflects<br> the date when the information was originally made available by the publishing agency, while the publication date of the _catalog record_ is the date when the dataset was added to the catalog.<br> In cases where both dates differ, or where only the latter is known, the _publication date_ _SHOULD_ only be specified for the catalog record.<br> Notice that the W3C PROV Ontology \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] allows describing further provenance information such as the details of the process and the agent involved in a particular change to a dataset or its registration. |
| See also | [6.6 Class: Dataset](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) |

If a catalog is represented as an RDF Dataset with named graphs (as defined in \[[SPARQL11-QUERY](https://www.w3.org/TR/vocab-dcat-3/#bib-sparql11-query "SPARQL 1.1 Query Language")\]),
then it is appropriate to place the description of each dataset
(consisting of all RDF triples that mention the `dcat:Dataset`, `dcat:CatalogRecord`, and any of its `dcat:Distribution`s)
into a separate named graph. The name of that graph _SHOULD_ be the IRI of the catalog record.


#### 6.5.1 Property: title

[Permalink for Section 6.5.1](https://www.w3.org/TR/vocab-dcat-3/#Property:record_title)

| RDF Property: | [`dcterms:title`](http://purl.org/dc/terms/title) |
| Definition: | A name given to the record. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |

#### 6.5.2 Property: description

[Permalink for Section 6.5.2](https://www.w3.org/TR/vocab-dcat-3/#Property:record_description)

| RDF Property: | [`dcterms:description`](http://purl.org/dc/terms/description) |
| Definition: | A free-text account of the record. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |

#### 6.5.3 Property: listing date

[Permalink for Section 6.5.3](https://www.w3.org/TR/vocab-dcat-3/#Property:record_listing_date)

| RDF Property: | [`dcterms:issued`](http://purl.org/dc/terms/issued) |
| Definition: | The date of listing (i.e., formal recording) of the corresponding dataset or service in the catalog. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal)<br> encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] ( [`xsd:gYear`](https://www.w3.org/TR/xmlschema11-2/#gYear), [`xsd:gYearMonth`](https://www.w3.org/TR/xmlschema11-2/#gYearMonth), [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date), or [`xsd:dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)). |
| Usage note: | This indicates the date of listing the dataset in the catalog and not the publication date of the dataset itself. |
| See also: | [6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date) |

#### 6.5.4 Property: update/modification date

[Permalink for Section 6.5.4](https://www.w3.org/TR/vocab-dcat-3/#Property:record_update_date)

| RDF Property: | [`dcterms:modified`](http://purl.org/dc/terms/modified) |
| Definition: | Most recent date on which the catalog entry was changed, updated or modified. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal)<br> encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] ( [`xsd:gYear`](https://www.w3.org/TR/xmlschema11-2/#gYear), [`xsd:gYearMonth`](https://www.w3.org/TR/xmlschema11-2/#gYearMonth), [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date), or [`xsd:dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)). |
| Usage note: | This indicates the date of last change of a catalog entry, i.e., the catalog metadata description of the dataset, and not the date of the dataset itself. |
| See also: | [6.4.8 Property: update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date) |

#### 6.5.5 Property: primary topic

[Permalink for Section 6.5.5](https://www.w3.org/TR/vocab-dcat-3/#Property:record_primary_topic)

| RDF Property: | [`foaf:primaryTopic`](http://xmlns.com/foaf/0.1/primaryTopic) |
| Definition: | The [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) (dataset or service) described in the record. |
| Usage note: | [`foaf:primaryTopic`](http://xmlns.com/foaf/0.1/primaryTopic) property is functional:<br> each catalog record can have at most one primary topic, i.e., describes one cataloged resource. |

#### 6.5.6 Property: conforms to

[Permalink for Section 6.5.6](https://www.w3.org/TR/vocab-dcat-3/#Property:record_conforms_to)

Note

| RDF Property: | [`dcterms:conformsTo`](http://purl.org/dc/terms/conformsTo) |
| Definition: | An established standard to which the described resource conforms. |
| Range: | [`dcterms:Standard`](http://purl.org/dc/terms/Standard) (A basis for comparison; a reference point against which other things can be evaluated.) |
| Usage note: | This property _SHOULD_ be used to indicate the model, schema, ontology, view or profile that the catalog record metadata conforms to. |

For guidance on the use of this property, see [14.2.1 Conformance to a standard](https://www.w3.org/TR/vocab-dcat-3/#quality-conformance-statement).

Note

### 6.6 Class: Dataset

[Permalink for Section 6.6](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset)

Note

The following properties are specific to this class:

- [distribution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_distribution)
- [frequency](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency)
- [in series](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_in_series)
- [spatial/geographic coverage](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial)
- [spatial resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution)
- [temporal coverage](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal)
- [temporal resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution)
- [was generated by](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_was_generated_by)

The following properties of the super-class [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) are also available for use:

- [access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights)
- [conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to)
- [contact point](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_contact_point)
- [creator](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator)
- [description](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_description)
- [has policy](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_policy)
- [identifier](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier)
- [is referenced by](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_referenced_by)
- [keyword/tag](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_keyword)
- [landing page](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_landing_page)
- [license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license)
- [language](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_language)
- [relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_relation)
- [rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights)
- [qualified relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation)
- [publisher](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_publisher)
- [release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date)
- [theme/category](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme)
- [title](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_title)
- [type/genre](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_type)
- [update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date)
- [qualified attribution](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_attribution)
- [has current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version)
- [has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version)
- [previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version)
- [replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces)
- [status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status)
- [version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version)
- [version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes)
- [first](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first)
- [last](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last)
- [previous](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous)

Information about licenses and rights _SHOULD_ be provided on the level of Distribution. Information about licenses and rights _MAY_ be provided for a Dataset in addition to but not instead of the information provided for the Distributions of that Dataset. Providing license or rights information for a Dataset that is different from information provided for a Distribution of that Dataset _SHOULD_ be avoided as this can create legal conflicts.


| RDF Class: | [`dcat:Dataset`](https://www.w3.org/ns/dcat#Dataset) |
| Definition: | A collection of data, published or curated by a single agent, and available for access or download in one or more representations. |
| Sub-class of: | [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) |
| Usage note: | This class describes the conceptual dataset. One or more representations might be available, with differing schematic layouts and formats or serializations. |
| Usage note: | This class describes the actual dataset as published by the dataset provider. In cases where a distinction between the actual dataset and its entry in the catalog is necessary (because metadata such as modification date might differ), the [`dcat:CatalogRecord`](https://www.w3.org/TR/vocab-dcat-3/#Class:Catalog_Record) class can be used for the latter. |
| Usage note: | The notion of dataset in DCAT is broad and inclusive, with the intention of accommodating resource types arising from all communities. Data comes in many forms including numbers, text, pixels, imagery, sound and other multi-media, and potentially other types, any of which might be collected into a dataset. |

#### 6.6.1 Property: distribution

[Permalink for Section 6.6.1](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_distribution)

| RDF Property: | [`dcat:distribution`](https://www.w3.org/ns/dcat#distribution) |
| Definition: | An available distribution of the dataset. |
| Sub-property of: | [`dcterms:relation`](http://purl.org/dc/terms/relation) |
| Domain: | [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) |
| Range: | [`dcat:Distribution`](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) |

#### 6.6.2 Property: frequency

[Permalink for Section 6.6.2](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency)

| RDF Property: | [`dcterms:accrualPeriodicity`](http://purl.org/dc/terms/accrualPeriodicity) |
| Definition: | The frequency at which a dataset is published. |
| Range: | [`dcterms:Frequency`](http://purl.org/dc/terms/Frequency) (A rate at which something recurs) |
| Usage note: | The value of `dcterms:accrualPeriodicity` gives the rate at which the dataset-as-a-whole is updated.<br> This may be complemented by [`dcat:temporalResolution`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution) to give the time between collected data points in a time series. |

Examples showing how `dcterms:accrualPeriodicity` and [`dcat:temporalResolution`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution) may be combined are given in [10.1 Temporal properties](https://www.w3.org/TR/vocab-dcat-3/#temporal-properties).


#### 6.6.3 Property: in series

[Permalink for Section 6.6.3](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_in_series)

Note

| RDF Property: | [`dcat:inSeries`](https://www.w3.org/ns/dcat#inSeries) |
| Definition: | A dataset series of which the dataset is part. |
| Range: | [`dcat:DatasetSeries`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series) |
| Sub-property of: | [`dcterms:isPartOf`](http://purl.org/dc/terms/isPartOf) |
| See also: | [7\. Use of inverse properties](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties) |

For guidance on the use of this property, see [12\. Dataset series](https://www.w3.org/TR/vocab-dcat-3/#dataset-series).

#### 6.6.4 Property: spatial/geographical coverage

[Permalink for Section 6.6.4](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial)

| RDF Property: | [`dcterms:spatial`](http://purl.org/dc/terms/spatial) |
| Definition: | The geographical area covered by the dataset. |
| Range: | [`dcterms:Location`](http://purl.org/dc/terms/Location) (A spatial region or named place) |
| Usage note: | The spatial coverage of a dataset may be encoded as an instance of [`dcterms:Location`](http://purl.org/dc/terms/Location), or may be indicated using an IRI reference (link) to a resource describing a location. It is recommended that links are to entries in a well maintained gazetteer such as [Geonames](http://www.geonames.org/). |

Options for expressing the details of a `dcterms:Location` are provided in [6.16 Class: Location](https://www.w3.org/TR/vocab-dcat-3/#Class:Location).


#### 6.6.5 Property: spatial resolution

[Permalink for Section 6.6.5](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution)

Note

| RDF Property: | [`dcat:spatialResolutionInMeters`](https://www.w3.org/ns/dcat#spatialResolutionInMeters) |
| Definition: | Minimum spatial separation resolvable in a dataset, measured in meters. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) typed as [`xsd:decimal`](https://www.w3.org/TR/xmlschema11-2/#decimal) |
| Usage note: | If the dataset is an image or grid this should correspond to the spacing of items. For other kinds of spatial datasets, this property will usually indicate the smallest distance between items in the dataset. |

The range of this property is a number representing a length in meters.
This is intended to provide a summary indication of the spatial resolution of the data as a single number.
More complex descriptions of various aspects of spatial precision, accuracy, resolution and other statistics can be provided using the Data Quality Vocabulary \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\].

Note

As for the use of datatype, note that \[[JSON-LD](https://www.w3.org/TR/vocab-dcat-3/#bib-json-ld "JSON-LD 1.0")\] converts numbers to [`xsd:double`](https://www.w3.org/TR/xmlschema11-2/#double) or [`xsd:integer`](https://www.w3.org/TR/xmlschema11-2/#integer), and properly generating [`xsd:decimal`](https://www.w3.org/TR/xmlschema11-2/#decimal) requires the use of strings with an explicit or coerced datatype. In \[[Turtle](https://www.w3.org/TR/vocab-dcat-3/#bib-turtle "RDF 1.1 Turtle")\], seemingly minor modifications can change the datatype of a value: `100.0` is an [`xsd:decimal`](https://www.w3.org/TR/xmlschema11-2/#decimal), while `1e2` is an [`xsd:double`](https://www.w3.org/TR/xmlschema11-2/#double).

Note also that number constants without a decimal part (e.g. `42`) will, in \[[Turtle](https://www.w3.org/TR/vocab-dcat-3/#bib-turtle "RDF 1.1 Turtle")\] or \[[JSON-LD](https://www.w3.org/TR/vocab-dcat-3/#bib-json-ld "JSON-LD 1.0")\], produce a literal with datatype [`xsd:integer`](https://www.w3.org/TR/xmlschema11-2/#integer). Since \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] defines [`xsd:integer`](https://www.w3.org/TR/xmlschema11-2/#integer) as a derived type of [`xsd:decimal`](https://www.w3.org/TR/xmlschema11-2/#decimal), such literals are semantically valid as values of [`dcat:spatialResolutionInMeters`](https://www.w3.org/ns/dcat#spatialResolutionInMeters). However, syntactic validation tools such as \[[SHACL](https://www.w3.org/TR/vocab-dcat-3/#bib-shacl "Shapes Constraint Language (SHACL)")\] or \[[ShEx](https://www.w3.org/TR/vocab-dcat-3/#bib-shex "Shape Expressions Language 2.1")\] consider them as distinct datatypes. Authors of validation schemas in these languages should therefore consider adding [`xsd:integer`](https://www.w3.org/TR/xmlschema11-2/#integer) to the accepted datatypes for [`dcat:spatialResolutionInMeters`](https://www.w3.org/ns/dcat#spatialResolutionInMeters).

#### 6.6.6 Property: temporal coverage

[Permalink for Section 6.6.6](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal)

| RDF Property: | [`dcterms:temporal`](http://purl.org/dc/terms/temporal) |
| Definition: | The temporal period that the dataset covers. |
| Range: | [`dcterms:PeriodOfTime`](http://purl.org/dc/terms/PeriodOfTime) (An interval of time that is named or defined by its start and end dates) |
| Usage note: | The temporal coverage of a dataset may be encoded as an instance of [`dcterms:PeriodOfTime`](http://purl.org/dc/terms/PeriodOfTime), or may be indicated using an IRI reference (link) to a resource describing a time period or interval. |

Options for expressing the details of a `dcterms:PeriodOfTime` are provided in [6.15 Class: Period of Time](https://www.w3.org/TR/vocab-dcat-3/#Class:Period_of_Time).


#### 6.6.7 Property: temporal resolution

[Permalink for Section 6.6.7](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution)

Note

| RDF Property: | [`dcat:temporalResolution`](https://www.w3.org/ns/dcat#temporalResolution) |
| Definition: | Minimum time period resolvable in the dataset. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) typed as [`xsd:duration`](https://www.w3.org/TR/xmlschema11-2/#duration) |
| Usage note: | If the dataset is a time-series this should correspond to the spacing of items in the series. For other kinds of dataset, this property will usually indicate the smallest time difference between items in the dataset. |

This is intended to provide a summary indication of the temporal resolution of the data distribution as a single value.
More complex descriptions of various aspects of temporal precision, accuracy, resolution and other statistics can be provided using the Data Quality Vocabulary \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\].

The distinction between `dcat:temporalResolution` and [`dcterms:accrualPeriodicity`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency) is illustrated by examples in [10.1 Temporal properties](https://www.w3.org/TR/vocab-dcat-3/#temporal-properties).


#### 6.6.8 Property: was generated by

[Permalink for Section 6.6.8](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_was_generated_by)

Note

| RDF Property: | [`prov:wasGeneratedBy`](https://www.w3.org/TR/prov-o/#wasGeneratedBy) |
| Definition: | An activity that generated, or provides the business context for, the creation of the dataset. |
| Domain: | [`prov:Entity`](https://www.w3.org/TR/prov-o/#Entity) |
| Range: | [`prov:Activity`](https://www.w3.org/TR/prov-o/#Activity) An activity is something that occurs over a period of time and acts upon or with entities; it may include consuming, processing, transforming, modifying, relocating, using, or generating entities. |
| Usage note: | The activity associated with generation of a dataset will typically be an initiative, project, mission, survey, on-going activity ("business as usual") etc. Multiple `prov:wasGeneratedBy` properties can be used to indicate the dataset production context at various levels of granularity. |
| Usage note: | Use [`prov:qualifiedGeneration`](https://www.w3.org/TR/prov-o/#qualifiedGeneration) to attach additional details about the relationship between the dataset and the activity, e.g., the exact time that the dataset was produced during the lifetime of a project |

Note

Details about how to describe the activity that generated a dataset, such as a project, initiative, on-going activity, mission or survey, are out of scope for this document.
[`prov:Activity`](https://www.w3.org/TR/prov-o/#Activity) provides for some basic properties such as begin and end time, associated agents etc.
Further details may be provided through classes defined in applications.
A number of ontologies for describing projects are available, for example
VIVO for academic research projects \[[VIVO-ISF](https://www.w3.org/TR/vocab-dcat-3/#bib-vivo-isf "VIVO-ISF Data Standard")\],
DOAP (Description of a Project) for software projects \[[DOAP](https://www.w3.org/TR/vocab-dcat-3/#bib-doap "Description of a Project")\], and
DBPedia for general projects \[[DBPEDIA-ONT](https://www.w3.org/TR/vocab-dcat-3/#bib-dbpedia-ont "DBPedia ontology")\] which are expected to be suitable for different applications.


### 6.7 Class: Dataset Series

[Permalink for Section 6.7](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series)

Note

The following properties of the super-classes [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) and [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) are also available for use:

- [access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights)
- [conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to)
- [contact point](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_contact_point)
- [creator](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator)
- [distribution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_distribution)
- [description](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_description)
- [has part](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_part)
- [has policy](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_policy)
- [identifier](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier)
- [in series](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_in_series)
- [is referenced by](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_referenced_by)
- [keyword/tag](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_keyword)
- [landing page](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_landing_page)
- [license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license)
- [language](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_language)
- [relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_relation)
- [rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights)
- [qualified relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation)
- [publisher](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_publisher)
- [release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date)
- [theme/category](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme)
- [title](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_title)
- [type/genre](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_type)
- [update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date)
- [qualified attribution](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_attribution)
- [frequency](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency)
- [spatial/geographic coverage](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial)
- [spatial resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution)
- [temporal coverage](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal)
- [temporal resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution)
- [was generated by](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_was_generated_by)
- [has current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version)
- [has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version)
- [previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version)
- [replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces)
- [status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status)
- [version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version)
- [version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes)
- [first](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first)
- [last](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last)
- [previous](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous)

Note

| RDF Class: | [`dcat:DatasetSeries`](https://www.w3.org/ns/dcat#DatasetSeries) |
| Definition: | A collection of datasets that are published separately, but share some characteristics that group them. |
| Sub-class of: | [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) |
| Usage note: | Dataset series can be also soft-typed via property `dcterms:type` as in the approach used in \[[GeoDCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap "GeoDCAT-AP: A geospatial extension for the DCAT application profile for data portals in Europe")\], and adopted in \[[DCAT-AP-IT](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap-it "Profilo metadatazione DCAT-AP_IT")\] and \[[GeoDCAT-AP-IT](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap-it "GeoDCAT-AP in Italy, the national guidelines published")\]). |
| Usage note: | Common scenarios for dataset series include: time series composed of periodically released subsets; map-series composed of items of the same type or theme but with differing spatial footprints. |

For guidance on the use of this property, see [12\. Dataset series](https://www.w3.org/TR/vocab-dcat-3/#dataset-series).

### 6.8 Class: Distribution

[Permalink for Section 6.8](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution)

The following properties are specific to this class:

- [access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_rights)
- [access URL](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_url)
- [access service](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_service)
- [byte size](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_size)
- [compression format](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_compression_format)
- [conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_conforms_to)
- [description](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_description)
- [download URL](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url)
- [format](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_format)
- [has policy](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_has_policy)
- [license](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_license)
- [media type](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_media_type)
- [packaging format](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_packaging_format)
- [release date](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_release_date)
- [rights](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_rights)
- [spatial resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_spatial_resolution)
- [temporal resolution](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_temporal_resolution)
- [title](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_title)
- [update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_update_date)

| RDF Class: | [`dcat:Distribution`](https://www.w3.org/ns/dcat#Distribution) |
| Definition: | A specific representation of a dataset. A dataset might be available in multiple serializations that may differ in various ways, including natural language, media-type or format, schematic organization, temporal and spatial resolution, level of detail or profiles (which might specify any or all of the above). |
| Usage note: | This represents a general availability of a dataset. It implies no information<br> about the actual access method of the data, i.e., whether by direct download, API, or through a Web page.<br> The use of [`dcat:downloadURL`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url) property indicates directly downloadable distributions. |
| See also: | [6.9 Class: Data Service](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) |

Note

Links between a `dcat:Distribution` and services or Web addresses where it can be accessed are expressed using [`dcat:accessURL`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_url), [`dcat:accessService`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_service), [`dcat:downloadURL`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url), as shown in [Figure 1](https://www.w3.org/TR/vocab-dcat-3/#fig-dcat-all-attributes "Overview of DCAT model, showing the classes of resources that can be members of a Catalog, and the relationships between them. Except where specifically indicated, DCAT does not provide cardinality constraints.") and described in the definitions below.


#### 6.8.1 Property: title

[Permalink for Section 6.8.1](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_title)

| RDF Property: | [`dcterms:title`](http://purl.org/dc/terms/title) |
| Definition: | A name given to the distribution. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |

#### 6.8.2 Property: description

[Permalink for Section 6.8.2](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_description)

| RDF Property: | [`dcterms:description`](http://purl.org/dc/terms/description) |
| Definition: | A free-text account of the distribution. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) |

#### 6.8.3 Property: release date

[Permalink for Section 6.8.3](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_release_date)

| RDF Property: | [`dcterms:issued`](http://purl.org/dc/terms/issued) |
| Definition: | Date of formal issuance (e.g., publication) of the distribution. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal)<br> encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] ( [`xsd:gYear`](https://www.w3.org/TR/xmlschema11-2/#gYear), [`xsd:gYearMonth`](https://www.w3.org/TR/xmlschema11-2/#gYearMonth), [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date), or [`xsd:dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)). |
| Usage note: | This property _SHOULD_ be set using the first known date of issuance. |
| See also: | [6.4.7 Property: release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date) |

#### 6.8.4 Property: update/modification date

[Permalink for Section 6.8.4](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_update_date)

| RDF Property: | [`dcterms:modified`](http://purl.org/dc/terms/modified) |
| Definition: | Most recent date on which the distribution was changed, updated or modified. |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal)<br> encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] ( [`xsd:gYear`](https://www.w3.org/TR/xmlschema11-2/#gYear), [`xsd:gYearMonth`](https://www.w3.org/TR/xmlschema11-2/#gYearMonth), [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date), or [`xsd:dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)). |
| See also: | [6.4.8 Property: update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date) |

#### 6.8.5 Property: license

[Permalink for Section 6.8.5](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_license)

| RDF Property: | [`dcterms:license`](http://purl.org/dc/terms/license) |
| Definition: | A legal document under which the distribution is made available. |
| Range: | [`dcterms:LicenseDocument`](http://purl.org/dc/terms/LicenseDocument) |
| Usage note: | Information about licenses and rights _SHOULD_ be provided on the level of Distribution. Information about licenses and rights _MAY_ be provided for a Dataset in addition to but not instead of the information provided for the Distributions of that Dataset. Providing license or rights information for a Dataset that is different from information provided for a Distribution of that Dataset _SHOULD_ be avoided as this can create legal conflicts. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.8.7 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_rights) [6.4.19 Property: license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license) |

#### 6.8.6 Property: access rights

[Permalink for Section 6.8.6](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_rights)

| RDF Property: | [`dcterms:accessRights`](http://purl.org/dc/terms/accessRights) |
| Definition: | A rights statement that concerns how the distribution is accessed. |
| Range: | [`dcterms:RightsStatement`](http://purl.org/dc/terms/RightsStatement) |
| Usage note: | Information about licenses and rights _MAY_ be provided for the Distribution. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.8.5 Property: license](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_license), [6.8.7 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_rights), [6.4.1 Property: access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights) |

#### 6.8.7 Property: rights

[Permalink for Section 6.8.7](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_rights)

| RDF Property: | [`dcterms:rights`](http://purl.org/dc/terms/rights) |
| Definition: | Information about rights held in and over the distribution. |
| Range: | [`dcterms:RightsStatement`](http://purl.org/dc/terms/RightsStatement) |
| Usage note: | `dcterms:license`, which is a sub-property of `dcterms:rights`, can be used to link a distribution to a license document. However, `dcterms:rights` allows linking to a rights statement that can include licensing information as well as other information that supplements the license such as attribution.<br>Information about licenses and rights _SHOULD_ be provided on the level of Distribution. Information about licenses and rights _MAY_ be provided for a Dataset in addition to but not instead of the information provided for the Distributions of that Dataset. Providing license or rights information for a Dataset that is different from information provided for a Distribution of that Dataset _SHOULD_ be avoided as this can create legal conflicts. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.8.5 Property: license](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_license),<br> [6.4.20 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights) |

#### 6.8.8 Property: has policy

[Permalink for Section 6.8.8](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_has_policy)

Note

| RDF Property: | [`odrl:hasPolicy`](https://www.w3.org/TR/odrl-vocab/#term-hasPolicy) |
| Definition: | An ODRL conformant policy expressing the rights associated with the distribution. |
| Range: | [`odrl:Policy`](https://www.w3.org/TR/odrl-vocab/#term-Policy) |
| Usage note: | Information about rights expressed as an ODRL policy \[[ODRL-MODEL](https://www.w3.org/TR/vocab-dcat-3/#bib-odrl-model "ODRL Information Model 2.2")\] using the ODRL vocabulary \[[ODRL-VOCAB](https://www.w3.org/TR/vocab-dcat-3/#bib-odrl-vocab "ODRL Vocabulary & Expression 2.2")\] _MAY_ be provided for the distribution. See also guidance at [9\. License and rights statements](https://www.w3.org/TR/vocab-dcat-3/#license-rights). |
| See also: | [6.4.19 Property: license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license), [6.8.6 Property: access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_rights), [6.8.7 Property: rights](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_rights) |

#### 6.8.9 Property: access URL

[Permalink for Section 6.8.9](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_url)

| RDF Property: | [`dcat:accessURL`](https://www.w3.org/ns/dcat#accessURL) |
| Definition: | A URL of the resource that gives access to a distribution of the dataset. E.g., landing page, feed, SPARQL endpoint. |
| Domain: | [`dcat:Distribution`](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) |
| Range: | [`rdfs:Resource`](https://www.w3.org/2000/01/rdf-schema#Resource) |
| Usage note: | [`dcat:accessURL`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_url) _SHOULD_ be used for the URL of a service or location that can provide access to this distribution, typically through a Web form, query or API call.<br>[`dcat:downloadURL`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url) is preferred for direct links to downloadable resources.<br>If the distribution(s) are accessible only through a landing page (i.e., direct download URLs are not known), then the landing page URL associated with the `dcat:Dataset` _SHOULD_ be duplicated as access URL on a distribution (see [5.7 Dataset available only behind some Web page](https://www.w3.org/TR/vocab-dcat-3/#example-landing-page)). |
| See also | [6.8.11 Property: download URL](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url), [6.8.10 Property: access service](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_service) |

`dcat:accessURL` matches the property-chain `dcat:accessService`/`dcat:endpointURL`. In the RDF representation of DCAT this is axiomatized as an OWL property-chain axiom.


#### 6.8.10 Property: access service

[Permalink for Section 6.8.10](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_service)

Note

| RDF Property: | [`dcat:accessService`](https://www.w3.org/ns/dcat#accessService) |
| Definition: | A data service that gives access to the distribution of the dataset |
| Range: | [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) |
| Usage note: | [`dcat:accessService`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_service) _SHOULD_ be used to link to a description of a [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) that can provide access to this distribution. |
| See also | [6.8.11 Property: download URL](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url), [6.8.9 Property: access URL](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_url) |

#### 6.8.11 Property: download URL

[Permalink for Section 6.8.11](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url)

| RDF Property: | [`dcat:downloadURL`](https://www.w3.org/ns/dcat#downloadURL) |
| Definition: | The URL of the downloadable file in a given format. E.g., CSV file or RDF file. The format is indicated by the distribution's `dcterms:format` and/or `dcat:mediaType` |
| Domain: | [`dcat:Distribution`](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) |
| Range: | [`rdfs:Resource`](https://www.w3.org/2000/01/rdf-schema#Resource) |
| Usage note: | [`dcat:downloadURL`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_download_url) _SHOULD_ be used for the URL at which this distribution is available directly, typically through a HTTP Get request. |
| See also | [6.8.9 Property: access URL](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_url), [6.8.10 Property: access service](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_access_service) |

#### 6.8.12 Property: byte size

[Permalink for Section 6.8.12](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_size)

| RDF Property: | [`dcat:byteSize`](https://www.w3.org/ns/dcat#byteSize) |
| Definition: | The size of a distribution in bytes. |
| Domain: | [`dcat:Distribution`](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) |
| Range: | [`rdfs:Literal`](https://www.w3.org/2000/01/rdf-schema#Literal) typically typed as [`xsd:nonNegativeInteger`](https://www.w3.org/TR/xmlschema11-2/#nonNegativeInteger). |
| Usage note: | The size in bytes can be approximated (as a non-negative integer) when the precise size is not known. |
| Usage note: | While it is recommended that the size be given as an integer, alternative literals such as '1.5 MB' are sometimes used. |

#### 6.8.13 Property: spatial resolution

[Permalink for Section 6.8.13](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_spatial_resolution)

Note

| RDF Property: | [`dcat:spatialResolutionInMeters`](https://www.w3.org/ns/dcat#spatialResolutionInMeters) |
| Definition: | The minimum spatial separation resolvable in a dataset distribution, measured in meters. |
| Range: | [`xsd:decimal`](https://www.w3.org/TR/xmlschema11-2/#decimal) or [`xsd:double`](https://www.w3.org/TR/xmlschema11-2/#double) |
| Usage note: | If the dataset is an image or grid this should correspond to the spacing of items. For other kinds of spatial datasets, this property will usually indicate the smallest distance between items in the dataset. |
| Usage note: | Alternative spatial resolutions might be provided as different dataset distributions |

The range of this property is a number representing a length in meters.
This is intended to provide a summary indication of the spatial resolution of the data distribution as a single number.
More complex descriptions of various aspects of spatial precision, accuracy, resolution and other statistics can be provided using the Data Quality Vocabulary \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\].

#### 6.8.14 Property: temporal resolution

[Permalink for Section 6.8.14](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_temporal_resolution)

Note

| RDF Property: | [`dcat:temporalResolution`](https://www.w3.org/ns/dcat#temporalResolution) |
| Definition: | Minimum time period resolvable in the dataset distribution. |
| Range: | [`xsd:duration`](https://www.w3.org/TR/xmlschema11-2/#duration) |
| Usage note: | If the dataset is a time-series this should correspond to the spacing of items in the series. For other kinds of dataset, this property will usually indicate the smallest time difference between items in the dataset. |
| Usage note: | Alternative temporal resolutions might be provided in different dataset distributions |

This is intended to provide a summary indication of the temporal resolution of the data distribution as a single value.
More complex descriptions of various aspects of temporal precision, accuracy, resolution and other statistics can be provided using the Data Quality Vocabulary \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\].

#### 6.8.15 Property: conforms to

[Permalink for Section 6.8.15](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_conforms_to)

Note

| RDF Property: | [`dcterms:conformsTo`](http://purl.org/dc/terms/conformsTo) |
| Definition: | An established standard to which the distribution conforms. |
| Range: | [`dcterms:Standard`](http://purl.org/dc/terms/Standard) (A basis for comparison; a reference point against which other things can be evaluated.) |
| Usage note: | This property _SHOULD_ be used to indicate the model, schema, ontology, view or profile that this representation of a dataset conforms to. This is (generally) a complementary concern to the media-type or format. |
| See also: | [6.8.17 Property: format](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_format), [6.8.16 Property: media type](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_media_type) |

For guidance on the use of this property, see [14.2.1 Conformance to a standard](https://www.w3.org/TR/vocab-dcat-3/#quality-conformance-statement).

Note

#### 6.8.16 Property: media type

[Permalink for Section 6.8.16](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_media_type)

Note

| RDF Property: | [`dcat:mediaType`](https://www.w3.org/ns/dcat#mediaType) |
| Definition: | The media type of the distribution as defined by IANA \[[IANA-MEDIA-TYPES](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-media-types "Media Types")\]. |
| Sub-property of: | [`dcterms:format`](http://purl.org/dc/terms/format) |
| Domain: | [`dcat:Distribution`](https://www.w3.org/TR/vocab-dcat-3/#Class:Distribution) |
| Range: | [`dcterms:MediaType`](http://purl.org/dc/terms/MediaType) |
| Usage note: | This property _SHOULD_ be used when the media type of the distribution is defined in IANA \[[IANA-MEDIA-TYPES](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-media-types "Media Types")\], otherwise `dcterms:format` _MAY_ be used with different values. |
| See also: | [6.8.17 Property: format](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_format), [6.8.15 Property: conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_conforms_to) |

#### 6.8.17 Property: format

[Permalink for Section 6.8.17](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_format)

| RDF Property: | [`dcterms:format`](http://purl.org/dc/terms/format) |
| Definition: | The file format of the distribution. |
| Range: | [`dcterms:MediaTypeOrExtent`](http://purl.org/dc/terms/MediaTypeOrExtent) |
| Usage note: | [`dcat:mediaType`](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_media_type) _SHOULD_ be used if the type of the distribution is defined by IANA \[[IANA-MEDIA-TYPES](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-media-types "Media Types")\]. |
| See also: | [6.8.16 Property: media type](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_media_type), [6.8.15 Property: conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_conforms_to) |

#### 6.8.18 Property: compression format

[Permalink for Section 6.8.18](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_compression_format)

Note

| RDF Property: | [`dcat:compressFormat`](https://www.w3.org/ns/dcat#compressFormat) |
| Definition: | The compression format of the distribution in which the data is contained in a compressed form, e.g., to reduce the size of the downloadable file. |
| Range: | [`dcterms:MediaType`](http://purl.org/dc/terms/MediaType) |
| Usage note: | This property to be used when the files in the distribution are compressed, e.g., in a ZIP file. The format _SHOULD_ be expressed using a media type as defined by IANA \[[IANA-MEDIA-TYPES](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-media-types "Media Types")\], if available. |
| See also: | [6.8.19 Property: packaging format](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_packaging_format). |

For examples on the use of this property, see [C.5 Compressed and packaged distributions](https://www.w3.org/TR/vocab-dcat-3/#examples-compressed-and-packaged-distributions).

#### 6.8.19 Property: packaging format

[Permalink for Section 6.8.19](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_packaging_format)

Note

| RDF Property: | [`dcat:packageFormat`](https://www.w3.org/ns/dcat#packageFormat) |
| Definition: | The package format of the distribution in which one or more data files are grouped together, e.g., to enable a set of related files to be downloaded together. |
| Range: | [`dcterms:MediaType`](http://purl.org/dc/terms/MediaType) |
| Usage note: | This property to be used when the files in the distribution are packaged, e.g., in a [TAR file](https://en.wikipedia.org/wiki/Tar_(computing)), a [ZIP file](https://en.wikipedia.org/wiki/ZIP_(file_format)), a [Frictionless Data Package](https://specs.frictionlessdata.io/data-package/) or a [Bagit](https://datatracker.ietf.org/doc/html/draft-kunze-bagit-14) file. The format _SHOULD_ be expressed using a media type as defined by IANA \[[IANA-MEDIA-TYPES](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-media-types "Media Types")\], if available. |
| See also: | [6.8.18 Property: compression format](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_compression_format). |

For examples on the use of this property, see [C.5 Compressed and packaged distributions](https://www.w3.org/TR/vocab-dcat-3/#examples-compressed-and-packaged-distributions).

#### 6.8.20 Property: checksum

[Permalink for Section 6.8.20](https://www.w3.org/TR/vocab-dcat-3/#Property:distribution_checksum)

Note

| RDF Property: | [`spdx:checksum`](https://spdx.org/rdf/spdx-terms-v2.2/#d4e1930) |
| Definition: | The checksum property provides a mechanism that can be used to verify that the contents of a file or package have not changed \[[SPDX](https://www.w3.org/TR/vocab-dcat-3/#bib-spdx "SPDX 2.2")\]. |
| Range: | [`spdx:Checksum`](https://www.w3.org/TR/vocab-dcat-3/#Class:Checksum) |
| Usage note: | The checksum is related to the download URL. |

### 6.9 Class: Data Service

[Permalink for Section 6.9](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service)

Note

The following properties are specific to this class:
[endpoint description](https://www.w3.org/TR/vocab-dcat-3/#Property:data_service_endpoint_description),
[endpoint URL](https://www.w3.org/TR/vocab-dcat-3/#Property:data_service_endpoint_url),

[serves dataset](https://www.w3.org/TR/vocab-dcat-3/#Property:data_service_serves_dataset).


The following properties of the super-class [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) are also available for use:

- [access rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_access_rights)
- [conforms to](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to)
- [contact point](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_contact_point)
- [creator](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator)
- [description](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_description)
- [has policy](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_policy)
- [identifier](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier)
- [is referenced by](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_referenced_by)
- [keyword/tag](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_keyword)
- [landing page](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_landing_page)
- [license](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_license)
- [language](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_language)
- [relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_relation)
- [rights](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_rights)
- [qualified relation](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation)
- [publisher](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_publisher)
- [release date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date)
- [theme/category](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme)
- [title](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_title)
- [type/genre](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_type)
- [update/modification date](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date)
- [qualified attribution](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_attribution)
- [has current version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version)
- [has version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version)
- [previous version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version)
- [replaces](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces)
- [status](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status)
- [version](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version)
- [version notes](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes)
- [first](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first)
- [last](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last)
- [previous](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous)

| RDF Class: | [`dcat:DataService`](https://www.w3.org/ns/dcat#DataService) |
| Definition: | A collection of operations that provides access to one or more datasets or data processing functions. |
| Sub-class of: | [`dcat:Resource`](https://www.w3.org/TR/vocab-dcat-3/#Class:Resource) |
| Sub-class of: | [`dctype:Service`](http://purl.org/dc/dcmitype/Service) |
| Usage note: | If a [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) is bound to one or more specified Datasets, they are indicated by the [`dcat:servesDataset`](https://www.w3.org/TR/vocab-dcat-3/#Property:data_service_serves_dataset) property. |
| Usage note: | The kind of service can be indicated using the [`dcterms:type`](http://purl.org/dc/terms/type) property. Its value may be taken from a controlled vocabulary such as the INSPIRE spatial data service type code list \[[INSPIRE-SDST](https://www.w3.org/TR/vocab-dcat-3/#bib-inspire-sdst "INSPIRE Registry: Spatial data service types")\]. |

For examples on the use of this class and related properties, see [C.4 Data services](https://www.w3.org/TR/vocab-dcat-3/#examples-data-service).

#### 6.9.1 Property: endpoint URL

[Permalink for Section 6.9.1](https://www.w3.org/TR/vocab-dcat-3/#Property:data_service_endpoint_url)

| RDF Property: | [`dcat:endpointURL`](https://www.w3.org/ns/dcat#endpointURL) |
| Definition: | The root location or primary endpoint of the service (a Web-resolvable IRI). |
| Domain: | [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) |
| Range: | [`rdfs:Resource`](https://www.w3.org/2000/01/rdf-schema#Resource) |

#### 6.9.2 Property: endpoint description

[Permalink for Section 6.9.2](https://www.w3.org/TR/vocab-dcat-3/#Property:data_service_endpoint_description)

| RDF Property: | [`dcat:endpointDescription`](https://www.w3.org/ns/dcat#endpointDescription) |
| Definition: | A description of the services available via the end-points, including their operations, parameters etc. |
| Domain: | [`dcat:DataService`](https://www.w3.org/TR/vocab-dcat-3/#Class:Data_Service) |
| Range: | [`rdfs:Resource`](https://www.w3.org/2000/01/rdf-schema#Resource) |
| Usage note: | The endpoint description gives specific details of the actual endpoint instances, while [`dcterms:conformsTo`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_conforms_to) is used to indicate the general standard or specification that the endpoints implement. |
| Usage note: | An endpoint description may be expressed in a machine-readable form, such as an OpenAPI (Swagger) description \[[OpenAPI](https://www.w3.org/TR/vocab-dcat-3/#bib-openapi "OpenAPI Specification")\], an OGC `GetCapabilities` response \[[WFS](https://www.w3.org/TR/vocab-dcat-3/#bib-wfs "Web Feature Service 2.0 Interface Standard")\], \[[ISO-19142](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19142 "Geographic information -- Web Feature Service")\], \[[WMS](https://www.w3.org/TR/vocab-dcat-3/#bib-wms "Web Map Service Implementation Specification")\], \[[ISO-19128](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19128 "Geographic information -- Web map server interface")\], a SPARQL Service Description \[[SPARQL11-SERVICE-DESCRIPTION](https://www.w3.org/TR/vocab-dcat-3/#bib-sparql11-service-description "SPARQL 1.1 Service Description")\], an \[[OpenSearch](https://www.w3.org/TR/vocab-dcat-3/#bib-opensearch "OpenSearch 1.1 Draft 6")\] or \[[WSDL20](https://www.w3.org/TR/vocab-dcat-3/#bib-wsdl20 "Web Services Description Language (WSDL) Version 2.0 Part 1: Core Language")\] document, a Hydra API description \[[HYDRA](https://www.w3.org/TR/vocab-dcat-3/#bib-hydra "Hydra Core Vocabulary")\], else in text or some other informal mode if a formal representation is not possible. |

#### 6.9.3 Property: serves dataset

[Permalink for Section 6.9.3](https://www.w3.org/TR/vocab-dcat-3/#Property:data_service_serves_dataset)

| RDF Property: | [`dcat:servesDataset`](https://www.w3.org/ns/dcat#servesDataset) |
| Definition: | A collection of data that this data service can distribute. |
| Range: | [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset) |

### 6.10 Class: Concept Scheme

[Permalink for Section 6.10](https://www.w3.org/TR/vocab-dcat-3/#Class:Concept_Scheme)

| RDF Class: | [`skos:ConceptScheme`](https://www.w3.org/2004/02/skos/core#ConceptScheme) |
| Definition: | A knowledge organization system (KOS) used to represent themes/categories of datasets in the catalog. |
| See also: | [6.3.2 Property: themes](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_themes), [6.4.12 Property: theme/category](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme) |

### 6.11 Class: Concept

[Permalink for Section 6.11](https://www.w3.org/TR/vocab-dcat-3/#Class:Concept)

| RDF Class: | [`skos:Concept`](https://www.w3.org/2004/02/skos/core#Concept) |
| Definition: | A category or a theme used to describe datasets in the catalog. |
| Usage note: | It is recommended to use either `skos:inScheme` or `skos:topConceptOf` on every `skos:Concept` used to classify datasets to link it to the concept scheme it belongs to. This concept scheme is typically associated with the catalog using `dcat:themeTaxonomy`. |
| See also: | [6.3.2 Property: themes](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_themes), [6.4.12 Property: theme/category](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_theme) |

### 6.12 Class: Organization/Person

[Permalink for Section 6.12](https://www.w3.org/TR/vocab-dcat-3/#Class:Organization_Person)

| RDF Classes: | [`foaf:Person`](http://xmlns.com/foaf/0.1/Person) (for people)<br>[`foaf:Organization`](http://xmlns.com/foaf/0.1/Organization) (for government agencies or other entities) |
| Sub-class of: | [`foaf:Agent`](http://xmlns.com/foaf/0.1/Agent) |
| Usage note: | \[[FOAF](https://www.w3.org/TR/vocab-dcat-3/#bib-foaf "FOAF Vocabulary Specification 0.99 (Paddington Edition)")\] provides several properties to describe these entities. |

### 6.13 Class: Relationship

[Permalink for Section 6.13](https://www.w3.org/TR/vocab-dcat-3/#Class:Relationship)

Note

The following properties are specific to this class:
[relation](https://www.w3.org/TR/vocab-dcat-3/#Property:relationship_relation),
[had role](https://www.w3.org/TR/vocab-dcat-3/#Property:relationship_hadRole).


Examples illustrating use of this class and its properties are given in [15\. Qualified relations](https://www.w3.org/TR/vocab-dcat-3/#qualified-forms).

| RDF Class: | [`dcat:Relationship`](https://www.w3.org/ns/dcat#Relationship) |
| Definition: | An association class for attaching additional information to a relationship between DCAT Resources |
| Sub-class of: | [`prov:EntityInfluence`](https://www.w3.org/TR/prov-o/#EntityInfluence) |
| Usage note: | Use to characterize a relationship between datasets, and potentially other resources, where the nature of the relationship is known but is not adequately characterized by the standard \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] properties<br> ( [`dcterms:hasPart`](http://purl.org/dc/terms/hasPart),<br> [`dcterms:isPartOf`](http://purl.org/dc/terms/isPartOf),<br> [`dcterms:conformsTo`](http://purl.org/dc/terms/conformsTo),<br> [`dcterms:isFormatOf`](http://purl.org/dc/terms/isFormatOf),<br> [`dcterms:hasFormat`](http://purl.org/dc/terms/hasFormat),<br> [`dcterms:isVersionOf`](http://purl.org/dc/terms/isVersionOf),<br> [`dcterms:hasVersion`](http://purl.org/dc/terms/hasVersion),<br> [`dcterms:replaces`](http://purl.org/dc/terms/replaces),<br> [`dcterms:isReplacedBy`](http://purl.org/dc/terms/isReplacedBy),<br> [`dcterms:references`](http://purl.org/dc/terms/references),<br> [`dcterms:isReferencedBy`](http://purl.org/dc/terms/isReferencedBy),<br> [`dcterms:requires`](http://purl.org/dc/terms/requires),<br> [`dcterms:isRequiredBy`](http://purl.org/dc/terms/isRequiredBy))<br> or \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] properties<br> ( [`prov:wasDerivedFrom`](https://www.w3.org/TR/prov-o/#wasDerivedFrom),<br> [`prov:wasInfluencedBy`](https://www.w3.org/TR/prov-o/#wasInfluencedBy),<br> [`prov:wasQuotedFrom`](https://www.w3.org/TR/prov-o/#wasQuotedFrom),<br> [`prov:wasRevisionOf`](https://www.w3.org/TR/prov-o/#wasRevisionOf),<br> [`prov:hadPrimarySource`](https://www.w3.org/TR/prov-o/#hadPrimarySource),<br> [`prov:alternateOf`](https://www.w3.org/TR/prov-o/#alternateOf),<br> [`prov:specializationOf`](https://www.w3.org/TR/prov-o/#specializationOf)) |

#### 6.13.1 Property: relation

[Permalink for Section 6.13.1](https://www.w3.org/TR/vocab-dcat-3/#Property:relationship_relation)

| RDF Property: | [`dcterms:relation`](http://purl.org/dc/terms/relation) |
| Definition: | The resource related to the source resource. |
| Usage note: | In the context of a `dcat:Relationship` this is expected to point to another `dcat:Dataset` or other cataloged resource. |

#### 6.13.2 Property: had role

[Permalink for Section 6.13.2](https://www.w3.org/TR/vocab-dcat-3/#Property:relationship_hadRole)

Note

| RDF Property: | [`dcat:hadRole`](https://www.w3.org/ns/dcat#hadRole) |
| Definition: | The function of an entity or agent with respect to another entity or resource. |
| Domain: | [`prov:Attribution`](https://www.w3.org/TR/prov-o/#Attribution) or [`dcat:Relationship`](https://www.w3.org/TR/vocab-dcat-3/#Class:Relationship) |
| Range: | [`dcat:Role`](https://www.w3.org/TR/vocab-dcat-3/#Class:Role) |
| Usage note: | May be used in a qualified-attribution to specify the role of an Agent with respect to an Entity. It is recommended that the value be taken from a controlled vocabulary of agent roles, such as \[[ISO-19115](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115 "Geographic information -- Metadata")\] [`CI_RoleCode`](https://standards.iso.org/iso/19115/resources/Codelists/gml/CI_RoleCode.xml). |
| Usage note: | May be used in a qualified-relation to specify the role of an Entity with respect to another Entity. It is recommended that the value be taken from a controlled vocabulary of entity roles. |

This DCAT property complements [`prov:hadRole`](https://www.w3.org/TR/prov-o/#hadRole) which provides the function of an entity or agent with respect to an activity.


### 6.14 Class: Role

[Permalink for Section 6.14](https://www.w3.org/TR/vocab-dcat-3/#Class:Role)

Note

Examples illustrating use of this class are given in [15\. Qualified relations](https://www.w3.org/TR/vocab-dcat-3/#qualified-forms).

| RDF Class: | [`dcat:Role`](https://www.w3.org/ns/dcat#Role) |
| Definition: | A role is the function of a resource or agent with respect to another resource, in the context of resource attribution or resource relationships. |
| Sub-class of: | [`skos:Concept`](https://www.w3.org/2004/02/skos/core#Concept) |
| Usage note: | Used in a qualified-attribution to specify the role of an Agent with respect to an Entity. It is recommended that the values be managed as a controlled vocabulary of agent roles, such as \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\] [`CI_RoleCode`](https://standards.iso.org/iso/19115/resources/Codelists/gml/CI_RoleCode.xml). |
| Usage note: | Used in a qualified-relation to specify the role of an Entity with respect to another Entity.<br>It is recommended that the values be managed as a controlled vocabulary of entity roles such as<br>- \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\] [`DS_AssociationTypeCode`](https://standards.iso.org/iso/19115/resources/Codelists/gml/DS_AssociationTypeCode.xml)<br>- IANA Registry of Link Relations \[[IANA-RELATIONS](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-relations "Link Relations")\]<br>- DataCite metadata schema \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\]<br>- [MARC relators](https://id.loc.gov/vocabulary/relators) |

This DCAT class complements [`prov:Role`](https://www.w3.org/TR/prov-o/#Role) which provides the function of an entity or agent with respect to an activity.


### 6.15 Class: Period of Time

[Permalink for Section 6.15](https://www.w3.org/TR/vocab-dcat-3/#Class:Period_of_Time)

Note

The following properties are specific to this class:
[start date](https://www.w3.org/TR/vocab-dcat-3/#Property:period_start_date),
[end date](https://www.w3.org/TR/vocab-dcat-3/#Property:period_end_date).
[beginning](https://www.w3.org/TR/vocab-dcat-3/#Property:period_has_beginning),
[end](https://www.w3.org/TR/vocab-dcat-3/#Property:period_has_end).


Examples illustrating use of these options for the temporal coverage of a dataset are given in [10.1 Temporal properties](https://www.w3.org/TR/vocab-dcat-3/#temporal-properties).


| RDF Class: | [`dcterms:PeriodOfTime`](http://purl.org/dc/terms/PeriodOfTime) |
| Definition: | An interval of time that is named or defined by its start and end. |
| Usage note: | The start and end of the interval _SHOULD_ be given by using properties<br>[`dcat:startDate`](https://www.w3.org/TR/vocab-dcat-3/#Property:period_start_date)<br>or [`time:hasBeginning`](https://www.w3.org/TR/vocab-dcat-3/#Property:period_has_beginning),<br>and [`dcat:endDate`](https://www.w3.org/TR/vocab-dcat-3/#Property:period_end_date)<br>or [`time:hasEnd`](https://www.w3.org/TR/vocab-dcat-3/#Property:period_has_end), respectively.<br>The interval can also be open - i.e., it can have just a start or just an end. |

#### 6.15.1 Property: start date

[Permalink for Section 6.15.1](https://www.w3.org/TR/vocab-dcat-3/#Property:period_start_date)

Note

| RDF Property: | [`dcat:startDate`](https://www.w3.org/ns/dcat#startDate) |
| Definition: | The start of the period. |
| Domain: | [`dcterms:PeriodOfTime`](https://www.w3.org/TR/vocab-dcat-3/#Class:Period_of_Time) |
| Range: | [`rdfs:Literal`](https://www.w3.org/TR/rdf-schema/#ch_literal "http://www.w3.org/2000/01/rdf-schema#Literal") encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] ( [`xsd:gYear`](https://www.w3.org/TR/xmlschema11-2/#gYear), [`xsd:gYearMonth`](https://www.w3.org/TR/xmlschema11-2/#gYearMonth), [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date), or [`xsd:dateTime`](https://www.w3.org/TR/xmlschema11-2/#dateTime)). |

#### 6.15.2 Property: end date

[Permalink for Section 6.15.2](https://www.w3.org/TR/vocab-dcat-3/#Property:period_end_date)

Note

| RDF Property: | [`dcat:endDate`](https://www.w3.org/ns/dcat#endDate) |
| Definition: | The end of the period. |
| Domain: | [`dcterms:PeriodOfTime`](https://www.w3.org/TR/vocab-dcat-3/#Class:Period_of_Time) |
| Range: | [`rdfs:Literal`](https://www.w3.org/TR/rdf-schema/#ch_literal "http://www.w3.org/2000/01/rdf-schema#Literal") encoded using the relevant ISO 8601 Date and Time compliant string \[[DATETIME](https://www.w3.org/TR/vocab-dcat-3/#bib-datetime "Date and Time Formats")\] and typed using the appropriate XML Schema datatype \[[XMLSCHEMA11-2](https://www.w3.org/TR/vocab-dcat-3/#bib-xmlschema11-2 "W3C XML Schema Definition Language (XSD) 1.1 Part 2: Datatypes")\] |

#### 6.15.3 Property: beginning

[Permalink for Section 6.15.3](https://www.w3.org/TR/vocab-dcat-3/#Property:period_has_beginning)

Note

| RDF Property: | [`time:hasBeginning`](https://www.w3.org/TR/owl-time/#time:hasBeginning) |
| Definition: | Beginning of a period or interval. |
| Range: | [`time:Instant`](https://www.w3.org/TR/owl-time/#time:Instant) |
| Usage note: | Use of the property `time:hasBeginning` entails that value of the `dcterms:temporal` property is a member of the `time:TemporalEntity` class from \[[OWL-TIME](https://www.w3.org/TR/vocab-dcat-3/#bib-owl-time "Time Ontology in OWL")\]. In this context this could be taken to imply that `dcterms:PeriodOfTime` is equivalent to the sub-class [`time:ProperInterval`](https://www.w3.org/TR/owl-time/#time:ProperInterval) |

Note

#### 6.15.4 Property: end

[Permalink for Section 6.15.4](https://www.w3.org/TR/vocab-dcat-3/#Property:period_has_end)

Note

| RDF Property: | [`time:hasEnd`](https://www.w3.org/TR/owl-time/#time:hasEnd) |
| Definition: | End of a period or interval. |
| Range: | [`time:Instant`](https://www.w3.org/TR/owl-time/#time:Instant) |
| Usage note: | Use of the property `time:hasEnd` entails that value of the `dcterms:temporal` property is a member of the `time:TemporalEntity` class from \[[OWL-TIME](https://www.w3.org/TR/vocab-dcat-3/#bib-owl-time "Time Ontology in OWL")\]. In this context this could be taken to imply that `dcterms:PeriodOfTime` is equivalent to the sub-class [`time:ProperInterval`](https://www.w3.org/TR/owl-time/#time:ProperInterval) |

Note

### 6.16 Class: Location

[Permalink for Section 6.16](https://www.w3.org/TR/vocab-dcat-3/#Class:Location)

Note

The following properties are specific to this class:
[geometry](https://www.w3.org/TR/vocab-dcat-3/#Property:location_geometry),
[bounding box](https://www.w3.org/TR/vocab-dcat-3/#Property:location_bbox),
[centroid](https://www.w3.org/TR/vocab-dcat-3/#Property:location_centroid).


Examples illustrating use of these options for the spatial coverage of a dataset are given in [10.2 Spatial properties](https://www.w3.org/TR/vocab-dcat-3/#spatial-properties).


| RDF Class: | [`dcterms:Location`](http://purl.org/dc/terms/Location) |
| Definition: | A spatial region or named place. |
| Usage note: | - For an extensive geometry (i.e., a set of coordinates denoting the vertices of the relevant geographic area), the property [`locn:geometry`](https://www.w3.org/TR/vocab-dcat-3/#Property:location_geometry) \[[LOCN](https://www.w3.org/TR/vocab-dcat-3/#bib-locn "ISA Programme Location Core Vocabulary")\] _SHOULD_ be used.<br>- For a geographic bounding box delimiting a spatial area the property [`dcat:bbox`](https://www.w3.org/TR/vocab-dcat-3/#Property:location_bbox) _SHOULD_ be used.<br>- For the geographic center of a spatial area, or another characteristic point, the property [`dcat:centroid`](https://www.w3.org/TR/vocab-dcat-3/#Property:location_centroid) _SHOULD_ be used. |

#### 6.16.1 Property: geometry

[Permalink for Section 6.16.1](https://www.w3.org/TR/vocab-dcat-3/#Property:location_geometry)

Note

| RDF Property: | [`locn:geometry`](https://www.w3.org/ns/locn#locn:geometry) |
| Definition: | Associates a spatial thing \[[SDW-BP](https://www.w3.org/TR/vocab-dcat-3/#bib-sdw-bp "Spatial Data on the Web Best Practices")\] with a corresponding geometry. |
| Range: | [`locn:Geometry`](https://www.w3.org/ns/locn#locn:Geometry) |
| Usage note: | The range of this property (`locn:Geometry`) allows for any type of geometry specification. E.g., the geometry could be encoded by a literal, as WKT ( [`geosparql:wktLiteral`](http://www.opengis.net/ont/geosparql#wktLiteral) \[[GeoSPARQL](https://www.w3.org/TR/vocab-dcat-3/#bib-geosparql "OGC GeoSPARQL - A Geographic Query Language for RDF Data")\]), or represented by a class, as [`geosparql:Geometry`](http://www.opengis.net/ont/geosparql#Geometry) (or any of its subclasses) \[[GeoSPARQL](https://www.w3.org/TR/vocab-dcat-3/#bib-geosparql "OGC GeoSPARQL - A Geographic Query Language for RDF Data")\]. |

#### 6.16.2 Property: bounding box

[Permalink for Section 6.16.2](https://www.w3.org/TR/vocab-dcat-3/#Property:location_bbox)

Note

| RDF Property: | [`dcat:bbox`](https://www.w3.org/ns/dcat#bbox) |
| Definition: | The geographic bounding box of a spatial thing \[[SDW-BP](https://www.w3.org/TR/vocab-dcat-3/#bib-sdw-bp "Spatial Data on the Web Best Practices")\]. |
| Range: | [`rdfs:Literal`](https://www.w3.org/TR/rdf-schema/#ch_literal) |
| Usage note: | The range of this property (`rdfs:Literal`) is intentionally generic, with the purpose of allowing different geometry literal encodings. E.g., the geometry could be encoded as a WKT literal ( [`geosparql:wktLiteral`](http://www.opengis.net/ont/geosparql#wktLiteral) \[[GeoSPARQL](https://www.w3.org/TR/vocab-dcat-3/#bib-geosparql "OGC GeoSPARQL - A Geographic Query Language for RDF Data")\]). |

Note

#### 6.16.3 Property: centroid

[Permalink for Section 6.16.3](https://www.w3.org/TR/vocab-dcat-3/#Property:location_centroid)

Note

| RDF Property: | [`dcat:centroid`](https://www.w3.org/ns/dcat#centroid) |
| Definition: | The geographic center (centroid) of a spatial thing \[[SDW-BP](https://www.w3.org/TR/vocab-dcat-3/#bib-sdw-bp "Spatial Data on the Web Best Practices")\]. |
| Range: | [`rdfs:Literal`](https://www.w3.org/TR/rdf-schema/#ch_literal) |
| Usage note: | The range of this property (`rdfs:Literal`) is intentionally generic, with the purpose of allowing different geometry literal encodings. E.g., the geometry could be encoded as a WKT literal ( [`geosparql:wktLiteral`](http://www.opengis.net/ont/geosparql#wktLiteral) \[[GeoSPARQL](https://www.w3.org/TR/vocab-dcat-3/#bib-geosparql "OGC GeoSPARQL - A Geographic Query Language for RDF Data")\]). |

Note

### 6.17 Class: Checksum

[Permalink for Section 6.17](https://www.w3.org/TR/vocab-dcat-3/#Class:Checksum)

Note

The following properties are specific to this class:
[algorithm](https://www.w3.org/TR/vocab-dcat-3/#Property:checksum_algorithm),
[checksum value](https://www.w3.org/TR/vocab-dcat-3/#Property:checksum_checksum_value).

| RDF Class: | [`spdx:Checksum`](https://spdx.org/rdf/spdx-terms-v2.2/#d4e1930) |
| Definition: | A Checksum is a value that allows to check the integrity of the contents of a file. Even small changes to the content of the file will change its checksum. This class allows the results of a variety of checksum and cryptographic message digest algorithms to be represented \[[SPDX](https://www.w3.org/TR/vocab-dcat-3/#bib-spdx "SPDX 2.2")\]. |
| Usage note: | The Checksum includes the algorithm ( [`spdx:algorithm`](https://www.w3.org/TR/vocab-dcat-3/#Property:checksum_algorithm)) and value ( [`spdx:checksumValue`](https://www.w3.org/TR/vocab-dcat-3/#Property:checksum_checksum_value)) that allows the integrity of a file to be verified to ensure no errors occurred in transmission or storage. |

#### 6.17.1 Property: algorithm

[Permalink for Section 6.17.1](https://www.w3.org/TR/vocab-dcat-3/#Property:checksum_algorithm)

Note

| RDF Property: | [`spdx:algorithm`](https://spdx.org/rdf/spdx-terms-v2.2/#d4e52) |
| Definition: | Identifies the algorithm used to produce the subject Checksum \[[SPDX](https://www.w3.org/TR/vocab-dcat-3/#bib-spdx "SPDX 2.2")\]. |
| Domain: | [`spdx:Checksum`](https://www.w3.org/TR/vocab-dcat-3/#Class:Checksum) |
| Range: | The set of individuals of class [`spdx:ChecksumAlgorithm`](https://spdx.org/rdf/spdx-terms-v2.2/#d4e1968). |
| Usage note: | Version 2.2 of \[[SPDX](https://www.w3.org/TR/vocab-dcat-3/#bib-spdx "SPDX 2.2")\] defines individuals for the following algorithms: <br>[MD2](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3691), <br>[MD4](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3704), <br>[MD5](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3717), <br>[MD6](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3731), <br>[SHA-1](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3744), <br>[SHA-224](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3757), <br>[SHA-256](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3771), <br>[SHA-384](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3784), <br>[SHA-512](https://spdx.org/rdf/spdx-terms-v2.2/#d4e3797). |

#### 6.17.2 Property: checksum value

[Permalink for Section 6.17.2](https://www.w3.org/TR/vocab-dcat-3/#Property:checksum_checksum_value)

Note

| RDF Property: | [`spdx:checksumValue`](https://spdx.org/rdf/spdx-terms-v2.2/#d4e1111) |
| Definition: | The checksumValue property provides a lowercase hexadecimal encoded digest value produced using a specific algorithm \[[SPDX](https://www.w3.org/TR/vocab-dcat-3/#bib-spdx "SPDX 2.2")\]. |
| Domain: | [`spdx:Checksum`](https://www.w3.org/TR/vocab-dcat-3/#Class:Checksum) |
| Range: | [`xsd:hexBinary`](https://www.w3.org/TR/xmlschema11-2/#hexBinary) |

## 7\. Use of inverse properties

[Permalink for Section 7.](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties)

The properties described in [6\. Vocabulary specification](https://www.w3.org/TR/vocab-dcat-3/#vocabulary-specification) do not include inverses intentionally, with the purpose of ensuring interoperability also in systems not making use of OWL reasoning.

However, recognizing that inverses are needed for some use cases, DCAT supports them, but with the requirement that they _MAY_ be used only _in addition to_ those described in [6\. Vocabulary specification](https://www.w3.org/TR/vocab-dcat-3/#vocabulary-specification), and that they _MUST NOT_ be used to replace them.

The following table lists the inverse properties supported in DCAT.

| Property | Inverse |
| --- | --- |
| [`dcat:prev`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous) | `dcat:next` |
| [`dcat:previousVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version) | `dcat:nextVersion` |
| [`dcat:distribution`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_distribution) | `dcat:isDistributionOf` |
| [`dcterms:hasPart`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_part) | [`dcterms:isPartOf`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/isPartOf) |
| [`dcat:resource`](https://www.w3.org/TR/vocab-dcat-3/#Property:catalog_resource) | `dcat:inCatalog` |
| [`dcterms:replaces`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces) | [`dcterms:isReplacedBy`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/isReplacedBy) |
| [`dcterms:isReferencedBy`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_referenced_by) | [`dcterms:references`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/references) |
| [`dcat:hasVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version) | `dcat:isVersionOf` |
| [`dcat:inSeries`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_in_series) | `dcat:seriesMember` |
| [`foaf:primaryTopic`](https://www.w3.org/TR/vocab-dcat-3/#Property:record_primary_topic) | [`foaf:isPrimaryTopicOf`](http://xmlns.com/foaf/spec#term_isPrimaryTopicOf) |
| [`prov:wasGeneratedBy`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_was_generated_by) | [`prov:generated`](https://www.w3.org/TR/prov-o/#generated) |

## 8\. Dereferenceable identifiers

[Permalink for Section 8.](https://www.w3.org/TR/vocab-dcat-3/#dereferenceable-identifiers)

_This section is non-normative._

The scientific and data provider communities use a number of different identifiers for publications, authors and data. DCAT primarily relies on persistent HTTP IRIs as an effective way of making identifiers actionable. Notably, quite a few identifier schemes can be encoded as dereferenceable HTTP IRIs, and some of them are also returning machine-readable metadata (e.g., DOIs \[[ISO-26324](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-26324 "Information and documentation -- Digital object identifier system")\] and [ORCIDs](https://orcid.org/)). Regardless, data providers still might need to refer to legacy identifiers, non-HTTP dereferenceable identifiers, locally minted or third-party-provided identifiers. In these cases, \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] and \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\] can be of use.

The property [`dcterms:identifier`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier) explicitly indicates HTTP IRIs as well as legacy identifiers. In the following examples, [`dcterms:identifier`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_identifier) identifies a dataset, but it can similarly be used with any kind of resources.

Proxy dereferenceable IRIs can be used when resources do not have HTTP dereferenceable IDs. For example, in [Example 14](https://www.w3.org/TR/vocab-dcat-3/#ex-proxy-id), `dcat.example.org/proxyid` is a proxy for `id`.

The property [`adms:identifier`](https://www.w3.org/TR/vocab-adms/#adms-identifier) \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\] can express other locally minted identifiers or external identifiers, like DOI, [ELI](https://eur-lex.europa.eu/eli-register/about.html), [arΧiv](https://arxiv.org/) for creative works and [ORCID](https://orcid.org/), [VIAF](https://viaf.org/), [ISNI](http://www.isni.org/) for actors such as authors and publishers, as long as the identifiers are globally unique and stable.

[Example 15](https://www.w3.org/TR/vocab-dcat-3/#ex-adms-identifier) uses [`adms:schemaAgency`](https://www.w3.org/TR/vocab-adms/#adms-schemaagency) and [`dcterms:creator`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/creator) to represent the authority that defines the identifier scheme (e.g., the [DOI foundation](https://www.doi.org/) in the example), `adms:schemaAgency` is used when the authority has no IRI associated. The [CrossRef](https://www.crossref.org/display-guidelines/) and [DataCite](https://support.datacite.org/docs/datacite-doi-display-guidelines) display guidelines recommend displaying DOIs as full URL link in the form `https://doi.org/10.xxxx/xxxxx/`.


[Example 15](https://www.w3.org/TR/vocab-dcat-3/#ex-adms-identifier) does not represent the authority responsible for assigning and maintaining identifiers using that scheme (e.g., [Zenodo](https://zenodo.org/)) as naming the registrant goes against the philosophy of DOI, where the sub-spaces are abstracted from the organization that registers them, with the advantage that DOIs do not change when the organization changes or the responsibility for that sub-space is handed over to someone else. [Example 15](https://www.w3.org/TR/vocab-dcat-3/#ex-adms-identifier) shows a locally minted identifier for the creator of the dataset (e.g., `https://dcat.example.org/PoelenJorritHID`) and its correspondent ORCID identifier (e.g., `https://orcid.org/0000-0003-3138-4118`).

When the HTTP dereferenceable ID returns an RDF/OWL description for the dataset, the use of `owl:sameAs` might be considered. For example,

when dereferenced with media type `text/turtle`, `https://doi.org/10.5281/zenodo.1486279` returns a \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] description for the dataset, which might dynamically enrich the description provided by `https://dcat.example.org/id`.

Note

The need to distinguish between primary and alternative (or legacy) identifiers for a dataset within DCAT has been posed as a requirement. However, it is very much application-specific and would be better addressed in DCAT profiles rather than mandating a general approach.

Depending on the application context, specific guidelines such as ["DCAT-AP: How to manage duplicates?"](https://joinup.ec.europa.eu/release/dcat-ap-how-manage-duplicates) can be adopted for distinguishing authoritative datasets from dataset harvested by third parties catalogs.

### 8.1 Indicating common identifier types

[Permalink for Section 8.1](https://www.w3.org/TR/vocab-dcat-3/#identifiers-type)

If identifiers are not HTTP dereferenceable, common identifier types can be served as [RDF datatypes](https://www.w3.org/TR/rdf11-concepts/#dfn-recognized-datatype-iris) \[[RDF11-CONCEPTS](https://www.w3.org/TR/vocab-dcat-3/#bib-rdf11-concepts "RDF 1.1 Concepts and Abstract Syntax")\] or custom [OWL datatypes](https://www.w3.org/TR/owl2-syntax/#Datatype_Definitions) \[[OWL2-SYNTAX](https://www.w3.org/TR/vocab-dcat-3/#bib-owl2-syntax "OWL 2 Web Ontology Language Structural Specification and Functional-Style Syntax (Second Edition)")\] for the sake of interoperability, see `ex:type` in [Example 17](https://www.w3.org/TR/vocab-dcat-3/#ex-identifier-type).

If a registered IRI type is used (following \[[RFC3986](https://www.w3.org/TR/vocab-dcat-3/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\], [§ 3.1 Scheme](https://www.rfc-editor.org/rfc/rfc3986#section-3.1)), the identifier scheme is part of the IRI; thus indicating a separate identifier scheme in 'type' is redundant. For example, DOI is registered as a namespace in the `info`IRI scheme \[[IANA-URI-SCHEMES](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-uri-schemes "Uniform Resource Identifier (URI) Schemes")\] (see [DOI FAQ #11](https://www.doi.org/faq.html)), so according to \[[RFC3986](https://www.w3.org/TR/vocab-dcat-3/#bib-rfc3986 "Uniform Resource Identifier (URI): Generic Syntax")\], it should be encoded as in [Example 18](https://www.w3.org/TR/vocab-dcat-3/#ex-identifier-type-in-uri).

Otherwise, examples of common types for identifier scheme ( [arXiv](https://arxiv.org/help/arxiv_identifier.html), etc.) are defined in [DataCite schema](https://schema.datacite.org/meta/kernel-4.4/include/datacite-relatedIdentifierType-v4.xsd) \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\] and [FAIRsharing Registry](https://fairsharing.org/standards/?q=&selected_facets=type_exact:identifier%20schema).

## 9\. License and rights statements

[Permalink for Section 9.](https://www.w3.org/TR/vocab-dcat-3/#license-rights)

_This section is non-normative._

Selecting the right way to express conditions for access to and re-use of resources can be complex.
Implementers should always seek legal advice before deciding which conditions apply to the resource being described.


This specification distinguishes three main situations:
one where a statement is associated with a resource that is explicitly declared as a 'license';
a second, where the statement is associated with a resource denoting only access rights;
a third, covering all the other cases - i.e., statements not concerning licensing conditions and/or access rights (e.g., copyright statements).


Note

To address these scenarios, it is recommended to use the property `dcterms:rights`, and its sub-properties `dcterms:license` and `dcterms:accessRights`. More precisely:


1. use [`dcterms:license`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/license) to refer to licenses;



   Note

2. use [`dcterms:accessRights`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/accessRights) to express statements concerning only access rights (e.g., whether data can be accessed by anyone or just by authorized parties);



   Note

3. use [`dcterms:rights`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/rights) for all the other types of rights statements - those which are not covered by `dcterms:license` and `dcterms:accessRights`, such as copyright statements.



   Note


Finally, in the particular case when rights are expressed via [ODRL policies](https://www.w3.org/TR/odrl-vocab/#term-Policy), it is recommended to use the [`odrl:hasPolicy`](https://www.w3.org/TR/odrl-vocab/#term-hasPolicy) property as the link from the description of the cataloged resource or distribution to the ODRL policy.

Note

## 10\. Time and space

[Permalink for Section 10.](https://www.w3.org/TR/vocab-dcat-3/#time-and-space)

_This section is non-normative._

### 10.1 Temporal properties

[Permalink for Section 10.1](https://www.w3.org/TR/vocab-dcat-3/#temporal-properties)

Five temporal properties of resources may be described using DCAT.


1. The release time of a resource is given using [`dcterms:issued`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date).
    The value is usually encoded as a [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date).

2. The revision or update time of a resource is given using [`dcterms:modified`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date).
    The value is usually encoded as a [`xsd:date`](https://www.w3.org/TR/xmlschema11-2/#date).

3. The update schedule for a resource is indicated using [`dcterms:accrualPeriodicity`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency).
    The value should be taken from a controlled vocabulary such as [Dublin Core Collection Description Frequency Vocabulary](http://www.dublincore.org/specifications/dublin-core/collection-description/frequency/).

4. The minimum temporal separation of items in a dataset is given using [`dcat:temporalResolution`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal_resolution).
    The value is encoded as a [`xsd:duration`](https://www.w3.org/TR/xmlschema11-2/#duration).
    The update schedule and the temporal resolution can be combined to support the description of different kinds of time-series data as shown below.

5. The temporal extent of a dataset is given using [`dcterms:temporal`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_temporal).
    The value is a [`dcterms:PeriodOfTime`](http://purl.org/dc/terms/PeriodOfTime).
    A number of options for expressing the details of a `dcterms:PeriodOfTime` are recommended in [6.15 Class: Period of Time](https://www.w3.org/TR/vocab-dcat-3/#Class:Period_of_Time).
    Examples of these follow.


### 10.2 Spatial properties

[Permalink for Section 10.2](https://www.w3.org/TR/vocab-dcat-3/#spatial-properties)

Two spatial properties of datasets may be described using DCAT.


1. The minimum spatial separation of items in a dataset is given using [`dcat:spatialResolutionInMeters`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution).
    The value is a decimal number.

   An example of the use of [`dcat:spatialResolutionInMeters`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial_resolution) is given in [Example 3](https://www.w3.org/TR/vocab-dcat-3/#ex-dataset).

2. The spatial extent of a dataset is given using [`dcterms:spatial`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_spatial).
    The value is a [`dcterms:Location`](http://purl.org/dc/terms/Location).
    A number of options for expressing the details of a `dcterms:Location` are recommended in [6.16 Class: Location](https://www.w3.org/TR/vocab-dcat-3/#Class:Location).

   Examples of these follow.


Note

## 11\. Versioning

[Permalink for Section 11.](https://www.w3.org/TR/vocab-dcat-3/#dataset-versions)

_This section is non-normative._

The notion of _version_ is often used as a generic term to denote some kind of relationship between a resource and a derived one. Examples, among others, include revisions, editions, adaptations, and translations.

This section focuses specifically on how to use DCAT to describe versions resulting from a revision - i.e., from changes occurring to a resource as part of its life-cycle.

For this purpose, DCAT builds upon existing vocabularies, in particular the versioning component of the \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\] ontology, and the relevant terms from \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\], \[[OWL2-OVERVIEW](https://www.w3.org/TR/vocab-dcat-3/#bib-owl2-overview "OWL 2 Web Ontology Language Document Overview (Second Edition)")\], and \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\].

It is important to note that versioning can be applied to any of the first class citizens DCAT resources, including Catalogs, Catalog Records, Datasets, Distributions.

Note also that the DCAT approach described in the following sections is meant to be complementary with those already used in specific types of resources (e.g., \[[OWL2-OVERVIEW](https://www.w3.org/TR/vocab-dcat-3/#bib-owl2-overview "OWL 2 Web Ontology Language Document Overview (Second Edition)")\] provides a set of versioning properties for ontologies), as well as in given domains and communities. For a comparison between the DCAT versioning approach and those of other vocabularies, see [11.4 Complementary approaches to versioning](https://www.w3.org/TR/vocab-dcat-3/#versioning-complementary-approaches).

Note

### 11.1 Relationships between versions

[Permalink for Section 11.1](https://www.w3.org/TR/vocab-dcat-3/#version-relationships)

DCAT supports the following kinds of relationships between versions:

1. Those indicating the version chain and hierarchy (the version history).
2. Those indicating whether a version is replaced/superseded by another one.

#### 11.1.1 Version chains and hierarchies

[Permalink for Section 11.1.1](https://www.w3.org/TR/vocab-dcat-3/#version-history)

DCAT defines specific properties for describing version history, aligned with the corresponding \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\] ones:

- [`dcat:previousVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version) (equivalent to [`pav:previousVersion`](https://pav-ontology.github.io/pav/#d4e459))
- [`dcat:hasVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version) (equivalent to [`pav:hasVersion`](https://pav-ontology.github.io/pav/#d4e395));

- [`dcat:hasCurrentVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version) (equivalent to [`pav:hasCurrentVersion`](https://pav-ontology.github.io/pav/#d4e359), and subproperty of `dcat:hasVersion`).

Property `dcat:previousVersion` is used to build a version chain that can be navigated backward from a given version to the first one. This reflects the most typical use case - i.e., linking different versions published as distinct resources in a catalog.

In addition to this, property `dcat:hasVersion` can be used to specify a version hierarchy, by linking an abstract resource to its versions.

If needed, the version hierarchy can be further described by specific properties. More precisely, property `dcat:hasCurrentVersion` link an abstract resource to snapshot corresponding to the current version of the content, whereas property `dcat:isVersionOf` (inverse of `dcat:hasVersion`) gives the possibility of specifying a back link from a version to the abstract resource (for the use of this property, see [7\. Use of inverse properties](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties)).

Note

Note that the only properties necessary to specify a version chain and hierarchy are, respectively, `dcat:previousVersion` and `dcat:hasVersion`. Whether to use or not the other ones depends on the requirements of the relevant use case.

The following example reuses those in [§ 8.6 Data Versioning](https://www.w3.org/TR/dwbp/#dataVersioning) of \[[DWBP](https://www.w3.org/TR/vocab-dcat-3/#bib-dwbp "Data on the Web Best Practices")\] and revises them to show how to specify a version chain and hierarchy on a bus stops dataset, by using the properties described in this section.

#### 11.1.2 Versions replaced by other ones

[Permalink for Section 11.1.2](https://www.w3.org/TR/vocab-dcat-3/#version-replace)

Another type of relationship concerns whether a given version replaces/supersedes another one. For this purpose, DCAT reuses the relevant \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] property, namely, [`dcterms:replaces`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_replaces), plus its inverse `dcterms:isReplacedBy`, in case a back link needs to be provided.

It is worth noting that these properties are not denoting by themselves a version chain - i.e., a version is not necessarily replacing its immediate predecessor.

The following example reuses the description of the MyCity bus stop dataset in [Example 33](https://www.w3.org/TR/vocab-dcat-3/#ex-version-chain-and-hierarchy) to show how replaced versions can be specified in DCAT.

### 11.2 Version information

[Permalink for Section 11.2](https://www.w3.org/TR/vocab-dcat-3/#version-info)

Besides the relationships illustrated in the previous section, versioned resources may be associated with additional information, describing, e.g., their differences with the original resource (the version "delta"), the version identifier, and release date.

For these purposes, DCAT makes use of the following properties:

- [`dcat:version`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version) (equivalent to [`pav:version`](https://pav-ontology.github.io/pav/#d4e395) \[[PAV](https://www.w3.org/TR/vocab-dcat-3/#bib-pav "PAV - Provenance, Authoring and Versioning. Version 2.3.1")\]), for the version name / identifier;
- [`dcterms:issued`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date) \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\], for the version release date;
- [`adms:versionNotes`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version_notes) \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\], for a textual description of the changes, including backward compatibility issues with the previous version of the resource.


Note

The following example reuses the one in \[[DWBP](https://www.w3.org/TR/vocab-dcat-3/#bib-dwbp "Data on the Web Best Practices")\]'s [Best Practice 7: Provide a version indicator](https://www.w3.org/TR/dwbp/#VersioningInfo) to show how version information can be specified in DCAT.

### 11.3 Resource life-cycle

[Permalink for Section 11.3](https://www.w3.org/TR/vocab-dcat-3/#life-cycle)

The life-cycle of a resource is an aspect orthogonal to versioning, and sometimes strictly related. The evolution of a resource along its life-cycle (from its conception, to its creation and publication) may result in new versions, although this is not always the case (e.g., in case an approval workflow is in place, the resource may not undergo any change if no revision is needed). Similarly, the creation of a new version may not necessarily lead to a change in status (e.g., when changes are not substantial, and/or are implemented on resources still in development). Moreover, when a resource is replaced because of a revision (correcting errors, adding new content, etc.), it may be moved to a different life-cycle status (e.g., deprecation or withdrawal).

It is worth noting that the status of a resource with respect to its life-cycle is often an important piece of information by itself, from both the data provider's and data consumers' perspectives. For a data consumer, it is important to know if a resource is still in development or not, as well as if it is deprecated or withdrawn (and, in such cases, if there is a new version to be used). On the other hand, for a data provider, flagging a resource with its status in the life-cycle is fundamental for the correct administration of the data management workflow. E.g., a resource before being published may need to be stable, and possibly flagged as approved and/or registered. Finally, besides the actual status of a resource, another useful piece of information is _when_ the resource moved to a different status (e.g., when it was created, reviewed, accepted, published).

As for versioning, the resource life-cycle depends on community practices, data management policies, and the workflows in place. Moreover, different resource types (e.g., datasets vs catalog records) may have different life-cycle statuses.

For the specification of life-cycle statuses, DCAT makes use of property [`adms:status`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_status) \[[VOCAB-ADMS](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-adms "Asset Description Metadata Schema (ADMS)")\], along with the appropriate \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] time-related properties (`dcterms:created`, `dcterms:dateSubmitted`, `dcterms:dateAccepted`, `dcterms:dateCopyrighted`, [`dcterms:issued`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date), [`dcterms:modified`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date), `dcterms:valid`). However, DCAT does not prescribe the use of any specific set of life-cycle statuses, but refers to existing standards and community practices fit for the relevant application scenario.

Note

### 11.4 Complementary approaches to versioning

[Permalink for Section 11.4](https://www.w3.org/TR/vocab-dcat-3/#versioning-complementary-approaches)

The DCAT versioning approach can coexist with existing versioning practices - as those used in specific communities, domains, and resource types.

As an example, the following table shows the correspondences between the DCAT versioning properties and the vocabularies most frequently used to specify similar concepts, namely, OWL, for ontologies, \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\], and \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\].

| DCAT | OWL | \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] | \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] |
| --- | --- | --- | --- |
| [`dcat:hasVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_version) |  | [`dcterms:hasVersion`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/hasVersion) | [`prov:generalizationOf`](https://www.w3.org/TR/prov-o/#inverse-names-table) |
| [`dcat:isVersionOf`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_is_version_of) |  | [`dcterms:isVersionOf`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/isVersionOf) | [`prov:specializationOf`](https://www.w3.org/TR/prov-o/#specializationOf) |
| [`dcat:hasCurrentVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_current_version) | `owl:versionIRI` |  |  |
| [`dcat:previousVersion`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous_version) | `owl:priorVersion` |  | [`prov:wasRevisionOf`](https://www.w3.org/TR/prov-o/#wasRevisionOf) |
| [`dcat:version`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_version) | `owl:versionInfo` |  |  |

Similar (but not equivalent) versioning properties in DCAT, OWL, \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\], and \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\]

Note that correspondence does not imply equivalence. These properties have different scopes and semantics, and therefore they can complement but not replace each other. In particular, OWL properties are meant to be used on resources that can be typed as `owl:Ontology`'s, whereas the \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] ones use a very broad notion of _version_ (including editions and adaptations). On the other hand, DCAT versioning properties are meant to be used on any resource in a catalog, and they use a very specific notion of _version_, as explained in the introduction to [11\. Versioning](https://www.w3.org/TR/vocab-dcat-3/#dataset-versions). Finally, the \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] property `prov:wasRevisionOf`, although semantically similar to `dcat:previousVersion`, is not explicitly meant to be used to build a version chain, whereas `prov:generalizationOf` and `prov:specializationOf` are semantically broader than their sub-properties `dcat:hasVersion` and `dcat:isVersionOf`, respectively.

The following example shows how DCAT and OWL can be used complementarily to versioning \[[VOCAB-DCAT-2](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-2 "Data Catalog Vocabulary (DCAT) - Version 2")\].

## 12\. Dataset series

[Permalink for Section 12.](https://www.w3.org/TR/vocab-dcat-3/#dataset-series)

_This section is non-normative._

With "dataset series" we refer to data, somehow interrelated, that are published separately. An example is budget data split by year and/or country, instead of being made available in a single dataset.

Dataset series are defined in \[[ISO-19115](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115 "Geographic information -- Metadata")\] as a collection of datasets \[…\] sharing common characteristics. However, their use is not limited to geospatial data, although in other domains they can be named differently (e.g., time series, data slices) and defined more or less strictly (see, e.g., the notion of "dataset slice" in \[[VOCAB-DATA-CUBE](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-data-cube "The RDF Data Cube Vocabulary")\]).

The reasons and criteria for grouping datasets into series are manyfold, and they may be related to, e.g., data characteristics, publishing process, and how they are typically used. For instance, data huge in size (as geospatial ones) are more easily handled (by data providers as well as data consumers) by splitting them into smaller ones. Another example is data released on a yearly basis, which are typically published as separate datasets, instead of appending the new data to the first in the series.

As there are no common rules and criteria across domains to decide when dataset series should be created and how they should be organized, DCAT does not prescribe any specific approach, and refer for guidance and domain- and community practices. The purpose of this section is limited to providing guidance on how dataset series can be specified in DCAT.

### 12.1 How to specify dataset series

[Permalink for Section 12.1](https://www.w3.org/TR/vocab-dcat-3/#dataset-series-specification)

Note

DCAT makes dataset series first class citizens of data catalogs by minting a new class [`dcat:DatasetSeries`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset_Series), defined as a subclass of [`dcat:Dataset`](https://www.w3.org/TR/vocab-dcat-3/#Class:Dataset).
The datasets are linked to the dataset series by using the property [`dcat:inSeries`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_in_series).

Note that a dataset series can also be hierarchical, and a dataset series can be a member of another dataset series.

Dataset series may evolve over time, by acquiring new datasets. E.g., a dataset series about yearly budget data will acquire a new child dataset every year. In such cases, it might be important to link the yearly releases with relationships specifying the first, previous, next, and latest ones. In such a scenario, DCAT makes use of properties [`dcat:first`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_first), [`dcat:prev`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_previous), and [`dcat:last`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_last), respectively. See [7\. Use of inverse properties](https://www.w3.org/TR/vocab-dcat-3/#inverse-properties) for `dcat:next`.

Datasets in a series can, of course, be versioned. In such a case, the dataset can be linked to its versions by using the approach illustrated in [11.1.1 Version chains and hierarchies](https://www.w3.org/TR/vocab-dcat-3/#version-history), as shown in [Example 39](https://www.w3.org/TR/vocab-dcat-3/#ex-dataset-series-and-versions).

Note

### 12.2 Dataset series metadata

[Permalink for Section 12.2](https://www.w3.org/TR/vocab-dcat-3/#dataset-series-properties)

Properties about dataset series can be classified into two groups.

The first group is about properties describing the dataset series itself. For instance, this is the case of property [`dcterms:accrualPeriodicity`](https://www.w3.org/TR/vocab-dcat-3/#Property:dataset_frequency), whose value should correspond to the frequency upon which a new child dataset is added.

The second group is about properties reflecting the dimensions described in child dataset metadata, via upstream inheritance - i.e., property values of child datasets are inherited by their parent (the dataset series).

Typically, this means that, for each of the relevant properties, the dataset series takes as value the union of those specified in child datasets. For instance:

- If the temporal coverage of child datasets is a different year, e.g., 2018, 2019, 2020, the temporal coverage of the series will be the time period between years 2018 and 2020.
- If child datasets have a different geographic bounding box as spatial coverage, the spatial coverage of the series will be the union of these bounding boxes (i.e., a bounding box including the ones of the child datasets).
- If each child dataset uses a different spatial reference system, the dataset series will have multiple spatial reference systems.

Finally, some annotation properties of child datasets may need to be taken into account as well at the level of dataset series. In particular, properties concerning the creation / publication / update dates of child datasets may affect the corresponding ones in the series. For these properties, DCAT recommends the following approach:

- The creation date (`dcterms:created`) of the dataset series should correspond to the earliest creation date of the child datasets.
- The publication date ( [`dcterms:issued`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_release_date)) of the dataset series should correspond to the earliest publication date of the child datasets.
- The update date ( [`dcterms:modified`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_update_date)) of the dataset series should correspond to the latest publication or update date of the child datasets.

Note

### 12.3 Dataset series in existing DCAT implementations

[Permalink for Section 12.3](https://www.w3.org/TR/vocab-dcat-3/#dataset-series-before-dcat3)

Existing DCAT implementations adopt two main alternative approaches to specifying dataset series:

1. The dataset series is typed as a `dcat:Dataset`, whereas its child datasets are typed as `dcat:Distribution`'s.
2. Both the dataset series and its child datasets are typed as a `dcat:Dataset`'s, and the two are usually linked by using the \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] properties `dcterms:hasPart` / `dcterms:isPartOf`.

In both cases, the dataset series is sometimes soft-typed by using the \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] property `dcterms:type` (e.g., this is the approach used in \[[GeoDCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap "GeoDCAT-AP: A geospatial extension for the DCAT application profile for data portals in Europe")\], and adopted in \[[DCAT-AP-IT](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap-it "Profilo metadatazione DCAT-AP_IT")\] and \[[GeoDCAT-AP-IT](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap-it "GeoDCAT-AP in Italy, the national guidelines published")\]).

These options are not formally incompatible with DCAT, so they can coexist with `dcat:DatasetSeries` during the upgrade to DCAT 3.

## 13\. Data citation

[Permalink for Section 13.](https://www.w3.org/TR/vocab-dcat-3/#data-citation)

_This section is non-normative._

[Dataset citation](https://www.w3.org/TR/dcat-ucr/#RDSC) is one of the requirements identified.
Data citation is the practice of referencing data in a similar way as when providing bibliographic references, acknowledging data
as a first class output in any investigative process. Data citation offers multiple benefits, such as supporting proper attribution
and credit to those producing the data, facilitating data discovery, supporting tracking the impact and reuse of data, allowing for
collaboration and re-use of data, and enabling the reproducibility of results based on the data.


To support data citation, the dataset description should include at a minimum: the dataset identifier, the dataset creator(s), the dataset title,
the dataset publisher and the dataset publication or release date. These elements are those required by the DataCite metadata schema \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\],
which is the metadata associated by the persistent identifiers (Digital Object Identifiers or DOIs) assigned by \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\] to research data.


In order to support data citation, DCAT 2 added the consideration of [dereferenceable identifiers](https://www.w3.org/TR/vocab-dcat-3/#dereferenceable-identifiers) and support for indicating
[the creators of the cataloged resources](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator). The remaining properties necessary for data citation were already available in DCAT 1 \[[VOCAB-DCAT-1](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-1 "Data Catalog Vocabulary (DCAT)")\].


The constraints on the availability of properties required for data citation in the dataset description can be represented as a DCAT data citation profile.


## 14\. Quality information

[Permalink for Section 14.](https://www.w3.org/TR/vocab-dcat-3/#quality-information)

_This section is non-normative._

Note

The Data Quality Vocabulary (DQV) \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\] offers common modeling patterns for different aspects of Data
Quality.
It can relate DCAT datasets and distributions with different types of quality information including:

- [`dqv:QualityAnnotation`](https://www.w3.org/TR/vocab-dqv/#dqv:QualityAnnotation), which represents feedback and quality certificates given about the dataset or its distribution.
- [`dqv:QualityPolicy`](https://www.w3.org/TR/vocab-dqv/#dqv:QualityPolicy), which represents a policy or agreement that is chiefly governed by data quality concerns.
- [`dqv:QualityMeasurement`](https://www.w3.org/TR/vocab-dqv/#dqv:QualityMeasurement), which represents a metric value providing quantitative or qualitative information about the dataset or distribution.

Each type of quality information can pertain to one or more quality dimensions, namely, quality characteristics relevant
to the consumer. The practice to see the quality as a multi-dimensional space is consolidated in the field of quality
management to split the quality management into addressable chunks. DQV does not define a normative list of quality
dimensions. It offers the quality dimensions proposed in ISO/IEC 25012 \[[ISO-IEC-25012](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-iec-25012 "ISO/IEC 25012 - Data Quality model")\] and \[[ZaveriEtAl](https://www.w3.org/TR/vocab-dcat-3/#bib-zaverietal "Quality assessment for Linked Data: A Survey")\]
as two possible starting points. It also provides an [RDF representation](https://www.w3.org/2016/05/ldqd)
for the quality dimensions and categories defined in the latter. Ultimately, implementers will need to choose themselves
the collection of quality dimensions that best fits their needs.
The following section shows how DCAT and DQV can be coupled to describe the quality of datasets and distributions.
For a comprehensive introduction and further examples of use, please refer to \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\].

Note

### 14.1 Providing quality information

[Permalink for Section 14.1](https://www.w3.org/TR/vocab-dcat-3/#quality-example1)

A data consumer (`ex:consumer1`) describes the quality of the dataset `ex:genoaBusStopsDataset`
that includes a georeferenced list of bus stops in Genoa. He/she annotates the dataset with a DQV quality note
(`ex:genoaBusStopsDatasetCompletenessNote`) about data completeness (`ldqd:completeness`) to
warn that the dataset includes only 20500 out of the 30000 stops.


The activity `ex:myQualityChecking` employs the service `ex:myQualityChecker` to check the
quality of the `ex:genoaBusStopsDataset` dataset. The metric `ex:completenessWRTExpectedNumberOfEntities`
is applied to measure the dataset completeness (`ldqd:completeness`) and it results in the quality measurement
`ex:genoaBusStopsDatasetCompletenessMeasurement`.


Other examples of quality documentation are available in \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\], including examples about
[how to express dataset accuracy and precision](https://www.w3.org/TR/vocab-dqv/#ExpressDatasetAccuracyPrecision).


### 14.2 Documenting conformance to standards

[Permalink for Section 14.2](https://www.w3.org/TR/vocab-dcat-3/#quality-conformance)

This section shows different modeling patterns combining \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\] with \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] and EARL \[[EARL10-Schema](https://www.w3.org/TR/vocab-dcat-3/#bib-earl10-schema "Evaluation and Report Language (EARL) 1.0 Schema")\] to represent the conformance degree to a stated quality standard and the details about the conformance tests.


#### 14.2.1 Conformance to a standard

[Permalink for Section 14.2.1](https://www.w3.org/TR/vocab-dcat-3/#quality-conformance-statement)

The use of [`dcterms:conformsTo`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/conformsTo) and
[`dcterms:Standard`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/Standard) is a well-known pattern
to represent the conformance to a standard. [Example 43](https://www.w3.org/TR/vocab-dcat-3/#ex-inspire-conformant-dataset), directly borrowed from \[[SDW-BP](https://www.w3.org/TR/vocab-dcat-3/#bib-sdw-bp "Spatial Data on the Web Best Practices")\] ( [Example 51](https://www.w3.org/TR/sdw-bp/#ex-geodcat-ap-dataset-conformance-with-specification)), declares a fictitious `dcat:Dataset`
conformant to the EU INSPIRE Regulation on interoperability of spatial data sets and services ( ["Commission Regulation (EU) No 1089/2010\\
of 23 November 2010 implementing Directive 2007/2/EC of the European Parliament and of the Council as regards\\
interoperability of spatial data sets and services"](http://data.europa.eu/eli/reg/2014/1312/oj)).

Another example concerns the specification of the coordinate reference system (CRS) used in a dataset - an information which is typically included in geospatial metadata. [Example 44](https://www.w3.org/TR/vocab-dcat-3/#ex-dataset-crs) shows how the CRS of a dataset can be specified in DCAT:

In [Example 44](https://www.w3.org/TR/vocab-dcat-3/#ex-dataset-crs), `http://www.opengis.net/def/crs/EPSG/0/28992` is an IRI from the OGC CRS Registry, corresponding to [EPSG:28992](https://epsg.io/28992) ("Amersfoort / RD New") (see also [Example 30](https://www.w3.org/TR/vocab-dcat-3/#ex-spatial-coverage-geometry-with-crs)).

Note

In order to ensure interoperability, it is important to consistently use the IRIs identifying the reference standards / specifications. In particular, DCAT recommends the following general rules:

- Use IRIs from reference registries, when available. Examples include the [W3C TR registry](https://www.w3.org/TR/), the [OGC Definitions Server](https://www.ogc.org/def-server), the [ISO OBP](https://www.iso.org/obp/ui).
- Use the IRI of the standard / specification, and not the namespace IRI. E.g., to express conformance of a `dcat:CatalogRecord` with DCAT, the IRI to be used is `https://www.w3.org/TR/vocab-dcat/`, and not `http://www.w3.org/ns/dcat#`.
- Use the canonical, persistent IRI. This is usually specified in the document itself. If you are in doubt, use the one included in the bibliographic citations for that standard / specification.
- Use the non-versioned IRI. If you need to express conformance with a specific version of the standard / specification, use both the un-versioned and the versioned IRI. E.g., in case you need to explicitly state conformance of a `dcat:CatalogRecord` with DCAT 2, use both `https://www.w3.org/TR/vocab-dcat/` and `https://www.w3.org/TR/vocab-dcat-2/`.

[Example 45](https://www.w3.org/TR/vocab-dcat-3/#ex-catalog-record-schema) extends [Example 9](https://www.w3.org/TR/vocab-dcat-3/#ex-catalog-record) to show how to specify that a given catalog record is conformant with DCAT, by following the above rules.

#### 14.2.2 Degree of conformance

[Permalink for Section 14.2.2](https://www.w3.org/TR/vocab-dcat-3/#quality-conformance-degree)

Some legal context requires to specify the degree of conformance. For example, INSPIRE metadata adopts a
specific controlled vocabulary \[[INSPIRE-DoC](https://www.w3.org/TR/vocab-dcat-3/#bib-inspire-doc "INSPIRE Registry: Degrees of conformity")\]
to express non-conformance and non-evaluation beside the full compliance. Similar controlled vocabularies can
be defined in other contexts.

[Example 47](https://www.w3.org/TR/vocab-dcat-3/#ex-conformance-degree) specifies some newly minted concepts representing the degree of conformance (i.e., conformant, not conformant) and declares the
[`dcterms:type`](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/type) for indicating
the result of conformance test. Following a pattern used in \[[GeoDCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap "GeoDCAT-AP: A geospatial extension for the DCAT application profile for data portals in Europe")\], the example uses a `prov:Entity` to model the conformance test (e.g.,
`ex:testResult`), a `prov:Activity` to model the testing activity (e.g.,
`ex:testingActivity`), a `prov:Plan` derived from the Data on the Web Best Practices \[[DWBP](https://www.w3.org/TR/vocab-dcat-3/#bib-dwbp "Data on the Web Best Practices")\] (e.g., `ex:conformanceTest`) to check for the whole set of best practices. A qualified PROV association binds the testing activity to the conformance test.

Note

Also, \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\] can be deployed to measure the compliance to a specific standard. In [Example 48](https://www.w3.org/TR/vocab-dcat-3/#ex-conformance-degree-percentage), the `ex:levelOfComplianceToDWBP` is a quality metrics which measures the compliance of a dataset to \[[DWBP](https://www.w3.org/TR/vocab-dcat-3/#bib-dwbp "Data on the Web Best Practices")\] in terms of the percentage of passed compliance tests. [Example 48](https://www.w3.org/TR/vocab-dcat-3/#ex-conformance-degree-percentage) assumes `iso` as a namespace prefix representing the quality dimensions and categories defined in the ISO/IEC 25012 \[[ISO-IEC-25012](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-iec-25012 "ISO/IEC 25012 - Data Quality model")\].

The quality measurement `ex:measurement_complianceToDWBP` represents the level of compliance for dataset `ex:Dataset`, namely, measurement of the metric `ex:levelOfComplianceToDWBP`. If only a part of the compliance tests succeeds (e.g., half of the compliance tests), the measurement would look like in [Example 49](https://www.w3.org/TR/vocab-dcat-3/#ex-conformance-test-partial-success).

#### 14.2.3 Conformance test results

[Permalink for Section 14.2.3](https://www.w3.org/TR/vocab-dcat-3/#quality-conformance-test-results)

Further information about the tests can be provided using EARL \[[EARL10-Schema](https://www.w3.org/TR/vocab-dcat-3/#bib-earl10-schema "Evaluation and Report Language (EARL) 1.0 Schema")\]. EARL provides specific
classes to describe the testing activity, which can be adopted in conjunction with \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\].
[Example 50](https://www.w3.org/TR/vocab-dcat-3/#ex-conformance-test-results-earl) describes the Testing activity `ex:testingActivity` as an `earl:Assertion`
instead of a qualified association on the `prov:Activity`. The `earl:Assertion` states
that dataset `ex:Dataset` has been tested with the conformance test `ex:conformanceTest`, and it
has passed the test as described in `ex:testResult`.


[Example 51](https://www.w3.org/TR/vocab-dcat-3/#ex-conformance-test-earl-fail) shows how the description would have looked like if the subtest `ex:testq1` had failed. In particular, `dcterms:description` and `earl:info` provide additional warnings or error messages in a human-readable form.

Depending on the details required about tests, \[[VOCAB-DQV](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dqv "Data on the Web Best Practices: Data Quality Vocabulary")\] can express the testing activity and errors as well. In [Example 52](https://www.w3.org/TR/vocab-dcat-3/#ex-conformance-test-error), `ex:error` is a quality annotation that represents the previous error, and `ex:testResult` is defined as a `dqv:QualityMetadata` to collect the above annotations and the compliance measurements providing provenance information.

Of course, the above modeling patterns can represent any quality tests, not only conformance to standards.

## 15\. Qualified relations

[Permalink for Section 15.](https://www.w3.org/TR/vocab-dcat-3/#qualified-forms)

_This section is non-normative._

DCAT includes elements to support description of many aspects of datasets and data services. Nevertheless, additional information is required in order to fully express the semantics of some relationships. An example is that, while \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] provides the standard roles **creator**, **contributor** and **publisher** for attribution of a resource to a responsible party or agent, there are many other potential roles, see for example the [`CI_RoleCode`](https://standards.iso.org/iso/19115/resources/Codelists/gml/CI_RoleCode.xml) values from \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\]. Similarly, while \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] and \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] provide some properties to capture relationships between resources, including **was derived from**, **was quoted from**, **is version of**, **references** and several others, many additional concerns are seen in the list of \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\] [`DS_AssociationTypeCodes`](https://standards.iso.org/iso/19115/resources/Codelists/gml/DS_AssociationTypeCode.xml), the IANA Registry of Link Relations \[[IANA-RELATIONS](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-relations "Link Relations")\], the DataCite metadata schema \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\]
and the [MARC relators](https://id.loc.gov/vocabulary/relators). While these relations could be captured with additional sub-properties of `dcterms:relation`, `dcterms:contributor`, etc., this would lead to an explosion in the number of properties, and anyway the full set of potential roles and relationships is unknown.


A common approach for meeting these kinds of requirements is to introduce an additional resource to carry parameters that qualify the relationship. Precedents are the [qualified terms](https://www.w3.org/TR/prov-o/#description-qualified-terms) in \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] and the [sample relations](https://www.w3.org/TR/vocab-ssn/#Sample_Relations) in the Semantic Sensor Network ontology \[[VOCAB-SSN](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-ssn "Semantic Sensor Network Ontology")\]. The general [Qualified Relation pattern](http://patterns.dataincubator.org/book/qualified-relation.html) is described in \[[LinkedDataPatterns](https://www.w3.org/TR/vocab-dcat-3/#bib-linkeddatapatterns "Linked Data Patterns: A pattern catalogue for modelling, publishing, and consuming Linked Data")\].


Many of the qualified terms from \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] are relevant to the description of resources in catalogs but these are incomplete due to the activity-centric viewpoint taken by PROV-O. Addressing some of the gaps, additional forms are included in the DCAT vocabulary to satisfy requirements that do not involve explicit activities. These are summarized in [Figure 6](https://www.w3.org/TR/vocab-dcat-3/#fig-dcat-relationships "Qualified relationships support an extensible set of roles relating resources to agents or to other resources"):


![UML model of DCAT qualified relationships](https://www.w3.org/TR/vocab-dcat-3/images/dcat-relationships.svg)[Figure 6](https://www.w3.org/TR/vocab-dcat-3/#fig-dcat-relationships)
 Qualified relationships support an extensible set of roles relating resources to agents or to other resources


Note that, while the focus of these qualified forms is to allow for additional _roles_ on a relationship, other aspect of the relationships, such as the applicable time interval, are easily attached when a specific node is used to describe the relationship like this (e.g., see the [chart of Influence relations](https://www.w3.org/TR/prov-o/#qualified-terms-figure) in \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\] for some examples).


Note

### 15.1 Relationships between datasets and agents

[Permalink for Section 15.1](https://www.w3.org/TR/vocab-dcat-3/#qualified-attribution)

The standard \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] properties [`dcterms:contributor`](http://purl.org/dc/terms/contributor), [`dcterms:creator`](http://purl.org/dc/terms/creator) and [`dcterms:publisher`](http://purl.org/dc/terms/publisher), and the generic [`prov:wasAttributedTo`](https://www.w3.org/TR/prov-o/#wasAttributedTo) from \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\], support basic associations of responsible agents with a cataloged resource.
However, there are many other roles of importance in relation to datasets and services - e.g., funder, distributor, custodian, editor.
Some of these roles are enumerated in the [`CI_RoleCode`](https://standards.iso.org/iso/19115/resources/Codelists/gml/CI_RoleCode.xml) values from \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\], in the \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\] metadata schema, and included within the [MARC relators](https://id.loc.gov/vocabulary/relators).


A general method for assigning an agent to a resource with a specified role is provided by using the qualified form [`prov:qualifiedAttribution`](https://www.w3.org/TR/prov-o/#qualifiedAttribution) from \[[PROV-O](https://www.w3.org/TR/vocab-dcat-3/#bib-prov-o "PROV-O: The PROV Ontology")\].
[Example 53](https://www.w3.org/TR/vocab-dcat-3/#ex-qualified-attribution) provides an illustration:


In [Example 53](https://www.w3.org/TR/vocab-dcat-3/#ex-qualified-attribution) the roles are denoted by IRIs from a non-normative, non-dereferenceable representation of the [`CI_RoleCode`](https://standards.iso.org/iso/19115/resources/Codelists/gml/CI_RoleCode.xml) codelist from \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\] (e.g., URN like `urn:example:isotc211/CI_RoleCode`). Linked data dereferenceable and normative representations should be preferred when available.

Note

### 15.2 Relationships between datasets and other resources

[Permalink for Section 15.2](https://www.w3.org/TR/vocab-dcat-3/#qualified-relationship)

The standard \[[DCTERMS](https://www.w3.org/TR/vocab-dcat-3/#bib-dcterms "DCMI Metadata Terms")\] properties [`dcterms:relation`](http://purl.org/dc/terms/relation) and sub-properties such as
[`dcterms:hasPart`](http://purl.org/dc/terms/hasPart) / [`dcterms:isPartOf`](http://purl.org/dc/terms/isPartOf),
[`dcterms:hasVersion`](http://purl.org/dc/terms/hasVersion) / [`dcterms:isVersionOf`](http://purl.org/dc/terms/isVersionOf),
[`dcterms:replaces`](http://purl.org/dc/terms/replaces) / [`dcterms:isReplacedBy`](http://purl.org/dc/terms/isReplacedBy),
[`dcterms:requires`](http://purl.org/dc/terms/requires) / [`dcterms:isRequiredBy`](http://purl.org/dc/terms/isRequiredBy),
[`prov:wasDerivedFrom`](https://www.w3.org/TR/prov-o/#wasDerivedFrom),
[`prov:wasQuotedFrom`](https://www.w3.org/TR/prov-o/#wasQuotedFrom),
support the description of relationships between datasets and other cataloged resources.
However, there are many other relationships of importance - e.g., alternate, canonical, original, preview, stereo-mate, working-copy-of.
Some of these roles are enumerated in the [`DS_AssociationTypeCodes`](https://standards.iso.org/iso/19115/resources/Codelists/gml/DS_AssociationTypeCode.xml) values from \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\], the IANA Registry of Link Relations \[[IANA-RELATIONS](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-relations "Link Relations")\], in the \[[DataCite](https://www.w3.org/TR/vocab-dcat-3/#bib-datacite "DataCite Metadata Schema")\] metadata schema, and included within the [MARC relators](https://id.loc.gov/vocabulary/relators).


A general method for relating a resource to another resource with a specified role is provided by using the qualified form [`dcat:qualifiedRelation`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_qualified_relation).
[Example 54](https://www.w3.org/TR/vocab-dcat-3/#ex-dataset-resource) provides illustrations:


In [Example 54](https://www.w3.org/TR/vocab-dcat-3/#ex-dataset-resource) the roles are denoted by IRIs from \[[IANA-RELATIONS](https://www.w3.org/TR/vocab-dcat-3/#bib-iana-relations "Link Relations")\] and from a (non-normative) [linked data representation](https://web.archive.org/web/20211206184420/http://registry.it.csiro.au/def/isotc211/DS_AssociationTypeCode) of the [`DS_AssociationTypeCode`](https://standards.iso.org/iso/19115/resources/Codelists/gml/DS_AssociationTypeCode.xml) codelist from \[[ISO-19115-1](https://www.w3.org/TR/vocab-dcat-3/#bib-iso-19115-1 "Geographic information -- Metadata -- Part 1: Fundamentals")\].

Note

## 16\. DCAT Profiles

[Permalink for Section 16.](https://www.w3.org/TR/vocab-dcat-3/#profiles)

_This section is non-normative._

The DCAT-2014 vocabulary \[[VOCAB-DCAT-1](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-1 "Data Catalog Vocabulary (DCAT)")\] and DCAT 2 \[[VOCAB-DCAT-2](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-2 "Data Catalog Vocabulary (DCAT) - Version 2")\] have been extended for application in data catalogs in different domains.
Each of these new specifications constitutes a DCAT profile, i.e., a named set of constraints based on DCAT (see [4\. Conformance](https://www.w3.org/TR/vocab-dcat-3/#conformance)). In some cases,
a profile extends one of the DCAT profiles themselves, by adding classes and properties for metadata fields not covered in the reference DCAT profile.


Some of the DCAT profiles are:

- DCAT-AP \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]: The DCAT application profile for data portals in Europe
- GeoDCAT-AP \[[GeoDCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap "GeoDCAT-AP: A geospatial extension for the DCAT application profile for data portals in Europe")\]: Geospatial profile of \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]
- StatDCAT-AP \[[StatDCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-statdcat-ap "StatDCAT-AP – DCAT Application Profile for description of statistical datasets. Version 1.0.1")\]: Statistical profile of \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]
- DCAT-AP\_IT \[[DCAT-AP-IT](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap-it "Profilo metadatazione DCAT-AP_IT")\]: Italian profile of \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]
- GeoDCAT-AP\_IT \[[GeoDCAT-AP-IT](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap-it "GeoDCAT-AP in Italy, the national guidelines published")\]: Italian profile of \[[GeoDCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-geodcat-ap "GeoDCAT-AP: A geospatial extension for the DCAT application profile for data portals in Europe")\]
- DCAT-AP-NO \[[DCAT-AP-NO](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap-no "Standard for beskrivelse av datasett, datatjenester og datakataloger (DCAT-AP-NO)")\]: Norwegian profile of \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]
- DCAT-AP.de \[[DCAT-AP.de](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap.de "Vokabulare und Dokumente für DCAT-AP.de")\]: German profile of \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]
- DCAT-BE \[[DCAT-BE](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-be "Linking data portals across Belgium.")\]: Belgian profile of \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]
- DCAT-AP-SE \[[DCAT-AP-SE](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap-se "DCAT-AP-SE: Clarifications, translations and explanations of DCAT-AP for Sweden")\]: Swedish profile of \[[DCAT-AP](https://www.w3.org/TR/vocab-dcat-3/#bib-dcat-ap "DCAT Application Profile for data portals in Europe. Version 2.0.1")\]

## 17\. Security and Privacy Considerations

[Permalink for Section 17.](https://www.w3.org/TR/vocab-dcat-3/#security_and_privacy)

The DCAT vocabulary supports datasets that may contain personal or private information. In addition, the metadata expressed with DCAT may itself contain personal or private information, such as resource [creators](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_creator), [publishers](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_publisher), and other parties or agents described via [qualified relations](https://www.w3.org/TR/vocab-dcat-3/#qualified-forms).
Implementers who produce, maintain, publish or consume such vocabulary terms must take steps to ensure security and privacy considerations are addressed. Sensitive data and metadata must be stored securely and made available only to authorized parties, in accordance with the legal and functional requirements of the type of data involved. Detailing how to secure web content and authenticate users is beyond the scope of DCAT.


Some datasets require assurances of integrity and authenticity (for example, data about software vulnerabilities). For these, checksums can serve as a type of verification.
DCAT borrows the [`spdx:Checksum`](https://www.w3.org/TR/vocab-dcat-3/#Class:Checksum) class from \[[SPDX](https://www.w3.org/TR/vocab-dcat-3/#bib-spdx "SPDX 2.2")\] to ensure the integrity and authenticity of DCAT distributions. Publishers may provide a checksum value (a hash) and the algorithm used to generate the hash for each resource in the distribution. A checksum must, however, be provided via a route that is separate from the data it sums. It may be included in metadata that is provided with the data (e.g., a tarfile that includes a file for the distribution and a file for the metadata that includes a checksum for the distribution file), but if so the checksum, or a checksum for the metadata, must also be provided separately to foil an attacker who would manipulate the checksum along with the data. A checksum provided in DCAT metadata will not provide the expected assurances if the integrity and authenticity of the metadata are not also guaranteed.


Integrity and authenticity of DCAT data ultimately depend on the trustworthiness of the source. DCAT providers should address integrity and authenticity at the application level and transport level. For example, they should ensure the integrity and authenticity of their API and download endpoints, make DCAT data and metadata files downloadable from authoritative HTTPS origins, and provide any checksums via a separate channel from the data they represent.


## 18\. Accessibility Considerations

[Permalink for Section 18.](https://www.w3.org/TR/vocab-dcat-3/#accessibility)

The DCAT vocabulary provides a model for describing data catalogs. The nature of data in the catalogs depends on the specific domains of application and might include non-text data. When possible, it is important to enforce alternative text for non-text data resources through the DCAT profile mechanisms or systems supporting the creation and editing of such data to improve the accessibility to data. The practice to provide text alternatives for any non-text content, which can be changed into other forms people need, such as large print, braille, speech, symbols, or simpler language complies with accessibility guidelines included in \[[UNDERSTANDING-WCAG20](https://www.w3.org/TR/vocab-dcat-3/#bib-understanding-wcag20 "Understanding WCAG 2.0")\].


## A. Acknowledgments

[Permalink for Appendix A.](https://www.w3.org/TR/vocab-dcat-3/#acknowledgments)

The editors gratefully acknowledge the contributions made to this document by [all members of the working group](https://www.w3.org/groups/wg/dx/participants), especially

Annette Greiner,
Antoine Isaac,

Dan Brickley,


Karen Coyle,
Lars G. Svensson,

Makx Dekkers,
Nicholas Car,
Rob Atkinson,
Tom Baker.



The editors would also like to thank the following for comments received:

Addison Phillips,
Alex Nelson,
Andreas Geißner,
Andreas Kuckartz,
Anna Odgaard Ingram,

Aymen Charef,
Bart Hanssens,
Becky Gibson,
Bert van Nuffelen,
Bob Coret,
Brian Donohue,
Chavdar Ivanov,



Claus Stadler,

Cristiano Longo,
Christophe Dzikowski,


Dimitris Zeginis,
Dominik Schneider,
Emidio Stani,


Ivo Velitchkov,
Jakob Voß,
Jakub Klímek,
Jan Voskuil,

Jim J. Yang,
Joep Meindertsma,
Joep van Genuchten,
Katherine Anderson Aur,


Ludger A. Rinsche,

Marielle Adam,
Martial Honsberger,
Mathias Bonduel,
Mathias Richter,

Matthias Palmér,


Nancy Jean,
Nuno Freire,
Øystein Åsnes,

Paul van Genuchten,

Pieter J. C. van Everdingen,
Renato Iannella,
Rajaram Kaliyaperumal,
Robin Gower,

Sabine Maennel,
Sebastian Hellman,

Simson L. Garfinkel,
Siri Jodha S. Khalsa,

Stefan Ollinger,
Stephen Richard,
Stian Soiland-Reyes,
Stig B. Dørmænen,

Susheel Varma,
Sidney Cox,
Thomas Francart,

Vittorio Meloni,

Wouter Beek,
Yves Coene.



The editors also gratefully acknowledge the chairs of this Working Group: Caroline Burle and Peter Winstanley — and staff contacts Philippe Le Hégaret and Pierre-Antoine Champin.

## B. Alignment with Schema.org

[Permalink for Appendix B.](https://www.w3.org/TR/vocab-dcat-3/#dcat-sdo)

_This section is non-normative._

Note

Schema.org \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] includes a number of types and properties based on the original DCAT work (see [sdo:Dataset](https://schema.org/Dataset) as a starting point),
and the index for Google's [Dataset Search service](https://g.co/datasetsearch) relies on structured description in Web pages about datasets using both
[schema.org and DCAT](https://developers.google.com/search/docs/data-types/dataset).
A comparison of the DCAT backbone, shown in [Figure 1](https://www.w3.org/TR/vocab-dcat-3/#fig-dcat-all-attributes "Overview of DCAT model, showing the classes of resources that can be members of a Catalog, and the relationships between them. Except where specifically indicated, DCAT does not provide cardinality constraints.") above with the related classes from \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] in [Figure 7](https://www.w3.org/TR/vocab-dcat-3/#UML_SchemaOrg_Data_Cat "schema.org support for dataset catalogs, showing a selection of schema.org properties related to the classes shown") shows the similarity, in particular: .


- the distinction between (abstract) Dataset and (concrete) DataDownload matches dcat:Dataset / dcat:Distribution

- the relationship of Datasets to DataCatalogs


![UML model of schema.org classes and properties related to dataset catalogs](https://www.w3.org/TR/vocab-dcat-3/images/schema.org-dataset.svg)[Figure 7](https://www.w3.org/TR/vocab-dcat-3/#UML_SchemaOrg_Data_Cat)
 schema.org support for dataset catalogs, showing a selection of schema.org properties related to the classes shown


General purpose Web search services that use metadata at all rely primarily on \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\], so the relationship of DCAT to \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] is of interest for data providers and catalog publishers who wish their datasets and services to be exposed through those indexes.


A [mapping between DCAT 1 and schema.org](https://www.w3.org/wiki/WebSchemas/Datasets) was discussed on the original proposal to extend \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] for describing datasets and data catalogs.
Partial mappings between DCAT 1 \[[VOCAB-DCAT-1](https://www.w3.org/TR/vocab-dcat-3/#bib-vocab-dcat-1 "Data Catalog Vocabulary (DCAT)")\] and \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] were provided earlier by the
[Spatial Data on the Web Working Group](https://www.w3.org/2015/spatial/wiki/ISO_19115_-_DCAT_-_Schema), building upon previous work.


A recommended mapping from the revised DCAT (this document) to \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] version 3.4 is [available in an RDF file](https://w3c.github.io/dxwg/dcat/rdf/dcat-schema.ttl).
This mapping is axiomatized using the predicates `rdfs:subClassOf`, `rdfs:subPropertyOf`, `owl:equivalentClass`, `owl:equivalentProperty`, `skos:closeMatch`,
and also using the annotation properties `sdo:domainIncludes` and `sdo:rangeIncludes` to match \[[SCHEMA-ORG](https://www.w3.org/TR/vocab-dcat-3/#bib-schema-org "Schema.org")\] semantics. The alignment is summarized in the table below, considering the prefix `sdo` as `http://schema.org/`.


| DCAT element | Target element from schema.org |
| --- | --- |
| **dcat:Resource** | **sdo:Thing** |
| dcterms:title | sdo:name |
| dcterms:desc
…[truncated]