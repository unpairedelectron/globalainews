import { createServer } from 'node:http';

import { getSeoMetadataManifest } from '../artifacts/global-ai-news/src/seo-metadata.ts';

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid metadata server port: "${process.env.PORT ?? ''}"`);
}

const server = createServer((request, response) => {
  if (request.url !== '/api/newsroom/metadata') {
    response.statusCode = 404;
    response.end('Not found');
    return;
  }

  try {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(getSeoMetadataManifest()));
  } catch (error) {
    response.statusCode = 500;
    response.end(`Metadata generation failed: ${String(error)}`);
  }
});

server.listen(port, '127.0.0.1');

function shutdown() {
  server.close(() => process.exit(0));
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);