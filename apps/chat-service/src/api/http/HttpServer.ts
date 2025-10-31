import type { ChatController } from '@api/http/controller/ChatController';
import { SocketIOServer } from '@api/websocket/io';
import { ChatDITokens } from '@core/application/chat/di/ChatDITokens';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import { Hono } from 'hono';
import type { Server as HTTPServer } from 'node:http';
import { serve } from '@hono/node-server';
import { correlationIdSetupMiddleware } from '@api/http/middlewares/correlationIdSetup.middleware';
import { httpLoggerMiddleware } from '@api/http/middlewares/httpLoggerMiddleware';
import {
  errorHandler,
  notFoundHandler,
} from '@api/http/middlewares/errorHandlerMiddleware';

export class HttpServer {
  private app: Hono;
  private port: number;
  private logger = container
    .get<LoggerPort>(SharedCoreDITokens.Logger)
    .fromContext('HTTP_SERVER');
  private chatController: ChatController;

  constructor(port: number) {
    this.app = new Hono();
    this.chatController = container.get<ChatController>(
      ChatDITokens.ChatController,
    );
    this.port = port;
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.onError(errorHandler);
    this.app.notFound(notFoundHandler);
  }

  private setupRoutes(): void {
    this.app.get('/health', (c) => {
      return c.json({ message: 'Api running successfully.' });
    });
    this.app.route('/api/chats/', this.chatController.register());
  }

  private initSocketIOServer(server: HTTPServer) {
    new SocketIOServer(server);
  }

  private initServer() {
    const httpServer = serve({
      fetch: this.app.fetch,
      port: this.port,
    });
    this.initSocketIOServer(httpServer as HTTPServer);
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();
      this.initServer();
      this.logger.info(`Http server listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
