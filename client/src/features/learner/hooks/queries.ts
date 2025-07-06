import { useQuery } from "@tanstack/react-query";

import { getInstructorProfile } from "../services/learner";

export function useGetInstructorProfile(userId: string) {
  return useQuery({
    queryKey: [`instructor-${userId}`],
    queryFn: async () => await getInstructorProfile(userId),
    enabled: !!userId,
  });
}
