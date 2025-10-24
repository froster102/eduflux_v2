import { SubscribedCourseViewDITokens } from '@core/application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewQueryResult } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
import type { SubscribedCourseViewRepositoryPort } from '@core/application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import type { GetSubscribedCoursesPort } from '@core/application/views/subscribed-course/port/usecase/GetSubscribedCoursesPort';
import type { GetSubscribedCourseViewsUseCase } from '@core/application/views/subscribed-course/usecase/GetSubscribedCourseViewsUseCase';
import { inject } from 'inversify';

export class GetSubscribedCourseViewsService
  implements GetSubscribedCourseViewsUseCase
{
  constructor(
    @inject(SubscribedCourseViewDITokens.SubscribedCourseViewRepository)
    private readonly subscribedCourseViewRepository: SubscribedCourseViewRepositoryPort,
  ) {}

  async execute(
    payload: GetSubscribedCoursesPort,
  ): Promise<SubscribedCourseViewQueryResult> {
    const { userId } = payload;
    const result =
      await this.subscribedCourseViewRepository.findByUserId(userId);

    return result;
  }
}
