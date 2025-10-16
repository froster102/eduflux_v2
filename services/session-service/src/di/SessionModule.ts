import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { BookSessionService } from '@core/application/session/service/BookSessionService';
import { ConfirmSessionBookingService } from '@core/application/session/service/ConfirmSessionBookingService';
import { GetSessionsService } from '@core/application/session/service/GetSessionsService';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import type { ConfirmSessionBookingUseCase } from '@core/application/session/usecase/ConfirmSessionBookingUseCase';
import type { GetSessionsUseCase } from '@core/application/session/usecase/GetSessionsUseCase';
import { MongooseSessionRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/session/MongooseSessionRepositoryAdapter';
import { ContainerModule } from 'inversify';
import { SessionController } from '@api/http-rest/controller/SessionController';
import type { HandleExpiredPendingPaymentsUseCase } from '@core/application/session/usecase/HandleExpiredPendingPaymentsUseCase';
import { HandleExpiredPendingPaymentsService } from '@core/application/session/service/HandleExpiredPendingPaymentsService';
import type { JoinSessionUseCase } from '@core/application/session/usecase/JoinSessionUseCase';
import { JoinSessionService } from '@core/application/session/service/JoinSessionService';
import type { StartSessionOnJoinUseCase } from '@core/application/session/usecase/StartSessionOnJoinUseCase';
import { StartSessionOnJoinService } from '@core/application/session/service/StartSessionOnJoinService';
import type { CompleteSessionOnFinishUseCase } from '@core/application/session/usecase/CompleteSessionOnFinishUseCase';
import { CompleteSessionOnFinishService } from '@core/application/session/service/CompleteSessionOnFinishService';
import { AutoCompleteSessionsService } from '@core/application/session/service/AutoCompleteSessionsService';
import type { AutoCompleteSessionsUseCase } from '@core/application/session/usecase/AutoCompleteSessionsUseCase';
import { GrpcSessionServiceController } from '@api/grpc/controller/GrpcSessionServiceController';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';

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
  options
    .bind<JoinSessionUseCase>(SessionDITokens.JoinSessionUseCase)
    .to(JoinSessionService);
  options
    .bind<StartSessionOnJoinUseCase>(SessionDITokens.StartSessionOnJoinUseCase)
    .to(StartSessionOnJoinService);
  options
    .bind<CompleteSessionOnFinishUseCase>(
      SessionDITokens.CompleteSessionOnFinishUseCase,
    )
    .to(CompleteSessionOnFinishService);
  options
    .bind<AutoCompleteSessionsUseCase>(
      SessionDITokens.AutoCompleteSessionsUseCase,
    )
    .to(AutoCompleteSessionsService);

  //Repository
  options
    .bind<SessionRepositoryPort>(SessionDITokens.SessionRepository)
    .to(MongooseSessionRepositoryAdapter);

  // http controller
  options
    .bind<SessionController>(SessionDITokens.SessionController)
    .to(SessionController);

  //grpc controller
  options
    .bind<GrpcSessionServiceController>(
      InfrastructureDITokens.GrpcSessionServiceController,
    )
    .to(GrpcSessionServiceController)
    .inSingletonScope();
});
