import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

import { getCourseProgress } from "../service/progress";

export function useGetCourseProgress(courseId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-course-${courseId}-progress`],
    queryFn: () => getCourseProgress(courseId),
  });
}
