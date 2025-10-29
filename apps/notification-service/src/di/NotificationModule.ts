import { NotificationController } from '@api/http/controller/NotificationController';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { EnrollmentCompletedEventHandler } from '@core/application/notification/handler/EnrollmentCompletedEventHandler';
import type { SessionConfirmedEventHandler } from '@core/application/notification/handler/SessionConfirmedEventHandler';
import type { NotificationRepositoryPort } from '@core/application/notification/port/persistence/NotificationRepositoryPort';
import { EnrollmentCompletedEventHandlerService } from '@core/application/notification/service/handler/EnrollmentCompletedEventHandlerService';
import { SessionConfirmedEventHandlerService } from '@core/application/notification/service/handler/SessionConfirmedEventHandlerService';
import { CreateNotificationService } from '@core/application/notification/service/usecase/CreateNotificationService';
import { GetNotificationsService } from '@core/application/notification/service/usecase/GetNotificationsService';
import { MarkNotificationAsSeenService } from '@core/application/notification/service/usecase/MarkNotificationAsSeenService';
import type { CreateNotificationUseCase } from '@core/application/notification/usecase/CreateNotificationUseCase';
import type { GetNotificationsUseCase } from '@core/application/notification/usecase/GetNotificationsUseCase';
import type { MarkNotificationAsSeenUseCase } from '@core/application/notification/usecase/MarkNotificationAsSeenUseCase';
import { MongooseNotificatoinRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/notification/MongooseNotificationRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const NotificationModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<CreateNotificationUseCase>(
        NotificationDITokens.CreateNotificationUseCase,
      )
      .to(CreateNotificationService);
    options
      .bind<GetNotificationsUseCase>(
        NotificationDITokens.GetNotificationsUseCase,
      )
      .to(GetNotificationsService);
    options
      .bind<MarkNotificationAsSeenUseCase>(
        NotificationDITokens.MarkNotificationAsSeenUseCase,
      )
      .to(MarkNotificationAsSeenService);

    //handlers
    options
      .bind<EnrollmentCompletedEventHandler>(
        NotificationDITokens.EnrollmentCompletedEventHandler,
      )
      .to(EnrollmentCompletedEventHandlerService);
    options
      .bind<SessionConfirmedEventHandler>(
        NotificationDITokens.SessionConfirmedEventHandler,
      )
      .to(SessionConfirmedEventHandlerService);

    //Repositories
    options
      .bind<NotificationRepositoryPort>(
        NotificationDITokens.NotificationRepository,
      )
      .to(MongooseNotificatoinRepositoryAdapter);

    //Controllers
    options
      .bind<NotificationController>(NotificationDITokens.NotificationController)
      .to(NotificationController);
  },
);
