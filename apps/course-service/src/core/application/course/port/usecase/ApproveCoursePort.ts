import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface ApproveCoursePort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
