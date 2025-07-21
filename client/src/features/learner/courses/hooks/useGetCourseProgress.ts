import { useQuery } from "@tanstack/react-query";

import { getCourseProgress } from "../services/course";

import { useAuthStore } from "@/store/auth-store";

export function useGetCourseProgress(courseId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-course-${courseId}-progress`],
    queryFn: () => getCourseProgress(courseId),
  });
}
