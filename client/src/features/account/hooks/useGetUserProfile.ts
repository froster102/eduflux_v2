import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "../services/account";

import { useAuthStore } from "@/store/auth-store";

export function useGetUserProfile({ enabled }: { enabled: boolean }) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user!.id}-profile`],
    queryFn: getUserProfile,
    enabled,
  });
}
