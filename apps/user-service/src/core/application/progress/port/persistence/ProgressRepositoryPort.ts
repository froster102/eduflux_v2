import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import { Progress } from '@core/domain/progress/entity/Progress';

export interface ProgressRepositoryPort extends BaseRepositoryPort<Progress> {
  findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<Progress | null>;
}
