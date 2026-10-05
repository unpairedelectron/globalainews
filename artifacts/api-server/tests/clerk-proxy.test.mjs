import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import express from "express";
import {
  CLERK_PROXY_PATH,
  createClerkProxyMiddlewareForTarget,
} from "../src/middlewares/clerkProxyMiddleware.ts";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve(server.address().port);
    });
  });
}

async function close(server) {
  if (!server.listening) return;
  server.closeAllConnections?.();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function startProxyApp(t, target, secretKey = "test-clerk-secret") {
  const app = express();
  app.use(CLERK_PROXY_PATH, createClerkProxyMiddlewareForTarget(target, secretKey));
  const server = createServer(app);
  const port = await listen(server);
  t.after(() => close(server));
  return `http://127.0.0.1:${port}`;
}

test("Clerk proxy preserves path, forwarded headers, secret header, and streamed response", async (t) => {
  let observedRequest;
  const upstream = createServer((req, res) => {
    observedRequest = { url: req.url, headers: req.headers };
    res.writeHead(201, {
      "content-type": "application/json",
      "set-cookie": "clerk-session=sample; Path=/",
    });
    res.write('{"state":');
    setTimeout(() => res.end('"ready"}'), 5);
  });
  const upstreamPort = await listen(upstream);
  t.after(() => close(upstream));

  const appUrl = await startProxyApp(t, `http://127.0.0.1:${upstreamPort}`);
  const response = await fetch(
    `${appUrl}${CLERK_PROXY_PATH}/v1/session?flow=sample`,
    {
      headers: {
        "x-forwarded-host": "news.example.test, proxy.internal",
        "x-forwarded-proto": "https",
        "x-forwarded-for": "203.0.113.7, 10.0.0.2",
        connection: "close",
      },
    },
  );

  const body = await response.text();
  assert.equal(response.status, 201);
  assert.equal(body, '{"state":"ready"}');
  assert.equal(response.headers.get("content-length"), String(Buffer.byteLength(body)));
  assert.equal(response.headers.get("transfer-encoding"), null);
  assert.equal(response.headers.get("set-cookie"), "clerk-session=sample; Path=/");
  assert.equal(observedRequest.url, "/v1/session?flow=sample");
  assert.equal(observedRequest.headers.host, `127.0.0.1:${upstreamPort}`);
  assert.equal(observedRequest.headers["clerk-proxy-url"], "https://news.example.test/api/__clerk");
  assert.equal(observedRequest.headers["clerk-secret-key"], "test-clerk-secret");
  assert.equal(observedRequest.headers["x-forwarded-for"], "203.0.113.7");
});

test("Clerk proxy preserves no-content and HEAD responses", async (t) => {
  const upstream = createServer((req, res) => {
    if (req.url === "/v1/no-content") {
      res.writeHead(204, { "x-upstream-result": "empty" });
      res.end();
      return;
    }
    res.writeHead(200, { "content-length": "4", "content-type": "text/plain" });
    res.end("body");
  });
  const upstreamPort = await listen(upstream);
  t.after(() => close(upstream));

  const appUrl = await startProxyApp(t, `http://127.0.0.1:${upstreamPort}`);
  const noContent = await fetch(`${appUrl}${CLERK_PROXY_PATH}/v1/no-content`, {
    headers: { connection: "close" },
  });
  assert.equal(noContent.status, 204);
  assert.equal(noContent.headers.get("x-upstream-result"), "empty");
  assert.equal(await noContent.text(), "");

  const head = await fetch(`${appUrl}${CLERK_PROXY_PATH}/v1/head`, {
    method: "HEAD",
    headers: { connection: "close" },
  });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get("content-length"), "4");
  assert.equal(await head.text(), "");
});

test("Clerk proxy fails explicitly with an empty 502 when the upstream is unavailable", async (t) => {
  const closedUpstream = createServer();
  const closedPort = await listen(closedUpstream);
  await close(closedUpstream);

  const appUrl = await startProxyApp(t, `http://127.0.0.1:${closedPort}`);
  const response = await fetch(`${appUrl}${CLERK_PROXY_PATH}/v1/session`, {
    headers: { connection: "close" },
  });

  assert.equal(response.status, 502);
  assert.equal(await response.text(), "");
});