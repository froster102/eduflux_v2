import type { GetInstructorSessionSettingsPort } from '@core/application/session-settings/port/usecase/GetInstructorSessionSettingsPort';
import type { GetInstructorSessionSettingsUseCaseResult } from '@core/application/session-settings/usecase/type/GetInstructorSessionSettingsUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetInstructorSessionSettingsUseCase
  extends UseCase<
    GetInstructorSessionSettingsPort,
    GetInstructorSessionSettingsUseCaseResult
  > {}
