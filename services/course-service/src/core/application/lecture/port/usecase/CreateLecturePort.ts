import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface CreateLecturePort {
  courseId: string;
  title: string;
  description: string;
  preview: boolean;
  actor: AuthenticatedUserDto;
}
