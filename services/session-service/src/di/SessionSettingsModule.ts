import { SessionSettingsController } from '@api/http-rest/controller/SessionSettingsController';
import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import { EnableSessionService } from '@core/application/session-settings/service/EnableSessionService';
import { UpdateInstructorSessionSettingsService } from '@core/application/session-settings/service/UpdateInstructorSessionSettingsService';
import type { EnableSessionsUseCase } from '@core/application/session-settings/usecase/EnableSessionsUseCase';
import type { GetInstructorSessionSettingsUseCase } from '@core/application/session-settings/usecase/GetInstructorSessionSettingsUseCase';
import type { UpdateInstructorSessionSettingsUseCase } from '@core/application/session-settings/usecase/UpdateInstructorSessionSettingsUseCase';
import { GetInstructorSessionSettingsService } from '@core/application/session/service/usecase/GetInstructorSessionSettingsService';
import { MongooseSessionSettingsRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/session-settings/MongooseSessionSettingsRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const SessionSettingsModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetInstructorSessionSettingsUseCase>(
        SessionSettingsDITokens.GetInstructorSessionSettingsUseCase,
      )
      .to(GetInstructorSessionSettingsService);
    options
      .bind<UpdateInstructorSessionSettingsUseCase>(
        SessionSettingsDITokens.UpadteInstructorSessionSettingsUseCase,
      )
      .to(UpdateInstructorSessionSettingsService);
    options
      .bind<EnableSessionsUseCase>(SessionSettingsDITokens.EnableSessionUseCase)
      .to(EnableSessionService);

    //Repository
    options
      .bind<SessionSettingsRepositoryPort>(
        SessionSettingsDITokens.SessionSettingsRepository,
      )
      .to(MongooseSessionSettingsRepositoryAdapter);

    //Controller
    options
      .bind<SessionSettingsController>(
        SessionSettingsDITokens.SessionSettingsController,
      )
      .to(SessionSettingsController);
  },
);
