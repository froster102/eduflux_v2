import type { LearnerStats } from '@core/domain/learner-stats/entity/LearnerStats';
import type { LearnerStatsRepositoryPort } from '@core/domain/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { LearnerStatsMapper } from '@infrastructure/adapter/persistence/mongoose/models/learner-stats/mapper/MongooseLearnerStatsMapper';
import {
  LearnerStatsModel,
  type MongooseLearnerStats,
} from '@infrastructure/adapter/persistence/mongoose/models/learner-stats/MongooseLearnerStats';

import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';
import type { FilterQuery } from 'mongoose';

export class MongooseLearnerStatsRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseLearnerStats, LearnerStats>
  implements LearnerStatsRepositoryPort
{
  constructor() {
    super(LearnerStatsModel, LearnerStatsMapper);
  }

  async incrementCompletedSessions(learnerId: string): Promise<void> {
    await LearnerStatsModel.updateOne(
      { _id: learnerId },
      {
        $inc: { completedSessions: 1 },
        $set: { updatedAt: new Date() },
      },
    );
  }

  async incrementCompletedCourses(learnerId: string): Promise<void> {
    await LearnerStatsModel.updateOne(
      { _id: learnerId },
      {
        $inc: {
          completedCourses: 1,
        },
        $set: { updatedAt: new Date() },
      },
    );
  }

  async completeCourse(learnerId: string): Promise<void> {
    await LearnerStatsModel.updateOne(
      { _id: learnerId, enrolledCourses: { $gte: 1 } },
      {
        $inc: {
          completedCourses: 1,
          enrolledCourses: -1,
        },
        $set: { updatedAt: new Date() },
      },
    );
  }

  async adjustEnrolledCourses(learnerId: string, count: number): Promise<void> {
    const filter: FilterQuery<MongooseLearnerStats> = { _id: learnerId };

    if (count < 0) {
      filter.enrolledCourses = { $gte: Math.abs(count) };
    }

    await LearnerStatsModel.updateOne(filter, {
      $inc: { enrolledCourses: count },
      $set: { updatedAt: new Date() },
    });
  }
}
