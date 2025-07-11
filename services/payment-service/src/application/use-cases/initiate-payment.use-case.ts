import type { IPaymentRepository } from '@/domain/repositories/transaction.repository';
import type { IStripeGateway } from '../ports/stripe.gateway';
import { Currency } from '@/shared/constants/currency';
import { IUseCase } from './interface/use-case.interface';
import {
  Transaction,
  PaymentPurpose,
} from '@/domain/entities/transaction.entity';
import { InvalidInputException } from '../exception/invalid-input.exception';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { tryCatch } from '@/shared/utils/try-catch';
import { ApplicationException } from '../exception/application.exception';
import { AppErrorCode } from '@/shared/error/error-code';

export interface InitiatePaymentInputDto {
  amount: number;
  currency: Currency;
  payerId: string;
  paymentPurpose: PaymentPurpose;
  metadata: Record<string, any>;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface InitiatePaymentOutputDto {
  paymentId: string;
  checkoutUrl: string;
}

export class InitiatePaymentUseCase
  implements IUseCase<InitiatePaymentInputDto, InitiatePaymentOutputDto>
{
  constructor(
    @inject(TYPES.PaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @inject(TYPES.StripeGateway)
    private readonly stripeGateway: IStripeGateway,
  ) {}

  async execute(
    input: InitiatePaymentInputDto,
  ): Promise<InitiatePaymentOutputDto> {
    const {
      amount,
      cancelUrl,
      currency,
      metadata,
      payerId,
      paymentPurpose,
      successUrl,
      customerEmail,
    } = input;
    if (input.amount <= 0) {
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
        AppErrorCode.INTERNAL,
      );
    }

    return {
      checkoutUrl: gatewayResponse.checkoutUrl,
      paymentId: gatewayResponse.paymentId,
    };
  }
}
