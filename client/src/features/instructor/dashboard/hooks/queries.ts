import { useQuery } from "@tanstack/react-query";

import { getTutorDashbord } from "../services/student-dashboard-service";

export function useGetTutorDashboardQuery(period?: "weekly" | "monthly") {
  return useQuery({
    queryKey: [period, "tutor_dashboard"],
    queryFn: () => getTutorDashbord(period),
  });
}
