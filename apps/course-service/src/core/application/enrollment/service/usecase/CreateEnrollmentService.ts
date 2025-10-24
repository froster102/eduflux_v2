import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import { CourseNotFoundException } from '@core/application/enrollment/exception/CourseNotFoundException';
import { EnrollmentAlreadyExistsException } from '@core/application/enrollment/exception/EnrollmentAlreadyExistsException';
import { UserNotFoundException } from '@core/application/enrollment/exception/UserNotFoundException';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type { CreateEnrollmentPort } from '@core/application/enrollment/port/usecase/CreateEnrollmentPort';
import type { CreateEnrollmentUseCaseResult } from '@core/application/enrollment/port/usecase/type/CreateEnrollmentUseCaseResult';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { v4 as uuidV4 } from 'uuid';
import { inject } from 'inversify';
import { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { EnrollmentStatus } from '@core/domain/enrollment/enum/EnrollmentStatus';
import type { CreateEnrollmentUseCase } from '@core/application/enrollment/usecase/CreateEnrollmentUseCase';
import type { UserServiceGatewayPort } from '@core/application/course/port/gateway/UserServiceGatewayPort';

export class CreateEnrollmentService implements CreateEnrollmentUseCase {
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
    @inject(CourseDITokens.UserServiceGateway)
    private readonly userService: UserServiceGatewayPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(
    payload: CreateEnrollmentPort,
  ): Promise<CreateEnrollmentUseCaseResult> {
    const { courseId, userId } = payload;
    const user = CoreAssert.notEmpty(
      await this.userService.getUser(userId),
      new UserNotFoundException(userId),
    );

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new CourseNotFoundException(courseId),
    );

    const existingEnrollment =
      await this.enrollmentRepository.findUserEnrollmentForCourse(
        user.id,
        course.id,
      );

    if (existingEnrollment) {
      if (existingEnrollment.status === EnrollmentStatus.COMPLETED) {
        throw new EnrollmentAlreadyExistsException(
          `User is already enrolled in course ${course.title}.`,
        );
      }
      if (existingEnrollment.status === EnrollmentStatus.PENDING) {
        return {
          referenceId: existingEnrollment.id,
          item: {
            amount: course.price!,
            title: course.title,
          },
          itemType: 'course',
        };
      }
    }

    const enrollment = Enrollment.new({
      id: uuidV4(),
      courseId,
      learnerId: userId,
      instructorId: course.instructor.id,
      status: EnrollmentStatus.PENDING,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.enrollmentRepository.save(enrollment);

    return {
      referenceId: enrollment.id,
      item: {
        amount: course.price!,
        title: course.title,
      },
      itemType: 'course',
    };
  }
}
