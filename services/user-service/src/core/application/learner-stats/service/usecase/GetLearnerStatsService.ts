import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@core/application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import type { GetLearnerStatsPort } from '@core/application/learner-stats/port/usecase/GetLearnerStatsPort';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { inject } from 'inversify';
import type { GetLearnerStatsUseCase } from '@core/application/learner-stats/usecase/GetLearnerStatsUseCase';
import { LearnerUseCaseDto } from '@core/application/learner-stats/usecase/dto/LearnerUseCaseDto';

export class GetLearnerStatsUseCaseService implements GetLearnerStatsUseCase {
  constructor(
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
  ) {}

  async execute(payload: GetLearnerStatsPort): Promise<LearnerUseCaseDto> {
    const { learnerId } = payload;

    const learnerStats = CoreAssert.notEmpty(
      await this.learnerStatsRepository.findById(learnerId),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Learner stats not found.',
      }),
    );

    return LearnerUseCaseDto.fromEntity(learnerStats);
  }
}
