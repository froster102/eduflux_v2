import type { IUnitOfWork } from '../ports/unit-of-work.interface';
import type { IUseCase } from './interface/use-case.interface';
import type { ISlotRepository } from '@/domain/repositories/slot.repository';
import type { IScheduleSettingRepository } from '@/domain/repositories/schedule-setting.repository';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { Role } from '@/shared/constants/role';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { Logger } from '@/shared/utils/logger';
import { SESSION_SERVICE } from '@/shared/constants/services';
import { v4 as uuidv4 } from 'uuid';
import { Slot } from '@/domain/entities/slot.entity';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { ScheduleSetting } from '@/domain/entities/schedule-setting.entity';
import { slotLimits } from '@/shared/config/slot-limits';

export interface DailyAvailabilityConfig {
  dayOfWeek: number;
  enabled: boolean;
  startTime?: string;
  endTime?: string;
}

export interface UpdateInstructorWeeklyAvailabilityInput {
  actor: AuthenticatedUserDto;
  weeklySchedule: DailyAvailabilityConfig[];
  applyForWeeks: number;
}

export class UpdateInstructorWeeklyAvailabilityUseCase
  implements IUseCase<UpdateInstructorWeeklyAvailabilityInput, void>
{
  private logger = new Logger(SESSION_SERVICE);

  constructor(
    @inject(TYPES.SlotRepository)
    private readonly slotRepository: ISlotRepository,
    @inject(TYPES.ScheduleSettingRepository)
    private readonly scheduleSettingRepository: IScheduleSettingRepository,
    @inject(TYPES.UnitOfWork) private readonly uow: IUnitOfWork,
  ) {}

  async execute(
    updateInstructorWeeklyAvailabilityInput: UpdateInstructorWeeklyAvailabilityInput,
  ): Promise<void> {
    const { weeklySchedule, applyForWeeks, actor } =
      updateInstructorWeeklyAvailabilityInput;
    const instructorId = actor.id;

    if (!actor.roles.includes(Role.INSTRUCTOR)) {
      throw new ForbiddenException('Instructor not found or unauthorized.');
    }

    // use is the slot duration divisible when using custom slot duration
    // if (
    //   slotDurationMinutes <= 0 ||
    //   (60 % slotDurationMinutes !== 0 && slotDurationMinutes % 60 !== 0)
    // ) {
    //   throw new Error(
    //     'Slot duration must be a positive number and divide evenly into an hour or be a multiple of an hour (e.g., 15, 30, 60, 90, 120 minutes).',
    //   );
    // }

    if (
      applyForWeeks < slotLimits.MIN_APPLY_WEEKS ||
      applyForWeeks > slotLimits.MAX_APPLY_WEEKS
    ) {
      throw new InvalidInputException(
        `Apply for weeks must be between ${slotLimits.MIN_APPLY_WEEKS} to ${slotLimits.MAX_APPLY_WEEKS}`,
        `Apply for weeks must be between ${slotLimits.MIN_APPLY_WEEKS} to ${slotLimits.MAX_APPLY_WEEKS}`,
      );
    }

    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    const endDate = new Date(today);
    endDate.setUTCDate(today.getUTCDate() + applyForWeeks * 7);

    this.logger.info(
      `Starting weekly availability update for instructor ${instructorId} from ${today.toISOString()} to ${endDate.toISOString()}`,
    );

    const allExistingBookedSlots =
      await this.slotRepository.findBookedByInstructorAndRange(
        instructorId,
        today,
        endDate,
      );

    allExistingBookedSlots.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    this.logger.info(
      `Fetched ${allExistingBookedSlots.length} existing BOOKED slots for instructor ${instructorId}.`,
    );

    const generatedSlots: Slot[] = [];
    let bookedSlotIndex = 0; // Pointer for the sorted allExistingBookedSlots

    for (let i = 0; i < applyForWeeks * 7; i++) {
      const currentDay = new Date(today);
      currentDay.setUTCDate(today.getUTCDate() + i);

      const dayOfWeek = currentDay.getUTCDay();

      const dailyConfig = weeklySchedule.find(
        (config) => config.dayOfWeek === dayOfWeek,
      );

      if (
        dailyConfig &&
        dailyConfig.enabled &&
        dailyConfig.startTime &&
        dailyConfig.endTime
      ) {
        let currentSlotStartTime = this.parseTimeToDate(
          currentDay,
          dailyConfig.startTime,
        );
        const dailyEndTime = this.parseTimeToDate(
          currentDay,
          dailyConfig.endTime,
        );

        while (currentSlotStartTime < dailyEndTime) {
          //Currently added a 60 minutes (1hour) duration
          const currentSlotEndTime = new Date(
            currentSlotStartTime.getTime() + 60 * 60 * 1000,
          );

          if (currentSlotEndTime <= dailyEndTime) {
            let hasOverlapWithBooked = false;

            // Advance bookedSlotIndex past booked slots that have definitely ended before currentSlotStartTime
            while (
              bookedSlotIndex < allExistingBookedSlots.length &&
              allExistingBookedSlots[bookedSlotIndex].endTime <=
                currentSlotStartTime
            ) {
              bookedSlotIndex++;
            }

            // Check for overlap from current bookedSlotIndex onwards
            for (
              let j = bookedSlotIndex;
              j < allExistingBookedSlots.length;
              j++
            ) {
              const bookedSlot = allExistingBookedSlots[j];

              // If the bookedSlot starts after our currentSlotEndTime, no more overlaps for this currentSlot
              // (because allExistingBookedSlots is sorted by startTime)
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
            } else {
              this.logger.info(
                `Skipping generation of slot ${currentSlotStartTime.toISOString()} - ${currentSlotEndTime.toISOString()} due to existing booking.`,
              );
            }
          }
          currentSlotStartTime = currentSlotEndTime;
        }
      }
    }

    this.logger.info(`Generated ${generatedSlots.length} new available slots.`);

    await this.uow.runTransaction(async (trx) => {
      await trx.slotRepository.deleteAvailableOrBlockedByInstructorAndRange(
        instructorId,
        today,
        endDate,
      );

      this.logger.info(
        `Deleted existing AVAILABLE/BLOCKED slots for instructor ${instructorId} in the range.`,
      );
      let savedSlotsCount = 0;
      if (generatedSlots.length > 0) {
        const savedResult = await trx.slotRepository.saveMany(generatedSlots);
        savedSlotsCount = savedResult.length || generatedSlots.length;
        this.logger.info(`Successfully saved ${savedSlotsCount} new slots.`);
      } else {
        this.logger.info('No new slots generated to save.');
      }

      const scheduleSetting = ScheduleSetting.create(
        instructorId,
        weeklySchedule,
        60,
        applyForWeeks,
      );

      const foundUserScheduleSetting =
        await trx.scheduleSettingRepository.findByUserId(instructorId);

      if (foundUserScheduleSetting) {
        await trx.scheduleSettingRepository.update(
          foundUserScheduleSetting.id,
          scheduleSetting,
        );
      } else {
        await trx.scheduleSettingRepository.save(scheduleSetting);
      }

      this.logger.info('Update instructors schedule setting.');
    });

    // Produce event if needed to notify the user
    // if (savedSlotsCount > 0) {
    // }
  }

  private parseTimeToDate(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setUTCHours(hours, minutes, 0, 0);
    return newDate;
  }
}
