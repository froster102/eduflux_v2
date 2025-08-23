import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

import { getSessionSettings } from "../services/session";

export function useGetSessionSettings() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [`user-${user?.id}-session-settings`],
    queryFn: getSessionSettings,
  });
}
