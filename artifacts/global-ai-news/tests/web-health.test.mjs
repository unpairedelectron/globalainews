import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';
import path from 'node:path';
import { test } from 'node:test';

const root = path.resolve(import.meta.dirname, '..', '..', '..');
const serverEntry = path.join(root, 'artifacts', 'global-ai-news', 'dist', 'server', 'server.mjs');

async function findFreePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not determine a free port.');
  const { port } = address;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

test('web health route returns only a cache-disabled public status', async (context) => {
  const port = await findFreePort();
  const processHandle = spawn('node', [serverEntry], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      NEWSROOM_API_ORIGIN: 'http://127.0.0.1:1',
      PORT: String(port),
    },
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  context.after(async () => {
    if (processHandle.exitCode !== null || processHandle.signalCode !== null) return;
    const exited = once(processHandle, 'exit').catch(() => {});
    processHandle.kill('SIGTERM');
    await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 2_000))]);
    if (processHandle.exitCode === null && processHandle.signalCode === null) {
      processHandle.kill('SIGKILL');
      await exited;
    }
  });

  const endpoint = `http://127.0.0.1:${port}/healthz`;
  let response;
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      response = await fetch(endpoint);
      break;
    } catch {
      if (processHandle.exitCode !== null) {
        throw new Error(`Web server exited before health check: ${processHandle.exitCode}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  assert.ok(response, 'health endpoint did not respond before the timeout');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { status: 'ok' });
});
