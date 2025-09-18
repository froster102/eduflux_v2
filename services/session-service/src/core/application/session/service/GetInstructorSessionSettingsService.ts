import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { GetInstructorSessionSettingsPort } from '@core/application/session-settings/port/usecase/GetInstructorSessionSettingsPort';
import { SessionSettingsUseCaseDto } from '@core/application/session-settings/usecase/dto/SessionSettingsUseCaseDto';
import type { GetInstructorSessionSettingsUseCase } from '@core/application/session-settings/usecase/GetInstructorSessionSettingsUseCase';
import type { GetInstructorSessionSettingsUseCaseResult } from '@core/application/session-settings/usecase/type/GetInstructorSessionSettingsUseCaseResult';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { inject } from 'inversify';

export class GetInstructorSessionSettingsService
  implements GetInstructorSessionSettingsUseCase
{
  constructor(
    @inject(SessionSettingsDITokens.SessionSettingsRepository)
    private readonly sessionSessionSettingsRepository: SessionSettingsRepositoryPort,
  ) {}

  async execute(
    payload: GetInstructorSessionSettingsPort,
  ): Promise<GetInstructorSessionSettingsUseCaseResult> {
    const { actor } = payload;

    if (!actor.hasRole(Role.INSTRUCTOR)) {
      throw new ForbiddenException();
    }

    const sessionSettings =
      await this.sessionSessionSettingsRepository.findByUserId(actor.id);

    if (sessionSettings) {
      return {
        settings: SessionSettingsUseCaseDto.fromEntity(sessionSettings),
      };
    }

    return {
      settings: null,
    };
  }
}
