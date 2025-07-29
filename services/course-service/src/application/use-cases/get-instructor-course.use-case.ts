import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type {
  GetInstructorCourseInput,
  IGetInstructorCourseUseCase,
} from './interface/get-instructor-course.interface';
import { inject, injectable } from 'inversify';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

@injectable()
export class GetInstructorCourseUseCase implements IGetInstructorCourseUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    getInstructorCourseInput: GetInstructorCourseInput,
  ): Promise<Course> {
    const { id, actor } = getInstructorCourseInput;
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course with ID:${id} not found.`);
    }

    if (course.status === 'published') {
      return course;
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(`You are not allowed to view this course.`);
    }

    return course;
  }
}
