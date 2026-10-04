Source: https://media.x.ai/v1/website/4p7card-5eccc980.pdf
Title: 
Fetched: 2026-10-04T08:24:21.586Z

# ModelCard: Grok4.7

September 21, 2026

* * *

## Contents

1 Introduction
1.1 Overview . . . . . . . . . . . . . . . . . .
1.2 Model development and training .

2 Coding capabilities
2.1 CursorBench 4.0 . . . . . . . . . . . . . .
2.2 DeepSWE v1.1 . . . . . . . . . . . . . .
2.3 Terminal-Bench 4.0 . . . . . . . . . . . .
2.4 FrontierSWE V2 . . . . . . . . . . . .
2.5 SWE-Marathon v1.1 .

3 Knowledge-work capabilities
3.1 Legal Agent Benchmark . . . . . . . . . . .

4 Engineering acceleration
4.1 EEBench . . . . . . . . . . . . . . . . .
4.2 CADGenBench . . . . . . . . . . . . . .

5 Medical and biological capabilities
5.1 HealthBench Professional . . . . . . . . .
5.2 LatchBio Capabilities v1.0 . . . . . . . .

6 Cyber capabilities and safeguards
6.1 CyberGym . . . . . . . . . . . . . . . . .
6.2 CVE-Bench . . . . . . . . . . . . . . . .
6.3 HackerBench v0.3 . . . . . . . . . . .
6.4 CathedralBench . . . . . . . . . . . .

7 Biological and chemical capabilities and safety
7.1 BioSecBench . . . . . . . . . . . . . .
7.2 Virology Capabilities Test (VCT) . . . .
7.3 Biosecurity VCT . . . . . . . . . . . .

3
3
4

5
5
7
8
9
10

11
11

12
12
13

14
14
15

16
16
17
17
18

guards 19
19
20
20

* * *

## GROK4.7MODELCARD

7.4 BioUseBench . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
7.5 WMDP dual-use knowledge (MCQ) . . . . . . . . . . . . . . . . . 21
7.6 LAB-Bench practical MCQ . . . . . . . . . . . . . . . . . . . . . 21
7.7 ProtocolQA Open-Ended . . . . . . . . . . . . . . . . . . . . . . 21
7.8 BixBench zero-shot MCQ . . . . . . . . . . . . . . . . . . . . . 22

8 Jailbreaks and robustness 22
8.1 Jailbreaks . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22

9 General output safety **23**
9.1 General refusals . . . . . . . . . . . . . . . . . . . . . . . . . 23
9.2 Child safety . . . . . . . . . . . . . . . . . . . . . . . . . . . 24
9.3 CBRN / weapons refusals . . . . . . . . . . . . . . . . . . . . . 24

10 Mental health **25**
10.1 Self-harm refusals . . . . . . . . . . . . . . . . . . . . . . . 25

**11 Behaviors 25**
11.1 MASK-Rectified . . . . . . . . . . . . . . . . . . . . . . . . . 25
11.2 Sycophancy . . . . . . . . . . . . . . . . . . . . . . . . . . 26

**References 28**

* * *

## 1 Introduction

Grok4.7isSpaceXAI’s\* latestmodel. ItextendsGrok4.6,demonstratinggreatercapability
andautonomyoncoding†,engineering,andofficeworktasks.

Itisourmostcapablemodeltodate.

## 1.1 Overview

Grok4.7iscapableofautonomouslycompletinglongerandmorechallengingtasksthan
anyofourpreviousmodels,reachingresultswithfewerstepsandfeweroutputtokensthan
otherfrontiermodels.

TheprimarypurposeofthismodelcardistodetailthecapabilitiesofGrok4.7in
quantitativeandobjectiveterms,toindicatewherethismodelismostuseful. Wedocument
safetydomains(cyber,bioknowledge,bioagentic,jailbreaks/robustness,generaloutput
safetyincludingCBRNrefusals,mentalhealth,andbehaviors)andoursafeguardsbelow.
Eachevaluationunderacapabilityorsafetysectionhasitsownsubsection. Unlessstated
otherwise,evaluationresultsareonthefinaldeployedcheckpointofGrok4.7.

Weneversilentlydowngradeintelligenceorfallbacktoothermodels. Ourgoalisto
preservelegitimateusesofthemodel: engineeringandcreativework,scientificresearch,
hardeningcriticalinfrastructure,andAIresearch.

Themodel’suseissubjectto SpaceXAI’sAcceptableUsePolicy¹,applicableConsumer
andEnterpriseTermsofService,andanyapplicablelaws. Grok4.7isnotintendedfor
autonomoushigh-stakesdecision-makingindomainssuchasmedicine,law,finance,or
safety-criticalsystemswithoutappropriatehumanoversightanddomain-expertvalidation.

- SpaceXAIisadoing-business-as(DBA)nameofXAILLC.xAIandSpaceXAImaybeusedinterchangeably
  throughoutthiscard.

†Grok4.7receivedsupplementaltrainingonanonymizedCursorworkflowdatatoimprovecodingand
agenticperformance.

* * *

Grok4.7isprimarilyatextmodel: itacceptsnatural-languagetextandimagesasinputand
producestextasoutput. Itisavailableforusethroughthefollowingchannels:

• SpaceXAIAPI:Availablefromtheconsoleatconsole.x.ai;APIuserscancallGrok4.7
throughthestandardchatandcompletionsendpoints.

• GrokBuild: ThedefaultmodelinSpaceXAI’sterminal-basedcodingagent,available
throughboththeAPIandtheCLI.

• Cursor: Availabletoallusers,oneveryplantier.

• Officeadd-ins: ThedefaultmodelintheGrokbySpaceXAIadd-insforMicrosoftWord,
PowerPoint,andExcel.

• Modelgateways: ReachablethroughOpenRouter,Vercel,Cloudflare,Snowflake,
DatabricksMosaic,andothers.

SpaceXAIplanstoaddGrok4.7toitsconsumersurfaces(web,mobileapps,andGrok-in-X
ontheXplatform)atalaterdate.

## 1.2 Modeldevelopmentandtraining

Grok4.7waspretrainedonpubliclyavailabledata,datageneratedinternally,aswellas
otherdatatowhichSpaceXAIhassecuredthenecessaryrights,followedbysupplemental
trainingandpost-trainingwithsupervisedfine-tuning(SFT)andreinforcementlearning
(RL)onhumanandsyntheticrewardsignals.

SupplementaltrainingforGrok4.7ranlongerthanforGrok4.6,combiningmodel-generated
datacuratedforreasoningandadvancedtechnicalconcepts,high-qualityengineering
corpora,andanimprovedoptimizerandrecipe. Grok4.6modelswereusedtogenerate
SFTtrajectoriesacrossreasoningefforts,agentharnesses,anddomainsspanning
STEM,softwareengineering,andknowledgework,withmodel-basedchecksscreening
outproblematictraces. AgenticRLcoveredknowledgework,generalcoding,and
purpose-builtenvironmentsforkerneloptimization,webdevelopment,andcomputer-aided
design.

Grok4.7hasapretrainingdatacutoffofJune2026,andusesdatageneratedaslateas
August2026initssupplementaltraining.

* * *

## 2 Coding capabilities

Grok 4.7 is built for strong coding performance across wide-ranging domains of software engineering, problem-solving, and software-engineering-adjacent tasks.

Grok 4.7's other abilities (in office work, engineering, and CAD) depend on well-developed baseline coding capabilities: an agent that reads, writes, and runs code is a prerequisite for expressive interaction with any digital tool, file, or workflow.

We primarily evaluate coding on agentic benchmarks of real-world software engineering, problem-solving, and software-engineering-adjacent tasks, such as SRE and observability. These benchmarks cover Cursor IDE-style agent workflows, repository-level issue resolution, terminal use, and other software-engineering-relevant use cases.

## 2.1 CursorBench 4.0 2

$$
4.0^{2}
$$

CursorBench 4.0 evaluates coding agents on long-horizon coding tasks from real Cursor sessions. Version 4.0 adds longer-horizon tasks, so its scores are not comparable with CursorBench 3.2. Grok 4.7 improves on long-horizon coding tasks by thoroughly considering edge cases, working persistently on difficult problems, and self-verifying more effectively. Grok 4.7 scores 46.3% at xhigh and 43.9% at high.

| Average output tokens per task | Sonnet 5 (%) | Fable 5.1 (%) | Opus 5– (%) | Grok 4.7 (%) | Grok 4.6 (%) |
| --- | --- | --- | --- | --- | --- |
| 150k | 34.2 |  |  |  |  |
| 130k |  | 51.8 |  |  |  |
| 100k |  | 51.7 |  |  |  |
| 80k |  |  | 46.5 |  |  |
| 75k |  |  |  | 46.3 |  |
| 65k |  |  | 46.3 |  |  |
| 60k |  |  |  |  | 41.1 |
| 50k |  |  |  |  | 41.3 |
| 45k |  |  |  |  |  |
| 40k |  |  |  |  |  |
| 35k |  |  |  |  |  |
| 30k |  |  |  |  |  |
| 25k | 24.0 |  |  |  | 36.1 |
| 20k |  |  |  |  |  |
| 15k |  |  |  |  |  |
| 10k |  |  |  |  |  |
| 0 |  |  |  |  |  |

* * *

**Score vs cost**

| Average cost per task | Fable 5.1 (%) | Opus 5 (%) | Grok 4.7 (%) | Grok 4.6 (%) | GPT-5.6 Sol- (%) | Sonnet 5 (%) |
| --- | --- | --- | --- | --- | --- | --- |
| $18.3 | 51.8 |  |  |  |  |  |
| $16.8 | 51.6 |  |  |  |  |  |
| $12.1 |  | 46.6 |  |  |  |  |
| $12.2 |  | 46.1 |  |  |  |  |
| $9.2 |  |  |  | 44.6 |  |  |
| $9.3 | 49.1 |  |  |  |  |  |
| $9.4 |  |  |  |  | 41.7 |  |
| $9.5 |  |  |  |  |  | 34.1 |
| $9.6 |  |  |  |  |  | 34.2 |
| $9.7 |  |  |  |  |  | 43.1 |
| $9.8 |  |  |  |  |  |  |
| $9.9 |  |  |  |  |  |  |
| $6.1 |  |  | 46.2 | 41.3 |  |  |
| $6.2 |  |  |  | 40.8 |  |  |
| $6.3 |  |  |  | 40.3 |  |  |
| $6.4 |  |  |  |  | 37.7 |  |
| $6.5 |  |  |  |  |  | 32.0 |
| $6.6 |  |  |  |  |  | 32.0 |
| $6.7 |  |  |  |  |  | 37.5 |
| $6.8 |  |  |  |  |  | 30.8 |
| $6.9 |  |  |  |  |  | 36.1 |
| $3.1 |  |  |  | 35.5 |  |  |
| $3.2 |  |  |  | 33.5 |  |  |
| $3.3 |  |  |  |  | 31.0 |  |
| $3.4 |  |  |  |  |  | 28.0 |
| $3.5 |  |  |  |  |  | 23.8 |
| $3.6 |  |  |  |  |  | 33.1 |
| $3.7 |  |  |  |  |  | 24.5 |
| $3.8 |  |  |  |  |  | 24.6 |

* * *

## 2.2 DeepSWEv1.1 3

2.2 DeepSWEv1.1 3

DeepSWEv1.1evaluatescodingagentson113original,long-horizonsoftwareengineering
tasksacross91activerepositoriesandfivelanguages. Tasksarewrittenfromscratchrather
thanminedfromexistingcommitsorpullrequests,keepingtheirreferencesolutionsoutof
thepublicrecord. Hand-writtenverifierstesttherequestedbehaviorandacceptalternative
correctimplementations.

Everymodelrunsthroughthemini-SWE-agentharness. Eachcommittedpatchis
extracted,appliedtoapristineverifiercontainer,andgradedindependentlyoftheagent’s
runtimeenvironment. Grok4.7scores71.0%at high.

| Category | Pass@1 (%) |
| --- | --- |
| GPT-5.6 Sol (max) | 72.7 |
| Grok 4.7 (high) | 71.0 |
| Fable 5 (max, with fallback) | 69.7 |
| Grok 4.6 (high) | 65.2 |
| Sonnet 5 (max) | 54 |

- ResultsreportedaretakenfromevaluationsconductedbyDatacurve.

* * *

## 2.3 Terminal-Bench 4.0 5

Terminal-Bench 4.0 consists of 66 difficult technical workflows in real terminal environments, spanning software, machine learning, science, operations, security, hardware, and media. Each task has a programmatic verifier. Version 4.0 recalibrates CPU, memory, and time budgets, gives agents up to eight hours, fixes unstable tasks, and removes tasks that were saturated.

Grok 4.7 scores 38.0% at xhigh, evaluated with the Grok Build harness. Grok 4.6 scores 20.3% at high.

The resolution rate measures end-to-end terminal execution, including planning, tool use, recovery, and verification. The recalibrated resources reduce infrastructure-driven failures, but absolute scores remain sensitive to the agent harness.

| Category | Task success rate (%) |
| --- | --- |
| Fable 5.1 (max) | 57.9 |
| Grok 4.7 (xhigh) | 38.0 |
| GPT–5.6 Sol (max) | 37.3 |
| GPT–5.6 Terra (max) | 21.5 |
| Grok 4.6 (high) | 20.3 |
| Grok 4.5 (high) | 12.4 |
| Sonnet 5 (max) | 12.4 |

Task success rate (%) \*

- Results reported are taken from evaluations conducted by Harbor.

* * *

## 2.4 FrontierSWE V2 6

FrontierSWE V2 evaluates coding agents on 34 ultra-long-horizon challenges spanning systems implementation, performance engineering, scientific computing, visual reasoning, and AI research. Agents receive up to 20 hours per task, and task-specific verifiers award scores from zero to one so meaningful partial progress is visible when complete solutions remain rare. The public protocol runs five trials per task and reports mean@5 across the task set.

The headline score is an average partial-credit reward, not task resolution or FrontierSWE V1 Dominance. Public V2 results use Proximal's Proximus harness at maximum effort. Grok 4.7 scores 29.0% at xhigh, evaluated by Proximal Labs; Grok 4.6 scores 25.3% at xhigh.

| Category | Mean@5 score (%) |
| --- | --- |
| Fable 5.1 (max) | 56.3 |
| GPT–5.6 Sol (max) | 32.2 |
| Grok 4.7 (xhigh) | 29.0 |
| Kimi K3 (max) | 25.9 |
| Grok 4.6 (xhigh) | 25.3 |

- Results are taken from evaluations conducted by Proximal Labs.

* * *

## 2.5 SWE-Marathon v1.1 7

SWE-Marathon v1.1 evaluates autonomous completion of 20 realistic, multi-hour software engineering tasks spanning library reproductions, product clones, machine-learning work and performance optimization. Task-specific verifiers combine hidden tests, behavioral parity checks, performance gates, integrity checks, and computer-use review where interface quality matters.

The benchmark runs eight trials per task, and a trial counts as resolved only when every verifier passes. Because models run in their native agent harnesses, scores reflect the complete model-agent system. Grok 4.7 scores 46.0% at high.

| Category | Resolution rate (%) |
| --- | --- |
| Opus 5 (max) | 50.0 |
| Grok 4.7 (high) | 46.0 |
| Fable 5 (max, with fallback) | 45.0 |
| GPT–5.6 Sol (max) | 42.5 |
| GPT–5.6 Terra (max) | 32.5 |
| Grok 4.6 (high) | 31.9 |
| Sonnet 5 (max) | 30.0 |

Resolution rate (%) \*

- Results reported are taken from evaluations conducted by Abundant AI.

* * *

## 3 Knowledge-workcapabilities

Weevaluateperformanceonprofessionalknowledge-workandstructuredagenttasks
relevanttoofficeandproductivityusecases,inordertoquantifyGrok4.7’sutilityin
assisting,accelerating,andautomatingknowledgework. Weselectthesebenchmarksfor
task-anddomain-diversity,aswellasforalignmentwithsubjectiveuserexperiencesof
performance(thatis,ahigherscoreisconsistentwithamaterialimprovementintheutility
ofthetestedmodelandthequalityofproducedartifacts).

Onalltesteddomains,Grok4.7demonstratesfrontierornear-frontierperformance.

## 3.1 LegalAgentBenchmark⁸

TheLegalAgentBenchmarkevaluateslong-horizonlegalworkorganizedaroundrealistic
clientmatters. Agentsusesixfileandterminaltoolsplusdocument,presentation,and
spreadsheetskillstoproduceworkagainsttask-specificcriteria.

WereportValsAI’sheld-out120-taskrunintheValkyrieharnesswithinternetaccess
disabled. Harvey’sfinalscoreaveragestwojudges’taskpassrates;eachjudgemarksa
taskaspassedonlywheneverycriterionpasses. Grok4.7scores19.6%at xhigh.

| Category | Harvey final score (%) |
| --- | --- |
| Grok 4.7 (xhigh) | 19.6 |
| Grok 4.6 (high) | 15.8 |
| Fable 5 (max, with fallback) | 11.3 |
| Fable 5.1 (max, with fallback) | 6.7 |
| Sonnet 5 (max) | 5.0 |
| GPT–5.6 Sol (max) | 2.5 |
| GPT–5.6 Terra (max) | 0.8 |

Harveyfinalscore(%)\*

- ResultsaretakenfromevaluationsconductedbyValsAI.

* * *

## 4 Engineeringacceleration

Engineeringrepresentsoneofthecoredomainswhereimprovedagentcapabilitiesdirectly
supporttheaccelerationoftechnologicaldevelopment: agentsthatacceleraterocket
design,IClayout,anddatacenterpower-and-coolingoptimizationcompressthetimelines
ofprogressacrossthephysicalsystemsthatenablefurtheradvancesinAIcapabilitiesand
utility.

WeevaluateGrok4.7onagentictasksthatacceleratephysical-worldengineering(i.e. all
engineeringnotpurelywithinthesoftwaredomain): electricalandchipdesign,parametric
CADgeneration,andrelatedworkflowswheremodelsmustreasonaboutgeometry,
materials,andrealdevicesratherthanrepositoriesalone.

## 4.1 EEBench¹⁰

EEBenchisanelectricalengineeringandchipdesignbenchmark: modelsdesigncircuits
andotherhardwarethataregradedforphysicalcorrectnessandfunctionality.\* Grok4.7is
evaluatedwiththeGrokBuildharness;peermodelsusetheirrespectiveproviderharnesses.
Grok4.7scores66.0%at xhigh,comparedwith60.0%forGrok4.6at xhigh. GPT-6Astra
(max)scores69.3%. Opus5(max)scores61.6%.

| Category | Reward (%) |
| --- | --- |
| GPT–6 Astra (max) | 69.3 |
| Grok 4.7 (xhigh) | 66.0 |
| Opus 5 (max) | 61.6 |
| Grok 4.6 (xhigh) | 60.0 |
| Fable 5 (max, with fallback) | 54.2 |
| Grok 4.6 (high) | 53.0 |
| GPT–5.6 Sol (max) | 39.4 |

- AspartoftheV1corecorpusofthebenchmark.

†
ResultsaretakenfromevaluationsconductedbyAtopile.

* * *

## 4.2 CADGenBench¹¹

CADGenBenchevaluatesagentsonCADmodelconstructionfromdesignprompts. We
reportthegenerationsplitofthebenchmark: themodelmustproduceCADgeometry
gradedforexecutabilityandgeometriccorrectness.

Grok4.7scores44.4%at high,evaluatedwiththeGrokBuildharness;peermodelsuse
theirrespectiveproviderharnesses.

| Category | Generation split (%) |
| --- | --- |
| Grok 4.7 (high) | 44.4 |
| Grok 4.6 (high) | 40.9 |
| GPT–5.6 Sol (xhigh) | 37.1 |
| Opus 5 (max) | 36.6 |

- ResultsaretakenfromevaluationsconductedbyMecado.

* * *

## 5 Medicalandbiologicalcapabilities

Thissectioncoversclinicalcommunicationandagenticbiologicaldataanalysis:
HealthBenchProfessionalforrealistichealthcareconversations,andtheLatchBio
capabilitybenchmarksuite.

## 5.1 HealthBenchProfessional

HealthBench-Professionalisanopen-sourcebenchmarkformeasuringsafety,accuracy,
andcommunicationinrealistichealthcaresettings. Grok4.7scores56.7%at xhigh on
HealthBenchProfessional,upfrom48.5%forGrok4.6at xhigh. Itimprovesoncomplex
clinicalreasoningandgivesmorecomplete,relevantanswers,handlingnuancedclinical
constraintsmoreaccurately.

Grok4.6(high)wasusedasthegradermodelforGrok4.7results;FableandAstraresults
arefromproviders’respectivemodelcards. Tasksthatwererejectedbysafetyfilterswere
scoredaszero.

| Category | Score (%) |
| --- | --- |
| GPT–6 Astra (max) | 63.4 |
| Fable 5.1 (max) | 62.1 |
| GPT–5.6 Sol (max) | 60.5 |
| Grok 4.7 (xhigh) | 56.7 |
| Grok 4.6 (xhigh) | 48.5 |

* * *

## 5.2 LatchBio Capabilities v1.0

The following benchmark suite is LatchBio's cross-benchmark evaluation of agentic biological data analysis. Its capability suite spans transcriptomics, epigenomics, variant analysis, therapeutic discovery, preclinical pharmacology, pathogen surveillance, and biological-function inference. Agents inspect real experimental files and return structured conclusions that are evaluated with deterministic, task-specific graders.

The overall score is the equally weighted mean of the observed scores across 11 capability benchmarks. Grok 4.7 scores 44.5% at xhigh.

This is evidence of end-to-end biological analysis rather than recall of biological facts. The LatchBio capability benchmark suite is a live suite, so the model card should freeze the evaluated snapshot and coverage; its Surveillance and Function components also appear in the separately reported BioSecBench results and should be treated as drill-downs rather than independent evidence.

| Category | Overall score (%) |
| --- | --- |
| GPT-6 Astra (max) | 47.4 |
| Grok 4.7 (xhigh) | 44.5 |
| Grok 4.6 (high) | 43.3 |
| GPT-5.6 Terra (max) | 43.1 |
| Sonnet 5 (max) | 40.2 |

* * *

## 6 Cyber capabilities and safeguards

Models with advanced capability in coding and coding-adjacent (terminal-use) domains also, in the absence of safeguards or controls, demonstrate enhanced abilities in defensive and offensive cybersecurity. In this section, we discuss the results of the evaluation suite we use to measure our models' cyber capabilities, and additionally discuss the effectiveness and calibration of our safeguard stack.

Grok 4.7 shows small cybersecurity-relevant capability gains over Grok 4.6, concentrated in both cyber-defense and vulnerability-mitigation tasks and red-team use. Capability tests are run without the safeguards we use in production, which would otherwise mask the model's full capability; refusal behavior under safeguards is measured separately (see $ \\§6.3). $

These capabilities are most useful to defenders: finding and fixing vulnerabilities rather than carrying out end-to-end attacks.

We additionally provided an unrestricted configuration of Grok 4.7 to third-party evaluators, who corroborated the results of our internal evaluations and testing on cyber capabilities.

## 6.1 CyberGym 12

CyberGym measures offensive cybersecurity capability by tasking an agent with reproducing crashes and assembling working exploits for known vulnerabilities.

Because it is a capability probe rather than a refusal test, scores use the unrestricted setting (without our standard safeguards) as a pure measure of ability; refusal behavior on harmful cyber requests is measured separately (see $ \\§6.3 $ ). Other models' unsafeguarded results are taken from the respective model providers' system cards 13,14 where available to avoid loss of signal due to refusals.

We evaluate Grok 4.7 with the Grok Build harness.

**evaluate Grok 4.7 with the Grok Build harness.**

| Category | Mean Reproduced (%) |
| --- | --- |
| GPT-5.6 Sol (max) | 83.6 |
| Grok 4.7 (high) | 80.3 |
| Grok 4.6 (high) | 79.7 |
| Grok 4.5 (high) | 79.0 |

* * *

## 6.2 CVE-Bench 15

CVE-Bench evaluates agents on exploiting real-world web-application CVEs in sandboxed environments that mimic production services. The model is tested without restrictions in place, in order to measure its cyber capabilities accurately, and is tested in hardened, egress-controlled environments.

We evaluate Grok 4.7 with the Grok Build harness.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(xhigh) | Grok 4.7(high) |
| --- | --- | --- | --- | --- |
| Reward | 35.2% | 39.8% | 36.6% | 37.7% |

## 6.3 HackerBench v0.3

HackerBench is a SpaceXAI internal CTF-style suite of cybersecurity and red-teaming tasks that require chaining skills (recon, exploitation primitives, and reasoning about vulnerable systems) in a constrained environment. HackerBench also includes borderline, dual-use, and harmful-intent requests that should be refused, plus benign tasks that should be completed. We use HackerBench, among other evaluations, metrics, and qualitative tests, to measure the effectiveness and calibration of our safeguard stack.

HackerBench runs use the standard release-tracked safeguards for Grok 4.7 and the standard provider-supplied safeguards for other tested models.

Lower is better on both metrics.

$$
\\begin{array}{l} \\mathrm {Grok 4. 7 (x h i g h)} \ \\mathrm {Grok 4. 7 (h i g h)} \ \\mathrm {Grok 4. 6 (h i g h)} \ \\bullet \\mathrm {Grok 4. 5 (h i g h)} \ \\mathrm {G P T - 5. 6 S o l (m a x)} \\end{array}
$$

**Harmful/Dual-Use Compliance**

| Category | Series 1 (unlabelled) (%) | Series 2 (unlabelled) (%) | Series 3 (unlabelled) (%) | Series 4 (unlabelled) (%) |
| --- | --- | --- | --- | --- |
| Harmful/Dual-Use Compliance | 4.02 | 3.31 | 5.93 | 7.8 |
| unlabelled 1 | 35.7 |  |  |  |

| Category | Series 1 (unlabelled) (%) | Series 2 (unlabelled) (%) |
| --- | --- | --- |
| Benign Refusal | 0.31 | 0.0 |
| unlabelled 1 | 0.0 | 0.0 |
| unlabelled 2 | 0.0 | 0.0 |

* * *

## 6.4 CathedralBench

CathedralBenchisanindependent,thirdpartyevaluationofcyberperformance. Itconsists
ofared-teamcyberevaluationonhighly-difficult,multiple-exploitchainexecutiontasks,
runwithinegress-securesandboxes. Itservesasawaytomeasurethecybercapabilities
ofamodelinanunrestrictedconfiguration;weuseittomeasurered-teamcapabilities
forGrokmodelsandtogaugethenaiveriskpresentedbyunsafeguardedGrokmodels.
Accuracyismeasuredandreportedonthehardsubsetoftasks.

| Category | Accuracy on the hard subset of tasks (%) |
| --- | --- |
| Grok 4.7 (xhigh) | 29 |
| Grok 4.6 (high) | 25 |

Accuracy on the hard subset of tasks (%)

WeobservethatGrok4.7performsslightlybetterthanGrok4.6onthissplit,consistent
withthesmallincreaseincyberperformanceobservedinCyberGym.

* * *

## 7 Biological and chemical capabilities and safeguards

These suites probe dual-use biology and chemistry knowledge and lab-protocol understanding, and are treated as safety-threshold evaluations under the xAI Frontier Artificial Intelligence Framework (FAIF) 16 (which defines risk domains, capability thresholds, and associated mitigations).

Grok 4.7 scores below the FAIF safety thresholds on dual-use knowledge, indicating limited actionable uplift for an already-trained actor.

Grok 4.7 demonstrates no dual-use biological capability increase versus Grok 4.6, generally scoring worse than previous models on risky or expressly dangerous tasks. This is reflective of safer RL environments and better selectivity of training data, as opposed to being a consequence of enhanced safeguards and refusal training.

Weapons-path refusals are consistent with our safeguard stack and in line with Grok 4.6; these results are reported separately under general output safety.

On general biological knowledge not useful for dual-use capability, Grok 4.7 retains the same performance as Grok 4.6 or sees some diminishment.

Unless otherwise stated, the benchmarks presented in $ \\§7 $ are performed without production safeguards in place; this enables full measurement of Grok 4.7's dual-use capabilities.

## 7.1 BioSecBench

BioSecBench comprises three complementary LatchBio evaluations. BioSecBench-Refusal tests whether an agent can identify concealed biological hazards without unnecessarily blocking legitimate research. BioSecBench-Surveillance evaluates analysis of raw pathogen-sequencing data for public-health monitoring, while BioSecBench-Function tests whether agents can recover biosecurity-relevant functional conclusions from sequence, structure, and experimental evidence.

With the Grok Build harness, Refusal should also be read as red-team refusal and routine compliance. Surveillance and Function endpoint pass rates exclude refused attempts, so those refusals are reported separately from the pass rate.

The three results should be read together: useful biological capability requires sound analysis and calibrated treatment of genuine risk. Provider-side filters can dominate refusal behavior, and the restricted task sets characterize the tested checkpoint and harness rather than establishing general biological safety or reliability. Grok 4.7 and Grok 4.6 are run with the Grok Build harness. GPT-6 Astra and Opus 5 are LatchBio runs at max effort.

| Suite | Grok4.6(high) | Grok4.7(xhigh) | GPT-6Astra(max) | Opus5(max) |
| --- | --- | --- | --- | --- |
| Refusal | 45.6% | 62.4% | 25.5% | 31.8% |
| Surveillance | 48.0% | 48.0% | 35.2% | 43.6% |
| Function | 39.9% | 43.3% | 46.0% | 44.8% |

* * *

## 7.2 Virology Capabilities Test (VCT) 17

VCT presents multimodal virology questions with a failed or ambiguous lab protocol, often with an image of the plate, gel, or culture, and a choice of what actually went wrong. Accuracy is the share of items it answers correctly such as how well it can give practical help on real virus-lab work, including work that could be misused. We treat this evaluation as a CBRN capability signal, not as a measure of refusal rate.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Accuracy | 65.5% | 67.4% | 63.0% |

## 7.3 Biosecurity VCT 17

Biosecurity VCT is an internal biosecurity companion to VCT: dual-use virus-lab troubleshooting items. Accuracy is the share of items scored correct overall, so it measures how much practical, potentially misusable virology help the model can give, under the same CBRN safety-threshold framing as the VCT knowledge probes. We treat it as a CBRN knowledge and capability signal rather than as a refusal-rate score; refusal behavior on hazardous biology prompts is measured separately (see $ \\textcircled{7} 7.4). $

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Accuracy | 44.1% | 47.8% | 41.5% |

## 7.4 BioUseBench

BioUseBench is an internal dual-use biology evaluation. The items span virology, wet-lab methods, chemical synthesis, toxicology, and laboratory safety. It measures whether the model withholds assistance on the most hazardous enablement prompts, rather than whether its scientific answers are correct. We report Dual-use refusal: the refusal rate on the severity-5 subset. We treat that rate as a CBRN safeguard signal rather than as a knowledge score.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Dual-use refusal | 83.3% | 90.7% | 91.4% |

* * *

## 7.5 WMDP dual-use knowledge (MCQ) 18

The Weapons of Mass Destruction Proxy (WMDP) is a public multiple-choice evaluation of dual-use knowledge. WMDP-Bio, WMDP-Chem, and WMDP-Cyber cover biology, chemistry, and cybersecurity. The items span virology and molecular biology, chemical synthesis and toxicology, and offensive cybersecurity. Accuracy is the share of questions answered correctly, not whether the model refuses. We treat that as a CBRN and cyber capability signal rather than as a safeguard score.

| Metric | Grok4.5(high) | Grok4.6(high) | Grok4.7(high) |
| --- | --- | --- | --- |
| WMDP-Bio accuracy | 90.9% | 90.0% | 88.1% |
| WMDP-Chem accuracy | 87.3% | 85.3% | 84.9% |
| WMDP-Cyber accuracy | 83.2% | 90.1% | 88.1% |

## 7.6 LAB-Bench practical MCQ 19

LAB-Bench practical is a public multiple-choice evaluation of everyday wet-lab and research skills. The items cover protocol troubleshooting, sequence reasoning, and cloning scenarios. Accuracy is the share of questions answered correctly, not whether the model refuses. We treat that as a biology capability signal rather than as a safeguard score.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Accuracy | 71.1% | 80.7% | 76.8% |

## 7.7 ProtocolQA Open-Ended 19

ProtocolQA open-ended is a public evaluation of biological protocol troubleshooting. The protocols cover everyday molecular-biology work such as PCR, cloning, transfection, and cell culture. Each item contains an introduced error, and the model must identify the single most important mistake in free text. Unlike the LAB-Bench practical multiple-choice items, the model is not given answer choices. Accuracy is the share of answers judged correct, not whether the model refuses. We treat that as a biology capability signal rather than as a safeguard score.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Accuracy | 87.0% | 79.6% | 70.4% |

* * *

## 7.8 BixBench zero-shot MCQ 20

BixBench (Bioinformatics Benchmark) is a public evaluation of computational-biology analysis. The items cover real data-analysis tasks such as differential expression, genome assembly quality control, and cell-type annotation. The model may use analysis tools, and we score it zero-shot as multiple choice.

BixBench items contain no weapons-enabling content. The suite runs under Grok Build's default tool-on settings.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Accuracy | 93.8% | 93.8% | 88.4% |

## 8 Jailbreaks and robustness

We test whether Grok 4.7's production safeguards hold under adversarial pressure.

Residual failures are treated as cases for ongoing monitoring and patching as new techniques emerge.

## 8.1 Jailbreaks 21,22

We stress the refusal safeguards with a broad, continuously updated set of jailbreak attacks, including published and internally discovered techniques, across single-turn and multi-turn settings, as well as longer adversarial trajectories.

Compliance is the share of should-refuse attacks where the model provides disallowed assistance. We report:

- Standard jailbreaks: a battery of varying-difficulty jailbreaks, both existing and internally discovered.

- StrongReject: compliance on the StrongREJECT suite.

- Long-horizon jailbreaks: multi-turn jailbreaks, Crescendo multi-turn jailbreaks, and malicious-use long-horizon attacks.


Lower is better.

| Suite | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Standard jailbreaks | 0.73% | 0.04% | 0.01% |
| StrongReject | 1.5% | 3.9% | 2.0% |
| Long-horizon jailbreaks | - | 1.0% | 0.65% |

* * *

## 9 Generaloutputsafety

Thissectioncoverspolicyrefusalsforpromptsrepresentativeofconsumerchattraffic
acrossthemajordisallowedcategories,includingdedicatedCBRNandweaponsrefusals.

ComparedwithGrok4.6,general-refusalcomplianceissimilarandchild-safetycompliance
isunchanged. BiorefusalrecallandFORTRESS-RNmatchGrok4.6,andchemrefusalrecall
is99.9%. Self-harmcomplianceishigher,andthatresultisinthemental-healthsection.

TheevaluationsandresultsbelowalsoapplytoGrokBuild.

Refusalsareenforcedbyalayered,defense-in-depthstackratherthanonesinglefilteror
classifier.

Safetyfine-tuningandpost-training(supervisedfine-tuningplusreinforcementlearning
fromhumanfeedback,verifiablerewards,andmodel-basedgrading)trainthemodelto
refuserequeststhatshowclearintenttocausesevereharmorengageincriminalactivity.

Systempromptsfurthersteerthemodeltowardhonestyandtruth-seekingwhileavoiding
over-refusalonbenignorhypotheticaldiscussions.

Onsomedeploymentsurfaces,Grok4.7isadditionallyaugmentedwithruntimeinputand
topicalfiltersthataddcontrolsforclassesofsevereharm,includingCSAM,self-harm,and
biological/chemicalweaponspathways,alongsidecyber-specificsafeguards.

## 9.1 Generalrefusals

Generalrefusalsisaninternalevaluationofpolicy-followingonharmfulrequests. The
promptsspanmajordisallowedcategories,fromovertaskstowell-hiddenintent,inEnglish
andinSpanish,Chinese,Japanese,Arabic,andRussian. Agradermodeljudgeswhether
eachresponsestayswithinpolicy. Complianceistheshareofitemsthatfailthatjudgment.
Lowerisbetter.

| Metric |  | Grok4.5(high) Grok4.6(high) Grok4.7(high) |  |
| --- | --- | --- | --- |
| Compliance | 1.10% | 0.93% | 1.10% |

* * *

## 9.2 Child safety

Child safety is an internal multi-turn evaluation of whether the model withholds assistance on child sexual exploitation, including CSAM. The prompts sit in that highest-severity child-safety category and unfold over a scripted conversation rather than a single turn.A grader model judges whether the response stays within policy. Compliance is the share of dialogues that fail that judgment. Lower is better.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Compliance | 0.0% | 0.0% | 0.0% |

## 9.3 CBRN/weapons refusals 23

Autointent-Bio and Autointent-Chem are internal suites of manually and synthetically generated dangerous and benign CBRN queries; FORTRESS-RN covers radiological and nuclear items.

| Metric | Grok4.5(high) | Grok4.6(high) | Grok4.7(high) |
| --- | --- | --- | --- |
| Bio refusal recall | 97.9% | 100.0% | 100.0% |
| Chem refusal recall | 96.7% | 100.0% | 99.9% |
| FORTRESS-RN R/N refusal accuracy | 97.9% | 97.9% | 97.9% |

CBRN pathways receive heightened scrutiny across the safeguard stack: the refusal policy prioritizes non-assistance for biological, chemical, radiological, or nuclear weapons development or deployment; system prompts give special attention to CBRN misuse pathways; and dedicated input and topical filters target biological and chemical weapons-related abuse.

* * *

## 10 Mental health

We assess how Grok 4.7 handles self-harm and crisis situations. We test our models to ensure they refuse assistance for self-harm while still providing appropriate support and resources for users in crisis.

## 10.1 Self-harm refusals

The self-harm suite applies the shared refusal protocol to self-harm and crisis prompts and longer-horizon conversations, checking that the model declines to assist in queries requesting, related to, intending, or anticipatory to self-harm, while offering appropriate support and resources. In this evaluation, a model additionally fails if it refuses without redirecting the user to help, or if it is unable to understand the intent of a user message that implies self-harm or crisis. A lower score is better in this benchmark.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Compliance | 0.50% | 0.84% | 1.05% |

## 11 Behaviors

These evaluations cover propensities that affect reliability, neutrality, and behavior rather than disallowed content: honesty under pressure and sycophancy.

## 11.1 MASK-Rectified 24

Using a dataset derived from MASK \* , we test whether Grok 4.7 faithfully reports its beliefs when pressured to lie, as a proxy for the model's tendency to assert misleading information. A lower score is better on this benchmark.

| Metric | Grok 4.5(high) | Grok 4.6(high) | Grok 4.7(high) |
| --- | --- | --- | --- |
| Dishonesty | 0.67% | 1.90% | 0.00% |

- MASK-Rectified corrects the MASK grading so that responses where the model is obviously (model-aware) role-playing, rather than asserting a genuine belief, are not counted as lies.

* * *

## 11.2 Sycophancy

Sycophancyisaninternalevaluationofwhetherthemodelabandonsacorrectanswer
whenauserconfidentlystatesawrongone. Theitemsarefactualquestionsinscience,
history,andothergeneral-knowledgetopics,eachpairedwithmisleadinguser-supplied
context. Agraderscoresthemodel’sansweragainstthetrueanswer. Thesycophancyrate
istheshareofitemswherethemodelfollowstheuserinsteadofthecorrectanswer. We
treatthatasatruth-seekingandsafetysignalratherthanasaknowledgescore. Loweris
better.

| Metric |  | Grok4.5(high) Grok4.6(high) Grok4.7(high) |  |
| --- | --- | --- | --- |
| Sycophancy | 0.01% | 0.04% | 0.03% |

* * *

## Acknowledgements

Wethankourevaluationpartnersforrunningbenchmarks,sharingresults,andhelpingus
measureGrok4.7againstreal-worldworkloads:

• AbundantAI

• Datacurve

• Atopile

• Mecado

• Harbor

• Cathedral

• ProximalLabs

• LatchBio

• ValsAI

* * *

## References

Publicbenchmarksanddatasetsreferencedabove. Superscriptsmarkfirstmentioninthe
maintextandlinktoaprimarysource. Internalevaluationsarenotlisted.

01. SpaceXAIAcceptableUsePolicy. [https://x.ai/legal/acceptable-use-policy](https://x.ai/legal/acceptable-use-policy)
02. CursorBench4.0. Cursor,2026. [https://cursor.com/cursorbench](https://cursor.com/cursorbench) · [https://cursor.com/blog/](https://cursor.com/blog/)
    cursorbench
03. DeepSWE.Huang,Lee,Tng,andGe(Datacurve),2026. [https://deepswe.datacurve.ai/](https://deepswe.datacurve.ai/) · https:
    //arxiv.org/abs/2607.07946
04. mini-swe-agent. SWE-agent. [https://github.com/swe-agent/mini-swe-agent](https://github.com/swe-agent/mini-swe-agent)
05. Terminal-Bench4.0. Merrilletal. /Harbor(Stanford&LaudeInstitute),2026. [https://www](https://www/).
    tbench.ai/ · [https://www.frontierbench.ai/](https://www.frontierbench.ai/) · [https://arxiv.org/abs/2601.11868](https://arxiv.org/abs/2601.11868)
06. FrontierSWEV2. ProximalLabs,2026. [https://www.frontierswe.com/](https://www.frontierswe.com/) · [https://github.com/](https://github.com/)
    Proximal-Labs/frontier-swe
07. SWE-Marathon. Desaietal. (AbundantAI),2026. [https://www.swe-marathon.org/](https://www.swe-marathon.org/) · https:
    //arxiv.org/abs/2606.07682
08. LegalAgentBenchmark(LAB/HLab). Harvey,2026. ValsAIthird-partyleaderboard:
    [https://www.vals.ai/benchmarks/hlab](https://www.vals.ai/benchmarks/hlab) ·Harveyannouncement: [https://www.harvey.ai/blog/](https://www.harvey.ai/blog/)
    introducing-harveys-legal-agent-benchmark
09. Valkyrie. ValsAIagenticevaluationframework. [https://github.com/vals-ai/Valkyrie](https://github.com/vals-ai/Valkyrie) ·HLabon
    Valkyrie: [https://www.vals.ai/benchmarks/hlab](https://www.vals.ai/benchmarks/hlab)
10. EEBench. atopile,2026. [https://eebench.org/](https://eebench.org/)
11. CADGenBench. Mecado/HuggingFace,2026. [https://www.mecado.com/](https://www.mecado.com/) · [https://github](https://github/).
    com/huggingface/cadgenbench
12. CyberGym. Wang,Shi,He,Cai,Zhang,andSong,2025. [https://www.cybergym.io/](https://www.cybergym.io/) · https:
    //arxiv.org/abs/2506.02548
13. ClaudeFable5&Mythos5SystemCard. Anthropic,2026. [https://www.anthropic.com/](https://www.anthropic.com/)
    claude-fable-5-mythos-5-system-card
14. GPT-5.6SystemCard. OpenAI,2026. [https://deploymentsafety.openai.com/gpt-5-6](https://deploymentsafety.openai.com/gpt-5-6)
15. CVE-Bench. Zhuetal.,2025. [https://arxiv.org/abs/2503.17332](https://arxiv.org/abs/2503.17332)
16. xAIFrontierArtificialIntelligenceFramework(FAIF).xAI,June30,2026. [https://media.x.ai/v1/](https://media.x.ai/v1/)
    website/xai-frontier-artificial-intelligence-framework-30-june-2026-99c40684.pdf
17. VCT.Götting,Medeiros,Sanders,Li,Phan,Elabd,Justen,Hendrycks,andDonoughe,2025.
    [https://arxiv.org/abs/2504.16137](https://arxiv.org/abs/2504.16137)
18. WMDP.Lietal.,2024. [https://wmdp.ai](https://wmdp.ai/) · [https://arxiv.org/abs/2403.03218](https://arxiv.org/abs/2403.03218)
19. LAB-Bench. Laurentetal.,2024. [https://github.com/Future-House/LAB-Bench](https://github.com/Future-House/LAB-Bench) · https://
    arxiv.org/abs/2407.10362
20. BixBench. Mitchener,Laurent,etal.,2025. [https://github.com/Future-House/BixBench](https://github.com/Future-House/BixBench) ·
    [https://arxiv.org/abs/2503.00096](https://arxiv.org/abs/2503.00096)
21. StrongREJECT.Soulyetal.,2024. [https://arxiv.org/abs/2402.10260](https://arxiv.org/abs/2402.10260)
22. Crescendomulti-turnjailbreak. Russinovich,Salem,andEldan(Microsoft),2024. [https://arxiv](https://arxiv/).
    org/abs/2404.01833

* * *

GROK4.7MODELCARD

23. FORTRESS.Knight,Deshpande,etal. (ScaleAI),2025. [https://labs.scale.com/leaderboard/](https://labs.scale.com/leaderboard/) fortress · [https://arxiv.org/abs/2506.14922](https://arxiv.org/abs/2506.14922)
24. MASK.Renetal.,2025. [https://www.mask-benchmark.ai/](https://www.mask-benchmark.ai/) · [https://arxiv.org/abs/2503](https://arxiv.org/abs/2503). 03750