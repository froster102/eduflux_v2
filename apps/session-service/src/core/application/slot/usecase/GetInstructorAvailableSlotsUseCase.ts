import type { GetInstructorAvailableSlotsPort } from '@core/application/slot/port/usecase/GetInstructorAvailableSlotsPort';
import type { SlotUseCaseDto } from '@core/application/slot/usecase/dto/SlotUseCaseDto';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetInstructorAvailableSlotsUseCase
  extends UseCase<GetInstructorAvailableSlotsPort, SlotUseCaseDto[]> {}
