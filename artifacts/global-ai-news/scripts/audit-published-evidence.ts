import { runPublishedEvidenceAudit } from '../src/server/published-evidence-audit';

try {
  if (!process.env.NEWSROOM_API_ORIGIN) {
    throw new Error('NEWSROOM_API_ORIGIN is not configured.');
  }
  const result = await runPublishedEvidenceAudit();
  console.log(
    `Checked ${result.checked} published source links. Report: ${result.reportPath}`,
  );
} catch {
  console.error('Published evidence audit failed; no article content was changed.');
  process.exitCode = 1;
}
