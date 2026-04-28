import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
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

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Restore DELETE/PUT sent as POST by clients behind WAFs that block those methods
app.use((req, _res, next) => {
  const override = req.headers["x-http-method-override"];
  if (req.method === "POST" && typeof override === "string") {
    const upper = override.toUpperCase();
    if (upper === "DELETE" || upper === "PUT" || upper === "PATCH") {
      req.method = upper;
    }
  }
  next();
});

app.use("/api", router);

export default app;
