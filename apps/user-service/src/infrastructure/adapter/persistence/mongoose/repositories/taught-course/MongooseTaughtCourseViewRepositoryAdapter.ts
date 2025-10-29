import type { TaughtCourseView } from '@application/views/taught-course/entity/TaughtCourseView';
import type { TaughtCourseViewRepositoryPort } from '@application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import type { TaughtCourseViewQueryParameters } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewQueryParameters';
import type { TaughtCourseViewQueryResult } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewQueryResult';
import type { TaughtCourseViewUpsertPayload } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewUpsertPayload';
import { MongooseTaughtCourseViewMapper } from '@infrastructure/adapter/persistence/mongoose/models/taught-course/mapper/MongooseTaughtCourseViewMapper';
import {
  TaughtCourseViewModel,
  type MongooseTaughtCourseView,
} from '@infrastructure/adapter/persistence/mongoose/models/taught-course/MongooseTaughtCourseView';
import type { FilterQuery } from 'mongoose';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';

export class MongooseTaughtCourseViewRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<
    TaughtCourseView,
    MongooseTaughtCourseView
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
