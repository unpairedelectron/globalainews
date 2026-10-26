import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..', '..', '..');
const route = '/article/ai-models-antibiotic-discovery';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Could not determine a free port.')));
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

async function waitFor(url, processHandle) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The API may still be compiling and starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  terminate(processHandle);
  throw new Error(`The API did not become ready at ${url}.`);
}

const apiPort = await findFreePort();
const apiProcess = spawn('pnpm', ['--filter', '@workspace/api-server', 'run', 'dev'], {
  cwd: root,
  detached: true,
  env: {
    ...process.env,
    PORT: String(apiPort),
    NEWSROOM_ALLOW_DEFAULT_SCHEDULE_SEED: 'false',
  },
  stdio: ['ignore', 'inherit', 'inherit'],
});

let metadataServer;
let responseServer;
let outputDir;

try {
  const apiUrl = `http://127.0.0.1:${apiPort}`;
  await waitFor(`${apiUrl}/api/healthz`, apiProcess);
  const apiManifest = await (await fetch(`${apiUrl}/api/newsroom/metadata`)).json();
  const apiContent = await (await fetch(`${apiUrl}/api/newsroom/content`)).json();
  const publicArticleSlugs = [
    'reliability-is-the-new-ai-moat',
    'weekly-deep-dive-cost-of-intelligence',
  ];
  for (const slug of publicArticleSlugs) {
    assert.ok(
      apiContent.stories.some((story) => story.slug === slug),
      `${slug} must be in the public API snapshot even when no default editor releases are seeded`,
    );
    assert.ok(
      apiManifest.routes.some((metadata) => metadata.path === `/article/${slug}`),
      `${slug} must have API-backed metadata for its public article route`,
    );
  }
  assert.ok(
    apiManifest.routes.some((metadata) => metadata.path === '/signals' && metadata.indexable !== false),
    'the indexable Signals page must be represented in the API metadata manifest',
  );
  const sitemapResponse = await fetch(`${apiUrl}/api/newsroom/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200, 'API sitemap should be available');
  for (const slug of publicArticleSlugs) {
    assert.ok(
      sitemap.includes(`/article/${slug}/`),
      `${slug} must be present in the sitemap with its public API route`,
    );
  }
  assert.ok(sitemap.includes('/signals/'), 'the indexable Signals page must be present in the sitemap');
  const editedTitle = 'Edited by the newsroom before release — Global AI News';
  const editedDescription =
    'An API editorial update reaches the crawler-visible first response before publication.';
  const editedManifest = {
    ...apiManifest,
    routes: apiManifest.routes.map((metadata) =>
      metadata.path === route
        ? { ...metadata, title: editedTitle, description: editedDescription }
        : metadata,
    ),
  };

  metadataServer = createServer((request, response) => {
    if (request.url === '/api/newsroom/metadata') {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(editedManifest));
      return;
    }
    if (request.url === '/api/newsroom/content') {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(apiContent));
      return;
    }
    if (request.url === '/api/newsroom/stale') {
      response.setHeader('Content-Type', 'application/json');
      response.end(
        JSON.stringify({
          ...editedManifest,
          generatedAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
        }),
      );
      return;
    }
    if (request.url === '/api/newsroom/missing') {
      response.statusCode = 503;
      response.end('Metadata unavailable');
      return;
    }
    response.statusCode = 404;
    response.end('Not found');
  });
  await new Promise((resolve) => metadataServer.listen(0, '127.0.0.1', resolve));
  const metadataPort = metadataServer.address().port;

  outputDir = await mkdtemp(path.join(os.tmpdir(), 'global-ai-news-release-'));
  await execFileAsync(
    'pnpm',
    ['--filter', '@workspace/global-ai-news', 'run', 'build'],
    {
      cwd: root,
      env: {
        ...process.env,
        BASE_PATH: '/',
        NEWSROOM_METADATA_URL: `http://127.0.0.1:${metadataPort}/api/newsroom/metadata`,
        NODE_ENV: 'production',
        PORT: '19819',
        PUBLICATION_OUTPUT_DIR: outputDir,
      },
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  responseServer = createServer(async (_request, response) => {
    const document = await readFile(
      path.join(outputDir, route.slice(1), 'index.html'),
      'utf8',
    );
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.end(document);
  });
  await new Promise((resolve) => responseServer.listen(0, '127.0.0.1', resolve));
  const responsePort = responseServer.address().port;
  const firstResponse = await fetch(`http://127.0.0.1:${responsePort}${route}`);
  const document = await firstResponse.text();

  assert.equal(firstResponse.status, 200, 'edited route did not return a first response');
  assert.match(
    document,
    new RegExp(`<title>${escapeHtml(editedTitle)}</title>`),
    'the first response kept the old API title',
  );
  assert.match(
    document,
    new RegExp(
      `<meta name="description" content="${escapeHtml(editedDescription)}"`,
    ),
    'the first response kept the old API description',
  );
  const releaseStory = apiContent.stories.find(
    (story) => `/article/${story.slug}` === route,
  );
  assert.ok(releaseStory, 'release content snapshot is missing the tested article');
  const releaseAuthor = apiContent.authors.find(
    (author) => author.slug === releaseStory.author,
  );
  const hasVerifiedReleaseAuthor = releaseAuthor?.verifiedForPublication === true;
  if (hasVerifiedReleaseAuthor) {
    assert.ok(
      document.includes(`/person/${releaseAuthor.slug}/`) &&
        document.includes(releaseAuthor.name),
      'the first response is missing the verified API-backed author attribution',
    );
  } else {
    assert.equal(
      releaseStory.author,
      'global-ai-news-editorial-desk',
      'an unverified release author must resolve to the publication desk identity',
    );
    assert.equal(releaseStory.authorType, 'organization');
    assert.equal(releaseStory.authorName, 'Global AI News Editorial Desk');
    assert.ok(
      document.includes('<strong class="font-semibold">Global AI News Editorial Desk</strong>') &&
        document.includes('The Global AI News Editorial Desk publishes source-linked reporting, analysis, research and reference material') &&
        !document.includes(`href="/person/${releaseStory.author}/`),
      'unverified authors should use the editorial desk byline and have no public profile link',
    );
  }
  const releaseSource = apiContent.sources.find(
    (source) => releaseStory.sources.includes(source.slug),
  );
  assert.ok(releaseSource, 'release article has no resolvable source record');
  assert.ok(
    document.includes(releaseSource.name),
    'the first response is missing the API-backed source attribution',
  );
  const authorPagePath = path.join(outputDir, 'person', releaseStory.author, 'index.html');
  if (hasVerifiedReleaseAuthor) {
    const authorPage = await readFile(authorPagePath, 'utf8');
    assert.match(
      authorPage,
      /"@type":"ProfilePage"/,
      'verified author page is missing ProfilePage structured data',
    );
  } else {
    await assert.rejects(
      readFile(authorPagePath, 'utf8'),
      { code: 'ENOENT' },
      'unverified author profile should not be included in public release output',
    );
  }

  async function assertBuildFails(metadataUrl, message) {
    const failedOutputDir = await mkdtemp(
      path.join(os.tmpdir(), 'global-ai-news-release-failure-'),
    );
    try {
      await assert.rejects(
        execFileAsync(
          'pnpm',
          ['--filter', '@workspace/global-ai-news', 'run', 'build'],
          {
            cwd: root,
            env: {
              ...process.env,
              BASE_PATH: '/',
              NEWSROOM_METADATA_URL: metadataUrl,
              NODE_ENV: 'production',
              PORT: '19819',
              PUBLICATION_OUTPUT_DIR: failedOutputDir,
            },
            maxBuffer: 10 * 1024 * 1024,
          },
        ),
        (error) => `${error.stdout ?? ''}\n${error.stderr ?? ''}`.includes(message),
      );
    } finally {
      await rm(failedOutputDir, { recursive: true, force: true });
    }
  }

  await assertBuildFails(
    `http://127.0.0.1:${metadataPort}/api/newsroom/stale`,
    'is stale',
  );
  await assertBuildFails(
    `http://127.0.0.1:${metadataPort}/api/newsroom/missing`,
    'returned HTTP 503',
  );
  console.log('Release metadata check confirmed edited API title and description in the first response.');
} finally {
  if (responseServer) await new Promise((resolve) => responseServer.close(resolve));
  if (metadataServer) await new Promise((resolve) => metadataServer.close(resolve));
  terminate(apiProcess);
  if (outputDir) await rm(outputDir, { recursive: true, force: true });
}