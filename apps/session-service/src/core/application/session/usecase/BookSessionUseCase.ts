import type { BookSessionPort } from '@core/application/session/port/usecase/BookSessionPort';
import type { SessionUseCaseDto } from '@core/application/session/usecase/dto/SessionUseCaseDto';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface BookSessionUseCase
  extends UseCase<BookSessionPort, SessionUseCaseDto> {}
