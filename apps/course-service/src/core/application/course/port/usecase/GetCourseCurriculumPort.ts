import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface GetCourseCurriculumPort {
  id: string;
  executor?: AuthenticatedUserDto;
}
