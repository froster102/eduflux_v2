import { useQuery } from "@tanstack/react-query";

import { getUserSessionPricing } from "../services/session";

import { useAuthStore } from "@/store/auth-store";

export function useGetUserSessionPricing() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-session-pricing`],
    queryFn: getUserSessionPricing,
  });
}
