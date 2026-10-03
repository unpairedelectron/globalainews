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
  | 'onboarded'
  | 'shared-capacity-reported'
  | 'access-reported';

export type EvidenceState = 'established' | 'reported' | 'not-established';

export interface IndiaAiComputeObservation {
  id: string;
  reportedOn: string;
  asOf: string | null;
  quantity: number;
  quantityLabel: string;
  qualifier: 'exact' | 'about' | 'more-than';
  unit: 'GPUs';
  status: CapacityObservationStatus;
  sourceSlug: string;
  sourceKind: 'primary' | 'independent';
  geography: 'India-wide programme';
  acceleratorType: 'not specified by source';
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
    asOf: '2025-05-30',
    quantity: 34_333,
    quantityLabel: '34,333 total',
    qualifier: 'exact',
    unit: 'GPUs',
    status: 'empanelled-plus-additional-reported',
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
    id: 'onboarded-2026',
    reportedOn: '2026-03-25',
    asOf: '2026-03-25',
    quantity: 38_231,
    quantityLabel: '38,231 onboarded',
    qualifier: 'exact',
    unit: 'GPUs',
    status: 'onboarded',
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
    id: 'shared-capacity-june-2026',
    reportedOn: '2026-08-13',
    asOf: '2026-06',
    quantity: 45_000,
    quantityLabel: '45,000+ shared',
    qualifier: 'more-than',
    unit: 'GPUs',
    status: 'shared-capacity-reported',
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
];