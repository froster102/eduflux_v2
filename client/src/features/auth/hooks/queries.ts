import { useQuery } from "@tanstack/react-query";

import { getUserSessions } from "../services/auth-services";

export function useGetUserSessionsQuery() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const sessions = await getUserSessions();

      return sessions.data;
    },
  });
}
