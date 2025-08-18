import { Lecture } from '../entity/lecture.entity';
import type { IBaseRepository } from './base.repository';

export interface ILectureRepository extends IBaseRepository<Lecture> {
  findByCourseId(courseId: string): Promise<Lecture[]>;
  getMaxObjectIndex(courseId: string): Promise<number>;
  updateAll(lectures: Lecture[]): Promise<void>;
}
