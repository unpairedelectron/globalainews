import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { runPublishedEvidenceAudit } from '../src/server/published-evidence-audit';

const publicContent = {
  stories: [
    { slug: 'published-story', sources: ['evidence-one'] },
    { slug: 'draft-story', status: 'private-draft', sources: ['draft-only'] },
  ],
  sources: [
    {
      slug: 'evidence-one',
      name: 'Public evidence record',
      publisher: 'Example Publisher',
      url: 'https://sources.example.test/evidence',
    },
    {
      slug: 'draft-only',
      name: 'Private draft evidence',
      publisher: 'Private Publisher',
      url: 'https://sources.example.test/private',
    },
  ],
};

async function withStateFile<T>(run: (stateFile: string) => Promise<T>): Promise<T> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'published-evidence-audit-'));
  try {
    return await run(path.join(directory, 'audit-state.json'));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function createFetcher(statuses: number[]) {
  const checkedUrls: string[] = [];
  let call = 0;
  const fetcher: typeof fetch = async (input) => {
    const url = String(input);
    checkedUrls.push(url);
    if (url.endsWith('/api/newsroom/content')) {
      return new Response(JSON.stringify(publicContent), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    const status = statuses[Math.min(call++, statuses.length - 1)];
    return new Response(null, { status });
  };
  return { fetcher, checkedUrls };
}

test('published source links become persistent only after two definitive removals', async () => {
  await withStateFile(async (stateFile) => {
    const notifications: unknown[][] = [];
    const { fetcher, checkedUrls } = createFetcher([404, 410]);
    const options = {
      apiOrigin: 'https://api.example.test',
      stateFile,
      fetcher,
      now: () => new Date('2026-11-08T12:00:00.000Z'),
      notify: async (findings: unknown[]) => {
        notifications.push(findings);
      },
      log: () => undefined,
    };

    const first = await runPublishedEvidenceAudit(options);
    assert.equal(first.checked, 1);
    assert.equal(first.findings[0].status, 'removal-suspected');
    assert.equal(notifications.length, 0);

    const second = await runPublishedEvidenceAudit(options);
    assert.equal(second.findings[0].status, 'persistent-removal');
    assert.equal(second.findings[0].consecutiveNotFound, 2);
    assert.equal(second.findings[0].lastChecked, '2026-11-08T12:00:00.000Z');
    assert.equal(notifications.length, 1);
    assert.deepEqual(second.findings[0].routes, ['/article/published-story/']);
    assert.deepEqual(checkedUrls.filter((url) => url.includes('/evidence')).length, 2);
    assert.equal(checkedUrls.some((url) => url.includes('/private')), false);

    const savedState = JSON.parse(await readFile(stateFile, 'utf8'));
    assert.equal(savedState.sources['https://sources.example.test/evidence'].status, 'persistent-removal');
  });
});

test('transient failures are reported separately and do not confirm removals', async () => {
  await withStateFile(async (stateFile) => {
    const { fetcher } = createFetcher([404, 503, 404]);
    const options = {
      apiOrigin: 'https://api.example.test',
      stateFile,
      fetcher,
      now: () => new Date('2026-11-08T12:00:00.000Z'),
      log: () => undefined,
    };

    await runPublishedEvidenceAudit(options);
    const transient = await runPublishedEvidenceAudit(options);
    assert.equal(transient.findings[0].status, 'transient-failure');
    assert.equal(transient.findings[0].consecutiveNotFound, 1);

    const confirmed = await runPublishedEvidenceAudit(options);
    assert.equal(confirmed.findings[0].status, 'persistent-removal');
    assert.equal(confirmed.findings[0].consecutiveNotFound, 2);
  });
});

test('a reachable source clears its removal streak', async () => {
  await withStateFile(async (stateFile) => {
    const { fetcher } = createFetcher([404, 200, 404]);
    const options = {
      apiOrigin: 'https://api.example.test',
      stateFile,
      fetcher,
      now: () => new Date('2026-11-08T12:00:00.000Z'),
      log: () => undefined,
    };

    await runPublishedEvidenceAudit(options);
    const recovered = await runPublishedEvidenceAudit(options);
    assert.equal(recovered.findings[0].status, 'reachable');
    assert.equal(recovered.findings[0].consecutiveNotFound, 0);

    const laterMissing = await runPublishedEvidenceAudit(options);
    assert.equal(laterMissing.findings[0].status, 'removal-suspected');
    assert.equal(laterMissing.findings[0].consecutiveNotFound, 1);
  });
});
