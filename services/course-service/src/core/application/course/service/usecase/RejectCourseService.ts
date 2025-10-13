import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { RejectCoursePort } from '@core/application/course/port/usecase/RejectCoursePort';
import type { RejectCourseUseCase } from '@core/application/course/usecase/RejectCourseUseCase';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { Course } from '@core/domain/course/entity/Course';
import { inject } from 'inversify';

export class RejectCourseService implements RejectCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(payload: RejectCoursePort): Promise<Course> {
    const { courseId, feedback, actor } = payload;
    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    const isAuthorized = actor.hasRole(Role.ADMIN);

    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized for this action.');
    }

    foundCourse.reject(feedback);

    await this.courseRepository.update(foundCourse.id, foundCourse);

    return foundCourse;
  }
}
