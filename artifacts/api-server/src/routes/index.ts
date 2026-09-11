import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsroomRouter from "./newsroom";
import newsletterRouter from "./newsletter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsroomRouter);
router.use(newsletterRouter);

export default router;
