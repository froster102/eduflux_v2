import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface UpdateLecturePort {
  courseId: string;
  lectureId: string;
  title?: string;
  description?: string;
  preview?: boolean;
  actor: AuthenticatedUserDto;
}
