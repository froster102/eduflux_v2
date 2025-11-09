import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { ProgressDITokens } from '@application/progress/di/ProgressDITokens';
import type { ProgressRepositoryPort } from '@application/progress/port/persistence/ProgressRepositoryPort';
import type { GetProgressPort } from '@application/progress/port/usecase/GetProgressPort';
import type { GetProgressUseCase } from '@application/progress/usecase/GetProgressUseCase';
import type { ProgressDto } from '@application/progress/usecase/dto/ProgressUseCaseDto';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
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
      new NotFoundException('User not found.'),
    );

    return {
      id: progress.getCourseId(),
      completedLectures: progress.getCompletedLectures(),
    };
  }
}
