import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { Chapter } from '@core/domain/chapter/entity/Chapter';

export interface ChapterRepositoryPort extends BaseRepositoryPort<Chapter> {
  findByCourseId(courseId: string): Promise<Chapter[]>;
  getMaxObjectIndex(courseId: string): Promise<number>;
  updateAll(chapters: Chapter[]): Promise<void>;
  deepCloneByCourseId(
    oldCourseId: string,
    newCourseId: string,
  ): Promise<Chapter[]>;
}
