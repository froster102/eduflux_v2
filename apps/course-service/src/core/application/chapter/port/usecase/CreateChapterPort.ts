import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface CreateChapterPort {
  courseId: string;
  title: string;
  description: string;
  actor: AuthenticatedUserDto;
}
