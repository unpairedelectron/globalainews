import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsroomRouter from "./newsroom";
import newsletterRouter from "./newsletter";
import publicationStateRouter from "./publication-state";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsroomRouter);
router.use(publicationStateRouter);
router.use(newsletterRouter);

export default router;
