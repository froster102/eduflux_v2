import type { GetInstructorsUseCaseResult } from '@core/application/instructor/usecase/types/GetInstructorsUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetInstructorsPort } from '@core/domain/user/port/usecase/GetInstructorsPort';

export interface GetInstructorsUseCase
  extends UseCase<GetInstructorsPort, GetInstructorsUseCaseResult> {}
