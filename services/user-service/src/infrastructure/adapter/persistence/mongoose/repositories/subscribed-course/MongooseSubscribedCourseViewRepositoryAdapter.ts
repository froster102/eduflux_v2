import type { SubscribedCourseView } from '@core/application/views/subscribed-course/entity/SubscribedCourseView';
import type { SubscribedCourseViewQueryParameters } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryParameters';
import type { SubscribedCourseViewQueryResult } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
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

  async upsert(subscribedCourseView: SubscribedCourseView): Promise<void> {
    const persistence =
      MongooseSubscribedCourseViewMapper.toPersistence(subscribedCourseView);

    await SubscribedCourseViewModel.updateOne(
      {
        _id: persistence._id,
      },
      { $set: persistence },
      { upsert: true },
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
