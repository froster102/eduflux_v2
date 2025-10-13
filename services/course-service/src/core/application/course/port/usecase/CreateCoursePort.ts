import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface CreateCoursePort {
  title: string;
  categoryId: string;
  actor: AuthenticatedUserDto;
}
