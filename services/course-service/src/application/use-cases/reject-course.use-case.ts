import { NotFoundException } from '@/application/exceptions/not-found.exception';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Course } from '@/domain/entity/course.entity';
import { RejectCourseDto } from '../dto/reject-course.dto';

@injectable()
export class RejectCourseUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    rejectCourseDto: RejectCourseDto,
    actor: AuthenticatedUserDto,
  ): Promise<Course> {
    const { courseId, feedback } = rejectCourseDto;
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
