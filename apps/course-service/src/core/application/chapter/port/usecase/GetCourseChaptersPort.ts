import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface GetCourseChaptersPort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
