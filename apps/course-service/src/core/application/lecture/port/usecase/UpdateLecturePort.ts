import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface UpdateLecturePort {
  courseId: string;
  lectureId: string;
  title?: string;
  description?: string;
  preview?: boolean;
  actor: AuthenticatedUserDto;
}
