import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetLearnerStatsPort } from '@core/application/learner-stats/port/usecase/GetLearnerStatsPort';
import type { LearnerUseCaseDto } from '@core/application/learner-stats/usecase/dto/LearnerUseCaseDto';

export interface GetLearnerStatsUseCase
  extends UseCase<GetLearnerStatsPort, LearnerUseCaseDto> {}
