import { getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

export const requireEditorAuth: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  const configuredTestEditorId =
    process.env.NODE_ENV === "test" ? process.env.NEWSROOM_TEST_EDITOR_ID : undefined;
  const testEditorId =
    configuredTestEditorId &&
    req.get("x-newsroom-test-editor") === configuredTestEditorId
      ? configuredTestEditorId
      : undefined;
  const userId = testEditorId || auth?.sessionClaims?.userId || auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Editor sign-in required to change releases." });
    return;
  }

  res.locals.editorUserId = userId;
  next();
};