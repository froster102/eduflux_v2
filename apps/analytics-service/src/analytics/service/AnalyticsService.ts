import type { IApplicationStatsRepository } from '@analytics/repository/ApplicationStatsRepository';
import type { IUserGrowthSnapshotRepository } from '@analytics/repository/UserGrowthSnapshotRepository';
import type { ApplicationStats } from '@analytics/entities/ApplicationStats';
import { inject } from 'inversify';
import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';

export interface UserGrowthData {
  month: string;
  users: number;
}

export class AnalyticsService {
  constructor(
    @inject(AnalyticsDITokens.ApplicationStatsRepository)
    private readonly applicationStatsRepository: IApplicationStatsRepository,
    @inject(AnalyticsDITokens.UserGrowthSnapshotRepository)
    private readonly userGrowthSnapshotRepository: IUserGrowthSnapshotRepository,
  ) {}

  async getApplicationStats({
    exectutor,
  }: {
    exectutor: AuthenticatedUserDto;
  }): Promise<ApplicationStats> {
    if (!exectutor.hasRole(Role.ADMIN)) {
      throw new ForbiddenException(
        'You are not authorized to get application stats',
      );
    }
    return await this.applicationStatsRepository.findOrCreate();
  }

  async getUserGrowth({
    executor,
  }: {
    executor: AuthenticatedUserDto;
  }): Promise<UserGrowthData[]> {
    if (!executor.hasRole(Role.ADMIN)) {
      throw new ForbiddenException(
        'You are not authorized to get user growth data',
      );
    }

    const snapshots = await this.userGrowthSnapshotRepository.getLastNDays(365);

    const monthMap = new Map<string, number>();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    snapshots.forEach((snapshot) => {
      const year = snapshot.date.getFullYear();
      const month = snapshot.date.getMonth();
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      const currentCount = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, currentCount + snapshot.userCount);
    });

    // Get last 12 months in chronological order
    const result: UserGrowthData[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      const monthName = monthNames[month];

      result.push({
        month: monthName,
        users: monthMap.get(monthKey) || 0,
      });
    }

    return result;
  }
}
