import { inject } from 'inversify';
import type {
  EnableSessionInput,
  IEnableSessionsUseCase,
} from './interface/enable-sessions.interface';
import { TYPES } from '@/shared/di/types';
import type { IUserServiceGateway } from '../ports/user-service.gateway';
import { NotFoundException } from '../exceptions/not-found.exception';
import { SessionSettings } from '@/domain/entities/session-settings.entity';
import type { IUnitOfWork } from '../ports/unit-of-work.interface';
import { SlotGenerationService } from '@/domain/services/slot-generation.service';

export class EnableSessionUseCase implements IEnableSessionsUseCase {
  constructor(
    @inject(TYPES.UserServiceGateway)
    private readonly userServiceGateway: IUserServiceGateway,
    @inject(TYPES.UnitOfWork) private readonly uow: IUnitOfWork,
  ) {}

  async execute(enableSessionInput: EnableSessionInput): Promise<void> {
    const { executorId, applyForWeeks, price, timeZone, weeklySchedules } =
      enableSessionInput;

    const user = await this.userServiceGateway.getUserDetails(executorId);

    if (!user) {
      throw new NotFoundException(`User with ID:${executorId} not found.`);
    }

    const sessionSettings = SessionSettings.create(
      executorId,
      true,
      price,
      'USD',
      60, // Currently given a default 60 minutes duration
      weeklySchedules,
      applyForWeeks,
      timeZone,
    );

    const generatedSlots = SlotGenerationService.generateSlots(
      sessionSettings,
      [],
    );

    await this.uow.runTransaction(async (trx) => {
      await trx.slotRepository.saveMany(generatedSlots);
      await trx.sessionSettingsRepository.save(sessionSettings);
    });

    return;
  }
}
