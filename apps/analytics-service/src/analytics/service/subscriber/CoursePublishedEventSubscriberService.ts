import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import type { IApplicationStatsRepository } from '@analytics/repository/ApplicationStatsRepository';
import type { CoursePublishedEventSubscriber } from '@analytics/subscriber/CoursePublishedEventSubscriber';
import { CoursePublishedEvent } from '@eduflux-v2/shared/events/course/CoursePublishedEvent';
import { inject } from 'inversify';

export class CoursePublishedEventSubscriberService
  implements CoursePublishedEventSubscriber
{
  constructor(
    @inject(AnalyticsDITokens.ApplicationStatsRepository)
    private readonly applicationStatsRepository: IApplicationStatsRepository,
  ) {}

  async on(event: CoursePublishedEvent): Promise<void> {
    // Increment total courses when a course is published
    await this.applicationStatsRepository.incrementCourses();
  }

  subscribedTo() {
    return [CoursePublishedEvent];
  }
}

