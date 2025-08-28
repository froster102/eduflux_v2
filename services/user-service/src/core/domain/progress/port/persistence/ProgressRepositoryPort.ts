import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';
import { Progress } from '@core/domain/progress/entity/Progress';

export interface ProgressRepositoryPort extends BaseRepositoryPort<Progress> {
  findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<Progress | null>;
}
