import { Progress } from '../entities/progress.entity';
import { IBaseRepository } from './base.repository';

export interface IProgressRepository extends IBaseRepository<Progress> {
  findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<Progress | null>;
}
