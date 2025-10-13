import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import type { CreateCoursePort } from '@core/application/course/port/usecase/CreateCoursePort';
import type { CreateCourseUseCase } from '@core/application/course/usecase/CreateCourseUseCase';
import { Course } from '@core/domain/course/entity/Course';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { inject } from 'inversify';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';

export class CreateCourseService implements CreateCourseUseCase {
  constructor(
    @inject(CourseDITokens.UserServiceGateway)
    private readonly userServiceGateway: UserServiceGatewayPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(CourseDITokens.CategoryRepository)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async execute(payload: CreateCoursePort): Promise<Course> {
    const { categoryId, title, actor } = payload;
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

    const category = CoreAssert.notEmpty(
      await this.categoryRepository.findById(categoryId),
      new NotFoundException(`Category with ID:${categoryId} not found.`),
    );

    // currently not checking for duplicate title

    // const existingCourse = await this.courseRepository.findCourseByTitle(
    //   createCourseDto.title,
    // );

    // if (existingCourse) {
    //   throw new ConflictException(
    //     `Course with title ${createCourseDto.title} already exists.`,
    //   );
    // }

    const course = Course.create({
      title,
      instructor: {
        id: instructor.id,
        name: instructor.firstName + ' ' + instructor.lastName,
      },
      categoryId: category.id,
    });

    const savedCourse = await this.courseRepository.save(course);

    return savedCourse;
  }
}
