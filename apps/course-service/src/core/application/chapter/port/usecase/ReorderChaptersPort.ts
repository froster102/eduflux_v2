import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface ReorderChaptersPort {
  courseId: string;
  items: Array<{
    class: 'chapter' | 'lecture';
    id: string;
  }>;
  actor: AuthenticatedUserDto;
}
