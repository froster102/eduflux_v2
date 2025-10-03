import { UserSessionController } from "@api/http-rest/controller/UserSessionController";
import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { ConfirmSessionEventHandler } from "@core/application/user-session/handler/ConfirmSessionHandler";
import type { UserSessionUpdatedEventHandler } from "@core/application/user-session/handler/UserSessionUpdatedEventHandler";
import type { UserSessionRepositoryPort } from "@core/application/user-session/port/persistence/UserSessionRepositoryPort";
import { ConfirmSessionEventHandlerService } from "@core/application/user-session/service/handler/ConfirmSessionEventHandlerService";
import { UserSessionUpdatedEventHandlerService } from "@core/application/user-session/service/handler/UserSessionUpdateEventHandlerService";
import { GetUserSessionService } from "@core/application/user-session/service/usecase/GetUserSessionsService";
import type { GetUserSessionsUseCase } from "@core/application/user-session/usecase/GetUserSessionsUseCase";
import { MongooseUserSessionRepositoryAdapter } from "@infrastructure/adapter/persistence/mongoose/repository/user-session/MongooseUserSessionRepositoryAdapter";
import { ContainerModule } from "inversify";

export const UserSessionModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-case
    options
      .bind<GetUserSessionsUseCase>(UserSessionDITokens.GetUserSessionsUseCase)
      .to(GetUserSessionService);

    //Handlers
    options
      .bind<ConfirmSessionEventHandler>(
        UserSessionDITokens.ConfirmSessionEventHandler,
      )
      .to(ConfirmSessionEventHandlerService);
    options
      .bind<UserSessionUpdatedEventHandler>(
        UserSessionDITokens.UserSessionUpdatedEventHandler,
      )
      .to(UserSessionUpdatedEventHandlerService);

    //Repository
    options
      .bind<UserSessionRepositoryPort>(
        UserSessionDITokens.UserSessionRepository,
      )
      .to(MongooseUserSessionRepositoryAdapter);

    //Controller
    options
      .bind<UserSessionController>(UserSessionDITokens.UserSessionController)
      .to(UserSessionController);
  },
);
