import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type {
  ApproveCourseInput,
  IApproveCourseUseCase,
} from './interface/approve-course.interface';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export class ApproveCourseUseCase implements IApproveCourseUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(approveCourseInput: ApproveCourseInput): Promise<Course> {
    const { courseId, actor } = approveCourseInput;

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found`);
    }

    const isAuthorized = actor.hasRole('ADMIN');

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
