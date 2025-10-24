import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { InstructorViewRepositoryPort } from '@core/application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import type { GetInstructorViewsPort } from '@core/application/views/instructor-view/port/usecase/GetInstructorViewsPort';
import type { GetInstructorViewsUseCase } from '@core/application/views/instructor-view/usecase/GetInstructorViewsUseCase';
import type { GetInstructorViewsResult } from '@core/application/views/instructor-view/usecase/types/GetInstructorViewsResult';
import { inject } from 'inversify';

export class GetInstructorViewsService implements GetInstructorViewsUseCase {
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  public async execute(
    payload: GetInstructorViewsPort,
  ): Promise<GetInstructorViewsResult> {
    const { queryParameters, executorId } = payload;

    const { instructors, totalCount } =
      await this.instructorViewRepository.findInstructors(
        queryParameters,
        executorId,
      );

    return {
      instructors,
      totalCount: totalCount,
    };
  }
}
