import type { IncomingHttpHeaders, ServerResponse } from "node:http";
import type { RequestHandler } from "express";
import { createProxyServer } from "httpxy";

const CLERK_FAPI = "https://frontend-api.clerk.dev";
export const CLERK_PROXY_PATH = "/api/__clerk";

export function getClerkProxyHost(req: { headers: IncomingHttpHeaders }): string | undefined {
  const forwarded = req.headers["x-forwarded-host"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const firstHop = raw?.split(",")[0]?.trim();
  return firstHop || req.headers.host?.trim() || undefined;
}

function writeProxyFailure(res: ServerResponse): void {
  if (res.destroyed || res.writableEnded) return;
  if (res.headersSent) {
    res.destroy();
    return;
  }
  res.writeHead(502, { "content-length": "0" });
  res.end();
}

// Use httpxy directly, the underlying engine used by http-proxy-middleware,
// without carrying its micromatch/braces dependency into the production API.
export function createClerkProxyMiddlewareForTarget(
  target: string,
  secretKey: string,
): RequestHandler {
  const proxy = createProxyServer({
    changeOrigin: true,
    selfHandleResponse: true,
  });

  proxy.on("proxyReq", (proxyReq, req) => {
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = getClerkProxyHost(req) || "";
    proxyReq.setHeader("Clerk-Proxy-Url", `${protocol}://${host}${CLERK_PROXY_PATH}`);
    proxyReq.setHeader("Clerk-Secret-Key", secretKey);

    const xff = req.headers["x-forwarded-for"];
    const clientIp =
      (Array.isArray(xff) ? xff[0] : xff)?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";
    if (clientIp) proxyReq.setHeader("X-Forwarded-For", clientIp);
  });

  proxy.on("proxyRes", (proxyRes, req, res) => {
    const headers = { ...proxyRes.headers };
    delete headers["transfer-encoding"];
    delete headers["connection"];
    delete headers["keep-alive"];

    const status = proxyRes.statusCode ?? 502;
    if (status < 200 || status === 204) delete headers["content-length"];

    const bodyless =
      req.method === "HEAD" ||
      status < 200 ||
      status === 204 ||
      status === 304;
    if (headers["content-length"] !== undefined || bodyless) {
      res.writeHead(status, headers);
      proxyRes.on("error", () => res.destroy());
      proxyRes.pipe(res);
      return;
    }

    const chunks: Buffer[] = [];
    proxyRes.on("data", (chunk: Buffer) => chunks.push(chunk));
    proxyRes.on("end", () => {
      const body = Buffer.concat(chunks);
      headers["content-length"] = String(body.length);
      res.writeHead(status, headers);
      res.end(body);
    });
    proxyRes.on("error", () => writeProxyFailure(res));
  });

  proxy.on("error", (_error, _req, res) => {
    if (res && "writeHead" in res) writeProxyFailure(res);
    else res?.destroy();
  });

  return (req, res) => {
    // Express strips this prefix when mounted at CLERK_PROXY_PATH; retain the
    // old rewrite for callers that mount the handler without an Express prefix.
    req.url = req.url?.replace(new RegExp(`^${CLERK_PROXY_PATH}`), "") ?? req.url;
    void proxy.web(req, res, { target }).catch(() => writeProxyFailure(res));
  };
}

export function clerkProxyMiddleware(): RequestHandler {
  if (process.env.NODE_ENV !== "production") {
    return (_req, _res, next) => next();
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return (_req, _res, next) => next();
  }

  return createClerkProxyMiddlewareForTarget(CLERK_FAPI, secretKey);
}