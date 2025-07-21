import { useQuery } from "@tanstack/react-query";

import { getUserSessions } from "../services/account";

import { useAuthStore } from "@/store/auth-store";

export function useGetUserSessions() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user!.id}-sessions`],
    queryFn: getUserSessions,
  });
}
