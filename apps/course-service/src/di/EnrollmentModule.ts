import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { CreateEnrollmentSubsciberService } from '@core/application/enrollment/service/subscriber/CreateEnrollmentSubscriberService';
import { GetEnrollmentService } from '@core/application/enrollment/service/usecase/GetEnrollmentService';
import { VerifyChatAccessService } from '@core/application/enrollment/service/usecase/VerifyChatAccessService';
import type { CreateEnrollmentSubscriber } from '@core/application/enrollment/subscriber/CreateEnrollmentSubscriber';
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
    .bind<VerifyChatAccessUseCase>(EnrollmentDITokens.VerifyChatAccessUseCase)
    .to(VerifyChatAccessService);
  options
    .bind<GetEnrollmentUseCase>(EnrollmentDITokens.GetEnrollmentUseCase)
    .to(GetEnrollmentService);

  //Subscriber
  options
    .bind<CreateEnrollmentSubscriber>(
      EnrollmentDITokens.CreateEnrollmentSubsciber,
    )
    .to(CreateEnrollmentSubsciberService);
});
