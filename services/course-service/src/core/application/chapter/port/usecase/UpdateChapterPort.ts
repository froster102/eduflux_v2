import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface UpdateChapterPort {
  chapterId: string;
  title?: string;
  description?: string;
  actor: AuthenticatedUserDto;
  courseId: string;
}
