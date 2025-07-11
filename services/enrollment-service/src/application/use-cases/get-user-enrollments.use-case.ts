import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import { PaginationQueryParams } from '../dto/pagination.dto';
import { IUseCase } from './interface/use-case.interface';
import { EnrollmentDto } from '../dto/enrollment.dto';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';

export interface GetUserEnrollmentsInput {
  userId: string;
  pagination: PaginationQueryParams;
}

export interface GetUserEnrollmentsOutputDto {
  total: number;
  enrollments: EnrollmentDto[];
}

export class GetUserEnrollmentsUseCase
  implements IUseCase<GetUserEnrollmentsInput, GetUserEnrollmentsOutputDto>
{
  constructor(
    @inject(TYPES.EnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    getUserEnrollmentInput: GetUserEnrollmentsInput,
  ): Promise<GetUserEnrollmentsOutputDto> {
    const { userId, pagination } = getUserEnrollmentInput;

    const result = await this.enrollmentRepository.findUserEnrollments(
      userId,
      pagination,
    );

    return result;
  }
}
