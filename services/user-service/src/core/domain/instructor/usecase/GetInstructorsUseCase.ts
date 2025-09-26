import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetInstructorsUseCaseResult } from '@core/domain/instructor/usecase/types/GetInstructorsUseCaseResult';
import type { GetInstructorsPort } from '@core/domain/user/port/usecase/GetInstructorsPort';

export interface GetInstructorsUseCase
  extends UseCase<GetInstructorsPort, GetInstructorsUseCaseResult> {}
