export interface InitiatePaymentDto {
  amount: number;
  currency: string;
  payerId: string;
  paymentPurpose: PaymentPurpose;
  metadata: Record<string, any>;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

export interface InitiatePaymentResponseDto {
  paymentId: string;
  checkoutUrl: string;
}

export interface PaymentServicePort {
  initiatePayment(
    initiatePaymentDto: InitiatePaymentDto,
  ): Promise<InitiatePaymentResponseDto>;
}
