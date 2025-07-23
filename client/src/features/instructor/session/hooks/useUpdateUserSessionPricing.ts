import { useMutation } from "@tanstack/react-query";

import { updateUserSessionPricing } from "../services/session";

export function useUpdateUserSessionPricing() {
  return useMutation({
    mutationFn: updateUserSessionPricing,
  });
}
