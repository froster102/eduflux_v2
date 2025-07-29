import { EnrollmentDto } from '@/application/dto/enrollment.dto';
import { IUseCase } from './use-case.interface';
import { PaginationQueryParams } from '@/application/dto/pagination.dto';

export interface GetUserEnrollmentsInput {
  userId: string;
  pagination: PaginationQueryParams;
}

export interface GetUserEnrollmentsOutput {
  total: number;
  enrollments: EnrollmentDto[];
}

export interface IGetUserEnrollmentsUseCase
  extends IUseCase<GetUserEnrollmentsInput, GetUserEnrollmentsOutput> {}
