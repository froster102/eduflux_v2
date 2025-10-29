import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface GetCourseChaptersPort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
