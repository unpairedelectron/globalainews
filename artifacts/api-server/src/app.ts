import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import { gzipResponseMiddleware } from "./middlewares/gzipResponseMiddleware";

const app: Express = express();

app.use((_request, response, next) => {
  response.setHeader(
    "X-GAN-Source-Revision",
    process.env.GAN_BUILD_SOURCE_REVISION ?? "unavailable",
  );
  response.setHeader(
    "X-GAN-Web-Artifact-Revision",
    process.env.GAN_BUILD_WEB_ARTIFACT_REVISION ?? "unavailable",
  );
  response.setHeader(
    "X-GAN-API-Artifact-Revision",
    process.env.GAN_BUILD_API_ARTIFACT_REVISION ?? "unavailable",
  );
  next();
});

app.use(
  pinoHttp({
    logger,
    customProps(request) {
      const pathname = request.url?.split("?")[0];
      const articleRequestId = request.headers["x-gan-request-id"];
      if (
        pathname !== "/api/newsroom/content" ||
        typeof articleRequestId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          articleRequestId,
        )
      ) {
        return {};
      }
      return { articleRequestId };
    },
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use(
  gzipResponseMiddleware({
    paths: [
      "/api/newsroom/content",
      "/api/newsroom/metadata",
      "/api/newsroom/feed.xml",
      "/api/newsroom/sitemap.xml",
    ],
  }),
);
app.use("/api", router);

export default app;
