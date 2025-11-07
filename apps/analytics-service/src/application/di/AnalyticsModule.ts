import { MongooseApplicationStatsRepository } from '@infrastructure/database/repository/MongooseApplicationStatsRepository';
import { MongooseUserGrowthSnapshotRepository } from '@infrastructure/database/repository/MongooseUserGrowthSnapshotRepository';
import { AnalyticsDITokens } from '@analytics/di/AnalyticsDITokens';
import type { IApplicationStatsRepository } from '@analytics/repository/ApplicationStatsRepository';
import type { IUserGrowthSnapshotRepository } from '@analytics/repository/UserGrowthSnapshotRepository';
import { AnalyticsService } from '@analytics/service/AnalyticsService';
import { UserCreatedEventSubscriberService } from '@analytics/service/subscriber/UserCreatedEventSubscriberService';
import { InstructorCreatedEventSubscriberService } from '@analytics/service/subscriber/InstructorCreatedEventSubscriberService';
import { CoursePublishedEventSubscriberService } from '@analytics/service/subscriber/CoursePublishedEventSubscriberService';
import { PaymentSuccessfullEventSubscriberService } from '@analytics/service/subscriber/PaymentSuccessfullEventSubscriberService';
import type { UserCreatedEventSubscriber } from '@analytics/subscriber/UserCreatedEventSubscriber';
import type { InstructorCreatedEventSubscriber } from '@analytics/subscriber/InstructorCreatedEventSubscriber';
import type { CoursePublishedEventSubscriber } from '@analytics/subscriber/CoursePublishedEventSubscriber';
import type { PaymentSuccessfullEventSubscriber } from '@analytics/subscriber/PaymentSuccessfullEventSubscriber';
import { ContainerModule } from 'inversify';

export const AnalyticsModule: ContainerModule = new ContainerModule(
  (options) => {
    //Service
    options
      .bind<AnalyticsService>(AnalyticsDITokens.AnalyticsService)
      .to(AnalyticsService)
      .inSingletonScope();

    //Repository
    options
      .bind<IApplicationStatsRepository>(
        AnalyticsDITokens.ApplicationStatsRepository,
      )
      .to(MongooseApplicationStatsRepository);

    options
      .bind<IUserGrowthSnapshotRepository>(
        AnalyticsDITokens.UserGrowthSnapshotRepository,
      )
      .to(MongooseUserGrowthSnapshotRepository);

    //Subscribers
    options
      .bind<UserCreatedEventSubscriber>(
        AnalyticsDITokens.UserCreatedEventSubscriber,
      )
      .to(UserCreatedEventSubscriberService);

    options
      .bind<InstructorCreatedEventSubscriber>(
        AnalyticsDITokens.InstructorCreatedEventSubscriber,
      )
      .to(InstructorCreatedEventSubscriberService);

    options
      .bind<CoursePublishedEventSubscriber>(
        AnalyticsDITokens.CoursePublishedEventSubscriber,
      )
      .to(CoursePublishedEventSubscriberService);

    options
      .bind<PaymentSuccessfullEventSubscriber>(
        AnalyticsDITokens.PaymentSuccessfullEventSubscriber,
      )
      .to(PaymentSuccessfullEventSubscriberService);
  },
);
