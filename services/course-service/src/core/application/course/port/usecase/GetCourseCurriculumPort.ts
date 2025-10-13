import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface GetCourseCurriculumPort {
  id: string;
  executor?: AuthenticatedUserDto;
}
