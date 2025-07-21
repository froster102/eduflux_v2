import { useQuery } from "@tanstack/react-query";

import { checkUserEnrollment } from "../services/course";

import { useAuthStore } from "@/store/auth-store";

export function useCheckUserEnrollment(courseId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-course-${courseId}-enrollment`],
    queryFn: () => checkUserEnrollment(courseId),
  });
}
