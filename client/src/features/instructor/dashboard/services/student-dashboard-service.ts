import api from "@/lib/axios";

export async function getTutorDashbord(period?: "weekly" | "monthly") {
  const response = await api.get<DashboardData>(
    `/analytics/tutors${period ? `?period=${period}` : ""}`,
  );

  return response.data;
}
