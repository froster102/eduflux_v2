import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';

export interface CheckUserEnrollmentDto {
  userId: string;
  courseId: string;
}

export interface CheckEnrollmentOutputDto {
  isEnrolled: boolean;
}

export class CheckUserEnrollmentUseCase
  implements IUseCase<CheckUserEnrollmentDto, CheckEnrollmentOutputDto>
{
  constructor(
    @inject(TYPES.EnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(
    checkUserEnrollmentDto: CheckUserEnrollmentDto,
  ): Promise<CheckEnrollmentOutputDto> {
    const { userId, courseId } = checkUserEnrollmentDto;
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
