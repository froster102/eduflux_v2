import Elysia from "elysia";
import { httpLoggerMiddleware } from "./middlewares/http-logger.middleware";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { graphqlHandler } from "@/graphql/graphql-handler";
import { serverConfig } from "@/shared/config/server.config";
import { WinstonLogger } from "@/logging/winston.logger";

const app = new Elysia();

const logger = new WinstonLogger().fromContext("HTTP");

app.use(httpLoggerMiddleware);
app.use(errorHandler);
app.use(graphqlHandler);

app.get("/api/query/health", () => ({ ok: true }));

export function startServer(): void {
  try {
    app.listen(serverConfig.PORT);
    logger.info(`Http server listening on port ${serverConfig.PORT}`);
  } catch (error) {
    console.error(`Faild to start service`, error);
    process.exit(1);
  }
}
