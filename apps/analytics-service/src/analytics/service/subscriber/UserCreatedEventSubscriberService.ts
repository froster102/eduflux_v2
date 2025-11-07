import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import type { IApplicationStatsRepository } from '@analytics/repository/ApplicationStatsRepository';
import type { IUserGrowthSnapshotRepository } from '@analytics/repository/UserGrowthSnapshotRepository';
import type { UserCreatedEventSubscriber } from '@analytics/subscriber/UserCreatedEventSubscriber';
import { UserCreatedEvent } from '@eduflux-v2/shared/events/user/UserCreatedEvent';
import { inject } from 'inversify';
import { Role } from '@eduflux-v2/shared/constants/Role';

export class UserCreatedEventSubscriberService
  implements UserCreatedEventSubscriber
{
  constructor(
    @inject(AnalyticsDITokens.ApplicationStatsRepository)
    private readonly applicationStatsRepository: IApplicationStatsRepository,
    @inject(AnalyticsDITokens.UserGrowthSnapshotRepository)
    private readonly userGrowthSnapshotRepository: IUserGrowthSnapshotRepository,
  ) {}

  async on(event: UserCreatedEvent): Promise<void> {
    const roles = event.payload.roles || [];
    const isInstructor = roles.includes(Role.INSTRUCTOR);

    if (!isInstructor) {
      await this.applicationStatsRepository.incrementLearners();
      // Record daily user growth snapshot
      await this.userGrowthSnapshotRepository.incrementUserCount(new Date());
    }
  }

  subscribedTo() {
    return [UserCreatedEvent];
  }
}
