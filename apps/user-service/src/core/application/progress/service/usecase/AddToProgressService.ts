import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { ProgressDITokens } from '@application/progress/di/ProgressDITokens';
import type { ProgressRepositoryPort } from '@application/progress/port/persistence/ProgressRepositoryPort';
import type { AddToProgressPort } from '@application/progress/port/usecase/AddToProgressPort';
import type { AddToProgressUseCase } from '@application/progress/usecase/AddToProgressUseCase';
import { inject } from 'inversify';

export class AddToProgressService implements AddToProgressUseCase {
  constructor(
    @inject(ProgressDITokens.ProgressRepository)
    private readonly progressRepository: ProgressRepositoryPort,
  ) {}

  async execute(payload: AddToProgressPort): Promise<void> {
    const { courseId, lectureId, userId } = payload;

    const progress = await this.progressRepository.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!progress) {
      throw new NotFoundException('Progess for user not found.');
    }

    progress.addLecture(lectureId);

    await this.progressRepository.update(progress.id, progress);
  }
}
