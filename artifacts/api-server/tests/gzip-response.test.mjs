import assert from "node:assert/strict";
import { createServer, request as httpRequest } from "node:http";
import { brotliDecompressSync, gunzipSync } from "node:zlib";
import express from "express";
import { test } from "node:test";

import { gzipResponseMiddleware as apiGzipResponseMiddleware } from "../src/middlewares/gzipResponseMiddleware.ts";
import { gzipResponseMiddleware as webGzipResponseMiddleware } from "../../global-ai-news/src/server/gzipResponseMiddleware.ts";

const apiTestPaths = [
  "/large",
  "/large-over-limit",
  "/small",
  "/already-encoded",
];

const middlewareFactories = [
  {
    service: "API",
    create: () => apiGzipResponseMiddleware({ paths: apiTestPaths }),
    hasPathAllowlist: true,
  },
  {
    service: "web",
    create: () => webGzipResponseMiddleware(),
    hasPathAllowlist: false,
  },
];

async function getResponse(
  middlewareFactory,
  pathname,
  acceptEncoding = "gzip",
  method = "GET",
) {
  const app = express();
  app.use(middlewareFactory());
  app.get("/large", (_request, response) => {
    response.type("html");
    response.write(`<main>${"x".repeat(5_000)}`);
    response.end("</main>");
  });
  app.get("/large-over-limit", (_request, response) => {
    response.type("html");
    response.write("x".repeat(2 * 1_024 * 1_024 + 1));
    response.end();
  });
  app.post("/large", (_request, response) => {
    response.type("html").send(`<main>${"x".repeat(5_000)}</main>`);
  });
  app.get("/private", (_request, response) => {
    response.type("html").send(`<main>${"x".repeat(5_000)}</main>`);
  });
  app.get("/small", (_request, response) => {
    response.type("text").send("small response");
  });
  app.get("/already-encoded", (_request, response) => {
    response.setHeader("Content-Encoding", "br");
    response.type("text").send("x".repeat(5_000));
  });

  const server = createServer(app);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    return await new Promise((resolve, reject) => {
      const request = httpRequest(
        {
          host: "127.0.0.1",
          port: address.port,
          path: pathname,
          method,
          headers: {
            "accept-encoding": acceptEncoding,
            connection: "close",
          },
        },
        (response) => {
          const chunks = [];
          response.on("data", (chunk) => chunks.push(chunk));
          response.on("end", () =>
            resolve({
              headers: response.headers,
              statusCode: response.statusCode,
              body: Buffer.concat(chunks),
            }),
          );
        },
      );
      request.once("error", reject);
      request.end();
    });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

for (const { service, create, hasPathAllowlist } of middlewareFactories) {
  test(`${service} responses gzip supported text and HTML bodies`, async () => {
    const response = await getResponse(create, "/large");
    assert.equal(response.statusCode, 200);
    assert.equal(response.headers["content-encoding"], "gzip");
    assert.match(response.headers.vary ?? "", /Accept-Encoding/i);
    assert.equal(
      Number(response.headers["content-length"]),
      response.body.byteLength,
    );
    assert.equal(
      gunzipSync(response.body).toString(),
      `<main>${"x".repeat(5_000)}</main>`,
    );
  });

  test(`${service} prefers Brotli when supported and respects encoding quality`, async () => {
    const brotli = await getResponse(create, "/large", "gzip;q=0.8, br;q=1");
    assert.equal(brotli.headers["content-encoding"], "br");
    assert.match(brotli.headers.vary ?? "", /Accept-Encoding/i);
    assert.equal(
      brotliDecompressSync(brotli.body).toString(),
      `<main>${"x".repeat(5_000)}</main>`,
    );

    const gzipOnly = await getResponse(create, "/large", "br;q=0, gzip;q=1");
    assert.equal(gzipOnly.headers["content-encoding"], "gzip");
    assert.equal(gunzipSync(gzipOnly.body).toString(), `<main>${"x".repeat(5_000)}</main>`);
  });

  test(`${service} compression respects opt-out, method, content type, and size bounds`, async () => {
    const optedOut = await getResponse(
      create,
      "/large",
      "gzip;q=0, identity;q=1",
    );
    assert.equal(optedOut.headers["content-encoding"], undefined);
    assert.equal(optedOut.body.toString(), `<main>${"x".repeat(5_000)}</main>`);

    const post = await getResponse(create, "/large", "gzip", "POST");
    assert.equal(post.headers["content-encoding"], undefined);
    assert.equal(post.body.toString(), `<main>${"x".repeat(5_000)}</main>`);

    const small = await getResponse(create, "/small");
    assert.equal(small.headers["content-encoding"], undefined);
    assert.equal(small.body.toString(), "small response");

    const alreadyEncoded = await getResponse(create, "/already-encoded");
    assert.equal(alreadyEncoded.headers["content-encoding"], "br");
    assert.equal(alreadyEncoded.body.toString(), "x".repeat(5_000));

    const overLimit = await getResponse(create, "/large-over-limit");
    assert.equal(overLimit.headers["content-encoding"], undefined);
    assert.equal(overLimit.body.byteLength, 2 * 1_024 * 1_024 + 1);

    if (hasPathAllowlist) {
      const outsideAllowlist = await getResponse(create, "/private");
      assert.equal(outsideAllowlist.headers["content-encoding"], undefined);
      assert.equal(
        outsideAllowlist.body.toString(),
        `<main>${"x".repeat(5_000)}</main>`,
      );
    }
  });
}
