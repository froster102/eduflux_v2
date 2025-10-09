import { ProgressDITokens } from '@core/application/progress/di/ProgressDITokens';
import { Progress } from '@core/domain/progress/entity/Progress';
import type { ProgressRepositoryPort } from '@core/application/progress/port/persistence/ProgressRepositoryPort';
import type { CreateProgressPort } from '@core/application/progress/port/usecase/CreateProgressPort';
import type { CreateProgressUseCase } from '@core/application/progress/usecase/CreateProgressUseCase';
import { nanoid } from '@shared/utils/nanoid';
import { inject } from 'inversify';

export class CreateProgressService implements CreateProgressUseCase {
  constructor(
    @inject(ProgressDITokens.ProgressRepository)
    private readonly progressRepository: ProgressRepositoryPort,
  ) {}

  async execute(payload: CreateProgressPort): Promise<void> {
    const { userId, courseId } = payload;

    const progress = Progress.new({
      id: nanoid(),
      userId,
      completedLectures: new Set(),
      courseId,
    });

    await this.progressRepository.save(progress);
  }
}
