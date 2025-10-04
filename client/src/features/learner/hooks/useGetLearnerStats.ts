import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { getLearnerStats } from "@/features/learner/service/learner";

export function useGetLearnerStats() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user:${user?.id}:learner-stats`],
    queryFn: getLearnerStats,
  });
}
