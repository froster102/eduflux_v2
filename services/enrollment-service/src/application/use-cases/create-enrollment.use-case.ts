import type { ICourseServiceGateway } from '../ports/course-service.gateway';
import type { IUserServiceGateway } from '../ports/user-service.gateway';
import type { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import type { IPaymentServiceGateway } from '../ports/payment-service.gateway';
import type {
  CreateEnrollmentInput,
  CreateEnrollmentOutput,
  ICreateEnrollmentUseCase,
} from './interface/create-enrollment.interface';
import { Enrollment } from '@/domain/enitites/enrollment.entity';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';
import { v4 as uuidV4 } from 'uuid';
import { imageConfig } from '@/shared/config/image.config';
import { ConflictException } from '../exceptions/conflict.exception';

export class CreateEnrollmentUseCase implements ICreateEnrollmentUseCase {
  constructor(
    @inject(TYPES.EnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
    @inject(TYPES.UserServiceGateway)
    private readonly userServiceGateway: IUserServiceGateway,
    @inject(TYPES.CourseServiceGateway)
    private readonly courseServiceGateway: ICourseServiceGateway,
    @inject(TYPES.PaymentServiceGateway)
    private readonly paymentServiceGateway: IPaymentServiceGateway,
  ) {}

  async execute(
    createEnrollmentInput: CreateEnrollmentInput,
  ): Promise<CreateEnrollmentOutput> {
    const { courseId, userId } = createEnrollmentInput;
    const user = await this.userServiceGateway.getUserDetails(userId);

    if (!user) {
      throw new NotFoundException(`User with ID:${userId} not found.`);
    }

    const course = await this.courseServiceGateway.getCourseDetails(courseId);

    if (!course || course.status !== 'published') {
      throw new NotFoundException('Course not found.');
    }

    const existingEnrollment =
      await this.enrollmentRepository.findUserEnrollmentForCourse(
        user.id,
        course.id,
      );

    if (existingEnrollment && existingEnrollment.status === 'PENDING') {
      throw new ConflictException(
        'Enrollment already exists.',
        `Enrollment already exists.Please wait sometime to complete processing.`,
      );
    }

    if (existingEnrollment && existingEnrollment.status === 'COMPLETED') {
      throw new ConflictException(`Enrollment already exists.`);
    }

    const enrollment = Enrollment.create({ id: uuidV4(), courseId, userId });

    await this.enrollmentRepository.save(enrollment);
    const { checkoutUrl } = await this.paymentServiceGateway.initiatePayment({
      amount: Math.round(course.price! * 100),
      currency: 'USD',
      payerId: user.id,
      paymentPurpose: 'COURSE_ENROLLMENT',
      metadata: {
        name: course.title,
        image: `${imageConfig.IMAGE_BASE_URL}${course.thumbnail}`,
        enrollmentId: enrollment.id,
      },
      successUrl: process.env.PAYMENT_SUCCESS_URL!,
      cancelUrl: process.env.PAYMENT_CANCEL_URL!,
    });

    return { checkoutUrl };
  }
}
