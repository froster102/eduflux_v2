import type { SessionSettingsUseCaseDto } from '@core/application/session-settings/usecase/dto/SessionSettingsUseCaseDto';

export type GetInstructorSessionSettingsUseCaseResult = {
  settings: SessionSettingsUseCaseDto | null;
};
