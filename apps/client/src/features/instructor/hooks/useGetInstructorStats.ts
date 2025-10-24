import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";
import { getInstructorStats } from "@/features/instructor/services/instructor";

export function useGetInstructorStats() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`instructor-${user!.id}-stats`],
    queryFn: getInstructorStats,
  });
}
