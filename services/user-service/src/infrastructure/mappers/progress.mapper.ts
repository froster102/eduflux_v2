import { Progress } from '@/domain/entities/progress.entity';
import { IMapper } from './mapper.interface';
import { IMongoProgress } from '../database/schema/progress.schema';

export class ProgressMapper implements IMapper<Progress, IMongoProgress> {
  toDomain(raw: IMongoProgress): Progress {
    return Progress.fromPersistence(
      raw._id as string,
      raw.userId,
      raw.courseId,
      raw.completedLectures,
    );
  }

  toPersistance(raw: Progress): Partial<IMongoProgress> {
    return {
      _id: raw.id,
      userId: raw.userId,
      courseId: raw.courseId,
      completedLectures: raw.completedLectures,
    };
  }

  toDomainArray(raw: IMongoProgress[]): Progress[] {
    return raw.map((r) => this.toDomain(r));
  }
}
