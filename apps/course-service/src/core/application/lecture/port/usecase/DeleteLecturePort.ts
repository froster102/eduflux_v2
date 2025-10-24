import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface DeleteLecturePort {
  courseId: string;
  lectureId: string;
  actor: AuthenticatedUserDto;
}
