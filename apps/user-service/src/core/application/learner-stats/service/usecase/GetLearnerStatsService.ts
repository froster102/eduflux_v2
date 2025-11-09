import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import type { GetLearnerStatsPort } from '@application/learner-stats/port/usecase/GetLearnerStatsPort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { inject } from 'inversify';
import type { GetLearnerStatsUseCase } from '@application/learner-stats/usecase/GetLearnerStatsUseCase';
import { LearnerUseCaseDto } from '@application/learner-stats/usecase/dto/LearnerUseCaseDto';

export class GetLearnerStatsUseCaseService implements GetLearnerStatsUseCase {
  constructor(
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
  ) {}

  async execute(payload: GetLearnerStatsPort): Promise<LearnerUseCaseDto> {
    const { learnerId } = payload;

    const learnerStats = CoreAssert.notEmpty(
      await this.learnerStatsRepository.findById(learnerId),
      new NotFoundException('Learner stats not found.'),
    );

    return LearnerUseCaseDto.fromEntity(learnerStats);
  }
}
