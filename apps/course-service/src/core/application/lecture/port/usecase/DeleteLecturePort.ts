import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface DeleteLecturePort {
  courseId: string;
  lectureId: string;
  actor: AuthenticatedUserDto;
}
