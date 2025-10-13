import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { UpdateCoursePort } from '@core/application/course/port/usecase/UpdateCoursePort';
import type { UpdateCourseUseCase } from '@core/application/course/usecase/UpdateCourseUseCase';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import type { Course } from '@core/domain/course/entity/Course';
import { inject } from 'inversify';

export class UpdateCourseService implements UpdateCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
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
    const updatedCourse = await this.courseRepository.save(course);

    return updatedCourse;
  }
}
