import { useQuery } from "@tanstack/react-query";

import { auth } from "@/lib/better-auth/auth";

export function useListUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await auth.admin.listUsers({ query: {} });
    },
  });
}
