import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Course } from '@/domain/entity/course.entity';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import {
  IUpdateCourseUseCase,
  UpdateCourseInput,
} from './interface/update-course.interface';

@injectable()
export class UpdateCourseUseCase implements IUpdateCourseUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(updateCourseInput: UpdateCourseInput): Promise<Course> {
    const {
      courseId,
      categoryId,
      description,
      isFree,
      level,
      price,
      thumbnail,
      title,
      actor,
    } = updateCourseInput;

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to update this course.',
      );
    }

    foundCourse.updateDetails({
      title: title ?? foundCourse.title,
      description: description ?? foundCourse.description,
      thumbnail: thumbnail ?? foundCourse.thumbnail,
      level: level ?? foundCourse.level,
      categoryId: categoryId ?? foundCourse.categoryId,
      isFree: isFree ?? foundCourse.isFree,
      price: price ?? foundCourse.price,
    });

    const updatedCourse = await this.courseRepository.update(
      courseId,
      foundCourse,
    );

    return updatedCourse as Course;
  }
}
