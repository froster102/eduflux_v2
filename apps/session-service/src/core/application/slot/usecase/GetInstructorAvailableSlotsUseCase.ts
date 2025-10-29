import type { GetInstructorAvailableSlotsPort } from '@core/application/slot/port/usecase/GetInstructorAvailableSlotsPort';
import type { SlotUseCaseDto } from '@core/application/slot/usecase/dto/SlotUseCaseDto';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetInstructorAvailableSlotsUseCase
  extends UseCase<GetInstructorAvailableSlotsPort, SlotUseCaseDto[]> {}
