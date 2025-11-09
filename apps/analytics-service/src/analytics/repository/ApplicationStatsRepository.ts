import type { ApplicationStats } from '@analytics/entities/ApplicationStats';
import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';

export interface IApplicationStatsRepository
  extends BaseRepositoryPort<ApplicationStats> {
  save(stats: ApplicationStats): Promise<ApplicationStats>;
  findById(id: string): Promise<ApplicationStats | null>;
  findOrCreate(): Promise<ApplicationStats>;
  incrementLearners(): Promise<ApplicationStats>;
  incrementInstructors(): Promise<ApplicationStats>;
  incrementCourses(): Promise<ApplicationStats>;
  addPlatformEarnings(amount: number): Promise<ApplicationStats>;
}
