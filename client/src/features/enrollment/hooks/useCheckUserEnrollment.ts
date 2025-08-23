import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

import { checkUserEnrollment } from "../service/enrollment";

export function useCheckUserEnrollment(courseId: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-course-${courseId}-enrollment`],
    queryFn: () => checkUserEnrollment(courseId),
  });
}
