import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import type { EnrollmentSuccessEventHandler } from '@core/application/learner-stats/handler/EnrollmentSuccessEventHandler';
import type { SessionUpdatedEventHandler } from '@core/application/learner-stats/handler/SessionUpdatedEventHandler';
import type { LearnerStatsRepositoryPort } from '@core/application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { EnrollmentSuccessEventHandlerService } from '@core/application/learner-stats/service/handler/EnrollmentSuccessEventHandlerService';
import { SessionUpdatedEventHandlerService } from '@core/application/learner-stats/service/handler/SessionUpdatedEventHandlerService';
import { GetLearnerStatsUseCaseService } from '@core/application/learner-stats/service/usecase/GetLearnerStatsService';
import type { GetLearnerStatsUseCase } from '@core/application/learner-stats/usecase/GetLearnerStatsUseCase';
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
      .bind<SessionUpdatedEventHandler>(
        LearnerStatsDITokens.SessionUpdatedEventHandler,
      )
      .to(SessionUpdatedEventHandlerService);
    options
      .bind<EnrollmentSuccessEventHandler>(
        LearnerStatsDITokens.EnrollmentSuccessEventHandler,
      )
      .to(EnrollmentSuccessEventHandlerService);

    //Repository
    options
      .bind<LearnerStatsRepositoryPort>(
        LearnerStatsDITokens.LearnerStatsRepository,
      )
      .to(MongooseLearnerStatsRepositoryAdapter);
  },
);
