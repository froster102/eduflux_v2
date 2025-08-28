import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { ProgressDITokens } from '@core/domain/progress/di/ProgressDITokens';
import type { ProgressRepositoryPort } from '@core/domain/progress/port/persistence/ProgressRepositoryPort';
import type { GetProgressPort } from '@core/domain/progress/port/usecase/GetProgressPort';
import type { GetProgressUseCase } from '@core/domain/progress/usecase/GetProgressUseCase';
import type { ProgressDto } from '@core/domain/user/usecase/dto/ProgressDto';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { inject } from 'inversify';

export class GetProgressService implements GetProgressUseCase {
  constructor(
    @inject(ProgressDITokens.ProgressRepository)
    private readonly progressRepository: ProgressRepositoryPort,
  ) {}

  async execute(payload: GetProgressPort): Promise<ProgressDto> {
    const { courseId, userId } = payload;

    const progress = CoreAssert.notEmpty(
      await this.progressRepository.findByUserIdAndCourseId(userId, courseId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Progress for user not found',
        data: {
          userId,
        },
      }),
    );

    return {
      id: progress.getCourseId(),
      completedLectures: progress.getCompletedLectures(),
    };
  }
}
