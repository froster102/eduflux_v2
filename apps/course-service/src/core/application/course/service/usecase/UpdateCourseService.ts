import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { UpdateCoursePort } from '@core/application/course/port/usecase/UpdateCoursePort';
import type { UpdateCourseUseCase } from '@core/application/course/usecase/UpdateCourseUseCase';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import type { Course } from '@core/domain/course/entity/Course';
import { inject } from 'inversify';
import { CourseUpdatedEvent } from '@eduflux-v2/shared/events/course/CourseUpdatedEvent';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class UpdateCourseService implements UpdateCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async execute(payload: UpdateCoursePort): Promise<Course> {
    const { courseId, updates, actor } = payload;

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found.`),
    );

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        `You are not authorized to update this course.`,
      );
    }

    course.updateDetails(updates);

    await this.courseRepository.update(course.id, course);

    const courseUpdatedEvent = new CourseUpdatedEvent(course.id, {
      id: course.id,
      instructorId: course.instructor.id,
      courseId: course.id,
      title: course.title,
      thumbnail: course.thumbnail,
      level: course.level,
      status: course.status,
      enrollmentCount: course.enrollmentCount,
      averageRating: course.averageRating,
      description: course.description,
    });
    await this.messageBroker.publish(courseUpdatedEvent);
    return course;
  }
}
