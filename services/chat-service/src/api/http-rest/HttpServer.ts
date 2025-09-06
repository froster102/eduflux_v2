import { graphqlHandler } from "@api/graphql/handler/graphqlHandler";
import type { ChatController } from "@api/http-rest/controller/ChatController";
import { correlationIdSetupMiddleware } from "@api/http-rest/middlewares/correlationIdSetup.middleware";
import { errorHandler } from "@api/http-rest/middlewares/errorHandlerMiddleware";
import { httpLoggerMiddleware } from "@api/http-rest/middlewares/httpLoggerMiddleware";
import { engine } from "@api/websocket/io";
import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { container } from "@di/RootModule";
import { HttpServerConfig } from "@shared/HttpServerConfig";
import Elysia from "elysia";

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext("HTTP_SERVER");
  private chatController: ChatController;

  constructor() {
    this.app = new Elysia();
    this.port = HttpServerConfig.PORT;
    this.chatController = container.get<ChatController>(
      ChatDITokens.ChatController,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
    this.app.use(graphqlHandler);
  }

  private setupRoutes(): void {
    this.app.get("/health", () => {
      return { message: "Api running successfully." };
    });
    this.app.get("/api/chats/ok", () => ({ ok: true }));
    this.app.use(this.chatController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      Bun.serve({
        port: this.port,
        idleTimeout: 30,
        fetch: async (req, server) => {
          const url = new URL(req.url);
          if (url.pathname === "/ws/") {
            return engine.handleRequest(req, server);
          } else {
            return this.app.handle(req);
          }
        },
        websocket: engine.handler().websocket,
      });

      this.logger.info(`Http server listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
