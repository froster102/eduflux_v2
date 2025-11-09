import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { BecomeInstructorPort } from '@application/user/port/usecase/BecomeInstructorPort';
import type { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';

export interface BecomeInstructorUseCase
  extends UseCase<BecomeInstructorPort, UserUseCaseDto> {}
