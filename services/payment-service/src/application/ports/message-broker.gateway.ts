import {
  PaymentProvider,
  PaymentPurpose,
} from '@/domain/entities/transaction.entity';

export interface IPaymentEvent {
  type: 'payment.failed' | 'payment.success' | 'payment.cancelled';
  correlationId: string;
  data: {
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
  };
}

export interface IMessageBrokerGatway {
  publish(topic: string, event: IPaymentEvent): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
