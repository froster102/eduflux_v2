import type { SessionSettings } from '@core/domain/session-settings/entity/SessionSettings';
import { Slot } from '@core/domain/slot/entity/Slot';
import { convertLoacalTimeAndDateToUtc } from '@shared/utils/date';
import { v4 as uuidv4 } from 'uuid';

export class SlotGenerationService {
  public static generateSlots(
    sessionSettings: SessionSettings,
    bookedSlots: Slot[],
  ): Slot[] {
    const { weeklySchedules, applyForWeeks, instructorId, timeZone } =
      sessionSettings;
    // use is the slot duration divisible when using custom slot duration
    // if (
    //   slotDurationMinutes <= 0 ||
    //   (60 % slotDurationMinutes !== 0 && slotDurationMinutes % 60 !== 0)
    // ) {
    //   throw new Error(
    //     'Slot duration must be a positive number and divide evenly into an hour or be a multiple of an hour (e.g., 15, 30, 60, 90, 120 minutes).',
    //   );
    // }

    // if (
    //   applyForWeeks < slotLimits.MIN_APPLY_WEEKS ||
    //   applyForWeeks > slotLimits.MAX_APPLY_WEEKS
    // ) {
    //   throw new InvalidInputException(
    //     `Apply for weeks must be between ${slotLimits.MIN_APPLY_WEEKS} to ${slotLimits.MAX_APPLY_WEEKS}`,
    //     `Apply for weeks must be between ${slotLimits.MIN_APPLY_WEEKS} to ${slotLimits.MAX_APPLY_WEEKS}`,
    //   );
    // }

    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const endDate = new Date(today);
    endDate.setUTCDate(today.getUTCDate() + applyForWeeks * 7);

    // this.logger.info(
    //   `Starting weekly availability update for instructor ${instructorId} from ${today.toISOString()} to ${endDate.toISOString()}`,
    // );

    // const bookedSlots =
    //   await this.slotRepository.findBookedByInstructorAndRange(
    //     instructorId,
    //     today,
    //     endDate,
    //   );

    bookedSlots.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // this.logger.info(
    //   `Fetched ${bookedSlots.length} existing BOOKED slots for instructor ${instructorId}.`,
    // );

    const generatedSlots: Slot[] = [];
    let bookedSlotIndex = 0; // Pointer for the sorted bookedSlots

    for (let i = 0; i < applyForWeeks * 7; i++) {
      const currentDay = new Date(today);
      currentDay.setUTCDate(today.getUTCDate() + i);

      const dayOfWeek = currentDay.getUTCDay();

      const dailyConfig = weeklySchedules.find(
        (config) => config.dayOfWeek === dayOfWeek,
      );

      if (
        dailyConfig &&
        dailyConfig.enabled &&
        dailyConfig.startTime &&
        dailyConfig.endTime
      ) {
        let currentSlotStartTime = convertLoacalTimeAndDateToUtc(
          currentDay,
          dailyConfig.startTime,
          timeZone,
        );
        const dailyEndTime = convertLoacalTimeAndDateToUtc(
          currentDay,
          dailyConfig.endTime,
          timeZone,
        );

        if (dailyEndTime <= currentSlotStartTime) {
          dailyEndTime.setUTCDate(dailyEndTime.getUTCDate() + 1);
        }

        while (currentSlotStartTime < dailyEndTime) {
          //Currently added a 60 minutes (1hour) duration
          const currentSlotEndTime = new Date(
            currentSlotStartTime.getTime() + 60 * 60 * 1000,
          );

          if (currentSlotEndTime <= dailyEndTime) {
            let hasOverlapWithBooked = false;

            // Advance bookedSlotIndex past booked slots that have definitely ended before currentSlotStartTime
            while (
              bookedSlotIndex < bookedSlots.length &&
              bookedSlots[bookedSlotIndex].endTime <= currentSlotStartTime
            ) {
              bookedSlotIndex++;
            }

            // Check for overlap from current bookedSlotIndex onwards
            for (let j = bookedSlotIndex; j < bookedSlots.length; j++) {
              const bookedSlot = bookedSlots[j];

              // If the bookedSlot starts after our currentSlotEndTime, no more overlaps for this currentSlot
              // (because bookedSlots is sorted by startTime)
              if (bookedSlot.startTime >= currentSlotEndTime) {
                break;
              }

              // Check for actual overlap: [start1, end1) overlaps with [start2, end2) if start1 < end2 AND end1 > start2
              if (
                currentSlotStartTime < bookedSlot.endTime &&
                currentSlotEndTime > bookedSlot.startTime
              ) {
                hasOverlapWithBooked = true;
                break; // Found an overlap, no need to check further for this generated slot
              }
            }

            if (!hasOverlapWithBooked) {
              // No overlap with existing booked slots, create new available slot
              const newSlot = Slot.create({
                id: uuidv4(),
                instructorId,
                startTime: currentSlotStartTime,
                endTime: currentSlotEndTime,
              });
              generatedSlots.push(newSlot);
            }
          }
          currentSlotStartTime = currentSlotEndTime;
        }
      }
    }
    return generatedSlots;
  }
}
