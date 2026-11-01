import { Router, type IRouter } from "express";
import { getPublicationStateSnapshot } from "../editorial/publication-state";

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

export default router;
