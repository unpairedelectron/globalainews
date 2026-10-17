import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const artifactDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = path.resolve(artifactDir, '../..');
const configSource = readFileSync(path.join(artifactDir, 'src/adsense-config.ts'), 'utf8');
const publisherId = configSource.match(/export const ADSENSE_PUBLISHER_ID = '([^']+)';/)?.[1];
assert.match(publisherId ?? '', /^pub-\d+$/, 'publisher ID must come from the shared config constant');

const expected = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
for (const adsFile of [
  path.join(artifactDir, 'public/ads.txt'),
  path.join(artifactDir, 'dist/public/ads.txt'),
  path.join(artifactDir, 'dist/server/ads.txt'),
]) {
  assert.equal(readFileSync(adsFile, 'utf8'), expected, `${path.relative(workspaceRoot, adsFile)} must match the configured publisher ID`);
}

const appSource = readFileSync(path.join(artifactDir, 'src/components/monetization.tsx'), 'utf8');
assert.doesNotMatch(appSource, /pub-\d{10,}/, 'the ad client must not hard-code a second publisher ID');

const portServer = createServer();
const port = await new Promise((resolve, reject) => {
  portServer.once('error', reject);
  portServer.listen(0, '127.0.0.1', () => {
    const address = portServer.address();
    if (!address || typeof address === 'string') return reject(new Error('Could not allocate a test port.'));
    portServer.close((error) => error ? reject(error) : resolve(address.port));
  });
});

const serverProcess = spawn(process.execPath, [path.join(artifactDir, 'dist/server/server.mjs')], {
  cwd: workspaceRoot,
  env: { ...process.env, PORT: String(port), NEWSROOM_API_ORIGIN: '' },
  stdio: ['ignore', 'ignore', 'pipe'],
});
let stderr = '';
serverProcess.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });

async function request(pathname, host, protocol) {
  return fetch(`http://127.0.0.1:${port}${pathname}`, {
    headers: { host, 'x-forwarded-host': host, 'x-forwarded-proto': protocol },
    redirect: 'manual',
    signal: AbortSignal.timeout(2_000),
  });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (serverProcess.exitCode !== null) throw new Error(`Web server exited before starting: ${stderr}`);
    try {
      const response = await request('/ads.txt', 'www.globalainews.in', 'https');
      if (response.status === 200) { ready = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(ready, `web server did not become ready: ${stderr}`);

  for (const [host, protocol] of [
    ['globalainews.in', 'http'],
    ['www.globalainews.in', 'https'],
  ]) {
    const response = await request('/ads.txt', host, protocol);
    assert.equal(response.status, 200, `${host} /ads.txt must return 200`);
    assert.equal(response.headers.get('location'), null, `${host} /ads.txt must not redirect`);
    assert.match(response.headers.get('content-type') ?? '', /^text\/plain;\s*charset=utf-8$/i);
    assert.equal(await response.text(), expected, `${host} /ads.txt body must be exact`);
  }

  const apexOtherPath = await request('/about-us/', 'globalainews.in', 'http');
  assert.equal(apexOtherPath.status, 301, 'other apex paths must redirect to www');
  assert.equal(apexOtherPath.headers.get('location'), 'https://www.globalainews.in/about-us/');
} finally {
  serverProcess.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => serverProcess.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
}

console.log('PASS: shared AdSense ID, built ads.txt artifacts, both canonical hosts, and apex redirect behavior');
