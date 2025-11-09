import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface UpdateChapterPort {
  chapterId: string;
  title?: string;
  description?: string;
  actor: AuthenticatedUserDto;
  courseId: string;
}
