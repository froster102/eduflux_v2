import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface GetInstructorCoursePort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
