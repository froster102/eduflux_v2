import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface RejectCoursePort {
  courseId: string;
  feedback: string;
  actor: AuthenticatedUserDto;
}
