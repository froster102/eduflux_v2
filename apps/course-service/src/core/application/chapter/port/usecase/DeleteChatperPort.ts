import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface DeleteChapterPort {
  courseId: string;
  chapterId: string;
  actor: AuthenticatedUserDto;
}
