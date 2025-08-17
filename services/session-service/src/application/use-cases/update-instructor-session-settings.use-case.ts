import { inject } from 'inversify';
import type {
  IUpdateInstructorSessionSettingsUseCase,
  UpdateInstructorSessionSettingsInput,
} from './interface/update-instuctor-session-settings.interface';
import { TYPES } from '@/shared/di/types';
import type { ISessionSettingsRepository } from '@/domain/repositories/session-settings.repository';
import { NotFoundException } from '../exceptions/not-found.exception';
import type { ILogger } from '@/shared/common/interface/logger.interface';
import type { ISlotRepository } from '@/domain/repositories/slot.repository';
import { SlotGenerationService } from '@/domain/services/slot-generation.service';
import type { IUnitOfWork } from '../ports/unit-of-work.interface';
import type { SessionSettingsDto } from '../dto/session-settings.dto';

export class UpdateInstructorSessionSettingsUseCase
  implements IUpdateInstructorSessionSettingsUseCase
{
  constructor(
    @inject(TYPES.Logger)
    private readonly logger: ILogger,
    @inject(TYPES.SessionSettingsRepository)
    private readonly sessionSettingsRepository: ISessionSettingsRepository,
    @inject(TYPES.SlotRepository)
    private readonly slotRepository: ISlotRepository,
    @inject(TYPES.UnitOfWork) private readonly uow: IUnitOfWork,
  ) {
    this.logger = logger.fromContext(
      UpdateInstructorSessionSettingsUseCase.name,
    );
  }

  async execute(
    updateInstructorSessionSettingsInput: UpdateInstructorSessionSettingsInput,
  ): Promise<void> {
    const { executorId } = updateInstructorSessionSettingsInput;

    const foundSessionSettings =
      await this.sessionSettingsRepository.findByUserId(executorId);

    if (!foundSessionSettings) {
      throw new NotFoundException('Session settings not found.');
    }

    const previousSessionSettings: SessionSettingsDto = {
      applyForWeeks: foundSessionSettings.applyForWeeks,
      price: foundSessionSettings.price,
      currency: foundSessionSettings.currency,
      duration: foundSessionSettings.duration,
      weeklySchedules: foundSessionSettings.weeklySchedules,
      timeZone: foundSessionSettings.timeZone,
      createdAt: foundSessionSettings.createdAt,
      updatedAt: foundSessionSettings.updatedAt,
    };

    foundSessionSettings.update(updateInstructorSessionSettingsInput);

    console.log(previousSessionSettings.weeklySchedules);
    console.log(foundSessionSettings.weeklySchedules);

    const isWeeklyTemplateUpdated =
      JSON.stringify(foundSessionSettings.weeklySchedules) !==
      JSON.stringify(previousSessionSettings.weeklySchedules);

    const isSlotDurationUpdated =
      foundSessionSettings.duration !== previousSessionSettings.duration;

    const isApplyForWeekendUpdated =
      foundSessionSettings.applyForWeeks !==
      previousSessionSettings.applyForWeeks;

    const isTimeZoneUpdated =
      foundSessionSettings.timeZone !== previousSessionSettings.timeZone;

    const shouldRegenrateSlots =
      isWeeklyTemplateUpdated ||
      isSlotDurationUpdated ||
      isApplyForWeekendUpdated ||
      isTimeZoneUpdated;

    console.log(isWeeklyTemplateUpdated);

    if (shouldRegenrateSlots) {
      this.logger.info(
        'Weeklyschedule, timezone, apply for weeks or slot duration has been changed,.. regenerating slots.',
      );

      const now = new Date();
      const today = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );
      const endDate = new Date(today);
      endDate.setUTCDate(
        today.getUTCDate() + foundSessionSettings.applyForWeeks * 7,
      );

      const bookedSlots =
        await this.slotRepository.findBookedByInstructorAndRange(
          executorId,
          today,
          endDate,
        );

      this.logger.info(
        `Fetched ${bookedSlots.length} existing BOOKED slots for instructor ${executorId}.`,
      );

      const generatedSlots = SlotGenerationService.generateSlots(
        foundSessionSettings,
        bookedSlots,
      );

      this.logger.info(
        `Generated ${generatedSlots.length} new available slots.`,
      );

      await this.uow.runTransaction(async (trx) => {
        await trx.slotRepository.deleteAvailableOrBlockedByInstructorAndRange(
          executorId,
          today,
          endDate,
        );

        this.logger.info(
          `Deleted existing AVAILABLE/BLOCKED slots for instructor ${executorId} in the range.`,
        );

        let savedSlotsCount = 0;
        if (generatedSlots.length > 0) {
          const savedResult = await trx.slotRepository.saveMany(generatedSlots);
          savedSlotsCount = savedResult.length || generatedSlots.length;
          this.logger.info(`Successfully saved ${savedSlotsCount} new slots.`);
        } else {
          this.logger.info('No new slots generated to save.');
        }

        await trx.sessionSettingsRepository.update(
          executorId,
          foundSessionSettings,
        );

        this.logger.info("Updated instructor's session settings.");
      });
    }
  }
}
