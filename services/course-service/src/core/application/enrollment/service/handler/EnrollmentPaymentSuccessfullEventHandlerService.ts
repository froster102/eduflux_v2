import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import { CourseNotFoundException } from '@core/application/enrollment/exception/CourseNotFoundException';
import { EnrollmentNotFoundException } from '@core/application/enrollment/exception/EnrollmentNotFoundException';
import type { EnrollmentPaymentSuccessfullEventHandler } from '@core/application/enrollment/handler/EnrollmentPaymentSuccessfullEventHandler';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { EventBusPort } from '@core/common/port/message/EventBustPort';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import type { EnrollmentCompletedEvent } from '@core/domain/enrollment/events/EnrollmentCompletedEvent';
import type { EnrollmentPaymentSuccessfullEvent } from '@core/domain/enrollment/events/EnrollmentPaymentSuccessfullEvent';
import { EnrollmentEvents } from '@core/domain/enrollment/events/enum/EnrollmentEvents';
import { inject } from 'inversify';

export class EnrollmentPaymentSuccessfullEventHandlerService
  implements EnrollmentPaymentSuccessfullEventHandler
{
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(CoreDITokens.EventBus)
    private readonly eventBus: EventBusPort,
  ) {}

  async handle(event: EnrollmentPaymentSuccessfullEvent): Promise<void> {
    const { enrollmentId, paymentId } = event;

    const enrollment = CoreAssert.notEmpty(
      await this.enrollmentRepository.findById(enrollmentId),
      new EnrollmentNotFoundException(
        `Enrollment with ID:${enrollmentId} not found`,
      ),
    );

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(enrollment.courseId),
      new CourseNotFoundException('Course not found.'),
    );

    enrollment.markAsCompleted(paymentId);

    await this.enrollmentRepository.update(enrollment.id, enrollment);
    await this.courseRepository.incrementCourseEnrollmentCount(course.id);

    const enrollmentCompletedEvent: EnrollmentCompletedEvent = {
      type: EnrollmentEvents.ENROLLMENT_COMPLETED,
      id: enrollment.id,
      courseId: enrollment.courseId,
      courseMetadata: {
        title: course.title,
        thumbnail: course.thumbnail!,
        description: course.description,
        averageRating: course.averageRating,
        instructor: course.instructor,
        enrollmentCount: course.enrollmentCount,
        level: course.level!,
      },
      enrollmentId: enrollment.id,
      instructorId: enrollment.instructorId,
      userId: enrollment.learnerId,
      enrolledAt: new Date().toISOString(),
      path: `/courses/${enrollment.courseId}`,
      timestamp: enrollment.updatedAt.toISOString(),
    };
    await this.eventBus.sendEvent(enrollmentCompletedEvent);
  }
}
