import { ProgressController } from 'src/api/http/controller/ProgressController';
import { ProgressDITokens } from '@core/application/progress/di/ProgressDITokens';
import type { ProgressRepositoryPort } from '@core/application/progress/port/persistence/ProgressRepositoryPort';
import type { AddToProgressUseCase } from '@core/application/progress/usecase/AddToProgressUseCase';
import type { CreateProgressUseCase } from '@core/application/progress/usecase/CreateProgressUseCase';
import type { GetProgressUseCase } from '@core/application/progress/usecase/GetProgressUseCase';
import type { RemoveFromProgressUseCase } from '@core/application/progress/usecase/RemoveFromProgressUseCase';
import { AddToProgressService } from '@core/application/progress/service/usecase/AddToProgressService';
import { CreateProgressService } from '@core/application/progress/service/usecase/CreateProgressService';
import { GetProgressService } from '@core/application/progress/service/usecase/GetProgressUseCase';
import { RemoveFromProgressService } from '@core/application/progress/service/usecase/RemoveFromProgressService';
import { MongooseProgressRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/progress/MongooseProgressRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const ProgressModule: ContainerModule = new ContainerModule(
  (options) => {
    options
      .bind<AddToProgressUseCase>(ProgressDITokens.AddToProgressUseCase)
      .to(AddToProgressService);
    options
      .bind<CreateProgressUseCase>(ProgressDITokens.CreateProgressUseCase)
      .to(CreateProgressService);
    options
      .bind<GetProgressUseCase>(ProgressDITokens.GetProgressUseCase)
      .to(GetProgressService);
    options
      .bind<RemoveFromProgressUseCase>(
        ProgressDITokens.RemoveFromProgressUseCase,
      )
      .to(RemoveFromProgressService);
    options
      .bind<ProgressRepositoryPort>(ProgressDITokens.ProgressRepository)
      .to(MongooseProgressRepositoryAdapter);
    options
      .bind<ProgressController>(ProgressDITokens.ProgressController)
      .to(ProgressController);
  },
);
