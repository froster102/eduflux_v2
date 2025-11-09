import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
} from '@shared/adapters/grpc/generated/payment';

export interface PaymentServicePort {
  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;
}
