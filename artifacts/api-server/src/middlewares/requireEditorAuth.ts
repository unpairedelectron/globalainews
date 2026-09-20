import { getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

export const requireEditorAuth: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Editor sign-in required to change releases." });
    return;
  }

  res.locals.editorUserId = userId;
  next();
};