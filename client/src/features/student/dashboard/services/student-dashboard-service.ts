import api from "@/lib/axios";

export async function getStudentDashbord(period?: "weekly" | "monthly") {
  const response = await api.get<DashboardData>(
    `/analytics/students${period ? `?period=${period}` : ""}`,
  );

  return response.data;
}
