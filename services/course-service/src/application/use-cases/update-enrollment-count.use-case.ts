import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IUpdateEnrollmentCountUseCase } from './interface/update-enrollment-count.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export class UpdateEnrollmentCountUseCase
  implements IUpdateEnrollmentCountUseCase
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(courseId: string): Promise<void> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    await this.courseRepository.incrementCourseEnrollmentCount(courseId);
  }
}
