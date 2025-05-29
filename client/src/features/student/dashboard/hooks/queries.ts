import { useQuery } from "@tanstack/react-query";

import { getStudentDashbord } from "../services/student-dashboard-service";

export function useGetStudentDashboardQuery(period?: "weekly" | "monthly") {
  return useQuery({
    queryKey: [period, "student_dashboard"],
    queryFn: () => getStudentDashbord(period),
  });
}
