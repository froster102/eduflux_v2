import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface PublishCoursePort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
