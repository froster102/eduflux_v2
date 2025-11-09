import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface CreateCoursePort {
  title: string;
  categoryId: string;
  actor: AuthenticatedUserDto;
}
