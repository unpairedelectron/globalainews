import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const metadataServerPath = path.join(workspaceRoot, 'scripts', 'release-metadata-server.mjs');
const adsenseConfigPath = path.join(workspaceRoot, 'artifacts/global-ai-news/src/adsense-config.ts');
const adsTxtPath = path.join(workspaceRoot, 'artifacts/global-ai-news/public/ads.txt');
const adsenseConfig = readFileSync(adsenseConfigPath, 'utf8');
const adsensePublisherId = adsenseConfig.match(/export const ADSENSE_PUBLISHER_ID = '([^']+)';/)?.[1];
if (!adsensePublisherId || !/^pub-\d+$/.test(adsensePublisherId)) {
  throw new Error('ADSENSE_PUBLISHER_ID is missing or invalid.');
}
const expectedAdsTxt = `google.com, ${adsensePublisherId}, DIRECT, f08c47fec0942fa0\n`;
if (readFileSync(adsTxtPath, 'utf8') !== expectedAdsTxt) {
  throw new Error('public/ads.txt must match ADSENSE_PUBLISHER_ID exactly.');
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Could not determine a free metadata port.')));
        return;
      }
      server.close((error) => (error ? reject(error) : resolve(address.port)));
    });
  });
}

function terminate(processHandle) {
  if (!processHandle?.pid) return;
  try {
    process.kill(-processHandle.pid, 'SIGTERM');
  } catch {
    processHandle.kill('SIGTERM');
  }
}

function run(command, args, options) {
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with status ${result.status}.`);
  }
}

async function waitForMetadata(url, processHandle) {
  const deadline = Date.now() + 30_000;
  let lastError = 'no response';
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  terminate(processHandle);
  throw new Error(`Newsroom metadata API did not become ready: ${lastError}.`);
}

const metadataPort = await findFreePort();
const metadataUrl = `http://127.0.0.1:${metadataPort}/api/newsroom/metadata`;
const metadataProcess = spawn(
  'pnpm',
  ['--filter', '@workspace/scripts', 'exec', 'tsx', metadataServerPath],
  {
    cwd: workspaceRoot,
    detached: true,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(metadataPort),
    },
    stdio: ['ignore', 'inherit', 'inherit'],
  },
);

try {
  await waitForMetadata(metadataUrl, metadataProcess);
  run(
    'pnpm',
    ['--filter', '@workspace/global-ai-news', 'run', 'build'],
    {
      env: {
        ...process.env,
        BASE_PATH: process.env.BASE_PATH ?? '/',
        NEWSROOM_METADATA_URL: metadataUrl,
        NODE_ENV: 'production',
        PORT: process.env.PORT ?? '19819',
      },
    },
  );
} finally {
  terminate(metadataProcess);
}