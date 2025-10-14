import { TaughtCourseViewDITokens } from '@core/application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@core/application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import type { TaughtCourseViewQueryResult } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewQueryResult';
import type { GetTaughtCourseViewsPort } from '@core/application/views/taught-course/port/persistence/usecase/GetTaughtCourseViewsPort';
import type { GetTaughtCourseViewsUseCase } from '@core/application/views/taught-course/usecase/GetTaughtCourseViewsUseCase';
import { inject } from 'inversify';

export class GetTaughtCourseViewsService
  implements GetTaughtCourseViewsUseCase
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseRepository: TaughtCourseViewRepositoryPort,
  ) {}

  async execute(
    payload: GetTaughtCourseViewsPort,
  ): Promise<TaughtCourseViewQueryResult> {
    const result = await this.taughtCourseRepository.findByUserId(
      payload.userId,
      payload.query,
    );
    return result;
  }
}
