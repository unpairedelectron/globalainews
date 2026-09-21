import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateEditorialFixture,
  type EditorialValidationSource,
} from "../src/editorial/automation-contract.ts";

const sources: EditorialValidationSource[] = [
  { publisher: "OpenAI", url: "https://example.test/openai-item" },
  { publisher: "Google AI", url: "https://example.test/google-item" },
];

const paragraph =
  "The source records describe a concrete change in how teams evaluate and deploy AI systems, with enough detail to explain the development without adding an unsupported outcome or prediction.";

const passingDraft = {
  title: "Labs are shifting AI evaluation from demos toward operating evidence",
  dek:
    "New reporting points to a more practical test for AI systems: whether teams can measure reliability, cost, and the work that changes after deployment.",
  category: "Signals",
  topic: "AI evaluation",
  classification: "synthesis",
  bottomLine: "The useful signal is moving from capability claims to evidence gathered in real workflows.",
  whyItMatters: "That shift gives buyers and builders a clearer way to compare systems beyond a single benchmark.",
  keyTakeaways: [
    "Teams are measuring deployed behavior alongside model capability.",
    "Reliability and operating cost now shape more purchasing decisions.",
    "The strongest evidence comes from repeated use in a defined workflow.",
  ],
  whatChanges: "Editorial coverage can now follow the evidence that survives contact with production work.",
  body: [
    { heading: "The evidence moves downstream", paragraphs: [paragraph, paragraph] },
    { heading: "A narrower signal", paragraphs: [paragraph, paragraph] },
  ],
  sourceUrls: sources.map((source) => source.url),
};

const passingVerification = {
  pass: true,
  score: 0.94,
  unsupportedClaims: [],
  slopFlags: [],
  notes: "Claims are supported and the draft adds distinct analysis.",
};

test("a publishable model fixture schedules exactly one release", () => {
  const result = evaluateEditorialFixture(passingDraft, passingVerification, sources);

  assert.equal(result.status, "scheduled");
  assert.equal(result.scheduledReleases, 1);
  assert.deepEqual(result.errors, []);
});

test("malformed body payloads become quality-gate rejections", () => {
  const result = evaluateEditorialFixture(
    { ...passingDraft, body: [{ heading: "Only one section", paragraphs: { malformed: true } }] },
    passingVerification,
    sources,
  );

  assert.equal(result.status, "rejected");
  assert.equal(result.scheduledReleases, 0);
  assert.ok(result.errors.includes("body_structure"));
  assert.ok(!result.errors.includes("model_error"));
});

test("short copy is rejected before a release can be scheduled", () => {
  const result = evaluateEditorialFixture(
    {
      ...passingDraft,
      title: "Short copy",
      dek: "Too short",
      body: [
        { heading: "Brief", paragraphs: ["A short paragraph.", "Another short paragraph."] },
        { heading: "Also brief", paragraphs: ["A short paragraph.", "Another short paragraph."] },
      ],
    },
    passingVerification,
    sources,
  );

  assert.equal(result.status, "rejected");
  assert.equal(result.scheduledReleases, 0);
  assert.ok(result.errors.includes("headline_length"));
  assert.ok(result.errors.includes("dek_length"));
  assert.ok(result.errors.includes("copy_length"));
});

test("unsupported claims remain rejected even when the shape is valid", () => {
  const result = evaluateEditorialFixture(
    passingDraft,
    { ...passingVerification, unsupportedClaims: ["An outcome not present in either source."] },
    sources,
  );

  assert.equal(result.status, "rejected");
  assert.equal(result.scheduledReleases, 0);
  assert.ok(result.errors.includes("unsupported_claims"));
});

test("source mismatches remain rejected", () => {
  const result = evaluateEditorialFixture(
    { ...passingDraft, sourceUrls: ["https://unrelated.test/story"] },
    passingVerification,
    sources,
  );

  assert.equal(result.status, "rejected");
  assert.equal(result.scheduledReleases, 0);
  assert.ok(result.errors.includes("unknown_source"));
});

test("copied phrasing remains rejected", () => {
  const result = evaluateEditorialFixture(
    passingDraft,
    { ...passingVerification, pass: false, slopFlags: ["copied_phrase"] },
    sources,
  );

  assert.equal(result.status, "rejected");
  assert.equal(result.scheduledReleases, 0);
  assert.ok(result.errors.includes("slop_detected"));
});