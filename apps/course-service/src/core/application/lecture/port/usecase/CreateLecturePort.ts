import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface CreateLecturePort {
  courseId: string;
  title: string;
  description: string;
  preview: boolean;
  actor: AuthenticatedUserDto;
}
