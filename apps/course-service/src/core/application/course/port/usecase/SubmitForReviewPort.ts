import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface SubmitCourseForReviewPort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
