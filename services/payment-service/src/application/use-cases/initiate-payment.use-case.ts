import type { IPaymentRepository } from '@/domain/repositories/transaction.repository';
import type { IStripeGateway } from '../ports/stripe.gateway';
import type {
  IInitiatePaymentUseCase,
  InitiatePaymentInput,
  InitiatePaymentOutput,
} from './interface/initiate-payment.interface';
import { Transaction } from '@/domain/entities/transaction.entity';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { tryCatch } from '@/shared/utils/try-catch';
import { AppErrorCode } from '@/shared/error/error-code';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { ApplicationException } from '../exceptions/application.exception';

export class InitiatePaymentUseCase implements IInitiatePaymentUseCase {
  constructor(
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.StripeGateway)
    private readonly stripeGateway: IStripeGateway,
  ) {}

  async execute(
    initiatePaymentInput: InitiatePaymentInput,
  ): Promise<InitiatePaymentOutput> {
    const {
      amount,
      cancelUrl,
      currency,
      metadata,
      payerId,
      paymentPurpose,
      successUrl,
      customerEmail,
    } = initiatePaymentInput;
    if (amount <= 0) {
      throw new InvalidInputException('Payment amount must be positive');
    }

    const newPayment = Transaction.create(
      amount,
      currency,
      payerId,
      paymentPurpose,
      'STRIPE',
      metadata,
    );

    await this.paymentRepository.save(newPayment);

    const { data: gatewayResponse, error } = await tryCatch(
      this.stripeGateway.createCheckoutSession({
        amount,
        cancelUrl,
        clientReferenceId: newPayment.id,
        currency,
        metadata,
        successUrl,
        customerEmail,
      }),
    );

    if (error) {
      newPayment.markAsFailed('Payment initiation failed.');
      await this.paymentRepository.update(newPayment.id, newPayment);
      throw new ApplicationException(
        `Failed to initiate payment ${error.message}`,
        AppErrorCode.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      checkoutUrl: gatewayResponse.checkoutUrl,
      paymentId: gatewayResponse.paymentId,
    };
  }
}
