import type { EnableSessionPort } from '@core/application/session-settings/port/usecase/EnableSessionPort';
import type { EnableSessionsUseCase } from '@core/application/session-settings/usecase/EnableSessionsUseCase';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { UnitOfWork } from '@core/common/port/persistence/UnitOfWorkPort';
import { SlotGenerationService } from '@core/domain/service/SlotGenerationService';
import { SessionSettings } from '@core/domain/session-settings/entity/SessionSettings';
import { SessionSettingsUpdateEvent } from '@eduflux-v2/shared/events/session/SessionSettingsUpdateEvent';
import { inject } from 'inversify';
import { v4 as uuidV4 } from 'uuid';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { BadRequestException } from '@eduflux-v2/shared/exceptions/BadRequestException';
import { Role } from '@eduflux-v2/shared/constants/Role';

export class EnableSessionService implements EnableSessionsUseCase {
  constructor(
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(SharedCoreDITokens.UnitOfWork)
    private readonly uow: UnitOfWork,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async execute(payload: EnableSessionPort): Promise<void> {
    const { executorId, applyForWeeks, price, timeZone, weeklySchedules } =
      payload;

    const user = await this.userService.getUser(executorId);

    if (!user) {
      throw new NotFoundException(`User with ID:${executorId} not found.`);
    }

    if (!user.roles.includes(Role.INSTRUCTOR)) {
      throw new BadRequestException(
        'User is not an instructor.Please become an instructor first.',
      );
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

      const sessionSettingsUpdateEvent = new SessionSettingsUpdateEvent(
        sessionSettings.id,
        {
          instructorId: sessionSettings.instructorId,
          price: sessionSettings.price,
          currency: sessionSettings.currency,
          duration: sessionSettings.duration,
          timeZone: sessionSettings.timeZone,
          isSchedulingEnabled: true,
        },
      );

      await this.messageBroker.publish(sessionSettingsUpdateEvent);
    });

    return;
  }
}
