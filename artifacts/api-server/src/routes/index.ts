import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import companiesRouter from "./companies";
import franchisesRouter from "./franchises";
import dashboardsRouter from "./dashboards";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(companiesRouter);
router.use(franchisesRouter);
router.use(dashboardsRouter);
router.use(usersRouter);

export default router;
