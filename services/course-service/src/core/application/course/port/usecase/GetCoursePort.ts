import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface GetCoursePort {
  courseId: string;
  actor?: AuthenticatedUserDto;
}
