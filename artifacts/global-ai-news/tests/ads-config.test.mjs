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
assert.match(appSource, /isAdSlotActive\(/, 'the component must use the shared publisher approval policy');
assert.match(appSource, /activateAdSlot\(/, 'the component must use the guarded ad activation path');

const builtHtml = readFileSync(path.join(artifactDir, 'dist/public/index.html'), 'utf8');
assert.doesNotMatch(
  builtHtml,
  /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/,
  'the built HTML must not preload AdSense before client-side configuration is approved',
);

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

async function request(pathname, host, protocol, method = 'GET') {
  return fetch(`http://127.0.0.1:${port}${pathname}`, {
    method,
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
      const response = await request('/ads.txt', 'localhost', 'http');
      if (response.status === 200) { ready = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(ready, `web server did not become ready: ${stderr}`);

  for (const method of ['GET', 'HEAD']) {
    const apex = await request('/?host-check=1', 'globalainews.in', 'https', method);
    assert.equal(apex.status, 200, `apex HTTPS ${method} / must serve directly`);
    assert.equal(apex.headers.get('location'), null, `apex HTTPS ${method} / must not redirect to www`);
    assert.equal(apex.headers.get('x-robots-tag'), null, `canonical apex ${method} / must remain indexable`);
    if (method === 'GET') assert.match(await apex.text(), /<link rel="canonical" href="https:\/\/globalainews\.in\/"/);

    const www = await request('/about-us/?from=www&x=1', 'www.globalainews.in', 'https', method);
    assert.equal(www.status, 301, `www HTTPS ${method} must redirect permanently`);
    assert.equal(
      www.headers.get('location'),
      'https://globalainews.in/about-us/?from=www&x=1',
      `www HTTPS ${method} must go directly to the apex and preserve path and query`,
    );
    const redirectedApex = await request(
      '/about-us/?from=www&x=1',
      'globalainews.in',
      'https',
      method,
    );
    assert.notEqual(redirectedApex.status, 301, `apex ${method} redirect destination must not start another redirect`);
    assert.equal(redirectedApex.headers.get('location'), null, `apex ${method} redirect destination must not create a host chain`);

    const apexHttp = await request('/about-us/?from=http', 'globalainews.in', 'http', method);
    assert.equal(apexHttp.status, 301, `apex HTTP ${method} must upgrade directly to HTTPS`);
    assert.equal(
      apexHttp.headers.get('location'),
      'https://globalainews.in/about-us/?from=http',
      `apex HTTP ${method} must not introduce a www redirect`,
    );

    for (const [route, contentType] of [
      ['/', /^text\/html\b/i],
      ['/robots.txt', /^text\/plain\b/i],
      ['/favicon.svg', /^image\/svg\+xml\b/i],
    ]) {
      const preview = await request(route, 'global-ai-media.replit.app', 'https', method);
      assert.equal(preview.headers.get('x-robots-tag'), 'noindex, nofollow', `preview ${method} ${route} must be excluded from indexing`);
      if (route === '/') assert.match(preview.headers.get('content-type') ?? '', contentType);
    }

    const robots = await request('/robots.txt', 'globalainews.in', 'https', method);
    assert.equal(robots.status, 200, `apex ${method} /robots.txt must be served`);
    assert.notEqual(
      robots.headers.get('x-robots-tag'),
      'noindex, nofollow',
      `apex ${method} /robots.txt must not receive the preview-host exclusion`,
    );
    if (method === 'GET') {
      const robotsBody = await robots.text();
      assert.match(robotsBody, /^User-agent: \*/m);
      assert.match(robotsBody, /^Sitemap: https:\/\/globalainews\.in\/sitemap\.xml$/m);
    }
  }

  const retiredStory = await request('/article/public-compute-needs-public-metrics?source=old', 'www.globalainews.in', 'https');
  assert.equal(retiredStory.status, 301, 'retired story alias must preserve its permanent redirect behavior');
  assert.equal(
    retiredStory.headers.get('location'),
    'https://globalainews.in/article/india-ai-compute-access-2026/?source=old',
    'retired story redirect must go directly to the apex canonical URL',
  );
  const expiredUuid = await request('/article/123e4567-e89b-12d3-a456-426614174000', 'globalainews.in', 'https');
  assert.equal(expiredUuid.status, 410, 'retired UUID article routes must retain their 410 status');
} finally {
  serverProcess.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => serverProcess.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
}

console.log('PASS: shared AdSense ID, apex canonical redirects, preview noindex headers, crawler files, and retired route statuses');
