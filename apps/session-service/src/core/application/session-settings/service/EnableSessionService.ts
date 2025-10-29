import type { EnableSessionPort } from '@core/application/session-settings/port/usecase/EnableSessionPort';
import type { EnableSessionsUseCase } from '@core/application/session-settings/usecase/EnableSessionsUseCase';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import type { UnitOfWork } from '@core/common/port/persistence/UnitOfWorkPort';
import { SlotGenerationService } from '@core/domain/service/SlotGenerationService';
import { SessionSettings } from '@core/domain/session-settings/entity/SessionSettings';
import { SessionSettingsEvents } from '@core/domain/session-settings/events/enum/SessionSettingsEvents';
import type { SessionSettingsUpdateEvent } from '@core/domain/session-settings/events/SessionSettingsUpdateEvent';
import { inject } from 'inversify';
import { v4 as uuidV4 } from 'uuid';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';

export class EnableSessionService implements EnableSessionsUseCase {
  constructor(
    @inject(CoreDITokens.UserService)
    private readonly userServiceGateway: UserServicePort,
    @inject(CoreDITokens.UnitOfWork) private readonly uow: UnitOfWork,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {}

  async execute(payload: EnableSessionPort): Promise<void> {
    const { executorId, applyForWeeks, price, timeZone, weeklySchedules } =
      payload;

    const user = await this.userServiceGateway.getUser(executorId);

    if (!user) {
      throw new NotFoundException(`User with ID:${executorId} not found.`);
    }

    const sessionSettings = SessionSettings.create({
      id: uuidV4(),
      isSessionEnabled: true,
      instructorId: executorId,
      price,
      currency: 'USD',
      duration: 60, // Currently given a default 60 minutes duration
      template: weeklySchedules,
      applyForWeeks,
      timeZone: timeZone,
    });

    const generatedSlots = SlotGenerationService.generateSlots(
      sessionSettings,
      [],
    );

    await this.uow.runTransaction(async (trx) => {
      await trx.slotRepository.saveMany(generatedSlots);
      await trx.sessionSettingsRepository.save(sessionSettings);

      const sessionSettingsUpdateEvent: SessionSettingsUpdateEvent = {
        type: SessionSettingsEvents.SESSION_SETTINGS_UPDATED,
        currency: sessionSettings.currency,
        duration: sessionSettings.duration,
        instructorId: sessionSettings.instructorId,
        isSchedulingEnabled: true,
        price: sessionSettings.price,
        timeZone: sessionSettings.timeZone,
        id: sessionSettings.id,
        timestamp: new Date().toISOString(),
      };

      await this.eventBus.sendEvent({
        ...sessionSettingsUpdateEvent,
        id: sessionSettings.id,
      });
    });

    return;
  }
}
