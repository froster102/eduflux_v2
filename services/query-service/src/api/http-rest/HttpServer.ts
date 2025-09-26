import type { UserChatController } from "@api/http-rest/controller/UserChatController";
import type { UserSessionController } from "@api/http-rest/controller/UserSessionController";
import { correlationIdSetupMiddleware } from "@api/http-rest/middleware/correlationIdMiddleware";
import { errorHandler } from "@api/http-rest/middleware/errorHandlerMiddleware";
import { httpLoggerMiddleware } from "@api/http-rest/middleware/httpLoggerMiddleware";
import { UserChatDITokens } from "@core/application/user-chat/di/UserChatDITokens";
import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import { container } from "@di/RootModule";
import { HttpServerConfig } from "@shared/config/HttpServerConfig";
import Elysia from "elysia";

export class HttpServer {
  private readonly app: Elysia;
  private readonly port: number;
  private readonly logger: LoggerPort;
  private readonly userSessionController: UserSessionController;
  private readonly userChatController: UserChatController;

  constructor() {
    this.app = new Elysia();
    this.port = HttpServerConfig.PORT;
    this.logger = container
      .get<LoggerPort>(CoreDITokens.Logger)
      .fromContext("HTTP_SERVER");
    this.userSessionController = container.get<UserSessionController>(
      UserSessionDITokens.UserSessionController,
    );
    this.userChatController = container.get<UserChatController>(
      UserChatDITokens.UserChatController,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get("/health", () => {
      return { message: "Api running successfully." };
    });
    this.app.use(this.userSessionController.register());
    this.app.use(this.userChatController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();
      this.app.listen(this.port);
      this.logger.info(`Http server listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
