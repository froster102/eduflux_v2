import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { GetCoursePort } from '@core/application/course/port/usecase/GetCoursePort';
import { CourseUseCaseDto } from '@core/application/course/usecase/dto/CourseUseCaseDto';
import type { GetCourseUseCase } from '@core/application/course/usecase/GetCourseUseCase';
import type { GetCourseUseCaseResult } from '@core/application/course/usecase/types/GetCourseUseCaseResult';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { EnrollmentStatus } from '@core/domain/enrollment/enum/EnrollmentStatus';
import { inject } from 'inversify';

export class GetCourseService implements GetCourseUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
  ) {}

  async execute(payload: GetCoursePort): Promise<GetCourseUseCaseResult> {
    const { courseId, actor } = payload;

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found.`),
    );

    let isEnrolled = false;

    if (actor) {
      const enrollment = await this.enrollmentRepository.findByUserAndCourseId(
        actor.id,
        courseId,
      );
      if (enrollment) {
        isEnrolled =
          enrollment.status === EnrollmentStatus.COMPLETED ? true : false;
      }
    }

    const courseUseCaseDto = CourseUseCaseDto.fromEntity(course);

    if (
      actor &&
      actor.hasRole(Role.INSTRUCTOR) &&
      actor.id === course.instructor.id
    ) {
      return { ...courseUseCaseDto, isEnrolled };
    }

    if (actor && actor.hasRole(Role.ADMIN)) {
      return course;
    }

    if (course.status !== CourseStatus.PUBLISHED) {
      throw new ForbiddenException(`You are not authorized for this action.`);
    }

    return { ...courseUseCaseDto, isEnrolled };
  }
}
