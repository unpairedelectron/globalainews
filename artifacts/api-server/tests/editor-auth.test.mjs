import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createRequireEditorAuth, hasAllowedVerifiedPrimaryEmail } from "../src/middlewares/requireEditorAuth.ts";

const allowedEmail = "samfischer14aug@gmail.com";

function user(primaryEmailAddressId, emailAddresses) {
  return { primaryEmailAddressId, emailAddresses };
}

test("editor authorization requires the allowed verified primary email", () => {
  assert.equal(
    hasAllowedVerifiedPrimaryEmail(
      user("primary", [
        {
          id: "primary",
          emailAddress: "SamFischer14Aug@gmail.com",
          verification: { status: "verified" },
        },
      ]),
      allowedEmail,
    ),
    true,
  );
});

test("editor authorization rejects an allowed email that is not primary", () => {
  assert.equal(
    hasAllowedVerifiedPrimaryEmail(
      user("other", [
        {
          id: "allowed",
          emailAddress: allowedEmail,
          verification: { status: "verified" },
        },
        {
          id: "other",
          emailAddress: "other@example.com",
          verification: { status: "verified" },
        },
      ]),
      allowedEmail,
    ),
    false,
  );
});

test("editor authorization rejects an unverified primary email", () => {
  assert.equal(
    hasAllowedVerifiedPrimaryEmail(
      user("primary", [
        {
          id: "primary",
          emailAddress: allowedEmail,
          verification: { status: "unverified" },
        },
      ]),
      allowedEmail,
    ),
    false,
  );
});

test("editor authorization fails closed when no email is configured", () => {
  assert.equal(
    hasAllowedVerifiedPrimaryEmail(
      user("primary", [
        {
          id: "primary",
          emailAddress: allowedEmail,
          verification: { status: "verified" },
        },
      ]),
      undefined,
    ),
    false,
  );
});

test("mocked auth harness gets a 401 without an authenticated Clerk user", async () => {
  const res = {
    statusCode: 200,
    body: undefined,
    locals: {},
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; },
  };
  let nextCalled = false;
  const middleware = createRequireEditorAuth({
    allowedEmail,
    getUserId: () => undefined,
    getUser: async () => user("primary", []),
  });
  await middleware({}, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("mocked auth harness accepts only the configured verified primary email", async () => {
  const res = {
    statusCode: 200,
    locals: {},
    status(code) { this.statusCode = code; return this; },
    json() {},
  };
  let nextCalled = false;
  const middleware = createRequireEditorAuth({
    allowedEmail,
    getUserId: () => "clerk-user",
    getUser: async () => user("primary", [{
      id: "primary",
      emailAddress: allowedEmail,
      verification: { status: "verified" },
    }]),
  });
  await middleware({}, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 200);
  assert.equal(res.locals.editorUserId, "clerk-user");
  assert.equal(nextCalled, true);
});

test("production editor middleware contains no test-header or debug-auth bypass", async () => {
  const source = await readFile(new URL("../src/middlewares/requireEditorAuth.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /NEWSROOM_TEST_EDITOR_ID|x-newsroom-test-editor|debug.?auth/i);
});
