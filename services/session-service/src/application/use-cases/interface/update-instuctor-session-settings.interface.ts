import type { EnableSessionInput } from './enable-sessions.interface';
import type { IUseCase } from './use-case.interface';

export interface UpdateInstructorSessionSettingsInput
  extends Partial<EnableSessionInput> {
  executorId: string;
}

export interface IUpdateInstructorSessionSettingsUseCase
  extends IUseCase<UpdateInstructorSessionSettingsInput, void> {}
