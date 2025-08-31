import { EnrollmentController } from '@api/http-rest/controller/EnrollmentController';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { CheckUserEnrollmentService } from '@core/application/enrollment/service/usecase/CheckUserEnrollmentService';
import { CompleteEnrollmentService } from '@core/application/enrollment/service/usecase/CompleteEnrollmentService';
import { CreateEnrollmentService } from '@core/application/enrollment/service/usecase/CreateEnrollmentService';
import { GetUserEnrollmentsService } from '@core/application/enrollment/service/usecase/GetUserEnrollmentsService';
import { VerifyChatAccessService } from '@core/application/enrollment/service/usecase/VerifyChatAccessService';
import type { CheckUserEnrollmentUseCase } from '@core/application/enrollment/usecase/CheckUserEnrollmentUseCase';
import type { CompleteEnrollmentUseCase } from '@core/application/enrollment/usecase/CompleteEnrollmentUseCase';
import type { CreateEnrollmentUseCase } from '@core/application/enrollment/usecase/CreateEnrollmentUseCase';
import type { GetUserEnrollmentsUseCase } from '@core/application/enrollment/usecase/GetUserEnrollmentsUseCase';
import type { VerifyChatAccessUseCase } from '@core/application/enrollment/usecase/VerifyChatAccessUseCase';
import { MongooseEnrollmentRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/enrollment/MongooseEnrollmentRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const EnrollmentModule = new ContainerModule((options) => {
  //Repository
  options
    .bind<EnrollmentRepositoryPort>(EnrollmentDITokens.EnrollmentRepository)
    .to(MongooseEnrollmentRepositoryAdapter);

  //Use-cases
  options
    .bind<CheckUserEnrollmentUseCase>(
      EnrollmentDITokens.CheckUserEnrollmentUseCase,
    )
    .to(CheckUserEnrollmentService);
  options
    .bind<CompleteEnrollmentUseCase>(
      EnrollmentDITokens.CompleteEnrollmentUseCase,
    )
    .to(CompleteEnrollmentService);
  options
    .bind<CreateEnrollmentUseCase>(EnrollmentDITokens.CreateEnrollmentUseCase)
    .to(CreateEnrollmentService);
  options
    .bind<GetUserEnrollmentsUseCase>(
      EnrollmentDITokens.GetUserEnrollmentsUseCase,
    )
    .to(GetUserEnrollmentsService);
  options
    .bind<VerifyChatAccessUseCase>(EnrollmentDITokens.VerifyChatAccessUseCase)
    .to(VerifyChatAccessService);

  //Controller
  options
    .bind<EnrollmentController>(EnrollmentDITokens.EnrollmentController)
    .to(EnrollmentController);
});
