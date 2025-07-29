import type { ISlotRepository } from '@/domain/repositories/slot.repository';
import type {
  GetInstructorAvailableSlotsInput,
  GetInstructorAvailableSlotsOutput,
  IGetInstructorAvailableSlotsUseCase,
} from './interface/get-instructor-available-slots.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { SlotStatus } from '@/domain/entities/slot.entity';
import { tryCatchSync } from '@/shared/utils/try-catch';
import { getUtcRangeForLocalDay } from '@/shared/utils/date';

export class GetInstructorAvailableSlotsUseCase
  implements IGetInstructorAvailableSlotsUseCase
{
  constructor(
    @inject(TYPES.SlotRepository)
    private readonly slotRepository: ISlotRepository,
  ) {}

  async execute(
    getInstructorAvailableSlotsInput: GetInstructorAvailableSlotsInput,
  ): Promise<GetInstructorAvailableSlotsOutput[]> {
    const { instructorId, date, timeZone } = getInstructorAvailableSlotsInput;
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
        'INVALID_LOCAL_DATE_OR_TIMEZONE_CONVERSION',
      );
    }

    const availableSlots = await this.slotRepository.findByInstructorId(
      instructorId,
      data.startUtc,
      data.endUtc,
    );

    const outputSlots: GetInstructorAvailableSlotsOutput[] = [];
    for (const slot of availableSlots) {
      if (slot.status === SlotStatus.AVAILABLE) {
        // const durationMinutes =
        //   (slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60);
        // if (durationMinutes <= 0) {
        //   continue;
        // }

        outputSlots.push({
          id: slot.id,
          instructorId: slot.instructorId,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }
    }

    return outputSlots;
  }
}
