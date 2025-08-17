import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { Role } from '@/shared/constants/role';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import type {
  GetInstructorSessionSettingsInput,
  GetInstructorSessionSettingsOutput,
  IGetInstructorSessionSettingsUseCase,
} from './interface/get-instructor-session-settings.interface';
import type { ISessionSettingsRepository } from '@/domain/repositories/session-settings.repository';

export class GetInstructorSessionSettingsUseCase
  implements IGetInstructorSessionSettingsUseCase
{
  constructor(
    @inject(TYPES.SessionSettingsRepository)
    private readonly sessionSessionSettingsRepository: ISessionSettingsRepository,
  ) {}

  async execute(
    getInstructorScheduleTemplateInput: GetInstructorSessionSettingsInput,
  ): Promise<GetInstructorSessionSettingsOutput> {
    const { actor } = getInstructorScheduleTemplateInput;

    if (!actor.hasRole(Role.INSTRUCTOR)) {
      throw new ForbiddenException(`User with ${actor.id} not authorized`);
    }

    const sessionSettings =
      await this.sessionSessionSettingsRepository.findByUserId(actor.id);

    if (sessionSettings) {
      return {
        settings: {
          price: sessionSettings.price,
          currency: sessionSettings.currency,
          duration: sessionSettings.duration,
          applyForWeeks: sessionSettings.applyForWeeks,
          weeklySchedules: sessionSettings.weeklySchedules,
          timeZone: sessionSettings.timeZone,
          createdAt: sessionSettings.createdAt,
          updatedAt: sessionSettings.updatedAt,
        },
      };
    }

    return {
      settings: null,
    };
  }
}
