import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';
import type { Instructor } from '@core/domain/instructor/entity/Instructor';

export interface InstructorRepositoryPort
  extends BaseRepositoryPort<Instructor> {
  incrementTotalLearners(instructorId: string): Promise<Instructor | null>;
  incrementSessionsConducted(instructorId: string): Promise<Instructor | null>;
}
