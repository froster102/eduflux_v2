import { useQuery } from "@tanstack/react-query";

import { getInstructorScheduleSetting } from "../services/session";

import { useAuthStore } from "@/store/auth-store";

export function useGetInstructorScheduleSetting() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-schedule-setting`],
    queryFn: getInstructorScheduleSetting,
  });
}
