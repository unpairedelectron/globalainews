import { Router, type IRouter } from "express";
import {
  GetNewsroomContentResponse,
  GetNewsroomMetadataResponse,
} from "@workspace/api-zod";
import {
  askGlobalAnswers,
  authors,
  entities,
  essays,
  evidenceSummaries,
  indiaIndex,
  industryMap,
  signals,
  sources,
  stories,
  timelineEvents,
} from "../../../global-ai-news/src/content";
import { getSeoMetadataManifest } from "../../../global-ai-news/src/seo-metadata";

const router: IRouter = Router();

router.get("/newsroom/content", (_req, res): void => {
  const latestPublishedAt = stories.reduce(
    (latest, story) => (story.date > latest ? story.date : latest),
    "",
  );
  const stale =
    latestPublishedAt.length > 0 &&
    Date.now() - Date.parse(`${latestPublishedAt}T23:59:59Z`) > 36 * 60 * 60 * 1000;

  const snapshot = GetNewsroomContentResponse.parse({
    generatedAt: new Date().toISOString(),
    source: "maintained-editorial-source",
    stale,
    authors,
    sources,
    evidenceSummaries,
    entities,
    timelineEvents,
    stories,
    signals,
    industryMap,
    indiaIndex,
    essays,
    askGlobalAnswers,
  });

  res.json(snapshot);
});

router.get("/newsroom/metadata", (_req, res): void => {
  res.setHeader("Cache-Control", "no-store");
  res.json(GetNewsroomMetadataResponse.parse(getSeoMetadataManifest()));
});

export default router;