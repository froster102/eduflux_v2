import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import { IProgressRepository } from '@/domain/repositories/progress.repository';
import { BaseMongoRepositoryImpl } from './base.repository';
import { Progress } from '@/domain/entities/progress.entity';
import { IMongoProgress } from '../schema/progress.schema';
import ProgressModel from '../models/progress.model';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { DatabaseException } from '@/infrastructure/exceptions/database.exception';

export class MongoProgressRepository
  extends BaseMongoRepositoryImpl<IMongoProgress, Progress>
  implements IProgressRepository
{
  constructor(
    @inject(TYPES.ProgressMapper)
    private readonly progressMapper: IMapper<Progress, IMongoProgress>,
  ) {
    super(ProgressModel, progressMapper);
  }

  async findByUserIdAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<Progress | null> {
    const progress = await ProgressModel.findOne({ userId, courseId }).catch(
      (error: Error) => {
        throw new DatabaseException(error.message);
      },
    );
    return progress ? this.progressMapper.toDomain(progress) : null;
  }
}
