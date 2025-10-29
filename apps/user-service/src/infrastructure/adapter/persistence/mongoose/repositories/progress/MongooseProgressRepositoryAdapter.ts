import { Progress } from '@core/domain/progress/entity/Progress';
import type { ProgressRepositoryPort } from '@application/progress/port/persistence/ProgressRepositoryPort';
import { MongooseProgressMapper } from '@infrastructure/adapter/persistence/mongoose/models/progress/mapper/MongooseProgressMapper';
import { MongooseProgress } from '@infrastructure/adapter/persistence/mongoose/models/progress/MongooseProgress';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';

export class MongooseProgressRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Progress, MongooseProgress>
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
