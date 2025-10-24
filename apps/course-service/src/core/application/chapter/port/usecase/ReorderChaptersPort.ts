import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface ReorderChaptersPort {
  courseId: string;
  items: Array<{
    class: 'chapter' | 'lecture';
    id: string;
  }>;
  actor: AuthenticatedUserDto;
}
