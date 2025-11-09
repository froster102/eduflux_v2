import type { UpdateInstructorSessionSettingsPort } from '@core/application/session-settings/port/usecase/UpdateInstructorSessionSettingsPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface UpdateInstructorSessionSettingsUseCase
  extends UseCase<UpdateInstructorSessionSettingsPort, void> {}
