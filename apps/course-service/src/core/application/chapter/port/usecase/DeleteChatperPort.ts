import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface DeleteChapterPort {
  courseId: string;
  chapterId: string;
  actor: AuthenticatedUserDto;
}
