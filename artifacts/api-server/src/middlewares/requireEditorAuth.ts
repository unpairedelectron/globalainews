import { clerkClient, getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

const configuredEditorEmail = process.env.NEWSROOM_EDITOR_EMAIL?.trim().toLowerCase();

export function hasAllowedVerifiedPrimaryEmail(
  user: {
    primaryEmailAddressId: string | null;
    emailAddresses: Array<{
      id: string;
      emailAddress: string;
      verification: { status: string } | null;
    }>;
  },
  allowedEmail: string | undefined,
): boolean {
  if (!allowedEmail) return false;
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  );
  return (
    primaryEmail?.emailAddress.trim().toLowerCase() === allowedEmail &&
    primaryEmail.verification?.status === "verified"
  );
}

export const requireEditorAuth: RequestHandler = async (req, res, next) => {
  const auth = getAuth(req);
  const configuredTestEditorId =
    process.env.NODE_ENV === "test" ? process.env.NEWSROOM_TEST_EDITOR_ID : undefined;
  const testEditorId =
    configuredTestEditorId &&
    req.get("x-newsroom-test-editor") === configuredTestEditorId
      ? configuredTestEditorId
      : undefined;
  const userId = testEditorId || auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Editor sign-in required to change releases." });
    return;
  }

  if (!testEditorId) {
    if (!configuredEditorEmail) {
      res.status(503).json({ error: "Editor access is not configured." });
      return;
    }

    try {
      const user = await clerkClient.users.getUser(userId);
      if (!hasAllowedVerifiedPrimaryEmail(user, configuredEditorEmail)) {
        res.status(403).json({ error: "This account is not authorized to edit releases." });
        return;
      }
    } catch {
      res.status(503).json({ error: "Unable to verify editor access right now." });
      return;
    }
  }

  res.locals.editorUserId = userId;
  next();
};