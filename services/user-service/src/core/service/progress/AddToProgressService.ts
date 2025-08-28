import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { ProgressDITokens } from '@core/domain/progress/di/ProgressDITokens';
import type { ProgressRepositoryPort } from '@core/domain/progress/port/persistence/ProgressRepositoryPort';
import type { AddToProgressPort } from '@core/domain/progress/port/usecase/AddToProgressPort';
import type { AddToProgressUseCase } from '@core/domain/progress/usecase/AddToProgressUseCase';
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
      throw Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Progress for user not found.',
        data: {
          userId,
        },
      });
    }

    progress.addLecture(lectureId);

    await this.progressRepository.update(progress.getId(), progress);
  }
}
