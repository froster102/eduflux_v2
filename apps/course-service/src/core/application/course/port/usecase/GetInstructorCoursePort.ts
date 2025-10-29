import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface GetInstructorCoursePort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
