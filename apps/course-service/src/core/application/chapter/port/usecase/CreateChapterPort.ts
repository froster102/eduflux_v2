import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface CreateChapterPort {
  courseId: string;
  title: string;
  description: string;
  actor: AuthenticatedUserDto;
}
