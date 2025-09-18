import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { BookSessionService } from '@core/application/session/service/BookSessionService';
import { ConfirmSessionBookingService } from '@core/application/session/service/ConfirmSessionBookingService';
import { GetSessionsService } from '@core/application/session/service/GetSessionsService';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import type { ConfirmSessionBookingUseCase } from '@core/application/session/usecase/ConfirmSessionBookingUseCase';
import type { GetSessionsUseCase } from '@core/application/session/usecase/GetSessionUseCase';
import { MongooseSessionRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/session/MongooseSessionRepositoryAdapter';
import { ContainerModule } from 'inversify';
import { ScheduleController } from '@api/http-rest/controller/SchedulerController';
import type { HandleExpiredPendingPaymentsUseCase } from '@core/application/session/usecase/HandleExpiredPendingPaymentsUseCase';
import { HandleExpiredPendingPaymentsService } from '@core/application/session/service/HandleExpiredPendingPaymentsService';

export const SessionModule: ContainerModule = new ContainerModule((options) => {
  //Use-case
  options
    .bind<ConfirmSessionBookingUseCase>(
      SessionDITokens.ConfirmSessionBookingUseCase,
    )
    .to(ConfirmSessionBookingService);
  options
    .bind<BookSessionUseCase>(SessionDITokens.BookSessionUseCase)
    .to(BookSessionService);
  options
    .bind<GetSessionsUseCase>(SessionDITokens.GetSessionUseCase)
    .to(GetSessionsService);
  options
    .bind<HandleExpiredPendingPaymentsUseCase>(
      SessionDITokens.HandleExpiredPendingPaymentsUseCase,
    )
    .to(HandleExpiredPendingPaymentsService);

  //Repository
  options
    .bind<SessionRepositoryPort>(SessionDITokens.SessionRepository)
    .to(MongooseSessionRepositoryAdapter);

  //controller
  options
    .bind<ScheduleController>(SessionDITokens.ScheduleController)
    .to(ScheduleController);
});
