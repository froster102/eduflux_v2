import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { UpdateInstructorSessionSettingsPort } from '@core/application/session-settings/port/usecase/UpdateInstructorSessionSettingsPort';
import type { UpdateInstructorSessionSettingsUseCase } from '@core/application/session-settings/usecase/UpdateInstructorSessionSettingsUseCase';
import { SlotDITokens } from '@core/application/slot/di/SlotDITokens';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { UnitOfWork } from '@core/common/unit-of-work/UnitOfWork';
import { SlotGenerationService } from '@core/domain/service/SlotGenerationService';
import { inject } from 'inversify';

export class UpdateInstructorSessionSettingsService
  implements UpdateInstructorSessionSettingsUseCase
{
  constructor(
    @inject(CoreDITokens.Logger)
    private readonly logger: LoggerPort,
    @inject(SessionSettingsDITokens.SessionSettingsRepository)
    private readonly sessionSettingsRepository: SessionSettingsRepositoryPort,
    @inject(SlotDITokens.SlotRepository)
    private readonly slotRepository: SlotRepositoryPort,
    @inject(CoreDITokens.UnitOfWork) private readonly uow: UnitOfWork,
  ) {
    this.logger = logger.fromContext(
      UpdateInstructorSessionSettingsService.name,
    );
  }

  async execute(payload: UpdateInstructorSessionSettingsPort): Promise<void> {
    const { executorId } = payload;

    const foundSessionSettings =
      await this.sessionSettingsRepository.findByUserId(executorId);

    if (!foundSessionSettings) {
      throw new NotFoundException('Session settings not found.');
    }

    const previousSessionSettings = {
      applyForWeeks: foundSessionSettings.applyForWeeks,
      price: foundSessionSettings.price,
      currency: foundSessionSettings.currency,
      duration: foundSessionSettings.duration,
      weeklySchedules: foundSessionSettings.weeklySchedules,
      timeZone: foundSessionSettings.timeZone,
      createdAt: foundSessionSettings.createdAt,
      updatedAt: foundSessionSettings.updatedAt,
    };

    foundSessionSettings.update(payload);

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
