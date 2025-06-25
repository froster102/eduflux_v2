import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { Course } from '@/domain/entity/course.entity';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface UpdateCourseInput {
  updateCourseDto: UpdateCourseDto;
  actor: AuthenticatedUserDto;
}

@injectable()
export class UpdateCourseUseCase
  implements IUseCase<UpdateCourseInput, Course>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(updateCourseInput: UpdateCourseInput): Promise<Course> {
    const { updateCourseDto, actor } = updateCourseInput;

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

    foundCourse.updateDetails({
      title: updateCourseDto.title ?? foundCourse.title,
      description: updateCourseDto.description ?? foundCourse.description,
      thumbnail: updateCourseDto.thumbnail ?? foundCourse.thumbnail,
      level: updateCourseDto.level ?? foundCourse.level,
      categoryId: updateCourseDto.categoryId ?? foundCourse.categoryId,
      isFree: updateCourseDto.isFree ?? foundCourse.isFree,
      price: updateCourseDto.price ?? foundCourse.price,
    });

    const updatedCourse = await this.courseRepository.update(
      updateCourseDto.courseId,
      foundCourse,
    );

    return updatedCourse as Course;
  }
}
