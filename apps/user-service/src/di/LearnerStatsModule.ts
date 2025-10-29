import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { EnrollmentCompletedEventHandler } from '@application/learner-stats/handler/EnrollmentCompletedEventHandler';
import type { SessionCompletedEventHandler } from '@application/learner-stats/handler/SessionCompletedEventHandler';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { EnrollmentCompletedEventHandlerService } from '@application/learner-stats/service/handler/EnrollmentCompletedEventHandlerService';
import { SessionCompletedEventHandlerService } from '@application/learner-stats/service/handler/SessionCompletedEventHandlerService';
import { GetLearnerStatsUseCaseService } from '@application/learner-stats/service/usecase/GetLearnerStatsService';
import type { GetLearnerStatsUseCase } from '@application/learner-stats/usecase/GetLearnerStatsUseCase';
import { MongooseLearnerStatsRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/learner-stats/MongooseLearnerStatsRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const LearnerStatsModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetLearnerStatsUseCase>(LearnerStatsDITokens.GetLearnerStatsUseCase)
      .to(GetLearnerStatsUseCaseService);

    //handler
    options
      .bind<SessionCompletedEventHandler>(
        LearnerStatsDITokens.SessionCompletedEventHandler,
      )
      .to(SessionCompletedEventHandlerService);
    options
      .bind<EnrollmentCompletedEventHandler>(
        LearnerStatsDITokens.EnrollmentCompletedEventHandler,
      )
      .to(EnrollmentCompletedEventHandlerService);

    //Repository
    options
      .bind<LearnerStatsRepositoryPort>(
        LearnerStatsDITokens.LearnerStatsRepository,
      )
      .to(MongooseLearnerStatsRepositoryAdapter);
  },
);
