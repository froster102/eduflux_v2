import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CategoryRepositoryPort } from '@core/application/course/port/persistence/CategoryRepositoryPort';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';
import type { CreateCoursePort } from '@core/application/course/port/usecase/CreateCoursePort';
import type { CreateCourseUseCase } from '@core/application/course/usecase/CreateCourseUseCase';
import { Course } from '@core/domain/course/entity/Course';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { inject } from 'inversify';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { slugify } from '@shared/utils/slugify';
import { CourseCreatedEvent } from '@eduflux-v2/shared/events/course/CourseCreatedEvent';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class CreateCourseService implements CreateCourseUseCase {
  constructor(
    @inject(CourseDITokens.UserServiceGateway)
    private readonly userServiceGateway: UserServiceGatewayPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(CourseDITokens.CategoryRepository)
    private readonly categoryRepository: CategoryRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async execute(payload: CreateCoursePort): Promise<Course> {
    const { categoryId, title, actor } = payload;
    const isAuthorized = actor.hasRole(Role.INSTRUCTOR);
    if (!isAuthorized) {
      throw new ForbiddenException(
        `You are not authorized to create a course.`,
      );
    }

    const instructor = await this.userServiceGateway.getUser(actor.id);

    if (!instructor) {
      throw new NotFoundException(`Instructor with ID:${actor.id} not found`);
    }

    const category = CoreAssert.notEmpty(
      await this.categoryRepository.findById(categoryId),
      new NotFoundException(`Category with ID:${categoryId} not found.`),
    );

    const baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await this.courseRepository.existsBySlug(finalSlug)) {
      counter++;
      finalSlug = `${baseSlug}-${counter}`;
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
      slug: finalSlug,
      instructor: {
        id: instructor.id,
        name: instructor.firstName + ' ' + instructor.lastName,
      },
      categoryId: category.id,
    });

    const savedCourse = await this.courseRepository.save(course);
    const courseCreatedEvent = new CourseCreatedEvent(savedCourse.id, {
      instructorId: savedCourse.instructor.id,
      id: savedCourse.id,
      title: savedCourse.title,
      thumbnail: savedCourse.thumbnail,
      level: savedCourse.level,
      status: savedCourse.status,
      enrollmentCount: savedCourse.enrollmentCount,
      averageRating: savedCourse.averageRating,
    });
    await this.messageBroker.publish(courseCreatedEvent);
    return savedCourse;
  }
}
