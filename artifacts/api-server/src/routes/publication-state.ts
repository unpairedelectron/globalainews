import { Router, type IRouter } from "express";
import { getPublishedArticleRegistry, getPublicationStateSnapshot } from "../editorial/publication-state";
import { releaseDiscovery } from "../editorial/release-discovery.generated";
import { getVisibleReleaseDiscovery } from "../editorial/release-discovery-visibility";

const router: IRouter = Router();

router.get("/newsroom/publication-state", async (_request, response): Promise<void> => {
  try {
    const states = await getPublicationStateSnapshot();
    response.setHeader("Cache-Control", "no-store");
    response.json({
      states: states.map((state) => ({
        slug: state.slug,
        publishAt: state.publishAt.toISOString(),
        status: state.status,
      })),
    });
  } catch {
    response.status(503).json({ error: "Publication state is temporarily unavailable." });
  }
});

router.get("/newsroom/release-discovery", async (_request, response): Promise<void> => {
  try {
    const now = new Date();
    const published = await getPublishedArticleRegistry(now);
    const publishedSlugs = new Set(published.map((article) => article.slug));
    const visible = getVisibleReleaseDiscovery(releaseDiscovery, publishedSlugs, now);
    response.setHeader("Cache-Control", "no-store");
    response.json(visible);
  } catch {
    response.status(503).json({ error: "Release discovery is temporarily unavailable." });
  }
});

export default router;
