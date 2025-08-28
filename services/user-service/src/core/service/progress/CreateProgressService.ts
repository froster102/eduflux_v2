import { ProgressDITokens } from '@core/domain/progress/di/ProgressDITokens';
import { Progress } from '@core/domain/progress/entity/Progress';
import type { ProgressRepositoryPort } from '@core/domain/progress/port/persistence/ProgressRepositoryPort';
import type { CreateProgressPort } from '@core/domain/progress/port/usecase/CreateProgressPort';
import type { CreateProgressUseCase } from '@core/domain/progress/usecase/CreateProgressUseCase';
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
