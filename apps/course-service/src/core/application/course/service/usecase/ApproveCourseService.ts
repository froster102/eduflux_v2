import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { ApproveCoursePort } from '@core/application/course/port/usecase/ApproveCoursePort';
import type { ApproveCourseUseCase } from '@core/application/course/usecase/ApproveCourseUseCase';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { Course } from '@core/domain/course/entity/Course';
import { inject } from 'inversify';

export class ApproveCourseService implements ApproveCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(payload: ApproveCoursePort): Promise<Course> {
    const { courseId, actor } = payload;

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found`);
    }

    const isAuthorized = actor.hasRole(Role.ADMIN);

    if (!isAuthorized) {
      throw new ForbiddenException(
        'You are not authorized to approve this course',
      );
    }

    foundCourse.approve();

    await this.courseRepository.update(courseId, foundCourse);

    return foundCourse;
  }
}
