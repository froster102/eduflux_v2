import { Progress } from '@core/domain/progress/entity/Progress';
import type { ProgressRepositoryPort } from '@core/domain/progress/port/persistence/ProgressRepositoryPort';
import { MongooseProgressMapper } from '@infrastructure/adapter/persistence/mongoose/models/progress/mapper/MongooseProgressMapper';
import {
  type IMongooseProgress,
  MongooseProgress,
} from '@infrastructure/adapter/persistence/mongoose/models/progress/MongooseProgress';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';

export class MongooseProgressRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<IMongooseProgress, Progress>
  implements ProgressRepositoryPort
{
  constructor() {
    super(MongooseProgress, MongooseProgressMapper);
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<Progress | null> {
    const progress = await MongooseProgress.findOne({ userId, courseId });
    return progress ? MongooseProgressMapper.toDomain(progress) : null;
  }
}
