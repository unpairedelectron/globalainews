import { clerkClient, getAuth } from "@clerk/express";
import type { Request, RequestHandler } from "express";

const configuredEditorEmail = process.env.NEWSROOM_EDITOR_EMAIL?.trim().toLowerCase();
type EditorUser = {
  primaryEmailAddressId: string | null;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: { status: string } | null;
  }>;
};

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

export function createRequireEditorAuth(options: {
  allowedEmail: string | undefined;
  getUserId: (req: Request) => string | undefined;
  getUser: (userId: string) => Promise<EditorUser>;
}): RequestHandler {
  const allowedEmail = options.allowedEmail?.trim().toLowerCase();
  return async (req, res, next) => {
    const userId = options.getUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Editor sign-in required to change releases." });
      return;
    }
    if (!allowedEmail) {
      res.status(503).json({ error: "Editor access is not configured." });
      return;
    }
    try {
      const user = await options.getUser(userId);
      if (!hasAllowedVerifiedPrimaryEmail(user, allowedEmail)) {
        res.status(403).json({ error: "This account is not authorized to edit releases." });
        return;
      }
    } catch {
      res.status(503).json({ error: "Unable to verify editor access right now." });
      return;
    }
    res.locals.editorUserId = userId;
    next();
  };
}

export const requireEditorAuth = createRequireEditorAuth({
  allowedEmail: configuredEditorEmail,
  getUserId: (req) => getAuth(req)?.userId,
  getUser: async (userId) => clerkClient.users.getUser(userId),
});