import { useQuery } from "@tanstack/react-query";

import { getCourseProgress } from "../services/progress-services";

export function useGetCourseProgressQuery(courseId: string, userId: string) {
  return useQuery({
    queryKey: [`progress:${courseId}:${userId}`],
    queryFn: async () => {
      return await getCourseProgress(courseId);
    },
  });
}
