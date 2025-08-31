import type { ILogger } from '@/shared/common/interface/logger.interface';
import Elysia from 'elysia';
import { SESSION_SERVICE } from '@/shared/constants/services';
import { TYPES } from '@/shared/di/types';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { container } from '@/shared/di/container';
import { ScheduleRoutes } from '@/interface/routes/schedule.routes';
import { graphqlHandler } from '../graphql/graphql-handler';
import type { SettingsRoutes } from '@/interface/routes/settings.routes';

export class Server {
  private app: Elysia;
  private port: number;
  private logger = container
    .get<ILogger>(TYPES.Logger)
    .fromContext('HTTP_SERVER');

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
  }

  private setupMiddlewares(): void {
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
    this.app.use(graphqlHandler);
  }

  private setupRoutes(): void {
    //health check
    this.app.get('/health', () => ({ ok: true }));
    const scheduleRoutes = container.get<ScheduleRoutes>(TYPES.ScheduleRoutes);
    const settingsRoutes = container.get<SettingsRoutes>(TYPES.SettingsRoutes);

    this.app.use(scheduleRoutes.register());
    this.app.use(settingsRoutes.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${SESSION_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
