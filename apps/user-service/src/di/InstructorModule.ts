import { GetInstructorsService } from '@core/application/instructor/service/usecase/GetInstructorsService';
import { ContainerModule } from 'inversify';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';
import { InstructorDITokens } from '@core/application/instructor/di/InstructorDITokens';
import { MongooseInstructorRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/instructor/MongooseInstructorRepositoryAdapter';
import { GetInstructorService } from '@core/application/instructor/service/usecase/GetInstructorService';
import type { GetInstructorsUseCase } from '@core/application/instructor/usecase/GetInstructorsUseCase';
import type { GetInstructorUseCase } from '@core/application/instructor/usecase/GetInstructorUseCase';

export const InstructorModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetInstructorsUseCase>(InstructorDITokens.GetInstructorsUseCase)
      .to(GetInstructorsService);
    options
      .bind<GetInstructorUseCase>(InstructorDITokens.GetInstructorUseCase)
      .to(GetInstructorService);

    options
      .bind<InstructorRepositoryPort>(InstructorDITokens.InstructorRepository)
      .to(MongooseInstructorRepositoryAdapter);
  },
);
