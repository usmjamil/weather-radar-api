import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { RadarUpdateJob } from "./jobs/radarUpdateJob";

const app = express();

app.use(cors(config.cors));
app.use(express.json());

if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

const radarUpdateJob = RadarUpdateJob.getInstance();
radarUpdateJob.start();

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully...");
  radarUpdateJob.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  radarUpdateJob.stop();
  process.exit(0);
});

export default app;
