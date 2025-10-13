import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface PublishCoursePort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
