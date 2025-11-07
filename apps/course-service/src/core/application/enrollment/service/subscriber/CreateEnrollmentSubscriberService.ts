import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type { CreateEnrollmentSubscriber } from '@core/application/enrollment/subscriber/CreateEnrollmentSubscriber';
import { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import { EnrollmentStatus } from '@eduflux-v2/shared/constants/EnrollmentStatus';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { CreateEnrollmentEvent } from '@eduflux-v2/shared/events/course/CreateEnrollmentEvent';
import { EnrollmentCreatedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCreatedEvent';
import type { EventClass } from '@eduflux-v2/shared/events/Event';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { inject } from 'inversify';

export class CreateEnrollmentSubsciberService
  implements CreateEnrollmentSubscriber
{
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}
  subscribedTo(): Array<EventClass> {
    return [CreateEnrollmentEvent];
  }

  async on(event: CreateEnrollmentEvent): Promise<void> {
    const {
      payerId: learnerId,
      itemId: courseId,
      recieverId: instructorId,
    } = event.payload;
    const existingEnrollment =
      await this.enrollmentRepository.findUserEnrollmentForCourse(
        learnerId,
        courseId,
      );
    if (existingEnrollment) {
      return;
    }
    const enrollment = Enrollment.new({
      id: crypto.randomUUID().toString(),
      courseId,
      learnerId,
      instructorId,
      status: EnrollmentStatus.COMPLETED,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.enrollmentRepository.save(enrollment);

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      return;
    }
    await this.courseRepository.incrementCourseEnrollmentCount(course.id);

    //emit events to create views
    const enrollmentCreateEvent = new EnrollmentCreatedEvent(enrollment.id, {
      courseId: enrollment.courseId,
      title: course.title,
      thumbnail: course.thumbnail!,
      description: course.description,
      averageRating: course.averageRating,
      instructor: course.instructor,
      level: course.level!,
      enrollmentId: enrollment.id,
      instructorId: enrollment.instructorId,
      userId: enrollment.learnerId,
      enrolledAt: new Date().toISOString(),
      path: `/courses/${enrollment.courseId}`,
    });
    await this.messageBroker.publish(enrollmentCreateEvent);
  }
}
