import { correlationIdSetupMiddleware } from '@application/api/http/middleware/correlationIdMiddleware';
import { errorHandler } from '@application/api/http/middleware/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@application/api/http/middleware/httpLoggerMiddleware';
import { container } from '@application/di/RootModule';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { AnalyticsController } from '@analytics/controller/AnalyticsController';
import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import { ANALYTICS_SERVICE } from '@shared/constants/service';
import Elysia from 'elysia';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly analyticsController: AnalyticsController;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.logger = container
      .get<LoggerPort>(SharedCoreDITokens.Logger)
      .fromContext('HTTP_SERVER');
    this.analyticsController = container.get<AnalyticsController>(
      AnalyticsDITokens.AnalyticsController,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(httpLoggerMiddleware);
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    //health check
    this.app.get('/health', () => ({ ok: true }));

    this.app.use(this.analyticsController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${ANALYTICS_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Failed to start service`, error);
      process.exit(1);
    }
  }
}

