import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import type { IApplicationStatsRepository } from '@analytics/repository/ApplicationStatsRepository';
import type { InstructorCreatedEventSubscriber } from '@analytics/subscriber/InstructorCreatedEventSubscriber';
import { InstructorCreatedEvent } from '@eduflux-v2/shared/events/user/InstructorCreatedEvent';
import { inject } from 'inversify';

export class InstructorCreatedEventSubscriberService
  implements InstructorCreatedEventSubscriber
{
  constructor(
    @inject(AnalyticsDITokens.ApplicationStatsRepository)
    private readonly applicationStatsRepository: IApplicationStatsRepository,
  ) {}

  async on(): Promise<void> {
    await this.applicationStatsRepository.incrementInstructors();
  }

  subscribedTo() {
    return [InstructorCreatedEvent];
  }
}
