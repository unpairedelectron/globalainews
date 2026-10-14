/**
 * Dated public claims about IndiaAI compute. These are not a live inventory:
 * the sources do not consistently establish installation, deployment, or
 * currently schedulable availability.
 */
export type CapacityObservationStatus =
  | 'mission-target'
  | 'initial-capacity-reported'
  | 'additional-capacity-announced'
  | 'empanelled-plus-additional-reported'
  | 'installed-reported'
  | 'onboarded'
  | 'shared-capacity-reported'
  | 'access-reported'
  | 'provider-category-total-reported';

export type EvidenceState = 'established' | 'reported' | 'not-established';

export interface IndiaAiComputeObservation {
  id: string;
  reportedOn: string | null;
  documentCreatedOn?: string;
  asOf: string | null;
  quantity: number;
  quantityLabel: string;
  qualifier: 'exact' | 'about' | 'more-than' | 'nearly';
  unit: string;
  status: CapacityObservationStatus;
  stageLabel: string;
  denominator: string;
  definition: string;
  sourceSlug: string;
  sourceKind: 'primary' | 'independent';
  geography: 'India-wide programme';
  organization?: string;
  facility?: string;
  location?: string;
  acceleratorType: string;
  providerCount?: number;
  installed: EvidenceState;
  deployed: EvidenceState;
  accessible: EvidenceState;
  schedulable: EvidenceState;
  limitation: string;
}

export const indiaAiComputeObservations: IndiaAiComputeObservation[] = [
  {
    id: 'mission-target-2024',
    reportedOn: '2024-03-07',
    asOf: null,
    quantity: 10_000,
    quantityLabel: 'more than 10,000',
    qualifier: 'more-than',
    unit: 'GPUs',
    status: 'mission-target',
    stageLabel: 'Mission target',
    denominator: 'Not a ratio; overall common-compute target. Equipment inclusion criteria are not stated.',
    definition: 'A policy target of more than 10,000 GPUs; it is not a delivered-capacity count.',
    sourceSlug: 'indiaai-cabinet-approval-2024',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'Approved common-compute target; not evidence of delivered hardware.',
  },
  {
    id: 'initial-capacity-2025',
    reportedOn: '2025-01-30',
    asOf: null,
    quantity: 10_000,
    quantityLabel: 'about 10,000',
    qualifier: 'about',
    unit: 'GPUs',
    status: 'initial-capacity-reported',
    stageLabel: 'Initial facility reported',
    denominator: 'Not a ratio; an India-wide initial-facility count. The source gives no model or operational breakdown.',
    definition: 'The release describes about 10,000 GPUs in the initial facility; live availability is not defined.',
    sourceSlug: 'pib-initial-compute-2025',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'The release describes an initial facility but does not establish live service or free capacity.',
  },
  {
    id: 'additional-capacity-announced-2025',
    reportedOn: '2025-01-30',
    asOf: null,
    quantity: 8_693,
    quantityLabel: '8,693 additional GPUs',
    qualifier: 'exact',
    unit: 'GPUs',
    status: 'additional-capacity-announced',
    stageLabel: 'Additional capacity announced',
    denominator: 'Not a ratio; planned additional tranche. Its relationship to later totals is not stated.',
    definition: 'The release says 8,693 GPUs were to be added; completion is not established.',
    sourceSlug: 'pib-initial-compute-2025',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'The release says these GPUs were to be added; it does not verify completion.',
  },
  {
    id: 'empanelled-plus-additional-2025',
    reportedOn: '2025-05-30',
    asOf: null,
    quantity: 34_333,
    quantityLabel: '34,333 total',
    qualifier: 'exact',
    unit: 'GPUs',
    status: 'empanelled-plus-additional-reported',
    stageLabel: 'Empanelled + additional',
    denominator: '18,417 empanelled + 15,916 additional GPUs, the two source-stated components; operational inclusion criteria are unknown.',
    definition: 'The release defines the arithmetic components of 34,333, but does not define the total as installed, live, or schedulable.',
    sourceSlug: 'pib-common-compute-34000-2025',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'The release combines 18,417 empanelled and 15,916 additional GPUs without defining live or schedulable status.',
  },
  {
    id: 'installed-reported-2025',
    reportedOn: '2025-06-24',
    asOf: '2025-06-16',
    quantity: 17_300,
    quantityLabel: 'a little over 17,300 installed',
    qualifier: 'more-than',
    unit: 'GPUs',
    status: 'installed-reported',
    stageLabel: 'Installed (reported by ET)',
    denominator: 'Provider-review count; the cited report does not specify a complete provider denominator.',
    definition: 'The report uses “installed” for a little over 17,300 GPUs in a 16 June provider review; the source does not publish a status crosswalk.',
    sourceSlug: 'ettech-indiaai-installed-2025',
    sourceKind: 'independent',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'reported',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'Secondary reporting attributes this early-rollout figure to a 16 June provider review; it is not a current inventory.',
  },
  {
    id: 'onboarded-2026',
    reportedOn: '2026-03-25',
    asOf: null,
    quantity: 38_231,
    quantityLabel: '38,231 onboarded',
    qualifier: 'exact',
    unit: 'GPUs',
    status: 'onboarded',
    stageLabel: 'Onboarded',
    denominator: '38,231 GPUs across 14 empanelled service providers, as stated by the source.',
    definition: 'The release reports the GPUs as “onboarded” but does not define onboarding as installation, live service, or availability.',
    sourceSlug: 'pib-compute-onboarded-2026',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    providerCount: 14,
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'The government reports onboarding from 14 providers; no per-provider live inventory is supplied.',
  },
  {
    id: 'onboarded-nearly-38000-july-2026',
    reportedOn: '2026-07-29',
    asOf: null,
    quantity: 38_000,
    quantityLabel: 'nearly 38,000 onboarded',
    qualifier: 'nearly',
    unit: 'GPUs',
    status: 'onboarded',
    stageLabel: 'Onboarded (rounded)',
    denominator: 'Aggregate provider count; the release gives no exact count or provider denominator.',
    definition: 'The release says “nearly 38,000” were onboarded; its exact count and relationship to other stages are unknown.',
    sourceSlug: 'pib-onboarded-nearly-38000-2026',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'A later PIB release repeats a rounded onboarded figure without a new exact count, provider list, or status crosswalk.',
  },
  {
    id: 'shared-capacity-june-2026',
    reportedOn: '2026-08-13',
    asOf: '2026-06',
    quantity: 45_000,
    quantityLabel: '45,000+ shared',
    qualifier: 'more-than',
    unit: 'GPUs',
    status: 'shared-capacity-reported',
    stageLabel: 'Shared capacity',
    denominator: 'IndiaAI shared-capacity total; which hardware states or categories are included is not stated.',
    definition: 'The factsheet reports more than 45,000 as “shared”; it does not define that stage or reconcile it with onboarding.',
    sourceSlug: 'pib-capacity-and-use-factsheet-2026',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'The factsheet reports shared capacity as of June; it does not reconcile the figure with onboarding or define currently free devices.',
  },
  {
    id: 'access-reported-october-2026',
    reportedOn: '2026-10-01',
    asOf: null,
    quantity: 30_000,
    quantityLabel: 'about 30,000 accessible',
    qualifier: 'about',
    unit: 'GPUs',
    status: 'access-reported',
    stageLabel: 'Access reported by ETtech',
    denominator: 'About 30,000 accessible against a 45,000 commitment; the basis of the accessible count is not defined.',
    definition: 'The article reports access to about 30,000 GPUs; it is not a provider-level inventory or a schedulable count.',
    sourceSlug: 'ettech-indiaai-recalibration-2026',
    sourceKind: 'independent',
    geography: 'India-wide programme',
    acceleratorType: 'not specified by source',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'reported',
    schedulable: 'not-established',
    limitation: 'A secondary report compares access with a 45,000 commitment; it is not a provider-level or live availability feed.',
  },
  {
    id: 'provider-category-total-2026',
    reportedOn: null,
    documentCreatedOn: '2026-09-02',
    asOf: null,
    quantity: 45_081,
    quantityLabel: '45,081 combined entries',
    qualifier: 'exact',
    unit: 'mixed accelerator-category entries',
    status: 'provider-category-total-reported',
    stageLabel: 'Provider / accelerator-category table total',
    denominator: 'Sum of 14 bidder or consortium rows across NVIDIA/AMD GPU and Intel, AWS, and Google accelerator categories; no common operational denominator is stated.',
    definition: 'Unknown — the PDF does not say whether the listed quantities are offered, empanelled, installed, or serviceable. Its 2 September 2026 file-creation date is not a snapshot date.',
    sourceSlug: 'indiaai-provider-accelerator-table-2026',
    sourceKind: 'primary',
    geography: 'India-wide programme',
    acceleratorType: 'Mixed GPU and non-GPU accelerator categories; category-level counts are shown in the source.',
    installed: 'not-established',
    deployed: 'not-established',
    accessible: 'not-established',
    schedulable: 'not-established',
    limitation: 'The provider table combines GPU and non-GPU accelerator categories and gives no publication/as-of date, status definition, or live inventory.',
  },
];