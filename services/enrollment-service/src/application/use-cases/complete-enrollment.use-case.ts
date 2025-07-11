import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export interface CompleteEnrollmentDto {
  enrollmentId: string;
  paymentId: string;
}

export class CompleteEnrollmentUseCase
  implements IUseCase<CompleteEnrollmentDto, void>
{
  constructor(
    @inject(TYPES.EnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async execute(completeEnrollmentDto: CompleteEnrollmentDto): Promise<void> {
    const { enrollmentId, paymentId } = completeEnrollmentDto;
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);

    if (!enrollment) {
      throw new NotFoundException(`Enrollment not found`);
    }

    enrollment.markAsCompleted(paymentId);

    await this.enrollmentRepository.update(enrollment.id, enrollment);
  }
}
