import type { InstructorUserCaseDto } from '@application/instructor/usecase/dto/InstructorUseCaseDto';
import type { GetInstructorPort } from '@application/instructor/usecase/types/GetInstructorPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetInstructorUseCase
  extends UseCase<GetInstructorPort, InstructorUserCaseDto> {}
