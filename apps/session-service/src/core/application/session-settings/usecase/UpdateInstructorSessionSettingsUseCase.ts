import type { UpdateInstructorSessionSettingsPort } from '@core/application/session-settings/port/usecase/UpdateInstructorSessionSettingsPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface UpdateInstructorSessionSettingsUseCase
  extends UseCase<UpdateInstructorSessionSettingsPort, void> {}
