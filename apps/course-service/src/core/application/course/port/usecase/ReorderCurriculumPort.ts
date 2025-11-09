import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface ReorderCurriculumPort {
  courseId: string;
  items: { class: ClassType; id: string }[];
  executor: AuthenticatedUserDto;
}
