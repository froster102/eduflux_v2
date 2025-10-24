import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface ApproveCoursePort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
