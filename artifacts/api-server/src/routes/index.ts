import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clientsRouter from "./clients";
import dashboardsRouter from "./dashboards";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clientsRouter);
router.use(dashboardsRouter);

export default router;
