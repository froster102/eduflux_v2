import type { EnableSessionPort } from '@core/application/session-settings/port/usecase/EnableSessionPort';

export interface UpdateInstructorSessionSettingsPort
  extends Partial<EnableSessionPort> {
  executorId: string;
}
