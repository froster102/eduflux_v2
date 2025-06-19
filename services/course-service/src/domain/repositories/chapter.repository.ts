import { Chapter } from '../entity/chapter.entity';
import { IBaseRepository } from './base.repository';

export interface IChapterRepository extends IBaseRepository<Chapter> {
  findByCourseId(courseId: string): Promise<Chapter[]>;
  getMaxObjectIndex(courseId: string): Promise<number>;
  updateAll(chapters: Chapter[]): Promise<void>;
}
