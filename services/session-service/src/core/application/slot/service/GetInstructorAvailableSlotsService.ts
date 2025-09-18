import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import type { GetInstructorAvailableSlotsPort } from '@core/application/slot/port/usecase/GetInstructorAvailableSlotsPort';
import { SlotUseCaseDto } from '@core/application/slot/usecase/dto/SlotUseCaseDto';
import type { GetInstructorAvailableSlotsUseCase } from '@core/application/slot/usecase/GetInstructorAvailableSlotsUseCase';
import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { getUtcRangeForLocalDay } from '@shared/utils/date';
import { tryCatchSync } from '@shared/utils/try-catch';
import { inject } from 'inversify';

export class GetInstructorAvailableSlotsService
  implements GetInstructorAvailableSlotsUseCase
{
  constructor(
    @inject(SlotDITokens.SlotRepository)
    private readonly slotRepository: SlotRepositoryPort,
  ) {}

  async execute(
    payload: GetInstructorAvailableSlotsPort,
  ): Promise<SlotUseCaseDto[]> {
    const { instructorId, date, timeZone } = payload;
    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      throw new InvalidInputException(
        'Invalid date format. Please use YYYY-MM-DD.',
      );
    }

    const { data, error } = tryCatchSync(() =>
      getUtcRangeForLocalDay(date, timeZone),
    );

    if (error) {
      throw new InvalidInputException(
        `Failed to determine UTC date range for provided local date and timezone. ${error.message}`,
      );
    }

    const availableSlots = await this.slotRepository.findByInstructorId(
      instructorId,
      data.startUtc,
      data.endUtc,
    );

    return SlotUseCaseDto.fromEntities(availableSlots);
  }
}
