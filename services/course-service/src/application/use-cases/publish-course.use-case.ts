import { Course } from '@/domain/entity/course.entity';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface PublishCourseInput {
  courseId: string;
  actor: AuthenticatedUserDto;
}

@injectable()
export class PublishCourseUseCase
  implements IUseCase<PublishCourseInput, Course>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(publishCourseInput: PublishCourseInput): Promise<Course> {
    const { courseId, actor } = publishCourseInput;

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with id: ${courseId} not found`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to publish this course.',
      );
    }

    foundCourse.publish();

    await this.courseRepository.update(courseId, foundCourse);

    return foundCourse;
  }
}
