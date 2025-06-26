import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { inject, injectable } from 'inversify';
import { IUseCase } from './interface/use-case.interface';
import { Course } from '@/domain/entity/course.entity';
import { TYPES } from '@/shared/di/types';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export interface GetInstructorCourseInput {
  id: string;
  actor: AuthenticatedUserDto;
}

@injectable()
export class GetInstructorCourseUseCase
  implements IUseCase<GetInstructorCourseInput, Course>
{
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

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(`You are not allowed to view this course.`);
    }

    return course;
  }
}
