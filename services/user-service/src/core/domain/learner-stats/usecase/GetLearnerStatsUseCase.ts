import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetLearnerStatsPort } from '@core/domain/learner-stats/port/usecase/GetLearnerStatsPort';
import type { LearnerUseCaseDto } from '@core/domain/learner-stats/usecase/dto/LearnerUseCaseDto';

export interface GetLearnerStatsUseCase
  extends UseCase<GetLearnerStatsPort, LearnerUseCaseDto> {}
