import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { Instructor } from '@domain/instructor/entity/Instructor';

export interface InstructorRepositoryPort
  extends BaseRepositoryPort<Instructor> {
  incrementTotalLearners(instructorId: string): Promise<Instructor | null>;
  incrementSessionsConducted(instructorId: string): Promise<Instructor | null>;
  incrementCourseCreated(instructorId: string): Promise<Instructor | null>;
}
