import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clientsRouter from "./clients";
import dashboardsRouter from "./dashboards";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clientsRouter);
router.use(dashboardsRouter);
router.use(usersRouter);

export default router;
