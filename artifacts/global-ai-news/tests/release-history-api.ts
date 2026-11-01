import express from "express";
import { createRequireEditorAuth, requireEditorAuth } from "../../api-server/src/middlewares/requireEditorAuth";
import newsroomRouter from "../../api-server/src/routes/newsroom";
import { databaseRequestContext } from "../../../lib/db/src/index.ts";
import healthRouter from "../../api-server/src/routes/health";

const app = express();
const testEditorEmail = "release-history-test@globalainews.test";
const editorAuth = createRequireEditorAuth({
  allowedEmail: testEditorEmail,
  getUserId: (request) => request.get("x-newsroom-test-editor") || undefined,
  getUser: async (userId) => ({
    primaryEmailAddressId: "primary",
    emailAddresses: [{
      id: "primary",
      emailAddress: testEditorEmail,
      verification: { status: "verified" },
    }],
  }),
});
// Replace only the middleware on this test process's router; production keeps Clerk auth.
for (const layer of (newsroomRouter as any).stack ?? []) {
  const authLayer = layer.route?.stack?.find(
    (routeLayer: { handle: unknown }) => routeLayer.handle === requireEditorAuth,
  );
  if (authLayer) authLayer.handle = editorAuth;
}

app.use((request, _response, next) => {
  Object.assign(request, {
    log: { info() {}, warn() {}, error() {}, debug() {} },
  });
  databaseRequestContext.run({
    caller: "release-history-test",
    route: `${request.method} ${request.path}`,
  }, next);
});
app.use(express.json());
app.use("/api", healthRouter, newsroomRouter);

const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port < 1) {
  throw new Error("Release-history test server requires a valid PORT.");
}
app.listen(port, "127.0.0.1");
