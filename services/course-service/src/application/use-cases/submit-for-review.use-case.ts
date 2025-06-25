import { Course } from '@/domain/entity/course.entity';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface SubmitForReviewInput {
  courseId: string;
  actor: AuthenticatedUserDto;
}

@injectable()
export class SubmitForReviewUseCase
  implements IUseCase<SubmitForReviewInput, Course>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(submitForReviewInput: SubmitForReviewInput): Promise<Course> {
    const { courseId, actor } = submitForReviewInput;

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with id: ${courseId} not found`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'Your are not authorized for "submission of this course.',
      );
    }

    foundCourse.submitForReview();

    await this.courseRepository.update(courseId, foundCourse);

    return foundCourse;
  }
}
