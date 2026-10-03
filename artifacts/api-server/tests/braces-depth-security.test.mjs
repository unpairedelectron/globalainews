import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const apiRequire = createRequire(new URL("../package.json", import.meta.url));
const sandboxRequire = createRequire(new URL("../../mockup-sandbox/package.json", import.meta.url));

function bracesFromDependencyChain(parentRequire, parentName) {
  const parentEntry = parentRequire.resolve(parentName);
  const parentModuleRequire = createRequire(parentEntry);
  const micromatchEntry = parentModuleRequire.resolve("micromatch");
  const micromatchRequire = createRequire(micromatchEntry);

  return micromatchRequire("braces");
}

const hostileBracePattern = `{`.repeat(101) + "value,other" + `}`.repeat(101);
const hostileParenthesisPattern = `(`.repeat(101) + `)`.repeat(101);

const dependencyChains = [
  {
    name: "production http-proxy-middleware dependency chain",
    braces: bracesFromDependencyChain(apiRequire, "http-proxy-middleware"),
  },
  {
    name: "development fast-glob dependency chain",
    braces: bracesFromDependencyChain(sandboxRequire, "fast-glob"),
  },
];

for (const dependency of dependencyChains) {
  test(`${dependency.name} rejects excessive brace nesting`, () => {
    assert.throws(() => dependency.braces(hostileBracePattern), /exceeds max depth/);
    assert.throws(() => dependency.braces.parse(hostileBracePattern), /exceeds max depth/);
  });

  test(`${dependency.name} rejects excessive parenthesis nesting`, () => {
    assert.throws(() => dependency.braces.parse(hostileParenthesisPattern), /exceeds max depth/);
  });

  test(`${dependency.name} keeps ordinary brace expansion working`, () => {
    assert.deepEqual(
      dependency.braces("root/{alpha,beta}", { expand: true }),
      ["root/alpha", "root/beta"],
    );
    assert.throws(
      () => dependency.braces.parse("{{alpha,beta},gamma}", { maxDepth: 1 }),
      /exceeds max depth/,
    );
    assert.doesNotThrow(() => dependency.braces.parse("{{alpha,beta},gamma}", { maxDepth: 2 }));
  });
}