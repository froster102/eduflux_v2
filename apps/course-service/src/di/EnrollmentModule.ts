import { EnrollmentController } from '@api/http/controller/EnrollmentController';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentPaymentSuccessfullEventSubscriber } from '@core/application/enrollment/subscriber/EnrollmentPaymentSuccessfullEventSubscriber';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { CreateEnrollmentService } from '@core/application/enrollment/service/usecase/CreateEnrollmentService';
import { GetEnrollmentService } from '@core/application/enrollment/service/usecase/GetEnrollmentService';
import { VerifyChatAccessService } from '@core/application/enrollment/service/usecase/VerifyChatAccessService';
import type { CreateEnrollmentUseCase } from '@core/application/enrollment/usecase/CreateEnrollmentUseCase';
import type { GetEnrollmentUseCase } from '@core/application/enrollment/usecase/GetEnrollmentUseCase';
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
    .bind<CreateEnrollmentUseCase>(EnrollmentDITokens.CreateEnrollmentUseCase)
    .to(CreateEnrollmentService);
  options
    .bind<VerifyChatAccessUseCase>(EnrollmentDITokens.VerifyChatAccessUseCase)
    .to(VerifyChatAccessService);
  options
    .bind<GetEnrollmentUseCase>(EnrollmentDITokens.GetEnrollmentUseCase)
    .to(GetEnrollmentService);

  //Subscriber

  //Controller
  options
    .bind<EnrollmentController>(EnrollmentDITokens.EnrollmentController)
    .to(EnrollmentController);
});
