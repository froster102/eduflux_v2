import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "@/features/notification/service/notification";

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
}
