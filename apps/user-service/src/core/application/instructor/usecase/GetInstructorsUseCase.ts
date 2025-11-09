import type { GetInstructorsUseCaseResult } from '@application/instructor/usecase/types/GetInstructorsUseCaseResult';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { GetInstructorsPort } from '@application/user/port/usecase/GetInstructorsPort';

export interface GetInstructorsUseCase
  extends UseCase<GetInstructorsPort, GetInstructorsUseCaseResult> {}
