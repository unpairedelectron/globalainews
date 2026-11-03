import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const artifactRoot = path.resolve(testDirectory, '..');
const workspaceRoot = path.resolve(testDirectory, '../../..');
const registryPath = path.join(workspaceRoot, 'release/article-registry.json');
const stagingBuilderPath = path.join(artifactRoot, 'scripts/build-staging-articles.mjs');
const stagingRoot = path.join(artifactRoot, 'public/staging');

test('staging previews preserve citation targets and hide private editorial metadata', () => {
  execFileSync(process.execPath, [stagingBuilderPath], {
    cwd: workspaceRoot,
    stdio: 'pipe',
  });

  const releases = JSON.parse(readFileSync(registryPath, 'utf8')).entries;
  assert.equal(releases.length, 10, 'the reviewed staging set should contain ten articles');

  for (const { slug } of releases) {
    const pagePath = path.join(stagingRoot, 'article', slug, 'index.html');
    const html = readFileSync(pagePath, 'utf8');
    const sourceEntries = [...html.matchAll(/<li id="source-(\d+)" value="(\d+)">/g)]
      .map(([, id, value]) => ({ id, value }));
    const citationTargets = [...html.matchAll(/<a href="#source-(\d+)">/g)]
      .map(([, id]) => id);

    assert.match(html, /name="robots" content="noindex,nofollow"/, `${slug} must remain noindex`);
    assert.doesNotMatch(html, /Private draft|Publication status:|<strong>(Byline|Reviewer):<\/strong>|<h2[^>]*>Corrections log<\/h2>/i, `${slug} leaks draft metadata`);
    assert.doesNotMatch(html, /<h2[^>]*>(Related coverage|Subscribe)<\/h2>/i, `${slug} repeats a generic template section`);
    assert.ok(sourceEntries.length >= 8, `${slug} should retain its numbered bibliography`);
    assert.ok(citationTargets.length > 0, `${slug} should retain inline citations`);
    assert.equal(new Set(sourceEntries.map(({ id }) => id)).size, sourceEntries.length, `${slug} has duplicate source anchors`);

    for (const { id, value } of sourceEntries) {
      assert.equal(id, value, `${slug} must display each source under its actual reference number`);
    }
    for (const id of citationTargets) {
      assert.ok(sourceEntries.some((entry) => entry.id === id), `${slug} has a citation with no matching source ${id}`);
    }

    assert.ok((html.match(/<img\b/g) ?? []).length >= 4, `${slug} should retain its hero and editorial visuals`);
    assert.ok((html.match(/<table\b/g) ?? []).length >= 3, `${slug} should retain its article tables`);
  }
});
