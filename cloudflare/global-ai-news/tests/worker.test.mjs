import assert from "node:assert/strict";
import test from "node:test";

import worker from "../src/index.mjs";

const originalFetch = globalThis.fetch;

test("forwards path, query, method, body, and trusted forwarding headers", async () => {
  let capturedRequest;
  globalThis.fetch = async (request) => {
    capturedRequest = request;
    return new Response("ok", { status: 200 });
  };

  try {
    const request = new Request(
      "https://preview.example.test/api/newsroom/content?topic=compute",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-Host": "attacker.example",
          "X-Forwarded-Proto": "http",
        },
        body: JSON.stringify({ page: 2 }),
      },
    );
    const response = await worker.fetch(request, {
      ORIGIN_URL: "https://global-ai-media.replit.app",
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("X-GAN-Cloudflare-Proxy"), "active");
    assert.equal(
      capturedRequest.url,
      "https://global-ai-media.replit.app/api/newsroom/content?topic=compute",
    );
    assert.equal(capturedRequest.method, "POST");
    assert.equal(capturedRequest.headers.get("x-forwarded-host"), "preview.example.test");
    assert.equal(capturedRequest.headers.get("x-forwarded-proto"), "https");
    assert.deepEqual(await capturedRequest.json(), { page: 2 });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fails closed when the origin is missing or unsafe", async () => {
  for (const ORIGIN_URL of [
    undefined,
    "http://origin.example",
    "https://user:password@origin.example",
    "https://preview.example.test",
  ]) {
    const response = await worker.fetch(
      new Request("https://preview.example.test/"),
      { ORIGIN_URL },
    );
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
});

test("returns a non-cacheable 502 when the origin fetch fails", async () => {
  globalThis.fetch = async () => {
    throw new Error("origin unavailable");
  };

  try {
    const response = await worker.fetch(
      new Request("https://preview.example.test/"),
      { ORIGIN_URL: "https://global-ai-media.replit.app" },
    );
    assert.equal(response.status, 502);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
