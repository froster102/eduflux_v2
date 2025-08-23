import { queryOptions, useQuery } from "@tanstack/react-query";

import { getInstructorProfile } from "../services/instructor";

export const getInstructorProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: [`instructor-${userId}`],
    queryFn: async () => await getInstructorProfile(userId),
    enabled: !!userId,
  });

export function useGetInstructorProfile(userId: string) {
  return useQuery(getInstructorProfileOptions(userId));
}
