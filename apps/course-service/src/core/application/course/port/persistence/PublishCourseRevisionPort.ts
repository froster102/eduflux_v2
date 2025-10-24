import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface PublishCourseRevisionPort {
  shadowCourseId: string;
  executor: AuthenticatedUserDto;
}
