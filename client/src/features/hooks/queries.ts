import { useQuery } from "@tanstack/react-query";

import { getStudentSession, getUser } from "../learner/services/learner";

export function useGetStudentSessionQuery(queryParams: QueryParams) {
  return useQuery({
    queryKey: ["studentSessions", queryParams],
    queryFn: async () => {
      const response = await getStudentSession(queryParams);

      return response.data;
    },
  });
}

export function useGetUserQuery(userId: string) {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getUser(userId);

      return response.data;
    },
  });
}
