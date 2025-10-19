import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { GetInstructorSessionSettingsPort } from '@core/application/session-settings/port/usecase/GetInstructorSessionSettingsPort';
import { SessionSettingsUseCaseDto } from '@core/application/session-settings/usecase/dto/SessionSettingsUseCaseDto';
import type { GetInstructorSessionSettingsUseCase } from '@core/application/session-settings/usecase/GetInstructorSessionSettingsUseCase';
import type { GetInstructorSessionSettingsUseCaseResult } from '@core/application/session-settings/usecase/type/GetInstructorSessionSettingsUseCaseResult';
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
    const { instructorId } = payload;

    const sessionSettings =
      await this.sessionSessionSettingsRepository.findByUserId(instructorId);

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
