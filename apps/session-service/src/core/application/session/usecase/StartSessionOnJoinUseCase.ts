import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface StartSessionOnPort {
  sessionId: string;
  userId: string;
}

export interface StartSessionOnJoinUseCase
  extends UseCase<StartSessionOnPort, void> {}
