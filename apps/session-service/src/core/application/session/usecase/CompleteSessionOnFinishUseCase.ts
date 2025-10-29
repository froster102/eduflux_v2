import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface CompleteSessionOnFinishPort {
  sessionId: string;
}

export interface CompleteSessionOnFinishUseCase
  extends UseCase<CompleteSessionOnFinishPort, void> {}
