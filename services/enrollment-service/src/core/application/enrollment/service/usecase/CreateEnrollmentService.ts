import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import { CourseNotFoundException } from '@core/application/enrollment/exception/CourseNotFoundException';
import { EnrollmentAlreadyExistsException } from '@core/application/enrollment/exception/EnrollmentAlreadyExistsException';
import { UserNotFoundException } from '@core/application/enrollment/exception/UserNotFoundException';
import type { CourseServicePort } from '@core/application/enrollment/port/gateway/CourseServicePort';
import type { PaymentServicePort } from '@core/application/enrollment/port/gateway/PaymentServicePort';
import type { UserServicePort } from '@core/application/enrollment/port/gateway/UserServicePort';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type { CreateEnrollmentPort } from '@core/application/enrollment/port/usecase/CreateEnrollmentPort';
import type { CreateEnrollmentUseCaseResult } from '@core/application/enrollment/port/usecase/type/CreateEnrollmentUseCaseResult';
import type { CreateEnrollmentUseCase } from '@core/application/enrollment/usecase/CreateEnrollmentUseCase';
import { EnrollmentStatus } from '@core/common/enums/EnrollmentStatus';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { v4 as uuidV4 } from 'uuid';
import { inject } from 'inversify';
import { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import { ImageMetaConfig } from 'src/shared/config/ImageMetaConfig';
import { envVariables } from '@shared/validation/env-variables';

export class CreateEnrollmentService implements CreateEnrollmentUseCase {
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
    @inject(EnrollmentDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(EnrollmentDITokens.CourseService)
    private readonly courseService: CourseServicePort,
    @inject(EnrollmentDITokens.PaymentService)
    private readonly paymentService: PaymentServicePort,
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
      await this.courseService.getCourse(courseId),
      new CourseNotFoundException(courseId),
    );

    const existingEnrollment =
      await this.enrollmentRepository.findUserEnrollmentForCourse(
        user.id,
        course.id,
      );

    if (
      existingEnrollment &&
      existingEnrollment.status === EnrollmentStatus.PENDING
    ) {
      throw new EnrollmentAlreadyExistsException(existingEnrollment.id);
    }

    if (
      existingEnrollment &&
      existingEnrollment.status === EnrollmentStatus.COMPLETED
    ) {
      throw new EnrollmentAlreadyExistsException(`Enrollment already exists.`);
    }

    const enrollment = Enrollment.new({
      id: uuidV4(),
      courseId,
      userId,
      instructorId: course.instructor.id,
    });

    await this.enrollmentRepository.save(enrollment);
    const { checkoutUrl } = await this.paymentService.initiatePayment({
      amount: Math.round(course.price! * 100),
      currency: 'USD',
      payerId: user.id,
      paymentPurpose: 'COURSE_ENROLLMENT',
      metadata: {
        name: course.title,
        image: `${ImageMetaConfig.IMAGE_BASE_URL}${course.thumbnail}`,
        enrollmentId: enrollment.id,
      },
      successUrl: `${envVariables.CLIENT_BASE_URL}/courses/${courseId}`,
      cancelUrl: process.env.PAYMENT_CANCEL_URL!,
    });

    return { checkoutUrl };
  }
}
