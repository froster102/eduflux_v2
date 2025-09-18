import type { GetInstructorSessionSettingsPort } from '@core/application/session-settings/port/usecase/GetInstructorSessionSettingsPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetInstructorSessionSettingsUseCaseResult {}

export interface GetInstructorSessionSettingsUseCase
  extends UseCase<
    GetInstructorSessionSettingsPort,
    GetInstructorSessionSettingsUseCaseResult
  > {}
