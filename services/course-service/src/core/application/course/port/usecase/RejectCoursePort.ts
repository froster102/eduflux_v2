import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface RejectCoursePort {
  courseId: string;
  feedback: string;
  actor: AuthenticatedUserDto;
}
