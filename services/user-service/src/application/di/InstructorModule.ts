import type { GetInstructorsUseCase } from '@core/domain/instructor/usecase/GetInstructorsUseCase';
import { GetInstructorsService } from '@core/service/instructor/GetInstructorsService';
import { ContainerModule } from 'inversify';
import type { InstructorRepositoryPort } from '@core/domain/instructor/port/persistence/InstructorRepositoryPort';
import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';
import { MongooseInstructorRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/instructor/MongooseInstructorRepositoryAdapter';

export const InstructorModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetInstructorsUseCase>(InstructorDITokens.GetInstructorsUseCase)
      .to(GetInstructorsService);

    options
      .bind<InstructorRepositoryPort>(InstructorDITokens.InstructorRepository)
      .to(MongooseInstructorRepositoryAdapter);
  },
);
