import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import type { InstructorCreatedEventHandler } from '@application/views/instructor-view/handler/InstructorCreatedEventHandler';
import type { InstructorStatsUpdatedEventHandler } from '@application/views/instructor-view/handler/InstructorStatsUpdatedEventHandler';
import type { SessionSettingsUpdatedEventHandler } from '@application/views/instructor-view/handler/SessionSettingsUpdatedEventHandler';
import type { UserUpdatedEventHandler } from '@application/views/coordinator/handler/UserUpdatedEventHandler';
import type { InstructorViewRepositoryPort } from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { InstructorCreatedEventHandlerService } from '@application/views/instructor-view/service/handler/InstructorCreatedEventHandlerService';
import { InstructorStatsUpdatedEventHandlerService } from '@application/views/instructor-view/service/handler/InstructorStatsUpdatedEventHandlerService';
import { SessionSettingsUpdatedEventHandlerService } from '@application/views/instructor-view/service/handler/SessionSettingsUpdatedEventHandlerService';
import { UserUpdatedEventHandlerService } from '@application/views/coordinator/service/UserUpdatedEventHandlerService';
import { GetInstructorViewService } from '@application/views/instructor-view/service/usecase/GetInstructorViewService';
import { GetInstructorViewsService } from '@application/views/instructor-view/service/usecase/GetInstructorViewsService';
import type { GetInstructorViewsUseCase } from '@application/views/instructor-view/usecase/GetInstructorViewsUseCase';
import type { GetInstructorViewUseCase } from '@application/views/instructor-view/usecase/GetInstructorViewUseCase';
import { MongooseInstructorRepositoryViewAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/instructor-view/MongooseInstructorViewRepositoryAdapter';
import { ContainerModule } from 'inversify';

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
      .bind<InstructorStatsUpdatedEventHandler>(
        InstructorViewDITokens.InstructorStatsUpdatedEventHandler,
      )
      .to(InstructorStatsUpdatedEventHandlerService)
      .inSingletonScope();
    options
      .bind<SessionSettingsUpdatedEventHandler>(
        InstructorViewDITokens.SessionSettingsUpdatedEventHandler,
      )
      .to(SessionSettingsUpdatedEventHandlerService)
      .inSingletonScope();
    options
      .bind<InstructorCreatedEventHandler>(
        InstructorViewDITokens.InstructorCreatedEventHandler,
      )
      .to(InstructorCreatedEventHandlerService);
    options
      .bind<UserUpdatedEventHandler>(
        InstructorViewDITokens.UserUpdatedEventHandler,
      )
      .to(UserUpdatedEventHandlerService);
  },
);
