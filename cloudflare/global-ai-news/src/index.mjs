const CACHE_CONTROL = "no-store";

function getOriginUrl(rawOrigin, requestUrl) {
  if (!rawOrigin) {
    throw new Error("ORIGIN_URL is required.");
  }

  const origin = new URL(rawOrigin);
  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash
  ) {
    throw new Error("ORIGIN_URL must be a credential-free HTTPS origin.");
  }

  const incoming = new URL(requestUrl);
  if (origin.host === incoming.host) {
    throw new Error("ORIGIN_URL must not match the incoming host.");
  }
  return origin;
}

export default {
  async fetch(request, env) {
    let origin;
    try {
      origin = getOriginUrl(env.ORIGIN_URL, request.url);
    } catch {
      return new Response("Cloudflare origin is not configured.\n", {
        status: 503,
        headers: {
          "Cache-Control": CACHE_CONTROL,
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const incomingUrl = new URL(request.url);
    const upstreamUrl = new URL(incomingUrl.pathname + incomingUrl.search, origin);
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.set("x-forwarded-host", incomingUrl.host);
    headers.set("x-forwarded-proto", incomingUrl.protocol.slice(0, -1));

    try {
      const upstreamRequest = new Request(upstreamUrl, {
        method: request.method,
        headers,
        body:
          request.method === "GET" || request.method === "HEAD"
            ? undefined
            : request.body,
        redirect: "manual",
        ...(request.body ? { duplex: "half" } : {}),
      });
      const upstreamResponse = await fetch(upstreamRequest);
      const response = new Response(upstreamResponse.body, upstreamResponse);
      response.headers.set("X-GAN-Cloudflare-Proxy", "active");
      return response;
    } catch {
      return new Response("The origin is temporarily unavailable.\n", {
        status: 502,
        headers: {
          "Cache-Control": CACHE_CONTROL,
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }
  },
};
