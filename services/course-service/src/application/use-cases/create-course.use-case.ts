import type { IUserServiceGateway } from '../ports/user-service.gateway';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ICategoryRepository } from '@/domain/repositories/category.repository';
import type {
  CreateCourseInput,
  ICreateCourseUseCase,
} from './interface/create-course.interface';
import { Course } from '@/domain/entity/course.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Role } from '@/shared/constants/roles';

@injectable()
export class CreateCourseUseCase implements ICreateCourseUseCase {
  constructor(
    @inject(TYPES.UserServiceGateway)
    private readonly userServiceGateway: IUserServiceGateway,
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(createCourseInput: CreateCourseInput): Promise<Course> {
    const { categoryId, title, actor } = createCourseInput;

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

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException(`Category with ID:${categoryId} not found.`);
    }

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
