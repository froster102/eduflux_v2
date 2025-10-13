import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface SubmitCourseForReviewPort {
  courseId: string;
  actor: AuthenticatedUserDto;
}
