import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '@/domain/entity/course.entity';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';

@injectable()
export class UpdateCourseUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    updateCourseDto: UpdateCourseDto,
    actor: AuthenticatedUserDto,
  ): Promise<Course> {
    const foundCourse = await this.courseRepository.findById(
      updateCourseDto.courseId,
    );

    if (!foundCourse) {
      throw new NotFoundException(
        `Course with ID:${updateCourseDto.courseId} not found`,
      );
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to update this course.',
      );
    }

    foundCourse.updateDetails(
      updateCourseDto.title ?? foundCourse.title,
      updateCourseDto.description ?? foundCourse.description,
      updateCourseDto.thumbnail ?? foundCourse.thumbnail,
      updateCourseDto.level ?? foundCourse.level,
    );

    const updatedCourse = await this.courseRepository.update(
      updateCourseDto.courseId,
      foundCourse,
    );

    return updatedCourse as Course;
  }
}
