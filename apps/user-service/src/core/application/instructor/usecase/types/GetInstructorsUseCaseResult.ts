import type { InstructorUserCaseDto } from '@application/instructor/usecase/dto/InstructorUseCaseDto';

export type GetInstructorsUseCaseResult = {
  instructors: InstructorUserCaseDto[];
  totalCount: number;
};
