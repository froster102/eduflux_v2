import { WinstonLogger } from "@/logging/winston.logger";
import type { Elysia } from "elysia";

export const httpLoggerMiddleware = (app: Elysia) => {
  const logger = new WinstonLogger().fromContext("HTTP");

  const start = Date.now();

  app.onRequest(({ server, request }) => {
    logger.info(`Incomming request: ${request.method} ${request.url}`, {
      ip: server!.requestIP(request)!.address,
      userAgent: request.headers.get("user-agent"),
    });
  });

  app.onAfterResponse(({ set, request }) => {
    const duration = Date.now() - start;
    const statusCode = set.status as number;
    const logLevel = statusCode >= 400 ? "error" : "info";
    logger[logLevel](`Request completed: ${request.method} ${request.url}`, {
      statusCode,
      duration: `${duration}ms`,
    });
  });

  return app;
};
