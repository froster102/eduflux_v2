import { InstructorViewController } from "@api/http-rest/controller/InstructorViewController";
import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { InstructorCreatedEventHandler } from "@core/application/instructor-view/handler/InstructorCreatedEventHandler";
import type { InstructorStatsEventHandler } from "@core/application/instructor-view/handler/InstructorStatsEventHandler";
import type { SessionSettingsEventHandler } from "@core/application/instructor-view/handler/SessionSettingsEventHandler";
import type { SessionUpdatedEventHandler } from "@core/application/instructor-view/handler/SessionUpdatedEventHandler";
import type { InstructorViewRepositoryPort } from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import { InstructorCreatedEventHandlerService } from "@core/application/instructor-view/service/handler/InstructorCreatedEventHandlerService";
import { InstructorStatsEventHandlerService } from "@core/application/instructor-view/service/handler/InstructorStatsEventHandlerService";
import { SessionSettingsEventHandlerService } from "@core/application/instructor-view/service/handler/SessionSettingsEventHandlerService";
import { GetInstructorViewService } from "@core/application/instructor-view/service/usecase/GetInstructorViewService";
import { GetInstructorViewsService } from "@core/application/instructor-view/service/usecase/GetInstructorViewsService";
import type { GetInstructorViewsUseCase } from "@core/application/instructor-view/usecase/GetInstructorViewsUseCase";
import type { GetInstructorViewUseCase } from "@core/application/instructor-view/usecase/GetInstructorViewUseCase";
import { UserSessionUpdatedEventHandlerService } from "@core/application/user-session/service/handler/UserSessionUpdateEventHandlerService";
import { MongooseInstructorRepositoryViewAdapter } from "@infrastructure/adapter/persistence/mongoose/repository/instructor-view/MongooseInstructorViewRepositoryAdapter";
import { ContainerModule } from "inversify";

export const InstructorViewModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetInstructorViewsUseCase>(
        InstructorViewDITokens.GetInstructorViewsUseCase,
      )
      .to(GetInstructorViewsService);
    options
      .bind<GetInstructorViewUseCase>(
        InstructorViewDITokens.GetInstructorViewUseCase,
      )
      .to(GetInstructorViewService);

    //Repositories
    options
      .bind<InstructorViewRepositoryPort>(
        InstructorViewDITokens.InstructorViewRepository,
      )
      .to(MongooseInstructorRepositoryViewAdapter)
      .inSingletonScope();

    //Hanlders
    options
      .bind<InstructorStatsEventHandler>(
        InstructorViewDITokens.InstructorStatsEventHandler,
      )
      .to(InstructorStatsEventHandlerService)
      .inSingletonScope();
    options
      .bind<SessionSettingsEventHandler>(
        InstructorViewDITokens.SessionSettingsEventHandler,
      )
      .to(SessionSettingsEventHandlerService)
      .inSingletonScope();
    options
      .bind<InstructorCreatedEventHandler>(
        InstructorViewDITokens.InstructorCreatedEventHandler,
      )
      .to(InstructorCreatedEventHandlerService);
    options
      .bind<SessionUpdatedEventHandler>(
        InstructorViewDITokens.SessionUpdatedEventHandler,
      )
      .to(UserSessionUpdatedEventHandlerService);

    //Controller
    options
      .bind<InstructorViewController>(
        InstructorViewDITokens.InstructorViewController,
      )
      .to(InstructorViewController)
      .inSingletonScope();
  },
);
