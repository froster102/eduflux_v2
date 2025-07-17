import type { IMessageBrokerGatway } from '../ports/message-broker.gateway';
import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import { inject } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ENROLLMENTS_TOPIC } from '@/shared/constants/topics';

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
    @inject(TYPES.MessageBrokerGateway)
    private readonly messageBrokerGateway: IMessageBrokerGatway,
  ) {}

  async execute(completeEnrollmentDto: CompleteEnrollmentDto): Promise<void> {
    const { enrollmentId, paymentId } = completeEnrollmentDto;
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID:${enrollmentId} not found`,
      );
    }

    enrollment.markAsCompleted(paymentId);

    await this.enrollmentRepository.update(enrollment.id, enrollment);
    await this.messageBrokerGateway.publish(ENROLLMENTS_TOPIC, {
      type: 'enrollment.success',
      correlationId: '',
      data: {
        courseId: enrollment.courseId,
        enrollmentId: enrollment.id,
        occuredAt: enrollment.updatedAt.toISOString(),
        userId: enrollment.userId,
      },
    });
  }
}
