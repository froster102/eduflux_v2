import { useMutation } from '@tanstack/react-query';

import { createStripeChekoutSession } from '@/features/payment/service/payment';

export function useCreateStripeCheckoutSession() {
  return useMutation({
    mutationFn: createStripeChekoutSession,
  });
}
