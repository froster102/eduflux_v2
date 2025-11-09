import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { EnrollmentCreatedEventSubscriber } from '@core/application/learner-stats/subscriber/EnrollmentCreatedEventSubscriber';
import type { SessionCompletedEventSubscriber } from '@application/learner-stats/subscriber/SessionCompletedEventSubscriber';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { EnrollmentCreatedEventSubscriberService } from '@core/application/learner-stats/service/subscriber/EnrollmentCreatedEventSubscriberService';
import { SessionCompletedEventSubscriberService } from '@application/learner-stats/service/subscriber/SessionCompletedEventSubscriberService';
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

    //Subscribers
    options
      .bind<SessionCompletedEventSubscriber>(
        LearnerStatsDITokens.SessionCompletedEventSubscriber,
      )
      .to(SessionCompletedEventSubscriberService);
    options
      .bind<EnrollmentCreatedEventSubscriber>(
        LearnerStatsDITokens.EnrollmentCreatedEventSubscriber,
      )
      .to(EnrollmentCreatedEventSubscriberService);

    //Repository
    options
      .bind<LearnerStatsRepositoryPort>(
        LearnerStatsDITokens.LearnerStatsRepository,
      )
      .to(MongooseLearnerStatsRepositoryAdapter);
  },
);
