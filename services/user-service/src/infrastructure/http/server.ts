import type { ILogger } from '@/shared/common/interface/logger.interface';
import Elysia from 'elysia';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { USER_SERVICE } from '@/shared/constants/services';
import { TYPES } from '@/shared/di/types';
import { container } from '@/shared/di/container';
import { correlationIdSetupMiddleware } from './middlewares/correlation-id-setup.middleware';
import { UserRoutes } from '@/interface/routes/user.routes';
import { ProgressRoutes } from '@/interface/routes/progress.routes';
import { graphqlHandler } from '../graphql/graphql-handler';

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
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/health', () => ({ ok: true }));
    const userRoutes = container.get<UserRoutes>(TYPES.UserRoutes);
    const progressRoutes = container.get<ProgressRoutes>(TYPES.ProgressRoutes);
    this.app.use(userRoutes.register());
    this.app.use(progressRoutes.register());
    this.app.use(graphqlHandler);
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${USER_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
