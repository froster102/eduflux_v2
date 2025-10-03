import type { UseCase } from '@core/common/usecase/UseCase';

export interface CompleteSessionOnFinishPort {
  sessionId: string;
}

export interface CompleteSessionOnFinishUseCase
  extends UseCase<CompleteSessionOnFinishPort, void> {}
