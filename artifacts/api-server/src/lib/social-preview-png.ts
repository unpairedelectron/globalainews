import { spawn } from "node:child_process";

import { renderSocialPreviewSvg } from "../../../global-ai-news/src/social-preview";

const maxPngBytes = 8 * 1024 * 1024;
const renderTimeoutMs = 10_000;

export function renderSocialPreviewPng(
  title: string,
  category: string,
  slug: string,
): Promise<Buffer> {
  const displayTitle = `${title} — Global AI News`;
  const svg = renderSocialPreviewSvg(displayTitle, category, slug);

  return new Promise((resolve, reject) => {
    const renderer = spawn(
      "magick",
      [
        "-limit",
        "memory",
        "64MiB",
        "-limit",
        "map",
        "128MiB",
        "svg:-",
        "-set",
        "comment",
        displayTitle,
        "png:-",
      ],
      { stdio: ["pipe", "pipe", "pipe"] },
    );
    const pngChunks: Buffer[] = [];
    let pngBytes = 0;
    let stderr = "";
    let settled = false;

    const fail = (error: Error): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    };

    const timeout = setTimeout(() => {
      renderer.kill("SIGKILL");
      fail(new Error("Social preview rendering timed out."));
    }, renderTimeoutMs);
    timeout.unref();

    renderer.stdout.on("data", (chunk: Buffer) => {
      pngBytes += chunk.length;
      if (pngBytes > maxPngBytes) {
        renderer.kill("SIGKILL");
        fail(new Error("Social preview exceeded the PNG size limit."));
        return;
      }
      pngChunks.push(chunk);
    });
    renderer.stderr.on("data", (chunk: Buffer) => {
      if (stderr.length < 8_192) stderr += chunk.toString();
    });
    renderer.once("error", (error) => {
      fail(new Error(`Social preview renderer could not start: ${error.message}`));
    });
    renderer.once("close", (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (code !== 0) {
        reject(
          new Error(
            stderr.trim() || `Social preview renderer exited with ${signal ?? `code ${code}`}.`,
          ),
        );
        return;
      }
      resolve(Buffer.concat(pngChunks, pngBytes));
    });
    renderer.stdin.on("error", () => {
      // The close handler reports renderer failures without an unhandled EPIPE.
    });
    renderer.stdin.end(svg);
  });
}