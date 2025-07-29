import type { IMessageBrokerGatway } from '../ports/message-broker.gateway';
import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import type {
  CompleteEnrollmentInput,
  ICompleteEnrollmentUseCase,
} from './interface/complete-enrollment.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ENROLLMENTS_TOPIC } from '@/shared/constants/topics';

export class CompleteEnrollmentUseCase implements ICompleteEnrollmentUseCase {
  constructor(
    @inject(TYPES.EnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
    @inject(TYPES.MessageBrokerGateway)
    private readonly messageBrokerGateway: IMessageBrokerGatway,
  ) {}

  async execute(
    completeEnrollmentInput: CompleteEnrollmentInput,
  ): Promise<void> {
    const { enrollmentId, paymentId } = completeEnrollmentInput;
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
