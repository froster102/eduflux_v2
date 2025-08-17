import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import type { IUseCase } from './use-case.interface';
import type { SessionSettingsDto } from '@/application/dto/session-settings.dto';

export interface GetInstructorSessionSettingsInput {
  actor: AuthenticatedUserDto;
}

export interface GetInstructorSessionSettingsOutput {
  settings: SessionSettingsDto | null;
}

export interface IGetInstructorSessionSettingsUseCase
  extends IUseCase<
    GetInstructorSessionSettingsInput,
    GetInstructorSessionSettingsOutput
  > {}
