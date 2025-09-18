import { NotificationController } from "@api/http/controller/NotificationController";
import { NotificationDITokens } from "@core/application/notification/di/NotificationDITokens";
import type { EnrollmentEventHandler } from "@core/application/notification/handler/EnrollmentEventHandler";
import type { NotificationRepositoryPort } from "@core/application/notification/port/persistence/NotificationRepositoryPort";
import { EnrollmentEventHandlerService } from "@core/application/notification/service/handler/EnrollmentEventHandlerService";
import { CreateNotificationService } from "@core/application/notification/service/usecase/CreateNotificationService";
import { GetNotificationsService } from "@core/application/notification/service/usecase/GetNotificationsService";
import { MarkNotificationAsSeenService } from "@core/application/notification/service/usecase/MarkNotificationAsSeenService";
import type { CreateNotificationUseCase } from "@core/application/notification/usecase/CreateNotificationUseCase";
import type { GetNotificationsUseCase } from "@core/application/notification/usecase/GetNotificationsUseCase";
import type { MarkNotificationAsSeenUseCase } from "@core/application/notification/usecase/MarkNotificationAsSeenUseCase";
import { MongooseNotificatoinRepositoryAdapter } from "@infrastructure/adapter/persistence/mongoose/repository/notification/MongooseNotificationRepositoryAdapter";
import { ContainerModule } from "inversify";

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
      .bind<EnrollmentEventHandler>(NotificationDITokens.EnrollmentEventHandler)
      .to(EnrollmentEventHandlerService);

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
