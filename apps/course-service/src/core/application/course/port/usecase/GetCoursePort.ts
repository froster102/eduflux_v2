import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface GetCoursePort {
  courseId: string;
  actor?: AuthenticatedUserDto;
}
