import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

import { getSessions } from "../services/session";

export function useGetSessions(
  queryParmeters: QueryParmeters & { type: "learner" | "instructor" },
) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-bookings`, queryParmeters],
    queryFn: () => getSessions(queryParmeters),
  });
}
