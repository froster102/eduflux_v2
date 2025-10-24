import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { BookSessionService } from '@core/application/session/service/usecase/BookSessionService';
import type { BookSessionUseCase } from '@core/application/session/usecase/BookSessionUseCase';
import { MongooseSessionRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/session/MongooseSessionRepositoryAdapter';
import { ContainerModule } from 'inversify';
import { SessionController } from '@api/http/controller/SessionController';
import type { HandleExpiredPendingPaymentsUseCase } from '@core/application/session/usecase/HandleExpiredPendingPaymentsUseCase';
import { HandleExpiredPendingPaymentsService } from '@core/application/session/service/usecase/HandleExpiredPendingPaymentsService';
import type { JoinSessionUseCase } from '@core/application/session/usecase/JoinSessionUseCase';
import { JoinSessionService } from '@core/application/session/service/usecase/JoinSessionService';
import type { StartSessionOnJoinUseCase } from '@core/application/session/usecase/StartSessionOnJoinUseCase';
import { StartSessionOnJoinService } from '@core/application/session/service/usecase/StartSessionOnJoinService';
import type { CompleteSessionOnFinishUseCase } from '@core/application/session/usecase/CompleteSessionOnFinishUseCase';
import { CompleteSessionOnFinishService } from '@core/application/session/service/usecase/CompleteSessionOnFinishService';
import { AutoCompleteSessionsService } from '@core/application/session/service/usecase/AutoCompleteSessionsService';
import type { AutoCompleteSessionsUseCase } from '@core/application/session/usecase/AutoCompleteSessionsUseCase';
import { GrpcSessionServiceController } from '@api/grpc/controller/GrpcSessionServiceController';
import { InfrastructureDITokens } from '@infrastructure/di/InfrastructureDITokens';
import { SessionPaymentSuccessfullEventHandlerService } from '@core/application/session/service/handler/SessionPaymentSuccessfullEventHandlerService';
import type { SessionPaymentSuccessfullEventHandler } from '@core/application/session/handler/SessionPaymentSucessfullEventHandler';
import { GetSessionService } from '@core/application/session/service/usecase/GetSessionService';
import type { GetSessionUseCase } from '@core/application/session/usecase/GetSessionUseCase';

export const SessionModule: ContainerModule = new ContainerModule((options) => {
  //Use-case
  options
    .bind<BookSessionUseCase>(SessionDITokens.BookSessionUseCase)
    .to(BookSessionService);
  options
    .bind<GetSessionUseCase>(SessionDITokens.GetSessionUseCase)
    .to(GetSessionService);
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

  //Handlers
  options
    .bind<SessionPaymentSuccessfullEventHandler>(
      SessionDITokens.SessionPaymentSuccessfullEventHandler,
    )
    .to(SessionPaymentSuccessfullEventHandlerService);

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
