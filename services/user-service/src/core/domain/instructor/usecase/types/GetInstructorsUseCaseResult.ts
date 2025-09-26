import type { InstructorDto } from '@core/domain/instructor/usecase/dto/InstructorDto';

export type GetInstructorsUseCaseResult = {
  instructors: InstructorDto[];
  totalCount: number;
};
