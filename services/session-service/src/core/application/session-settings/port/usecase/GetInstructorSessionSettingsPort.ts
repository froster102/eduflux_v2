import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface GetInstructorSessionSettingsPort {
  actor: AuthenticatedUserDto;
}
