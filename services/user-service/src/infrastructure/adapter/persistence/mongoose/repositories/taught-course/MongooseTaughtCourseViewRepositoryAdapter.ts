import type { TaughtCourseView } from '@core/application/views/taught-course/entity/TaughtCourseView';
import type { TaughtCourseViewRepositoryPort } from '@core/application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import type { TaughtCourseViewQueryParameters } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewQueryParameters';
import type { TaughtCourseViewQueryResult } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewQueryResult';
import type { TaughtCourseViewUpsertPayload } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewUpsertPayload';
import { MongooseTaughtCourseViewMapper } from '@infrastructure/adapter/persistence/mongoose/models/taught-course/mapper/MongooseTaughtCourseViewMapper';
import {
  TaughtCourseViewModel,
  type MongooseTaughtCourseView,
} from '@infrastructure/adapter/persistence/mongoose/models/taught-course/MongooseTaughtCourseView';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';
import type { FilterQuery } from 'mongoose';

export class MongooseTaughtCourseViewRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<
    MongooseTaughtCourseView,
    TaughtCourseView
  >
  implements TaughtCourseViewRepositoryPort
{
  constructor() {
    super(TaughtCourseViewModel, MongooseTaughtCourseViewMapper);
  }

  async upsert(payload: TaughtCourseViewUpsertPayload): Promise<void> {
    await TaughtCourseViewModel.updateOne(
      { _id: payload.id },
      { $set: payload },
      { upsert: true },
    );
  }

  async findByUserId(
    userId: string,
    query?: TaughtCourseViewQueryParameters,
  ): Promise<TaughtCourseViewQueryResult> {
    const dbQuery: FilterQuery<MongooseTaughtCourseView> = {
      instructorId: userId,
    };

    const limit = query?.limit || this.defaultLimit;
    const skip = query?.offset || this.defaultOffset;

    const totalCount = await TaughtCourseViewModel.countDocuments(dbQuery);

    const courses = await TaughtCourseViewModel.find(dbQuery)
      .limit(limit)
      .skip(skip);

    return {
      totalCount,
      courses: MongooseTaughtCourseViewMapper.toDomainEntities(courses),
    };
  }
}
