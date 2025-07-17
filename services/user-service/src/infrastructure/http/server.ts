import { Logger } from 'src/shared/utils/logger';
import Elysia from 'elysia';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { USER_SERVICE } from '@/shared/constants/services';
import { TYPES } from '@/shared/di/types';
import { container } from '@/shared/di/container';
import { IRoute } from '@/interface/routes/interface/routes.interface';

export class Server {
  private app: Elysia;
  private port: number;
  private logger = new Logger(USER_SERVICE);
  private userRoutes: IRoute<Elysia>;
  private progressRoutes: IRoute<Elysia>;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.userRoutes = container.get<IRoute<Elysia>>(TYPES.UserRoutes);
    this.progressRoutes = container.get<IRoute<Elysia>>(TYPES.ProgressRoutes);
  }

  private setupMiddlewares(): void {
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/api/users/ok', () => ({ ok: true }));
    this.app.use(this.userRoutes.register());
    this.app.use(this.progressRoutes.register());
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
