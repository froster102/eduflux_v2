import { useQuery } from "@tanstack/react-query";

import { getDataboardData } from "../service/admin-dashboard-service";

export function useGetAdminDataQuery(period?: "weekly" | "monthly") {
  return useQuery({
    queryKey: [period, "admin_dashboard"],
    queryFn: () => getDataboardData(period),
  });
}
