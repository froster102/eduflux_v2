import type { SessionUseCaseDto } from '@core/application/session/usecase/dto/SessionUseCaseDto';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetSessionPort {
  sessionId: string;
}

export interface GetSessionUseCase
  extends UseCase<GetSessionPort, SessionUseCaseDto> {}
