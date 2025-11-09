import type { BaseRepositoryPort } from '@eduflux-v2/shared/ports/persistence/BaseRepositoryPort';
import type { UserGrowthSnapshot } from '@analytics/entities/UserGrowthSnapshot';

export interface IUserGrowthSnapshotRepository
  extends BaseRepositoryPort<UserGrowthSnapshot> {
  findByDate(date: Date): Promise<UserGrowthSnapshot | null>;
  findOrCreateByDate(date: Date): Promise<UserGrowthSnapshot>;
  incrementUserCount(date: Date): Promise<UserGrowthSnapshot>;
  getLastNDays(days: number): Promise<UserGrowthSnapshot[]>;
  getByDateRange(startDate: Date, endDate: Date): Promise<UserGrowthSnapshot[]>;
}
