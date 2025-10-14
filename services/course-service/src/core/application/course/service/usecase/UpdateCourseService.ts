import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { UpdateCoursePort } from '@core/application/course/port/usecase/UpdateCoursePort';
import type { UpdateCourseUseCase } from '@core/application/course/usecase/UpdateCourseUseCase';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import type { Course } from '@core/domain/course/entity/Course';
import { inject } from 'inversify';
import { CourseEvents } from '@core/common/events/enum/CourseEvents';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { EventBusPort } from '@core/common/port/message/EventBustPort';
import type { CourseUpdatedEvent } from '@core/domain/course/events/CourseUpdatedEvent';

export class UpdateCourseService implements UpdateCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(CoreDITokens.EventBus)
    private readonly eventBus: EventBusPort,
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

    await this.courseRepository.update(course.id, updates);

    await this.eventBus.sendEvent<CourseUpdatedEvent>({
      type: CourseEvents.COURSE_UPDATED,
      id: course.id,
      instructorId: course.instructor.id,
      courseMetadata: {
        title: course.title,
        thumbnail: course.thumbnail,
        level: course.level,
        status: course.status,
        enrollmentCount: course.enrollmentCount,
        averageRating: course.averageRating,
        description: course.description,
        id: course.id,
      },
      occurredAt: new Date().toISOString(),
    });
    return course;
  }
}
