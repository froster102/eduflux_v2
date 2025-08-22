import { useQuery } from "@tanstack/react-query";

import { getSessions } from "../services/session";

import { useAuthStore } from "@/store/auth-store";

export function useGetSessions(
  queryParmeters: QueryParmeters & { type: "learner" | "instructor" },
) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-bookings`, queryParmeters],
    queryFn: () => getSessions(queryParmeters),
  });
}
