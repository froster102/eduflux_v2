import { useQuery } from "@tanstack/react-query";

import { getUserProfile, getUserSessions } from "../services/account";

import { useAuthStore } from "@/store/auth-store";

export function useGetUserProfile(userId: string) {
  return useQuery({
    queryKey: [`user-${userId}-profile`],
    queryFn: getUserProfile,
  });
}

export function useGetUserSessions() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user!.id}-sessions`],
    queryFn: getUserSessions,
  });
}
