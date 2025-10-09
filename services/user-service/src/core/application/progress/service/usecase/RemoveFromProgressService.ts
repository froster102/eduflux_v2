import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { ProgressDITokens } from '@core/application/progress/di/ProgressDITokens';
import type { ProgressRepositoryPort } from '@core/application/progress/port/persistence/ProgressRepositoryPort';
import type { RemoveFromProgressPort } from '@core/application/progress/port/usecase/RemoveFromProgressPort';
import type { RemoveFromProgressUseCase } from '@core/application/progress/usecase/RemoveFromProgressUseCase';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { inject } from 'inversify';

export class RemoveFromProgressService implements RemoveFromProgressUseCase {
  constructor(
    @inject(ProgressDITokens.ProgressRepository)
    private readonly progressRepository: ProgressRepositoryPort,
  ) {}

  async execute(payload: RemoveFromProgressPort): Promise<void> {
    const { courseId, lectureId, userId } = payload;

    const progress = CoreAssert.notEmpty(
      await this.progressRepository.findByUserIdAndCourseId(userId, courseId),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR }),
    );

    progress.removeLecture(lectureId);

    await this.progressRepository.update(progress.getId(), progress);
  }
}
