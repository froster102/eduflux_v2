import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

import { getUserSessions } from "../services/session";

export function useGetUserSessions(
  queryParmeters: QueryParmeters & { type: "learner" | "instructor" },
) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-bookings`, queryParmeters],
    queryFn: () => getUserSessions(queryParmeters),
  });
}
