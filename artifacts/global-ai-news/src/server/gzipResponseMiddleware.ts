import { gzipSync } from 'node:zlib';
import type { RequestHandler } from 'express';

const MINIMUM_COMPRESSIBLE_BYTES = 1_024;
const MAXIMUM_BUFFERED_BYTES = 2 * 1_024 * 1_024;

type NativeResponseMethod = (...args: any[]) => any;

export type GzipResponseMiddlewareOptions = {
  paths?: readonly string[];
};

function acceptsGzip(header: string | undefined): boolean {
  if (!header) return false;
  let wildcardQuality: number | undefined;

  for (const part of header.split(',')) {
    const [encoding, ...parameters] = part.trim().toLowerCase().split(';');
    const qualityParameter = parameters.find((parameter) =>
      parameter.trim().startsWith('q='),
    );
    const quality = qualityParameter
      ? Number(qualityParameter.trim().slice(2))
      : 1;
    const accepted = Number.isFinite(quality) && quality > 0;

    if (encoding === 'gzip') return accepted;
    if (encoding === '*') wildcardQuality = accepted ? quality : 0;
  }

  return wildcardQuality !== undefined && wildcardQuality > 0;
}

function isCompressibleContentType(
  header: string | number | string[] | undefined,
): boolean {
  if (header === undefined) return false;
  const mimeType = String(header).split(';', 1)[0]?.trim().toLowerCase() ?? '';
  return (
    mimeType.startsWith('text/') ||
    mimeType === 'application/json' ||
    mimeType.endsWith('+json') ||
    mimeType === 'application/javascript' ||
    mimeType === 'application/x-javascript' ||
    mimeType === 'application/xml' ||
    mimeType.endsWith('+xml') ||
    mimeType === 'application/rss+xml' ||
    mimeType === 'image/svg+xml'
  );
}

function toBuffer(chunk: unknown, encoding: unknown): Buffer | undefined {
  if (typeof chunk === 'string') {
    const selectedEncoding =
      typeof encoding === 'string' && Buffer.isEncoding(encoding)
        ? (encoding as BufferEncoding)
        : 'utf8';
    return Buffer.from(chunk, selectedEncoding);
  }
  if (chunk instanceof Uint8Array) return Buffer.from(chunk);
  return undefined;
}

export function gzipResponseMiddleware(
  options: GzipResponseMiddlewareOptions = {},
): RequestHandler {
  const allowedPaths = options.paths ? new Set(options.paths) : undefined;

  return (request, response, next) => {
    if (
      !acceptsGzip(request.headers['accept-encoding']) ||
      request.method !== 'GET' ||
      (allowedPaths && !allowedPaths.has(request.path)) ||
      request.headers.range
    ) {
      next();
      return;
    }

    const nativeWrite = response.write.bind(response) as NativeResponseMethod;
    const nativeEnd = response.end.bind(response) as NativeResponseMethod;
    let bufferedChunks: Buffer[] = [];
    let bufferedBytes = 0;
    let passedThrough = false;

    const flushBufferedChunks = (): void => {
      for (const chunk of bufferedChunks) nativeWrite(chunk);
      bufferedChunks = [];
      bufferedBytes = 0;
    };

    response.write = ((...args: any[]) => {
      if (passedThrough) return nativeWrite(...args);
      if (response.headersSent) {
        flushBufferedChunks();
        passedThrough = true;
        return nativeWrite(...args);
      }

      const [chunk, encoding, callback] = args;
      const normalizedChunk = toBuffer(chunk, encoding);
      if (
        !normalizedChunk ||
        bufferedBytes + normalizedChunk.byteLength > MAXIMUM_BUFFERED_BYTES
      ) {
        flushBufferedChunks();
        passedThrough = true;
        return nativeWrite(...args);
      }

      bufferedChunks.push(normalizedChunk);
      bufferedBytes += normalizedChunk.byteLength;
      if (typeof callback === 'function') queueMicrotask(() => callback());
      return true;
    }) as typeof response.write;

    response.end = ((...args: any[]) => {
      if (passedThrough) return nativeEnd(...args);
      if (response.headersSent) {
        flushBufferedChunks();
        passedThrough = true;
        return nativeEnd(...args);
      }

      let [chunk, encoding, callback] = args;
      if (typeof chunk === 'function') {
        callback = chunk;
        chunk = undefined;
        encoding = undefined;
      } else if (typeof encoding === 'function') {
        callback = encoding;
        encoding = undefined;
      }

      const finalChunk = chunk === undefined ? undefined : toBuffer(chunk, encoding);
      if (
        (chunk !== undefined && !finalChunk) ||
        (finalChunk &&
          bufferedBytes + finalChunk.byteLength > MAXIMUM_BUFFERED_BYTES)
      ) {
        flushBufferedChunks();
        passedThrough = true;
        return nativeEnd(...args);
      }

      if (finalChunk) {
        bufferedChunks.push(finalChunk);
        bufferedBytes += finalChunk.byteLength;
      }

      const cacheControl = String(response.getHeader('Cache-Control') ?? '').toLowerCase();
      const shouldCompress =
        bufferedBytes >= MINIMUM_COMPRESSIBLE_BYTES &&
        response.statusCode >= 200 &&
        response.statusCode !== 204 &&
        response.statusCode !== 205 &&
        response.statusCode !== 304 &&
        isCompressibleContentType(response.getHeader('Content-Type')) &&
        !response.hasHeader('Content-Encoding') &&
        !cacheControl.includes('no-transform');

      passedThrough = true;
      if (shouldCompress) {
        const compressedBody = gzipSync(Buffer.concat(bufferedChunks));
        response.vary('Accept-Encoding');
        response.setHeader('Content-Encoding', 'gzip');
        response.setHeader('Content-Length', compressedBody.byteLength);
        bufferedChunks = [];
        bufferedBytes = 0;
        return typeof callback === 'function'
          ? nativeEnd(compressedBody, callback)
          : nativeEnd(compressedBody);
      }

      flushBufferedChunks();
      return typeof callback === 'function' ? nativeEnd(callback) : nativeEnd();
    }) as typeof response.end;

    next();
  };
}
