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
import { slugify } from '@shared/utils/slugify';
import { CourseEvents } from '@core/common/events/enum/CourseEvents';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { EventBusPort } from '@core/common/port/message/EventBustPort';
import type { CourseCreatedEvent } from '@core/domain/course/events/CourseCreatedEvent';

export class CreateCourseService implements CreateCourseUseCase {
  constructor(
    @inject(CourseDITokens.UserServiceGateway)
    private readonly userServiceGateway: UserServiceGatewayPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(CourseDITokens.CategoryRepository)
    private readonly categoryRepository: CategoryRepositoryPort,
    @inject(CoreDITokens.EventBus)
    private readonly eventBus: EventBusPort,
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
    await this.eventBus.sendEvent<CourseCreatedEvent>({
      type: CourseEvents.COURSE_CREATED,
      instructorId: savedCourse.instructor.id,
      courseMetadata: {
        id: savedCourse.id,
        title: savedCourse.title,
        thumbnail: savedCourse.thumbnail,
        level: savedCourse.level,
        status: savedCourse.status,
        enrollmentCount: savedCourse.enrollmentCount,
        averageRating: savedCourse.averageRating,
      },
      occuredAt: new Date().toISOString(),
      id: savedCourse.id,
    });
    return savedCourse;
  }
}
