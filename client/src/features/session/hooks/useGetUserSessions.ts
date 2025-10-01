import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/shared/enums/Role";

import { getUserSessions } from "../services/session";

export function useGetUserSessions(
  queryParmeters?: QueryParmeters & {
    preferedRole: Role.INSTRUCTOR | Role.LEARNER;
  },
) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-bookings`, queryParmeters],
    queryFn: () => getUserSessions(queryParmeters),
  });
}
