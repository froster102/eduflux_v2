import { PaymentPurpose } from '@/domain/entities/transaction.entity';
import { Currency } from '@/shared/constants/currency';
import { IUseCase } from './use-case.interface';

export interface InitiatePaymentInput {
  amount: number;
  currency: Currency;
  payerId: string;
  paymentPurpose: PaymentPurpose;
  metadata: Record<string, any>;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface InitiatePaymentOutput {
  paymentId: string;
  checkoutUrl: string;
}

export interface IInitiatePaymentUseCase
  extends IUseCase<InitiatePaymentInput, InitiatePaymentOutput> {}
