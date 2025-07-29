import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import type {
  GetUserEnrollmentsInput,
  GetUserEnrollmentsOutput,
  IGetUserEnrollmentsUseCase,
} from './interface/get-user-enrollments.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';

export class GetUserEnrollmentsUseCase implements IGetUserEnrollmentsUseCase {
  constructor(
    @inject(TYPES.EnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    getUserEnrollmentInput: GetUserEnrollmentsInput,
  ): Promise<GetUserEnrollmentsOutput> {
    const { userId, pagination } = getUserEnrollmentInput;

    const result = await this.enrollmentRepository.findUserEnrollments(
      userId,
      pagination,
    );

    return result;
  }
}
