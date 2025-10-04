import {
  PaymentProvider,
  PaymentPurpose,
} from '@/domain/entities/transaction.entity';

export enum PaymentEvents {
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_CANCELLED = 'payment.cancelled',
}

export enum SessionEvents {
  SESSION_CONFIRMED = 'session.confirmed',
  SESSION_UPDATED = 'session.updated',
  SESSION_PAYMENT_SUCCESS = 'session.payment.success',
}

export enum EnrollmentEvents {
  ENROLLMENT_SUCCESS = 'enrollment.success',
  ENROLLMENT_PAYMENT_SUCCESS = 'enrollment.payment.success',
}

export interface PaymentEvent {
  id: string;
  type: PaymentEvents;
  correlationId: string;
  paymentId: string;
  providerPaymentId: string | null;
  paymentProvider: PaymentProvider;
  payerId: string;
  paymentPurpose: PaymentPurpose;
  amount: number;
  currency: string;
  reason?: string;
  metadata: Record<string, any>;
  occurredAt: string;
}

export interface IMessageBrokerGatway {
  publish(topic: string, event: PaymentEvent): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
