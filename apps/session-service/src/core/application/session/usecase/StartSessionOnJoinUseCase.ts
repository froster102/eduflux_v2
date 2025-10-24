import type { UseCase } from '@core/common/usecase/UseCase';

export interface StartSessionOnPort {
  sessionId: string;
  userId: string;
}

export interface StartSessionOnJoinUseCase
  extends UseCase<StartSessionOnPort, void> {}
