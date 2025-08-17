import { useQuery } from "@tanstack/react-query";

import { getInstructorSessionSettings } from "../services/session";

import { useAuthStore } from "@/store/auth-store";

export function useGetInstructorSessionSettings() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-session-settings`],
    queryFn: getInstructorSessionSettings,
  });
}
