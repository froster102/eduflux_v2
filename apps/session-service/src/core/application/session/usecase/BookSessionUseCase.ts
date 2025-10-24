import type { BookSessionPort } from '@core/application/session/port/usecase/BookSessionPort';
import type { BookSessionUseCaseResult } from '@core/application/session/usecase/types/BookSessionUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface BookSessionUseCase
  extends UseCase<BookSessionPort, BookSessionUseCaseResult> {}
