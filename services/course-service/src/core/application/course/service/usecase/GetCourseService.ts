import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { GetCoursePort } from '@core/application/course/port/usecase/GetCoursePort';
import type { GetCourseUseCase } from '@core/application/course/usecase/GetCourseUseCase';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import type { Course } from '@core/domain/course/entity/Course';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { inject } from 'inversify';

export class GetCourseService implements GetCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(payload: GetCoursePort): Promise<Course> {
    const { courseId, actor } = payload;

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found.`),
    );

    if (
      actor &&
      actor.hasRole(Role.INSTRUCTOR) &&
      actor.id === course.instructor.id
    ) {
      return course;
    }

    if (actor && actor.hasRole(Role.ADMIN)) {
      return course;
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      console.log(course.instructor.id, actor?.id);
      throw new ForbiddenException(`You are not authorized for this action.`);
    }

    return course;
  }
}
