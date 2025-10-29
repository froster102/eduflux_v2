import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { GetLearnerStatsPort } from '@application/learner-stats/port/usecase/GetLearnerStatsPort';
import type { LearnerUseCaseDto } from '@application/learner-stats/usecase/dto/LearnerUseCaseDto';

export interface GetLearnerStatsUseCase
  extends UseCase<GetLearnerStatsPort, LearnerUseCaseDto> {}
