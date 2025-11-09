import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { ProgressDITokens } from '@application/progress/di/ProgressDITokens';
import type { ProgressRepositoryPort } from '@application/progress/port/persistence/ProgressRepositoryPort';
import type { RemoveFromProgressPort } from '@application/progress/port/usecase/RemoveFromProgressPort';
import type { RemoveFromProgressUseCase } from '@application/progress/usecase/RemoveFromProgressUseCase';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
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
      new NotFoundException(),
    );

    progress.removeLecture(lectureId);

    await this.progressRepository.update(progress.id, progress);
  }
}
