import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";

const sandboxRequire = createRequire(new URL("../../mockup-sandbox/package.json", import.meta.url));

const mockupPackage = JSON.parse(
  readFileSync(new URL("../../mockup-sandbox/package.json", import.meta.url), "utf8"),
);
const mockupDependencies = {
  ...mockupPackage.dependencies,
  ...mockupPackage.devDependencies,
};
const lockfile = readFileSync(new URL("../../../pnpm-lock.yaml", import.meta.url), "utf8");

test("API development dependencies do not retain the middleware vulnerability path", () => {
  const apiPackage = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.equal(apiPackage.dependencies["http-proxy-middleware"], undefined);
  assert.equal(apiPackage.devDependencies["http-proxy-middleware"], undefined);
});

test("mockup globbing uses tinyglobby without a braces dependency", () => {
  assert.equal(mockupDependencies["fast-glob"], undefined);
  assert.ok(mockupDependencies.tinyglobby);

  const tinyglobbyRequire = createRequire(sandboxRequire.resolve("tinyglobby"));
  assert.throws(() => tinyglobbyRequire.resolve("braces"), { code: "MODULE_NOT_FOUND" });
});

test("workspace lockfile no longer resolves the affected braces release", () => {
  assert.doesNotMatch(lockfile, /braces@3\.0\.3/);
});

test("API production package and bundle exclude the braces proxy dependency chain", () => {
  const apiPackage = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );
  const productionBundles = [
    new URL("../dist/index.mjs", import.meta.url),
    new URL("../dist/editorial/replay-command.mjs", import.meta.url),
  ].map((file) => readFileSync(file, "utf8"));

  assert.equal(apiPackage.dependencies["http-proxy-middleware"], undefined);
  assert.equal(apiPackage.dependencies.braces, undefined);
  assert.equal(apiPackage.dependencies.micromatch, undefined);
  assert.equal(apiPackage.dependencies.httpxy, "0.5.5");
  for (const bundle of productionBundles) {
    assert.doesNotMatch(bundle, /http-proxy-middleware|micromatch|braces@3\.0\.3|require_braces/);
  }
});