import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import type {
  CheckEnrollmentOutput,
  CheckUserEnrollmentInput,
  ICheckUserEnrollmentUseCase,
} from './interface/check-user-enrollment.inerface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';

export class CheckUserEnrollmentUseCase implements ICheckUserEnrollmentUseCase {
  constructor(
    @inject(TYPES.EnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    checkUserEnrollmentInput: CheckUserEnrollmentInput,
  ): Promise<CheckEnrollmentOutput> {
    const { userId, courseId } = checkUserEnrollmentInput;
    const enrollment =
      await this.enrollmentRepository.findUserEnrollmentForCourse(
        userId,
        courseId,
      );

    if (!enrollment) {
      return { isEnrolled: false };
    }

    if (enrollment.status === 'COMPLETED') {
      return { isEnrolled: true };
    }

    return { isEnrolled: false };
  }
}
