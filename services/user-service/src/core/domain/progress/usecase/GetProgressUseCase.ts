import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetProgressPort } from '@core/domain/progress/port/usecase/GetProgressPort';
import type { ProgressDto } from '@core/domain/user/usecase/dto/ProgressDto';

export interface GetProgressUseCase
  extends UseCase<GetProgressPort, ProgressDto> {}
