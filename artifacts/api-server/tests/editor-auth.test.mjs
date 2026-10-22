import assert from "node:assert/strict";
import test from "node:test";
import { hasAllowedVerifiedPrimaryEmail } from "../src/middlewares/requireEditorAuth.ts";

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
