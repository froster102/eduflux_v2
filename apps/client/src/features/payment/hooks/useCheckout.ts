import { useMutation } from '@tanstack/react-query';

import { checkoutItem } from '@/features/payment/service/payment';

export function useCheckout() {
  return useMutation({
    mutationFn: checkoutItem,
  });
}
