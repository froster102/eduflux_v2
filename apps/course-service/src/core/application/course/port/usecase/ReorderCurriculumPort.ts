import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface ReorderCurriculumPort {
  courseId: string;
  items: { class: ClassType; id: string }[];
  executor: AuthenticatedUserDto;
}
