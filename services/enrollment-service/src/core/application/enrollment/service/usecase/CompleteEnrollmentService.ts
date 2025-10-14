import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import { EnrollmentEvents } from '@core/domain/enrollment/events/enum/EnrollmentEvents';
import { EnrollmentNotFoundException } from '@core/application/enrollment/exception/EnrollmentNotFoundException';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type { CompleteEnrollmentPort } from '@core/application/enrollment/port/usecase/CompleteEnrollmentPort';
import type { CompleteEnrollmentUseCase } from '@core/application/enrollment/usecase/CompleteEnrollmentUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import { inject } from 'inversify';
import type { EnrollmentSuccessEvent } from '@core/domain/enrollment/events/EnrollmentSuccessEvent';
import type { CourseServicePort } from '@core/application/enrollment/port/gateway/CourseServicePort';

export class CompleteEnrollmentService implements CompleteEnrollmentUseCase {
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
    @inject(CoreDITokens.EventBus)
    private readonly eventBus: EventBusPort,
    @inject(EnrollmentDITokens.CourseService)
    private readonly courseService: CourseServicePort,
  ) {}

  async execute(payload: CompleteEnrollmentPort): Promise<void> {
    const { enrollmentId, paymentId } = payload;
    const enrollment = await this.enrollmentRepository.findById(enrollmentId);

    if (!enrollment) {
      throw new EnrollmentNotFoundException(
        `Enrollment with ID:${enrollmentId} not found`,
      );
    }

    enrollment.markAsCompleted(paymentId);

    const course = await this.courseService.getCourse(enrollment.courseId);

    await this.enrollmentRepository.update(enrollment.id, enrollment);
    const enrollmentSuccessEvent: EnrollmentSuccessEvent = {
      type: EnrollmentEvents.ENROLLMENT_SUCESS,
      id: enrollment.id,
      courseId: enrollment.courseId,
      courseMetadata: {
        title: course.title,
        thumbnail: course.thumbnail,
        description: course.description,
        averageRating: course.averageRating,
        instructor: course.instructor,
        enrollmentCount: course.enrollmentCount,
        level: course.level,
      },
      enrollmentId: enrollment.id,
      instructorId: enrollment.instructorId,
      occuredAt: enrollment.updatedAt.toISOString(),
      userId: enrollment.userId,
      enrolledAt: new Date().toISOString(),
      path: `/courses/${enrollment.courseId}`,
    };
    await this.eventBus.sendEvent(enrollmentSuccessEvent);
  }
}
