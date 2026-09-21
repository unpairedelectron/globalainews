import type { StoryCategory } from "../../../global-ai-news/src/content";

export const editorialCategories: StoryCategory[] = [
  "Breakthroughs",
  "Signals",
  "India Watch",
  "The Edge",
  "Field Notes",
  "Infrastructure",
  "Policy",
];

export type DraftPayload = {
  title: string;
  dek: string;
  category: StoryCategory;
  topic: string;
  classification: "reported" | "analysis" | "synthesis";
  bottomLine: string;
  whyItMatters: string;
  keyTakeaways: string[];
  whatChanges: string;
  body: Array<{ heading: string; paragraphs: string[] }>;
  sourceUrls: string[];
};

export type VerificationPayload = {
  pass: boolean;
  score: number;
  unsupportedClaims: string[];
  slopFlags: string[];
  notes: string;
};

export type EditorialValidationSource = {
  url: string;
  publisher: string;
};

export type EditorialAutomationRunRecord = {
  id: number;
  runKey: string;
  status: string;
  published: number;
  rejected: number;
  detail: unknown;
};

export type EditorialReplayStatus = "scheduled" | "rejected";

export type EditorialReplayChange = {
  runId: number;
  runKey: string;
  previousStatus: EditorialReplayStatus;
  replayedStatus: EditorialReplayStatus;
  errors: string[];
};

export type EditorialReplayReport = {
  totalRuns: number;
  inspected: number;
  skipped: number;
  unchanged: number;
  changed: number;
  previouslyPublishable: number;
  previouslyRejected: number;
  changes: EditorialReplayChange[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringList(value: unknown, stringifyObjects = false): string[] {
  return Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === "string") return item.trim();
          return stringifyObjects && isRecord(item) ? JSON.stringify(item) : "";
        })
        .filter(Boolean)
    : [];
}

export function normalizeDraft(value: unknown): DraftPayload {
  const raw = isRecord(value) ? value : {};
  const body = Array.isArray(raw.body)
    ? raw.body
        .filter(isRecord)
        .map((section) => ({
          heading: typeof section.heading === "string" ? section.heading : "",
          paragraphs: stringList(section.paragraphs),
        }))
    : [];
  return {
    title: typeof raw.title === "string" ? raw.title : "",
    dek: typeof raw.dek === "string" ? raw.dek : "",
    category: raw.category as StoryCategory,
    topic: typeof raw.topic === "string" ? raw.topic : "",
    classification: raw.classification as DraftPayload["classification"],
    bottomLine: typeof raw.bottomLine === "string" ? raw.bottomLine : "",
    whyItMatters: typeof raw.whyItMatters === "string" ? raw.whyItMatters : "",
    keyTakeaways: stringList(raw.keyTakeaways),
    whatChanges: typeof raw.whatChanges === "string" ? raw.whatChanges : "",
    body,
    sourceUrls: stringList(raw.sourceUrls),
  };
}

export function normalizeVerification(value: unknown): VerificationPayload {
  const raw = isRecord(value) ? value : {};
  return {
    pass: raw.pass === true,
    score: typeof raw.score === "number" && Number.isFinite(raw.score) ? raw.score : 0,
    unsupportedClaims: stringList(raw.unsupportedClaims, true),
    slopFlags: stringList(raw.slopFlags, true),
    notes: typeof raw.notes === "string" ? raw.notes : "",
  };
}

export function deterministicGate(
  draft: DraftPayload,
  verification: VerificationPayload,
  items: EditorialValidationSource[],
): string[] {
  const errors: string[] = [];
  const sourcePublishers = new Set(
    draft.sourceUrls
      .map((url) => items.find((item) => item.url === url)?.publisher)
      .filter((publisher): publisher is string => Boolean(publisher)),
  );
  if (draft.title.length < 30 || draft.title.length > 100) errors.push("headline_length");
  if (draft.dek.length < 40 || draft.dek.length > 280) errors.push("dek_length");
  if (!editorialCategories.includes(draft.category)) errors.push("invalid_category");
  if (!["reported", "analysis", "synthesis"].includes(draft.classification)) errors.push("invalid_classification");
  if (draft.keyTakeaways.length !== 3) errors.push("takeaway_count");
  const paragraphCount = draft.body.reduce((count, section) => count + section.paragraphs.length, 0);
  const copyCharacters = draft.body.reduce(
    (count, section) => count + section.paragraphs.join(" ").length,
    0,
  );
  if (
    draft.body.length < 2 ||
    draft.body.length > 4 ||
    draft.body.some((section) => section.paragraphs.length < 1) ||
    paragraphCount < 4
  ) {
    errors.push("body_structure");
  }
  if (copyCharacters < 600) errors.push("copy_length");
  if (draft.sourceUrls.length < 1 || sourcePublishers.size < 1) errors.push("missing_source");
  if (draft.sourceUrls.some((url) => !items.some((item) => item.url === url))) errors.push("unknown_source");
  if (!verification.pass || verification.score < 0.82) errors.push("fact_check_failed");
  if (verification.unsupportedClaims.length > 0) errors.push("unsupported_claims");
  if (verification.slopFlags.length > 0) errors.push("slop_detected");
  return errors;
}

export type EditorialFixtureDecision = {
  status: "scheduled" | "rejected";
  scheduledReleases: number;
  errors: string[];
  draft: DraftPayload;
  verification: VerificationPayload;
};

export function evaluateEditorialFixture(
  draftValue: unknown,
  verificationValue: unknown,
  items: EditorialValidationSource[],
): EditorialFixtureDecision {
  const draft = normalizeDraft(draftValue);
  const verification = normalizeVerification(verificationValue);
  const errors = deterministicGate(draft, verification, items);
  return {
    status: errors.length === 0 ? "scheduled" : "rejected",
    scheduledReleases: errors.length === 0 ? 1 : 0,
    errors,
    draft,
    verification,
  };
}

function replayStatusForRun(run: EditorialAutomationRunRecord, detail: Record<string, unknown>): EditorialReplayStatus | null {
  if (run.status !== "completed") return null;
  if (run.published > 0) return "scheduled";
  if (run.rejected > 0 && detail.reason === "quality_gate_rejected") return "rejected";
  return null;
}

function validationSourcesFromDetail(detail: Record<string, unknown>): EditorialValidationSource[] {
  if (!Array.isArray(detail.validationSources)) return [];
  return detail.validationSources
    .filter(isRecord)
    .map((source) => ({
      url: typeof source.url === "string" ? source.url : "",
      publisher: typeof source.publisher === "string" ? source.publisher : "",
    }))
    .filter((source) => source.url.length > 0 && source.publisher.length > 0);
}

export function replaySavedEditorialRuns(
  runs: readonly EditorialAutomationRunRecord[],
): EditorialReplayReport {
  const report: EditorialReplayReport = {
    totalRuns: runs.length,
    inspected: 0,
    skipped: 0,
    unchanged: 0,
    changed: 0,
    previouslyPublishable: 0,
    previouslyRejected: 0,
    changes: [],
  };

  for (const run of runs) {
    const detail = isRecord(run.detail) ? run.detail : {};
    const previousStatus = replayStatusForRun(run, detail);
    if (!previousStatus) {
      report.skipped += 1;
      continue;
    }

    const sources = validationSourcesFromDetail(detail);
    if (!("draft" in detail) || !("verification" in detail) || sources.length === 0) {
      report.skipped += 1;
      continue;
    }

    report.inspected += 1;
    if (previousStatus === "scheduled") report.previouslyPublishable += 1;
    else report.previouslyRejected += 1;

    const replay = evaluateEditorialFixture(detail.draft, detail.verification, sources);
    if (replay.status === previousStatus) {
      report.unchanged += 1;
      continue;
    }

    report.changed += 1;
    report.changes.push({
      runId: run.id,
      runKey: run.runKey,
      previousStatus,
      replayedStatus: replay.status,
      errors: replay.errors,
    });
  }

  return report;
}