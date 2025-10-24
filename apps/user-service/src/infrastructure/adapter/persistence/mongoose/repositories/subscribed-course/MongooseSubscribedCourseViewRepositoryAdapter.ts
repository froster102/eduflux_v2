import type { SubscribedCourseView } from '@core/application/views/subscribed-course/entity/SubscribedCourseView';
import type { SubscribedCourseViewQueryParameters } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryParameters';
import type { SubscribedCourseViewQueryResult } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
import type { SubscribedCourseViewUpsertPayload } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewUpsertPayload';
import type { SubscribedCourseViewUserUpdatePayload } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewUserUpdatePayload';
import type { SubscribedCourseViewRepositoryPort } from '@core/application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { MongooseSubscribedCourseViewMapper } from '@infrastructure/adapter/persistence/mongoose/models/subscribed-course/mapper/MongooseSubscribedCourseViewMapper';
import {
  SubscribedCourseViewModel,
  type MongooseSubscribedCourseView,
} from '@infrastructure/adapter/persistence/mongoose/models/subscribed-course/MongooseSubscribedCourseView';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';
import type { FilterQuery } from 'mongoose';

export class MongooseSubscribedCourseViewRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<
    MongooseSubscribedCourseView,
    SubscribedCourseView
  >
  implements SubscribedCourseViewRepositoryPort
{
  constructor() {
    super(SubscribedCourseViewModel, MongooseSubscribedCourseViewMapper);
  }

  async upsert(payload: SubscribedCourseViewUpsertPayload): Promise<void> {
    await SubscribedCourseViewModel.updateOne(
      {
        _id: payload.id,
      },
      { $set: payload },
      { upsert: true },
    );
  }

  async updateUser(
    payload: SubscribedCourseViewUserUpdatePayload,
  ): Promise<void> {
    await SubscribedCourseViewModel.updateMany(
      {
        'instructor.id': payload.id,
      },
      { $set: { 'instructor.name': payload.name } },
    );
  }

  async findByUserId(
    userId: string,
    query?: SubscribedCourseViewQueryParameters,
  ): Promise<SubscribedCourseViewQueryResult> {
    const dbQuery: FilterQuery<MongooseSubscribedCourseView> = { userId };

    const limit = query?.limit || this.defaultLimit;
    const skip = query?.offset || this.defaultOffset;

    const totalCount = await SubscribedCourseViewModel.countDocuments(dbQuery);

    const courses = await SubscribedCourseViewModel.find(dbQuery)
      .limit(limit)
      .skip(skip);

    return {
      totalCount,
      courses: MongooseSubscribedCourseViewMapper.toDomainEntities(courses),
    };
  }
}
