import type {
  CheckoutItem,
  HandleCheckoutPort,
} from '@core/application/checkout/port/usecase/HandleCheckoutPort';
import type {
  HandleCheckoutUseCase,
  HandleCheckoutUseCaseResult,
} from '@core/application/checkout/usecase/HandleCheckoutUseCase';
import type { CheckoutItemDetails } from '@core/application/checkout/usecase/types/CheckoutItemDetails';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';
import { BadRequestException } from '@eduflux-v2/shared/exceptions/BadRequestException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { CourseServicePort } from '@eduflux-v2/shared/ports/gateway/CourseServicePort';
import type { PaymentServicePort } from '@eduflux-v2/shared/ports/gateway/PaymentServicePort';
import type { SessionServicePort } from '@eduflux-v2/shared/ports/gateway/SessionServicePort';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { envVariables } from '@shared/env/envVariables';
import { inject } from 'inversify';

export class HandleCheckoutService implements HandleCheckoutUseCase {
  private readonly plattformFeeRate: number = 0.3;
  constructor(
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(SharedCoreDITokens.CourseService)
    private readonly courseService: CourseServicePort,
    @inject(SharedCoreDITokens.SessionService)
    private readonly sessionService: SessionServicePort,
    @inject(SharedCoreDITokens.PaymentService)
    private readonly paymentService: PaymentServicePort,
  ) {}

  async execute(
    payload: HandleCheckoutPort,
  ): Promise<HandleCheckoutUseCaseResult> {
    const { executor, item } = payload;

    const itemDetails = await this.getItemDetails(item, executor);
    const paymentResponse = await this.paymentService.createPayment({
      userId: executor.id,
      totalAmount: itemDetails.amount,
      instructorId: itemDetails.instructorId,
      platformFee: itemDetails.amount * this.plattformFeeRate,
      instructorRevenue:
        itemDetails.amount - itemDetails.amount * this.plattformFeeRate,
      currency: 'USD',
      type: item.type,
      referenceId: item.itemId,
      cancelUrl: itemDetails.cancelUrl,
      successUrl: itemDetails.successUrl,
      item: {
        title: itemDetails.title,
      },
    });

    return {
      transactionId: paymentResponse.transactionId,
    };
  }

  private async getItemDetails(
    item: CheckoutItem,
    user: AuthenticatedUserDto,
  ): Promise<CheckoutItemDetails> {
    if (item.type === 'course') {
      const course = CoreAssert.notEmpty(
        await this.courseService.getCourse(item.itemId),
        new NotFoundException('Item not found.'),
      );
      return {
        amount: course.price,
        title: course.title,
        image: course.thumbnail,
        instructorId: course.instructor.id,
        successUrl: `${envVariables.COURSE_PAYMENT_SUCCESS_URL}/${course.id}?success=true`,
        cancelUrl: `${envVariables.COURSE_PAYMENT_SUCCESS_URL}/${course.id}?success=false`,
      };
    }
    if (item.type === 'session') {
      const session = await this.sessionService.bookSession({
        slotId: item.itemId,
        userId: user.id,
      });
      const instructor = CoreAssert.notEmpty(
        await this.userService.getUser(session.instructorId),
        new NotFoundException('Instructor not found.'),
      );
      return {
        amount: session.price,
        title: `A session with instructor ${instructor.firstName + ' ' + instructor.lastName}`,
        image: instructor.image,
        instructorId: session.instructorId,
        successUrl: `${envVariables.SESSION_PAYMENT_SUCCESS_URL}/${session.id}?success=true&sessionId=${session.id}&instructor=${instructor.firstName + ' ' + instructor.lastName}&learner=${user.name}&startTime=${session.startTime}&endTime=${session.endTime}`,
        cancelUrl: `${envVariables.SESSION_PAYMENT_SUCCESS_URL}/${session.id}?success=false&sessionId=${session.id}&instructor=${instructor.firstName + ' ' + instructor.lastName}&learner=${user.name}&startTime=${session.startTime}&endTime=${session.endTime}`,
      };
    }
    throw new BadRequestException('Invalid item type.');
  }
}
