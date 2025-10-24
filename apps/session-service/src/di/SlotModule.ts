import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import { GetInstructorAvailableSlotsService } from '@core/application/slot/service/GetInstructorAvailableSlotsService';
import type { GetInstructorAvailableSlotsUseCase } from '@core/application/slot/usecase/GetInstructorAvailableSlotsUseCase';
import { MongooseSlotRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/slot/MongooseSlotRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const SlotModule: ContainerModule = new ContainerModule((options) => {
  //Use-case
  options
    .bind<GetInstructorAvailableSlotsUseCase>(
      SlotDITokens.GetInstructorAvailableSlotsUseCase,
    )
    .to(GetInstructorAvailableSlotsService);

  //Repository
  options
    .bind<SlotRepositoryPort>(SlotDITokens.SlotRepository)
    .to(MongooseSlotRepositoryAdapter);
});
