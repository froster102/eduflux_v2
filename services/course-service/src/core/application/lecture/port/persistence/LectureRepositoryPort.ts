import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Lecture } from '@core/domain/lecture/entity/Lecture';

export interface LectureRepositoryPort extends BaseRepositoryPort<Lecture> {
  findByCourseId(courseId: string): Promise<Lecture[]>;
  getMaxObjectIndex(courseId: string): Promise<number>;
  updateAll(lectures: Lecture[]): Promise<void>;
}
