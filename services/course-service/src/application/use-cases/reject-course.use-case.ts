import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type {
  IRejectCourseUseCase,
  RejectCourseInput,
} from './interface/reject-course.interface';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { inject, injectable } from 'inversify';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Course } from '@/domain/entity/course.entity';

@injectable()
export class RejectCourseUseCase implements IRejectCourseUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(rejectCourseInput: RejectCourseInput): Promise<Course> {
    const { courseId, feedback, actor } = rejectCourseInput;
    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    const isAuthorized = actor.hasRole('ADMIN');

    if (!isAuthorized) {
      throw new ForbiddenException('You are not authorized for this action.');
    }

    foundCourse.reject(feedback);

    await this.courseRepository.update(foundCourse.id, foundCourse);

    return foundCourse;
  }
}
