import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { GetProgressPort } from '@application/progress/port/usecase/GetProgressPort';
import type { ProgressDto } from '@application/progress/usecase/dto/ProgressUseCaseDto';

export interface GetProgressUseCase
  extends UseCase<GetProgressPort, ProgressDto> {}
