import {
  ApplicationStatsModel,
  type MongooseApplicationStats,
} from '@infrastructure/database/mongoose/model/MongooseApplicationStats';
import { MongooseApplicationStatsMapper } from '@infrastructure/database/mongoose/model/application-stats/mapper/MongooseApplicationStatsMapper';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { ApplicationStats } from '@analytics/entities/ApplicationStats';
import type { IApplicationStatsRepository } from '@analytics/repository/ApplicationStatsRepository';

const STATS_ID = 'application-stats';

export class MongooseApplicationStatsRepository
  extends MongooseBaseRepositoryAdapter<
    ApplicationStats,
    MongooseApplicationStats
  >
  implements IApplicationStatsRepository
{
  constructor() {
    super(ApplicationStatsModel, new MongooseApplicationStatsMapper());
  }

  async findOrCreate(): Promise<ApplicationStats> {
    let stats = await this.findById(STATS_ID);

    if (!stats) {
      stats = ApplicationStats.new({
        id: STATS_ID,
        totalLearners: 0,
        totalInstructors: 0,
        totalCourses: 0,
        platformEarnings: 0,
      });
      await this.save(stats);
    }

    return stats;
  }

  async incrementLearners(): Promise<ApplicationStats> {
    const stats = await this.findOrCreate();
    stats.incrementLearners();
    const updated = await this.update(stats.id, stats);
    if (!updated) {
      throw new Error('Failed to update application stats');
    }
    return updated;
  }

  async incrementInstructors(): Promise<ApplicationStats> {
    const stats = await this.findOrCreate();
    stats.incrementInstructors();
    const updated = await this.update(stats.id, stats);
    if (!updated) {
      throw new Error('Failed to update application stats');
    }
    return updated;
  }

  async incrementCourses(): Promise<ApplicationStats> {
    const stats = await this.findOrCreate();
    stats.incrementCourses();
    const updated = await this.update(stats.id, stats);
    if (!updated) {
      throw new Error('Failed to update application stats');
    }
    return updated;
  }

  async addPlatformEarnings(amount: number): Promise<ApplicationStats> {
    const stats = await this.findOrCreate();
    stats.addPlatformEarnings(amount);
    const updated = await this.update(stats.id, stats);
    if (!updated) {
      throw new Error('Failed to update application stats');
    }
    return updated;
  }
}
