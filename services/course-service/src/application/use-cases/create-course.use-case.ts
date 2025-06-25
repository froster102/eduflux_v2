import type { IUserServiceGateway } from '../ports/user-service.gateway';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Course } from '@/domain/entity/course.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Role } from '@/shared/constants/roles';
import { ConflictException } from '../exceptions/conflict.exception';

@injectable()
export class CreateCourseUseCase {
  constructor(
    @inject(TYPES.UserServiceGateway)
    private readonly userServiceGateway: IUserServiceGateway,
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(
    createCourseDto: CreateCourseDto,
    actor: AuthenticatedUserDto,
  ): Promise<Course> {
    const isAuthorized = actor.hasRole(Role.INSTRUCTOR);
    if (!isAuthorized) {
      throw new ForbiddenException(
        `You are not authorized to create a course.`,
      );
    }
    const instructor = await this.userServiceGateway.getUserDetails(actor.id);

    if (!instructor) {
      throw new NotFoundException(`Instructor with ID:${actor.id} not found`);
    }

    const existingCourse = await this.courseRepository.findCourseByTitle(
      createCourseDto.title,
    );

    if (existingCourse) {
      throw new ConflictException(
        `Course with title ${createCourseDto.title} already exists.`,
      );
    }

    const course = Course.create({
      title: createCourseDto.title,
      instructor: {
        id: instructor.id,
        name: instructor.name,
      },
    );
    });

    const savedCourse = await this.courseRepository.save(course);

    return savedCourse;
  }
}
