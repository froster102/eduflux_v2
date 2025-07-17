import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IUseCase } from './interface/use-case.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export class UpdateEnrollmentCountUseCase implements IUseCase<string, void> {
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
